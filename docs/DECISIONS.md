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

AI/search discoverability metadata should be generated from the canonical content collections and shared layout helpers. Blog detail pages emit JSON-LD (`BlogPosting`, `Person`, `BreadcrumbList`) and Article Open Graph metadata. Real content revisions use optional frontmatter `updated` values, which drive machine-readable `dateModified`, Article modified time, sitemap `lastmod`, and `/llms.txt`; build time must not impersonate content freshness. The visible article header remains publication date + reading time to avoid metadata noise. `/llms.txt` is generated at build time from the bilingual blog and AI-practice indexes rather than hand-maintained. The site remains a single-author personal blog, so no redundant visible byline, RSS feed, or expanded entity-graph layer is added solely for GEO.

## D7 — Basic Traffic Stats Come From Server Logs

Basic visit counts should be derived from ECS/Nginx access logs, not frontend analytics scripts. The public static site remains free of tracker pixels, third-party analytics CDNs, and client-side behavior-event collection unless a future product decision explicitly changes that boundary.

## D8 — Social Publication Completes Only After Durable Knowledge Sync

The social-media loop records execution truth in its own `.loop` state. `ready_for_final_review` means the publisher page was verified, not that the post is public. After Henson confirms publication, the task enters `kb_sync_pending`; it reaches `archived` only after the publication page, knowledge-base index, and append-only knowledge-base log are all verified. The Personal Homepage does not infer completion directly from chat history or the source material leaving `inbox/`; its article and project context must be updated from this durable evidence.

## D9 — The Public Social Loop Repository Contains Harness Code Only

The public `social-media-publish-loop` repository may contain the reusable state machine, CLI, tests, generic documentation, and placeholder configuration. It must exclude `.loop` runtime state, real source material, images, drafts, publication evidence, browser/profile details, personal filesystem paths, and knowledge-base content. Personal values belong only in ignored local configuration.

## D10 — Deploy rsync Escalates Via sudo (Non-Root Login + Passwordless sudo rsync)

Production deploys log in as the non-root `henson-admin` (no root SSH login) and escalate only for privileged steps. The rsync step runs with `--rsync-path="sudo rsync"` so the file sync can write into the `root:www-data` target directory; the post-sync `chown`/`chmod`/`nginx -t`/`reload` steps already run under `sudo`. `henson-admin` holds `NOPASSWD: ALL` in sudoers, so no interactive password is needed. This completes the migration begun in d52d364, which added sudo to chown/chmod/nginx but left rsync unprivileged — so the first content-adding deploy after a permission normalization (which leaves the directory at `root:www-data` 755/644) fails with "Permission denied" on `mkdir`/`mkstemp`.

## D11 — Related Reading May Be Editorially Matched

Blog frontmatter may provide an ordered `related` list of entry keys when an author has a stronger semantic match than simple recency. The detail page resolves those keys in the active language and preserves the declared order. Entries without an explicit list retain the strict same-category, newest-first fallback; the site never fills empty slots with unrelated posts merely to populate the section.

## D12 — Production Deployment Requires Explicit Release Authorization

For a new or materially revised public article, local build, acceptance checks, and zh/en preview are preparation steps only. The agent must report those results and wait for Henson's explicit authorization for that specific release before running `npm run deploy:ecs`. Editorial requests to check, translate, prepare, or publish content do not by themselves authorize production deployment. The live site may therefore temporarily remain on the last authorized revision while a local candidate is reviewed.
