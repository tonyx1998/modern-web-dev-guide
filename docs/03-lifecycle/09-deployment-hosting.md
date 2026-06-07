---
id: deployment-hosting
title: 'Phase 10: Deployment & Hosting'
sidebar_position: 10
sidebar_label: 9. Deployment & Hosting
description: Get your code running on the public internet, reliably. Hosting categories, environments, and database migration patterns.
---

# Phase 10: Deployment & Hosting

> **In one line:** Run your code on a computer your users can reach. Modern hosting platforms make this trivial; the trick is picking the right category for your needs.

:::tip[In plain English]
"Deployment" is the act of putting your code somewhere users can reach it on the internet. "Hosting" is the *where* — the company that runs your servers (or pretends to, abstracting them away). For a beginner in 2026, this is dramatically easier than it was 10 years ago: you can deploy a real site with a real URL in 30 seconds by typing `git push`.
:::

## Hosting categories

**Edge platforms** (most popular for new web apps in 2026):

- Vercel, Cloudflare Pages, Netlify
- **Pros:** Deploy from Git, global CDN, serverless functions, free SSL, instant preview URLs per PR.
- **Cons:** Vendor lock-in (somewhat), edge runtime constraints, costs scale with traffic.

**App platforms (PaaS):**

- Railway, Render, Fly.io, Heroku
- **Pros:** Push code, they handle the infrastructure. Long-running processes welcome.
- **Cons:** Less global edge presence; usually pay for compute, not requests.

**Container platforms:**

- AWS ECS, Google Cloud Run, Azure Container Apps
- **Pros:** You provide a Docker image; they run it; scale-to-zero options.
- **Cons:** More setup than PaaS; less integrated DX.

**Kubernetes:**

- Self-managed or via EKS/GKE/AKS
- **Pros:** Full flexibility, dominant at scale, portable across clouds.
- **Cons:** Operational complexity; overkill for small teams.

**Raw cloud (VMs):**

- EC2, Compute Engine, DigitalOcean Droplets
- **Pros:** Maximum control.
- **Cons:** You manage everything. Rare for new projects.

:::info[Highlight: the right hosting choice for your scale]
- **Solo / personal project:** Vercel, Netlify, or Cloudflare Pages free tier. **You're done.**
- **Startup, 1K–100K users:** Same as above, or Railway/Fly.io for long-running backends.
- **Mid-stage company, real revenue:** AWS ECS, Cloud Run, or Vercel Pro/Enterprise.
- **Large enterprise:** Kubernetes (often a custom internal platform).

The mistake new developers make is jumping straight to Kubernetes because it sounds professional. **It's not — for almost any team under ~50 engineers, it's a massive operational tax.**
:::

## Environments

A typical setup:

- **Local** — Your laptop.
- **Preview** — Per-PR ephemeral deployments (Vercel does this automatically).
- **Staging** — Production-like environment for final testing.
- **Production** — The real thing.

Smaller projects often skip staging. Larger projects add more environments (dev, qa, perf, canary).

:::note[Worked example: preview deployments are magic]
When you open a PR on a Vercel-hosted Next.js project, Vercel automatically:

1. Builds the PR's code.
2. Deploys it to a unique URL like `my-app-git-feature-abc.vercel.app`.
3. Comments on the PR with the link.

You can share that URL with your designer, your manager, your QA team — they see your changes live, in a real environment, *before merging*. This single feature is one of the biggest reasons Vercel won the developer market in 2020-2026.

GitHub Pages can do similar via `gh-pages` branch + Actions. Cloudflare Pages and Netlify offer the same.
:::

## Database migrations

Schema changes are deployment hazards. A migration that fails halfway can corrupt your DB.

Three patterns:

- **Backward-compatible migrations** — Add new columns/tables; old code keeps working. Add code to use them in a later deploy.
- **Two-phase migrations** — Add new schema → migrate code to use it → drop old schema.
- **Reversible migrations** — Every migration has a `down` script for rollback.

Tools: **Drizzle Kit**, **Prisma Migrate**, **Flyway**, **Liquibase**.

## A safe deploy checklist

Before pushing to production:

- [ ] CI is green
- [ ] Tests cover the change
- [ ] Migration (if any) is backward-compatible
- [ ] Feature flag is set up (if rolling out gradually)
- [ ] Rollback plan exists ("revert the commit; flag off")
- [ ] Monitoring is in place ("we'll see if this breaks")
- [ ] It's not Friday afternoon

:::info[Highlight: the unwritten rule about Friday deploys]
There's a folk wisdom: **don't deploy on Fridays.** It's only half a joke. If you deploy a risky change at 4pm Friday and it breaks, you're working the weekend. If you wait until Monday morning, you have a fresh week to fix it.

Modern continuous-deployment teams break this rule routinely *because their rollback story is great*. If you can roll back in 60 seconds, Friday deploys are fine. If a rollback takes hours, save the risky deploys for Monday.
:::

## Common anti-patterns

- **Pushing to prod on Fridays:** If something breaks, you're working the weekend.
- **No rollback plan:** When (not if) deployment fails, what do you do?
- **No staging for big changes:** Direct-to-prod for risky changes.
- **Untested migrations:** Run on production data without testing on a copy first.

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking the hosting tier the conference talk used.** Watching Netflix engineers talk about multi-region Kubernetes and choosing the same for your 200-MAU side project means weeks of yak-shaving instead of features. Match hosting complexity to *your* scale, not to someone else's case study.
- **Forgetting that "serverless" is not free.** Edge functions look like they cost nothing — until a runaway loop, a noisy bot, or an infinite-redirect bug racks up six figures of invocations over a weekend. Set spending caps and rate limits before launch, not after the first bill.
- **Running migrations as part of the same deploy as the code that uses them.** If the migration finishes but the code deploy fails (or vice versa), prod is broken in a weird, partial way. Decouple: deploy backward-compatible schema first, then deploy code, then deploy a follow-up to drop old columns.
- **Treating "preview deploys passed" as full QA.** Preview URLs use seeded dev data, often a smaller DB, and no production secrets. They prove the build works — they don't prove your change handles real traffic, real auth, or real data volume.
- **Not testing the rollback.** Teams write "rollback plan: revert the commit" in the runbook and never try it. When you actually need it at 3am, you discover the rollback breaks because of a one-way migration. Practice rollback in staging before you need it in prod.
:::

## Page checkpoint

<Quiz id="lifecycle-deployment-hosting-page" title="Did deployment & hosting stick?" sampleSize={2}>

<Question
  prompt="A solo developer wants to host a Next.js side project. Which hosting category does the page recommend?"
  options={[
    { text: "Self-managed Kubernetes on bare metal" },
    { text: "An edge platform like Vercel, Netlify, or Cloudflare Pages on the free tier" },
    { text: "Raw EC2 VMs with manual SSH deploys" },
    { text: "A self-hosted Jenkins on a Raspberry Pi" }
  ]}
  correct={1}
  explanation="Edge platforms give you Git-driven deploys, global CDN, preview URLs, and free SSL out of the box. Reaching for Kubernetes 'because it sounds professional' is one of the most common over-engineering mistakes."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#hosting-categories", label: "Hosting choice for your scale" }}
/>

<Question
  prompt="What's so valuable about per-PR preview deployments?"
  options={[
    { text: "They replace the need for unit tests" },
    { text: "Designers, managers, and QA can see your changes live in a real environment before merging" },
    { text: "They make CI run faster" },
    { text: "They automatically fix accessibility issues" }
  ]}
  correct={1}
  explanation="A live URL per PR turns reviews into 'click and see' instead of 'imagine and approve'. The page calls this one of the biggest reasons Vercel won the developer market."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#environments", label: "Preview deployments are magic" }}
/>

<Question
  prompt="What's a backward-compatible database migration?"
  options={[
    { text: "A migration that only runs on weekends" },
    { text: "A migration that adds new columns or tables without breaking the old code still running in production" },
    { text: "A migration written in an older SQL dialect" },
    { text: "A migration that automatically rolls back if anything fails" }
  ]}
  correct={1}
  explanation="Backward-compatible migrations let old and new code coexist during the deploy. You add schema first, ship code that uses it later — so a partial rollout never breaks production."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#database-migrations", label: "Database migrations" }}
/>

<Question
  prompt="The folk wisdom 'don't deploy on Fridays' is more nuanced on this page. When can a team safely break it?"
  options={[
    { text: "Never — Friday deploys are universally banned" },
    { text: "When their rollback story is great — if they can roll back in 60 seconds, Friday deploys are fine" },
    { text: "Whenever they want — the rule is a myth" },
    { text: "Only if a senior engineer approves in person" }
  ]}
  correct={1}
  explanation="The rule isn't about Fridays — it's about how long you'll spend fixing a broken deploy. With fast, reliable rollback, the day of the week stops mattering."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#a-safe-deploy-checklist", label: "The Friday-deploy rule" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 11: Observability](./observability) where we add the eyes and ears that tell us how the deployed system is actually behaving.
