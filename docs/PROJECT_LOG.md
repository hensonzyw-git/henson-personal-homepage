# Project Log — Personal Homepage

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
