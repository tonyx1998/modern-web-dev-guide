---
id: team-size-heuristic
title: The Team Size Heuristic
sidebar_position: 4
sidebar_label: 3. Team Size
description: Your team's size constrains what's optimal. Patterns that work for 5 people often fail at 50.
---

# The Team Size Heuristic

> **In one line:** Your team size constrains what's optimal — patterns that work for 5 people often fail at 50, and patterns designed for 500 engineers crush a small startup.

:::tip[In plain English]
The biggest source of wasted engineering effort is **importing practices from a much larger or smaller company** without considering whether they fit. A solo developer doesn't need RFCs. A 500-person org can't survive without them. Match the process to the size.
:::

A pattern that works for a 5-person team often fails at 50. A pattern designed for 500 engineers crushes a small startup. Use these bands as a rough guide, not a rulebook.

## 1 person

**Optimize for:** Speed, joy, learning.

- Pick what you know best.
- Use defaults aggressively.
- Skip process.
- Don't build for hypothetical future scale.

## 2–10 people

**Optimize for:** Shipping velocity, low coordination cost.

- Pick popular defaults (you'll hire people who already know them).
- Maintain code quality through review and tests.
- Lightweight process — daily standup, sprint planning, retros.
- *Modular monolith* (one deployable app internally split into clear modules — not microservices).
- One product manager or founder calls product shots.

## 10–50 people

**Optimize for:** Sustainable velocity, emerging specialization.

- Standardize aggressively (everyone uses the same stack).
- Allow exceptions only with justification.
- Real engineering process — code review requirements, on-call rotation, deployment automation.
- Begin to specialize (frontend, backend, infra-curious).
- Start building internal documentation and runbooks.

## 50–500 people

**Optimize for:** Team autonomy, cross-team coordination.

- Strong defaults; deviation requires architectural review.
- Distinct teams with clear ownership.
- Internal platforms emerge (or formal vendors take their place).
- Real process: *RFCs* (written design proposals reviewed by peers), *ADRs* (Architecture Decision Records that log why a choice was made), formal launches.
- SRE / DevOps becomes a discipline.

## 500+ people

**Optimize for:** Reliability, scalability, hiring.

- Build internal platforms that abstract complexity from product teams.
- Formal compliance and security programs.
- Multiple parallel investments (ML platform, design system, observability platform).
- Heavy process around production changes.
- Specialized roles for every function.

## How to apply it

Ask: "Is this practice helping or hurting at our current size?" Add what genuinely helps. Remove what's pure overhead.

The biggest mistake is **importing practices from a much larger or smaller company** without considering whether they fit — sometimes called *cargo-culting* (mimicking the form of a successful team's process without the underlying conditions that made it work).

:::note[Worked example: a process that broke a 12-person team]
A 12-person startup hires a senior engineer from a 5,000-person company. The new hire introduces:

- A formal RFC process for any change over 100 lines.
- A weekly architecture review meeting.
- Required design docs before any new feature.

Six months later, the team is shipping half as much as before. The process was correct *at the previous company's scale*, where you might never meet the team affected by your change. At 12 people, you can literally walk over to them.

The fix: keep ADRs for genuinely irreversible decisions (database, language, auth provider) and drop the rest. Velocity recovered within a month.
:::

:::info[Highlight: the symmetric mistake]
The *opposite* mistake — a 200-person org running with no process because "we move like a startup" — is equally common and equally expensive. By 200 people, you cannot all sit in one room and align. Either process emerges deliberately, or it emerges as chaos.

Process should scale up with team size. A team of 1 doesn't write RFCs; a team of 500 cannot survive without them.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Anchoring on the practices of your last job.** The "this is just how engineering works" instinct is almost always wrong — it's how engineering worked at *your previous size*. When you join a new team, run an explicit audit of which practices serve the current headcount and which were imported from elsewhere.
- **Adding process to fix a hiring or trust problem.** RFCs don't make junior engineers more senior, and architecture review boards don't fix a team that doesn't trust each other. If you're tempted to add process, ask whether the underlying issue is actually team composition or interpersonal — process won't patch either.
- **Refusing to add process at 50+ because "we're still a startup."** Identity-based resistance is the symmetric failure to cargo-culting. Once you can't fit everyone in one room, ad-hoc coordination *is* chaos. The right move is deliberately introducing the lightest process that lets ownership stay clear.
- **Picking the architecture for the team size you wish you had.** Building microservices "because we'll need them at 100 engineers" when you have 8 is the same mistake as a 500-person org running with no process. Build for the team you have today plus the next 12 months, not the org chart on the slide deck.
:::

## Page checkpoint

<Quiz id="decisions-team-size-heuristic-page" title="Did the team size heuristic stick?" sampleSize={2}>

<Question
  prompt="A new senior hire at a 12-person startup introduces a formal RFC process for any change over 100 lines, plus a weekly architecture review. Six months later velocity has halved. What's the diagnosis?"
  options={[
    { text: "The team needs even more process to scale" },
    { text: "Cargo-culting practices from a much larger company that don't fit the current size" },
    { text: "The new hire isn't writing enough code themselves" },
    { text: "RFCs are always a bad idea at any team size" }
  ]}
  correct={1}
  explanation="The chapter's central warning: importing practices from a much larger (or smaller) org without checking fit. At 12 people you can walk to anyone affected. The fix is keeping ADRs for genuinely irreversible decisions and dropping the rest."
  revisit={{ to: "/docs/decisions/team-size-heuristic#how-to-apply-it", label: "How to apply it" }}
/>

<Question
  prompt="At what team size band does the chapter say RFCs and ADRs become real, formalized process — not optional?"
  options={[
    { text: "1 person" },
    { text: "2–10 people" },
    { text: "50–500 people" },
    { text: "Never — RFCs are always cargo-culted process" }
  ]}
  correct={2}
  explanation="The 50–500 band is where strong defaults, architectural review, RFCs, and ADRs become the norm. Below that they're often overhead; above it the org can't survive without them."
  revisit={{ to: "/docs/decisions/team-size-heuristic#50500-people", label: "50–500 people" }}
/>

<Question
  prompt="A 200-person engineering org runs with essentially no process because 'we move like a startup.' What does the chapter predict?"
  options={[
    { text: "They'll ship faster than competitors with process" },
    { text: "Process emerges as chaos rather than deliberately — and that's expensive" },
    { text: "Their boring-technology choices will save them" },
    { text: "It works fine as long as the founders are still there" }
  ]}
  correct={1}
  explanation="The chapter calls this the symmetric mistake to over-processing a small team. By 200 people you can't all sit in one room and align — process appears either deliberately or as chaos."
  revisit={{ to: "/docs/decisions/team-size-heuristic#how-to-apply-it", label: "The symmetric mistake" }}
/>

<Question
  prompt="For an 8-person team, which architectural default does the chapter recommend?"
  options={[
    { text: "Microservices, one per engineer" },
    { text: "A modular monolith — one deployable, internally split into clear modules" },
    { text: "A service mesh with formal API contracts between modules" },
    { text: "Whichever pattern the largest competitor uses" }
  ]}
  correct={1}
  explanation="At 2–10 people the chapter explicitly recommends a modular monolith: one deployable, clear internal modules. Microservices add coordination cost that small teams can't afford."
  revisit={{ to: "/docs/decisions/team-size-heuristic#210-people", label: "2–10 people" }}
/>

</Quiz>

## What's next

→ Continue to [The Build vs Buy Decision](./build-vs-buy) — default to buying for non-core capabilities; build only where you're the world's expert.
