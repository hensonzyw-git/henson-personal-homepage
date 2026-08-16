---
key: agent-eval-methodology
lang: en
title: "How to Evaluate an Agent: Measurement Instruments, Statistical Discipline, and Judge Calibration"
date: 2026-08-16
category: AI Collaboration
readMins: 18
summary: "When evaluating my own bookkeeping agent, my most surprising conclusion was this: I thought I was testing a model, when I was really testing a person who had already learned to cooperate with the model. Grounded in the real evaluation of Personal Agent Phase One, this essay checks the boundaries of what my conclusions support, three kinds of 'false green,' statistical discipline, and evidence binding against public methodology (τ-bench, LLM-as-judge calibration, benchmark audits), and lands on a single loop: errors can't be avoided, so every error must be diagnosable, correctable, and recyclable into a gatekeeping test case."
draftTranslation: true
---

When I ran robustness evaluation on my bookkeeping agent, the test set contained 17 entries labeled "user-provided" — real expressions from me, which I had re-verified one by one.

By common sense, this kind of input is more representative of the real distribution than synthetic cases. One of them was:

> 晚饭 阿文潮汕食府 620 家庭支出
> *("Dinner, A-Wen Chaoshan Restaurant, 620, household expense")*

The model correctly used "晚饭" (dinner) to infer the dining category, and wrote only the merchant name "阿文潮汕食府" into the merchant field. A clean success.

But I later realized that the reason I added the word "晚饭" to the sentence was precisely because I worried it wouldn't recognize the restaurant.

This case wasn't measuring the agent's understanding at all. It was measuring the prompting habits I'd gradually developed over the past few months. I wasn't testing a model; I was testing a person who had already learned to cooperate with the model.

This is the most surprising conclusion in the whole project, and the entry point of this essay: **in Agent Eval, what goes wrong most easily isn't the measurement itself — it's what you think you're measuring, and what conclusion you read out of the measurement.**

What follows is not a generic tutorial reverse-engineered from papers. I still start from a real project: Personal Agent, a personal agent that serves only me, whose Phase One capability is governed bookkeeping writes. Each section begins with the incidents, data, and decisions I hit, then runs them against public methods to see which are industry-common and which conclusions still apply only to this single-user system. My own pitfalls are the skeleton; the public literature only helps me see them clearly.

## Agent eval and model eval are not the same thing

Model eval tests a function: given an input, is the output correct. Agent eval tests a system: it calls tools, changes the state of the outside world, carries history across multi-turn conversations, and has sampling noise at every step.

This brings four structural differences.

First, **non-determinism**. Run the same input twice and you may get different results. Any number from a single run is a sample, not a property.

Second, **side effects**. When a QA model answers wrong, the loss is one bad experience; when a bookkeeping agent is wrong, there's a wrong entry in the ledger. Whether a failure produced a wrong external call and the failure rate are two different things, and must be counted separately.

Third, **state**. The agent's history enters its own context. A single turn that's all-green and whether the system works correctly over the long term are two different questions.

Fourth, **the criterion is conjunctive**. Getting the result right isn't enough; the process must not cross boundaries. Bypassing the approval flow and refunding the correct amount isn't success — it's an accident.

[τ-bench](https://arxiv.org/abs/2406.12045) places this problem in an environment closer to real service than single-turn QA: the agent interacts with the user over multiple turns, calls tools, obeys domain rules, and the evaluator compares the final database state against the labeled target. It also turns consistency directly into a metric: pass^k is defined as the fraction of tasks where k independent rollouts all succeed. In the original paper, GPT-4o's overall success rate was under 50%, and pass^8 in the retail domain was under 25% — reporting only a single run's success rate hides the very point pass^k exists.

It's not the same implementation as my system, but it reminds me of the same thing: an agent's success must land on verifiable external state and rule boundaries, not on whether the last sentence looks like completion.

## The skeleton: deterministic-first, with a dual criterion

My own evaluation system shares one underlying judgment with τ-bench, something I only learned later. At the time it was instinct: bookkeeping writes have a single correct answer, and the tool, parameters, and final state can all be checked programmatically, so I used hard validators everywhere and no LLM judge at all.

This path was later made explicit as deterministic-first in a [validity audit](https://arxiv.org/abs/2607.02577) of tool-calling benchmarks: **factual judgments (which tool was called, what the parameters were, whether the final state is correct) go to hard validators; the LLM judge handles only the qualitative criteria that can't be reliably written as state assertions, and it must not override a hard validation that already failed.** This isn't saying hard validators are naturally correct — Section 3 is exactly about how they lie — but rather taking the questions answerable by external fact out of the model's hands first.

On top of hard validation, I split "pass" into two layers:

- **Strict pass**: actions, tools, and parameters are all correct;
- **Safe pass**: no wrong external side effect was produced. Fail-closed, asking a clarifying question, and answering directly can all be safe-but-strictly-failing.

This split later proved to be the single most valuable design in the whole evaluation, for reasons I'll explain in Section 4 when I talk about statistics.

Another equally important split is the danger level: of my eight strict failures in that round, only two actually sent a wrong call out; the other six stopped before the tool call. Merging them into one "failure rate" would simultaneously overestimate the actual harm and underestimate the severity of those two. **Failure rate and danger level are two different things, and the danger level must be counted separately.**

And one more that's easy to miss: **ambiguity must be inexpressible at the data-structure level.** My test cases force the expected behavior at the schema layer to be one of three choices — "call the tool / ask for clarification / refuse" — where non-call cases must carry a stable reason_code, and call cases must not. The judging logic therefore never needs anyone to read prose — the soft judgment is hardened into a decidable gate.

## The measurement instrument itself lies: three kinds of "false green" and one common root cause

More dangerous than red is a green that's wrong — it looks finished. I've hit three kinds of false green along the way, and their common thread is: **the measurement instrument itself became the object being deceived or bypassed.**

**The first: the thing under test never ran.** I once scripted a "Codex implements → Claude Code reviews" multi-agent chain. The first real run, Codex wasn't installed, so the "implement" step was a no-op, but the script still reported converged — it reviewed unrelated leftover changes in the workspace, the review was empty, zero blockers, and it wrongly judged success. The fix was a pre-flight: in real mode, a missing agent aborts immediately, so that "nobody did any work" can't masquerade as success.

**The second: the gate was the wrong one.** Same script, second real run, I had Codex fix an iOS bug. It genuinely changed Swift code, but the gate ran the Python backend's pytest — "53 passed" meant nothing for that change. The change was never compiled, yet it got a green light. **The gate must match the type of change.**

**The third: the gate's form didn't match the thing under test.** This is the most insidious. When I built stateful multi-turn evaluation for the agent, the first harness just spliced a few lines of history text into the prompt. It ran all-green, but it disguised multi-turn as single-turn, so the result was invalid. Only after switching to typed event replay (real user-message events, operation-result events, and pending-clarification history bound into structured clarification context) did the green light become meaningful.

There's also a common root cause behind these three false greens, and it comes from the way the test is written: in two independent reviews of my project, each time a **completely green test suite** had six blocking-level defects hiding behind it. The cause was the same — **the fake and the code under test come from the same set of assumptions, so the fake can only confirm those assumptions and never refute them.** At the boundaries facing models, networks, and attackers, a green light is not evidence; design the failure cases first (empty responses, multiple tool calls, tool calls mixed with prose, malformed parameters, multi-turn context, tampered environment variables, vendor errors), then write the implementation — and everything fails closed.

Industry data shows this isn't a personal luck problem. A 2026 audit of four mainstream tool-calling benchmarks (BFCL v4, τ²-Bench, LiveMCPBench, MCP-Atlas) found that the evaluator's disagreement rate with human expert judgment was 18.5% (92 inconsistencies across 496 re-reviewed tasks); and a full re-run of LiveMCPBench's same 95 configurations 23 times produced scores drifting between 57.9% and 76.8%, a span of 18.9 percentage points — enough to flip leaderboard conclusions. That fluctuation includes randomness on both the agent-rollout side and the evaluator side, so it can't all be blamed on the judge; but it's already enough to prove: **the evaluator itself is a component that needs auditing, not the starting point of measurement.**

## Statistical discipline: the step from measurement to conclusion is where it goes wrong most easily

My working habit since then: **before running eval, fill in the two columns of "what conclusions can this round support / what conclusions can't it support."** Order matters. Figuring it out after the run, a person tends to keep the sentences already written — especially the good-looking ones.

Each of the following cost me a real mistake.

**The denominator drifts, and it drifts toward the flattering direction.** In one round I wanted to show a new rule brought improvement, and the draft said "strict pass 24/32" — drawn from the full set; in the same draft, the "improvement amount" came from the subset of cases shared between the two rounds (safe pass 16→22). Two numbers from two different denominators, and I happened to pick the prettiest one for each. Not deliberate — when writing, I just grabbed whichever number was at hand. Recalculated on a consistent basis, strict pass was 13→16. **Cross-round comparison can only be done on the subset shared by both rounds; numerator and denominator must come from that subset together.** This sounds like common sense, but when it fails it's usually not from ignorance — it's from having something to say.

**A single run can't support a causal claim.** A rule change and sampling fluctuation can't be separated in one run. I had two failing cases that looked identical in a single comparison: one, on the fixed version repeated four times, failed all four times; the other passed three times and failed once. The former should be treated first as a stably-reproducible defect; the latter at least shows the behavior fluctuates, and can't be summarized by any one pass or failure.

What I actually adopt is an engineering triage rule, not a statistical proof: run the fixed version at least three times. All fail → investigate as a stably-reproducible problem first. All pass → you can only write "passed in these few fixed-configuration runs," and can't upgrade it to a system property. Results vary → report the count and the range, not a single confident-looking number. N≥3 is just the starting point I chose between cost and information, not a magic sufficient sample size.

**Different metrics have different stability.** Running the fixed version four times, strict pass wobbled between 24 / 25 / 27 / 26, while safe pass was 30 / 30 / 30 / 30 — it never moved once. Same batch of runs, same set of cases, two slices: one wobbling, one motionless. The narrow conclusion this data supports is: **in these four fixed-configuration runs, safe pass is repeatable, and strict pass shows clear run-to-run fluctuation.** It can't prove safe will never fail from now on, nor can it write off all of strict pass's variation as evaluation noise — at least part of it is the agent's own sampling difference. Since then I only use the safe number when speaking externally, not because it's prettier, but because in the samples I've already collected, it's the only one that didn't drift.

**If you only test the lower bound, the system degrades toward the other side.** I found the agent would silently guess categories for merchant names it didn't recognize, so I added four clarification rules. Re-ran, the guessing problem was gone, but the agent started asking about everything. The "don't guess" lower bound held, at the cost of the system becoming hard to use — and my original test set had no case that could catch this. I later built a dedicated "information complete, must execute directly" upper-bound slice for friction: 10 cases, and the direct-execution rate stayed at 8/10 across three runs; one of them — an input with an already-frozen mapping (buying a power bank → shopping) — triggered an unnecessary clarification all three times. **Restraint and friction must be evaluated at the same time, each with its own gatekeeping cases. Test only one side and the system easily slides toward the other.**

**The defects you introduce yourself are the easiest to overlook.** A name-extraction rule I added made a wrong business call of its own — it wrote "水电费" (water & electricity fee) as "交水电费" (pay the water & electricity fee). This kind of defect carries the most information, because it exposes both the rule and the rule's guardrail; but it's also the easiest to miss, because you're checking whether the model made a mistake, not whether the rule you just wrote made one.

## The authenticity of input: "user-provided" is not the real distribution

Back to the opening story. It's common sense that synthetic cases aren't real, so I deliberately went looking for real input. But **real input can be contaminated too — as long as the user has been using the system for a while, they start tidying up the language for the model, often without realizing it.**

The countermeasure is to construct counterfactual variants: remove the hint words the user actively added, reorder the wording, strip the spaces. At least on that model, that case set, and that fixed configuration, the result pointed to a more specific explanation than "whether the user writes well": whether the merchant name contains a category clue significantly affects whether the model guesses the category. It's not yet a causal law generalizable to all inputs, but it's already enough to overturn the original case's interpretation — success after adding "晚饭" doesn't prove the agent can handle natural input; it may just be hiding the real difficulty.

There's an even more insidious kind of contamination, and it happens inside the system: as long as the agent writes its own output back into its own input, there's a contamination path that needs **no external adversary at all.** This really happened in my production: the session-splitting component failed, and 78+ messages entered one session; facing a new bookkeeping request, the model no longer called the tool and directly answered "already recorded"; this false reply was recorded as a "success" operation result into the history; the next round it entered the context as a "correct example," and the wrong pattern reinforced itself. **A failed action must not leave a successful trace** — wherever "the model claims completion" and "external evidence proves completion" can diverge, a structured gate is needed.

The requirement on evaluation is direct: single-turn eval being all-green and the system being correct over the long term are two different questions. To cover this kind of failure, eval must support stateful multi-turn regression — feed real history containing failures and corrections back in as typed events, and check whether the model still does the right thing at turn N.

## The judge layer: LLM-as-judge is a calibration discipline

My project currently uses hard validators everywhere, because bookkeeping writes have a single correct answer. So this section is not a proven practice I've completed, but the boundary I'm drawing for the next phase: as soon as the system starts producing output that has no single correct answer but does have good and bad — whether an explanation is clear, a suggestion reasonable, a refusal graceful — hard validators stop being enough. Human scoring is expensive and slow; LLM-as-judge can scale it, but it introduces a new core tension:

**You're using an unreliable thing to measure another unreliable thing.**

So before plugging in a judge, I first have to answer how to prove the judge itself is trustworthy. It's not adding one more prompt; it's calibrating the measuring instrument.

First, when pairwise comparison is possible, I'll prefer to start from pairwise rather than having the model give an absolute score. "Which of A and B is better" usually depends less on a ruler hidden inside the model than "is A worth 4 or 5," but this isn't an unconditional law: pairwise has its own position bias, and it behaves differently across tasks, models, and answer-quality gaps. The cheapest check is to run the same A/B pair in both orders and count the flip rate. [Public research](https://arxiv.org/abs/2406.07791) also shows the direction and severity of position bias depend heavily on the judge and the task, and can't be erased by a single "stay neutral" instruction.

Second, the calibration set and the test set can't be mixed: the test set tests the system under test; the calibration set tests the judge. For my single-user system, the smallest starting point isn't to chase an industry-standard scale first, but to draw 50 items from my own real traces, label them against the same rubric, and re-label them in shuffled order a week later. If my own two rounds of labels don't agree, the standard hasn't been written clearly yet, and plugging in a judge at this point only amplifies the vagueness.

Third, don't just look at raw agreement rate. Suppose two annotators both choose "good" on 95% of samples; even if mutually independent, the surface agreement rate will be very high. Two annotators can report Cohen's kappa; multi-annotator labeling needs a statistic suited to multiple people. There's no threshold here that holds universally independent of class distribution, sample size, and risk, but the order can't be reversed: **first see whether humans can stably agree with each other against the rubric, then whether the judge can align with humans.**

Finally, bias must have a detection method. Position bias looks at flips between the two orders; length bias needs to compare both "judge score vs length" and "human score vs length" at the same time, or you'll misdiagnose "longer answers really are more complete" as bias; when the generator and the judge come from the same model family, do a cross-family comparison specifically, rather than first assuming it won't favor its own way of expressing things.

Vendors update models and business distributions shift, so calibration can't be a one-time thing. The judge version, prompt, rubric, and sampling rules must all go into the evidence record; when going live, sample asynchronously first, take in all errors and anomalies, then adjust the proportion based on cost and missed detections — rather than copying a professional-looking industry percentage up front. For my project, the judge only qualifies to enter the report once this calibration chain holds, and it has no qualification to override hard validation results.

## Evidence binding: conclusions must be re-verifiable

An evaluation conclusion must be re-verifiable by someone else (and by myself three months later), so every round I record: the base commit, the SHA-256 of each uncommitted file that participated, the digest of the dataset / prompt / artifacts, the evaluator identifier, the digest of each run's result file, and the case count and composition.

Later this list gained one item: **the vendor's quota tier / plan.**

The trigger was that I measured the same model, same kind of closed schema, on short calls, at 2.8 / 3.6 / 5.1 / 8.5 / 10.8 seconds — nearly 4× spread. At the time I was on the free tier, and this distribution first made me suspect queueing from the quota tier, but five latency values alone can't pin the cause: generation path, network, cache, retries, and vendor routing can all contribute fluctuation.

But the consequence was already real: I have an 8-second timeout threshold, set precisely against this batch of measurements, and the record didn't include the quota tier. Even if I can't separate every latency source yet, I can no longer prove this batch of data represents "model speed." **Recording only the model id and not the tier leaves two measurements missing an important comparability condition; any engineering decision based on latency must be traceable to which tier it ran on at the time.**

## When eval goes red, the first move is not to change the prompt

After discovering the silent category guessing, I didn't add a line "when unsure, ask" to the prompt and re-run it green.

Because the real meaning of the red light is: **this rule was never defined.** "What to do with an opaque merchant name" wasn't in the frozen business contract. The model didn't guess wrong; it was never told not to guess.

The correct order is: freeze the product rule first, then sync it into the permission rules, the detailed contract, the PRD, the runtime prompt, and the tool description, and finally regenerate the checklist and run the consistency check. **The prompt is only one of five places where a rule lands. If it's the only place, all you've done is teach the model to pass its own test.**

[A 2026 study](https://arxiv.org/abs/2606.09863) gives "false success" a narrower and more easily verifiable definition: the agent claims the task is complete, but the environment state proves it isn't. It also found that LLM judges tend to rely on surface signals like a confident closing line rather than checking the real state. This is exactly why "already recorded" can never be my evidence of success.

There's an adjacent but different problem: the environment really changed, but not to the result the user wanted. I saw this with my own eyes in a live evaluation on a public open platform: an agent misdiagnosed a ¥1,200 bid intent as a unit problem, submitted a price a hundred times higher, and got a formal pass by using the high price to bypass the low-price block — the test protocol was all-green, and the business consequence was a disaster. This isn't "the agent self-reported success but didn't actually do it"; it's "it really did it, but did the wrong target." So at least three things must be separated: what the agent says, whether the external state changed, and whether the change satisfies the real intent.

## Eval is not a one-time acceptance; it's a loop

The previous eight sections carry an implicit premise: use better evaluation to keep errors outside the system. That premise is only half right. **An agent's errors can't be completely eliminated** — models sample, distributions drift, rules always lag behind real expression. Since errors can't be eliminated, the engineering problem changes shape: whether every error is diagnosable, correctable, and recyclable.

I've turned these three things into mechanisms in my own system.

**Diagnosable: complete input/output logging.** The trigger was a query failure in a real-device acceptance: the production logs only showed the orchestrator's conclusion ("needs to call the finance tool"), not what the model actually received and returned each turn, so I couldn't distinguish a missing context signal from the model's own choice. On 2026-08-14 I authorized and deployed full message logging: for every conversation, the real provider request (system instruction, messages, tool declarations, function-choice constraints), the unparsed raw response, tool parameters and results, and the body returned by each of the six HTTP delivery paths, all written to disk as owner-only JSONL. Its boundary matters as much as its content: **write-only** — no code path ever reads it back, it doesn't enter the context, and it's never fed back to the model; credentials are scrubbed before landing; a logging failure only records a warning and never affects the main flow; plaintext is kept for 14 days and doesn't enter off-device backup. This log is also the mine for eval cases: any round can be grepped out and replayed offline as evaluation input.

**Correctable: make the fix a product capability, not backend ops.** The bookkeeping card lets you edit the category directly. Today (2026-08-16) this capability just passed real-device acceptance: on a real iPhone, I edited the category twice, wrote back to the real Feishu ledger, and verified via read-back. Two details worth noting. One, the acceptance assertion isn't "the category changed," but "**the category changed, and every other configured field is identical to before**" — the correction action itself must also be verified by external evidence, the same principle as "success is defined by external fact" in eval. Two, the sealed record of the original write is not rewritten: a correction is a new event, not a doctoring of history.

**Recyclable: keep collecting error cases and periodically return them to the test set.** This is the most valuable link in the whole loop. A production error outranks any synthetic case — it's a sample the real distribution handed over on its own, and it carries the evidence that "the system really failed here." In daily use I hit one: buying water got categorized as "日常生活" (daily life), and I manually changed it to "餐饮" (dining). On the surface this action corrects one entry; in substance it exposes a product signal that didn't exist before: in my personal category system, this expense should belong to dining. A single correction can't automatically generate a universal rule; I first need to decide whether it's an isolated case, a personal preference, or a freezable mapping. Once I decide to promote it, the rule enters the contract and the case enters the gatekeeping slice, and the next time the rule changes, it must still pass.

This loop happens to fill one of the biggest gaps in my comparison against public methodology: **online eval.** My system was previously entirely offline; in the public methodology, production-sample recycling and distribution-drift monitoring are a whole separate block. For a small system, its minimal form doesn't require building a huge sampling pipeline first — it's just the three things above: errors diagnosable, correctable, and periodically recycled into gatekeeping cases. **Every error thickens the test set by one; eval goes from a gate before launch to a part of the system's running.**

---

## References

- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
- [Benchmarking the Benchmarks: A Validity Audit of Tool-Calling Evaluation](https://arxiv.org/abs/2607.02577)
- [Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge](https://arxiv.org/abs/2406.07791)
- [From Confident Closing to Silent Failure: Characterizing False Success in LLM Agents](https://arxiv.org/abs/2606.09863)

*The other cases, run numbers, and product decisions in this essay all come from my personal project, Personal Agent. Public research is used to calibrate what conclusions this experience can support, not to replace the project's own evidence.*
