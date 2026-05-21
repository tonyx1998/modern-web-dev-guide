---
id: observability
title: 'Phase 8: Observability at Scale'
sidebar_position: 12
sidebar_label: 11. Observability
description: Metrics, logs, traces, SLOs, OpenTelemetry, incident management, post-mortems, and error budgets at enterprise scale.
---

# Phase 8: Observability at Scale

> **In one line:** Metrics, logs, and distributed traces — collected via OpenTelemetry, stored in Datadog/Splunk/Honeycomb, tied to formal SLOs and error budgets, with blameless post-mortems for every major incident.

:::tip In plain English
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

:::info Highlight: blameless post-mortems are a feature, not a politeness
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

:::note Worked example: a SEV1 walkthrough
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

## What's next

→ Continue to [Phase 9: Security and Compliance](./security-compliance) — the discipline that overlays everything you've seen so far.
