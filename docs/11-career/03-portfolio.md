---
id: career-portfolio
title: Building a Portfolio
sidebar_position: 4
sidebar_label: 3. Portfolio
description: The fastest path to a first job in 2026 — real projects, deployed publicly, written about, shared.
---

# Building a Portfolio

> **In one line:** Ship 3–5 real projects on custom domains, write about them, contribute to open source, and network online — that's the 2026 portfolio.

:::tip[In plain English]
Recruiters in 2026 don't read resumes carefully — they skim portfolios for *evidence you've shipped something*. A live URL with real users beats a screenshot of a tutorial clone every time. Your portfolio is not your resume; it's your *proof*.
:::

The fastest path to a first job in 2026:

## 1. Build 3–5 Real Projects

Not tutorials — your own ideas. Each project should:
- Solve a real problem (for you or someone else).
- Be deployed publicly.
- Have a custom domain.
- Have a real README.
- Be open source on GitHub.

**Project ideas:**
- A tool you'd actually use (recipe organizer, workout tracker, study planner).
- A simple SaaS targeting a niche you understand.
- A re-implementation of something popular (Twitter clone, Notion clone) — but with one twist that's yours.
- A community resource (a curated list, a directory, a niche search engine).
- An AI-powered tool that solves a specific problem.

**Avoid:**
- Generic "todo app" or "weather app" tutorials with no spin.
- Yet another portfolio site with no real projects in it.
- Cloned tutorials that look exactly like the tutorial.

## 2. Deploy Everything

A project that lives only on your laptop helps no one. Deploy to Vercel, Cloudflare, Netlify — they're free for the projects you'll build at this stage.

Use real domain names. Custom domains cost $10–15/year and dramatically change perception ("yourapp.com" vs "yourapp-2839.vercel.app").

## 3. Write About Your Work

A simple blog with technical posts dramatically increases visibility. Topics:

- **Build logs.** "I built X, here's how it works."
- **Tutorials.** "How I solved Y problem."
- **Lessons learned.** "Three mistakes I made building Z."
- **Tool deep-dives.** "Everything I know about [framework feature]."

You don't need to be the world expert. Sharing what you learned recently is genuinely valuable to people one step behind you.

Hosting options:
- Your own site (Astro + Markdown is perfect).
- Medium / dev.to / Hashnode (built-in audience).
- LinkedIn (surprisingly good for technical content in 2026).
- Twitter/X / Bluesky / Mastodon for short-form.

## 4. Contribute to Open Source

Even small contributions are credible signals:

- Fix bugs in libraries you use.
- Improve documentation.
- Add small features.
- Write tutorials for popular projects.

Start with projects you actually use; their familiarity makes contribution easier. Good first issues are tagged in most repos.

Don't spam PRs to popular projects for the sake of it. Quality > quantity.

## 5. Network Online

Tech is genuinely a small community; relationships compound.

**Where:**
- Twitter/X — Still where most senior engineers hang out (despite the chaos).
- Bluesky — Growing rapidly in tech.
- Discord — Many framework communities have active servers.
- Reddit — r/webdev, r/javascript, r/reactjs, r/learnprogramming.
- LinkedIn — More important than five years ago.
- Hacker News — Read daily; comment sometimes.

**How:**
- Share your work.
- Learn in public — post what you're learning.
- Engage thoughtfully with others' work.
- Don't be a self-promotional bot.

:::note[Worked example: a strong 5-project portfolio]
A junior portfolio that actually moves recruiters in 2026 might look like:

1. **A study planner** you built for your own class load — deployed at `studyplan.yourname.dev`, README explains the auth + DB design.
2. **A niche SaaS** — a tool for a hobby community you're part of. 20 paying or free users.
3. **A Notion-clone twist** — a doc tool with one unique feature (e.g., voice-first input, AI summaries).
4. **An AI-powered tool** — wraps an LLM around a specific workflow you understand.
5. **A community resource** — a curated, searchable list in your domain.

Each has: a custom domain, a real README, a GitHub link, and at least one blog post explaining how it was built. **Five of these beat fifty tutorial clones.**
:::

:::info[Highlight: a live URL is the single biggest signal]
If you do nothing else from this page, deploy one project to a custom domain. The gap between `localhost:3000` and `yourname-tool.com` is the entire gap between "I'm learning to code" and "I'm a developer." Free hosting + a $12 domain closes it.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Building the portfolio site before the portfolio.** Months spent perfecting a homepage with no real projects to link to is the most common form of procrastination disguised as work. Ship one real project first; the showcase site can be a single markdown page.
- **Confusing "deployed" with "deployed somewhere a recruiter will click."** A Vercel preview URL with random hashes and a half-broken login flow is worse than no link. If a stranger lands on your domain cold, can they understand what the thing does in 10 seconds and try it without signing up? If not, fix that before adding feature #4.
- **Wrapping every project in a thin AI layer and calling it differentiated.** A ChatGPT wrapper around a public API is now the new todo app — recruiters see twenty of them a week. The AI should be solving a real problem you understand, not the headline.
- **Going quiet between projects.** A blog with one post from 2024 reads worse than no blog. If you can't sustain writing, delete the link rather than leaving a stale one.
- **Open-sourcing only your own toy repos.** Five PRs to libraries the hiring team actually uses beats fifty stars on your personal repo nobody else touches.
:::

## Page checkpoint

<Quiz id="career-portfolio-page" title="Did building a portfolio stick?" sampleSize={2}>

<Question
  prompt="The page calls one thing 'the single biggest signal' in a 2026 portfolio. What is it?"
  options={[
    { text: "A long README with diagrams" },
    { text: "A high GitHub commit count" },
    { text: "A live URL on a custom domain — the gap between localhost and yourname-tool.com is the gap between 'learning to code' and 'developer'" },
    { text: "A pinned tweet showing off the project" }
  ]}
  correct={2}
  explanation="The Highlight box is explicit: if you do only one thing, deploy a project to a custom domain. Free hosting plus a ~$12 domain closes the gap between 'learning' and 'developer.'"
  revisit={{ to: "/docs/career/career-portfolio#2-deploy-everything", label: "Deploy everything" }}
/>

<Question
  prompt="Which project type does the page tell you to AVOID for your portfolio?"
  options={[
    { text: "A niche SaaS targeting a community you understand" },
    { text: "An AI-powered tool that solves a specific problem" },
    { text: "Generic todo or weather tutorial clones with no original spin" },
    { text: "A re-implementation of a popular product with your own twist" }
  ]}
  correct={2}
  explanation="The page calls out generic todo/weather apps and tutorials-that-look-exactly-like-the-tutorial as anti-signals. Original spin matters — even a clone is fine if it has one twist that's yours."
  revisit={{ to: "/docs/career/career-portfolio#1-build-35-real-projects", label: "What to avoid" }}
/>

<Question
  prompt="The page suggests writing a technical blog. What does it say you need to be qualified to write?"
  options={[
    { text: "The world expert on the topic" },
    { text: "Someone with 10+ years of experience" },
    { text: "Someone who recently learned the thing — sharing what you just figured out is genuinely valuable to people one step behind you" },
    { text: "A published academic" }
  ]}
  correct={2}
  explanation="The page is explicit: 'You don't need to be the world expert. Sharing what you learned recently is genuinely valuable to people one step behind you.' Build logs and lessons-learned posts count."
  revisit={{ to: "/docs/career/career-portfolio#3-write-about-your-work", label: "Write about your work" }}
/>

<Question
  prompt="What approach does the page recommend for contributing to open source?"
  options={[
    { text: "Spam PRs to popular projects to maximize your contribution count" },
    { text: "Start with projects you actually use; familiarity makes contribution easier, and quality beats quantity" },
    { text: "Only contribute to projects with 100k+ stars" },
    { text: "Fork projects and never submit a PR" }
  ]}
  correct={1}
  explanation="The page recommends starting with projects you already use — your familiarity makes the contribution easier. Quality matters over quantity; don't spam PRs for the sake of it."
  revisit={{ to: "/docs/career/career-portfolio#4-contribute-to-open-source", label: "Contribute to open source" }}
/>

</Quiz>

## What's next

→ Continue to [The Job Search](./career-job-search) for what to do once your portfolio is real.
