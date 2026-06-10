---
id: developer-experience
title: 'Phase 4: Developer Experience'
sidebar_position: 7
sidebar_label: 6. Developer Experience
description: Monorepos, bootstrapped dev environments, internal CLIs, Backstage, service catalogs, and migration tooling.
---

# Phase 4: Developer Experience

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

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking monorepo vs polyrepo by religion instead of by tooling reality.** Monorepos without Bazel-class build infra become a single slow CI nightmare; polyrepos without a service catalog become a maze. The right answer is whichever your platform team can actually fund to a high standard — pick the one you'll invest in.
- **Building an internal CLI that wraps `kubectl` 1:1.** A wrapper that just re-exports every flag isn't an abstraction — it's a re-export. The point of `acme deploy` is that it encodes policy: canary, approver, rollback. If yours doesn't, you've added a tool nobody learns and gained nothing.
- **Treating Backstage adoption as the goal.** Standing up Backstage with three plugins and no service owners is "the platform team did something." Real adoption looks like product engineers visiting Backstage during incidents — measure that, not "did the page load?"
- **Running an eternal migration with no deadline.** "We're migrating off the v1 logger" two years in is a permanent state. Codemod 90%, escalate the laggards to their directors, and set a removal date. Without a date, nobody migrates.
- **Investing in DevEx only for the engineers who shout.** The senior engineer who already knows the tricks isn't the customer. The bored new hire on day three is — and the best DevEx metric is "minutes from `git clone` to first green PR."
:::

## Page checkpoint

<Quiz id="enterprise-developer-experience-page" title="Did developer experience stick?" sampleSize={3}>

<Question
  prompt="What is the deepest benefit of an internal CLI like 'acme deploy production'?"
  options={[
    { text: "It's shorter to type than kubectl" },
    { text: "It encodes policy as code — canary, approver, and rollback aren't suggestions in a wiki, they're enforced by the only path engineers use" },
    { text: "It lets engineers skip code review" },
    { text: "It uses fewer cloud resources" }
  ]}
  correct={1}
  explanation="Internal CLIs aren't really about convenience — they're how enterprises encode policy as code. Once 'acme deploy production' requires a canary, an approver, and a rollback plan, those requirements stop being optional. The safe path becomes the only path."
  revisit={{ to: "/docs/enterprise/developer-experience#internal-cli-tools", label: "Internal CLIs" }}
/>

<Question
  prompt="Which approach does the page highlight for safely deprecating an internal library across many teams?"
  options={[
    { text: "Send an org-wide email and remove the library after two weeks" },
    { text: "Write a codemod, ship a dashboard tracking adoption by team, set a deadline with teeth" },
    { text: "Wait until every team migrates voluntarily, however long it takes" },
    { text: "Hard-fail the build in every repo immediately" }
  ]}
  correct={1}
  explanation="Safe deprecation at scale combines codemods (which do most of the migration work automatically), dashboards (which track remaining adoption by team), and deadlines with real consequences. Emails alone don't move large engineering orgs."
  revisit={{ to: "/docs/enterprise/developer-experience#migration-tooling", label: "Migration tooling" }}
/>

<Question
  prompt="What is the primary trade-off between monorepo and polyrepo at enterprise scale?"
  options={[
    { text: "Monorepos are always faster; polyrepos are always slower" },
    { text: "Monorepos enable strong code sharing and coordinated migrations but require serious build-system investment; polyrepos are simpler per-repo but harder to coordinate across" },
    { text: "Monorepos work only for backend code; polyrepos only for frontend" },
    { text: "Polyrepos are cheaper to host" }
  ]}
  correct={1}
  explanation="Both models work — the choice depends on culture and tooling investment. Monorepos (Google, Meta) need Bazel/Buck/Pants to be manageable. Polyrepos (Amazon) are simpler in each repo but make cross-cutting changes much harder."
  revisit={{ to: "/docs/enterprise/developer-experience#monorepo-or-polyrepo", label: "Monorepo vs polyrepo" }}
/>

<Question
  prompt="What concrete question does a good service catalog answer?"
  options={[
    { text: "How much cloud budget is left this quarter" },
    { text: "Who do I page at 3 AM when this thing is broken" },
    { text: "Which engineer wrote the most code last quarter" },
    { text: "What features are launching next month" }
  ]}
  correct={1}
  explanation="The service catalog answers 'who owns this thing and how do I reach them?' Without it, a thousand-engineer org degrades into a guessing game during incidents. Backstage and similar tools turn each service into a hub with owner, on-call, dashboards, and runbooks."
  revisit={{ to: "/docs/enterprise/developer-experience#service-catalog", label: "Service catalog" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 5: Development Practices](./development-practices) — once the tooling is in place, what does daily coding actually look like?
