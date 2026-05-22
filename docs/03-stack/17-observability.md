---
id: observability-tools
title: Monitoring & Observability (Tools)
sidebar_position: 18
sidebar_label: Observability Tools
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

## Page checkpoint

<Quiz id="stack-observability-tools-page" title="Did observability tools stick?" sampleSize={2}>

<Question
  prompt="What is Sentry's core job in your stack?"
  options={[
    { text: "Aggregate raw application logs for ad-hoc querying" },
    { text: "Catch exceptions, deduplicate them by stack trace, and alert you with affected release and user info" },
    { text: "Track product analytics like sign-ups and conversions" },
    { text: "Run uptime checks against your URL" }
  ]}
  correct={1}
  explanation="Sentry is the default error tracker: it groups exceptions by stack trace, alerts on new ones, and links each to a release and the users who hit it. Logs, metrics, and uptime live in other tools."
  revisit={{ to: "/docs/stack/observability-tools#errors", label: "Errors section" }}
/>

<Question
  prompt="What is OpenTelemetry (OTel) and why does it matter?"
  options={[
    { text: "A proprietary Datadog product for tracing" },
    { text: "A vendor-neutral standard for instrumenting your app — you instrument once and can send the data to any backend" },
    { text: "An open-source SaaS observability platform" },
    { text: "A replacement for Prometheus" }
  ]}
  correct={1}
  explanation="OTel is the open standard for emitting traces, metrics, and logs. Instrumenting with OTel means you can swap backends (Datadog, Honeycomb, Jaeger) without rewriting the instrumentation."
  revisit={{ to: "/docs/stack/observability-tools#standard", label: "OpenTelemetry" }}
/>

<Question
  prompt="What's the '5-minute observability stack' the page recommends for a beginner?"
  options={[
    { text: "Datadog APM + LaunchDarkly + PagerDuty" },
    { text: "Sentry (errors) + PostHog (analytics + flags) + Better Stack (uptime + logs)" },
    { text: "Grafana + Prometheus + Loki + Tempo, self-hosted" },
    { text: "AWS CloudWatch and nothing else" }
  ]}
  correct={1}
  explanation="The page's free-tier starter stack is Sentry + PostHog + Better Stack — exceptions, product analytics + flags, uptime + logs. Total cost typically $0 for personal projects and catches 95% of early production issues."
  revisit={{ to: "/docs/stack/observability-tools#errors", label: "5-minute observability stack" }}
/>

<Question
  prompt="Which tool sits in the 'all-in-one open-source' slot for product analytics, session replay, feature flags, and experiments?"
  options={[
    { text: "Sentry" },
    { text: "Honeycomb" },
    { text: "PostHog" },
    { text: "LaunchDarkly" }
  ]}
  correct={2}
  explanation="PostHog bundles analytics, session replay, feature flags, and experiments in one open-source platform. Mixpanel and Amplitude cover analytics; LaunchDarkly covers flags — PostHog combines all of it."
  revisit={{ to: "/docs/stack/observability-tools#product-analytics", label: "Product analytics" }}
/>

</Quiz>

## What's next

→ Continue to [Code Quality & Dev Tools](./code-quality) — linters, formatters, pre-commit hooks, monorepo tools.
