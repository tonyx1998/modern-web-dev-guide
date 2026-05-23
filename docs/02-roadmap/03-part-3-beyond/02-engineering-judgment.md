---
id: engineering-judgment
title: Engineering Judgment
sidebar_position: 3
sidebar_label: Engineering judgment
description: Hypothesis-driven debugging, the rule of three, trade-off thinking, reading code, writing things down — the meta-skills that decide whether code is good.
---

# Engineering Judgment

> **In one line:** The meta-skills that decide whether the code you write is *good*, regardless of stack.

:::tip[This pairs with the Decisions chapter]
This page pairs deeply with [Chapter 9: Decisions](/docs/decisions) — the judgment page covers the *skills* (how senior engineers actually think and debug), that chapter covers the *frameworks* (specific decision tools like ADRs, reversibility tests, and trade-off matrices). Read them together.
:::

None of these are taught in tutorials — they're how senior engineers actually think.

## 1. Hypothesis-driven debugging

The fastest engineers aren't the smartest. They're the most systematic. Bad debugging looks like: scroll through code, change something, hope it works, change something else. Good debugging is a binary search through hypotheses.

The loop:

1. **State the bug precisely.** Not "it's broken" — "when user clicks Save twice within 300ms, two rows appear in the DB." If you can't state it, you can't fix it.
2. **Form a hypothesis.** "The handler isn't debounced and both clicks pass through." A specific claim about the mechanism.
3. **Design the cheapest test that would disprove it.** Add one `console.log` at the handler entry, click twice, check the count. 30 seconds of work.
4. **Run it.** If the test rules out the hypothesis, the hypothesis dies — form another. If it survives, narrow further.

Most stuck debugging sessions are because step 2 was skipped — you changed code without a specific claim about what should happen. *Every* change should be designed to answer a question. If you can't say what a change is meant to prove, don't make it.

Two underused tools: `git bisect` (binary search through commits to find which one introduced a bug — works on any repo with passing tests at some past point) and a real *step debugger* (Chrome DevTools sources tab, VS Code's debugger). `console.log` is fine but reaches its limit fast; a debugger lets you pause execution and inspect every variable in scope.

## 2. The rule of three: don't abstract too early

Junior engineers add code. Senior engineers delete it. The most common over-engineering mistake is abstracting after seeing two similar things. **Wait for the third.** Two examples don't tell you what's actually shared and what's incidental; three do.

```tsx
// Two similar functions — DO NOT abstract yet
function emailWelcomeUser(user: User) {
  return resend.send({ to: user.email, subject: "Welcome", react: <Welcome name={user.name} /> });
}
function emailWelcomeAdmin(admin: Admin) {
  return resend.send({ to: admin.email, subject: "Admin access", react: <AdminWelcome name={admin.name} /> });
}

// THREE later — now you can see what's genuinely shared
// (the .email, the .name; NOT the subject or template)
function sendWelcome({ to, name, kind }: { to: string; name: string; kind: "user" | "admin" | "guest" }) { ... }
```

A premature abstraction is almost always wrong, because the second case constrained the shape to match the first — but the third case is the one that reveals what's incidental.

## 3. Trade-off thinking

There is no "best" technology, only "best for these constraints." Every non-trivial decision trades latency for cost, simplicity for flexibility, dev speed for ops complexity. Junior engineers pick the technically coolest option; senior engineers ask "what does *this team*, *this product*, *this stage* actually need?"

A worked example — "should I add Redis to cache user sessions?":

| Option | Latency | Cost | Ops complexity | Failure mode |
|--------|---------|------|----------------|--------------|
| DB sessions | ~5ms / hit | Free (existing DB) | Zero new pieces | DB load grows with traffic |
| Redis cache | ~0.5ms / hit | +$10/mo + setup | One more service to monitor | Cache wrong/stale; Redis down → cascading |
| JWT (no lookup) | ~0ms (no I/O) | Free | Zero new pieces | Can't revoke sessions; token leak = ~hours of risk |

For solomock with 5 concurrent users, DB sessions is the right answer — adding Redis is pure complexity. For an app with 50,000 concurrent users, Redis becomes worth the operational cost. The skill is matching the answer to the actual scale, not the imagined one.

:::note[Habit worth keeping]
When you make a non-trivial decision, write down (in the commit message or a one-line note) *the alternative you rejected and why*. Six months later you'll have a journal of your own judgment to learn from. This is the lightweight version of the formal ADR pattern covered in [Chapter 9: Decisions](/docs/decisions).
:::

## 4. Reading code

Most of your career is reading code, not writing it. The skill is undertrained because tutorials only teach writing.

Method for opening an unfamiliar codebase:

1. **Find the entry point.** Look at `package.json` → `"main"` / `"scripts"`. For web apps, follow the route that matches the URL you care about.
2. **Read the types first.** In TypeScript, the type definitions (or interfaces, or Zod schemas) tell you the data shape in seconds. The function bodies are noise until you know the shape.
3. **Read the tests.** Tests are documentation of intended behaviour with concrete inputs and outputs. Often clearer than the implementation.
4. **Trace one feature end-to-end.** Pick a single user action (e.g. "submit contact form"); follow it from button → handler → API → DB → response. Once you've traced one path, the rest of the codebase maps onto the same structure.
5. **Don't try to understand everything.** Skim. The 80% you don't need this week will still be there next week.

Practice deliberately: read the source of one small library you use every week. [Hono](https://github.com/honojs/hono) (~5k lines), [Zod](https://github.com/colinhacks/zod), or [Preact](https://github.com/preactjs/preact) are all small enough to read in an afternoon and teach more than a year of tutorials.

## 5. Writing things down

Half of senior engineering is communication artefacts that outlive your memory. The bar is low and easy to clear; most engineers don't bother, which is why doing it makes you stand out.

```text
// Bad commit message
fix bug

// Good commit message
fix: prevent double-submit on contact form when network is slow

The submit button was disabled on click but re-enabled by React's
re-render before the fetch resolved. Move the disabled state into
a useTransition so it tracks the actual pending state.

Closes #47.
```

The good message answers: *what changed, why, and what would prove it's fixed*. Future-you, debugging in six months, will thank present-you. Same goes for PR descriptions, READMEs, and especially **postmortems** — a one-page write-up of every non-trivial bug you fix, with the root cause, the symptom, and what you'd do to prevent the class of bug. After a year you have an external brain.

## Why this matters for you

You're a solo builder right now. None of this seems urgent — there's no team to communicate with, no reviewer catching your judgment. That's exactly when bad habits set in invisibly. The first time you join a team or open-source project, the engineers around you will read your judgment in your commit log, your PRs, and your debugging approach *before* they read your code. Build the artefacts now while the stakes are low.

## How to practice

Three concrete habits:

1. Keep a `mistakes.md` file where you write a 3-line note every time a bug surprises you — what you expected, what happened, root cause. Re-read it monthly.
2. Ask for code review from anyone better than you, even informally — post a snippet in a Discord, share a PR.
3. When you read code you didn't write, look up *why* the author chose that approach (commit message, blame, related issues) — the reasoning is the lesson.

## First step

For your next non-trivial bug fix on any project, force yourself to write a 3-paragraph commit message: *symptom*, *root cause*, *fix*. It feels like overkill for one commit; it pays back the first time you have to figure out what past-you was thinking.

---

→ Next: [Systems Thinking](/docs/roadmap/part-3-beyond/systems-thinking) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
