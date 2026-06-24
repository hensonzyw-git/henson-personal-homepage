# Henson 个人站 · Personal Homepage

开放平台产品经理 Henson 的个人网站：以「思考 + AI 实践」为钩子，沉淀观点与动手实践。

基于 [Astro](https://astro.build/) 的双语（中文默认 / 英文）静态站，内容用 Markdown content
collections 管理。视觉与字体照设计稿：系统字 + Space Mono（自托管，不依赖外部字体 CDN）。

## 模块

- **首页 / About** — 定位钩子 + 证据点 + 最新动态 + 模块导航枢纽
- **文章 / Writing** — 关于 AI、产品与判断方式的长文
- **AI 实践 / Side Projects** — 工具、prompt、自动化与本站自身（核心差异化）
- **关于我 / About me** — 线性履历、教育与技能
- **联系 / Contact** — email / LinkedIn / GitHub

## 本地运行

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
node test/ac-checks.mjs   # 验收断言自检
```

## 结构

```
src/
  pages/        路由（中文 + /en 英文镜像 + 404）
  components/   页面与区块组件
  content/      blog / ai 内容集合（每条 zh + en）
  data/         home / resume / contact 数据
  lib/          i18n、内容层（配对、草稿过滤、最新动态聚合）
  styles/       设计 token 与字体
```

> 当前公开站不展示职业项目页；工作项目素材先保留在私域，不进入导航、路由或内容集合。AI 实践中仍有少量「示例 · 待替换」占位条目，后续逐步替换为真实素材。
