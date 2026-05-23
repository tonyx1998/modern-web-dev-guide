---
id: foundational-skills
title: Foundational Skills
sidebar_position: 3
sidebar_label: 2. Foundational Skills
description: Nine skill areas in rough priority order. Don't move on until you're solid on each.
---

# Foundational Skills

> **In one line:** Nine skill areas in rough priority order — HTML/CSS/JS, Git, the command line, HTTP, SQL, TypeScript, one framework, basic backend, and AI assistants.

:::tip[In plain English]
Treat this as a checklist, not a curriculum. You don't need a bootcamp or a course to learn these — you need to *build things* that force you to use each one. Every working web developer has these nine in their toolbox; the difference between juniors and seniors is depth, not breadth.
:::

In rough order of priority. Don't move on until you're solid on each.

## 1. HTML, CSS, and JavaScript Fundamentals

The actual language of the web. No framework saves you from understanding these.

**What to learn:**
- HTML semantics (when to use `<article>` vs `<section>` vs `<div>`).
- CSS layout (Flexbox, Grid, container queries).
- CSS responsive design (mobile-first, breakpoints).
- JavaScript fundamentals: variables, functions, closures, async/await, promises.
- DOM manipulation (querySelector, addEventListener).
- The event loop.
- Modules (ESM).

**Resources:**
- **MDN Web Docs** (mozilla.org) — Canonical reference.
- **JavaScript.info** — Excellent JavaScript tutorial.
- **Web.dev** (Google's resource) — Modern web development guides.
- **CSS Tricks** — Practical CSS patterns.

Don't skip this layer. Engineers who jump straight to React without learning JS struggle the moment things deviate from tutorials.

## 2. Git and Version Control

Universal across every job.

**What to learn:**
- Basic flow: clone, add, commit, push, pull.
- Branching and merging.
- Pull requests.
- Resolving merge conflicts.
- Rebasing (when and why).
- Reading git history.
- Using GitHub (or GitLab/Bitbucket).

**Resources:**
- The Git Book (git-scm.com/book/en/v2) — Comprehensive.
- GitHub's Learning Lab — Interactive tutorials.

## 3. The Command Line

You'll use it daily forever.

**What to learn:**
- File navigation (cd, ls, pwd, mkdir, rm, cp, mv).
- Permissions (chmod, chown).
- Process management (ps, kill, top).
- Text processing (grep, awk, sed, find).
- Pipes and redirection.
- SSH.
- Basic shell scripting.

**Resources:**
- The Missing Semester (missing.csail.mit.edu) — MIT's practical CS course.
- "Learn Enough Command Line to Be Dangerous."

## 4. HTTP and How the Web Works

You can't debug what you don't understand. This is covered in detail in [Chapter 1: Foundations](/docs/foundations).

## 5. SQL and Databases

Almost every job involves a database.

**What to learn:**
- Basic queries (SELECT, JOIN, WHERE, GROUP BY).
- Indexes and query performance.
- Transactions and ACID.
- Schema design (normalization, foreign keys).
- Migrations.

**Resources:**
- **Use The Index, Luke!** (use-the-index-luke.com) — How databases really work.
- **SQLBolt** — Interactive SQL tutorial.

## 6. TypeScript

The modern JavaScript baseline.

**What to learn:**
- Basic types and interfaces.
- Generics.
- Utility types (Partial, Pick, Omit).
- Type narrowing.
- Strict mode.

**Resources:**
- The TypeScript Handbook (typescriptlang.org/docs/handbook) — Official.
- Total TypeScript (totaltypescript.com) — In-depth course (paid but excellent).

## 7. One Framework Deeply

Pick one and get good. React + Next.js is the highest-demand combo, but Vue + Nuxt or Svelte + SvelteKit are excellent alternatives.

**What to learn (in React context):**
- Components, props, state.
- Hooks (useState, useEffect, useMemo, useCallback).
- Server vs client components.
- Data fetching patterns.
- Routing.
- Form handling.

**Resources:**
- React docs (react.dev) — Massively improved in recent years.
- Next.js docs (nextjs.org) — Excellent.
- Frontend Masters (paid, but worth it for serious learners).

## 8. Basic Backend

Even if you're frontend-focused, understand how the other side works.

**What to learn:**
- Building a REST API.
- Authentication basics.
- Database queries from your backend.
- Error handling and validation.
- Deployment.

You don't need to be a backend expert as a frontend developer, but knowing the basics makes you a better engineer overall.

## 9. AI Coding Assistants

Now a core skill.

**What to learn:**
- Using Cursor, GitHub Copilot, Claude Code, or similar.
- Writing prompts that get good results.
- Reviewing and editing AI-generated code critically.
- Knowing when AI is wrong.

**The skill is judgment, not generation.** AI can produce a lot of code; deciding which to keep is what matters.

:::note[Try it yourself: a "depth check" for each skill]
For any skill above, try this: open a blank file and build a tiny demo *without* a tutorial. For example:

- **JS depth check:** Write a debounce function from scratch in 5 minutes.
- **CSS depth check:** Build a responsive card grid with Flexbox and Grid — no framework.
- **Git depth check:** Take a feature branch, rebase it onto a moved main, resolve a conflict.
- **SQL depth check:** Write a query that joins 3 tables and groups by a calculated column.

If you can't do these confidently, that's the area to invest in next.
:::

:::info[Highlight: priority order is intentional]
The list above is roughly in dependency order. HTML/CSS/JS unlocks everything else. Git is needed before you can collaborate. HTTP is needed before you can debug anything that crosses the network. SQL is needed before any non-trivial backend. **Don't skip ahead to "one framework deeply" without items 1–4 solid** — that's the most common cause of "I built the tutorial but I can't build anything else."
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating the list as nine boxes to tick off.** The point is depth, not coverage. "I did the React tutorial" is not item 7 done. You finish an item when you can build something non-trivial in it from a blank file.
- **Learning a framework before HTTP and SQL.** You'll get React components rendering and still be unable to explain why your fetch returns 401 or why your query takes 4 seconds. Items 4 and 5 unlock more debugging power than item 7.
- **Outsourcing the fundamentals to AI.** Letting Copilot write your first closures, your first SQL joins, your first async/await means you never internalize them. Use AI to *check* your understanding, not to skip past it.
- **Skipping the command line because "the IDE has buttons for that."** Every server you touch in production is a shell. Engineers who can't grep, ssh, or read a process list lose hours every week to tasks that should take seconds.
- **Calling TypeScript "optional."** In 2026 it's the default for almost every greenfield project and most legacy ones are migrating. Learn it alongside JS, not "after you're comfortable."
:::

## Page checkpoint

<Quiz id="career-foundational-skills-page" title="Did the foundational skills stick?" sampleSize={2}>

<Question
  prompt="Why does the page put HTML/CSS/JS fundamentals at the top of the priority list — above 'one framework deeply'?"
  options={[
    { text: "Frameworks are deprecated in 2026" },
    { text: "Because no framework saves you from understanding the actual language of the web; engineers who skip this layer struggle the moment things deviate from tutorials" },
    { text: "Because frameworks are easier than vanilla JS" },
    { text: "Because employers test you on raw HTML during interviews and never on React" }
  ]}
  correct={1}
  explanation="The list is in rough dependency order. HTML/CSS/JS is the actual language of the web — no framework abstracts it away. People who jump to React without solid JS struggle the moment the tutorial pattern doesn't fit."
  revisit={{ to: "/docs/career/foundational-skills#1-html-css-and-javascript-fundamentals", label: "Why fundamentals first" }}
/>

<Question
  prompt="According to the page, what is the *actual* skill required when using AI coding assistants?"
  options={[
    { text: "Generating as much code as possible per prompt" },
    { text: "Judgment — reviewing and editing AI-generated code critically, and knowing when AI is wrong" },
    { text: "Memorizing model parameter counts" },
    { text: "Training your own fine-tuned model" }
  ]}
  correct={1}
  explanation="The page is explicit: 'The skill is judgment, not generation.' AI can produce a lot of code; deciding which to keep — and noticing when it's wrong — is what matters."
  revisit={{ to: "/docs/career/foundational-skills#9-ai-coding-assistants", label: "AI assistants: judgment, not generation" }}
/>

<Question
  prompt="The page suggests a 'depth check' for each skill. What does the depth check actually involve?"
  options={[
    { text: "Watching a longer tutorial on the topic" },
    { text: "Opening a blank file and building a tiny demo *without* a tutorial open — like writing debounce from scratch" },
    { text: "Reading the official documentation cover to cover" },
    { text: "Adding the skill to your LinkedIn profile" }
  ]}
  correct={1}
  explanation="The depth check is a blank-file challenge: write debounce in 5 minutes, build a responsive grid with no framework, rebase across a moved main. If you can't do them without a tutorial open, that's the skill to invest in next."
  revisit={{ to: "/docs/career/foundational-skills#9-ai-coding-assistants", label: "Depth check" }}
/>

<Question
  prompt="The page warns against one common failure mode in particular. Which is it?"
  options={[
    { text: "Learning HTML before learning CSS" },
    { text: "Using TypeScript instead of plain JavaScript" },
    { text: "Skipping ahead to 'one framework deeply' before items 1–4 (HTML/CSS/JS, Git, command line, HTTP) are solid" },
    { text: "Picking React over Vue or Svelte" }
  ]}
  correct={2}
  explanation="The 'Highlight' box names this directly: skipping to a framework without solid fundamentals is the most common cause of 'I built the tutorial but I can't build anything else.'"
  revisit={{ to: "/docs/career/foundational-skills#9-ai-coding-assistants", label: "Priority order is intentional" }}
/>

</Quiz>

## What's next

→ Continue to [Building a Portfolio](./career-portfolio) to turn these skills into evidence employers can see.
