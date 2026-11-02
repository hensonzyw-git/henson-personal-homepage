# 2026-11-02 衣橱后台发布授权与范围

用户本轮明确指令：“push 提pr merge然后我线上验收一下。然后我是不是需要去域名后台配置一下新的URL的”。该最新指令覆盖原本仅本地／禁止 Git 发布的阶段限制，授权两仓提交当前关联变更、推送、创建 PR 和合并。

为满足用户随后在真实线上验收的目标，本轮已在会话明确说明并推进：合并后部署衣橱同 schema 代码和主页独立私有 UI／Unix 代理／Nginx 路径，设置独立代理系统账号及专用运营者 grant。入口为既有 `https://zhuyawei.com/wardrobe-admin/`，不新增域名或 DNS 记录，沿用 analytics 的现有本人账密，不更改或重写共享密码。

生产验证只做健康、未认证拒绝、安全头、身份隔离及受保护只读链路；不会修改、删除或恢复真实衣物，不调用模型、POIZON 或触发推荐。不打开 agent，不新增／修改 schema 或 Alembic revision。若生产 schema 与 0010 不匹配则停止，不自动迁移。原图、数据库和密钥留在生产受保护目录，不入 Git 或输出凭据。

当前预检：衣橱原 release `b9b5fb277682`，schema `0010_agent_facade`，Python 3.12.3，loopback 8830，Nginx worker 组 www-data；apex 站点 available／enabled 为独立副本，均需独立备份并处理。后续发布记录固定实际合并 SHA、包／UI hash、备份和验证结果，部署前核验有效 agent 开关、资源、目录权限并保留代码回滚路径。

本地验收与原图回退修复记录保留原始时点。授权 GitHub 与部署不等于用户已完成线上业务验收，实际界面／真实衣物操作由 Henson 后续验收。
