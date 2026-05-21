---
id: graduating
title: When to Graduate Beyond "Personal Project"
sidebar_position: 18
sidebar_label: 17. Graduating
description: Signs your side project is outgrowing solo habits — and the smooth transition into small-company workflows.
---

# When to Graduate Beyond "Personal Project"

> **In one line:** When your side project earns its own keep, has real users who get angry when it breaks, and demands more than your spare hours — it's time to add process.

:::tip In plain English
Most side projects never graduate. They stay weekend things forever, or quietly fade. A few catch on, and the same habits that got you here start to hurt: no tests means scary deploys, no review means dumb mistakes shipped, no on-call means you firefight at 2am. Graduating isn't a failure of solo principles — it's the natural next step.
:::

## Signs you've graduated

If your side project becomes meaningful (revenue, users, importance), you'll start outgrowing personal-project habits. Signs:

- You're working on it more than 20 hours a week.
- It's earning enough to cover its costs and your time.
- You have meaningful users (hundreds+).
- Bugs affect real people, not just you.
- You need help.

At that point, read the [Small Company Workflow chapter](/docs/startup). The transition isn't dramatic — many of the same tools apply — but you'll start adding process, testing, and observability you skipped at the personal stage.

## Wrapping Up Part 4

The personal project workflow in 2026 is essentially:

1. Plan briefly.
2. Use the default stack.
3. Set up quickly with modern tools.
4. Build features one at a time, end-to-end.
5. Ship continuously.
6. Iterate based on real feedback.

The biggest enemy is over-thinking. Modern tools have removed most barriers — what remains is the discipline to focus on the actual product and ship.

:::note Worked example: a clear graduation moment
You're three months into your indie SaaS. It earns $2K/month. You have 400 paying users. Last week:

- A bad deploy broke checkout for 3 hours; you only noticed because a user emailed.
- You can't take a vacation because if Stripe webhooks fail nobody else can investigate.
- You're working 30 hours a week on it on top of your day job and burning out.
- You shipped a refactor that broke billing for power users; you didn't catch it because you have no E2E test on checkout.

That's a clear graduation moment. The fix isn't "try harder solo." It's: add Playwright tests, set up Better Stack uptime alerts, write a runbook so a friend can investigate, and start thinking about hiring or finding a co-founder.
:::

:::info Highlight: graduating doesn't mean "stop being scrappy"
The fastest-growing 5-to-50-person companies still feel scrappy — but they've added the *specific* process that the previous stage's pain demanded. Code review came in because of one too many silly bugs. Tests came in because manual checking stopped scaling. Observability came in because you can't watch 400 customers manually. Each piece of process *earned its way in*. Don't add anything that hasn't earned its way in.
:::

## What's next

→ Continue to [Chapter 5: Small Company Workflow](/docs/startup) — what changes when you graduate to a small company / startup environment.
