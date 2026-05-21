# Modern Web Dev Guide

A comprehensive, beginner-friendly 2026 guide to how websites and web applications are actually built. ~9,000 lines across **11 chapters plus an introduction**, written so an absolute beginner can follow along while still being useful to working developers. *Last reviewed: May 2026.*

> **Live site:** https://tonyx1998.github.io/modern-web-dev-guide/

---

## What's in the guide

| # | Chapter | One-line summary |
|---|---------|-----------------|
| - | [Introduction](docs/00-intro.md) | Start here. How to read the guide. |
| 1 | [Foundations](docs/01-foundations/) | How the web works (24 focused pages): client/server, HTTP, DNS, browsers, rendering, APIs, databases, auth, deployment. |
| 2 | [Lifecycle](docs/02-lifecycle/) | Every phase a real project moves through (11 focused pages): planning → design → build → review → ship → monitor → maintain. |
| 3 | [Tech Stack](docs/03-stack/) | Every major 2026 tool decoded (19 focused pages): what it does, when to use it, why it exists. |
| 4 | [Solo / Personal](docs/04-personal-website-workflow.md) | Side projects, free tiers, maximum shipping speed. |
| 5 | [Startup / Small Co.](docs/05-small-company-workflow.md) | 5–50 person teams, real customers, managed services. |
| 6 | [Enterprise](docs/06-large-company-workflow.md) | 500+ engineers, microservices, compliance, 99.99% uptime. |
| 7 | [Comparison](docs/07-comparison.md) | Solo / startup / enterprise side-by-side tables. |
| 8 | [Decisions](docs/08-decision-frameworks.md) | How to actually choose technologies — boring tech, reversibility, cost of inaction. |
| 9 | [AI Layer](docs/09-ai-integration.md) | The new layer in modern apps: streaming chat, RAG, function calling, agents. |
| 10 | [Career](docs/10-career-path.md) | Skills, portfolios, specializations, 2026 compensation context. |
| 11 | [Glossary](docs/11-glossary.md) | Every term used in the guide, in plain English. |

---

## Who this is for

- **Absolute beginners** — every chapter opens with a plain-English "Beginner orientation" block. If you've never built a website, start at chapter 1.
- **Working developers joining a startup** — chapters 2, 3, 5, and 8 give you the practical workflow.
- **Enterprise engineers** — chapters 6, 8, and 9 cover the scale-specific concerns.
- **Experienced developers doing a refresh** — chapter 3 and 9 cover what's changed in 2026.

---

## Reading paths

| Goal | Path |
|------|------|
| Build my first website | 1 → 4 → 10 |
| Join a startup | 2 → 3 → 5 → 8 |
| Work at enterprise | 6 → 8 → 9 |
| Refresh existing knowledge | 3 → 9 |
| Choose a stack for a new project | 3 → 8 → (4 or 5 or 6) |

---

## Running the site locally

The website is built with [Docusaurus](https://docusaurus.io). You need Node.js 20+ installed.

```bash
# Install dependencies (one-time)
npm install

# Start the dev server at http://localhost:3000
npm run start

# Build a production bundle (output in build/)
npm run build

# Serve the production build locally
npm run serve
```

The dev server hot-reloads as you edit any file in `docs/`, `src/`, or the config.

---

## Repository layout

```
modern-web-dev-guide/
├── docs/                       # The guide, split into focused per-topic pages
│   ├── 00-intro.md
│   ├── 01-foundations/         # 25 pages: foundations of the web
│   ├── 02-lifecycle/           # 12 pages: development lifecycle phases
│   ├── 03-stack/               # 20 pages: 2026 tech stack tools
│   ├── 04-personal-website-workflow.md
│   ├── ...
│   └── 11-glossary.md
├── src/
│   ├── pages/index.tsx         # Landing page (React)
│   ├── pages/index.module.css  # Landing page styles
│   └── css/custom.css          # Global theme overrides
├── static/img/                 # Logos, favicon, social cards
├── docusaurus.config.ts        # Site configuration
├── sidebars.ts                 # Sidebar structure
├── package.json
└── README.md                   # This file
```

---

## Contributing

Pull requests welcome, especially for:

- Typo / clarity fixes (anywhere)
- New "Beginner orientation" callouts in sections that are still too jargon-heavy
- 2026 tooling updates as the ecosystem moves
- New analogies — concrete analogies are the single most effective way to make a concept stick

Open an issue first for anything larger (structural changes, new chapters).

---

## Deploy

### GitHub Pages (recommended)

1. Push this repo to GitHub.
2. In `docusaurus.config.ts`, replace every `tonyx1998` with your actual username.
3. In repository **Settings → Pages**, set **Source** to `GitHub Actions`.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.
5. Your site lives at `https://tonyx1998.github.io/modern-web-dev-guide/`.

### Vercel / Netlify (alternative)

1. Import the GitHub repo in the Vercel or Netlify dashboard.
2. Framework preset: **Docusaurus**.
3. Build command: `npm run build`. Output directory: `build`.
4. Deploy. Done.

### Custom domain

After deploying, add a `CNAME` file in `static/` containing your domain (e.g., `webdev2026.dev`). Set up DNS at your registrar pointing to GitHub Pages / Vercel / Netlify per their docs, then update `url` and `baseUrl` in `docusaurus.config.ts`.

---

## License

Content licensed CC BY 4.0. Site code licensed MIT.
