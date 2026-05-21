---
id: developer-experience
title: 'Phase 3: Developer Experience'
sidebar_position: 7
sidebar_label: 6. Developer Experience
description: Monorepos, bootstrapped dev environments, internal CLIs, Backstage, service catalogs, and migration tooling.
---

# Phase 3: Developer Experience

> **In one line:** The defining feature of mature enterprise engineering is internal platforms that make engineers productive — monorepos, bootstrapped dev environments, internal CLIs, Backstage, and code search across the whole org.

:::tip[In plain English]
At a startup, "the dev environment" is whatever each engineer set up by following the README. At an enterprise, the dev environment is itself a product: one command brings up a fully-configured workstation with every credential, every dependency, every internal tool. If onboarding a new engineer takes more than a few days, the DevEx team treats it as a bug.

Enterprise engineers spend most of their time *inside* the company's own tools, not GitHub's. Those internal tools — service catalogs, deploy CLIs, observability dashboards — *are* the workplace.
:::

## Monorepo or polyrepo

- **Monorepo** (Google, Facebook, Uber, Airbnb model) — everything in one giant repo. Tools: Bazel, Buck, Pants. Strong code sharing; coordinated migrations.
- **Polyrepo** (Amazon model) — each service in its own repo. Independent versioning; weaker code sharing.

Both work; the choice depends on culture and tooling investment. Monorepos are powerful but require serious investment in build systems; polyrepos are simpler per-repo but harder to coordinate across.

## Bootstrapped development environments

- New engineers run one command and get a working setup.
- All toolchains, credentials, secrets, services automatically configured.
- Often via cloud development environments (Codespaces, Coder, Gitpod, or custom).

The aspiration: an engineer who joined yesterday can push a small fix today. The reality at most enterprises is still "one to three days of setup," and the gap is filled by DevEx teams.

## Internal CLI tools

- `acme deploy production` instead of complex `kubectl apply` commands.
- `acme logs --service users --last 1h` for log access.
- `acme test --integration` for unified test runners.
- These tools abstract platform complexity and enforce best practices.

A good internal CLI is opinionated. It has a single right way to do the common things, hides the complexity of the underlying tools, and makes wrong configurations actively hard.

:::info[Highlight: internal CLIs encode policy as code]
The deepest benefit of internal CLIs isn't convenience — it's that **policy lives in the tool**. When `acme deploy production` automatically requires a canary rollout, an approver, and a rollback plan, those aren't suggestions in a wiki page. They're enforced by the only path engineers know how to use.

That's how enterprises scale safety without scaling pain: build the safe path *easier* than the unsafe path, then make it the only path.
:::

## Backstage

- Spotify's open-source internal developer portal.
- Dominant in 2026 as the service catalog and docs portal.
- Hosts plugins for CI/CD status, observability links, on-call info, runbooks.

A service in Backstage isn't just a name in a registry — it's a hub. Click the "checkout" service and you see its owner team, on-call schedule, runbooks, latest deploys, error rate, latency, and dependencies.

## Service catalog

- Every service registered with its owner team, dependencies, SLOs, runbooks, on-call rotation.
- Discoverable: "who owns the notification service?" → click → contact info, dashboards, code links.

The service catalog is the answer to "who do I page at 3 AM when this thing is broken?" Without it, large engineering orgs degrade into a thousand-person guessing game.

## Code search and navigation

- Sourcegraph or in-house tools index all repos.
- Jump-to-definition across the whole codebase.
- Find all usages of a function company-wide.

At enterprise scale, code search is a productivity multiplier. "How does anyone else use this internal SDK?" becomes a 30-second search instead of an hour of Slack messages.

## Migration tooling

- Codemods (jscodeshift, semgrep) for automated refactors across thousands of files.
- Migration tracking dashboards.
- Long-running migrations are tracked formally with deadlines.

When a platform team deprecates an old internal library, they don't just send an email — they write a codemod that fixes 90% of call sites automatically, ship a dashboard that tracks the remaining 10%, and pair with the laggards.

:::note[Worked example: deprecating an internal logging library]
A platform team wants to retire `acme-logger-v1` in favor of OpenTelemetry-based `acme-logger-v2`:

1. **Codemod written** to migrate most call sites automatically.
2. **Backstage dashboard** lists every service still on v1, sorted by team.
3. **CI warning** added: v1 still works but logs a deprecation message.
4. **Quarterly review:** directors see their teams' adoption percentages.
5. **End of life:** twelve months later, v1 is removed entirely.

This is what "deprecating safely at scale" actually looks like — codemods to do the work, dashboards to show progress, deadlines with teeth.
:::

## What's next

→ Continue to [Phase 4: Development Practices](./development-practices) — once the tooling is in place, what does daily coding actually look like?
