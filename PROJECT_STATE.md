# Project State — Personal Homepage

Last updated: 2026-08-22

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
- Newest publication: `harness-governance-scar-tissue` (zh + en, 2026-08-21; revised 2026-08-22) — a six-layer comparison of Claude Code's exposed product scale, DeepSeek Harness, the later-opened Codex harness/App Server, and the actual Personal Agent design. It stays entirely on Personal Agent's implemented Finance path: product/framework, runtime loop, tool boundary, context/memory, permission/HITL, and evidence/recovery. Each layer reconstructs a real product decision through options considered, the selected path, rejected alternatives, concrete rules, accepted cost, and later evidence. Coding Graph Loop material remains reserved for a later standalone article. Henson selected this version as the sole public Harness article; the two earlier same-material pairs, `agent-harness-teardown` and `harness-failure-direction`, were removed on 2026-08-22. Preceding published content: `agent-eval-methodology` (zh + en, 2026-08-16), `personal-agent-phase-one` (zh + en, 2026-08-07), and `all-in-personal-agent` (zh + en, 2026-08-03), alongside `prompt-context-loop-engineering`, `agent-as-service-caller-open-platform`, `agent-memory-knowledge-base`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

Latest validation and deployment: `npm run deploy:ecs` passed on 2026-08-22 after selecting `harness-governance-scar-tissue` as the sole Harness article and removing two older duplicate pairs. It rebuilt the static site, passed all 76 checks, updated ECS, validated and reloaded Nginx, and verified the public zh/en article routes. The superseded article routes return 404.
