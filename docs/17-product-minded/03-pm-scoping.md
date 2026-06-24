---
id: pm-scoping
title: Scoping Under Ambiguity
sidebar_position: 4
sidebar_label: Scoping ambiguity
description: Turning a vague ask into the smallest shippable test of the riskiest assumption — narrowing fuzzy requests into hypotheses, using prototypes as discovery, and defending a v1 from scope creep.
---

# Scoping Under Ambiguity

> **In one line:** The product-minded skill that follows discovery is **compression** — taking a fuzzy ask ("make onboarding better") and cutting it down to the *smallest thing you can ship that tests the riskiest assumption*, then defending that small thing from the endless "while you're at it…" that would sink it.

:::tip[In plain English]
Real work rarely arrives as a clean spec. It arrives as "users are confused by our app" or "we should do something with AI." A product-minded engineer's job is to convert that fog into a concrete, shippable bet. The trick is to find the **riskiest assumption** — the thing that, if it's wrong, makes the whole effort pointless — and build the smallest possible version that tests *just that*. Not the polished product; the cheapest experiment that tells you whether you're on the right track. Then comes the hard part: holding the line. The moment you start, well-meaning people (including yourself) pile on "could it also…?" Every yes pushes the test further away. Scoping under ambiguity is equal parts *finding* the small thing and *protecting* it.
:::

## Step 1 — Turn the fog into a hypothesis

A vague ask is not actionable; a hypothesis is. Convert it:

- **Vague:** "Make onboarding better."
- **Sharpen with discovery:** *why* do we think it's bad, *for whom*, *measured how*? → "New users drop off before connecting their first data source; 60% never finish step 3."
- **Hypothesis:** "If we let users skip data-import and explore with sample data first, more will reach the aha-moment and finish setup." Now it's testable.

A good hypothesis names a **change**, an **audience**, and an **expected effect** you could actually observe. If you can't state it, you haven't scoped — you've just renamed the fog.

## Step 2 — Find the riskiest assumption

Every plan rests on assumptions; one of them is load-bearing. Ask: *what has to be true for this to work, and which of those am I least sure of?* That's where to aim the first build.

```
   Riskiest assumption (build a test for THIS first):
     "users will explore with fake data instead of bailing"   ← unproven, kills the idea if false
   Safe assumptions (don't waste the first build proving these):
     "we can render a sample dataset"      ← obviously doable
     "the button can be styled nicely"     ← never the risk
```

Beginners build the easy, certain parts first (they're comfortable) and discover the fatal flaw last. Reverse it: **spend your first effort on the part most likely to be wrong.**

## Step 3 — Build the smallest test (prototype as discovery)

The smallest test is often *not* production code. A prototype is a **question you ask with an artifact**, not a down-payment on the product:

- A clickable mockup that tests whether the flow makes sense — no backend.
- A hardcoded/"Wizard of Oz" version where you fake the hard part by hand to see if anyone wants the output.
- A single real path shipped to 10 users, ignoring the other 9 cases.

The point is *learning per unit effort*. If a day of fake beats a month of real for answering the risky question, build the fake. (This is the [reversibility](/docs/decisions/reversibility) and [build-vs-buy](/docs/decisions/build-vs-buy) judgment applied to your own time.)

## Step 4 — Defend the v1

Scope creep is the default failure. Two defenses:

- **The "not now" list.** Every "could it also…?" goes onto a visible list — not rejected, *deferred*. This satisfies the impulse without expanding the build. Most items die quietly once the v1 ships and reality reprioritizes.
- **Anchor to the hypothesis.** For each proposed addition ask: "does this help test the riskiest assumption?" If no, it's not v1. The hypothesis is the gatekeeper.

A v1 that ships and teaches you something beats a v3 that's still in progress.

:::note[Worked example: "we should add AI to our app"]
A founder drops this on you. Fog. You don't open an editor — you scope. **Hypothesis:** discovery showed support agents waste time writing the same answers, so → "If we draft replies from past tickets, agents will resolve tickets faster." **Riskiest assumption:** not "can an LLM generate text" (obviously yes) but "are the drafts good enough that agents *accept* them instead of rewriting from scratch." **Smallest test:** skip the polished in-app UI; take 50 real past tickets, generate drafts in a script, and show them to three agents — would they have sent these? That's an afternoon, no integration, and it directly attacks the load-bearing unknown. If agents say "useless, I'd rewrite all of them," you just saved a quarter of engineering. If they say "I'd send 70% as-is," *now* you build the real feature with confidence — and everything else the founder imagined ("AI analytics! AI everywhere!") goes on the not-now list.
:::

## Why it matters

Ambiguity is where engineers either shine or sink months. The product-minded move — hypothesis, riskiest assumption, smallest test, defended scope — is how you convert vague asks into fast learning instead of long, confident marches in the wrong direction. It's also exactly what forward-deployed and founding-engineer interviews probe: hand you a fuzzy problem and watch whether you narrow it or freeze.

## Common pitfalls

:::caution[Where engineers go wrong]
- **Building before the ask is a hypothesis.** If you can't state the change/audience/effect, you'll build a renamed version of the fog.
- **Proving the safe parts first.** Comfort leads engineers to build what they know works and meet the fatal flaw last. Attack the riskiest assumption first.
- **Treating a prototype as production.** A test artifact is a question, not a foundation — don't over-engineer the throwaway, and don't be afraid to throw it away.
- **Saying yes to creep.** Every "while you're at it" pushes the learning further out. Use a not-now list and the hypothesis as gatekeeper.
- **Shipping nothing because it isn't complete.** A small thing that ships and teaches beats a big thing that doesn't. Optimize for learning, not coverage.
:::

## Page checkpoint

<Quiz id="pm-scoping-page" title="Did scoping stick?" sampleSize={2}>

<Question
  prompt="What should you build FIRST when scoping an ambiguous project?"
  options={[
    { text: "The parts you're most confident you can build" },
    { text: "The smallest test of the RISKIEST assumption — the thing that, if wrong, makes the whole effort pointless — even if that test is a prototype, a hardcoded fake, or a single path shown to a few users" },
    { text: "A complete, polished version of every feature requested" },
    { text: "The user interface, since that's what people see" }
  ]}
  correct={1}
  explanation="Aim your first effort at the load-bearing unknown, not the comfortable certain parts. The smallest artifact that answers 'is the risky assumption true?' — often not production code — maximizes learning per unit effort."
  revisit={{ to: "/docs/product-minded/pm-scoping#step-2--find-the-riskiest-assumption", label: "Riskiest assumption" }}
/>

<Question
  prompt="A vague ask like 'make onboarding better' becomes actionable when you turn it into what?"
  options={[
    { text: "A long list of every possible feature" },
    { text: "A hypothesis naming a specific change, an audience, and an expected observable effect (e.g., 'if new users explore with sample data first, more will finish setup') — sharpened by discovery into why/for-whom/measured-how" },
    { text: "A deadline" },
    { text: "A budget estimate" }
  ]}
  correct={1}
  explanation="A hypothesis with a change, an audience, and an expected effect is testable; a renamed vague ask is not. Discovery supplies the why/for-whom/metric that sharpens fog into a bet you can actually run."
  revisit={{ to: "/docs/product-minded/pm-scoping#step-1--turn-the-fog-into-a-hypothesis", label: "Fog to hypothesis" }}
/>

<Question
  prompt="What's the best defense against scope creep on a v1?"
  options={[
    { text: "Accept every addition so nobody is disappointed" },
    { text: "Keep a visible 'not now' list that defers (not rejects) additions, and gate every proposed feature with 'does this help test the riskiest assumption?' — anchoring scope to the hypothesis" },
    { text: "Refuse to talk to anyone until you ship" },
    { text: "Add everything but build it more slowly" }
  ]}
  correct={1}
  explanation="A not-now list honors ideas without expanding the build, and most items die once reality reprioritizes after launch. Anchoring each addition to the hypothesis keeps v1 focused on learning the one thing that matters."
  revisit={{ to: "/docs/product-minded/pm-scoping#step-4--defend-the-v1", label: "Defending v1" }}
/>

</Quiz>

## What's next

→ Next: [Demo-driven iteration & owning outcomes](/docs/product-minded/pm-demo-loop) — shipping the small thing and using it to steer.
