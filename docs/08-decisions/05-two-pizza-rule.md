---
id: two-pizza-rule
title: The Two-Pizza Rule
sidebar_position: 6
sidebar_label: 5. Two-Pizza Rule
description: A team should be small enough that two pizzas can feed it. Communication overhead grows quadratically.
---

# The Two-Pizza Rule

> **In one line:** A team should be small enough that two pizzas can feed it — roughly 6–10 people.

:::tip In plain English
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

:::note Worked example: when to split
A team of 8 ships a feature every two weeks. Over a year, they grow to 14 people.

Symptoms a few months in:

- Standups take 25 minutes instead of 10.
- Half the team is on a Slack thread about a decision that doesn't affect them.
- Two engineers are doing similar work without realizing it.
- Velocity has *dropped* despite adding people (Brooks' law in action).

The fix: split into two teams of 7 with clear ownership boundaries. Maybe "payments + billing" and "core product." Each team gets a single service or module as its primary responsibility. Velocity recovers within a sprint or two.
:::

:::info Highlight: the boundary test
If two teams need to be in the same meeting every week to make progress, the boundary is wrong. Either:

1. They're actually one team (merge them), or
2. The service boundary should change so they don't need to coordinate constantly.

The two-pizza rule is really about **conway's law**: your system architecture will end up mirroring your team structure. Get the teams right, and the architecture follows.
:::

## What's next

→ Continue to [The "Why Now?" Question](./why-now) — before adopting any new technology or pattern, demand a concrete reason.
