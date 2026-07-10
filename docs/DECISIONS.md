# Decisions — Personal Homepage

## D1 — This Repo Is Not The GitHub Profile README

`henson-personal-homepage` is the personal website repo. The public GitHub profile repository is `hensonzyw-git/hensonzyw-git` and is excluded from this context-file sync.

## D2 — Chinese Default, English Mirror

The site uses Chinese as the default language and maintains English mirror routes for key pages.

## D3 — Private Work Projects Stay Private By Default

Current public navigation does not expose a career project page. Work project materials remain private unless the user explicitly asks to publish them.

## D4 — Astro Content Collections Are The Content Layer

Blog and AI practice content should be managed through Markdown content collections and paired language handling rather than hardcoded page-only content.

## D5 — Design Direction Comes From Existing Design Artifacts

Preserve the design direction in `docs/design/` unless a newer approved design artifact is provided.

## D6 — GEO Metadata Is Generated From Existing Content Data

AI/search discoverability metadata should be generated from the canonical content collections and shared layout helpers. Blog detail pages emit JSON-LD (`BlogPosting`, `Person`, `BreadcrumbList`) and Article Open Graph metadata. Real content revisions use optional frontmatter `updated` values, which drive visible update labels, `dateModified`, and sitemap `lastmod`; build time must not impersonate content freshness. `/llms.txt` is generated at build time from the bilingual blog and AI-practice indexes rather than hand-maintained. The site remains a single-author personal blog, so no redundant visible byline, RSS feed, or expanded entity-graph layer is added solely for GEO.

## D7 — Basic Traffic Stats Come From Server Logs

Basic visit counts should be derived from ECS/Nginx access logs, not frontend analytics scripts. The public static site remains free of tracker pixels, third-party analytics CDNs, and client-side behavior-event collection unless a future product decision explicitly changes that boundary.
