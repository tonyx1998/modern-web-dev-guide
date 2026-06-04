---
id: on-call-alerting
title: On-Call & Alerting
sidebar_position: 5
sidebar_label: On-call & alerting
description: Alert on symptoms not causes, fight alert fatigue, the anatomy of a good alert, runbooks, and humane on-call rotations.
---

# On-Call & Alerting

> **In one line:** A good alerting setup wakes a human *only* for things that are both urgent and actionable — almost always user-facing symptoms tied to your SLOs — because every page that didn't need to happen erodes the one resource you can't buy more of: the on-call engineer's trust that alerts mean something.

:::tip[In plain English]
Someone has to be reachable when production breaks at 3am — that's "being on-call." The hard part isn't the schedule; it's deciding *what's worth waking them for*. Alert on too little and real outages smolder unnoticed. Alert on too much and the on-call engineer drowns in noise, learns to ignore the pager, and misses the one alert that mattered — that's **alert fatigue**, and it's how real incidents slip through. The discipline is brutal and simple: a page must be **urgent** (needs a human *now*) and **actionable** (there's something they can do). Everything else is a dashboard or a ticket, not a page. And every alert should point to a **runbook** so the woken human isn't reverse-engineering the system half-asleep.
:::

## Alert on symptoms, not causes

The single most important alerting principle. **Page on what the user feels; diagnose with everything else.**

- ❌ **Cause-based:** "CPU > 80%", "disk 90% full", "a pod restarted." These fire constantly during normal operation (batch jobs, deploys, autoscaling) and often *don't* correspond to any user harm. They train people to ignore the pager.
- ✅ **Symptom-based:** "checkout success rate < 99.5% over 5 min", "p99 latency > 1s", "error-budget burn rate is 10x normal." These mean *a user is actually being hurt right now.*

The causes (CPU, disk, pods) still matter — but as **dashboards you consult after a symptom alert fires**, to find the *why*. If high CPU isn't hurting users, it's not a 3am problem; it's a capacity dashboard for business hours. This ties straight to the [SRE mindset](./sre-mindset): your pages should be the few signals that map to SLO violations.

:::info[Highlight: burn-rate alerting — the modern default]
Naive SLO alerting ("page if we dip below 99.9% this instant") is too twitchy. The modern technique is **error-budget burn-rate alerting**: page based on *how fast you're consuming the error budget*. Burning budget slowly (a minor elevated error rate) → a low-urgency ticket; burning it fast (a sharp spike that will exhaust the month's budget in hours) → page immediately. This gives you *urgency proportional to severity*: small problems become tickets, fast-moving ones become pages, and you stop both crying-wolf and missing slow burns. It's the alerting expression of "reliability is a budget."
:::

## Anatomy of a good alert

Every alert that pages a human should carry:

1. **What's wrong, in user terms** — "Checkout failing for 6% of users," not "metric_47 > threshold."
2. **Severity / urgency** — page now vs. look at it Monday.
3. **A link to the relevant dashboard** — the on-call shouldn't have to hunt.
4. **A link to a runbook** — concrete first steps (below).
5. **It must be actionable** — if there's literally nothing the human can do, it should not page.

## Runbooks: don't make people think at 3am

A **runbook** is a short, specific guide for a given alert: what it means, how to confirm it's real, the first diagnostic steps, how to mitigate, and how to escalate. Cognitive ability is at its worst when you're woken from sleep under stress — the runbook offloads the thinking you already did calmly in daylight.

```markdown
## Runbook: "Checkout success rate < 99.5%"

Meaning: users are failing to complete purchases. Revenue-impacting. SEV-2+.

1. Confirm: open the Checkout dashboard → is the drop real and ongoing (not a 1-min blip)?
2. Recent change? Check deploys in the last 60 min → if a deploy lines up, ROLL IT BACK first, ask questions later.
3. Dependency? Check the payments-provider status page + the payments service traces.
4. Mitigate: if payments provider is down, enable the "retry-later" queue fallback (feature flag `checkout.async`).
5. Escalate: if not resolved in 15 min or revenue impact is climbing, page the payments team lead + declare an incident.
```

Good runbooks are living documents — every postmortem ([next page](./incident-response)) should improve the runbook for that alert. An alert with no runbook is a half-finished alert.

## Humane on-call

On-call is sustainable only if it's designed for humans, not as a hazing ritual:

- **Reasonable rotation & load.** Enough people that any one person is on-call infrequently (e.g. 1 week in 6+), and few enough nightly pages that they can actually sleep. If on-call is consistently brutal, that's a *signal the system is too unreliable* — fix the system, don't just burn out the rotation.
- **Follow-the-sun for global teams.** Hand off across time zones so nobody is routinely paged at 3am local.
- **Compensation/time-off** for on-call, and an explicit expectation that you *don't* also carry a full feature load that week.
- **A page budget.** Some teams cap "if on-call gets more than N pages a shift, reliability work jumps the queue." Pager pain becomes a forcing function to fix root causes.
- **Escalation paths.** Clear secondary/tertiary on-call so a stuck or unreachable primary doesn't mean an unhandled incident.

:::note[Worked example: killing alert fatigue]
A team's on-call gets ~40 pages a week; most are "CPU high" and "pod restarted," nearly all auto-resolve. People silence the pager. Then a real database-connection-exhaustion incident pages — and sits unacknowledged for 25 minutes because it looked like more noise. The cleanup: delete every cause-based page that doesn't map to user harm (move them to dashboards), convert the rest to **symptom + burn-rate** alerts tied to SLOs, and attach a runbook to each survivor. Pages drop from ~40/week to ~3/week — and now every page is trusted and answered fast. **Fewer alerts made them more reliable, not less**, because the signal stopped being buried in noise.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Paging on causes (CPU, disk, restarts) instead of user-facing symptoms.** These fire during normal operation and train people to ignore the pager. Page on SLO-linked symptoms; keep causes as diagnostic dashboards.
- **Alert fatigue.** Too many low-value pages mean the one real page gets ignored. Ruthlessly prune; aim for "every page is real and actionable."
- **Alerts with no runbook.** You force a half-asleep engineer to rediscover the system under stress. Attach concrete first steps to every page.
- **Non-actionable alerts.** If there's nothing to do, it shouldn't page — make it a report or delete it.
- **Brutal, understaffed rotations.** Constant 3am pages burn people out and cause mistakes. If on-call hurts, the system is too unreliable — fix the system.
- **No escalation path.** A primary who's asleep, stuck, or unreachable shouldn't mean nothing happens. Define secondary/tertiary on-call.
:::

## Page checkpoint

<Quiz id="on-call-alerting-page" title="Did on-call & alerting stick?" sampleSize={2}>

<Question
  prompt="Which alert should page a human at 3am, per the 'symptoms not causes' principle?"
  options={[
    { text: "CPU utilization exceeded 80% on a node" },
    { text: "Checkout success rate dropped below 99.5% over the last 5 minutes" },
    { text: "A pod restarted" },
    { text: "Disk usage reached 70%" }
  ]}
  correct={1}
  explanation="Page on what users feel and that maps to an SLO. Checkout success dropping means users are actually being harmed now. CPU/disk/pod-restart are causes that fire during normal operation and often don't hurt users — keep them as diagnostic dashboards, not pages."
  revisit={{ to: "/docs/operations/on-call-alerting#alert-on-symptoms-not-causes", label: "Symptoms not causes" }}
/>

<Question
  prompt="A team reduces pages from 40/week to 3/week and becomes MORE reliable. Why?"
  options={[
    { text: "Fewer alerts means fewer real incidents happen" },
    { text: "Eliminating noisy, non-actionable pages restored trust in the pager, so the few real, SLO-linked pages now get acknowledged and handled fast instead of being ignored as noise" },
    { text: "The monitoring system was overloaded by 40 alerts" },
    { text: "Three alerts is the maximum a pager supports" }
  ]}
  correct={1}
  explanation="Alert fatigue is the failure mode: when most pages are noise, people tune out and miss the real one. Pruning to only real, actionable, symptom-based alerts means every page is trusted and answered quickly — fewer, better alerts improve reliability."
  revisit={{ to: "/docs/operations/on-call-alerting#humane-on-call", label: "Killing alert fatigue" }}
/>

<Question
  prompt="What is burn-rate alerting and why is it better than 'page the instant we dip below the SLO'?"
  options={[
    { text: "It pages based on CPU burn; it's better because CPU predicts outages" },
    { text: "It pages based on how fast you're consuming the error budget — fast burn pages immediately, slow burn becomes a ticket — giving urgency proportional to severity and avoiding both false alarms and missed slow burns" },
    { text: "It only alerts during business hours" },
    { text: "It silences all alerts until the budget is fully spent" }
  ]}
  correct={1}
  explanation="Instant-threshold SLO alerts are too twitchy. Burn-rate alerting keys on the rate of budget consumption: a sharp spike that would exhaust the month in hours pages now; a minor elevated rate becomes a low-urgency ticket. Severity-proportional urgency."
  revisit={{ to: "/docs/operations/on-call-alerting#alert-on-symptoms-not-causes", label: "Burn-rate alerting" }}
/>

</Quiz>

## What's next

→ Continue to [Incident response & postmortems](./incident-response) — what happens once a page fires and a real incident is underway.
