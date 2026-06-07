---
id: outgrowing
title: When You're Outgrowing This Scale
sidebar_position: 18
sidebar_label: 17. Outgrowing
description: Signs you're approaching the next stage — 50+ engineers, multi-team blocking, risky monolith deploys, real microservices reasons, mounting compliance, exhausted on-call.
---

# When You're Outgrowing This Scale

> **In one line:** When your engineering org passes 50 people, teams routinely block each other, monolith deploys feel risky, and on-call exhausts a single brain — you've outgrown the small-company workflow.

:::tip[In plain English]
The small-company workflow has natural limits. The patterns that worked at 20 engineers start to creak at 60. Recognizing the signals early lets you transition deliberately instead of in crisis. The next chapter — [Large Company Workflow](/docs/enterprise) — covers what changes.
:::

## Signs you've outgrown the small-company workflow

Signs you're approaching the next stage:

- **Engineering org > 50 people.** Communication overhead is constant. Decisions take days, not hours.
- **Multiple teams routinely block each other.** "We're waiting on the platform team" becomes a regular phrase.
- **The monolith deploys are getting risky.** Every deploy touches code from 20 engineers.
- **You're considering microservices for real reasons.** Different teams need different deployment cadences; different services have wildly different scaling needs.
- **Compliance work is consuming significant time.** SOC 2, HIPAA, PCI all stack up.
- **You have on-call but it's exhausting.** A single engineer can't reasonably understand the whole system.

That's when [Chapter 12: Large Company Workflow](/docs/enterprise) becomes relevant.

## Wrapping Up Part 11

Small-company web development in 2026 is a sweet spot. The tooling is mature, the patterns are well-understood, and a small team can ship genuinely impressive software:

- Pick the dominant stack (Next.js + Postgres + Vercel + Supabase + managed services).
- Build a [modular monolith](./architecture).
- Add process when missing it causes pain.
- Lean on managed services for everything not central to your differentiator.
- Maintain code quality through [review](./cicd) and [testing](./testing).
- Monitor production from day one.
- Plan for the next year, not the next decade.

The hardest discipline: resisting both extremes. Don't be sloppy like a personal project; don't be heavyweight like an enterprise. Stay in the middle, where execution speed is highest.

:::note[Worked example: a clean graduation]
A startup hits 55 engineers. The CTO notices three signals over one quarter:

1. Two teams blocked each other on a shared module three times in a month.
2. A bad deploy took down the app for 12 minutes because the monolith merge bundled fifteen people's changes.
3. SOC 2 work is now consuming one full engineer's time, but they have no security org to own it.

Instead of waiting for things to get worse, the CTO starts a deliberate transition: spin up a small platform team, extract two services from the monolith (the two that scale very differently), and hire a security lead. None of these moves are "we became an enterprise overnight" — they're surgical responses to specific signals.

Three months later, the team is operating under more of the patterns in [Chapter 12](/docs/enterprise). The transition was uncomfortable but not catastrophic.
:::

:::info[Highlight: graduating gracefully beats graduating in crisis]
Most companies don't notice they've outgrown their workflow until something breaks badly — a major incident, a key hire quitting, a missed deadline. The hard skill at this stage is *noticing the signals early and acting on them before the crisis.*

The signals listed above are the leading indicators. Watch them quarterly. When two or three are flashing red, start the transition — don't wait for the fourth.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Declaring "we're an enterprise now" the moment you hit 50 headcount.** Headcount alone isn't the signal — pain is. A 60-engineer team without blocking dependencies or risky deploys can run small-company patterns longer; a 35-engineer team with a brittle monolith may need enterprise practices sooner. Watch the symptoms, not the org chart.
- **Treating the transition as a wholesale rewrite.** "We need to be enterprise" turns into a six-month re-platforming project that ships nothing. Pick the *two* most painful signals, address them surgically, and let the rest of the workflow keep working until it doesn't.
- **Promoting your strongest IC to "VP Engineering" to handle scale.** Running an org and writing code are different jobs. Forcing the transition on someone who didn't want it loses you the IC *and* the manager. Recruit externally for management roles you don't have internal interest in.
- **Believing you'll get to enterprise practices "after this launch."** The next launch always exists. If you're three signals deep into the outgrowing list, the transition has to happen *during* the work, not after — or the next big incident makes the decision for you.
- **Losing the speed advantage that got you here.** Enterprise patterns add coordination cost on purpose. The risk is over-correcting: adopting RFCs for every change, ARBs, multi-week planning cycles. The goal is to layer in *just enough* enterprise to keep the wheels on — not to become the company you were rebelling against at 10 people.
:::

## Page checkpoint

<Quiz id="startup-outgrowing-page" title="Did the outgrowing signals stick?" sampleSize={2}>

<Question
  prompt="Around what engineering-org size does the page say the small-company workflow starts to break down?"
  options={[
    { text: "Around 10 engineers" },
    { text: "Around 50 engineers, when communication overhead is constant and decisions take days not hours" },
    { text: "Around 200 engineers" },
    { text: "There's no size threshold — workflows scale forever" }
  ]}
  correct={1}
  explanation="Past about 50 engineers, communication overhead becomes constant, decisions take days, teams routinely block each other, and the monolith deploy becomes a risky event. That's when enterprise patterns become relevant."
  revisit={{ to: "/docs/startup/outgrowing#signs-youve-outgrown-the-small-company-workflow", label: "Signs you've outgrown" }}
/>

<Question
  prompt="Which of these is listed as a real signal that you're approaching the enterprise stage?"
  options={[
    { text: "Vercel bills crossing $1,000 per month" },
    { text: "Different teams need different deployment cadences and services have wildly different scaling needs" },
    { text: "Hiring your first designer" },
    { text: "Adopting TypeScript strict mode" }
  ]}
  correct={1}
  explanation="A genuine signal is that microservices reasons become real — different teams need different deploy cadences, and services have wildly different scaling profiles. The other listed signals include >50 engineers, blocking teams, risky monolith deploys, mounting compliance, and exhausting on-call."
  revisit={{ to: "/docs/startup/outgrowing#signs-youve-outgrown-the-small-company-workflow", label: "Real microservices reasons" }}
/>

<Question
  prompt="What's the hard skill the page calls out for engineers leading this transition?"
  options={[
    { text: "Waiting until a major incident forces the change" },
    { text: "Noticing the signals early and acting before crisis, rather than reacting to a breakdown" },
    { text: "Hiring an external transformation consultancy" },
    { text: "Rewriting the entire codebase in Rust" }
  ]}
  correct={1}
  explanation="Most companies don't notice they've outgrown the workflow until something breaks badly. The hard skill is treating the listed signals as leading indicators — when two or three flash red, start the transition deliberately."
  revisit={{ to: "/docs/startup/outgrowing#signs-youve-outgrown-the-small-company-workflow", label: "Graduating gracefully" }}
/>

<Question
  prompt="In the clean-graduation worked example, what does the CTO do after spotting the signals?"
  options={[
    { text: "Spins up a small platform team, extracts two services with very different scaling needs, and hires a security lead — surgical responses, not a wholesale rewrite" },
    { text: "Immediately rewrites the monolith into 30 microservices" },
    { text: "Fires the engineers responsible for the bad deploy" },
    { text: "Ignores the signals and hopes things improve" }
  ]}
  correct={0}
  explanation="The transition is described as surgical: a small platform team, extracting two services that scale very differently, and a security lead to own compliance work. It's deliberate, not a we became an enterprise overnight rewrite."
  revisit={{ to: "/docs/startup/outgrowing#signs-youve-outgrown-the-small-company-workflow", label: "Clean graduation" }}
/>

</Quiz>

## What's next

→ Continue to [Chapter 12: Large Company Workflow](/docs/enterprise) — what changes when you scale to enterprise: hundreds of engineers, regulatory compliance, massive infrastructure.
