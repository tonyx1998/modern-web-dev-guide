---
id: release-management
title: 'Phase 10: Release Management'
sidebar_position: 14
sidebar_label: 13. Release Management
description: Deployment freezes, coordinated release trains, change advisory boards, dark launches, and rollback procedures.
---

# Phase 10: Release Management

> **In one line:** Release management is the discipline that turns "code is in production" into "the launch went well" — freezes during high-traffic events, coordinated release trains for big launches, change advisory boards in regulated industries, and rehearsed rollback procedures.

:::tip In plain English
At a startup, "releasing" is "deploying." At an enterprise, releasing is a distinct discipline. The code can be in production for weeks (dark) before a feature is *released* to users. Major launches coordinate across many teams, marketing, customer support, and sometimes legal. And during peak business periods, deploys are sometimes deliberately frozen so a routine change can't take down the system at the worst possible moment.
:::

## Deployment freezes

- Most companies freeze deployments during high-traffic events (Black Friday, holidays).
- Only critical fixes deploy during freezes.

A freeze is a cost — engineers can't ship for a week or two — paid for the benefit of stability when the business stakes are highest. Companies plan for freezes by front-loading the work that absolutely must ship.

## Coordinated releases

- Major launches involve many services.
- Release trains: coordinated deploys at specific times.
- Launch checklists, rollback plans, war rooms.

A "release train" is a recurring scheduled release: every Tuesday at 10 AM, whatever's ready ships. Teams that miss the train catch the next one. This trades a little velocity for a lot of predictability.

For genuinely big launches (a major product reveal, a regulatory deadline), a war room is staffed with engineers, SRE, PMs, comms, and customer support for the duration of the launch window.

## Change advisory

- Regulated industries (banking, healthcare) often have Change Advisory Boards (CABs).
- All production changes reviewed and approved.
- Adds significant overhead but required for compliance.

A CAB is a recurring meeting (often weekly) where every proposed production change is reviewed by representatives from engineering, operations, security, and sometimes compliance. The overhead is real; the alternative — unreviewed changes in a regulated system — is unacceptable to auditors.

## Feature launches

A typical large feature launch:

1. **Code ships dark** (behind flag).
2. **Internal testing** (dogfooding).
3. **Beta cohort.**
4. **Gradual GA rollout.**
5. **Marketing aligns with technical milestones.**

The key idea: code being in production is *not* the same as users seeing the feature. The two are decoupled by feature flags. Engineers can ship code months before users notice.

:::info Highlight: dark launches buy you confidence
"Dark launching" — shipping new code behind a flag that's off for everyone — is one of the most powerful tools in enterprise releases. It lets you:

- Verify the code actually works in production with real data.
- Load-test by enabling the flag for 1% of traffic.
- Test the rollback path by flipping the flag back.
- Catch bugs in the new path while the old path still serves users.

By the time you flip the flag to 100%, you've already proven the code works. The "launch" is anticlimactic, which is the point.
:::

## Rollback procedures

- Every change must have a documented rollback plan.
- Rollback exercises practiced regularly.
- Database migrations designed to be reversible or non-blocking.

"How do we undo this if it breaks?" is required to be answered *before* the change ships. Not "we'll figure it out" — a specific, written, tested procedure.

Database migrations get particular attention: an irreversible migration (e.g., dropping a column) is a one-way door. Mature teams design migrations to be reversible: add a column, dual-write, switch reads, then drop the old column over multiple deploys.

:::note Worked example: launching a major feature
A team is launching a redesigned checkout flow used by millions of users daily:

- **T-8 weeks**: Code merged behind a flag (`new_checkout_v2`). 0% rollout.
- **T-6 weeks**: Internal employees see new checkout (dogfooding).
- **T-4 weeks**: 1% of real users — monitored for conversion-rate regressions.
- **T-3 weeks**: 5%, 10%, 25%, 50% over the next few weeks.
- **T-2 weeks**: 100% in two pilot regions.
- **T-1 week**: 100% globally, but legacy flow still available via a "use classic" link.
- **T-day**: Marketing announcement coincides with the long-since-completed rollout.
- **T+8 weeks**: Legacy flow removed; flag and code paths cleaned up.

By "launch day," the new checkout has been live for months. The marketing event is a celebration, not a risk.
:::

## What's next

→ Continue to [A Realistic Cost Picture](./cost-picture) — what does all this engineering investment actually cost?
