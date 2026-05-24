---
id: observability
title: 'Phase 9: Observability (Minimal)'
sidebar_position: 11
sidebar_label: 10. Observability
description: Three free tools — Sentry for errors, Vercel Analytics for traffic, PostHog for product analytics — cover almost all solo needs.
---

# Phase 9: Observability (Minimal)

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

## Common mistakes

:::caution[Where people commonly trip up]
- **Wiring up Sentry but never opening the dashboard.** Errors pile up unread in a tab you never check. The fix is the weekly maintenance window from the next chapter — block 15 minutes, scan Issues, triage one. A noisy dashboard isn't observability; a *reviewed* dashboard is.
- **Building a Grafana + Loki + Prometheus stack for a 10-user app.** Self-hosting observability is fun, but you'll spend more time tending the dashboards than you do on the product. The fix is the three managed free tiers on this page — graduate to your own stack when (and only when) the free tiers stop fitting.
- **Logging PII into Sentry breadcrumbs.** A `console.log(user)` in a hot path now ships every signed-in user's email to your error tracker — and possibly across borders, depending on the user. The fix is to scrub or hash anything sensitive before logging, and to enable Sentry's PII filters in the project settings.
- **Treating PostHog as analytics theater.** You install it, fire a `pageview` event, and never look at it again. The fix is to define two or three *funnels* up front — signup, first action, first paid — and check them once a week. Vanity metrics like total events are useless; activation funnels actually change what you build.
- **Forgetting source-map upload.** Sentry shows `(anonymous)` in `main.abc123.js:1:84231` and the trace is useless. The fix is to let the Sentry wizard configure source-map upload during install — five minutes now, every future stack trace becomes readable.
:::

## Page checkpoint

<Quiz id="solo-observability-page" title="Did observability stick?" sampleSize={2}>

<Question
  prompt="Which tool covers which job in the three-tool solo stack?"
  options={[
    { text: "Sentry: traffic; Vercel Analytics: errors; PostHog: uptime" },
    { text: "Sentry: errors; Vercel Analytics: traffic; PostHog: product behavior" },
    { text: "Sentry: payments; Vercel Analytics: errors; PostHog: search" },
    { text: "Sentry: uptime; Vercel Analytics: SEO; PostHog: deploys" }
  ]}
  correct={1}
  explanation="Sentry catches exceptions with stack traces. Vercel Analytics shows page views, referrers, and web vitals. PostHog captures product events like 'user did X.' Together they cover almost everything a solo project needs."
  revisit={{ to: "/docs/solo/observability#the-three-tool-stack", label: "Three-tool stack" }}
/>

<Question
  prompt="Why should you set up Sentry BEFORE you ship, not after?"
  options={[
    { text: "It's cheaper if installed early" },
    { text: "You can't add telemetry retroactively after a bug already happened" },
    { text: "Sentry won't accept new projects with existing traffic" },
    { text: "Vercel requires it as a deployment dependency" }
  ]}
  correct={1}
  explanation="The whole point of telemetry is having it ready *before* something breaks. After the fact, you can't go back in time and capture the stack trace of yesterday's bug — the data simply doesn't exist."
  revisit={{ to: "/docs/solo/observability#sentry-for-errors", label: "Set it up before you ship" }}
/>

<Question
  prompt="What does the Sentry wizard command do?"
  options={[
    { text: "Generates a marketing landing page" },
    { text: "Configures Sentry in your Next.js project automatically" },
    { text: "Imports historical errors from production logs" },
    { text: "Replaces ESLint with Biome" }
  ]}
  correct={1}
  explanation="bunx @sentry/wizard@latest -i nextjs wires Sentry into the project — config files, env vars, source map upload — so exceptions show up in the Sentry dashboard with stack traces and breadcrumbs."
  revisit={{ to: "/docs/solo/observability#sentry-for-errors", label: "Sentry wizard" }}
/>

<Question
  prompt="What does Better Stack's free tier provide in this stack?"
  options={[
    { text: "Product analytics" },
    { text: "Uptime monitoring with email alerts" },
    { text: "Error tracking with breadcrumbs" },
    { text: "Web vitals reporting" }
  ]}
  correct={1}
  explanation="Better Stack's free tier pings your homepage every 3 minutes and emails you on failure. That covers the 'is the site even up?' question that Sentry alone won't answer."
  revisit={{ to: "/docs/solo/observability#uptime-monitoring-optional", label: "Uptime monitoring" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 10: Launching](./launching) where we'll soft-launch to friends, Hacker News, and Indie Hackers.
