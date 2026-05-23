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

## Common mistakes

:::caution[Where people commonly trip up]
- **Hiding context to seem smart.** Beginners often strip out the "embarrassing" parts — what they tried, the exact error, their stack — thinking it makes them look more competent. It does the opposite: it makes the question unanswerable and signals you haven't done the work. Include the messy details; that's what gets you a real answer.
- **Asking 'why is this broken?' instead of a specific question.** Vague questions get vague (or no) responses. "Why is my Drizzle query returning duplicate rows after I add the second join?" is answerable; "react not working help" is not. Specificity is what summons the senior engineer.
- **DMing instead of asking in public.** A DM gets answered once, helps one person, and dies. The same question in a public Discord channel or Stack Overflow thread gets better answers (more eyes), helps the next person who Googles it, and builds your reputation. Never DM what you could ask in public.
- **Posting the bad version before writing the good version.** The act of writing a complete question — context, goal, what you tried, what you ruled out — often surfaces the answer mid-sentence. Write the full question first; you'll need to post less than half the time.
:::

## Page checkpoint

<Quiz id="asking-questions-page" title="Did asking-questions stick?" sampleSize={3}>

<Question
  prompt="What makes a reproducible example actually reproducible?"
  options={[
    { text: "A screenshot of the error message" },
    { text: "A description of what you were trying to do, in plain English" },
    { text: "Minimal, complete, runnable code that demonstrates the problem in isolation — plus expected vs actual behaviour" },
    { text: "Your entire project pushed to GitHub" }
  ]}
  correct={2}
  explanation="A good repro is minimal (no unrelated code), complete (a helper can run it without filling in blanks), and verifiable (clear expected vs actual). A 20-line gist beats a whole-project link every time — and beats a screenshot by miles."
  revisit={{ to: "/docs/roadmap/part-4-meta/asking-questions#bad-question-vs-good-question", label: "Bad question vs good question" }}
/>

<Question
  prompt="You're stuck on a Next.js routing bug. Should you DM a senior engineer you know, or post in the public Next.js Discord?"
  options={[
    { text: "DM — you'll get a faster, more personal answer" },
    { text: "Post in public — more eyes, the answer helps the next person who Googles it, and it builds your reputation" },
    { text: "Both — DM first, then post if no reply" },
    { text: "Neither — figure it out yourself to avoid bothering anyone" }
  ]}
  correct={1}
  explanation="Public threads scale. A DM helps one person once; a public post gets better answers (more eyes), helps everyone who hits the same bug later, and builds your reputation as someone who asks well. Never DM what you could ask in public."
  revisit={{ to: "/docs/roadmap/part-4-meta/asking-questions#where-to-ask", label: "Where to ask" }}
/>

<Question
  prompt="Which of these belongs in a good question?"
  options={[
    { text: "Only the exact error message — keep it short so people read it" },
    { text: "Context (stack), goal, what you tried with results, what you've ruled out, and a specific question" },
    { text: "A long backstory about why you're learning to code" },
    { text: "The full source of every file in your project, for completeness" }
  ]}
  correct={1}
  explanation="The anatomy of an answerable question: context + goal + what you tried (with results) + what you ruled out + a specific question. Each piece prevents a round-trip. Backstory and full-project dumps are noise; a stripped-out error is unanswerable."
  revisit={{ to: "/docs/roadmap/part-4-meta/asking-questions#the-anatomy-of-a-question-that-gets-answered", label: "The anatomy of a question that gets answered" }}
/>

<Question
  prompt="What's the 'Socratic move' when writing out a question?"
  options={[
    { text: "Quote a famous philosopher to seem credible" },
    { text: "Phrase the question so the answer is obvious — manipulate the reader" },
    { text: "Articulating the problem precisely often surfaces the answer mid-sentence; write it fully before posting" },
    { text: "Always ask three questions instead of one to get more answers" }
  ]}
  correct={2}
  explanation="Rubber-duck debugging: explaining the problem completely — to a duck, a doc, or a Discord channel — often reveals the answer before you hit send. Always write the full question first; you'll need to post less than half the time."
  revisit={{ to: "/docs/roadmap/part-4-meta/asking-questions#the-socratic-move", label: "The Socratic move" }}
/>

</Quiz>

→ Next: [Escaping the Tutorial Trap](/docs/roadmap/part-4-meta/tutorial-trap) · [Back to Part IV overview](/docs/roadmap/part-4-meta)
