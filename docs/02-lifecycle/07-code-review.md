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

## Common mistakes

:::caution[Where people commonly trip up]
- **Opening a 1,500-line PR and expecting a real review.** Reviewers will skim, leave one comment, and approve. You'll merge with bugs nobody saw. Split into a stack of small PRs — ideally each one reviewable in 15 minutes — even if it means more orchestration.
- **Reviewing the diff instead of the change.** The diff hides context: the file that *isn't* modified but should be, the test that *isn't* added, the migration that should accompany this code. Always pull the branch (or click the preview deploy) and exercise the change before approving.
- **Pasting LGTM after Copilot review checks pass.** AI review tools catch style issues, not design issues. Treating "AI approved" as a substitute for human reading means design errors and subtle bugs sail through. The AI is one more reviewer, not the only one.
- **Letting "nit:" comments turn into blockers.** A reviewer leaves five `nit:` comments and the author dutifully fixes them all. Two days later, the PR is still open. If it's a nit, approve and let the author decide. Save the round-trip for blockers.
- **Reviewing tone as if it were code quality.** Snarky comments ("did you even test this?") get the right technical answer and poison the team. Pretend the author is reading your comments aloud on a video call — if you'd cringe, rewrite it.
:::

## Page checkpoint

<Quiz id="lifecycle-code-review-page" title="Did code review stick?" sampleSize={2}>

<Question
  prompt="The page lists several benefits of code review. Which one is NOT one of them?"
  options={[
    { text: "Catching bugs the author missed" },
    { text: "Spreading knowledge across the team" },
    { text: "Replacing automated tests" },
    { text: "Mentoring junior engineers through feedback" }
  ]}
  correct={2}
  explanation="Review and tests are complementary. Tests catch regressions automatically; review catches the design and reasoning issues tests can't see."
  revisit={{ to: "/docs/lifecycle/code-review#why-code-review", label: "Why code review" }}
/>

<Question
  prompt="What's the page's advice for giving good code review comments?"
  options={[
    { text: "Be terse — just say 'do this differently'" },
    { text: "Explain the 'why' behind suggestions and distinguish blockers from nits" },
    { text: "Block every PR until the style matches your personal preference" },
    { text: "Approve quickly without reading to avoid being a bottleneck" }
  ]}
  correct={1}
  explanation="A reviewer's job is to teach as much as to gate. Explaining reasoning and labeling severity (nit vs blocker) keeps reviews productive and the author moving."
  revisit={{ to: "/docs/lifecycle/code-review#giving-good-reviews", label: "Giving good reviews" }}
/>

<Question
  prompt="You're a solo developer with no one to review your PRs. What does the page recommend?"
  options={[
    { text: "Skip review entirely — it's only valuable with teammates" },
    { text: "Open the PR, walk away for 10 minutes, then read your own diff as if it were someone else's" },
    { text: "Hire a freelance reviewer for every PR" },
    { text: "Wait until you have a team before merging anything" }
  ]}
  correct={1}
  explanation="Self-review with fresh eyes catches a surprising amount. The page calls this a habit that dramatically improves solo code quality over time."
  revisit={{ to: "/docs/lifecycle/code-review#review-scale-by-team-size", label: "Self-review even when solo" }}
/>

<Question
  prompt="Which of these is flagged as a code-review anti-pattern?"
  options={[
    { text: "Linking to documentation in a comment" },
    { text: "Rubber-stamp approvals — clicking approve without reading the diff" },
    { text: "Writing a PR description that explains the change" },
    { text: "Using a linter to handle style consistency" }
  ]}
  correct={1}
  explanation="Rubber-stamping defeats the purpose entirely. If reviews are 'always approved,' the whole quality gate becomes ceremonial."
  revisit={{ to: "/docs/lifecycle/code-review#common-anti-patterns", label: "Code review anti-patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 8: CI/CD](./ci-cd) where we automate the path from "code merged" to "code in production."
