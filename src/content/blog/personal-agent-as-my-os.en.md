---
key: personal-agent-as-my-os
lang: en
title: "I Suddenly Realized: Coding Agents May Just Be Suppliers to My Personal Agent"
date: 2026-09-02
category: AI Collaboration
readMins: 12
summary: "After wrestling with an automated development graph for months, I realized that what I want to own is not one stronger coding agent. It is a Personal Agent whose memory, tools, and rules I control—and which treats models and agents as service providers."
related:
  - harness-governance-scar-tissue
  - agent-memory-knowledge-base
draft: false
draftTranslation: true
---

I have been building my own Personal Agent for a while now.

Recently, I have been working through its hardest part: how to let it complete software development automatically.

The ideal flow sounds simple. I submit a requirement from my phone. My Personal Agent hands it to a coding agent. The coding agent writes the code, runs the tests, completes a review, and returns a pull request that is ready to merge.

In practice, it is nothing like that.

What happens when the coding agent runs out of quota halfway through a task? If I switch models, how does the new model learn what has already happened? When an agent says the tests passed, should I trust it? If the first review finds five blockers, who reviews the fixes? If the second review finds three new problems, when should the loop continue, and when must it stop and ask a human? If the Mac mini disconnects halfway through execution, how does the ECS know whether a commit was actually produced? If cancellation happens after an external write, where does recovery begin?

The more I build, the less this feels like integrating a coding agent. It feels like building a miniature software production line.

State machines, task leases, heartbeats, checkpoints, artifact hashes, independent review, failure recovery, one-time permissions—every solved problem seems to reveal two more. Lately I have started to question the whole exercise: is all this complexity really justified just so I can spend fewer evenings at my computer?

My original motivation was much simpler.

Every evening, I would switch back and forth between Codex and Claude Code. I would give the requirement to one and ask it to implement it, hand the diff to the other for review, copy the review findings back for fixes, and then open a fresh context for another review. When one model ran out of quota, I would move the task to another.

Often, I felt less like a developer and more like a messenger between several very smart colleagues.

So I started building a graph to automate the handoffs. It was supposed to be a practical project that would free me from the computer.

Then I suddenly realized that it might be more than that.

## Why model companies build their own coding agents

Today I asked ChatGPT a question:

> Codex and Claude Code are already powerful. Their coding harnesses can, at least technically, be separated from the underlying models, and more multi-model execution frameworks keep appearing. Why do model companies still compete to build their own coding agents? Why not just sell models?

What follows is not a strategy that any of these companies has publicly admitted. It is my inference from the shape of their products.

The short-term case is easy to understand. Coding agents consume an enormous number of tokens. They read repositories, search files, edit code, run commands, encounter errors, revise their work, rerun tests, and review the result. A complete task consumes far more than an ordinary chat.

Coding is also a valuable feedback environment for models. The user provides a goal; the agent takes observable actions; the code either compiles or does not; tests pass or fail; and the final change is accepted or rejected. Those outcomes are much clearer than a user merely feeling that an answer was “pretty good.” Whoever owns the coding agent is closer to a large volume of real, verifiable work trajectories.

Then there is distribution. Most people do not perform fine-grained model routing every day. If they install Claude Code, they will probably use Claude by default. If they install Codex, they will probably use GPT by default. The entry point influences the default choice, and the default choice influences usage.

Over the longer term, model companies may be competing not only over who writes code best, but over who owns the work environment above the model: files, terminals, tools, permissions, task history, background execution, and user habits.

If a third party controls that layer, GPT, Claude, Gemini, and DeepSeek can all become replaceable underlying services. The product above them can compare performance, route tasks automatically, control cost, and switch providers. If the model company controls the coding agent, it is no longer selling only an inference call. It owns the place where the user gets work done, strengthening both the product relationship and its pricing power.

The public evolution of these products is at least consistent with that interpretation. OpenAI describes the [Codex app](https://openai.com/index/introducing-the-codex-app/) as a workspace for supervising multiple agents across the lifecycle from design through maintenance, with capabilities expanding beyond code. Anthropic describes the [Claude Agent SDK](https://www.anthropic.com/news/claude-sonnet-4-5) as the same infrastructure that powers Claude Code, made available for non-coding agents as well. These statements do not prove the companies’ commercial motives, but they do show coding agents becoming broader work entry points rather than remaining code generators.

Coding is an unusually good starting point for a general agent. The environment is structured, actions can be recorded, and results can be checked with compilers, tests, and Git. Today an agent writes code. Tomorrow it can connect to Jira, Slack, browsers, cloud services, and deployment systems, moving from “complete this code change” to “complete this piece of work.”

That is why, in my interpretation, coding agents are competing for distribution, data, and pricing power—and for the chance to become the next work environment.

The argument sounded reasonable.

But it immediately raised another question.

## Why do I barely care which agent I use?

If the argument above is right, I should be growing more dependent on one coding agent.

Looking at my actual behavior, however, I seem not to care very much.

Codex, Claude Code, DeepSeek Harness, Qoder, CodeBuddy—I use whichever fits the task. The same is true of models: I choose based on sufficient quality, available quota, and acceptable cost. One model can plan, another can implement, and a completely independent agent can review.

The differences I feel between coding agents are often a matter of speed, or whether a review of the same code returns three blockers or five.

I do not expect one agent to get everything right on the first attempt.

What I actually depend on is repeated checking across different agents and models. The first agent writes. A second agent reviews in a fresh context. The original agent fixes the findings. Then another agent, which has not inherited the previous conclusion, checks again. The final quality does not come from betting on the strongest model. It comes from a process that never allows one model to grade its own work.

Of course, these coding agents are not equivalent. They differ in speed, context capacity, tools, resume behavior, security boundaries, and characteristic failure modes. Switching has real costs too: commands, permission models, output formats, and failure semantics all need adaptation.

So “supplier” is not a dismissal, and it does not mean coding agents have become commodities. It describes the system relationship I want: each agent may have distinct advantages, but none should exclusively own my memory, project state, or right to continue the work. Replacing one provider should not require replacing the whole system.

Why am I able to work this way?

Perhaps because I have already moved the stickiest assets out of the agents themselves.

## My agents do not need to remember my projects

When I work across agents, I barely rely on their proprietary long-term memory.

My [personal knowledge base](/en/blog/agent-memory-knowledge-base/) stores durable context: what I am working on, which decisions I made in the past, which lessons are reusable, and how I prefer to collaborate with agents. It keeps evolving, and different agents can read it.

Project-specific context stays in the repository: project status, PRDs, technical designs, frozen contracts, implementation plans, tests, Git history, and the exact next step.

Whenever an agent completes a phase, it leaves a full handoff: the current state, what it did, what it did not do, which problems it found, where the evidence is, and where the next agent should begin. The next agent does not need to trust a summary of the previous conversation. It can inspect the project’s facts directly.

This is certainly more work than relying on one very long session. I have to maintain the knowledge base, update project state, distinguish verified facts from plans, and make sure the handoff documents do not drift away from the code.

But the payoff is direct: I can switch agents whenever I need to.

Preferences formed in Claude do not need to be taught to Codex from scratch. A project completed by Codex does not depend on its private session to continue. As long as the knowledge base and repository remain available—and project state and handoffs remain accurate—a new agent can reconstruct the scene.

In other words, my memory system is already separated from any specific agent.

The agent no longer owns my project memory. It reads my memory, completes a bounded piece of work, and writes the result back into my system.

Once I saw this clearly, I realized that the Personal Agent I am building may differ from the more common product direction.

## The Personal Agent I need was never a coding agent

When I first decided to [put my spare time into a Personal Agent](/en/blog/all-in-personal-agent/), it was not because I wanted to build a stronger Claude Code or Codex.

I wanted an assistant that serves only me.

When I spend money while I am out, I want to be able to say, “Lunch, 45,” and have it write the transaction into my own ledger. At the end of the month, I want to ask where my money went and receive an answer grounded in records I can verify.

When I want to understand my recent health, it should read my own exercise, sleep, and weight data and produce a periodic review based on the measures I care about.

If I am preparing for a trip to Switzerland, I should be able to ask what clothes to bring. It should know not only the weather, but also my itinerary, what is in my wardrobe, and which combinations I would genuinely wear.

All of these capabilities can be called “tools,” but they are highly non-standard.

Someone else’s ledger does not look like mine. Their health goals, travel habits, and wardrobe will be different too. Even two people who both want to “search for flights” may need different systems. One wants only a price-drop alert. Another needs to check a family calendar, school dates, and reward points. A third must comply with corporate travel policy.

Many of these capabilities are the small projects I have already built through vibe coding. The Personal Agent does not need to reinvent them. It needs to connect them through one entry point so that they share my identity, memory, permissions, and long-term state.

The Personal Agent itself does not need to code, and it does not need to write every document directly.

When it needs a new tool, it can call a coding agent. When it needs the web, it can call a browser agent. When it needs a long investigation, it can call a research agent. The Personal Agent at the top is the system that serves me. The models and agents beneath it are capabilities it procures to complete work.

That reverses my current relationship with AI products.

Today I usually enter Codex, Claude, or ChatGPT and then hand my context to that product. In the future, I would rather enter my own Personal Agent first and let it decide who should complete the task.

```text
Me
↓
My Personal Agent
├── My memory
├── My project state
├── My permission rules
├── My tools and workflows
└── Orchestration
    ├── Codex
    ├── Claude Code
    ├── DeepSeek
    ├── Browser Agent
    └── Research Agent
```

Model companies want to become my operating system—or at least their products are expanding in that direction.

I may be building my own operating system instead, turning them into replaceable service providers inside it.

## What matters is not only what it can do, but whether it can grow new capabilities

Following this thought further, I finally understood why I keep struggling with an automated development graph complex enough to make me question my life choices.

It is not merely automating messages between agents.

If my Personal Agent can only call a few tools that I wrote in advance, every new requirement still sends me back to the computer. I have to design the solution, ask a coding agent to implement it, find another agent to review it, and manually connect the new tool.

But the system changes if the Personal Agent can invoke the development pipeline itself.

When it discovers that its current capabilities are insufficient, it can first produce a development contract: a structured task description that defines the goal, the allowed change boundary, and the acceptance criteria. A coding agent implements the contract. Another agent reviews the change in an independent context. Deterministic tests decide whether the result actually passes. High-risk changes return to me for confirmation. Finally, the new tool or workflow is registered with the Personal Agent as a capability it can use in the future.

Today I might tell it: “Whenever a new project begins, generate a contract before entering development.”

In the future, that should not remain a sentence in a prompt. It should become part of the workflow itself, with a node, state, triggers, tests, and version history.

That is what automatic growth means to me.

It is not a model appearing to understand me better in conversation. It is a system using accumulated state to change what it can actually do next time.

But “growing a new capability” must never mean “letting the agent modify itself without control.” Development contracts, permission boundaries, independent review, deterministic tests, human approval, version history, and rollback are not optional ceremony. They are the conditions that make this idea viable. The unit of growth should be an auditable, reversible capability version—not a prompt that changed at an unknown time for unknown reasons.

I am still far from that goal.

My Personal Agent has completed its [first real Finance path](/en/blog/personal-agent-phase-one/). The automated development system also has an external state machine, remote workers, task leases, checkpoints, deterministic tests, independent review, and candidate commits. But complete capability registration, automatic workflow modification, and general self-extension are not finished.

This article is not a launch announcement for a “personal operating system.”

It records a direction I noticed only after wrestling with engineering details for a long time. I thought I was building a development pipeline to save myself from relaying messages. It may actually be the production line through which my Personal Agent can keep acquiring new capabilities.

## Will the future Personal Agent be an app or a toolkit?

I do not think everyone will build their own Personal Agent.

Many people do not know exactly what they need, and they do not want to maintain a knowledge base, state machines, permissions, and a collection of personal tools. The market will offer ready-to-use third-party agents, just as it offers apps today. For most people, mature products may always be the more sensible choice.

But this leads to an interesting question.

Will these agents remain packaged apps, with vendors deciding what they can do and users choosing from a settings page?

Or will they gradually become toolkits that individuals can modify—systems in which users own their memory, define their tools and rules, and develop new capabilities as needs emerge?

The first path scales more easily. The second is closer to being truly “personal.” The two may coexist for a long time.

If the second path works, the reusable product is not one finished agent. It is the infrastructure for building agents: how to preserve state, compose workflows, allocate permissions across executors, verify outcomes, and turn a development task into a capability that remains useful over time.

The agent each person grows will be different, but the methods that let those agents grow can be shared.

That is the part I hope to open-source gradually.

I do not know whether it will become the beginning of a “personal OS.” It is clearly too early to claim that. Many specific and inconvenient engineering problems remain unsolved.

But many important systems began as something one person built to avoid a little repetitive work.

Who knows?

At the very least, this idea has given me the motivation to keep working through the graph. For me, staying enthusiastic and confident about AI does not mean believing every grand narrative. It means that, while solving one concrete problem after another, I can still see a direction worth following.
