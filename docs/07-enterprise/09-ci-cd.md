---
id: ci-cd
title: 'Phase 7: CI/CD at Scale'
sidebar_position: 10
sidebar_label: 9. CI/CD
description: Distributed builds, test sharding, progressive delivery, GitOps, and the engineering investment behind enterprise CI/CD.
---

# Phase 7: CI/CD at Scale

> **In one line:** Enterprise CI/CD pipelines are themselves engineered products — distributed builds with smart caching, tests sharded across hundreds of runners, progressive delivery with automated rollback, and GitOps for Kubernetes.

:::tip[In plain English]
At a startup, CI/CD is a YAML file in your repo and the trust that your tests catch most things. At an enterprise, CI/CD is a *platform* — built by a team of engineers, run on dedicated infrastructure, processing tens of thousands of builds per day. A 4-hour test suite has to finish in 8 minutes, or developers can't ship at the company's pace.

The point of all this engineering investment: turn "code merged to main" into "code safely in front of users" without a human ever touching a deploy button.
:::

## Distributed builds

- Tools like Bazel that cache build artifacts.
- BuildBuddy, Turborepo Remote Cache, EngFlow for remote build caching.
- A 4-hour sequential build runs in 8 minutes parallel + cached.

The math is dramatic: when 100 PRs land per day and each one rebuilds everything from scratch, your build farm becomes the bottleneck of the whole engineering org. Remote caching means "if anyone in the company has built this file already, you get their result." Suddenly the build farm is back under control.

## Test sharding

- Tests split across hundreds of parallel runners.
- Smart test selection: only run tests affected by changes.

A million-test suite isn't a problem when you can spread it across 500 runners. The catch is keeping the tests fast and the sharding logic correct.

## Build orchestration

- Jenkins, Buildkite, CircleCI, custom systems.
- Tens of thousands of builds per day.

The orchestrator's job: hand work to runners, retry transient failures, surface results to engineers, and not catch fire when 200 engineers all push at once.

## Progressive delivery

**Progressive delivery** is the practice of rolling new code out to a tiny slice of users first, watching the metrics, and only widening the rollout if everything looks healthy. The initial sliver is called a **canary** (after the bird in coal mines).

A typical canary pipeline:

```mermaid
flowchart TD
    Merge["Code merged to main"] --> Build["Built + tested"]
    Build --> Canary["Deploy to canary — 1% of traffic"]
    Canary --> Mon1{"Monitor 30 min"}
    Mon1 -->|Error rate up| RB["Rollback"]
    Mon1 -->|Latency up| RB
    Mon1 -->|Healthy| Ten["Deploy to 10% of traffic"]
    Ten --> Mon2{"Monitor 2 hours"}
    Mon2 -->|Regression| RB
    Mon2 -->|Healthy| Fifty["Deploy to 50% of traffic"]
    Fifty --> Mon3{"Monitor 6 hours"}
    Mon3 -->|Regression| RB
    Mon3 -->|Healthy| Full["Deploy to 100% of traffic"]
```

Automated rollback on **SLO** (Service Level Objective — a numeric target like "99.9% of requests succeed in under 200ms") regression is standard at this scale. The deploy system *itself* watches the metrics and reverts the change if anything looks wrong — no human in the loop required.

:::info[Highlight: deploy != release]
At enterprise scale, you split *deploying* (code is on production servers) from *releasing* (users see new behavior). Feature flags make this possible.

That separation is enormously freeing: you can deploy ten times a day, each one a small safe change, and *release* features whenever marketing is ready. Catastrophic releases stop being a thing because you can flip the flag back without redeploying anything.
:::

## GitOps

- Argo CD or Flux manages Kubernetes deployments.
- Git repo is the source of truth for what's deployed.
- Changes to infrastructure go through code review like any other change.

The GitOps insight: the cluster's desired state should be *declarative*, *versioned*, and *reviewed* — just like application code. Every deploy is a Git commit; every rollback is `git revert`.

:::note[Worked example: rollback during a canary]
A bad commit lands in main. Here's what should happen:

1. **00:00** — Build passes; canary deploy starts (1% of traffic).
2. **00:03** — Canary's error rate climbs from 0.1% to 4.7%.
3. **00:04** — Automated rollback triggers (Argo CD reverts the manifest to the previous version).
4. **00:05** — Canary returns to healthy.
5. **00:06** — Author gets a Slack alert: "Your change was auto-rolled-back. See dashboard."

Total user impact: 1% of users for 4 minutes. The whole thing happens before anyone is paged. The author wakes up, sees the alert, debugs the issue calmly, and tries again the next day.

At a startup, the same scenario plays out at 100% of users for 45 minutes until someone notices. The engineering investment in canary deploys and auto-rollback is what turns hours of customer pain into minutes for a tiny slice of traffic.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Canary windows too short to be useful.** A 30-second canary catches almost nothing — most regressions only show up under real load with real traffic patterns. Bake in long enough that you'd actually see the regression you're afraid of, even if it slows the pipeline.
- **Auto-rollback that watches the wrong metrics.** If your rollback trigger is "CPU > 80%," you'll miss the increase in 401 errors that just broke checkout for half your users. Tie rollback to business-shaped SLOs (error rate, p99 latency on key endpoints), not infrastructure proxies.
- **Building CI/CD as a side project on top of someone's day job.** At enterprise scale, the CI/CD platform is a real product with a real on-call. If it's owned by "whoever happened to write the Jenkinsfile," every build outage becomes an org-wide outage with no clear owner.
- **Skipping the migration from "deploy" to "deploy + release."** If your deploys still flip user-visible behavior, every deploy is a release and every release is risky. Get a feature-flag system in before you scale canary deploys — otherwise canaries are protecting you from the wrong thing.
- **Treating GitOps as "we use Git and we deploy."** GitOps means the cluster reconciles to what's in Git, automatically. If humans still `kubectl apply` in production, you have version-controlled YAML, not GitOps — and your audit trail has gaps.
:::

## Page checkpoint

<Quiz id="enterprise-ci-cd-page" title="Did enterprise CI/CD stick?" sampleSize={2}>

<Question
  prompt="At enterprise scale, what is the key conceptual split that feature flags enable?"
  options={[
    { text: "Frontend vs. backend deploys" },
    { text: "Deploying (code is on production servers) vs. releasing (users see new behavior)" },
    { text: "Staging vs. production" },
    { text: "Unit tests vs. integration tests" }
  ]}
  correct={1}
  explanation="Feature flags decouple deploy from release. You can deploy ten times a day, each one a small safe change, and release features whenever the business is ready. Catastrophic releases stop happening because flipping a flag back doesn't require redeploying."
  revisit={{ to: "/docs/enterprise/ci-cd#progressive-delivery", label: "Deploy vs release" }}
/>

<Question
  prompt="What is a 'canary' in a progressive delivery pipeline?"
  options={[
    { text: "A test environment that mirrors production" },
    { text: "A small initial slice of real traffic (often 1%) that gets the new code first, while metrics are watched before widening" },
    { text: "A backup region used during disaster recovery" },
    { text: "An automated linter for deploy configs" }
  ]}
  correct={1}
  explanation="A canary is a tiny slice of real users — often 1% — that gets the new code first. Metrics are watched during the canary window; if error rate or latency regresses, automated rollback triggers. Named after the canary in a coal mine."
  revisit={{ to: "/docs/enterprise/ci-cd#progressive-delivery", label: "Canary" }}
/>

<Question
  prompt="What is the core idea of GitOps?"
  options={[
    { text: "All Git operations must happen on production servers" },
    { text: "The cluster's desired state is declarative, versioned, and reviewed in Git — every deploy is a commit and every rollback is git revert" },
    { text: "Git replaces Kubernetes" },
    { text: "Only the SRE team can use Git" }
  ]}
  correct={1}
  explanation="GitOps tools like Argo CD and Flux make a Git repo the source of truth for what's deployed to Kubernetes. Changes to infrastructure go through code review like any other change, and rolling back is just reverting a commit."
  revisit={{ to: "/docs/enterprise/ci-cd#gitops", label: "GitOps" }}
/>

<Question
  prompt="Why is remote build caching (Bazel, BuildBuddy, Turborepo Remote Cache) so important at enterprise scale?"
  options={[
    { text: "It reduces the cost of cloud storage" },
    { text: "If anyone in the company has built a file already, you reuse their result — turning a 4-hour sequential build into 8 minutes with cache reuse" },
    { text: "It encrypts build artifacts" },
    { text: "It's required by SOC 2" }
  ]}
  correct={1}
  explanation="With 100 PRs landing per day, rebuilding everything from scratch turns the build farm into the engineering bottleneck. Remote caching means anyone's prior build result is shared — so a 4-hour sequential build can finish in minutes."
  revisit={{ to: "/docs/enterprise/ci-cd#distributed-builds", label: "Distributed builds" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 8: Deployment & Infrastructure](./deployment) — what's actually running once the CD pipeline ships your code.
