---
id: hosting
title: Hosting Platforms
sidebar_position: 16
sidebar_label: Hosting
description: Edge platforms (Vercel, Cloudflare), app platforms (Railway, Fly.io), and cloud providers (AWS, GCP, Azure). When to pick each.
---

# Hosting Platforms

> **In one line:** For new web apps in 2026, the answer is almost always Vercel or Cloudflare. Move to AWS/GCP/Azure only when you've outgrown the platform tier or have a specific cloud-native requirement.

:::tip[In plain English]
"Hosting" is *where your code runs*. The 2026 hosting landscape splits into three tiers, roughly by how much you outsource vs. control:

- **Edge platforms (Vercel, Cloudflare)** — easiest. You push code; they run it globally. Best for new full-stack web apps.
- **App platforms (Railway, Fly.io, Render)** — middle ground. They run your containers / processes; you don't manage servers.
- **Cloud providers (AWS, GCP, Azure)** — most control, most operational burden. You manage the infrastructure. Standard at large companies.
:::

## Edge platforms (most popular for new apps)

| Platform          | Best for                                                          |
|-------------------|-------------------------------------------------------------------|
| **Vercel**         | Best for Next.js. Premium pricing.                                |
| **Cloudflare (Workers + Pages)** | Fastest, cheapest, most global.                       |
| **Netlify**        | Older, solid Jamstack pioneer.                                    |

## App platforms

| Platform          | Best for                                                          |
|-------------------|-------------------------------------------------------------------|
| **Railway**        | Simple, predictable pricing.                                      |
| **Render**         | Similar to Railway.                                                |
| **Fly.io**         | Globally distributed VMs, indie-developer-friendly.               |
| **Heroku**         | Original PaaS, declining but still used.                          |

## Cloud providers

| Provider                | Best for                                                       |
|-------------------------|----------------------------------------------------------------|
| **AWS**                  | Dominant at scale; 200+ services.                              |
| **Google Cloud**         | Cloud Run is excellent.                                        |
| **Azure**                | Dominant in Microsoft-heavy enterprises.                       |
| **DigitalOcean / Linode / Vultr / Hetzner** | Simpler clouds, cheaper, fewer services.    |

## Decision matrix

| Project Type                     | Recommendation                |
|----------------------------------|-------------------------------|
| Next.js indie/startup app        | Vercel                        |
| Need edge globally + low cost    | Cloudflare                    |
| Long-running Node/Python service | Railway / Render / Fly.io     |
| Enterprise scale                 | AWS / GCP / Azure             |
| Want one global server cheaply   | Hetzner / DigitalOcean        |

:::note[Worked example: hosting tier per scale]
| Scale                 | Hosting                              |
|----------------------|--------------------------------------|
| Side project, 1 user  | Vercel free tier or Cloudflare Pages |
| Startup, 1K users     | Vercel Pro or Cloudflare              |
| Startup, 100K users   | Vercel Enterprise, Railway/Fly.io, or moving to AWS |
| Series B, millions    | AWS / GCP / Azure (probably K8s)    |
| FAANG-scale           | Custom internal platform on top of cloud primitives |

Each tier solves a problem the previous one couldn't. Don't jump tiers prematurely — the operational burden grows faster than the value.
:::

:::info[Highlight: vendor lock-in is overrated for early-stage projects]
A common worry: "Vercel locks me in." It does. So does Cloudflare. So does AWS Lambda. So does Postgres-specific SQL.

For early-stage projects, *ship something*. Lock-in is a problem you'll have when you have customers complaining about pricing — which is a *great* problem to have. Most projects fail because they don't ship, not because they got locked into the wrong platform.

If you do hit scaling-cost issues later, the migration from Vercel to AWS is usually a 2–6 week project for a small team. That's a price worth paying for the year of velocity you got on the easier platform.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Jumping straight to AWS / GCP / Azure for a side project.** You'll spend three weekends wiring VPCs and IAM roles instead of building your product. Edge platforms (Vercel, Cloudflare) cover 95% of new projects with one `git push`. Move to a raw cloud only when you've outgrown the platform tier or have a specific compliance/cost reason.
- **Treating "serverless" as identical across platforms.** Vercel functions, Cloudflare Workers, and AWS Lambda all have different runtimes, cold-start behaviors, and limits (Workers cap CPU but not wall clock; Vercel caps wall clock; Lambda has 15-min hard cap). Code that works on one can die on another — read the limits page before porting.
- **Picking edge runtimes for everything.** Edge runtimes are fast and globally distributed, but they're not Node — many npm packages (anything using `fs`, `Buffer` quirks, native bindings) won't run. Use edge for read-heavy, latency-sensitive routes; use a Node runtime for anything that needs the full ecosystem.
- **Refusing to commit to a platform because of "lock-in."** Lock-in is a problem you have when you have customers complaining about pricing — and migration from Vercel to AWS is typically a 2–6 week project. Velocity now > theoretical portability later.
- **Putting your database on the opposite coast from your serverless functions.** A US-East Lambda calling an EU-West Postgres adds 80–100ms of round-trip per query. Co-locate the DB with the primary compute region; use read replicas if you need global reads.
:::

## Page checkpoint

<Quiz id="stack-hosting-page" title="Did hosting stick?" sampleSize={3}>

<Question
  prompt="What's the difference between an edge platform (Vercel, Cloudflare) and a cloud provider (AWS, GCP, Azure) in this page's framing?"
  options={[
    { text: "Edge platforms are paid; cloud providers are free" },
    { text: "Edge platforms run only static sites; cloud providers run everything else" },
    { text: "Edge platforms maximize outsourcing — you push code, they run it globally. Cloud providers give you the most control with the most operational burden" },
    { text: "Edge platforms only support TypeScript; cloud providers support all languages" }
  ]}
  correct={2}
  explanation="The tiers are organized by how much you outsource vs. control. Edge platforms run your code for you on a global network; cloud providers hand you raw infrastructure and expect you to operate it."
  revisit={{ to: "/docs/stack/hosting#edge-platforms-most-popular-for-new-apps", label: "Hosting tiers" }}
/>

<Question
  prompt="Why is vendor lock-in 'overrated for early-stage projects' according to the page?"
  options={[
    { text: "Because lock-in doesn't exist in practice" },
    { text: "Because most projects fail by not shipping, not by getting locked into the wrong platform — and migrating later is a finite, manageable project" },
    { text: "Because all hosting platforms are interchangeable" },
    { text: "Because lock-in is illegal under EU law" }
  ]}
  correct={1}
  explanation="Lock-in is real on every platform, but it's a problem you have when you have customers. Early on, velocity beats portability — migrating Vercel → AWS later is usually a 2–6 week project, not a death sentence."
  revisit={{ to: "/docs/stack/hosting#decision-matrix", label: "Lock-in is overrated early" }}
/>

<Question
  prompt="Which hosting platform is the recommended default for a new Next.js indie or startup app?"
  options={[
    { text: "AWS EKS with custom Kubernetes manifests" },
    { text: "Vercel" },
    { text: "Heroku" },
    { text: "Bare-metal at Hetzner" }
  ]}
  correct={1}
  explanation="Vercel maintains Next.js and ships best-in-class DX for it. For an indie/startup Next.js app, it's the path of least friction — premium pricing, but you get back velocity."
  revisit={{ to: "/docs/stack/hosting#decision-matrix", label: "Decision matrix" }}
/>

<Question
  prompt="Why might a globally-distributed app on a tight budget prefer Cloudflare Workers + Pages over Vercel?"
  options={[
    { text: "Cloudflare runs only on Windows servers" },
    { text: "Cloudflare's edge network tends to be the fastest, cheapest, and most globally distributed option" },
    { text: "Cloudflare is the only platform that supports Next.js" },
    { text: "Cloudflare auto-generates database schemas" }
  ]}
  correct={1}
  explanation="Cloudflare's edge network is famously fast and inexpensive, with global presence. For an app that needs global reach on a budget — and isn't deeply tied to Next.js features — Cloudflare Workers + Pages is the value pick."
  revisit={{ to: "/docs/stack/hosting#edge-platforms-most-popular-for-new-apps", label: "Edge platforms" }}
/>

</Quiz>

## What's next

→ Continue to [DevOps & Infrastructure](./devops) — the tools that run *underneath* hosting platforms (containers, K8s, IaC, secrets).
