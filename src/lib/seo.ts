import type { CollectionEntry } from 'astro:content';
import { localePath, type Lang } from './i18n';

export const siteUrl = 'https://zhuyawei.com';
export const siteImage = `${siteUrl}/wechat-share-v2.png`;

export function absoluteUrl(path: string): string {
  const clean = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return new URL(clean, siteUrl).toString();
}

export function personJsonLd(lang: Lang = 'zh') {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/about/#person`,
    name: lang === 'en' ? 'Henson (Yawei Zhu)' : '朱亚威（Henson）',
    alternateName: ['Henson', 'Yawei Zhu', '朱亚威'],
    url: absoluteUrl(localePath(lang, '/about')),
    sameAs: [
      'https://www.linkedin.com/in/yaweizhu-henson',
      'https://github.com/hensonzyw-git',
    ],
    jobTitle: lang === 'en' ? 'Open Platform Product Manager' : '开放平台产品经理',
    knowsAbout: [
      'Open Platform',
      'AI Agents',
      'API Ecosystems',
      'Developer Experience',
      'Product Management',
    ],
  };
}

export function blogPostJsonLd(entry: CollectionEntry<'blog'>, lang: Lang) {
  const articlePath = `/blog/${entry.data.key}`;
  const pageUrl = absoluteUrl(localePath(lang, articlePath));
  const blogUrl = absoluteUrl(localePath(lang, '/blog'));
  const homeUrl = absoluteUrl(localePath(lang, '/'));
  const person = personJsonLd(lang);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'en' ? 'Home' : '首页',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'en' ? 'Writing' : '文章',
            item: blogUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: entry.data.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: entry.data.title,
        description: entry.data.summary,
        datePublished: entry.data.date.toISOString(),
        dateModified: entry.data.date.toISOString(),
        author: { '@id': person['@id'] },
        publisher: { '@id': person['@id'] },
        mainEntityOfPage: pageUrl,
        url: pageUrl,
        image: [siteImage],
        inLanguage: lang === 'en' ? 'en' : 'zh-CN',
        articleSection: entry.data.category,
        isPartOf: {
          '@type': 'Blog',
          '@id': `${blogUrl}#blog`,
          name: lang === 'en' ? 'Writing · Henson Personal Site' : '文章 · Henson的个人站',
          url: blogUrl,
        },
      },
    ],
  };
}
