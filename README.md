# Modern Web Dev Guide

A comprehensive, beginner-first 2026 guide to how websites and web applications are actually built — with a **concept track** (sidebar order) and a parallel **build track** ([Roadmap](/docs/roadmap) stages). **17 chapters plus a final capstone and glossary**, with **interactive code that runs in your browser**. *Last updated: June 2026.*

> **Live site (canonical):** https://modernwebdevguide.com/

---

## What's in the guide

Seventeen chapters across six parts, plus a whole-guide capstone. The **concept track** follows the sidebar in order (quiz-gated). The **build track** follows Roadmap Part I while looking up Foundations/Stack pages on demand.

| Part | # | Chapter | One-line summary |
|------|---|---------|------------------|
| — | — | [Introduction](docs/00-intro.md) | Start here — two tracks, how to read. |
| **A · Fundamentals** | 1 | [Web Fundamentals](docs/01-foundations/) | HTTP, rendering, APIs, data, auth, deployment, commerce. |
| | 2 | [Production Engineering](docs/01-foundations/concurrency) | Concurrency, production patterns, testing, debugging. |
| | 3 | [Roadmap](docs/02-roadmap/) | Zero-to-shipped curriculum, tier picks, meta-skills. |
| **B · Building blocks** | 4 | [Lifecycle](docs/03-lifecycle/) | Plan → design → build → review → ship → maintain. |
| | 5 | [Tech Stack](docs/04-stack/) | 2026 tools + Advanced companions (TS, React, CSS, APIs, DB). |
| **C · Infrastructure & scale** | 6 | [Cloud Platforms](docs/12-cloud/) | Compute, VPC, IAM, storage, IaC, cost. |
| | 7 | [SRE & Operations](docs/13-operations/) | SLOs, observability, incidents, deploys, chaos. |
| | 8 | [Distributed Systems](docs/14-distributed-systems/) | CAP, replication, consensus, idempotency, streaming. |
| **D · Specializations** | 9 | [AI Integration](docs/10-ai/) | Streaming chat, RAG, agents, safety, evals. |
| | 10 | [Mobile & Ecosystems](docs/15-ecosystems/) | RN, Flutter, PWA, JVM, .NET, Go, Python. |
| **E · Workflows by scale** | 11 | [Solo / Personal](docs/05-solo/) | Side projects, free tiers, ship fast. |
| | 12 | [Startup / Small Co.](docs/06-startup/) | 5–50 people, managed services. |
| | 13 | [Enterprise](docs/07-enterprise/) | Compliance, platform teams, 99.99% uptime. |
| | 14 | [Comparison](docs/08-comparison/) | Solo / startup / enterprise side-by-side. |
| **F · Judgment & growth** | 15 | [Decisions](docs/09-decisions/) | Boring tech, reversibility, cost of inaction. |
| | 16 | [Career](docs/11-career/) | Portfolio, job search, compensation. |
| | 17 | [Final Capstone](docs/99-capstone.md) | Whole-guide assessment (≥ 75% pass bar). |
| | 18 | [Glossary](docs/11-glossary.md) | Every term, plain English. |

> Directory numbers (`12-cloud`, etc.) are historical; chapter order is driven by `sidebars.ts`. URLs strip prefixes (`/docs/cloud`).

---

## Interactive — learn by doing

- **Live JS & React** — editable snippets with instant preview (Roadmap stages).
- **CodeChallenge** — auto-graded functions in a Web Worker (Stage 1, Stage 10, more).
- **SqlPlayground** — in-browser Postgres via [pglite](https://github.com/electric-sql/pglite) (Foundations SQL, Advanced Databases).
- **Sandpack** — multi-file DOM/React/Tailwind sandboxes (Stage 3, Stage 7, Advanced React).

---

## Maintainer scripts

```bash
npm run apply-prereqs      # Regenerate prereqs.ts from docs + sidebars
npm run validate-prereqs   # CI: verify prereqs.ts matches expected
node scripts/write-chapter-pages.mjs  # Regenerate chapterPages.ts + sync guide.ts counts
npm run audit-lessons      # Warn on missing lesson skeleton elements
npm run diff-glossary      # Heuristic glossary gap report
make verify                # prereqs + typecheck + production build
```

---

## Running the site locally

Built with [Docusaurus](https://docusaurus.io). Requires **Node.js 20+**.

```bash
npm install
npm run start    # http://localhost:3000
npm run build
npm run serve
```

---

## Repository layout

```
modern-web-dev-guide/
├── docs/                    # ~290 teaching pages
│   ├── 00-intro.md
│   ├── 01-foundations/      # Ch 1–2 (48 pages + 2 checkpoints)
│   ├── 02-roadmap/          # Ch 3 (36 pages)
│   ├── 99-capstone.md       # Ch 17 — final assessment
│   └── …                    # See sidebars.ts for full order
├── src/components/          # Quiz, CodeChallenge, SqlPlayground, Sandbox
├── scripts/                 # prereqs sync, chapter pages, audits
├── sidebars.ts              # Chapter order (source of truth)
└── GUIDE-STANDARD.md        # Content/pedagogy standard (synced across guides)
```

---

## Deploy

GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. PRs run `test-build.yml`.

---

## License

**© 2026 To Yin Yu. All rights reserved.** This project is **source-available, not open-source**: you're welcome to read it and run it locally to learn, but it may not be copied, redistributed, modified, used commercially, or rebranded without permission. See [LICENSE](LICENSE) for full terms.
