# Handoff — Personal Homepage

Start here after `AGENTS.md`.

## Read First

1. `PROJECT_STATE.md`
2. `README.md`
3. `docs/DECISIONS.md`
4. `docs/design/README.md`

## Live Private Analytics — 2026-09-23

Read `docs/analytics.md`. Henson manually configured hidden account/password input (8-character minimum) and explicitly authorized deployment. The account name/hash were passed over SSH stdin; never read or print the local credential file. `https://zhuyawei.com/analytics/` is live with Basic Auth over page, assets and JSON. First-party tracker is served from the main static site. Production verification: zh/en pages and tracker match local build hashes; unauthorized dashboard/assets/data return 401; collector smoke request returned 200; minute timer active with fresh aggregate; Nginx valid and logrotate debug passes. The smoke request used a filtered monitoring User-Agent, so it does not inflate the dashboard. The first installer pass modified sites-available only and yielded 404 because this host has a copied sites-enabled file; installer now updates/backups both and rerun succeeded. Henson confirmed real browser login with his own password; the agent never possessed it. The D14 source was pushed as b542b10. Future site deployments update the analytics route allowlist.

## Live Historical Traffic Backfill — 2026-09-23

The private dashboard now includes a one-time server-log history from 87 retained files, 2026-06-29 to the 2026-09-23 18:47 frontend-tracker cutoff. `ops/analytics/backfill.py` accepts only GET/200 published pages and filters known bots/probes; output contains no raw IP, UA or query. The historical section is separate from minute browser-event data and never sums with it. Fifteen analytics tests, 101 site AC checks and desktop/mobile preview passed. Production `history.json` is protected by Basic Auth (unauthenticated 401), readable by the Nginx group, and its source coverage precedes the cutoff. The first deployment attempt failed only in its final file-read verification because it used the service identity rather than Nginx's file-reading group; the verification command was corrected and passed. See `docs/analytics.md` and D15.

## Latest Article Release — 2026-09-23

`personal-agent-open-source` is live in zh/en, authorized by Henson after Chinese preview. Content commit `4e8c290` is pushed. Build and 98 checks passed; both languages passed mobile/desktop previews. Live article HTML, both RSS feeds and llms.txt match the build. Canonical source is now the paired `src/content/blog` entries; editorial files are historical working material. KB mirror and publication record are synchronized. Future releases follow D12.

## Latest Release — 2026-09-23

Personal Agent is live in the Chinese and English AI indexes and detail pages. Henson explicitly authorized this release. Content commit `6230d1b` is pushed; ECS deployment passed build, 95 checks and Nginx validation/reload. The four AI routes return 200 and match the build byte-for-byte. The generated KB mirror is refreshed. No release authorization remains pending for this version; future releases follow D12.

## Latest Release — 2026-09-08

`astra-computer-use-everything-use` is deployed in zh/en after Henson's explicit authorization. Article commit `80b4485`, merge `bb0ad52`, both pushed. The final text removes DAL and the ten-year introduction; shared table layout was fixed (D13). Build: 41 pages; AC: 92/92. Live article HTML, RSS and llms.txt match the build byte-for-byte. KB sync, source-page publication link, index and log are recorded in KB commit `d782503`. The pre-existing uncommitted KB query-log entry was preserved outside that commit. No release work remains; future changes follow D12.

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
- Historical traffic stats remain server-log based via `npm run stats:traffic`. Henson explicitly changed the frontend-tracking boundary with D14; the first-party candidate is local pending production release approval.
- ECS nginx logrotate keeps 365 days as of 2026-07-12 (was 14; backup at `/etc/logrotate.d/nginx.bak-20260712`). Log history earlier than ~2026-06-28 is permanently lost — launch-to-date totals cannot be reconstructed before that day.
- September 2 publication: `personal-agent-as-my-os`, 2026-09-02 (zh + en; English keeps `draftTranslation: true`). It reframes the unfinished Coding Graph Loop as the production line through which a user-owned Personal Agent can acquire governed capabilities, while coding/browser/research agents remain replaceable providers. The published edit distinguishes Henson's market inference from disclosed vendor strategy, rejects the idea that providers are already commodities, and defines self-extension as versioned, reviewable, testable, human-gated, and reversible. Its explicit related-reading keys are `harness-governance-scar-tissue` and `agent-memory-knowledge-base`. The ChatGPT response is presented as one continuous left-bordered block, separate from Henson's prose. `npm run deploy:ecs` built 39 pages, passed 85 checks, validated/reloaded Nginx, and verified the site routes, RSS, and `/llms.txt` with HTTP 200; desktop and 390px browser checks had no overflow or console errors.
- Preceding published article: `harness-governance-scar-tissue`, substantially rewritten on 2026-08-21 and revised again on 2026-08-22 (zh + en). It relates the actual Finance path to Claude Code, DeepSeek Harness, and Codex Harness/App Server across six responsibilities. Coding Graph Loop material was intentionally reserved for the later standalone direction now introduced by `personal-agent-as-my-os`. Earlier: `agent-eval-methodology` (2026-08-16), `personal-agent-phase-one` (2026-08-07), and `all-in-personal-agent` (2026-08-03).
- Deploy note: the rsync step now runs with `--rsync-path="sudo rsync"` (see DECISIONS D10). Without it, a content-adding deploy fails with "Permission denied" because the non-root `henson-admin` cannot write into the `root:www-data` target directory.
- This machine has `core.hooksPath=.githooks`; the knowledge-base sync default is `/Users/admin/henson-knowledge-base` and can still be overridden with `KB_DIR` on another machine.
- September 2 release gate status: Henson explicitly authorized that revision after local build, acceptance checks, and zh/en desktop/mobile preview. The revision is now deployed; future article releases must follow the same gate before `npm run deploy:ecs`.
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
