---
id: development
title: 'Phase 5: Development Practices'
sidebar_position: 8
sidebar_label: 7. Development
description: Trunk-based development, short-lived branches, conventional commits, feature flags, and Drizzle Kit for migrations.
---

# Phase 5: Development Practices

> **In one line:** Short-lived feature branches off `main`, conventional commits, feature flags for risky launches, and Drizzle Kit for every schema change.

:::tip In plain English
At startup scale, the daily development loop is less about which framework to use and more about how the team coordinates. Branches should live for days, not weeks. Commit messages should be parseable. Risky features should hide behind flags instead of long-running branches. Schema changes should go through code review, not into the production DB by hand.
:::

## Branching strategy: trunk-based development

Engineers create short-lived feature branches (typically merged within 1–3 days). Long-lived branches are forbidden — they cause merge conflicts and integration pain.

## Workflow

1. Pull latest `main`.
2. `git checkout -b feature/add-bulk-export`.
3. Write code, commit often.
4. Push and open a PR.
5. Wait for CI and review.
6. Address feedback.
7. Merge to `main` (usually squash-merge for clean history).
8. Branch is deleted.

## Conventional Commits

Commit messages follow a convention:

```
feat: add bulk export endpoint
fix: handle null email in signup
chore: bump drizzle to 0.36
docs: update README with deploy steps
refactor: extract email sending to package
test: add coverage for billing edge cases
```

This enables automatic changelog generation and clear history.

## Feature flags

Significant new features ship behind flags. PostHog or Statsig is configured to enable them per-user, per-cohort, or by percentage rollout.

```typescript
import { useFeatureFlag } from '@/lib/posthog';

export function BulkExportButton() {
  const enabled = useFeatureFlag('bulk-export');
  if (!enabled) return null;
  return <Button onClick={handleExport}>Export All</Button>;
}
```

> **In English:** `useFeatureFlag('bulk-export')` asks PostHog (or Statsig) "is this flag on *for the current user*?" — the answer depends on whatever targeting rules you set in the dashboard (percentage rollout, cohort, internal-only, etc.). If it's off, the button doesn't render at all. The code is already in production; the *exposure* is gated by the dashboard.

Flags let you:
- Ship code without releasing it.
- Roll out gradually (1% → 10% → 100%).
- A/B test variants.
- Kill features instantly without redeploying.

## Database migrations

Always with Drizzle Kit; never edit production schema by hand:

```bash
# Edit schema.ts to add a new column
bunx drizzle-kit generate    # Creates SQL migration file
git add drizzle/
git commit -m "feat: add export_format to users"
# Open PR; CI verifies migration applies cleanly
# Merge; deployment runs migration before app code update
```

## Pair programming and async review

Some teams pair extensively; others work async. Both are fine. The key: real review of code, not rubber stamps.

:::note Worked example: a risky launch behind a flag
The team is rolling out a new pricing UI. The risk: existing customers see new prices unexpectedly and panic.

1. Build the new pricing page behind a `new-pricing` flag.
2. Merge it to `main` — code is in production, but the flag is off.
3. Turn the flag on for internal users (the team's own accounts). Sanity-check.
4. Roll out to 1% of new signups. Watch Sentry, watch checkout conversion.
5. Roll out to 10%. Then 50%. Then 100%.
6. After two weeks at 100%, delete the flag and the old code.

If anything had gone wrong at any step, the team could turn the flag off instantly — no deploy, no rollback, no "where's the previous commit." That's the whole pitch for feature flags.
:::

:::info Highlight: long-lived branches are technical debt
A branch that lives more than a week becomes its own special kind of pain — every day, `main` drifts further away, conflicts pile up, and the eventual merge becomes a high-risk event. The trunk-based discipline isn't dogma; it's the path of *fewer* merge conflicts, *not more.*

When a feature is too big to fit in a 1–3 day branch, that's a signal to either (a) decompose it into smaller mergeable steps, or (b) merge it incrementally behind a feature flag. Almost never the right answer: keep working on the long branch.
:::

## What's next

→ Continue to [Phase 6: Testing Strategy](./testing) where Vitest unit/integration tests and a handful of Playwright E2E tests do most of the work.
