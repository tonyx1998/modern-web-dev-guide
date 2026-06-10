---
id: implementation
title: 'Phase 6: Implementation'
sidebar_position: 6
sidebar_label: 5. Implementation
description: Write code that solves the problem. The largest single phase — but still only 20-30% of total project time.
---

# Phase 6: Implementation

> **In one line:** Write code that solves the problem. This is the phase everyone *thinks* is most of the job. It's actually only about a quarter of it.

:::tip[In plain English]
Implementation is the writing-code phase. It's where designs become reality. You'll find that most of the work isn't "writing the happy path" — it's handling everything the design didn't explicitly cover (errors, edge cases, slow networks, mistyped input). A solid implementation phase converts a 100-line spec into 2,000 lines of robust code.
:::

## The largest phase (but not as large as you think)

Implementation typically consumes 30–60% of total project time. It's where designs become reality, where you discover everything you forgot to consider during discovery and design.

## What implementation includes

**Frontend:**
- Components and UI primitives
- Layouts and routing
- State management
- Forms and validation
- API integration
- Animations and transitions
- Accessibility
- Internationalization (i18n)
- Responsive design
- Performance optimization (code splitting, lazy loading, image optimization)

**Backend:**
- Routes and endpoints
- Business logic
- Database queries and migrations
- Background jobs
- Third-party integrations
- Error handling and validation
- Security hardening (rate limiting, input sanitization, CSRF protection)
- Caching strategies

**Glue:**
- Configuration management
- Environment-specific behavior
- Logging
- Telemetry instrumentation

## Six implementation best practices

**1. Vertical slices, not horizontal layers.**
Build one feature end-to-end (UI → API → DB) before starting the next. Don't build "all the UI first" — you won't discover backend issues until much later.

**2. Smallest possible change.**
Each commit should do one thing. Each PR should be reviewable in 15 minutes. Mega-PRs are unreviewable and risky.

**3. Make it work, then make it right, then make it fast.**
Optimization is the last step. Premature optimization wastes time and obscures intent.

**4. Read code more than you write.**
Existing code patterns matter. Match the codebase's style; don't force your preferences.

**5. Handle the unhappy path.**
Real users have slow connections, mistyped inputs, expired tokens, partial data. Every screen needs loading, error, and empty states.

**6. Write code for the next developer.**
That developer might be you, six months from now, who has forgotten everything.

## Pair programming and AI assistance

In 2026, AI-assisted coding is the norm:

- **Inline completions** (Copilot, Cursor's tab) speed up boilerplate.
- **Chat-based generation** (Cursor's compose, Claude Code) handles larger refactors.
- **Agentic coding** (Claude Code in autonomous mode, Devin) takes on multi-file tasks.

The skill is *reviewing and editing AI output*, not generating it. Senior developers benefit most because they can spot when AI-generated code is wrong.

:::info[Highlight: AI is a power amplifier, not a replacement]
Junior developers who use AI without learning the fundamentals end up with code they can't debug. Senior developers who use AI well ship 2–5× faster. The fundamentals matter *more* in the AI era because reading and judging code is the new bottleneck.

If you're starting out: type the boilerplate yourself for a while. Use AI for explanations, not just code generation. Build your reading-comprehension before your code-generation speed.
:::

## Common anti-patterns

- **Premature abstraction:** Building "flexibility" for use cases you may never have.
- **Copy-paste programming:** Three copies of similar code instead of one parameterized function.
- **God objects:** One class/file that does everything.
- **Magic numbers and strings:** Hardcoded values without explanation.
- **No error handling:** Crashes on the first unexpected input.
- **Ignoring warnings:** Linter warnings accumulate until they're useless.
- **Comments that lie:** Comments not updated when code changes; worse than no comments.
- **Big-bang refactors:** Rewriting half the codebase in one PR.

:::note[Worked example: vertical slice vs horizontal layer]
**Horizontal (bad):**

Week 1: Build *all the UI* for the entire app.
Week 2: Build *all the API endpoints*.
Week 3: Hook them together. *Discover everything is wrong.* Rewrite half of it.

**Vertical (good):**

Day 1: Build login screen + `/api/login` endpoint + DB schema for users. End-to-end working.
Day 2: Build dashboard screen + `/api/dashboard` endpoint. End-to-end working.
Day 3: Build settings screen + `/api/settings` endpoint. End-to-end working.

You discover integration issues *immediately*, not in week 3. You ship visible value every day.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Accepting AI-generated code without reading it.** Copilot/Cursor will produce code that compiles, runs, and is subtly wrong — uses a deprecated API, fabricates a function, or silently catches the error you needed to see. Read every line before you commit it; the AI is a fast junior, not a senior reviewer.
- **Mistaking "feature complete" for "done."** A feature isn't done when the happy path renders. It's done when empty state, loading state, error state, slow network, expired auth, and the back button all behave. Most "almost shipped" tickets are missing exactly these.
- **Hoisting logic into "utils" too early.** Two functions that look alike today often need to diverge next month. Premature `formatThing()` helpers ossify accidental similarity into a contract. Wait for the third occurrence before extracting; copy-paste twice is fine.
- **Letting the linter or type-checker turn yellow.** Once you ignore the first warning, the rest become wallpaper. Either fix it, suppress it with a one-line comment explaining why, or change the rule — but don't let the warning count drift upward across PRs.
- **Reaching for `useEffect`/`useState` to model server data.** A surprising amount of "implementation work" is recreating cache, loading, and error logic by hand. Reach for TanStack Query, SWR, or your framework's data loader first — it handles invalidation, retries, and request dedup you'd otherwise reinvent badly.
:::

## Page checkpoint

<Quiz id="lifecycle-implementation-page" title="Did implementation stick?" sampleSize={3}>

<Question
  prompt="What does the page mean by 'vertical slices, not horizontal layers'?"
  options={[
    { text: "Write all the CSS first, then all the JavaScript" },
    { text: "Build one feature end-to-end (UI to API to DB) before starting the next" },
    { text: "Split code into vertical files like .vue or .svelte" },
    { text: "Deploy to a different server for each layer" }
  ]}
  correct={1}
  explanation="Vertical slices surface integration problems immediately and ship visible value every day. Horizontal layering hides nasty issues until late, when fixing them is expensive."
  revisit={{ to: "/docs/lifecycle/implementation#six-implementation-best-practices", label: "Vertical slices vs horizontal layers" }}
/>

<Question
  prompt="The page summarizes a classic order of priorities as 'make it work, then make it right, then make it fast.' What does this imply about optimization?"
  options={[
    { text: "Optimize early so the code is fast from day one" },
    { text: "Optimization is the last step; premature optimization wastes time and obscures intent" },
    { text: "Skip optimization entirely — modern hardware is fast enough" },
    { text: "Optimize only after code review" }
  ]}
  correct={1}
  explanation="Working code beats fast-but-broken code. Get it correct, then clean it up, then — only if there's a real performance problem — optimize."
  revisit={{ to: "/docs/lifecycle/implementation#six-implementation-best-practices", label: "Work, right, fast" }}
/>

<Question
  prompt="In the page's view, what makes a senior developer benefit most from AI coding assistance?"
  options={[
    { text: "Seniors can type faster than juniors" },
    { text: "Seniors can spot when AI-generated code is wrong" },
    { text: "Only seniors have access to paid AI tools" },
    { text: "Seniors write more boilerplate than juniors" }
  ]}
  correct={1}
  explanation="AI amplifies whoever drives it. Reading and judging code becomes the bottleneck — and that's exactly the skill seniors have spent years sharpening."
  revisit={{ to: "/docs/lifecycle/implementation#pair-programming-and-ai-assistance", label: "AI is a power amplifier" }}
/>

<Question
  prompt="Which of these is flagged as a common implementation anti-pattern?"
  options={[
    { text: "Matching the existing codebase's style" },
    { text: "Handling loading, error, and empty states on every screen" },
    { text: "Premature abstraction — building flexibility for use cases you may never have" },
    { text: "Reading more code than you write" }
  ]}
  correct={2}
  explanation="Speculative abstractions usually misfit the real future requirements when they arrive. Build for today's needs; refactor when patterns actually emerge."
  revisit={{ to: "/docs/lifecycle/implementation#common-anti-patterns", label: "Implementation anti-patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 7: Testing](./testing) where we prove the code actually works (and stays working as it changes).
