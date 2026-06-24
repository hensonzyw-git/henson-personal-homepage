# 设计稿 · Design Source

本目录保存网站的 Claude Design 原始设计稿，以及随当前实现同步过的设计规范。原始 `.html` 文件是历史设计源；当前生产站以 `src/` 和 `design-spec.md` 为准。

| 文件 | 说明 |
|------|------|
| `claude-design-offline.html` | **历史离线版**——浏览器直接打开可查看原始多页面设计（含内嵌资源）。其中 Projects、PDF pending、假联系方式等内容已不代表当前生产站。 |
| `claude-design.dc.html` | 可编辑的 Claude Design 组件源（`x-dc` 响应式格式，`{{ }}` 绑定）。需配合 `support.js` 渲染；同样作为历史源保留。 |
| `support.js` | `x-dc` 运行时，仅为渲染上面的 `.dc.html`。**不是**生产站点的一部分。 |
| `design-spec.md` | 当前权威设计/实现规范（配色 token、字体、路由、内容边界、状态）。实现以此为准。 |

## 设计系统要点

- 配色：纸底 `#EEEBE2` / 卡面 `#F7F5EF` / 墨字 `#1F1E1B` / 黏土橙强调 `#C15F3C` / 深色页脚 `#26241F`
- 字体：系统无衬线（SF Pro / PingFang）作正文与标题 + **Space Mono** 作标签/日期/代码（站点自托管，不依赖外部 CDN）
- 1180px 容器、药丸按钮、无投影、卡片 hover 上浮

> 当前公开站模块为 Home / Writing / AI Practice / About me / Contact。职业 Projects 暂不公开；联系方式为真实值；关于我页面不提供公开 PDF 下载入口。
