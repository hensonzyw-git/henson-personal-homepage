# Design (FINAL, authoritative) — personal-website-cc

> **This supersedes `design.md`** (the subagent's draft). The accepted design is the one
> Henson produced himself in **Claude Design**. Source files (read these to match exactly):
> - `design-source/claude-design.dc.html` — the editable component (x-dc format + `{{ }}` bindings)
> - `design-source/claude-design-offline.html` — self-contained rendered export (open to view)
> - `design-source/support.js` — the x-dc runtime (NOT needed in the Astro build)
>
> The build must **reproduce this design's look in real Astro**, then populate it with the
> sanitized real content from `content-draft.md`. Do not invent new visual language.

## How to read the source
The `.dc.html` is a single reactive component (Claude Design's `x-dc` format). `<sc-if>`
blocks are page/route conditionals; `{{ }}` are state bindings; `style-hover="…"` are hover
styles. In Astro these become **real routes, components, and CSS** — there is no x-dc runtime
in production. The `renderVals()` script at the bottom defines page state, the zh/en strings,
and the hero A/B/C toggle.

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

**Type** (fonts loaded via Google Fonts in the source `<helmet>`)
- Display / headings: **Newsreader** (serif, latin) + **Noto Serif SC** (中文). Weights 500/600.
  - NOTE: the source's `--display` var falls back to system fonts, but the helmet loads
    Newsreader + Noto Serif SC — the build SHOULD wire the real serif stack for the editorial look:
    `'Newsreader','Noto Serif SC',Georgia,serif`.
  - `headingStyle` prop default = **serif**. Use serif headings.
- Body / UI: **Hanken Grotesk** (latin) + **Noto Sans SC** (中文):
  `'Hanken Grotesk','Noto Sans SC',-apple-system,BlinkMacSystemFont,sans-serif`.
- Mono / labels / dates / kicker: **Space Mono** — used for eyebrows, dates, tags, meta.
- Headline sizes use `clamp()`: hero `clamp(40px,6.2vw,78px)`; page H1 `clamp(34px,4.4vw,52px)`;
  article H1 `clamp(32px,4vw,46px)`. Line-height 1.06–1.15 on big heads; `-0.01em` tracking.
- Mono eyebrows: 11–13px, `letter-spacing .08–.1em`, `text-transform:uppercase`, clay or muted.

**Layout / shape**
- Content max-width: **1180px**, side padding 40px (article/contact narrower: 720–820px).
- Sticky nav: 66px, `background:rgba(238,235,226,.86)`, `backdrop-filter:blur(12px)`, bottom hairline.
- Radius: cards 14–16px, stat tiles 12–14px, pills/buttons 999px, small chips 8px.
- **No drop shadows.** Depth comes from the paper/surface contrast + hairlines (Anthropic-style).
- Hover lift on module/cards: `transform:translateY(-2px)` + `border-color:clay`.
- Logo mark: a 13px clay square rotated 45° + "Henson" in serif.

## Pages to build (8 routes + states) — match source `<sc-if>` blocks

1. **Home (`/`)** — eyebrow + hero + **Latest** section (`#E7E3D7`, mixed Blog+AI feed, 3 items,
   date-desc, mono dates + clay/grey category pills) + **Modules hub** (2×2 cards: Writing, AI
   Practice, Projects, Resume). Hero has **3 variants A/B/C** — build ONE (chosen by Henson, see
   spec). The in-design A/B/C toggle and the "示例·待替换 / 设计探索" chrome are design-tool
   scaffolding — **do NOT ship the toggle**; ship the chosen hero only.
   - Hero A 宣言: centered big headline "把对 AI 的思考，做成能动手的东西。" + sub + 2 CTAs + 4-stat grid.
   - Hero B 编辑: 2-col, left headline "会动手做 AI，是这一代产品经理的分水岭。" + right evidence card.
   - Hero C 钩子+最新: 2-col, left headline "与其证明履历，不如展示思维密度。" + right "最新在想" list.
2. **Blog index (`/blog`)** — eyebrow, H1 "写下来的思考", date-desc list (mono date col + serif
   title + summary). `draft` excluded from production index.
3. **Blog detail (`/blog/[slug]`)** — 720px, back link, mono date+readtime, serif H1, prose
   (p/h2/ul/blockquote with clay left-border/code block `#26241F`).
4. **AI Practice index (`/ai`)** — eyebrow, H1 "动手做的 AI", 2-col card grid. Cards have a
   screenshot placeholder band (diagonal hatch) + 做了什么/怎么做/价值 rows. First card
   (本站本身 / Show Radar) gets clay border = featured. Includes a dashed **empty-state** tile.
5. **AI Practice detail (`/ai/[slug]`)** — full detail page (GATE 2 decision). Show Radar:
   facts card + 做了什么/怎么做/价值 + architecture & iOS screenshot placeholders.
6. **Projects index (`/projects`)** — eyebrow, H1 "职业产品工作", 3-col card grid (mono tag,
   serif title, one-liner).
7. **Project detail (`/projects/[slug]`)** — 760px, back link, hero placeholder band, then the
   **four-part frame** with numbered mono badges: 01 问题 / 02 决策·取舍 / 03 结果(含数据, 3-stat
   tiles) / 04 我的个人贡献. Badges 01/02 dark `#1F1E1B`, 03/04 clay.
8. **Resume (`/resume`)** — 820px, header with name + role + **PDF-pending disabled button**
   ("PDF 即将提供", `cursor:not-allowed`), sections 经历/教育/技能 (mono section labels, timeline
   grid 130px+1fr, skill pills).
9. **Contact (`/contact`)** — 720px, H1 "聊聊 AI 与产品", 3 cards (EMAIL/LINKEDIN/GITHUB) with
   mono labels + serif values + copy/open affordance. Placeholder = obvious fake values.
- **Footer** (all pages): dark `#26241F`, 3-col (brand+tagline / 导航 / 联系), bottom bar
  "© 2026 Henson" + "克制·编辑感·文字优先". Tagline line: "本站由 Astro + AI 协作构建".
- **EN fallback banner**: when lang=en and an entry lacks an English body, show the dark banner
  "EN · fallback … 暂无英文版" (maps to bilingual downgrade — but note GATE 1 decision is
  **每条强制中英双份**, so for shipped entries both langs exist; keep the banner component for
  any future gap).

## Bilingual (per GATE 1: every entry zh + en)
- Nav/UI strings: zh/en maps already in source `renderVals()` (ZH/EN objects). Reuse them.
- Chinese default at `/`; English mirror at `/en/...` preserving the current page.
- Every Blog/Project/AI content entry ships BOTH zh and en bodies (en may be a labeled draft
  translation). No language-incomplete entry in the index.

## Content
Visual structure = this design. Substance = `content-draft.md` (sanitized real KB material:
merchant-agent project, Show Radar, the 3 blog posts, home positioning). The design's demo text
(e.g. "数据洞察产品线") is generic placeholder — **prefer the richer sanitized real entries** from
content-draft.md where they map, keeping all privacy sanitization rules.

## Placeholder discipline (unchanged ACs)
Keep every "示例 · 待替换" / "PDF-pending" / empty-state / fake-contact-value labeled as
placeholder — do not pass placeholders off as real data. Strip only the design-tool-only chrome
(the A/B/C hero toggle and the "设计探索·首屏方向" bar).
