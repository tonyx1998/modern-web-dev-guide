# modern-web-dev-guide

Docusaurus learning guide — modern web development curriculum. Follow `GUIDE-STANDARD.md` for all content changes.

## Commands

- `make setup` — `npm ci`
- `make dev` — Docusaurus dev server (`npm start`)
- `make build` — static site build
- `make test` — `npm run typecheck`
- `make verify` — `validate-prereqs` + typecheck + build

## Rules

- Content must conform to `GUIDE-STANDARD.md` (linear, zero prior knowledge, self-contained)
- Sync `GUIDE-STANDARD.md` identically across guide repos when editing the standard
- Lecture generation scripts live in `scripts/` — use `npm run lectures:dry-run` before bulk generation
- Do not break existing sidebar / doc IDs without updating cross-links
- After sidebar or doc order changes: `npm run apply-prereqs` && `node scripts/write-chapter-pages.mjs`

## Folder prefix vs chapter number

Folder numeric prefixes do NOT match reader-facing chapter numbers — `sidebars.ts` is the source of truth.

| Folder | Sidebar chapter |
|--------|-----------------|
| `01-foundations` | 1–2 (Web Fundamentals + Production Engineering) |
| `02-roadmap` | 3 |
| `03-lifecycle` | 4 |
| `04-stack` | 5 |
| `12-cloud` | 6 |
| `13-operations` | 7 |
| `14-distributed-systems` | 8 |
| `10-ai` | 9 |
| `15-ecosystems` | 10 |
| `05-solo` | 11 |
| `06-startup` | 12 |
| `07-enterprise` | 13 |
| `08-comparison` | 14 |
| `09-decisions` | 15 |
| `11-career` | 16 |
| `99-capstone.md` | 17 |
| `11-glossary.md` | 18 |

When writing "Chapter N" in prose, use the sidebar number, not the folder prefix.
