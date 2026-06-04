---
id: overriding
title: When to Override These Frameworks
sidebar_position: 17
sidebar_label: 16. Overriding
description: Frameworks are heuristics, not laws. The skill develops with experience — default to the frameworks early, learn when to deviate.
---

# When to Override These Frameworks

> **In one line:** Frameworks are heuristics, not laws — early in your career, default to them; as you gain context, learn when "usually right" doesn't apply.

:::tip[In plain English]
Everything in this chapter is a *default*, not a rule. Real situations have edge cases, urgent constraints, and team dynamics that the frameworks don't capture. The skill of senior engineering is knowing when to follow the framework and when to deviate — and being able to explain *why* you deviated, in words your team accepts.
:::

Frameworks are heuristics, not laws. Sometimes:

- **Use a non-boring technology** because it fits your problem uniquely well.
- **Spend weeks on a reversible decision** because the team strongly disagrees and alignment matters.
- **Build instead of buy** because the build is genuinely cheaper than the long-term license fee.
- **Skip the framework entirely** because the situation is urgent.

The frameworks tell you what's usually right. Judgment tells you when "usually" doesn't apply.

The skill develops with experience. Early in your career, default to the frameworks. As you gain context, learn when to deviate.

:::note[Worked example: a legitimate framework override]
A team chooses Rust for a new payments service, even though TypeScript would have been the "boring" choice. Why?

- The service handles money — correctness genuinely matters more than ship speed.
- The two engineers building it both have prior Rust experience.
- Performance characteristics matter (high transaction volume).
- The blast radius of a bug is large enough to justify the extra rigor.

This is a *justified* override: a real reason, articulated in writing, with stakeholder buy-in. Compare to "we want to use Rust because it would be fun" — same final choice, completely different decision quality.

The framework's value isn't in the answer; it's in forcing you to *defend* the override out loud.
:::

:::info[Highlight: the meta-skill — know when to refuse complexity]
Most failed projects fail because they took on too much, not too little. The single biggest predictor of engineering success isn't intelligence or hours worked — it's *restraint*. Building the smallest thing that could possibly work, then letting real usage drive what comes next, beats elaborate up-front planning almost every time.

Key frameworks to remember from this chapter:

- **Boring technology** for everything that isn't your differentiator.
- **Reversibility** as a guide to how much to deliberate.
- **Team size heuristics** to apply right-sized practices.
- **Build vs buy** weighted heavily toward buying.
- **Cost of inaction** to justify refactors and migrations.
- **Two-pizza teams** for ownership clarity.

Decision-making is the hidden craft of senior engineering. Anyone can write code; the multiplier is making good decisions about what to build and how.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Overriding the framework before you've internalized it.** New engineers reach for the override on day one because the default "doesn't fit our situation." Almost always, the framework fits and you haven't yet seen why. Use the defaults for at least a year of real decisions before claiming the situation is special.
- **Calling every deviation an "override" instead of a mistake.** Senior engineers protect their identities with "we deliberately chose this" — even when the choice was really expedience under pressure. An honest post-mortem distinguishes "we overrode for these reasons" from "we cut a corner and it cost us." Use the right label.
- **Treating the worked example as the rule.** "We used Rust for our payments service" is one team's override; it's not a license for *your* team to choose Rust. The override's value lives in the specific reasoning that justified it, not in the final answer. Don't copy the answer; copy the discipline.
- **Forgetting that "skip the framework, situation is urgent" needs a follow-up.** Skipping deliberation in a fire is fine. Not revisiting the decision once the fire is out is how technical debt is born. Log every framework-override-under-pressure as a TODO to re-evaluate when things calm down — most of them will need correcting later.
:::

## Page checkpoint

<Quiz id="decisions-overriding-page" title="Did overriding the frameworks stick?" sampleSize={2}>

<Question
  prompt="A team picks Rust over TypeScript for a new payments service — overriding the 'boring technology' default. Per the chapter, which of these makes this a JUSTIFIED override?"
  options={[
    { text: "An engineer likes Rust and wants to learn it on the job" },
    { text: "The service handles money, both engineers building it have prior Rust experience, performance matters, and the blast radius justifies extra rigor — articulated in writing with stakeholder buy-in" },
    { text: "Rust's logo is cooler" },
    { text: "A blog post said Rust is the future" }
  ]}
  correct={1}
  explanation="The worked example contrasts a real reason (money + experience + performance + blast radius, written down) against 'we want to use Rust because it would be fun.' Same outcome, completely different decision quality."
  revisit={{ to: "/docs/decisions/overriding#frameworks-are-heuristics-not-laws", label: "Legitimate override" }}
/>

<Question
  prompt="The chapter says the framework's real value isn't in the answer it gives. What is it?"
  options={[
    { text: "It guarantees you make the right decision" },
    { text: "It forces you to defend the override out loud — with words your team accepts" },
    { text: "It makes decisions auditable for the board" },
    { text: "It eliminates the need for senior judgment" }
  ]}
  correct={1}
  explanation="The frameworks are heuristics. Their value is forcing articulation when you deviate — turning 'I just felt like it' into a defensible reason. That defense is what makes the override good or bad."
  revisit={{ to: "/docs/decisions/overriding#frameworks-are-heuristics-not-laws", label: "Defend the override out loud" }}
/>

<Question
  prompt="What does the chapter identify as the single biggest predictor of engineering success?"
  options={[
    { text: "Raw intelligence" },
    { text: "Hours worked" },
    { text: "Restraint — building the smallest thing that could work, then letting real usage drive what comes next" },
    { text: "Knowing the most frameworks" }
  ]}
  correct={2}
  explanation="The meta-skill the chapter ends on: most failed projects take on too much, not too little. Restraint — refusing complexity — beats elaborate up-front planning almost every time."
  revisit={{ to: "/docs/decisions/overriding#frameworks-are-heuristics-not-laws", label: "The meta-skill" }}
/>

<Question
  prompt="Per the chapter, when should an engineer default to following the frameworks versus deviating?"
  options={[
    { text: "Always follow them as strict rules" },
    { text: "Default to them early in your career; learn to deviate as you gain context, and when you do deviate, be able to explain why" },
    { text: "Always deviate — frameworks are for beginners" },
    { text: "Follow them only when management is watching" }
  ]}
  correct={1}
  explanation="The chapter's stance: early career = use the frameworks as defaults. With experience comes the ability to recognize when 'usually right' doesn't apply — and the obligation to justify the deviation in words the team accepts."
  revisit={{ to: "/docs/decisions/overriding#frameworks-are-heuristics-not-laws", label: "Default vs deviate" }}
/>

</Quiz>

## What's next

→ Continue to [Chapter 15: Career Path](/docs/career) — paths and learning resources for growing as a web developer in the AI era.
