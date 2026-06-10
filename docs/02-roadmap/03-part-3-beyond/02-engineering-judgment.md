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
This page pairs deeply with [Chapter 15: Decisions](/docs/decisions) — the judgment page covers the *skills* (how senior engineers actually think and debug), that chapter covers the *frameworks* (specific decision tools like ADRs, reversibility tests, and trade-off matrices). Read them together.
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
When you make a non-trivial decision, write down (in the commit message or a one-line note) *the alternative you rejected and why*. Six months later you'll have a journal of your own judgment to learn from. This is the lightweight version of the formal ADR pattern covered in [Chapter 15: Decisions](/docs/decisions).
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking the "exciting" technology over the boring one.** Boring tech (Postgres, Express, server-rendered HTML) has years of bug fixes, docs, and known failure modes. Reach for the novel option only when the boring one provably fails for your constraints — and write down what it failed at.
- **Treating every decision as equally weighty.** A one-way door (you can't undo it) — DB choice, public API shape, primary-key format — deserves a week of thought. A two-way door (you can revert in an hour) — a folder structure, a UI component library — deserves a commit, not a meeting. Spending equal energy on both is how teams stall.
- **Confusing "I haven't decided" with "I'm being careful."** Not deciding is itself a decision — you're choosing to live with today's default, with whatever it costs. If a decision keeps coming back unresolved, write down the options and pick the least-bad one; you can revisit when new information arrives.
- **Abstracting on the second occurrence.** The second case looks like the first because *you made it look like the first*. Wait for the third, real, unprompted occurrence — that's when the genuine shared shape becomes visible. Premature abstractions are almost always wrong-shaped and harder to remove than to add.
:::

## Page checkpoint

<Quiz id="engineering-judgment-page" title="Did engineering judgment stick?" sampleSize={3}>

<Question
  prompt="When is it actually right to break the 'choose boring technology' rule?"
  options={[
    { text: "When the boring option is clearly slower than a newer one in benchmarks" },
    { text: "When the team is bored and wants to learn something new" },
    { text: "When the boring option provably fails for a specific, named constraint you've already measured against — and you can articulate what failure you're trading away" },
    { text: "Whenever a popular framework releases a major new version" }
  ]}
  correct={2}
  explanation="Boring tech wins by default because its failure modes are known and Googleable. You only break the rule when the boring option fails a *specific* constraint (latency budget, scale, a missing feature) — and you can name what new failure modes you're now signing up for."
  revisit={{ to: "/docs/roadmap/part-3-beyond/engineering-judgment#3-trade-off-thinking", label: "Trade-off thinking" }}
/>

<Question
  prompt="Which of these decisions should get the MOST scrutiny before you commit?"
  options={[
    { text: "Which folder structure to use for your routes" },
    { text: "Which CSS framework to start with" },
    { text: "Your primary database choice and how you model your core entities — a one-way door with high blast radius" },
    { text: "Which testing library to use for unit tests" }
  ]}
  correct={2}
  explanation="The reversibility test: ask 'if I'm wrong, how hard is it to undo?' Folder structures and testing libraries are two-way doors — change in an afternoon. Primary DB choice and core data model touch every line of code downstream and migrate slowly. High blast radius deserves high scrutiny; low blast radius deserves a commit."
  revisit={{ to: "/docs/roadmap/part-3-beyond/engineering-judgment#3-trade-off-thinking", label: "Trade-offs and reversibility" }}
/>

<Question
  prompt="A decision keeps coming up in standups, never gets resolved, and the team keeps shipping around it. What's the failure mode?"
  options={[
    { text: "The team isn't being thorough enough — they should keep deliberating until they're sure" },
    { text: "Indecision IS a decision — you're choosing to live with today's default and paying its cost in delayed work and accumulated workarounds. Pick the least-bad option and revisit when new info arrives" },
    { text: "It's fine — important decisions take time and shouldn't be rushed" },
    { text: "The team needs more meetings to align on it" }
  ]}
  correct={1}
  explanation="Not deciding is a choice — you're picking the status quo, including all its costs. The cost of deliberation often exceeds the cost of being wrong on a reversible decision. Make the call, write down why, and revisit if new evidence changes the picture."
  revisit={{ to: "/docs/roadmap/part-3-beyond/engineering-judgment#5-writing-things-down", label: "Writing decisions down" }}
/>

</Quiz>

---

→ Next: [Systems Thinking](/docs/roadmap/part-3-beyond/systems-thinking) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
