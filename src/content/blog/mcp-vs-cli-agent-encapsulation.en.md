---
key: mcp-vs-cli-agent-encapsulation
lang: en
title: "\"MCP or CLI\" is the wrong question: tearing apart two agent wrappers of the same API"
date: 2026-06-25
category: Open Platform
readMins: 18
summary: "Everyone asks \"MCP or CLI\" as if picking a protocol. I tore apart, source by source, the two agent-facing wrappers Feishu built over the *same* OpenAPI — lark-mcp, 1,271 auto-generated atomic tools, and lark-cli, a dozen hand-curated domains. The takeaway isn't which to pick; it's that the question is posed backwards. They're two points on one \"coverage × quality\" frontier, split apart by who consumes the output. And interestingly, users voted — with a 20× star gap — for a strikingly consistent conclusion that holds for any platform building agent access: the first layer of wrapping is worth almost nothing."
draft: false
draftTranslation: true
---

"Should our platform build an MCP?" Over the past six months this is the question I've been asked most — and the one I couldn't answer cleanly myself. It usually arrives dressed up as a technical-selection problem: MCP or CLI, pick one of two protocols.

Then I tore apart, source by source, two things Feishu had built. Over a single OpenAPI, Feishu had shipped two agent-facing products at once: **lark-mcp**, 1,271 auto-generated atomic tools; and **lark-cli + skills**, a dozen hand-curated domains of commands. After laying out both real codebases on my own machine — together with their line-by-line mapping down to the underlying REST — the biggest thing I walked away with wasn't "which one." It was the realization that the question had been posed backwards from the start.

Let me put the conclusion up front and unpack it layer by layer:

> **MCP and CLI are not two competing protocols. They are two points on one and the same "coverage × quality" frontier.** What splits them apart isn't whose interface design is cleverer — the caller on both sides is in fact the same reasoning model — it's **through what interface the model consumes the capability**: structured tool-calling in context (MCP: the model picks a tool and fills params; the host executes and returns structured results), or acting like an operator at a terminal, firing a command string at a shell that can't reason and reading back text (CLI). Different mode of consumption, different optimum.

And interestingly, the vote was nearly one-sided: a CLI born 11 months *later* pulled **20×** the stars of the MCP — and the MCP repo has gone quiet while the CLI still ships daily. Even Feishu itself moved its investment off MCP.

This piece is that teardown, made legible: what MCP actually is and isn't; where the shared kernel lives; the four reasons behind that 20× gap; and, once you put it back into the real 2026 coordinates of MCP's boom *and* the backlash hitting at the same time, how a platform building agent access should actually place its bets.

## 1. The two packages, laid out on the table

Before any conclusion, let's put both npm packages on the table and see what they actually are — every judgment later in this piece grows out of this one snapshot.

**`@larksuiteoapi/lark-mcp` (the MCP face).** Open the build output and the core is a `gen-tools` directory: **auto-generated** from Feishu's OpenAPI spec, one REST endpoint to one tool. Count them — **1,271 tools across 52 domains** (POST 540 / GET 435 / DELETE 124…), plus only **2** hand-written composite tools. But 1,271 is **inventory**, not exposure: at start-up the server registers a single `preset.default` ≈ **19 tools** by default (IM 5 + Base 7 + Doc 6 + Contact 1); the rest open only on demand with `-t`.

**`@larksuite/cli` (the CLI face).** It is **not** a 1:1 mirror — it's two layers. A thin **schema layer**: **120 methods across 9 services** (calendar, drive, im, mail…), 1:1 with REST, `schema`-introspectable, each method linking straight to its official doc. A thick **shortcut layer**: about **126 `+commands`** spanning ~11 domains (`base` 68 · `task` 12 · `mail` 11 · `im` 10…), often 1:N — one command orchestrating several endpoints, branching on parameters, or adding client-side logic (name→ID resolution, auto-pagination, query DSL).

**The relationship between them is the real point.** They look worlds apart, but underneath they stand on **the same normalized descriptor IR**: each MCP tool is one data descriptor (name / a description for the model / params schema / REST path / method); the CLI's `schema` introspection output is **also** a structured IR (`id` / `path` / `httpMethod` / `docUrl`, even a per-param example). **Capability is made into data** — so one spec auto-renders into 1,271 MCP tools *and* into the CLI's thin schema layer; the ~126 thick shortcuts, where CLI's value actually lives, are hand-piled on top, **not auto-generated**. That distinction (auto-generated vs hand-curated) is the root of everything below.

| | lark-mcp (MCP face) | lark-cli (CLI face) |
|---|---|---|
| Relation to API | auto-generated · 1:1 | thin 1:1 ＋ thick 1:N |
| Scale | 1,271 tools / 52 domains | 120 methods / 9 services ＋ ~126 shortcuts |
| Default exposure | `preset.default` ≈ 19 | command tree, by domain |
| Hand-built portion | just 2 composite tools | the whole shortcut layer |
| Shared base | one descriptor IR: name/description/schema/path/method | same (CLI `schema` output *is* the IR) |

![Architecture: the IR auto-renders the "auto-generated layer" (all 1,271 MCP tools + CLI's thin schema); the CLI's ~126 shortcuts and Skills are a "hand-curated layer" piled on top, where the value is; both serve the Agent](/blog/mcp-vs-cli-agent-encapsulation/architecture.en.svg)

Three numbers to hold onto: **MCP has 1,271 tools but exposes 19 by default**; **CLI has 120 thin commands ＋ ~126 shortcuts**; **both faces share one IR**. The next three steps work out, in turn: what this means MCP actually is, why it splits into these two faces, and why users cast a 20× star vote for the CLI.

## 2. So what is MCP, actually

Those numbers alone already overturn the two first impressions most people carry about MCP.

**First, "it dumps a thousand-plus tools on the model" — it doesn't.** 1,271 is inventory; only a dozen-ish are exposed by default. Stuffing all 1,271 into context is precisely MCP's most-criticized anti-pattern (I do that math in §6), and Feishu's default config is already dodging it.

**Second, "the model has to assemble the call out of that pile" — it doesn't either.** Open any tool and it's that pure-data descriptor: a name, a description for the model, a params schema, and — crucially — the REST path and HTTP method **already baked in**. So all the model does is standard function calling: pick a tool, fill the schema; how the path is assembled, whether the method is GET or POST, where the token goes — a roughly 30-line generic handler does that off the descriptor. The model never touches REST.

So what does the model still do itself? One thing, and it genuinely is on the model: **chaining multi-step work.** The tools are atomic (one tool = one endpoint); stringing together "look up the ID → call the write endpoint → retry on failure" is nobody's job but the model's. This one I'm not correcting but flagging — because **who you hand "stringing atomic capabilities into a workflow correctly" to is one of the most central decisions in building a platform**, and the real origin of every MCP-vs-CLI fork that follows.

Put it all together and MCP's true shape is clear: it isn't "a better API" — it's **a unified agent-service interface protocol**. What it actually standardizes is "any agent discovering and invoking any service in the same way," with **runtime tool discovery** at its core (connect to the server, the server announces what tools exist, the agent doesn't have to read docs in advance).

But it carries a congenital weakness, which the teardown only confirmed: **MCP standardizes transport, not semantics.** Every vendor defines its own tool names and parameter structures, so ecosystem fragmentation merely shifts from "fragmented access methods" to "fragmented tool semantics." That hole is the seed for everything later.

## 3. The real kernel isn't either face — it's the IR underneath

§1 already pointed out that the two faces share one descriptor IR. That deserves unpacking on its own — because that IR, not MCP or either face, is the system's real asset. Laid out in full (Feishu's source calls it `McpTool`), it's one piece of **pure data**, not a piece of code:

```ts
interface McpTool {
  name: string;          // canonical dotted name: bitable.v1.appTableRecord.create
  description: string;   // the only natural-language field, fed to the LLM
  schema: any;           // params (zod), partitioned into data/path/params
  path?: string;         // REST template with :placeholders
  httpMethod?: string;
  accessTokens?: string[]; // ['tenant','user']
}
```

Two details make it the kernel: natural language is a single field, `description`; everything else is structured metadata. And `path` + `httpMethod` are mandatory — that's exactly the backing for the "callable without depending on the SDK" point from §1. The roughly 30-line generic handler can dispatch all thousand-plus tools precisely because of this: split the dotted name, walk down the SDK object tree level by level; **the moment the SDK hasn't caught up with a new endpoint, fall back to firing raw HTTP straight from the descriptor's `path` + `httpMethod`.**

That "`path` fallback escape hatch" is the design I admire most: it **decouples the generation layer (which must cover everything) from the SDK-wrapping layer (which is always half a step behind)** — zero wait for new endpoints. But the bigger lesson is that one line: **make "how to call it" data, not code.** Precisely because capability is data, one IR auto-renders into MCP's 1,271 tools *and* the CLI's thin schema layer; change the spec, regenerate, humans never touch the output. But don't overstate it: what auto-renders is only the "mechanical mirror" layer; CLI's real value — those ~126 thick shortcuts — is hand-piled on top of the IR, precisely **not** part of the auto-generation (the very setup for §5's "scalability is an illusion").

> For a platform building agent access, that's the first transferable conclusion: **the asset you should actually accumulate isn't the MCP server, and isn't the CLI — it's that spec/IR shared by every face underneath.** Only then can a quality improvement "be made once and propagate everywhere," instead of being locked into the hand-maintenance of one particular face.

## 4. The two faces are a fork forced by the mode of consumption

With the shared kernel in view, why the two faces look so different becomes obvious — **because the way the model consumes each face differs, and so does the friction each can absorb.**

**The MCP face: auto-generated, going for breadth.** Strictly 1:1 with the API, 1,271 tools across 52 domains, marginal cost near zero. The model can reason, so it can consume "atomic capabilities" — even when it has to chain three steps itself. Everything Feishu does on this face is **restraint in picking a default set** + occasionally wrapping a high-frequency fixed flow into a composite tool (e.g. "create doc + pour in content" in one shot).

**The CLI face: hand-curated, going for quality.** Here's a counterintuitive number: the CLI exposes only about 120 methods. But "120" isn't "poor coverage" — it's **two levels of deliberate narrowing**:

- **Level one, domain selection (52 → 12):** the CLI admits only the dozen-or-so end-user-facing domains, cutting the other 731 tools — all enterprise-back-office, HR, and PaaS long tail (corehr 218, hire 178, …). Real humans rarely touch these directly, let alone want them in a command line that's supposed to be pleasant.
- **Level two, a three-way split within each domain:** every endpoint either enters the thin schema-command layer (atomic read/write, 1:1), or gets wrapped into a **thick shortcut**, or enters nowhere and is caught by the generic `api` command.

The point is that thick-shortcut layer. Its unit of encapsulation is **a "task," not an "endpoint,"** and its selection criterion is a single one:

> **Wherever the raw API has friction for an agent, wrap a layer. The criterion is "friction," not "importance."**

I sorted the frictions Feishu's shortcuts target into six kinds, each corresponding to something a human fills in from intuition and an agent stalls on:

| Friction | Evidence (Feishu shortcut) |
|---|---|
| **ID resolution** (agent has the name, not the ID) | `+chat-search`: look up chat_id by group name |
| **Multi-endpoint orchestration / enrichment** | `+messages-search`: internally calls mget and batch_query to enrich |
| **Conditional branching** | `+record-upsert`: POST or PATCH depending on whether record_id exists |
| **Reliability** | `+messages-send`: idempotency key built in |
| **Security** | `+resources-download`: forces a safe relative output path |
| **Identity constraints** | every shortcut explicitly marked bot-only / user-only |

Domains with high friction density get more shortcuts: Base 68 (almost every raw API has a pitfall), Task 12, Mail 11, IM 10. **This layer isn't "wrapping the API again" — it's encoding the human engineer's tacit know-how, explicitly.**

The CLI also adds a batch of engineering capabilities MCP has none of, all because it works inside a shell + text pipe: output formats (`--format json/csv/table`), auto-pagination (`--page-all`), preview (`--dry-run`), identity switching (`--as user/bot`), and one gap that's near-universal on the MCP side — **dangerous-operation safety**: the CLI marks 70 methods `danger:true`, and destructive commands require an explicit `--yes`.

By here the "mode of consumption determines form" line closes: the model does structured tool-calling in context and can tolerate atomic capabilities → MCP can just go for breadth; the model fires a one-shot command at a shell that can't reason, with no structured feedback to fall back on → the CLI must scrub the friction clean *before* delivery.

## 5. Then users voted with their feet — 20×

If the story stopped at §4, it would be a tidy "each has its strengths." But interestingly, the number the market handed back doesn't line up with that tidy conclusion. I put the two repos' real data side by side (a snapshot from the teardown day, June 2026):

| | lark-openapi-mcp | lark-cli |
|---|--:|--:|
| Stars | 742 | **14,552 (≈20×)** |
| Created | 2025-04 | 2026-03 (11 months later) |
| Last commit | 2025-08 (**~10 months quiet**) | 2026-06 (**still daily**) |

Born 11 months later, 20× the stars — and the MCP repo has gone dormant while the CLI is updated daily. **Even Feishu itself moved its investment from MCP to CLI + skills.** I stared at that table for a long time, and the conclusion converged to three points:

1. **Users feel "single-call quality"; they can't feel "coverage breadth."** Nobody experiences the existence of those 731 long-tail APIs; everyone works inside their own dozen domains, and there the CLI is visibly better. Breadth is for the dashboard; quality is for the human.
2. **The real product is that skills layer.** What users star isn't "raw capability" — it's "task-level know-how," the thing that actually lets the agent get the job done. The lesson for a platform like Dewu is the most direct one: opening capabilities to agents, the real work isn't exposing the endpoints — it's this know-how layer.
3. **Scalable quality improvement is an illusory advantage.** In theory MCP's quality gaps "fix the generator once, everyone benefits," which sounds more scalable — but Feishu didn't keep investing. The CLI's quality is piled up by hand, one entry at a time, in theory un-scalable — yet it won the present.

(And let me correct a claim I once believed myself: "CLI can `exec`, so it reaches more environments" doesn't hold — today the usable environments are basically the same, and an environment with no shell can run only MCP; see §6. The 20× isn't a reachability win.)

Compress those three into one line, and it's the thing I most want you to remember from this piece:

> **Auto-generating an API into a pile of MCP tools is table stakes — anyone can do it, and it's worth almost nothing to users.** What actually decides life or death is the layer above it: friction removal + task encapsulation + skills. The market spelled it out with a 20× star gap.

## 6. Put it back into 2026: MCP's boom, and the backlash erupting alongside it

But I have to give that conclusion a timestamp and a boundary, or it gets misread as "MCP is useless." It isn't. The real 2026 picture is far more complex than "CLI won."

On one side is MCP's victory at the **protocol** layer: Anthropic donated it to the Agentic AI Foundation under the Linux Foundation, turning a single-vendor protocol into an industry standard; OpenAI deprecated its own Assistants API and moved to MCP. As "the unified AI-facing integration layer," MCP is becoming the de facto default.

On the other side, the backlash also erupted in 2026 — and this is where the information edge lives:

- **Context cost out of control.** Reports note that before the agent does any real work, tool definitions alone eat 40–50% of the context window. The 1,271 tools I saw in Feishu's setup are the extreme form of this problem — which is exactly why it opens only 19 by default, no accident.
- **It isn't only Feishu's users voting with their feet.** In March 2026, Perplexity's CTO publicly announced a move to "traditional API + CLI tools," abandoning MCP, for reasons highly aligned with what I tore out: high token consumption, auth friction, and agent autonomy that actually *dropped*.

More worth fully absorbing are the two answers Anthropic itself offered, because they point at where the frontier is moving:

- **"Writing tools for an agent" is writing a prompt for the agent.** Tiny improvements in tool descriptions yield huge effects — interface quality is, in essence, description quality. That's the same thing I saw in the CLI layer ("encode tacit know-how explicitly"), said two ways.
- **Let the agent write code to call tools, instead of stuffing all tools into context.** Expose MCP tools as an explorable filesystem and have the agent read specific modules on demand — that's **progressive disclosure**: don't preload all capabilities; let the agent explore layer by layer and fetch context as needed.

This matters because it directly rewrites the boundary of §5's conclusion: **as models' tool-retrieval and orchestration abilities strengthen, MCP's "breadth + zero marginal cost" advantage may reclaim the long tail back from the CLI's hand-curation.** Feishu's MCP actually already buries a `recall` meta-tool — "search in natural language for which API to call," essentially RAG over tools — aimed squarely at that future. So "CLI won" is a conclusion about the **present**, not the **endgame**. That frontier line is still moving.

And MCP is making one more bet, this one unrelated to model capability and purely **structural**: **it doesn't depend on a shell / CLI environment.** There's already a small sample of this today — in a hosted / sandboxed agent environment with no shell (say Claude's cowork sandbox), the CLI binary simply can't `exec`, and only MCP can connect. But the real space is further out: phone apps, smart glasses, even AI devices that don't exist yet — none of them can run a command-line binary, yet all of them can speak a protocol. As agents move off the developer's terminal and onto millions of consumer devices, "protocol-native" turns from a niche perk into a moat the CLI structurally can't follow. **The CLI wins the present, where it lives inside a terminal; MCP is betting on the tomorrow where agents leave the terminal.**

## 7. So how should you actually choose: a framework that doesn't run on faith

Having gone the full circle, back to the original question — "should our platform build an MCP" — my answer is no longer to pick a side, but a set of criteria.

**First cut: by mode of consumption.** This is the spine of the whole piece (note: the caller in both is a reasoning model — what differs is *how* and *in what scenario* it consumes):

- **An uncertain set of services, discovered only at runtime** (a general agent that doesn't even know which services it'll meet) → lean toward MCP's atomic capabilities + runtime discovery.
- **Deterministic scenarios, agent-in-loop, auditing or confirmation, or high-risk operations** → lean toward the CLI's curation + skills.

And let me puncture a myth I once believed myself: "the CLI reaches more environments" — it doesn't. Today the two have basically the same usable environments; an environment with no shell (a sandbox, and tomorrow mobile / devices) can run only MCP (see §6). So you pick the CLI for the quality of its hand-curated layer, not because it "runs in more places."

**Second cut: by "first-party vs third-party."** This is one I'd settled earlier, orthogonal to the above: when your own official agent calls your own internal endpoints, the shortest path is **Function Calling, direct** — you don't need MCP's "service discovery + tool description + model selection" overhead at all. Only when you open capabilities to **any third-party agent**, plugging into the whole ecosystem, does MCP's unified protocol start to pay off. In high-determinism scenarios with few, well-defined services, forcing MCP just adds latency and uncertainty.

**Third cut: if you can only invest in one, which first.** My lean: **build CLI + skills first to capture quality and adoption, with MCP as the protocol-native backfill.** The former directly produces value users can feel; the latter is table stakes and loses nothing by arriving later. Doing both is, in essence, a hedge — MCP holds breadth + protocol-native, CLI + skills holds depth + experience.

Three more conclusions that fell out of this teardown and hold broadly for platform building:

- **The base must share one spec/IR**, so a quality improvement can "be made once and propagate everywhere" — don't lock yourself into un-scalable hand-curation.
- **The selection criterion for shortcuts / tools is "friction," not "importance":** ID resolution, orchestration, idempotency, security, pagination, identity — hit a few of those six and it's worth wrapping a layer.
- **Dangerous operations must have marking + a confirmation mechanism** (danger + explicit confirm) — a near-universal gap on the MCP side, and a place you can do better than Feishu.

And above all of this, don't forget the larger judgment: **the API is always the foundation, never the ceiling.** Whether the layer above is a CLI, an MCP, or the agent reading docs itself, what gets called in the end is the same set of atomic APIs; the interface form is still converging, but the quality of the atomic API is an investment that never goes out of date.

## 8. Closing: the moat isn't at the protocol layer

Tie the circle together: MCP or CLI was never a protocol-selection problem. They are two faces rendered from one IR, forked apart by who the consumer is; and the market told us, with a 20× star gap, that **the layer that auto-generates an API into tools — the layer anyone can do — is worth almost nothing.**

What's actually valuable is the layer above: encoding the human engineer's tacit know-how, entry by entry, into task wrappers where "the friction has been scrubbed clean." And the irony of that layer is — **it's precisely the part that doesn't auto-scale.** Auto-generation has zero marginal cost and no takers; hand-curation costs a fortune and won the present. This runs into the same wall as the ending of my last piece: what finally blocks a thing you can technically build is, more often than not, not the technology.

Further out there may be an endgame: when API docs are sufficiently structured and machine-readable, a doc and an MCP tool definition become the same object — **metadata is the doc, the doc is the interface** — and "API integration" as a concept fades out. But we're not there. At today's moment, the bottleneck is still mundane: who is willing to spend the human labor to smooth that friction layer flat, one entry at a time.

That's the version of "should we build an MCP" that's actually worth asking.
