# Traffic Stats

This legacy CLI reads raw Nginx access logs for traffic inspection. Since D14, the public site also has first-party browser events. The private dashboard keeps the two sources separate; see [analytics.md](analytics.md).

## What It Measures

- Page-like requests: known route patterns after static assets and random probe paths are filtered. The CLI headline includes status codes other than 200; use the status breakdown and 200-only content sections when discussing readership.
- Unique visitors: an approximate count based on unique client IPs in the selected window.
- Top pages: most requested page paths.
- Referrer domains: external domains that sent traffic.
- Status codes: response status distribution for page requests.
- Daily page views: page views grouped by day.
- AI/search crawlers: requests from OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot, Baiduspider, Bytespider, Applebot, and their user-triggered fetch variants when identifiable.
- Crawler pages: which site routes each identified crawler requested.
- Crawler status codes: whether those crawler requests resolved successfully or hit errors.
- AI referrers: visits referred by ChatGPT, Perplexity, Claude, Microsoft Copilot, or Gemini domains.

This is enough for baseline readership and route popularity. It is not suitable for button clicks, scroll depth, dwell time, funnel analysis, or per-user behavior tracking.

## Run

```bash
npm run stats:traffic
```

By default, the script reuses the production ECS connection defaults from the deploy workflow and reads:

```text
/var/log/nginx/access.log /var/log/nginx/access.log.1 /var/log/nginx/access.log.*.gz
```

Useful options:

```bash
npm run stats:traffic -- --days=7
npm run stats:traffic -- --since=2026-07-01 --until=2026-07-06
npm run stats:traffic -- --limit=20
npm run stats:traffic -- --include-bots
```

Crawler and AI-referrer sections are shown by default. `--include-bots` only decides whether crawler requests are also folded into the headline page-view and IP-based visitor totals.

If the Nginx log path differs on the ECS machine, override it without changing the script:

```bash
TRAFFIC_LOG_PATHS="/var/log/nginx/zhuyawei.com.access.log*" npm run stats:traffic
```

The same `ECS_SSH_USER`, `ECS_SSH_HOST`, and `ECS_SSH_KEY` environment variables used by `npm run deploy:ecs` can also override the remote connection.

## Boundary

D14 authorized first-party frontend behavior events. Historical backfill in the private dashboard uses only HTTP 200 GETs to currently published routes, filters known bots and remains a distinct metric from browser events. Do not add the two sources together.
