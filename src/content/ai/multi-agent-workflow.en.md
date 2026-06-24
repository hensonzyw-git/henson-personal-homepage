---
key: multi-agent-workflow
lang: en
title: Multi-Agent Workflow
date: 2026-06-23
updated: 2026-06-23
oneLiner: A supervised, semi-autonomous pipeline that turns "a goal" into "accepted code" — one orchestrator decomposes and schedules, five specialist agents do the work, and it stops at three fixed human gates (PRD, design, real-device).
tag: AI ops practice
featured: true
repo: https://github.com/hensonzyw-git/multi-agent-workflow
facts: Claude Code / Codex as orchestrator + 5 specialist sub-agents (`.claude/agents/`); `spec.md` single source of truth + 3 fixed human gates (PRD / design / real-device); already used to build the personal site and Show Radar 0→1.
did: A reusable multi-agent pipeline — an orchestrator + five specialist agents (prd-writer / designer / coder / reviewer / tester); both this site and Show Radar were taken 0→1 with it.
how: spec.md as the single source of truth, injected on every cold-start handoff to stop context loss; judgment / taste set as three fixed human gates to catch errors upstream; cross-model review (Claude Code × Codex catching each other's bugs).
value: Turns AI coworking from "drop a goal and wait for a result" into a controllable "one orchestrator + a few human-in-the-loop checkpoints" flow; what it distills is the AI-era PM's core method — define constraints, design the collaboration protocol, make the call at the key gates.
placeholderLabel: pipeline diagram
cardImage: /ai/multi-agent-workflow/pipeline.svg
cardImageMode: cover
hasDetail: true
archImage: /ai/multi-agent-workflow/pipeline.svg
draftTranslation: true
---

This is the "meta-tool" behind my other AI practices — a supervised pipeline that pushes "a goal" through to "accepted code." You give a goal; Claude Code or Codex acts as the orchestrator, decomposing it and scheduling specialist agents, and stops at three key checkpoints for my sign-off. Both this site and Show Radar were built with it.

## First principles: the bottleneck isn't "can you spawn agents"

Break the process all the way down and the bottleneck in multi-agent collaboration is never "how many agents can you spawn" — it's three constraints: context is lost at every handoff, judgment and taste can't be outsourced, and errors compound in an autonomous chain. This workflow is designed against those three, not around "the more agents the better."

## Single source of truth + fixed human gates

- One orchestrator (Claude Code / Codex) maintains `spec.md` as the single source of truth, injecting it into every sub-agent on cold start — handoffs stop losing context.
- Five specialist agents divide the work: prd-writer → designer → coder ‖ reviewer ‖ tester (an implement / review / test loop).
- Three fixed human gates: GATE 1 confirm the PRD (highest ROI), GATE 2 skim the design, GATE 3 real-device acceptance. They catch errors upstream so downstream work isn't wasted.

## A real pitfall: visual generation is the weak link

The most obvious pitfall while building this site was the designer stage: having the agent generate mockups from a "designer persona" worked poorly — the output was either generic or invented layouts with no basis. I ended up going back to Claude Design to produce the mockups by hand, then fed the final design into the pipeline as the baseline. The takeaway is clear: in this workflow, generating visuals / taste from scratch is the weakest link; the designer agent is better at translating an existing mockup into layout, states and interaction specs than at making the visual call for you. Which is exactly why GATE 2 (a human skim of the design) has to stay.

## Cross-model review

After the PRD and after coding, hand the `spec.md` / diff to a different model to surface flaws — different models catch each other's bugs, and that's the real payoff of running both Claude and Codex. (Show Radar's "Codex implements → Claude Code reviews → Codex re-checks" loop is one instance of it.)

## Why it's a sample of PM ability

The most valuable thing here isn't the scripts — it's that it makes concrete what an AI-era PM actually does: not writing code, but defining constraints, designing the cross-agent collaboration protocol, and making the call at a few key gates with judgment. The site you're looking at is the first thing it produced.

v1 has Claude Code / Codex share one spec protocol and agent prompts; next I want to wire the cross-model review / test nodes into automatic parallel steps.
