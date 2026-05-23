---
id: templates
title: Pre-Built Templates Worth Knowing
sidebar_position: 16
sidebar_label: 15. Templates
description: shadcn/ui, Vercel templates, SaaS starter kits, Create T3 App. When starting from a template saves days; when it costs them.
---

# Pre-Built Templates Worth Knowing

> **In one line:** A good template skips days of setup. A bad one locks you into code you don't understand. Pick deliberately.

:::tip[In plain English]
A template is like a furnished apartment — you can move in tonight, but the previous tenant chose the curtains. Sometimes that's a huge win (you didn't want to pick curtains anyway). Sometimes you'll be ripping out wallpaper for a month. Templates work best when their opinions roughly match yours.
:::

## Templates worth knowing in 2026

Don't always start from scratch:

- **shadcn/ui** — Component library.
- **Vercel templates** (vercel.com/templates) — Many starter Next.js apps.
- **shipfa.st, mkdirs.com, indiestarter.dev** — Paid SaaS starter kits (auth + payments + landing page pre-built).
- **Create T3 App** — Type-safe full-stack starter (Next.js + tRPC + Drizzle + Tailwind).

Templates save days of setup. Just make sure you understand what they do — don't deploy something you can't maintain.

:::note[Worked example: which template for which goal]
- "I want to build a SaaS with auth, payments, and a landing page already wired up." → A paid kit like shipfa.st. Money saves you weeks.
- "I want a Next.js + Postgres + tRPC project structure I'd build anyway." → Create T3 App. Zero cost; opinionated in mainstream ways.
- "I want pre-built buttons, inputs, dropdowns, dialogs that look good." → shadcn/ui (not really a template — a component library you copy in).
- "I want to clone someone's specific finished app." → Browse Vercel templates for one that matches.

Don't reach for a template just because templates exist. Match it to the specific time you'd otherwise spend.
:::

:::info[Highlight: understand-or-don't-use]
The single template danger: deploying code you can't read. When a Stripe webhook misfires in production, you need to know exactly how the kit handles subscriptions. If the answer is "I have no idea, the template does it," you have a debugging time bomb.

Before you `npm install` a paid SaaS kit, spend an evening reading its source. If you can't make sense of the auth flow or the payment handler, walk away.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Buying the SaaS kit to procrastinate on the actual product.** Spending three weekends "evaluating" paid kits is just the planning trap with a credit card. The fix is a 60-minute time-box: skim two kits, pick one, or commit to building from scratch. Either is fine; the *deciding* is what burns weekends.
- **Cargo-culting features from the template into v1.** The kit ships with team workspaces, blog, email sequences, and an admin panel — and now your "v1" has all of it because deleting felt wasteful. The fix is to ruthlessly rip out anything that isn't on your five-feature list. Unused code in a template is still code you have to maintain.
- **Treating the template as a black box you can't modify.** "I don't want to touch their auth code in case it breaks updates." The fix is to fork mentally — once you ship, the kit isn't a dependency, it's your code. Read it, modify it, own it. Updates to the upstream kit will rarely matter once you've shipped real users.
- **Picking the template that markets best instead of the one that fits.** The kit with the slickest landing page isn't necessarily the one whose code matches your stack and taste. The fix is the "read the source for an evening" gate from the highlight — landing pages lie, code doesn't.
- **Letting "I'll learn it later" become permanent.** You ship on the kit, plan to "study the Stripe webhook handler eventually," and three months later prod breaks at 9pm with code you've never read. The fix is to walk the kit's critical paths (auth, payment, webhook) within the first week of using it — even if everything works.
:::

## Page checkpoint

<Quiz id="solo-templates-page" title="Did the templates advice stick?" sampleSize={2}>

<Question
  prompt="What is the single biggest danger of using a paid SaaS starter kit?"
  options={[
    { text: "The upfront cost is too high" },
    { text: "Deploying code you can't read or debug when things break" },
    { text: "Lock-in to a specific cloud provider" },
    { text: "Lack of TypeScript support" }
  ]}
  correct={1}
  explanation="When a Stripe webhook misfires in production, 'the template does it' is not an acceptable answer. The page advises reading the kit's source before npm-installing it — walk away if you can't follow the auth or payment handler."
  revisit={{ to: "/docs/solo/templates#templates-worth-knowing-in-2026", label: "Understand-or-don't-use" }}
/>

<Question
  prompt="Which template is best matched to 'I want a Next.js + Postgres + tRPC structure I'd build anyway'?"
  options={[
    { text: "shipfa.st" },
    { text: "shadcn/ui" },
    { text: "Create T3 App" },
    { text: "A random Vercel template" }
  ]}
  correct={2}
  explanation="Create T3 App matches that profile exactly — free, opinionated in mainstream ways, and gives you the type-safe full-stack project structure many solo devs would assemble anyway."
  revisit={{ to: "/docs/solo/templates#templates-worth-knowing-in-2026", label: "Which template for which goal" }}
/>

<Question
  prompt="What does the analogy 'a template is like a furnished apartment' illustrate?"
  options={[
    { text: "Templates make your project feel cozy" },
    { text: "You move in faster, but you inherit the previous tenant's choices" },
    { text: "Templates are temporary by nature" },
    { text: "Templates always cost monthly rent" }
  ]}
  correct={1}
  explanation="You skip the setup time, but the curtains (architectural choices) are already picked. That's great when the opinions match yours, and painful when you're ripping out wallpaper for a month."
  revisit={{ to: "/docs/solo/templates#pre-built-templates-worth-knowing", label: "Plain English intro" }}
/>

<Question
  prompt="Strictly speaking, shadcn/ui is described as which of the following?"
  options={[
    { text: "A paid SaaS starter kit" },
    { text: "A component library you copy in, not really a template" },
    { text: "A Next.js fork" },
    { text: "A hosting platform" }
  ]}
  correct={1}
  explanation="The page calls out that shadcn/ui isn't really a template — it's a component library (buttons, inputs, dropdowns, dialogs) you copy into your project. Different category, same convenience."
  revisit={{ to: "/docs/solo/templates#templates-worth-knowing-in-2026", label: "Which template for which goal" }}
/>

</Quiz>

## What's next

→ Continue to [A Sample Two-Weekend Project](./sample-project) for a concrete weekend-by-weekend schedule.
