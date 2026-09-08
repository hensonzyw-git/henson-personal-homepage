---
key: astra-computer-use-everything-use
lang: en
title: "From Astra’s Computer Use to Everything Use"
date: 2026-09-08
category: AI Collaboration
readMins: 12
summary: "Watching Astra operate software led me to think about interfaces and physical tools: digital systems can change their interfaces for agents, but the world we live in may require AI to adapt to existing environments for much longer."
related:
  - traditional-to-ai-open-platform
  - agent-as-service-caller-open-platform
draft: false
draftTranslation: true
---

Since Astra launched, my feed has felt a little as though AGI has already arrived.

In both official demonstrations and the community posts that keep appearing, what catches my attention most is its ability to operate software directly: drawing, modeling, and carrying out sequences of steps across applications that previously required a person at the controls. People are discussing coding too, of course. But at least in what I have been seeing, it has not been the main attraction.

That made me curious. Through the last few model releases, I paid close attention to improvements in writing code, modifying code, and understanding projects. This time, what seems to excite people most is watching AI operate familiar software on a screen.

I tried it myself. Recently I have been building my automated development loop, a workflow that brings agents into development, review, and repair. I asked Astra to do a complete code review of the project, then had GLM 5.3 fix the findings, followed by another review and another round of fixes. It converged in two rounds.

The process went smoothly. But I was not stunned by a sudden discovery of a huge number of security vulnerabilities, nor did I feel an unmistakable generational leap.

This was hardly a rigorous comparison, though. The review model changed from Sol 5.6 to Astra, while the repair model changed from GLM 5.3 Flash to GLM 5.3. Did it converge in two rounds because the reviewer was more accurate, or because the other model fixed things better? I cannot tell. Nor am I an engineer who can independently assess the quality of the entire review. Finding few vulnerabilities might mean the project had few problems, or that the model failed to find them.

So this experience only describes how it felt to me. It cannot establish how much Astra’s coding ability has improved.

Later, I looked at third-party data. In an evaluation published on September 3, Artificial Analysis reported a Coding Agent Index score of 67 for Astra in Codex, about two points above Sol. That was roughly level with Fable 5 in Claude Code, and below Fable 5.1’s score of 70.

| Model and execution environment | Coding Agent Index |
| --- | ---: |
| GPT-5.6 Sol / Codex, max | About 65 |
| GPT-6 Astra / Codex, max | 67 |
| Claude Fable 5 / Claude Code | About 67 |
| Claude Fable 5.1 / Claude Code | 70 |

These figures follow the report’s rounded presentation. Sol’s approximate score of 65 is derived from the report’s statement that Astra scores two points higher. This compares models within their respective coding agent environments, rather than testing the models alone in one standardized environment. [Source: Artificial Analysis, September 3, 2026](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)

At least in this independent evaluation, Astra improved on coding tasks while remaining within the range of existing leading models, without opening a generational gap.

The same report includes another result that should not be overlooked: in this coding evaluation, Astra used roughly one-third as many tokens as Sol, with a similar cost per task. Beyond the score, the efficiency gain is clear. Looking only at token prices would understate that change. [Source: the same evaluation’s cost and efficiency analysis](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)

But this made me even more interested in another question: why has this demonstration of Computer Use made so many people feel that AI has crossed another threshold?

## From writing code to operating the software I use every day

One straightforward reason, I think, is that more people can feel the change.

Improvements in coding matter, of course. But the people who can directly recognize those improvements are first and foremost engineers. Beyond them are people like me, who are deeply interested in AI and have already started using it for vibe coding.

I care about whether a model can understand an entire project, find problems spanning multiple files, and make changes without breaking existing functionality. But for someone who does not write code and has never tried developing something with AI, “it fixed a really difficult bug” is still some distance from their everyday work.

Later, agents for general work, such as Claude Cowork, ChatGPT Work, and WorkBuddy, came into my view. People began showing how AI could process files, organize data, build spreadsheets, and make presentations. Far more people have firsthand experience with those tasks than with code review.

Someone who works with files every day may not know what a few extra points on a coding benchmark mean. But they know how frustrating it is to organize a pile of spreadsheets, and how much time repeated presentation formatting can consume.

With Astra, I felt that circle expand again.

When AI can enter an application, use its tools, and keep taking steps toward a goal, many people’s first reaction may become: “Isn’t that exactly what I do every day?”

Previously, you first had to consider whether your work could be expressed as code or packaged as a file task. Now, if your work happens on a computer and inside software, it is easier to imagine how AI might relate to it. Being able to imagine that does not mean reliable replacement is already possible, of course, and a task in a demo is not an entire profession. But the range of potential connections has grown considerably.

There is another difference: the process itself is easy to understand.

Show me generated code, and I may not know how good it is. Show me AI choosing tools, adjusting parameters, and checking results in an application I know, and I can recognize the steps I once had to perform myself. An improvement in capability becomes something directly visible.

These groups are not strictly separate, and AI did not only begin serving non-engineers today. This is simply one thread that helps me understand the response to this release.

Add my own information bubble—I already follow a lot of AI content, and platforms keep recommending more of it—and what appears in front of me feels like a celebration that everyone has joined.

## Watching it operate software, I found myself thinking about interfaces

I recognize the value of this progress. It lets more people experience AI’s capabilities directly, and opens another possible path for tasks that previously required dedicated integrations and orchestration.

As for price, I am not yet comfortable handing every task to Astra without a second thought. The evaluation above already shows that higher unit prices do not necessarily make every task more expensive. What I care more about is when this capability becomes affordable enough to be the everyday default, without hesitation. I tend to believe costs will keep falling, but the pace and scale remain to be seen.

Still, watching it become more skilled at using human software brought another question to mind:

**Will these software interfaces always be the best path for AI to complete a task?**

This is also the change I kept exploring in two earlier articles. In [“From Traditional Open Platforms to the AI Era: When the Caller Changes from Humans to Agents”](/en/blog/traditional-to-ai-open-platform/), I discussed how platforms need to adapt as agents take over reading documentation, writing code, and completing integrations. In [“When the Agent Facing an Open Platform Becomes a Service Caller Instead of a Developer”](/en/blog/agent-as-service-caller-open-platform/), I took that a step further: how should platforms be designed when agents begin calling services and executing operations directly on users’ behalf?

From helping people develop software to using services for them, agents are becoming users of software themselves. Following that line of thought, software design will change too.

My long-standing view is that future software will not necessarily all prioritize direct human operation, but will have growing incentives to offer ways for agents to invoke its capabilities. That might mean open APIs, tools exposed through MCP, or Skills and other mechanisms that teach agents how to use those capabilities. The forms will continue to evolve, but the direction is toward letting agents express intent, invoke functions, and obtain results directly.

Imagine two paths through the same task. On one, AI looks at the screen, finds a button, clicks, waits, and checks whether the interface changed. On the other, the software offers a clearly defined capability that accepts parameters and returns structured results.

If the second path is complete, stable, and supported by appropriate authorization, I find it hard to justify requiring agents to follow the first path forever.

This does not mean visual interaction costs more in every task, or that existing APIs are already good enough. Some interfaces simply do not cover what users actually need. Some integrations are more trouble than doing the work manually. But for tasks that good interfaces can cover, direct invocation can more easily eliminate repeated visual recognition and state checking.

So one of my judgments about Computer Use is that part of its value in the digital world comes from the fact that today’s software was primarily designed for people.

As agents become more important users, software itself will adapt. At that point, imitating how a person operates software may no longer be the main path.

## The physical world cannot change its interfaces so easily

Following this thought led me, unexpectedly, to the physical world.

Digital software can add an interface. It can directly expose a function that previously sat several menus deep. It can even preserve both modes of interaction, as long as people can continue using it.

But a chair, a door, or a kitchen utensil in my home is not so easy to redesign for AI.

People still need to sit on that chair, push open that door, and pick up that tool. At least in homes, offices, and public spaces where people continue to live and move, human bodies, habits, and convenience will remain important design premises for a long time.

The physical world will also be adapted for machines, of course. Unmanned warehouses and automated factories are different environments. What I mainly have in mind are the places humans and machines share. We are unlikely to turn an entire home into an automated factory before letting a robot enter it.

This creates a difference that keeps drawing my attention:

**The digital world can change its interfaces for agents more easily; the physical world humans inhabit may require agents to adapt to existing environments for much longer.**

If so, the capability Astra demonstrates that really interests me is more than “it can use this application.” It is the ability to recognize tools in an environment, understand the current state, choose an action, observe the result, and continue.

I cannot help wondering: as that capability develops, could its value extend beyond the screen?

From Computer Use to something I will tentatively call **Everything Use**—AI learning to use the many tools humans have already created, rather than requiring every tool to be redesigned for AI first.

“Everything” certainly does not mean it can already use anything, nor am I naming a mature technology. It is simply an imagined direction: when the environment will not fully accommodate AI, AI needs to learn to accommodate the environment.

This is also one reason I think humanoid robots are worth exploring. Many environments and tools were designed around human bodies, and a similar form may help machines enter those environments. That is not enough to prove that a humanoid form is necessarily optimal, and I will not pursue that topic here.

## Where this idea still stops

Moving in thought from software operations to physical tools does not mean the path between them has been established.

Dragging an object on a screen and picking up an object in reality are different things. The latter involves space, weight, friction, contact, and the real consequences of failed actions. Similar-looking cycles of observation, action, and feedback may require very different underlying capabilities.

Nor can I infer from a single product demonstration that a model has learned how to learn in an unfamiliar physical environment. Completing a task and gaining transferable new capabilities from feedback are separated by a gap in evidence.

So, at this point, this article remains an attempt to think beneath the surface of what I have seen. It suggests something worth watching, but it is not a validated conclusion.

Back in the digital world, I do not think Computer Use will disappear as APIs and agent interfaces develop.

Software will not remove its UI overnight. Many legacy applications lack the incentive or resources to adapt. Even new software may not be willing to expose every function. As people and agents continue sharing software, many situations will still require visual understanding and interface interaction.

Rather than calling it a transitional technology that will soon become obsolete, I would say its role in the digital world may change as software adapts to agents: some tasks will move toward direct invocation, while others will retain interface interaction for the long term.

What I want to watch next is whether these capabilities can understand what tools do in unfamiliar environments, correct actions after failures, and carry what they learn into the next task. Especially when that environment is no longer a screen.

That is where my curiosity about Astra has finally landed: software can change for AI, but the world we live in will not change so quickly. If AI is to enter that world, it still needs to learn to use the things we already use.
