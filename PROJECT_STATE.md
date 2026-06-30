# Project State — Personal Homepage

Last updated: 2026-07-01

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
- Published content: `agent-as-service-caller-open-platform` (zh/en draft mirror) about Agent-safe execution boundaries for open platforms, plus `agent-memory-knowledge-base`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.

## Validation State

Latest validation: `npm run build && node test/ac-checks.mjs` passed on 2026-07-01 with `agent-as-service-caller-open-platform` included in production routes.
