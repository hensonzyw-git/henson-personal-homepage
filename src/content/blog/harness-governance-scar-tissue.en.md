---
key: harness-governance-scar-tissue
lang: en
title: "After General Harnesses Opened Up: What Must Personal Agent Still Own?"
date: 2026-08-21
category: AI Collaboration
readMins: 27
summary: "The Claude Code source-map leak exposed the product engineering behind a mature coding agent. DeepSeek first open-sourced DSH as a composable plugin system; the later opening of the Codex harness and App Server showed how a shared runtime can serve multiple product surfaces. Instead of asking which harness is strongest, this essay revisits six real decisions: the options I had, why I chose one side, what I deliberately rejected, and what that choice cost. Finance—the first path proven through real writes, device acceptance, and recovery drills—is the only implementation case in this essay."
draftTranslation: true
---

If you only followed the recent headlines, the agent harness seemed to move from backstage to center stage almost overnight.

A Claude Code source-map leak exposed, [according to public reporting](https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai), roughly 500,000 lines of code across nearly 2,000 files. It did not reveal a magical prompt anyone could copy. It revealed the amount of product engineering behind a mature coding agent.

DeepSeek first open-sourced [DSH](https://github.com/deepseek-ai/deepseek-harness), making models, tools, sessions, sandboxes, compaction, and interaction replaceable, composable plugins.

The Codex harness opened later and took a different route. OpenAI explained the [shared agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) and [App Server](https://openai.com/index/unlocking-the-codex-harness/): how one harness serves terminal, IDE, web, and desktop clients; how Item, Turn, and Thread represent conversations; and how approvals, streaming events, and reconnection work. The implementation lives in the public Codex repository.

Those events invite a selection question: which harness is stronger—Claude Code, Codex, or DSH? Does my Personal Agent count as another harness? Now that general systems are open, should I throw away what I built?

I initially compared them that way. Eventually I realized the dimension was wrong.

Claude Code and Codex are primarily coding-agent products. DSH is closer to a composable harness framework. Personal Agent is a product for my own use: the iPhone is an always-available conversation and confirmation surface, while the backend holds state, policy, MCP, audit, and high-privilege credentials so personal data can be read, organized, and acted on. These systems do not occupy the same product category, so feature-by-feature comparison is misleading.

Finance is currently the first complete vertical path in Personal Agent. A message such as “lunch, 45” can travel through a real iPhone, a public service, and Finance MCP into a real Feishu ledger. A timeout or restart does not trigger a blind retry that may duplicate the expense, and a model-generated “done” cannot impersonate success. Other personal workflows remain future expansion and are not presented as completed work here.

Finance was a deliberate pressure test. Money, external writes, and a real device quickly expose whether an Agent merely answers or can take responsibility for action.

So instead of comparing project names, I split the problem into six layers:

| Layer | What general harnesses already provide | What Personal Agent must still define |
|---|---|---|
| 1. Product and framework | Reusable model runtime, session, and product infrastructure | What to reuse and which product responsibilities cannot be delegated |
| 2. Runtime loop | How models, tools, and events advance one model turn | How one real business operation converges across turns and network failures |
| 3. Tool boundary | Tool integration, sandboxing, approval, and execution | The smallest business consequences the product permits the model to cause |
| 4. Context and memory | How history is persisted, compacted, and replayed | Which facts enter the model and which remain in audit and state machines |
| 5. Permission and HITL | How an action is allowed, denied, or paused | Which human role appears before and after a side effect |
| 6. Evidence and recovery | How tasks persist, recover, and expose outcomes | Which domain authority may declare a real-world operation complete |

These six layers are not a new general-harness specification. They are a way to draw the build boundary: reuse mature runtime mechanisms; keep responsibility for real business consequences inside the product.

Here are the six decisions before I unpack them:

| Question I had to answer | My choice | What I rejected | Cost I accepted |
|---|---|---|---|
| How deeply should the product live inside a framework? | Use ADK only as the model runtime; keep business governance outside | Put state and policy directly into ADK; build another general harness | Maintain an adapter layer and explicit contracts |
| What happens when submission outcome is unknown? | Do not retry automatically; preserve recoverable state and reconcile with the fact source | Treat timeout as failure; ask the user to submit again | More states and potentially slower final feedback |
| Which tools may the model see? | Expose narrow business actions, not general Feishu writes | Constrain an all-purpose MCP with prompts | Redefine a tool contract for every new domain |
| How do continuous UX and bounded model context coexist? | Keep one user timeline while the service segments model sessions and governs context projection | Make the user open new chats; put all history in one session | Maintain session routing and projection logic |
| May a human conclusion overwrite machine state? | Keep human observation beside machine evidence and preserve conflicts | Finish with one human-confirmation boolean | More complex state and UI; contradictions remain visible |
| What counts as complete? | Build an evidence chain across artifact, service, device, external receipt, and recovery | Substitute tests, HTTP 200, or system self-report for completion | Slower and more expensive acceptance that can reverse progress |

The six layers below explain not only what I chose, but why I did not choose the other side.

## Layer One: Product and Framework—The Stronger the General Layer, the Thinner Mine Should Be

Claude Code and Codex must turn an Agent into daily software: read and write repositories, execute commands, request permission, manage context, recover work, and continuously present progress to a user.

DSH occupies a different position. It is closer to a composable harness kernel. Capabilities form a plugin tree; service interfaces, implementations, and consumers remain separate; models, sessions, tools, and sandboxes can be replaced at composition time.

Personal Agent does not need to reproduce every interaction of a mature coding agent or let arbitrary developers compose arbitrary agents. It needs to select public capabilities for its own workflows while keeping business responsibility outside the framework.

One early decision still looks correct: **treat Google ADK as the current model runtime, not as the product itself.**

I had three paths. The fastest was to write business state, tool policy, and session logic directly into ADK's objects and lifecycles. The most “platform-like” was to build a framework-neutral general harness from scratch and re-abstract models, tools, and sessions. The middle path was to accept ADK's model loop while keeping my business state machine and governance boundary outside it.

I chose the middle path. The criterion was not which architecture looked most complete. It was two kinds of change: **a volatile runtime must remain replaceable; a durable business responsibility must have one stable owner.** Model providers, adapters, and session frameworks may change. How one expense avoids duplication, who may write, and what evidence counts as success cannot be reinterpreted every time the framework changes.

The model adapter can change. The MCP client can evolve. A more mature session or loop implementation may eventually replace mine. Business policy, tool contracts, operation state, audit, and external receipts must not be welded into that model framework. The call relationship remains:

> Agent proposes a tool intent → business policy decides → MCP client executes → connector reaches the fact source → system verifies the result.

The choice has a real cost. I maintain the translation from framework output into business intent, translate tool results back into domain state, and test both sides of the boundary. A new ADK capability does not automatically become a product capability. I accept that friction because it lets me replace the model runtime without migrating the meaning of expenses, receipts, and audit records that already exist.

Codex sharing one harness and DSH replacing foundational capabilities at composition time strengthen that boundary. The faster public infrastructure evolves, the less duplicate machinery I should maintain—and the less product responsibility I should bind to one framework.

**The conclusion: the stronger general infrastructure becomes, the thinner my general layer should be. What cannot be outsourced is the product's definition of a valid result.**

## Layer Two: Runtime Loop—A Model Turn Can End Before a Business Operation Does

The basic agent loop is now familiar: assemble context and tools, call the model, execute any requested tool, feed the result into the next inference, and stop when the model returns control to the user. Codex exposes this process through Item, Turn, and Thread. DSH records conversation events in an append-only SessionEvent log.

A real Personal Agent incident exposed a lifecycle mismatch: **the model turn and the business operation are not the same thing.**

In Phase One, an expense had already been written to Feishu and Finance had completed its post-write read-back. But the MCP HTTP client inherited a five-second read timeout. The connection closed before the final response returned. The Agent only knew that no result arrived, so it displayed `source_commit_unknown`.

Treating that as an ordinary tool failure suggests retrying or asking the user to try again. Yet an unknown network result does not mean the external write did not occur. Either response could create a duplicate expense.

I actually had three product options:

1. **Retry automatically**: give the user the fastest answer and take the highest duplication risk;
2. **Report failure and ask the user to resubmit**: keep implementation simple by transferring duplication risk to the user;
3. **Preserve “outcome unknown” and continue reconciliation**: accept slower feedback and more states without pretending that unknown means failure or success.

I chose the third. The value ordering was explicit: in bookkeeping, **correctness outranks immediate feedback, and recoverable waiting outranks a clean-looking but unjustified conclusion.**

I eventually split the write into a longer state chain:

> interpret → policy → resolve → commit → verify → reconcile.

Before submission, the system persists the operation identity and idempotency key. After submission, an HTTP response alone cannot declare success. A timeout enters a recoverable unknown state. Instead of retrying, the system carries the original operation identity back to Finance and Feishu for reconciliation. Success is presented only after an authoritative receipt binds the original operation to a verified post-write read.

That decision produced three concrete rules. After crossing the submit boundary, cancellation cannot be presented as “not submitted.” Recovery must reuse the original operation identity rather than creating a compensating new request. If Finance temporarily finds no record, that only means evidence has not arrived yet; it does not immediately prove that no write occurred.

That changes the authority structure:

- the model proposes intent; it is not the completion authority;
- the Agent database stores operation state; it is not the ledger authority;
- Feishu stores the external fact;
- a receipt bound to the original operation is completion evidence.

The cost is that a write no longer has only success and failure. The UI must explain “still reconciling,” the service needs a recovery worker, and operations needs to know which intermediate states are safe to take over and which may still have a live request. This complexity is not architectural decoration. It keeps duplication risk inside the system instead of leaving the user to guess.

A general harness can organize a model turn. Personal Agent must also manage a business operation across turns, networks, and process restarts.

**The conclusion: do not mistake an agent loop for a business state machine. A model turn may end while uncertainty around a side effect must remain alive.**

## Layer Three: Tool Boundary—First Decide Which Consequences the Model May Cause

Claude Code, Codex, and DSH provide rich tool integration, sandboxing, approval, and execution mechanisms. But integrating a capability does not mean a specific product should expose it to the model.

Personal Agent made one conservative but important Phase One decision: **do not expose general Feishu MCP operations directly to the model.**

If the model could “create any Base record” or “modify any field,” one misunderstood sentence could target the wrong table or column or bypass product rules. I exposed narrow, business-named tools instead: record expense, record income, query ledger, and manage family funds. The model expresses business intent. Finance MCP owns field mapping, idempotency, duplicate detection, and read-back verification.

There were again three choices. The easiest was to expose general Feishu MCP and tell the model which table to use in the system prompt. A tighter version was to retain a general write endpoint and enforce a server-side field allowlist. My choice was narrower: the model may propose “record one expense,” but it should not know the Feishu table, column names, or record shape.

The reason is that prompts, schemas, and authorization solve different problems. A prompt influences how the model reasons. A schema checks the shape of parameters. Authorization decides whether this operation may occur. Combining all three in one general tool lets the model propose an action while also carrying the material used to prove that it should be allowed.

The boundary later became more precise:

- model-visible capabilities and server capabilities are different sets;
- read-only resolution and side-effecting commit are different steps;
- a deterministic UI action need not become a model-visible action;
- passing a tool schema does not grant authorization for this business operation.

Since then, I use the same decision chain when connecting a new domain: identify the authoritative fact source; define the smallest business action; list ambiguities that must be rejected; define the success receipt; only then decide whether the capability should be visible to the model. Tool registration is the last step.

The cost is direct. Even though general Feishu MCP already exposes the underlying capability, I still maintain a Finance-specific domain layer. Every future domain must repeat the contract work. Expansion is slower. In return, one misunderstanding can only land inside a business radius I defined in advance.

These choices can borrow from public capability interfaces, sandboxes, and approval systems, but the starting question differs. A general framework asks how to offer a capability safely. A product must first ask whether the capability should exist and what its worst consequence can be.

In a single-user system, the most dangerous mistake may not be a missing permission check. It may be giving the model an overly general verb in the first place.

**The conclusion: a tool is not an API menu for the model. It is the smallest unit of consequence the product is willing to own. A constraint that can be written in a prompt does not necessarily belong in a prompt.**

## Layer Four: Context and Memory—A Fact Source Is Not a Model Input

Codex makes Item, Turn, and Thread protocol primitives and manages context assembly and compaction. DSH stores append-only SessionEvents and derives model-visible messages from them. Both show that context is not a chat transcript. It is core harness state.

Personal Agent learned that lesson in production.

The UI has one continuous user timeline. I do not want users to create ten “new chats” because the model has a context limit. The service was supposed to segment model sessions beneath that continuous timeline, but production configuration failed to do so. Starting July 31, more than 78 normal messages, drills, duplicate cards, failures, and recovery records entered one Session.

The product choice was not self-evident. I could copy a chat product and make users manage context through “new conversation.” I could also bind one user timeline to one permanent model session for the most continuous memory experience. I chose a third option: **the user experiences one continuous timeline, while the service segments model sessions and constructs the minimum sufficient context from facts for each call.**

I did not want to turn a model limitation into the user's information architecture, and I did not want “always remembers” to mean “the model sees every unfiltered historical event.” A continuous experience and continuous model context are different things.

During a drill, the model answered a bookkeeping request in prose without calling a tool. Worse, the system wrapped the DirectAnswer as an operation result with `state=succeeded`, then fed it back as successful history.

The model did not see “the tool call was missed last time.” It saw “this answer succeeded last time.” After several rounds, the same model and the same request—“coffee, 18, personal expense”—called a tool in a clean session but claimed completion directly in the contaminated one.

The incident forced me to separate concepts that had been blurred together:

- **User timeline**: the continuous experience shown to the user;
- **Model session**: the semantic boundary for one task and its dialogue history;
- **Model context**: the projection visible to one inference call;
- **Long-term memory**: selected stable preferences retained across sessions;
- **Structured facts**: amounts, external record IDs, idempotency keys, receipts, approvals, and failure reasons.

Structured facts cannot be rewritten into natural-language summaries by compaction. The same event may remain permanent in audit and visible to the user while being excluded from the model. If it enters model context, it must carry the correct failure semantics.

The repair was not a stronger prompt. I closed the contaminated session and added a deterministic gate: when input contains both an amount and bookkeeping intent but no write tool call occurred, a direct answer cannot be marked successful.

This choice means I own session boundaries, context projection, and failure semantics. That is clearly more expensive than saving a complete transcript. But the incident showed that without governance, an error does not merely remain in history; the next model call treats it as an example and amplifies it. The long-term memory I want is not “retain the most.” It is “retain only what deserves to influence future decisions.”

**The conclusion: an event log is a fact source, not a prompt. Context is a governed projection. Without projection rules, “long-term memory” easily becomes long-term contamination.**

## Layer Five: Permission and Human Collaboration—Putting a Human in the Loop Also Requires an Exit

General harnesses already handle many pre-action permissions: whether a command enters a sandbox, whether files are writable, whether networking is available, when approval appears, and how work continues after rejection. Codex App Server expresses approval pauses as cross-client protocol events. DSH makes approval and permission composable capabilities.

A real business system also needs human collaboration after an action may have occurred.

During real-device acceptance, the first submission of an expense was interrupted and the Agent quickly entered `needs_manual_review`. Four seconds later, Finance reconciled the same idempotency identity, confirmed exactly one record, and verified the receipt. But the Agent state was frozen. The iPhone only said “check manually.” There was no action button, no endpoint to write the conclusion, and at that moment not even a deep link to open the ledger.

I had put a human into the loop without designing an exit.

Several repairs looked reasonable: give the user a free-text note; add “confirm success” and “confirm failure” buttons that directly rewrite state; or store human observation as a separate fact beside machine state. The first two were faster, but the user's last click would overwrite what the system had already proved.

I chose the third. The principle is not distrust of humans. It is that **humans and machines have different evidence capabilities**. The machine can prove which receipt it read. A person can report what they currently see in the ledger. The two may conflict, but neither side should silently erase the other.

The incident made me separate at least four human roles:

1. **Approval**: before an action, choose allow or deny;
2. **Arbitration**: when system evidence conflicts, choose the next step;
3. **Observation**: when the system cannot read the fact source, record what a human saw;
4. **Correction**: after completion, append a repair to presentation or classification.

Those roles cannot share one confirmation boolean. Human observation cannot overwrite machine evidence. I eventually kept `manual_resolution` beside system state: the machine records what it proved; the person records “the ledger contains it” or “the ledger does not.” If the same person later submits the opposite conclusion, the system rejects silent overwrite because the contradiction is itself a new fact.

To make the decision executable, I added constraints: manual conclusions use a closed set of values; only an operation actually parked for manual review may carry one; a second contradictory conclusion cannot overwrite the first; and a deterministic correction such as category selection may be executed by the UI while remaining hidden from the model.

Category correction produced another boundary: “a human can execute” is not the same as “the model can execute.” A deterministic iOS picker may append a verified timeline fact so the correction survives restart, while the execution capability remains hidden from the model.

The cost is that state does not become “clean” after one tap. Contradictions remain visible. The UI must distinguish machine conclusion from human observation, and recovery must know what a manual conclusion may and may not affect. Preserving disagreement is more honest and auditable than manufacturing one unified answer.

**The conclusion: do not ask only whether a human is in the loop. Ask which side of the side-effect boundary they occupy, what role they play, and what kind of fact their conclusion becomes.**

## Layer Six: Evidence and Recovery—Completion Cannot Be Self-Reported

By local development metrics, Personal Agent Phase One looked solid: from July 23 to August 7, 201 commits, 1,995 automated tests, and 38 evidence documents. Google ADK, Finance MCP, iOS, ECS, push notification, backup, and recovery all existed.

What changed my judgment was not those numbers. It was how often they were insufficient.

During Phase One I had to decide what could declare “complete.” The loosest standard was tests passing. A more production-like standard was a deployed service returning HTTP 200. I eventually chose a third: each layer supplies a different kind of evidence, and the chain closes at the business fact source. The earlier definitions of completion could all be true while still failing to prove that the user's intended event occurred.

Two independent reviews each found six blockers behind green suites. During real backup deployment, staging directories, setgid, `UMask=0077`, and a hard-coded `0600` combined so the backup user could list files but not read them. The old verification script checked directory visibility, never a real file read under the backup identity, so all 55 checks stayed green.

The first off-machine restore also “succeeded.” Review later found that the supposedly read-only probe composed the normal Finance runtime and could theoretically reach write paths and Feishu capabilities. After repair, the backup account left both service groups, restore checks used purpose-built read-only entry points, verification grew from 55 to 66 checks, and the complete drill ran again on another Mac.

Final acceptance was not “the backend returned 200.” The real chain was:

> real iPhone → public HTTPS → ECS → Agent → Finance MCP → real Feishu ledger → post-write read-back → phone state update.

For push acceptance, Apple accepting the notification was not completion. Seventeen seconds later, the real device wrote `reviewed_at` back to the service, showing that notification delivery, user action, and server state formed a loop. Even that acceptance run exposed the `needs_manual_review` dead end.

I now separate completion evidence into six layers:

1. local tests cover enumerated offline paths;
2. installed artifacts show the user runs the verified code;
3. service evidence shows the real deployment composition exists;
4. device evidence shows the real client path works;
5. external receipts show a side effect occurred and bind it to the original operation;
6. recovery drills show unknown state can converge after failure and restart.

These layers are not an attempt to maximize check count. Each answers a different question: whether code covers known paths, whether the installed artifact is that code, whether real services are composed correctly, whether the device traverses the full path, whether the external effect binds to the original request, and whether the system can return after failure. An earlier layer cannot sign for a later one.

Independent review cuts across these layers. It cannot prove correctness. It only reduces the risk that implementation and verification share one mistaken assumption.

This is the most expensive decision. A green local suite can still be overturned by a device, backup, or recovery failure. Acceptance depends on devices, networks, and external services and cannot be rerun as cheaply as a unit test. But when a product touches a real ledger, I would rather let evidence reverse my progress than let a polished test report sign on behalf of reality.

A general harness can provide persistence, recovery, sandboxing, and event mechanisms. It cannot define what evidence completes an expense, who signs external success, or which business relationships a restore must verify. Those are domain completion contracts.

Personal Agent still does not solve every threat in a multi-tenant platform, possess Codex's general sandbox, or match Claude Code's interaction maturity. But on the Finance path it actually connects, completion must reach the domain's authoritative fact source instead of being declared by the Agent itself.

**The conclusion: a local green only shows that code satisfied known assumptions. Real completion requires authoritative evidence independent of the execution path's self-report.**

## What the Six Layers Changed About the Public Harnesses

Placed back into these six layers, Claude Code, Codex, DSH, and Personal Agent no longer form one competitor matrix. They operate at different levels of abstraction.

The Claude Code leak showed me **how much product engineering it takes to turn an Agent into daily software**. But leaked source is not a specification. Seeing roughly 500,000 lines does not mean my system should inherit all that complexity.

DSH showed me **that an upper-layer product does not need to rebuild an all-purpose Agent; it can replace model, tool, storage, and sandbox implementations behind stable capability interfaces**.

The later opening of the Codex harness and App Server showed me **that a high-quality general harness can become a shared runtime across interfaces**. If it can eventually own more of my model loop, streaming events, and session infrastructure, I should happily delete duplicate code.

Personal Agent must keep answering another set of questions: when the model must not call a tool, when an external write is actually successful, how failed history avoids contaminating the next turn, how a human supplies evidence after a side effect, and which fact source declares completion.

There are two primary relationships among them:

- **Reuse public capability first**: mature model loops, sessions, tool integration, sandboxes, approvals, and persistence mechanisms should be preferred;
- **Define domain responsibility locally**: idempotency, authoritative fact sources, external receipts, human observation, recovery, and completion criteria belong to the product.

After DSH and then the Codex harness opened up, I no longer ask, “Should I still build a harness?” I ask six narrower questions:

1. Has this layer become stable public infrastructure?
2. Is its lifecycle a model turn or a cross-turn business operation?
3. What is the smallest business consequence this tool may cause?
4. Does this fact belong in audit, UI, model context, or long-term memory?
5. Is the human approving before action or supplying evidence afterward?
6. Which domain authority signs final completion?

These questions now form the decision order I use when extending Personal Agent: identify the fact source, draw the side-effect boundary, define the minimum action and its failure directions, decide model visibility, then add the human role and completion evidence. Model, framework, and tool selection come after those product contracts.

When a public harness already provides a stable capability, I do not need to maintain another implementation. What Personal Agent must preserve is the product contract around personal data and real action.

The model can propose the next action. A public harness can provide the general mechanisms required for reliable execution.

**But whether the job is truly done remains a judgment the product must own.**

---

## References

- [Public reporting on the Claude Code source-map leak — Axios](https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai) (roughly 500,000 lines of code and nearly 2,000 files; the report also says no customer data or credentials were exposed)
- [Unrolling the Codex agent loop — OpenAI](https://openai.com/index/unrolling-the-codex-agent-loop/) (Codex harness agent loop, context, and tool assembly)
- [Unlocking the Codex harness: how we built the App Server — OpenAI](https://openai.com/index/unlocking-the-codex-harness/) (shared harness, App Server, and the Item, Turn, Thread protocol)
- [openai/codex](https://github.com/openai/codex) (the open-source Codex CLI and Rust core)
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (DeepSeek Harness repository)
- [DeepSeek Harness Architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) (Cordis plugin tree, sessions, and composition of foundational capabilities)
- [DSH capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md) (relationships among capability interfaces, implementations, and consumers)

*The Personal Agent incidents, decisions, and numbers in this essay come from the current project status, the Phase One Vibe Coding retrospective, real-device acceptance and bookkeeping-recovery evidence, and the Agent Eval methodology.*
