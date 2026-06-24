---
key: multi-agent-workflow
lang: zh
title: 多 Agent 工作流
date: 2026-06-23
updated: 2026-06-23
oneLiner: 把「一个目标」推进到「已验收代码」的监督式自治流水线：一个编排中枢拆解调度，五个专职 Agent 分工实现，并在 PRD / 设计 / 真机三个固定人工闸门停下等我拍板。
tag: AI 模式实践
featured: true
repo: https://github.com/hensonzyw-git/multi-agent-workflow
facts: Claude Code / Codex 作编排中枢 + 5 个专职子 Agent（`.claude/agents/`）；`spec.md` 单一事实源 + 3 个固定人工闸门（PRD / 设计 / 真机）；已用于个人站点与演出雷达的 0→1 构建。
did: 一套可复用的多 Agent 流水线——编排中枢 + prd-writer / designer / coder / reviewer / tester 五个专职 Agent；本站与演出雷达都用它从 0→1 跑出来。
how: spec.md 作单一事实源、每次交接冷启动注入解决上下文丢失；把判断与品味设成 3 个固定人工闸门把误差挡在上游；跨模型互查（Claude Code × Codex 互相挑 bug）。
value: 把 AI coworking 从「给目标就消失等结果」变成「一个编排者 + 几个 human-in-the-loop」的可控流程；沉淀的是 AI 时代 PM 的核心方法——定义约束、设计协作协议、在关键节点拍板。
placeholderLabel: 流程图
cardImage: /ai/multi-agent-workflow/pipeline.svg
cardImageMode: cover
hasDetail: true
archImage: /ai/multi-agent-workflow/pipeline.svg
---

这是我做其它 AI 实践的「元工具」——一套把「一个目标」推进到「已验收代码」的监督式流水线。你给目标，Claude Code 或 Codex 作为编排中枢拆解、调度专职 Agent，并在三个关键节点停下等我拍板。本站和演出雷达都是用它跑出来的。

## 第一性原理：瓶颈不是「能不能生成 Agent」

把流程拆到底，多 Agent 协作的瓶颈从来不在「能生成多少个 Agent」，而在三个约束：上下文在每次交接处丢失、判断与品味无法外包、误差在自主链条里累积。这套 workflow 是冲着这三点设计的，而不是「叫越多 Agent 越好」。

## 单一事实源 + 固定人工闸门

- 一个编排中枢（Claude Code / Codex）维护 `spec.md` 作为唯一事实源，每个子 Agent 冷启动时注入它——交接不再丢上下文。
- 五个专职 Agent 分工：prd-writer → designer → coder ‖ reviewer ‖ tester（编码 / 审查 / 测试迭代循环）。
- 三个固定人工闸门：GATE 1 确认 PRD（投入产出比最高）、GATE 2 扫一眼设计、GATE 3 真机验收。把误差挡在上游，避免下游白做。

## 一个真实的坑：视觉生成顶不上来

做这个个人主页时最明显的一个坑出在 designer 这一环：靠 agent 的「设计师人设」从零生成设计稿，效果很差——产出要么平庸，要么补出没有依据的版式。最后我还是回到 Claude Design 手动出稿，再把定稿喂回流水线当设计基准。结论很清楚：当前这套 workflow 里，「视觉 / 审美的从零生成」是最顶不上来的一环；designer agent 更适合把已有设计稿翻译成布局、状态、交互规格，而不是替你拍板视觉。这反过来也印证了 GATE 2（人扫一眼设计）为什么必须保留。

## 跨模型互查

在 PRD 和编码完成后，把 `spec.md` / diff 丢给另一种模型表面挑毛病——不同模型互相 catch bug，这才是同时用 Claude 和 Codex 两家的真正价值。（演出雷达里那套「Codex 实现 → Claude Code review → Codex 复核」的 loop，就是它的一个实例。）

## 为什么它是 PM 的能力样本

这套东西最值钱的不是脚本，而是它把「AI 时代 PM 到底做什么」具象化了：不写代码，而是定义约束、设计跨 agent 协作协议、在少数关键节点用判断拍板。你正在看的这个网站，就是它跑出来的第一个产物。

v1 是 Claude Code / Codex 共用同一套 spec 协议与 Agent 提示词；后续想把跨模型 review / 测试接成自动并行节点。
