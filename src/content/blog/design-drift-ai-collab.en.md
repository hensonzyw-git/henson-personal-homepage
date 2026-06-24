---
key: design-drift-ai-collab
lang: en
title: "When the design drifts the build: the boundary a PM must hold in AI collaboration"
date: 2026-02-17
category: Writing
readMins: 5
summary: A real incident — the design agent invented features with no backend, the coding agent turned fake entry points into real logic, and the app broke. The root cause wasn't one agent's bad code, but a collaboration chain missing an executable product boundary.
draft: false
draftTranslation: true
---

On the Show Radar project there was a "design drifts the build" incident, sanitized and safe to share: the design agent took it upon itself to invent a feature with no backend support, the coding agent treated that fake entry point as a real requirement and wrote real logic for it, and the app broke.

My conclusion after the retro: **the root cause wasn't one agent writing bad code — it was the whole collaboration chain lacking an executable product boundary.**

## A PRD is a collaboration protocol in AI coworking

In AI coworking, a PRD isn't a formal document — it's a cross-agent collaboration protocol. Its job is to make the design agent improvise less, the coding agent misread less, and review have a standard to judge against.

- The design agent will "reasonably complete" any blank space; the PRD must mark which spaces are blanks and which are off-limits.
- The coding agent will implement anything that looks like a requirement; the PRD must say which entry points are placeholders and which are real logic.
- Review needs a source of truth to check against, or it's left going on feel.

> A new PRD must write both "what to do" and "what not to do." In AI collaboration, "what not to do" often prevents incidents better than "what to do."
