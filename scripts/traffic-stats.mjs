#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

const env = process.env;
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const config = {
  days: Number(args.days || env.TRAFFIC_DAYS || 30),
  limit: Number(args.limit || env.TRAFFIC_LIMIT || 10),
  includeBots: Boolean(args.includeBots),
  since: args.since || env.TRAFFIC_SINCE || '',
  until: args.until || env.TRAFFIC_UNTIL || '',
  file: args.file || '',
  stdin: Boolean(args.stdin),
  sshUser: env.ECS_SSH_USER || 'root',
  sshHost: env.ECS_SSH_HOST || '8.153.84.10',
  sshKey: expandHome(env.ECS_SSH_KEY || '~/.ssh/henson_aliyun_ecs'),
  logPaths: env.TRAFFIC_LOG_PATHS || '/var/log/nginx/access.log /var/log/nginx/access.log.1 /var/log/nginx/access.log.*.gz',
};

main();

function main() {
  if (!Number.isFinite(config.days) || config.days < 1) fail('TRAFFIC_DAYS / --days must be a positive number.');
  if (!Number.isFinite(config.limit) || config.limit < 1) fail('TRAFFIC_LIMIT / --limit must be a positive number.');

  const lines = readLogs().split(/\r?\n/);
  const rows = lines.map(parseLogLine).filter(Boolean);
  const stats = summarize(rows);
  printSummary(stats);
}

function readLogs() {
  if (config.stdin) return readFileSync(0, 'utf8');
  if (config.file) return readFileSync(config.file, 'utf8');

  if (!existsSync(config.sshKey)) fail(`SSH key not found: ${config.sshKey}`);
  const remoteCommand = [
    'set -o pipefail',
    `for f in ${config.logPaths}; do`,
    '  [ -f "$f" ] || continue;',
    '  case "$f" in',
    '    *.gz) gzip -cd "$f" ;;',
    '    *) cat "$f" ;;',
    '  esac;',
    'done',
  ].join('\n');

  const result = spawnSync('ssh', [
    '-i',
    config.sshKey,
    '-o',
    'BatchMode=yes',
    `${config.sshUser}@${config.sshHost}`,
    remoteCommand,
  ], {
    encoding: 'utf8',
    maxBuffer: 200 * 1024 * 1024,
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    fail(`Could not read remote Nginx logs.${detail ? `\n${detail}` : ''}`);
  }
  return result.stdout;
}

function summarize(rows) {
  const maxDate = rows.reduce((latest, row) => row.date > latest ? row.date : latest, new Date(0));
  const end = config.until ? endOfLocalDay(config.until) : (maxDate.getTime() ? maxDate : new Date());
  const start = config.since ? startOfLocalDay(config.since) : new Date(end.getTime() - (config.days - 1) * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);

  const pages = new Map();
  const refs = new Map();
  const status = new Map();
  const byDay = new Map();
  const crawlers = new Map();
  const crawlerPages = new Map();
  const crawlerStatuses = new Map();
  const aiReferrers = new Map();
  const visitors = new Set();
  const skipped = { outsideWindow: 0, assets: 0, bots: 0, nonPage: 0 };

  for (const row of rows) {
    if (row.date < start || row.date > end) {
      skipped.outsideWindow++;
      continue;
    }

    const url = normalizePath(row.path);
    if (!url || row.method === 'POST') {
      skipped.nonPage++;
      continue;
    }
    if (isAsset(url)) {
      skipped.assets++;
      continue;
    }
    const pagePath = normalizeSitePage(url);
    if (!pagePath) {
      skipped.nonPage++;
      continue;
    }
    const crawler = classifyCrawler(row.userAgent);
    const bot = Boolean(crawler) || isBot(row.userAgent);
    if (bot) {
      increment(crawlers, crawler || 'Other bot / monitor');
      increment(crawlerPages, `${crawler || 'Other bot / monitor'} · ${pagePath}`);
      increment(crawlerStatuses, `${crawler || 'Other bot / monitor'} · ${row.status}`);
    }
    if (!config.includeBots && bot) {
      skipped.bots++;
      continue;
    }

    const day = formatDay(row.date);
    increment(byDay, day);
    increment(pages, pagePath);
    increment(status, row.status);
    visitors.add(row.ip);

    const ref = referrerHost(row.referrer);
    if (ref) {
      increment(refs, ref);
      if (isAIReferrer(ref)) increment(aiReferrers, ref);
    }
  }

  return {
    start,
    end,
    pageViews: sum(byDay),
    uniqueVisitors: visitors.size,
    pages: topEntries(pages),
    referrers: topEntries(refs),
    status: topEntries(status),
    byDay: topEntries(byDay, byDay.size || 1),
    crawlers: topEntries(crawlers),
    crawlerPages: topEntries(crawlerPages),
    crawlerStatuses: topEntries(crawlerStatuses),
    aiReferrers: topEntries(aiReferrers),
    skipped,
  };
}

function parseLogLine(line) {
  if (!line.trim()) return null;

  const match = line.match(/^(\S+) \S+ \S+ \[([^\]]+)] "(\S+) ([^"]*?)(?: HTTP\/[\d.]+)?" (\d{3}) \S+ "([^"]*)" "([^"]*)"/);
  if (!match) return null;

  const [, ip, rawDate, method, rawPath, status, referrer, userAgent] = match;
  const date = parseNginxDate(rawDate);
  if (!date) return null;

  return {
    ip,
    date,
    method,
    path: rawPath,
    status,
    referrer,
    userAgent,
  };
}

function parseNginxDate(value) {
  const match = value.match(/^(\d{2})\/([A-Za-z]{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})$/);
  if (!match) return null;
  const [, day, mon, year, hour, minute, second, zone] = match;
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(mon);
  if (month < 0) return null;

  const utc = Date.UTC(Number(year), month, Number(day), Number(hour), Number(minute), Number(second));
  const sign = zone.startsWith('-') ? -1 : 1;
  const offsetMinutes = sign * (Number(zone.slice(1, 3)) * 60 + Number(zone.slice(3, 5)));
  return new Date(utc - offsetMinutes * 60 * 1000);
}

function normalizePath(rawPath) {
  try {
    const parsed = rawPath.startsWith('http://') || rawPath.startsWith('https://')
      ? new URL(rawPath)
      : new URL(rawPath, 'https://zhuyawei.com');
    let pathname = decodeURI(parsed.pathname);
    if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    return pathname.replace(/\/index\.html$/, '/');
  } catch {
    return '';
  }
}

function isAsset(pathname) {
  return /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mp4|pdf|png|svg|txt|webmanifest|webp|xml|woff2?)$/i.test(pathname);
}

function normalizeSitePage(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const localized = '(?:en/)?';
  const slug = '[a-z0-9-]+';
  const patterns = [
    /^\/$/,
    /^\/en$/,
    new RegExp(`^/${localized}(?:about|blog|ai|contact)$`),
    new RegExp(`^/${localized}(?:blog|ai)/${slug}$`),
  ];

  if (!patterns.some((pattern) => pattern.test(clean))) return '';
  return clean === '/' ? '/' : `${clean}/`;
}

function isBot(userAgent) {
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|ia_archiver|monitor|uptime|curl|wget|python-requests/i.test(userAgent);
}

function classifyCrawler(userAgent) {
  const crawlers = [
    ['OAI-SearchBot', /OAI-SearchBot/i],
    ['ChatGPT-User', /ChatGPT-User/i],
    ['GPTBot', /GPTBot/i],
    ['ClaudeBot', /ClaudeBot/i],
    ['Claude-User', /Claude-User/i],
    ['PerplexityBot', /PerplexityBot/i],
    ['Perplexity-User', /Perplexity-User/i],
    ['Googlebot', /Googlebot/i],
    ['Bingbot', /bingbot|bingpreview/i],
    ['Baiduspider', /Baiduspider/i],
    ['Bytespider', /Bytespider/i],
    ['Applebot', /Applebot/i],
  ];
  return crawlers.find(([, pattern]) => pattern.test(userAgent))?.[0] || '';
}

function referrerHost(referrer) {
  if (!referrer || referrer === '-') return '';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    return host === 'zhuyawei.com' ? '' : host;
  } catch {
    return '';
  }
}

function isAIReferrer(host) {
  return /^(?:chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com)$/.test(host);
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function sum(map) {
  return [...map.values()].reduce((total, value) => total + value, 0);
}

function topEntries(map, limit = config.limit) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, limit);
}

function startOfLocalDay(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) fail(`Invalid date: ${value}`);
  return date;
}

function endOfLocalDay(value) {
  const date = new Date(`${value}T23:59:59.999`);
  if (Number.isNaN(date.getTime())) fail(`Invalid date: ${value}`);
  return date;
}

function formatDay(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function printSummary(stats) {
  console.log(`Traffic summary (${formatDay(stats.start)} to ${formatDay(stats.end)})`);
  console.log('');
  console.log(`Page views:       ${stats.pageViews}`);
  console.log(`Unique visitors:  ${stats.uniqueVisitors} (IP-based estimate)`);
  console.log('');
  printTable('Top pages', stats.pages);
  printTable('Referrer domains', stats.referrers);
  printTable('AI referrer domains', stats.aiReferrers);
  printTable('AI / search crawlers', stats.crawlers);
  printTable('Crawler pages', stats.crawlerPages);
  printTable('Crawler status codes', stats.crawlerStatuses);
  printTable('Status codes', stats.status);
  printTable('Daily page views', stats.byDay);
  console.log('Skipped');
  console.log(`  assets:         ${stats.skipped.assets}`);
  console.log(`  bots:           ${stats.skipped.bots}${config.includeBots ? ' (included by flag)' : ''}`);
  console.log(`  non-page:       ${stats.skipped.nonPage}`);
  console.log(`  outside window: ${stats.skipped.outsideWindow}`);
}

function printTable(title, entries) {
  console.log(title);
  if (!entries.length) {
    console.log('  (none)');
    console.log('');
    return;
  }
  for (const [label, count] of entries) {
    console.log(`  ${String(count).padStart(5, ' ')}  ${label}`);
  }
  console.log('');
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (const arg of rawArgs) {
    if (arg === '--help' || arg === '-h') parsed.help = true;
    else if (arg === '--stdin') parsed.stdin = true;
    else if (arg === '--include-bots') parsed.includeBots = true;
    else if (arg.startsWith('--days=')) parsed.days = arg.slice('--days='.length);
    else if (arg.startsWith('--limit=')) parsed.limit = arg.slice('--limit='.length);
    else if (arg.startsWith('--since=')) parsed.since = arg.slice('--since='.length);
    else if (arg.startsWith('--until=')) parsed.until = arg.slice('--until='.length);
    else if (arg.startsWith('--file=')) parsed.file = arg.slice('--file='.length);
    else fail(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function expandHome(value) {
  return value.startsWith('~/') ? path.join(homedir(), value.slice(2)) : value;
}

function printHelp() {
  console.log(`Usage: npm run stats:traffic -- [options]

Reads Nginx access logs and reports basic page-view statistics. By default it
connects to the production ECS host with the same ECS_SSH_* defaults as deploy.

Options:
  --days=30          Rolling window, ending at the newest log row
  --since=YYYY-MM-DD Fixed start date
  --until=YYYY-MM-DD Fixed end date
  --limit=10         Rows per top-N section
  --include-bots     Include common crawlers and monitors in PV / UV totals
  --file=PATH        Read a local access log
  --stdin            Read access log lines from stdin

Environment:
  TRAFFIC_LOG_PATHS  Remote log paths/globs to read
  TRAFFIC_DAYS       Default --days value
  TRAFFIC_LIMIT      Default --limit value

Crawler and AI-referrer sections are always reported. --include-bots only
controls whether crawler requests also count toward the human-facing totals.`);
}

function fail(message) {
  console.error(`[traffic-stats] ${message}`);
  process.exit(1);
}
