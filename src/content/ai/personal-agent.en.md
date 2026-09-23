---
key: personal-agent
lang: en
title: Personal Agent
date: 2026-09-23
updated: 2026-09-23
oneLiner: A personal agent built by a product manager with AI coding tools, connecting personal data with governed actions and an auditable development workflow.
tag: Open source · Personal agent
featured: true
repo: https://github.com/hensonzyw-git/personal-agent-open-source
facts: Single user · iOS + Python · Google ADK + MCP · MIT
did: Built a personal agent for chat and Finance, with an ongoing exploration of development workflows governed by approval and verification.
how: iPhone handles interaction, ECS owns runtime, permissions and audit, and a Mac mini executes authorized development tasks.
value: Shares real project code, architecture decisions and verification limits for others to study, discuss and reuse.
cardImage: /ai/personal-agent/cover.svg
cardImageMode: cover
hasDetail: true
---

## From everyday use to governed actions

I started building Personal Agent in July 2026 to work with my own data over time. Finance was the first working use case. Understanding a sentence was only part of it: permissions, duplicate writes, uncertain external outcomes and reconciliation also needed explicit handling.

As a product manager, I own requirements, product and architecture decisions, reviews and acceptance. AI coding tools generate and iterate on most of the code. The source and architecture documentation are now available under MIT, with development history preserved through privacy rewriting.

## Two related, independent paths

- **Everyday Personal Agent**: iOS interaction → Agent Runtime on ECS → policy checks and MCP tools → personal business data and actions. The model proposes actions; the system governs permissions, state and audit.
- **DAL (Development Agent Loop)**: a governed process for requirements, PRD approval, technical design, coding, verification, independent review and delivery acceptance. ECS owns the control plane; a Mac mini worker connects outbound to execute authorized steps.

The everyday agent runs independently of DAL. The complete phone-to-development-delivery path still awaits acceptance; delivery does not automatically authorize a merge or deployment.

## What is available today

Chat, Finance, sessions and context management have implementations and historical usage or acceptance records from the original single-user environment. DAL has control-plane and worker implementations, plus live evidence for a single role using synthetic input. This does not establish acceptance of the complete workflow.

**The public repository is a source and architecture reference, not a directly deployable release.** It excludes personal data, credentials, production configuration and the full runtime environment. Public CI checks and historical online acceptance are recorded separately in the repository's [verification notes](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/docs/verification.en.md).

## Next priority: Memory

The highest priority is a manageable Memory module: explicit sources and types, cross-session retrieval, correction, expiry and deletion, with controls on sensitive information entering context. Completing a real development request from phone input through delivery comes afterward.

## Where to start

- [GitHub repository and English README](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/README.en.md): source, capabilities and roadmap.
- [Architecture and deployment responsibilities](https://github.com/hensonzyw-git/personal-agent-open-source/blob/main/docs/overview/architecture.md): the roles of iOS, ECS and Mac mini.
- [Project origins](/en/blog/all-in-personal-agent/) and [phase-one retrospective](/en/blog/personal-agent-phase-one/): why I started and what the first delivery taught me.
- [Architecture decisions](/en/blog/harness-governance-scar-tissue/) and [evaluation methodology](/en/blog/agent-eval-methodology/): what the system must own and which conclusions the evidence supports.
