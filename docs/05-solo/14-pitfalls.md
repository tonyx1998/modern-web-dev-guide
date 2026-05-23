---
id: pitfalls
title: Common Pitfalls
sidebar_position: 15
sidebar_label: 14. Pitfalls
description: Over-engineering, stack churn, skipping deployment, building without users, working without joy, and the biggest killer — not shipping.
---

# Common Pitfalls

> **In one line:** Personal projects rarely die from technical problems. They die from over-engineering, stack churn, premature scaling, feature creep, and never shipping.

:::tip[In plain English]
The pitfalls below all look like reasonable behavior in the moment. "I'll just refactor this first." "Maybe Svelte would be better." "One more feature before launch." Each individual decision is defensible. The pattern of repeatedly making them is what kills the project. Recognize the pattern and break out of it.
:::

## Over-Engineering

Building infrastructure you don't need:
- Microservices for a 100-user app.
- Kubernetes for static content.
- A complex CI pipeline for a one-person project.
- GraphQL when REST is fine.
- A custom auth system instead of Clerk.

## Stack Churn

Switching frameworks every two weeks because you saw a tweet. Pick one; ship something.

## Skipping Deployment

Building for weeks before deploying. Deploy on day one with an empty page. Every step gets harder if you don't have a working deploy pipeline.

## Building Without Users

Building in isolation for months, then launching to crickets. Talk to potential users early. Show prototypes. Iterate based on real feedback.

## Premature Scaling

Designing for 1M users when you have 0. Build for 10x your current scale, not 1000x.

## Feature Creep

"I'll add just one more feature before launch." Repeated weekly. Ship the smallest useful thing, then iterate.

## Working Without Joy

Personal projects only work if you enjoy them. If a project becomes a chore, give yourself permission to shelf it or kill it. Life is too short for joyless side projects.

## Not Charging

For SaaS: charging $0 means users have no skin in the game. They give shallow feedback and don't show up. Charging $5/month attracts genuine customers from day one. Money is a strong filter.

## Not Shipping

The biggest failure mode of personal projects: never deploying. Polished MVPs in your local environment help no one. Ship ugly; iterate live.

:::note[Worked example: catching feature creep in the act]
You're a week from launch. You're brushing your teeth and think: "I should add a CSV export feature. People will want that."

Stop. Run the test:

1. Is this in your v1 feature list? (Probably no.)
2. Has any real user asked for it? (No — you have no users yet.)
3. Will the launch fail without it? (No.)
4. How long will it take? ("Just an evening" — translation: a weekend.)
5. What does the calendar say if you add it? (Launch slips one to two weeks.)

Almost every time, the right answer is: write "CSV export" on the v2 list and ship the current version.
:::

:::info[Highlight: pick your one pitfall]
You're not vulnerable to all nine equally. Most indie developers have *one* pet failure mode — for some it's stack churn, for others over-engineering, for others not charging. Identify your one. Put a sticky note above your desk: "I will not switch frameworks again this year." That one piece of self-awareness is worth more than reading this list.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Over-engineering the anti-over-engineering checklist.** You build a personal "is this premature optimization?" framework with rubrics and decision trees — and now the framework itself is the over-engineering. The fix is a single gut-check question ("would I do this if I had four hours total?") and move on. Meta-process is still process.
- **Copying enterprise pitfall guides verbatim.** "Always write tests before code" is great advice for a 30-person team and terrible advice for a weekend tool with three users. The fix is to apply pitfalls in proportion — enterprise warnings about "lack of process" are usually solving problems you don't have yet.
- **Reading about pitfalls instead of shipping.** This whole chapter can become a way to feel productive while building nothing. The fix is to read this page once, pick the one pitfall that's most *you*, and close the tab. Awareness without action is just guilt-flavored procrastination.
- **Refusing to ever add process.** "I'll never write a test, I read the chapter." Then a billing bug ships and you wish you had. The fix is to remember that solo principles are about *defaulting* to lightness, not banning structure forever. When pain earns it, add the thing.
- **Believing you're immune because you're aware.** Reading "don't switch frameworks" then immediately rationalizing why your case is different is the classic pattern. The fix is the sticky-note rule from the highlight — pre-commit your future self to a constraint before the rationalization shows up.
:::

## Page checkpoint

<Quiz id="solo-pitfalls-page" title="Did the pitfalls stick?" sampleSize={2}>

<Question
  prompt="According to the page, what's the biggest failure mode of personal projects?"
  options={[
    { text: "Choosing the wrong framework" },
    { text: "Not deploying — polished MVPs in your local environment help no one" },
    { text: "Setting prices too low" },
    { text: "Skipping unit tests" }
  ]}
  correct={1}
  explanation="Never shipping is the biggest killer. The fix is the opposite of polish: ship ugly, then iterate live. A deployed v1 with rough edges beats a polished local prototype every time."
  revisit={{ to: "/docs/solo/pitfalls#not-shipping", label: "Not shipping" }}
/>

<Question
  prompt="What's the page's argument for actually charging $5/month instead of staying free?"
  options={[
    { text: "Free is illegal under modern consumer law" },
    { text: "Money is a filter — paying users have skin in the game and give better feedback" },
    { text: "Stripe requires a minimum price" },
    { text: "Free users can't be tracked in analytics" }
  ]}
  correct={1}
  explanation="Free users give shallow feedback and don't show up. A small charge attracts genuine customers from day one because the act of paying signals they care about the problem."
  revisit={{ to: "/docs/solo/pitfalls#not-charging", label: "Not charging" }}
/>

<Question
  prompt="When you catch yourself thinking 'just one more feature before launch,' what should you do?"
  options={[
    { text: "Add it — better to launch complete" },
    { text: "Write it on the v2 list and ship the current version" },
    { text: "Switch to a different stack to add it faster" },
    { text: "Delay launch indefinitely until satisfied" }
  ]}
  correct={1}
  explanation="The worked example explicitly catches feature creep: if it's not in v1, no real user has asked for it, and launch won't fail without it, write it down for v2 and ship now."
  revisit={{ to: "/docs/solo/pitfalls#feature-creep", label: "Feature creep" }}
/>

<Question
  prompt="What does the 'pick your one pitfall' highlight advise?"
  options={[
    { text: "Memorize all nine equally" },
    { text: "Identify your one pet failure mode and put a sticky note about it where you work" },
    { text: "Ignore the list — pitfalls are unavoidable" },
    { text: "Switch frameworks until you find one that prevents them all" }
  ]}
  correct={1}
  explanation="Most indie devs have one pet failure mode — stack churn, over-engineering, not charging, etc. Identify yours and post a reminder. One piece of self-awareness beats reading the whole list."
  revisit={{ to: "/docs/solo/pitfalls#not-shipping", label: "Pick your one pitfall" }}
/>

</Quiz>

## What's next

→ Continue to [Pre-Built Templates Worth Knowing](./templates) where we'll cover when starting from a template beats starting from scratch.
