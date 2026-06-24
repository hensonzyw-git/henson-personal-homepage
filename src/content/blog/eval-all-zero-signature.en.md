---
key: eval-all-zero-signature
lang: en
title: "All-zero evals aren't a broken system — they're a measurement-layer bug's signature"
date: 2026-04-09
category: Writing
readMins: 6
summary: I inherited a test suite where every case scored 0, so the whole eval got abandoned. But the system was in daily use — it can't be all wrong. All-zero is the signature of a scorer that never matched. An attribution framework for agent evals.
draft: false
draftTranslation: true
---

The previous test suite ran, but every case scored 0, so the entire evaluation system was abandoned and the team was left with no evals. The retro verdict: the system is used daily, it can't be all wrong — all-zero means the scorer never matched, end to end. The problem is in "how the expected values are written and scored," not in the system under test.

## A reusable attribution framework

- A multi-agent system's expected tool trajectory must include routing transfers, nested wrappers and internal tools — write expectations as if it were a single agent and exact-sequence matching will inevitably score zero.
- For flows with a "pause and wait for confirmation" step, the eval script must feed the confirmation back, or every case stalls at the confirmation step.
- Free-text output can't be scored by exact string match — score at structured handoff points instead.
- The iron rule of eval infrastructure: unit/integration mocks with zero dependencies, one command to run, in CI, with ownership — the previous version died because all four were missing.

> Fastest diagnosis: take any one case and diff the actual trajectory against the expected, side by side. The root cause usually shows up in the first line.

Side by side it's obvious — the expected value omitted the routing transfer, so exact-sequence matching is off from the very first step and scores 0 throughout:

```text
expected: [search, answer]
actual:   [transfer_to_specialist, search, answer]
                                    ^ expected missing this step → sequence skew → score 0
```

Add the transfer node back to the expected trajectory and score at the handoff point — the scores recover immediately.
