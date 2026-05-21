---
id: foundational-skills
title: Foundational Skills
sidebar_position: 3
sidebar_label: 2. Foundational Skills
description: Nine skill areas in rough priority order. Don't move on until you're solid on each.
---

# Foundational Skills

> **In one line:** Nine skill areas in rough priority order — HTML/CSS/JS, Git, the command line, HTTP, SQL, TypeScript, one framework, basic backend, and AI assistants.

:::tip In plain English
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

:::note Try it yourself: a "depth check" for each skill
For any skill above, try this: open a blank file and build a tiny demo *without* a tutorial. For example:

- **JS depth check:** Write a debounce function from scratch in 5 minutes.
- **CSS depth check:** Build a responsive card grid with Flexbox and Grid — no framework.
- **Git depth check:** Take a feature branch, rebase it onto a moved main, resolve a conflict.
- **SQL depth check:** Write a query that joins 3 tables and groups by a calculated column.

If you can't do these confidently, that's the area to invest in next.
:::

:::info Highlight: priority order is intentional
The list above is roughly in dependency order. HTML/CSS/JS unlocks everything else. Git is needed before you can collaborate. HTTP is needed before you can debug anything that crosses the network. SQL is needed before any non-trivial backend. **Don't skip ahead to "one framework deeply" without items 1–4 solid** — that's the most common cause of "I built the tutorial but I can't build anything else."
:::

## What's next

→ Continue to [Building a Portfolio](./career-portfolio) to turn these skills into evidence employers can see.
