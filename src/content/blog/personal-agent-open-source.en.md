---
key: personal-agent-open-source
lang: en
title: "I Open-Sourced Personal Agent: What Is Included"
date: 2026-09-23
category: AI Collaboration
readMins: 12
summary: After Muse launched, I open-sourced my Personal Agent. Here is what the repository includes, why I will keep building, and how hands-on work changed my engineering, review and acceptance decisions.
related:
  - personal-agent-as-my-os
  - personal-agent-phase-one
draft: false
draftTranslation: true
---

After Muse launched, using it left me with mixed feelings.

What it aims to do is very close to the Personal Agent I have spent the past two months building: work for one person over time, understand their life, connect their data and tools, and carry things through.

The similarity goes beyond the words “personal assistant.” Meta describes Muse as having a dedicated cloud virtual machine and browser, able to keep working after the user leaves the conversation. That immediately reminded me of my own ECS server. An agent needs somewhere persistent to keep state, connect tools and wait for tasks; everything need not fit into one conversation on a phone. [Muse’s official introduction](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)

A dedicated VM and my self-managed ECS are different products, and a server does not make every integration possible. APIs, authentication, permissions and runtime constraints still matter. But they suggest a similar possibility to me: give a personal agent somewhere to keep working, and its capabilities can grow with use.

I can be very partial about what I build. I start with what I need. If my ledger is inconvenient, I connect it first. If developing a capability takes too much effort, I explore handing more of the development process to agents. Muse serves a broad audience and needs capabilities and experiences that many people can use from the start. That is how I understand the two product paths.

My project began in July; the original repository’s first commit was July 23. In August, I wrote about [why I was investing my spare time in Personal Agent](https://zhuyawei.com/en/blog/all-in-personal-agent/) and [what I learned from its first phase](https://zhuyawei.com/en/blog/personal-agent-phase-one/). Muse launched publicly on September 8. This only establishes that my exploration preceded its public launch. I do not know how Meta’s internal development unfolded, and I do not want to use Git dates to claim who thought of it first.

Even knowing that, seeing a large company turn a similar direction into a product was discouraging.

What hurt most was feeling that a direction I had seen early and kept investing in was ultimately being defined by a large company’s product.

I had already written several articles explaining the Personal Agent I wanted and was building it one module at a time. Once Muse appeared, I found myself using it to explain my own work: this is roughly the direction I have been pursuing.

While my exploration was still taking shape, a major product already had the opportunity to become everyone’s reference point. “That validates the direction” did not make the disappointment disappear.

So I decided to organize the work I had done and open-source it as soon as possible.

[**The Personal Agent repository is public under the MIT license.**](https://github.com/hensonzyw-git/personal-agent-open-source)

I do not really know the open-source community, and I have no expectation that it will do something for me in return. I simply hope this product design and architecture provide a concrete example of how an agent can serve an individual, and contribute something to that direction.

## What this release includes

Let me clarify the scope before anyone expects an app they can download and immediately use.

This release contains source code and an architecture reference, with two main paths.

The first is the everyday Personal Agent. The iPhone is the interaction surface; the server runs the agent and accesses personal business data through policy checks and MCP tools. Chat, Finance, sessions and context management have implementations, with usage or acceptance records from my original single-user environment.

The second is an automated development workflow. It attempts to connect requirement confirmation, PRDs, technical design, coding, verification, independent review and delivery. ECS manages task state and authorization; a Mac mini at home executes authorized development steps. There is code and partial live evidence, but the full path from a phone request to development delivery still awaits acceptance.

The repository also includes architecture documentation, a code-reading guide, synthetic evaluation data and verification notes. I preserved Git history after privacy rewriting so readers can see how the project developed. Rewriting changes commit identifiers. What I wanted to retain was the development process, rather than a new directory containing only the final code with no visible history.

**This is not yet a directly deployable public release.** My personal data, credentials, production configuration and full runtime environment are excluded. Something working in my environment does not mean others can reproduce it by cloning the repository. The [verification notes](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/docs/verification.en.md) distinguish implementations, historical evidence and work still awaiting verification.

I built the project mainly with AI coding tools. I own requirements, trade-offs, reviews and acceptance, but making the repository public does not turn every line into best practice. There are still verbose implementations, repeated abstractions and opportunities to simplify. Specific criticism is welcome.

## Why I will keep building after Muse

Personal Agent is a side project through which I invest in learning about AI and agents. Building it myself is central to that goal.

Without doing the work, many engineering problems remain things I have merely heard about. I can know that agents need context, tools and memory, and write about permissions, recovery and evaluation. Where those concepts break down in my own system, what they cost and what trade-offs they require only become concrete through implementation.

“External calls can fail” is a sentence. Deciding whether to retry when the ledger may already have been updated but the server never received the response is a decision I have to face. “Models can review each other” is another sentence. Getting a reviewer to re-examine the requirements instead of repeating the implementer’s assumptions takes practical experience.

Muse can give me a finished product, but it cannot give me those experiences. Even as it becomes more useful, my reasons for continuing remain.

I also want to keep exploring my own needs. A system serving only me can be adjusted around my ledger, the way I organize data and my habits. I do not have to prove that many other people share a need before deciding it is worth building for.

I have already started doing similar work on Muse. My bills, calendar and knowledge base are connected, and it happened very quickly. Compared with laboriously writing code and integrating services myself, the difference in setup speed was obvious.

For connecting these tools, Muse has already saved me a great deal of work. I am happy to use that convenience and will keep building my other tools there, giving both systems the same personal needs to address and comparing their actual use.

But I will also keep building Personal Agent. The setup speed difference is real; so are the problems I encounter firsthand, the understanding I gain and the room to explore my own needs further. Both systems will be part of my practice.

## Open-sourcing has a checklist; building keeps changing my judgment

The release itself is a relatively well-defined set of engineering tasks: remove private information, organize licensing and documentation, create a public repository, inspect history and build artifacts, and consider how future private development will reach the public version.

That does not mean deleting a few configuration files is sufficient. During this work, we found further material to clean in history and synthetic cases. Future updates cannot simply push the private repository into the public one. They need ongoing sanitization and verification; I do not want to imply that a complete automated pipeline already exists.

Still, the objectives of these tasks are fairly clear. What I really want to record is the judgment I did not start with and had to develop along the way.

## I intended to rely on it from day one

I never intended Personal Agent to be a project I could switch off after a demonstration.

It would access my data, write to my ledger and run while I was not watching. If I intended to rely on it, I had to consider what would happen when my computer shut down, the service restarted, data became corrupted or an operation returned no result.

I therefore chose an always-on ECS server from the beginning. The phone handles interaction; privileged credentials, runtime state and business tools stay on the server. Service identities, basic security, backups and recovery drills became part of the project too.

They do not make impressive product screenshots, but they determine whether I dare to use it.

Backups offered a concrete lesson. An early verification script could list the backup directory and reported success. The user responsible for backing up the data could not actually open its files. The check established that the directory existed, not that the backup process could read the data. Later, I had to retrieve a backup on another Mac, decrypt it, inspect the databases and verify recovery through a dedicated read-only entry point.

The [phase-one retrospective](https://zhuyawei.com/en/blog/personal-agent-phase-one/) covers this in more detail. Looking back, it changed the question I asked: from “Do I have backups?” to “If the machine is really gone, what will I recover from, and how will I know the recovered result is correct?”

I do not understand every engineering detail involved. AI often knows the tools and configuration better than I do. My responsibility is to keep asking for proof at the level on which I intend to depend.

My standard for simplicity became clearer: I can defer a feature I do not yet need, but serving only one person is no reason to skip what happens if their data is lost.

## I stopped letting the implementer declare success alone

At first, I wrote code using my Claude Code subscription. I described a requirement, waited for changes, ran them, inspected the result and continued the conversation.

Later, I brought in Codex and had it and Claude Code check each other’s work. A different model with separate context could find quite a few problems the original implementer had missed.

The reason is straightforward. The coding agent has already accepted one interpretation; its tests may follow that same interpretation. Agreement between implementation and tests does not establish agreement with my requirements. A second agent starting from the requirements, code changes and acceptance evidence has a chance to challenge those shared assumptions.

After my Claude Code subscription account was banned, I continued using the Claude Code CLI with different Chinese models. Models changed, and quotas, stability and protocol compatibility remained concerns. But I kept one working rule: code written by model A should be reviewed by model B from a different company.

Different companies do not guarantee independent errors, and agreement between two models does not prove correctness. I use it to add another review perspective. A review still needs to identify specifics: which requirement is unmet, under what conditions something fails, and where the evidence is.

I also learned to separate three things: whether the model is capable, whether the tools execute reliably, and whether I have defined completion clearly enough. A problem in any one can stop the task. A stronger model does not automatically solve the other two.

## Learning to work in parallel

Eventually, developing modules one after another felt too slow.

Some tasks could progress independently but were stuck waiting because they shared one working directory and one conversation. I began learning about branches and worktrees, giving different tasks their own directories before reviewing and merging the results.

The improvement in my actual development pace was noticeable.

But the lesson went beyond a few Git commands. Starting several agents is easy; dividing work into pieces that can proceed independently is harder. Someone still has to decide which modules can move ahead, which shared interfaces must be settled first and which version to use for integration verification.

Worktrees isolate working directories; they do not eliminate module dependencies. More parallel work meant paying closer attention to each task’s scope, deliverables and merge order.

It also changed how I understood my role. Once code arrived faster, unclear requirements and interfaces became more costly.

## “Development complete” taught me to enforce the workflow

Building the automated development workflow delivered a particularly strong lesson.

The agent told me development was complete. When I checked, what it had delivered was far from the system I thought we were building.

That is more troublesome than a compilation error. An error at least tells you where things stopped. A substantial implementation and a “tests passed” report can make it look as though everyone agrees on what completion means.

We did not.

I already used PRDs and technical designs early in the project. This experience showed me that having those documents and having approval for the current round of implementation are different things. An older design may cover a similar capability without covering the new scope and trade-offs. Without my confirmation, an agent can finish something it considers reasonable that I do not accept.

I tightened the process and wrote it into the project’s `AGENTS.md`:

**Approval of this round’s PRD → approval of this round’s technical design → implementation → independent code review → acceptance and deployment authorization.**

No implementing first and writing the documents afterward. No treating an earlier broad design as approval for this round. No quietly skipping unresolved scope because I casually said “start.” If an exception is necessary, it must be explicit and its reason recorded.

The process matters because it lets me see what I am approving before the implementation piles up.

It takes time and gives me more to read and decide. I would rather pay that cost early than face an entire implementation that misses my expectations.

## The process is part of what I want to share

Much of what I learned about engineering came from uncomfortable moments: a server I really needed to use, backups I really needed to restore, models that could fail, reviews that could miss problems, and “development complete” that could be far from what I expected.

A small exercise I put aside afterward might let me postpone those problems. Personal Agent required me to keep going because I wanted to use it tomorrow and next month.

It has been harder and more painful than I expected, and much more interesting.

I hope this release preserves more than the final code. It also records how a product manager used AI programming to turn personal needs into a system, learning to divide work, demand evidence, improve the process and acknowledge what remains unfinished.

Memory comes next. This is my judgment about the current product stage: **Memory can move the agent from usable to genuinely useful in daily life, while the automated development workflow mainly improves tool-development efficiency.**

Completing one request and being pleasant to work with over time are different things. If I must repeat the background, preferences and previously confirmed information every time, I am still constantly supplying its context. Memory should improve that everyday experience: useful information should carry forward, mistakes should be correctable, and information that no longer belongs should be forgotten.

The automated development workflow remains worth building. It can help me develop and maintain tools more efficiently. But faster tool development will not automatically make the agent understand me better. At this stage, that workflow improves efficiency; Memory is where I expect a qualitative change in the experience. That is why I put Memory first.

The disappointment I felt when Muse appeared was real. So is what this project has changed for me.

For now, I am sharing the part I have already built. If a piece of code, a failure or a design choice helps you, I would be happy to discuss it.

[**GitHub: Personal Agent**](https://github.com/hensonzyw-git/personal-agent-open-source) · [Project overview](https://zhuyawei.com/en/ai/personal-agent/)
