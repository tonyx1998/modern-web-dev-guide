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

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating "the team already knows it" as the whole answer.** Today's six engineers know Elixir. The seventh hire and the manager you'll need to recruit next year don't. The hiring constraint is about who you'll *need*, not who you have — discount the current team's preference accordingly.
- **Assuming AI-assisted coding erases the talent-pool gap.** AI helps engineers move into unfamiliar languages faster, but the senior engineers who can debug a production incident at 2 a.m. in Haskell still have to exist somewhere. Niche-language seniority is still scarce regardless of how good the tooling gets.
- **Picking the niche tech and *then* trying to justify it.** Engineers fall in love with the tool first and reach for "but it'll attract passionate engineers" as the post-hoc reason. If your moat-related justification existed before the engineer's enthusiasm, fine. If it appeared after, you're rationalizing.
- **Ignoring the hiring lens for internal tools.** Custom internal frameworks ("our own auth abstraction," "our own ORM") have a hiring pool of *zero* — every new engineer pays the onboarding tax. That cost is invisible at five engineers and crippling at fifty. Internal tools are the most extreme version of the hiring constraint.
:::

## Page checkpoint

<Quiz id="decisions-hiring-constraint-page" title="Did the hiring constraint stick?" sampleSize={2}>

<Question
  prompt="A B2B SaaS picks Haskell 'for correctness.' Two years in, one engineer knows it well, three can mostly work around it, and recruiting is constant grind. The chapter's verdict:"
  options={[
    { text: "Worth it — correctness compounds over time" },
    { text: "Not worth it — TypeScript or Go would have shipped the same product with 3x the candidate pool; niche tech is a tax when it's not central to your moat" },
    { text: "Solve it by hiring an external recruiter specializing in Haskell" },
    { text: "Rewrite the codebase in OCaml instead" }
  ]}
  correct={1}
  explanation="The chapter contrasts this with the Elixir-for-real-time case, where niche tech genuinely fits the moat. Haskell-for-vibes is the canonical mistake: a permanent velocity tax with no differentiator to justify it."
  revisit={{ to: "/docs/decisions/hiring-constraint#the-counter", label: "When niche tech isn't worth it" }}
/>

<Question
  prompt="The chapter argues 'hiring difficulty being 2x' actually costs more than 2x. Why?"
  options={[
    { text: "It just feels like more because hiring is annoying" },
    { text: "It compounds: slower fills stall projects, higher comp expectations spread across the team, attrition rises because the pool is small, and leadership pipelines shrink" },
    { text: "Niche-tech engineers refuse to do code reviews" },
    { text: "Recruiting agencies double their fees" }
  ]}
  correct={1}
  explanation="The Highlight lays out the compounding: slower fills, higher comp, higher attrition, smaller diversity pool, weaker competitive offers. A single niche-tech bet becomes a system-wide constraint."
  revisit={{ to: "/docs/decisions/hiring-constraint#the-counter", label: "Compounding cost" }}
/>

<Question
  prompt="When IS picking a niche technology justified, per the chapter?"
  options={[
    { text: "When the engineering team finds it fun" },
    { text: "When it's genuinely central to your moat — like Elixir for a real-time-messaging product whose differentiator is the BEAM's actor model" },
    { text: "Whenever a senior engineer recommends it" },
    { text: "Whenever the alternative is a few percent slower" }
  ]}
  correct={1}
  explanation="The Elixir case is the chapter's example of a worthwhile niche pick: real-time messaging IS the product, BEAM fits genuinely, and the small pool of senior Elixir engineers is fanatically loyal. Otherwise it's a tax."
  revisit={{ to: "/docs/decisions/hiring-constraint#the-counter", label: "Niche worth-it case" }}
/>

<Question
  prompt="A 6-person startup is choosing a backend language. Per the chapter's 2026 hiring difficulty table, which sequence orders these from easiest to hire for to hardest?"
  options={[
    { text: "Haskell → Rust → TypeScript → Python" },
    { text: "TypeScript → Go → Rust → Haskell" },
    { text: "Go → Python → TypeScript → Elixir" },
    { text: "Custom internal tools → OCaml → Vue → Python" }
  ]}
  correct={1}
  explanation="The chapter's rough table: TypeScript/React and Python are easy; Go is moderate; Rust is harder; Elixir/Clojure are hard; OCaml/Haskell very hard; custom internal tools impossible. TS → Go → Rust → Haskell matches that ordering."
  revisit={{ to: "/docs/decisions/hiring-constraint#hiring-difficulty-rough-2026-estimates", label: "Hiring difficulty table" }}
/>

</Quiz>

## What's next

→ Continue to [A Decision-Making Checklist](./checklist) — ten questions to run through on any significant decision.
