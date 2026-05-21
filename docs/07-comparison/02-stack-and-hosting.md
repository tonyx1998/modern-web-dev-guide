---
id: stack-and-hosting
title: Stack, Architecture, and Hosting
sidebar_position: 3
sidebar_label: 2. Stack & Hosting
description: Languages, frameworks, databases, hosting, and infrastructure compared across solo / small / large company scales.
---

# Stack, Architecture, and Hosting

> **In one line:** A solo dev runs one Next.js app on Vercel free tier; a startup runs a modular monolith plus a few SaaS pieces; an enterprise runs hundreds of polyglot services on self-managed Kubernetes across multiple regions.

:::tip In plain English
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

For the deep dive on enterprise architecture, see [Phase 2: Architecture](/docs/enterprise/architecture).

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

:::info Highlight: Kubernetes is not a startup tool
The single most common stack mistake at small companies is adopting Kubernetes too early. Kubernetes is a fantastic answer to problems you have at 200+ engineers and 50+ services. At 5 engineers and 1 service, it's a permanent tax on every deploy.

The 2026 startup default is: Vercel/Render/Fly/Railway until you actually outgrow them. Most teams never need anything else.
:::

:::note Worked example: same product, three stacks
Imagine three versions of a small SaaS app — say, a project-management tool — at different scales:

- **Solo founder:** Next.js + Postgres on Neon + Clerk + Stripe + Resend, all on Vercel. Total monthly bill: under $50. Architecture diagram fits on a napkin.
- **30-engineer startup:** Same Next.js app, now a modular monolith. Postgres on Supabase or RDS. Redis for sessions. PostHog for analytics. Trigger.dev for background jobs. Total monthly bill: ~$2K.
- **2,000-engineer enterprise:** Custom React frontend + design system + module federation across teams. Dozens of backend services (Go, Java, Python). Postgres sharded by tenant. Kafka for events. Custom auth + Okta SSO. Total monthly bill: ~$5M.

Same *product*, radically different *stack*. Each is correct for its scale; copying either of the others would be a mistake.
:::

## What's next

→ Continue to [Development](./development) — how each scale actually builds, tests, and ships its code.
