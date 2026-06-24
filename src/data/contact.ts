import type { Lang } from '../lib/i18n';

// Contact entries. V1 uses obvious fake placeholder values, clearly labelled
// (PRD R-C2 / AC-7). No backend, no form — plain links only.

export type ContactItem = {
  label: string;       // mono label: EMAIL / LINKEDIN / GITHUB
  value: string;       // display value (obvious fake)
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
