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
- Newest publication: `astra-computer-use-everything-use` (zh + en, 2026-09-08), deployed after explicit review authorization. It explores agent interfaces and adaptation to human environments, with bounded personal review evidence.
- Preceding publication: `personal-agent-as-my-os` (zh + en, 2026-09-02) — a personal argument that the durable layer should be a user-owned Personal Agent, while coding, browser, and research agents remain replaceable capability providers. It grows out of the unfinished Coding Graph Loop work and makes three boundaries explicit: vendor strategy is Henson's inference rather than a disclosed fact; “supplier” does not mean agents are interchangeable commodities; and capability growth must stay governed, auditable, and reversible. The article explicitly matches `harness-governance-scar-tissue` and `agent-memory-knowledge-base` as related reading. Preceding published content: `harness-governance-scar-tissue` (zh + en, 2026-08-21; revised 2026-08-22), `agent-eval-methodology` (zh + en, 2026-08-16), `personal-agent-phase-one` (zh + en, 2026-08-07), and `all-in-personal-agent` (zh + en, 2026-08-03), alongside `prompt-context-loop-engineering`, `agent-as-service-caller-open-platform`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- The current deployed revision of `personal-agent-as-my-os` visibly separates the ChatGPT response from Henson's prose, keeps the response in one continuous left-bordered block, and adds the conclusion that AI makes it possible to turn ideas into real things.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Latest Release — 2026-09-08

- `astra-computer-use-everything-use` is live in zh/en. The approved edits replace DAL with “我的自动开发 loop” and remove the ten-year career introduction. Related reading matches the two open-platform articles cited in the body.
- Shared prose tables retain native sizing within a build-time scroll wrapper (D13), correcting the narrow-layout blank area. Desktop, 820px and 390px browser checks passed.
- Article commit `80b4485` merged via `bb0ad52` and pushed to `origin/main`. Henson explicitly authorized commit/push/merge, ECS deployment and KB persistence after review.
- Knowledge-base sync regenerated 15 published files; the original architecture wiki page now links to the publication, with index and operation-log updates committed as `d782503`.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Basic traffic stats use ECS/Nginx access logs via `npm run stats:traffic`; the public frontend remains free of analytics trackers.

## Validation State

September 8 deployment passed: 41 static pages, 92/92 acceptance checks, Nginx validation/reload, and HTTP 200 for home, article indexes, both article languages, RSS and llms.txt. Both live article HTML files, both RSS feeds and llms.txt matched local build output byte-for-byte. The generated KB article body matches the Chinese source. No pending release authorization remains for this revision.
