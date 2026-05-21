---
id: development-lifecycle
title: 2. The Development Lifecycle
sidebar_position: 3
sidebar_label: 2. Lifecycle
description: The phases every project moves through — plan, design, build, review, ship, monitor, maintain.
---

# Part 2: The Universal Development Lifecycle

*The phases every project moves through — from one-person blogs to billion-user platforms.*

:::tip Beginner orientation
**What this chapter is really about:** Real software isn't written in one go. It moves through phases — somebody decides what to build, somebody designs it, somebody writes the code, somebody else reviews it, automated systems test it, it gets shipped to users, and then it gets monitored and maintained forever. This chapter walks through all of those phases.

**Why this matters before you learn any framework:** Frameworks (Next.js, React, Django, etc.) only solve the "writing the code" phase. The other phases — planning, design, code review, deployment, monitoring — are what actually consume most of your time as a working developer. Understanding the full loop helps you see where each tool fits.

**Mental model:** Think of building a product like building a restaurant. You don't just start cooking. First you decide what kind of restaurant (planning), draw up the floor plan (design), build the kitchen (architecture + setup), hire and train staff (team setup), cook test meals (implementation + testing), have a soft opening with friends (code review + staging), open to the public (deployment), and then keep the place running every day (observability + maintenance). Software has the exact same arc.

**Jargon you'll meet:** *requirements, PRD (product requirements document), wireframe, system design, architecture, repository, branch, pull request, code review, CI (continuous integration), CD (continuous delivery), staging, production, observability, on-call, incident, post-mortem.*

**If you only remember one thing:** Writing code is maybe 20% of a software engineer's actual job. The other 80% is everything in this chapter.
:::

Software development has a recognizable rhythm. The complexity of each phase varies dramatically by scale, but the phases themselves are universal. A solo developer in a coffee shop and a 5,000-engineer organization both go through these steps; one just does each one in five minutes while the other takes five weeks.

This file walks through all eleven phases in depth. Subsequent files (04, 05, 06) show how these phases actually look at different scales.

---

## The Eleven Phases

```
1. Discovery & Planning          ←  What are we building, and why?
        │
2. Design                        ←  What does it look like?
        │
3. Architecture                  ←  How are we building it?
        │
4. Environment Setup             ←  Setting up the workshop
        │
5. Implementation                ←  Actually writing code
        │
6. Testing                       ←  Proving it works
        │
7. Code Review                   ←  Catching what tests miss
        │
8. CI/CD                         ←  Automating the path to production
        │
9. Deployment & Hosting          ←  Code reaches users
        │
10. Observability                ←  Seeing what's happening in prod
        │
11. Maintenance & Iteration      ←  The longest phase by far
```

These aren't strictly sequential — modern development is iterative, with constant feedback loops. But every feature, every bug fix, every refactor goes through these stages in some form.

---

## Phase 1: Discovery & Planning

**Goal:** Figure out what to build and why, before writing a single line of code.

### Why It Matters

The most expensive bugs are not in code — they're in deciding what to build. A perfectly implemented feature nobody wants is a complete waste. Discovery is the cheapest place to fix mistakes.

The cost of changing direction grows exponentially through the lifecycle:
- Change your mind during discovery: free.
- Change your mind during design: hours.
- Change your mind during implementation: days.
- Change your mind after launch: weeks of migration, customer pain, lost trust.

### What "Planning" Means at Different Scales

**Solo developer / personal project:**
- A paragraph in your notes app
- A quick sketch
- A list of 3–5 features

That's enough. Don't over-plan a side project.

**Small team / startup:**
- A 1–2 page PRD (Product Requirements Doc) in Notion or Linear
- Acceptance criteria for each feature
- Designs or wireframes attached
- Estimated effort
- Sprint planning to slot it into a 2-week cycle

**Large company:**
- 10–30 page PRDs with stakeholder sign-off
- User research, surveys, customer interviews
- Market analysis and competitive comparison
- Legal/compliance/security review checklists
- Cross-team dependency mapping
- Quarterly OKR alignment
- Capacity planning
- Multiple rounds of revision

### Key Discovery Questions

Regardless of scale, you should answer:

1. **Who is this for?** (Specific user, not "everyone.")
2. **What problem does it solve?** (In their words, not yours.)
3. **What does success look like?** (Numerical, if possible.)
4. **What's the minimum that's useful?** (Avoid scope creep.)
5. **What are the constraints?** (Time, budget, regulation, team skills.)
6. **What could go wrong?** (Risks to acknowledge before they bite you.)
7. **Who needs to approve?** (Stakeholders, security, legal.)

### Common Anti-Patterns

- **Solution before problem:** "Let's use blockchain!" before understanding what users want.
- **Over-planning:** Spending months in discovery and never shipping.
- **Under-planning:** Building something nobody wants because you didn't talk to users.
- **Feature creep during planning:** Every meeting adds three features. Resist.
- **Imagining users instead of asking them:** Real user research is uncomfortable but invaluable.

### Tools Used in 2026

- **Notion / Linear** — Specs and project management
- **Figma / FigJam** — Visual collaboration, user journey maps
- **Loom** — Async video for cross-team communication
- **User research:** Dovetail, Maze, Lookback
- **Surveys:** Typeform, Tally
- **Analytics for understanding existing behavior:** PostHog, Amplitude, Mixpanel
- **AI-assisted research:** Summarizing user interviews with Claude/GPT, generating synthetic user personas

---

## Phase 2: Design

**Goal:** Decide how the product looks and feels before writing code.

### Why Design Before Code?

Changing pixels in Figma takes minutes. Changing pixels in code takes hours and risks introducing regressions. Design is a cheap form of prototyping that catches bad ideas before they become bad code.

### Sub-Phases of Design

**Information Architecture (IA):**
What content/features exist, and how they're organized. The site map. Navigation structure. URL hierarchy. Search and findability strategy.

**User Flows / Journeys:**
Map the steps a user takes to accomplish a goal. "Sign up → confirm email → complete profile → create first project." Identify drop-off risks at each step.

**Wireframes:**
Low-fidelity sketches of each screen. Boxes and labels — no colors or fonts. The point is to nail the structure before worrying about aesthetics.

**High-Fidelity Mockups:**
Pixel-perfect designs using your color palette, fonts, spacing, and component library. Usually built in Figma.

**Prototypes:**
Clickable Figma flows that simulate the app. Lets you test interactions without building them.

**Design System:**
A library of reusable components (buttons, inputs, cards, modals) with consistent styling. This is what engineering will actually implement. Without a design system, every screen feels slightly different and inconsistent.

### Modern Design Practice in 2026

Design has become tightly coupled to engineering:

- **Design tokens** — Colors, spacing, typography defined as variables (like `--color-primary` or `space-4`) shared between Figma and code.
- **Design-to-code:** Figma plugins generate Tailwind/CSS directly; AI tools (v0.dev, Lovable) generate working components from designs.
- **Component-driven design:** Designers work in the same component library engineers use, so handoff is trivial.
- **Real data, not lorem ipsum:** Modern designs use realistic content lengths and edge cases.

### Tools in 2026

- **Figma** — Dominant design tool. Has FigJam for whiteboarding, Dev Mode for engineer handoff.
- **Penpot** — Open-source alternative.
- **v0.dev, Lovable, Bolt.new** — AI-powered design-to-code.
- **Storybook** — Interactive component documentation.
- **Chromatic** — Visual regression testing for design systems.

### Accessibility From the Start

Accessibility (a11y) isn't something to retrofit. Designs should account for:
- Color contrast (WCAG AA minimum, AAA preferred)
- Touch target sizes (44×44px minimum)
- Keyboard navigation
- Screen reader semantics
- Reduced motion preferences
- Right-to-left language support

Accessibility errors caught at design cost minutes. The same error caught after launch can cost weeks of rework.

### Common Anti-Patterns

- **Designing without engineers:** Designs that look great but are technically impractical.
- **Designing without users:** Looks beautiful, usability tests it tanks.
- **Skipping design for "engineering speed":** Almost always slower in total.
- **Pixel-perfect demands across breakpoints:** A waste; design fluid systems instead.
- **Designing happy paths only:** Real interfaces have empty states, loading states, error states, partial data states.

---

## Phase 3: Architecture & Technical Design

**Goal:** Decide how to build it — the technical foundation that supports everything else.

### What Architecture Covers

- **Stack selection:** Languages, frameworks, databases, services.
- **System decomposition:** Monolith vs microservices, which services exist.
- **Data model:** Schema, relationships, indexing strategy.
- **API design:** REST/GraphQL/tRPC, endpoint shapes, versioning strategy.
- **Authentication and authorization:** How users prove identity, how permissions work.
- **Hosting model:** Where it runs, how it scales.
- **External integrations:** Stripe, SendGrid, third-party APIs.
- **Observability:** Logging, monitoring, alerting.
- **Security posture:** Encryption, secrets management, threat model.
- **Performance budgets:** Page load targets, API latency SLOs.

### Architecture Decisions Are Hard to Reverse

Stack choices have wildly different reversibility:

| Decision               | Cost to Reverse              |
|------------------------|------------------------------|
| Color of a button      | Minutes                      |
| Frontend framework     | Weeks to months              |
| Backend language       | Months                       |
| Database technology    | Months to years              |
| Cloud provider         | Years                        |
| Programming paradigm   | Years (and team turnover)    |

Spend deliberation proportionally. Don't agonize for weeks over button styling. Do agonize for weeks before committing to a new programming language.

### RFCs and ADRs

At larger companies, significant decisions are documented:

**RFC (Request for Comments):**
A written proposal describing a change, its motivation, alternatives considered, trade-offs, and implementation plan. Reviewed by peers and senior engineers before approval.

**ADR (Architecture Decision Record):**
A short record of an architectural decision — context, options, decision, consequences. Lives in the codebase so future engineers understand *why* things are the way they are.

Even solo developers benefit from writing brief ADRs. "I chose Postgres over MongoDB because..." — written down, you'll remember the reasoning a year later.

### The Modular Monolith Pattern

The dominant 2026 architectural recommendation for small-to-medium teams: build a **modular monolith**.

```
┌─────────────────────────────────────┐
│         Single deployment           │
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌───────┐ │
│ │  Users   │ │  Billing │ │ Orders│ │
│ │  module  │ │  module  │ │ module│ │
│ └──────────┘ └──────────┘ └───────┘ │
│                                     │
│      Shared infrastructure          │
│  (DB, cache, queue, observability)  │
└─────────────────────────────────────┘
```

Internally organized as if it were many services, but deployed as one. You get the simplicity of monolith operations with the structure of microservices. If you eventually need to split, the module boundaries become service boundaries.

The trap is going microservices too early — distributed systems are hard to debug, slow to develop in, and bring operational overhead most small teams can't justify.

### Common Architectural Patterns

- **Layered architecture:** Presentation → Application → Domain → Persistence.
- **Hexagonal / Ports & Adapters:** Business logic at the core, external systems (DB, HTTP, queues) as adapters.
- **Event-driven:** Components communicate via events; loose coupling, async.
- **CQRS (Command Query Responsibility Segregation):** Separate write and read models.
- **Event sourcing:** Store every state change as an event; current state derived by replay.

Most apps don't need these patterns explicitly. A good monolith with a clean module structure is sufficient for the vast majority of projects.

### Common Anti-Patterns

- **Resume-driven development:** Choosing tech because it looks good on a resume.
- **Hype-driven development:** Adopting tech because it's trending.
- **Cargo-cult architecture:** Copying patterns from Google/Netflix without their scale or team.
- **Architecture astronautics:** Multi-month design phases that ship nothing.
- **Big rewrites:** Throwing away working code to rebuild from scratch. Almost always disastrous.

---

## Phase 4: Environment Setup

**Goal:** Prepare the workshop before construction.

### What "Environment Setup" Covers

- Local development environment (runtimes, package managers, language toolchains)
- Editor configuration (extensions, settings, AI assistants)
- Version control (Git, GitHub, branch protection rules)
- Package management (lockfiles, dependency strategy)
- Secrets management (.env files, vaults, never-commit-secrets discipline)
- Linters and formatters (Biome, ESLint, Prettier)
- Pre-commit hooks (Husky, lefthook)
- Containerization (Docker for consistent environments)
- Database tooling (migrations, seed scripts, local DB instance)
- Monorepo tooling (Turborepo, Nx) if applicable
- Documentation (README, CONTRIBUTING)

### The "Works on My Machine" Problem

The classic developer joke: code that runs perfectly on the original author's laptop and nowhere else. Modern tooling has largely solved this:

- **Lockfiles** (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`) pin exact dependency versions.
- **Docker / Dev Containers** provide identical environments across machines.
- **Node version managers** (`nvm`, `fnm`, `volta`) ensure everyone uses the same runtime version.
- **Cloud development environments** (GitHub Codespaces, Gitpod) provide pre-configured environments on demand.

### Setting Up a Modern Project (Example)

A typical 2026 Next.js project setup:

```bash
# Install Bun (fastest JS runtime/package manager)
curl -fsSL https://bun.sh/install | bash

# Create the project
bunx create-next-app@latest my-app \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*"

cd my-app

# Add component library
bunx shadcn@latest init
bunx shadcn@latest add button card input form dialog

# Replace ESLint + Prettier with Biome
bun add -D @biomejs/biome
bunx biome init

# Add TypeScript strict mode (in tsconfig.json)
# "strict": true

# Add pre-commit hooks
bun add -D husky lint-staged
bunx husky init
echo "bunx lint-staged" > .husky/pre-commit

# Initialize git and push
git init
git add .
git commit -m "Initial commit"
gh repo create my-app --public --source=. --push
```

That's a complete modern setup in about 5 minutes.

### Editor Setup

**VS Code** (free) or **Cursor** (paid, AI-first fork of VS Code) dominate in 2026. Essential extensions:

- TypeScript and JavaScript Language Features (built-in)
- Tailwind CSS IntelliSense
- Biome (or ESLint + Prettier if using those)
- GitLens
- Error Lens
- Path Intellisense
- AI assistant (Cursor's built-in, GitHub Copilot, or Continue)

**JetBrains** tools (WebStorm, IntelliJ) are popular in enterprises and worth paying for if you spend 40+ hours a week coding.

### Secrets Management

Never commit secrets to git. Use:

- **`.env.local`** files for local dev (gitignored).
- **Vercel/Railway environment variables** for hosted secrets.
- **Doppler / 1Password / HashiCorp Vault** for team secret sync.
- **AWS Secrets Manager / Google Secret Manager** for cloud-native apps.

If you accidentally commit a secret: rotate it immediately. Removing it from git history doesn't help — it was scraped within minutes.

### Common Anti-Patterns

- **Skimping on setup:** Hours spent every week fighting your tools because you didn't invest in setup.
- **Snowflake environments:** Every developer's machine slightly different, debugging is impossible.
- **Committing `node_modules`:** Don't. (Yes, people still do this.)
- **Committing secrets:** Catastrophic; rotate immediately if you do.
- **No README:** Future you, in six months, will not remember how to run the project.

---

## Phase 5: Implementation

**Goal:** Write code that solves the problem.

### The Largest Phase

Implementation typically consumes 30–60% of total project time. It's where designs become reality, where you discover everything you forgot to consider.

### What Implementation Includes

**Frontend:**
- Components and UI primitives
- Layouts and routing
- State management
- Forms and validation
- API integration
- Animations and transitions
- Accessibility
- Internationalization (i18n)
- Responsive design
- Performance optimization (code splitting, lazy loading, image optimization)

**Backend:**
- Routes and endpoints
- Business logic
- Database queries and migrations
- Background jobs
- Third-party integrations
- Error handling and validation
- Security hardening (rate limiting, input sanitization, CSRF protection)
- Caching strategies

**Glue:**
- Configuration management
- Environment-specific behavior
- Logging
- Telemetry instrumentation

### Implementation Best Practices

**Vertical slices, not horizontal layers.**
Build one feature end-to-end (UI → API → DB) before starting the next. Don't build "all the UI first" — you won't discover backend issues until much later.

**Smallest possible change.**
Each commit should do one thing. Each PR should be reviewable in 15 minutes. Mega-PRs are unreviewable and risky.

**Make it work, then make it right, then make it fast.**
Optimization is the last step. Premature optimization wastes time and obscures intent.

**Read code more than you write.**
Existing code patterns matter. Match the codebase's style; don't force your preferences.

**Handle the unhappy path.**
Real users have slow connections, mistyped inputs, expired tokens, partial data. Every screen needs loading, error, and empty states.

**Write code for the next developer.**
That developer might be you, six months from now, who has forgotten everything.

### Pair Programming and AI Assistance

In 2026, AI-assisted coding is the norm:

- **Inline completions** (Copilot, Cursor's tab) speed up boilerplate.
- **Chat-based generation** (Cursor's compose, Claude Code) handles larger refactors.
- **Agentic coding** (Claude Code in autonomous mode, Devin) takes on multi-file tasks.

The skill is reviewing and editing AI output, not generating it. Senior developers benefit most because they can spot when AI-generated code is wrong.

### Common Anti-Patterns

- **Premature abstraction:** Building "flexibility" for use cases you may never have.
- **Copy-paste programming:** Three copies of similar code instead of one parameterized function.
- **God objects:** One class/file that does everything.
- **Magic numbers and strings:** Hardcoded values without explanation.
- **No error handling:** Crashes on the first unexpected input.
- **Ignoring warnings:** Linter warnings accumulate until they're useless.
- **Comments that lie:** Comments not updated when code changes; worse than no comments.
- **Big-bang refactors:** Rewriting half the codebase in one PR.

---

## Phase 6: Testing

**Goal:** Prove the code works and stays working.

### Why Test?

- **Catch bugs before users do.**
- **Enable refactoring.** Tests are scaffolding that lets you change code confidently.
- **Document behavior.** A good test explains what code is supposed to do.
- **Prevent regressions.** Bugs that come back are especially demoralizing.

### The Testing Pyramid

```
                    ▲
                   /│\
                  / │ \      E2E Tests (few)
                 /  │  \     - Slow, expensive
                /───┼───\    - Test full user flows
               /    │    \
              /─────┼─────\  Integration Tests (some)
             /      │      \ - Medium speed
            /───────┼───────\- Test pieces together
           /        │        \
          /─────────┼─────────\Unit Tests (many)
         /          │          \- Fast, cheap
        /───────────┴───────────\- Test individual functions
```

The shape matters. Many fast unit tests; some integration tests; few end-to-end tests. Inverting the pyramid (many slow E2E tests) makes CI take hours and tests flake constantly.

### Test Types

**Unit tests:**
Test individual functions or components in isolation. Mock external dependencies. Run in milliseconds.

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('formats USD with 2 decimals', () => {
    expect(formatPrice(1234.5, 'USD')).toBe('$1,234.50');
  });

  it('handles zero', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00');
  });
});
```

**Integration tests:**
Test how pieces work together. API endpoint + database. Component + state management.

```typescript
import { test, expect } from 'vitest';
import { app } from './app';

test('POST /users creates a user', async () => {
  const response = await app.request('/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'Tony', email: 'tony@example.com' }),
  });

  expect(response.status).toBe(201);
  const user = await response.json();
  expect(user.id).toBeDefined();
});
```

**End-to-end (E2E) tests:**
Drive a real browser through real user flows. Find bugs that span the full stack.

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up and create a project', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name=email]', 'tony@example.com');
  await page.fill('[name=password]', 'SecurePass123!');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('/dashboard');

  await page.click('text=New Project');
  await page.fill('[name=name]', 'My First Project');
  await page.click('text=Create');

  await expect(page.locator('h1')).toContainText('My First Project');
});
```

**Visual regression tests:**
Take screenshots; compare against baseline. Catches unintended visual changes.

**Performance tests:**
Measure response times under load. Tools: k6, Artillery, Gatling.

**Accessibility tests:**
Verify WCAG compliance. Tools: axe-core (browser plugin and Playwright integration), Lighthouse.

**Security tests:**
- **SAST** (Static Application Security Testing) — analyzes source code (Semgrep, CodeQL).
- **DAST** (Dynamic Application Security Testing) — probes running app (OWASP ZAP).
- **SCA** (Software Composition Analysis) — scans dependencies (Snyk, Dependabot).

### Test-Driven Development (TDD)

A discipline where you write the test first:

1. Write a failing test.
2. Write the minimum code to make it pass.
3. Refactor.
4. Repeat.

TDD enforces small, testable units and high coverage. It's valuable but not universally adopted; many great codebases are tested after the fact.

### Coverage Is Misleading

"100% test coverage" doesn't mean bug-free. You can have 100% coverage and still miss critical bugs:

```typescript
function divide(a: number, b: number): number {
  return a / b;
}

// Test: expect(divide(10, 2)).toBe(5);  // 100% coverage!
// But: divide(10, 0) returns Infinity, not an error.
```

Coverage is a *minimum* signal. The real question: do your tests cover the cases that would matter to users?

### Common Anti-Patterns

- **No tests:** "I'll add them later." (You won't.)
- **Only happy-path tests:** No tests for errors, edge cases, or invalid input.
- **Tests that test implementation, not behavior:** Refactoring breaks tests even when behavior is correct.
- **Flaky tests:** Sometimes pass, sometimes fail. Erode trust until everyone ignores CI.
- **Massive E2E test suites:** Slow CI, hard to debug, eventually abandoned.
- **Snapshot tests for everything:** Just commits the current output as "correct"; catches nothing meaningful.

### Tools in 2026

- **Vitest** — Dominant test runner for new JS/TS projects (replaces Jest).
- **Playwright** — Dominant E2E framework.
- **Testing Library** — Lightweight DOM testing.
- **MSW (Mock Service Worker)** — Mock API requests realistically.
- **k6** — Load testing.
- **Chromatic, Percy** — Visual regression.
- **Storybook** — Component development + interaction testing.

---

## Phase 7: Code Review

**Goal:** Get a second pair of eyes on every change before it merges.

### Why Code Review?

- **Catch bugs** that the author missed.
- **Spread knowledge** across the team.
- **Maintain consistency** in style and patterns.
- **Mentor junior engineers** through feedback.
- **Document decisions** (PR comments are durable).
- **Force the author to clarify their thinking** by explaining changes.

### The PR Workflow

1. Author creates a branch off `main`.
2. Author writes code, commits, pushes.
3. Author opens a **Pull Request** with a description.
4. CI runs automated checks.
5. Reviewers read the diff, leave comments.
6. Author addresses comments, pushes updates.
7. Reviewer approves.
8. PR merges into `main`.

### What Reviewers Look For

- **Correctness:** Does it actually do what it claims?
- **Design:** Is the approach reasonable? Are there better alternatives?
- **Tests:** Are critical cases covered?
- **Security:** Any obvious vulnerabilities? Input validation? Auth checks?
- **Performance:** Any O(n²) loops? Unnecessary network calls?
- **Readability:** Would another engineer understand this in 6 months?
- **Style:** Consistent with the codebase (linter usually catches this).
- **Edge cases:** Empty inputs, errors, null/undefined.

### Giving Good Reviews

- **Be kind.** The author is a person; the code is the artifact.
- **Explain the "why."** Not "use a map here" but "use a map here because [reason]."
- **Distinguish blocking from suggestion.** Use prefixes like `nit:` for minor style and `blocker:` for must-fix.
- **Don't bikeshed.** Hours arguing about variable names is a waste.
- **Approve quickly when possible.** Slow reviews are the #1 productivity killer.
- **Ask questions** instead of demanding changes. "Why this approach?" not "do it this other way."

### Receiving Reviews

- **Don't take feedback personally.** It's about the code, not you.
- **Push back when you disagree** — politely, with reasoning.
- **Ask for clarification** if a comment is unclear.
- **Thank reviewers.** They spent time on your work.

### Review Scale by Team Size

- **Solo:** Self-review. Read your own diff before merging. You'll catch surprising amounts.
- **Small team (2–10):** One reviewer, usually anyone on the team.
- **Mid-size (10–50):** One reviewer, with explicit code ownership for critical paths.
- **Large company:** Multiple reviewers, code owners required for sensitive areas, security review for auth/payments/data.

### Common Anti-Patterns

- **Rubber-stamp approvals:** Approving without reading. Erodes the entire purpose.
- **Massive PRs:** 2,000-line PRs that no one can meaningfully review.
- **Bikeshedding:** Endless arguments about trivial preferences.
- **Personal attacks:** "Why would you ever write this?" Toxic and counterproductive.
- **Slow reviews:** PRs sitting for days. Costs context, momentum, and morale.
- **Blocking on style nits:** Use a linter. Don't waste human time.

---

## Phase 8: CI/CD

**Goal:** Automate the path from "code committed" to "code in production."

:::note Beginner analogy: CI/CD is a factory assembly line
CI/CD acronyms scare new developers. They shouldn't. Two ideas:

- **CI (Continuous Integration)** — Every time someone commits code, an automated system pulls it, runs the tests, and reports back. The "integration" part means *combining* everyone's work and proving the combined result still works. Without CI, ten developers can break each other's code without realizing.
- **CD (Continuous Deployment / Delivery)** — Once CI passes, an automated system *deploys* the code to a server where users (or testers) can access it. The deploy happens without anyone manually copying files anywhere.

Together: a factory assembly line for code. Raw material (your commit) enters one end, finished product (a running deployment) comes out the other, automated quality checks happen in between.

In practice, this is a YAML file (like the one shown below) that lives in your repo. GitHub Actions, GitLab CI, and CircleCI are common providers. When you push a commit, they read that YAML and run the steps it lists.
:::

### CI (Continuous Integration)

Every commit runs a pipeline of automated checks. If anything fails, the change is blocked.

A typical CI pipeline:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint and format check
        run: bunx biome check .

      - name: Type check
        run: bunx tsc --noEmit

      - name: Unit tests
        run: bun run test

      - name: Build
        run: bun run build

      - name: Security audit
        run: bun audit
```

### CD (Continuous Deployment vs Continuous Delivery)

These terms get confused:

- **Continuous Delivery:** Every change is *deployable*. A human pushes the button to release.
- **Continuous Deployment:** Every change *is deployed* automatically after passing tests.

True continuous deployment requires high trust in your test suite. Many companies do continuous delivery (deploys are automated but gated) rather than full continuous deployment.

### Deployment Strategies

**Direct deployment:**
Replace the running version with the new one. Simple, fast, brief downtime possible.

**Blue/Green:**
Run two identical environments. Direct traffic from old (blue) to new (green) instantly. Easy rollback (switch traffic back).

**Canary:**
Deploy new version to a small percentage of users (say 1%). Monitor metrics. If healthy, gradually expand to 100%. If not, roll back.

**Feature flags:**
Code ships always, but new features are gated behind flags. Enable flags for specific users/segments. Easy to roll back (flip the flag).

**Rolling deployment:**
Replace instances one at a time. Standard in Kubernetes.

Modern deployments often combine these: canary deploys controlled by feature flags, monitored for SLO breaches with automated rollback.

### Branching Strategies

**Trunk-based development (2026 standard):**
- Everyone commits to `main` directly (or via short-lived branches that merge within hours).
- Incomplete features hidden behind feature flags.
- Continuous integration in the truest sense.

**GitHub Flow:**
- Branch from `main`, commit, PR, merge to `main`, deploy.
- Simpler than git-flow, popular for web apps.

**Git Flow** (declining):
- Multiple long-lived branches (`main`, `develop`, `feature/*`, `release/*`).
- Heavy for modern web apps; better for software with distinct releases (mobile apps, enterprise software).

### CI/CD Tools in 2026

- **GitHub Actions** — Dominant for most projects. Free for public repos, generous free tier for private.
- **GitLab CI** — All-in-one DevOps; popular when using GitLab.
- **CircleCI** — Strong for parallel testing.
- **Buildkite** — Hybrid (cloud control, your own compute); popular at scale.
- **Jenkins** — Legacy, still common in enterprises.
- **Argo CD / Flux** — GitOps for Kubernetes.
- **Vercel / Netlify / Cloudflare Pages** — Built-in CI/CD for their hosted apps.

### Common Anti-Patterns

- **Skipping tests in CI:** "Just merge it." The tests exist for a reason.
- **Long CI times:** A 30-minute CI loop kills productivity. Aim for under 10 minutes.
- **Flaky tests in CI:** Erodes trust until people retry until green.
- **No staging environment:** Deploy straight to prod with crossed fingers.
- **Manual deployment steps:** "First SSH in, then run this script..." Should be one button (or zero).

---

## Phase 9: Deployment & Hosting

**Goal:** Get your code running on the public internet, reliably.

This is covered briefly here and in depth in the workflow-specific files (04, 05, 06).

### Hosting Categories

**Edge platforms** (most popular for new web apps in 2026):
- Vercel, Cloudflare Pages, Netlify
- Pros: Deploy from Git, global CDN, serverless functions, free SSL, instant previews.
- Cons: Vendor lock-in (somewhat), edge runtime constraints, costs scale with traffic.

**App platforms (PaaS):**
- Railway, Render, Fly.io, Heroku
- Pros: Push code, they handle the infrastructure. Long-running processes welcome.
- Cons: Less global edge presence; usually pay for compute, not requests.

**Container platforms:**
- AWS ECS, Google Cloud Run, Azure Container Apps
- Pros: You provide a Docker image; they run it; scale-to-zero options.
- Cons: More setup than PaaS; less integrated DX.

**Kubernetes:**
- Self-managed or via EKS/GKE/AKS
- Pros: Full flexibility, dominant at scale, portable across clouds.
- Cons: Operational complexity; overkill for small teams.

**Raw cloud (VMs):**
- EC2, Compute Engine, DigitalOcean Droplets
- Pros: Maximum control.
- Cons: You manage everything. Rare for new projects.

### Environments

A typical setup:
- **Local** — Your laptop.
- **Preview** — Per-PR ephemeral deployments (Vercel does this automatically).
- **Staging** — Production-like environment for final testing.
- **Production** — The real thing.

Smaller projects often skip staging. Larger projects add more environments (dev, qa, perf, canary).

### Database Migrations

Schema changes are deployment hazards:

- **Backward-compatible migrations:** Add new columns/tables; old code keeps working.
- **Two-phase migrations:** Add new schema → migrate code to use it → drop old schema.
- **Reversible migrations:** Every migration has a `down` script for rollback.

Tools: Drizzle Kit, Prisma Migrate, Flyway, Liquibase.

### Common Anti-Patterns

- **Pushing to prod on Fridays:** If something breaks, you're working the weekend.
- **No rollback plan:** When (not if) deployment fails, what do you do?
- **No staging for big changes:** Direct-to-prod for risky changes.
- **Untested migrations:** Run on production data without testing on a copy first.

---

## Phase 10: Observability

**Goal:** Know what your software is doing in production, especially when it's misbehaving.

### The Three Pillars

**Logs:** Text records of events.
```
2026-05-20T14:23:11Z INFO  user.signup.success user_id=42 duration=187ms
2026-05-20T14:23:15Z ERROR payment.charge.failed user_id=42 reason=insufficient_funds
```

**Metrics:** Numerical measurements over time.
```
http.requests.count (per second)
http.requests.duration.p95 (95th percentile latency)
database.connections.active
queue.depth
```

**Traces:** Follow a single request through every service.
```
[Frontend] GET /checkout (240ms)
  ├── [API Gateway] (5ms)
  ├── [Auth Service] verify_token (12ms)
  ├── [Order Service] create_order (180ms)
  │   ├── [DB] INSERT INTO orders (45ms)
  │   ├── [Stripe API] charge (110ms)
  │   └── [Email Service] send_receipt (15ms)
  └── [Render] (38ms)
```

### Additional Layers

- **Error tracking:** Sentry catches exceptions, deduplicates, alerts.
- **Uptime monitoring:** External pings of your endpoints (Better Stack, Checkly, Pingdom).
- **Real user monitoring (RUM):** Measure actual users' performance (Vercel Analytics, Sentry, Datadog RUM).
- **Synthetic monitoring:** Automated test traffic from multiple regions.
- **Product analytics:** What are users actually doing? (PostHog, Mixpanel, Amplitude.)
- **Session replay:** Watch recordings of user sessions to debug (LogRocket, PostHog).
- **Feature flag analytics:** Which features are being used, by whom (PostHog, Statsig, LaunchDarkly).
- **AI/LLM observability:** Track prompts, costs, latency (Langfuse, Helicone, Braintrust).

### SLIs, SLOs, and SLAs

Mature teams quantify reliability:

- **SLI (Service Level Indicator):** What you measure (e.g., 99.5% of requests return 2xx within 200ms).
- **SLO (Service Level Objective):** Your internal target (e.g., 99.9% over 30 days).
- **SLA (Service Level Agreement):** Contractual promise to customers (typically less strict than SLO so you have margin).

**Error budget:** If your SLO is 99.9% and you've been at 99.85% this month, you've burned through the budget — pause feature work and improve reliability.

### Alerting

You want to know about problems before users complain. Modern alerting:

- **Alert on symptoms, not causes.** "Latency exceeded 500ms" tells you something is wrong; "CPU exceeded 80%" might be fine.
- **Alert on user impact.** If users aren't affected, it can wait.
- **Tunable thresholds.** Adjust as you learn what's actually broken.
- **Runbooks linked to alerts.** When pager goes off, on-call engineer needs to know what to do.
- **On-call rotations.** Tools: PagerDuty, Opsgenie, Incident.io, Better Stack.

### Observability in 2026

The standard practice: instrument with **OpenTelemetry** (vendor-neutral), send to whichever backend you prefer (Datadog, Honeycomb, Grafana, etc.). This avoids vendor lock-in.

Smaller projects: just Sentry + Better Stack + PostHog is often enough.

### Common Anti-Patterns

- **Logging everything:** Floods storage and makes finding signal impossible.
- **No alerting:** Discover problems via customer support tickets.
- **Alert fatigue:** So many false alerts that real ones get ignored.
- **Logs without context:** Can't tell which user, which request, which trace.
- **No correlation IDs:** Can't follow a request across services.

---

## Phase 11: Maintenance, Iteration, and Scaling

**Goal:** Keep the product working and improving over time. Usually the longest phase by far.

### Why Maintenance Matters

For most products, **80% of total engineering effort happens after launch.** The work includes:

- Bug fixes
- Customer support escalations
- Security patches
- Dependency updates
- Performance optimization
- New features
- Tech debt repayment
- Infrastructure scaling
- Documentation upkeep
- Refactoring
- Migrations to new tech
- Incident response and post-mortems
- Compliance and audit work

### Bug Triage

Bugs flow in from multiple sources: customer support, internal use, error tracking, monitoring alerts. A triage process:

1. **Severity:** Critical (production broken), High (major feature broken), Medium, Low.
2. **Reproducibility:** Can you reliably make it happen?
3. **Impact:** How many users? How frequent?
4. **Workaround:** Is there a way to mitigate while fixing?

High-severity bugs get fixed immediately. Lower-severity ones go into a backlog and are addressed by priority.

### Dependency Management

JavaScript projects often have 1,000+ transitive dependencies. Keeping them current is constant work:

- **Dependabot / Renovate** open PRs for outdated dependencies automatically.
- **Security advisories:** GitHub alerts on known vulnerabilities.
- **Lockfile audits:** `bun audit`, `npm audit`, `pnpm audit`.

The right cadence: weekly updates for most projects. Daily for security-sensitive ones.

### Scaling

When traffic grows, infrastructure must adapt:

**Vertical scaling:** Bigger machines. Simple, has limits, expensive at the high end.

**Horizontal scaling:** More machines. Requires the app to be stateless or use shared state (Redis, etc.).

**Database scaling:**
- **Read replicas** — Multiple read-only copies; reads scale linearly.
- **Connection pooling** (PgBouncer, Supavisor) — Handle thousands of clients with few DB connections.
- **Caching** (Redis) — Reduce DB load.
- **Sharding** — Split data across multiple DBs (very complex; last resort).

**Caching:**
- **CDN cache** — Static assets, sometimes HTML.
- **In-memory cache** (Redis) — Frequently accessed data.
- **Application cache** — In-process; fast but limited to one server.
- **HTTP caching** — `Cache-Control` headers; the most underused win.

**Async work:**
- Move slow operations off the request path (background jobs).
- Use queues (BullMQ, Trigger.dev, SQS) for reliability.

### Tech Debt

Every codebase accumulates debt — quick decisions that need revisiting, abstractions that no longer fit, libraries that fell out of fashion.

**Managing tech debt:**
- Track it explicitly (in your issue tracker, not just in heads).
- Allocate time (10–20% of capacity) to it every sprint.
- Tie payback to business value when possible ("this refactor unblocks feature X").
- Big rewrites are usually disasters; prefer incremental refactoring.

### Migrations

Inevitable at any company older than a few years:

- Moving to a new framework version
- Switching ORMs
- Changing databases
- Reorganizing a monolith into services (or services back into a monolith)
- Replacing a third-party service

Successful migrations:
- **Run old and new in parallel** (dual-writing during the transition).
- **Migrate gradually** (feature by feature, user by user).
- **Have a rollback plan** at every step.
- **Test against production data** copies.

### Incident Response

When things break in production:

1. **Acknowledge** — On-call engineer responds to the page.
2. **Triage** — How bad? How many users? Is it spreading?
3. **Mitigate** — Stop the bleeding (often rollback or feature flag off).
4. **Diagnose** — What's actually wrong?
5. **Fix** — Real fix, then deploy.
6. **Post-mortem** — Write up what happened, what we learned, what we'll change.

Post-mortems should be **blameless** — focus on systems and processes, not individuals. People make mistakes; resilient systems tolerate them.

### Common Anti-Patterns

- **Treating maintenance as second-class work.** Engineers want to build new things; without explicit incentives, maintenance gets neglected.
- **No on-call rotation.** Everything ends up on the most senior engineer's plate.
- **Big-bang migrations.** Trying to switch frameworks in one PR. Disaster.
- **Ignoring tech debt.** It compounds until you can't ship new features.
- **No post-mortems.** Same incidents recur.
- **Blame culture.** People hide mistakes; learning stops.

---

## Wrapping Up Part 2

The eleven phases — discovery, design, architecture, setup, implementation, testing, review, CI/CD, deployment, observability, maintenance — are present in every project. The scale of each phase varies dramatically, but the rhythm is universal.

Internalizing this lifecycle gives you a mental model for *any* project:
- "We're in implementation; testing comes next."
- "We're spending too long on planning; ship something and iterate."
- "We're missing observability; we need to fix that before scaling."

**Next:** Part 3 covers the actual tools — every major piece of the 2026 tech stack, explained in detail.
