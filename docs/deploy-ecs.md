# ECS deploy workflow

This site is deployed as static files to Alibaba Cloud ECS with Nginx.

Default command:

```bash
npm run deploy:ecs
```

The script does the full production path:

1. `npm run build`
2. `node test/ac-checks.mjs`
3. `rsync dist/` to ECS
4. normalize remote permissions
5. `nginx -t`
6. `systemctl reload nginx`
7. verify key public URLs
8. verify `/llms.txt` is served as `text/plain; charset=utf-8`

Defaults are wired to the current production host:

```text
ECS_SSH_USER=henson-admin
ECS_SSH_HOST=8.153.84.10
ECS_SSH_KEY=~/.ssh/henson_aliyun_ecs
ECS_REMOTE_DIR=/var/www/zhuyawei.com/current
SITE_URL=https://zhuyawei.com
VERIFY_PATHS=/,/blog/,/en/,/logo.svg,/llms.txt
```

Override any value with environment variables:

```bash
ECS_SSH_HOST=1.2.3.4 ECS_SSH_KEY=~/.ssh/another_key npm run deploy:ecs
```

Useful modes:

```bash
npm run deploy:ecs -- --dry-run
npm run deploy:ecs -- --skip-checks
```

Basic traffic stats are read from Nginx access logs without adding any frontend tracker:

```bash
npm run stats:traffic
```

See `docs/traffic-stats.md` for options and log-path overrides.

`www.zhuyawei.com` is handled on the server by Nginx and redirects to the apex domain. The Let's Encrypt certificate for `zhuyawei.com` includes both `zhuyawei.com` and `www.zhuyawei.com`.

The `zhuyawei.com` Nginx server block must include `charset utf-8;` so generated plain-text files such as `/llms.txt` render Chinese correctly in browsers. Without the charset header, browsers may mis-detect the text encoding even though the file bytes are valid UTF-8.
