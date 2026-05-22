---
id: sample-project
title: A Sample Two-Weekend Project
sidebar_position: 17
sidebar_label: 16. Sample Project
description: A concrete weekend-by-weekend schedule for a small tool — setup, backend, UI, auth, polish, launch.
---

# A Sample Two-Weekend Project

> **In one line:** Two weekends, ~32 hours, one shipped product. A concrete schedule to anchor what's actually achievable.

:::tip[In plain English]
"Two weekends" sounds aggressive until you see exactly what fits. Modern tooling has done so much of the work — auth, hosting, payments, error tracking — that two weekends of focused effort really can take you from empty folder to a real URL with paying users. Here's how the hours map.
:::

## Weekend 1: Setup + Backend

To make this concrete, here's a realistic schedule for a small tool:

**Saturday:**
- Sketch the UI (2 hours)
- Set up Next.js, Tailwind, shadcn (1 hour)
- Set up Neon database, Drizzle schema (2 hours)
- Build the database mutations and server actions (4 hours)

**Sunday:**
- Build the main page UI (4 hours)
- Wire up server actions to forms (3 hours)
- Deploy to Vercel (30 minutes)
- Buy a domain, configure DNS (30 minutes)

End of weekend: a working v0 at a real URL.

## Weekend 2: Auth + Polish + Launch

**Saturday:**
- Add Clerk for auth (1 hour)
- Build the landing page (4 hours)
- Add Stripe Checkout (3 hours)
- Test the full flow (1 hour)

**Sunday:**
- Polish UI rough edges (3 hours)
- Set up Sentry (30 minutes)
- Write a launch blog post (2 hours)
- Post to Hacker News, Twitter, relevant subreddits (1 hour)
- Reply to feedback (ongoing)

End of weekend: a shipped product with users.

This is genuinely achievable in 2026. The tools have advanced to the point where one person can ship what used to require a small team.

:::note[Try it yourself]
Pick a tiny project you've been meaning to build. Block out the next two weekends on your calendar. Print the schedule above. As you go, write next to each line how long it *actually* took.

After Sunday of weekend 2, even if it's not as polished as the schedule implies, you'll have learned more about your real velocity than any blog post can teach. Use that calibration on the next project.
:::

:::info[Highlight: two weekends is the *floor*, not the ceiling]
This schedule works for a "small tool" — a focused, narrow product. A more ambitious SaaS will run 8–14 weekends as covered in [time investment](./time-investment). Don't beat yourself up if your project doesn't fit this schedule. The point is that *some* shippable thing fits this schedule, and that's a remarkable change from a decade ago.
:::

## Page checkpoint

<Quiz id="solo-sample-project-page" title="Did the sample project stick?" sampleSize={2}>

<Question
  prompt="What's the expected state at the end of Weekend 1?"
  options={[
    { text: "A working local dev environment, nothing deployed" },
    { text: "A working v0 at a real URL" },
    { text: "A finished MVP with payments and auth" },
    { text: "Only the UI sketches" }
  ]}
  correct={1}
  explanation="Weekend 1 ends with a deployed v0 at a real URL — setup, schema, server actions, main page UI, and a domain configured. That's the milestone Weekend 2 builds on."
  revisit={{ to: "/docs/solo/sample-project#weekend-1-setup--backend", label: "Weekend 1" }}
/>

<Question
  prompt="Which task is allocated to Weekend 2 rather than Weekend 1?"
  options={[
    { text: "Setting up Drizzle and Neon" },
    { text: "Building the main page UI" },
    { text: "Adding Clerk for auth and Stripe Checkout" },
    { text: "Deploying to Vercel" }
  ]}
  correct={2}
  explanation="Weekend 2 covers Clerk, Stripe, landing page, polish, Sentry, and launch posts. Weekend 1 is the database and core UI; auth/payments come after the v0 is real."
  revisit={{ to: "/docs/solo/sample-project#weekend-2-auth--polish--launch", label: "Weekend 2" }}
/>

<Question
  prompt="What does the highlight clarify about the two-weekend timeline?"
  options={[
    { text: "It's the ceiling — most projects fit easily" },
    { text: "It's the floor — a small focused tool fits, a real SaaS still takes 8–14 weekends" },
    { text: "It only applies to learning projects" },
    { text: "It's a marketing exaggeration" }
  ]}
  correct={1}
  explanation="Two weekends is the floor — proof that a small focused tool can ship that fast in 2026. An ambitious SaaS still takes 8–14 weekends. Don't beat yourself up if your project doesn't fit."
  revisit={{ to: "/docs/solo/sample-project#weekend-2-auth--polish--launch", label: "Floor not ceiling" }}
/>

<Question
  prompt="Roughly how many focused hours does the two-weekend schedule add up to?"
  options={[
    { text: "About 8 hours" },
    { text: "About 16 hours" },
    { text: "About 32 hours" },
    { text: "About 80 hours" }
  ]}
  correct={2}
  explanation="The page opens with 'Two weekends, ~32 hours, one shipped product.' Two full weekend days each, roughly 8 hours per day, gives you the 32-hour budget."
  revisit={{ to: "/docs/solo/sample-project#a-sample-two-weekend-project", label: "Hours summary" }}
/>

</Quiz>

## What's next

→ Continue to [When to Graduate Beyond "Personal Project"](./graduating) where we'll cover the signs you're outgrowing solo habits.
