---
key: show-radar
lang: zh
title: 演出雷达 Show Radar
date: 2026-06-13
updated: 2026-06-13
oneLiner: 把散落在多个票务平台的演出信息，做成每天看一眼就够的个人情报雷达：后端持续抓取 + LLM 打分分类，iOS 端只呈现当前最值得关注且没过期的演出，并能用自然语言持续校准口味。
tag: 个人 vibe coding
featured: true
facts: ~4 周（2026-05-15 → 2026-06-13），39 commits，~13.5k 净增行；ECS + FastAPI + 每日采集 + DeepSeek 喜好评分 + SwiftUI iOS 客户端。
did: 多源演出信息 → 抓取 → LLM 结构化 → 去重 → 偏好打分 → 摘要 → iOS 呈现。
how: 先用 fixture 解耦抓取与抽取、先打通最易的源、把系统抽象成「数据管道」而非「实时监控」、敢砍详情页、混合云 / 本机架构、把 PRD 写成给 AI 读的协作协议、用多模型交叉审查（实现 / 挑错 / 复核）。
value: 证明 AI 时代 PM 能把一个真实需求用 AI coworking 推进成可运行、可部署、可讲述的数据产品。最值钱的产出不是代码，是「PM 如何管理 agent 之间的信息传递与质量控制」的实战方法。
placeholderLabel: iOS 截图 · 待替换
cardImage: /ai/show-radar/show-radar-today.png
cardImageMode: phone
hasDetail: true
archDiagram: true
archImage: /ai/show-radar/architecture.svg
screens: [当日摘要, 全部演出, 偏好管理, 设置]
screenImages: [/ai/show-radar/show-radar-today.png, /ai/show-radar/show-radar-all.png, /ai/show-radar/show-radar-prefs.png, /ai/show-radar/show-radar-settings.png]
---

把一个真实的个人痛点——「想知道最近有哪些值得看的演出，但信息散在十几个平台、还经常过期」——用 AI coworking 一路推到可运行、可部署、可讲述。下面是这四周里，比「做了什么」更值得说的部分。

## 四周，五个阶段

第一天没有上来就做 App，而是先把它拆成一条数据管道：用 fixture 假数据绕开反爬，先验证 LLM 抽取这条核心价值链路，再回头处理大麦的登录态和风控。接着先挑最容易的源（秀动、摩天轮）打通，拿到「它真的给我发通知了」的第一刻，再逐层加难。然后把本地脚本云端化成 FastAPI 服务，跑在 ECS 上每天自动采集；做出 SwiftUI iOS 客户端，让作品有了可消费的界面；最后把偏好做成可以用一句话持续校准——profile 同步更新，最多 500 条历史演出的重打分丢到后台异步执行。

这条线里几个判断比代码更关键：把系统当「数据管道」而不是「实时监控」，每天跑一次就够，避免被名词带去做实时系统；敢砍演出详情页，digest 只做发现层，购票决策回原平台；好抓的源上云、难抓的（大麦）留在有登录态的本机辅助采集再同步——让不同约束各自找到合适的位置。

## 最值得记录的一次事故：设计稿带偏实现

做 iOS UI 时踩了一个典型的多 agent 协作坑：设计 agent 为了「更完整、更像正式产品」，补出了一批没有后端支撑、也不在范围内的功能入口；coding agent 默认相信上游设计稿，把这些假入口写成了真逻辑，界面和数据契约脱节，App 直接崩。根因不是某个 agent 写错代码，而是协作链路缺少可执行的产品边界——上游的幻觉会变成下游的开发任务。

处理方式是回滚不稳定方向，重写一份**面向设计 AI 和 coding AI 的 PRD**：不只写要做什么，更明确写不做什么——只有 4 个 Tab、不做详情页、不做推送所以不放任何假开关、所有可点的 UI 必须有真实反馈、后端才是唯一事实源。之后又固化了一个多模型 review loop：Codex 负责实现，Claude Code 做 code review，再回到 Codex 复核这些 review 意见并收敛修复。跑通这个流程后，代码问题明显下降。

这件事也是这个项目最想讲的一点：AI 时代 PM 的价值不是消失，而是从「写需求给人」迁移成「定义约束、设计协作协议、让多个智能体在同一个事实源下工作」。
