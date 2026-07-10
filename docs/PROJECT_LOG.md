# Project Log — Personal Homepage

## 2026-07-10 — GEO Freshness, Navigation, And Measurement

- Added optional truthful blog revision dates and wired them into visible metadata, JSON-LD `dateModified`, Article Open Graph metadata, and sitemap `lastmod`.
- Added bilingual related-reading paths to blog details and expanded generated `/llms.txt` coverage to AI-practice entries, repositories, and content dates.
- Date-stamped the MCP/CLI repository comparison and linked the two official repositories; replaced an unsourced context-cost percentage with Anthropic's published example and linked the relevant first-party tool-design guidance.
- Extended tracker-free Nginx reporting with named AI/search crawlers, crawler routes and status codes, and AI referrer domains.
- Deliberately skipped redundant visible author labels, expanded person/entity markup, RSS, IndexNow, FAQ conversion, and broad citation rewrites because the site's near-term purpose is a concise personal portfolio and judgment sample.

## 2026-07-06 — Server-Side Traffic Stats

- Added `scripts/traffic-stats.mjs` and `npm run stats:traffic` for basic visit reporting from ECS/Nginx access logs.
- Kept the public site frontend tracker-free; the script reports page views, approximate IP-based unique visitors, top pages, referrer domains, status codes, and daily page views, while filtering static assets, common bots, and non-site probe paths.
- Documented the operational workflow in `docs/traffic-stats.md` and linked it from the deploy docs and README.
- Recorded the decision that basic traffic stats come from server logs rather than frontend analytics scripts.

## 2026-07-06 — GEO Metadata And llms.txt

- Added JSON-LD support to `BaseLayout` and blog detail pages.
- Blog article pages now emit a schema graph with `BlogPosting`, `Person`, and `BreadcrumbList` nodes for AI/search-readable metadata.
- Added a generated `/llms.txt` endpoint that lists the site's core topics, Chinese articles, English article mirrors, and key pages.
- Added AC checks for `/llms.txt` and article JSON-LD.
- Validation: `npm run build && node test/ac-checks.mjs` passed with 53 checks.

## 2026-07-01 — Article: Agent as Service Caller

- Added and published a bilingual blog entry `agent-as-service-caller-open-platform`:
  - Chinese: `src/content/blog/agent-as-service-caller-open-platform.zh.md`
  - English mirror draft: `src/content/blog/agent-as-service-caller-open-platform.en.md`
- Article thesis: open platforms already know how to manage admission, permission, environment, and runtime boundaries; when agents become service callers, the platform also needs a verifiable per-action execution boundary for high-risk operations.
- Revised the article after editorial review:
  - compressed repeated OAuth/scope and trusted-confirmation framing;
  - added a clearly simulated price-change vignette to ground the opaque-channel problem;
  - preserved the first-party vs third-party Agent competition-boundary judgment as a core strategic claim;
  - clarified the relationship between capability tiering, pending action, and server-side risk control.
- Added AC route, pairing, and language-switch coverage for the new article.
- Validation: `npm run build && node test/ac-checks.mjs` passed with 49 checks after the revision.

## 2026-06-28 — Article: Agent Memory + Personal Knowledge Base

- Added and published a bilingual blog entry `agent-memory-knowledge-base`:
  - Chinese: `src/content/blog/agent-memory-knowledge-base.zh.md`
  - English mirror draft: `src/content/blog/agent-memory-knowledge-base.en.md`
- Article thesis: Agent memory should be externalized from product-specific chat memory into a shared, auditable context layer. Knowledge base handles long-term context; project git handles execution context.
- Added strong public compliance boundaries: company documents, internal materials, business data, meeting notes, company Feishu/spreadsheets, and sensitive context that can be traced back to internal projects must never enter the personal knowledge base or private sync repository.
- Added four article images under `public/blog/agent-memory-knowledge-base/`:
  - `kb-tree.png` — raw/wiki/published structure
  - `kb-index.png` — index as knowledge map
  - `kb-log.png` — operation log as audit trail
  - `kb-rules.png` — rules/schema page for Agent maintenance
- Validation: `npm run build && node test/ac-checks.mjs` passed after adding the new article routes to AC coverage. Local `npm install` was needed first because `@astrojs/sitemap` was declared but missing from `node_modules`.

## 2026-06-28 — Cross-Machine Context Files

- Added `AGENTS.md`, `PROJECT_STATE.md`, `docs/DECISIONS.md`, `docs/PROJECT_LOG.md`, and `docs/HANDOFF.md`.
- Clarified that this repo is included in cross-machine project context sync, while `hensonzyw-git/hensonzyw-git` is the excluded public GitHub profile repository.

## Existing Context

- Astro static site with bilingual Chinese/default and English routes.
- Design references live under `docs/design/`.
- Public site currently avoids exposing private career project material.
