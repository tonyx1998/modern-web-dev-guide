---
id: observability-tools
title: Monitoring & Observability (Tools)
sidebar_position: 18
sidebar_label: 17. Observability Tools
description: The tooling for errors (Sentry), logs (Datadog, Axiom), metrics (Prometheus), traces (Honeycomb), and product analytics (PostHog).
---

# Monitoring & Observability (Tools)

> **In one line:** Sentry for errors, PostHog for analytics, Better Stack for uptime + logs. Reach for Datadog / Honeycomb / OpenTelemetry when you outgrow the basics.

:::tip[In plain English]
This page is the *tools* for observability. For the *concepts* (logs vs. metrics vs. traces, SLOs, alerting), see [Chapter 2 Phase 10](../lifecycle/observability).
:::

## Errors

| Tool       | Notes                                                          |
|-----------|----------------------------------------------------------------|
| **Sentry** | Default for almost everyone. Free tier is generous.            |

Sentry catches exceptions, deduplicates them by stack trace, alerts you on new errors, and shows you which release and which users were affected.

## Logs

| Tool                    | Notes                                                      |
|-------------------------|------------------------------------------------------------|
| **Datadog**              | Enterprise.                                                |
| **Better Stack / Axiom / Logtail** | Modern, developer-friendly.                       |
| **Grafana Loki**         | Open-source, self-host.                                    |

## Metrics

| Tool                    | Notes                                                      |
|-------------------------|------------------------------------------------------------|
| **Datadog**              | Enterprise.                                                |
| **Grafana + Prometheus** | Open-source, self-host. Dominant standard.                 |

## Traces

| Tool                    | Notes                                                      |
|-------------------------|------------------------------------------------------------|
| **Datadog APM**          | Enterprise.                                                |
| **Honeycomb**            | Excellent for distributed systems.                          |
| **Jaeger / Tempo**       | Open-source.                                                |

## Standard

- **OpenTelemetry (OTel)** — Vendor-neutral instrumentation. Send to any backend.

## Product analytics

| Tool                | Notes                                                         |
|---------------------|---------------------------------------------------------------|
| **PostHog**          | All-in-one, open-source. Includes analytics, replay, flags.  |
| **Mixpanel / Amplitude** | Mature.                                                  |

## Feature flags

| Tool              | Notes                                                           |
|-------------------|-----------------------------------------------------------------|
| **PostHog**        | Bundled.                                                       |
| **Statsig**        | Strong on experimentation.                                      |
| **LaunchDarkly**   | Enterprise standard.                                            |

## Incident management

| Tool              | Notes                                                           |
|-------------------|-----------------------------------------------------------------|
| **PagerDuty**      | Enterprise.                                                    |
| **Opsgenie**       |                                                                |
| **Incident.io**    | Modern, developer-friendly.                                     |
| **Better Stack On-call** | Bundled with Better Stack.                              |

:::info[Highlight: the 5-minute observability stack for a beginner]
Sign up for these three free tiers and you have professional-grade observability in 5 minutes:

1. **Sentry** — exception tracking.
2. **PostHog** — product analytics + feature flags.
3. **Better Stack** — uptime monitor + log aggregation.

Total cost: $0 for most personal projects. Setup time: 15 minutes including reading the docs. This setup will catch 95% of production issues you'll hit early on.
:::

## What's next

→ Continue to [Code Quality & Dev Tools](./code-quality) — linters, formatters, pre-commit hooks, monorepo tools.
