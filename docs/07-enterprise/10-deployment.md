---
id: deployment
title: 'Phase 8: Deployment & Infrastructure'
sidebar_position: 11
sidebar_label: 10. Deployment
description: Kubernetes, IaC, multi-region active-active, service mesh, secrets management, and FinOps at enterprise scale.
---

# Phase 8: Deployment & Infrastructure

> **In one line:** Kubernetes on AWS/GCP/Azure, everything provisioned via Terraform, multi-region active-active for disaster recovery, secrets in Vault, costs governed by a FinOps discipline.

:::tip[In plain English]
Startup infrastructure is "we use Vercel and Postgres on Neon." Enterprise infrastructure is hundreds of Kubernetes clusters across multiple regions, glued together by a service mesh, with all configuration in Git and all secrets in a vault.

You don't choose this complexity for fun — you choose it because at scale, you need redundancy, isolation, and control that managed services can't always give you. Building on Kubernetes lets you abstract over AWS, GCP, and on-prem with one mental model.
:::

## Kubernetes is dominant

:::info[Jargon]
- **Kubernetes** (often abbreviated **K8s**) — an open-source system that schedules and runs containerized apps across a cluster of machines and restarts them when they crash.
- **EKS / GKE / AKS** — the managed Kubernetes offerings from AWS, Google, and Azure respectively. You still operate it; the cloud provider just runs the control plane.
- **Manifest** — a YAML file describing a Kubernetes resource (a deployment, a service, a config map). The unit of "what should exist in the cluster."
- **Helm / Kustomize** — two ways to template and customize manifests so you can have one source of truth that deploys differently per environment.
- **`kubectl`** — the command-line client people use to talk to a Kubernetes cluster.
- **Backstage** — Spotify's open-source developer portal; commonly the front door for an internal developer platform.
:::

- Self-managed K8s on AWS EKS, GCP GKE, Azure AKS, or bare metal.
- Internal abstractions hide K8s complexity from product engineers.
- Service templates: engineers don't write raw Kubernetes manifests.
- Helm charts or Kustomize for manifest management.
- Internal "platform-as-product" approach.

Product engineers usually never touch raw Kubernetes. They use a higher-level abstraction — a service template that emits the manifests, an internal CLI that wraps `kubectl`, a Backstage plugin that surfaces the status.

## Compute alternatives

Even within an enterprise, Kubernetes isn't the only compute model:

- **Serverless** (Lambda, Cloud Run) for specific use cases (webhook handlers, infrequent jobs).
- **Batch compute** (AWS Batch, GKE jobs) for ML training, ETL.
- **Edge functions** for latency-critical user-facing logic.

The platform team typically supports a curated menu of options, each with its own cost profile and use case.

## Infrastructure as Code

**Infrastructure as Code (IaC)** is the practice of describing your cloud resources (VPCs, databases, load balancers, IAM roles) in text files that live in Git, instead of clicking around the cloud console. **Terraform** is the de facto standard; **Pulumi** and **AWS CDK** are the same idea but you write the config in a real programming language.

- Everything provisioned via Terraform, Pulumi, or AWS CDK.
- No clicking in cloud consoles for production.
- Changes reviewed and approved like code.
- State files stored securely (Terraform Cloud, S3 + DynamoDB locks).

The "no clicking in the console" rule is enforced by IAM: production resources can only be created/modified by the CI service account, never by a human. If you want a change, you write a Terraform PR.

:::info[Highlight: IaC is how you survive auditors]
SOC 2, PCI, HIPAA — every compliance regime wants to know "who changed this firewall rule, when, and why?"

If your answer is "Joe clicked some buttons in the AWS console six months ago," you fail the audit. If your answer is "here's the Terraform commit, here's the PR with the approval chain, here's the deploy log," you pass.

IaC isn't just an engineering convenience — it's the only practical way to keep an immutable, reviewable audit trail of infrastructure changes at scale.
:::

## Multi-region, multi-AZ

- Workloads run across multiple availability zones (always) and multiple regions for disaster recovery.
- Active-active or active-passive depending on workload.
- Data replication strategy: synchronous (consistent, latency-bound) or asynchronous (eventual, but faster writes).

Multi-AZ is the baseline. Multi-region is harder — it forces you to confront data consistency trade-offs (CAP theorem made real). Most enterprises run active-passive across regions for non-trivial state and active-active only for stateless services.

## Service mesh

- Istio or Linkerd handles inter-service mTLS, retries, circuit breaking, observability.
- Sidecars (or sidecarless via eBPF) inject these capabilities transparently.

The service mesh is what makes hundreds of microservices manageable. Every service-to-service call automatically gets mTLS, retry logic, timeouts, circuit breaking, and tracing — without each individual service implementing them.

## Secrets management

- HashiCorp Vault, AWS Secrets Manager, Google Secret Manager.
- Short-lived credentials.
- Automated rotation.
- Audit logs of every access.

Long-lived secrets (a database password that stays the same for years) are an anti-pattern at this scale. Modern secrets management issues *short-lived* credentials (15 minutes to a day), rotated automatically, with every access logged for audit.

## Cost optimization

- FinOps discipline.
- Resources tagged with owner team for chargeback.
- Reserved capacity, savings plans, spot instances.
- Continuous cost monitoring; teams that exceed budgets get pinged.
- Cloud bills at this scale are tens to hundreds of millions of dollars per year.

A FinOps function is a real team. They look at your cloud bill the way a CFO looks at the P&L — and teams that suddenly start spending 3x more on compute get a call.

:::note[Worked example: anatomy of "deploying a new service"]
A product engineer at a well-tooled enterprise needs to ship a new service. The platform team has invested heavily so that this flow looks like:

1. `acme service new --template=grpc-go --team=billing` generates the repo and Terraform.
2. PR auto-opened with starter code, generated manifests, default secrets, default monitoring.
3. Engineer adds business logic; CI runs the full pipeline.
4. Merged → progressive deploy → service running in multi-region K8s within hours.
5. Backstage shows the new service: owner, on-call, dashboards, SLOs, dependencies.

What the engineer never directly touched: Kubernetes manifests, Terraform state, IAM roles, Vault paths, observability config, Helm charts. All abstracted away.

Without that abstraction, this same flow at a less-tooled enterprise is weeks of tickets.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting Kubernetes because "we'll need it eventually."** A 30-engineer team running K8s spends most of its platform budget babysitting the cluster instead of shipping product. The cost shows up as slower onboarding, mysterious YAML, and 4 AM cluster-cert renewals — not as a line item.
- **Multi-region active-active for stateful services without confronting CAP.** Synchronous replication across regions means write latency you can't hide; eventual consistency means user-visible weirdness ("I just paid; why does it say I owe money?"). Pick the trade-off explicitly per service — don't let "active-active everywhere" be a default.
- **Letting Terraform state become tribal knowledge.** One state file, one person who knows where it lives, no locking, no backup. The first time someone runs `terraform apply` over a stale state, you lose hours and possibly resources. State backend + locks + reviews are not optional — they're the *point*.
- **Long-lived secrets that "we'll rotate next quarter."** A static DB password that's been in production for two years is a credential an attacker uses forever once stolen. Short-lived, rotated, audited — anything else is borrowing time.
- **FinOps as a Q4 panic instead of a continuous discipline.** Every December, leadership notices the cloud bill, demands a 30% cut, teams scramble for two weeks, then everyone forgets until next December. Tag from day one, chargeback monthly, and the panic stops happening.
:::

## Page checkpoint

<Quiz id="enterprise-deployment-page" title="Did enterprise deployment stick?" sampleSize={2}>

<Question
  prompt="Why does the page argue Infrastructure as Code is essential for compliance, not just engineering convenience?"
  options={[
    { text: "It's the cheapest option" },
    { text: "It's the only practical way to keep an immutable, reviewable audit trail of infrastructure changes — 'Joe clicked some buttons' fails audits, 'here's the Terraform PR' passes" },
    { text: "Auditors specifically require Terraform" },
    { text: "Cloud providers refuse to provide audit logs otherwise" }
  ]}
  correct={1}
  explanation="SOC 2, PCI, and HIPAA all ask 'who changed this firewall rule, when, and why?' IaC turns that into a Git commit with a PR and approval chain. Console clicks leave no auditable trail — IaC is the only practical answer at enterprise scale."
  revisit={{ to: "/docs/enterprise/deployment#infrastructure-as-code", label: "IaC and audits" }}
/>

<Question
  prompt="Why are long-lived secrets (a DB password unchanged for years) considered an anti-pattern at this scale?"
  options={[
    { text: "They use too much memory" },
    { text: "They violate Kubernetes best practices" },
    { text: "Modern secrets management issues short-lived credentials (minutes to a day) with automated rotation and audit logging — dramatically shrinking blast radius" },
    { text: "They cost more in cloud spend" }
  ]}
  correct={2}
  explanation="A static long-lived secret is a credential an attacker can use forever once stolen. Modern secrets management (Vault, AWS Secrets Manager) issues short-lived credentials rotated automatically, with every access logged — shrinking the blast radius of a compromise."
  revisit={{ to: "/docs/enterprise/deployment#secrets-management", label: "Secrets management" }}
/>

<Question
  prompt="What is the typical multi-region strategy for non-trivial stateful workloads?"
  options={[
    { text: "Active-active across regions for everything" },
    { text: "Active-passive across regions for stateful services; active-active mainly for stateless ones" },
    { text: "Single-region everything to avoid CAP issues" },
    { text: "Manual failover only" }
  ]}
  correct={1}
  explanation="Multi-region forces you to confront CAP trade-offs (consistency vs. availability vs. partition tolerance). Most enterprises run active-passive for stateful services and reserve active-active for stateless workloads where consistency isn't on the line."
  revisit={{ to: "/docs/enterprise/deployment#multi-region-multi-az", label: "Multi-region" }}
/>

<Question
  prompt="What is the role of a FinOps team at enterprise scale?"
  options={[
    { text: "They handle vendor contracts only" },
    { text: "They scrutinize the cloud bill — chargeback by team, alerting on sudden spend spikes, optimizing reserved capacity and spot usage" },
    { text: "They write all the Terraform" },
    { text: "They manage the engineering payroll" }
  ]}
  correct={1}
  explanation="At tens to hundreds of millions of dollars per year in cloud spend, FinOps is a real discipline. They tag resources by owner team for chargeback, monitor budgets, push savings plans and reserved capacity, and call teams whose spend suddenly jumps 3x."
  revisit={{ to: "/docs/enterprise/deployment#cost-optimization", label: "FinOps" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 9: Observability at Scale](./observability) — once everything's running, how do you actually know what's going on?
