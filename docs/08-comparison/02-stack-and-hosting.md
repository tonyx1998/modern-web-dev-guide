---
id: stack-and-hosting
title: Stack, Architecture, and Hosting
sidebar_position: 3
sidebar_label: 2. Stack & Hosting
description: Languages, frameworks, databases, hosting, and infrastructure compared across solo / small / large company scales.
---

# Stack, Architecture, and Hosting

> **In one line:** A solo dev runs one Next.js app on Vercel free tier; a startup runs a modular monolith plus a few SaaS pieces; an enterprise runs hundreds of polyglot services on self-managed Kubernetes across multiple regions.

:::tip[In plain English]
You can predict an org's scale from a one-minute look at its stack diagram. One service + managed DB + free CDN = solo. Modular monolith + a few SaaS pieces (Clerk, Resend, PostHog) = startup. Microservices + service mesh + multi-region Kubernetes + custom CDN = enterprise.

Each step adds capability and cost. The question is never "which is best?" — it's "which is right for your scale?"
:::

## Stack and Architecture

| Layer              | Personal              | Small Company             | Large Company                    |
|--------------------|-----------------------|---------------------------|----------------------------------|
| **Architecture**   | Monolith              | Modular monolith          | Microservices / SOA              |
| **Language**       | TypeScript            | TypeScript (mostly)       | Polyglot (TS, Python, Go, Java, Rust, etc.) |
| **Frontend**       | Next.js or Astro      | Next.js                   | Custom frameworks + design system + micro-frontends |
| **Backend**        | Next.js Server Actions | Next.js + tRPC or Hono   | Many services in various languages |
| **API style**      | Server Actions        | tRPC / REST               | gRPC internal + REST/GraphQL external |
| **Database**       | Free Postgres tier    | Managed Postgres ($25–500/mo) | Sharded Postgres / Spanner / DynamoDB / multiple |
| **Cache**          | None                  | Redis (Upstash) when needed | Distributed cache fleet         |
| **Queue/jobs**     | Vercel cron + ad hoc  | Trigger.dev / Inngest     | Kafka + dedicated job platform   |
| **Auth**           | Clerk / Better Auth   | Clerk / Auth0             | Custom + Okta/WorkOS for SSO     |
| **Email**          | Resend                | Resend / Postmark         | AWS SES at scale + ESP for marketing |
| **Files**          | Cloudflare R2         | R2 / S3                   | S3 + custom CDN                  |
| **Search**         | Postgres FTS          | Typesense / Meilisearch   | Elasticsearch cluster (or custom)|
| **Observability**  | Sentry + Vercel       | Sentry + PostHog + Better Stack | Datadog / Honeycomb + custom |
| **Payments**       | Stripe                | Stripe                    | Stripe + custom + multi-PSP      |
| **Feature flags**  | None                  | PostHog / Statsig         | LaunchDarkly / Statsig / custom  |

A handful of patterns hold across every row:

- **Solo** uses managed services and free tiers; the goal is to spend zero on infrastructure and zero engineering hours on plumbing.
- **Small company** is mostly SaaS-glued-together; the goal is to never operate anything you can rent.
- **Large company** runs internal versions of most of the above, customized for scale and compliance.

For the deep dive on enterprise architecture, see [Phase 3: Architecture](/docs/enterprise/architecture).

## Hosting and Infrastructure

| Aspect                 | Personal           | Small Company             | Large Company                  |
|------------------------|--------------------|--------------------------|---------------------------------|
| **Hosting**            | Vercel free tier   | Vercel Pro / Railway      | Self-managed K8s on AWS/GCP/Azure |
| **Compute model**      | Serverless         | Serverless or containers  | Kubernetes (often)              |
| **Multi-region**       | No                 | Single region usually     | Multi-region active-active      |
| **Multi-AZ**           | N/A                | Provider handles it       | Mandatory                       |
| **CDN**                | Vercel built-in    | Vercel / Cloudflare       | Multiple CDNs (Cloudflare + Akamai + ...) |
| **DNS**                | Vercel / Cloudflare| Cloudflare                | Route 53 / custom               |
| **Load balancer**      | N/A                | Provider-managed          | Custom + Envoy / NGINX          |
| **Service mesh**       | None               | None                      | Istio / Linkerd                 |
| **IaC**                | None (manual)      | Light Terraform           | Comprehensive Terraform/Pulumi  |
| **Secrets**            | .env + Vercel UI   | Doppler / 1Password       | HashiCorp Vault / cloud-native  |

:::info[Highlight: Kubernetes is not a startup tool]
The single most common stack mistake at small companies is adopting Kubernetes too early. Kubernetes is a fantastic answer to problems you have at 200+ engineers and 50+ services. At 5 engineers and 1 service, it's a permanent tax on every deploy.

The 2026 startup default is: Vercel/Render/Fly/Railway until you actually outgrow them. Most teams never need anything else.
:::

:::note[Worked example: same product, three stacks]
Imagine three versions of a small SaaS app — say, a project-management tool — at different scales:

- **Solo founder:** Next.js + Postgres on Neon + Clerk + Stripe + Resend, all on Vercel. Total monthly bill: under $50. Architecture diagram fits on a napkin.
- **30-engineer startup:** Same Next.js app, now a modular monolith. Postgres on Supabase or RDS. Redis for sessions. PostHog for analytics. Trigger.dev for background jobs. Total monthly bill: ~$2K.
- **2,000-engineer enterprise:** Custom React frontend + design system + module federation across teams. Dozens of backend services (Go, Java, Python). Postgres sharded by tenant. Kafka for events. Custom auth + Okta SSO. Total monthly bill: ~$5M.

Same *product*, radically different *stack*. Each is correct for its scale; copying either of the others would be a mistake.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Copying a FAANG architecture diagram into a 5-person startup.** Microservices, service mesh, multi-region active-active, Kafka — none of that pays off until you have the team to run it. At your scale a single Next.js app on Vercel will outship the "proper" architecture every time.
- **Treating "modular monolith" as a stepping stone you must outgrow.** Most products that reach $100M ARR are still modular monoliths. Plan to stay there. Splitting into services should be triggered by a concrete problem (team boundaries, scaling hot paths) — not by hitting an arbitrary revenue or headcount milestone.
- **Reading the polyglot enterprise column as aspirational.** Five languages in your stack is a *cost* large companies absorb because they can't agree on one, not a feature. At small scale, TypeScript end-to-end is a competitive advantage — guard it.
- **Self-hosting to "save money" before counting engineering hours.** A solo dev moving off Vercel to a $5 VPS saves $15/month and burns a weekend every quarter on patches and incidents. Until your hosting bill is a meaningful slice of payroll, managed wins. (See the Economics page.)
- **Picking tools from the enterprise column for resume credibility.** Running Kubernetes, Kafka, and Istio on a 3-service product won't impress a serious interviewer — it'll raise flags about judgment. Use the tool that fits the problem and explain *why* in the interview.
:::

## Page checkpoint

<Quiz id="comparison-stack-and-hosting-page" title="Did stack and hosting across scales stick?" sampleSize={2}>

<Question
  prompt="What architectural pattern is typical at each of the three scales?"
  options={[
    { text: "Microservices everywhere — only the language changes by scale" },
    { text: "Monolith for solo, modular monolith for startups, microservices/SOA for enterprise" },
    { text: "Serverless everywhere, with self-hosted databases at every scale" },
    { text: "Modular monolith for solo, microservices for startups, monolith for enterprise" }
  ]}
  correct={1}
  explanation="Solo runs a monolith, startups run a modular monolith plus a few SaaS pieces, and enterprises run microservices or SOA across many languages and teams. Each is correct for its scale."
  revisit={{ to: "/docs/comparison/stack-and-hosting#stack-and-architecture", label: "Stack and Architecture" }}
/>

<Question
  prompt="Why is Kubernetes called out as 'not a startup tool'?"
  options={[
    { text: "It is too expensive to license for small companies" },
    { text: "It cannot run TypeScript apps reliably" },
    { text: "It solves problems you have at 200+ engineers and 50+ services — at 5 engineers it is a permanent tax on every deploy" },
    { text: "It does not support multi-region deployments" }
  ]}
  correct={2}
  explanation="Kubernetes is a great answer to problems you have at 200+ engineers and 50+ services. At a 5-engineer single-service startup it becomes a permanent operational tax — Vercel/Render/Fly/Railway is the better default."
  revisit={{ to: "/docs/comparison/stack-and-hosting#hosting-and-infrastructure", label: "Kubernetes is not a startup tool" }}
/>

<Question
  prompt="What is the dominant strategy a small company uses for its stack?"
  options={[
    { text: "Self-host everything to keep monthly costs as low as possible" },
    { text: "Glue SaaS services together — never operate anything you can rent" },
    { text: "Build custom internal versions of every component" },
    { text: "Adopt Kubernetes early so it is ready when the company grows" }
  ]}
  correct={1}
  explanation="Small companies are mostly SaaS-glued-together; the goal is to never operate anything you can rent. Solo focuses on free tiers and zero plumbing, and large companies build internal versions of most things for scale and compliance."
  revisit={{ to: "/docs/comparison/stack-and-hosting#stack-and-architecture", label: "Patterns across rows" }}
/>

<Question
  prompt="In the worked example of the same product at three scales, what stays the same and what changes?"
  options={[
    { text: "The stack stays the same; only the team size changes" },
    { text: "The product stays the same; the stack changes radically by scale" },
    { text: "The product changes by scale, but the stack stays roughly constant" },
    { text: "Both product and stack are nearly identical — only cost changes" }
  ]}
  correct={1}
  explanation="The product is the same project-management tool at every scale, but the stack is radically different: a Vercel+Neon+Clerk app for $50/month vs. dozens of polyglot services with sharded Postgres and Kafka for ~$5M/month."
  revisit={{ to: "/docs/comparison/stack-and-hosting#hosting-and-infrastructure", label: "Same product, three stacks" }}
/>

</Quiz>

## What's next

→ Continue to [Development](./development) — how each scale actually builds, tests, and ships its code.
