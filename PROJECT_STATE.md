# Project State — Personal Homepage

Last updated: 2026-08-07

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
- Published content: newest is `personal-agent-phase-one` (zh + en, 2026-08-07), a retrospective of the completed first phase of Personal Agent: coding-agent routing, Timeline/Session/Context design, governed Finance writes, production acceptance, eval gaps, backup/restore, and the next Development Agent Loop. The related kickoff article `all-in-personal-agent` (zh + en, 2026-08-03) is also published, alongside `prompt-context-loop-engineering`, `agent-as-service-caller-open-platform`, `agent-memory-knowledge-base`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

Latest validation: `npm run deploy:ecs` passed on 2026-08-07: production build and 69 acceptance checks passed, static files were synced to ECS, `nginx -t` passed, Nginx reloaded, and the public zh/en Phase One routes both returned HTTP 200.
