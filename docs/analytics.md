# 私有站点分析

## 当前状态

2026-09-23：Henson 明确授权后已部署到生产环境。看板地址为 `https://zhuyawei.com/analytics/`，使用本人手动配置的独立账号密码。公网未登录 401，定时汇总运行正常；Henson 已确认使用本人设置的账号密码成功登录。历史服务端访问数据已单独回填到看板。

## 架构

- 公共站点仍为 Astro 静态文件，不添加应用后端、数据库、第三方 SDK、CDN 或运行时依赖。
- `public/site-events.js` 为两种语言的可索引页面提供轻量前端埋点。只在 `zhuyawei.com` 运行；忽略本地预览、自动化浏览器、DNT/GPC 和本浏览器主动排除设置。
- 同源 `GET /_events` 接收事件。Nginx 检查来源标记、方法、URI 大小，限流后用内容阶段的 `empty_gif` 返回；只将成功事件写入专用 JSON 日志。不能用 rewrite 阶段的 `return 204` 替代，否则限流不会执行。
- Python 标准库脚本每分钟扫描保留日志并生成聚合 JSON。systemd oneshot 限制 160 MB 内存、25% CPU 和 45 秒执行时间；故障时保留上次成功数据，看板明确显示超时状态。
- 看板、CSS、JS 和 JSON 都在站点 `dist/` 之外，由 Nginx `location ^~ /analytics/` 整体 Basic Auth 保护。只读 HTTPS 地址；不允许无密码分享。`noindex` 只是补充，密码才是访问控制。
- 没有额外常驻服务或监听端口。账号和密码均由本人在终端隐藏输入；本机和服务器仅保存账号及加盐密码哈希，不保存明文密码，也不打印账号、密码或哈希。

## 事件及口径

| 事件 | 触发条件 | 目标字段 |
| --- | --- | --- |
| `pageview` | 页面首次在前台可见 | 无 |
| `read_50` | 文章正文阅读深度 ≥50%，前台可见 ≥30 秒 | 无 |
| `read_90` | 正文深度 ≥90%，前台可见 ≥60 秒 | 无 |
| `contact_intent` | 点击站内联系页入口 | 无 |
| `contact_click` | 邮箱、个人 LinkedIn 或个人 GitHub 主页 | `email` / `linkedin` / `github` |
| `repo_click` | 点击 GitHub 仓库 | `/owner/repo`，不含参数 |
| `outbound_click` | 其他 HTTP(S) 外链 | 仅域名 |
| `language_switch` | 中英文切换 | `zh` / `en` |

每个页面生命周期生成随机 view ID，不跨页保存。相同浏览内同类同目标事件去重。汇总只接受构建产物中已发布的路由；动作必须关联同一页面浏览，阅读事件也验证最低时间。点击数表示发生该意图的浏览次数，不是重复按按钮的次数。阅读时间是页面前台可见时间，不是实际专注、读完或理解的证明。

看板支持今天、7/30/90 天（上海时区），包含浏览量、访客估算、文章浏览、联系点击、每日趋势、内容排行、阅读深度、来源域名、设备、语言和事件。

UV 在所选区间按 IP + User-Agent 去重，**不是各日 UV 相加**，也不是真实身份人数。共用网络可能少算，网络或浏览器改变可能多算。中英文路径分开排名。点击和阅读归于其父页面浏览所在的日期区间。

## 数据边界

- 不设置访客 Cookie、不保存持久访客标识、不上传完整来源 URL、页面查询参数/片段、邮件地址、链接文字或外链查询参数。
- 原始 Nginx 事件日志含 IP 和 User-Agent，用于机器人过滤及访客估算；只在服务器受限日志目录，永不放入看板数据。进程内使用散列键进行去重，输出仅含汇总数字及允许的维度。
- 原始日志每日轮转，最多保留 90 个归档；配置 10 MB `maxsize`（随系统 logrotate 调度检查，非实时硬上限）。汇总最多查询最近 90 天；若发生额外大小轮转，实际覆盖可能短于 90 天。“保留数据起点”标示现有数据覆盖。
- 历史普通 access.log 在 D15 下单独清洗并一次性回填到私有看板的“历史服务端访问”区域；不写入前端行为数据。`npm run stats:traffic` 仍可独立查询原始日志。
- 公开采集接口无法证明上报者是真人。来源校验、限流、已知机器人过滤和路由白名单降低噪音，但不构成反欺诈系统。禁 JS、浏览器隐私设置、拦截扩展和网络失败也会漏计。
- 看板的“排除本浏览器”按钮设置同源 localStorage 中的布尔开关；它不是访客 ID。各浏览器需分别设置。看板自身不埋点。

## 验证

```bash
npm run build
node test/ac-checks.mjs
npm run analytics:test
npm run analytics:prepare
npm run analytics:preview # 127.0.0.1:4388/analytics/，本地空数据，无公网监听
```

已通过：101 项站点 AC、15 项针对去重、跨天 UV、隐私字段、阅读时间、日志轮转、隐藏凭据输入和历史回填的自动化测试；Chromium 下中英文首页和文章、看板在 1280/390px 无溢出；真实浏览器产生访问、阅读阈值和仓库点击事件，且本地预览不污染生产。

其中历史回填有 3 项 Python 测试。`test/analytics_nginx.py` 可在 ECS 的临时目录运行，使用独立 `127.0.0.1:18888` Nginx。2026-09-23 隔离验证通过：未登录/错误密码 401；正确密码访问页面和数据 200；JS/CSS/JSON 及编码路径无认证绕过；错误来源、方法、过大 URI 被拒绝；批量请求实际出现 429；真实 Nginx 日志正确去重为一条浏览。测试退出后已删除临时实例和文件。此结果不是生产上线证明。

## 手动配置账号密码

在你自己的项目终端运行：

```bash
npm run analytics:configure
```

账号、密码、确认密码均隐藏输入，不回显字符，不打印内容。账号可自定义为 1–32 位英文字母、数字、点、下划线或短横线（首位字母或数字）；密码至少 8 个字符、最多 256 字节。两次不一致、取消或无法隐藏输入时不保存。拒绝管道输入，防止降级为明文回显。

本机配置文件是 `~/.config/henson-homepage/analytics-credentials.json`，权限 0600，仅含 `username` 和 `passwordHash`。原密码只短暂存在于交互配置进程内，通过子进程 stdin 交给 OpenSSL；不会写入文件、命令参数或输出。请自己保存原密码，例如放入密码管理器；本机哈希不能恢复原密码。不需要把密码发到聊天。

重新运行此命令可以设置新的账号密码。保存只改变本机配置；下一次明确授权的部署才会同步服务器。部署不再自动生成凭据；发现旧的明文格式时会拒绝并要求重新配置。

## 授权后的部署

```bash
npm run analytics:deploy -- --apply
```

流程：检查手动配置的哈希凭据 → 重建与验收 → 准备路由清单/私有静态资产 → SSH 上传临时目录 → 安装受限账号、日志、定时任务及 Nginx 配置 → 首次汇总 → `nginx -t` 与 reload → 运行已有静态站部署 → 检查未登录访问被拒绝及汇总更新 → 本人手动登录验收。

服务器只存 `/etc/nginx/homepage-analytics.htpasswd` 的账号及 SHA-512 crypt 加盐哈希，权限 0640。脚本通过 SSH stdin 同步账号和哈希，不传输明文密码，不写入命令参数或输出。因部署进程不持有明文密码，真实账号登录由本人在浏览器完成；自动化只验证未登录 401 和服务汇总新鲜度。Basic Auth 使用浏览器原生账号密码弹窗；浏览器可能缓存凭据，没有网页注销会话。优先使用个人浏览器配置文件，关闭浏览器结束凭据缓存。

服务器路径：

| 用途 | 路径 |
| --- | --- |
| 汇总代码 / 路由清单 | `/opt/homepage-analytics/` |
| 私有看板 / data.json | `/var/lib/homepage-analytics/dashboard/` |
| 原始事件日志 | `/var/log/homepage-analytics/events.log*` |
| HTTP 级 Nginx 配置 | `/etc/nginx/conf.d/homepage-analytics.conf` |
| 站点级 Nginx 配置 | `/etc/nginx/snippets/homepage-analytics.conf` |
| 汇总服务 / 定时器 | `homepage-analytics.service` / `.timer` |
| 部署前备份 | `/var/backups/homepage-analytics/<timestamp>/` |

后续 `npm run deploy:ecs` 会在已安装分析服务时同步构建路由清单并触发汇总，避免新文章被白名单漏掉；没有安装时保持旧行为。看板源码/运维配置修改用独立分析部署命令更新。脚本保留原站点配置，并补齐仓库既定的 `charset utf-8` 要求。

生产验收必须补做：验证公网未登录 401 / 正确密码 200；用本人的浏览器访问文章产生事件，检查下一次汇总；确认日志目录无公网路径；确认定时器和日志轮转生效。测试上报与真实访客要有明确区分，不凭空填充展示数据。

## 运维及回滚

```bash
sudo systemctl status homepage-analytics.timer
sudo journalctl -u homepage-analytics.service -n 30 --no-pager
sudo logrotate --debug /etc/logrotate.d/homepage-analytics
```

新增服务首次失败时，安装脚本会恢复之前的站点配置和替换文件；不会删除已有统计数据。备份目录记录 sites-available 和 sites-enabled 两份 `zhuyawei.com` 原配置及 `previous-files.json` 文件内容，便于完整恢复；部署失败时同时恢复旧认证文件；首次安装失败则移除新认证文件。

紧急关闭：在 sites-enabled 与 sites-available 的 apex TLS server 中移除 `include /etc/nginx/snippets/homepage-analytics.conf;`，`sudo nginx -t` 成功后 reload；然后 `sudo systemctl disable --now homepage-analytics.timer`。看板和采集入口会变为普通静态 404，分析故障不阻断页面浏览。随后移除 `BaseLayout.astro` 的 Analytics 组件并走正常站点发布。原始日志及聚合数据保留，待明确授权再清理。

更新回滚应依据对应部署备份恢复配置/代码并重跑 `daemon-reload` 和 `nginx -t`；不要将旧整份站点配置盲目覆盖到已经有后续修改的服务器。

实现参考：[Nginx 日志模块](https://nginx.org/en/docs/http/ngx_http_log_module.html)、[Nginx Basic Auth](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)。

## 生产上线验收（2026-09-23）

- 第一次安装后看板返回 404：服务器 `sites-enabled/zhuyawei.com` 是独立副本，不是 `sites-available` 的软链接。已修复安装脚本，同步修改并备份两份站点配置；第二次部署成功。
- 本地构建 45 页面，101/101 AC，12/12 分析测试通过。中文/英文首页及 `site-events.js` 公网内容 SHA-1 与本地构建完全一致。
- 公网首页、英文首页、脚本返回 200；未登录看板、JSON、JS、CSS 全部 401。采集入口有效请求返回 200；验收请求使用 `Homepage-Monitor` User-Agent，被汇总过滤，不计入流量。
- `nginx -t` 通过，`homepage-analytics.timer` enabled/active，汇总 JSON 包含 1/7/30/90 天窗口且仅数秒前刷新；`logrotate --debug` 验证配置有效。
- 因原始密码仅在 Henson 手中，自动验收未尝试真实登录；Henson 随后已确认浏览器登录和看板可见。

## D15 — 历史服务端访问单独回填

`ops/analytics/backfill.py` 一次性读取服务器保留的 Nginx `access.log*` 与 gzip 轮转文件。只接受 2026-09-23 18:47:00（Asia/Shanghai，首个前端埋点版本上线前）之前的 HTTP 200 GET、构建路由清单里的已发布页面，排除静态资源/探测路径、已知机器人、缺失/无效 UA 及非公网 IP。路径去掉查询参数并统一尾斜杠；来源只留域名。

汇总 JSON 只保存每天和页面的请求数、全区间与每日按 IP 去重的访客估算、文章/AI 详情请求、来源域名、日志覆盖与各类剔除数量。原始 IP、UA、URL 参数不进入看板文件。部分历史已发布但现已下线的页面不在当前路由清单里，无法可靠归类，因此也被排除。已知机器人过滤是启发式方法，剩余请求不能保证全部来自真人。

历史数据保存为 `/var/lib/homepage-analytics/dashboard/history.json`，与看板的 `data.json` 同受 Basic Auth 保护。首次部署 D15 时生成一次，不随每分钟任务重新扫描，也不因原始日志之后轮转而丢失。后续新日志继续由原有服务端 CLI 查询；看板历史区间固定在埋点上线前，不与前端访问量相加。截止日只覆盖当日 18:47 前，属于不完整的一天。

2026-09-23 已上线：保留 87 份日志，覆盖 2026-06-29 至 2026-09-23 18:47 前；解析、清洗和 JSON 隐私检查通过。看板在 1280px 和 390px 用明确标注的本地测试样本检查过，未将样本写入生产。历史 JSON 在现有 Basic Auth 路径下，公网未登录 401；Nginx 的文件读取身份已验证可读取。首次部署的最终验收使用了错误的系统身份，导致脚本返回失败，但安装及导入均完成；已修复脚本并重新验证。
