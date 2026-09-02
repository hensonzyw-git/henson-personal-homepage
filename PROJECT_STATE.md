# Project State — Personal Homepage

Last updated: 2026-09-02

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
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

Latest validation and deployment: `npm run deploy:ecs` passed on 2026-09-02 after publishing `personal-agent-as-my-os`. It rebuilt 39 static pages, passed all 82 checks, updated ECS, validated and reloaded Nginx, and verified both new article routes plus the home, blog indexes, RSS feeds, and `/llms.txt` with HTTP 200. Desktop and 390px browser checks found no overflow or console errors.
