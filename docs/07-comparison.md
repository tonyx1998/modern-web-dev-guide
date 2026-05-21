---
id: comparison
title: 7. Side-by-Side Comparison
sidebar_position: 8
sidebar_label: 7. Comparison
description: Solo / startup / enterprise compared side by side across tools, processes, and costs.
---

# Part 7: Side-by-Side Comparison

*Quick-reference tables showing how all three scales differ across every dimension.*

:::tip Beginner orientation
**How to read this chapter:** Each table shows the same dimension (e.g., "How do they deploy code?") at three scales — solo, startup, enterprise. Reading them side-by-side is the fastest way to grasp how engineering culture changes with team size.

**The big takeaway in advance:** There is no single "correct" way to build software. What's reasonable at one scale is absurd at another. Kubernetes is overkill for a personal blog. A laptop deploy is unacceptable for a bank. The skill is matching tooling to context.

**If you're choosing a stack for a new project:** Find the row for your situation in each table and use those choices as your default.

**If you only remember one thing:** Engineering choices are scale-dependent. Don't copy a FAANG company's setup for your weekend project, and don't bring a weekend setup into an enterprise.
:::

This file is a reference. Skim it when you need a quick mental model of how a specific aspect (team structure, hosting, testing, etc.) differs across scales.

---

## At-a-Glance Comparison

| Aspect              | Personal              | Small Company           | Large Company                      |
|---------------------|-----------------------|-------------------------|------------------------------------|
| **Team size**       | 1                     | 2–50                    | 500–10,000+                        |
| **Time horizon**    | Weeks                 | 12–18 months            | 3–5 years                          |
| **Optimize for**    | Speed of shipping     | Speed + scalability     | Reliability + security + compliance |
| **Cost concern**    | Free tier maximization| Cost vs value           | FinOps as a discipline             |
| **Process**         | Almost none           | Lightweight             | Extensive, formal                  |
| **Risk tolerance**  | High (it's just yours)| Medium                  | Low (real consequences)            |
| **Stack churn**     | Whenever you want     | Stable for 1–2 years    | Multi-year stability               |
| **Cross-team coordination** | None         | Sometimes               | Constant                           |

---

## Team Structure

| Role                | Personal | Small Company    | Large Company             |
|---------------------|----------|------------------|---------------------------|
| **Engineers**       | 1        | 2–35             | 500+                      |
| **Specialists**     | None     | Emerging 10+     | Many specialized teams    |
| **Designers**       | 0–1      | 1–8              | Dozens (with design system team) |
| **Product managers**| 0–1      | 1–10             | Dozens                    |
| **DevOps/SRE**      | None     | 0–4              | Dedicated org             |
| **Security**        | None     | 0–1              | Security org              |
| **QA**              | None     | None             | Sometimes (per industry)  |
| **Platform engineers** | None  | 0–2 (later)      | Multiple platform teams   |
| **Engineering managers** | 0   | 0–4              | Many, with director/VP hierarchy |

---

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

---

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

---

## Development Workflow

| Aspect                   | Personal            | Small Company           | Large Company                    |
|--------------------------|---------------------|-------------------------|----------------------------------|
| **Branching**            | Push to main        | Trunk-based + short branches | Trunk-based + feature flags  |
| **Code review**          | Self                | 1+ reviewer             | 2+ reviewers, code owners, security review |
| **PR size**              | Whatever            | Small encouraged        | Strictly small required          |
| **Commit conventions**   | None                | Conventional Commits    | Conventional Commits + custom tools |
| **Pre-commit hooks**     | Optional            | Lint + format           | Lint + format + tests + secrets scan |
| **AI assistance**        | Heavy use           | Standard tool           | Approved tools, careful review   |

---

## Testing

| Type                  | Personal           | Small Company             | Large Company                   |
|-----------------------|--------------------|--------------------------|---------------------------------|
| **Unit tests**        | Optional           | Vitest, important paths   | Required, coverage targets      |
| **Integration tests** | None to few        | Per-feature              | Comprehensive                   |
| **E2E tests**         | Manual mostly      | Playwright, critical paths| Limited but maintained          |
| **Visual regression** | None               | Optional (Chromatic)     | Standard for design system      |
| **Load testing**      | None               | Before scaling events    | Continuous, automated           |
| **Contract testing**  | N/A                | Rare                     | Required for services           |
| **Chaos engineering** | None               | None                     | Yes                             |
| **Accessibility**     | Lighthouse occasionally | axe-core in CI       | Comprehensive a11y program      |
| **Security testing**  | None               | Dependabot + occasional pen test | SAST + DAST + SCA + pen test + bug bounty |

---

## CI/CD

| Aspect                  | Personal              | Small Company             | Large Company                   |
|-------------------------|-----------------------|--------------------------|---------------------------------|
| **CI tool**             | GitHub Actions / Vercel | GitHub Actions          | GitHub Actions / Buildkite / Jenkins / custom |
| **CI duration**         | Seconds to minutes    | 5–10 minutes             | Minutes (with caching and sharding) |
| **Deployment trigger**  | Push to main          | Merge to main            | Merge to main + approval        |
| **Deployment strategy** | Replace               | Rolling / blue-green     | Progressive (canary → 1% → 10% → 100%) |
| **Rollback**            | Vercel one-click      | Vercel / Railway one-click| Automated on SLO regression     |
| **Deployment frequency**| When ready            | Multiple per day         | Continuous, gated by flags      |
| **Deployment freeze**   | Never                 | Rare                     | Holiday + major launch freezes  |
| **Environments**        | Local + prod          | Local + preview + prod   | Local + dev + staging + canary + prod |

---

## Observability

| Aspect                   | Personal              | Small Company              | Large Company                  |
|--------------------------|-----------------------|----------------------------|--------------------------------|
| **Error tracking**       | Sentry free tier      | Sentry Team               | Sentry Enterprise / custom     |
| **Logs**                 | Vercel logs           | Better Stack / Axiom      | Datadog / Splunk / Loki        |
| **Metrics**              | Vercel Analytics      | PostHog / Better Stack    | Datadog / Prometheus / custom  |
| **Traces**               | None                  | Some                      | OpenTelemetry + Honeycomb/Datadog APM |
| **RUM**                  | Vercel Analytics      | Vercel / Sentry           | Custom + Datadog RUM           |
| **Synthetic monitoring** | None                  | Better Stack uptime       | Multi-region synthetic tests   |
| **Alerting**             | Email                 | Slack / email             | PagerDuty / Opsgenie           |
| **On-call**              | None                  | Informal rotation         | 24/7 follow-the-sun            |
| **Post-mortems**         | None                  | For big incidents         | Formal for SEV1/SEV2           |
| **SLOs**                 | None                  | Loose targets             | Formal SLO + error budget      |

---

## Security and Compliance

| Aspect                  | Personal              | Small Company             | Large Company                   |
|-------------------------|-----------------------|--------------------------|---------------------------------|
| **HTTPS**               | Yes (free SSL)        | Yes                      | Yes + HSTS preload              |
| **WAF**                 | None                  | Cloudflare default       | Custom rules                    |
| **Secrets management**  | Vercel env vars       | Doppler / 1Password      | Vault / cloud-native            |
| **Rate limiting**       | Sometimes             | Yes                      | Yes, sophisticated              |
| **MFA for admins**      | Recommended           | Required                 | Mandatory                       |
| **Penetration testing** | None                  | Annual                   | Continuous + quarterly          |
| **Bug bounty**          | None                  | Optional                 | Yes                             |
| **SAST/DAST**           | None                  | Snyk/Dependabot          | Comprehensive                   |
| **SOC 2**               | No                    | Type II at 20–30 employees | Yes                            |
| **HIPAA / PCI / etc.**  | No                    | If business demands       | Often multiple                 |
| **Threat modeling**     | None                  | For sensitive features   | Required for new services       |
| **AppSec team**         | No                    | No                       | Yes                             |

---

## Cost Profile

| Category                | Personal         | Small Company           | Large Company                   |
|-------------------------|------------------|-------------------------|---------------------------------|
| **Hosting**             | $0–$20/month     | $20–$500/month          | $1M–$30M+/month                 |
| **Database**            | $0–$20/month     | $25–$500/month          | $500K–$10M/month                |
| **Observability**       | $0/month         | $30–$300/month          | $200K–$5M/month                 |
| **Auth**                | $0/month         | $25–$300/month          | $50K–$500K/month (Okta etc.)    |
| **Email**               | $0–$20/month     | $20–$100/month          | $50K–$500K/month                |
| **CI/CD**               | $0/month         | $0–$50/month            | $50K–$500K/month                |
| **Tooling (GitHub, Linear, etc.)** | $0–$20/month | $200–$2,000/month | $100K–$1M/month                  |
| **Total infra**         | $1–$20/month     | $500–$5,000/month       | $2M–$50M+/month                 |
| **Engineering payroll** | N/A              | $50K–$5M/year           | $300M+/year                     |

The pattern: infrastructure is a small percentage of total spend at every scale, dominated by people costs.

---

## Time-to-Production

How long it takes a code change to reach users:

| Change Type         | Personal           | Small Company           | Large Company                   |
|---------------------|--------------------|------------------------|---------------------------------|
| **Typo fix**        | 2 minutes          | 10 minutes             | 1–4 hours                       |
| **Bug fix**         | 10 minutes         | 30 minutes – 2 hours   | 2 hours – 1 day                 |
| **Small feature**   | 1 hour             | Few hours              | Days (with reviews + tests)     |
| **Major feature**   | 1 day              | 1–2 weeks              | Weeks to months                 |
| **Architecture change** | Hours          | Days to weeks          | Months                          |
| **New service**     | N/A                | Days                   | Weeks (with platform onboarding)|

---

## Decision-Making Process

| Decision Type         | Personal            | Small Company             | Large Company                   |
|-----------------------|---------------------|---------------------------|---------------------------------|
| **Pick a library**    | Whim                | Engineer's call           | Often standardized              |
| **Major dependency**  | 30 minutes of research | Team discussion         | RFC + architecture review       |
| **New service**       | N/A                 | CTO approval              | Multi-team review + RFC         |
| **Database change**   | Just do it          | DBA-equivalent review     | Schema review + migration plan  |
| **New external API**  | Self                | Security check            | Vendor security review + procurement |
| **Hosting change**    | Self                | Team + CTO                | Architecture + finance + security |

---

## Hiring

| Aspect              | Personal     | Small Company              | Large Company                    |
|---------------------|--------------|----------------------------|----------------------------------|
| **Process**         | N/A          | 2–4 rounds, 1–2 weeks      | 5–7 rounds, 4–8 weeks            |
| **Interviewers**    | N/A          | 2–4 people                 | 5–10 people                      |
| **Decision time**   | N/A          | Days                       | 1–2 weeks                        |
| **Onboarding**      | N/A          | 1 week to productive       | 1–3 months to fully productive   |
| **Tech screen**     | N/A          | Take-home or live coding   | Multiple coding + system design + behavioral |
| **Compensation negotiation** | N/A | Direct, with the founder  | HR-led, comp bands, equity grants |

---

## Common Trade-Offs by Scale

Each scale has its own characteristic trade-offs:

### Personal Project
- **Optimize for:** Speed, fun, learning.
- **Sacrifice:** Process, scalability, redundancy, testing rigor.
- **Risk:** Building the wrong thing, not finishing, accumulating side projects.

### Small Company
- **Optimize for:** Product-market fit, customer responsiveness, sustainable velocity.
- **Sacrifice:** Enterprise polish, comprehensive compliance, deep specialization.
- **Risk:** Over-engineering, under-engineering, premature scaling, scaling too slowly.

### Large Company
- **Optimize for:** Reliability, security, scale, compliance.
- **Sacrifice:** Speed, individual autonomy, simplicity.
- **Risk:** Bureaucratic paralysis, internal politics, technical sclerosis, talent drain.

---

## Career Implications

Your stage affects what you'll learn:

### Personal Projects
- End-to-end ownership of everything.
- Best-in-class for learning the full stack.
- Trade-off: limited exposure to teamwork, code review, scale.

### Small Company
- Generalist work; touch everything.
- Direct user contact.
- Trade-off: less depth in any single area; less rigorous engineering practices.

### Large Company
- Deep specialization possible.
- Exposure to truly hard scaling problems.
- Strong engineering culture and mentorship (at the best companies).
- Trade-off: less personal impact; slower velocity; more process; potentially less variety.

Many successful engineers work in multiple stages over a career. Each teaches different skills.

---

## Choosing Your Workflow

Where do you sit?

```
Are you working alone?
├── Yes → Personal Project workflow (file 04)
└── No → How many engineers in your org?
        ├── 2–50 → Small Company workflow (file 05)
        └── 50+ → Large Company workflow (file 06)
            ├── Many product teams that ship independently → Yes, large company patterns apply
            └── Still feels like one team → Try staying with small-company patterns longer
```

The transitions are gradual. You don't wake up one morning and suddenly need Kubernetes. Adopt practices as their cost is justified by your scale.

---

## Wrapping Up Part 7

These comparisons aren't normative — there's no "right" scale. Each works well for its context. The skill is recognizing your scale and applying appropriate practices.

The biggest mistake is **applying the wrong scale's practices**:
- Personal project with enterprise process: nothing ships.
- Enterprise with personal-project practices: chaos.
- Small company with personal-project practices: chaos.
- Small company with enterprise practices: glacial.

**Next:** Part 8 explores how to make architectural and technology decisions at any scale.
