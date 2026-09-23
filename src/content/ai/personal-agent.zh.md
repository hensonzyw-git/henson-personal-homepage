---
key: personal-agent
lang: zh
title: Personal Agent
date: 2026-09-23
updated: 2026-09-23
oneLiner: 一个产品经理用 Vibe Coding 构建的个人 Agent：连接自己的数据，执行受控操作，探索可审核的开发闭环。
tag: 开源 · 个人 Agent
featured: true
repo: https://github.com/hensonzyw-git/personal-agent-open-source
facts: 单用户 · iOS + Python · Google ADK + MCP · MIT
did: 构建单用户个人 Agent，已落地聊天与 Finance，并探索带审批和验证的开发闭环。
how: iPhone 负责交互，ECS 管理运行时、权限与审计，Mac mini 执行获准的开发任务。
value: 公开真实项目的代码、架构取舍和验证边界，让个人 Agent 的实践可以被阅读、讨论和复用。
cardImage: /ai/personal-agent/cover.svg
cardImageMode: cover
hasDetail: true
---

## 从日常使用到受控行动

我从 2026 年 7 月开始构建 Personal Agent，希望它能围绕自己的数据长期工作。Finance 是第一个落地场景：除了理解一句话，还要处理权限、重复写入、外部结果不确定和事后核对。

我是产品经理，负责需求、产品与架构取舍、评审和验收，主要借助 AI 编程工具生成并迭代代码。这次以 MIT 许可证公开源码和架构文档，也保留了经过脱敏改写的开发历史。

## 两条相关但独立的链路

- **日常 Personal Agent**：iOS 交互 → ECS 上的 Agent Runtime → 策略校验与 MCP 工具 → 个人业务数据与操作。模型提出行动，系统管理权限、状态与审计。
- **DAL（Development Agent Loop）**：把需求、PRD 审批、技术设计、编码、验证、独立审查和交付验收组织成受控流程。ECS 管理控制面，Mac mini Worker 主动连接并执行获准步骤。

日常 Agent 可以独立运行。DAL 的完整手机开发交付链路仍待验收，交付也不自动意味着合并或部署。

## 当前公开版本

聊天、Finance、会话与上下文管理已有实现，并有原单用户环境的使用或验收记录。DAL 已有控制面与 Worker 实现，以及单角色、合成输入的实测证据；这些证据不能替代完整流程验收。

**公开仓库提供代码与架构参考，不能直接部署。** 它不包含个人数据、凭据、生产配置或完整运行环境。公开 CI 检查与历史线上验收分别记录，具体以仓库的[验证说明](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/docs/verification.md)为准。

## 下一步：优先搭建 Memory

最高优先级是搭建可管理的 Memory 模块：明确记忆来源与类型，支持跨会话检索、纠错、失效和删除，并控制敏感信息进入上下文的边界。之后再跑通一项真实需求从手机输入到开发交付的完整流程。

## 阅读入口

- [GitHub 仓库与中文 README](https://github.com/hensonzyw-git/personal-agent-open-source)：源码、能力表与路线图。
- [架构与部署职责](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/docs/overview/architecture.md)：iOS、ECS 与 Mac mini 的分工。
- [项目起点](/blog/all-in-personal-agent/)与[一期复盘](/blog/personal-agent-phase-one/)：为什么开始，以及最早一轮交付的经验。
- [架构取舍](/blog/harness-governance-scar-tissue/)与[评测方法](/blog/agent-eval-methodology/)：系统需要自己负责什么，证据又能支持哪些结论。
