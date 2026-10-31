---
key: open-wardrobe
lang: en
title: Open Wardrobe
date: 2026-10-30
updated: 2026-10-30
oneLiner: "A single-user wardrobe API / MCP service that stores garment metadata and protected images, exposes governed read/write tools to personal agents, and recommends outfits from weather and a thermal budget — with human confirmation for destructive changes."
tag: "Open source · Wardrobe agent tools"
featured: true
repo: "https://github.com/hensonzyw-git/personal-online-wardrobe-open-source"
facts: "Single user · FastAPI + MCP · SQLite · Weather-aware recommendations · MIT"
did: "Built a self-hostable wardrobe catalog and outfit recommendation service with a permissioned HTTP / MCP tool surface."
how: "Recommendations are constrained by a thermal budget and season-aware layering rules; weather comes from a swappable observation source; writes go through proposals and human confirmation instead of letting the model mutate the catalog directly."
value: "Publishes a readable sample of personal wardrobe + agent boundaries: code, permission model and verification limits are in; personal data and production config are out."
cardImage: /ai/open-wardrobe/cover.svg
cardImageMode: cover
hasDetail: true
---

## Why a wardrobe service

A personal agent needs to act on *my* data, not only chat. Wardrobe is one concrete case: garments must be stored and annotated, outfits recommended from weather, and agents allowed to read and propose changes — without letting a model overwrite personal records on its own.

As a product manager I own requirements, boundaries and acceptance; most of the implementation is iterated with AI coding tools. What is public under MIT is a code snapshot with personal data and production configuration removed, not a ready-to-host product.

## What the public version includes

- **Catalog and intake**: garment metadata, protected image assets, local catalog import, and optional product drafts that stay unpublished until human review.
- **Governed agent surface**: HTTP API and MCP (`/mcp`) share scopes such as `wardrobe.read` / `create` / `propose_change` / `recommend` / `feedback` / `annotate`; destructive changes go through proposals that need confirmation.
- **Weather-aware recommendations**: weather context for a location and date; Decimal thermal budgets and thickness bands filter upper-body outfits; layering requires season compatibility (same season or one side year-round; spring/summer must not mix with autumn/winter); thick outerwear is blocked as the first pick when it is hot enough.
- **Runnable skeleton**: `wardrobectl` CLI, Alembic migrations shipped with the package, offline tests on synthetic data, and example systemd / nginx templates under `deploy/`.

Timezone defaults to configurable `UTC`. Agent-facing capability stays off until explicitly enabled. The public tree ships no built-in remote product lookup provider.

## What was deliberately left out

**The public repository is a source and architecture reference, not a directly deployable release.** It excludes real garment images and catalogs, credentials, production configuration, private hostnames and live inventory. Passing offline synthetic tests does not prove third-party integrations or a production deploy in your environment. See the repository's [verification notes](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source/blob/main/docs/verification.md).

## Relation to Personal Agent

Open Wardrobe is one tool backend a personal agent can call: the model proposes actions; the service owns permissions, idempotency, audit and confirmation. It relates to the everyday Personal Agent path but ships as its own repository with its own boundary — you can use the wardrobe alone or wire it into your own agent runtime.

## Where to start

- [GitHub repository and README](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source): scope, local synthetic quick start and configuration.
- [Verification notes](https://github.com/hensonzyw-git/personal-online-wardrobe-open-source/blob/main/docs/verification.md): what the public snapshot verified and what it did not.
- Related practice: [Personal Agent](/en/ai/personal-agent/) (single-user agent and governed development loop).
