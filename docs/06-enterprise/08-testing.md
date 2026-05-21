---
id: testing
title: 'Phase 5: Testing at Scale'
sidebar_position: 9
sidebar_label: 8. Testing
description: Contract tests, load tests, chaos engineering, security testing (SAST/DAST/SCA), and compliance testing for enterprises.
---

# Phase 5: Testing at Scale

> **In one line:** The testing pyramid expands dramatically — tens of thousands of unit tests, contract tests between services, chaos engineering against production, plus dedicated security and compliance testing pipelines.

:::tip In plain English
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

:::info Highlight: untested failovers don't work
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

:::note Worked example: how Netflix discovered Chaos Engineering
Netflix's "Chaos Monkey" started as a tool that randomly terminated production EC2 instances during business hours. The hypothesis: if our system is truly resilient, killing a random instance shouldn't matter.

The first few months they ran it, things broke constantly. Each break uncovered a hidden assumption: "this service can't tolerate a dependency restart," "this retry logic has a bug," "this load balancer doesn't drain connections correctly."

Once they fixed every break Chaos Monkey found, they had genuinely resilient systems — not because they'd designed for resilience, but because they'd been forced to. That's the core idea of chaos engineering: never trust a recovery path that hasn't been exercised under stress.
:::

## What's next

→ Continue to [Phase 6: CI/CD at Scale](./ci-cd) — how all these tests actually run, in parallel, across tens of thousands of builds a day.
