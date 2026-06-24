import { defineConfig } from 'astro/config';

// Static personal website. Chinese is the default language at `/`;
// English is mirrored under the `/en` route prefix (see src/lib/i18n.ts).
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
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
