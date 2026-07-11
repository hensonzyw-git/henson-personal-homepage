---
key: agent-as-service-caller-open-platform
lang: en
title: "When an open platform's target agent stops being a developer and becomes a service caller"
date: 2026-07-01
category: Open Platform
readMins: 15
summary: "When agents start executing high-risk service operations on behalf of users, open platforms need more than permission control: they need platform-verifiable per-action intent. The core issue is not that OAuth stops working, but that a third-party agent's execution surface becomes an opaque channel for the platform."
draft: false
draftTranslation: true
---

In "[From traditional open platforms to the AI era: when the caller changes from human to agent](/en/blog/traditional-to-ai-open-platform/)," I wrote about how an open platform can become AI-friendly: how a coding agent can read the docs, understand business semantics, find the right APIs, and generate integration code that actually runs.

That kind of agent is still an extension of the developer. It is integrating, developing, and debugging. The platform problem is whether the docs are readable, the APIs are self-describing, the error codes are machine-parsable, and the scenario guidance is clear enough.

So the core question in the first essay was AI-friendly context: how should a platform express its capabilities, terminology, APIs, constraints, and error-handling patterns as context that an agent can understand, select from, and call?

But the problem changes when an agent is no longer only a developer, and instead starts calling the platform's MCP tools, CLI, or APIs directly on behalf of a user.

This shift is already visible in some platform tooling. In "[Dissecting Feishu's two agent connection layers for the same API: MCP and CLI](/en/blog/mcp-vs-cli-agent-encapsulation/)," I looked at Feishu's lark-mcp and lark-cli: the same OpenAPI surface is wrapped into two agent-callable entry points, one optimized for broad coverage and the other for curated high-frequency tasks.

Feishu is a useful case for "how agents obtain and call tools," but it is not the core risk case in this essay. Its currently exposed capabilities are mostly around collaboration, documents, messages, and tables, rather than high-risk execution such as price changes, refunds, funds, or fulfillment. This essay asks what happens one step later: when an agent is not merely calling tools, but executing service operations with real-world consequences on behalf of a user.

At that point, the agent is not "building an application." It is executing a service operation.

It may query orders, adjust prices, update inventory, issue a refund, create a shipment, or change an advertising budget. The platform is no longer dealing only with developer productivity. It is dealing with execution boundaries.

## 1. Two agent identities

I now prefer to split open-platform agent scenarios into two categories instead of discussing them as one blended topic.

| Agent identity | What it does | Platform question |
|---|---|---|
| Developer agent | Reads docs, writes code, generates an integration app | AI-friendly context: can it understand, integrate, and run? |
| Service-caller agent | Calls tools or APIs directly on behalf of a user | Agent-safe execution: can it execute under confirmation, risk-control, and audit constraints? |

The first category is the AI-friendly transformation of an open platform. The platform optimizes documentation structure, OpenAPI specs, MCP/CLI wrappers, llms.txt, error codes, examples, and evaluations.

The second category is the agent as a service caller. The platform question is no longer "can the agent call the API?" It becomes:

**Once the agent can call the API, which operations can it execute directly? Which ones can only become drafts? Which ones must return to a trusted platform surface for confirmation?**

These two problems share the same underlying APIs, but they are not the same problem.

If we mix them together, it is easy to make overly broad claims such as "OAuth is no longer enough" or "MCP needs human confirmation." Those statements are too coarse.

A more precise formulation is:

**Open platforms used to focus on "who is allowed to call the API." When agents become service callers, platforms also need to know whether this specific high-risk call carries platform-verifiable per-action intent proof.**

Agent-safe execution is not simply adding another button for agents. It is making sure that when an agent executes actions with real-world consequences, the action is still constrained by confirmation, permissions, risk control, and audit trails.

## 2. Existing open-platform boundaries

Open platforms did not start managing risk only after agents appeared.

Traditional platform governance already has mature boundary design: which data can be opened, which capabilities can be opened, who can call them, how scopes should be split, when identity verification is required, how sandbox and production environments are separated, and whether sensitive data can be accessed.

These older boundaries can be compressed into four types:

- Admission boundary: developer registration, company verification, app review, business qualifications, category admission, and AppKey / AppSecret issuance answer "who can come in."
- Permission boundary: scopes, permission bundles, and sensitive-field splits answer "what can they do after admission."
- Environment boundary: test keys and live keys, sandbox data, test stores, and disabled sensitive scopes in test mode answer "when there are no real-world consequences yet."
- Runtime boundary: rate limits, quotas, request logs, anomaly review, risk controls, bans, idempotency, rollback, compensation, and audit trails answer "even if you have permission, is the behavior still reasonable?"

These four boundaries show one thing: open platforms have always been in the business of boundary design.

But those boundaries used to revolve around who can integrate, what they can do, when they enter production, and how calls are governed after the fact. They often assumed that the key interface for high-risk execution still lived in the platform UI, in the developer's app, or in an accountable business system.

The agent era does not overturn these boundaries. It adds a new question on top: when real execution happens inside a third-party agent surface, can the platform still obtain a trustworthy confirmation record for this specific action?

## 3. OAuth scope and per-action intent

OAuth scope is good at expressing static authorization.

A merchant can authorize an app to read orders, manage inventory, or change prices. These can be governed through scopes, permission bundles, app review, and business verification.

But high-risk writes often cannot be decided only by checking whether the app has permission.

An application with `bidding:write` does not make every price change compliant. An agent authorized to manage inventory should not be able to batch edit hundreds of SKUs after a model mistake. A third-party tool with refund permission does not mean every refund it initiates carries the user's real intent.

The key distinction is:

- scope solves **prior authorization**: what this application is allowed to do;
- high-risk execution also needs **per-action intent**: whether this concrete action was confirmed after the user could understand it.

In traditional open platforms, part of this per-action intent confirmation is absorbed by the platform UI. Users click buttons, inspect previews, see confirmation dialogs, complete secondary verification, and the platform still controls the key execution surface.

When the execution surface moves into a third-party agent, the platform loses that built-in confirmation layer.

If a third-party agent calls an API with `user_confirmed=true`, the service provider cannot know whether a person actually confirmed it. The field may come from a real click, an automated agent click, the host product clicking on the user's behalf, or simply a parameter generated by the agent itself.

So the issue is not that third-party agents are necessarily malicious. The issue is that the platform cannot verify whether confirmation actually happened, what was confirmed, or whether final execution matched the confirmed content.

More fundamentally, the execution surface of a third-party agent is an opaque channel for the platform. The platform sees parameters relayed by a third-party system, not the confirmation behavior itself. As long as confirmation does not happen inside the platform's trusted domain, `user_confirmed`, click records, screenshots, or logs saying "the user confirmed" are confirmation claims, not tamper-proof intent proof.

A simulated scenario makes the problem concrete.

Assume a merchant tells a third-party operations agent: "Lower the prices of SKU-A through SKU-Z by 20%, effective at 8 p.m. tonight." The agent generates a plan, calls the platform's pricing API, and passes `user_confirmed=true`. From the platform's point of view, it has received a batch price-change request and a confirmation claim. It does not know whether the user saw a preview saying "26 SKUs will all be lowered by 20%," whether the user understood the margin and campaign-price impact, or whether the parameters finally submitted by the agent match what the user saw.

If the platform turns this into a pending action, the flow changes. The third-party agent can only submit a pending price-change proposal. The platform generates its own confirmation page, showing affected SKUs, price changes, estimated risk, and effective time. The user returns to a trusted platform surface to confirm. The platform then executes against that confirmed object and writes the initiator, confirmer, confirmed parameters, and execution result into the audit trail. The flow can be lightweight or heavy depending on risk level. The important point is the same: the platform trusts a confirmation behavior inside its own trusted domain, not a third-party field saying "confirmed."

That is the new problem for open platforms when agents become service callers:

**Where confirmation happens determines whether the platform can trust it.**

## 4. The changing identity of the caller

From a platform-governance perspective, agents do not necessarily create a new category of API resources. Orders, inventory, pricing, logistics, and after-sales already existed.

What changes is the Who: the caller is no longer only an application written by human developers, an ISV, an enterprise system, or an internal team. It may also be the platform's own agent, a third-party agent, or even an agent assembled by the user.

The same API carries different risk in different callers' hands.

The special thing about agents is not only that they are "smarter." They also bring several new risk characteristics: they call faster, so mistakes amplify; they are more autonomous, so they may execute a sequence of actions without step-by-step user review; their behavior is harder to predict, so they may take paths that human developers would not; and the platform may not be able to access their decision and confirmation surface.

So the platform cannot only ask "can this API be opened?" It also needs to ask:

**If this API is executed directly by an agent, does the platform still have enough control points?**

And when this faster, more autonomous, and less predictable caller identity grows in the market, the platform is not only facing a security-boundary problem. It is also entering a contest for ecosystem leverage between its own agent and external agents.

## 5. Competition boundaries between first-party and third-party agents

Trusted execution boundaries directly change the competitive relationship between first-party and third-party agents.

First-party platform agents and third-party agents may call the same underlying APIs, but they are not in the same position when executing high-risk operations.

The advantage of a first-party agent is not only that it understands the platform business better or has access to more internal context. More importantly, it sits inside the product environment controlled by the platform.

When a first-party agent suggests a price adjustment, inventory update, or refund, the platform can show an operation preview, risk warning, secondary confirmation, strong authentication, and rollback explanation in its own interface. Whether the user clicked confirm, which parameters were confirmed, when confirmation happened, and whether the required authentication strength was met can all be recorded and verified by the platform.

In other words, a first-party agent does not need to claim to the platform that "the user agreed." It completes confirmation inside the platform's trusted surface.

The problem with third-party agents is not that they must be malicious. It is that when confirmation happens outside the platform's control domain, the service provider often sees only a confirmation claim, not the confirmation itself. Whether it was a real user click, an automated agent click, a host product click, or no confirmation surface at all requires an additional proof mechanism.

That gives first-party agents a structural advantage in high-risk execution:

- their confirmation, execution, and audit trails all happen inside the platform's trusted domain;
- they can explain, preview, confirm, and execute in the same interface;
- they do not need a cross-domain protocol to prove that "the user really confirmed."

This means the future competition between first-party and third-party agents is not only about model capability, tool count, or context quality. It is also about trusted execution boundaries.

For low-risk tasks, third-party agents may offer a better experience, broader coverage, and stronger aggregation. Users may prefer one unified agent to manage multiple platforms.

But for high-risk actions, the platform's own agent has a natural advantage. The platform can say: a third-party agent may submit a draft, but final confirmation and execution must return here.

That does not mean third-party agents have no opportunity. They may become the cross-platform intent collection and plan-generation layer: helping users compare, plan, and draft executable proposals, then submitting high-risk actions back to each platform for trusted confirmation.

Further out, if an open cross-domain trusted-confirmation standard emerges, third-party agents may turn today's opaque confirmation channel into intent proof that platforms can verify. Until such standards exist, however, the rational platform choice will often be to pull high-risk execution back into its own interface. This is why the agent ecosystem may oscillate between open joint standards and stronger walled gardens.

A possible division of labor looks like this:

| Agent type | Advantage | Suitable tasks |
|---|---|---|
| Third-party agent | Cross-platform, aggregated context, planning for the user | Queries, comparisons, proposals, batch drafts |
| First-party agent | Trusted interface, platform risk control, execution loop | High-risk confirmation, strong authentication, final execution |

This changes the strategic question for open platforms.

Platforms used to ask: should we open APIs to developers?

In the agent era, they also need to ask: which capabilities can third-party agents execute directly? Which capabilities can they only draft? Which capabilities must return to the first-party agent or native platform UI?

This is not only a security strategy. It is a product competition strategy.

**When agents start executing real actions for users, the biggest advantage of a platform's own agent may not be that it understands the user better. It may be that its confirmation, execution, and audit trails all happen inside the platform's trusted domain.**

## 6. From AI-friendly context to agent-safe execution

If AI-friendly context solves "making agents easier to integrate," agent-safe execution solves the next layer: once agents can call, how does the platform keep them from crossing the execution boundaries it should preserve?

Instead of dividing capabilities into "open" and "not open," a platform can divide them into five tiers.

| Capability tier | Meaning | Suitable scenarios |
|---|---|---|
| Direct execution | The agent can execute after authorization | Low-risk reads, low-impact reversible actions |
| Limited execution | The agent can execute within amount, frequency, or scope limits | Small inventory updates, low-amount configuration, low-risk automation |
| Draft submission | The agent can only generate a plan for confirmation | Batch price changes, batch inventory updates, complex fulfillment changes |
| Platform-confirmed execution | The agent submits a pending action; the user confirms on a trusted platform surface | Refunds, shipping, ad budgets, important merchant operations |
| Not open for execution | The platform does not provide third-party direct execution even for agent use cases | Funds, sensitive risk-control actions, irreversible platform-level effects |

This tiering is more actionable than simply saying "high-risk actions require human confirmation." It answers the real product decision for an open platform: for each capability, should a third-party agent execute it directly, submit a draft, return to the platform for confirmation, or not be given execution at all?

Within these five tiers, the real governance deep water is "draft submission" and "platform-confirmed execution." Both admit the same fact: a third-party agent may be excellent at understanding intent, generating plans, and organizing context, but once a high-risk action is about to land, the platform needs a mechanism to hold the pending operation.

## 7. Platform confirmation as a new boundary

If a platform wants to support third-party agents initiating high-risk operations, pending action is a more realistic product shape.

It is not a separate solution next to the five tiers in section 6. It is the implementation of the "platform-confirmed execution" tier: a third-party agent does not call the final write API directly, but first submits a platform-verifiable pending object.

That object should at least say who initiated the action, on whose behalf, which resources are affected, what the key parameters are, what risk level the platform calculated, what preview the user saw, whether the confirmation expired, and whether final execution matches what was confirmed. In other words, it turns the confirmation claim from section 3 into trusted confirmation that the platform can verify, audit, and assign accountability to.

This does not mean every operation should become heavy. Reading docs, querying status, and generating drafts can stay low-friction. The real question is the first action that creates real-world consequences. For price changes, refunds, shipping, or payments, should the platform require the agent to submit a draft and return the user to a trusted platform surface for confirmation?

That question matters more right now than the exact field design.

**This will not remain a world where every platform invents its own confirmation field. Once third-party agents really start executing sensitive operations across platforms, leading platforms or protocol ecosystems will try to turn trusted confirmation into a de facto standard, and other service providers will follow.**

## 8. The baseline role of server-side risk control

Even platform-side confirmation cannot carry all risk control by itself.

The reason is simple: users may misunderstand, agents may explain poorly, users may click through confirmation quickly, and the real business consequences may only become clear after execution.

Agent-safe execution needs at least two layers:

The first layer is intent confirmation: whether this action was confirmed by the user on a trusted surface.

The second layer is server-side risk control: even if the user confirmed, the platform still judges whether the action exceeds reasonable boundaries.

For example:

- if a price change exceeds a threshold, block it or route it to manual review;
- if the number of modified SKUs exceeds a daily limit, split execution or downgrade to draft;
- newly authorized apps can only perform low-amount, low-frequency actions;
- actions involving money, refunds, or fulfillment require stronger authentication;
- abnormal failure rates, timing, or parameter distributions trigger freezing or rollback;
- all high-risk writes require idempotency keys, audit logs, and compensation paths.

This is consistent at the underlying-logic level with the rate limits, risk controls, and anomaly audits that open platforms already have. The difference is that agents amplify call speed, autonomy, and mistakes. These controls cannot remain only back-office governance tools. They must become part of the agent-tool design.

## 9. Why this question is worth asking now

Today, it is not yet common for third-party agents to call another third-party service's MCP, CLI, or APIs at scale to complete sensitive operations. The industry has not formed a mature consensus.

That is exactly why the question is worth asking early.

If open platforms treat agents only as a new kind of developer, the transformation will stop at documentation, OpenAPI, MCP, CLI, llms.txt, context cost, and First-Pass Success Rate.

All of that matters, but it serves integration.

Once agents become service callers, the platform faces a different problem: when the execution surface is no longer in the platform's hands, how can the platform prove that this operation is not merely a confirmation claim relayed by a third-party system?

MCP makes tools callable. OAuth makes identity authorizable. Scope makes permissions expressible.

But for high-risk actions, none of them naturally proves that this specific operation went through per-action intent confirmation after the user could understand it.

That is the extra boundary open platforms need to add as they move from AI-friendly APIs to agent-safe execution.
