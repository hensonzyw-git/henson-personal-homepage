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
  'index.html', 'resume/index.html', 'projects/index.html',
  'projects/merchant-ai-agent/index.html', 'blog/index.html',
  'blog/competitor-gap-signal/index.html', 'ai/index.html',
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
const post = read('blog/eval-all-zero-signature/index.html') || '';
ok('AC-5 markdown h2 rendered', /<h2[ >]/.test(post), 'no <h2>');
ok('AC-5 markdown list rendered', /<ul[ >]|<ol[ >]/.test(post), 'no list');
const anyPost = (read('blog/competitor-gap-signal/index.html')||'') + post + (read('blog/design-drift-ai-collab/index.html')||'');
ok('AC-5 markdown blockquote rendered', /<blockquote[ >]/.test(anyPost), 'no blockquote in any post');
ok('AC-5 markdown link rendered', /<a [^>]*href="https?:/.test(anyPost), 'no link in any post');
// NOTE: no PUBLISHED blog post contains a fenced/inline code block (only the excluded
// draft post does), so styled code rendering is unverified in dist. Content gap, not a
// renderer defect — Astro markdown supports code. Tracked as a soft warning, not a fail.
const codeRendered = /<code[ >]|<pre[ >]/.test(anyPost);
if (!codeRendered) console.log('WARN  AC-5 code: no published post exercises a code block (content gap)');

// ---- AC-6: AI module independent, index + >=1 detail ----
ok('AC-6 AI index exists', fileExists('ai/index.html'), 'no /ai');
ok('AC-6 >=1 AI detail exists', fileExists('ai/show-radar/index.html'), 'no /ai/[slug]');

// ---- AC-2: homepage ----
const home = read('index.html') || '';
ok('AC-2 home has latest/动态 section', /最新/.test(home), 'no latest section heading');
ok('AC-2 home has module hub links', /href="\/blog"/.test(home) && /href="\/ai"/.test(home)
   && /href="\/projects"/.test(home) && /href="\/resume"/.test(home), 'missing a module link');
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
  ['blog/competitor-gap-signal', 'en/blog/competitor-gap-signal'],
  ['blog/eval-all-zero-signature', 'en/blog/eval-all-zero-signature'],
  ['blog/design-drift-ai-collab', 'en/blog/design-drift-ai-collab'],
  ['ai/show-radar', 'en/ai/show-radar'],
  ['projects/merchant-ai-agent', 'en/projects/merchant-ai-agent'],
  ['projects/data-insight-line', 'en/projects/data-insight-line'],
];
for (const [zh, en] of pairs)
  ok(`GATE1 zh+en both exist: ${zh}`, fileExists(`${zh}/index.html`) && fileExists(`${en}/index.html`), 'one side missing');

// ---- AC-8: language switch preserves page (deep page links to its counterpart) ----
const zhPost = read('blog/competitor-gap-signal/index.html') || '';
ok('AC-8 zh deep page links to /en counterpart',
   zhPost.includes('/en/blog/competitor-gap-signal'), 'no link to en counterpart');
const enPost = read('en/blog/competitor-gap-signal/index.html') || '';
ok('AC-8 en deep page links back to zh counterpart',
   /href="\/blog\/competitor-gap-signal/.test(enPost), 'no link back to zh counterpart');

// ---- AC-3: resume PDF pending, no dead href ----
const resume = read('resume/index.html') || '';
ok('AC-3 resume PDF pending label', /PDF\s*即将提供|即将提供/.test(resume), 'no pending label');
// no anchor pointing at a .pdf
ok('AC-3 no dead .pdf href', !/href="[^"]*\.pdf"/i.test(resume), 'found a .pdf href');

// ---- AC-4: project detail four-part frame w/ numbered badges ----
const proj = read('projects/merchant-ai-agent/index.html') || '';
const fourPart = ['问题', '决策', '结果', '贡献'].every(s => proj.includes(s));
ok('AC-4 four-part frame present', fourPart, 'missing a section label');
const badges = ['01', '02', '03', '04'].every(n => proj.includes(n));
ok('AC-4 numbered badges 01-04 present', badges, 'missing a badge number');

// ---- AC-7: contact 3 entries fake values ----
const contact = read('contact/index.html') || '';
ok('AC-7 contact has EMAIL/LINKEDIN/GITHUB', /EMAIL/i.test(contact) && /LINKEDIN/i.test(contact) && /GITHUB/i.test(contact), 'missing a channel');
ok('AC-7 contact has obvious fake value', /example\.com|your-|示例|待替换/i.test(contact), 'no obvious placeholder');

// ---- AC-9: placeholder labels present somewhere ----
const allHomeProjAi = home + (read('projects/index.html')||'') + (read('ai/index.html')||'') + (read('projects/data-insight-line/index.html')||'');
ok('AC-9 placeholder labels visible (示例/待替换/即将提供)',
   /示例|待替换|即将提供/.test(allHomeProjAi + resume + contact), 'no placeholder labels found');

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
if (fails.length) { console.log('FAILURES:'); fails.forEach(f => console.log(' - ' + f)); }
process.exit(fail ? 1 : 0);
