---
id: planning
title: 'Phase 1: Planning (An Afternoon, Not a Month)'
sidebar_position: 4
sidebar_label: 3. Planning
description: A one-paragraph pitch, five v1 features, a rough sketch, and a go/no-go decision. That's the whole solo planning phase.
---

# Phase 1: Planning (An Afternoon, Not a Month)

> **In one line:** Solo planning is short and direct — a paragraph pitch, five features, a sketch, and a go/no-go. If it takes longer than an afternoon, you're overthinking.

:::tip[In plain English]
Big companies spend weeks in product requirements docs because they have to align dozens of people. You have to align *you*. Your "PRD" is a paragraph in Notes.app. Your "design review" is a rectangle drawn on paper. Your "stakeholder sign-off" is asking yourself whether you'd actually use this in three months.
:::

## Step 1: Write the Pitch

In one paragraph, answer:
- What does it do?
- Who is it for?
- Why would they use it instead of alternatives?

If you can't answer in one paragraph, you don't understand it well enough yet.

**Example:**
> "ShelfTrack is a web app for solo readers who want to track which books they're reading without a social network. Goodreads is bloated with social features and ads; ShelfTrack is just a clean shelf with progress tracking, ratings, and optional reading streaks. For me first, then anyone like me."

## Step 2: List the v1 Features

Five or fewer. If you have more, you're not at v1 yet.

**Example for ShelfTrack:**
1. Sign up / sign in.
2. Add a book to my shelf (search by ISBN or title).
3. Mark a book as currently reading, finished, or want-to-read.
4. Rate finished books (1–5 stars).
5. See my shelf as a list.

That's it. Reading streaks, recommendations, social features, exports — all v2+.

## Step 3: Sketch the UI

Paper, Figma, or just a Word doc with rectangles. Don't spend more than two hours.

## Step 4: Decide if It's Worth Building

Ask:
- Would I use this every week?
- Is there a clear next user beyond me?
- Can I build v1 in 2–4 weekends?
- Will I still care in 3 months?

If "yes" to most: build it. If "no" to most: skip it. Side projects you don't finish accumulate in your graveyard and demoralize you.

:::note[Worked example: a real go/no-go]
**Idea:** "An app that helps me track which of my friends I've seen each month."

- Would I use it weekly? Yes, I forget who I haven't seen recently.
- Clear next user? Yes — anyone with a wide social circle.
- 2–4 weekends? Yes — it's a CRUD app over a "friends" table with a date column.
- Still care in 3 months? Honest answer: probably no. I'd use it for a month then forget.

**Verdict:** Don't build. Set a calendar reminder instead.

That five-minute thinking exercise just saved a month of work on a project that wouldn't have stuck.
:::

:::info[Highlight: this is *not* skipping the work]
"Plan less" is not "don't plan." It's "plan in proportion to the project." A weekend tool deserves an afternoon of thought, not three. A 6-month SaaS deserves more — but still in days, not weeks. The point is to match planning depth to project depth so you don't spend more time planning than building.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Inflating the pitch into a pitch deck.** You don't need a problem statement, market sizing, and a competitor matrix — those are artifacts for convincing other people. The fix is one paragraph in plain English. If it doesn't fit, you don't understand the idea yet.
- **Smuggling v2 features into the v1 list.** "Just a small social layer" or "just basic notifications" or "just an export button" — each one quietly doubles the build. The fix is brutal: if a feature isn't required for the first user to get value once, it's v2. Write it down somewhere else and move on.
- **Lying to yourself on "will I still care in 3 months."** Most solo developers say yes here automatically because the idea feels exciting *today*. The fix is to remember an idea from six months ago that excited you the same way and is now untouched. Same neurons, same trap.
- **Sketching in Figma for two days.** Pixel-perfect mockups before code is enterprise muscle memory. The fix is rectangles on paper, photographed, dropped in a Notes file. The sketch exists to clarify *your* thinking, not to brief a designer.
:::

## Page checkpoint

<Quiz id="solo-planning-page" title="Did solo planning stick?" sampleSize={3}>

<Question
  prompt="How long should the entire solo planning phase take?"
  options={[
    { text: "A few hours, an afternoon at most" },
    { text: "Roughly one week" },
    { text: "One month — same as a small team" },
    { text: "It depends entirely on the stack" }
  ]}
  correct={0}
  explanation="The whole point of solo planning is that you're aligning one person (yourself). A paragraph pitch, five features, and a sketch fit comfortably in an afternoon — longer is overthinking."
  revisit={{ to: "/docs/solo/planning#phase-1-planning-an-afternoon-not-a-month", label: "Planning intro" }}
/>

<Question
  prompt="What is the recommended cap on v1 features?"
  options={[
    { text: "Three or fewer" },
    { text: "Five or fewer" },
    { text: "Ten or fewer" },
    { text: "However many fit on one page" }
  ]}
  correct={1}
  explanation="The page says five or fewer features. More than that and you're not at v1 — you're describing v2 disguised as v1, and it will not ship in a reasonable time."
  revisit={{ to: "/docs/solo/planning#step-2-list-the-v1-features", label: "v1 features" }}
/>

<Question
  prompt="Which question is NOT part of the go/no-go check?"
  options={[
    { text: "Would I use this every week?" },
    { text: "Can I build v1 in 2 to 4 weekends?" },
    { text: "Will I still care in 3 months?" },
    { text: "Could this become a unicorn startup?" }
  ]}
  correct={3}
  explanation="The go/no-go is about personal fit, scope, and durability of interest — not market size or unicorn potential. Those questions belong to a different kind of project entirely."
  revisit={{ to: "/docs/solo/planning#step-4-decide-if-its-worth-building", label: "Go/no-go" }}
/>

<Question
  prompt="What does 'plan less' explicitly NOT mean, per the highlight?"
  options={[
    { text: "Plan in proportion to the project" },
    { text: "Don't plan at all" },
    { text: "Skip the design sketch" },
    { text: "Match planning depth to project depth" }
  ]}
  correct={1}
  explanation="The highlight makes this distinction explicit: 'plan less' is shorthand for 'plan in proportion to the project,' not 'skip planning.' A 6-month SaaS still deserves days of thought."
  revisit={{ to: "/docs/solo/planning#step-4-decide-if-its-worth-building", label: "Plan in proportion" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Stack Selection](./stack-selection) where the 2026 default stack is basically pre-decided.
