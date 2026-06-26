import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static personal website. Chinese is the default language at `/`;
// English is mirrored under the `/en` route prefix (see src/lib/i18n.ts).
export default defineConfig({
  site: 'https://zhuyawei.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
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
