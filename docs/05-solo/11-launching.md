---
id: launching
title: 'Phase 10: Launching'
sidebar_position: 12
sidebar_label: 11. Launching
description: Personal projects don't need formal launches. Soft-launch to friends, then social media, then the indie hacker forums. Pricing and landing pages matter more.
---

# Phase 10: Launching

> **In one line:** Personal projects don't need formal launches. Tell friends, post a few places, write about why you built it. The product matters more than the launch.

:::tip[In plain English]
At a big company, "launch" is a coordinated event with press, marketing, and a war room. For an indie project, it's a tweet and a Hacker News post. The thing that actually determines whether anyone uses your project is the product itself, not the launch performance. Don't agonize over launch day.
:::

## Where to soft-launch

Personal projects don't need a "launch" the way enterprise products do. You can soft-launch by:

1. Telling friends.
2. Posting on Twitter / Bluesky / Mastodon / Threads.
3. Writing a blog post about why you built it.
4. Posting to Hacker News (with a "Show HN: " title).
5. Posting to Reddit (relevant subreddits).
6. Posting to Product Hunt.
7. Posting to Indie Hackers.

Don't overthink launches. The product matters more than the launch.

## Pricing (For SaaS)

A common starting point:
- **Free tier:** Enough for a single individual to use (limited capacity).
- **Paid tier:** $5–15/month for the full experience.
- **Annual discount:** 2 months free.

Stripe handles the actual billing.

## Marketing Site

If you're selling, you need a landing page that explains:
- What it does (hero section, one sentence).
- Who it's for (subheadline).
- Why it's better than alternatives (3-4 differentiators).
- What it looks like (screenshots or video).
- Pricing (transparent, simple).
- Social proof (if any).
- CTA (sign up / try free).

For inspiration, look at landing pages of indie SaaS products on Indie Hackers.

:::note[Worked example: a "Show HN" post that worked]
A good Show HN title and body look like:

> **Show HN: ShelfTrack — book tracking without the social network**
>
> I built ShelfTrack because Goodreads has become unbearable — ads, social features I don't want, and a slow UI. ShelfTrack is just my reading shelf: add a book, mark it as reading/finished/wishlist, rate it, see the list. No followers, no feed.
>
> Stack: Next.js, Postgres on Neon, Clerk for auth, deployed on Vercel. Built in about three weekends. Free tier handles a personal library of any size; $5/month for unlimited shelves and export.
>
> Would love feedback on the onboarding flow specifically — it's the part I'm least sure about.

The pattern: clear problem, clear solution, honest stack/effort, specific feedback request. The HN crowd rewards honesty and punishes marketing-speak.
:::

:::info[Highlight: the product is the launch]
A great launch of a mediocre product gets you a spike of traffic and then crickets. A mediocre launch of a great product gets you slow but compounding growth. If you have limited weekend time, spend the bulk of it on the product, not on launch-day choreography.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating launch day as a one-shot event.** You burn a Saturday on a Show HN, get 80 visitors, no signups, and conclude the project flopped. The fix is to schedule three or four soft-launches a few weeks apart — different channels, different angles. Each one teaches you what the landing page is missing.
- **Posting Show HN with marketing copy.** "Revolutionizing the way readers track their books" gets buried in seven minutes. The fix is the format on this page: one-line problem, one-line solution, honest stack and effort, a specific feedback ask. HN reliably rewards plain talk and punishes spin.
- **Launching with no pricing page.** A free product looks fine until someone asks "is this going to stay free?" and bounces because the answer is unclear. The fix is to ship a pricing page on day one even if you're 100% free — say "free during beta, paid tier coming" and put the future price on the page.
- **Going dark after launch.** You post on a Saturday, get fifteen comments by Sunday morning, sleep in, and the thread is cold by noon. The fix is to set aside the first 24 hours to *reply* — answer every question, thank every signup, post about bugs you fix. Engagement during the window is the whole point.
- **Counting traffic instead of activation.** 2,000 visitors and three signups means your landing page is the problem, not the product. The fix is to instrument signup-to-first-action *before* you launch, so the post-mortem points at a specific funnel step instead of a vague "it didn't work."
:::

## Page checkpoint

<Quiz id="solo-launching-page" title="Did the launching advice stick?" sampleSize={3}>

<Question
  prompt="What does the highlight 'the product is the launch' actually mean?"
  options={[
    { text: "Launch day determines all long-term traffic" },
    { text: "Great products grow even with a mediocre launch; bad products fade after a great one" },
    { text: "You should skip launching entirely" },
    { text: "Only launch on Product Hunt for best results" }
  ]}
  correct={1}
  explanation="A great launch of a mediocre product gets you a traffic spike then crickets. A mediocre launch of a great product compounds slowly but durably. Time is better spent on the product than launch-day choreography."
  revisit={{ to: "/docs/solo/launching#phase-9-launching", label: "Product is the launch" }}
/>

<Question
  prompt="What's the recommended paid-tier price range for an indie SaaS?"
  options={[
    { text: "$0.99 to $2 per month" },
    { text: "$5 to $15 per month" },
    { text: "$50 to $100 per month" },
    { text: "Always charge a one-time fee" }
  ]}
  correct={1}
  explanation="The page suggests $5–15/month for a paid tier with a limited free tier above it, and a 2-months-free annual discount. Stripe handles the actual billing mechanics."
  revisit={{ to: "/docs/solo/launching#pricing-for-saas", label: "Pricing" }}
/>

<Question
  prompt="What pattern does the HN crowd reward, per the worked example?"
  options={[
    { text: "Marketing-speak and bold claims" },
    { text: "Honesty about the problem, solution, stack, and a specific feedback request" },
    { text: "Mystery — withholding stack details" },
    { text: "Long-form essays on industry trends" }
  ]}
  correct={1}
  explanation="The Show HN example is direct: clear problem, clear solution, honest stack and effort, and a specific feedback ask. HN punishes marketing-speak and rewards plain talk."
  revisit={{ to: "/docs/solo/launching#where-to-soft-launch", label: "Show HN example" }}
/>

<Question
  prompt="What does a personal-project soft-launch look like, per this page?"
  options={[
    { text: "A press kit, PR firm, and embargo schedule" },
    { text: "Telling friends, posting on social, HN/Reddit/Product Hunt/Indie Hackers" },
    { text: "Waiting for organic SEO to ramp up over 6 months" },
    { text: "An invite-only beta with a waiting list" }
  ]}
  correct={1}
  explanation="The recommended soft-launch list is mundane and effective: tell friends, post to social channels and a few indie forums, write about why you built it. No war room required."
  revisit={{ to: "/docs/solo/launching#where-to-soft-launch", label: "Where to soft-launch" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 11: Maintenance](./maintenance) where the work changes from "build" to "watch, respond, iterate."
