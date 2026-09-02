# Project Log — Personal Homepage

## 2026-09-02 — Published: Personal Agent as My OS

- Edited the supplied `personal-agent-as-my-os-draft-v0.3.md` into the published Chinese article `personal-agent-as-my-os`, preserving its personal narrative while clarifying three boundaries: vendor motives are Henson's inference rather than disclosed strategy; calling coding agents “suppliers” does not make them interchangeable commodities; and capability growth must remain governed, auditable, and reversible.
- Added a complete English mirror with the site's `draftTranslation: true` convention. Both versions link the memory, Personal Agent kickoff, Finance phase-one, and official OpenAI/Anthropic product evidence relevant to the argument.
- Added ordered `related` keys to the blog schema and resolver. The new article explicitly recommends `harness-governance-scar-tissue` and `agent-memory-knowledge-base`; older articles keep the strict same-category fallback.
- Extended AC coverage for the bilingual routes, GATE1 pair, RSS inclusion, language switching, and exact related-reading matches. `npm run build && node test/ac-checks.mjs` passed 82 / 82.
- Browser QA passed at 1280px and 390px: the long title wraps cleanly, the code tree stays within the reading column, mobile TOC behavior is correct, related links stack correctly, and there are no console errors or horizontal overflow.
- Deployed through `npm run deploy:ecs`; Nginx validation/reload succeeded and the Chinese article, English mirror, RSS feeds, and `/llms.txt` returned HTTP 200.

## 2026-08-22 — Harness article selected for publication

- Henson selected `harness-governance-scar-tissue` as the sole public article for the DSH / Claude Code / Codex Harness / Personal Agent comparison.
- Removed the two superseded same-material article pairs, `agent-harness-teardown` and `harness-failure-direction`, in both Chinese and English so the blog index, home feed, RSS, sitemap, `llms.txt`, and the generated knowledge-base mirror can carry one canonical version only.
- The knowledge-base `published/` directory remains a generated mirror; it is refreshed from the surviving site source rather than edited directly.
- Ran `npm run deploy:ecs`: the production build passed all 76 checks, assets were synchronized to ECS, Nginx configuration validated and reloaded, and the production Chinese and English article routes returned 200. The removed Chinese routes returned 404.

## 2026-08-22 — Harness article narrowed to Personal Agent's six responsibilities

- Revised `harness-governance-scar-tissue` in both languages after Henson found the article difficult to follow because Personal Agent runtime concepts and Coding Graph Loop concepts reused similar terms with different meanings.
- Removed the Coding Graph Loop and multi-agent-orchestration layer in full, including its three false-green development/evaluation stories, provider/reviewer vocabulary, exact-SHA workflow, and conclusion references. That topic is reserved for a standalone article after the loop is complete.
- Rebuilt the candidate around six layers that all use the implemented Finance path as the sole case: product/framework, runtime loop, tool boundary, context/memory, permission/HITL, and evidence/recovery. The introduction now explicitly distinguishes completed Finance work from future personal-workflow expansion.
- First reduced the Chinese body from roughly 12.9K to 9.0K characters to remove the Coding Graph Loop and overloaded vocabulary. After Henson found the remaining Personal Agent decision content too thin, expanded it to roughly 12.2K characters and 27 minutes using only Finance decisions rather than restoring the removed topic.
- Added an upfront six-decision matrix and rebuilt every layer around the same decision chain: options considered, selected path, rejected alternatives, concrete rules, accepted cost, and later verification. Key trade-offs now include framework speed vs runtime replaceability, immediate feedback vs write correctness, general MCP reuse vs bounded business consequences, continuous UX vs governed context, clean terminal state vs preserved evidence conflict, and delivery speed vs real-world proof.
- Tightened evidence language: independent review reduces shared-assumption risk rather than proving correctness; general harnesses provide execution mechanisms rather than defining domain completion. External-source wording now matches the cited Axios and current DSH documentation.
- Corrected the opening chronology after Henson's review: DSH opened first; the Codex harness/App Server opening discussed by this article came later. Removed the misleading sentence that blended the older public Codex CLI repository with the later harness-opening event.
- Local `npm run build` and `node test/ac-checks.mjs` passed: 76 / 76. Not deployed.

## 2026-08-21 — Harness article rebuilt as a seven-layer judgment comparison

- Replaced the Chinese and English bodies of `harness-governance-scar-tissue` with a substantial seven-layer comparison: product/framework, runtime loop, tool boundary, context/memory, permission/HITL, multi-agent orchestration, and evidence/recovery.
- Each layer now relates Claude Code's exposed product scale, Codex's open harness/App Server, and DSH's plugin/provider architecture to an actual Personal Agent design decision. It explicitly distinguishes reuse, independent convergence, and domain-specific divergence, and states where Personal Agent is narrower or shallower than the public systems.
- Expanded the project evidence beyond four incidents: the five-second `CommitUnknown`, Session contamination, the manual-review dead end, three false-green development/evaluation harnesses, production backup permission failures, the unsafe first read-only restore composition, and real iPhone-to-ledger acceptance.
- Kept the strategic conclusion concrete and non-competitive: public harnesses clarify which infrastructure can be reused or reduced, while idempotency, authority, receipts, human evidence, recovery, and completion standards remain locally defined for personal workflows.
- Corrected the project framing after Henson's review: Personal Agent's ambition is the unified entry point for personal data management, requirement management, and the Coding Graph Loop. Finance is the deliberately narrow first validation slice and pressure test, not the final product boundary.
- Removed the repo-internal acronym “DAL” from the public article. Its first occurrence now explains the development Agent loop as a Coding Graph Loop from requirement clarification through coding, independent review, verification, and human merge; later references use plain-language “开发 Agent 闭环”.
- External claims remain tied to OpenAI's Codex agent-loop and App Server posts, the `openai/codex` repository, DSH architecture/capability-seam documentation, and public reporting of the Claude Code source-map exposure. Local `npm run build` and `node test/ac-checks.mjs` passed: 76 / 76. Not deployed.

## 2026-08-20 — New Draft Pair: Harness Governance Scar Tissue (coexists with agent-harness-teardown)

- Wrote a second, independent article on the same DSH / Claude Code / Personal Agent comparison: `harness-governance-scar-tissue` (zh + en, `draftTranslation: true` on en). Henson's instruction: ignore the existing version, rewrite under a new name; he will keep exactly one of the two.
- Reframing: the earlier `agent-harness-teardown` organizes by "seven layers"; this one organizes by "seven questions" (shape / recovery ratio / gate placement / human exit / store-expose split / harness-as-field / record purpose), each ending on scar tissue rather than architecture description.
- Fact corrections vs the earlier draft, from source-level verification: dropped the unverifiable "1,371 notes" count (GitHub API shows directories, not counts); dropped the wrong manual-resolution fix date (2026-08-16; git says commit 2950b6c is 2026-08-04); replaced the unsourced "40 vs 47" story with the verified DEV-040 Session-pollution root cause (seq 53 DirectAnswer, `state=succeeded` fed back as model-visible history, four-step closeout, PROJECT_STATUS.md:2342–2369). Added newly verified details: the reasoning-sandwich numbers (xhigh 53.9% vs high 63.6% vs sandwich 66.5%), the exact 513,216-line / 1,884-file counts, and the 2026-08-14 transcript deployment date.
- AC coverage: added zh/en routes, GATE1 pair, and an RSS assertion for the new slug (a comment marks it as coexisting until Henson picks one). `npm run build && node test/ac-checks.mjs` → 76 passed.
- Not deployed; both harness articles currently build side by side in the blog index, home feed, RSS, sitemap, and llms.txt — expected state pending Henson's keep-one decision.

## 2026-08-16 — Published: Agent Eval Methodology Article

- Published the bilingual `agent-eval-methodology` article (zh + en). The Chinese original was un-drafted; the English mirror keeps the site-wide `draftTranslation: true` convention.
- Thesis: in Agent Eval, the hardest failure is not the measurement but knowing what you're measuring and what conclusion the numbers support — three kinds of "false green," statistical discipline (drifting denominators, single-run causal claims, per-metric stability), evidence binding, and a diagnosable/correctable/recyclable loop, cross-checked against τ-bench, LLM-as-judge calibration, and benchmark-audit literature.
- AC coverage: added the bilingual routes and GATE1 pair, and pointed the "newly published post" RSS assertion at the new slug. `npm run build && node test/ac-checks.mjs` → 72 passed.
- Fixed the deploy script's incomplete sudo migration: rsync now runs with `--rsync-path="sudo rsync"`, so the non-root `henson-admin` can write into the `root:www-data` target directory. (d52d364 had added sudo to chown/chmod/nginx but left the rsync step unprivileged — the first content-adding deploy after permission normalization then failed with "Permission denied".) Recorded as DECISIONS D10.
- Deployed to ECS via `npm run deploy:ecs`; verified the public zh and en article routes both return HTTP 200.

## 2026-08-07 — Published: Personal Agent Phase One Retrospective

- Published the bilingual `personal-agent-phase-one` article (zh + en). The Chinese version mirrors the current Personal Agent Phase 1 retrospective; the English mirror retains the site-wide `draftTranslation: true` convention.
- The article is live at `/blog/personal-agent-phase-one/` and `/en/blog/personal-agent-phase-one/`, and is included in the production blog index, RSS, sitemap, and `/llms.txt`.
- Validation and deployment: `npm run deploy:ecs` passed with 69 checks, synced static files to ECS, passed `nginx -t`, reloaded Nginx, and verified both public article routes with HTTP 200.

## 2026-07-11 — Article Diagrams, readMins Unification, Date Timezone Fix

- Replaced the Loop Engineering article's arrow-chain blockquotes with two token-styled SVG diagrams under `public/blog/prompt-context-loop-engineering/` (feedback loop; publish state machine with one-shot badge, rollback edge, and clay human gate), one file per language. Blockquotes trimmed from 11 to 6 genuine quotations.
- Added body cross-links from the article to `/ai/multi-agent-workflow` (false-green case) and the agent-memory article (knowledge-base sync), both languages.
- Unified `readMins` across all five article pairs using zh content chars / 1200: 14, 12, 21, 15, 15.
- Fixed a build-machine timezone bug: `monoDate`/`monoDateShort` used local accessors, so date-only frontmatter (UTC midnight) rendered one day early when built on a machine west of UTC — production had shipped with every visible date shifted. Switched to UTC accessors and added an AC guard asserting the visible date matches frontmatter (66 checks).
- Deployed to ECS; live pages verified for corrected dates, served SVGs, and cross-links.

## 2026-07-11 — Publish Loop Engineering Article

- Published `prompt-context-loop-engineering` (zh + en): set `date: 2026-07-11`, removed `updated` and `draft: true` from both language files.
- Final content pass before publication: the workflow diagram now includes `ready_for_draft` with draft validation; added the landed two-tier trigger structure (a low-cost model runs the read-only daily scan and dispatches a stronger model only when a draft or upload is pending, always stopping before the publish click) and the material-change rollback rule. Both languages stay in sync.
- Privacy pass: removed the restaurant name and spend amount from the first-run evidence in both languages; workflow counts (15→9 images, 539-character body, 7 topics) are retained as process evidence.
- AC coverage: added the bilingual routes and GATE1 pair, asserted the published post appears in both RSS feeds, and kept a draft-exclusion guard. `npm run build && node test/ac-checks.mjs` → 65 passed.
- Deployed to ECS via `npm run deploy:ecs` with post-deploy path verification.

## 2026-07-11 — Public Social Media Loop Repository

- Added the privacy-scrubbed `hensonzyw-git/social-media-publish-loop` implementation link to both language versions of the local Loop Engineering article.
- Documented that the public repository contains only the reusable state machine, CLI, tests, and generic setup guidance; personal configuration, runtime state, images, drafts, publication evidence, browser data, and knowledge-base content remain local.
- Kept both article files at `draft: true`; no site publication or deployment was performed.

## 2026-07-11 — First Real Social Media Loop Run

- Replaced the Loop Engineering article's pre-run Xiaohongshu hypotheses with evidence from the first real run, `2026-7 遇外滩`, while keeping multi-run reliability metrics explicitly unproven.
- Recorded the verified page result: 9 ordered images, title “遇外滩，四人 8836”, a 539-character body, and 7 topics; Henson retained and completed the final public-publish decision.
- Added the operational failure that dominated the run: Chrome was not foregrounded, so the file chooser showed 9 selected images while its Open action stayed unavailable. The workflow now requires a foreground preflight, a fixed diagnostic order, bounded retries, and minimal evidence reads.
- Clarified the durable completion boundary: `upload_started` blocks repeated upload side effects, `ready_for_final_review` records verified page state, `kb_sync_pending` records confirmed publication awaiting knowledge sync, and `archived` requires verified KB page, index, and log updates.
- Kept both language files at `draft: true`; no site publication or deployment was performed.
- Validation: `npm run build && node test/ac-checks.mjs` passed with 61 checks; the draft remains excluded from production output.

## 2026-07-10 — Local Draft: Prompt, Context, Harness, And Loop Engineering

- Added a bilingual, development-only blog draft at `prompt-context-loop-engineering` for editorial review.
- The Chinese article explains Loop Engineering through verifier quality, coding-loop suitability, product-work boundaries, scheduled automation, and an iCloud-to-Xiaohongshu personal workflow.
- Clarified that a timer is only a trigger: repeated execution becomes a loop only when observed outcomes affect the next decision.
- Added clearly labelled, falsifiable pre-run hypotheses for the iCloud-to-Xiaohongshu loop, including expected failure modes and four post-run metrics; none are represented as completed results.
- Kept the article at `draft: true`, so production routes, the public blog index, sitemap, and `/llms.txt` remain unchanged.
- Validation: `npm run build && node test/ac-checks.mjs` passed with 57 checks; browser QA passed at 1440px and 390px without overflow or console errors.

## 2026-07-10 — GEO Freshness, Navigation, And Measurement

- Added optional truthful blog revision dates and wired them into JSON-LD `dateModified`, Article Open Graph metadata, sitemap `lastmod`, and `/llms.txt`; the visible article header intentionally remains publication date + reading time.
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
