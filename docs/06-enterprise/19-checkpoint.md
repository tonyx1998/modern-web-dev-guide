---
id: enterprise-checkpoint
title: Chapter 6 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 6 — Enterprise. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 7.
---

# Chapter 6 Checkpoint

You've finished the Enterprise chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

In **Beginner mode**, you must pass (≥ 60%) to unlock the Next button and Chapter 7 in the sidebar. Switch the reading-level pill (top right) if you'd rather skip.

<Quiz id="enterprise-checkpoint" title="Enterprise checkpoint" sampleSize={5}>

<Question
  prompt="What's the single sentence that best captures the enterprise mindset?"
  options={[
    { text: "Move fast and break things — at scale" },
    { text: "Reliability and security trump speed; process enables coordination; optimize for the median engineer, not the heroic one" },
    { text: "Hire the best engineers and trust them to figure it out" },
    { text: "Ship features as fast as possible; fix bugs in production" }
  ]}
  correct={1}
  explanation="Enterprise engineering is governed by a different set of trade-offs from startup work. The three load-bearing ideas are: reliability and security beat speed, process exists to make hundreds of engineers coordinate without colliding, and systems are designed for the median engineer (new hire, on-call at 2 AM) rather than the heroic one."
  revisit={{ to: "/docs/enterprise/enterprise-mindset#the-governing-trade-offs", label: "Governing trade-offs" }}
/>

<Question
  prompt="At enterprise scale, who typically coordinates dependencies, deadlines, legal reviews, and marketing dates across many teams on a big launch?"
  options={[
    { text: "The CTO personally" },
    { text: "The most senior engineer on the project" },
    { text: "A TPM (Technical Program Manager)" },
    { text: "The on-call SRE" }
  ]}
  correct={2}
  explanation="At enterprise scale, the bottleneck on major launches is usually coordination — ten teams, multiple deadlines, legal reviews, marketing dates. A TPM is the role specifically built for that, and good TPMs are often the difference between a launch that ships and one that doesn't."
  revisit={{ to: "/docs/enterprise/team-structure#management-and-coordination", label: "TPMs and coordination" }}
/>

<Question
  prompt="How do PRDs and RFCs differ in an enterprise planning process?"
  options={[
    { text: "They're the same document with different file extensions" },
    { text: "A PRD covers the product picture (user research, success metrics, accessibility); an RFC covers the technical approach (alternatives considered, capacity, cross-team impact)" },
    { text: "PRDs are written by engineers; RFCs by lawyers" },
    { text: "PRDs are external; RFCs are internal" }
  ]}
  correct={1}
  explanation="A PRD (Product Requirements Document) answers 'what are we building, why, who needs to approve, and how will we know it worked.' An RFC (Engineering Design Doc) proposes a technical approach with alternatives, trade-offs, and capacity planning. Both are 10–30 pages and both go through cross-functional review."
  revisit={{ to: "/docs/enterprise/planning#product-requirements-documents-prds", label: "PRDs vs RFCs" }}
/>

<Question
  prompt="Which architectural piece in the enterprise stack is responsible for the 'single front door' for external traffic — authenticating requests, enforcing rate limits, and routing them to the right backend?"
  options={[
    { text: "The service mesh" },
    { text: "The event bus" },
    { text: "The API gateway" },
    { text: "The schema registry" }
  ]}
  correct={2}
  explanation="The API gateway is the single entry point for external traffic. It handles auth, rate limiting, and routing to backend services. The service mesh handles internal service-to-service concerns (mTLS, retries); the event bus handles async pub/sub; the schema registry enforces contracts on event payloads."
  revisit={{ to: "/docs/enterprise/architecture#key-architectural-components", label: "API gateway vs mesh" }}
/>

<Question
  prompt="Why does a design-system v3 upgrade often take six months to roll out at enterprise scale?"
  options={[
    { text: "Because designers are slower than engineers" },
    { text: "Because forcing 200 engineers to fix breaking changes simultaneously is far more expensive than a careful staged rollout with codemods, deprecation warnings, and a migration dashboard" },
    { text: "Because npm registries are slow at that scale" },
    { text: "Because the design system team only ships once per quarter" }
  ]}
  correct={1}
  explanation="A staged rollout — beta on one team, codemods for breaking changes, deprecation warnings, a migration dashboard visible to directors, and an EOL after two quarters — looks slow. But the alternative (forcing every team to fix breaking changes in the same week) would cost vastly more engineering time than the careful rollout."
  revisit={{ to: "/docs/enterprise/frontend-architecture#worked-example", label: "Design-system rollout" }}
/>

<Question
  prompt="At a well-tooled enterprise, what does Backstage typically act as?"
  options={[
    { text: "The CI runner" },
    { text: "The service catalog and developer portal — each service becomes a hub showing owner team, on-call schedule, runbooks, deploys, error rate, latency, and dependencies" },
    { text: "A replacement for Kubernetes" },
    { text: "An IDE for writing infrastructure code" }
  ]}
  correct={1}
  explanation="Backstage (Spotify's open-source developer portal) is dominant as the service catalog in 2026. A service in Backstage isn't just a registry entry — it's a hub. Click the 'checkout' service and you see who owns it, who's on call, the runbooks, the latest deploys, the error rate, the latency, and its dependencies."
  revisit={{ to: "/docs/enterprise/developer-experience#backstage", label: "Backstage" }}
/>

<Question
  prompt="Which combination of practices defines daily coding at enterprise scale?"
  options={[
    { text: "Long-lived feature branches, manual QA before merge, one reviewer per PR" },
    { text: "Trunk-based development with feature flags, 2+ reviewers, CODEOWNERS-enforced ownership, and dozens of automated CI checks (lint, type, security, license, performance, accessibility, fitness functions)" },
    { text: "Direct pushes to main with no review; CI catches everything" },
    { text: "Weekly release branches frozen before testing" }
  ]}
  correct={1}
  explanation="Daily enterprise coding is trunk-based dev with feature flags (long-lived branches are a ticking bomb), multiple reviewers, mechanically enforced ownership via CODEOWNERS, and a combined CI gate of lint, type-check, unit tests, SAST, dependency scan, license check, performance budget, accessibility check, and architectural fitness functions."
  revisit={{ to: "/docs/enterprise/development-practices#automated-checks-on-every-commit", label: "Automated checks" }}
/>

<Question
  prompt="A team has unit tests, integration tests, and end-to-end tests. They add Pact contract tests between services. What concrete failure mode are contract tests designed to catch?"
  options={[
    { text: "Slow tests that don't run in CI" },
    { text: "Memory leaks at runtime" },
    { text: "A producer service accidentally shipping a breaking change to a consumer that depends on its API — before it reaches production" },
    { text: "Flaky E2E tests" }
  ]}
  correct={2}
  explanation="In a microservices world, the failure mode contract tests catch is producer-vs-consumer drift: service A changes its API in a way that breaks service B. Without contract tests, you find out at 3 AM in production. With them, the producer's CI fails before merge."
  revisit={{ to: "/docs/enterprise/testing#the-expanded-pyramid", label: "Contract tests" }}
/>

<Question
  prompt="In a typical enterprise canary pipeline, what should happen when error rate on the 1% canary climbs from 0.1% to 4.7%?"
  options={[
    { text: "An engineer is paged to manually investigate before any action is taken" },
    { text: "Traffic widens to 10% so we get more data on the regression" },
    { text: "Automated rollback triggers, the manifest reverts to the previous version, and the author gets a Slack alert — usually within minutes, no human in the loop" },
    { text: "The canary is left running and the team waits for the next stand-up" }
  ]}
  correct={2}
  explanation="The whole point of automated SLO-based rollback is to take the human out of the loop for the obvious bad cases. Argo CD (or equivalent) reverts the manifest, traffic returns to the previous version, the author gets notified — total user impact is often 1% of users for 4 minutes instead of 100% for 45 minutes."
  revisit={{ to: "/docs/enterprise/ci-cd#worked-example", label: "Canary auto-rollback" }}
/>

<Question
  prompt="A new engineer is told 'production changes only happen through Terraform PRs — never click in the AWS console.' What's the primary reason for that rule at enterprise scale?"
  options={[
    { text: "The console is slow" },
    { text: "Console clicks leave no auditable trail; IaC commits do — and auditors (SOC 2, PCI, HIPAA) require an immutable, reviewable record of who changed what, when, and why" },
    { text: "AWS charges extra for console use at scale" },
    { text: "Terraform is faster than the console" }
  ]}
  correct={1}
  explanation="Every compliance regime wants to know 'who changed this firewall rule, when, and why?' The answer 'Joe clicked some buttons six months ago' fails audits. The answer 'here's the Terraform commit and PR' passes. IaC isn't just engineering hygiene — it's the only practical audit trail."
  revisit={{ to: "/docs/enterprise/deployment#infrastructure-as-code", label: "IaC for audits" }}
/>

<Question
  prompt="A team has an SLO of 99.9% for their service and is currently at 99.85% for the month. What does the page argue should happen?"
  options={[
    { text: "Nothing — they're close enough" },
    { text: "Push harder on shipping new features to make the quarter look good" },
    { text: "Their error budget is burned; feature work pauses until reliability is restored — this is the trade-off the budget exists to enforce" },
    { text: "Page the on-call until the number comes back up" }
  ]}
  correct={2}
  explanation="The error budget makes velocity-vs-reliability concrete and team-owned. 'We're at 99.85% against a 99.9% SLO' is a real, measurable constraint — feature work pauses until the team restores reliability. That's the entire point of having a budget instead of a vague aspiration."
  revisit={{ to: "/docs/enterprise/observability#error-budgets", label: "Error budgets in action" }}
/>

<Question
  prompt="Which best describes 'just-in-time (JIT) access' for production at enterprise scale?"
  options={[
    { text: "Engineers get standing admin credentials but only use them when needed" },
    { text: "Nobody has standing production access; elevated privileges are requested for a limited window (e.g., 1 hour), every action is logged, and the credential expires automatically" },
    { text: "Access is granted by the CTO via Slack" },
    { text: "All engineers get production DB access on day one" }
  ]}
  correct={1}
  explanation="JIT access removes standing production privileges. When an engineer needs to look at a prod database, they file a request, get a short-lived window (often 1 hour), and every action is logged. The blast radius of a compromised account is enormously smaller than with always-on access."
  revisit={{ to: "/docs/enterprise/security-compliance#identity-and-access", label: "JIT access" }}
/>

<Question
  prompt="A team is about to ship a destructive schema change: 'DROP COLUMN old_field' on a 1B-row production table. What does the chapter say a mature team should do instead?"
  options={[
    { text: "Take a maintenance window and do it overnight" },
    { text: "Run the migration manually in the prod console after-hours" },
    { text: "Split the migration across multiple deploys — add the new column, dual-write, switch reads, then drop the old column — so each deploy stays reversible" },
    { text: "Skip the rollback plan since 'DROP COLUMN' is fast" }
  ]}
  correct={2}
  explanation="An irreversible migration is a one-way door. Once it ships, rolling back the code requires restoring the data shape first. Mature teams design migrations as a sequence of reversible deploys — add column, dual-write, switch reads, then drop — so 'every change has a rollback plan' is actually achievable."
  revisit={{ to: "/docs/enterprise/release-management#rollback-procedures", label: "Reversible migrations" }}
/>

<Question
  prompt="An exec asks 'our Datadog bill is $4M/year — should we self-host Prometheus + Grafana + Loki + Tempo on $400K of EC2?' What's the chapter's framing of the answer?"
  options={[
    { text: "Yes — the math obviously saves $3.6M/year" },
    { text: "No — open-source observability at scale needs a ~5-engineer team (~$3M/year), and you lose features (anomaly detection, ML alerting) plus take on the on-call burden of your own critical infra. Usually a wash or worse" },
    { text: "Yes — observability is easy to self-host once you have Kubernetes" },
    { text: "It depends on the time of year" }
  ]}
  correct={1}
  explanation="The naive math says 'save $3.6M.' The real math adds ~$3M/year for a dedicated team to operate the OSS stack, lost SaaS features, and the on-call burden of running your own critical infrastructure. Most enterprises that do self-host are at a scale where they need features the SaaS doesn't offer — not because it's cheaper."
  revisit={{ to: "/docs/enterprise/cost-picture#worked-example", label: "Self-host trade-off" }}
/>

<Question
  prompt="A 200-engineer company adopts Bazel, builds its own internal-platform-as-a-service, writes its own deploy tool, and runs its own Kubernetes control plane — because 'that's how Google does it.' What does the chapter predict?"
  options={[
    { text: "They'll out-ship Google within a year" },
    { text: "They'll spend their engineering budget on tools instead of features, ship almost no product, and likely retreat to standard managed services (Vercel + AWS + vanilla Kubernetes) — at which point velocity finally recovers" },
    { text: "They'll attract better engineers because of the sophisticated platform" },
    { text: "Their cloud bill will drop dramatically" }
  ]}
  correct={1}
  explanation="FAANG-tier practices solve problems specific to 20,000+ engineers and billion-user scale. Copying them at 200 engineers is a great way to slow your own company to a crawl. The chapter's worked example shows exactly this — three years of brilliant platform, almost no product — followed by a retreat to standard tools and a 3x velocity recovery."
  revisit={{ to: "/docs/enterprise/too-big#worked-example", label: "Don't copy FAANG" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 7: Comparison](/docs/comparison) where we'll lay solo / startup / enterprise side-by-side.
