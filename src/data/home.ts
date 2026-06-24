import type { Lang } from '../lib/i18n';

// Home page copy. Hero VARIANT A (宣言) only — the A/B/C toggle and "设计探索"
// bar are design-tool chrome and are not shipped. heroTags = 3 small, credible,
// non-sensitive credential pills shown inline in the hero (years / breadth across
// sectors-stages-international / management + hands-on); company-specific metrics
// are kept off the public site.

type HomeContent = {
  eyebrow: string;
  headline: string[];     // lines
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroTags: string[];
  latest: { title: string; note: string };
  modulesTitle: string;
  modules: { key: 'blog' | 'ai' | 'resume'; title: string; desc: string }[];
};

export const home: Record<Lang, HomeContent> = {
  zh: {
    eyebrow: '开放平台产品经理 · AI × 平台生态',
    headline: ['AI 与开放平台，', '经验和想法的沉淀。'],
    sub: '我是朱亚威（Henson）—— 一名开放平台产品经理。这里记录我在 AI 和开放平台方向的经验、思考、想法，以及对行业进展的持续跟进。',
    ctaPrimary: '读最新文章 →',
    ctaSecondary: '看 AI 实践',
    heroTags: [
      '10 年开放平台产品',
      '多行业 · 跨阶段 · 国际化',
      '管理 + 一线能力',
    ],
    latest: { title: '最新动态', note: '文章 + AI 实践' },
    modulesTitle: '去各个角落',
    modules: [
      { key: 'blog', title: '文章 · Writing', desc: '关于 AI、产品与思考方式的长文，按时间倒序。' },
      { key: 'ai', title: 'AI 实践 · Practice', desc: '动手做的工具、prompt、自动化与本站本身。核心差异化。' },
      { key: 'resume', title: '关于我 · About me', desc: '线性履历、教育与技能。' },
    ],
  },
  en: {
    eyebrow: 'Open Platform Product Manager · AI × platform ecosystems',
    headline: ['Turn thinking about AI', 'into things you can build.'],
    sub: "I'm Henson (Zhu Yawei) — an open-platform product manager using AI to redraw the boundaries of platform and ecosystem products. Opinions written down, practice built. This is where they accumulate.",
    ctaPrimary: 'Read the latest →',
    ctaSecondary: 'See AI practice',
    heroTags: [
      '10 yrs in open-platform product',
      'Multi-sector · multi-stage · international',
      'Management + hands-on',
    ],
    latest: { title: 'Latest', note: 'Blog + AI Practice' },
    modulesTitle: 'Wander around',
    modules: [
      { key: 'blog', title: 'Writing', desc: 'Long-form on AI, product and ways of thinking, newest first.' },
      { key: 'ai', title: 'AI Practice', desc: 'Hands-on tools, prompts, automation — and this site itself. The differentiator.' },
      { key: 'resume', title: 'About me', desc: 'Linear background, education and skills.' },
    ],
  },
};
