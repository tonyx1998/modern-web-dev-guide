# Modern Web Dev Guide

A comprehensive, beginner-friendly 2026 guide to how websites and web applications are actually built, paired with a step-by-step roadmap for getting there from zero. **12 chapters plus an introduction**, written so an absolute beginner can follow along while still being useful to working developers. *Last reviewed: May 2026.*

> **Live site:** https://tonyx1998.github.io/modern-web-dev-guide/

---

## What's in the guide

| # | Chapter | One-line summary |
|---|---------|-----------------|
| - | [Introduction](docs/00-intro.md) | Start here. How to read the guide. |
| 1 | [Foundations](docs/01-foundations/) | How the web works (24 focused pages): client/server, HTTP, DNS, browsers, rendering, APIs, databases, auth, deployment. |
| 2 | [Roadmap](docs/02-roadmap/) | The progression view: 13-stage curriculum from zero, the 2026 stack as Tier 1/2/3 picks, fundamentals beyond the stack, meta-skills of learning. |
| 3 | [Lifecycle](docs/03-lifecycle/) | Every phase a real project moves through (11 focused pages): planning → design → build → review → ship → monitor → maintain. |
| 4 | [Tech Stack](docs/04-stack/) | Every major 2026 tool decoded (19 focused pages): what it does, when to use it, why it exists. |
| 5 | [Solo / Personal](docs/05-solo/) | Side projects, free tiers, maximum shipping speed. |
| 6 | [Startup / Small Co.](docs/06-startup/) | 5–50 person teams, real customers, managed services. |
| 7 | [Enterprise](docs/07-enterprise/) | 500+ engineers, microservices, compliance, 99.99% uptime. |
| 8 | [Comparison](docs/08-comparison/) | Solo / startup / enterprise side-by-side tables. |
| 9 | [Decisions](docs/09-decisions/) | How to actually choose technologies — boring tech, reversibility, cost of inaction. |
| 10 | [AI Layer](docs/10-ai/) | The new layer in modern apps: streaming chat, RAG, function calling, agents. |
| 11 | [Career](docs/11-career/) | Skills, portfolios, specializations, 2026 compensation context. |
| 12 | [Glossary](docs/11-glossary.md) | Every term used in the guide, in plain English. |

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
| Build my first website | 1 → 2 (Roadmap Part I) → 5 → 11 |
| Join a startup | 3 → 4 → 2 (Roadmap Part II) → 6 → 9 |
| Work at enterprise | 7 → 9 → 10 |
| Refresh existing knowledge | 2 (Roadmap Part II Trends) → 4 → 10 |
| Choose a stack for a new project | 4 → 2 (Roadmap Tier 1) → 9 → (5 or 6 or 7) |
| Level up from junior to mid | 2 (Roadmap Part III) → 9 |

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
│   ├── 02-roadmap/             # ~30 pages: progression view — stages, tiers, fundamentals, meta-skills
│   ├── 03-lifecycle/           # 12 pages: development lifecycle phases
│   ├── 04-stack/               # 20 pages: 2026 tech stack tools
│   ├── 05-solo/                # solo / personal workflow
│   ├── 06-startup/             # startup workflow
│   ├── 07-enterprise/          # enterprise workflow
│   ├── 08-comparison/
│   ├── 09-decisions/
│   ├── 10-ai/
│   ├── 11-career/
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

This guide is **maintained by the repo owner** and not currently open to general contributions. The intent is to keep voice, tone, and accuracy consistent — drive-by edits make that hard.

If you spot a clear factual error or a broken link, **open a GitHub issue** describing what you found. Issues will be reviewed and incorporated as appropriate; please don't open pull requests without first opening an issue and getting a maintainer ack.

Forks for personal use are welcome under the licenses below — just don't expect upstream pull requests to be merged without prior discussion.

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
