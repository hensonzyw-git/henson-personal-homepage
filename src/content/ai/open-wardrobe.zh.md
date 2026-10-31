---
key: open-wardrobe
lang: zh
title: Open Wardrobe
date: 2026-10-30
updated: 2026-10-30
oneLiner: "单用户衣橱 API / MCP 服务：存衣物元数据与受保护图片，向个人 Agent 暴露受控读写工具，并按天气与保暖预算做穿搭推荐——破坏性写入需人工确认。"
tag: "开源 · 衣橱 Agent 工具"
featured: true
repo: "https://github.com/hensonzyw-git/personal-online-wardrobe-open-source"
facts: "单用户 · FastAPI + MCP · SQLite · 天气感知推荐 · MIT"
did: "做成可自托管的衣橱目录与穿搭推荐服务，并对外提供受权限约束的 HTTP / MCP 工具面。"
how: "用保暖预算与季节叠穿规则约束推荐；天气取自可替换的观测源；写入走提案与人工确认，而不是模型直接改库。"
value: "公开一份可阅读的个人衣橱 + Agent 边界样本：代码、权限模型与验证边界都在，个人数据与生产配置不在。"
cardImage: /ai/open-wardrobe/cover.svg
cardImageMode: cover
hasDetail: true
---

## 为什么做衣橱服务

Personal Agent 需要能操作「我自己的」数据，而不是只能聊天。衣橱是其中一个真实场景：衣服要入库、要标注、要按天气推荐，还要能被 Agent 安全地读和提议改——但不能让模型直接覆盖个人记录。

我是产品经理，负责需求、边界与验收；实现主要靠 AI 编程工具迭代。这次以 MIT 公开的是去掉个人数据和生产配置后的代码快照，不是一份可直接托管的成品。

## 公开版本里有什么

- **衣橱目录与入库**：服装元数据、受保护图片资源、本地目录导入与可选的商品草稿（需人工审阅后才发布）。
- **受控 Agent 面**：HTTP API 与 MCP（`/mcp`）共用 scope（如 `wardrobe.read` / `create` / `propose_change` / `recommend` / `feedback` / `annotate`）；破坏性变更走提案，需人工确认。
- **天气感知推荐**：按地点与日期取天气上下文，用 Decimal 保暖预算与厚度档位筛选上身组合；叠穿有季节兼容规则（同季或一侧为全年才可叠；春夏与秋冬不混搭）；高温时厚外套不能作为首套推荐。
- **可运行骨架**：`wardrobectl` CLI、随包 Alembic 迁移、合成数据离线测试，以及 `deploy/` 下的 systemd / nginx 样例模板。

默认时区为可配置的 `UTC`；Agent 相关能力默认关闭，需显式开启。公开树不附带内置远程商品查询供应商。

## 刻意不放进去的东西

**公开仓库是源码与架构参考，不是可直接部署的发行版。** 它不包含真实衣物图片与目录、凭据、生产配置、私有域名或线上库存。离线合成测试通过，不证明你的环境下第三方集成或生产部署可用。细节见仓库的[验证说明](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source/blob/main/docs/verification.md)。

## 和 Personal Agent 的关系

衣橱服务是给个人 Agent 用的工具后端之一：模型提出行动，服务管权限、幂等、审计与确认。它与 Personal Agent 日常链路相关，但仓库独立、边界独立——你可以只读衣橱，也可以接进自己的 Agent 运行时。

## 阅读入口

- [GitHub 仓库与 README](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source)：能力范围、本地合成 Quick start、配置项。
- [验证说明](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source/blob/main/docs/verification.md)：公开快照验证了什么、没验证什么。
- 相关实践：[Personal Agent](/ai/personal-agent/)（单用户 Agent 与受控开发闭环）。
