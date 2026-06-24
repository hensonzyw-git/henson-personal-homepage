import type { Lang } from '../lib/i18n';

// Public contact entries. No backend, no form — plain links only. Email uses
// progressive-enhancement copy behavior in ContactPage, with mailto as fallback.

export type ContactItem = {
  label: string;       // mono label: EMAIL / LINKEDIN / GITHUB
  value: string;       // display value
  href: string;        // mailto: / https:
  action: 'copy' | 'open';
};

export const contactItems: ContactItem[] = [
  { label: 'EMAIL', value: 'hensonwork@foxmail.com', href: 'mailto:hensonwork@foxmail.com', action: 'copy' },
  { label: 'LINKEDIN', value: 'linkedin.com/in/yaweizhu-henson', href: 'https://www.linkedin.com/in/yaweizhu-henson', action: 'open' },
  { label: 'GITHUB', value: 'github.com/hensonzyw-git', href: 'https://github.com/hensonzyw-git', action: 'open' },
];

export const contactCopy: Record<Lang, { eyebrow: string; title: string; intro: string; copy: string; copied: string; open: string }> = {
  zh: {
    eyebrow: '联系 · Contact',
    title: '聊聊 AI 与产品',
    intro: '同行、合作方、招聘方都欢迎。下面三个入口任选其一。',
    copy: '复制',
    copied: '已复制 ✓',
    open: '打开 →',
  },
  en: {
    eyebrow: 'Contact',
    title: "Let's talk AI & product",
    intro: 'Peers, collaborators and recruiters all welcome. Pick any of the three below.',
    copy: 'copy',
    copied: 'copied ✓',
    open: 'open →',
  },
};
