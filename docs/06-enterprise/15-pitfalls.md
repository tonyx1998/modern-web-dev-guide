---
id: pitfalls
title: Common Pitfalls Even at This Scale
sidebar_position: 16
sidebar_label: 15. Pitfalls
description: Cargo-cult microservices, useless platforms, tech debt avalanche, acquisition chaos, process for process's sake, and other enterprise failure modes.
---

# Common Pitfalls Even at This Scale

> **In one line:** Even with all the investment in process and platforms, enterprises routinely fall into the same patterns — cargo-cult microservices, platforms nobody uses, tech debt avalanches, process for process's sake, and bureaucratic risk aversion.

:::tip In plain English
Money and process don't automatically buy good engineering. The biggest enterprises in the world routinely produce systems that take six months to ship a feature that a startup could ship in a weekend. The failure modes are predictable and worth knowing about — they're the warning signs that your organization is sliding into one of them.
:::

## Cargo-Cult Microservices

Companies adopt microservices because Netflix or Google did, without the operational maturity. Result: **distributed monoliths** — services that must be deployed together, with extra latency and complexity. Worst of both worlds.

**Recovery:** Consolidate services that change together. Sometimes "back to monolith" (or modular monolith) is the right move.

## Internal Platforms That Don't Serve Users

Platform teams build for themselves, not for product engineers. Sophisticated systems nobody wants to use. Adoption is low; engineers route around the platform.

**Fix:** Treat product engineers as customers. Run user research. Measure adoption. Iterate based on feedback.

## Tech Debt Avalanche

Without dedicated investment, a 10-year-old codebase becomes nearly unmaintainable. Engineers spend more time fighting the codebase than building features.

**Fix:** Allocate explicit time for tech debt. Track it visibly. Tie payoff to business outcomes. Don't allow "we'll do it next quarter" for years.

## Acquisition Chaos

Acquired teams bring different stacks. Integrating them takes years and often never fully completes. Companies end up with three CI systems, four secrets managers, ten ways to deploy.

**Fix:** Have an acquisition integration playbook. Set integration timelines and budgets up front.

## Tooling Proliferation

Dozens of overlapping observability tools, three CI systems, four secrets managers, ten different package managers. Each team makes locally optimal choices that are globally bad.

**Fix:** Platform teams enforce standards. Provide easy paths for common choices. Make non-standard choices require justification.

## Process for Process's Sake

Reviews that take weeks. Approvals from people who don't read the code. Meetings about meetings. Templates that nobody reads.

**Fix:** Senior engineering leadership must actively prune. Ask "what value does this provide?" for every process. Cut what doesn't justify itself.

:::info Highlight: process that nobody actively defends is process that should be cut
A useful test: pick a process and ask three people "what would go wrong if we stopped doing this?" If none of them can give a concrete answer rooted in a real past failure, it's cargo cult — and probably worth removing.

The best engineering leaders have a recurring "process audit" cadence: every quarter, they kill at least one process that has stopped justifying itself. Otherwise, process accretes for years and slowly strangles velocity.
:::

## Bureaucratic Risk Aversion

Every action requires approvals. No one can ship without sign-off from five people. Innovation dies.

**Fix:** Distinguish reversible from irreversible decisions. Empower teams for reversible choices. Require approvals only for genuinely high-stakes changes.

## Communication Overhead

Hundreds of meetings per day across the org. Engineers spend more time in meetings than coding.

**Fix:** Default to async (docs, recorded videos). Cap meeting times. Require agendas. Cancel meetings that have served their purpose.

## Talent Mismatch

Hiring senior engineers expecting to write code, then they spend all their time in meetings. Burnout, churn.

**Fix:** Be honest in hiring about the role. Some senior IC positions involve more architecture, mentoring, and coordination than coding. Match expectations.

## Knowledge Silos

Senior engineers hold critical knowledge in their heads. When they leave, productivity collapses.

**Fix:** Documentation requirements. Pair programming. Rotation. "Bus factor" reviews.

:::note Worked example: how "back to the monolith" works
A mid-sized SaaS split into 80 microservices over five years. By year six, shipping any feature required changes across an average of seven services, each with its own deploy pipeline, each owned by a different team.

Their fix: identify clusters of services that always change together, and merge each cluster into a "modular monolith" — one deployable unit with strong internal module boundaries. The result: 80 services became 12 services. Feature velocity tripled. Operational burden dropped.

The lesson: microservices weren't wrong; *too many* microservices were wrong for that team's scale. The right granularity is the one where teams can mostly ship independently — and that varies enormously by company.
:::

## What's next

→ Continue to [A Day in the Life of a Senior Engineer at Scale](./day-in-life) for a concrete look at how the work actually feels day-to-day.
