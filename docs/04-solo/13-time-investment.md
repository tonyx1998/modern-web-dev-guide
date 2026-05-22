---
id: time-investment
title: Realistic Time Investment
sidebar_position: 14
sidebar_label: 13. Time Investment
description: A common breakdown for an indie SaaS v1 — about 8–14 weekends of part-time work, give or take.
---

# Realistic Time Investment

> **In one line:** An indie SaaS v1 takes 8–14 weekends of focused part-time work. Plan for 2x your initial estimate.

:::tip[In plain English]
The single most common indie-developer mistake is "I'll knock this out in two weekends." It's almost never two weekends. Not because you're slow — because v1 has more pieces than your initial vision (auth, payments, landing page, error handling, edge cases). Estimate honestly so you don't burn out at week three feeling "behind."
:::

## A typical v1 budget

A common breakdown for an indie SaaS v1:

- **Planning + design:** 1 weekend
- **Stack setup + auth + DB:** 1 weekend
- **Core features:** 4–8 weekends
- **Payments + landing page:** 1–2 weekends
- **Polish + launch:** 1–2 weekends

**Total:** 8–14 weekends (3–4 months of part-time work).

Most indie projects take longer than expected. Plan for 2x your initial estimate.

:::note[Worked example: an honest retrospective]
A real indie SaaS v1, by the numbers:

| Phase                   | Estimated  | Actual     |
|-------------------------|-----------|-----------|
| Planning + design       | 1 weekend | 1 weekend |
| Setup + auth + DB       | 1 weekend | 1.5 weekends (Clerk config took longer than expected) |
| Core features           | 4 weekends | 7 weekends (every feature had edge cases) |
| Payments + landing      | 1 weekend | 2 weekends (landing page copy took as long as the code) |
| Polish + launch         | 1 weekend | 1.5 weekends |
| **Total**               | **8**     | **13**    |

The 8-weekend estimate became 13 weekends not because anything went wrong — but because *every* phase had a slow component. That's normal. Plan for it.
:::

:::info[Highlight: the 2x rule cuts both ways]
"Plan for 2x your estimate" is a comfort, not a license. It doesn't mean "schedule 2x and use all of it" — it means *if* things take 2x, you won't quit. If they take 1.2x, ship faster and use the saved time on the next project. The goal is shipping, not filling time.
:::

## Page checkpoint

<Quiz id="solo-time-investment-page" title="Did time investment stick?" sampleSize={2}>

<Question
  prompt="What's the realistic weekend budget for an indie SaaS v1?"
  options={[
    { text: "2 to 3 weekends" },
    { text: "4 to 6 weekends" },
    { text: "8 to 14 weekends" },
    { text: "20 to 30 weekends" }
  ]}
  correct={2}
  explanation="The page lands on 8–14 weekends (about 3–4 months of part-time work) as a realistic v1 budget. The single most common indie mistake is estimating two weekends."
  revisit={{ to: "/docs/solo/time-investment#a-typical-v1-budget", label: "Typical v1 budget" }}
/>

<Question
  prompt="What does the page recommend you do with your initial estimate?"
  options={[
    { text: "Cut it in half — modern tools make things faster" },
    { text: "Plan for 2x your initial estimate" },
    { text: "Add a 10% buffer for polish" },
    { text: "Don't estimate; just start" }
  ]}
  correct={1}
  explanation="Plan for 2x. Not because anything goes wrong — but because every phase tends to have a slow component (config takes longer, edge cases multiply, copy takes as long as code)."
  revisit={{ to: "/docs/solo/time-investment#a-typical-v1-budget", label: "2x rule" }}
/>

<Question
  prompt="In the worked example, which phase blew out the most compared to estimate?"
  options={[
    { text: "Planning + design" },
    { text: "Setup + auth + DB" },
    { text: "Core features (4 weekends estimated, 7 actual)" },
    { text: "Polish + launch" }
  ]}
  correct={2}
  explanation="Core features expanded from 4 to 7 weekends because 'every feature had edge cases.' That's the normal pattern — the feature list looks short, but the long tail of edge cases multiplies effort."
  revisit={{ to: "/docs/solo/time-investment#a-typical-v1-budget", label: "Retrospective table" }}
/>

<Question
  prompt="What does the highlight clarify about the '2x rule'?"
  options={[
    { text: "It's a license to schedule 2x and use all the time" },
    { text: "It's a comfort buffer — if things take 2x you won't quit; if they don't, ship faster" },
    { text: "It only applies to backend work" },
    { text: "It means you should commit to exactly 2x your estimate" }
  ]}
  correct={1}
  explanation="2x cuts both ways. It's psychological insurance against burnout, not permission to fill the time. If you finish in 1.2x, ship and move on to the next project."
  revisit={{ to: "/docs/solo/time-investment#a-typical-v1-budget", label: "2x cuts both ways" }}
/>

</Quiz>

## What's next

→ Continue to [Common Pitfalls](./pitfalls) where we'll see the most common ways indie projects die.
