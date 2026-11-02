# 衣橱后台 v0.2｜主页本地验证

本轮只实现与运行合成确定性测试；未 commit／push／部署／签发生产 grant，未读取生产凭据、生产库或私人照片。方案 Candidate `531c8a505f686b548b788621c19f92775714b353` 已 APPROVE；主页 HEAD 仍为 `6a41d8bcb326dacdbddb5ab4a0071b5f86453e32`，代码 Base 为 `ff7a868f248db4e13d5e34e9731319fc68ac5b79`。

| 命令 | exit | 实际结果 |
| --- | --- | --- |
| `python3 -m unittest discover -s test -p 'wardrobe_admin_test.py' -v` | 0 | 27 项：26 通过、1 跳过；跳过项为真实 Unix socket，沙箱禁止创建 socket |
| `node test/wardrobe-admin-ui.test.mjs` | 0 | 1 项通过；实际 UI 模块＋最小 DOM，覆盖过时详情、失败读禁写、冲突输入保留、冻结动作重试 |
| `python3 test/wardrobe_admin_nginx.py /tmp/wardrobe-admin-nginx-fixture` | 77 | **NO_EVIDENCE**：没有 nginx 二进制，没有执行真实 Nginx 测试 |
| `npm ci` | 1 | Node `spawnSync` 对已成功退出的 esbuild 仍返回 `EPERM`；下方保存错误断言 |
| `npm ci --ignore-scripts --cache /tmp/wardrobe-admin-npm-cache` | 1 | 空缓存下载因 DNS `EAI_AGAIN` 失败；未修改依赖或锁文件 |
| `npm ci --ignore-scripts --offline` | 0 | 本地缓存安装 249 packages、0 vulnerabilities；只跳过安装期脚本，未跳过构建或 AC |
| `npm run build` | 0 | 51 pages，实际 esbuild 构建成功 |
| `node test/ac-checks.mjs` | 0 | 150 通过、0 失败；含 dist／UI／导航／sitemap／RSS／llms 隔离与秘密扫描 |
| `npm run analytics:test` | 0 | Python 11 通过，Node 1 通过 |
| `git diff --check` | 0 | 无空白问题 |

首次失败断言（合成 fixture，保留环境失败证据，不计为通过）：

```text
python3 -m unittest discover -s test -p 'wardrobe_admin_test.py' -v
Ran 22 tests ... FAILED (errors=6)
TransportTest.setUp -> ThreadingHTTPServer(('127.0.0.1', 0), UpstreamHandler)
socket.socket(...) -> PermissionError: [Errno 1] Operation not permitted
```

修正测试分层：普通 transport 测试用可控 HTTPConnection fixture；真实 Unix socket 用例保留，运行时只有明确 `PermissionError` 才跳过并说明 NO_EVIDENCE。未把 mock 记作真实 TCP／Nginx 成功。

```text
npm ci
spawnSync .../node_modules/astro/node_modules/esbuild/bin/esbuild EPERM
validateBinaryVersion (.../esbuild/install.js:103:28)
errno: -1, code: 'EPERM', status: 0, stdout: '0.28.1\n'
Node.js v24.22.1
```

独立诊断 `spawnSync('/bin/true')` 和 `spawnSync('/usr/bin/node',['--version'])` 也产生 `status=0, error.code=EPERM`，异步 `spawn('/bin/true')` 正常 `exit=0`。因此使用本地离线安装跳过安装期脚本后运行真实构建，未修改 node_modules 源码或锁文件。两次中间 build 在依赖尚未完成安装时为 exit 127 `astro: not found`；串行离线安装完成后最终 build 为 exit 0。

UI harness 首次实现时，最小 DOM 没有模拟 select 默认选中第一项，触发 `请选择有效值` 与冻结动作断言失败；补齐 fixture 的原生 select 默认值行为后通过，未为测试降低产品校验。

未获得真实执行证据：Nginx Basic Auth／限流／换密／拆 include、真实 Unix socket／TCP→衣橱闭环、独立 UID 读权限、systemd 安装与回滚、桌面／移动浏览器布局和键盘旅程。代码与确定性测试均已提供，但上述项目必须在具备相应能力的隔离环境另验，不能据此宣称生产可用。`WARDROBE_AGENT_ENABLED=false`、schema 不变的独立证明由衣橱仓测试提供；主页不持有或修改这些运行配置。
