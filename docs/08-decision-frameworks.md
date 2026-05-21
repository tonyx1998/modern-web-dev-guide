---
id: decision-frameworks
title: 8. Decision Frameworks
sidebar_position: 9
sidebar_label: 8. Decisions
description: How to actually choose. Boring-technology rule, reversibility, team-size heuristics, cost of inaction.
---

# Part 8: Decision Frameworks

*How to actually make technology and architecture choices well.*

:::tip Beginner orientation
**Why most developers make bad choices:** They pick technology based on what's trendy on Hacker News, what a famous YouTuber praised, or what the most senior person on the team likes. None of those are good reasons. This chapter teaches you to choose like a thoughtful engineer.

**The single most important principle:** Boring technology beats exciting technology in almost every situation that matters. Postgres in 2026 is still Postgres because it's reliable, well-documented, and well-understood. "Just use Postgres" is unglamorous, correct advice you'll hear for the rest of your career.

**The frameworks you'll learn here:**
- **Boring technology rule** — prefer well-proven tools
- **Reversibility test** — how hard is it to undo this decision?
- **Team-size heuristics** — your team's size limits which tools are realistic
- **Cost of inaction** — sometimes the cost of *not* deciding is bigger than picking the wrong option

**Mental model:** Engineering decisions are like dietary choices for an athlete. You don't pick the new TikTok superfood. You stick with proven nutrition (lean protein, vegetables, complex carbs) and only experiment when the basics are dialed in.

**If you only remember one thing:** When two options seem roughly equal, pick the one that's been around longer, has more documentation, and is easier to undo.
:::

Every project requires hundreds of decisions: what framework, which database, monolith or microservices, build or buy, refactor now or later. The wrong decisions compound; the right ones quietly enable everything that follows.

This file is a collection of frameworks for making these decisions well. They're general-purpose — apply them to any scale, any technology, any role.

---

## The Boring Technology Rule

**Choose boring technology. Save innovation tokens for the thing that actually differentiates your product.**

The phrase "innovation tokens" comes from Dan McKinley's 2015 essay. The idea: every team has a limited budget for adopting novel technology. Spend it on the one or two things that matter most. Use boring, well-understood tools for everything else.

### Why Boring Wins

- **Known failure modes.** Old technology has documented bugs, known limits, well-trodden recovery paths. New technology surprises you in production.
- **Mature ecosystems.** Libraries, tutorials, Stack Overflow answers, hiring pools.
- **Stable APIs.** New tools evolve rapidly; breaking changes are common. Boring tools change slowly.
- **Operational maturity.** Logging, monitoring, debugging tools, runbooks.
- **Risk reduction.** Less surface area for "new tech + new feature failing simultaneously."

### Concrete Examples in 2026

**Boring choices (the ones to default to):**
- PostgreSQL for relational data.
- Redis for cache and queues.
- Next.js or your framework's stable LTS.
- React (boring at this point) for UI.
- TypeScript.
- Vercel or Cloudflare or AWS for hosting.
- Stripe for payments.
- Sentry for errors.

**Innovation tokens you might spend (one or two, deliberately):**
- A novel ML/AI workflow that's your differentiator.
- A specialized database for an unusual access pattern.
- A new framework that genuinely fits your problem.
- An edge-first architecture if performance is your moat.

**Innovation that's usually a mistake:**
- New programming language because it's hyped.
- Microservices because Netflix uses them.
- Custom build system because npm "isn't sophisticated enough."
- Web framework that's a year old when alternatives are mature.
- Document database when you want SQL.

### How to Apply

Before adopting a new tool, ask:
- **Is this the thing my company is uniquely good at?** If yes, maybe spend the token. If no, use the boring choice.
- **What's the cost of being wrong?** If high, lean boring.
- **What's the cost of staying with the alternative?** If high, the new tool might be worth it.

If you can't articulate why the new tool is necessary, it probably isn't.

---

## The Reversibility Test

**Spend deliberation proportionally to how hard a decision is to reverse.**

Jeff Bezos calls these **Type 1** (one-way doors, hard to reverse) and **Type 2** (two-way doors, easy to reverse) decisions.

### Categorizing Decisions

**Easily reversible (try freely):**
- UI components.
- Styling approach.
- Minor libraries (date utility, validation library).
- Linter rules.
- Folder structure.
- Variable names.

**Moderately reversible (some thought required):**
- Frontend framework.
- Auth provider.
- Email provider.
- Hosting platform.
- Major libraries.

**Hard to reverse (think carefully):**
- Programming language.
- Database technology.
- Cloud provider (especially as you accumulate services).
- Major architectural patterns (monolith vs microservices).
- Data model (schemas accumulate dependencies).
- Public API design.

**Very hard or impossible to reverse:**
- Selling user data.
- Open-sourcing proprietary code.
- Public commitments to APIs.
- Decisions baked into customer integrations.

### How to Apply

For each decision:
1. Place it on the reversibility spectrum.
2. Allocate deliberation accordingly:
   - Easily reversible → 5 minutes; just decide.
   - Moderate → an hour to research, a discussion with a colleague.
   - Hard → days of research, prototyping, peer review.
   - Very hard → formal process, multiple reviewers, written justification.

The mistake is uniform deliberation: spending weeks debating button colors while picking databases in 20 minutes.

### The "Bias for Action" Corollary

For reversible decisions, **just decide**. Endless deliberation is its own cost. If you're wrong, you'll fix it.

For irreversible decisions, **slow down**. The cost of being wrong dominates the cost of careful thought.

---

## The Team Size Heuristic

**Your team size constrains what's optimal.**

A pattern that works for a 5-person team often fails at 50. A pattern designed for 500 engineers crushes a small startup.

### 1 Person

**Optimize for:** Speed, joy, learning.

- Pick what you know best.
- Use defaults aggressively.
- Skip process.
- Don't build for hypothetical future scale.

### 2–10 People

**Optimize for:** Shipping velocity, low coordination cost.

- Pick popular defaults (you'll hire people who already know them).
- Maintain code quality through review and tests.
- Lightweight process — daily standup, sprint planning, retros.
- Modular monolith.
- One product manager or founder calls product shots.

### 10–50 People

**Optimize for:** Sustainable velocity, emerging specialization.

- Standardize aggressively (everyone uses the same stack).
- Allow exceptions only with justification.
- Real engineering process — code review requirements, on-call rotation, deployment automation.
- Begin to specialize (frontend, backend, infra-curious).
- Start building internal documentation and runbooks.

### 50–500 People

**Optimize for:** Team autonomy, cross-team coordination.

- Strong defaults; deviation requires architectural review.
- Distinct teams with clear ownership.
- Internal platforms emerge (or formal vendors take their place).
- Real process: RFCs, ADRs, formal launches.
- SRE / DevOps becomes a discipline.

### 500+ People

**Optimize for:** Reliability, scalability, hiring.

- Build internal platforms that abstract complexity from product teams.
- Formal compliance and security programs.
- Multiple parallel investments (ML platform, design system, observability platform).
- Heavy process around production changes.
- Specialized roles for every function.

### How to Apply

Ask: "Is this practice helping or hurting at our current size?" Add what genuinely helps. Remove what's pure overhead.

The biggest mistake is **importing practices from a much larger or smaller company** without considering whether they fit.

---

## The Build vs Buy Decision

**Default to buying for non-core capabilities; build only where you're the world's expert.**

### When to Build

- **It's your core differentiator.** Building the thing that makes you unique.
- **Existing options are genuinely inadequate.** Not "I don't like the API"; truly missing critical capability.
- **You have unique scale or constraints.** Off-the-shelf tools don't fit your specific volume or shape of problem.
- **Existing tools are too expensive at your scale** and you've already calculated build-and-maintain cost.
- **You have a specific competitive reason.** A tool nobody else has gives you an edge.

### When to Buy

- **The capability exists as a mature commercial product.** Auth (Clerk), payments (Stripe), email (Resend), monitoring (Sentry), analytics (PostHog).
- **It's not your differentiator.** Building auth is not why customers chose you.
- **You can't afford to specialize.** Specialized vendors employ teams of experts; you can't match that focus.
- **The build cost exceeds 2 years of license cost.** You can revisit later.

### The Hidden Cost of Building

People underestimate maintenance:
- Initial build: 2 weeks.
- Edge cases discovered in production: 4 more weeks.
- Security updates: ongoing.
- Feature requests from users: never-ending.
- Documentation: months.
- Replacement when the original author leaves: weeks.

A "2-week build" easily becomes 6 months over the project's lifetime.

### Specific Build/Buy Cases

| Capability             | Default              | When to Build                  |
|------------------------|----------------------|-------------------------------|
| Auth                   | Buy (Clerk, Auth0)   | If your product IS auth        |
| Payments               | Buy (Stripe)         | If at PayPal scale             |
| Email                  | Buy (Resend, Postmark) | If email IS your product     |
| Error tracking         | Buy (Sentry)         | At very large scale            |
| Analytics              | Buy (PostHog)        | If analytics is your product   |
| Feature flags          | Buy (LaunchDarkly, PostHog) | Custom needs only       |
| CMS                    | Buy or open-source   | Highly custom editorial flow   |
| Search                 | Buy (Algolia, Typesense) | Specialized at scale       |
| Job queue              | Buy (Trigger.dev) or OSS (BullMQ) | Massive scale         |
| Live chat              | Buy (Intercom)       | Almost never                   |
| ML platform            | Mixed                | Often build at scale           |

---

## The Two-Pizza Rule

**A team should be small enough that two pizzas can feed it.**

Amazon's famous rule. Translated: 6–10 people maximum.

Why this matters:
- **Communication overhead grows quadratically with team size.** 10 people have 45 possible pairs; 20 people have 190.
- **Small teams ship faster.** Less coordination, more ownership.
- **Accountability is clearer.** When everyone's responsible, no one is.

### How to Apply

- **Service ownership:** Each service owned by one team. If two teams need to coordinate constantly, the service boundary is wrong.
- **Team splitting:** When a team grows beyond ~10, split it.
- **Project teams:** Cross-functional groups should also stay small.

### Trade-Offs

Small teams can become silos. Counter with:
- Cross-team rotations.
- Shared design system, infrastructure, observability.
- Open Slack channels.
- Engineering all-hands.

---

## The "Why Now?" Question

**Before adopting any new technology or pattern, ask: why now, specifically?**

The answer should be a concrete problem, not "it would be cool" or "the team wants to."

### Good Reasons

- "We're hitting Postgres limits we've measured."
- "This library version has critical security bugs we can't ignore."
- "Our hiring is constrained by language X."
- "The new framework solves a specific bug class we've had."

### Bad Reasons

- "It's the latest thing."
- "Other companies use it."
- "The team is bored."
- "It would look good on our blog."
- "I read a Twitter thread."

If you can't answer "why now?" specifically, the answer is probably "not now."

### Forcing Functions

Make the question explicit:
- Require justification in RFC templates.
- Include "what problem does this solve?" in tech proposals.
- Estimate the migration cost before deciding.

---

## The Cost-of-Inaction Calculation

**When tempted to refactor, calculate the cost of not refactoring.**

A common mistake: weighing only the cost of doing a refactor. The hidden cost is everything that gets slower if you don't.

### The Formula

```
Cost of Doing = engineer-weeks × hourly rate

Cost of Not Doing = (slowdown per feature) × (features per year)
                  × (years until problem gets fixed anyway)
                  × hourly rate

If Cost of Not Doing > Cost of Doing × 12 months: do it now.
If Cost of Not Doing < Cost of Doing × 36 months: probably don't.
In between: judgment call.
```

### Concrete Example

You have a slow build. Every CI run takes 15 minutes when it should take 3.

**Cost of fixing:** 1 engineer × 1 week = ~$3,000.

**Cost of not fixing:**
- 10 engineers × 4 CI runs/day × 12 extra minutes = 8 engineer-hours/day wasted.
- ~$1,200/day in lost productivity.
- $24,000/month.

The fix pays for itself in 3 days. Obviously do it.

Conversely: a big migration that takes 6 engineer-months and saves 10 minutes per week per engineer probably doesn't pay back in any reasonable timeframe.

### The Trap

People only count the cost of doing. They miss the cost of accumulated slowdowns. Make the costs concrete.

---

## The Migration Strategy Framework

**Big-bang migrations are usually disasters. Incremental migrations work.**

### Successful Migration Patterns

**Strangler fig pattern:**
1. Build new system alongside old.
2. Route some traffic to new system (start small).
3. Gradually shift more traffic.
4. Eventually retire old system.

Named after the strangler fig tree, which grows around and eventually replaces its host.

**Branch by abstraction:**
1. Introduce an abstraction layer over the thing you want to replace.
2. Both old and new implementations satisfy the abstraction.
3. Gradually migrate callers to use the new implementation.
4. Remove the old one when nothing uses it.

**Parallel run:**
1. Both old and new systems do the work.
2. Compare results; alert on differences.
3. When you trust the new system, retire the old.

**Feature flag rollout:**
- New code path behind a flag.
- Enable for 1% → 10% → 100% over time.
- Easy rollback (flip the flag).

### Anti-Patterns

**Big-bang rewrite:**
- "We'll spend 6 months rebuilding from scratch."
- Original system continues to accumulate features during the rewrite.
- Project always takes longer than planned.
- Switching cost is huge.
- Almost always disastrous.

**Stop-the-world:**
- "We'll freeze feature work for 3 months to migrate."
- Product team revolts.
- Customers churn.
- Engineering credibility damaged.

### Rules for Migrations

1. **Never let old and new diverge for long.** Sync as you go.
2. **Have a kill switch.** Be able to roll back instantly.
3. **Measure progress.** "We're 80% migrated" should mean something specific.
4. **Communicate clearly.** Other teams need to know what's happening.
5. **Commit to finishing.** Half-migrated systems are worse than either old or new.

---

## The "Two Versions of the Same Code" Principle

**If you find yourself with duplicate logic, ask: which one is canonical?**

Duplication is a smell. But the fix isn't always extraction — sometimes the right answer is identifying which version is the "real" one and treating others as views.

### Approaches

1. **Extract common code.** Classic refactor: put shared logic in a function/class.
2. **Pick a canonical source.** Database is the source of truth; everything else derives from it.
3. **Generate one from the other.** Types generated from schemas, clients from OpenAPI.
4. **Accept the duplication if it's coincidental.** Sometimes two pieces of code look similar but represent different concerns. Extracting them creates artificial coupling.

The trick is distinguishing real duplication (same concept, multiple expressions) from accidental similarity.

---

## The Premature Optimization Principle

**Make it work, then make it right, then make it fast — in that order.**

Donald Knuth: "Premature optimization is the root of all evil."

### The Rule

1. **Make it work.** Build the feature end-to-end. Don't worry about performance yet.
2. **Make it right.** Clean up the code, add tests, handle edge cases.
3. **Measure performance.** If performance is fine, you're done.
4. **Optimize the bottlenecks.** Profile-guided, not guess-guided.

### Why It Matters

- Most code doesn't need to be fast. Network and I/O dominate.
- "Optimizations" often turn out to be irrelevant when you measure.
- Premature optimization makes code harder to read, modify, and debug.
- You don't know what's slow until you profile.

### When to Optimize Early

- **Algorithm choice.** O(n²) vs O(n log n) matters at any scale.
- **Database query patterns.** N+1 queries should never ship.
- **Network calls inside loops.** Always batch.
- **Bundle size for client-side JS.** Page weight matters from day one.

These are not premature — they're structural choices that are expensive to change later.

---

## The Documentation Trade-Off

**Document the things that don't change, not the things that do.**

### What's Worth Documenting

- **Architecture decisions** (ADRs) — why, not what.
- **Conventions** — naming, code style, error handling patterns.
- **Onboarding** — how to set up the project.
- **Runbooks** — what to do when X breaks.
- **API contracts** — for external consumers.
- **Domain concepts** — what is a "tenant"? What does "active" mean?

### What's Not Worth Documenting

- **Implementation details.** Code is the truth; docs lie eventually.
- **Things obvious from the code.** Don't paraphrase your own code in comments.
- **Things that change weekly.** They'll be stale tomorrow.

### Forms of Documentation

- **READMEs** — Entry points; the first thing to read.
- **Inline code comments** — Why something is non-obvious, not what it does.
- **ADRs / RFCs** — Significant decisions.
- **Wikis / Notion** — Cross-cutting concerns, organizational stuff.
- **API docs** — Generated from code when possible (OpenAPI, TypeDoc).
- **Diagrams** — For architecture (mermaid, draw.io).

The right docs reduce repeated questions; the wrong docs are noise.

---

## The "What Would Hurt to Change" Question

**For any decision, ask: if this is wrong, what would it cost to fix?**

This is a variant of the reversibility test, but practical: imagine you're wrong, then estimate the cost.

### Examples

**"What's the framework?"** Wrong → 6-month rewrite. High cost.
**"Should this be a button or a link?"** Wrong → 30 minutes to switch. Low cost.
**"What's the API contract?"** Wrong → break all consumers. High cost.
**"What's the database schema for this new feature?"** Wrong → migration with possible data loss. Medium-high cost.
**"What library should we use for HTTP requests?"** Wrong → search-and-replace in a few files. Low cost.

When the cost is high, slow down. When it's low, move fast.

---

## The "Why Are You Doing This?" Question

**For every project, every feature, every change — be able to answer "why?"**

The answer should connect to:
- A real user problem.
- A measurable business outcome.
- A strategic priority.

If the answer is "because we always have" or "because someone said so" or "because it would be cool" — pause. Maybe don't.

### Forcing Functions

- PRDs require a "problem statement" section.
- Engineering proposals require a "motivation" section.
- 1:1s ask "what are you working on, and why?"
- Performance reviews ask "what impact did your work have?"

These force the question to surface.

---

## The Hiring-Constraint Principle

**Pick technologies your future self can hire for.**

Some technologies are easier to hire for than others. This compounds: hiring for a niche tech is harder, so candidates are scarcer, so you compete harder, so they're more expensive — and once hired, they leave more easily because demand is so high.

### Hiring Difficulty (Rough 2026 Estimates)

| Technology              | Hiring Difficulty       |
|-------------------------|------------------------|
| TypeScript / React      | Easy (huge pool)       |
| Python                  | Easy                   |
| Go                      | Moderate               |
| Vue                     | Moderate (esp. US)     |
| Rust                    | Harder                 |
| Elixir, Clojure         | Hard                   |
| OCaml, Haskell          | Very hard              |
| Custom internal tools   | Impossible             |

The hiring lens is a real engineering concern, not just a recruiting one.

### The Counter

Sometimes a niche technology is the right choice — it lets you punch above your weight, attract passionate engineers, or solve specific problems better. Just know the trade-off.

---

## A Decision-Making Checklist

For any significant decision, run through:

1. **Why now?** What specific problem does this solve?
2. **What's the cost of doing nothing?** Quantify.
3. **What's the cost of doing this?** Build cost + maintenance + risk.
4. **What are the alternatives?** List at least three (including "do nothing").
5. **How reversible is this?** One-way door or two-way?
6. **How does this scale?** Will it work at 10x size? 100x?
7. **Who needs to weigh in?** Affected teams, security, legal.
8. **What's the success metric?** How will we know if it worked?
9. **What's the rollback plan?** If it goes wrong, how do we recover?
10. **Have we documented this?** Future-you needs context.

Not every decision needs the full checklist. Reach for it on high-stakes ones.

---

## When to Override These Frameworks

Frameworks are heuristics, not laws. Sometimes:

- **Use a non-boring technology** because it fits your problem uniquely well.
- **Spend weeks on a reversible decision** because the team strongly disagrees and alignment matters.
- **Build instead of buy** because the build is genuinely cheaper than the long-term license fee.
- **Skip the framework entirely** because the situation is urgent.

The frameworks tell you what's usually right. Judgment tells you when "usually" doesn't apply.

The skill develops with experience. Early in your career, default to the frameworks. As you gain context, learn when to deviate.

---

## Wrapping Up Part 8

Decision-making is the hidden craft of senior engineering. Anyone can write code; the multiplier is making good decisions about what to build and how.

Key frameworks to remember:
- **Boring technology** for everything that isn't your differentiator.
- **Reversibility** as a guide to how much to deliberate.
- **Team size heuristics** to apply right-sized practices.
- **Build vs buy** weighted heavily toward buying.
- **Cost of inaction** to justify refactors and migrations.
- **Two-pizza teams** for ownership clarity.

The meta-skill: **know when to refuse complexity.** Most failed projects fail because they took on too much, not too little. Build the smallest thing that could possibly work; let real usage drive what comes next.

**Next:** Part 9 covers the new layer in modern web apps — AI integration patterns.
