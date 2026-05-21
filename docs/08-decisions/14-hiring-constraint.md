---
id: hiring-constraint
title: The Hiring-Constraint Principle
sidebar_position: 15
sidebar_label: 14. Hiring Constraint
description: Pick technologies your future self can hire for. The hiring lens is a real engineering concern.
---

# The Hiring-Constraint Principle

> **In one line:** Pick technologies your future self can hire for — the hiring lens is a real engineering concern, not just a recruiting one.

:::tip[In plain English]
Some technologies are easier to hire for than others. This compounds: hiring for a niche tech is harder, so candidates are scarcer, so you compete harder, so they're more expensive — and once hired, they leave more easily because demand is so high. The cost of "I picked Elixir because I love it" can be a permanent two-person engineering team.
:::

Some technologies are easier to hire for than others. This compounds: hiring for a niche tech is harder, so candidates are scarcer, so you compete harder, so they're more expensive — and once hired, they leave more easily because demand is so high.

## Hiring difficulty (rough 2026 estimates)

| Technology              | Hiring difficulty       |
|-------------------------|-------------------------|
| TypeScript / React      | Easy (huge pool)        |
| Python                  | Easy                    |
| Go                      | Moderate                |
| Vue                     | Moderate (esp. US)      |
| Rust                    | Harder                  |
| Elixir, Clojure         | Hard                    |
| OCaml, Haskell          | Very hard               |
| Custom internal tools   | Impossible              |

The hiring lens is a real engineering concern, not just a recruiting one.

## The counter

Sometimes a niche technology is the right choice — it lets you punch above your weight, attract passionate engineers, or solve specific problems better. Just know the trade-off.

:::note[Worked example: a niche pick that was worth it (and one that wasn't)]
**Worth it:** A 6-person startup uses Elixir/Phoenix because real-time messaging is their product and BEAM's actor model genuinely fits. They struggle to hire mid-level engineers, but the small pool of senior Elixir engineers is *fanatically* loyal. They make the trade work because the tech is core to their differentiator.

**Not worth it:** A B2B SaaS picks Haskell for the backend "because correctness." Two years in, they have one engineer who actually knows it well, three who can mostly work around it, and recruiting is a constant grind. The product would have worked just as well in TypeScript or Go, and they would have had three times the candidate pool. The decision becomes the most expensive item in their tech roadmap — not in dollars, but in *velocity*.

The lesson: niche tech is justifiable when it's central to your moat. It's a tax otherwise.
:::

:::info[Highlight: hiring difficulty is a compounding cost]
A single hire being twice as hard isn't 2x cost — it's worse:

- **Slower fills** → projects stall waiting for headcount.
- **Higher comp** → salary expectations compound across the team.
- **Higher attrition** → niche-skill engineers get poached more easily.
- **Smaller pool** → harder to diversify, harder to fill leadership roles.
- **Less competitive offers** from people who *could* leave to other niche-tech employers.

If you can't articulate a *specific* reason the niche tech is worth all of that, it isn't.
:::

## What's next

→ Continue to [A Decision-Making Checklist](./checklist) — ten questions to run through on any significant decision.
