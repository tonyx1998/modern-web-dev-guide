---
id: pitfalls
title: Common Pitfalls Even at This Scale
sidebar_position: 16
sidebar_label: 15. Pitfalls
description: Cargo-cult microservices, useless platforms, tech debt avalanche, acquisition chaos, process for process's sake, and other enterprise failure modes.
---

# Common Pitfalls Even at This Scale

> **In one line:** Even with all the investment in process and platforms, enterprises routinely fall into the same patterns — cargo-cult microservices, platforms nobody uses, tech debt avalanches, process for process's sake, and bureaucratic risk aversion.

:::tip[In plain English]
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

:::info[Highlight: process that nobody actively defends is process that should be cut]
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

:::note[Worked example: how "back to the monolith" works]
A mid-sized SaaS split into 80 microservices over five years. By year six, shipping any feature required changes across an average of seven services, each with its own deploy pipeline, each owned by a different team.

Their fix: identify clusters of services that always change together, and merge each cluster into a "modular monolith" — one deployable unit with strong internal module boundaries. The result: 80 services became 12 services. Feature velocity tripled. Operational burden dropped.

The lesson: microservices weren't wrong; *too many* microservices were wrong for that team's scale. The right granularity is the one where teams can mostly ship independently — and that varies enormously by company.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Fixing process problems with more process.** Reviews are slow, so you add an approval workflow to *speed up* reviews. Now you have reviews and a workflow. The fix for too much process is almost never another layer — it's pruning the layer that already exists.
- **Cargo-culting the cure as eagerly as you cargo-culted the disease.** "Back to monolith!" sweeps the org as breathlessly as microservices did three years earlier. The right granularity is whatever your team coordination actually needs — not whichever direction is currently trending on engineering Twitter.
- **Anti-pattern audits that produce reports instead of changes.** A 40-page document titled "Tech Debt Inventory 2026" that lands in a Confluence space nobody reads is not a fix. Pick the top three items, give them owners and deadlines, and *delete* the rest of the inventory — visibility without accountability is theater.
- **Letting "platform theater" replace platform engineering.** Spinning up a "Platform Excellence" team that runs roadmaps and OKRs but never ships tools is a common reaction to platform criticism. Measure adoption, not slide decks — if product engineers aren't using the platform, the team isn't doing platform engineering.
- **Eternal migrations as the answer to tech debt avalanche.** Announcing "we're rewriting it in Rust" without a deprecation date for the old system gives you two systems to maintain forever. If you can't commit to killing the old thing on a specific date, you can't commit to the migration.
:::

## Page checkpoint

<Quiz id="enterprise-pitfalls-page" title="Did enterprise pitfalls stick?" sampleSize={2}>

<Question
  prompt="What is a 'distributed monolith,' according to the page?"
  options={[
    { text: "A monolith deployed across multiple regions" },
    { text: "A microservices architecture where services must be deployed together — the worst of both worlds, with the latency of distribution and the coupling of a monolith" },
    { text: "A monolith that uses distributed databases" },
    { text: "A team structure spread across time zones" }
  ]}
  correct={1}
  explanation="A distributed monolith is the failure mode of cargo-cult microservices: services that must be deployed together still have all the latency, complexity, and coordination cost of distribution — without the independent-deploy benefit. Recovery is consolidating services that change together."
  revisit={{ to: "/docs/enterprise/pitfalls#cargo-cult-microservices", label: "Cargo-cult microservices" }}
/>

<Question
  prompt="What test does the page suggest for identifying process that should be cut?"
  options={[
    { text: "Run it past the legal team" },
    { text: "Ask three people 'what would go wrong if we stopped doing this?' — if none give a concrete answer rooted in a real past failure, it's cargo cult" },
    { text: "Check whether other companies do it" },
    { text: "Measure how many engineers complain about it" }
  ]}
  correct={1}
  explanation="The test is concrete consequence vs. cargo cult. If nobody can point to a real past failure the process prevents, it's accretion — and the best engineering leaders run a 'process audit' every quarter to kill at least one such process before it strangles velocity."
  revisit={{ to: "/docs/enterprise/pitfalls#process-for-processs-sake", label: "Process audit" }}
/>

<Question
  prompt="What fix does the page recommend for platforms that don't get adopted?"
  options={[
    { text: "Mandate adoption org-wide via the CTO" },
    { text: "Treat product engineers as customers — run user research, measure adoption, iterate based on feedback" },
    { text: "Add more features until engineers are forced to use it" },
    { text: "Disband the platform team" }
  ]}
  correct={1}
  explanation="The failure mode is platform teams building for themselves. The fix is product discipline: internal customers are still customers. Run user research, measure adoption, iterate based on feedback — the same way a product team would treat external users."
  revisit={{ to: "/docs/enterprise/pitfalls#internal-platforms-that-dont-serve-users", label: "Platform adoption" }}
/>

<Question
  prompt="The 'back to the monolith' worked example shows 80 services becoming 12. What was the underlying principle?"
  options={[
    { text: "Microservices are always wrong" },
    { text: "Identify clusters of services that always change together and merge them — the right granularity is where teams can mostly ship independently, which varies enormously by company" },
    { text: "Always consolidate to a single service" },
    { text: "Use Kubernetes regardless" }
  ]}
  correct={1}
  explanation="Microservices aren't wrong — too many microservices for that team's scale was wrong. Services that always change together should be merged into modular monoliths. The right granularity is wherever teams can mostly ship independently; nothing more, nothing less."
  revisit={{ to: "/docs/enterprise/pitfalls#worked-example", label: "Back to monolith" }}
/>

</Quiz>

## What's next

→ Continue to [A Day in the Life of a Senior Engineer at Scale](./day-in-life) for a concrete look at how the work actually feels day-to-day.
