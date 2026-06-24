// Deterministic AC checks against the built dist/ output.
// Run: node test/ac-checks.mjs   (from repo root)
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
let pass = 0, fail = 0;
const fails = [];

function read(rel) {
  const p = join(dist, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}
function ok(name, cond, detail = '') {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; fails.push(`${name} :: ${detail}`); console.log(`FAIL  ${name}  ${detail}`); }
}
function fileExists(rel) { return existsSync(join(dist, rel)); }

// ---- AC-1: routes ----
const zhRoutes = [
  'index.html', 'about/index.html', 'blog/index.html',
  'blog/traditional-to-ai-open-platform/index.html', 'ai/index.html',
  'ai/show-radar/index.html', 'contact/index.html',
];
const enRoutes = zhRoutes.map(r => r === 'index.html' ? 'en/index.html' : 'en/' + r);
for (const r of [...zhRoutes, ...enRoutes]) ok(`AC-1 route exists: ${r}`, fileExists(r), 'missing in dist');
ok('AC-1 404 page exists', fileExists('404.html'), 'missing 404.html');

// ---- AC-5: draft excluded ----
ok('AC-5 draft post absent from dist', !fileExists('blog/draft-workflow-rework/index.html'), 'draft page was built');
const blogIdx = read('blog/index.html') || '';
ok('AC-5 draft title NOT in blog index', !blogIdx.includes('草稿') || !blogIdx.includes('日常工作流'),
   'draft title leaked into index');

// blog index date-desc: extract ISO-ish dates and check ordering
const blogDates = [...blogIdx.matchAll(/datetime="(\d{4}-\d{2}-\d{2})/g)].map(m => m[1]);
const sorted = [...blogDates].sort().reverse();
ok('AC-5 blog index date-descending', JSON.stringify(blogDates) === JSON.stringify(sorted),
   `order=${JSON.stringify(blogDates)}`);

// markdown rendering in a detail page
const post = read('blog/traditional-to-ai-open-platform/index.html') || '';
ok('AC-5 markdown h2 rendered', /<h2[ >]/.test(post), 'no <h2>');
ok('AC-5 markdown list rendered', /<ul[ >]|<ol[ >]/.test(post), 'no list');
ok('AC-5 markdown blockquote rendered', /<blockquote[ >]/.test(post), 'no blockquote');
ok('AC-5 markdown link rendered', /<a [^>]*href="https?:/.test(post), 'no external link');
ok('AC-5 markdown table rendered', /<table[ >]/.test(post), 'no table');
const codeRendered = /<code[ >]|<pre[ >]/.test(post);
if (!codeRendered) console.log('WARN  AC-5 code: post exercises no code element');

// ---- AC-6: AI module independent, index + >=1 detail ----
ok('AC-6 AI index exists', fileExists('ai/index.html'), 'no /ai');
ok('AC-6 >=1 AI detail exists', fileExists('ai/show-radar/index.html'), 'no /ai/[slug]');

// ---- AC-2: homepage ----
const home = read('index.html') || '';
ok('AC-2 home has latest/动态 section', /最新/.test(home), 'no latest section heading');
ok('AC-2 home has module hub links', /href="\/blog"/.test(home) && /href="\/ai"/.test(home)
   && /href="\/about"/.test(home), 'missing a module link');
// latest feed: newest 3, date-desc, mixed blog+ai. Pull dates appearing in latest block.
// dates rendered mono as "YYYY · MM · DD"
const homeDates = [...home.matchAll(/(\d{4}) · (\d{2}) · (\d{2})/g)].map(m => `${m[1]}-${m[2]}-${m[3]}`);
ok('AC-2 home shows >=3 dated latest items', homeDates.length >= 3, `found ${homeDates.length} dates`);
const homeSorted = [...homeDates].sort().reverse();
ok('AC-2 latest feed is date-descending', JSON.stringify(homeDates) === JSON.stringify(homeSorted), `order=${JSON.stringify(homeDates)}`);
// mixed blog + ai: latest links into both collections
ok('AC-2 latest feed is mixed blog+ai', /href="\/ai\//.test(home) && /href="\/blog\//.test(home), 'feed not mixed');

// ---- GATE 1: each entry has zh AND en ----
const pairs = [
  ['blog/traditional-to-ai-open-platform', 'en/blog/traditional-to-ai-open-platform'],
  ['ai/show-radar', 'en/ai/show-radar'],
];
for (const [zh, en] of pairs)
  ok(`GATE1 zh+en both exist: ${zh}`, fileExists(`${zh}/index.html`) && fileExists(`${en}/index.html`), 'one side missing');

// ---- AC-8: language switch preserves page (deep page links to its counterpart) ----
const zhPost = read('blog/traditional-to-ai-open-platform/index.html') || '';
ok('AC-8 zh deep page links to /en counterpart',
   zhPost.includes('/en/blog/traditional-to-ai-open-platform'), 'no link to en counterpart');
const enPost = read('en/blog/traditional-to-ai-open-platform/index.html') || '';
ok('AC-8 en deep page links back to zh counterpart',
   /href="\/blog\/traditional-to-ai-open-platform/.test(enPost), 'no link back to zh counterpart');

// ---- AC-3: About me offers no public PDF download (private; provided on request) ----
const resume = read('about/index.html') || '';
// no PDF download entry at all (no button label, no .pdf link)
ok('AC-3 no PDF download entry', !/PDF/i.test(resume), 'found a PDF reference');
ok('AC-3 no dead .pdf href', !/href="[^"]*\.pdf"/i.test(resume), 'found a .pdf href');

// ---- AC-7: contact 3 entries with real values ----
const contact = read('contact/index.html') || '';
ok('AC-7 contact has EMAIL/LINKEDIN/GITHUB', /EMAIL/i.test(contact) && /LINKEDIN/i.test(contact) && /GITHUB/i.test(contact), 'missing a channel');
ok('AC-7 contact real values resolve',
   /mailto:hensonwork@foxmail\.com/.test(contact) && /linkedin\.com\/in\/yaweizhu-henson/.test(contact) && /github\.com\/hensonzyw-git/.test(contact),
   'a real channel value is missing');
ok('AC-7 contact has no placeholder value', !/example\.com|your-/i.test(contact), 'found a placeholder value');

// ---- AC-9: AI detail pages render real media (placeholders replaced) ----
const aiDetails = (read('ai/show-radar/index.html')||'') + (read('ai/this-site/index.html')||'') + (read('ai/multi-agent-workflow/index.html')||'');
ok('AC-9 AI detail pages show real media, not placeholders',
   /<img[^>]+src="\/ai\//.test(aiDetails) && !/示例|待替换/.test(aiDetails),
   'expected real /ai/ images and no 示例/待替换 placeholder labels');

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
if (fails.length) { console.log('FAILURES:'); fails.forEach(f => console.log(' - ' + f)); }
process.exit(fail ? 1 : 0);
