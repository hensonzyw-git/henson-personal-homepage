# 设计稿 · Design Source

本网站的原始设计稿，由 **Claude Design** 产出，是实现 (`src/`) 所依据的视觉基准。

| 文件 | 说明 |
|------|------|
| `claude-design-offline.html` | **自包含离线版**——浏览器直接打开即可查看全部 8 个页面的设计（含内嵌资源）。看设计最直接用这个。 |
| `claude-design.dc.html` | 可编辑的 Claude Design 组件源（`x-dc` 响应式格式，`{{ }}` 绑定）。需配合 `support.js` 渲染。 |
| `support.js` | `x-dc` 运行时，仅为渲染上面的 `.dc.html`。**不是**生产站点的一部分。 |
| `design-spec.md` | 从设计稿提炼的权威设计规范（配色 token、字体、各页布局、状态）。实现以此为准。 |

## 设计系统要点

- 配色：纸底 `#EEEBE2` / 卡面 `#F7F5EF` / 墨字 `#1F1E1B` / 黏土橙强调 `#C15F3C` / 深色页脚 `#26241F`
- 字体：系统无衬线（SF Pro / PingFang）作正文与标题 + **Space Mono** 作标签/日期/代码（站点自托管，不依赖外部 CDN）
- 1180px 容器、药丸按钮、无投影、卡片 hover 上浮

> 设计稿内为通用占位文案；正式站点内容在 `src/content/` 与 `src/data/`，按「示例 · 待替换」标注，后续替换为正式文案。
