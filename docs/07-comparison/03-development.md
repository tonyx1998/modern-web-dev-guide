---
id: development
title: Development Workflow, Testing, and CI/CD
sidebar_position: 4
sidebar_label: 3. Development
description: How branching, code review, testing, and deployment pipelines differ across solo / small / large company scales.
---

# Development Workflow, Testing, and CI/CD

> **In one line:** A solo dev pushes to `main` after self-review; a startup runs trunk-based with a single reviewer and short branches; an enterprise runs trunk-based with code owners, security review, and a fully gated multi-stage canary rollout.

:::tip[In plain English]
The day-to-day rhythm of "I made a change, now what?" is the clearest dividing line between scales. A solo dev's loop is "push, refresh, done." A startup's loop is "PR, one review, merge, auto-deploy." An enterprise's loop is "PR, two reviewers, code owners, fitness functions, security scan, canary, monitor, promote."

The same change can take minutes, hours, or days depending purely on the surrounding process. The process isn't optional once you have more than a handful of engineers — it's how you stop them from breaking each other.
:::

## Development Workflow

| Aspect                   | Personal            | Small Company           | Large Company                    |
|--------------------------|---------------------|-------------------------|----------------------------------|
| **Branching**            | Push to main        | Trunk-based + short branches | Trunk-based + feature flags  |
| **Code review**          | Self                | 1+ reviewer             | 2+ reviewers, code owners, security review |
| **PR size**              | Whatever            | Small encouraged        | Strictly small required          |
| **Commit conventions**   | None                | Conventional Commits    | Conventional Commits + custom tools |
| **Pre-commit hooks**     | Optional            | Lint + format           | Lint + format + tests + secrets scan |
| **AI assistance**        | Heavy use           | Standard tool           | Approved tools, careful review   |

Trunk-based development becomes universal once you're past solo work — long-lived branches are the single biggest source of integration pain at any team scale.

For enterprise specifics, see [Phase 4: Development Practices](/docs/enterprise/development-practices).

## Testing

| Type                  | Personal           | Small Company             | Large Company                   |
|-----------------------|--------------------|--------------------------|---------------------------------|
| **Unit tests**        | Optional           | Vitest, important paths   | Required, coverage targets      |
| **Integration tests** | None to few        | Per-feature              | Comprehensive                   |
| **E2E tests**         | Manual mostly      | Playwright, critical paths| Limited but maintained          |
| **Visual regression** | None               | Optional (Chromatic)     | Standard for design system      |
| **Load testing**      | None               | Before scaling events    | Continuous, automated           |
| **Contract testing**  | N/A                | Rare                     | Required for services           |
| **Chaos engineering** | None               | None                     | Yes                             |
| **Accessibility**     | Lighthouse occasionally | axe-core in CI       | Comprehensive a11y program      |
| **Security testing**  | None               | Dependabot + occasional pen test | SAST + DAST + SCA + pen test + bug bounty |

The testing pyramid expands at every scale. A solo dev's "unit test the tricky function" becomes a startup's "Playwright covers the critical paths" becomes an enterprise's "tens of thousands of tests + chaos engineering + bug bounty."

For enterprise specifics, see [Phase 5: Testing at Scale](/docs/enterprise/testing).

:::info[Highlight: contract tests are the unsung enterprise tool]
Most public testing advice focuses on unit and E2E tests. But the most distinctive thing about enterprise testing is **contract tests** — automated checks that two services keep their promises to each other.

A contract test says: "Service A promises to send these fields with these types. Service B promises to accept them. If either side breaks the contract, the build fails." That's how you keep dozens of teams from accidentally breaking each other every Tuesday.

At solo and startup scale, contract tests are overkill. At enterprise scale, they're load-bearing.
:::

## CI/CD

| Aspect                  | Personal              | Small Company             | Large Company                   |
|-------------------------|-----------------------|--------------------------|---------------------------------|
| **CI tool**             | GitHub Actions / Vercel | GitHub Actions          | GitHub Actions / Buildkite / Jenkins / custom |
| **CI duration**         | Seconds to minutes    | 5–10 minutes             | Minutes (with caching and sharding) |
| **Deployment trigger**  | Push to main          | Merge to main            | Merge to main + approval        |
| **Deployment strategy** | Replace               | Rolling / blue-green     | Progressive (canary → 1% → 10% → 100%) |
| **Rollback**            | Vercel one-click      | Vercel / Railway one-click| Automated on SLO regression     |
| **Deployment frequency**| When ready            | Multiple per day         | Continuous, gated by flags      |
| **Deployment freeze**   | Never                 | Rare                     | Holiday + major launch freezes  |
| **Environments**        | Local + prod          | Local + preview + prod   | Local + dev + staging + canary + prod |

CI duration shapes everything else. A 5-minute loop encourages many small changes; a 30-minute loop creates batched mega-PRs that are slower to review and riskier to deploy. The enterprise investment in distributed builds and test sharding exists to keep CI fast despite the volume.

For enterprise specifics, see [Phase 6: CI/CD at Scale](/docs/enterprise/ci-cd).

:::note[Worked example: same one-line bug fix, three workflows]
A typo in a button label causes a small UX bug. Three teams' workflows:

- **Solo dev:** Edit the string, push to `main`, Vercel deploys in 60 seconds. Total: 2 minutes.
- **Startup:** Branch, edit, PR, one reviewer (probably approves in 5 minutes), merge, CI runs ~3 minutes, deploys via Vercel rolling. Total: ~15 minutes.
- **Enterprise:** Branch, edit, PR, two reviewers + CODEOWNERS, full CI (~8 minutes parallel), merge, canary to 1% (30-minute soak), 10% (2-hour soak), 50% (6 hours), 100%. Total: 1–4 hours from PR to all users.

Each workflow is *correct for its risk profile*. The solo dev has nothing to lose if the typo fix breaks something; the enterprise has a regulatory paper trail to maintain and millions of users.
:::

## What's next

→ Continue to [Operations](./ops) — observability, security, and compliance differ even more dramatically than development workflow.
