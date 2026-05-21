---
id: hosting
title: Hosting Platforms
sidebar_position: 16
sidebar_label: 15. Hosting
description: Edge platforms (Vercel, Cloudflare), app platforms (Railway, Fly.io), and cloud providers (AWS, GCP, Azure). When to pick each.
---

# Hosting Platforms

> **In one line:** For new web apps in 2026, the answer is almost always Vercel or Cloudflare. Move to AWS/GCP/Azure only when you've outgrown the platform tier or have a specific cloud-native requirement.

:::tip In plain English
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

:::note Worked example: hosting tier per scale
| Scale                 | Hosting                              |
|----------------------|--------------------------------------|
| Side project, 1 user  | Vercel free tier or Cloudflare Pages |
| Startup, 1K users     | Vercel Pro or Cloudflare              |
| Startup, 100K users   | Vercel Enterprise, Railway/Fly.io, or moving to AWS |
| Series B, millions    | AWS / GCP / Azure (probably K8s)    |
| FAANG-scale           | Custom internal platform on top of cloud primitives |

Each tier solves a problem the previous one couldn't. Don't jump tiers prematurely — the operational burden grows faster than the value.
:::

:::info Highlight: vendor lock-in is overrated for early-stage projects
A common worry: "Vercel locks me in." It does. So does Cloudflare. So does AWS Lambda. So does Postgres-specific SQL.

For early-stage projects, *ship something*. Lock-in is a problem you'll have when you have customers complaining about pricing — which is a *great* problem to have. Most projects fail because they don't ship, not because they got locked into the wrong platform.

If you do hit scaling-cost issues later, the migration from Vercel to AWS is usually a 2–6 week project for a small team. That's a price worth paying for the year of velocity you got on the easier platform.
:::

## What's next

→ Continue to [DevOps & Infrastructure](./devops) — the tools that run *underneath* hosting platforms (containers, K8s, IaC, secrets).
