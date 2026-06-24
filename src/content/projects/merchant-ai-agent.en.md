---
key: merchant-ai-agent
lang: en
title: B2B merchant AI agent (0→1, multi-agent architecture)
date: 2025-12-01
tag: 0 → 1 · B2B · multi-agent
oneLiner: Helping B2B merchants cut decision and operational cost with an AI agent, standing up a multi-agent architecture from 0 to 1.
period: 2024 – 2025
problem: Help B2B merchants lower the cost of operating decisions and operations (e.g. pricing management) with an AI agent. A new problem with high reliability demands — a mistake in a high-risk write operation lands directly on the merchant's business.
decisions: High-risk write operations go through "pause-confirm-execute" + multi-layer staleness checks + server-side re-validation; reliability lives in code, not in the prompt. After validation, the write-operation direction was deliberately halted (a quarter-scale negative conclusion). The evaluation system was rebuilt from scratch. Locking down data definitions became a precondition for kicking off the AI assistant.
result: The bid-management agent went into internal testing; the evaluation system was rebuilt into sustainable operation; the write-operation direction reached a clear negative conclusion (a methodology bought with a quarter of sunk cost); user research design was completed.
contribution: As product owner, set direction, boundaries and technical tradeoffs; independently diagnosed a technical incident (attributing all-zero evals to the measurement layer); used frontline business knowledge to calibrate AI-proposed solutions.
stats:
  - { value: "internal", label: "bid-management agent (sample)" }
  - { value: "rebuilt", label: "evaluation system (sample)" }
  - { value: "quarter", label: "directional conclusion (sample)" }
sample: true
draftTranslation: true
---

> Real metrics / company names are withheld in V1; the stats are labelled samples. For the detailed methodology see the blog posts "No competitor does it — opportunity, or everyone hit the wall?" and "All-zero evals aren't a broken system."
