---
id: observability
title: 'Phase 8: Observability (Minimal)'
sidebar_position: 11
sidebar_label: 10. Observability
description: Three free tools — Sentry for errors, Vercel Analytics for traffic, PostHog for product analytics — cover almost all solo needs.
---

# Phase 8: Observability (Minimal)

> **In one line:** Errors in Sentry, traffic in Vercel Analytics, product behavior in PostHog. Free tiers. Set it up before you need it.

:::tip[In plain English]
"Observability" sounds intimidating but for a solo project it means three dashboards. Sentry tells you *what broke*. Vercel Analytics tells you *who's visiting*. PostHog tells you *what they're doing*. Set them up while it's still easy — debugging an outage when you have no telemetry is a special kind of misery.
:::

## The three-tool stack

**Observability** is the umbrella term for "knowing what your app is doing in production" — errors, traffic, performance, and user behavior. For a personal project, three tools cover almost all needs:

## Sentry for Errors

```bash
bunx @sentry/wizard@latest -i nextjs
```

Wizard configures Sentry automatically. Now exceptions in your app show up in Sentry's dashboard with stack traces, breadcrumbs, and user context.

## Vercel Analytics for Traffic

Free with Vercel. Shows page views, top pages, top referrers, and core web vitals. No setup needed beyond enabling it.

## PostHog for Product Analytics (Optional)

If you want to know which features users actually use:

```bash
bun add posthog-js
```

Initialize in a client component and call `posthog.capture('event_name', { ... })` when interesting things happen.

## Uptime Monitoring (Optional)

Better Stack's free tier pings your homepage every 3 minutes. If it fails, you get an email.

That's enough until you have real users.

:::note[Worked example: a real bug detected by Sentry]
A user reports "the page is broken." You ask which page. They say "the one with the books." You open Sentry → there's a single error from the last 24 hours: `TypeError: Cannot read properties of undefined (reading 'title')` in `BookCard`. Stack trace points to line 14. Breadcrumbs show they navigated to `/library/share/abc123`.

Total time from report to root cause: under a minute. Without Sentry: you'd ask them for their browser/OS, ask them to open DevTools, ask them to copy the stack trace, then maybe see something useful.
:::

:::info[Highlight: set it up *before* you ship]
Every solo developer who skips Sentry on day one regrets it the first time a real user hits a bug. The whole point of telemetry is that *you only need it after something has already broken* — at which point you can't add it retroactively. Five minutes now saves a debugging nightmare later.
:::

## What's next

→ Continue to [Phase 9: Launching](./launching) where we'll soft-launch to friends, Hacker News, and Indie Hackers.
