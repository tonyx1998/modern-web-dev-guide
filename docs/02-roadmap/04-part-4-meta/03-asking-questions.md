---
id: asking-questions
title: Asking Good Questions
sidebar_position: 4
sidebar_label: Asking questions
description: The anatomy of a question that gets answered — context, goal, what you tried, what you ruled out, a specific question.
---

# Asking Good Questions

> **In one line:** Good questions get gold-standard answers from senior engineers; bad questions get ignored. The difference is technique, not luck.

At some point you'll be stuck on something the docs don't cover and AI gets wrong. You'll need to ask a human — on Stack Overflow, Discord, Reddit, or a colleague. Bad questions get ignored or dismissive answers. Good questions get gold-standard responses from senior engineers who love to help. The difference is technique, not luck.

The same anatomy applies when you're [asking questions inside a code review](/docs/lifecycle/code-review) — being specific about what you tried and ruled out earns you faster, better answers from teammates too.

### The anatomy of a question that gets answered

1. **Context** — the bigger picture in one sentence. "I'm building a Next.js app with Drizzle on Postgres." Without this, helpers waste their first reply asking what you're doing.
2. **Goal** — what you want to happen. "I want to filter posts by tag and paginate the results."
3. **What you tried** — specific code, with what happened. "I tried this: [paste]. I expected X, got Y. The error was Z."
4. **What you've already ruled out** — "I checked the docs at link and tried suggestion A from this Stack Overflow answer — same result." This proves you've done work and saves people from suggesting things you already tried.
5. **A specific question** — "Why is my Drizzle query returning duplicate rows after I add the second join?" — not "why is this broken?"

### Bad question vs good question

```text
// Bad — gets ignored
"react not working help"

// Good — gets a thoughtful answer in an hour
"In Next.js 15 with the App Router, my client component's useState is reset
on every navigation between two pages that use the same component. I expected
state to persist when navigating between sibling routes. Repro: [link to
github gist with 20 lines]. I read the docs on 'Linking and Navigating' and
tried wrapping in a layout, no difference. Is this expected behaviour or a
bug in how I'm structuring routes?"
```

### The Socratic move

Sometimes writing the good version of the question answers it for you — the act of articulating the problem precisely is the act of understanding it. Senior engineers call this *rubber-duck debugging*: explaining the problem to a rubber duck (or a markdown doc) and realising mid-sentence what's wrong. Always try writing the question fully before posting; you'll need to post less than half the time.

### Where to ask

- **Stack Overflow** — best for specific technical errors with reproducible examples. Read their ["How to Ask"](https://stackoverflow.com/help/how-to-ask) page once, follow it forever.
- **Discord** — every major framework has an official Discord (React, Next.js, Tailwind, Drizzle). Best for "is this the right approach" questions where conversation helps.
- **GitHub Issues / Discussions** — best for "I think this might be a bug" reports. Always check existing issues first.
- **Reddit** (r/learnprogramming, r/reactjs, r/webdev) — best for broader, more opinion-driven questions.

→ Next: [Escaping the Tutorial Trap](/docs/roadmap/part-4-meta/tutorial-trap) · [Back to Part IV overview](/docs/roadmap/part-4-meta)
