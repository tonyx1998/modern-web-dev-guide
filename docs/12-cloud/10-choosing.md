---
id: cloud-choosing
title: Choosing a Cloud
sidebar_position: 11
sidebar_label: Choosing a cloud
description: AWS vs GCP vs Azure vs staying on a platform — the decision factors that actually matter, and why the choice is less important than people think.
---

# Choosing a Cloud

> **In one line:** For a new project the right answer is usually "don't pick a cloud yet — stay on a platform"; when you do need one, the decision is driven by your team's existing gravity (skills, employer, ecosystem) far more than by feature checklists, because all three hyperscalers can do essentially everything.

:::tip[In plain English]
People treat "which cloud?" as a momentous, hard-to-reverse decision and research it for weeks. It mostly isn't. AWS, GCP, and Azure are ~90% the same primitives with different names and consoles; any of them will run your app fine for years. The factors that *actually* decide it are boring and practical: what your team already knows, what your company already uses, where your enterprise customers require their data to live, and which has the one specialized service you need. And the bigger decision — the one that actually saves you money and time — is the earlier one: *do you need a raw cloud at all yet, or should you stay on Vercel/Railway/Fly?* This page is about making both calls without overthinking them.
:::

## First decision: do you even need a cloud yet?

Re-read [the chapter intro](/docs/cloud) and [the cost crossover](./cloud-cost#when-the-platformcloud-cost-crossover-actually-happens). The honest default for a new web app in 2026:

```
New web app?
   │
   ├─ Indie / startup / MVP / side project   → Platform (Vercel, Cloudflare, Railway, Fly)
   │                                            Don't touch a raw cloud.
   │
   ├─ Outgrew the platform (cost, a missing   → Now pick a cloud.
   │   capability, compliance, scale)
   │
   └─ Joining a company that already runs on  → Use whatever they use. The decision
       a cloud                                   is already made; learn that one.
```

Adopting a raw cloud "to be serious" or "to be ready to scale" is the most common premature-complexity mistake in this whole chapter — it's [premature optimization](/docs/decisions/premature-optimization) at the infrastructure level. The platform premium buys you velocity; pay it until the math or a hard requirement says otherwise.

## When you do choose: the factors that matter

In rough order of real-world weight:

**1. Existing team skills.** A team fluent in AWS ships reliably on AWS and slowly on GCP for the first six months. Competence you already have beats a marginally nicer service. This usually dominates.

**2. Organizational gravity.** Already a Microsoft/Office/Active Directory shop? Azure's integration is a genuine, money-and-time-saving advantage (SSO, identity, hybrid). Already deep in Google Workspace / BigQuery? GCP fits. The cloud that disappears into your existing tooling wins.

**3. The one service you actually need.** Sometimes a specific managed service tips it: BigQuery (GCP) for serious analytics, the broadest service catalog and maturity (AWS) for "we'll need something exotic eventually," best-in-class managed Kubernetes and developer ergonomics (GKE/Cloud Run on GCP), Microsoft-ecosystem and government/enterprise compliance (Azure).

**4. Compliance & data residency.** Enterprise/regulated customers may *require* a specific cloud, specific regions, or specific certifications (FedRAMP, certain healthcare/finance attestations). This can be a hard constraint that overrides everything else.

**5. Pricing.** Real but usually a wash at the start, and negotiable at scale (all three discount heavily for committed spend). Don't choose a cloud on sticker price; choose on fit, then optimize cost with [FinOps](./cloud-cost).

## The three, characterized honestly

| | **AWS** | **Google Cloud** | **Azure** |
|---|---|---|---|
| **Pick it when** | You want the safe default, the widest catalog, the most hiring/docs/Stack Overflow answers | You're data/ML-heavy, value DX, or want the best serverless-container & Kubernetes experience | Your org lives in Microsoft/AD, or enterprise/gov compliance requires it |
| **Strengths** | Breadth, maturity, every service exists, huge talent pool | Cloud Run, GKE, BigQuery, clean project model, good ergonomics | Entra ID/AD integration, hybrid cloud, enterprise sales/compliance |
| **Friction** | Sprawling, baroque IAM, easy to get lost in 200+ services | Smaller ecosystem/community, fewer third-party integrations | Console/UX rough edges, AWS-centric tutorials don't map cleanly |
| **Safe-default verdict** | If you have no other signal, AWS is the lowest-regret choice | Strongest *technical* experience for greenfield, especially data/containers | Rarely chosen *fresh* unless Microsoft gravity is already present |

:::info[Highlight: multi-cloud is a goal you should be suspicious of]
"Let's be multi-cloud so we're not locked in" sounds prudent and is usually a trap for anyone who isn't a hyperscale company. Running well on *one* cloud is already a serious operational skill; running on two means you build to the *lowest common denominator* (no using the good managed services), double your tooling and on-call surface, and pay egress to move data between them. The lock-in you're avoiding is mostly theoretical; the complexity you're buying is immediate and real. Pick one cloud, use its managed services fully, and revisit multi-cloud only if a concrete requirement (a giant customer's mandate, true hyperscale resilience) forces it. This is [boring technology](/docs/decisions/boring-technology) applied to clouds.
:::

## How reversible is the choice, really?

More than the lock-in discourse implies, less than "it's nothing." Your **application code** is largely portable — a containerized app moves between clouds in days. What's *sticky* is the stuff you build *around* a cloud's proprietary services: deep DynamoDB modeling, a Step Functions workflow, BigQuery pipelines, IAM/networking expressed in that cloud's IaC. The more you lean into a cloud's unique managed services (which you *should*, for velocity), the more a migration costs.

The pragmatic stance, consistent with the rest of the guide: **lean into one cloud's managed services for the velocity, accept the lock-in as a deliberate trade, and know that migration — if you ever need it — is a finite, weeks-to-months project, not a catastrophe.** Designing for portability you'll probably never use is paying a daily tax to avoid a one-time bill.

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting a raw cloud for a project that should be on a platform.** The biggest, most common error. Stay on Vercel/Railway/Fly until cost, capability, or compliance forces the move.
- **Choosing a cloud on a feature checklist instead of team fit.** All three can do ~everything; the cloud your team knows (or your org already uses) will out-ship the "technically best" one.
- **Going multi-cloud for theoretical lock-in avoidance.** You build to the lowest common denominator and double your operational surface to avoid a problem you don't have. Pick one.
- **Refusing to use a cloud's good managed services to 'stay portable.'** You give up the velocity that justified the cloud in the first place. Use the services; treat lock-in as a known, deliberate trade.
- **Over-researching the choice.** Weeks of comparison for a ~90%-identical decision. Default to AWS if you have no signal, GCP if you're greenfield/data-heavy, Azure if you're a Microsoft shop — then go build.
:::

## Chapter wrap-up

You now have the four deep concepts that make any cloud legible — compute models, VPC networking, IAM, and IaC — plus storage, managed data, serverless patterns, and the cost discipline to run it without surprises. The throughline of the whole chapter: **the cloud is the powerful, operationally-heavy floor beneath the platforms you already know; step onto it deliberately, use its managed services fully, and keep least-privilege and infrastructure-as-code as non-negotiables.**

## Page checkpoint

<Quiz id="cloud-choosing-page" title="Did choosing a cloud stick?" sampleSize={2}>

<Question
  prompt="For a brand-new indie/startup web app, what does the chapter recommend regarding cloud choice?"
  options={[
    { text: "Pick AWS immediately — it's the industry standard" },
    { text: "Don't pick a raw cloud yet — stay on a platform (Vercel/Cloudflare/Railway/Fly) until cost, a missing capability, or compliance forces the move" },
    { text: "Go multi-cloud from day one to avoid lock-in" },
    { text: "Choose GCP for the best pricing" }
  ]}
  correct={1}
  explanation="Adopting a raw cloud 'to be serious' is the chapter's most-warned-against premature-complexity mistake. The platform premium buys velocity; stay on a platform until the cost crossover, a specific needed capability, or a compliance requirement makes a cloud necessary."
  revisit={{ to: "/docs/cloud/cloud-choosing#first-decision-do-you-even-need-a-cloud-yet", label: "Do you need a cloud yet?" }}
/>

<Question
  prompt="Which factor most reliably should drive the AWS-vs-GCP-vs-Azure decision?"
  options={[
    { text: "Which has the longest feature list" },
    { text: "Your team's existing skills and your organization's existing gravity (employer, ecosystem, compliance) — because all three can do essentially everything" },
    { text: "Which has the cheapest on-demand instance prices" },
    { text: "Which launched most recently" }
  ]}
  correct={1}
  explanation="The hyperscalers are ~90% the same primitives. What actually determines success is fit: the cloud your team already knows (or your company already runs) will out-ship the 'technically best' one, and compliance/data-residency can be a hard constraint. Feature checklists rarely decide it."
  revisit={{ to: "/docs/cloud/cloud-choosing#when-you-do-choose-the-factors-that-matter", label: "Factors that matter" }}
/>

<Question
  prompt="Why is defaulting to multi-cloud usually a trap for a non-hyperscale company?"
  options={[
    { text: "It's against cloud providers' terms of service" },
    { text: "You end up building to the lowest common denominator (no proprietary managed services), double your tooling and on-call surface, and pay egress to move data between clouds — buying real complexity to avoid mostly-theoretical lock-in" },
    { text: "Multi-cloud apps run slower by definition" },
    { text: "You can't use IaC across two clouds" }
  ]}
  correct={1}
  explanation="Running one cloud well is already a serious skill; two means avoiding the good managed services, doubling operational surface, and paying inter-cloud egress. The lock-in avoided is largely theoretical while the complexity added is immediate — pick one cloud and use it fully."
  revisit={{ to: "/docs/cloud/cloud-choosing#how-reversible-is-the-choice-really", label: "Multi-cloud caution" }}
/>

</Quiz>

## What's next

→ The cloud fundamentals are in place. Now go deeper into running it at a senior level: [Kubernetes without the hand-waving](./cloud-kubernetes) — the orchestration layer, its reconcile loop, autoscaling, and when *not* to reach for it.
