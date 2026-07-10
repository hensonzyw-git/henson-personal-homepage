---
key: prompt-context-loop-engineering
lang: en
title: "From Prompt to Loop: Why Engineering Closes More Easily and Product Work Brings Humans Back"
date: 2026-07-10
category: AI Collaboration
readMins: 15
summary: "A prompt defines what an agent should do now. Context defines what it knows. A harness constrains how it may act. A loop defines what happens after the action. Engineering has hard verifiers such as tests and builds; product work often depends on feedback outside the system. This essay uses a false-green multi-agent workflow and an iCloud-to-Xiaohongshu publishing loop to explore that boundary."
draft: true
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

A normal LLM call is linear:

> Input → reasoning → output

However complete the prompt or context may be, the call ends when the output appears. The model does not naturally know whether the result was accepted, whether the code runs, whether a file was uploaded, or whether a user agrees with the proposal.

A loop adds feedback around that call:

> Act → observe → verify → revise → act again

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

This lets a coding agent enter a relatively autonomous cycle:

> Change code → build and test → read failures → change again → enter review

A human does not need to supervise every step. The important work is supplying the right tests, product constraints, and exit conditions, then keeping a final gate before merge or release.

But the presence of hard verifiers does not make an engineering loop inherently reliable.

When I automated a workflow in which Codex implemented, Claude Code reviewed, and Codex arbitrated the review, I encountered two false greens.

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

If the task verifies freshness and completeness, retries retrieval, chooses a fallback, blocks a bad update, asks for human judgment, and only updates downstream systems after verification, it has become a feedback loop:

> Trigger → act → observe → verify → choose the next action → converge or exit

The simplest test is: **does the result of the last action become an input to the next decision?**

A clock can make a task happen again. Only feedback lets a system change its behavior in response to reality.

## A product-shaped loop in my own workflow

I recently found a concrete personal use case.

After a restaurant visit or trip, I put photos and a text note into a designated iCloud folder. The note includes the cost, experience, recommendations, trade-offs, and the point I want to express. I then turn that material into a Xiaohongshu post, normalize the topic tags, upload the images, publish, and archive the result.

With Prompt Engineering alone, I can save one instruction:

> Generate a Xiaohongshu title and body from these materials, and normalize the final topics into `#topic` format.

That saves me from restating the task, but I still have to provide the material and move every later step forward.

With Context Engineering, the agent can also read the photos, raw note, previous posts, title habits, and platform-format rules. The first output improves.

But after generation, the system still does not know what comes next or whether its output actually reached the publishing page.

The workflow changes only when it becomes a loop:

> Check the iCloud folder once a day  
> → exit normally when there is nothing new  
> → keep incomplete material in `collecting`  
> → generate copy and normalize topics when complete  
> → move to `ready_for_upload`  
> → use Computer Use to upload images and fill the fields  
> → verify image count, title, body, and topics on the page  
> → stop at final confirmation  
> → I publish  
> → record the result and archive the material

The material does not lose value if it waits a few hours. Scanning iCloud every five minutes would add retries, partial-sync states, and accidental triggers without creating meaningful value. Once a day is enough.

The timer only starts the process. State transitions, completeness checks, branching, and the human checkpoint are what make it a loop.

Different stages use different verifiers. The material stage checks that files exist, images are readable, and required information is present. The writing stage checks title length, tag format, and duplicates. The upload stage checks what is actually visible on the page. Final publication remains a human decision.

The publish click is mechanically easy. The difficult part is that publishing means I endorse the content and accept its consequences.

“Every field is filled” proves that the mechanical step is complete. It does not prove that the post should become public. That final checkpoint is not a weakness in the system. It is an accurate expression of responsibility.

### Before it runs, turn expectations into testable hypotheses

This personal loop is still being designed. It has not completed enough real runs for me to describe the following claims as proven. But if the state machine and human checkpoints work as designed, I expect the first problems to be more operational than generative.

First, **the real start gate is material completeness, not the timer.** Checking once a day instead of every five minutes changes detection latency. Whether the photos have finished syncing, whether the note contains the required information, and whether the package has already been processed determine whether the system can advance safely.

Second, **state management will matter more to reliability than the prompt.** Without states such as `collecting`, `ready_for_upload`, `ready_for_final_review`, and `archived`, a scheduled task can regenerate or upload the same post twice, or treat a partially synced package as ready. A better prompt improves the copy. It does not solve duplicate execution or recovery.

Third, **Computer Use removes operational friction, not judgment responsibility.** Its likely savings are image selection, upload waiting, copy insertion, and topic formatting. Cover choice, narrative image order, and the decision to make the content public remain human checkpoints.

Fourth, **the most common failures will probably come from the environment rather than the model.** An incomplete iCloud download, an expired Xiaohongshu session, a changed page structure, or an upload timeout may occur more often than weak writing. Reliability will depend on recognizing those states, avoiding duplicate side effects, and returning the task to me when recovery is unsafe.

These are hypotheses to test. After the workflow runs, I plan to track four measures: manual minutes saved per post, number of human interventions, duplicate or failed upload rate, and elapsed time from `ready` to the final review page.

If real results disprove these expectations, that disproof will be more valuable than a clean demo. The most reusable output of Loop Engineering is not the workflow diagram. It is the record of where the system interpreted feedback incorrectly.

## The practical difference between context and loop

Context Engineering and Loop Engineering are easy to confuse because every good loop needs context.

At the start of each iteration, an agent needs the current state, previous results, failure reasons, and relevant constraints. That is context. Without it, every iteration begins with amnesia.

But context alone is not enough.

Context Engineering asks: **what should the agent see to make the next decision well?**

Loop Engineering asks: **what triggers the next decision, how the last result enters it, and when the system stops.**

In the Xiaohongshu workflow, previous posts, photos, notes, and format rules are context. The daily scan, completeness decision, upload retry, human confirmation, and post-publication archive are the loop.

In other words:

> Context is the cognitive environment of each turn. A loop is the temporal structure between turns.

Giving an agent more material and leaving a human to initiate, inspect, and advance every stage is still a better generation task. It becomes a loop only when the system can observe its environment, maintain state, choose the next action from feedback, and stop in the right place.

## The real product decision is where the loop breaks

Once agents can operate files, browsers, and local applications, it is tempting to treat full automation as the ideal endpoint.

But whether a workflow can be fully automated does not depend on whether the agent can click a button. It depends on whether the system can observe enough evidence to bear the decision.

Engineering has builds, tests, and runtime output, so many loops can close inside the machine.

Product work faces users, organizations, strategy, and responsibility. It can automate material preparation, format checks, analysis, drafting, and repetitive actions. It cannot safely ask the same system to prove its own directional judgment.

The core skill of Loop Engineering in product work may therefore be less about keeping AI autonomous for longer and more about placing the human precisely.

Which steps can remove human operation? Which steps need new facts from outside the system? Which decisions need confirmation from the person who bears the consequences? These questions matter more than adding another agent.

A good loop is not a system that never needs a person.

It is a system that brings the person back only when judgment is genuinely required.
