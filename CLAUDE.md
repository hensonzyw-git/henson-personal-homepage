# CLAUDE.md — Henson Personal Homepage

Project-level rules for any agent working in this repo. Follow the existing code, design
tokens, and conventions below verbatim — do not invent new patterns, colors, or fonts.

> The identical file is mirrored as `AGENTS.md`. Edit both together so any agent runtime
> reads the same rules.

---

## 1. What this is

A bilingual (Chinese default / English mirror) **static personal site** for Henson (朱亚威),
an open-platform product manager. Hook: "思考 + AI 实践". Built with **Astro 7**, `output: 'static'`.

- **No backend, no client framework, no DB.** Plain `.astro` components + scoped `<style>` +
  a little vanilla JS for progressive enhancement (clipboard copy, TOC scroll-spy, external-link
  targeting). Do not add React/Vue/Tailwind/a CSS framework or a UI library.
- **No drop shadows** (one deliberate exception: the phone-mockup image on AI cards). Depth comes
  from paper/surface contrast + hairlines (Anthropic-style restraint).
- Fonts are **self-hosted** via `@fontsource/space-mono`. **Never** add a Google Fonts `<link>` /
  preconnect or any external font/CDN — those are blocked/unreliable in mainland China, which is a
  hard requirement here.

## 2. Commands

```bash
npm install
npm run dev                # dev server (astro dev)
npm run build              # build to dist/
npm run preview            # preview the build
node test/ac-checks.mjs    # acceptance-criteria self-check — run AFTER build, against dist/
npm run sync:kb            # mirror PUBLISHED content (zh) → knowledge base published/ corpus
```

The `published/` mirror in the knowledge base is a **read-only, grep-able corpus** of shipped
content — the site repo stays the single source of truth (`scripts/sync-kb.mjs` regenerates the
mirror from scratch each run; never hand-edit the mirror). It runs automatically via a committed
`.githooks/post-commit` hook. **On each machine, enable the hook once:**
`git config core.hooksPath .githooks`. The script resolves the KB via `$KB_DIR`
(default `/Users/admin/henson-knowledge-base`) and skips silently if the KB isn't present, so
commits never break on a machine/CI without it.

There is no linter/formatter/unit-test runner configured. The **only** automated gate is
`test/ac-checks.mjs`, which asserts against built HTML in `dist/`. After any change that could
affect routes, content, the home Latest feed, bilingual pairing, contact values, or AI media,
run `npm run build && node test/ac-checks.mjs` and keep it green.

## 3. Structure

```
src/
  pages/        routes — zh at /, en mirrored under /en, plus 404. Thin wrappers only.
  layouts/      BaseLayout.astro — the single shell (html/head/nav/main/footer)
  components/   page + section components (all visual structure + scoped CSS lives here)
  content/      blog/ + ai/ markdown collections — EVERY entry ships <slug>.zh.md AND <slug>.en.md
  data/         home.ts / resume.ts / contact.ts — typed copy keyed by Lang
  lib/          i18n.ts (lang + UI strings + path helpers), content.ts (pairing/sort/format)
  styles/       global.css (design tokens + shared primitives), fonts.ts (self-hosted webfont)
public/ai/...   real screenshots / SVG diagrams referenced from content frontmatter
docs/design/    historical Claude Design source + design-spec.md (reference only; see §10)
test/           ac-checks.mjs
```

Path alias: `@/*` → `src/*` (tsconfig). Relative imports are used throughout existing code;
match the surrounding file.

## 4. Routing & i18n (the core invariant)

- **Chinese is the default language served at `/`. English is mirrored under the `/en` prefix.**
  Every zh page has an en twin: `src/pages/about.astro` ↔ `src/pages/en/about.astro`, etc.
- A page is a **thin wrapper**: import `BaseLayout` + the relevant component, pass `lang` and a
  `canonicalPath`. All real markup/styling lives in the component, rendered for both langs.
- **`canonicalPath` is always the zh (canonical) path**, e.g. `/about`, `/ai/show-radar` — the
  same value on both the zh and en page. `Nav` uses it to build the language-switch link so the
  toggle stays on the same page. Get it right or the language switch breaks.
- Build hrefs with the helpers in `src/lib/i18n.ts`: `localePath(lang, path)` (prefixes `/en`
  for en), `switchLangPath(toLang, canonicalPath)`, `htmlLang(lang)`. In components the idiom is
  `const p = (path: string) => localePath(lang, path);` then `href={p('/blog')}`.
- All UI strings live in the `UI` map in `i18n.ts` (`t(lang)` to read). **Do not hard-code
  user-facing English/Chinese in components** — add to `UI` or to the per-component `copy` object
  pattern (see `AIIndex`/`BlogIndex`, which keep an inline `lang === 'en' ? {…} : {…}`).
- Adding a new page = add BOTH `src/pages/foo.astro` and `src/pages/en/foo.astro`, link it in
  `Nav.astro` + `Footer.astro` (both use the same nav keys), and add its routes to the AC check.

> Note: the route for the résumé is **`/about`** (file `about.astro`, nav label 关于我 / About me).
> The older `docs/design/design-spec.md` still says `/resume` — the code is the source of truth.

## 5. Content collections

Defined in `src/content.config.ts` (Zod schemas). Two collections: `blog`, `ai`. Loaded via
Astro's `glob` loader from `src/content/<collection>/`.

**GATE 1 — every entry ships both languages.** One markdown file per language, named
`<slug>.<lang>.md`, sharing the **same `key`** in frontmatter. `src/lib/content.ts` pairs the two
halves by `key`. If only one language exists, `pickLang` falls back to the other and flags it
(`EnFallbackNote` renders a banner) — but shipped V1 content must have both.

Frontmatter rules (enforced by the schema — read it before adding fields):
- Both: `key`, `lang` (`'zh'|'en'`), `title`, `date` (coerced), `summary`/`oneLiner`.
- `draft: true` excludes a blog entry from the **production** index (still visible in dev). AI
  entries have no draft exclusion.
- AI entries are data-rich: `updated` (last-updated, falls back to `date`; AI index sorts by it),
  `tag`, `featured` (clay border), `repo` (GitHub URL → link on card + detail), `facts`,
  `did`/`how`/`value` (the 做了什么 / 怎么做 / 价值 rows), `hasDetail` (gates whether `/ai/[slug]`
  is generated AND whether the home feed links to it vs. the `/ai` index).
- AI media is **data-driven**: `cardImage` + `cardImageMode` (`'phone'` narrow device on a
  backdrop, or `'cover'` fill), `archImage`/`archDiagram`, `screens` (captions) +
  `screenImages` (real srcs, parallel array). A real image overrides the hatched placeholder
  band; absent → placeholder with `placeholderLabel` / `示例 · 待替换`.
- Put real media under `public/ai/<slug>/…` and reference it by absolute `/ai/...` path.

Detail routes (`/ai/[slug]`, `/blog/[slug]`) use `getStaticPaths` over the paired collection.
AI `[slug]` pages are only generated for `hasDetail: true` entries (both zh and en variants).

## 6. Content/data helpers (`src/lib/content.ts`)

- `getBlogIndex(lang)` / `getAIIndex(lang)` — paired, lang-picked, draft-filtered, sorted
  (blog: `date` desc; AI: `aiUpdated` desc).
- `getLatest(lang, 3)` — the home "最新动态" mixed feed: blog + AI merged, newest 3, date-desc.
  Blog rows always link; AI rows link to `/ai/[slug]` only when `hasDetail`, else to `/ai`.
- `monoDate(d, sep=' · ')` / `monoDateShort(d)` — the mono `2026 · 06 · 13` date format used
  everywhere. Use these; don't format dates inline.

## 7. Design tokens — use the CSS variables, never raw values

All tokens live in `:root` in `src/styles/global.css`. **These ARE the system; do not introduce
new hex values, new spacing scales, or new font stacks.** Reference them as `var(--token)`.

**Surfaces:** `--paper #EEEBE2` (page) · `--surface #F7F5EF` (cards) · `--band #E7E3D7` (Latest
section + code-block surface) · `--hatch #E6E2D6` (placeholder) · `--dark #26241F` (footer / facts card / EN banner).

**Ink/text:** `--ink #1F1E1B` (primary) · `--body #2b2a26` / `--body-2 #3a3833` (article body) ·
`--muted #5C594F` / `--muted-2 #65625A` (secondary) · `--meta #8A867B` (meta/labels).

**Clay accent (the one accent color):** `--clay #C15F3C`, `--clay-hover #A94E30`, plus
`--clay-06/-18/-50` tints. Used for: eyebrows, links in prose, primary buttons/CTA, the rotated
logo square, active TOC item, featured-card border, pills.

**Hairlines:** `--line-08/-10/-12/-14/-16` (`rgba(31,30,27,.08…)`). Borders/dividers use these,
not solid greys.

**Type stacks:** `--display` (system sans, weight 600 for headings), `--sans` (system sans, body/UI),
`--mono` ('Space Mono' — eyebrows, dates, tags, meta, code, section labels). System fonts are
intentional (SF Pro / PingFang via `-apple-system`); only Space Mono is vendored.

**Layout:** `--container 1180px`, `--pad-x 40px` (→ 22px under 860px). Article/contact columns are
narrower (720–900px) set locally.

## 8. Shared CSS primitives (in `global.css`) — reuse before inventing

`.container` (max-width + side padding) · `.eyebrow` (mono uppercase clay kicker) · `.mono` ·
`.display` · `.btn` + `.btn-primary` / `.btn-ghost` (pill buttons) · `.sample-chip`
(dashed clay "示例 · 待替换") · `.hatch` (diagonal placeholder band) · `.lift` (hover:
border→clay + translateY(-2px)) · responsive `.grid-2/3/4` collapse at 860px.

Component-local conventions seen repeatedly — match them:
- `.pill` + `.pill-clay` (white-on-clay) / `.pill-grey` for category tags.
- Radii: cards 14–16px, small tiles 12–14px, pills/buttons 999px, code/facts 12–14px.
- Hover: list rows use a gentle zoom `transform: scale(1.018)` (no background change); cards use
  `.lift`. Transitions ~.12–.18s ease.
- The single responsive breakpoint is **`@media (max-width: 860px)`** (plus 1100px for the blog
  TOC). Multi-col grids collapse to 1 column there. Keep new responsive rules at these breakpoints.

## 9. Component / styling conventions

- Each `.astro` component owns its markup + a scoped `<style>` block. Global rules (tokens,
  primitives, prose) live in `global.css` / `Prose.astro`; everything else is scoped.
- Rendered Markdown is wrapped in `<Prose>` (`src/components/Prose.astro`) — editorial typography
  (18px/1.75 body, display h2/h3, clay-bordered blockquote, light-gray `--band` code blocks
  via a Shiki `css-variables` palette tuned for the light surface). Don't restyle prose ad hoc;
  extend `Prose.astro`.
- External links: in prose they auto-open in a new tab (script in `Prose.astro`); elsewhere set
  `target="_blank" rel="noopener"` explicitly (see `Footer`, `AIIndex` repo link).
- Vanilla JS only, in small `<script>` blocks, always progressively enhanced (the no-JS path must
  work — e.g. contact copy falls back to the `mailto:` href). No bundled client libraries.
- Keep comments at the density of the surrounding files — existing code documents the *why*
  (China font constraint, GATE decisions, fallback intent). Preserve that.

## 10. Product guardrails (don't silently undo these)

- **No public Projects/work pages.** Work-project material stays private — do not reintroduce a
  `/projects` route or work content into nav/routes/collections without an explicit decision.
- **About me exposes no public résumé PDF download.** Full résumé is "available on request" only.
  (AC-3 fails if a PDF reference appears.)
- **Contact values are real and must resolve** (email `hensonwork@foxmail.com`, the LinkedIn and
  GitHub URLs in `src/data/contact.ts`). No `example.com` / placeholder contact values. The footer
  shows the email under the label "Mail", not the raw address.
- Placeholder discipline: AI screenshots/diagrams/draft entries/empty states may keep
  `示例 · 待替换` / `placeholder`. Strip design-tool-only chrome (the A/B/C hero toggle, the
  "设计探索" bar) — only Hero variant A ships.
- `docs/design/` is **historical reference**, not current truth. Where it conflicts with the code
  (e.g. `/resume` vs `/about`, footer tagline copy), the code wins.

## 11. Definition of done for a change

1. Both zh and en stay in sync (pages, content pairs, UI strings).
2. Colors/fonts/spacing use existing tokens & primitives — no new raw values.
3. `npm run build` succeeds.
4. `node test/ac-checks.mjs` is green (update the AC list when you intentionally add/rename a
   route or content entry).
5. Responsive check at ≤860px (grids collapse, nav wraps, no horizontal overflow).
6. No external network dependency added (fonts, CDNs, trackers).
