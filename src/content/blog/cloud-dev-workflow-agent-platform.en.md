---
key: cloud-dev-workflow-agent-platform
lang: en
title: "Once My Development Workflow Was Running Smoothly, I Rethought What to Do Next"
date: 2026-10-30
category: AI Collaboration
summary: "Moving development from Muse to Grok Bot helped me see which problems I want to keep working on. Starting with my own assistant and wardrobe service, I plan to revisit open platforms from both the Agent Host and Service Provider sides."
related:
  - meta-muse-personal-workflow-cloud-deploy
  - traditional-to-ai-open-platform
  - agent-as-service-caller-open-platform
draft: false
draftTranslation: true
---

In late October, my online wardrobe gave me two outfit recommendations: a short-sleeved T-shirt, trousers, and shoes. Neither included a jacket.

My feedback was blunt: “I'll freeze to death without a jacket in this weather.”

Looking into it, we found that it only considered daytime weather by default, and the threshold for requiring a jacket was too low. I asked to extend the weather window to 11 p.m. and require a jacket whenever the lowest feels-like temperature fell below 22°C. I approved the requirement at 9:04 p.m.; by 11:24 p.m., the change was deployed. Along the way, the design was sent back and revised, and test problems were checked. The orchestrator kept development and review moving, coming back to me when a decision on requirements or release was needed.

That was one concrete experience after I moved my development workflow from Muse to Grok Bot. With the workflow gradually running smoothly and the current projects reaching a stopping point, I began thinking seriously: which problems would still be worth my time over the long term?

## Moving the development workflow again

Muse and Grok Bot are AI assistants I have used that come with cloud computers, where they can install tools and run tasks. I had already moved automated development to Muse when I started building my personal online wardrobe.

The wardrobe began as a Claude Cowork skill. I photographed all my clothes, named and categorized them, and put them in iCloud folders. Claude could read those files, check the weather, and recommend outfits. Later, while building Personal Agent—my own personal assistant with an iPhone interface—I wanted to turn that work into an independent service with APIs and MCP tools that both Personal Agent and Muse could use.

But while developing in Muse, more and more of my attention went into the workflow itself. It was slow, used a lot of tokens, and often got stuck. Before the next action happened, I would spend several rounds of conversation explaining the current state. Once I got things moving again, I had to check whether the earlier results were still usable. I investigated some local problems but never reached a satisfying explanation for why the whole chain kept struggling.

Then I heard that Grok Bot's cloud development setup was more mature, so I decided to try moving there. I created two sub-bots: a Dev Orchestrator to organize tasks and a Code Reviewer to review independently. Planning and coding still went to Codex on the cloud computer, using my existing subscription. After all, I couldn't let that $100 go to waste. There were still timeouts and deployment failures after the move, but the orchestrator was better at explaining the problem, the options, and the decision it needed from me before carrying on. The remaining wardrobe reviews, fixes, and deployment were completed this way, and the service was gradually connected to Personal Agent and Muse.

One instruction I emphasized was: “The time limit doesn't have to be that rigid. Just make sure it doesn't get stuck spinning and wasting tokens.” A complex task could take longer, and it could come back to me when something went wrong. But I needed to know that it would either keep making progress or clearly stop.

## What the system needs, and what I want to study

My personal assistant, personal website, and online wardrobe—the projects I had originally set out to build—all had versions I could keep using. The development workflow had become easier to work with, leaving me to choose where to go next.

Of course I could keep adding features. But “there's more I could build” was no longer enough reason to keep investing my time.

Looking back, I was excited the first time I got Personal Agent working: an assistant that had existed only in my head was now on my phone. I was excited again when I connected services through a common approach. Clothes I had already catalogued and accounting rules I had already defined could be used by different agents. Earlier work was becoming the foundation for the next thing.

But as I went deeper into session management, memory management, and context management, my interest was declining.

That gave me pause. I had already invested so much time, and I knew how much these mechanisms mattered to an assistant that would run over the long term. Yet the deeper I went, the less I wanted to pursue the next layer for its own sake.

I began separating “what this system needs” from “what I want to study next.” I need to understand how context and sessions affect results, and I need to maintain my system properly. But building an agent myself does not mean every layer of it has to become a long-term focus.

A permissions problem in the wardrobe, on the other hand, made me want to keep digging.

An independent review after the handoff found that read-only authorization could trigger a recommendation task's “resume execution” action. In conversation, “It didn't finish earlier; carry on” sounds natural. But resuming changes the task's state and advances its processing. Permission to check progress had crossed the boundary of reading.

AI could add the missing check quickly. What interested me was how the system had originally classified the action, and whether the same boundary would hold when a different caller connected.

**My current view is that permissions should follow an action's actual consequences. Resuming or retrying work that changes business state or advances execution requires another check of the relevant action permissions. If it incurs new costs, the budget or billing authorization also needs checking. Checking status should remain read-only.** Calling an entry point “resume” does not make its consequences any less significant.

## What I want to explore is the relationship after integration

This brought me back to the open platforms I have worked on throughout my career.

On my blog, I had already written about [adapting open platforms for agents](/en/blog/traditional-to-ai-open-platform/) and [controlling execution boundaries when agents call services on users' behalf](/en/blog/agent-as-service-caller-open-platform/). At the time, I had not decided to pursue this further. After connecting MCP tools myself, I even felt that integration was fairly straightforward: describe the business scope and goals clearly, and AI could handle much of the tool design and implementation.

But looking back at my work, open platforms also demand sustained attention to what gets opened up, user authorization, ecosystem governance, and the customer relationships, costs, and control that follow integration. These choices affect what each party is willing to take on and what it gets in return.

Connecting Muse involved one such trust decision that I made myself.

When designing the flow for adding clothes through chat, I wanted recognition, draft review, confirmation, and submission to happen inside Muse. But unlike with my own Personal Agent, the wardrobe service could not directly control the user interface where confirmation happened. The approach I accepted was to trust an authorized Muse caller to report the user's confirmation, while allowing only new items to be added. Permission to edit or delete existing clothes was kept outside that scope.

This choice leaves a risk: the caller could misreport the user's intent or confirmation. Checking the draft's version and expiry can constrain what gets submitted, but it cannot prove that a person actually saw and confirmed it.

As the user, I wanted to finish the task in the current conversation. As the wardrobe service's owner, I needed to state exactly what I was trusting and how much an error would be allowed to affect. Both positions arose from the same real need.

Two roles matter here. An Agent Host accepts the user's delegation, organizes tasks, and selects services. A Service Provider supplies data or business capabilities and takes responsibility for the corresponding execution. Personal Agent is a Host I can modify myself; the wardrobe is a Provider; Muse is an external Host the service needs to work with.

**For the Host, what I currently value in a low-interruption experience is a system that takes responsibility for progress and recovery within its authorization, returning decisions that need the user to the user.**

My repeated requests to avoid spinning and avoid making me constantly watch the development workflow expressed exactly that expectation. Routine internal problems should not all become tasks for the user. Yet the system must stop when it goes beyond its authorization or encounters a new risk. Removing a few confirmation buttons does not, by itself, improve delegation. There must be a mechanism to take on the work those interventions previously covered.

The Provider, meanwhile, must independently check the authorization it recognizes. A Host's claim that something “has been confirmed” needs an explicit trust relationship and a defined scope. For adding clothes through Muse, I accepted a limited form of trust in the caller. What I want to study next is when stronger guarantees are possible and how much friction they add to the experience.

Looking further out, the two sides' product and business goals do not automatically align either.

The Host needs enough service supply to complete tasks. It must decide what to build itself, what to source externally, and how to select, combine, or replace services. What it can promise users depends on whether that supply is genuinely reliable. The Provider must decide what to open up, which entry points to join, and whether the external demand covers the costs of integration, delivery, and governance. It may also want to preserve its brand, customer relationships, and service differentiation.

This reminds me of familiar questions around mini programs, mobile web pages, and apps in earlier open platforms: where the service is completed, who controls distribution, how revenue and costs are allocated, and which team takes the hit to its existing business metrics. That experience helps me frame questions, but agents' dynamic service selection and discretion in execution need to be considered and tested as well.

**My current inclination is to assess each side's product value and business returns separately before discussing the terms of cooperation. Making the technical connection is only one step.** The Host needs to complete tasks for users, and the Provider needs a reason to keep offering the service. The scope of access, handoffs between workflows, and commercial arrangements all need to be considered against both sides' goals.

So the research I want to pursue covers the decisions each side makes. The Host needs to shape its task-oriented product, build service supply, and manage its ecosystem. The Provider needs to turn capabilities into products, set an access strategy, and assess distribution channels. My open-platform experience can help me get started, without deciding in advance that I can only work on one side.

This is also the capability I want to build for my future work: to face a concrete problem, propose an approach, explain the tradeoffs, provide evidence, and know what would make me revise my judgment.

## Starting with my own Host and services

The practical work will begin with systems I already use: Personal Agent, the wardrobe, and accounting. I want to build both the Host and Provider sides properly, starting with the infrastructure, with explicit mechanisms for identity, authorization, confirmation, execution, and recovery.

Muse will remain a real external caller. The interfaces and behavior I can control in my own agent may be outside my control there. That difference will expose which guarantees come from mechanisms and which exist only because I built both sides and assumed they would cooperate.

When I was the only user, I could cover some gaps with manual configuration and personal intervention. To make cloud deployment run smoothly, I also broadened the execution account's permissions, then relied on backups, rehearsals, and approval of key actions to manage risk. Next, I want to unpack the assumptions behind those conveniences and decide, one by one, which should become rules the system can enforce.

Personal projects let me experience the costs of my own tradeoffs and validate some of the mechanisms. Questions about getting an ecosystem started, incremental business, and long-term control still require real case studies and corresponding business evidence. One successful wardrobe call cannot answer them.

What I hope to build is judgment I can carry into the next setting: why I chose an approach, who bore the cost, and how the actual result differed from what I expected. Code, experiments, case studies, and writing can all preserve that process.

For the first round of practical work, I plan to deliberately create four failures:

- **Advance a task with read-only permission:** check whether the resume entry point crosses the permission boundary.
- **Change the submitted content after confirmation:** check whether an old confirmation can be applied to a new operation.
- **Revoke authorization during execution:** check where queued tasks and running tasks respectively stop.
- **Cut off the response after a successful write:** check whether the system can recover the original operation's result and avoid duplicate submissions.

I will start with these four failures and see whether the authorization and execution boundaries I design still hold when the system goes wrong.
