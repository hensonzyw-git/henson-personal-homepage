# Project State — Personal Homepage

Last updated: 2026-09-23

## Current Status

This repo is Henson's personal homepage built with Astro. It is separate from the public GitHub profile repository `hensonzyw-git/hensonzyw-git`.

The site is bilingual with Chinese as default and English mirror routes. It positions Henson as an open-platform PM with AI practice, writing, and side-project evidence.

## Live Release — Private Analytics (2026-09-23)

Henson explicitly authorized deployment after manually configuring an independent account and password. First-party frontend events and the private dashboard are live at `https://zhuyawei.com/analytics/`; the full prefix, including JSON and assets, requires Basic Auth. The local credential file stores only a salted hash; the agent did not read or print it. Nginx writes accepted events to a restricted log and a minute timer produces aggregate JSON; no app backend, database or third-party tracker was added. Build, 101 AC checks, 12 analytics tests, bilingual/mobile Chromium previews and isolated real-Nginx auth/rate-limit tests passed. Production pages and tracker match local build hashes, the ingestion smoke request returned 200, unauthed dashboard/assets/data returned 401, the timer is enabled/active, aggregation fresh, Nginx valid and logrotate debug green. The smoke request used a monitoring User-Agent excluded by the aggregator. Henson confirmed successful browser login with the manually set account and password. The installer was corrected to update both the enabled Nginx configuration copy and the available file after the first run returned 404. See `docs/analytics.md` and D14. The original D14 release was committed and pushed as b542b10.

## Historical Server Traffic — Live D15 (2026-09-23)

The private dashboard now has a separate, one-time aggregate from pre-tracker Nginx access logs. The 87 retained files cover 2026-06-29 through the 2026-09-23 18:47 Asia/Shanghai cutoff, before browser tracking. Cleaning accepts only GET/200 to currently published routes and filters assets/probes, known bots and non-public IPs; output contains no raw IP, UA or URL parameters. Historical page requests and IP-based visitor estimates are not added to browser-event counts. Fifteen analytics tests and 101 site AC checks passed; desktop/mobile private-dashboard layout was checked with local sample data. Live `history.json` is under the existing Basic Auth prefix (unauthenticated 401), readable by Nginx, and its timestamp coverage is before the cutoff. The installer verification was corrected to use the Nginx file-reading identity. See D15 and `docs/analytics.md`.

After Henson reported that the board seemed unchanged, his open authenticated Chrome tab showed the history below the frontend sections. A top-of-page link now displays the historical request count and jumps to the separate history section; the top time-range controls and metrics still describe frontend events only.

## Latest Article — 2026-09-23

`personal-agent-open-source` is published in Chinese and English with Henson's explicit authorization. Content commit `4e8c290` is pushed. The article preserves the author’s motivations, Muse integration experience, hands-on learning, and Memory-first priority, using “自动化开发流程” instead of internal abbreviations. Build and 98 checks passed; both languages checked at 390px and 1280px. ECS deployment and Nginx validation/reload succeeded. Live article pages, RSS feeds and llms.txt match the build. No pending release authorization for this version.

## Source Of Truth

- Repo instructions: `AGENTS.md`
- Overview and run commands: `README.md`
- Design artifacts: `docs/design/`
- Long-term decisions: `docs/DECISIONS.md`
- Milestone log: `docs/PROJECT_LOG.md`
- Next-agent handoff: `docs/HANDOFF.md`

## Latest Release — Personal Agent

Added bilingual `personal-agent` AI project cards and detail pages, linking the public MIT repository. The copy distinguishes historical runtime evidence from public checks, keeps DAL end-to-end acceptance pending, and puts Memory first on the roadmap. Local build and 95/95 AC checks passed; zh/en index and detail pages checked at 390px and 1280px with no horizontal overflow or broken images. Henson authorized publication on 2026-09-23. Content commit `6230d1b` is pushed; ECS deployment passed build, 95 checks and Nginx validation/reload. Both language indexes and detail pages return 200 and match the build byte-for-byte. The published KB mirror is regenerated from source.

## Current Product Shape

- 首页 / About: positioning hook, proof points, latest updates, and navigation hub.
- Writing: long-form AI/product/judgment writing.
- AI Practice / Side Projects: tools, prompts, automation, and the site itself.
- About me: resume-like background, education, and skills.
- Contact: email, LinkedIn, GitHub.
- Newest publication: `astra-computer-use-everything-use` (zh + en, 2026-09-08), deployed after explicit review authorization. It explores agent interfaces and adaptation to human environments, with bounded personal review evidence.
- Preceding publication: `personal-agent-as-my-os` (zh + en, 2026-09-02) — a personal argument that the durable layer should be a user-owned Personal Agent, while coding, browser, and research agents remain replaceable capability providers. It grows out of the unfinished Coding Graph Loop work and makes three boundaries explicit: vendor strategy is Henson's inference rather than a disclosed fact; “supplier” does not mean agents are interchangeable commodities; and capability growth must stay governed, auditable, and reversible. The article explicitly matches `harness-governance-scar-tissue` and `agent-memory-knowledge-base` as related reading. Preceding published content: `harness-governance-scar-tissue` (zh + en, 2026-08-21; revised 2026-08-22), `agent-eval-methodology` (zh + en, 2026-08-16), `personal-agent-phase-one` (zh + en, 2026-08-07), and `all-in-personal-agent` (zh + en, 2026-08-03), alongside `prompt-context-loop-engineering`, `agent-as-service-caller-open-platform`, `mcp-vs-cli-agent-encapsulation`, and `traditional-to-ai-open-platform`.
- The current deployed revision of `personal-agent-as-my-os` visibly separates the ChatGPT response from Henson's prose, keeps the response in one continuous left-bordered block, and adds the conclusion that AI makes it possible to turn ideas into real things.
- GEO / AI discoverability: blog detail pages emit JSON-LD with `BlogPosting`, `Person`, and `BreadcrumbList`, plus truthful publish/modified metadata and related-reading paths. `/llms.txt` is generated from the bilingual blog and AI-practice indexes. Content-detail sitemap entries carry frontmatter-derived `lastmod` values.

## Latest Release — 2026-09-08

- `astra-computer-use-everything-use` is live in zh/en. The approved edits replace DAL with “我的自动开发 loop” and remove the ten-year career introduction. Related reading matches the two open-platform articles cited in the body.
- Shared prose tables retain native sizing within a build-time scroll wrapper (D13), correcting the narrow-layout blank area. Desktop, 820px and 390px browser checks passed.
- Article commit `80b4485` merged via `bb0ad52` and pushed to `origin/main`. Henson explicitly authorized commit/push/merge, ECS deployment and KB persistence after review.
- Knowledge-base sync regenerated 15 published files; the original architecture wiki page now links to the publication, with index and operation-log updates committed as `d782503`.

## Current Boundaries

- Do not publish private work-project material unless explicitly requested.
- Keep career project material private by default; README notes the public site currently does not expose a career project page.
- Avoid adding placeholder-heavy content to public navigation.
- Preserve bilingual content pairing when adding pages or content collections.
- Historical traffic stats still use ECS/Nginx access logs via `npm run stats:traffic`. D14 first-party behavior tracking is live; historical and new-event numbers remain separate.

## Validation State

September 23 Personal Agent release: 95/95 checks passed; `/ai/`, `/en/ai/`, `/ai/personal-agent/` and `/en/ai/personal-agent/` match the local build byte-for-byte. Homepage and llms.txt also return 200.

September 8 deployment passed: 41 static pages, 92/92 acceptance checks, Nginx validation/reload, and HTTP 200 for home, article indexes, both article languages, RSS and llms.txt. Both live article HTML files, both RSS feeds and llms.txt matched local build output byte-for-byte. The generated KB article body matches the Chinese source. No pending release authorization remains for this revision.
