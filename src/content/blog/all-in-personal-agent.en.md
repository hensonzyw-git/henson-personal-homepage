---
key: all-in-personal-agent
lang: en
title: "Why I’m going all-in on a side project: my Personal Agent"
date: 2026-08-03
category: AI Collaboration
readMins: 14
summary: "From ChatGPT, Doubao, Claude Code, and Codex to iCloud Drive, GitHub, and multiple personal data sources: why I am no longer just looking for a better AI tool, but building a Personal Agent I own—one that can continue across devices and take responsibility for real actions."
draft: false
draftTranslation: true
---

The way I use AI has kept changing.

ChatGPT came first. At the time, it felt like a very capable chatbot that was always available: a place to discuss a question, revise a paragraph, or explain an unfamiliar concept. It was more conversational than a search engine, but the basic pattern was still simple: I asked, it answered, and the turn ended.

Then I began using Doubao more often as a search engine. When I needed to clear the ground quickly, compare several claims, or orient myself in an unfamiliar field, search was better at laying the world out first. Later came Claude Chat, which helped me process longer material, organize my thinking, and complete small but coherent pieces of work.

Complex work soon exposed the limits of a chat window. A project is not a single question and answer. It has past decisions, real files, multiple versions, artifacts that require repeated verification, and outcomes that cannot be judged by whether they merely look plausible. So I started using Cowork. When scripts, Skills, file processing, and code changes became part of the work, I moved to Claude Code. Because of quota and availability, I began using Codex much more deeply as well.

This was not a deliberately designed “best AI stack.” It was a natural migration. Each new tool moved the boundary of what I could hand to AI, and each revealed another limitation at the next level of complexity.

```text
Conversation and discussion
  → Search and research
  → Long material and simple deliverables
  → Complex collaboration with files and context
  → Scripts, Skills, and code
  → Ongoing work across projects, agents, and devices
```

By the end of that path, I realized I did not simply need a model that chatted better, or a coding agent that wrote better code.

I needed a system that could connect those capabilities to my real data and real actions.

## AI has entered many individual workflows, but it is not yet my life infrastructure

Over the past few months, I have built a number of AI projects.

My concert radar was the first time I connected unstable information sources, LLM-based structuring, a backend, an iOS client, and daily digests into one chain. My personal website gave me a place to publish my thinking and practice over time. My knowledge base, Agent Sync, scripts, and Skills taught me that context, rules, and continuity across machines are not incidental. The Agent-Ready Benchmark forced a harder question: an agent saying it has finished and an agent actually finishing may be two different things.

These are not separate portfolio pieces. They are accumulating intermediate answers.

AI can already help me write, research, organize a knowledge base, generate scripts, modify code, inspect project state, and even operate parts of an interface. But the more capabilities I add, the clearer it becomes that I am still the person stitching them together.

I move between a Mac mini at home, a work MacBook, an iPhone, and a Windows PC at home. Today, that continuity rests mainly on two layers. iCloud Drive synchronizes material, knowledge-base files, and documents that need to travel with me. GitHub synchronizes code, project state, decisions, and traceable version history. They are the core foundation of my cross-device work.

But synchronizing files is not the same thing as synchronizing actions.

iCloud can give another machine the same material, but it cannot tell me whether an action has been performed, whether it should be performed, or which device is authorized. GitHub lets me resume from project state, review a diff, and recover history, but it is not an interface for high-frequency personal actions on a phone. I still have to remember which Skill contains a rule, which document holds the current state, and whether an agent has received enough context.

More concretely, many frequent actions still stop halfway. An agent can help me understand a ledger or draft a record, but I often have to finish bookkeeping manually in Feishu Bitable. A Xiaohongshu workflow can draft copy, organize topics, and assist with uploading, yet it still stops at a draft or the final confirmation.

The problem is no longer whether the model can write. Between generating an answer and taking a real-world action that someone can be responsible for sit identity, permission, state, confirmation, external results, and failure recovery.

A Skill is excellent for reusing one capability, but it usually depends on the current machine, session, and tool environment. The Personal Agent I want to build adds another layer: controlled capabilities that continue across devices, agents, and time; data that remains in its authoritative system; and actions with explicit permission boundaries, result evidence, and human confirmation when necessary.

This is more than putting additional Skills into a chat window.

## Why now: this has become feasible for me

Personal Agent is not an idea that appeared out of nowhere. It has become worth the investment now because three previously separate conditions have converged.

First, vibe coding has dramatically shortened the distance between being able to judge what a system should be and being able to build something running and inspectable with my own hands. It has not made engineering disappear: services, deployment, permissions, backup, testing, and recovery still need to be faced one by one. But it means I no longer need to wait for a complete team before turning product judgment into a prototype, code, and real feedback. For a personal project, that changes feasibility, not just speed.

Second, six months of deep AI use have made the needs concrete. I did not first decide to build a “personal agent” and then search for use cases. The order was the reverse. Moving every day among chat, search, Cowork, coding agents, a knowledge base, scripts, iCloud Drive, and GitHub repeatedly exposed broken context, scattered permissions, and actions that could not close the loop. That is how I gradually saw what this system needs to solve.

Third, my Agent product work in a company setting has given me a clearer view of what product should decide in an Agent system. A model can propose intent, but product must decide which tools it can see, which actions policy must stop, what evidence counts as completion, when control should return to a person, and how the system should stop and recover after failure. Model capability can be purchased; an agent’s boundary of responsibility cannot be outsourced to the model itself.

Together, these three conditions are what make me willing to turn a scattered collection of Skills and automations into a system that deserves long-term investment and real constraints.

## I am not building another chatbot

Personal Agent is a system for my own personal data and actions.

The iPhone is the most common entry point, not the whole system. The Agent Runtime, sessions, policy, scheduled jobs, audit, and MCP client run on a service I operate. The ledger remains in Feishu Bitable; the knowledge base remains in Obsidian and Git; health, wardrobe, calendar, and other future data each stay in the system best suited to hold them.

The agent does not need to recreate one universal database. Within the scope I authorize, it needs to understand these systems, invoke narrowly defined and business-named capabilities, and bring back a result that can be verified.

Suppose I say “lunch 45” on my iPhone. The useful outcome is not an agent replying “recorded.” The system needs to interpret the date, amount, and category correctly, determine that the entry is not a duplicate, write it to the specified ledger, read it back from Feishu, and return a record I can verify. If the expression is ambiguous, looks duplicated, or exceeds permission, it should stop and ask rather than invent a plausible answer.

That is also why I do not treat the iPhone as the device that should carry all the intelligence. The phone should handle conversation, display, quick actions, reminders, and confirmation. High-privilege credentials, tool discovery, connection governance, model routing, audit, and recovery should remain on the server. If the entry point later expands from iPhone to web, Mac, or another agent host, the system’s core capability and permission boundaries do not have to move with it.

What I want is not a persona that chats for me, but an action layer that I own:

- I do not have to remember where data lives, which app to open, or which script to call.
- I can use the same controlled capabilities from my phone, computers, and different agents.
- Low-risk actions can complete directly; sensitive or irreversible actions must wait for my confirmation.
- The system cannot merely claim “done”; it must provide a result that can be checked in the external system.
- It can gradually move from passive Q&A toward bounded proactive reminders and periodic reviews.

That is why I call it a Personal Agent rather than a personal toolbox or a collection of life Skills. An agent implies continuity and responsibility; a toolbox is just a set of independent capabilities.

## The whole picture reorganizes existing behaviour—it is not a future feature wishlist

This project will not end as a Finance app.

It may gradually cover Finance and assets, the knowledge base, Health, Wardrobe / OOTD, Calendar / Tasks / Reminders, and external action domains such as Xiaohongshu where final publication remains human-controlled. These directions are not an AI feature list invented on a whiteboard.

Before an agent entered the picture, they were already repeated parts of my life. They were simply fragmented across different sources, devices, and manual workflows:

| Existing behaviour | What it relies on today | The layer Personal Agent should add |
| --- | --- | --- |
| Record expenses, query spending, conduct monthly review | Feishu Bitable | Not rebuild another ledger, but connect natural-language entry, controlled writes, and result verification |
| Capture, retrieve, and organize long-term thinking | Obsidian, private Git, `raw/`, and `wiki/` | Not make the model remember everything, but find the right content with provenance and place new material correctly |
| Review health and exercise trends, conduct monthly review | Apple Health / Apple Watch and weight records | Not replace health judgment with chat, but reduce export, aggregation, and repeated-analysis friction while retaining consent and privacy boundaries |
| Manage wardrobe, prepare OOTD, record what was actually worn | iCloud Photos, indexes, existing Skills, and manual feedback | Not generate outfit advice out of thin air, but connect recommendation, actual wear, cleaning state, and the next recommendation |
| Write Xiaohongshu posts, organize visual material, archive after publishing | Material folders, draft workflow, and knowledge base | Not let AI publish publicly for me, but connect material, drafting, form-filling, and archiving while keeping final publication human-controlled |
| Continue the same work across devices | iCloud Drive, GitHub, project-state documents, and different agents | Not mirror every file and runtime state to every device, but synchronize stable rules, project facts, and machine-local private state at the right layers |
| Maintain personal projects, website, and long-running tasks | GitHub, ECS, project-state documents, and different agents | Not build another project-management tool, but keep real state and the next action continuous across entry points |

The whole picture of Personal Agent is therefore not one AI managing my life. It is a gradual effort to connect behaviours I already practice and will continue to practice to one trustworthy set of entry points, permission boundaries, and result mechanisms.

This also means data should not be crudely consolidated into a new database. Ledgers, knowledge bases, health records, photos, and project repositories have different creation processes, retention rules, and authorities. Personal Agent needs to understand those boundaries and cross them when I authorize it, not erase them in the name of unification.

## Why the first chain is Finance only

The whole picture can be large. The first step has to be small.

Phase 1 is Finance only: expenses, income, family funds, queries, and daily human review. It is less flashy than an agent that can discuss every area of life, but it combines the conditions this project needs to validate: it is frequent, cross-device, consequential because it writes to a real system, accessible from natural language, and verifiable by reading back from the external ledger.

The things deliberately left out of Phase 1 matter just as much:

- It is not a general public or multi-tenant AI assistant.
- It does not run a full model and agent loop locally on the phone.
- It does not give a model raw filesystem, database, or full Feishu permissions.
- It does not enable asset writes or allow an agent to autonomously modify or delete high-risk knowledge-base or wardrobe data.
- It does not automatically publish Xiaohongshu posts, blog posts, or other public content.
- It does not make “connect every piece of personal data” the MVP goal or pile complex multi-agent organization into it.

These boundaries are not merely conservative feature trade-offs. They are part of the product definition. An agent that can take real action first has to prove that it stops when it should not act.

I think of Phase 1 as a constrained validation: can one agent plus a narrowed business toolset reliably complete a verifiable write across a real device, a real server, and a real external system? Only if that chain holds will later domains have a foundation worth reusing.

## Four things I prepared before writing the first line of product code

Looking back at the commit history, the start of Personal Agent was not the moment the first line of Python appeared.

Before `DEV-001`, the first production package, the repository already had a full prehistory: a PRD and ECS baseline, framework spikes, Finance rules, a technical design, review fixes, a development breakdown, and a G0 authorization gate.

I had also written spikes to eliminate key uncertainty: synthetic bookkeeping expressions, a local MCP test service, and GLM to verify whether Google ADK and Claude Agent SDK could truly discover and call tools. These experiments only answered whether the route could work. They did not touch a real ledger, and one successful model call was not treated as launch evidence.

### 1. Freeze the Finance business contract

“Lunch 45” looks like a trivial instruction. The moment it writes to a real ledger, questions appear. How are today and yesterday calculated? How are travel, refunds, and shared-expense repayments represented? Which Feishu fields are writable, and which are formulas or automatic IDs? If two expenses look similar on the same day, should the system deduplicate them or stop and ask?

Before writing a connector, I defined the Finance MCP business contract. The model turns natural language into structured intent. Deterministic code owns dates, amounts, categories, permissions, idempotency, and risk decisions. The connector can access only specified fields in the specified annual ledger. Batch writes remain disabled because I did not yet have evidence that the source could provide the all-or-nothing semantics they require.

This includes another important decision: do not hand a generic official Feishu MCP or arbitrary Feishu API to the model. The agent can see only business-named tools such as `finance.log_expense`, `finance.log_income`, and `finance.query_expenses`. Policy, idempotency, and audit run before a minimum-permission Feishu client invokes the native OpenAPI.

I reuse the official MCP SDK for protocol and connections, while designing the Finance MCP and its tool contracts myself. The first choice avoids rewriting low-level protocol machinery. The second ensures that the model receives only the capability required for bookkeeping, not a general Feishu operation surface.

### 2. Use small, real spikes to choose the framework

I did not assume Claude Agent SDK should become the runtime just because I was familiar with Claude Code. Nor did I assume Google ADK fit my constraints merely because it supports MCP.

The questions were more specific. Could GLM truly call MCP tools? Could the framework preserve model replaceability? Could business permissions, the tool catalog, audit, and confirmation remain outside the framework? If I changed the model or framework later, would finance rules and system state have to move with it?

The spikes showed that both routes could run GLM with a local MCP test service. Phase 1 is provisionally ADK-first because it aligns better with a GLM-first strategy, replaceable models, and governance outside the framework. Claude Agent SDK remains a candidate and comparison.

The more important principle is that business permission is defined by the system, not by the model or agent framework. Policy, MCP client, connectors, audit, and external receipts remain independent. That is both a technical choice and a product decision that preserves future options.

### 3. Harden the existing ECS before data arrives

I already had an ECS instance running my personal website and older projects. The simplest option was to start one more service on it. But if Personal Agent may touch a ledger, knowledge base, and more personal data later, “the server is running” is not enough.

Before product development, I tightened the host boundary: public access keeps only necessary entry points; SSH uses a non-root account and public-key login; firewall and automatic blocking are enabled; and the public site and private services do not share deployment identities or credentials. Tailscale worked in a test, but it could conflict with the VPN use I already have on Mac and iPhone, so it was not made a mobile requirement. The default access design became HTTPS, registered-device identity, and short-lived access tokens.

I also kept a rollback point before hardening and moved the system disk to an encrypted form. None of this appears in the product interface, but it decides whether real data deserves to enter the system.

### 4. Separate PRD approval from development authorization

After the PRD was approved, I did not move directly into feature development. I first created a technical-design plan that required these questions in sequence: the trust boundary and deployment shape; how a request flows through success, cancellation, disconnection, and a missing response; the minimum state and audit the server must keep; how Finance freezes its field contract; how keys, service identities, logs, backup, and recovery work; and only then testing, rollout, rollback, and task breakdown.

The first technical review left three P0 issues open: end-to-end operation state and crash recovery were not closed; the device-auth protocol between iOS and server was not concrete enough; and encryption, key rotation, and recovery verification lacked an executable contract.

These could not be left for “tuning after the code exists.” If state authority is unclear, an app could show a ledger entry that was already written as cancelled. If signature encoding is not frozen, Swift and Python could understand the same device identity differently. If a backup cannot be proved decryptable, the existence of the file does not mean the system can recover.

Only after those issues entered the technical design and development breakdown did the project have explicit go/no-go gates, dependency order, failure conditions, and acceptance criteria. Formal production code began after G0 passed.

This preparation did not mean writing less code. It turned “I want to make an agent” into a development contract with explicit stopping conditions for unknown risk.

## Why I did not choose the simplest route

There is always a simpler path for a side project. I could keep capabilities in local Skills and scripts, let an iOS app call an API directly, turn bookkeeping into one isolated automation, or depend entirely on connectors supplied by existing AI products.

But this project is not only about making a feature quickly. I also want to understand the boundaries a personal agent must face once it enters the real world.

| Simpler path | This project’s choice | What I want to validate |
| --- | --- | --- |
| Local Skills and single-machine scripts | Server-side Agent Runtime plus a controlled MCP capability layer | Can the same capability work across devices, entry points, and agents without distributing permissions to every machine? |
| iOS holds data connections directly | Thin client / fat server | Can the phone remain the main entry point without carrying high-privilege credentials and complete business state? |
| Treat model or framework as the complete agent | ADK-first and GLM-first, while Policy, MCP, and connectors remain independent | When model or framework changes, can business rules, permissions, and data sources remain intact? |
| Give the model generic Feishu capabilities | A self-built Finance MCP, business tools, and a minimum-permission Feishu client | Can bookkeeping remain a fixed business action instead of handing general Feishu operations to the model? |
| Prove only a local or simulated path | Deploy to a real ECS and verify identity, isolation, backup, and recovery | Once real data and actions enter the system, what is still missing from “it runs”? |

These choices make the project slower. They bring certificates, deployment order, file permissions, service identities, keys, backups, and recovery—work a toy project may never encounter.

But that is exactly what I want to learn.

For the past six months, I have kept looking for the AI tool best suited to the next kind of task. Now I want to pause the expansion of that tool list and start building a system that connects capability, data, and action.

Its first chain begins with nothing more than “lunch 45.” But what I really want to understand is this: once an agent touches personal data, works across devices, and takes real action, which complexity can be removed—and which complexity is responsibility itself?
