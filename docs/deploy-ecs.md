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

Defaults are wired to the current production host:

```text
ECS_SSH_USER=root
ECS_SSH_HOST=8.153.84.10
ECS_SSH_KEY=~/.ssh/henson_aliyun_ecs
ECS_REMOTE_DIR=/var/www/zhuyawei.com/current
SITE_URL=https://zhuyawei.com
VERIFY_PATHS=/,/blog/,/en/,/logo.svg
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

`www.zhuyawei.com` is handled on the server by Nginx and redirects to the apex domain. The Let's Encrypt certificate for `zhuyawei.com` includes both `zhuyawei.com` and `www.zhuyawei.com`.
