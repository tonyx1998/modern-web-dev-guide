---
id: observability
title: 'Phase 9: Observability at Scale'
sidebar_position: 12
sidebar_label: 11. Observability
description: Metrics, logs, traces, SLOs, OpenTelemetry, incident management, post-mortems, and error budgets at enterprise scale.
---

# Phase 9: Observability at Scale

> **In one line:** Metrics, logs, and distributed traces — collected via OpenTelemetry, stored in Datadog/Splunk/Honeycomb, tied to formal SLOs and error budgets, with blameless post-mortems for every major incident.

:::tip[In plain English]
At a startup, observability is "Sentry sends an email when something breaks." At an enterprise, observability is a whole engineering discipline: every service emits structured metrics, logs, and traces; every team has SLOs; every incident has a blameless post-mortem; and a dedicated on-call rotation is *always* awake somewhere on Earth.

The reason: at this scale, you cannot debug from logs and a gut feeling. You need data — billions of data points per day — and the tools to query it fast enough to matter during an outage.
:::

## The three pillars

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

The three pillars complement each other. Metrics tell you *something* is wrong. Traces tell you *which service* is wrong. Logs tell you *exactly what* happened.

## OpenTelemetry

- Vendor-neutral instrumentation standard.
- Increasingly the universal instrumentation layer.
- Allows switching backends without re-instrumenting code.

OpenTelemetry is the answer to "we want to change observability vendors without rewriting every service's instrumentation." Instrument once in OTel; route to Datadog today, Honeycomb tomorrow.

## Beyond the three pillars

- **Error tracking:** Sentry, Rollbar, or proprietary.
- **Real User Monitoring (RUM):** Track actual user-perceived performance.
- **Synthetic monitoring:** Continuous test traffic from multiple regions.
- **Anomaly detection:** ML-based alerting on metric deviations.

## Incident management

- PagerDuty, Opsgenie, Incident.io.
- Formal on-call rotations.
- Severity classification (SEV1: customer-facing outage, SEV2: significant impact, etc.).
- Incident commanders for major incidents.
- Real-time chat rooms (Slack channel per incident).
- Post-mortems for every SEV1/SEV2.

A SEV1 incident triggers a defined playbook: page the on-call, spin up an incident channel, assign an incident commander (who runs the response, not the debugging), keep a running timeline.

## Post-mortems

- Blameless format.
- Timeline, root cause, contributing factors, what went well, what didn't.
- Action items with owners and deadlines.
- Shared org-wide for learning.

:::info[Highlight: blameless post-mortems are a feature, not a politeness]
The blameless post-mortem isn't just being nice to whoever caused the incident. It's a *technical* design choice: when people feel safe admitting what happened, they tell you the truth, and you learn the real root cause. When people feel like they'll be punished, they hide details, and you learn nothing.

The single biggest predictor of an org's reliability is whether its post-mortems are honest. That requires the cultural commitment to never punish people for honest mistakes that the *system* should have prevented.
:::

## Error budgets

- If a service's SLO is 99.9% and it's been at 99.85% this month, the budget is burned.
- Feature work pauses until reliability is restored.
- Forces ownership of reliability by the team.

The error budget makes the trade-off between velocity and reliability concrete and team-owned. "We're out of budget this month" is a real constraint, not a vague feeling.

## Standard SLI/SLO/SLA terms

- **SLI (Service Level Indicator)** — A metric (e.g., "percentage of requests under 200ms").
- **SLO (Service Level Objective)** — Internal target (e.g., "99.9% of requests under 200ms over 30 days").
- **SLA (Service Level Agreement)** — External commitment to customers (typically less strict than SLO, e.g., "99.5%").

SLAs are what you promise paying customers. SLOs are stricter — they give you a buffer to catch problems before they violate the SLA. SLIs are the raw measurements that feed both.

:::note[Worked example: a SEV1 walkthrough]
A major customer-facing API starts returning 5xx errors. Timeline:

- **00:00** — Synthetic monitor in `us-west-2` reports failed checks; PagerDuty triggers.
- **00:02** — On-call engineer acknowledges; #incident-2147 Slack channel created.
- **00:05** — Severity declared (SEV1: customer-facing). Incident commander assigned.
- **00:10** — Status page updated; customer support notified.
- **00:15** — Dashboards show 5xx spike correlated to a deploy 20 minutes earlier; automated canary didn't catch the failure (regression hits a rare code path).
- **00:18** — Deploy rolled back.
- **00:25** — Metrics recover; incident downgraded.
- **00:45** — Status page closed; customers notified.

Two days later: blameless post-mortem. Root cause documented. Action items: improve canary coverage of this code path, add a specific synthetic for this user journey, add a regression test. All assigned to owners with deadlines.

That's enterprise incident management working as intended — fast detection, fast mitigation, durable learning.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Setting SLOs that nobody can actually breach.** A 99% SLO for a service that's been at 99.95% for two years isn't a target — it's wallpaper. The whole point of SLOs is that they sometimes fail and force a real conversation about reliability vs. velocity. Set them tight enough to be informative.
- **Logging everything because storage is cheap.** Petabyte-scale log retention turns observability into your second-biggest line item and your search-times into "how was your weekend?" Sample aggressively for high-volume services, retain selectively, and treat log volume as a budget — not as free.
- **Post-mortems that are only blameless on paper.** If the post-mortem document says "no blame" but the engineer who pushed the change gets passed over at promo, the next post-mortem will be filled with carefully edited half-truths. Blamelessness has to be enforced by the people who run calibrations, not just by the template.
- **Burning the error budget on toil and calling it "investment."** An on-call engineer firefighting the same alert every week isn't restoring reliability — they're paying interest forever. When the budget burns, *the team* pauses feature work to fix the underlying cause, not just patches the symptom.
- **Instrumenting straight to a vendor SDK instead of OpenTelemetry.** Vendor-specific instrumentation is fine until the vendor doubles prices or a regulator forces a regional change. Migrating instrumentation across 200 services later is a year of work — start with OTel and keep the option open.
:::

## Page checkpoint

<Quiz id="enterprise-observability-page" title="Did observability stick?" sampleSize={3}>

<Question
  prompt="How do the three pillars of observability complement each other?"
  options={[
    { text: "They're interchangeable — pick whichever your vendor supports" },
    { text: "Metrics say something is wrong, traces say which service is wrong, logs say exactly what happened" },
    { text: "Metrics are for engineers, logs are for managers, traces are for SREs" },
    { text: "Only metrics matter at scale" }
  ]}
  correct={1}
  explanation="The three pillars play distinct roles. Metrics surface that something is wrong (rate, errors, duration). Traces pinpoint which service in a distributed call chain is at fault. Logs reveal exactly what happened at that point. You need all three to debug at scale."
  revisit={{ to: "/docs/enterprise/observability#the-three-pillars", label: "Three pillars" }}
/>

<Question
  prompt="Why is the blameless post-mortem described as a technical design choice, not just politeness?"
  options={[
    { text: "It's required by SOC 2" },
    { text: "When people feel safe admitting what happened, they tell the truth and you learn the real root cause — fear hides details and you learn nothing" },
    { text: "It saves time in the meeting" },
    { text: "It's traditional at large companies" }
  ]}
  correct={1}
  explanation="Blamelessness is a reliability lever, not just a kindness. Honest post-mortems surface root causes; punitive cultures hide them. The single biggest predictor of an org's reliability is whether its post-mortems are genuinely honest."
  revisit={{ to: "/docs/enterprise/observability#post-mortems", label: "Blameless post-mortems" }}
/>

<Question
  prompt="What does an error budget concretely enforce?"
  options={[
    { text: "A cap on how much engineering time can be spent debugging" },
    { text: "If a service's SLO is 99.9% and it's been at 99.85% this month, the budget is burned — feature work pauses until reliability is restored" },
    { text: "A maximum number of incidents per quarter" },
    { text: "A cap on cloud spend per service" }
  ]}
  correct={1}
  explanation="The error budget makes the velocity-vs-reliability trade-off concrete and team-owned. 'We're out of budget this month' is a real constraint that pauses feature work until SLOs recover — turning reliability into something the team must manage, not a vague aspiration."
  revisit={{ to: "/docs/enterprise/observability#error-budgets", label: "Error budgets" }}
/>

<Question
  prompt="What's the difference between an SLO and an SLA?"
  options={[
    { text: "They mean the same thing" },
    { text: "An SLO is an internal target; an SLA is the external commitment to customers, typically less strict than the SLO to give you buffer" },
    { text: "An SLA is internal; an SLO is external" },
    { text: "An SLO is for backend services; an SLA is for frontend" }
  ]}
  correct={1}
  explanation="SLAs are what you promise paying customers. SLOs are stricter internal targets that give you buffer to catch problems before they violate the SLA. SLIs are the raw measurements underneath. The strictness order is SLI → SLO → SLA."
  revisit={{ to: "/docs/enterprise/observability#standard-sli-slo-sla-terms", label: "SLI/SLO/SLA" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 10: Security and Compliance](./security-compliance) — the discipline that overlays everything you've seen so far.
