---
id: testing
title: 'Phase 6: Testing at Scale'
sidebar_position: 9
sidebar_label: 8. Testing
description: Contract tests, load tests, chaos engineering, security testing (SAST/DAST/SCA), and compliance testing for enterprises.
---

# Phase 6: Testing at Scale

> **In one line:** The testing pyramid expands dramatically — tens of thousands of unit tests, contract tests between services, chaos engineering against production, plus dedicated security and compliance testing pipelines.

:::tip[In plain English]
At a startup, testing is "Vitest, Playwright for critical paths, maybe a Sentry alert." At an enterprise, testing is a whole org of disciplines: unit tests with coverage requirements, contract tests that verify services keep their promises, chaos engineering that *deliberately breaks production* to make sure failover works, plus security tooling that scans every dependency.

Why the expansion? Because at this scale, you can't keep the whole system in one engineer's head. The tests are how the system explains itself back to you.
:::

## The expanded pyramid

**Unit tests:** Tens of thousands. Strict coverage requirements (often 80%+ for critical services).

**Integration tests:** Per-service, against test instances of dependencies (or contract tests).

**Contract tests:** Pact or similar. Verify services adhere to their published API contracts. Critical in microservices.

**End-to-end tests:** Limited and carefully maintained. Flaky E2E tests are a known plague at scale; teams invest heavily in fixing or removing them.

**Load tests:** Tools like k6, Gatling, JMeter, or in-house. Simulate production traffic patterns. Run before major releases.

## Chaos engineering

- Tools like Chaos Monkey, Gremlin, LitmusChaos deliberately break things in production (or staging) to verify resilience.
- "Do failovers actually work?" The answer is often "no" until tested.

**Game days:** Scheduled exercises where teams simulate failures and rehearse responses.

:::info[Highlight: untested failovers don't work]
Every system claims to have automatic failover. At any scale, the actual fraction of failovers that work the first time you trigger them in anger is *much* lower than the fraction that worked on the design doc.

The only way to find out is to deliberately break things in a controlled setting. That's what chaos engineering and game days are for: stress-test your assumptions before reality stress-tests them at 3 AM on Black Friday.
:::

## Security testing

A full security testing stack:

- **SAST (Static)** — Semgrep, CodeQL, Snyk Code.
- **DAST (Dynamic)** — OWASP ZAP, Burp Suite Enterprise.
- **SCA (Dependencies)** — Snyk, Dependabot, custom scanners.
- **Container scanning** — Trivy, Clair.
- **Infrastructure scanning** — Checkov, tfsec.
- **Penetration testing** — Quarterly or continuous via bug bounty.
- **Red team exercises** — Periodic.

Each tool covers a different layer. SAST sees the source code, DAST sees the running app, SCA sees the dependency tree, container scanners see the image, IaC scanners see the Terraform. You need all of them because attacks come from all of those layers.

## Compliance testing

- Automated checks for HIPAA, PCI-DSS, SOX, GDPR requirements.
- Audit trail verification.
- Data retention enforcement.

Compliance testing is how you prove to auditors that the controls aren't just written down — they're actually enforced. Every quarter, the audit team runs the test suite and the output is the evidence that, for instance, all production database access was logged.

:::note[Worked example: how Netflix discovered Chaos Engineering]
Netflix's "Chaos Monkey" started as a tool that randomly terminated production EC2 instances during business hours. The hypothesis: if our system is truly resilient, killing a random instance shouldn't matter.

The first few months they ran it, things broke constantly. Each break uncovered a hidden assumption: "this service can't tolerate a dependency restart," "this retry logic has a bug," "this load balancer doesn't drain connections correctly."

Once they fixed every break Chaos Monkey found, they had genuinely resilient systems — not because they'd designed for resilience, but because they'd been forced to. That's the core idea of chaos engineering: never trust a recovery path that hasn't been exercised under stress.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Letting a flaky E2E suite rot in CI.** A 5% flake rate on 200 tests means roughly every run fails for "reasons." Engineers learn to re-run until green, which trains everyone to ignore real failures. Quarantine flaky tests immediately and either fix or delete them — don't let "it's just flaky" become acceptable.
- **Chasing a coverage percentage instead of meaningful tests.** 90% line coverage with shallow tests catches less than 60% with tests that exercise real edge cases. Don't set the coverage gate so high that teams game it with `expect(true).toBe(true)`.
- **Running chaos engineering without an error budget to absorb it.** If breaking a service in staging would derail the team's launch, nobody will let you do it. Chaos only works when the org genuinely accepts that finding a problem now is cheaper than finding it at 3 AM.
- **Bolting on contract tests after the fact.** Pact or similar contract tests work when producers and consumers both opt in from day one. Retrofitting them across an existing 50-service mesh is months of work and usually ends with half-finished adoption — start contracts when you start splitting services.
- **Treating security scanners as "noise from the AppSec team."** A SAST finding ignored for six months is a CVE waiting for an auditor. Triage on a schedule, suppress with a reason (not silently), and treat the dashboards like a queue, not a wall.
:::

## Page checkpoint

<Quiz id="enterprise-testing-page" title="Did enterprise testing stick?" sampleSize={3}>

<Question
  prompt="What is the core idea behind chaos engineering?"
  options={[
    { text: "Test failures should be ignored if they're flaky" },
    { text: "Never trust a recovery path that hasn't been exercised under stress — deliberately break things in controlled settings before reality does" },
    { text: "Only test in staging, never in production" },
    { text: "Replace unit tests with random fuzzing" }
  ]}
  correct={1}
  explanation="Most systems claim to have automatic failover, but the actual fraction of failovers that work first time is much lower than claimed. Chaos engineering and game days deliberately break things to surface hidden assumptions before a 3 AM Black Friday outage does."
  revisit={{ to: "/docs/enterprise/testing#chaos-engineering", label: "Chaos engineering" }}
/>

<Question
  prompt="What role do contract tests (e.g., Pact) play in a microservices architecture?"
  options={[
    { text: "They replace unit tests" },
    { text: "They verify services adhere to their published API contracts — critical when many independent teams depend on each other" },
    { text: "They test legal contracts with vendors" },
    { text: "They simulate production load" }
  ]}
  correct={1}
  explanation="Contract tests verify that each service still honors its published API contract. In a microservices world, that's how you catch a producer accidentally breaking a downstream consumer — before deploy, not in production at 3 AM."
  revisit={{ to: "/docs/enterprise/testing#the-expanded-pyramid", label: "Contract tests" }}
/>

<Question
  prompt="Why do enterprises need SAST, DAST, SCA, container scanning, and IaC scanning — all of them?"
  options={[
    { text: "Auditors require five tools" },
    { text: "Each tool sees a different layer (source code, running app, dependencies, image, infrastructure) — attacks come from all those layers" },
    { text: "Vendors bundle them together" },
    { text: "They're cheaper as a bundle" }
  ]}
  correct={1}
  explanation="SAST sees source code, DAST sees the running app, SCA sees dependencies, container scanners see images, IaC scanners see Terraform. You need all of them because real attacks exploit every layer — and one tool can't see what another sees."
  revisit={{ to: "/docs/enterprise/testing#security-testing", label: "Security testing stack" }}
/>

<Question
  prompt="The page warns that end-to-end tests at scale are 'a known plague.' What's the recommended response?"
  options={[
    { text: "Write more of them to compensate" },
    { text: "Delete them all and rely on monitoring" },
    { text: "Keep them limited and carefully maintained — invest heavily in fixing or removing flaky ones" },
    { text: "Run them only once a quarter" }
  ]}
  correct={2}
  explanation="Flaky E2E tests are a known plague at scale — they erode trust in CI and slow everyone down. Enterprises keep their E2E suite limited and carefully maintained, fixing or removing flaky tests rather than letting them rot."
  revisit={{ to: "/docs/enterprise/testing#the-expanded-pyramid", label: "E2E tests" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 7: CI/CD at Scale](./ci-cd) — how all these tests actually run, in parallel, across tens of thousands of builds a day.
