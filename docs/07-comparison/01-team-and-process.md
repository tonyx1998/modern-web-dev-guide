---
id: team-and-process
title: Team Structure, Decision-Making, and Hiring
sidebar_position: 2
sidebar_label: 1. Team & Process
description: How team composition, decision-making, and hiring differ across solo / small / large company scales.
---

# Team Structure, Decision-Making, and Hiring

> **In one line:** Team size and structure dictate how decisions get made and how people get hired — the same pattern that works at 5 engineers is a disaster at 500, and vice versa.

:::tip In plain English
The role mix at each scale tells you a lot about what the engineering culture feels like. A solo dev is everyone at once. A startup is a handful of generalists plus a few specialists as it grows. An enterprise is dozens of specialized teams, each with its own slice of the work.

How decisions get made follows the same arc: pure intuition → small-team discussion → multi-team RFC + review gauntlet. Hiring goes from "the founder DMs people" to "a five-round structured loop with calibrated interviewers."
:::

## Team Structure

| Role                | Personal | Small Company    | Large Company             |
|---------------------|----------|------------------|---------------------------|
| **Engineers**       | 1        | 2–35             | 500+                      |
| **Specialists**     | None     | Emerging 10+     | Many specialized teams    |
| **Designers**       | 0–1      | 1–8              | Dozens (with design system team) |
| **Product managers**| 0–1      | 1–10             | Dozens                    |
| **DevOps/SRE**      | None     | 0–4              | Dedicated org             |
| **Security**        | None     | 0–1              | Security org              |
| **QA**              | None     | None             | Sometimes (per industry)  |
| **Platform engineers** | None  | 0–2 (later)      | Multiple platform teams   |
| **Engineering managers** | 0   | 0–4              | Many, with director/VP hierarchy |

The biggest cultural divide is between "small company" and "large company." At a small company, almost everyone is a generalist who touches every part of the stack. At a large company, deep specialization is the default — a single engineer might spend their entire career on a specific subsystem.

For context on what each scale's daily work feels like, see [The Enterprise Mindset](/docs/enterprise/enterprise-mindset) and [Team Structure at Enterprise Scale](/docs/enterprise/team-structure).

## Decision-Making Process

| Decision Type         | Personal            | Small Company             | Large Company                   |
|-----------------------|---------------------|---------------------------|---------------------------------|
| **Pick a library**    | Whim                | Engineer's call           | Often standardized              |
| **Major dependency**  | 30 minutes of research | Team discussion         | RFC + architecture review       |
| **New service**       | N/A                 | CTO approval              | Multi-team review + RFC         |
| **Database change**   | Just do it          | DBA-equivalent review     | Schema review + migration plan  |
| **New external API**  | Self                | Security check            | Vendor security review + procurement |
| **Hosting change**    | Self                | Team + CTO                | Architecture + finance + security |

:::info Highlight: "RFC" is the magic word
Once an organization is big enough that decisions outlive their decision-makers, *written* decisions start beating spoken ones. The RFC ("Request for Comments") format — a doc capturing options considered, the chosen approach, and the reasoning — is the dominant decision-making tool at enterprise scale.

A good RFC is also the best way to lobby a large org for change. If you can't write down why your proposal is better than the alternatives, you probably can't convince a senior engineer to bet a quarter of their team's roadmap on it.
:::

## Hiring

| Aspect              | Personal     | Small Company              | Large Company                    |
|---------------------|--------------|----------------------------|----------------------------------|
| **Process**         | N/A          | 2–4 rounds, 1–2 weeks      | 5–7 rounds, 4–8 weeks            |
| **Interviewers**    | N/A          | 2–4 people                 | 5–10 people                      |
| **Decision time**   | N/A          | Days                       | 1–2 weeks                        |
| **Onboarding**      | N/A          | 1 week to productive       | 1–3 months to fully productive   |
| **Tech screen**     | N/A          | Take-home or live coding   | Multiple coding + system design + behavioral |
| **Compensation negotiation** | N/A | Direct, with the founder  | HR-led, comp bands, equity grants |

The longer enterprise loops aren't gratuitous — at 500+ engineers, a bad hire is much more expensive (longer to identify, harder to manage out, more damage done). The trade-off is that excellent candidates sometimes take other offers during the slow process.

:::note Worked example: who decides on a database migration?
A typical "we need to add Postgres FTS support" decision:

- **Personal project:** "Sure, I'll do it Saturday." Done.
- **Startup (10 engineers):** Brief Slack thread, one engineer's PR with a migration script, reviewer signs off, deploys.
- **Enterprise:** RFC ("why FTS over Elasticsearch?"), schema review ("does this break replication?"), data team review ("does this affect the warehouse export?"), migration plan with reversibility, staged rollout per shard, change advisory board sign-off if regulated.

The enterprise process looks absurd if you stop at the single decision. It looks reasonable once you remember that *thousands* of database decisions happen across the company every year, and the same RFC framework keeps them all aligned.
:::

## What's next

→ Continue to [Stack and Hosting](./stack-and-hosting) — the actual technologies and infrastructure each scale runs on.
