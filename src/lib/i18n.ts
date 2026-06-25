// i18n layer. Chinese is the default language served at `/`; English is mirrored
// under the `/en` prefix. The language switch preserves the current page by
// swapping only the prefix (see `switchLangPath`). UI string maps are reused
// verbatim from the design source's renderVals() ZH/EN objects, extended with the
// extra UI copy the real pages need.

export type Lang = 'zh' | 'en';
export const LANGS: Lang[] = ['zh', 'en'];
export const DEFAULT_LANG: Lang = 'zh';

// Nav / UI strings. ZH/EN nav keys come straight from the design source.
export const UI = {
  zh: {
    nav: { blog: '文章', ai: 'AI 实践', resume: '关于我', contact: '联系', cta: '联系我' },
    footer: {
      tagline: '开放平台产品经理。用 AI 重新定义平台与生态产品的边界。',
      navLabel: '导航',
      contactLabel: '联系',
      copyright: '© 2026 朱亚威 (Henson)',
      icp: '鄂ICP备2026032503',
    },
    enBanner: '界面文案已切换为英文。正文条目缺失英文版时降级显示中文原文并提示「暂无英文版」(对应 PRD R-L4 / A-1)。',
    backToBlog: '← 返回文章',
    backToAI: '← 返回 AI 实践',
    readMins: (m: number) => `阅读约 ${m} 分钟`,
    fallbackNote: '暂无英文版 · 以下为中文原文',
    sample: '示例 · 待替换',
  },
  en: {
    nav: { blog: 'Writing', ai: 'AI Practice', resume: 'About me', contact: 'Contact', cta: 'Get in touch' },
    footer: {
      tagline: 'Open-platform product manager. Redrawing the boundaries of platform and ecosystem products with AI.',
      navLabel: 'Navigate',
      contactLabel: 'Contact',
      copyright: '© 2026 Henson (Zhu Yawei)',
      icp: '鄂ICP备2026032503',
    },
    enBanner: 'UI is in English. When an entry has no English body it gracefully falls back to the Chinese original (PRD R-L4 / A-1).',
    backToBlog: '← Back to Writing',
    backToAI: '← Back to AI Practice',
    readMins: (m: number) => `~${m} min read`,
    fallbackNote: 'No English version yet · showing the Chinese original',
    sample: 'sample · placeholder',
  },
} as const;

export function t(lang: Lang) {
  return UI[lang];
}

// Build an href for a logical path under the given language.
// `path` is the canonical (zh) path beginning with '/'. For en we prepend '/en'.
export function localePath(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return lang === 'en' ? `/en${clean || ''}` || '/en' : clean || '/';
}

// Given the current canonical path + a target lang, return the mirrored URL so
// the language switch stays on the same page.
export function switchLangPath(toLang: Lang, canonicalPath: string): string {
  return localePath(toLang, canonicalPath);
}

export function htmlLang(lang: Lang): string {
  return lang === 'en' ? 'en' : 'zh-CN';
}
