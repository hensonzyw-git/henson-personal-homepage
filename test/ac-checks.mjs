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
  'blog/traditional-to-ai-open-platform/index.html',
  'blog/agent-memory-knowledge-base/index.html',
  'blog/agent-as-service-caller-open-platform/index.html',
  'blog/prompt-context-loop-engineering/index.html',
  'blog/all-in-personal-agent/index.html',
  'blog/agent-eval-methodology/index.html',
  'blog/harness-governance-scar-tissue/index.html',
  'blog/astra-computer-use-everything-use/index.html',
  'blog/personal-agent-as-my-os/index.html', 'ai/index.html',
  'ai/show-radar/index.html', 'contact/index.html',
];
const enRoutes = zhRoutes.map(r => r === 'index.html' ? 'en/index.html' : 'en/' + r);
for (const r of [...zhRoutes, ...enRoutes]) ok(`AC-1 route exists: ${r}`, fileExists(r), 'missing in dist');
ok('AC-1 404 page exists', fileExists('404.html'), 'missing 404.html');
ok('AC-1 llms.txt exists', fileExists('llms.txt'), 'missing llms.txt');

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

// ---- GEO: AI/search-readable metadata ----
ok('GEO article page has JSON-LD', /<script type="application\/ld\+json">/.test(post), 'missing JSON-LD script');
ok('GEO article JSON-LD includes BlogPosting/Person/BreadcrumbList',
   /"@type":"BlogPosting"/.test(post) && /"@type":"Person"/.test(post) && /"@type":"BreadcrumbList"/.test(post),
   'missing one schema type');
ok('GEO article metadata has truthful publish/modified dates',
   /<meta property="og:type" content="article">/.test(post)
   && /article:published_time" content="2026-06-24/.test(post)
   && /article:modified_time" content="2026-06-25/.test(post)
   && /"dateModified":"2026-06-25/.test(post),
   'missing or inconsistent article dates');
ok('GEO visible date matches frontmatter regardless of build TZ',
   post.includes('2026 · 06 · 24'),
   'monoDate shifted the day — check UTC accessors in content.ts');
ok('GEO article has related-reading paths',
   /相关阅读/.test(post) && /相关阅读[\s\S]*?href="\/blog\/[a-z-]+/.test(post),
   'missing related reading');
const llms = read('llms.txt') || '';
ok('GEO llms.txt lists site and articles',
   /Henson's Personal Site/.test(llms) && /Key Articles - Chinese/.test(llms) && /agent-as-service-caller-open-platform/.test(llms),
   'llms.txt missing expected content');
ok('GEO llms.txt lists AI practice and content dates',
   /AI Practice - Chinese/.test(llms) && /ai\/show-radar/.test(llms) && /Published: 2026-/.test(llms),
   'llms.txt missing projects or dates');
const rssZh = read('rss.xml') || '';
const rssEn = read('en/rss.xml') || '';
ok('GEO zh RSS feed exists with blog items',
   /<rss/.test(rssZh) && /<item>/.test(rssZh) && /zhuyawei\.com\/blog\/traditional-to-ai-open-platform\//.test(rssZh),
   'rss.xml missing or has no blog items');
ok('GEO en RSS feed exists with blog items',
   /<rss/.test(rssEn) && /<item>/.test(rssEn) && /zhuyawei\.com\/en\/blog\//.test(rssEn),
   'en/rss.xml missing or has no blog items');
ok('GEO RSS includes newly published post',
   /astra-computer-use-everything-use/.test(rssZh) && /astra-computer-use-everything-use/.test(rssEn),
   'published post missing from a feed');
// Henson selected this as the sole public Harness article on 2026-08-22.
ok('GEO RSS includes harness-governance-scar-tissue',
   /harness-governance-scar-tissue/.test(rssZh) && /harness-governance-scar-tissue/.test(rssEn),
   'new post missing from a feed');
ok('GEO RSS excludes drafts', !/draft-workflow-rework/.test(rssZh + rssEn), 'draft post leaked into feed');
ok('GEO pages advertise RSS autodiscovery',
   /type="application\/rss\+xml"[^>]*href="\/rss\.xml"/.test(read('index.html') || '')
   && /type="application\/rss\+xml"[^>]*href="\/en\/rss\.xml"/.test(read('en/index.html') || ''),
   'home <head> missing RSS alternate link');
const sitemap = read('sitemap-0.xml') || '';
ok('GEO sitemap has content-derived lastmod',
   /traditional-to-ai-open-platform\/<\/loc><lastmod>2026-06-25/.test(sitemap)
   && /mcp-vs-cli-agent-encapsulation\/<\/loc><lastmod>2026-07-10/.test(sitemap),
   'missing truthful content lastmod');

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
// The feed may include blog and AI items, but should not force category diversity:
// if the newest entries are all articles, the top rows should all be articles.

// ---- GATE 1: each entry has zh AND en ----
const pairs = [
  ['blog/traditional-to-ai-open-platform', 'en/blog/traditional-to-ai-open-platform'],
  ['blog/agent-memory-knowledge-base', 'en/blog/agent-memory-knowledge-base'],
  ['blog/agent-as-service-caller-open-platform', 'en/blog/agent-as-service-caller-open-platform'],
  ['blog/prompt-context-loop-engineering', 'en/blog/prompt-context-loop-engineering'],
  ['blog/all-in-personal-agent', 'en/blog/all-in-personal-agent'],
  ['blog/agent-eval-methodology', 'en/blog/agent-eval-methodology'],
  ['blog/harness-governance-scar-tissue', 'en/blog/harness-governance-scar-tissue'],
  ['blog/astra-computer-use-everything-use', 'en/blog/astra-computer-use-everything-use'],
  ['blog/personal-agent-as-my-os', 'en/blog/personal-agent-as-my-os'],
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
const zhKbPost = read('blog/agent-memory-knowledge-base/index.html') || '';
ok('AC-8 zh KB deep page links to /en counterpart',
   zhKbPost.includes('/en/blog/agent-memory-knowledge-base'), 'no link to en counterpart');
const enKbPost = read('en/blog/agent-memory-knowledge-base/index.html') || '';
ok('AC-8 en KB deep page links back to zh counterpart',
   /href="\/blog\/agent-memory-knowledge-base/.test(enKbPost), 'no link back to zh counterpart');
const zhAgentCallerPost = read('blog/agent-as-service-caller-open-platform/index.html') || '';
ok('AC-8 zh Agent-caller deep page links to /en counterpart',
   zhAgentCallerPost.includes('/en/blog/agent-as-service-caller-open-platform'), 'no link to en counterpart');
const enAgentCallerPost = read('en/blog/agent-as-service-caller-open-platform/index.html') || '';
ok('AC-8 en Agent-caller deep page links back to zh counterpart',
   /href="\/blog\/agent-as-service-caller-open-platform/.test(enAgentCallerPost), 'no link back to zh counterpart');
for (const prefix of ['', 'en/']) {
  const article = read(`${prefix}blog/astra-computer-use-everything-use/index.html`) || '';
  const counterpart = prefix ? '/blog/astra-computer-use-everything-use' : '/en/blog/astra-computer-use-everything-use';
  ok(`AC-8 Astra language switch: ${prefix || 'zh'}`, article.includes(`href="${counterpart}"`), 'counterpart missing');
  ok(`AC-2 Astra appears in latest: ${prefix || 'zh'}`, (read(`${prefix}index.html`) || '').includes('/blog/astra-computer-use-everything-use'), 'new article missing from home');
}
const zhPersonalOsPost = read('blog/personal-agent-as-my-os/index.html') || '';
ok('AC-8 zh Personal OS deep page links to /en counterpart',
   zhPersonalOsPost.includes('/en/blog/personal-agent-as-my-os'), 'no link to en counterpart');
ok('GEO Personal OS article uses explicit related-reading matches',
   zhPersonalOsPost.includes('/blog/harness-governance-scar-tissue')
   && zhPersonalOsPost.includes('/blog/agent-memory-knowledge-base'),
   'missing one of the editorially matched related articles');
const enPersonalOsPost = read('en/blog/personal-agent-as-my-os/index.html') || '';
ok('AC-8 en Personal OS deep page links back to zh counterpart',
   /href="\/blog\/personal-agent-as-my-os/.test(enPersonalOsPost), 'no link back to zh counterpart');
ok('AC-10 ChatGPT answer is visually separated from zh article body',
   /<blockquote[\s\S]*ChatGPT 的回答/.test(zhPersonalOsPost)
   && !zhPersonalOsPost.includes('下面不是厂商公开承认的战略'),
   'ChatGPT attribution is not separately formatted or stale framing remains');
ok('AC-10 zh conclusion includes AI landing the ideas',
   /AI 让我有能力把脑子里那些原本只能想想的东西一个个落地，真的太酷了/.test(zhPersonalOsPost),
   'new conclusion sentence missing');
ok('AC-10 English mirror separates ChatGPT answer and carries conclusion',
   /<blockquote[\s\S]*ChatGPT’s answer/.test(enPersonalOsPost)
   && /AI gives me the ability to turn ideas that used to stay in my head into things I can actually build/.test(enPersonalOsPost),
   'English revision is missing');

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
const aiDetails = (read('ai/show-radar/index.html')||'') + (read('ai/personal-site/index.html')||'') + (read('ai/multi-agent-workflow/index.html')||'');
ok('AC-9 AI detail pages show real media, not placeholders',
   /<img[^>]+src="\/ai\//.test(aiDetails) && !/示例|待替换/.test(aiDetails),
   'expected real /ai/ images and no 示例/待替换 placeholder labels');

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
if (fails.length) { console.log('FAILURES:'); fails.forEach(f => console.log(' - ' + f)); }
process.exit(fail ? 1 : 0);
