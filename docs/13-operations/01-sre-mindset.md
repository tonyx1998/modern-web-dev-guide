---
id: sre-mindset
title: The SRE Mindset
sidebar_position: 2
sidebar_label: SRE mindset
description: SLIs, SLOs, and SLAs; error budgets as the currency between reliability and velocity; toil; and why 100% reliability is the wrong goal.
---

# The SRE Mindset

> **In one line:** Decide how reliable your service actually needs to be (an **SLO**), measure whether you're hitting it (**SLIs**), and treat the gap to 100% as an **error budget** you deliberately spend on shipping features and taking risks — so reliability and velocity become two sides of one number instead of a perpetual fight.

:::tip[In plain English]
Two instincts fight in every engineering org: "ship fast" and "don't break things." SRE resolves the fight with a number. First, you measure something users actually care about — say, the percentage of requests that succeed quickly (an **SLI**). Then you set a target — say 99.9% over a month (an **SLO**). The 0.1% you're *allowed* to miss is your **error budget**. If you're comfortably inside budget, you can afford to move fast and take risks. If you've blown the budget — too many outages — you stop shipping risky changes and spend the time on reliability until you're back in the black. Suddenly "should we ship this risky thing?" has a data-driven answer instead of a shouting match. That's the whole mindset.
:::

## SLI, SLO, SLA — get these straight

These three get muddled constantly. The distinction is exact:

| Term | What it is | Example |
|---|---|---|
| **SLI** (Indicator) | A *measurement* of some aspect of service quality | "% of HTTP requests that return 200–499 in under 300ms" = 99.95% this week |
| **SLO** (Objective) | Your *internal target* for an SLI | "99.9% of requests succeed in under 300ms, measured over 28 days" |
| **SLA** (Agreement) | A *contract* with a customer, with penalties if breached | "99.5% uptime or you get a 10% credit" |

Order of derivation: pick **SLIs** that reflect user happiness → set **SLOs** a bit stricter than any **SLA** you promise (so you have margin before you owe refunds) → only some services need an external SLA at all. The mistake is starting from a number you saw in a blog post ("we need five nines!") instead of from "what do our users actually need, and what can we measure?"

**Good SLIs measure the user's experience, not your servers' vitals.** "CPU is at 60%" is not an SLI — users don't care about CPU. "99.9% of checkout requests succeed in under 1s" is, because that's what the user feels. The canonical good SLIs are **availability** (did the request succeed?), **latency** (was it fast enough?), and for data systems **freshness/correctness**.

## Error budgets: the key idea

If your SLO is 99.9% over 28 days, your **error budget** is 0.1% — about **40 minutes of "bad" per month.** That budget is not a failure to feel guilty about; it's a *resource to spend*:

```
Error budget = 100% − SLO

99.9% SLO  →  0.1% budget  →  ~43 min/month of allowed unreliability
99.99% SLO →  0.01% budget →  ~4.3 min/month  (10x stricter, ~exponentially costlier)
```

The policy that makes it powerful:

- **Budget remaining?** You're reliable enough. *Ship.* Take the risky migration. Do the experiment. Velocity is safe.
- **Budget exhausted?** You've broken your promise to users this period. Freeze risky changes; the whole team's priority becomes reliability work until you're back in budget.

This turns an emotional argument ("ops wants to slow us down / devs are reckless") into a thermostat. It also aligns incentives: the *same* team owns both shipping and reliability, so they self-regulate.

:::info[Highlight: why 100% reliability is the wrong target]
Each additional "nine" costs roughly an order of magnitude more — more redundancy, more review, more on-call, more caution — and the marginal user cannot even *perceive* the difference between 99.9% and 99.99% if their own phone, Wi-Fi, and ISP are less reliable than that. Worse, chasing 100% means *never changing anything*, because every change is a risk — which kills the product. So the goal is never "perfect." It's "exactly as reliable as users need, and not one nine more — bank the rest as velocity." Picking a *lower* SLO on purpose is often the senior move.
:::

## Toil: the enemy SRE names

**Toil** is manual, repetitive, automatable operational work that scales linearly with traffic and produces no lasting value — restarting a stuck service by hand, manually provisioning each new environment, copy-pasting the same fix. It's not "all ops work"; it's specifically the *grind* that a script should be doing.

Why name it? Because toil silently eats the time you'd otherwise spend making the system *not need* that work. Google's well-known guideline caps toil at ~50% of an SRE's time, forcing the other half into engineering that *reduces future toil*. The practical takeaway for any team: when you find yourself doing the same manual operational thing a third time, that's the signal to automate it — the manual version doesn't scale and it's where 3am mistakes come from.

:::note[Worked example: setting your first SLO]
A team runs a SaaS API and argues constantly about whether they're "reliable enough." They adopt SRE thinking:
1. **Pick an SLI users feel:** "proportion of API requests that return successfully in under 500ms," measured at the load balancer.
2. **Look at current reality:** they're already at ~99.95% most months. Setting the SLO at 99.99% would mean fighting for an improvement users won't notice; setting it at 99% would let quality silently rot. They pick **99.9%** — comfortably achievable, meaningfully good.
3. **Compute the budget:** ~43 min/month of allowed badness.
4. **Write the policy:** if a month's incidents burn the whole budget, the next sprint is reliability-only.

Three months later, a tempting-but-risky database migration comes up. Instead of debating feelings, they check the budget: 80% remaining, mid-month. *Ship it* — and if it burns budget, that's literally what the budget is for. The argument is over; the data decides.
:::

## MTTR over MTBF: optimize for recovery

Two reliability levers: reduce how *often* things break (MTBF, mean time between failures) or reduce how *long* breakage lasts (MTTR, mean time to recovery). SRE leans hard on **MTTR**, because in complex systems failure is inevitable — you cannot prevent every failure, but you can make recovery fast and routine. A system that fails monthly but recovers in 90 seconds (good monitoring, easy rollback, practiced response) is far more *available* than one that fails rarely but takes six hours to diagnose. This is why the rest of this chapter spends so much time on *seeing* failure (observability), *limiting* it (reliability patterns), and *responding* to it (incidents) — those all attack MTTR.

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking an SLO from a blog post, not from users.** "Five nines!" with no idea what users need or what you can measure. Start from a user-facing SLI and a target you can actually hit.
- **Treating the error budget as something to never touch.** A perpetually-full budget means you're being *too* careful and leaving velocity on the table. The budget exists to be spent.
- **Measuring server vitals instead of user experience.** CPU/RAM are useful for diagnosis but they're not SLIs. Measure success rate and latency as the user sees them.
- **Setting an SLO equal to (or above) your SLA.** You need internal margin: the SLO should be stricter than any contractual SLA so you react before you owe refunds.
- **Ignoring toil until it owns you.** The third time you do a manual operational task, automate it — that's where scaling pain and 3am mistakes come from.
- **Optimizing only MTBF.** You can't prevent all failure in complex systems. Invest equally (or more) in fast, practiced recovery.
:::

## Page checkpoint

<Quiz id="sre-mindset-page" title="Did the SRE mindset stick?" sampleSize={3}>

<Question
  prompt="What is an error budget, and what should a team do while there's budget remaining?"
  options={[
    { text: "The money allocated to the ops team; spend it on monitoring tools" },
    { text: "The allowed unreliability (100% − SLO); while budget remains, the team can confidently ship features and take risks — velocity is safe" },
    { text: "The number of engineers on call; rotate them faster when it's high" },
    { text: "A penalty pool paid to customers after outages" }
  ]}
  correct={1}
  explanation="The error budget is 100% minus your SLO — the unreliability you're allowed. Remaining budget is permission to move fast and take risks; an exhausted budget triggers a freeze on risky changes until reliability recovers. It turns the ship-fast-vs-stay-up fight into a data-driven thermostat."
  revisit={{ to: "/docs/operations/sre-mindset#error-budgets-the-key-idea", label: "Error budgets" }}
/>

<Question
  prompt="Which of these is a good SLI?"
  options={[
    { text: "Average CPU utilization across the fleet" },
    { text: "The percentage of checkout requests that succeed in under 1 second — a measure of what the user actually experiences" },
    { text: "Number of servers running" },
    { text: "Lines of code deployed this week" }
  ]}
  correct={1}
  explanation="A good SLI measures the user's experience (success rate, latency, freshness), not your infrastructure's vitals. Users don't feel CPU%; they feel whether their checkout succeeded quickly. Server metrics help diagnose but aren't the objective."
  revisit={{ to: "/docs/operations/sre-mindset#sli-slo-sla--get-these-straight", label: "Good SLIs" }}
/>

<Question
  prompt="Why does SRE argue that 100% reliability is the wrong target?"
  options={[
    { text: "Because downtime is good for users" },
    { text: "Each extra 'nine' costs roughly an order of magnitude more, users can't perceive the difference past a point, and chasing perfection means never changing anything — so you aim for 'exactly as reliable as users need' and bank the rest as velocity" },
    { text: "Because SLAs legally cap reliability at 99%" },
    { text: "Because monitoring can't measure above 99.9%" }
  ]}
  correct={1}
  explanation="Reliability has exponentially rising marginal cost and diminishing perceptible benefit, and perfect uptime implies zero change (which kills the product). The senior move is often a deliberately lower SLO, spending the remaining budget on shipping."
  revisit={{ to: "/docs/operations/sre-mindset#sli-slo-sla--get-these-straight", label: "Why not 100%" }}
/>

</Quiz>

## What's next

→ Continue to [Observability](./ops-observability) — you can't hit an SLO you can't measure, and you can't fix what you can't see.
