---
id: large-company-workflow
title: 6. Large Company Workflow — Overview
sidebar_position: 1
sidebar_label: Overview
description: Enterprises (500+ engineers). Microservices, Kubernetes, compliance, 99.99% uptime, SRE.
---

# Part 6: Large Company / Enterprise Workflow (500+ Engineers)

*Hundreds of engineers, regulatory scrutiny, 99.99% uptime, massive infrastructure.*

:::tip[Beginner orientation]
**Why enterprise feels alien:** When you read about enterprise engineering, every decision seems to take five times longer than it should and require ten times the meetings. That's not because enterprise engineers are slow — it's because the cost of getting things wrong is enormous. A 30-minute outage at a startup is embarrassing. A 30-minute outage at a bank, a hospital, or a stock exchange can violate regulations, lose millions of dollars, or harm people.

**The fundamental shift:** At a startup, you optimize for *moving fast*. At an enterprise, you optimize for *being reliable, secure, and auditable*. The same code change that takes 20 minutes at a startup might take 3 weeks at an enterprise — and the enterprise process is often the *correct* answer for their context.

**What changes at enterprise scale:**
- Code goes through multiple reviewers, often from different teams
- Changes are deployed gradually (1% of users, then 10%, then 50%, then 100%)
- Everything is logged, audited, and retained for years (often by law)
- Infrastructure is built in-house on top of cloud primitives, not bought as SaaS
- There are dedicated teams for things like security, observability, and platform engineering
- Hiring, onboarding, and process can take months

**The 2026 enterprise stack at a glance:**
- **Languages:** A mix of Go, Java, Python, TypeScript, and (in some places) Rust
- **Architecture:** Microservices (each service owned by a small team)
- **Container orchestration:** Kubernetes (often a customized internal platform)
- **Service mesh:** Istio or Linkerd (for service-to-service communication)
- **CI/CD:** Internal platforms built on GitHub Actions, Jenkins, or proprietary systems
- **Observability:** Datadog, Honeycomb, internal tooling
- **Identity:** Okta, internal SSO (single sign-on)

**Mental model:** Solo dev = cooking at home. Startup = small restaurant. Enterprise = international airline. Yes, both can technically "transport people," but the airline has pilots, mechanics, regulators, security checkpoints, redundant systems, multilingual staff, and detailed safety procedures — and you absolutely do not want it to operate like a food truck.

**If you only remember one thing:** Enterprise process exists to manage risk at scale. It looks slow because it's solving problems you don't see until you're at scale yourself.
:::

This chapter describes how web development actually happens at large companies: enterprise SaaS, FAANG-tier consumer apps, regulated industries (finance, healthcare, government), and any organization where engineering investment is measured in hundreds of millions of dollars per year.

The fundamental shift from small-company work: **at this scale, your job is not just to write code, but to navigate an organization while writing code.** The technical work matters; the coordination, process, and politics around it matter at least as much.

## How this chapter is organized

Each page focuses on one slice of enterprise engineering with worked examples and beginner callouts. Read them in order the first time; revisit individual pages later when you need a refresher.

### Setting the stage

1. [The Enterprise Mindset](/docs/enterprise/enterprise-mindset) — The trade-offs that govern every large-company decision.
2. [Team Structure at This Scale](/docs/enterprise/team-structure) — Product teams, platform teams, specialized functions, career ladders.

### Phase-by-phase walkthrough

3. [Phase 1: Discovery & Planning](/docs/enterprise/planning) — OKRs, PRDs, RFCs, cross-functional reviews.
4. [Phase 2: Architecture](/docs/enterprise/architecture) — Microservices, API gateways, service meshes, event buses.
5. [Phase 2.5: Frontend Architecture at Scale](/docs/enterprise/frontend-architecture) — Design systems, micro-frontends, performance budgets.
6. [Phase 3: Developer Experience](/docs/enterprise/developer-experience) — Monorepos, internal CLIs, Backstage, service catalogs.
7. [Phase 4: Development Practices](/docs/enterprise/development-practices) — Trunk-based development, code review, fitness functions.
8. [Phase 5: Testing at Scale](/docs/enterprise/testing) — Contract tests, chaos engineering, security testing, compliance testing.
9. [Phase 6: CI/CD at Scale](/docs/enterprise/ci-cd) — Distributed builds, test sharding, progressive delivery, GitOps.
10. [Phase 7: Deployment & Infrastructure](/docs/enterprise/deployment) — Kubernetes, IaC, multi-region, secrets management.
11. [Phase 8: Observability at Scale](/docs/enterprise/observability) — Metrics, logs, traces, SLOs, post-mortems.
12. [Phase 9: Security and Compliance](/docs/enterprise/security-compliance) — AppSec, SOC 2, HIPAA, PCI, threat modeling.
13. [Phase 10: Release Management](/docs/enterprise/release-management) — Freezes, release trains, change advisory, rollback.

### Reality check

14. [A Realistic Cost Picture](/docs/enterprise/cost-picture) — What infrastructure actually costs at this scale.
15. [Common Pitfalls Even at This Scale](/docs/enterprise/pitfalls) — Cargo-cult microservices, process for process's sake.
16. [A Day in the Life of a Senior Engineer at Scale](/docs/enterprise/day-in-life) — An hour-by-hour walkthrough.
17. [When to Use This Workflow](/docs/enterprise/when-to-use) — Which enterprise practices to adopt and when.
18. [When You're "Too Big" for This Workflow](/docs/enterprise/too-big) — Where this guide stops applying.

---

When you finish, move on to [Chapter 7: Side-by-Side Comparison](/docs/comparison).
