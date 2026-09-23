#!/usr/bin/env python3
"""One-time, privacy-bounded import of pre-tracker Nginx page requests."""
import argparse
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import gzip
import ipaddress
import json
import os
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
from zoneinfo import ZoneInfo

ZONE = ZoneInfo('Asia/Shanghai')
# First production tracker release. Do not include the overlapping frontend era.
CUTOFF = datetime.fromisoformat('2026-09-23T18:47:00+08:00')
LOG = re.compile(r'^(\S+) \S+ \S+ \[([^\]]+)] "(\S+) (\S+) HTTP/[\d.]+" (\d{3}) \S+ "([^"]*)" "([^"]*)"')
BOT = re.compile(r'bot|spider|crawl|slurp|preview|monitor|uptime|curl|wget|python|httpx|httpclient|go-http-client|node-fetch|facebookexternalhit|semrush|ahrefs|mj12|petal|scrapy|lighthouse', re.I)
DOMAIN = re.compile(r'^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$', re.I)


def log_files(log_dir):
    files = []
    for path in Path(log_dir).glob('access.log*'):
        if re.fullmatch(r'access\.log(?:\.\d+(?:\.gz)?)?', path.name):
            files.append(path)
    return sorted(files)


def read_rows(log_dir):
    for path in log_files(log_dir):
        opener = gzip.open if path.suffix == '.gz' else open
        with opener(path, 'rt', encoding='utf-8', errors='replace') as handle:
            for line in handle:
                match = LOG.match(line)
                if not match:
                    yield None
                    continue
                ip, timestamp, method, target, status, referrer, ua = match.groups()
                try:
                    stamp = datetime.strptime(timestamp, '%d/%b/%Y:%H:%M:%S %z').astimezone(ZONE)
                except ValueError:
                    yield None
                    continue
                yield dict(ip=ip, time=stamp, method=method, target=target,
                           status=status, referrer=referrer, ua=ua)


def page_path(target, pages):
    if not target.startswith('/'):
        return None
    try:
        raw = unquote(urlsplit(target).path)
    except ValueError:
        return None
    if raw.endswith('/index.html'):
        raw = raw[:-10]
    path = raw.rstrip('/') or '/'
    return path if path in pages else None


def source_host(raw):
    if not raw or raw == '-':
        return '直接 / 未知'
    try:
        host = (urlsplit(raw).hostname or '').lower().removeprefix('www.')
    except ValueError:
        return '直接 / 未知'
    return host if DOMAIN.fullmatch(host) and host != 'zhuyawei.com' else '直接 / 未知'


def summarize(rows, pages, cutoff=CUTOFF, file_count=0):
    daily = defaultdict(lambda: dict(pv=0, visitors=set(), article_pv=0, ai_pv=0))
    page = defaultdict(lambda: dict(pv=0, visitors=set()))
    sources = Counter()
    skipped = Counter()
    visitors = set()
    earliest_log = latest_log = earliest_page = latest_page = None
    article_pv = ai_pv = 0
    for row in rows:
        if row is None:
            skipped['malformed'] += 1
            continue
        stamp = row['time']
        if stamp >= cutoff:
            skipped['after_cutoff'] += 1
            continue
        earliest_log = min(earliest_log, stamp) if earliest_log else stamp
        latest_log = max(latest_log, stamp) if latest_log else stamp
        if row['method'] != 'GET' or row['status'] != '200':
            skipped['non_200_get'] += 1
            continue
        path = page_path(row['target'], pages)
        if path is None:
            skipped['non_page_or_unpublished'] += 1
            continue
        if not row['ua'] or row['ua'] == '-' or BOT.search(row['ua']):
            skipped['known_bot_or_unknown_agent'] += 1
            continue
        try:
            ip = ipaddress.ip_address(row['ip'])
        except ValueError:
            skipped['invalid_ip'] += 1
            continue
        if not ip.is_global:
            skipped['non_public_ip'] += 1
            continue
        # IPs and user agents exist only in this process. Output contains counts.
        identity = str(ip)
        day = stamp.date().isoformat()
        visitors.add(identity)
        daily[day]['pv'] += 1
        daily[day]['visitors'].add(identity)
        page[path]['pv'] += 1
        page[path]['visitors'].add(identity)
        sources[source_host(row['referrer'])] += 1
        if re.fullmatch(r'/(?:en/)?blog/[a-z0-9-]+', path):
            article_pv += 1
            daily[day]['article_pv'] += 1
        elif re.fullmatch(r'/(?:en/)?ai/[a-z0-9-]+', path):
            ai_pv += 1
            daily[day]['ai_pv'] += 1
        earliest_page = min(earliest_page, stamp) if earliest_page else stamp
        latest_page = max(latest_page, stamp) if latest_page else stamp
    trend = []
    if earliest_log:
        day = earliest_log.date()
        last = min(latest_log.date(), cutoff.date())
        while day <= last:
            counts = daily.get(day.isoformat())
            trend.append(dict(date=day.isoformat(), pv=counts['pv'] if counts else 0,
                              uv=len(counts['visitors']) if counts else 0,
                              article_pv=counts['article_pv'] if counts else 0,
                              ai_pv=counts['ai_pv'] if counts else 0))
            day += timedelta(days=1)
    ranked = sorted((dict(path=path, title=pages[path], pv=value['pv'], uv=len(value['visitors']))
                     for path, value in page.items()), key=lambda item: (-item['pv'], item['path']))
    return dict(source='nginx_access_log', method='GET + HTTP 200 + published page allowlist + known bot filter',
                cutoff=cutoff.isoformat(), coverage=dict(log_first=earliest_log.isoformat() if earliest_log else None,
                log_last=latest_log.isoformat() if latest_log else None,
                page_first=earliest_page.isoformat() if earliest_page else None,
                page_last=latest_page.isoformat() if latest_page else None,
                files=file_count, days=len(trend)),
                pv=sum(value['pv'] for value in daily.values()), uv=len(visitors),
                article_pv=article_pv, ai_pv=ai_pv,
                daily=trend, pages=ranked[:30], sources=sources.most_common(15),
                excluded=dict(skipped))


def generate(log_dir, pages, cutoff=CUTOFF):
    return summarize(read_rows(log_dir), pages, cutoff, len(log_files(log_dir)))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--logs', required=True)
    parser.add_argument('--pages', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = generate(args.logs, json.loads(Path(args.pages).read_text()))
    output = Path(args.output)
    temp = output.with_suffix('.tmp')
    temp.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')))
    os.chmod(temp, 0o640)
    temp.replace(output)
    print('Historical import complete:', result['coverage']['days'], 'calendar days,',
          result['pv'], 'cleaned page requests,', result['coverage']['files'], 'log files.')
