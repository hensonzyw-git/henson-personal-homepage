import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

// Helpers that pair the zh/en halves of each collection entry by `key`, apply
// draft exclusion in production, and pick the right language with graceful
// fallback (PRD R-L4: show the original language + a note rather than hiding).

const isProd = import.meta.env.PROD;

type AnyEntry = CollectionEntry<'blog'> | CollectionEntry<'ai'> | CollectionEntry<'projects'>;

// Resolve the entry for a given key in the requested language. If the requested
// language is missing, fall back to the other language and flag it.
export function pickLang<T extends AnyEntry>(
  pair: { zh?: T; en?: T },
  lang: Lang,
): { entry: T; fellBack: boolean } | null {
  const wanted = pair[lang];
  if (wanted) return { entry: wanted, fellBack: false };
  const other = lang === 'en' ? pair.zh : pair.en;
  if (other) return { entry: other, fellBack: true };
  return null;
}

function pairByKey<T extends AnyEntry>(entries: T[]): Map<string, { zh?: T; en?: T }> {
  const map = new Map<string, { zh?: T; en?: T }>();
  for (const e of entries) {
    const key = e.data.key;
    const bucket = map.get(key) ?? {};
    bucket[e.data.lang as Lang] = e;
    map.set(key, bucket);
  }
  return map;
}

// ---- Blog -----------------------------------------------------------------
export async function getBlogPairs() {
  const all = await getCollection('blog', ({ data }) => !(isProd && data.draft));
  return pairByKey(all);
}

// Index list for a language, sorted date-desc, drafts excluded in prod.
export async function getBlogIndex(lang: Lang) {
  const pairs = await getBlogPairs();
  const rows = [];
  for (const [slug, pair] of pairs) {
    const picked = pickLang(pair, lang);
    if (!picked) continue;
    rows.push({ slug, ...picked });
  }
  rows.sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
  return rows;
}

// ---- AI Practice ----------------------------------------------------------
export async function getAIPairs() {
  const all = await getCollection('ai');
  return pairByKey(all);
}

export async function getAIIndex(lang: Lang) {
  const pairs = await getAIPairs();
  const rows = [];
  for (const [slug, pair] of pairs) {
    const picked = pickLang(pair, lang);
    if (!picked) continue;
    rows.push({ slug, ...picked });
  }
  // featured first, then date-desc
  rows.sort((a, b) => {
    const fa = a.entry.data.featured ? 1 : 0;
    const fb = b.entry.data.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return b.entry.data.date.getTime() - a.entry.data.date.getTime();
  });
  return rows;
}

// ---- Projects -------------------------------------------------------------
export async function getProjectPairs() {
  const all = await getCollection('projects');
  return pairByKey(all);
}

export async function getProjectIndex(lang: Lang) {
  const pairs = await getProjectPairs();
  const rows = [];
  for (const [slug, pair] of pairs) {
    const picked = pickLang(pair, lang);
    if (!picked) continue;
    rows.push({ slug, ...picked });
  }
  rows.sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
  return rows;
}

// ---- Home "Latest" mixed feed (Blog + AI, newest 3, date-desc) ------------
export type LatestItem = {
  slug: string;
  href: string;
  linked: boolean; // false → render the row un-linked (no real detail page)
  kind: 'blog' | 'ai';
  categoryLabel: string;
  clay: boolean; // clay pill (AI) vs grey pill (blog)
  date: Date;
  title: string;
  summary: string;
};

export async function getLatest(lang: Lang, limit = 3): Promise<LatestItem[]> {
  const blog = await getBlogIndex(lang);
  const ai = await getAIIndex(lang);

  const blogItems: LatestItem[] = blog.map((r) => ({
    slug: r.slug,
    href: `/blog/${r.slug}`,
    linked: true,
    kind: 'blog',
    categoryLabel: lang === 'en' ? 'Writing' : '文章',
    clay: false,
    date: r.entry.data.date,
    title: r.entry.data.title,
    summary: (r.entry.data as any).summary ?? '',
  }));

  // AI detail routes exist only for entries with hasDetail; others live on the
  // /ai index. Mirror that here so the feed never links to a missing page.
  const aiItems: LatestItem[] = ai.map((r) => {
    const hasDetail = Boolean((r.entry.data as any).hasDetail);
    return {
      slug: r.slug,
      href: hasDetail ? `/ai/${r.slug}` : '/ai',
      linked: hasDetail,
      kind: 'ai' as const,
      categoryLabel: lang === 'en' ? 'AI Practice' : 'AI 实践',
      clay: true,
      date: r.entry.data.date,
      title: r.entry.data.title,
      summary: (r.entry.data as any).oneLiner ?? '',
    };
  });

  return [...blogItems, ...aiItems]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

// Format a date as the mono "2026 · 06 · 11" style used throughout the design.
export function monoDate(d: Date, sep = ' · '): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return [y, m, day].join(sep);
}

export function monoDateShort(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y} · ${m}`;
}
