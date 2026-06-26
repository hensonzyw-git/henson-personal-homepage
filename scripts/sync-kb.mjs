// Mirror the site's PUBLISHED content into the knowledge base as a read-only,
// grep-able corpus (goal: one local place to search everything Henson has shipped).
//
// The site repo (src/content/) is the ONLY source of truth. This script
// regenerates $KB_DIR/published/ from scratch each run, so renames/deletes on
// the site propagate and no zombie files linger. Never hand-edit the mirror.
//
// Scope: Chinese (.zh.md) only — en is a translation, redundant for search.
// Filters: blog `draft: true` is skipped (not published); AI entries all ship.
//
// Portability: the KB lives in a separate repo whose path varies per machine.
// Resolve it from $KB_DIR, falling back to the default checkout. If the KB
// isn't present (CI, a machine without it), skip silently and exit 0 so the
// post-commit hook never blocks a commit.

import { existsSync, readdirSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://zhuyawei.com';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const kbDir = process.env.KB_DIR || '/Users/admin/henson-knowledge-base';

if (!existsSync(kbDir)) {
  console.log(`[sync-kb] KB not found at ${kbDir} — skipping (set KB_DIR to override).`);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);

// Read the frontmatter block and pull a few scalar fields we need to route on.
function parse(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = m[1];
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim();
  return { text, key: get('key'), draft: get('draft'), hasDetail: get('hasDetail') };
}

// Inject provenance into the existing frontmatter (single valid block) and
// keep the original content verbatim below it.
function withProvenance(text, { source, url }) {
  const banner =
    `generated: true            # auto-mirrored from the site repo — DO NOT EDIT here\n` +
    `source: ${source}\n` +
    `canonical_url: ${url}\n` +
    `synced_at: ${today}\n`;
  return text.replace(/^---\n/, `---\n${banner}`);
}

const collections = [
  { name: 'blog', urlPath: (slug) => `${SITE_URL}/blog/${slug}` },
  // AI gets its own page only when hasDetail; otherwise it lives on the index.
  { name: 'ai', urlPath: (slug, e) => (e.hasDetail === 'true' ? `${SITE_URL}/ai/${slug}` : `${SITE_URL}/ai`) },
];

let written = 0;
for (const { name, urlPath } of collections) {
  const srcDir = join(repoRoot, 'src', 'content', name);
  const outDir = join(kbDir, 'published', name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.zh.md'))) {
    const entry = parse(join(srcDir, f));
    if (!entry?.key) continue;
    if (name === 'blog' && entry.draft === 'true') continue; // unpublished draft
    const source = `src/content/${name}/${f}`;
    const out = withProvenance(entry.text, { source, url: urlPath(entry.key, entry) });
    writeFileSync(join(outDir, `${entry.key}.md`), out);
    written++;
  }
}

console.log(`[sync-kb] mirrored ${written} published file(s) → ${join(kbDir, 'published')}`);
