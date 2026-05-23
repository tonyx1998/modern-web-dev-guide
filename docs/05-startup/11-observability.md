---
id: observability
title: 'Phase 9: Observability'
sidebar_position: 12
sidebar_label: 11. Observability
description: Sentry for errors, Better Stack or Axiom for logs, uptime monitoring, PostHog for product analytics, Vercel Analytics for performance, and a simple on-call rotation.
---

# Phase 9: Observability

> **In one line:** Errors in Sentry. Logs in Better Stack or Axiom. Uptime via Better Stack. Behavior in PostHog. Performance in Vercel Analytics. On-call rotates weekly.

:::tip[In plain English]
Solo, you can get away with just Sentry. At startup scale, the observability surface widens because the things that can go wrong widen — payments fail silently, background jobs back up, a slow query starts cascading. Each tool covers one specific dimension; together they form the picture you need to keep a paying-customer product up.
:::

## A typical small-company observability stack

## Errors: Sentry

- Captures exceptions in frontend, backend, and serverless functions.
- Source maps for readable stack traces.
- Releases tied to git commits.
- Alerts for new error types or regression in volume.

## Logs: Better Stack or Axiom

- Centralized logs from Vercel functions + Supabase + Resend + Stripe webhooks.
- Search across all sources.
- Saved queries for common investigations.

## Uptime: Better Stack Heartbeats

- Pings critical endpoints every 1–3 minutes.
- Alerts on 3+ consecutive failures.
- Status page for customers.

## Product analytics: PostHog

- Page views, user behavior, funnel analysis.
- Session replay for debugging hard-to-reproduce issues.
- Feature flags + A/B testing.
- Cohort analysis.

## Performance: Vercel Analytics + Sentry Performance

- Core Web Vitals from real users.
- API endpoint latencies.
- Slow query identification.

## On-call

- Simple rotation: one engineer at a time, rotates weekly.
- Tools: Better Stack On-call, Incident.io, or PagerDuty.
- Runbooks for common issues in Notion.
- Blameless post-mortems for significant incidents.

:::note[Worked example: an incident pieced together from three tools]
**Symptom:** Users complain checkout is slow.

1. **Vercel Analytics:** confirms checkout p95 latency has jumped from 800ms to 4s in the last hour.
2. **Sentry Performance:** points to the Server Action `createCheckoutSession` as the slow call.
3. **Better Stack logs:** filtered to that endpoint, show a slow query against the `customers` table.
4. **Supabase slow-query log:** confirms a missing index after a recent migration.

Total time from "users complain" to "root cause identified": about 10 minutes. Without these tools, this would have been an hour of guesswork. The investment in observability pays back the *first time* there's a real incident.
:::

:::info[Highlight: blameless post-mortems matter more than blame]
After a significant incident, the team writes a short post-mortem in Notion: what happened, when, why, what fixed it, what would have caught it earlier. *Crucially, the document doesn't name individuals as the cause.*

The reason is practical, not soft: the moment people fear post-mortems, they hide near-misses. Hidden near-misses become future incidents. Blameless writing trades the small dopamine hit of assigning fault for the much larger benefit of an honest learning culture.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Logging everything at INFO level.** Once every request emits 30 log lines, Better Stack costs spike and useful signals drown in noise. Default to WARN for "this is unusual" and INFO for state changes (signups, payments) — not for "function entered."
- **Alerting on metrics nobody owns.** A Slack #alerts channel with 200 daily messages gets muted within a week, and the one real alert is missed. Every alert needs a name attached: who triages it, what runbook to follow, when to escalate. No owner? Delete the alert.
- **Treating Sentry like a TODO list.** Errors pile up to 10,000+ unread, including issues that auto-resolved months ago. Spend 20 minutes weekly archiving and grouping — or the signal-to-noise of your error tracker collapses.
- **Skipping post-mortems for "small" incidents.** A 15-minute outage feels too small to write up — until you have ten of them in a quarter and realize they're the same root cause. Write *brief* post-mortems for anything customer-visible, not just the dramatic ones.
- **Building a custom dashboard project that nobody opens.** A grafana board with 40 panels updated weekly becomes wallpaper. Default to the platform dashboards (Sentry, PostHog, Vercel) until you have a specific question they can't answer.
:::

## Page checkpoint

<Quiz id="startup-observability-page" title="Did observability stick?" sampleSize={2}>

<Question
  prompt="Which tool does the page assign to which dimension of observability at this scale?"
  options={[
    { text: "Sentry for errors, Better Stack/Axiom for logs, PostHog for product analytics, Vercel Analytics for performance" },
    { text: "Datadog for everything" },
    { text: "Console.log statements and CloudWatch only" },
    { text: "New Relic, Splunk, and AppDynamics combined" }
  ]}
  correct={0}
  explanation="The startup observability stack is purpose-built tools per dimension: Sentry catches errors, Better Stack or Axiom centralizes logs, PostHog covers product analytics, and Vercel Analytics + Sentry Performance handle performance."
  revisit={{ to: "/docs/startup/observability#a-typical-small-company-observability-stack", label: "Observability stack" }}
/>

<Question
  prompt="In the slow-checkout worked example, how do the tools combine to find root cause in about 10 minutes?"
  options={[
    { text: "Vercel Analytics confirms latency, Sentry Performance points to a slow Server Action, Better Stack logs filter to the endpoint, Supabase slow-query log shows the missing index" },
    { text: "A single dashboard alert tells the engineer exactly which line of code to fix" },
    { text: "An on-call engineer reads through Postgres for an hour" },
    { text: "Customers are interviewed one by one to narrow down the issue" }
  ]}
  correct={0}
  explanation="The worked example chains four tools: Vercel Analytics confirms the regression, Sentry Performance points to the slow endpoint, logs narrow it to the slow query, and the Supabase slow-query log reveals the missing index from a recent migration."
  revisit={{ to: "/docs/startup/observability#on-call", label: "Incident worked example" }}
/>

<Question
  prompt="Why does the page argue post-mortems should be blameless?"
  options={[
    { text: "Because HR requires it for legal reasons" },
    { text: "Because the moment people fear post-mortems, they hide near-misses — and hidden near-misses become future incidents" },
    { text: "Because blaming individuals is rarely accurate technically" },
    { text: "Because it's a soft skill that improves morale but has no practical benefit" }
  ]}
  correct={1}
  explanation="The reason is practical, not soft: assigning fault makes engineers hide problems. Blameless writing trades a small dopamine hit for an honest learning culture and surfaces near-misses before they become incidents."
  revisit={{ to: "/docs/startup/observability#on-call", label: "Blameless post-mortems" }}
/>

<Question
  prompt="What on-call structure does the page describe as typical at this scale?"
  options={[
    { text: "A 24/7 dedicated NOC of five engineers" },
    { text: "One engineer on-call at a time, rotating weekly, with runbooks in Notion" },
    { text: "No on-call — engineers handle issues only during business hours" },
    { text: "Outsourced on-call to a third-party SRE firm" }
  ]}
  correct={1}
  explanation="Simple rotation: one engineer on-call at a time, rotating weekly, supported by tools like Better Stack On-call or PagerDuty and runbooks in Notion for common issues."
  revisit={{ to: "/docs/startup/observability#on-call", label: "On-call rotation" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 10: Security and Compliance](./security) where daily hygiene, SOC 2, and pen testing become real concerns.
