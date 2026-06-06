# modern-web-dev-guide

Docusaurus learning guide — modern web development curriculum. Follow `GUIDE-STANDARD.md` for all content changes.

## Commands

- `make setup` — `npm ci`
- `make dev` — Docusaurus dev server (`npm start`)
- `make build` — static site build
- `make test` — `npm run typecheck`

## Rules

- Content must conform to `GUIDE-STANDARD.md` (linear, zero prior knowledge, self-contained)
- Sync `GUIDE-STANDARD.md` identically across guide repos when editing the standard
- Lecture generation scripts live in `scripts/` — use `npm run lectures:dry-run` before bulk generation
- Do not break existing sidebar / doc IDs without updating cross-links
