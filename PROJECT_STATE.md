# Project State — Personal Homepage

Last updated: 2026-09-08

## Current Status

This repo is Henson's personal homepage built with Astro. It is separate from the public GitHub profile repository `hensonzyw-git/hensonzyw-git`.

The site is bilingual with Chinese as default and English mirror routes. It positions Henson as an open-platform PM with AI practice, writing, and side-project evidence.

## Source Of Truth

- Repo instructions: `AGENTS.md`
- Overview and run commands: `README.md`
- Design artifacts: `docs/design/`
- Long-term decisions: `docs/DECISIONS.md`
- Milestone log: `docs/PROJECT_LOG.md`
- Next-agent handoff: `docs/HANDOFF.md`

## Current Product Shape

- 首页 / About: positioning hook, proof points, latest updates, and navigation hub.
- Writing: long-form AI/product/judgment writing.
- AI Practice / Side Projects: tools, prompts, automation, and the site itself.
- About me: resume-like background, education, and skills.
- Contact: email, LinkedIn, GitHub.
- Newest publication: `personal-agent-as-my-os` (zh + en, 2026-09-02) — a personal argument that the durable layer should be a user-owned Personal Agent, while coding, browser, and research agents remain replaceable capability providers. It grows out of the unfinished Coding Graph Loop work and makes three boundaries explicit: vendor strategy is Henson's inference rather than a disclosed fact; “supplier” does not mean agents are interchangeable commodities; and capability growth must stay governed, auditable, and reversible. The article explicitly matches `harness-governance-scar-tissue` and `agent-memory-knowledge-base` as related reading. Preceding published content: `harness-governance-scar-tissue` (zh + en, 2026-08-21; revised 2026-08-22), `agent-eval-methodology` (zh + en, 2026-08-16), `personal-agent-phase-one` (zh + en, 2026-08-07), and `all-in-personal-agent` (zh + en, 2026-08-03), alongside `prompt-context-loop-engineering`, `agent-as-service-caller-open-platform`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- The current deployed revision of `personal-agent-as-my-os` visibly separates the ChatGPT response from Henson's prose, keeps the response in one continuous left-bordered block, and adds the conclusion that AI makes it possible to turn ideas into real things.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Release Candidate — Authorized, Deployment In Progress

- `astra-computer-use-everything-use` (zh + en, 2026-09-08) is prepared locally from `/Users/admin/article-drafts/astra-computer-use-everything-use-v1.md`. Chinese prose is preserved, the draft marker is removed, and internal links are localized. The English mirror follows `draftTranslation: true`.
- Related reading explicitly matches the two open-platform articles cited in the body. The Artificial Analysis source was checked against the supplied scores and coding-task efficiency claims.
- Local build: 41 pages; acceptance checks: 92 passed, 0 failed. Browser preview checked both languages at 1280px and 390px; no page-level horizontal overflow or browser errors observed. Wide tables use the existing mobile scroll behavior.
- Preview: `http://127.0.0.1:4321/blog/astra-computer-use-everything-use/` and its `/en` mirror. Preview server remains available for review.
- Not deployed. Production remains on the September 2 release. Wait for Henson's explicit authorization for this candidate before `npm run deploy:ecs`; do not sync the candidate into the published KB corpus before release.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

Latest validation and deployment: `npm run deploy:ecs` passed on 2026-09-02 after publishing the revised `personal-agent-as-my-os`. It rebuilt 39 static pages, passed all 85 checks, updated ECS, validated and reloaded Nginx, and verified the site routes, RSS feeds, and `/llms.txt` with HTTP 200. Desktop and 390px browser checks found no overflow or console errors.

- September 8 preview edit: replaced the unexplained DAL abbreviation with “我的自动开发 loop” and the English equivalent. This candidate still awaits release authorization.

- September 8 table fix: shared `Prose.astro` now wraps tables at build time, preserving native table layout and moving horizontal overflow/borders to the wrapper (D13). The earlier page-overflow check missed the internal blank area reported by Henson. Rechecked table/head widths and screenshots at 820px, 390px, and desktop in zh/en; build and all 92 AC checks pass. Still local only.

- September 8 editorial follow-up: removed the abrupt ten-year open-platform experience introduction from both languages, connecting the interface question directly to the two earlier articles. Deployment remains pending authorization.

- Release authorization received on September 8: Henson explicitly requested commit, push, merge, ECS deployment, and knowledge-base persistence for the reviewed final version. Earlier pending-authorization notes above are historical; deployment verification is now in progress.
