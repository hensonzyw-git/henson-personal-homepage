---
key: show-radar
lang: zh
title: 演出雷达 Show Radar
date: 2026-06-13
oneLiner: 把散落在多个票务平台的演出信息，做成每天看一眼就够的个人情报雷达：后端持续抓取 + LLM 打分分类，iOS 端只呈现当前最值得关注且没过期的演出，并能用自然语言持续校准口味。
tag: 个人 vibe coding
featured: true
facts: ~4 周（2026-05-15 → 2026-06-13），39 commits，~13.5k 净增行；ECS + FastAPI + 每日采集 + DeepSeek 喜好评分 + SwiftUI iOS 客户端。
did: 多源演出信息 → 抓取 → LLM 结构化 → 去重 → 偏好打分 → 摘要 → iOS 呈现。
how: 先用 fixture 解耦抓取与抽取、先打通最易的源、把系统抽象成「数据管道」而非「实时监控」、敢砍详情页、混合云 / 本机架构、把 PRD 写成给 AI 读的协作协议、用多模型交叉审查（实现 / 挑错 / 复核）。
value: 证明 AI 时代 PM 能把一个真实需求用 AI coworking 推进成可运行、可部署、可讲述的数据产品。最值钱的产出不是代码，是「PM 如何管理 agent 之间的信息传递与质量控制」的实战方法。
placeholderLabel: iOS 截图 · 待替换
hasDetail: true
archDiagram: true
screens: [当日摘要, 全部演出, 偏好管理, 设置]
---

把一个真实的个人需求——「我想知道最近有哪些值得看的演出，但信息散在十几个平台、还经常过期」——用 AI coworking 推到了可运行、可部署、可讲述的程度。

下面的架构图与 iOS 截图为占位，确认无 IP / 隐私后替换为真实素材。
