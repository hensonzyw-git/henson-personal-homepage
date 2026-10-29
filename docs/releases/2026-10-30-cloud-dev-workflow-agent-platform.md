# Cloud workflow and open-platform article release — 2026-10-30

- Authorization: Henson confirmed the local preview and requested publication in this chat. This covers the exact paired content candidate below.
- Source commit: `99abd3be6358180ff5df0f73d456d77db59a3480` (pushed to `origin/main`).
- Source tree: `58e14a9f81b5512043cfd9dfdc670f863eea1b72` for the blog collection.
- Chinese body matches the approved editorial revision ignoring whitespace; two emphasis boundaries are separate paragraphs. English retains `draftTranslation: true`.
- Candidate scope: two Markdown article sources and two route/pair assertions; no runtime/layout/deployment implementation change.

## Validation and deployment

- `npm run build`: 49 pages. `node test/ac-checks.mjs`: 141 passed, 0 failed, including both article routes and independently derived reading times.
- Local browser checks: zh/en at 1280px and 390px, four content headings with valid TOC targets, three emphasized judgments, four experiment items, correct language switching, no horizontal overflow or captured warning/error.
- Pre-release backup: `/var/backups/zhuyawei-pre-cloud-workflow-20261030-99abd3be6358.tar.gz`; archive listing validated, 3,329,665 bytes, SHA256 `bc269b35a110d4d3a4e235559c81880ab0170808244514c4a63094101e7a27d2`.
- Ran `npm run deploy:ecs`; Nginx configuration/reload succeeded. All 97 remote static files match the pre-release candidate by SHA256. The analytics route manifest matches the built manifest and contains both article routes.
- Twelve public URLs return HTTP 200 and match local build bytes: zh/en home, blog index, new article and About pages; `llms.txt`, both RSS feeds, `site-events.js`.
- Four unauthenticated private URLs return HTTP 401: `/analytics/`, `/analytics/data.json`, `/analytics/dashboard.js`, `/analytics/dashboard.css`.
- The source-repo post-commit hook skipped its absent legacy KB path. Explicitly ran the existing `sync:kb` generator against the actual local vault after deployment: 19 Chinese published files, new body and canonical URL verified, non-published KB state preserved. No KB commit/push.
- Raw build/deployment/HTTP/hash logs and manifests are retained locally with this release's evidence bundle. Unrelated pre-existing social/context edits were excluded from release commits.

## Public URLs

- [Chinese](https://zhuyawei.com/blog/cloud-dev-workflow-agent-platform/)
- [English](https://zhuyawei.com/en/blog/cloud-dev-workflow-agent-platform/)

## Rollback reference

Restore the archived static site and analytics route manifest from the verified backup into a separate directory, then restore the site with the repository's existing deployment/rollback procedure and revalidate Nginx and URLs. No rollback was needed for this release.
