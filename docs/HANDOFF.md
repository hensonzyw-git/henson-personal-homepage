# Handoff — Personal Homepage

Start here after `AGENTS.md`.

## Read First

1. `PROJECT_STATE.md`
2. `README.md`
3. `docs/DECISIONS.md`
4. `docs/design/README.md`

## Before Editing

- Check whether the request is public-site content, private career material, or design/system work.
- Keep bilingual pairing in mind for route/content changes.
- Do not publish private work project content unless explicitly requested.
- Preserve the existing design direction unless the user provides a newer approved design artifact.

## Verification

- Run `npm run build` for code/content changes that affect the generated site.
- For documentation-only context updates, no build is required.
- GEO checks cover blog JSON-LD, Article publish/modified metadata, related reading, content-derived sitemap `lastmod`, and the blog + AI-practice `/llms.txt` index.
- Blog `updated` is optional and means a real content revision. Do not set it to build or deploy time.
- Date rendering must stay timezone-independent: frontmatter dates are UTC midnight, so `monoDate`/`monoDateShort` use UTC accessors and an AC check pins the visible date. Do not reintroduce local getters.
- Basic traffic stats are server-log based via `npm run stats:traffic`; do not add a frontend analytics script unless that boundary is explicitly changed.
- ECS nginx logrotate keeps 365 days as of 2026-07-12 (was 14; backup at `/etc/logrotate.d/nginx.bak-20260712`). Log history earlier than ~2026-06-28 is permanently lost — launch-to-date totals cannot be reconstructed before that day.
- Current newest publication: `personal-agent-as-my-os`, 2026-09-02 (zh + en; English keeps `draftTranslation: true`). It reframes the unfinished Coding Graph Loop as the production line through which a user-owned Personal Agent can acquire governed capabilities, while coding/browser/research agents remain replaceable providers. The published edit distinguishes Henson's market inference from disclosed vendor strategy, rejects the idea that providers are already commodities, and defines self-extension as versioned, reviewable, testable, human-gated, and reversible. Its explicit related-reading keys are `harness-governance-scar-tissue` and `agent-memory-knowledge-base`. `npm run deploy:ecs` built 39 pages, passed 82 checks, validated/reloaded Nginx, and verified the zh/en article routes, RSS, and `/llms.txt` with HTTP 200; desktop and 390px browser checks had no overflow or console errors.
- Preceding published article: `harness-governance-scar-tissue`, substantially rewritten on 2026-08-21 and revised again on 2026-08-22 (zh + en). It relates the actual Finance path to Claude Code, DeepSeek Harness, and Codex Harness/App Server across six responsibilities. Coding Graph Loop material was intentionally reserved for the later standalone direction now introduced by `personal-agent-as-my-os`. Earlier: `agent-eval-methodology` (2026-08-16), `personal-agent-phase-one` (2026-08-07), and `all-in-personal-agent` (2026-08-03).
- Deploy note: the rsync step now runs with `--rsync-path="sudo rsync"` (see DECISIONS D10). Without it, a content-adding deploy fails with "Permission denied" because the non-root `henson-admin` cannot write into the `root:www-data` target directory.
- This machine has `core.hooksPath=.githooks`; the knowledge-base sync default is `/Users/admin/henson-knowledge-base` and can still be overridden with `KB_DIR` on another machine.
- If this machine cannot build because `@astrojs/sitemap` is missing from `node_modules`, run `npm install` first.

### Loop Engineering Article TODO

- [x] Build the daily iCloud-to-Xiaohongshu loop and publish its reusable implementation at `hensonzyw-git/social-media-publish-loop`. The public repository excludes runtime state, personal configuration, images, drafts, publication evidence, browser data, and knowledge-base content.
- [ ] Run it on real material several times and record: manual minutes saved per post, human intervention count, duplicate/failed upload rate, and time from `ready` to final review.
- [x] Replace the article's pre-run hypotheses with the first observed result, including the Chrome foreground upload failure, bounded-verifier lesson, one-shot state boundary, and post-publication KB sync. Keep the multi-run metrics explicitly unproven.
- [x] Recheck that no private work data or platform-sensitive information enters the public article. Restaurant identity and spend amount were fuzzed out of the first-run evidence in both languages before publication.
- [x] Review the English draft translation after the Chinese evidence update; `readMins` stays 15. The en file keeps the site-wide `draftTranslation: true` convention.
- [x] Published 2026-07-11 with Henson's explicit approval: removed `draft: true` from both language files, set `date: 2026-07-11`, added the bilingual routes + GATE1 pair + RSS inclusion to AC (65 checks green), verified no mobile overflow, and deployed to ECS.

## Closeout

Update `PROJECT_STATE.md`, `docs/DECISIONS.md`, `docs/PROJECT_LOG.md`, and `docs/HANDOFF.md` when project direction or current state changes.
