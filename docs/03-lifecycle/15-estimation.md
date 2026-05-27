---
id: estimation
title: 'Estimation & planning: why your estimates are wrong and how to get less wrong'
sidebar_position: 15
sidebar_label: Estimation
description: Why software estimates are always optimistic, the cone of uncertainty, how to estimate as ranges, when story points make sense, and how to communicate timing to stakeholders without overcommitting.
---

# Estimation & planning: why your estimates are wrong and how to get less wrong

> **In one line:** Software estimates are wrong because we estimate the work we *imagine*, not the work that actually happens — and getting less wrong is mostly about embracing uncertainty, estimating as ranges, breaking work small enough to estimate, and communicating timing to stakeholders honestly.

:::tip[In plain English]
"How long will this take?" is the question we're worst at answering, *and* the one we get asked constantly. Engineers consistently underestimate by 50-200% — not from incompetence, but because our brain estimates the happy path while reality includes meetings, integration surprises, edge cases, bugs, rework, and waiting. This page is the discipline of getting less wrong: estimate in ranges, decompose ruthlessly, track your own batting average, and tell stakeholders the truth about uncertainty.
:::

Estimation is a meta-skill. It affects whether you ship on time, whether your team is trusted, and whether you can negotiate scope.

## Why we're so bad at estimation

A few well-documented cognitive issues:

| Bias | Effect |
|------|--------|
| **Planning fallacy** | We estimate the best-case, even when we know past projects went over. |
| **Anchoring** | "How long would it take a really good engineer?" anchors low. |
| **Confirmation bias** | We notice things that support our estimate, dismiss things that don't. |
| **Sunk cost** | Once committed to an estimate, we resist revising. |
| **Survivorship bias** | We remember the projects that went well; forget the ones that didn't. |

Combined with:

- **Unknown unknowns.** You can't estimate what you don't know exists.
- **Coordination overhead.** Code reviews, meetings, PMs asking questions — invisible in your estimate.
- **Interruption tax.** Each context switch costs 15-30 minutes of recovery.
- **Yak shaving.** "I need to update X to do Y" → 3 hours later, you're updating an unrelated linter config.

The result: an engineer who "thinks it's 2 days of work" usually ships in 5.

This isn't a personal failure. It's the field. The fix is *process*, not "be better."

## The cone of uncertainty

A famous concept from Steve McConnell. At the start of a project, your estimate's range is 4× too low to 4× too high. As you learn, the range narrows.

```
   8x    --
   4x    ---
   2x    -----
   1x    Estimate -------
   .5x   ---
   .25x  --
   .125x -
        ↑       ↑       ↑       ↑
      day 1   week 2   month 1  ship
```

Implication: **the more you know, the better you estimate**. The estimate before you start coding is wildly worse than the estimate after a few days of work. Communicate this honestly.

Practical version: **early estimates are ranges, not numbers**. "2-8 weeks" tells the truth; "5 weeks" pretends to a precision you don't have.

## Decomposition: the most reliable lever

The single biggest improvement in estimation comes from breaking work into smaller pieces.

A 4-week feature has 1000 things that could go wrong. A 1-day task has ~5. You can estimate small tasks. You can't estimate big ones.

Decomposition rules:

- **Smallest feasible piece.** Can you ship something useful in a day? Half a day?
- **Concrete artifacts.** Each piece produces something observable: a PR, a deployed change, a passing test, a working endpoint.
- **Estimate each piece separately.** Sum at the end. Add a buffer.
- **Surface dependencies.** "Task C depends on task A finishing first" matters for schedule, not just total work.

Decomposition surfaces unknowns. If you can't break it down, you don't understand it well enough to estimate it — that's its own valuable signal ("we need to spike on X before we can commit").

## Estimate as a range, then negotiate scope

```
"Auth refactor: optimistic 5 days, expected 8 days, pessimistic 15 days."
```

vs

```
"Auth refactor: 7 days."
```

The first communicates real information. The second is a number stakeholders write down and hold you to.

When stakeholders ask "but what's the date?":
- "If everything goes well, X. If there are surprises, Y. Likely Z."
- "I can commit to X if you can commit to scope freeze."
- "If you need a hard date, I need 50% buffer beyond expected."

Negotiate **scope** as the lever, not date. Software is easier to make smaller than to make faster:

- "We can ship the must-haves by date X; the nice-to-haves slip to Y."
- "Cut feature B and we can hit your date."
- "Phase 1 by then; phase 2 the month after."

## Story points (when they help, when they don't)

The Agile-canonical alternative to time estimates: **story points** — unitless complexity scores (1, 2, 3, 5, 8, 13 — a Fibonacci-style scale).

Theory:
- Engineers estimate relative complexity, not absolute time.
- Over many sprints, the team's velocity (points per sprint) stabilizes.
- Future capacity = velocity × sprints.

Where they work:
- Mature teams with stable membership.
- Steady cadence (2-week sprints, predictable workload).
- Stakeholders who genuinely understand "we'll know velocity after 3 sprints."

Where they fail:
- Story points become "1 point = 1 day" anyway, defeating the purpose.
- Velocity gets gamed (inflate points → look productive).
- New team / new tech → no historical velocity to extrapolate.
- Cross-team dependencies invalidate velocity (your team can't ship without theirs).

For most teams, **honest time ranges** beat story points. Story points are a sophisticated tool that works for sophisticated processes; for a 3-person startup, "we think it's a week" is more useful.

## The buffer

After breaking down and summing, add buffer. Some practitioners say 50%. Some say 100%. The right answer depends on:

- **How well you know the area.** New domain: more buffer.
- **How much coordination is needed.** Cross-team: more buffer.
- **Integration risk.** Touching 3 services or 3rd parties: more buffer.
- **How many unknowns.** "Build the new design system" → many unknowns → big buffer.
- **Your track record.** If your past estimates were 2× under, your buffer should be 2×.

Track your batting average. Over six months, look at every estimate vs actual. Compute the ratio. *That's your buffer multiplier*. Apply it from now on. (Most engineers are surprised: it's often 1.5-3×.)

## The pre-mortem

Before committing to an estimate, run a 15-minute pre-mortem:

> "It's three months from now. The project shipped 4 weeks late. What happened?"

Brainstorm freely. You'll generate:
- "We didn't realize service X needed an API change."
- "QA found 30 bugs the week before launch."
- "Procurement took 6 weeks to approve the contract."
- "Half the team was sick at the worst moment."

Most of these you can mitigate (parallel work, more testing, kick off procurement now). Some you can buffer for. All of them you should be *aware* of.

Pre-mortems surface risks better than asking "what could go wrong?" because you've placed yourself in a future where it *did* go wrong — much easier to brainstorm causes than abstract risks.

## Communicating estimates to stakeholders

The translation problem: engineers think in "best case if I don't get interrupted"; PMs hear "definite ship date." Bridge it:

### State the assumption set

"This estimate assumes:
- No requirements changes after sprint planning.
- Service X is available; we don't need to build it.
- 1 senior + 1 mid engineer; both at >50% capacity.
- If any of these change, the estimate changes."

Now stakeholders know what to protect (your time, scope, the dependency) for the date to hold.

### Refresh the estimate as you learn

The cone of uncertainty narrows over time. After week 1, you know more than you knew at week 0. Update the stakeholder.

- "Original estimate: 6 weeks. After week 1: actually looks like 4-5. We hit fewer integration issues than expected."
- "Original estimate: 6 weeks. After week 1: more like 8 — we discovered the auth migration touches 30 endpoints, not the 10 we'd seen."

Better to update mid-project than to silently slip.

### Distinguish estimate vs commitment

- **Estimate**: "Our best guess is 8 weeks, range 6-12."
- **Commitment**: "We will ship by date X." (Implies you'll cut scope to make the date.)

Be clear about which you're giving. Estimates are predictions; commitments are promises. They're treated very differently by stakeholders.

### Date math

- If you say "2 weeks," what does the stakeholder hear?
- 2 weeks calendar (10 working days) — but you also have meetings, code reviews, 20% Slack overhead. Realistic capacity for focused work: ~4-6 days.
- Add coordination: -1 day.
- Add bug fixes for the launch: -1 day.
- "2 weeks of work" really means ~2-3 weeks of calendar time.

Make this explicit. "10 working days of focused work, which is 2.5-3 calendar weeks."

## When to refuse to estimate

Sometimes you genuinely cannot estimate. Refusing the estimate is the right move:

- **You don't understand the requirements.** Need clarification first.
- **The tech is unfamiliar.** Need a spike (1-3 day exploration) first.
- **There are critical unknowns you can't resolve without doing the work.** Spike first, estimate after.

The pattern: "I can give you an estimate after a 2-day spike. Without it, I'm just guessing."

Stakeholders prefer truthful "I don't know yet" over false confidence. Engineers who insist they can estimate everything lose credibility when they're 3× over.

## Sprint planning patterns

The Agile staple. Common patterns:

### T-shirt sizing

S, M, L, XL — coarse buckets, useful for backlog grooming. "M means 3-5 days; L means 1-2 weeks; XL needs to be broken down."

### Planning poker

Team members estimate independently, reveal simultaneously. Discuss disagreements. Re-estimate. Surfaces hidden info (you know about a complication someone else didn't).

### Three-point estimates

Optimistic + Most-likely + Pessimistic. PERT formula: `(O + 4M + P) / 6`. Communicates uncertainty inherently.

### #NoEstimates

A movement that says: estimates are wasteful; just slice work small enough that all stories take 1-2 days, count throughput, project from that. Works for teams with stable, well-defined work; harder when stakeholders demand dates.

For most teams, **three-point estimates with explicit ranges** strikes the best balance: realistic, communicates uncertainty, easy to communicate.

## Long-running estimates: tracking + communicating

For multi-month projects:

- **Update a burn chart**: planned scope vs completed, week by week. Visible to all.
- **Weekly status note**: "completed X, still on track / 1 week behind because of Y."
- **Re-baseline as you learn**: don't pretend the original estimate was right when it clearly isn't.

Trust comes from saying "we're 2 weeks behind, here's why, here's what we're doing." It doesn't come from "still on track, still on track, still on... well, we missed."

## The personal ledger

Keep a personal log: for each task you finish, write down your estimate and the actual time. Over weeks, patterns emerge:

- "I underestimate by 50% on average."
- "I'm decent on backend; off by 3× on frontend."
- "Anything involving DB migrations takes 2× what I think."

Now you can apply your own correction factor. Most engineers are surprised by how consistent their bias is.

## Common mistakes

:::caution[Where people commonly trip up]
- **Estimating big chunks.** "This feature is 3 weeks." Far too coarse. Break into 5-10 sub-tasks, estimate each, sum.
- **Single-number estimates.** "5 days" hides uncertainty. "3-8 days" tells the truth.
- **No buffer.** Estimate-without-buffer is "best case if everything goes well" — and nothing ever goes entirely well. Add 50-100% based on your historical batting average.
- **Treating estimates as commitments.** "You said 2 weeks!" Distinguish them clearly to stakeholders up front.
- **No re-estimation as you learn.** Original estimate was 6 weeks; in week 1 you've discovered new scope. Update. Don't pretend.
- **Confusing 'time you'd spend' with 'calendar time.'** 10 hours of focused work isn't 10 hours of calendar time; allow for meetings, reviews, interruptions.
- **Estimating in a vacuum.** No one knows everything; estimating with the team surfaces dependencies and knowledge gaps. Don't estimate solo for non-trivial work.
- **Velocity as performance metric.** Once velocity is used to compare engineers or teams, it gets gamed. It's a *capacity planning* tool, not a productivity score.
- **'I'll just push through it' to hit the date.** Pulling 60-hour weeks may hit the date once. The next sprint, productivity drops, bugs increase, attrition rises. Burnout debt compounds.
- **Estimating without acceptance criteria.** "Build a search feature" → can mean a one-day search box or a six-month relevance engine. Get acceptance criteria; estimate against those.
- **Hiding bad news.** Slipping the date is bad. Hiding the slip until last week is much worse. Tell stakeholders as soon as you know.
- **Refusing to negotiate scope.** "It's 8 weeks of work" — fine, but if the business needs it in 4, what subset is shippable in 4? Always offer the scope conversation.
:::

## Page checkpoint

<Quiz id="lifecycle-estimation-page" title="Did estimation stick?" sampleSize={2}>

<Question
  prompt="Why does breaking a feature into smaller pieces reliably improve estimate accuracy?"
  options={[
    { text: "Small pieces are inherently easier to build" },
    { text: "A large piece has many unknowns (each contributing variance); small pieces have few. You can estimate small concrete tasks ('build this endpoint') much better than 'build a feature.' Decomposition also surfaces dependencies and unknowns, letting you spot risks early" },
    { text: "Small pieces can be done by less skilled engineers" },
    { text: "It's only true for backend work" }
  ]}
  correct={1}
  explanation="The cone of uncertainty applies per piece. Many small pieces of low uncertainty sum to a more predictable total than one big piece of high uncertainty. Decomposition also forces you to think concretely about the work, which surfaces unknowns."
  revisit={{ to: "/docs/lifecycle/estimation#decomposition-the-most-reliable-lever", label: "Decomposition" }}
/>

<Question
  prompt="A stakeholder asks for 'the date.' You respond '8 weeks.' They write it down. What's the risk?"
  options={[
    { text: "8 weeks isn't enough" },
    { text: "A single-number estimate strips uncertainty. The stakeholder treats it as a commitment; you've also committed to no surprises. The honest answer is a range with assumptions: '6-12 weeks, expected ~8, assuming X and Y stay stable.' Then the negotiation is about scope or assumptions, not slipping a 'promised' date" },
    { text: "Stakeholders dislike numbers" },
    { text: "8 weeks is bad luck" }
  ]}
  correct={1}
  explanation="Single-number estimates hide the cone of uncertainty. Stakeholders hear commitments; engineers gave predictions. Express ranges and assumptions explicitly to keep the conversation honest."
  revisit={{ to: "/docs/lifecycle/estimation#estimate-as-a-range-then-negotiate-scope", label: "Estimate as range" }}
/>

<Question
  prompt="An engineer's last 10 projects all shipped 2× their original estimate. They're estimating a new project at 4 weeks. What should they do?"
  options={[
    { text: "Estimate harder this time" },
    { text: "Apply their historical batting-average correction (2×) and adjust: 'expected 8 weeks, range 6-12.' Personal estimation bias is remarkably consistent; tracking actual-vs-estimate over time gives you a calibration multiplier" },
    { text: "Refuse to estimate" },
    { text: "Estimate 1 week to overcompensate" }
  ]}
  correct={1}
  explanation="Estimation bias is a *systematic* error. Tracking your actual-vs-estimate ratio reveals your personal multiplier. Apply it as a correction factor. Most engineers are surprised at how consistent their bias is."
  revisit={{ to: "/docs/lifecycle/estimation#the-personal-ledger", label: "Personal ledger" }}
/>

<Question
  prompt="What's a 'pre-mortem' and why is it useful for estimation?"
  options={[
    { text: "A medical exam" },
    { text: "A 15-minute exercise where the team imagines the project shipped 4 weeks late and brainstorms what went wrong. Surfaces risks better than asking 'what could go wrong?' because you're imagining a future where things did go wrong — easier to generate causes than abstract risks. Mitigate or buffer for what you find" },
    { text: "A postmortem written before the project" },
    { text: "A formal review with executives" }
  ]}
  correct={1}
  explanation="Pre-mortems work because they invert the cognitive task. 'What could go wrong' is abstract and hard; 'why did this go wrong' (in an imagined failure) is concrete and easy. Use it before committing to a plan."
  revisit={{ to: "/docs/lifecycle/estimation#the-pre-mortem", label: "Pre-mortem" }}
/>

</Quiz>

## What's next

→ Continue to [Documentation craft](./documentation).
