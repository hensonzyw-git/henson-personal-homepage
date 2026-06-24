---
key: show-radar
lang: en
title: Show Radar
date: 2026-06-13
updated: 2026-06-13
oneLiner: Turns concert listings scattered across ticketing platforms into a personal intel radar you check once a day — a backend continuously scrapes, an LLM scores and classifies, and an iOS app surfaces only what's worth attention and not yet expired, tunable by natural-language feedback.
tag: personal vibe coding
featured: true
facts: ~4 weeks (2026-05-15 → 2026-06-13), 39 commits, ~13.5k net lines; ECS + FastAPI + daily collection + DeepSeek preference scoring + a SwiftUI iOS client.
did: Multi-source listings → scrape → LLM structuring → dedupe → preference scoring → summary → iOS.
how: Decouple scraping from extraction with fixtures, wire up the easiest source first, abstract the system as a "data pipeline" not "real-time monitoring", dare to cut the detail page, hybrid cloud/local architecture, write the PRD as a collaboration protocol for AI, and cross-review with multiple models (implement / find faults / re-check).
value: Proof that an AI-era PM can push a real need through AI coworking into a runnable, deployable, narratable data product. The most valuable output isn't the code — it's the hands-on method for how a PM manages information flow and quality control between agents.
placeholderLabel: iOS screenshot · placeholder
cardImage: /ai/show-radar/show-radar-today.png
cardImageMode: phone
hasDetail: true
archDiagram: true
archImage: /ai/show-radar/architecture.svg
screens: [Daily digest, All shows, Preferences, Settings]
screenImages: [/ai/show-radar/show-radar-today.png, /ai/show-radar/show-radar-all.png, /ai/show-radar/show-radar-prefs.png, /ai/show-radar/show-radar-settings.png]
draftTranslation: true
---

A real personal pain — "I want to know which shows are worth seeing, but the info is scattered across a dozen platforms and often already expired" — pushed through AI coworking all the way to runnable, deployable, narratable. Below is the part of these four weeks that's worth more than the "what."

## Four weeks, five stages

Day one didn't start with an app — it started by breaking the problem into a data pipeline: use fixture data to sidestep anti-scraping and validate the core value chain (LLM extraction) first, then circle back to Damai's login state and risk controls. Next, wire up the easiest sources first (Showstart, Moretickets) to reach the "it actually pinged me" moment, then add harder ones layer by layer. Then turn the local script into a FastAPI service running daily on an ECS box; build a SwiftUI iOS client so the work has a surface you can consume; and finally make taste tunable with a single sentence — the profile updates synchronously while a re-score of up to 500 historical shows runs in the background.

A few calls along this line mattered more than the code: treat the system as a "data pipeline," not "real-time monitoring" — once a day is enough, which avoids being dragged by a noun into building a real-time system; dare to cut the show detail page — the digest is only the discovery layer, purchasing decisions go back to the original platform; put easy sources in the cloud and keep hard ones (Damai) on a logged-in local browser for assisted capture, then sync — letting each constraint find its right place.

## The incident most worth recording: a mockup that dragged implementation off course

The iOS UI work hit a classic multi-agent collaboration trap: to look "more complete, more like a real product," the design agent invented a batch of feature entry points with no backend behind them and outside scope; the coding agent trusted the upstream mockup by default and turned those fake entry points into real logic — the UI and the data contract drifted apart, and the app crashed outright. The root cause wasn't one agent writing buggy code; it was a collaboration chain with no executable product boundary — an upstream hallucination becomes a downstream dev task.

The fix was to roll back the unstable direction and rewrite a **PRD aimed at the design AI and the coding AI**: not just what to build, but explicitly what *not* to build — only 4 tabs, no detail page, no push (so no fake toggles), every clickable UI must have real feedback, and the backend is the single source of truth. After that I locked in a multi-model review loop: Codex implements, Claude Code does the code review, then back to Codex to re-check those review comments and converge on the fixes. Once that loop was running, code problems dropped noticeably.

This is also the one thing the project most wants to say: an AI-era PM's value doesn't disappear — it migrates from "writing requirements for people" to "defining constraints, designing the collaboration protocol, and getting multiple agents to work against one shared source of truth."
