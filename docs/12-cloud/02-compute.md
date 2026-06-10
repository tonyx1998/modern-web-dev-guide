---
id: cloud-compute
title: Compute — VMs, Containers, Serverless
sidebar_position: 3
sidebar_label: Compute
description: The compute spectrum from VMs to containers to functions, how each is billed and isolated, cold starts, and the decision rule for picking one.
---

# Compute — VMs, Containers, Serverless

> **In one line:** Compute is a single spectrum from "you manage everything" (a VM) to "you manage only a function" (serverless); you move along it by trading control and cost-efficiency-at-scale for operational simplicity, and the right pick is almost always the *most managed* option that meets your constraints.

:::tip[In plain English]
Every way to run code in the cloud is a point on one line. At the heavy end, a **virtual machine** is a whole computer you rent — you install the OS, the runtime, everything, and you pay whether it's busy or idle. In the middle, **containers** package your app and its dependencies so the platform runs *those* without you babysitting an OS. At the light end, **serverless functions** run a single piece of code on demand and bill you per millisecond it executes — zero when idle. As you move from VM → container → function, you give up control and gain "I don't have to think about it." Most web apps should start at the light end and only move heavier when something forces them to.
:::

## The spectrum

```
 MORE CONTROL                                                  LESS OPS
 pay-while-idle                                          pay-per-execution
 ┌───────────┐   ┌──────────────┐   ┌───────────────┐   ┌────────────────┐
 │ Bare metal│   │ Virtual      │   │ Containers     │   │ Serverless     │
 │ (rare)    │ → │ Machine (VM) │ → │ (orchestrated) │ → │ functions      │
 └───────────┘   └──────────────┘   └───────────────┘   └────────────────┘
   You rack it    EC2 / Compute      ECS, Fargate,        Lambda, Cloud
                  Engine / Azure VM   Cloud Run, GKE       Functions, etc.
   You patch OS   You patch OS        You patch image      You patch... nothing
   Always on      Always on (or you   Scales to N tasks    Scales to zero
                  script scaling)
```

## 1. Virtual machines (EC2 / Compute Engine / Azure VM)

A VM is a slice of a physical server, isolated by a hypervisor. You get an OS you fully control.

- **You own:** OS patching, runtime install, process management, log shipping, scaling logic, security hardening.
- **Billing:** per second/hour the instance *exists*, running or idle. A `t3.medium` left on over a weekend costs the same whether it served 0 requests or 0 million.
- **Sizing:** instance *families* trade CPU/memory/network ratios — `t`/`e` = burstable cheap, `m` = balanced, `c` = compute-heavy, `r`/`x` = memory-heavy, `g`/`p` = GPU. Picking the family is half of cost control.

```bash
# Launch a VM (illustrative — in real life this is Terraform, not a CLI one-liner)
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.medium \
  --key-name my-key \
  --security-group-ids sg-0a1b2c3d \
  --subnet-id subnet-0123456789
```

**When you actually want a VM:** stateful software that assumes a real host (legacy apps, some databases you self-manage), GPU workloads, when you need a specific kernel/OS, or when a long-running process must hold state in memory. For a stateless web app, a raw VM in 2026 is usually the *wrong* default — you're signing up to reinvent autoscaling, health checks, and zero-downtime deploys that managed options give you free.

:::info[Highlight: "scaling" is the whole reason the spectrum exists]
A single VM can't get bigger during a traffic spike without a reboot (vertical scaling has a ceiling and downtime). The cloud's answer is **horizontal scaling**: run *N* identical copies behind a load balancer and change *N*. Everything to the right of "single VM" on the spectrum — auto scaling groups, container orchestrators, serverless — exists to make changing *N* automatic. This is also why your app must be **stateless** (no session data in local memory) to scale: any copy must be able to serve any request.
:::

## 2. Containers (ECS/Fargate, Cloud Run, GKE/Kubernetes)

A container packages your app + its dependencies into an image that runs identically anywhere. You stop patching an OS and start shipping images. There are two sub-flavors:

**Serverless containers — the sweet spot for most teams.** You hand the platform an image and a "run N copies" intent; it finds the machines, scales them, and (Cloud Run) scales to zero when idle.

- **Google Cloud Run** — the best-in-class experience. `gcloud run deploy`, point it at an image, get an autoscaling HTTPS endpoint that scales to zero. This is the closest a raw cloud gets to Vercel-like DX.
- **AWS Fargate** (via ECS or EKS) — "containers without managing servers." More moving parts than Cloud Run (task definitions, services, target groups) but no node fleet to patch.
- **AWS App Runner** — AWS's Cloud Run answer; simpler than Fargate, less flexible.

**Orchestrated containers — Kubernetes (EKS/GKE/AKS).** You run a *cluster* of nodes and a control plane schedules containers across them. Enormously powerful, enormously complex. See the box below.

```dockerfile
# A production-shaped Dockerfile for a Node app — multi-stage keeps the image small
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Run as non-root — a basic, frequently-skipped hardening step
USER node
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

```bash
# Deploy that image to Cloud Run — scales to zero, HTTPS included
gcloud run deploy my-api \
  --image=us-docker.pkg.dev/my-proj/repo/my-api:latest \
  --region=us-central1 \
  --min-instances=0 --max-instances=20 \
  --cpu=1 --memory=512Mi \
  --allow-unauthenticated
```

:::caution[Kubernetes is the most over-adopted technology in this chapter]
Kubernetes (K8s) is the industry standard for orchestrating containers *at scale across a team that needs it*. It is also the single most common case of premature complexity in web infrastructure. A three-person startup running a managed K8s cluster for one Next.js app has bought a part-time platform-engineering job they didn't need. The honest rule:

- **Reach for serverless containers (Cloud Run / Fargate / App Runner) first.** They cover the vast majority of web workloads with a fraction of the operational surface.
- **Reach for Kubernetes when** you have many services, a dedicated platform team, multi-cloud or on-prem portability requirements, or workloads (stateful sets, GPU scheduling, complex networking) that genuinely need it.

"We might need to scale" is not a reason to adopt K8s. *Actually having outgrown the simpler option* is. See also the [boring technology](/docs/decisions/boring-technology) framing.
:::

## 3. Serverless functions (Lambda / Cloud Functions / Azure Functions)

You upload a function; the platform runs it on demand, scales it from zero to thousands of concurrent executions automatically, and bills you per request × duration × memory. Idle cost: **zero**.

- **You own:** the function code and its IAM role. That's it.
- **Billing:** e.g. Lambda ≈ (GB-seconds of memory × time) + per-request fee. A function that runs 100ms at 256MB a million times costs a few dollars.
- **The catch — cold starts:** when no warm instance exists, the platform must initialize a new one (download code, start the runtime, run your init). That first request pays a latency penalty — tens of ms for a lean function, *seconds* for a heavy JVM/.NET one with a fat dependency graph.

```javascript
// AWS Lambda handler (Node). Note: code OUTSIDE the handler runs once per cold
// start and is reused across warm invocations — put expensive setup here.
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

export const handler = async (event) => {
  const { rows } = await pool.query("SELECT now()");          // reused connection
  return { statusCode: 200, body: JSON.stringify({ now: rows[0].now }) };
};
```

**Cold-start mitigations:** keep the deployment package small, do heavy init at module scope (reused while warm), use *provisioned concurrency* for latency-critical paths, and prefer fast-starting runtimes (Node/Python/Go start in tens of ms; cold JVM/.NET can be seconds). For consistently high traffic, a function never goes cold — the problem mostly bites spiky/low-traffic endpoints.

:::note[Worked example: the database-connection trap with serverless]
Serverless scales to thousands of concurrent function instances. Each one that opens its own database connection can exhaust Postgres's connection limit (often ~100) almost instantly, taking the whole DB down. This is the #1 serverless-meets-database footgun. The fixes: put a **connection pooler** in front of the DB (PgBouncer, AWS RDS Proxy, or a serverless driver like Neon's / Supabase's pooled endpoint), cap `max` connections per function to 1, and prefer HTTP-based data APIs for edge runtimes. The mental shift: in serverless, *connections are scarce and your concurrency is huge* — the opposite of the always-on-server assumption.
:::

## The decision rule

```
Is it a stateless web service / API / background task?
        │
        ├─ Spiky or low/zero baseline traffic, short tasks?  → Serverless functions
        ├─ Steady traffic, want simple + scale-to-zero?      → Serverless containers (Cloud Run)
        ├─ Many services + a platform team + real scale?     → Kubernetes
        └─ Needs a specific OS/kernel/GPU, or holds state?   → Virtual machine
```

| Option | You manage | Scales to zero | Idle cost | Best for |
|---|---|---|---|---|
| **VM** | OS, runtime, scaling | No | Full | Stateful/legacy/GPU, full control |
| **Serverless containers** | Image only | Yes (Cloud Run) | ~0 | Most web services in 2026 |
| **Kubernetes** | Cluster + images | No (nodes) | Node fleet | Many services at scale, a platform team |
| **Functions** | Code only | Yes | 0 | Event handlers, glue, spiky APIs |

**Default for a new web service that has outgrown a platform:** serverless containers (Cloud Run, or Fargate if you're on AWS). It's the modern center of gravity — Vercel-like simplicity, cloud-level control, no idle bill, no cluster to babysit.

## Common mistakes

:::caution[Where people commonly trip up]
- **Defaulting to a raw VM for a stateless web app.** You inherit autoscaling, health checks, OS patching, and zero-downtime deploys — all of which serverless containers give you free.
- **Adopting Kubernetes "to be ready to scale."** You've added a platform-engineering burden to solve a problem you don't have. Earn K8s by outgrowing the simpler option.
- **Opening a fresh DB connection per serverless invocation.** Thousands of concurrent functions exhaust the connection limit and crash the database. Use a pooler / serverless driver.
- **Ignoring cold starts on a heavy runtime.** A 4-second cold start on a user-facing JVM endpoint is a real outage from the user's perspective. Measure p99, trim the package, or use provisioned concurrency.
- **Leaving big instances running idle.** The classic cloud bill: a `g5.xlarge` GPU box someone spun up for a test and forgot. Tag everything, alert on idle, and prefer scale-to-zero options.
:::

## Page checkpoint

<Quiz id="cloud-compute-page" title="Did compute stick?" sampleSize={3}>

<Question
  prompt="A stateless Node API has outgrown Vercel on cost and the team wants cloud-level control without managing servers or a cluster. What's the chapter's default recommendation?"
  options={[
    { text: "A fleet of EC2 virtual machines behind a load balancer" },
    { text: "A managed Kubernetes cluster (EKS/GKE) for future-proofing" },
    { text: "Serverless containers (Cloud Run, or Fargate on AWS) — image-only management, autoscaling, scale-to-zero" },
    { text: "A single large VM, scaled vertically" }
  ]}
  correct={2}
  explanation="Serverless containers are the modern center of gravity for web services: you ship an image, the platform autoscales it (Cloud Run scales to zero), and there's no OS to patch or cluster to operate. VMs reintroduce ops you don't need; Kubernetes is premature for one service without a platform team."
  revisit={{ to: "/docs/cloud/cloud-compute#the-decision-rule", label: "The compute decision rule" }}
/>

<Question
  prompt="Why does a serverless function frequently crash the database it talks to under load?"
  options={[
    { text: "Functions run slower than VMs, so queries time out" },
    { text: "Each of thousands of concurrent function instances opens its own connection, exhausting the database's connection limit — the fix is a connection pooler / serverless driver" },
    { text: "Serverless functions can't use TLS to connect to databases" },
    { text: "Functions cache stale query results that corrupt the database" }
  ]}
  correct={1}
  explanation="Serverless concurrency is huge but database connections are scarce (~100 on default Postgres). Thousands of functions each opening a connection exhausts the limit instantly. Put PgBouncer / RDS Proxy / a pooled serverless endpoint in front, and cap connections per function."
  revisit={{ to: "/docs/cloud/cloud-compute#3-serverless-functions-lambda--cloud-functions--azure-functions", label: "The serverless connection trap" }}
/>

<Question
  prompt="What is a 'cold start' and which workload is most hurt by it?"
  options={[
    { text: "A VM rebooting after a patch; long-running servers are hurt most" },
    { text: "The latency to initialize a new function instance when none is warm; spiky/low-traffic user-facing endpoints on heavy runtimes are hurt most" },
    { text: "The time to provision a Kubernetes node; batch jobs are hurt most" },
    { text: "A database failover; analytics queries are hurt most" }
  ]}
  correct={1}
  explanation="A cold start is the one-time cost of spinning up a fresh function instance (download code, start runtime, run init). Steady high traffic stays warm; spiky or low-baseline user-facing endpoints — especially on slow-starting JVM/.NET runtimes — feel it as real added latency."
  revisit={{ to: "/docs/cloud/cloud-compute#3-serverless-functions-lambda--cloud-functions--azure-functions", label: "Cold starts" }}
/>

</Quiz>

## What's next

→ Continue to [Networking (VPC)](./cloud-networking) — the part that breaks everyone the first time: how your compute is segmented, secured, and exposed to the internet.
