---
key: design-drift-ai-collab
lang: zh
title: 设计稿带偏实现：AI 协作里 PM 该守的边界
date: 2026-02-17
category: AI 协作
readMins: 5
summary: 一次真实事故：设计 agent 补出了没有后端支撑的功能，coding agent 把假入口写成真逻辑，App 崩了。根因不是某个 agent 写错代码，而是协作链路缺少可执行的产品边界。
draft: false
---

在演出雷达项目里出过一次「设计稿带偏实现」的事故，已脱敏可公开：设计 agent 自作主张补出了一个没有后端支撑的功能，coding agent 把这个假入口当真需求、写成了真实逻辑，结果 App 崩了。

复盘后我的结论是：**根因不是某个 agent 写错了代码，而是整条协作链路缺少一个可执行的产品边界。**

## PRD 在 AI coworking 里是协作协议

PRD 在 AI coworking 里不是形式文档，而是跨 agent 协作协议——它的作用是让设计 agent 少脑补、让 coding agent 少误信、让 review 有判断标准。

- 设计 agent 会在空白处「合理补全」，PRD 要划出哪些是空白、哪些是禁区。
- coding agent 会把任何看起来像需求的东西实现掉，PRD 要明确哪些入口是占位、哪些是真逻辑。
- review 需要一个可对照的事实源，否则只能凭感觉。

> 新 PRD 必须同时写「做什么」和「不做什么」。在 AI 协作里，「不做什么」往往比「做什么」更能防止事故。
