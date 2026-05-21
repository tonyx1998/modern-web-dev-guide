---
id: team-structure
title: Team Structure at This Scale
sidebar_position: 3
sidebar_label: 2. Team Structure
description: How a large engineering org is actually organized — product teams, platform teams, specialized functions, and career ladders.
---

# Team Structure at This Scale

> **In one line:** A large engineering org is hundreds of small teams stitched together by managers, program managers, and platform teams that build internal products for other engineers.

:::tip In plain English
At a startup, "the engineering team" is one chat channel. At an enterprise, "engineering" is hundreds of teams, each with its own slice of the product and its own backlog. Some teams build features users see; some build tools other engineers use; some keep production running while everyone else sleeps.

If you've only worked at a small company, the biggest mental shift is realizing that **most of the engineering work is invisible** — internal platforms, security, compliance, release engineering, data infrastructure. The user-facing product is the tip of an enormous iceberg.
:::

## Product Engineering Teams

- **5–10 engineers per team**, often more.
- Hundreds of such teams in a large org.
- Each team owns specific features or services.
- Reports up through a hierarchy: Engineering Manager → Director → VP → CTO.

A team's scope might be as narrow as "search ranking on the mobile app" or as broad as "the entire checkout flow." Either way, the team owns its services end-to-end: design, code, deploys, on-call, and post-mortems.

## Platform / Infrastructure Teams

These teams build internal tools that product teams use. "Internal customers are still customers" — they have product managers and user research just like external-facing teams.

Common platform teams:

- Build systems
- CI/CD platform
- Deployment platform
- Observability platform
- Secrets management
- Identity
- Design system

A healthy platform team treats its product engineers as paying customers and runs adoption metrics, user research, and roadmap reviews accordingly.

## Specialized Functions

At enterprise scale, several functions become full teams (or whole orgs):

- **Security teams** — AppSec, infrastructure security, compliance, identity, red team.
- **SRE (Site Reliability Engineering)** — Keep production running; design for reliability.
- **Data engineering / ML platform** — Pipelines, warehouses, ML infrastructure.
- **Design systems team** — Owns shared UI components and design tokens.
- **Release engineering** — Owns build infrastructure, deployment tooling.
- **Developer experience (DevEx)** — Improves engineer productivity (tools, docs, onboarding).
- **Localization** — Handles internationalization at scale.

:::info Highlight: SRE is not just "ops with a fancy name"
SRE (Site Reliability Engineering, originally from Google) is a discipline that treats reliability as a software problem. SREs:

- Define and enforce SLOs (service-level objectives).
- Build automation that reduces toil (repetitive manual work).
- Embed with product teams to make services more reliable.
- Own on-call rotations and incident response.

The key cultural difference from old-school operations: SREs are engineers who *write code* to manage infrastructure. They'd rather build a self-healing system than respond to the same page every Tuesday.
:::

## Management and Coordination

A typical management hierarchy at this scale:

- **Engineering managers** (each managing 5–10 engineers).
- **Engineering directors** (each managing 3–8 EMs).
- **VPs of Engineering** for major business areas.
- **CTO** as the technical leader.
- **Program managers** coordinate across teams.
- **Technical Program Managers (TPMs)** for complex cross-team initiatives.
- **Architects** (Principal/Staff engineers) shape technical direction.

TPMs are easy to underestimate from outside. At enterprise scale, the bottleneck on most major launches isn't writing code — it's coordinating ten teams, three deadlines, two legal reviews, and a marketing date. A good TPM can make a launch ship that otherwise wouldn't.

## Career Ladders

Engineers have two parallel tracks:

- **IC (Individual Contributor) track:** Engineer → Senior → Staff → Principal → Distinguished.
- **Management track:** Engineer → EM → Director → VP → CTO.

Both are valid careers. Senior ICs (Staff, Principal) often have more leverage than equivalent-level managers — a Principal Engineer can change how thousands of engineers work by setting a standard, writing an RFC, or building a library that becomes the default.

:::note Worked example: who shows up to ship one feature?
A "small" feature like "add 2FA to the login flow" at an enterprise might involve:

- 2 product engineers writing the code.
- 1 designer designing the UI.
- 1 PM scoping the requirements.
- 1 security engineer reviewing the threat model.
- 1 privacy engineer reviewing data flow.
- 1 SRE consulting on capacity and rollback.
- 1 TPM coordinating across the auth team, the mobile teams, and the localization team.
- 1 EM for each of the engineers above.
- Multiple code reviewers from the auth platform team (CODEOWNERS).

That's 10+ people on a "two-engineer feature." This is not bureaucracy — every one of those reviewers has caught real incidents on similar features in the past.
:::

## What's next

→ Continue to [Phase 1: Discovery & Planning](./planning) to see how all those people actually decide what to build.
