---
key: agent-memory-knowledge-base
lang: en
title: "Why I moved my agents' memory out of the chat window"
date: 2026-06-28
category: AI Collaboration
readMins: 14
summary: "After moving from Claude Chat to Claude Cowork, Claude Code, and then a Codex + Claude dual setup, I became convinced that the real asset is not an agent product's private memory. It is an external, portable, auditable context layer that every agent can read. My current setup splits facts into two systems: the knowledge base for long-term context, and project git for execution context."
draft: false
draftTranslation: true
---

I used to think of AI "memory" as a product feature: ChatGPT remembers a little, Claude remembers a little, Codex reads a few project files. The more heavily I worked with agents, the more backwards that started to feel.

Important memory should not belong to a single agent.

It should belong to me.

The trigger for rebuilding my personal knowledge base was Andrej Karpathy's idea of an [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): instead of making the model retrieve and reassemble raw material every time, let an LLM continuously "compile" raw material into a structured, linked, maintainable Markdown wiki. That landed because I had run into a concrete version of the same problem: my agent conversations, decisions, failure notes, and project retrospectives were scattered across chat windows.

If that information lives only in one agent product's memory, it is not really my asset. It is cached inside that product.

## 1. From chat memory to shared context

My agent workflow moved through several stages.

First came Claude Chat: one chat window for questions, writing, and thinking. At that stage, "memory" felt like part of the product experience. If the agent remembered who I was and what I was working on, that was already useful.

Then I moved to Claude Cowork, where collaboration became project-shaped: files, mounted context, and ongoing tasks. Later, with Claude Code, the agent moved directly into the repo: editing code, running tests, reading docs, and doing code review. At that point, the reliable context was no longer the chat transcript. It was git history, PRDs, AGENTS.md, test results, and project documentation.

Then I started using Codex and Claude side by side. Codex is stronger for implementation and git work; Claude is better for design, research, review, and long-context discussion. The pairing is powerful, but it creates a new problem: if context lives inside each product's private memory, it diverges quickly.

One agent remembers a preference; the other does not. One agent made a decision; the other needs me to explain it again. If one account or client suddenly becomes unavailable, part of the working memory disappears with it.

When my Claude account suddenly became unavailable, this became less abstract. The scary part was not losing a tool. It was realizing that if key context lived only inside that tool, I would lose part of my own work memory.

Right before writing this essay, I went through a real migration: I took the long-term preferences, collaboration style, and project background that had accumulated in Claude, organized them into external memory that Codex could read, and made both my work computer and home computer start from the same memory layer. That migration made the point concrete: the valuable thing is not that one product can "remember me"; it is whether memory can be exported, organized, read by a new agent, and kept consistent across machines.

If I depended only on Claude's own memory, switching to Codex would mean retraining many preferences from scratch. If my work computer and home computer each maintained their own memory, they would diverge quickly. The workable solution was to write stable preferences, project rules, and knowledge-base maintenance rules into files, so different agents and different machines can boot from the same external source of truth.

So the conclusion changed: I did not need one agent to remember me better. I needed to move memory out of the agent.

The knowledge base handles long-term context: who I am, my projects, methods, retrospectives, and settled decisions. Project git handles execution context: current code, real diffs, PRDs, tests, and deployment state. Agents read these sources, act on them, and write valuable new context back.

That is the core shift: the knowledge base is not a notes app. It is the shared context layer for multi-agent work.

## 2. Not everything deserves to be stored

The easiest way to ruin a knowledge base is to put everything in it. My current view is the opposite: the value comes from stable selection rules, not from volume.

I store three kinds of information.

The first is reusable future context: collaboration preferences, why a product decision was made, or how to avoid a failure mode next time. If this does not get externalized, I have to re-explain it every time I switch agent or thread.

The second is any fact that affects agent execution: repo rules for my own projects, PRDs, deployment state, the knowledge-base schema, tool configuration, and whether a service has actually been verified. These cannot live only in memory, because agents use them to take further action.

The third is retrospectives worth turning into assets: vibe-coding projects, agent workflows, open-platform methods, and long-term career-development thinking. These are not just useful on the day they are written. They can be recombined later into writing, projects, decisions, and public artifacts.

**There is one boundary that has to be repeated clearly: company documents, internal materials, business data, meeting notes, and sensitive context that can be traced back to a specific internal project must never enter my personal knowledge base. This is not merely "being careful"; it can cross real company compliance and information-security red lines. Agent convenience is not a reason to copy, sync, or rewrite company material into a private system. Work-related pages only keep my own thinking, abstracted methods, properly sanitized retrospectives, and industry-level judgments that can be discussed publicly. In other words, the knowledge base records how I understand and grow; it is not a private copy of company material.**

Temporary chat, one-off emotions, and unverified guesses do not go straight into the wiki. They may stay in raw material, but they are not yet knowledge.

![Knowledge-base tree: raw keeps source material, wiki keeps compiled knowledge, and published mirrors public content.](/blog/agent-memory-knowledge-base/kb-tree.png)

The current structure has three layers:

- `raw/`: source material, preserving context rather than readability; the scope is still limited to personal material, public sources, and sanitized content.
- `wiki/`: compiled knowledge, meant to be reusable, linked, and readable by agents.
- `published/`: mirrors of public content, keeping the website and the knowledge base connected.

The operating principle is simple: raw preserves, wiki compiles, published feeds back, git executes.

## 3. Life, work, investing; the point is not the labels

My wiki has three main pillars: life, work, and investing.

Life is not a diary. It is long-term state management: travel retrospectives, health state, lifestyle patterns, and making projects. Work is not a company-document archive or an internal-material backup. It is personal thinking, methods, AI product thinking, open-platform design, and career-development retrospectives. Investing is not a trade log. It is asset allocation, decision frameworks, and market analysis.

The labels are not decorative. They help agents decide where a new piece of information belongs, where it should be found later, and what pages it should link to.

Some information is not purely textual; it is structured data. I use my personal Feishu workspace for expense tracking and asset-allocation tables, and I connected that personal Feishu setup so agents can read those personal tables within the authorized scope. The monthly financial reviews, spending structure, and explanations of allocation changes then get summarized back into the knowledge base. The split is clear: Feishu is good for tables, fields, and calculations; the knowledge base is good for explanation, judgment, and retrospectives.

**The compliance red line applies here too: this is my personal Feishu workspace and my personal data, not company Feishu. What gets synchronized is personal accounting, asset allocation, and retrospective summaries; no company documents, internal spreadsheets, or business data are involved. Do not connect company Feishu, company spreadsheets, or any internal business data to a personal system just to make agent analysis easier.**

![Knowledge-base index: not loose notes, but a navigable map.](/blog/agent-memory-knowledge-base/kb-index.png)

There is a subtle boundary here: the categories can be personal, but the public description should be safe.

I am comfortable saying that I use AI to track health, life state, and career development. But **detailed health data, financial details, internal work projects, internal documents, and identifiable business information should not appear in a public article, and should not be copied verbatim into my personal knowledge base either**. The article should show the system shape, not private content.

## 4. Why the log matters

With only wiki pages, the knowledge base would quickly become just another folder.

So I keep two files at the center: `index.md` and `log.md`. The index answers "what exists"; the log answers "why did it change."

Whenever an important page is added or revised, the log records the source, action, updated pages, and core conclusion. This has two benefits.

First, I can track where knowledge came from. Once agents are involved in writing and summarizing, it becomes hard to tell months later whether a paragraph is a fact, an inference, or a temporary agent summary unless the source is recorded.

Second, the next agent can recover context quickly. It does not need to reread the entire vault. It can start from the index and recent logs to understand what changed, which pages are now facts, and which conclusions were corrected.

![Knowledge-base operation log: source, action, updated pages, and core conclusions.](/blog/agent-memory-knowledge-base/kb-log.png)

This matters even more in multi-agent work. Claude can do work that Codex later continues from the log. Codex can update a rule that Claude reads next time. Memory stops belonging to one tool and becomes shared fact through files.

## 5. AGENTS / CLAUDE files as maintenance protocol

A directory structure is not enough. If an agent does not know the rules, it will eventually make a mess.

So the knowledge base has a rules file that tells agents how language should be written, how directories are organized, where raw ends and wiki begins, which files are read-only, which files are maintainable, and when index and log must be updated.

![Knowledge-base rules: raw/wiki/published layers and the maintenance protocol for agents.](/blog/agent-memory-knowledge-base/kb-rules.png)

In a coding project, this is easy to understand: AGENTS.md or CLAUDE.md tells the agent how to run tests, how to modify code, and what not to touch. In a knowledge base, the same pattern applies. It is not a README for humans; it is an operating protocol for future agents.

This is why I increasingly think in terms of two fact sources: project git and the knowledge base.

Project git owns execution facts: code, diffs, commits, tests, and deployments.

The knowledge base owns long-term facts: decisions, retrospectives, methods, context, and public-content mirrors.

The agent is not the source of truth. The agent is the worker that reads the sources of truth.

## 6. The hardest failures were paths, not models

Once the system started running, the annoying failures did not come from model capability. They came from infrastructure.

The first problem was iCloud. My Obsidian vault lives in iCloud, which works well across my phone and home Mac. But iCloud Drive can be disabled in some work environments. The knowledge system itself may be sound, and the cross-device strategy may be reasonable, yet the vault can still become unavailable on those machines.

That made "externalized memory" feel much more concrete. Once memory is externalized, paths, sync, permissions, and mounts are part of the system.

So I stopped treating iCloud as the only sync layer.

iCloud is still good for the daily Obsidian experience: phone access, home Mac sync, and quick reading. But it is not stable enough to be the only agent-collaboration base, because a work computer may disable iCloud Drive, and MCP can also be tripped up by spaces, apostrophes, and special directory names in the real path.

The layer that actually keeps the work computer and home computer consistent is a private GitHub repository.

This follows the same logic as a code project: the local folder is a working copy; sync, version history, and recovery belong to git. The knowledge base works similarly. Obsidian gives me the reading and editing experience; iCloud gives convenient sync across personal devices; a private GitHub repository gives cross-machine consistency, change history, and rollback. Even if iCloud is unavailable on one machine, I can pull the same knowledge base through git and let Claude, Codex, or another agent read the same source of truth.

**Of course, what is synced here is still only personal thinking, public-source notes, and sanitized retrospectives. Company documents, internal materials, and sensitive business information must never enter this private repository. Private does not mean compliant, and "only I can see it" is not a valid reason to put company material into a personal repo.**

The second problem was the iCloud path itself. On macOS, the real Obsidian iCloud vault path looks like this:

```text
/Users/.../Library/Mobile Documents/iCloud~md~obsidian/Documents/Henson's Personal Knowledge
```

It contains spaces, apostrophes, and special directory names. For a human, it is just a path. For an MCP filesystem server, it can become a parsing and configuration failure. I eventually used a stable symlink to collapse the complex path into a clean entry point, then let agents access the vault through that entry point.

The third problem was that different agents' memories are not shared. Claude Chat, Claude Cowork, Claude Code, and Codex all have their own context boundaries. You cannot assume a preference inside one product will appear inside another.

The conclusion is not that product memory is bad. Product memory improves experience. It just cannot be the system source of truth.

## 7. What the system actually solved

Looking back, I did not build a more complicated notes system. I built a more stable collaboration protocol.

It solves migration. If the agent, account, or client changes, the core context remains as long as the knowledge base and repo remain.

It solves handoff. One agent does not have to guess what another decided; it can read the log, wiki, and git history.

It solves reuse. A project retrospective is not just a summary for that day. It can become material for the next essay, the next project, the next interview story, or the next product decision.

And it solves boundaries. The raw/wiki split tells me what is only material and what has become knowledge. The git/KB split tells me what is execution fact and what is long-term context.

That is my current definition of a personal knowledge base:

> A personal knowledge base is not just a second brain or a notes app.  
> In the agent era, it is infrastructure for externalizing personal context out of product memory.

When agents were only chat assistants, memory inside the chat window was enough.

When agents enter repos, write code, review diffs, maintain docs, and hand work across models, memory has to leave the chat window. It has to become an external source of truth that all of them can read, update, and audit.

That is why I moved my agents' memory out of the chat window.
