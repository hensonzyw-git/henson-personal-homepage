#!/usr/bin/env python3
"""Private Nginx event logs -> atomic aggregate JSON; Python standard library only."""
import argparse
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import gzip
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
from urllib.parse import unquote
from zoneinfo import ZoneInfo

ZONE = ZoneInfo('Asia/Shanghai')
EVENTS = {'pageview', 'read_50', 'read_90', 'contact_click', 'repo_click',
          'outbound_click', 'language_switch', 'contact_intent'}
BOT = re.compile(r'bot|spider|crawler|headless|curl|wget|python|preview|lighthouse|monitor', re.I)
UUID = re.compile(r'^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$')
HOST = re.compile(r'^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$', re.I)


def normalized(raw, pages, now):
    """Discard malformed/unknown input before it can affect a metric or label."""
    if not isinstance(raw, dict) or raw.get('status') != '200':
        return None
    if raw.get('method') != 'GET' or raw.get('origin') != 'https://zhuyawei.com/':
        return None
    if raw.get('marker') != '1':
        return None
    event = raw.get('event')
    if event not in EVENTS:
        return None
    page = unquote(raw.get('page', '')).rstrip('/') or '/'
    if page not in pages or not UUID.fullmatch(raw.get('view', '')):
        return None
    stamp = datetime.fromisoformat(raw['time']).astimezone(ZONE)
    if stamp > now + timedelta(minutes=1) or stamp.date() < now.date() - timedelta(days=89):
        return None
    ua = raw.get('ua', '')
    if not ua or len(ua) > 512 or BOT.search(ua):
        return None
    ip = str(ipaddress.ip_address(raw['ip']))
    visitor = hashlib.sha256((ip + '\0' + ua).encode()).hexdigest()
    ref = unquote(raw.get('ref', '')).lower()
    if ref in ('zhuyawei.com', 'www.zhuyawei.com') or not HOST.fullmatch(ref):
        ref = '直接 / 未知'
    target = unquote(raw.get('target', ''))
    if event == 'contact_click' and target not in ('email', 'github', 'linkedin'):
        return None
    if event == 'language_switch' and target not in ('zh', 'en'):
        return None
    if event == 'outbound_click' and not HOST.fullmatch(target):
        return None
    if event == 'repo_click' and not re.fullmatch(r'/[\w.-]+/[\w.-]+', target):
        return None
    if event in ('read_50', 'read_90') and not re.match(r'^/(?:en/)?blog/[^/]+$', page):
        return None
    if event in ('pageview', 'read_50', 'read_90', 'contact_intent'):
        target = ''
    device = '移动端' if re.search(r'Mobile|Android|iPhone|iPad', ua, re.I) else '桌面端'
    return dict(event=event, page=page, visitor=visitor, view=raw['view'],
                time=stamp, ref=ref, target=target, device=device)


def summarize(rows, pages, now):
    # One view is an ephemeral page-load ID; it is never a cross-page visitor ID.
    views = {}
    actions = {}
    for row in rows:
        key = (row['visitor'], row['view'], row['page'])
        if row['event'] == 'pageview':
            if key not in views or row['time'] < views[key]['time']:
                views[key] = row
        else:
            action = (*key, row['event'], row['target'])
            if action not in actions or row['time'] < actions[action]['time']:
                actions[action] = row
    windows = {}
    for days in (1, 7, 30, 90):
        start = now.date() - timedelta(days=days - 1)
        selected = {key: row for key, row in views.items() if row['time'].date() >= start}
        visitors = set()
        per_page = defaultdict(lambda: dict(pv=0, visitors=set(), read_50=0, read_90=0))
        daily = {str(start + timedelta(days=i)): dict(pv=0, visitors=set()) for i in range(days)}
        refs, devices, languages, counts = (Counter() for _ in range(4))
        for row in selected.values():
            visitors.add(row['visitor'])
            page = per_page[row['page']]
            page['pv'] += 1
            page['visitors'].add(row['visitor'])
            day = daily[str(row['time'].date())]
            day['pv'] += 1
            day['visitors'].add(row['visitor'])
            refs[row['ref']] += 1
            devices[row['device']] += 1
            languages['English' if row['page'].startswith('/en') else '中文'] += 1
        for key, row in actions.items():
            parent = selected.get(key[:3])
            if not parent or row['time'] < parent['time']:
                continue
            elapsed = (row['time'] - parent['time']).total_seconds()
            if row['event'] == 'read_50' and elapsed < 30:
                continue
            if row['event'] == 'read_90' and elapsed < 60:
                continue
            if row['event'].startswith('read_'):
                per_page[row['page']][row['event']] += 1
            counts[(row['event'], row['target'])] += 1
        ranked = []
        for path, values in per_page.items():
            ranked.append(dict(path=path, title=pages[path], pv=values['pv'], uv=len(values['visitors']),
                               read_50=values['read_50'], read_90=values['read_90']))
        windows[str(days)] = dict(
            start=str(start), end=str(now.date()), pv=len(selected), uv=len(visitors),
            article_pv=sum(v['pv'] for p, v in per_page.items() if re.match(r'^/(?:en/)?blog/[^/]+$', p)),
            contact=sum(n for (e, _), n in counts.items() if e == 'contact_click'),
            pages=sorted(ranked, key=lambda p: (-p['pv'], p['path'])),
            daily=[dict(date=d, pv=v['pv'], uv=len(v['visitors'])) for d, v in daily.items()],
            sources=refs.most_common(15), devices=devices.most_common(), languages=languages.most_common(),
            events=[dict(event=e, target=t, count=n) for (e, t), n in counts.most_common(40)])
    return dict(generated_at=now.isoformat(), timezone='Asia/Shanghai',
                first_event=min((r['time'].isoformat() for r in views.values()), default=None), windows=windows)


def generate(log_dir, pages, now):
    def rows():
        for path in sorted(Path(log_dir).glob('events.log*')):
            if not re.fullmatch(r'events\.log(?:\.\d+(?:\.gz)?)?', path.name):
                continue
            opener = gzip.open if path.suffix == '.gz' else open
            # An incomplete final line during a write is discarded and read next run.
            with opener(path, 'rt', encoding='utf-8', errors='replace') as handle:
                for line in handle:
                    try:
                        row = normalized(json.loads(line), pages, now)
                        if row:
                            yield row
                    except (ValueError, KeyError, TypeError, AttributeError, OverflowError):
                        continue
    return summarize(rows(), pages, now)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--logs', required=True)
    parser.add_argument('--pages', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = generate(args.logs, json.loads(Path(args.pages).read_text()), datetime.now(ZONE))
    output = Path(args.output)
    temp = output.with_suffix('.tmp')
    temp.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')))
    os.chmod(temp, 0o640)
    temp.replace(output)
