import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Content pages get truthful last-modified values from frontmatter. Other
// routes omit lastmod rather than pretending every build changed their content.
function contentLastmods() {
  const result = new Map();
  for (const collection of ['blog', 'ai']) {
    const dir = resolve(`src/content/${collection}`);
    for (const filename of readdirSync(dir).filter((name) => name.endsWith('.md'))) {
      const source = readFileSync(resolve(dir, filename), 'utf8');
      const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*["']?([^\\n"']+)`, 'm'))?.[1]?.trim();
      const key = field('key');
      const lang = field('lang');
      const date = field('updated') || field('date');
      const isDraft = field('draft') === 'true';
      const hasDetail = field('hasDetail') === 'true';
      if (!key || !lang || !date || isDraft || (collection === 'ai' && !hasDetail)) continue;

      const prefix = lang === 'en' ? '/en' : '';
      result.set(`${prefix}/${collection}/${key}/`, new Date(`${date}T00:00:00Z`));
    }
  }
  return result;
}

const lastmods = contentLastmods();

// Static personal website. Chinese is the default language at `/`;
// English is mirrored under the `/en` route prefix (see src/lib/i18n.ts).
export default defineConfig({
  site: 'https://zhuyawei.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap({
    serialize(item) {
      const pathname = new URL(item.url).pathname;
      const lastmod = lastmods.get(pathname);
      return lastmod ? { ...item, lastmod } : item;
    },
  })],
  build: {
    format: 'directory',
  },
  markdown: {
    // Use Shiki's css-variables theme so code blocks pick up the site's dark
    // surface (#26241F / --dark) defined in Prose.astro, instead of Shiki's
    // built-in github-dark inline background. See src/components/Prose.astro.
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
