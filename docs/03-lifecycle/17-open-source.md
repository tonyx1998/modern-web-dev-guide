---
id: open-source
title: 'Open source: contributing and maintaining'
sidebar_position: 17
sidebar_label: Open source
description: How to contribute to OSS projects without burning the maintainer's time, how to maintain your own without burning out, and why participating in open source is the most reliable career accelerator most engineers ignore.
---

# Open source: contributing and maintaining

> **In one line:** Open source contribution is the most reliable career accelerator that most engineers leave on the table — and the techniques (start small, follow CONTRIBUTING.md, write good PRs, communicate well, respect the maintainer's time) are the same whether you're filing your first typo fix or merging your hundredth PR.

:::tip[In plain English]
Open source is a peculiar economic system: a handful of maintainers work for free; thousands of consumers benefit; a small fraction of consumers contribute back. The contribute-back fraction is who you want to be — and it's also how you build a public portfolio, get visibility, learn from elite engineers' code reviews, and (sometimes) get hired. The barrier is low (a typo fix counts); the upside is enormous. This page is how to do it well, plus how to maintain your own projects if you cross over.
:::

This page is the working guide. The patterns here also apply to *internal* open source — large companies often run their codebases like OSS internally (Google, Stripe, Shopify), so the contributor skills transfer.

## Why participate

The career argument:
- **Public portfolio.** Every PR you merge is permanent evidence of your work.
- **Code review from elite engineers.** Maintainers of large projects give world-class feedback. Free education.
- **Network.** You meet engineers across companies and countries.
- **Hiring signal.** "Contributor to React" / "Contributor to your-actually-used-library" is a strong signal.
- **Sometimes literal job offers.** Companies hire contributors who already know their codebase.

The non-career argument:
- **You use this stuff.** Giving back is the right thing to do.
- **You'll learn faster.** Contributing teaches more than reading.

The pragmatic argument:
- **Bugs you hit get fixed faster.** If you can submit a PR, you don't wait for a maintainer.

The barrier is low; the compound interest is high.

## Picking a project

For your first contributions, pick projects that:

- **You actually use.** Your motivation will be highest; you understand the use case.
- **Have an active maintainer.** Last commit > 1 month ago is a warning; > 6 months means abandoned.
- **Have a CONTRIBUTING.md.** Means the maintainer wants help.
- **Have good first issues labeled.** Maintainers do this to lower the barrier.
- **Have a vibrant Discussions / Discord / Slack.** Active community = supportive review.

Avoid for first contributions:
- **The Linux kernel / Postgres / V8.** These have famously high bars. Save for later.
- **Solo-maintained projects under stress.** Maintainer burnout means slow / no reviews.
- **Politically hot projects.** Some have governance drama you don't want to learn through.

Good targets:
- **The library you wish had a feature.** Maintainer will be friendly to a contributor.
- **Documentation improvements** on libraries you've used. Low bar; high value.
- **Examples in tutorials/repos.** Often easy fixes; very visible.

## Your first PR

A typo fix. Seriously.

1. **Find a typo** in a README or docs.
2. **Fork the repo.**
3. **Make the fix.** One change.
4. **Open a PR.** Title: `docs: fix typo in installation guide`.
5. **Wait.**

This sounds trivial. It's the right first step because:
- You learn the project's contribution workflow (fork → branch → PR → review).
- You get a merged PR with no risk.
- The maintainer notices you (positively — typo fixes are nice).
- You build the habit.

Once you've done 1-2 of these, you're "a contributor." The next PRs feel like less of a leap.

## Reading CONTRIBUTING.md and friends

Every well-run OSS project has docs explaining how to contribute:

| File | What |
|------|------|
| **CONTRIBUTING.md** | How to set up, run tests, submit PRs; commit message conventions; etc. |
| **CODE_OF_CONDUCT.md** | Behavior expectations |
| **README.md** | What the project is, how to use it |
| **LICENSE** | The legal terms (matters if you're contributing for/from work) |
| **`.github/PULL_REQUEST_TEMPLATE.md`** | What PR descriptions should look like |
| **`.github/ISSUE_TEMPLATE/*`** | What issues should look like |

**Read these before you do anything.** Submitting a PR without following CONTRIBUTING.md is the #1 way to annoy a maintainer.

## How to ask before you code

For non-trivial changes:

```
[Open an issue / discussion]

> Hi! I'd like to add support for X. Before I open a PR, want to make sure:
> 1. Is this something you'd want? (here's the use case)
> 2. Any existing work I'd build on / conflict with?
> 3. Any specific API shape you'd prefer?
> 
> Happy to discuss before I code.
```

Why this matters:
- The maintainer may say "no thanks" — saves you a week of work.
- They may say "actually we want it like this" — saves you a refactor.
- They may say "PR #432 is in flight for this" — saves duplicate work.

**Always discuss non-trivial changes before coding.** A PR with 500 lines that the maintainer rejects (because they didn't want the feature) is the worst-case outcome.

For trivial changes (typo, bug fix with clear repro): just file the PR.

## Writing a great PR

The PR description matters as much as the code.

```markdown
## What

Adds support for `option: 'foo'` to the `Bar` component.

## Why

Closes #1234. Users want to be able to do X without resorting to Y
(which has the drawback Z).

## How

- Adds a new prop `foo` (defaults to current behavior).
- When `foo=true`, the rendering uses path A; otherwise path B (unchanged).
- One new test, two updated tests.

## Verifying

\`\`\`bash
npm test
npm run example -- --foo
\`\`\`

## Notes

- Did NOT include the docs update; will follow in a separate PR if accepted.
- Considered alternative API `bar=foo` but rejected because of inconsistency with `baz`.
```

Why this is good:
- **Links the issue.** Maintainers can see context.
- **States the why** — not just what the code does.
- **Explains design decisions** that aren't obvious from the diff.
- **Shows verification.** Reviewer can reproduce.
- **Notes follow-ups.** Doesn't bundle docs + code + refactor.

A 2-line PR description is rude to reviewers. They have to figure out everything from the diff. A 20-line description (like above) saves them hours.

## What "good" code in a PR looks like

For OSS specifically:

- **Match the project's style.** ESLint, Prettier, linter — running them is table stakes.
- **One concern per PR.** Don't bundle a bug fix + a refactor + a feature. Reviewer can't tell what each part does.
- **Small PRs.** A 100-line PR gets reviewed in a day. A 2000-line PR sits for weeks. Split if you can.
- **Tests.** Even a one-line bug fix gets a test that would have caught it.
- **Backward compatibility.** OSS users hate breaking changes. If yours is breaking, call it out loudly and consider a migration path.
- **Respect the project's scope.** Don't propose "rewrite the test harness while we're at it." Stay in your lane.

## During review

Maintainers will request changes. Some patterns:

**Take feedback at face value.** "Can you split this into two PRs?" — they have a reason; do it.

**Push back politely if you disagree.** "I considered X but didn't choose it because Y. Happy to change if you'd prefer; here's the tradeoff..."

**Don't ghost.** If you can't address feedback for a week, say so. Maintainers close stale PRs after a few weeks of inactivity.

**Don't argue at length.** If the maintainer doesn't want your feature, accept gracefully. They're protecting the project's coherence.

**Squash if asked.** "Please squash" means "use git's squash to collapse your commits to one." Standard request.

## After merge

- **Star the project** if you haven't.
- **Help someone else's PR** — review one, leave a useful comment. Pay it forward.
- **Update your portfolio.** Link to the PR.
- **Look for the next issue.** Now you know the codebase a bit; the next contribution is easier.

## Maintaining a project

If you cross over and become a maintainer (your project gets adopted, or you join an existing project as a maintainer), the discipline shifts.

### The triage problem

Issues and PRs accumulate. A popular project gets 50+ issues a week, mostly from people who didn't read the FAQ.

Defenses:

- **Issue templates** that require reproduction info, version, environment. Auto-close issues that ignore them.
- **Bots** (`stale-bot`, `auto-close`) that close inactive issues / PRs after N days.
- **Labels** (`needs-repro`, `good first issue`, `wontfix`) to organize.
- **Triage hours**: spend 30 min / day, not 4 hours; otherwise you burn out.

### The "no" problem

Most feature requests are not aligned with the project's vision. Saying "no" gracefully is a key maintainer skill:

> "Thanks for the suggestion! I think this would be a great fit for a plugin / fork rather than the core library — the core is intentionally focused on X. If you build it, happy to link from the README."

> "We've considered this; you can see the reasoning in #345. Closing for now; happy to revisit if the situation changes."

Saying "no" is exhausting but necessary. A project that says yes to everything becomes incoherent and buggy.

### The funding problem

Maintainers do this for free. Many burn out. The 2026 situation:

- **GitHub Sponsors** and Open Collective — direct support from users.
- **Foundations** (Apache, OpenJS, CNCF) — institutional support for some projects.
- **Commercial models** — open core, dual licensing, support contracts (Sentry, Posthog, Mattermost).
- **Sponsorship** by corporate users (Cloudflare sponsors major OSS).

If you maintain a project that's load-bearing for companies: sponsorship is appropriate. Most consumers don't think to pay; ask explicitly.

### Burnout prevention

- **Set boundaries on availability.** "I reply on weekends" is not a sustainable promise.
- **Recruit co-maintainers.** Bus factor of 1 = certain burnout.
- **Take breaks.** Set the repo to "limited contributions" mode for a month if you need.
- **Don't apologize for not responding fast.** Users don't pay you; you don't owe them speed.
- **Hand off if you've outgrown the project.** Many great projects have changed hands; that's healthy.

## RFC processes

Larger projects (Rust, Ember, React) use **RFCs** (Requests for Comments) for non-trivial changes. Process:

1. Author writes an RFC document — motivation, design, drawbacks, alternatives.
2. Submitted as a PR to an `rfcs/` repo.
3. Community + maintainers discuss for weeks.
4. RFC is accepted, rejected, or amended.
5. Implementation follows.

For first-time contributors: probably don't write your first RFC. *Read* a few to understand the project's culture; comment thoughtfully on others' RFCs to build credibility. Then write one if you have a real proposal.

## Internal OSS

Many large companies run their codebases like OSS internally:

- Anyone can read any code.
- Anyone can open PRs to any team's code.
- Owners review and merge.
- ADRs, RFCs, contribution guides per project.

The skills are the same as public OSS. The dynamics are slightly different — you can probably talk to the owner team in Slack — but the discipline transfers.

If your company has internal OSS culture (Google, Stripe, Shopify), participating is a great way to build a reputation and learn the codebase. The same patterns: small PRs, respectful, follow the team's conventions.

## Common mistakes

:::caution[Where people commonly trip up]
- **Big PR with no prior discussion.** You spent a week on a feature the maintainer doesn't want. Discuss first.
- **Not reading CONTRIBUTING.md.** Submitting a PR that violates the conventions is annoying for the maintainer. Reduce friction; read first.
- **PR description: 'Fixed bug.'** Maintainer has to reverse-engineer what bug, what fix, what test. Write a real description.
- **Bundling concerns.** Bug fix + refactor + cleanup in one PR. Reviewer can't say "yes to bug fix, no to cleanup." Split.
- **Style fights.** "Why do you use 2 spaces? Mine uses 4." It's the project's choice. Match it.
- **Ghosting after feedback.** Maintainer requested changes a week ago; no response. They'll close the PR. Set expectations: "I'll address by Wednesday."
- **Disregarding the no.** Maintainer said they don't want this. Pushing harder won't change that; just damages the relationship. Fork if you really need it.
- **Forking and rebranding without credit.** Open source licenses generally allow it, but it's poor form. Credit the original.
- **Surprise breaking changes.** A PR that breaks the public API needs to be explicit, well-justified, and ideally include a migration path.
- **Sloppy git history.** 30 "WIP" commits, 5 merge commits. Squash, rebase, tidy before review.
- **Not testing.** "It works on my machine" doesn't survive contact with CI. Run the test suite.
- **Negative tone in issues.** "This library is broken / why doesn't it support X / what is wrong with you" — bad. "Hi, I encountered X in version Y; here's a repro" — good. Maintainers are volunteers.
- **Maintainers expecting users to pay.** They mostly won't. Sponsorship asks are fine; demands are not.
- **Refusing to delegate.** Maintainer who insists on doing everything alone burns out faster than projects with co-maintainers.
:::

## Page checkpoint

<Quiz id="lifecycle-open-source-page" title="Did open source stick?" sampleSize={2}>

<Question
  prompt="A new contributor wants to add a 500-line feature to a popular library. What's the right first step?"
  options={[
    { text: "Open the PR immediately to show good intent" },
    { text: "Open an issue or discussion first, describe the use case and proposed API, get the maintainer's sign-off before coding. A big PR with no prior discussion may be rejected outright (maintainer didn't want the feature), saving you days of work" },
    { text: "Fork and rebrand" },
    { text: "Email the maintainer privately" }
  ]}
  correct={1}
  explanation="Non-trivial changes always start with a conversation. Maintainers might say no, redirect, or align you with someone else's work-in-progress. Discuss before coding; saves everyone time."
  revisit={{ to: "/docs/lifecycle/open-source#how-to-ask-before-you-code", label: "Ask before coding" }}
/>

<Question
  prompt="What's the recommended structure for a good OSS PR description?"
  options={[
    { text: "Just the title; reviewers read the code" },
    { text: "What (the change), Why (motivation, linked issue), How (key design decisions), Verifying (how to test), Notes (alternatives considered, follow-ups). Saves the reviewer hours of figuring it out from the diff" },
    { text: "A meme and link to your blog" },
    { text: "Personal context about your week" }
  ]}
  correct={1}
  explanation="The PR description is for the reviewer's benefit. What/Why/How/Verify/Notes covers everything they need to evaluate the PR without re-deriving your reasoning. Good descriptions get merged faster."
  revisit={{ to: "/docs/lifecycle/open-source#writing-a-great-pr", label: "PR description structure" }}
/>

<Question
  prompt="A maintainer of a popular OSS library says they don't want to accept a contributor's feature. What's the right contributor response?"
  options={[
    { text: "Argue forcefully" },
    { text: "Accept the no gracefully, possibly fork if you really need the feature (and credit the original). Pushing harder damages the relationship and won't change the answer — the maintainer is protecting the project's coherence" },
    { text: "File the PR anyway" },
    { text: "Publicly criticize the maintainer" }
  ]}
  correct={1}
  explanation="Saying no is exhausting for maintainers; accepting their no gracefully is part of being a good community member. Forks exist for exactly this case — divergent visions can both exist."
  revisit={{ to: "/docs/lifecycle/open-source#during-review", label: "Accepting feedback" }}
/>

<Question
  prompt="A maintainer of a busy OSS project responds to ~5% of issues in a week. Burnout risk is high. What's a structural mitigation?"
  options={[
    { text: "Work longer hours" },
    { text: "Recruit co-maintainers (bus factor > 1), set up issue templates + bots to auto-triage stale items, set boundaries on availability ('I review weekly'), and consider sponsorship from corporate users who depend on the project. Maintaining solo at scale is unsustainable" },
    { text: "Stop responding to anyone" },
    { text: "Close the project" }
  ]}
  correct={1}
  explanation="Burnout is the leading cause of maintainer attrition. Co-maintainers, automation, explicit boundaries, and sponsorship are the standard mitigations. Solo heroism doesn't scale."
  revisit={{ to: "/docs/lifecycle/open-source#burnout-prevention", label: "Maintainer burnout prevention" }}
/>

</Quiz>

## What's next

→ Continue to [Maintenance](./maintenance) (the original lifecycle page), or back to the [Lifecycle overview](/docs/lifecycle).
