---
key: this-site
lang: en
title: Personal site
date: 2026-06-18
updated: 2026-06-25
oneLiner: "A vibe coding project built through a multi-agent workflow: this site, made to carry future writing and project showcases."
tag: personal vibe coding
featured: true
repo: https://github.com/hensonzyw-git/henson-personal-homepage
did: Built as an Astro static site, content via Markdown content collections.
how: Fed the PRD to the model, generating structure and components in conversation.
value: A content home that accumulates over time, and a natural piece of evidence.
facts: Astro static site (Chinese default / English mirror), content via Markdown content collections; system fonts + self-hosted Space Mono, no external font CDN. Structure and components generated through PRD + AI collaboration.
placeholderLabel: site build screenshot · placeholder
cardImage: /ai/this-site/this-site-home.png
hasDetail: true
screens: [Home, AI Practice, About me]
screenImages: [/ai/this-site/this-site-home.png, /ai/this-site/this-site-ai.png, /ai/this-site/this-site-about.png]
---

This site is itself my first AI practice — "turning ideas into something hands-on through AI collaboration," with the site as its own evidence. More than the tech stack, what's worth telling is *how* it got built, and a few judgment calls along the way that AI can't make for you.

## Not hand-coded: a reusable multi-agent pipeline

The site wasn't written line by line — it was taken from 0→1 with a reusable multi-agent workflow: an orchestrator breaks down the goal, then delegates "write PRD → design → implement → review → test," stopping at three human gates (PRD, design, acceptance) for my sign-off. The spec is the single source of truth throughout. For the same goal I also ran one version on Codex and one on Claude Code as an A/B, then picked the better one as the mainline. My role isn't writing code — it's defining constraints, making trade-offs at each gate, and deciding which version wins.

## A bug that only shows up in your own browser

The lesson most worth recording came from fonts. I first loaded a few webfonts via a Google Fonts `<link>` — the build was all green and CI passed, but in my own browser the whole site silently fell back to system fonts, because Google Fonts is blocked in China. Digging in, the approved design spec used system fonts all along; those webfonts were just leftovers. So I settled on "system fonts + only self-hosted Space Mono," and the bundled woff2 count dropped from 621 to 6. The principle it left: **for China-facing projects, self-host fonts and assets by default — don't depend on a Google CDN**; and a "green build, wrong local render" bug only surfaces in your own environment — that's a step AI can't take for you.

## Pay down tech debt while the principal is small

Early in v1 I upgraded Astro one major at a time, 4 → 5 → 6 → 7, each step with a build + acceptance assertions + an isolated commit for easy rollback; the only real breaking change was the content-collections migration in v6. The logic is simple: the earlier the project and the thinner the code, the smaller the tech-debt principal; wait until integrations get heavy and you'll be three majors behind and afraid to touch it.

## A public site carries only public facts

A public repo means hard boundaries: salary, job-hopping strategy, and specific company metrics from my knowledge base never make it onto the site; the hero uses framings like "years / industry breadth / manager + IC" that don't expose any employer data. That also drove deliberate deviations from the original design spec — no résumé PDF, no public work projects, and the corresponding source files deleted from the repo ("in a public repo, only deleting the source actually takes it offline"). The design spec is a historical reference; the real source of truth is the spec and the code.

This site will keep growing — every iteration you're looking at (including this AI-practice entry itself) is recorded in its git history.
