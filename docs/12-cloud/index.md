---
id: cloud-platforms
title: 5. Cloud Platforms — Overview
sidebar_position: 1
sidebar_label: Cloud layer intro
description: AWS, GCP, and Azure as the substrate under everything — compute, networking, identity, storage, managed data, IaC, and cost. The layer Vercel/Railway hide from you until you outgrow them.
---

# Part 5: Cloud Platforms

*The substrate under everything — what Vercel, Railway, and Fly.io are running on top of.*

> **In one line:** A "cloud" is someone else's data center exposed as an API. For most new web apps you should *not* touch it directly — but the moment you outgrow a platform (cost, compliance, a service no PaaS offers, a big-company job), the cloud is where you land, and the concepts here (compute models, VPC networking, IAM, IaC) are the ones that take engineers months to learn the hard way.

:::tip[In plain English]
Earlier chapters told you to deploy to Vercel or Cloudflare and not think about servers. That advice is correct — *until it isn't*. This chapter is what's underneath. AWS, Google Cloud, and Azure rent you the raw primitives: virtual machines, networks, identity, storage, databases. A platform like Vercel is a beautiful, opinionated wrapper around a subset of those primitives. When you "graduate to AWS," you're trading that wrapper's convenience for control, breadth, and (eventually) lower unit cost — and taking on the operational burden the wrapper was hiding.

The skill that separates "I deployed an EC2 instance" from "I can run production on a cloud" is **not** memorizing service names. It's understanding four things deeply: how compute is billed and isolated, how the network is segmented, how identity gates every action, and how you describe all of it as code so it's reproducible. Master those four and every one of the 200+ AWS services becomes "oh, it's just X with a managed control plane."
:::

:::note[New to web dev? How to read this chapter]
**Level: intermediate.** You do *not* need any of this to build and ship your first site — a platform like Vercel or Cloudflare covers that, and the [Solo / Personal chapter](/docs/solo) walks you through it end-to-end. If you're reading straight through and haven't shipped anything yet, that chapter is the better place to be right now.

When you *do* read this chapter: take the **"In plain English"** box and the **highlight** callouts on each page for the mental model, and **skim the Terraform/CLI code** on a first pass — you'll absorb it properly once you have a reason to touch a real cloud (cost, scale, or a job that runs on one). It builds on the Foundations chapter's networking, databases, and deployment pages, so keep the [Glossary](/docs/glossary) open in a tab for any unfamiliar term.
:::

## Why a web dev needs this chapter

You can have a great career and never write a line of Terraform — if you stay on platforms. But three forces push web developers into the cloud:

1. **Cost at scale.** Vercel's convenience premium is real. Somewhere between $2K and $20K/month of platform spend, the math flips and a small team on AWS/GCP is cheaper *even after* paying for the operational time. (See [Cost & FinOps](/docs/cloud/cloud-cost).)
2. **Capabilities platforms don't expose.** Long-running jobs, GPUs, private networking to a corporate data center, fine-grained compliance (HIPAA, FedRAMP, SOC 2 with data-residency guarantees), exotic databases. The platform tier caps out; the cloud doesn't.
3. **Where the jobs are.** Most companies above ~50 engineers run on a cloud directly. "Comfortable in AWS/GCP" is on a large fraction of senior web-dev job descriptions. The guide's earlier chapters made you dangerous on the indie/startup stack; this one makes you employable at the enterprise tier.

:::info[Highlight: the cloud is not a competitor to Vercel — it's the floor below it]
Vercel runs on AWS. Netlify runs on AWS. Supabase is Postgres on AWS/Fly. Almost every PaaS you've used is a curated experience built on top of a hyperscaler. Understanding the cloud doesn't replace what you learned about platforms — it lets you see *through* them, debug them, price them, and know exactly what you're giving up when you migrate off them.
:::

## The three hyperscalers at a glance

| | **AWS** | **Google Cloud (GCP)** | **Azure** |
|---|---|---|---|
| **Market position** | #1, ~30% share, widest service catalog | #3, strongest in data/ML/Kubernetes | #2, dominant where Microsoft already is |
| **Default strength** | Breadth, maturity, every service exists | Developer ergonomics, GKE, BigQuery | Enterprise/Office/AD integration, hybrid |
| **Serverless containers** | Fargate (fiddly), App Runner | **Cloud Run** (best-in-class) | Container Apps |
| **Identity model** | IAM (powerful, baroque) | IAM + project hierarchy (cleaner) | Entra ID (formerly Azure AD) + RBAC |
| **You'll meet it when** | …almost anywhere | …data-heavy startups, ML shops | …you join a Microsoft-shop enterprise |

The dirty secret: **they are ~90% the same.** A VPC is a VNet is a VPC. EC2 is Compute Engine is a VM. S3 is Cloud Storage is Blob Storage. Lambda is Cloud Functions is Azure Functions. Learn the *concepts* on one (this chapter uses AWS as the lingua franca because it's the most common and the most verbose, so the others feel easy afterward) and you transfer 90% to the others in a week.

## The shared responsibility model

The single most important mental model in cloud. The provider secures **the cloud**; you secure **what you put in it**.

```
                 ┌──────────────────────────────────────────┐
   YOUR JOB  →   │  Your data, your code, IAM config,        │
                 │  network rules, patching YOUR OS/runtime, │
                 │  who-can-do-what                          │
                 ├──────────────────────────────────────────┤
   THEIR JOB →   │  Physical security, hardware, hypervisor, │
                 │  the managed-service control plane,       │
                 │  global network backbone                  │
                 └──────────────────────────────────────────┘
```

The line **moves** depending on the service. On a raw VM (EC2) you patch the OS. On a managed database (RDS) they patch the OS and DB engine but you still own schema, access, and backups policy. On a serverless function (Lambda) you own only the code and its IAM role. **Most cloud breaches are not the provider failing — they're a customer leaving an S3 bucket public or an over-broad IAM policy.** This chapter spends real time on exactly those failure modes.

:::info[Jargon for this chapter]
- **Region** — a geographic cluster of data centers (e.g. `us-east-1`). Latency and data-residency live here.
- **Availability Zone (AZ)** — one or more isolated data centers within a region. You spread across AZs for fault tolerance.
- **VPC / VNet** — your private, isolated virtual network inside the cloud.
- **Subnet** — a slice of a VPC's IP range, pinned to one AZ; "public" (can reach the internet) or "private" (can't, directly).
- **Security Group** — a stateful virtual firewall attached to a resource.
- **IAM** — Identity and Access Management: the system that decides which identity can perform which action on which resource.
- **Principal** — the *who* in IAM: a user, a role, or a service.
- **Managed service** — a service where the provider runs the undifferentiated heavy lifting (e.g. RDS = managed Postgres/MySQL).
- **Control plane vs data plane** — the control plane is the API that configures things; the data plane is the path your actual traffic/data takes.
- **IaC (Infrastructure as Code)** — describing your infrastructure in version-controlled files (Terraform, etc.) instead of clicking in a console.
- **Egress** — data leaving the cloud (to the internet or another region). This is the line item that surprises everyone.
:::

## How this chapter is organized

Read in order the first time — each page assumes the previous one's vocabulary.

### The four pillars
1. [Cloud mental model](/docs/cloud/cloud-mental-model) — regions, AZs, the console-vs-API truth, and how to think about 200 services without drowning.
2. [Compute](/docs/cloud/cloud-compute) — VMs vs containers vs serverless, and the cost/control tradeoff that drives everything.
3. [Networking (VPC)](/docs/cloud/cloud-networking) — the part that breaks everyone: subnets, route tables, security groups, NAT, load balancers.
4. [Identity & access (IAM)](/docs/cloud/cloud-iam) — least privilege, roles vs users, and why you should almost never use long-lived keys.

### Storage & data
5. [Storage](/docs/cloud/cloud-storage) — object (S3), block (EBS), file (EFS), and the CDN tie-in.
6. [Managed data services](/docs/cloud/cloud-managed-data) — RDS/Aurora, DynamoDB, caches, and managed queues/streams.

### Operating it
7. [Infrastructure as Code](/docs/cloud/cloud-iac) — Terraform end-to-end, state, modules, and the "never click in prod" rule.
8. [Serverless & event-driven patterns](/docs/cloud/cloud-serverless) — Lambda done right, cold starts, fan-out, and the gotchas.
9. [Cost & FinOps](/docs/cloud/cloud-cost) — the pricing model, the five bills that surprise everyone, and how to actually control spend.

### Choosing
10. [Choosing a cloud](/docs/cloud/cloud-choosing) — AWS vs GCP vs Azure vs "stay on a platform," for real decisions.

---

When you finish, move on to [Chapter 6: Site Reliability & Operations](/docs/operations) — how to keep all of this running at 3am.
