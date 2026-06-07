---
id: stage-9-portfolio
title: Stage 9 — Ship a real portfolio
sidebar_position: 10
sidebar_label: Stage 9 — Portfolio
description: Turn your Next.js capability into a polished, public portfolio you'd actually want to share — the kind that gets you interviews.
---

# Stage 9 — Ship a real portfolio

> **Time budget:** ~1–2 weeks

> **In one line:** Turn your Next.js capability into a polished, public portfolio you'd actually share — no new technology, just deliberate effort.

By now you've shipped a Next.js site (Stage 8). This stage is about turning that capability into a polished, public portfolio you'd actually want to share — the kind that gets you interviews. There's no new technology here; just deliberate effort applied to what you already know.

For the wider "solo developer" mindset and process this fits into, see [Solo / Personal workflow](/docs/solo).

### 1. What goes on a portfolio

- **Who you are** — one paragraph. Name, what you do, what you're interested in. No life story.
- **What you've built** — your best 3–5 projects, with for each one: a screenshot, 1–3 sentences of what it does and what was hard, a link to live demo and source.
- **How to reach you** — email, GitHub, LinkedIn. A working contact form is a flex.
- Optional: a short blog, a "what I'm currently learning" section, a CV download.

What *not* to put on a portfolio: tutorials you followed, every tiny exercise, "I know React" badges without projects. Show, don't tell.

### 2. The bar to aim for

- Loads in under 1 second on a 4G connection.
- Looks correct on a 360px-wide phone and a 1440px monitor.
- Lighthouse score (Chrome DevTools → Lighthouse tab) ≥ 95 in all four categories.
- No console errors. No 404s.
- Works without JavaScript (Next.js gives you this for free with server components).
- Accessible: every image has `alt`, every input has a label, colour contrast passes WCAG AA.

### 3. Polish moves that punch above their weight

- **A custom domain**. Buy `yourname.dev` or `.com` from Namecheap or Cloudflare for ~$10/year. Point it at Vercel (their docs walk you through it). Looking professional without one is hard.
- **Decent typography**. One sans-serif (Inter is a safe default), good line-height (1.5–1.7), generous spacing. Most amateur sites look amateur because the typography is cramped, not because of anything code-related.
- **One detail that surprises**. A subtle hover animation, a dark/light toggle, a console easter-egg. Doesn't need to be impressive — just shows you cared.
- **Real screenshots, not placeholders**. Use [shots.so](https://shots.so) or just a clean Chrome screenshot for project thumbnails.

### 4. SEO and metadata

```ts
// app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tony Yu — Web Developer",
  description: "I build web apps that ship. Recent work in AI-driven interviewing and full-stack TypeScript.",
  openGraph: {
    title: "Tony Yu",
    description: "Web developer building AI-driven tools.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};
```

The OpenGraph image is what shows up when your link is shared on Twitter, LinkedIn, Discord. Worth 30 minutes in Figma to make a nice one.

### 5. Track who visits (optional)

Add [Plausible](https://plausible.io) or [PostHog](https://posthog.com) for basic analytics. Knowing whether *anyone* visits your site is morale. Both have generous free tiers.

## Where to look for inspiration

- [leerob.io](https://leerob.io), [shud.in](https://shud.in), [delba.dev](https://delba.dev) — clean, modern personal sites from working developers.
- [A big list of developer portfolios](https://github.com/emmabostian/developer-portfolios) — browse, screenshot what you like, synthesise.

## Deeper in this guide

- [Solo / Personal workflow](/docs/solo) — the broader process around shipping personal projects: project types, planning, stack selection.

## Project

:::tip[Project — Your portfolio, deployed at a custom domain]
Build it with Next.js + Tailwind. Include at least three projects you've built in earlier stages. Buy a domain. Deploy to Vercel. Run Lighthouse — fix every issue until you have a 95+ in every category. Add basic analytics. Share the link with at least one person who'll give honest feedback, and iterate based on what they say.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Listing tutorials as projects.** "Built a Todo MVC following a tutorial" reads as "I can copy code." A recruiter wants to see something *you* shaped — even a small project with your own idea beats a polished clone of a tutorial. Show, don't tell.
- **Endless polish, never deploys.** Tweaking the hover animation for a week while the live URL doesn't exist is the inverse of the goal. Deploy on day one with placeholder content, then iterate in public.
- **Cramped typography.** The single biggest "this site looks amateur" tell isn't code — it's tight line-height, dense paragraphs, and 14px body text. Use ~16–18px, line-height 1.5–1.7, and generous margins. One pass on typography matters more than three frameworks.
- **No OpenGraph image.** Every share on Twitter, LinkedIn, or Discord becomes a sad text link without one. Thirty minutes in Figma to make a 1200×630 PNG punches well above its weight in how the site is received.
:::

## Page checkpoint

<Quiz id="stage-9-page" title="Did Stage 9 stick?" sampleSize={3}>

<Question
  prompt="What's the right bar to aim for on a personal portfolio's Lighthouse scores?"
  options={[
    { text: "60+ in Performance; the rest don't matter" },
    { text: "95+ in all four categories (Performance, Accessibility, Best Practices, SEO) — Next.js makes this realistic" },
    { text: "100/100 in everything or don't deploy" },
    { text: "Whatever you can hit in an hour" }
  ]}
  correct={1}
  explanation="95+ across all four is achievable with sensible defaults (Next.js + `next/image` + `next/font`) and signals you care. Chasing perfect 100s often costs hours for diminishing return; 95 is the right stop point."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-9-portfolio#2-the-bar-to-aim-for", label: "Revisit: The bar to aim for" }}
/>

<Question
  prompt="Which of these belongs on a portfolio?"
  options={[
    { text: "A list of every tutorial you've completed" },
    { text: "Three to five projects you actually built, each with a screenshot, 1–3 sentences on what it does and what was hard, and links to live demo + source" },
    { text: "Badges like 'I know React'" },
    { text: "A wall of every technology you've ever touched" }
  ]}
  correct={1}
  explanation="Recruiters and engineers scan for *evidence* of work — a working live URL and a brief story about what was hard. Tutorials and self-declared skill badges signal nothing they can verify."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-9-portfolio#1-what-goes-on-a-portfolio", label: "Revisit: What goes on a portfolio" }}
/>

<Question
  prompt="Why is the OpenGraph image (`og.png`) worth 30 minutes of design effort?"
  options={[
    { text: "Google ranks pages with OG images higher" },
    { text: "It's what shows up as the preview card whenever your link is shared on Twitter, LinkedIn, Discord, Slack — first impression for anyone who didn't visit yet" },
    { text: "Browsers refuse to render the page without one" },
    { text: "Vercel charges more for sites without one" }
  ]}
  correct={1}
  explanation="OG images are the social-media preview card. A custom 1200×630 image with your name and tagline turns every share into a small ad for your work; without one, your link looks indistinguishable from spam."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-9-portfolio#4-seo-and-metadata", label: "Revisit: SEO and metadata" }}
/>

</Quiz>

→ [Next: Stage 10 — Backend basics](/docs/roadmap/part-1-from-zero/stage-10-backend) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
