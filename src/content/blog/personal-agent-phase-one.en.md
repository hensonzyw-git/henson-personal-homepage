---
key: personal-agent-phase-one
lang: en
title: Building the First Phase of My Personal Agent with Vibe Coding
date: 2026-08-07
category: AI Collaboration
readMins: 21
summary: In sixteen days, I built a single-user Personal Agent around governed Finance tools, one visible Timeline with automatic Sessions, real-device acceptance, ECS deployment, backup, restore, and rollback. This is a record of the product decisions, production failures, evaluation gaps, and the rule that a model saying “recorded” is never completion.
draftTranslation: true
---

On August 7, 2026, I completed the first phase of Personal Agent.

The final acceptance case was concrete. I spoke an expense into a real iPhone. The message crossed public HTTPS to my ECS server; the agent interpreted it, called a governed Finance tool, wrote to my real Feishu ledger, and read the result back. Agent state, Finance state, and Feishu state agreed, and I checked the entry myself in the ledger.

Behind that path were 201 commits, 1,995 automated tests, 38 environment and acceptance artifacts, and many moments where I had to withdraw an earlier claim that something was “done.”

The result is not merely a model that understands “lunch 45.” It is a single-user system: iPhone for conversation, confirmation, and status; a self-hosted backend for the agent runtime, MCP client, permissions, audit, recovery, and high-privilege credentials; and Feishu as the Finance source of truth.

Structurally, it resembles the open platforms I have worked on for the past decade. Business tools are APIs; allowlists and device scopes form the permission model; idempotency keys and receipts are write contracts; audit and human confirmation are governance. This time, however, platform owner, integrator, and end user are all me.

This essay does not repeat why I wanted a Personal Agent. It records the decisions that changed the shape of the first phase: how I assembled coding agents and models, why I paused feature work to build shared agent foundations, how I defined successful action, and what it took for code to become a product rather than a toy.

## I did not choose one coding agent

The phase was not built by one coding agent from start to finish.

I moved between Codex, Claude Code, and several models. Strong reasoning models were better for design, difficult diagnosis, and review. Bounded implementation tasks could use a faster or cheaper model. After implementation, another agent in an independent context reviewed the PRD, diff, and test evidence.

That independent review was not ceremony. Twice, it found six blocking defects behind an entirely green test suite: once in the model-boundary implementation and once in the shared Context-compaction layer. The issue was structural rather than careless work. A fake built from the same assumptions as the code can confirm those assumptions, but cannot refute them. High-risk Finance, permission, and deployment work cannot pass merely because two models agree that it looks fine.

The model route changed over time as well. I tried Kimi, GLM-5.2, and DeepSeek. Kimi quota became a constraint. GLM-5.2 could handle primary coding, while Claude Code's auxiliary requests later showed stability problems. The role of each model changed with quota, reliability, protocol compatibility, and task type.

That exposed an unexpected fact: **a coding agent is not the same thing as its primary model.**

Claude Code's auto mode has a safety classifier that decides whether a Bash command may run. During intermittent classifier 503s, the main model could still generate code, but tests, Git, SSH, and ECS verification were blocked. The actual bottleneck was not the primary model. It was an auxiliary request on the critical path.

I first used CC Switch to switch whole provider configurations, then attempted Coding Agent routing through LiteLLM, and finally replaced that path with Claude Code Router (CCR). CCR let the primary request and the safety classifier use different models from different providers instead of sharing one failure domain. In later observed runs, DeepSeek-v4-flash handled primary requests while GLM-4.5-air handled the auxiliary one.

The relevant question therefore stopped being “which model is strongest?” It became: who plans, implements, and independently reviews; how primary and auxiliary requests are routed; what happens after a provider error; and which SHA, acceptance criteria, and failure evidence must survive a handoff.

This manually operated combination became the prototype for the next phase: a graph-based development loop.

## The most important product decision was pausing feature work for shared foundations

The reason began with an incident.

There is still one canonical user-visible Timeline in production. That part was correct. But the Session classifier did not actually create a new production Session. From July 31 onward, more than 78 normal chats, drills, failed results, duplicate cards, and recovery records entered the same Session.

The model then copied a bad pattern from polluted Context. On a new ledger request, it stopped calling the tool and directly replied “recorded.” Those DirectAnswer responses were themselves stored as succeeded operation results, reinforcing the same bad pattern in later history. The same model could produce a tool call in clean Context and repeatedly produce DirectAnswer in this polluted Session.

The repair was not more prompt text. I closed the polluted Session and added a structured bookkeeping-intent gate: a request with amount and ledger semantics cannot be treated as successful unless it produced a write-tool call.

The repair was cheap because of a decision made two weeks earlier. Timeline and Session had been deliberately separated. I could close and archive the old Session, let the next message enter a new one, and preserve a continuous user Timeline. If chat history had been one indivisible object, this would have required a visible data migration.

Halfway through the original plan, I had paused the direct Finance-to-iOS sequence. Finance would be followed by knowledge, health, wardrobe, calendar, and more personal domains. If each domain owned its own conversation history, context, memory, and model routing, I would get several chatty features rather than a Personal Agent that could persist over time. Worse, a wrong conversation abstraction would freeze into the iOS client, server, and database together.

Before the iOS chat contract was frozen, I separated four concepts that chat products frequently blur:

| Layer | Audience | Lifetime | Constraint |
| --- | --- | --- | --- |
| Timeline | User | Permanently encrypted archive | One shared Timeline across devices |
| Session | Server | Ends with the topic | Split by semantic boundary, not token count |
| Context | Model | One call | Rebuilt by the server every turn |
| Memory | Across Sessions | candidate → active → superseded / deleted | Continuity, never a fact source |

### One visible Timeline is not one unbounded Session

Most agent products expose a conversation list: create, name, archive, and switch. I explicitly rejected that interaction. Every device shares one visible Timeline. The user should not create or name a “new conversation.”

This was not merely a simpler interface. It was a claim about what the agent is. A real agent is a role, closer to an assistant than a document that can be duplicated at will. Conversation lists often outsource a model's Context limitation to the user: because the model cannot hold all history, the user is asked to split it and remember what belongs where.

That choice has a boundary. Personal Agent has limited scope and one user. A broad public assistant may need user-managed boundaries. But my system can preserve one relationship with the user while the server automatically creates semantic Sessions inside it: Finance is one Session, knowledge work another, and a continuing project can remain one Session across days.

### Session splitting is not Context compaction

Sessions exist partly because Context is limited, but they must not be cut by token count. Topic boundary and Context size are independent problems. A changed topic creates a new Session; a long continuing topic creates a new structured Checkpoint inside the same Session. Cutting by length would break a task in the middle simply because a model window changed.

When Session classification fails, times out, or has low confidence, the safe default is to continue the current Session. A mistaken split can lose an active task; a missed split can often be recovered through compaction or direct user correction.

Chat can remain archived forever without being loaded into the next model turn. Every Context is assembled by the server from system rules, currently available capabilities, the Session's Checkpoint, recent events, exact pending state, and the current input. The model does not query the entire Timeline and choose its own history.

Checkpoint summaries cannot hold exact money, dates, idempotency keys, external receipts, pending clarification text, duplicate candidates, or operation state. Those travel as structured state. The agent may compact a discussion; it may not rewrite the result of a real action.

The first phase only implemented short-term memory through Session, Context, and Checkpoint. But I froze the boundaries for medium- and long-term memory early: low-sensitivity material can be generated with provenance and expiry; inferred preferences remain candidates until confirmed; sensitive facts and financial, health, or relationship inferences must never be silently stored; and live fact sources always beat Memory.

### The cost of the foundation, and a safety default that needs monitoring

The work was much more expensive than it looked: database migration, Context assembly, token budgets, Checkpoints, a Compactor, and concurrency and compare-and-swap correctness.

Live model checks showed that a flagship model could identify Session boundaries well but imposed unacceptable latency: three calls took 8.3, 12.2, and 16.7 seconds, and another hit a 20-second timeout before the message was even anchored. I separated the Session classifier into its own client, gave it an eight-second deadline, and created a separately configurable model slot. The system can accept more “continue current Session” results, but an auxiliary model on the critical path needs its own failure strategy rather than sharing the primary model's failure domain.

While writing this retrospective, I checked production read-only and found that the ECS never configured that model slot. With the environment variable unset, code falls back to the primary model. Production Session classification is therefore still using `glm-5.2`; the faster `glm-4.7-flashx` was a local validation configuration, not the deployed one. **Having isolation in code is not the same as completing isolation in production.**

The Session-pollution incident therefore revealed two things. Continuing the current Session is a reasonable safety default for a one-off classifier failure, but if fallback becomes normal it turns from recoverable under-splitting into persistent Context pollution. And the incident was not only a model decision problem: it also exposed a production configuration gap that no offline test had asked about. We must monitor Session decisions, fallback ratio, and the basic fact that production is actually running the model it was designed to run.

Without this shared layer, I would have produced a bookkeeping app. With it, I began building a Personal Agent capable of carrying later domains.

## I moved the definition of success from model text to external fact

Phase 1 contained only Finance, but I did not reduce Finance to “extract several fields, then call Feishu.”

The model only proposes structured intent. Dates, amounts, categories, permission, idempotency, duplicate decisions, and risk boundaries are deterministic code. The agent sees business-named tools such as `finance.log_expense`, not a generic Feishu API.

Feishu has an official public MCP that could have been connected directly. I did not use it. I designed my own tools over Feishu APIs.

The reason is not that the official MCP is poor. A generic MCP exposes Feishu's resource model: create a record in a particular Base. The model would then need to know the app token, table, amount field, and category mapping. Each of those becomes another place for the model to be wrong. A business tool removes them from model responsibility: the model supplies intent; server code owns where the table is, how fields map, and how categories normalize.

This also changes permission granularity. “Can access this Base” grants broad read and write authority. “Can log one expense” is narrow, append-only authority. An allowlist is only meaningful when its allowed tools are themselves small and specific.

Idempotency, read-after-write, duplicate decisions, and recovery from `CommitUnknown` must also live inside the tool. If the agent merely calls a generic create-record endpoint, those concerns can only be handled by the model. The principle that success is defined by external fact therefore requires owned business tools.

One dangerous incident showed why. A real expense had been created in Feishu and read back; the Finance state machine had reached `succeeded`; yet the agent reported `source_commit_unknown` and asked for manual checking. A user could reasonably resend and create a duplicate.

The cause was a five-second inherited HTTP read timeout. One real write required several Feishu calls, and the connection ended before the final response. Offline fixtures answered in milliseconds, so a green suite did not reveal the failure.

The repair was automatic recovery with a human fallback. `CommitUnknown` no longer becomes an unresolvable terminal state. The service retains recoverable state and reprojects the outcome from Finance facts; only genuinely uncertain cases show a manual-check path. Duplicate candidates similarly cause zero writes until I decide whether to continue. Batch expense logging remains disabled because Phase 1 had no external proof of source-side atomicity.

> The model may suggest what the system should do. It cannot define what counts as done.

## What my eval covered — and what it did not

Phase 1 had standard scenario inputs and adversarial boundary tests: malformed model responses, tampered endpoints, post-signature argument changes, audit-chain tampering, Context overflow, and history attempting to act as instruction. The principle was simple: failure must reject, not silently truncate, drop, or repair.

The formal Finance eval had 69 cases, 17 based on expressions I had supplied and reviewed. While writing this article, I found a weakness in treating those as the natural-input gold standard. I had already begun adapting to the model.

For a real expense, I wrote “Dinner Awen Chaoshan Restaurant 620 family expense.” The model used “dinner” for food classification while writing only the restaurant in the name. But I had added “dinner” because I worried it would not recognize the restaurant. The success therefore measured both model capability and my emerging prompting habit.

I added robustness evaluation after Phase 1. It rewrote the same semantics without spaces, in different field orders, with spoken Chinese numbers, self-correction, and without my extra hint. It added ambiguity designed to tempt confident invention: what is “forty or fifty,” which date is “two days before,” and may an opaque merchant be categorized from model memory? I also stopped before running a supposed multi-turn test when I found that the harness merely pasted history into a prompt. That would have been a false green. I first made it materialize real user messages, operation results, and clarification context.

The counterfactual restaurant input passed both with and without “dinner.” For this model, this run, and a name containing a restaurant semantic cue, I no longer need to add the hint.

The first 24 single-turn candidates passed strictly in 13 cases and safely in 16. Opaque merchants did not trigger clarification; the model proposed ledger calls. “Two days before” was silently resolved to a date. The problem was not failure to understand. It was confident completion of facts I had not supplied.

I froze product rules before reading model output: generic meal context may guide category but not persist in an unambiguous merchant name; opaque merchants must ask; approximate amounts and non-unique dates must ask; repayment and ordinary transfers must not masquerade as consumption. I wrote those rules into the prompt and tool-schema descriptions.

To avoid reporting one convenient run, I fixed the dataset, prompt, and tool manifest and ran four times. In the 24 cases shared with the original run, the original was 13 strict and 16 safe. The current version was 16–19 strict and exactly 22 safe in every run. The first direct comparison had two regressions; after repetition, one was a stable failure and one was sampling-dependent. This separates persistent defects from stochastic movement, but does not prove that the rule change caused all improvement because the old version has only one run.

Across the full 32 Finance cases, strict pass varied from 24 to 27 while safety stayed at 30 in all four runs. Authorization boundaries and seven structured multi-turn regressions all passed four times. The two dangerous business calls also failed all four times: family fruit was put into daily life, and visa postage lost its required US trip tag. Repetition did not wash those into noise.

The pattern was instructive: strict correctness moved, safety did not. Safety was 30, 30, 30, 30 on the full set and 22, 22, 22, 22 on the shared subset. That makes safety a reproducible property of this version, while part of strict correctness is measurement noise. It is why I only make claims that the stable safety numbers can support.

Safety is still not usability. I added ten complete inputs that must execute without clarification and ran them three times. Each run directly proposed a tool call for only eight. “Buy a power bank 129, personal expense” asked an unnecessary question every time. “Pay household utilities 200” twice failed before interpretation and once called a tool with the wrong extracted name. An agent that guesses everything and one that asks everything are equally unusable. Eval must defend both the lower bound against silent wrong entries and the upper bound on interaction friction.

All 34 robustness candidates and ten friction candidates remain synthetic. These local model-only results are not ECS, MCP, or real-ledger acceptance. The broader lesson is that “real user-provided input” can still contain user adaptation; a correct single turn does not prove behavior after history returns; and knowing when not to guess must be measured together with knowing when not to ask.

## The difficulty of putting a product on the internet

Much of Phase 1 is barely visible in a feature demo: ECS, security, images, certificates, service users, backup, restore, and rollback.

I did not independently design all infrastructure decisions. Codex proposed much of the approach from risk and acceptance requirements; I executed, verified, and worked through failures. That role reversal matters. In product decisions I was the decision maker. With ECS, keys, and backup permissions, I was often only an acceptor. The question became: when I cannot design a layer, what makes acceptance trustworthy? The answer was to reject indirect evidence.

Personal Agent shares an ECS host with my personal site. I created an encrypted-image and KMS disk-migration path, separated the Agent and Finance MCP into service users, kept databases and MCP off the public internet, and required the original site to remain available after every Nginx, system-service, or disk change.

For off-site backup, two SQLite databases create online snapshots and integrity checks before encrypted restic storage in private OSS. Repository and business data keys are separate, with an offline copy. Acceptance is not a “backup succeeded” line. It is restoring a snapshot on another Mac, decrypting with an off-machine key, checking schemas, references, and receipt relationships, and starting the service in a purpose-built read-only mode.

The real environment found failures that green tests missed. In the first deployment, the backup user could list the staging directory but could not open any files: missing setgid combined with `UMask=0077` and a hard-coded `0600`. The verification script asserted that a directory could be listed, not that the backup user could read a file. Fifty-five checks passed while backup was unusable.

The first off-machine restore similarly passed decryption and database checks, then review found that the supposed read-only startup still composed the ordinary recovery path and might modify the restored database or reach Feishu. After repairing permissions and a purpose-built read-only entrypoint, I reran the complete drill; checks grew from 55 to 66. I later rehearsed a full rollback: disable writes, stop services, remove the Agent's Nginx route and units while preserving data and keys, then reinstall, restore, and reopen writes. The personal site remained available and database counts and external records stayed consistent.

This work took far longer than expected, and it is what separates a product from a toy. A toy is done when a feature runs locally. A real product must face the public internet, identity, permissions, process restart, service order, lost keys, disk failure, restore, and rollback. 1,995 tests are not a replacement for those things. They are only the ticket to enter the real environment.

## Building it myself was not the same as dragging out a demo

The phase was an all-in period, and the actual process was much less smooth than this article may suggest. During sixteen days, I repeatedly stood still: a completed module was returned by independent review with six blocking defects; a design was rewritten after a live call contradicted it; a deployment needed six repairs; a passed restore drill had to be redone because “read-only” was not truly read-only.

The same bookkeeping agent could have become a demo in an afternoon with an orchestration platform such as Dify. I do not think that is wrong. Those products are optimized for rapid idea validation, and I use them for that purpose too. The difference is not whether the demo runs. Both run. The difference is that the problems that consumed my time here do not appear in that mode. They are hidden inside a layer I do not own until they surface in a form I cannot interpret.

The five-second timeout, the setgid and UMask interaction, the polluted Session that taught a model to pretend it had written a ledger entry, and the false read-only path do not disappear when a tool is replaced. They become someone else's defaults.

That returns to the central point. My value was in the decisions, and in a layer I do not own I have no meaningful decision to make. I can configure it, but I cannot define it. The cost was time, repetition, and knowledge I might otherwise have avoided. In return, I know where the system's boundaries are and where to look when it fails.

## What I was actually responsible for

Coding agents implemented or guided much of the code, testing, and operations. But Phase 1 was not a one-line requirement sent to AI while a project grew by itself.

I froze scope at Finance rather than admitting knowledge, health, wardrobe, and assets at once. I made the iPhone a conversation and confirmation surface while keeping high privilege on the server. I rejected conversation lists, chose ADK while keeping business policy, MCP contracts, state, and audit outside the framework, designed narrow business tools rather than using a public generic MCP, paused feature sequencing for shared foundations, closed batch writes without external atomicity proof, bound success to Feishu read-back rather than model text, and decided which failures recover automatically and which return control to a person.

Many product decisions do not look like a new screen or feature. They look like pausing, changing sequence, separating concepts, rejecting an available solution, closing a path that already runs, or refusing an acceptance result that looks green.

Looking back, the three most expensive decisions were all refusals: no conversation list, no generic orchestration platform, and no public generic MCP. Each saved time in the short term and surrendered a judgment I needed to own in the long term.

## Next: Personal Agent orchestrates coding agents

Although I built Phase 1 with coding agents, the process still depended on me typing continuously at a computer. Context, SHAs, acceptance criteria, failure reasons, and current state were scattered across chat, terminal, repository, and memory. CC Switch, LiteLLM, and CCR addressed part of the model-and-provider routing problem, but not ownership of the whole development process.

The next goal is therefore not another personal data domain. It is a Development Agent Loop: a graph-orchestrated loop.

```text
Submit a requirement in Personal Agent
→ create a PRD, technical design, task breakdown, and acceptance criteria
→ review or approve the plan on the phone
→ a Home Mac Worker creates an isolated worktree and codes
→ run deterministic tests and security checks
→ an independent coding agent reviews the current diff and evidence
→ bounded repair, retest, and fresh review
→ create a candidate commit and pull request
→ I approve the final merge
```

The graph owns state, dependencies, retry, pause, recovery, and model handoff. Models are execution nodes in that graph. When quota ends, a provider fails, or an output does not meet the gate, the system should preserve evidence and stop in a clear state instead of asking me to reconstruct the project from scratch.

I will remain responsible for requirements, product ambiguity, high-risk actions, and final merge. But I should not have to remain at the keyboard to keep every step of the development loop alive.

In the first phase, I used coding agents to build Personal Agent.

In the next phase, I want Personal Agent to orchestrate coding agents and keep improving itself.
