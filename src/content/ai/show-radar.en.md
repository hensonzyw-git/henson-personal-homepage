---
key: show-radar
lang: en
title: Show Radar
date: 2026-06-13
oneLiner: Turns concert listings scattered across ticketing platforms into a personal intel radar you check once a day — a backend continuously scrapes, an LLM scores and classifies, and an iOS app surfaces only what's worth attention and not yet expired, tunable by natural-language feedback.
tag: personal vibe coding
featured: true
facts: ~4 weeks (2026-05-15 → 2026-06-13), 39 commits, ~13.5k net lines; ECS + FastAPI + daily collection + DeepSeek preference scoring + a SwiftUI iOS client.
did: Multi-source listings → scrape → LLM structuring → dedupe → preference scoring → summary → iOS.
how: Decouple scraping from extraction with fixtures, wire up the easiest source first, abstract the system as a "data pipeline" not "real-time monitoring", dare to cut the detail page, hybrid cloud/local architecture, write the PRD as a collaboration protocol for AI, and cross-review with multiple models (implement / find faults / re-check).
value: Proof that an AI-era PM can push a real need through AI coworking into a runnable, deployable, narratable data product. The most valuable output isn't the code — it's the hands-on method for how a PM manages information flow and quality control between agents.
placeholderLabel: iOS screenshot · placeholder
hasDetail: true
draftTranslation: true
---

A real personal need — "I want to know which shows are worth seeing, but the info is scattered across a dozen platforms and often already expired" — pushed through AI coworking to runnable, deployable, narratable.

The architecture diagram and iOS screenshots below are placeholders, to be replaced with real assets once cleared of any IP / privacy concerns.
