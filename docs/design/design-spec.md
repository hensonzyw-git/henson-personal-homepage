# Design (CURRENT, authoritative) — personal-website-cc

> This file is the current implementation contract for the public Astro site.
> The Claude Design source files are preserved as historical design references:
> - `docs/design/claude-design.dc.html` — editable x-dc source
> - `docs/design/claude-design-offline.html` — self-contained rendered export
> - `docs/design/support.js` — x-dc runtime, not part of production
>
> The public site has intentionally diverged from the original design source in a few product
> decisions: Projects are not public, Resume is named About me, contact values are real, and
> there is no public PDF download entry.

## How to read the source
The `.dc.html` is a single reactive component (Claude Design's `x-dc` format). It is useful for
understanding the original visual direction, but not for current routing/content truth. In Astro
these concepts are represented as real routes, components and CSS. There is no x-dc runtime in
production.

## Design tokens (extract verbatim — these ARE the system)

**Color**
- Paper / page bg: `#EEEBE2`
- Surface / card bg: `#F7F5EF`
- Latest section bg (slightly darker band): `#E7E3D7`
- Dark bands (footer, EN banner, code blocks): `#26241F` (text `#cfcabd` / `#e6e2d6`)
- Ink (primary text): `#1F1E1B`
- Body text on light: `#2b2a26` / `#3a3833`
- Secondary text: `#5C594F`, `#65625A`
- Muted / meta: `#8A867B`
- **Clay accent: `#C15F3C`**, hover `#A94E30`; tints `rgba(193,95,60,.06/.18/.5)`
- Hairlines: `rgba(31,30,27,.08 / .1 / .12 / .16)`

**Type**
- Display / headings: system sans stack:
  `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif`.
- Body / UI: system sans stack:
  `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', sans-serif`.
- Mono / labels / dates / kicker: **Space Mono** — self-hosted via `@fontsource`, used for
  eyebrows, dates, tags, meta and code.
- No Google Fonts runtime dependency. Fonts must be bundled same-origin for reliability in China.
- Headline sizes use `clamp()`: hero `clamp(40px,6.2vw,78px)`; page H1 `clamp(34px,4.4vw,52px)`;
  article H1 `clamp(32px,4vw,46px)`. Line-height 1.06–1.15 on big heads; `-0.01em` tracking.
- Mono eyebrows: 11–13px, `letter-spacing .08–.1em`, `text-transform:uppercase`, clay or muted.

**Layout / shape**
- Content max-width: **1180px**, side padding 40px (article/contact narrower: 720–820px).
- Sticky nav: 66px, `background:rgba(238,235,226,.86)`, `backdrop-filter:blur(12px)`, bottom hairline.
- Radius: cards 14–16px, stat tiles 12–14px, pills/buttons 999px, small chips 8px.
- **No drop shadows.** Depth comes from the paper/surface contrast + hairlines (Anthropic-style).
- Hover lift on module/cards: `transform:translateY(-2px)` + `border-color:clay`.
- Logo mark: a 13px clay square rotated 45° + "Henson" in display/system sans.

## Public Routes

1. **Home (`/`)** — eyebrow + hero + **Latest** section (`#E7E3D7`, mixed Blog+AI feed, 3 items,
   date-desc, mono dates + clay/grey category pills) + **Modules hub** (3 cards: Writing, AI
   Practice, About me). Hero variant A only; the A/B/C toggle and design-exploration chrome are
   not shipped. Hero evidence is shown as 3 compact credential tags:
   `10 年开放平台产品`, `多行业 · 跨阶段 · 国际化`, `管理 + 一线能力`.
2. **Blog index (`/blog`)** — eyebrow, H1 "写下来的思考", date-desc list (mono date col + display
   title + summary). `draft` excluded from production index.
3. **Blog detail (`/blog/[slug]`)** — 720px, back link, mono date+readtime, display H1, prose
   (p/h2/ul/blockquote with clay left-border/code block `#26241F`).
4. **AI Practice index (`/ai`)** — eyebrow, H1 "动手做的 AI", 2-col card grid. Cards have a
   screenshot placeholder band (diagonal hatch) + 做了什么/怎么做/价值 rows. Featured cards get
   a clay border. Includes a dashed **empty-state** tile.
5. **AI Practice detail (`/ai/[slug]`)** — full detail page (GATE 2 decision). Show Radar:
   facts card + 做了什么/怎么做/价值 + architecture & iOS screenshot placeholders.
6. **About me (`/resume`)** — route remains `/resume` for compatibility, but UI copy is
   "关于我 / About me". 820px layout, name + role, short-version chip, sections 经历/教育/技能
   (mono section labels, timeline grid 130px+1fr, skill pills). No public PDF download entry.
7. **Contact (`/contact`)** — 720px, H1 "聊聊 AI 与产品", 3 cards (EMAIL/LINKEDIN/GITHUB) with
   mono labels + display values + copy/open affordance. Values are real public contact links.
8. **404 (`/404.html`)** — simple zh fallback page with home/blog CTAs.
- **Footer** (all pages): dark `#26241F`, 3-col (brand+tagline / 导航 / 联系), bottom bar
  "© 2026 朱亚威 (Henson)" + "克制·编辑感·文字优先". Tagline line:
  "本站由 Astro + AI 协作构建".
- **EN fallback banner**: when lang=en and an entry lacks an English body, show the dark banner
  "EN · fallback … 暂无英文版" (maps to bilingual downgrade — but note GATE 1 decision is
  **每条强制中英双份**, so for shipped entries both langs exist; keep the banner component for
  any future gap).

## Bilingual (per GATE 1: every entry zh + en)
- Nav/UI strings: zh/en maps already in source `renderVals()` (ZH/EN objects). Reuse them.
- Chinese default at `/`; English mirror at `/en/...` preserving the current page.
- Every Blog/AI content entry ships BOTH zh and en bodies (en may be a labeled draft
  translation). No language-incomplete entry in the index.

## Content
Visual structure = this design. Substance lives in:
- `src/data/home.ts` — home positioning and module navigation
- `src/data/resume.ts` — public-safe About me timeline, education and skills
- `src/data/contact.ts` — real public contact links
- `src/content/blog/*.md` — bilingual writing entries
- `src/content/ai/*.md` — bilingual AI practice entries

Work project pages are intentionally removed from the public site. Do not reintroduce `/projects`
without an explicit product decision.

## Placeholder discipline
AI screenshots, architecture diagrams, draft practice entries and empty states may keep
"示例 · 待替换" / `placeholder` labels. Resume PDF and fake contact placeholders are no longer
part of the public site. Strip design-tool-only chrome such as the A/B/C hero toggle and
"设计探索·首屏方向" bar.
