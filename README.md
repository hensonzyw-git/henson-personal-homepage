# Henson 个人站 · Personal Homepage

AI 时代产品经理 Henson 的个人网站：以「思考 + AI 实践」为钩子，沉淀观点、项目与动手实践。

基于 [Astro](https://astro.build/) 的双语（中文默认 / 英文）静态站，内容用 Markdown content
collections 管理。视觉与字体照设计稿：系统字 + Space Mono（自托管，不依赖外部字体 CDN）。

## 模块

- **首页 / About** — 定位钩子 + 证据点 + 最新动态 + 模块导航枢纽
- **文章 / Writing** — 关于 AI、产品与判断方式的长文
- **AI 实践 / Side Projects** — 工具、prompt、自动化与本站自身（核心差异化）
- **项目 / Projects** — 职业产品工作，按「问题 → 决策 → 结果 → 个人贡献」展开
- **简历 / Resume** — 线性履历与技能
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
  content/      blog / ai / projects 内容集合（每条 zh + en）
  data/         resume / contact 数据
  lib/          i18n、内容层（配对、草稿过滤、最新动态聚合）
  styles/       设计 token 与字体
```

> V1 内容为脱敏占位 + 真实素材草稿，标注「示例 · 待替换」，后续逐步替换为正式文案。
