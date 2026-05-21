---
id: sample-project
title: A Sample Two-Weekend Project
sidebar_position: 17
sidebar_label: 16. Sample Project
description: A concrete weekend-by-weekend schedule for a small tool — setup, backend, UI, auth, polish, launch.
---

# A Sample Two-Weekend Project

> **In one line:** Two weekends, ~32 hours, one shipped product. A concrete schedule to anchor what's actually achievable.

:::tip In plain English
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

:::note Try it yourself
Pick a tiny project you've been meaning to build. Block out the next two weekends on your calendar. Print the schedule above. As you go, write next to each line how long it *actually* took.

After Sunday of weekend 2, even if it's not as polished as the schedule implies, you'll have learned more about your real velocity than any blog post can teach. Use that calibration on the next project.
:::

:::info Highlight: two weekends is the *floor*, not the ceiling
This schedule works for a "small tool" — a focused, narrow product. A more ambitious SaaS will run 8–14 weekends as covered in [time investment](./time-investment). Don't beat yourself up if your project doesn't fit this schedule. The point is that *some* shippable thing fits this schedule, and that's a remarkable change from a decade ago.
:::

## What's next

→ Continue to [When to Graduate Beyond "Personal Project"](./graduating) where we'll cover the signs you're outgrowing solo habits.
