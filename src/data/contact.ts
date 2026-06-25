import type { Lang } from '../lib/i18n';

// Public contact entries. No backend, no form — plain links only.

export type ContactItem = {
  label: string;       // mono label: EMAIL / LINKEDIN / GITHUB
  value: string;       // display value
  href: string;        // mailto: / https:
  action: 'email' | 'open';
};

export const contactItems: ContactItem[] = [
  { label: 'EMAIL', value: 'hensonwork@foxmail.com', href: 'mailto:hensonwork@foxmail.com', action: 'email' },
  { label: 'LINKEDIN', value: 'linkedin.com/in/yaweizhu-henson', href: 'https://www.linkedin.com/in/yaweizhu-henson', action: 'open' },
  { label: 'GITHUB', value: 'github.com/hensonzyw-git', href: 'https://github.com/hensonzyw-git', action: 'open' },
];

export const contactCopy: Record<Lang, { eyebrow: string; title: string; intro: string }> = {
  zh: {
    eyebrow: '联系 · Contact',
    title: '聊聊 AI 与产品',
    intro: '欢迎联系，下面三个入口任选其一。',
  },
  en: {
    eyebrow: 'Contact',
    title: "Let's talk AI & product",
    intro: 'Feel free to reach out. Pick any of the three below.',
  },
};
