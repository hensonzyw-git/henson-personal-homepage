import rss from '@astrojs/rss';
import { blogUpdated, getBlogIndex } from './content';
import { localePath, type Lang } from './i18n';
import { absoluteUrl, siteUrl } from './seo';

// Blog-only feed: AI Practice entries iterate in place (updated ≠ published),
// which doesn't fit RSS pubDate semantics; the feed represents Writing.
// Names mirror the Blog entity in seo.ts isPartOf.
const CHANNEL = {
  zh: {
    title: '文章 · Henson的个人站',
    description:
      '朱亚威（Henson）：开放平台产品经理，写 AI Agent、API 生态、开发者体验与产品判断。',
  },
  en: {
    title: 'Writing · Henson Personal Site',
    description:
      'Henson (Yawei Zhu): open-platform product manager writing about AI agents, API ecosystems, developer experience, and product judgment.',
  },
} as const;

export async function blogFeed(lang: Lang) {
  const posts = await getBlogIndex(lang);
  return rss({
    title: CHANNEL[lang].title,
    description: CHANNEL[lang].description,
    site: absoluteUrl(localePath(lang, '/')),
    items: posts.map(({ slug, entry }) => ({
      title: entry.data.title,
      link: absoluteUrl(localePath(lang, `/blog/${slug}`)),
      description: entry.data.summary,
      pubDate: entry.data.date,
      categories: [entry.data.category],
      customData: entry.data.updated
        ? `<atom:updated>${blogUpdated(entry).toISOString()}</atom:updated>`
        : undefined,
    })),
    customData: [
      `<language>${lang === 'en' ? 'en' : 'zh-CN'}</language>`,
      `<atom:link href="${absoluteUrl(localePath(lang, '/rss.xml'))}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    trailingSlash: false, // absoluteUrl already normalizes; avoid double-appending
  });
}

export { siteUrl };
