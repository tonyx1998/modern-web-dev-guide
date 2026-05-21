---
id: observability
title: 'Phase 10: Observability'
sidebar_position: 11
sidebar_label: 10. Observability
description: Know what your software is doing in production, especially when it's misbehaving. Logs, metrics, traces, error tracking, alerting.
---

# Phase 10: Observability

> **In one line:** Observability is your software's *senses* in production. Without it, you only know things broke when angry users tell you.

:::tip In plain English
Once your code is running in production, you can't just open the file and see what's happening. You need to *instrument* the code to emit signals — logs (text records), metrics (numbers over time), and traces (per-request follow-along). Then you collect those signals somewhere and look at them when things break. That whole practice is called **observability**.
:::

## The three pillars

### Logs — text records of events

```
2026-05-20T14:23:11Z INFO  user.signup.success user_id=42 duration=187ms
2026-05-20T14:23:15Z ERROR payment.charge.failed user_id=42 reason=insufficient_funds
```

### Metrics — numerical measurements over time

```
http.requests.count (per second)
http.requests.duration.p95 (95th percentile latency)
database.connections.active
queue.depth
```

### Traces — follow a single request through every service

A **trace** is a tree of timed *spans*. Each span is one piece of work (a function call, an HTTP request, a DB query) with a start time and duration. Together they show *where the time went* for a single user request.

```mermaid
flowchart TD
    F["Frontend: GET /checkout - 240ms"]
    AG["API Gateway - 5ms"]
    AU["Auth Service: verify_token - 12ms"]
    OS["Order Service: create_order - 180ms"]
    DB["DB: INSERT INTO orders - 45ms"]
    ST["Stripe API: charge - 110ms"]
    EM["Email Service: send_receipt - 15ms"]
    RD["Render - 38ms"]
    F --> AG
    F --> AU
    F --> OS
    F --> RD
    OS --> DB
    OS --> ST
    OS --> EM
    style ST fill:#f96
```

> **Reading this trace:** The root span (`GET /checkout`) took 240ms. The most expensive child by far is `Stripe API: charge` at 110ms (highlighted orange) — that's where you'd optimize first. Traces turn vague "the checkout page feels slow" complaints into a quantified, line-by-line answer.

## Additional layers (in 2026)

| Layer                | What it does                                                       |
|---------------------|--------------------------------------------------------------------|
| **Error tracking**   | Sentry catches exceptions, deduplicates, alerts.                  |
| **Uptime monitoring**| External pings of your endpoints (Better Stack, Checkly, Pingdom).|
| **Real User Monitoring (RUM)** | Measures actual users' performance (Vercel Analytics, Sentry, Datadog RUM). |
| **Synthetic monitoring** | Automated test traffic from multiple regions.                |
| **Product analytics** | What are users actually doing? (PostHog, Mixpanel, Amplitude.)   |
| **Session replay**   | Watch recordings of user sessions to debug (LogRocket, PostHog).  |
| **Feature flag analytics** | Which features are used, by whom (PostHog, Statsig, LaunchDarkly). |
| **AI/LLM observability** | Track prompts, costs, latency (Langfuse, Helicone, Braintrust). |

## SLIs, SLOs, and SLAs

Mature teams quantify reliability:

- **SLI (Service Level Indicator):** What you measure. *Example: 99.5% of requests return 2xx within 200ms.*
- **SLO (Service Level Objective):** Your internal target. *Example: 99.9% over 30 days.*
- **SLA (Service Level Agreement):** Contractual promise to customers. Usually less strict than SLO so you have margin.

**Error budget:** If your SLO is 99.9% and you've been at 99.85% this month, you've burned through your budget — pause feature work and improve reliability.

## Alerting

You want to know about problems *before* users complain. Modern alerting:

- **Alert on symptoms, not causes.** "Latency exceeded 500ms" tells you something is wrong; "CPU exceeded 80%" might be fine.
- **Alert on user impact.** If users aren't affected, it can wait.
- **Tunable thresholds.** Adjust as you learn what's actually broken.
- **Runbooks linked to alerts.** When pager goes off, on-call engineer needs to know what to do.
- **On-call rotations.** Tools: PagerDuty, Opsgenie, Incident.io, Better Stack.

:::note Worked example: minimum observability for a beginner project
You don't need Datadog and OpenTelemetry on day one. The minimum-viable observability stack for a beginner deploying to Vercel:

1. **Sentry** (free tier) — catches every exception with full stack trace and request context.
2. **Vercel Analytics** (free with Vercel) — page views, Core Web Vitals, basic user behavior.
3. **Better Stack** (free tier) — uptime monitor + log aggregation.

Five minutes of setup. Once you have these three, you'll know within minutes when your site is broken, what broke it, and whether real users hit the bug.
:::

## Observability in 2026

The standard practice: instrument with **OpenTelemetry** (vendor-neutral standard), send to whichever backend you prefer (Datadog, Honeycomb, Grafana, etc.). This avoids vendor lock-in.

Smaller projects: just **Sentry + Better Stack + PostHog** is often enough.

:::info Highlight: logs vs metrics vs traces — when to use which
A simple rule of thumb:

- **Use logs** when you want to know *what happened* (a specific event with details).
- **Use metrics** when you want to know *how often / how fast* (aggregated over time).
- **Use traces** when you want to know *why a single request was slow* (broken down by step).

Most production issues need all three. A spike in error metrics tells you *something* is wrong; logs tell you *what* the error is; traces tell you *which step caused it*. Together, they tell the whole story.
:::

## Common anti-patterns

- **Logging everything:** Floods storage and makes finding signal impossible.
- **No alerting:** Discover problems via customer support tickets.
- **Alert fatigue:** So many false alerts that real ones get ignored.
- **Logs without context:** Can't tell which user, which request, which trace.
- **No correlation IDs:** Can't follow a request across services.

## What's next

→ Continue to [Phase 11: Maintenance & Iteration](./maintenance) where we cover the longest phase by far — the years of work after launch.
