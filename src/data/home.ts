import type { Lang } from '../lib/i18n';

// Home page copy. Hero VARIANT A (宣言) only — the A/B/C toggle and "设计探索"
// bar are design-tool chrome and are not shipped. Stats grid mirrors the source
// (6年 / AI落地 / 0→1 / 12+).

type HomeContent = {
  eyebrow: string;
  headline: string[];     // lines
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: { value: string; label: string }[];
  latest: { title: string; note: string; sub: string };
  modulesTitle: string;
  modules: { key: 'blog' | 'ai' | 'projects' | 'resume'; title: string; desc: string }[];
};

export const home: Record<Lang, HomeContent> = {
  zh: {
    eyebrow: '开放平台产品经理 · AI × 平台生态',
    headline: ['把对 AI 的思考，', '做成能动手的东西。'],
    sub: '我是朱亚威（Henson）—— 一名开放平台产品经理，专注用 AI 重新定义平台与生态产品的边界。观点写下来，实践做出来，这里是它们沉淀的地方。',
    ctaPrimary: '读最新文章 →',
    ctaSecondary: '看 AI 实践',
    stats: [
      { value: '10 年', label: '产品经验' },
      { value: 'AI 落地', label: '实践方向' },
      { value: '0 → 1', label: '代表叙事' },
      { value: '12+', label: '动手实践' },
    ],
    latest: { title: '最新动态', note: 'Blog + AI Practice · 自动取最新', sub: '混合时间流，按日期倒序自动展示最近条目。' },
    modulesTitle: '去各个角落',
    modules: [
      { key: 'blog', title: '文章 · Writing', desc: '关于 AI、产品与思考方式的长文，按时间倒序。' },
      { key: 'ai', title: 'AI 实践 · Practice', desc: '动手做的工具、prompt、自动化与本站本身。核心差异化。' },
      { key: 'projects', title: '项目 · Projects', desc: '职业产品工作：问题 → 决策 → 结果 → 我的贡献。' },
      { key: 'resume', title: '简历 · Resume', desc: '线性履历与技能，可选 PDF 下载。' },
    ],
  },
  en: {
    eyebrow: 'Open Platform Product Manager · AI × platform ecosystems',
    headline: ['Turn thinking about AI', 'into things you can build.'],
    sub: "I'm Henson (Zhu Yawei) — an open-platform product manager using AI to redraw the boundaries of platform and ecosystem products. Opinions written down, practice built. This is where they accumulate.",
    ctaPrimary: 'Read the latest →',
    ctaSecondary: 'See AI practice',
    stats: [
      { value: '10 yrs', label: 'Product experience' },
      { value: 'AI in prod', label: 'Practice focus' },
      { value: '0 → 1', label: 'Signature story' },
      { value: '12+', label: 'Hands-on builds' },
    ],
    latest: { title: 'Latest', note: 'Blog + AI Practice · auto, newest first', sub: 'A mixed timeline, newest entries auto-surfaced by date.' },
    modulesTitle: 'Wander around',
    modules: [
      { key: 'blog', title: 'Writing', desc: 'Long-form on AI, product and ways of thinking, newest first.' },
      { key: 'ai', title: 'AI Practice', desc: 'Hands-on tools, prompts, automation — and this site itself. The differentiator.' },
      { key: 'projects', title: 'Projects', desc: 'Professional product work: problem → decisions → result → my contribution.' },
      { key: 'resume', title: 'Resume', desc: 'Linear background and skills, optional PDF download.' },
    ],
  },
};
