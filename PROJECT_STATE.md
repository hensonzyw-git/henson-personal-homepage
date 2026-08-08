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
- Published content: `prompt-context-loop-engineering` (newest, 2026-07-11; records the first real iCloud-to-Xiaohongshu run with fuzzed restaurant identity and no spend amount, the two-tier scan/dispatch trigger, one-shot upload state, bounded verification, human publish checkpoint, and knowledge-base sync; links to the privacy-scrubbed public repository `hensonzyw-git/social-media-publish-loop`), plus `agent-as-service-caller-open-platform`, `agent-memory-knowledge-base`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- Pending publication: `personal-agent-phase-one` (zh + en, 2026-08-07) records the completed first phase of Personal Agent: coding-agent routing, Timeline/Session/Context design, governed Finance writes, production acceptance, eval gaps, backup/restore, and the next Development Agent Loop. Public release is approved and will include both language routes, the blog index, RSS, sitemap, and `/llms.txt`.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

Latest validation: `npm run build && node test/ac-checks.mjs` passed with 66 checks on 2026-08-07 after preparing the bilingual `personal-agent-phase-one` publication. The Astro dev server returned HTTP 200 for both its zh and en routes.
