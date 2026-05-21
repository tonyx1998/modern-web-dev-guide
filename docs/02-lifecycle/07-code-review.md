---
id: code-review
title: 'Phase 7: Code Review'
sidebar_position: 8
sidebar_label: 7. Code Review
description: A second pair of eyes on every change before it merges. Catches bugs, spreads knowledge, and forces clearer thinking.
---

# Phase 7: Code Review

> **In one line:** Every change is read by at least one other person before it merges. Catches what tests miss; spreads knowledge across the team.

:::tip[In plain English]
Code review is the practice of having one or more teammates *read your code* before it becomes part of the main codebase. It's done on GitHub (or GitLab/Bitbucket) via **Pull Requests** — a UI that shows the diff between your changes and the main branch. Reviewers comment line-by-line; you respond and update. When everyone's happy, the PR is merged.

This single practice catches more bugs than any other phase. It also rapidly grows junior developers because they see *how a senior reads code*.
:::

## Why code review?

- **Catch bugs** that the author missed.
- **Spread knowledge** across the team.
- **Maintain consistency** in style and patterns.
- **Mentor junior engineers** through feedback.
- **Document decisions** (PR comments are durable).
- **Force the author to clarify their thinking** by explaining changes.

## The pull request workflow

1. Author creates a branch off `main`.
2. Author writes code, commits, pushes.
3. Author opens a **Pull Request** with a description.
4. CI runs automated checks.
5. Reviewers read the diff, leave comments.
6. Author addresses comments, pushes updates.
7. Reviewer approves.
8. PR merges into `main`.

## What reviewers look for

- **Correctness:** Does it actually do what it claims?
- **Design:** Is the approach reasonable? Are there better alternatives?
- **Tests:** Are critical cases covered?
- **Security:** Any obvious vulnerabilities? Input validation? Auth checks?
- **Performance:** Any O(n²) loops? Unnecessary network calls?
- **Readability:** Would another engineer understand this in 6 months?
- **Style:** Consistent with the codebase (linter usually catches this).
- **Edge cases:** Empty inputs, errors, null/undefined.

## Giving good reviews

- **Be kind.** The author is a person; the code is the artifact.
- **Explain the "why."** Not "use a map here" but "use a map here because [reason]."
- **Distinguish blocking from suggestion.** Use prefixes like `nit:` for minor style and `blocker:` for must-fix.
- **Don't bikeshed.** Hours arguing about variable names is a waste.
- **Approve quickly when possible.** Slow reviews are the #1 productivity killer.
- **Ask questions** instead of demanding changes. "Why this approach?" not "do it this other way."

## Receiving reviews

- **Don't take feedback personally.** It's about the code, not you.
- **Push back when you disagree** — politely, with reasoning.
- **Ask for clarification** if a comment is unclear.
- **Thank reviewers.** They spent time on your work.

## Review scale by team size

| Team size            | Review practice                                                  |
|---------------------|------------------------------------------------------------------|
| **Solo**             | Self-review. Read your own diff before merging. You'll catch surprising amounts. |
| **Small (2–10)**     | One reviewer, usually anyone on the team.                       |
| **Mid-size (10–50)** | One reviewer, with explicit code ownership for critical paths.  |
| **Large**            | Multiple reviewers, code owners required for sensitive areas, security review for auth/payments/data. |

:::note[Worked example: a great PR description]
Write your PRs like they're a letter to future-you.

```markdown
## What

Adds rate limiting to the /api/signup endpoint to mitigate spam signups.

## Why

We've seen ~200 fake signups/day from a botnet (see incident #482).
This adds a 5-req/minute/IP limit via Upstash Rate Limit.

## How

- Wrap the signup handler with `withRateLimit()` middleware.
- New env var `UPSTASH_REDIS_REST_URL` (added to .env.example).
- Added unit test covering the rate-limited case.

## Risk

Low. Falls open if Redis is down (logs warning, allows request).

## Testing

- `curl` test confirmed 6th request returns 429.
- Verified normal signup still works.
```

A reviewer can read this and understand the change *before* even looking at the diff. Two minutes spent on the PR description saves twenty minutes per reviewer.
:::

:::info[Highlight: self-review even when solo]
If you're a solo developer with no one to review your PRs, **review your own diff before merging**. Open the PR, walk away for 10 minutes, come back, and read it as if it were someone else's code. You'll catch obvious issues you missed while writing.

This single habit dramatically improves solo code quality over time.
:::

## Common anti-patterns

- **Rubber-stamp approvals:** Approving without reading. Erodes the entire purpose.
- **Massive PRs:** 2,000-line PRs that no one can meaningfully review.
- **Bikeshedding:** Endless arguments about trivial preferences.
- **Personal attacks:** "Why would you ever write this?" Toxic and counterproductive.
- **Slow reviews:** PRs sitting for days. Costs context, momentum, and morale.
- **Blocking on style nits:** Use a linter. Don't waste human time.

## What's next

→ Continue to [Phase 8: CI/CD](./ci-cd) where we automate the path from "code merged" to "code in production."
