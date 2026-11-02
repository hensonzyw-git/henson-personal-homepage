# 衣橱后台上线记录｜2026-11-02

状态：**已部署，等待 Henson 登录与真实业务验收**。本次生产探针没有编辑、软删、恢复真实衣物或调用模型／POIZON。

## 固定交付版本

| 仓库 | 功能 PR | 部署代码 SHA |
| --- | --- | --- |
| Wardrobe | [#31](https://github.com/hensonzyw-git/personal-online-wardrobe/pull/31) | `0c4c7a491caf0b0ab03444bdfc116e6d34eb8e18` |
| Homepage | [#2](https://github.com/hensonzyw-git/henson-personal-homepage/pull/2) | `3483f89b626a3157522b7b5492856c92128be393` |

用户授权推送、PR、合并并随后线上验收，范围见 [release gate](../gates/2026-11-02-wardrobe-admin-release.md)。两 PR 可合并且已合并；GitHub 未配置 CI 检查，不把空检查列表称作 CI 通过。本地证据为 operator 187 项、代理 27 项、UI 3 项、构建 51 页、AC 150 项以及前轮真实合成 Nginx／Unix／TCP／浏览器与 HTTP 验收。

## 实际发布

入口：`https://zhuyawei.com/wardrobe-admin/`，沿用 apex 域名、证书和 analytics 的既有本人 Basic Auth 账密。没有新域名，不需要新增 DNS 记录，不改变共享密码文件。

- 衣橱旧 release `b9b5fb277682`，新 release `0c4c7a491caf`。在独立 release 复制已验证依赖环境，使用新环境 Python 安装合并版本 wheel，入口 shebang 已重建并核对，`pip check` 无损坏依赖。逐一比对 wheel 中 65 个包文件与实际安装字节。
- wheel SHA256：`cf80bb15634bf8134a5acb4de09df2c83d0ca0f7a3ef7d9ded7b4b46995bfe8b`；主页 stage archive SHA256：`18bc5b522d6f21311151da612c7f04979d05b7e5693116907d58f4f42de4f5bf`。
- 先保留受保护的 SQLite 一致备份（integrity_check=ok）、配置快照及不可变原图引用保护，然后切换衣橱并只重启该服务。备份位置 `/var/backups/wardrobe-admin-20261102-release/`；凭据、数据库和图片没有进入 Git。
- schema head 为 `0010_agent_facade`，sqlite_master 前后指纹一致；没有运行迁移。有效 `WARDROBE_AGENT_ENABLED` 仍为 false（未显式配置时使用既有默认值）。
- 新增独立 `homepage-wardrobe-admin` 系统身份、0700 配置目录和 0600 凭据文件，专用 grant 绑定现有 Muse 主连接器的同一 owner，不增加其他 owner／普通 agent 的权限。按当前方案有效期 86400 秒，过期失败关闭，没有自动续期。
- 安装器执行只读 plan 后 apply；共 11 个目标文件，分别保留并修改 available／enabled 的独立 apex 配置副本。安装后逐字节比对 9 个后台制品。只增加独立私有 UI／代理／socket／service／Nginx 片段，没有运行公开站 deploy:ecs。

## 线上检查

| 检查 | 结果 |
| --- | --- |
| Linux 隔离合成 Nginx：Basic Auth／安全头／固定代理头／共享换密／限流／移除后台 | 通过，使用临时独立配置，不改变生产密码 |
| Linux 隔离图片 worker，合成 PNG → JPEG，保留生产资源限制 | 通过；补齐 Mac 无法执行的该项证据 |
| 公网未认证：裸入口、后台 HTML、JS、CSS、session、衣物 API、未知后台路径 | 7 条全部 401；no-store／noindex／nosniff／no-referrer／CSP及相同 realm 正确 |
| 真实 www-data 用户 → 生产 Unix socket → 专用 grant → 生产 TCP API | UI、session、目录首个分页和分类均 200；错误用户 403 |
| UID 隔离 | 代理用户不能读生产库或共享密码；www-data 不能读代理 token；nobody 不能连接 socket |
| systemd | 后台 socket／service、衣橱、Nginx和 analytics timer 均 active |
| 公网公开站中英文首页、衣橱 healthz | 200 |
| 公网 analytics 未认证 | 401 |
| 公开站静态文件 | 100 个既有文件内容完全不变 |
| 共用服务 | Nginx master、Personal Agent API、data MCP 的 PID 均不变 |

没有获取或输入 analytics 明文密码。真实 Basic Auth 登录由 Henson 自行完成；代理的受信读取验证不冒充完整浏览器登录。没有使用真实照片作为生成或展示探针，没有生产业务写操作回执。

## 回滚与剩余验收

旧 API release 保留，可按受保护 state 记录恢复 current 并重启衣橱；同 schema 代码回滚不恢复全库，以免抵销用户后续成功修改。后台安装器自己的备份在 `/var/backups/homepage-wardrobe-admin/`。紧急关闭先执行 `install.py --remove` 的只读 plan，再按授权 apply 移除 apex include，验证完整后台前缀 404 后停后台 socket／service；保留其他服务和共享密码。

剩余由本人验证：用原 analytics 账密在真实浏览器登录；核对真实衣物列表／详情／图片；决定具体目标后自行测试编辑、删除和恢复。390px 手机视口与完整键盘／屏幕阅读器旅程仍未验，生产写闭环不宣称完成。

专用 grant 到期 UTC epoch：`1793721068`；对应 **2026-11-03 23:51:08 Asia/Shanghai**，到期后需另行授权续期维护（当前没有自动续期）。原图回退修复及截图见 [修复记录](../verification/wardrobe-admin-image-fallback-fix-2026-11-02.md)。
