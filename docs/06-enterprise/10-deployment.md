---
id: deployment
title: 'Phase 7: Deployment & Infrastructure'
sidebar_position: 11
sidebar_label: 10. Deployment
description: Kubernetes, IaC, multi-region active-active, service mesh, secrets management, and FinOps at enterprise scale.
---

# Phase 7: Deployment & Infrastructure

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

## What's next

→ Continue to [Phase 8: Observability at Scale](./observability) — once everything's running, how do you actually know what's going on?
