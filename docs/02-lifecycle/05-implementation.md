---
id: implementation
title: 'Phase 5: Implementation'
sidebar_position: 6
sidebar_label: 5. Implementation
description: Write code that solves the problem. The largest single phase — but still only 20-30% of total project time.
---

# Phase 5: Implementation

> **In one line:** Write code that solves the problem. This is the phase everyone *thinks* is most of the job. It's actually only about a quarter of it.

:::tip In plain English
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

:::info Highlight: AI is a power amplifier, not a replacement
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

:::note Worked example: vertical slice vs horizontal layer
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

## What's next

→ Continue to [Phase 6: Testing](./testing) where we prove the code actually works (and stays working as it changes).
