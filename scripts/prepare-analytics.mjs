import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
const pages = {};
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (entry.name === 'index.html') {
      const html = readFileSync(file, 'utf8');
      if (/<meta\s+name="robots"\s+content="noindex/.test(html)) continue;
      const path = '/' + relative('dist', dir).split('\\').join('/');
      pages[path] = html.match(/<title>([^<]+)<\/title>/)?.[1]
        ?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') || path;
    }
  }
}
scan('dist');
if (!pages['/'] || !pages['/en']) throw new Error('Build the bilingual site before preparing analytics.');
rmSync('.analytics-build/dashboard', { recursive: true, force: true });
mkdirSync('.analytics-build/dashboard', { recursive: true });
cpSync('ops/analytics/dashboard', '.analytics-build/dashboard', { recursive: true });
cpSync('src/styles/global.css', '.analytics-build/dashboard/site.css');
writeFileSync('.analytics-build/pages.json', JSON.stringify(pages, null, 2) + '\n');
console.log(`Prepared private analytics assets and ${Object.keys(pages).length} allowed routes.`);
