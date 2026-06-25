---
key: traditional-to-ai-open-platform
lang: en
title: "From traditional to AI-era open platforms: when your caller stops being human"
date: 2026-06-24
category: Open Platform
readMins: 16
summary: "For a decade, open platforms optimized for how an experienced human would use them. When the caller becomes an Agent, what you measure, what you design, and how you verify all change. Three shifts learned by actually putting an Agent end-to-end on the POIZON Open Platform — plus an unromantic conclusion: the real bar isn't technical."
draft: false
draftTranslation: true
---

For a decade, the assumed caller of an open platform was a human developer: someone who reads the docs end to end, googles, retries against the error message, and fills in — from experience — whatever the docs left unsaid. The entire design — how docs are written, how endpoints are split, how errors are reported, how scopes are granted — was optimized around "how an experienced human would use it."

That caller is changing. More and more integrations aren't written by a person sitting down with the docs, but by handing an Agent a docs URL and asking it to "build the whole integration from this requirement." After actually running an Agent end-to-end on the POIZON Open Platform (Dewu's international open platform, "POP" below), my most direct takeaway is this: many traditional design assumptions don't merely fall a bit short in front of an Agent — they break outright.

To see why, you have to swap one mental model. By "Agent" here I don't mean every chatbot; I mean the development agent that receives open-platform docs, generates code, calls APIs, and tries to complete an integration task:

> **In the open-platform integration scenario, an Agent should not be treated as a "smarter user" — start by treating it as a code generator with limited context.** It doesn't infer background knowledge from experience; it can only consume semantics that are explicitly expressed; whatever you didn't write down, it treats as nonexistent; and it has neither the patience nor the context window to "read the whole site before acting."

From there: **an Agent's bottleneck isn't "how smart it is," it's "how much it costs, and whether it can — without a human — assemble the correct semantics."** Measure, redesign, verify — all three sections below revolve around that one sentence.

## 1. Measure: old metrics stay, but the headline metric is moving

First, what doesn't change. A mature open-platform metric system is already comprehensive, and it still holds in the AI era:

- **North star**: share of business value generated through the platform (platform GMV / revenue ÷ total business value) — it answers "why does the open platform exist."
- **Developer lifecycle**: signup → activation (first successful call, à la Stripe's Time to First Call) → retention → upgrade conversion → top-developer concentration. A declining retention curve, or top developers contributing >80%, are early signs of ecosystem decay.
- **API & stability**: call success rate, P50 / P99, 4xx (developer side) vs 5xx (platform side) distribution, rate-limit trigger rate, MTTR, SLA attainment.
- **Developer experience**: NPS, doc readability, ticket response, community activity.

None of this goes stale because AI arrived — it measures "ecosystem health," independent of whether the caller is a human or an Agent.

What the AI era genuinely adds is two things.

**First, an "AI-friendliness" dimension.** It sits parallel to the experience metrics but measures how smoothly machines consume the platform: structured-doc coverage (share of endpoints fully covered by an OpenAPI spec), MCP exposure rate, skill-file completeness, machine-parseable error-code rate (does the structure carry `error_code` / `error_type` — an Agent's auto-retry / fallback depends entirely on it). And one sharp proxy: **the gap between Agent call success rate and human call success rate**. When permissions, environment, and task inputs are roughly the same, the larger that gap is, the more it suggests your interface still relies on semantics only a human can supply.

**Second, and more importantly: the headline metric itself is moving.** The traditional headline asks "can a human get it working." The AI era asks —

> Hand an Agent a URL: can it build the integration **end-to-end, without a human**?

I call this new headline TSR (Task Success Rate). It's not the old "call success rate" renamed; each of its three design decisions was beaten out by real runs.

**1) The unit of measurement has to be the end-to-end scenario, not the atomic endpoint.** I paid tuition here: the first time, I scored "can a single endpoint be called given only the docs" — and in that doc-only atomic-endpoint test, POP's signing and core write endpoints were all 100%. It looked great and gave almost no signal. Because the real difficulty isn't in any single endpoint: it's which of 100+ APIs to pick, whether a field like `skuId` flows correctly across three or four endpoints, whether `price` is in cents or dollars. Those only surface across an end-to-end chain. **A single endpoint working proves the atomic endpoint is callable; it does not prove an Agent can complete a real integration task.**

**2) Beyond success rate, add a second orthogonal axis: token cost (tokens-to-success).** Easiest to overlook, yet it's the only visible measure of certain improvements. A real example: POP's docs site (open.poizon.com) is a JS-rendered SPA, so an Agent that only does HTTP GET pulls back an empty shell, can't read the parameter tables, and degrades to "screenshot + OCR" — same task, 10× the tokens. Turning the docs into fetchable plain-text endpoints **barely moves the success rate but cuts tokens by an order of magnitude.** If you only watch success rate, that improvement is invisible on your dashboard.

**3) Don't score 0/1 — use an autonomy ladder.** I grade recovery: fully autonomous / one nudge is enough / it needs code fed in / useless even then. The headline TSR counts only the "fully autonomous" tier, but the histogram across the whole ladder is the real diagnostic profile — it distinguishes "one hint short" from "no help works." Where it stalls maps to which layer is broken and what to fix — **scoring is itself diagnosis.**

## 2. Redesign: the four layers of Agent-friendliness

To raise TSR you work four layers bottom-up, foundation to surface — if the lower layer is untouched, any wrapper on top is just carpet over a broken road:

- **Layer 1 · Atomic capability (API Quality)** — foundation; every wrapper inherits it
- **Layer 2 · Semantic clarity** — close the field-name vs business-semantics gap
- **Layer 3 · Doc architecture (Navigation)** — for the Agent's limited context
- **Layer 4 · Callable interface** — remove dependence on browser operation

### 2.1 Layer 1 — Atomic capability (foundation)

Three things, each addressing a "human tolerates, Agent can't" point:

- **Consistent parameter naming platform-wide.** A human mentally merges `create_time` and `created_at`; an Agent builds the wrong field outright. One semantic concept, one name, everywhere.
- **Structured error returns.** Not just a `message` string. On error, an Agent has to decide between "retry with different params" and "abandon this path" — and that decision needs machine-readable `error_code` / `error_type` / `hint` in the error body.
- **Write endpoints idempotent by design, idempotency-key semantics explicit.** Orchestrating multi-step operations, an Agent fails far more often than a human, so idempotency is the foundation of safe retry. POP's consignment write endpoint (`enterprise-stock-apply/add`) has no idempotency key at all — the moment the Agent retries on failure, it double-lists.

**What about legacy endpoints whose fields are already a mess?** No platform with history escapes this. Naming consistency is a hard requirement for *new* endpoints; renaming existing ones in place is a breaking change you can't make. The pragmatic move is two steps:

1. **Establish a canonical vocabulary** that all new endpoints conform to — stop the bleeding so the mess doesn't keep growing.
2. **Don't fix legacy in place; normalize at the layer the Agent consumes.** Two routes: the light one — use Layer 2's gotchas plus a glossary to state explicitly "this field actually equals that canonical name, and here's the unit" (pure content, zero risk, never touches the API); the heavier one — add an alias-mapping layer in the outward-facing docs / IR / MCP that translates the messy real fields into a consistent vocabulary before exposing them. The underlying endpoint stays untouched; the Agent sees clean semantics.

In other words, **legacy burden isn't solved by "rewriting endpoints," it's solved by "adding a translation layer at the exposure surface"** — which is exactly why Layer 2's pure-content work has the highest ROI.

Why is this the foundation? Because whether the layer above is a CLI wrapper, an MCP server, or an Agent reading docs itself, they all ultimately call the same atomic APIs. The interface form is still converging, **but atomic API quality is the investment that won't go stale.**

### 2.2 Layer 2 — Semantic clarity (cheapest, highest ROI, P0)

This layer is pure content, no engineering dependency, yet it most directly moves the success rate. The core is making explicit the traps a human infers from experience but an Agent can't infer from a field name.

The three classic traps (all hit for real):

- `price` doesn't tell you the unit is cents vs dollars — \$154.00 must be sent as `15400`; sending `154` is off by 100×.
- `requestId` doesn't reveal it's the idempotency key unless you read the description.
- `oldQuantity` / `quantity` are snapshot values, not deltas — the field names give zero hint.

The fix is light, three parts:

1. **A "gotchas" block at the bottom of each endpoint**, spelling out semantic traps like the above one by one.
2. **One consolidated enums page.** All enums (order status, currency, country code, carrier) maintained in one place — never scattered across endpoint descriptions. Because when an Agent generates code for one endpoint, it simply can't see an enum definition sitting on some other endpoint's page.
3. **2–3 error-handling examples per endpoint.** About 30% of integration code is error handling, and an Agent can't conjure a platform's idiosyncratic error behavior out of thin air.

### 2.3 Layer 3 — Doc architecture (for limited context, P0)

A human can read 100+ APIs before deciding how to proceed; an Agent needs to know, before loading anything, "for my scenario I only read these 5." So the unit of organization shifts from "by API" to "by scenario."

Here's the key, easily-missed point: **a generic field-flow diagram is misleading to an Agent.** On a complex platform, one key field (say `skuId`) may have several source endpoints, and which one to use depends on the merchant's business context, not on the endpoint itself. A single diagram drawing all possibilities together is semantic ambiguity to an Agent.

The fix is a three-layer scenario Playbook:

- Layer one: scenario entry — "which kind of merchant am I" (has a brand article number, manual listing / already has skuId, bulk repricing / connects an ERP, auto-sync).
- Layer two: the in-scenario field flow — how this one path goes, with each field's source and destination uniquely determined.
- Layer three: links back to each endpoint's reference page.

The key principle: **the in-scenario flow must be uniquely determined** — don't make the Agent still choose "which endpoint do I use to get skuId" inside the Playbook. If there are multiple possible sources, split into multiple Playbooks. A concrete shape (brand article number → listing):

| Step | Action | Inputs | Output |
|---|---|---|---|
| 1 | Look up product by article number | `articleNumber`, `region` | `skuId` |
| 2 | Query recommended price | `skuId`, `biddingType`, `currency` | reference price |
| 3 | Submit listing | `skuId`, `price`, `quantity`, `requestId` (new UUID) | listing no. |

Where each step's inputs come from and what it produces are nailed down, no ambiguity — that is what "pushing the decision up into the doc architecture" means.

### 2.4 Layer 4 — Callable interface (let machines consume directly)

The last layer turns the docs and capabilities into a form machines consume directly. I took a detour here — and it's a design I overturned in this very article:

**I first wanted to build a proprietary fetch API** (something like `/docs/api/index.json` + `/docs/api/{id}.md`) so an Agent could pull everything in one GET. I scrapped it — **rather than invent a format only you understand, ride the ecosystem conventions that are already converging.** A homemade format has no discovery mechanism and no existing consumers; aligning with a standard is what gives you network effects.

So POP's direction is now to align first with the conventions Stripe has already established. This is not about copying Stripe's product shape; it is about reusing entry points and file conventions agents may already recognize, instead of inventing a private format only we understand:

- **Add `.md` mirrors to existing doc pages**: append `.md` to the URL (`apiDetail/170` → `apiDetail/170.md`), auto-generated from the endpoint config. Any Agent that only does GET gets plain text in one shot — no need to build it a bespoke index API.
- **`llms.txt`** (à la `docs.stripe.com/llms.txt`, served at `open.poizon.com/llms.txt`): the Agent's entry point, registering key paths and the API index, with the API part auto-updating from config.
- **The Agent Skills standard**: `/.well-known/skills/index.json` + `SKILL.md` (again mirroring Stripe), so an Agent installs the platform skill with one line: `npx skills add https://open.poizon.com`.
- **A glossary file `glossary.md`** (Chinese term / official English / one-line definition): one table to solve multi-language consistency, far cheaper than translating the whole doc set four times over.

Above all this come the OpenAPI spec and an MCP server — but their foundation is exactly this "align-with-standards, auto-generated" content layer.

**The order within this layer also matters enormously.** Laying the four layers out by "cost × metric":

| Priority | Layer | Action | Cost |
|---|---|---|---|
| P0 | L2 | per-endpoint gotchas | low (pure content) |
| P0 | L3 | scenario Playbooks | low (pure content) |
| P1 | L2 | error-handling examples | low (pure content) |
| P1 | L4 | `.md` mirrors / llms.txt / skill | medium (config + backend) |
| P1 | L1 | structured error codes | medium (interface change) |
| P2 | L4 | OpenAPI / MCP | high (systems work) |

**The two P0 items are pure content, zero engineering — do them immediately; invest in the engineering items only after content changes have proven their effect.** Going all-in on MCP up front sinks engineering into an unvalidated direction — which is exactly the operational meaning of "the API is the foundation, not the ceiling."

## 3. Verify: turn the framework into a score you can run

Anyone can write methodology; the hard part is proving the changes actually help, with numbers. So I operationalized the two pieces above (metrics + four layers) into an open-source behavioral benchmark ([open-platform-agent-readiness-benchmark](https://github.com/hensonzyw-git/open-platform-agent-readiness-benchmark)): start from a single URL, let the Agent build the integration end-to-end, and when it stalls, feed hints up a "hint ladder," then score by which rung it recovers at. Two uses — cross-platform comparison (Stripe / Shopify / WeChat / Feishu / Dewu), and measuring your own before/after delta. The latter is where the "shipped & measured" line on a résumé comes from.

Building that benchmark was itself a series of design decisions beaten out by real runs:

- **From "atomic endpoint" to "end-to-end scenario"** (as above: single endpoints were all 100% doc-only — no discrimination).
- **Renaming the headline from FPSR to TSR**: "first-pass" literally reads "passes on the first try," but the definition was actually "without human help" — name and substance didn't match, and an Agent self-corrects in a loop anyway. "Did it need trial and error" moves to the cost family's iterations-to-success.
- **Adding the token-cost axis** (the only visible measure of the L4 improvement's value).
- **0/1 to the A0–A4 autonomy ladder** (scoring is diagnosis).
- **The scenario set is a frozen "four-piece kit"**: intent / golden full-chain trace / step assertions / hint ladder — those four, not the score, are the benchmark proper.

Worth stressing: **the scoring model itself keeps iterating** (currently v0.3). None of the decisions above were clear from the start — each was overturned and reworked by real runs; so it's more a diagnostic tool that keeps growing than a one-shot leaderboard, and I'll keep moving it as I run it on more platforms and as the ecosystem conventions shift.

Run for real, the valuable part isn't the score — it's the facts it forced out, each landing precisely on one layer:

- POP's JS-SPA docs site, static GET returns an empty shell — an Agent that only GETs can't even read the parameter tables (an **L4 gap**).
- POP's own signing example **contradicts itself**: feeding the documented input doesn't reproduce the signature the doc claims; following it faithfully = 0% pass (an **L2 defect**, and the most trust-damaging kind).
- The core consignment write endpoint has no idempotency key (an **L1 gap**).
- And one in my own face: in the first version I fed the "required parameters" straight into the task and measured 100% pass — a "fake green" reproduced inside my own measurement rig. That forced two defenses into the benchmark: **guard against the harness leaking the answer, and against fishing for hints.** Otherwise you're just measuring the answer you fed in.

## 4. Wrapping up: the real bar isn't technical

Tying the three together: traditional open platforms optimize the experience of "a human reading docs and debugging"; AI-era platforms optimize the probability that "an Agent can build the integration without a human."

- **Measure**: keep all the old metrics, add an AI-friendliness layer, and swap the headline from "can a human get it working" to "end-to-end Agent TSR + token cost."
- **Redesign**: four layers bottom-up, do the two pure-content P0 items first, then invest engineering — remembering the API is the foundation, not the ceiling.
- **Verify**: use a behavioral benchmark to turn "did the change help" into a reproducible score, and force out the holes most worth fixing along the way.

But one unromantic reality to close on: **what actually blocks this is usually not technical.** P0 is pure content with zero engineering dependency and can still be hard to push through — that's an organizational-will problem, a "who owns the KPI for developer experience" problem. And the strongest before/after evidence depends on a real, executable test environment; if a platform lacks a stable sandbox, that most-convincing curve is blocked at the platform level before you begin.

Measure, redesign, verify — all three can be written up as methodology; but whether they land comes down, in the end, to whether the organization is willing to invest in a caller it can't see. That's the real watershed for an AI-era open platform.
