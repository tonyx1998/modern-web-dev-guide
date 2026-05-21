---
id: large-company-workflow
title: 6. Large Company Workflow
sidebar_position: 7
sidebar_label: 6. Enterprise
description: Enterprises (500+ engineers). Microservices, Kubernetes, compliance, 99.99% uptime, SRE.
---

# Part 6: Large Company / Enterprise Workflow (500+ Engineers)

*Hundreds of engineers, regulatory scrutiny, 99.99% uptime, massive infrastructure.*

:::tip Beginner orientation
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

This file describes how web development actually happens at large companies: enterprise SaaS, FAANG-tier consumer apps, regulated industries (finance, healthcare, government), and any organization where engineering investment is measured in hundreds of millions of dollars per year.

The fundamental shift from small-company work: **at this scale, your job is not just to write code, but to navigate an organization while writing code.** The technical work matters; the coordination, process, and politics around it matter at least as much.

---

## The Enterprise Mindset

Large-company engineering is governed by a completely different set of trade-offs:

- **Reliability and security trump speed.** A bad deploy at this scale can cost millions in lost revenue, regulatory fines, or customer trust. Speed is sometimes deliberately constrained.
- **Process and tooling enable scale.** Without strong process, hundreds of engineers cannot coordinate without constant collisions.
- **Optimize for the median engineer, not the heroic one.** Systems must work even when the original authors leave the company. Documentation, runbooks, automation matter.
- **Everything is observable.** You cannot debug at scale without telemetry. You cannot improve what you cannot measure.
- **Multi-year horizons.** Architectural decisions persist for a decade. Cost of mistakes is enormous.
- **Compliance is not optional.** Regulations dictate many decisions.
- **Hiring is constant.** People rotate; institutional knowledge must live in systems and docs.

The opposite mistake — the failure mode of this stage — is **process for process's sake.** Reviews that take weeks because the right person is on vacation. Approval workflows that have no actual approver. Templates that nobody reads. Senior leadership must actively prune.

---

## Team Structure at This Scale

A typical large-company engineering org:

### Product Engineering Teams
- **5–10 engineers per team**, often more.
- Hundreds of such teams in a large org.
- Each team owns specific features or services.
- Reports up through a hierarchy: Engineering Manager → Director → VP → CTO.

### Platform / Infrastructure Teams
- Build internal tools that product teams use.
- "Internal customers are still customers" — these teams have product managers and user research.
- Examples: build systems, CI/CD platform, deployment platform, observability platform, secrets management, identity, design system.

### Specialized Functions
- **Security teams** — AppSec, infrastructure security, compliance, identity, red team.
- **SRE (Site Reliability Engineering)** — Keep production running; design for reliability.
- **Data engineering / ML platform** — Pipelines, warehouses, ML infrastructure.
- **Design systems team** — Owns shared UI components and design tokens.
- **Release engineering** — Owns build infrastructure, deployment tooling.
- **Developer experience (DevEx)** — Improves engineer productivity (tools, docs, onboarding).
- **Localization** — Handles internationalization at scale.

### Management and Coordination
- **Engineering managers** (each managing 5–10 engineers).
- **Engineering directors** (each managing 3–8 EMs).
- **VPs of Engineering** for major business areas.
- **CTO** as the technical leader.
- **Program managers** coordinate across teams.
- **Technical Program Managers (TPMs)** for complex cross-team initiatives.
- **Architects** (Principal/Staff engineers) shape technical direction.

### Career Ladders

Engineers have two parallel tracks:
- **IC (Individual Contributor) track:** Engineer → Senior → Staff → Principal → Distinguished.
- **Management track:** Engineer → EM → Director → VP → CTO.

Both are valid careers. Senior ICs (Staff, Principal) often have more leverage than equivalent-level managers.

---

## Phase-by-Phase Walkthrough

### Phase 1: Discovery & Planning

Planning is a discipline at this scale.

**Strategic planning (quarterly/annual):**
- Top-down OKRs from CEO/leadership cascade through the org.
- Each team picks objectives that ladder to higher-level goals.
- Cross-team dependencies are mapped.
- Budgets and headcount allocations follow planning cycles.

**Product Requirements Documents (PRDs):**
- 10–30 pages, sometimes more.
- Include user research, market analysis, competitive landscape.
- Specify success metrics, edge cases, accessibility considerations.
- Reviewed by product, engineering, design, legal, security, privacy.
- Multiple revision rounds.

**Engineering Design Docs / RFCs:**
- Engineers propose technical approaches in written form.
- Include alternatives considered with trade-offs.
- Cross-team impact analysis.
- Capacity planning ("this feature will generate ~X RPS at peak").
- Reviewed by senior engineers across affected teams.
- Often a multi-week process.

**Cross-functional reviews:**
- **Security review** — Threat modeling for new features touching auth, payments, or data.
- **Privacy review** — GDPR, CCPA, HIPAA implications. Data flow diagrams.
- **Legal review** — Terms of service implications, regulatory exposure.
- **Accessibility review** — WCAG compliance.
- **Localization review** — Does this work across all supported languages and regions?
- **Operations review** — Runbook, monitoring, rollback plans before launch.

**Program management:**
- TPMs coordinate dependencies across teams.
- Gantt charts, dependency graphs, weekly status updates.
- Risks tracked formally with owners and mitigation plans.

This planning overhead is real, but at enterprise scale, the cost of misaligned work across hundreds of engineers far exceeds the cost of planning.

### Phase 2: Architecture

**Microservices or service-oriented architecture (SOA)** is the norm at this scale:

- Dozens to thousands of services.
- Each service is owned by a specific team.
- Database-per-service pattern: each service owns its data; other services access it only via the service's API.
- Services communicate via gRPC (internal), REST/GraphQL (external), or events (Kafka).

```
┌──────────────────────────────────────────────────────────────┐
│                    External Users                            │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                       CDN / Edge                             │
│      (Cloudflare, Akamai, Fastly, custom)                    │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Load Balancers                            │
│              (regional, multi-AZ)                            │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│   (auth, rate limiting, request routing, response shaping)   │
└──────────────────────────────────────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Web BFF     │    │  Mobile BFF  │    │ Partner API  │
│ (Backend for │    │  Backend for │    │   Gateway    │
│  Frontend)   │    │   Frontend)  │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  Service Mesh (Istio, Linkerd)               │
│  (mTLS, retries, circuit breakers, distributed tracing)      │
└──────────────────────────────────────────────────────────────┘
                            │
       ┌──────┬──────┬──────┼──────┬──────┬──────┐
       ▼      ▼      ▼      ▼      ▼      ▼      ▼
   [User] [Order] [Pay] [Catalog] [Search] [Notif] [...]
   Service Service ...
       │      │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼      ▼
    (each has its own DB, cache, queues, observability)

┌──────────────────────────────────────────────────────────────┐
│           Shared Infrastructure                              │
│  - Kafka (event bus)                                         │
│  - Schema registry                                           │
│  - Secrets management (Vault)                                │
│  - Observability (Datadog, custom)                           │
│  - Feature flags (LaunchDarkly, Statsig)                     │
│  - Internal developer platform                               │
│  - Data warehouse (Snowflake, BigQuery)                      │
└──────────────────────────────────────────────────────────────┘
```

**Key architectural components:**

**API Gateway:** Routes external traffic, handles auth, rate limiting, request validation. Options: Kong, AWS API Gateway, custom-built.

**Service mesh:** Handles service-to-service concerns: mTLS, retries, timeouts, circuit breaking, load balancing, distributed tracing. Options: Istio, Linkerd, Consul Connect.

**Event bus:** Async communication between services. Services publish events; other services subscribe. Decouples services and provides durability. Options: Apache Kafka (dominant), Apache Pulsar, AWS Kinesis, Google Pub/Sub.

**Schema registry:** Enforces contracts between services. Protocol Buffers (Protobuf) or Avro schemas. Producers can't ship breaking changes to event schemas without consumers' consent.

**Feature flag system:** Controls rollouts at fine granularity. LaunchDarkly is dominant; Statsig is rising.

**Distributed caching:** Redis Cluster, Memcached. Reduces DB load.

**Data warehouse:** Snowflake, BigQuery, Databricks. Analytics and ML.

**Internal Developer Platform (IDP):** Abstracts cloud complexity from product engineers. Could be Backstage-based or custom. Provides:
- Service templates (create a new service from a template).
- Deployment tooling.
- Observability dashboards per service.
- Documentation portal.
- Service catalog.

### Phase 2.5: Frontend Architecture at Scale

Frontend at enterprise scale is its own discipline:

**Design system as code:**
- A private npm package (or set of packages) used by all product teams.
- Versioned semantically.
- Hundreds of components.
- Owned by a dedicated team with PMs and designers.
- Storybook for documentation and visual regression testing.
- Design tokens shared with Figma via tooling.

**Micro-frontends:**
- For very large apps, different teams ship independent UI pieces.
- **Module federation** (Webpack/Turbopack) allows runtime composition.
- **Iframes or web components** for stronger isolation.
- Trade-off: independent deploys per team vs. some duplication and complexity.

**Shared infrastructure:**
- SSR rendering platform (sometimes built in-house, e.g., Airbnb's Hypernova).
- A/B testing framework.
- Analytics instrumentation.
- Feature flags.
- Error reporting.
- Performance monitoring (RUM).
- Internationalization (i18n) tooling.

**Performance budgets:**
- Specific limits on bundle size, time-to-interactive, largest contentful paint.
- Automated alerts when budgets are exceeded.
- Tied to release approvals.

### Phase 3: Developer Experience

The defining feature of mature enterprise engineering: **internal platforms that make engineers productive.**

**Monorepo or polyrepo:**
- **Monorepo** (Google, Facebook, Uber, Airbnb model) — everything in one giant repo. Tools: Bazel, Buck, Pants. Strong code sharing; coordinated migrations.
- **Polyrepo** (Amazon model) — each service in its own repo. Independent versioning; weaker code sharing.

Both work; the choice depends on culture and tooling investment.

**Bootstrapped development environments:**
- New engineers run one command and get a working setup.
- All toolchains, credentials, secrets, services automatically configured.
- Often via cloud development environments (Codespaces, Coder, Gitpod, or custom).

**Internal CLI tools:**
- `acme deploy production` instead of complex `kubectl apply` commands.
- `acme logs --service users --last 1h` for log access.
- `acme test --integration` for unified test runners.
- These tools abstract platform complexity and enforce best practices.

**Backstage:**
- Spotify's open-source internal developer portal.
- Dominant in 2026 as the service catalog and docs portal.
- Hosts plugins for CI/CD status, observability links, on-call info, runbooks.

**Service catalog:**
- Every service registered with its owner team, dependencies, SLOs, runbooks, on-call rotation.
- Discoverable: "who owns the notification service?" → click → contact info, dashboards, code links.

**Code search and navigation:**
- Sourcegraph or in-house tools index all repos.
- Jump-to-definition across the whole codebase.
- Find all usages of a function company-wide.

**Migration tooling:**
- Codemods (jscodeshift, semgrep) for automated refactors across thousands of files.
- Migration tracking dashboards.
- Long-running migrations are tracked formally with deadlines.

### Phase 4: Development Practices

**Trunk-based development with feature flags:**
- Long-lived branches are forbidden — they cause integration pain.
- Engineers commit to `main` (or develop branches that merge within hours).
- Incomplete features hidden behind feature flags.
- Continuous integration in the strictest sense.

**Strict code review:**
- Usually 2+ approvers required.
- Code owners must approve changes to their areas (configured via `CODEOWNERS` file).
- Security review for sensitive changes (auth, crypto, payments).
- Architecture review for cross-cutting changes.

**Automated checks on every commit:**
- Linting (extensive, often custom rules).
- Type checking (TypeScript strict mode, mypy strict, etc.).
- Unit tests with coverage minimums.
- Security scans (SAST, dependency vulnerability scanning).
- License compliance (no GPL code in proprietary product).
- Performance budgets.
- Accessibility checks.

**Architectural fitness functions:**
- Automated tests that enforce architectural rules.
- Example: "no service should import directly from another service's internal modules."
- Example: "API responses must include a trace ID header."
- These run in CI; violations block merges.

**Internal libraries and frameworks:**
- Strong opinions on how to build at this company.
- Custom HTTP client with built-in metrics, tracing, retries.
- Custom database access layer with audit logging.
- Custom error handling that ties into observability.

### Phase 5: Testing at Scale

The testing pyramid expands dramatically:

**Unit tests:** Tens of thousands. Strict coverage requirements (often 80%+ for critical services).

**Integration tests:** Per-service, against test instances of dependencies (or contract tests).

**Contract tests:** Pact or similar. Verify services adhere to their published API contracts. Critical in microservices.

**End-to-end tests:** Limited and carefully maintained. Flaky E2E tests are a known plague at scale; teams invest heavily in fixing or removing them.

**Load tests:** Tools like k6, Gatling, JMeter, or in-house. Simulate production traffic patterns. Run before major releases.

**Chaos engineering:** Tools like Chaos Monkey, Gremlin, LitmusChaos deliberately break things in production (or staging) to verify resilience. "Do failovers actually work?" The answer is often "no" until tested.

**Game days:** Scheduled exercises where teams simulate failures and rehearse responses.

**Security testing:**
- **SAST (Static)** — Semgrep, CodeQL, Snyk Code.
- **DAST (Dynamic)** — OWASP ZAP, Burp Suite Enterprise.
- **SCA (Dependencies)** — Snyk, Dependabot, custom scanners.
- **Container scanning** — Trivy, Clair.
- **Infrastructure scanning** — Checkov, tfsec.
- **Penetration testing** — Quarterly or continuous via bug bounty.
- **Red team exercises** — Periodic.

**Compliance testing:**
- Automated checks for HIPAA, PCI-DSS, SOX, GDPR requirements.
- Audit trail verification.
- Data retention enforcement.

### Phase 6: CI/CD at Scale

CI/CD pipelines are themselves engineered products:

**Distributed builds:**
- Tools like Bazel that cache build artifacts.
- BuildBuddy, Turborepo Remote Cache, EngFlow for remote build caching.
- A 4-hour sequential build runs in 8 minutes parallel + cached.

**Test sharding:**
- Tests split across hundreds of parallel runners.
- Smart test selection: only run tests affected by changes.

**Build orchestration:**
- Jenkins, Buildkite, CircleCI, custom systems.
- Tens of thousands of builds per day.

**Progressive delivery:**

```
Code merged to main
        │
        ▼
   Built + tested
        │
        ▼
 Deployed to canary (1% of traffic)
        │
        ▼
   Monitor for 30 minutes
   ├── Error rate up? → rollback
   ├── Latency up?   → rollback
   └── Healthy        → continue
        │
        ▼
 Deployed to 10% of traffic
        │
        ▼
   Monitor 2 hours
        │
        ▼
 Deployed to 50% of traffic
        │
        ▼
   Monitor 6 hours
        │
        ▼
 Deployed to 100% of traffic
```

Automated rollback on SLO regression is standard at this scale.

**GitOps:**
- Argo CD or Flux manages Kubernetes deployments.
- Git repo is the source of truth for what's deployed.
- Changes to infrastructure go through code review like any other change.

### Phase 7: Deployment & Infrastructure

**Kubernetes is dominant:**
- Self-managed K8s on AWS EKS, GCP GKE, Azure AKS, or bare metal.
- Internal abstractions hide K8s complexity from product engineers.
- Service templates: engineers don't write raw Kubernetes manifests.
- Helm charts or Kustomize for manifest management.
- Internal "platform-as-product" approach.

**Compute alternatives:**
- **Serverless** (Lambda, Cloud Run) for specific use cases (webhook handlers, infrequent jobs).
- **Batch compute** (AWS Batch, GKE jobs) for ML training, ETL.
- **Edge functions** for latency-critical user-facing logic.

**Infrastructure as Code:**
- Everything provisioned via Terraform, Pulumi, or AWS CDK.
- No clicking in cloud consoles for production.
- Changes reviewed and approved like code.
- State files stored securely (Terraform Cloud, S3 + DynamoDB locks).

**Multi-region, multi-AZ:**
- Workloads run across multiple availability zones (always) and multiple regions for disaster recovery.
- Active-active or active-passive depending on workload.
- Data replication strategy: synchronous (consistent, latency-bound) or asynchronous (eventual, but faster writes).

**Service mesh:**
- Istio or Linkerd handles inter-service mTLS, retries, circuit breaking, observability.
- Sidecars (or sidecarless via eBPF) inject these capabilities transparently.

**Secrets management:**
- HashiCorp Vault, AWS Secrets Manager, Google Secret Manager.
- Short-lived credentials.
- Automated rotation.
- Audit logs of every access.

**Cost optimization:**
- FinOps discipline.
- Resources tagged with owner team for chargeback.
- Reserved capacity, savings plans, spot instances.
- Continuous cost monitoring; teams that exceed budgets get pinged.
- Cloud bills at this scale are tens to hundreds of millions of dollars per year.

### Phase 8: Observability at Scale

The full stack:

**Metrics:** Prometheus, Datadog, custom platforms.
- SLOs (Service Level Objectives) defined for every service.
- Standard metrics: RED (Rate, Errors, Duration), USE (Utilization, Saturation, Errors).
- Hundreds of millions of data points per second.

**Logs:** Centralized logging (Datadog, Splunk, Loki).
- Petabytes per day at the largest companies.
- Structured logging (JSON) with consistent fields.
- Log sampling for high-volume services to control costs.
- Searchable across all services with trace correlation.

**Traces:** Distributed tracing (Datadog APM, Honeycomb, Jaeger).
- Every request gets a trace ID.
- Spans for each service hop.
- Sampling (head-based or tail-based) to control volume.

**OpenTelemetry:**
- Vendor-neutral instrumentation standard.
- Increasingly the universal instrumentation layer.
- Allows switching backends without re-instrumenting code.

**Error tracking:** Sentry, Rollbar, or proprietary.

**Real User Monitoring (RUM):** Track actual user-perceived performance.

**Synthetic monitoring:** Continuous test traffic from multiple regions.

**Anomaly detection:** ML-based alerting on metric deviations.

**Incident management:** PagerDuty, Opsgenie, Incident.io.
- Formal on-call rotations.
- Severity classification (SEV1: customer-facing outage, SEV2: significant impact, etc.).
- Incident commanders for major incidents.
- Real-time chat rooms (Slack channel per incident).
- Post-mortems for every SEV1/SEV2.

**Post-mortems:**
- Blameless format.
- Timeline, root cause, contributing factors, what went well, what didn't.
- Action items with owners and deadlines.
- Shared org-wide for learning.

**Error budgets:**
- If a service's SLO is 99.9% and it's been at 99.85% this month, the budget is burned.
- Feature work pauses until reliability is restored.
- Forces ownership of reliability by the team.

**Standard SLI/SLO/SLA terms:**
- **SLI (Service Level Indicator)** — A metric (e.g., "percentage of requests under 200ms").
- **SLO (Service Level Objective)** — Internal target (e.g., "99.9% of requests under 200ms over 30 days").
- **SLA (Service Level Agreement)** — External commitment to customers (typically less strict than SLO, e.g., "99.5%").

### Phase 9: Security and Compliance

Full disciplines at this scale:

**AppSec team:**
- Reviews high-risk changes.
- Runs SAST/DAST/SCA.
- Manages bug bounty.
- Threat modeling for new services.
- Security training for engineers.

**Infrastructure security:**
- Network policies (deny-by-default).
- IAM with least privilege.
- Encryption at rest and in transit.
- Hardware security modules for key material.
- Zero-trust networking (no service implicitly trusts another).

**Compliance:**
- **SOC 2 Type II** — Annual audit.
- **ISO 27001** — International information security standard.
- **HIPAA** — Healthcare data in the US.
- **PCI-DSS** — Payment card data.
- **FedRAMP** — US federal government workloads.
- **GDPR** — EU users.
- **CCPA / CPRA** — California users.
- **SOX** — Public companies' financial data.
- **GLBA** — Financial services.
- **FERPA** — Education records.

Each requires specific controls, documentation, and audits.

**Identity and access:**
- SSO for all internal tools (Okta, Microsoft Entra).
- MFA mandatory.
- Just-in-time access (request elevated privileges for limited time).
- Comprehensive audit logs.

**Vulnerability management:**
- Continuous scanning of dependencies, containers, infrastructure.
- SLAs for patching (e.g., critical vulnerabilities patched within 7 days).
- Tracking dashboards.

**Penetration testing:**
- Quarterly or annually.
- Continuous via bug bounty programs (HackerOne, Bugcrowd).

**Threat modeling:**
- Required for new services or major changes.
- STRIDE methodology common.
- Outputs feed into security review.

### Phase 10: Release Management

**Deployment freezes:**
- Most companies freeze deployments during high-traffic events (Black Friday, holidays).
- Only critical fixes deploy during freezes.

**Coordinated releases:**
- Major launches involve many services.
- Release trains: coordinated deploys at specific times.
- Launch checklists, rollback plans, war rooms.

**Change advisory:**
- Regulated industries (banking, healthcare) often have Change Advisory Boards (CABs).
- All production changes reviewed and approved.
- Adds significant overhead but required for compliance.

**Feature launches:**
- Code ships dark (behind flag).
- Internal testing (dogfooding).
- Beta cohort.
- Gradual GA rollout.
- Marketing aligns with technical milestones.

**Rollback procedures:**
- Every change must have a documented rollback plan.
- Rollback exercises practiced regularly.
- Database migrations designed to be reversible or non-blocking.

---

## A Realistic Cost Picture

Cloud infrastructure for a major SaaS or consumer product at large scale:

| Category                          | Approximate monthly cost  |
|-----------------------------------|---------------------------|
| Compute (EKS, EC2, etc.)          | $1M–$30M+                 |
| Storage and data transfer         | $500K–$10M                |
| Databases (RDS, Spanner, etc.)    | $500K–$10M                |
| Observability (Datadog, Splunk)   | $200K–$5M                 |
| CDN (Cloudflare, Akamai)          | $100K–$5M                 |
| Third-party SaaS (GitHub Enterprise, JetBrains, security tools) | $100K–$2M |
| **Total cloud + tools**           | **$2M–$50M+/month**       |

Engineering payroll dwarfs infrastructure: a 1,000-engineer org costs $300M+/year in fully-loaded compensation. Infrastructure is typically 20–30% of total tech spend; sometimes higher for data-heavy companies.

---

## Common Pitfalls Even at This Scale

### Cargo-Cult Microservices

Companies adopt microservices because Netflix or Google did, without the operational maturity. Result: **distributed monoliths** — services that must be deployed together, with extra latency and complexity. Worst of both worlds.

Recovery: Consolidate services that change together. Sometimes "back to monolith" (or modular monolith) is the right move.

### Internal Platforms That Don't Serve Users

Platform teams build for themselves, not for product engineers. Sophisticated systems nobody wants to use. Adoption is low; engineers route around the platform.

Fix: Treat product engineers as customers. Run user research. Measure adoption. Iterate based on feedback.

### Tech Debt Avalanche

Without dedicated investment, a 10-year-old codebase becomes nearly unmaintainable. Engineers spend more time fighting the codebase than building features.

Fix: Allocate explicit time for tech debt. Track it visibly. Tie payoff to business outcomes. Don't allow "we'll do it next quarter" for years.

### Acquisition Chaos

Acquired teams bring different stacks. Integrating them takes years and often never fully completes. Companies end up with three CI systems, four secrets managers, ten ways to deploy.

Fix: Have an acquisition integration playbook. Set integration timelines and budgets up front.

### Tooling Proliferation

Dozens of overlapping observability tools, three CI systems, four secrets managers, ten different package managers. Each team makes locally optimal choices that are globally bad.

Fix: Platform teams enforce standards. Provide easy paths for common choices. Make non-standard choices require justification.

### Process for Process's Sake

Reviews that take weeks. Approvals from people who don't read the code. Meetings about meetings. Templates that nobody reads.

Fix: Senior engineering leadership must actively prune. Ask "what value does this provide?" for every process. Cut what doesn't justify itself.

### Bureaucratic Risk Aversion

Every action requires approvals. No one can ship without sign-off from five people. Innovation dies.

Fix: Distinguish reversible from irreversible decisions. Empower teams for reversible choices. Require approvals only for genuinely high-stakes changes.

### Communication Overhead

Hundreds of meetings per day across the org. Engineers spend more time in meetings than coding.

Fix: Default to async (docs, recorded videos). Cap meeting times. Require agendas. Cancel meetings that have served their purpose.

### Talent Mismatch

Hiring senior engineers expecting to write code, then they spend all their time in meetings. Burnout, churn.

Fix: Be honest in hiring about the role. Some senior IC positions involve more architecture, mentoring, and coordination than coding. Match expectations.

### Knowledge Silos

Senior engineers hold critical knowledge in their heads. When they leave, productivity collapses.

Fix: Documentation requirements. Pair programming. Rotation. "Bus factor" reviews.

---

## A Day in the Life of a Senior Engineer at Scale

**9:00 AM** — Triage the on-call queue. One service had elevated latency overnight; root cause was a slow query. File a follow-up ticket.

**9:30 AM** — Stand-up with team. Quick sync on priorities.

**10:00 AM** — Review an RFC from a peer team about a new event schema. Leave comments about backward compatibility concerns.

**10:30 AM** — 1:1 with a more junior engineer. Discuss their growth plan; review their recent design doc.

**11:00 AM** — Coding: implementing the actual feature for this sprint. Push a draft PR.

**12:00 PM** — Lunch with cross-team colleagues. Informal alignment on an upcoming migration.

**1:00 PM** — Architecture review for a major proposal from another team. Hour-long discussion of trade-offs.

**2:00 PM** — Code review queue. Approve two PRs; request changes on one.

**3:00 PM** — Post-mortem for last week's incident. Discuss what we'll change to prevent recurrence.

**4:00 PM** — More coding. Address review feedback on yesterday's PR.

**5:00 PM** — Write a brief design doc for next sprint's work.

**6:00 PM** — Done for the day.

The work mix is roughly: 30–40% coding, 20% reviewing others' code/docs, 20% meetings and design discussions, 10% mentoring, 10% incident/on-call work. The exact mix varies by role and seniority.

---

## When to Use This Workflow

Not every company at "500+ engineers" needs all of the above. The scale at which different practices become valuable varies:

- **Service mesh** — Becomes valuable around 30–50 services or 50–100 engineers in microservices.
- **Internal developer platform** — Justified once you have 5+ teams routinely setting up new services.
- **SOC 2 / formal security program** — When you sell to enterprises or handle sensitive data.
- **Chaos engineering** — When reliability matters more than incremental velocity.
- **Distributed tracing** — When services span multiple teams.

Adopt enterprise practices when their cost is justified by the org's scale, not because "big companies do this."

---

## When You're "Too Big" for This Workflow

Some scale-up companies (20,000+ engineers) develop their own paradigms that don't quite fit the patterns above. They:

- Build entirely custom infrastructure (not Kubernetes).
- Invent new languages (Hack at Meta, Carbon at Google).
- Have internal-only tools that effectively duplicate the commercial ecosystem.
- Operate at scales (billions of users) where standard advice doesn't apply.

This guide doesn't cover that level. If you're at Google, Meta, or Amazon scale, you have internal docs and traditions that supersede generic advice.

---

## Wrapping Up Part 6

Enterprise web development is qualitatively different from small-company work. The technical concepts are similar — HTTP, databases, frameworks — but the organizational dimension dominates.

Key takeaways:
- Investment in platforms and process scales with org size.
- Reliability and security are non-negotiable.
- Coordination overhead is real and substantial.
- Documentation, runbooks, and automation matter more than at smaller scale.
- The best enterprise engineering looks like a small company in disguise — small teams shipping fast on top of strong shared infrastructure.

**Next:** Part 7 puts all three workflows (personal, small, large) into a side-by-side comparison for easy reference.
