---
id: why-doing-this
title: The "Why Are You Doing This?" Question
sidebar_position: 14
sidebar_label: 13. Why Are You Doing This?
description: For every project, feature, and change — be able to answer why. Connect to a real user problem, business outcome, or strategic priority.
---

# The "Why Are You Doing This?" Question

> **In one line:** For every project, every feature, every change — be able to answer "why?" — and the answer should connect to a real user problem, a measurable outcome, or a strategic priority.

:::tip[In plain English]
A surprising amount of engineering effort goes into work that nobody can justify when asked directly. "Because we always have." "Because someone said so." "Because it would be cool." Make answering "why?" a habit on every change. The act of asking surfaces the work that should not be happening.
:::

The answer should connect to:

- A real user problem.
- A measurable business outcome.
- A strategic priority.

If the answer is "because we always have" or "because someone said so" or "because it would be cool" — pause. Maybe don't.

## Forcing functions

- PRDs require a "problem statement" section.
- Engineering proposals require a "motivation" section.
- 1:1s ask "what are you working on, and why?"
- Performance reviews ask "what impact did your work have?"

These force the question to surface.

:::note[Worked example: killing a multi-quarter project with one question]
A team has been working for two quarters on a "platform redesign." Onboarding the new engineering manager, she asks each engineer in 1:1s: "What problem does this solve, in a sentence?"

The answers vary wildly:

- "Our old platform is hard to use" (which user? what task?).
- "We need a better foundation for future features" (which features?).
- "It's been on the roadmap" (set by whom, why?).
- "Honestly, I'm not sure" (more common than you'd expect).

Nobody can point to a measurable user problem, a measured-and-unacceptable business outcome, or an explicit strategic decision. The project is paused; engineers are reallocated to two features that *do* have clear motivations. Six months later, neither team misses the redesign.

A single question saved 6+ engineer-quarters of work that nobody could justify when forced to.
:::

:::info[Highlight: "why" should be the first slide, not the last]
The most common failure mode in tech proposals is starting with the *what* (the new architecture, the new tool, the new team structure) and burying the *why* on slide 14. Then in review, everyone debates implementation details, and the underlying motivation never gets scrutiny.

Flip it: state the user problem or business outcome in the first paragraph. Everything else has to justify itself against that. If you can't fit the motivation into a paragraph, you haven't done the thinking yet.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Accepting "the customer asked for it" as a complete answer.** One enterprise customer asking for a feature is not a user problem — it's an account demand. Translate it back into a real problem and check whether the rest of your users have it too, or you'll build niche features that bloat the product for everyone else.
- **Mistaking activity for impact in your "why."** "I shipped 14 PRs this sprint" answers what, not why. The honest impact question — "which user behavior changed because of those PRs?" — often reveals that half the work moved no metric. Connect work to outcome, not output.
- **Letting "strategic priority" mean "the CEO mentioned it once."** Strategic priorities are written down, reviewed, and re-confirmed — they're not the most recent enthusiasm. If you can't point to where the strategy lives, you're working from gossip about strategy, which dies as soon as the next gossip arrives.
- **Asking the question only at kickoff, not mid-project.** Projects accumulate purpose drift: by month four, the team is solving a different problem than the one they started on. Re-ask "why are we doing this?" every couple of months. Sometimes the answer is "we should stop" — and that's the most valuable answer the question produces.
:::

## Page checkpoint

<Quiz id="decisions-why-doing-this-page" title="Did 'why are we doing this?' stick?" sampleSize={3}>

<Question
  prompt="A new engineering manager asks each engineer on a two-quarter 'platform redesign' project: 'What problem does this solve, in one sentence?' Per the worked example, what does she learn?"
  options={[
    { text: "Everyone has a crisp answer connecting it to a user problem" },
    { text: "Nobody can point to a measurable user problem, business outcome, or explicit strategic decision — the project is paused" },
    { text: "The project is technically excellent and worth continuing" },
    { text: "The question is unfair to ask of individual engineers" }
  ]}
  correct={1}
  explanation="The worked example shows the question saving 6+ engineer-quarters. Answers were vibes — 'our platform is hard to use,' 'better foundation,' 'on the roadmap.' Six months after pausing it, no one missed it."
  revisit={{ to: "/docs/decisions/why-doing-this#forcing-functions", label: "Worked example" }}
/>

<Question
  prompt="The chapter says a valid answer to 'why are we doing this?' must connect to one of three things. Which set?"
  options={[
    { text: "A real user problem, a measurable business outcome, or a strategic priority" },
    { text: "An engineer's interest, the team's curiosity, or a Twitter thread" },
    { text: "Industry trends, competitor moves, or analyst reports" },
    { text: "The CTO's preferences, the CEO's preferences, or the board's preferences" }
  ]}
  correct={0}
  explanation="The chapter is specific: user problem, measurable business outcome, or strategic priority. 'Because we always have' or 'because someone said so' are explicit signals to pause."
  revisit={{ to: "/docs/decisions/why-doing-this#forcing-functions", label: "Connect to a real outcome" }}
/>

<Question
  prompt="The chapter's 'why should be the first slide, not the last' advice means:"
  options={[
    { text: "Always present the motivation in the first paragraph; everything else must justify itself against it" },
    { text: "Bury motivation on slide 14 so the architecture gets attention" },
    { text: "Skip motivation entirely if the work is technical" },
    { text: "Lead with team-size considerations instead of user problems" }
  ]}
  correct={0}
  explanation="The common failure is starting with the what (architecture, tools, structure) so reviewers debate implementation and never scrutinize motivation. Flipping it forces the team to justify themselves against the actual goal."
  revisit={{ to: "/docs/decisions/why-doing-this#forcing-functions", label: "Why on the first slide" }}
/>

<Question
  prompt="Which of these is NOT one of the forcing functions the chapter recommends to surface 'why?'"
  options={[
    { text: "PRDs require a 'problem statement' section" },
    { text: "Engineering proposals require a 'motivation' section" },
    { text: "1:1s ask 'what are you working on, and why?'" },
    { text: "All-hands meetings ban technical discussions entirely" }
  ]}
  correct={3}
  explanation="The chapter lists problem-statement sections, motivation sections, 1:1 prompts, and impact-focused performance reviews. Banning technical discussion isn't part of the framework — it's the opposite of useful."
  revisit={{ to: "/docs/decisions/why-doing-this#forcing-functions", label: "Forcing functions" }}
/>

</Quiz>

## What's next

→ Continue to [The Hiring-Constraint Principle](./hiring-constraint) — pick technologies your future self can hire for.
