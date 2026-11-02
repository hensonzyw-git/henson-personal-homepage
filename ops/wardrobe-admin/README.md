# 私有衣橱后台制品

本目录不进入 Astro 的 `src/pages/`、`public/` 或 `dist/`。主合同见 [主页方案指针](../../docs/衣橱后台_技术方案_v0.2_指针.md)，本地测试与缺口见 [验证记录](../../docs/verification/wardrobe-admin-2026-11-02.md)。

- `ui/` 只有固定 HTML／JS／CSS；原生表单覆盖 LabelValues 36 键。上海时区、分类分页、冲突输入保留、单件软删确认、回收站恢复。无图／缺图明确提示；无上传／换图／永久清除。
- `proxy.py` 只使用 Python 标准库与 systemd 传入的一个 AF_UNIX FD。固定 loopback 上游与衣橱 Host、固定运营者身份绑定，重建请求头，不接收任意上游或路径。JSON 4 MiB／图片 32 MiB／JPEG 预览 150 KiB，连接 2 秒、总 deadline 15 秒，图片分块转发，无环境代理／自动重定向／写网络重试。
- `nginx-*.conf` 仅装入 apex TLS vhost。整树共用 analytics 的 `/etc/nginx/homepage-analytics.htpasswd` 与 realm；裸入口也先认证后由代理 308。独立限流、脱敏日志与所有响应安全头，不公开 alias。
- `.socket` 仅代理 UID 与实际 Nginx worker 组可连；`.service` 独立用户、只读代码与 UI、128 MiB／20% CPU／32 tasks。正式安装前必须核验实际组名、端口和资源，不能把示例当生产现状。

后续另获部署授权时，先由管理员预配独立身份 `homepage-wardrobe-admin`，并按技术方案专用 `grant-operator` 规则签发 grant。保护目录 `/etc/homepage-wardrobe-admin/` 为该 UID／0700，两个配置文件为同 UID／0600 且不得为 symlink：

- `wardrobe-token.json` 仅含 `token`；不放入命令行、环境变量、UI、Git 或日志。
- `operator.json` 仅含 `username`（本人现有 analytics 用户名）、`upstream_host`（只能为 `127.0.0.1`／`::1`）、`upstream_port`（核验后的整数端口）。不含密码或哈希。

`install.py` 默认只读 plan，输出自己制品与两个 vhost 文件的当前／候选 SHA 和 changed；支持 copied sites-enabled 与 symlink 去重，不输出文件正文。`--root` 只供合成 plan 夹具。`--apply` 是未来另获授权后的安装入口，本轮未运行；不发布公开 dist，不签发 grant、不迁移数据库、不读取或重写 htpasswd 内容。失败恢复自己的文件和原 unit active／enabled 状态，已运行的旧服务以还原代码重启；并发配置变更时拒绝盲目覆盖。

紧急关闭先审查 `install.py --remove` 的只读计划；另获操作授权后 `--remove --apply` 只删除 apex 后台 include、nginx -t／reload，凭据或代理用户缺失不阻碍关闭。确认完整前缀 404 后再停用后台 socket／service，不动 analytics、衣橱、共用密码或其他服务。代码回滚保留已成功的业务修改，不能倒放 patch 或用旧全库备份抵销修改。

密码仍由既有 analytics 隐藏录入／获批同步流程管理。轮换时原子更新同一 htpasswd 并 nginx -t／reload，验证两树旧密码同时失效。日常后台安装不回写旧哈希。grant 轮换是另一项授权操作，到期失败关闭，不回退到 Muse／agent 凭据。
