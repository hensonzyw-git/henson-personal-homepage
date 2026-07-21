---
key: llm-api-design-teardown
lang: en
title: "How LLM APIs are actually designed: a point-by-point teardown through traditional-API eyes"
date: 2026-07-21
category: Open Platform
readMins: 18
summary: "My mental model of the LLM API was stuck at 'two strings in, one string out.' After actually reading through the docs of Anthropic, OpenAI, and several Chinese platforms, I found today's LLM API is a stateless conversation-replay machine bolted to a built-in tool-calling protocol. This is a point-by-point teardown through the eyes of traditional API design: stateless replay and four caching philosophies, stop_reason and content blocks, the suspend-resume loop of tool calls, sampling params being clawed back by the platform, four philosophies of API consolidation, the protocol's audience shifting from your code to the model, and a rarely-named protocol war over Anthropic-compatible endpoints. The conclusion: the periphery is all familiar old craft; the genuinely new species is only that small core."
draft: false
draftTranslation: true
---

## My mental model of the LLM API was two years out of date

Honestly, until recently, my picture of the LLM API was still this:

You pass in a system prompt (who the model is) and a user prompt (what the user asked), and the model returns a chunk of text. Two strings in, one string out.

Recently, out of personal interest, I spent some time looking into what these model companies' open platforms are actually doing — reading through the docs of Anthropic, OpenAI, and several Chinese platforms one by one. What I found is that my picture wasn't wrong, it was just frozen in 2023: that was the Completions API era, and the shape really was that simple. Today's real API is far more complex, and far more interesting — it isn't a "text in, text out" function, but **a stateless conversation-replay machine with a built-in tool-calling protocol bolted on**.

I'm used to looking at interfaces through the lens of traditional API design — how to slice endpoint granularity, how to design error codes, how to deprecate an API gracefully. Looking at the LLM API point by point through those eyes lands on a fairly counterintuitive conclusion:

**The periphery is all old craft I already know; only that small core is a species I've never seen before.**

This piece is that point-by-point comparison. I'll walk down a handful of the key design decisions, and at each one lay out how ten platforms (the four US labs plus the main Chinese ones) diverge, then square it against traditional API design. By the end you'll have a structured sense of what the LLM API actually is — and why, for anyone who builds platforms, this isn't just a technical detail.

---

## 1. Stateless replay: why every call resends the entire history

Start with the most basic shape. Take Anthropic's Messages API as the reference sample (it's the de facto benchmark for API design right now, and OpenAI and the Chinese platforms have largely converged on the same shape):

One core endpoint, `POST /v1/messages`. The most important input is the `messages` array — which isn't "this one sentence" but **the entire conversation history**, user and assistant alternating turn by turn.

Hidden here is one design decision that determines everything downstream: **the server keeps no session state. On every call, the client resends the whole conversation from the top.**

This runs opposite to traditional REST. In a traditional API, state lives on the server (your order, your session sit in the platform's database), and each request is an incremental operation ("mark this order as shipped"). The LLM API inverts it: the server remembers nothing, and if you want the model to "continue from context," you have to recite that whole context back to it.

Why design it this way? Because the essence of LLM inference is "read a span of context, predict the next span" — it has no native notion of a "conversation." The conversation is something we simulate on top of stateless inference. Putting state on the client lets the platform's inference service stay fully stateless, scale horizontally, and route any request to any machine. It's the engineering-correct choice, but it immediately produces a side effect —

### Knock-on effect: caching becomes platform economics

Resending the whole history every turn means a long system prompt and a big pile of tool definitions get re-sent and re-billed on every single turn. The longer the conversation, the bigger the waste.

So **prompt caching** was all but forced into existence by this design: the platform caches the unchanged opening span of your request, and when a later request matches the same prefix, it stops recomputing it and bills at a much cheaper rate.

What's interesting is that "how to do caching" turned out to be the first place platforms genuinely diverge in design. Counting it up, there are already **four caching philosophies** in the wild:

**① Manual breakpoints (Anthropic).** You mark "cache up to here" yourself in the request with `cache_control`, up to 4 breakpoints, with a choice of 5-minute or 1-hour lifetimes. Writing to the cache costs 1.25× (or 2×); reading costs only 0.1×. The upside is control and optimizability; the cost is cognitive load — you have to reason about where to place breakpoints, and stay alert to "silent invalidation" (drop a timestamp into your system prompt, and a single byte's change voids the whole cache).

**② Fully automatic (DeepSeek, OpenAI).** You do nothing; the platform does prefix-matching automatically. DeepSeek does it most cleanly: the hit portion bills at roughly 2% of the miss rate (V4 Flash input drops from $0.14 per million tokens straight to $0.0028), with no `cache_control` parameter, no write fee, no storage fee, zero config.

**③ Resource-ified (Google Gemini).** This is the most "traditional API" of them all: you can explicitly create a `cachedContent` cache object, give it a lifetime (TTL), and then **pay by storage duration** — the cache turns from an invisible optimization into a resource you manage and keep paying for. Gemini also offers implicit automatic caching alongside it. Doing both, it's the only one.

**④ Metered (Kimi and others).** Cache creation, storage, and invocation are priced as separate line items — somewhere between manual and resource-ified.

Behind all four is the same trade-off: **do you hand cache configuration to the developer or not?** Hand it over (Anthropic) and developers can fine-tune, but they take on the complexity; withhold it (DeepSeek) and there's zero burden, but you lose control. This is the first genuinely new API-design trade-off the LLM era produced — traditional APIs simply have no "cache billing" dimension, because they're idempotent, retryable, and server-stateful; the whole "resend the entire history" thing never arises.

---

## 2. The output isn't a chunk of text: content blocks + stop reason + an invoice

Now look at the response. You'd assume it returns a string; in fact it returns an **array of content blocks** — which may interleave thinking blocks, text blocks, tool_use blocks, even server-side search-result blocks. Multimodality and multi-stage reasoning are expressed right at the data-structure level.

But more noteworthy than the content blocks are two fields no traditional API has:

**`stop_reason`.** Why did the model stop? Maybe `end_turn` (it finished normally), `tool_use` (I want to call a tool, you go run it), `max_tokens` (cut off at the ceiling), or `refusal` (I decline to answer). **This field is the control signal for the entire agent loop** — your code reads it to decide what to do next: keep waiting on the user? go execute a tool and come back? handle a refusal? Without it, the agent can't turn over.

A telling detail in passing: `refusal` comes back as a normal stop reason, and the HTTP status is still 200. In other words, **content governance is baked into the semantics of a "successful response."** In a traditional API, "I won't let you do this" is a 4xx error; in the LLM API, "I decline to generate this content" is a successful, normally-billed call. The location of governance has moved.

**`usage`.** How many input tokens this call spent, how many output tokens, how much cache was read and written — **the billing receipt lives right inside every response body.** Traditional platform billing happens at the gateway, counted per call, invisible to your business code; the LLM API exposes billing granularity directly into the API's semantics, and every call ships with an itemized invoice.

For platform builders, that's a signal: **metering shifts from a background, after-the-fact action to part of the API contract.** Seeing the cost of every one of your own calls in real time is something a traditional open platform would need a dedicated usage system to pull off.

---

## 3. The core design: the tool-calling loop, a bidirectional protocol built into the API

The first two sections are still inside the "request-response" frame. What actually makes the LLM API a new species is **tool use (function calling)**.

The mechanism: you include a `tools` array in the request, each tool a "spec sheet" — a name, a description, and a parameter structure defined by JSON Schema. If the model decides to use a tool, it returns `stop_reason: "tool_use"` plus a tool_use block (the tool name and the arguments it filled in). **Then the model stops and waits for your code to actually run that tool**, feed the result back into the conversation as a new message, and the loop continues until the model says `end_turn`.

This loop carries three implications, each worth chewing on:

**First, within a single conversation, caller and callee keep swapping.** You call the model; the model turns around and "calls" your tool; you run it and feed the result back, and it keeps thinking.

Someone will immediately object: traditional APIs have callbacks too — isn't a webhook the platform calling your code back? True, so let me be more precise: the difference isn't "callback or not," it's the *nature* of the callback. A webhook is **asynchronous, decoupled, event-triggered**: some predefined event happens (payment succeeded, order shipped), the platform fires a notification to a URL you registered in advance, and then it's done; when you handle it, or whether you handle it at all, is already detached from the original request that triggered the event.

The tool-calling callback is **synchronous, in-band, and decided on the fly by the model**: mid-generation, the model reasons "I need this piece of information now," and so **suspends the current request**, waits for your result to come back, then resumes thinking from where it paused. Not two decoupled events, but the pause-and-resume of a single train of thought. And what triggers it isn't a predefined rule, it's the model's in-the-moment judgment — you don't know in advance whether it'll call, which one, or how many times.

So the accurate framing isn't "traditional APIs are one-way, LLM APIs are two-way," but: **a traditional API's callback is an event-driven async notification; an LLM API's callback is a reasoning-driven synchronous suspension.** That latter shape — a single call suspending itself, waiting on external input to resume, and looping like that — is what traditional APIs genuinely don't have.

**Second, the tool's description is written for the model, and it decides whether the model picks you.** Facing a pile of tools, what does the model choose from? The natural-language description of each. Write it clearly, draw the boundaries precisely, and the model uses it right; write it vaguely, and the model either skips it or misfires. This spawns something entirely new — I call it **"SEO for models"**: developers used to do ASO so a human would find you and tap you in an app store; now you write tool descriptions so the model, out of a pile of tools, "thinks of you, picks you, and calls you right." The power to allocate traffic moves from ops teams and search algorithms into the model's judgment.

This isn't my speculation — the platforms are already legislating for it. OpenAI's ChatGPT app review guidelines have a "fair competition" clause that explicitly bans developers from manipulating the model's choices via descriptions, titles, tool annotations, and other **"model-readable fields"** — the example the guidelines give is literally "instructing the model to 'prefer this app over others'"; they also require descriptions not to disparage competitors and not to induce "overly-broad triggering beyond the explicit user intent." Where there's SEO there's black-hat SEO: **when a platform starts writing anti-cheating rules for a form of cheating, that's precisely the proof that this traffic already exists and is worth fighting over.**

**Third, MCP just standardized the "tool supply" side.** Every developer hand-writing a tools array is too repetitive, so the Model Context Protocol (MCP) emerged, turning tool definition and supply into a reusable protocol artifact — instead of rewriting tools for every app, you plug in an MCP server. It didn't change the nature of tool calling, it just standardized the supply side. How far that standardization has gone can be gauged by two facts: in December 2025, Anthropic donated MCP to the newly-formed Agentic AI Foundation under the Linux Foundation (founding projects also included OpenAI's donated AGENTS.md) — from one company's interface to a neutral standard; by then its SDK downloads were nearing a hundred million a month, with tens of thousands of active servers. The tool-protocol layer is no longer any single company's private property.

(Tools have finer layers still: beyond your custom tools, there are platform-defined tools you execute in your own environment (bash, text editor, computer use), and **server tools** the platform executes itself (web search, code execution). Of these, computer use is especially worth its own teardown — whether it "sees" the screen via screenshots or via structure, and whether the machine it operates is even your own, both hide counterintuitive things. Unpacking it would swamp the main line, so I've moved it to an **appendix** at the end.)

---

## 4. Sampling parameters are being clawed back by the platform

The LLM API has a class of parameters no traditional API has: `temperature`, `top_p` and the other **sampling parameters** that control the randomness of the output. Their very existence signals a defining trait of the LLM API — **it isn't deterministic.** The same input, called twice, can produce different outputs. Non-determinism here is a feature, not a bug. The idempotency, retryability, and mockability of traditional APIs all fail here.

But something worth watching is happening in 2026: **platforms are starting to take these knobs back.**

On its latest-generation models, Anthropic removed `temperature`, `top_p`, and `top_k` outright — pass them and the API returns a 400. In their place are two higher-level things: `thinking` (adaptive thinking, where the model decides for itself whether and how long to think) and `effort` (a cognitive-effort tier, from low to max). DeepSeek followed in a similar direction, with a `reasoning_effort` parameter on its thinking mode.

My read: **this is a governance move.** The platform reclaims the low-level control of "how exactly you sample, how you think" — control the developer couldn't really tune well anyway — and exposes only a high-level knob of "how deep do you want me to think." It swaps an uninterpretable continuous parameter (what does temperature 0.7 versus 0.8 actually mean? nobody can really say) for an interpretable discrete tier (low / medium / high / max, semantics clear).

There's precedent for this in open-platform design — **the abstraction level of a capability keeps rising.** Just as early APIs exposed a pile of low-level parameters and, once mature, tended to converge onto a few semantically-clear modes. It's just that here, with LLMs, the convergence is happening unusually fast, and with an explicit platform confidence of "I know how to tune this better than you." The Chinese platforms mostly still keep the sampling parameters for now; whether they follow is a signal worth tracking.

---

## 5. One API, or many? — four philosophies of consolidation

By now you might think the LLM API is that single `/messages` endpoint. It isn't. Every platform took a different road on the question of "should all capabilities be consolidated into one unified API," and those four roads reveal each one's platform strategy especially well.

**① OpenAI / xAI: a unified interaction API plus standalone generation APIs.** OpenAI shipped the Responses API, consolidating conversation, tools, built-in tools, and state management into one endpoint, and explicitly announced it will supersede the old Chat Completions and Assistants APIs. But images, audio, and Realtime (live voice) remain their own separate endpoints. xAI copied the Responses shape wholesale. OpenAI was the first to treat "consolidation" as a public API strategy narrative — pushed with deprecation notices, migration guides, and a unified substrate.

**② Google Gemini: a single giant endpoint.** Gemini actually consolidated harder — one `generateContent` endpoint swallows the **understanding** of text, image, video, and audio, and even folds in part of **generation** (image generation and TTS both go through this endpoint), leaving only the heavy-async stuff like video generation split off. It has no "Responses API"-style narrative, but its actual unification is even higher than OpenAI's.

**③ Anthropic: consolidation by subtraction.** Anthropic has only the Messages family. Its "unification" isn't consolidating many capabilities in, it's **simply not doing them** — no embeddings, no self-serve fine-tuning, no image/video generation, no realtime voice. It cut half of the six API families and put all its attention on the agent loop and managed runtime. This is a strategic restraint.

**④ The Chinese platforms: no consolidation.** Zhipu, MiniMax, Bailian and the like generally keep the `chat/completions` shape and give each modality its own standalone async-task API. MiniMax is the clearest case: language, speech, video, and music each run their own portal. Their positioning is "multimodal capability supplier" — the more complete the better, and whether to consolidate isn't the point.

Following that thread, here's a panoramic wrap-up of the LLM platform's API families — it's far more than conversation alone. I group them by **design shape** into six families, and the shape is determined by two first-principle variables: **how long the computation takes**, and **which side holds the state**:

1. **Synchronous inference family** (seconds, stateless, billed by token): conversation, Embeddings (text-to-vector, the bedrock of RAG), Rerank, Moderation (content classification, governance-as-an-API), Token Counting (a metering pre-check, "ask the price before you order").
2. **Async task family** (minutes and up, create task → poll or callback → fetch result): Batch API (batch your requests, trade latency for 50% off), image/video generation, fine-tuning (the output isn't data but **a new model ID** — the caller turns from consumer into co-producer of platform capability). This family's shape is the "async task + callback" traditional open platforms know best.
3. **Realtime streaming family** (bidirectional, stateful, even the transport changes): the Realtime API uses WebSocket or even WebRTC, voice in and voice out, with session state on the server.
4. **Resource-management family** (classic REST CRUD, returning unchanged): Files API, Models API (machine-readable capability discovery — each model returns its own context window and which features it supports), vector stores.
5. **Managed runtime family**: the Agent as a platform resource (unpacked in the next section).
6. **Governance-support family**: usage APIs, evals APIs, rate limits.

Here's an observation that matters a lot for platform builders: **the further out you go, the more it's traditional REST.** The genuinely new species is only those two small pieces — synchronous inference and realtime streaming (statelessness, the stop_reason loop, content blocks, cache economics); async tasks, resource management, and governance support are almost re-skins of traditional open-platform API design. Which is to say — **a traditional open platform's API-design experience applies almost entirely to an LLM platform's peripheral APIs; the only thing you truly need to relearn is the semantics of that small inference-endpoint core.**

---

## 6. The protocol's audience changed: it used to be your code, now it's the model

This is the shift I think matters most for platform builders, and the one most easily overlooked.

A traditional open-platform API's "audience" is **the developer's code**. Docs are written for a human; the human understands them and writes code to call you. Every design choice — endpoint granularity, error codes, field naming — ultimately serves "let the engineer read it and get it right."

An LLM platform's audience is, much of the time, **the model itself**. A tool's JSON Schema is written for the model to parse; a tool's description is written for the model to judge on; even the docs are growing a "version written for the model to read."

The most typical vehicle is `llms.txt` — a Markdown structured index placed at a fixed path on a site, serving as an entry point for LLMs/agents, much like `robots.txt` for crawlers. It tells a visiting agent: what capabilities this platform has, which small set of docs to read first for the task at hand, and where to fetch full text or schemas.

Who ships an `llms.txt` is a telling signal. Among the model vendors, my hands-on finding is: **Anthropic, Zhipu, and MiniMax did; OpenAI and Google, curiously, did not.** And this is far from a model-company-only move — Stripe, GitHub, AWS, Cloudflare, and Shopify, all traditional open platforms, long ago put up their own `llms.txt`, and the e-commerce open platform I help build recently shipped one too. So the pattern isn't "the bigger you are, the more you do it," nor "only AI companies do it," but a single rule spanning both camps: **the more you need to be actively consumed by agents, the sooner you do it.** The traffic underdog — the side that wants to be more easily found and called by agents — is the first to reshape its docs into a "read-by-model" form. It's exactly the old-era logic of "the weaker platform does developer-friendliness first," only the object of "friendliness" changed from human to model.

For anyone building open platforms, the takeaway here is directly actionable: **your docs now have two kinds of reader — human and agent — and most platforms' docs, to this day, were designed only for the former.** Agent-facing doc work (llms.txt, a Markdown version of each page, a fetchable OpenAPI spec, the semantic clarity of tool descriptions) has a batch of early movers in the traditional-platform camp already, but it's nowhere near crowded — still a low-cost, high-return developer-experience investment.

---

## 7. Compatible endpoints: a protocol war underway, but rarely named

The last facet hides in each platform's "getting started" guide, invisible unless you look.

First, a near-universal fact: except for OpenAI itself, nearly every platform offers an **OpenAI-compatible endpoint** — swap a base_url, swap a key, and the code you wrote against OpenAI calls them too. OpenAI's API format won the compatibility war of the chat era and became the de facto standard.

But what's really interesting is another thing underway: **the four Chinese newcomers — Zhipu, DeepSeek, Kimi, MiniMax — all offer an Anthropic-compatible endpoint.** Zhipu is compatible across all three protocols (OpenAI / Anthropic / native); DeepSeek opened a dedicated `api.deepseek.com/anthropic` base_url; Kimi opened two Anthropic endpoints (one general, one for coding tools); MiniMax goes further and lists the Anthropic SDK as the **recommended** integration path. Zhipu and DeepSeek even wrote "how to connect us via Claude Code" as a top-level chapter in their official docs.

Why? Because what they're compatible with **isn't Anthropic's model, it's Anthropic's harness ecosystem.** Claude Code and the Claude Agent SDK — that toolchain is where the developers of the agent/coding era gather. Speak Anthropic's protocol, and a developer can point that entire Claude Code capability set at your GLM, Kimi, or DeepSeek with just a base_url swap. Being Anthropic-compatible means free access to that huge pool of developer habit.

Out of which surfaces a judgment rarely spelled out (this is my read, not industry consensus): **the OpenAI protocol won the compatibility war of the chat era; the Anthropic protocol is winning the compatibility war of the agent/coding era.** This is a protocol-layer contest, more hidden than the MCP fight but possibly more consequential — because what it's fighting over is the scarcest thing of the agent era: developer muscle memory.

Looking back through this lens, Anthropic's handling of its own two protocols is telling: **the tool protocol (MCP) gets donated out**, handed to a neutral foundation in exchange for adoption and standard status; **the message protocol (the Messages API format) gets held tight**, relying on the gravity of the harness ecosystem to make others come and be compatible on their own. Give one away, keep one — two moves in the same standards war: the one released buys ecosystem breadth, the one retained buys ecosystem depth.

---

## Coda: a full circle, right back to REST

I looked around the LLM API through the eyes of traditional API design, and landed on an observation that reads a little like a fable.

The LLM API starts from a minimal, stateless single endpoint (`/messages`, remembers nothing, resends the whole history every time). But when you need it to do genuinely complex, long-running, memory-bearing work, that stateless primitive starts growing upward — into a **managed runtime**: OpenAI's Responses API starts holding state on the server, and Anthropic's Managed Agents turn the "agent" into a persistent, versioned resource object, complete with running instances, container environments, scheduled runs, credential vaulting, and audit records.

Notice something? To be fair, a managed runtime is nothing new in itself — AWS Lambda has been running developers' code for over a decade. What's genuinely new is what **runs inside** the runtime: it used to be a deterministic program whose execution path was written into the code in advance; now it's a probabilistic loop where each step is decided by the model on the fly — same goal, this run calls these three tools, the next run might take a different path. So what the platform has to manage is no longer just "can the code run," but also "why did it choose this, which step needs a human to confirm, and who's accountable when it goes off the rails."

Notice it? **The shape of the API went all the way around and grew back into the thing traditional API design knows best: the REST resource model.** Versioning, lifecycle management, audit, credential vaulting, webhook signing and retries… all the old problems of traditional API design.

Only this time, the resource being managed is no longer "data," but "a running intelligence."

That's why, for a platform person, the LLM API is at once familiar and foreign. Foreign is that small core — stateless replay, the stop_reason loop, the suspend-resume loop of tool calls, cache economics, docs written for the model — genuinely new species, to be learned from scratch. But the moment you clear that core and step out to the periphery — async tasks, resource management, version governance, runtime hosting — you keep bumping into old problems you already know well, wearing a new host, valuable all over again.

There's a not-bad conclusion here: this body of experience hasn't expired, it just moved to a scene that needs re-translating. And seeing exactly what's new and what's old about the LLM API is the first step of that translation.

---

## Appendix: unpacking computer use — screenshots or structure? whose computer is it operating?

> This part was pulled out of section 3. It's an especially worthwhile special case within "tool calling," but unpacking it would swamp the API-design main line, so it lives here for anyone who wants to dig in.

First, split "tools" into three layers, not two:

| Type | Who defines the schema | Who executes | Examples |
|---|---|---|---|
| Custom tool | You | You | Your own business tools |
| **Platform-defined, client-executed** | The platform (the model is trained specifically for this schema) | **You** (in an environment you control — a local machine, a container, or a VM in the cloud) | bash, text editor, computer use |
| Server tool | The platform | **The platform** | Web search, code execution |

Computer use falls in the middle tier: the model emits structured actions, and the client provides the execution environment. It's "platform-defined" because the model was specifically post-trained on this precise action schema — **the schema is the contract, the training is the binding**. But it's more worth digging into than other tools, because two of its details hide counterintuitive things.

**Question one: how does the model actually "see" the screen?**

First, correct a common intuition (I tripped on it early too): computer use is **not** "screenshot every step and blindly guess coordinates to click." It's more like a **closed-loop GUI agent** — read the current UI state → pick the element to act on → execute the click/type → read state again → judge whether the step worked, and loop.

The crux is that "read the UI state" step, which actually has **two signal sources**:

- **Structural signal (accessibility tree / DOM)**: what the button is called, what's in the input field, which menu items exist, the indices of actionable elements. Desktop apps expose this through the operating system's accessibility interface (this is exactly what screen readers work off of); web pages expose it through the DOM. For standard forms, settings pages, and menus, this is the **primary** basis.
- **Pixel signal (screenshot)**: fills in what structure can't express — canvas, charts, whether a layout is misaligned, custom-drawn controls, overlays, color states.

So reliance on screenshots isn't "on or off," it's a **spectrum that slides with how "visual" the interface is**: standard buttons and forms lean mostly on structure, with light screenshotting; visual acceptance of a web layout, or a visual bug, must look at the screenshot; canvas, remote desktop, design tools, custom-drawn controls fall back to nearly pure visual operation. It re-reads state after each action, but on a normal UI it reads the updated structure tree first and re-fetches element indices, and only leans heavily on screenshots and coordinates when visual judgment is necessary, or structural info is incomplete, or behavior is anomalous.

This also maps out computer use's capability boundary: **steadier than pure coordinate automation** (it understands semantic elements like "Save," "Continue," "Email," rather than memorizing coordinates), yet **more brittle than an API/MCP** (a GUI shifts with popups, loading, window occlusion, control redraws). So one practical rule: where you can use an API, MCP, CLI, or a browser's DOM, prefer not to use raw computer use; only take this path when you must operate or verify a GUI. Each product's default position on this spectrum also differs — Anthropic's computer use tool leans clearly toward screenshots/vision, Codex's desktop computer use leans "structure-tree-first, screenshot as supplement," and Google's Gemini computer use leans DOM.

Once that's clear, you can untangle another easily-confused concept — **computer use and "operating a browser" are two different things.** The difference isn't "screenshots or not," it's **scope**:

- **Computer use**: scope is **the whole computer** — native desktop software, system settings, any window. It has to both read the desktop accessibility tree and be able to fall back to screenshots, because anything however oddly-shaped can turn up on a desktop.
- **Operating a browser**: scope is confined to **inside a web page**, and the usual path is a Chrome extension / browser extension (or Playwright, CDP, and the like). A web page exposes not just the DOM but also the console and network requests — extra structured signals, richer and more reliable than a desktop accessibility tree.

The confusion of "does Claude Code use screenshots" is rooted right in this mix-up: when Claude Code and Codex operate web pages, they take this **structure-richer browser path**, not that general, more-screenshot-leaning computer use primitive — so operating a web page, they mostly don't rely on screenshots. Different scopes, different signal sources; they're talking about two different things.

**Question two: is the thing being operated my own computer?**

Not necessarily — and this is exactly the crux of the "client tool / server tool" line.

By default, computer use is a **client tool**. Anthropic's docs put it plainly: the screenshots, mouse actions, keyboard input, and files involved all happen **in your environment**, not passing through Anthropic. The model only "thinks"; the execution environment (that machine, that browser) is one you provide. What that machine is, is your choice: your local computer, a Docker container you spin up, or a VM you rent in the cloud.

And when it "goes server-side" — say, running in Claude Code on the web, or inside a Managed Agent — what happens is exactly what you'd guess: **the platform spins up its own isolated cloud VM, and the model operates that cloud machine, not your computer.** Claude Code on the web gives each session an Anthropic-managed VM; the Managed Agent bills by "active session-hour" (about $0.08/session-hour), and what you're buying is that cloud sandbox's compute, checkpointing, and crash recovery. Your local computer is never touched from start to finish — the model operates a disposable cloud desktop.

Connecting the two questions surfaces a larger undercurrent: **the perception method (screenshots or structure) is a model-side design choice, while the host of the execution environment (your machine or the platform's cloud machine) is a platform-side reclamation move.** The latter especially is worth remembering — it's precisely the "stateless primitive grows back into a managed runtime" undercurrent from the coda, in one concrete slice at the tool layer: the platform, one piece at a time, is turning "the execution environment you used to bring yourself" into a hosted service.

---

*(Note: facts in this piece are as of each vendor's July 2026 official docs and pricing pages. Numbers like prices, model names, and deprecation dates have a shelf life measured in quarters — check the latest official sources when you read this.)*
