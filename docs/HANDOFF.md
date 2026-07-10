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
- Basic traffic stats are server-log based via `npm run stats:traffic`; do not add a frontend analytics script unless that boundary is explicitly changed.
- Current newest article: `agent-as-service-caller-open-platform` is published in zh/en draft mirror, revised to reduce repetition and add a simulated pending-action flow, and covered by AC route checks.
- If this machine cannot build because `@astrojs/sitemap` is missing from `node_modules`, run `npm install` first.

## Closeout

Update `PROJECT_STATE.md`, `docs/DECISIONS.md`, `docs/PROJECT_LOG.md`, and `docs/HANDOFF.md` when project direction or current state changes.
