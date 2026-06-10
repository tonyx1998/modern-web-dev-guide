---
id: two-pizza-rule
title: The Two-Pizza Rule
sidebar_position: 6
sidebar_label: 5. Two-Pizza Rule
description: A team should be small enough that two pizzas can feed it. Communication overhead grows quadratically.
---

# The Two-Pizza Rule

> **In one line:** A team should be small enough that two pizzas can feed it — roughly 6–10 people.

:::tip[In plain English]
Amazon's famous rule. Communication overhead grows quadratically with team size: 10 people have 45 possible pairs to talk; 20 people have 190. Small teams ship faster because there's less to coordinate and ownership is unambiguous. Once "everyone is responsible," no one actually is.
:::

Amazon's famous rule. Translated: 6–10 people maximum.

## Why this matters

- **Communication overhead grows quadratically with team size.** 10 people have 45 possible pairs; 20 people have 190.
- **Small teams ship faster.** Less coordination, more ownership.
- **Accountability is clearer.** When everyone's responsible, no one is.

## How to apply it

- **Service ownership:** Each service owned by one team. If two teams need to coordinate constantly, the service boundary is wrong.
- **Team splitting:** When a team grows beyond ~10, split it.
- **Project teams:** Cross-functional groups should also stay small.

## Trade-offs

Small teams can become silos. Counter with:

- Cross-team rotations.
- Shared design system, infrastructure, observability.
- Open Slack channels.
- Engineering all-hands.

:::note[Worked example: when to split]
A team of 8 ships a feature every two weeks. Over a year, they grow to 14 people.

Symptoms a few months in:

- Standups take 25 minutes instead of 10.
- Half the team is on a Slack thread about a decision that doesn't affect them.
- Two engineers are doing similar work without realizing it.
- Velocity has *dropped* despite adding people (Brooks' law in action).

The fix: split into two teams of 7 with clear ownership boundaries. Maybe "payments + billing" and "core product." Each team gets a single service or module as its primary responsibility. Velocity recovers within a sprint or two.
:::

:::info[Highlight: the boundary test]
If two teams need to be in the same meeting every week to make progress, the boundary is wrong. Either:

1. They're actually one team (merge them), or
2. The service boundary should change so they don't need to coordinate constantly.

The two-pizza rule is really about **conway's law**: your system architecture will end up mirroring your team structure. Get the teams right, and the architecture follows.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Splitting headcount without splitting ownership.** Two teams of 7 that share the same codebase, the same on-call, and the same backlog are just one 14-person team with extra meetings. Splitting only counts when each side owns a service or module that the other doesn't need permission to ship in.
- **Counting only engineers in your team-size math.** Two-pizza teams include the PM, the designer, the data scientist, and anyone else in the standups. A team with 8 engineers, 2 PMs, a designer, and a data lead is already 12 — coordination cost is already biting.
- **Treating the split as permanent.** Team boundaries should track product reality, not org-chart inertia. When two teams find themselves constantly co-deploying, the boundary is wrong; merge or redraw it. The two-pizza count is the goal, not the boundary itself.
- **Hiring to fix throughput when coordination is the bottleneck.** Adding a tenth engineer to a struggling team of nine almost always makes it slower — see Brooks' law in the worked example. Before pitching for more headcount, audit whether the team's *coordination overhead* is what's actually slowing you down.
:::

## Page checkpoint

<Quiz id="decisions-two-pizza-rule-page" title="Did the two-pizza rule stick?" sampleSize={3}>

<Question
  prompt="The chapter says communication overhead grows quadratically with team size. Going from 10 to 20 people roughly takes the number of communication pairs from 45 to:"
  options={[
    { text: "90" },
    { text: "190" },
    { text: "1,000" },
    { text: "It stays roughly the same — communication doesn't scale with size" }
  ]}
  correct={1}
  explanation="Pairs grow as n(n-1)/2. The chapter cites 10 → 45 pairs and 20 → 190 — a 4x jump for only 2x the headcount. That quadratic explosion is why small teams ship faster."
  revisit={{ to: "/docs/decisions/two-pizza-rule#why-this-matters", label: "Why this matters" }}
/>

<Question
  prompt="Two teams in your org need to be in the same meeting every week to make progress on shared work. The chapter's interpretation is:"
  options={[
    { text: "Good — that's healthy cross-team coordination" },
    { text: "The service boundary is wrong — either merge them or change ownership so they don't need to coordinate constantly" },
    { text: "They need a dedicated program manager to run the meetings" },
    { text: "Add a third team to mediate" }
  ]}
  correct={1}
  explanation="The chapter's boundary test: constant coordination signals the split is wrong. The fix is either merging the teams or redrawing service ownership so they can work independently."
  revisit={{ to: "/docs/decisions/two-pizza-rule#trade-offs", label: "The boundary test" }}
/>

<Question
  prompt="A team grows from 8 to 14, standups balloon, two engineers duplicate work, and velocity drops. The chapter calls this:"
  options={[
    { text: "Normal — velocity always dips after hiring" },
    { text: "Brooks' law in action — adding people slows the team down past a certain size; the fix is splitting into two ~7-person teams" },
    { text: "A symptom of bad hiring — the new engineers aren't strong enough" },
    { text: "A reason to centralize all decisions in one tech lead" }
  ]}
  correct={1}
  explanation="The worked example is exactly this scenario. Beyond ~10 the coordination cost dominates the headcount gain. The chapter prescribes splitting into two 7-person teams with clear ownership boundaries."
  revisit={{ to: "/docs/decisions/two-pizza-rule#trade-offs", label: "When to split" }}
/>

<Question
  prompt="The chapter links the two-pizza rule to Conway's law. What does that mean in practice?"
  options={[
    { text: "Your system architecture will end up mirroring your team structure — so get the teams right and the architecture follows" },
    { text: "You should write software in whatever language Conway recommended" },
    { text: "Team size has no effect on architecture" },
    { text: "Architectural decisions should be made by managers, not engineers" }
  ]}
  correct={0}
  explanation="Conway's law: organizations ship their org chart. The two-pizza rule isn't really about pizzas — it's about shaping the team boundaries so the architecture you want falls out naturally."
  revisit={{ to: "/docs/decisions/two-pizza-rule#trade-offs", label: "Conway's law" }}
/>

</Quiz>

## What's next

→ Continue to [The "Why Now?" Question](./why-now) — before adopting any new technology or pattern, demand a concrete reason.
