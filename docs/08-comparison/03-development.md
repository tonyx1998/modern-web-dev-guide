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

For enterprise specifics, see [Phase 5: Development Practices](/docs/enterprise/development-practices).

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

For enterprise specifics, see [Phase 6: Testing at Scale](/docs/enterprise/testing).

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

For enterprise specifics, see [Phase 7: CI/CD at Scale](/docs/enterprise/ci-cd).

:::note[Worked example: same one-line bug fix, three workflows]
A typo in a button label causes a small UX bug. Three teams' workflows:

- **Solo dev:** Edit the string, push to `main`, Vercel deploys in 60 seconds. Total: 2 minutes.
- **Startup:** Branch, edit, PR, one reviewer (probably approves in 5 minutes), merge, CI runs ~3 minutes, deploys via Vercel rolling. Total: ~15 minutes.
- **Enterprise:** Branch, edit, PR, two reviewers + CODEOWNERS, full CI (~8 minutes parallel), merge, canary to 1% (30-minute soak), 10% (2-hour soak), 50% (6 hours), 100%. Total: 1–4 hours from PR to all users.

Each workflow is *correct for its risk profile*. The solo dev has nothing to lose if the typo fix breaks something; the enterprise has a regulatory paper trail to maintain and millions of users.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting canary rollouts before you can read the signal.** Progressive 1% → 10% → 100% deploys only help if you have SLOs and dashboards that can detect a regression at 1% of traffic. Without them, you've just added wait time. Earn the canary by building the observability first.
- **Mandating two reviewers on a 4-person team.** All you've done is invent a deadlock — every PR is now blocked on the one person who's heads-down. At startup scale, "one reviewer who actually understands the area" beats two warm bodies clicking approve.
- **Confusing test *coverage* with test *value*.** Chasing the enterprise column's "90% coverage target" at a startup produces lots of trivial tests that slow CI and never catch a bug. Cover the critical user paths with Playwright, the tricky pure functions with unit tests, and stop.
- **Letting CI duration creep past 10 minutes without fighting it.** Once CI is slow, engineers batch changes into mega-PRs to amortize the wait, and review quality collapses. Treat CI duration as a tier-one metric — shard, cache, or cut tests before it bleeds into review behavior.
- **Believing "trunk-based" means "no branches."** Trunk-based means *short-lived* branches that merge to main daily, behind flags if needed. A team that interprets it as "push to main" learns the hard way why startups outgrow that around hire #3.
:::

## Page checkpoint

<Quiz id="comparison-development-page" title="Did development across scales stick?" sampleSize={2}>

<Question
  prompt="Which branching strategy becomes universal once a team is past solo work, and why?"
  options={[
    { text: "GitFlow with long-lived release branches, because it scales to large teams" },
    { text: "Trunk-based development with short branches, because long-lived branches cause integration pain at any scale" },
    { text: "One branch per engineer indefinitely, to maximize isolation" },
    { text: "Push directly to main with no branches, because reviews slow teams down" }
  ]}
  correct={1}
  explanation="Trunk-based development is universal beyond solo work — long-lived branches are the single biggest source of integration pain at any team scale, so startups and enterprises both keep branches short."
  revisit={{ to: "/docs/comparison/development#development-workflow", label: "Development Workflow" }}
/>

<Question
  prompt="What makes contract tests the 'unsung enterprise tool' compared to startup-scale testing?"
  options={[
    { text: "They replace unit and E2E tests at scale" },
    { text: "They are cheaper than other test types, so enterprises adopt them first" },
    { text: "They enforce that two services keep their promises to each other — critical when dozens of teams could otherwise break each other" },
    { text: "They are required by SOC 2 auditors at every scale" }
  ]}
  correct={2}
  explanation="A contract test pins down the fields and types one service promises to send and another promises to accept. At solo or startup scale they're overkill; at enterprise scale they keep dozens of teams from accidentally breaking each other."
  revisit={{ to: "/docs/comparison/development#testing", label: "Contract tests" }}
/>

<Question
  prompt="How does deployment strategy typically differ between a startup and a large company?"
  options={[
    { text: "Both use canary rollouts; only the rollout duration changes" },
    { text: "Startups: rolling or blue-green. Enterprises: progressive canary (1% → 10% → 100%) gated by SLOs" },
    { text: "Startups deploy weekly; enterprises deploy hourly" },
    { text: "Startups always deploy via Kubernetes; enterprises always deploy via Vercel" }
  ]}
  correct={1}
  explanation="Startups typically use rolling or blue-green deploys triggered by a merge to main. Enterprises use progressive canary rollouts — 1%, 10%, 100% — with automated rollback on SLO regression and freezes during major events."
  revisit={{ to: "/docs/comparison/development#cicd", label: "CI/CD" }}
/>

<Question
  prompt="In the worked example of a one-line typo fix, why does the same change take 2 minutes for a solo dev but 1–4 hours at an enterprise?"
  options={[
    { text: "Enterprise CI is intentionally slow to discourage frequent deploys" },
    { text: "Enterprises require a longer canary soak and review gates that exist for risk-profile reasons" },
    { text: "Enterprises rebuild the entire monorepo from scratch for every commit" },
    { text: "Solo devs skip testing entirely while enterprises run every test in serial" }
  ]}
  correct={1}
  explanation="The coding is identical — the time difference is the surrounding process: two reviewers, CODEOWNERS, full CI, then a staged canary with soak times. Each workflow is correct for its risk profile."
  revisit={{ to: "/docs/comparison/development#cicd", label: "Same typo fix, three workflows" }}
/>

</Quiz>

## What's next

→ Continue to [Operations](./ops) — observability, security, and compliance differ even more dramatically than development workflow.
