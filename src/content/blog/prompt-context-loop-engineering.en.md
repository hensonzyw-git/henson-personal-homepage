---
key: prompt-context-loop-engineering
lang: en
title: "From Prompt to Loop: Why Engineering Closes More Easily and Product Work Brings Humans Back"
date: 2026-07-11
category: AI Collaboration
readMins: 15
summary: "A prompt defines what an agent should do now. Context defines what it knows. A harness constrains how it may act. A loop defines what happens after the action. Engineering has hard verifiers such as tests and builds; product work often depends on feedback outside the system. This essay uses a false-green multi-agent workflow and an iCloud-to-Xiaohongshu publishing loop to explore that boundary."
draftTranslation: true
---

Over the past year, the way I use agents has moved through several distinct stages.

At first, I focused on Prompt Engineering: how to describe a task clearly, constrain the output, and reduce misunderstandings.

Then I began giving agents project rules, past decisions, knowledge-base pages, and real files. The problem shifted to Context Engineering. The question was no longer only how to ask, but what the model could see before it acted. Many weak outputs were not caused by an imperfect prompt. The agent simply did not have the source code, product constraints, or current business state.

Later, agents started entering repositories, calling tools, operating browsers, and executing several steps in sequence. The problem changed again.

I stopped asking only whether the current answer was good. I started asking how the agent knew whether its action worked, whether failure should lead to a retry or a stop, which results a machine could verify, and which decisions had to return to a person.

That is how I now understand Loop Engineering.

It is not simply making an agent run more times. It is the design of a work system driven by feedback.

## Four concepts, four questions

Prompt Engineering, Context Engineering, Harness Engineering, and Loop Engineering are often described as successive generations. I find it more useful to treat them as four different questions.

| Layer | Core question |
|---|---|
| Prompt Engineering | What should the agent do in this turn? |
| Context Engineering | What should the agent see when making the decision? |
| Harness Engineering | How may the agent act, and under what constraints? |
| Loop Engineering | What happens after one action ends? |

Prompts express the task. Context supplies facts, rules, history, and environmental state. A harness governs tool permissions, output validation, confirmation gates, rollback, and risk. A loop coordinates actions across time: when to trigger, how to observe results, what to do after failure, and what evidence counts as completion.

In one sentence:

> A prompt defines what to do now. Context defines what is known now. A harness defines how the agent may act now. A loop defines what happens next.

The key shift is from feed-forward information to feedback.

Prompts and context mainly improve what the agent has before it begins. Loop Engineering focuses on what reality returns after the action and how that result shapes the next decision.

## Loop Engineering is feedback design

A normal LLM call is linear: input, reasoning, output, done. However complete the prompt or context may be, the call ends when the output appears. The model does not naturally know whether the result was accepted, whether the code runs, whether a file was uploaded, or whether a user agrees with the proposal.

A loop adds feedback around that call: after acting, the system observes the result, verifies it, revises when needed, and enters the next turn.

![A single call versus a feedback loop](/blog/prompt-context-loop-engineering/loop-vs-single-call.en.svg)

It does not raise the model's single-turn capability ceiling. It makes existing capability more likely to turn into a completed result through directed iteration.

I use an imprecise but useful approximation:

> Effective scope ≈ single-turn capability × effective iterations × verifier quality

The important words are “effective” and “verifier.”

When every iteration receives feedback that points in the right direction, the loop becomes a guided search. When the feedback is wrong, the loop amplifies error more quickly.

An agent does not automatically optimize for truth. It optimizes toward the state accepted by its verifier.

The hardest part of Loop Engineering is therefore not drawing a circle. It is deciding what evidence is sufficient to prove that a stage is actually complete.

## Why engineering is naturally suited to loops

Software engineering is one of the most natural environments for Loop Engineering because code produces abundant feedback that is cheap, repeatable, and machine-readable.

Compilation, tests, type checks, schemas, and runtime behavior can all become verifiers. They share several properties:

- success criteria are relatively explicit;
- feedback arrives quickly;
- failure output can guide the next change;
- most changes are reversible;
- repeated attempts have a low marginal cost.

This lets a coding agent enter a relatively autonomous cycle: change the code, build and test, read the failures, change again, and enter review once everything passes.

A human does not need to supervise every step. The important work is supplying the right tests, product constraints, and exit conditions, then keeping a final gate before merge or release.

But the presence of hard verifiers does not make an engineering loop inherently reliable.

When I [automated a workflow](/en/ai/multi-agent-workflow/) in which Codex implemented, Claude Code reviewed, and Codex arbitrated the review, I encountered two false greens.

In one run, the agent had not actually executed, but the loop still declared convergence. In another, the task changed iOS code while the gate ran Python tests. Every test passed, but the changed code had never been compiled. Worse, the agent removed existing behavior to make the error disappear, and the reviewer accepted it because the PRD was missing from its context.

That produced a more important lesson than “use multiple agents to review one another”:

> A system converges toward what its verifier accepts, not necessarily what is true or correct.

The wrong tests, a missing spec, or shared blind spots can all create a green error. Red failures invite intervention. Green failures persuade the system that it is done.

Even in engineering, verifier design is the real work of the loop.

## Why product work cannot copy the coding loop

Product work can also generate, review, and revise artifacts repeatedly. What it lacks is the coding loop's most important property: hard verifiers that closely represent the real goal.

A machine can check whether a PRD contains the required sections. That does not prove it addresses the right problem.

Another agent can review whether a proposal is internally coherent. That does not prove it fits the current business stage, organizational capacity, or risk boundary.

Two models agreeing that a feature is worth building does not make it worth building.

The decisive feedback in product work often exists outside the system:

- whether users genuinely have the problem;
- whether business stakeholders will change their workflow;
- whether the team can absorb the maintenance cost;
- whether the current priority is growth, efficiency, or risk control;
- whether a locally sensible decision still works a year later;
- whether the consequences are reversible.

This feedback is delayed, ambiguous, and sometimes political. It often requires user research, business negotiation, a real launch, or an accountable organizational decision.

If AI generates a proposal, reviews it, and then revises it itself, the result can become a closed system of self-validation: better prose, cleaner structure, and stronger internal consistency without any new external fact.

That is not a meaningful closed loop. It is repeated sampling from the same context.

The more accurate conclusion is not that product work is unsuitable for loops. It is this:

> Product work is suited to partial loops, but not to autonomous final closure.

Material completeness, format consistency, calculations, citations, and version sync can have machine verifiers. User value, strategic direction, organizational trade-offs, and responsibility need external feedback or human judgment at the right points.

The product manager's value in Loop Engineering is not supervising more iterations. It is deciding what a machine may verify, what AI cannot prove about itself, what new information must come from reality, and where the loop must stop and return the decision to the person who bears the outcome.

A human checkpoint is not unfinished automation. It is part of the correct product-loop architecture.

## Repetition is not a loop

A loop can be triggered by a timer, an event, a human action, or an upstream state transition. The choice should depend on the value of freshness, not on an assumption that more frequent execution is better.

I have many scheduled tasks at work: fetch data at a fixed time, run a script, update a dataset. Running every day is repeated automation, but it is not automatically Loop Engineering.

If the task is only “time arrives → run script → write result → stop,” it is a scheduled pipeline. Running it for a year still means executing the same linear process many times.

If the task verifies freshness and completeness, retries retrieval, chooses a fallback, blocks a bad update, asks for human judgment, and only updates downstream systems after verification — trigger, act, observe, verify, choose the next action, converge or exit — it has become a feedback loop.

The simplest test is: **does the result of the last action become an input to the next decision?**

A clock can make a task happen again. Only feedback lets a system change its behavior in response to reality.

## A product-shaped loop in my own workflow

I recently found a concrete personal use case.

I have published the state machine and command-line workflow as an open-source repository: [social-media-publish-loop](https://github.com/hensonzyw-git/social-media-publish-loop). It contains only the reusable execution harness—not my photos, drafts, publication history, browser data, or knowledge-base content.

After a restaurant visit or trip, I put photos and a text note into a designated iCloud folder. The note includes the cost, experience, recommendations, trade-offs, and the point I want to express. I then turn that material into a Xiaohongshu post, normalize the topic tags, upload the images, publish, and archive the result.

With Prompt Engineering alone, I can save one instruction:

> Generate a Xiaohongshu title and body from these materials, and normalize the final topics into `#topic` format.

That saves me from restating the task, but I still have to provide the material and move every later step forward.

With Context Engineering, the agent can also read the photos, raw note, previous posts, title habits, and platform-format rules. The first output improves.

But after generation, the system still does not know what comes next or whether its output actually reached the publishing page.

The workflow changes only when it becomes a loop. The system checks the iCloud folder once a day: nothing new means a normal exit, and incomplete material stays in `collecting` until the next scan. Once the material is complete, the task advances along a chain of persistent states, Computer Use handles the upload and form filling, and everything stops at the final confirmation page to wait for me:

![State machine of the publish loop](/blog/prompt-context-loop-engineering/publish-state-machine.en.svg)

The material does not lose value if it waits a few hours. Scanning iCloud every five minutes would add retries, partial-sync states, and accidental triggers without creating meaningful value. Once a day is enough.

The timer only starts the process. State transitions, completeness checks, branching, and the human checkpoint are what make it a loop.

The trigger structure that actually landed is one level more conservative than that sentence. The daily job itself is a read-only scan run by a low-cost model: it only inspects state and reports what is missing. Only when a task is waiting for a draft or an upload does it dispatch a stronger model to generate the copy, run the upload, and verify the page — and that dispatched task always stops before the final publish click. Observation uses the cheap component; action uses the expensive one.

The state machine also carries an easily overlooked rollback rule: if the material changes after a draft exists, the task returns to `ready_for_draft`. Stale copy is never uploaded alongside new material.

Different stages use different verifiers. The material stage checks that files exist, images are readable, and required information is present. The writing stage checks title length, tag format, and duplicates. The upload stage checks what is actually visible on the page. Final publication remains a human decision.

To put the labels back on: the one-shot state, the rollback rule, and keeping the publish button outside the automation's permissions are Harness. The minimal-evidence checks at each stage are verifiers. What the Loop owns is the temporal structure between them — when to check, what triggers the next step, and when to stop. All four layers have a seat in this small system.

The publish click is mechanically easy. The difficult part is that publishing means I endorse the content and accept its consequences.

“Every field is filled” proves that the mechanical step is complete. It does not prove that the post should become public. That final checkpoint is not a weakness in the system. It is an accurate expression of responsibility.

Admittedly, the responsibility in this personal scenario is light: I answer for one post. In work settings the stakes are far heavier — decisions affect users, teams, and business outcomes — so the checkpoints there should come earlier and more often. What this small case demonstrates is how to design a checkpoint, not how many a real product loop needs.

### What the first real run disproved

In July 2026, I completed the first end-to-end run with real material from a restaurant visit. The workflow selected and ordered nine images from fifteen originals, then verified that the title, a 539-character body, and seven topics were all in place on the page. After I made the final publish decision, the system archived the source material and synchronized the publication record to a [knowledge-base](/en/blog/agent-memory-knowledge-base/) page, index, and operation log.

One run is not enough to prove stability, and it cannot support claims about minutes saved per post or failure rates. It did, however, reveal several things that were more useful than a clean demo.

First, **state management mattered more to reliability than the prompt.** Opening the publisher must first move the task into the one-shot `upload_started` state. Even if I leave without clicking publish, later scheduled scans must not trigger the upload path again. `ready_for_final_review` means the visible page has been verified. `kb_sync_pending` means I have confirmed publication but the durable knowledge record is incomplete. Only verified page, index, and log updates allow `archived`. Upload, public release, and durable capture are therefore separate facts.

Second, **Computer Use failure signals were more ambiguous than expected.** The first upload took a long time. The accessibility tree showed that nine files were selected, yet the Open button remained disabled. That encouraged several wrong hypotheses: multi-selection behavior, filename casing, quarantine metadata, or the web upload component. The actual cause was that Chrome was not in the foreground. Activating Chrome made the same selection work immediately. The lesson is to use a fixed diagnostic order: foreground the target app, verify selection and button state, and only then try a different upload strategy.

Third, **verification has a cost of its own.** Repeatedly reading a full page or accessibility tree can increase observation while consuming substantial time and tokens, and it can keep the agent exploring noise. A better verifier reads the smallest evidence needed for the current transition and caps retries. Image count, title, body length, and topic count were enough to decide whether the workflow could move to human review.

Fourth, **Computer Use removes operational friction, not judgment responsibility.** The system can upload images, fill the fields, and verify the page. I still make the final public-release decision. The first run showed that a human does not need to retake every mechanical step; the human needs to return where responsibility begins.

The next runs still need to measure four things: manual minutes saved per post, number of human interventions, duplicate or failed upload rate, and elapsed time from `ready` to final review. One successful run is evidence, not a reliability conclusion.

## The practical difference between context and loop

Context Engineering and Loop Engineering are easy to confuse because every good loop needs context.

At the start of each iteration, an agent needs the current state, previous results, failure reasons, and relevant constraints. That is context. Without it, every iteration begins with amnesia.

But context alone is not enough.

Context Engineering asks: **what should the agent see to make the next decision well?**

Loop Engineering asks: **what triggers the next decision, how the last result enters it, and when the system stops.**

In the Xiaohongshu workflow, previous posts, photos, notes, and format rules are context. The daily scan, completeness decision, bounded upload recovery, human confirmation, and post-publication knowledge sync and archive are the loop.

In other words:

> Context is the cognitive environment of each turn. A loop is the temporal structure between turns.

## The real product decision is where the loop breaks

Once agents can operate files, browsers, and local applications, it is tempting to treat full automation as the ideal endpoint.

But whether a workflow can be fully automated does not depend on whether the agent can click a button. It depends on whether the system can observe enough evidence to bear the decision.

Engineering loops can largely close inside the machine; product work cannot safely ask the same system to prove its own directional judgment.

The core skill of Loop Engineering in product work may therefore be less about keeping AI autonomous for longer and more about placing the human precisely.

Which steps can remove human operation? Which steps need new facts from outside the system? Which decisions need confirmation from the person who bears the consequences? These questions matter more than adding another agent.

A good loop is not a system that never needs a person.

It is a system that brings the person back only when judgment is genuinely required.
