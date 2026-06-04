# Modern Web Dev Guide

A comprehensive, beginner-first 2026 guide to how websites and web applications are actually built — written to be read **top to bottom**, taking you from complete beginner to genuinely knowing what you're doing. **16 chapters plus an introduction**, grouped into six parts, with **interactive code that runs in your browser** so you learn by doing. *Last updated: June 2026.*

> **Live site:** https://tonyx1998.github.io/modern-web-dev-guide/

---

## What's in the guide

Sixteen chapters across six parts. It's designed to be read **in order** — every term is explained where it first appears, and each chapter builds on the ones before it. There are no "pick your path" tabs; the path is top to bottom.

| Part | # | Chapter | One-line summary |
|------|---|---------|------------------|
| — | — | [Introduction](docs/00-intro.md) | Start here — how to read the guide. |
| **A · Fundamentals** | 1 | [Foundations](docs/01-foundations/) | How the web works: client/server, HTTP, DNS, browsers, rendering, APIs, databases, auth, deployment. |
| | 2 | [Roadmap](docs/02-roadmap/) | Zero-to-shipped curriculum, the 2026 stack as Tier 1/2/3 picks, senior "beyond the stack" skills, and learning meta-skills. |
| **B · Building blocks** | 3 | [Lifecycle](docs/03-lifecycle/) | Every phase a real project moves through: plan → design → build → review → ship → monitor → maintain. |
| | 4 | [Tech Stack](docs/04-stack/) | Every major 2026 tool decoded — plus **Advanced** companion pages for TypeScript, React, CSS, APIs, and Databases. |
| **C · Infrastructure & scale** | 5 | [Cloud Platforms](docs/12-cloud/) | AWS/GCP/Azure: compute, VPC networking, IAM, storage, managed data, Infrastructure-as-Code, cost. |
| | 6 | [SRE & Operations](docs/13-operations/) | SLOs & error budgets, observability, reliability patterns, incidents, safe deploys, capacity, chaos. |
| | 7 | [Distributed Systems](docs/14-distributed-systems/) | Consistency & CAP, replication, partitioning, consensus, sagas, idempotency, event streaming. |
| **D · Specializations** | 8 | [AI Integration](docs/10-ai/) | The AI layer: streaming chat, RAG, function calling, agents, and operating it in production. |
| | 9 | [Mobile & Other Ecosystems](docs/15-ecosystems/) | Native vs React Native vs Flutter vs PWA; the JVM, .NET, Go, and Python backend ecosystems. |
| **E · Workflows by scale** | 10 | [Solo / Personal](docs/05-solo/) | Side projects, free tiers, maximum shipping speed. |
| | 11 | [Startup / Small Co.](docs/06-startup/) | 5–50 person teams, real customers, managed services. |
| | 12 | [Enterprise](docs/07-enterprise/) | 500+ engineers, microservices, compliance, 99.99% uptime. |
| | 13 | [Comparison](docs/08-comparison/) | Solo / startup / enterprise side-by-side. |
| **F · Judgment & growth** | 14 | [Decisions](docs/09-decisions/) | How to actually choose technologies — boring tech, reversibility, cost of inaction. |
| | 15 | [Career](docs/11-career/) | Skills, portfolios, specializations, 2026 compensation context. |
| | 16 | [Glossary](docs/11-glossary.md) | Every term used in the guide, in plain English. |

> Directory numbers (`12-cloud`, etc.) are historical; chapter order and numbering are driven by the sidebar, and URLs strip the prefixes (`/docs/cloud`).

---

## Interactive — learn by doing

Several pages run real code **in your browser, with no setup**:

- **Live, editable JS & React snippets** — change the code and watch the output/preview update instantly (Stage 1 JavaScript, Stage 6 React).
- **Auto-graded coding challenges** — write a function, click *Run*, and get pass/fail against real tests. Runs in a sandboxed Web Worker (with a timeout, so an infinite loop can't freeze the tab); includes a hint and a reveal-able solution.
- **A live SQL playground** — a real PostgreSQL database via [pglite](https://github.com/electric-sql/pglite) (WASM). On *Advanced Databases* you can run `EXPLAIN ANALYZE`, add an index, and watch the query plan flip from a Seq Scan to an Index Scan.
- **Sandpack sandboxes** — multi-file React / raw-DOM / Tailwind examples with a live preview (Stage 3, Stage 7, Advanced React).

---

## The beginner → expert pattern

The guide assumes **no prior experience** and teaches each topic in full on-site — you're not sent elsewhere to learn. Where a topic has more depth, a beginner on-ramp links to an **advanced companion** (and back) via a "→ Going deeper" pointer:

| Topic | Beginner on-ramp | Advanced companion |
|-------|------------------|--------------------|
| TypeScript | Roadmap Stage 5 | Tech Stack → Advanced TypeScript |
| React | Tech Stack → Frontend Frameworks | Tech Stack → Advanced React |
| CSS | Tech Stack → Styling | Tech Stack → Advanced CSS |
| APIs | Tech Stack → APIs | Tech Stack → Advanced API Design |
| SQL / Databases | Tech Stack → Databases | Tech Stack → Advanced Databases |
| Testing · Git · Performance · Security | Foundations / Roadmap basics | Roadmap → Part III "Beyond the Stack" |

External links are reserved for tool installs and (in the absolute-beginner stages) recommended free practice courses — always as optional "Going deeper," never in place of the explanation.

---

## Running the site locally

Built with [Docusaurus](https://docusaurus.io). Requires **Node.js 20+**.

```bash
# Install dependencies (one-time). An .npmrc sets legacy-peer-deps for React 19.
npm install

# Start the dev server at http://localhost:3000
npm run start

# Build a production bundle (output in build/)
npm run build

# Serve the production build locally
npm run serve
```

The dev server hot-reloads as you edit `docs/`, `src/`, or the config. (Note: adding a new theme/plugin or a swizzled component requires a server restart.)

---

## Repository layout

```
modern-web-dev-guide/
├── docs/                          # The guide, split into focused per-topic pages
│   ├── 00-intro.md
│   ├── 01-foundations/            # How the web works (~25 pages)
│   ├── 02-roadmap/                # Progression: stages, tiers, "beyond the stack", meta-skills
│   ├── 03-lifecycle/              # Development lifecycle phases
│   ├── 04-stack/                  # 2026 tech stack + Advanced companion pages (01b/02b/03b/08b/09b)
│   ├── 05-solo/  06-startup/  07-enterprise/  08-comparison/
│   ├── 09-decisions/  10-ai/  11-career/  11-glossary.md
│   ├── 12-cloud/                  # Cloud Platforms (chapter 5)
│   ├── 13-operations/             # SRE & Operations (chapter 6)
│   ├── 14-distributed-systems/    # Distributed Systems (chapter 7)
│   └── 15-ecosystems/             # Mobile & Other Ecosystems (chapter 9)
├── src/
│   ├── components/
│   │   ├── Quiz/                  # Checkpoint quizzes (MCQ, randomized banks)
│   │   ├── CodeChallenge/         # Auto-graded coding exercises (Web Worker)
│   │   ├── SqlPlayground/         # In-browser Postgres (pglite/WASM)
│   │   └── Sandbox/               # Sandpack multi-file/preview
│   ├── theme/
│   │   ├── MDXComponents.tsx      # Global MDX component registry
│   │   └── ReactLiveScope/        # Scope for live ```jsx live code blocks
│   ├── pages/index.tsx            # Landing page
│   └── css/custom.css             # Global theme overrides
├── static/img/                    # Logos, favicon, social cards
├── .github/workflows/             # test-build.yml (PRs) + deploy.yml (Pages)
├── docusaurus.config.ts           # Site configuration
├── sidebars.ts                    # Chapter order + sidebar structure
├── .npmrc                         # legacy-peer-deps=true (React 19 peers)
├── package.json
└── README.md                      # This file
```

---

## Contributing

This guide is **maintained by the repo owner** and not currently open to general contributions, to keep voice, tone, and accuracy consistent.

If you spot a clear factual error or a broken link, **open a GitHub issue**. Please don't open pull requests without first opening an issue and getting a maintainer ack. Forks for personal use are welcome under the licenses below.

---

## Deploy

### GitHub Pages (current setup)

The repo deploys automatically: `.github/workflows/deploy.yml` runs on every push to `main` (build with `npm ci` + `npm run build`, then `actions/deploy-pages`). In **Settings → Pages**, the source is **GitHub Actions**. PRs run `.github/workflows/test-build.yml` (build only, no deploy). The site lives at `https://tonyx1998.github.io/modern-web-dev-guide/`.

To deploy your own fork: replace `tonyx1998` in `docusaurus.config.ts`, set **Settings → Pages → Source** to *GitHub Actions*, and push to `main`.

### Vercel / Netlify (alternative)

Import the repo, framework preset **Docusaurus**, build command `npm run build`, output directory `build`.

### Custom domain

Add a `CNAME` file in `static/` containing your domain, point DNS at GitHub Pages, and update `url`/`baseUrl` in `docusaurus.config.ts`.

---

## License

Content licensed **CC BY 4.0**. Site code licensed **MIT**.
