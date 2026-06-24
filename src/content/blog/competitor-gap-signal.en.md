---
key: competitor-gap-signal
lang: en
title: "\"No competitor does it\" — opportunity, or everyone hit the wall?"
date: 2026-05-28
category: Product judgment
readMins: 7
summary: The quality of exploratory work shows in the price you pay to hit the wall. A methodology bought with a quarter of sunk cost — how to tell, in a few hours before kickoff, whether an "empty market" is an opportunity or a trap.
draft: false
draftTranslation: true
---

When a B2B merchant AI-agent project kicked off, competitive research found that across the whole industry, almost only one mature SaaS had built "write operations." I read that as "write operations are the core of an agent — this is the opportunity," and on that judgment I invested two-plus months of development, only to find it unworkable: the write primitives were never turned into services, and the collaboration framework couldn't hold. That isn't cheap trial-and-error — it's a quarter-scale directional sunk cost, which is exactly why the lesson is worth keeping.

## The methodology

- "No competitor does it" is a two-faced signal — it can mean opportunity, or it can mean everyone hit the wall. The moment you see it, the next question must be: "did they not think of it, or could they not do it?" Some companies succeed not because they "own the full stack" (everyone does), but because their ecosystem forced their external APIs to be polished by outside developers for years. In platform companies, write logic often lives inside each team's UI flows — "the company owns the full stack" ≠ "my team can use it" (Conway's law).
- **You can't pre-decide the conclusion, but you can move validation earlier.** Before kickoff, spend a few hours on three high-signal questions: who consumes this API today (only your own frontend → likely a BFF endpoint, awkward for an agent everywhere); is there dry-run / preview capability; is the permission model per-operation or per-page. These three won't tell you "go," but they often tell you "shaky" in advance.
- Resolve the irreducible uncertainty by ordering: pull the highest-risk write call out of the chain and do an end-to-end spike first, before any feature work. You'll still hit the wall — but in week one, not two-plus months later.

> On mindset: "falsified in hindsight" ≠ "wrong at the time." Negative knowledge (this path is blocked + the reason is X) is itself an output.
