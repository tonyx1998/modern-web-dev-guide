---
id: testing
title: 'Testing: unit, integration, e2e, and everything between'
sidebar_position: 31
sidebar_label: Testing
description: The test pyramid in practice — unit, integration, e2e, contract, snapshot, property-based. What to mock and what not to. How to keep a test suite fast and trustworthy. The discipline that lets you ship without fear.
---

# Testing: unit, integration, e2e, and everything between

> **In one line:** Tests are the safety net that lets you change code without breaking everything else. The hard part isn't writing them — it's writing the *right ones at the right level*, keeping them fast, and trusting them when they pass.

:::tip[In plain English]
A unit test asks "does this one function do its job?" An integration test asks "do these pieces work together?" An end-to-end test asks "does the whole app do the user's job?" You need some of each, in roughly the right proportions, and you need them to be fast and deterministic. A team without tests is brave. A team with bad tests is exhausted — they spend hours chasing flakes for no real signal.
:::

**This page is self-contained.** Read it top to bottom and you can design a test suite, write unit/integration/e2e tests, avoid the common traps, and wire tests into CI. Links at the bottom are optional if you want senior strategy nuance or startup/enterprise specifics.

This page is the taxonomy plus the discipline — how to build a testing culture on any web project.

## The test pyramid

The canonical visualization, with rough proportions:

```
         /\         e2e
        /  \        ~5%  — slow, brittle, real browser
       /----\
      / int. \      integration
     /        \     ~25% — multiple components, real DB
    /----------\
   /   unit     \   unit
  /              \  ~70% — fast, isolated, many
 /----------------\
```

Why a pyramid:
- **Unit tests are cheap and fast** — milliseconds each, run hundreds per second. Many.
- **Integration tests are slower** — spin up a DB, hit an API. Few hundred at most.
- **E2E tests are slowest and most brittle** — full browser, network, real services. Tens at most.

The shape isn't dogma — it's a cost/value heuristic. A complex distributed system might need a higher integration ratio. A pure library might be 95% unit. The principle: **as you go up the pyramid, each test costs more and gives you less specific signal when it fails**.

The anti-pattern is the **ice cream cone**: lots of e2e tests, no unit tests. Slow, flaky, and when a test fails you don't know which line broke it.

**Senior refinement (included here — no other page required):** Kent C. Dodds' **testing trophy** argues that for web apps, **integration tests are the sweet spot** — they catch real bugs (route doesn't validate, query returns wrong shape) at a fraction of E2E fragility. Practical 2026 default: thick integration layer, units for genuinely tricky logic, thin E2E for two or three money paths (signup, checkout). And the rule that matters most: **test behavior, not implementation** — assert what callers/users observe; a good test fails only when behavior changes, not when you refactor internals.

:::info[Industry jargon — what you'll hear on the job]
| In plain English | What engineers call it |
|---|---|
| Code that checks your code | **Automated tests**; the whole collection is the **test suite** or **tests** |
| Tests all passing | **Green** — "CI is green", "the suite is green" |
| Tests failing | **Red** — "PR is red", "main is red" |
| Fast tests on one function | **Unit tests** (sometimes **pure tests** when there's no I/O) |
| Route + real database | **Integration tests** — in web teams often **API tests** or **service tests** |
| Full browser click-through | **E2E** (*end-to-end*), **browser tests**, **UI tests**; a tiny critical subset is **smoke tests** |
| Only the normal success case | The **happy path** — "we only tested the happy path" |
| Error/empty/boundary cases | **Unhappy path**, **edge cases**, **negative tests** |
| Test that catches a bug coming back | **Regression test** — write it **red then green** |
| Test that sometimes fails alone | A **flake** / **flaky test** — **quarantine** or **`@flaky`** while fixing |
| Fake Stripe/OpenAI in tests | **Mock** (or **stub** if it only returns canned data); umbrella term: **test double** |
| In-memory fake database | **Fake** or **test DB** — Testcontainers = **real DB in Docker for CI** |
| Too many browser tests, few unit tests | **Ice cream cone** (anti-pattern); healthy shape = **test pyramid** or **testing trophy** |
| Asserting internal method calls | Testing **implementation details** — opposite is **testing behavior** / **black-box testing** |
| `expect(x).toBe(y)` | An **assertion** — "the **assert** failed" |
| Run tests on every push | **CI** (*continuous integration*) — "the **pipeline**", "**checks**", "**GitHub Actions**" |
| Percent of lines executed | **Coverage** — "**line coverage**"; better signal: **mutation testing** |
| Saved output compared to last run | **Snapshot test** — sometimes **golden file** |
| Generate random inputs to find bugs | **Property-based** / **generative** tests — cousin of **fuzzing** |
| Consumer/provider API agreement tests | **Contract tests** — **Pact** is the common tool name |
| AI wrote tests that pass but test nothing | **Testing the mock** or **mirror testing** — tests that **re-assert the bug** |
:::

## The six test types you'll meet

### 1. Unit tests

> "Does this one function/class/module produce the right output for the inputs?"

On the job: **"unit tests"**, **"unit suite"**, or **"fast tests"** (when contrasted with slow integration/E2E).

```typescript
// math.ts
export function discountPrice(price: number, percent: number): number {
  if (percent < 0 || percent > 100) throw new Error('invalid percent');
  return price * (1 - percent / 100);
}

// math.test.ts
import { discountPrice } from './math';

test('discounts price by percent', () => {
  expect(discountPrice(100, 20)).toBe(80);
});

test('throws on invalid percent', () => {
  expect(() => discountPrice(100, 150)).toThrow('invalid percent');
});
```

Properties:
- **Isolated** — no DB, no network, no filesystem.
- **Fast** — milliseconds.
- **Deterministic** — same input always produces the same result. No `Math.random()`, no `Date.now()`, no `setTimeout`. Inject those as dependencies if you need them.

Tools: Jest, Vitest (the 2026 default for new TS projects, faster than Jest), Node's built-in `node:test`, Bun's `bun test`. Pytest for Python.

### 2. Integration tests

> "Do these components work together correctly?"

On the job: **integration tests**; web/backend teams often say **API tests**, **service tests**, or **"tests against the test DB"**.

Examples:
- API route handler + real Postgres (in Docker or in-memory).
- Service layer + cache + DB.
- Two microservices talking via HTTP.

```typescript
import { test, beforeAll, afterAll, expect } from 'vitest';
import { app } from './app';
import { db } from './db';

beforeAll(async () => { await db.migrate.latest(); });
afterAll(async () => { await db.destroy(); });

test('POST /api/orders creates an order', async () => {
  const res = await app.request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ items: [{ sku: 'A', qty: 2 }] }),
  });
  expect(res.status).toBe(201);
  const { id } = await res.json();
  const row = await db('orders').where({ id }).first();
  expect(row.total_cents).toBe(2000);
});
```

Properties:
- **Real dependencies** for the components under test. Real DB, real cache.
- **Mocked external services** (Stripe, OpenAI). You don't want CI calling real APIs.
- **Each test isolated** — typically wrap in a transaction that rolls back, or truncate tables between tests.

This is where most production bugs hide — wiring between components, schema mismatches, race conditions. Spend the most engineering effort here.

### 3. End-to-end (e2e) tests

> "Does the whole app, from browser click to DB write to browser update, work?"

On the job: **E2E**, **browser tests**, **UI tests**, **Playwright tests** (after the dominant tool). A small set on every deploy is the **smoke suite** — "did we break login/checkout?"

```typescript
// Playwright
import { test, expect } from '@playwright/test';

test('user signs up and sees dashboard', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, alice')).toBeVisible();
});
```

Tools: Playwright (the 2026 winner), Cypress, Selenium (legacy), WebdriverIO.

Properties:
- **Real browser** (headless Chromium/Firefox/WebKit).
- **Real backend** (test environment).
- **Slow** — seconds to minutes per test.
- **Flaky** — timing, network, environment differences cause non-deterministic failures.

Keep these for the **critical user paths**: signup, login, checkout, the one thing your product exists to do. Not for every form field validation.

### 4. Contract tests

> "Does my service's API match what its consumers expect?"

Two flavors:

**Provider-side contract**: your service has tests asserting its responses match a schema (JSON Schema, OpenAPI, GraphQL SDL).

**Consumer-driven contract** (Pact, Pactflow): consumers publish "expected request/response" contracts; the provider runs those contracts in CI. Breaking changes get caught before deployment.

Useful when:
- You own a service that several other teams depend on.
- You're decomposing a monolith into microservices and the boundaries are still settling.
- You want a faster signal than full integration tests across services.

Overkill for monoliths or solo projects.

### 5. Snapshot tests

> "Does this output match what it did last time? (And if not, do I approve the change?)"

```typescript
test('renders user card', () => {
  const html = renderUserCard({ name: 'Alice', plan: 'Pro' });
  expect(html).toMatchSnapshot();
});
```

First run: saves the output to a `__snapshots__/` file. Subsequent runs: diff against that snapshot.

Useful for:
- Component rendering (React component snapshot of the rendered tree).
- API response shapes.
- Generated config files.

Pitfalls:
- **Blindly accepted snapshots.** Devs run `--updateSnapshot` without reading the diff. The test now codifies the bug.
- **Huge snapshot files.** A 2000-line snapshot is unreadable; the test catches nothing real.
- **Brittle to formatting changes.** Reordering a key breaks the snapshot but not the behavior.

Use for small, meaningful outputs. Read the diffs before updating.

### 6. Property-based tests

> "For *all* inputs in this domain, does the function uphold this property?"

Instead of writing 10 example cases, you describe the *property* and let a library generate thousands of inputs.

```typescript
// fast-check (TypeScript)
import fc from 'fast-check';

test('discount then re-apply original price is identity, modulo rounding', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 0, max: 10_000 }),
      fc.float({ min: 0, max: 100 }),
      (price, percent) => {
        const discounted = discountPrice(price, percent);
        const restored = discounted / (1 - percent / 100);
        expect(Math.abs(restored - price)).toBeLessThan(0.01);
      },
    ),
  );
});
```

The library auto-generates inputs (including edge cases: 0, negative, very large, NaN), runs the property, and on failure **shrinks** the failing case to a minimal reproducer.

Brilliant for: parsers, serializers, math, anything with a clear invariant. Less useful for: UI, business logic that doesn't have a clean property.

Tools: fast-check (TS), Hypothesis (Python), QuickCheck (Haskell, the original).

## What to mock — and what not to

The single most contentious question in testing. Useful heuristics:

| Mock it | Don't mock it |
|---------|---------------|
| 3rd-party APIs (Stripe, OpenAI, SendGrid) | Your own code |
| Random / time / UUID generators | Your DB (use a real test DB) |
| The current user / auth context | Pure functions |
| Filesystem in unit tests | Filesystem in integration tests |
| Network in unit tests | Network in e2e tests |
| Expensive computations being unit-tested elsewhere | Cheap, pure utility functions |

The principle: **mock at the boundary of your trust**. You trust your own code; don't mock it. You don't trust Stripe to be up at midnight; mock it in unit and integration tests, hit it for real in a sparse staging-only smoke test.

The anti-pattern: **mocking everything** — your DB, your other classes, your config. The tests pass; production breaks because the *real wiring* was never exercised. This produces tests that test the mocks, not the code.

:::info[Highlight: tests that mock too much test the wrong thing]
A test that mocks the database, mocks the cache, mocks the auth layer, and verifies "the function calls these three mocks in this order" is testing the implementation, not the behavior. Refactor the implementation and the test breaks even though the behavior is unchanged. Real DBs in integration tests, real components wired together, mocks only at the trust boundary.
:::

## Fixtures, factories, and test data

Three options for "give me a user to test with":

| Pattern | What it looks like | When |
|---------|-------------------|------|
| **Fixture** | JSON file or SQL seed of pre-made data | Static, shared across many tests |
| **Factory** | `userFactory.build({ name: 'Alice' })` | Tests want minor variations |
| **Builder** | `new UserBuilder().withPlan('pro').build()` | Many optional params, readable test setup |

Factories (`@faker-js/faker`, `factory-bot`-style libraries) are the 2026 default. Each test creates exactly the data it needs, with realistic-looking defaults for the fields it doesn't care about. No hidden coupling to a shared fixture file.

```typescript
const user = await userFactory.create({ plan: 'pro' });
const order = await orderFactory.create({ userId: user.id, total: 100 });
```

## Determinism: the requirement that makes tests trustworthy

Flaky tests destroy trust. The team learns to re-run instead of investigate, and a real failure hides for weeks among the noise.

Sources of flake:

| Cause | Fix |
|-------|-----|
| Timing (`setTimeout`, `await sleep`) | Fake timers (`vi.useFakeTimers`), explicit `await` on actual conditions |
| `Date.now()` | Inject a clock; freeze time in tests |
| `Math.random()` / UUID | Inject a generator; seed with a fixed value |
| Test order dependence | Each test creates its own data; teardown cleanly |
| Shared mutable state | Avoid module-level state, or reset between tests |
| Real network | Mock 3rd parties; use a local DB |
| Race conditions in code | Fix the code — tests exposed a real bug |
| Browser timing in e2e | Use Playwright's auto-waiting (`expect(locator).toBeVisible()`) not `sleep` |

**Rule:** quarantine flakes in a "flaky" tag, fix them in a week, or delete them. A flaky test that "usually passes" is worse than no test. Teams say **"don't `@skip` it forever"** or **"flake quarantine"** — same idea: isolate until fixed.

## Speed: the tax that decides whether tests get run

If the full suite takes 20 minutes, devs run it once before push. Bugs slip in for 4 hours before CI catches them.

If the suite takes 30 seconds, devs run it on save. Bugs are caught in seconds.

Aggressive targets:
- **Unit suite**: complete in under 10 seconds locally.
- **Integration suite**: under 2 minutes.
- **e2e suite**: under 5 minutes in CI.

To get there:
- **Parallelize** — modern test runners shard automatically. Use it.
- **Isolate** — each test creates its own data; can run in any order.
- **Skip the slow stuff in watch mode** — `vitest --project unit` watches only the fast tests.
- **Cache** — Turborepo, Nx, GitHub Actions cache `node_modules` and test results.
- **Profile** — `vitest --reporter=verbose` or Jest's `--detectOpenHandles`. The longest test is often a forgotten `sleep(5000)`.

## Coverage: a number with a complicated relationship to quality

**Coverage** is the percentage of code executed by tests. Useful as a signal; useless as a target.

- Coverage of **90% with terrible assertions** says nothing.
- Coverage of **60% with tight assertions on the dangerous paths** says a lot.

The number gets gamed: a test that *runs* the code but doesn't assert anything raises coverage but tests nothing. CI shouldn't fail on "coverage dropped from 92 to 91"; it should fail on "you added a critical path without tests."

Useful patterns:
- **Mutation testing** (Stryker for JS, Mutmut for Python) — flip operators and conditions in your code; if the tests still pass, your tests are weak. Higher signal than line coverage.
- **Coverage on the *diff*** — new code in this PR has coverage > X%. Codecov supports this. Catches "this PR adds 200 untested lines" without forcing the whole codebase to a number.

## CI integration

The standard pipeline:

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
```

In order, fast-fail. Lint and typecheck before tests — they catch trivial stuff in seconds.

For larger repos: run unit + lint + typecheck on every PR, run integration nightly + on main, run e2e on a tagged "ready to deploy" branch. Each gate trades cost for coverage.

## Testing patterns by code shape

| Code shape | Test focus |
|------------|-----------|
| **Pure functions** | Unit tests, property-based for non-trivial math |
| **API route handlers** | Integration tests with real DB; one or two e2e for golden paths |
| **React components** | React Testing Library (testing user-visible behavior, not implementation), snapshot for stable outputs |
| **Background jobs** | Integration test the handler; assert side effects |
| **Database migrations** | Run forward + rollback; assert schema state |
| **CLI tools** | Run the binary in a subprocess; assert exit code + stdout |
| **AI features** | [Evals](../ai/ai-evals), not traditional tests — the output is non-deterministic |

## Testing AI-generated code

When Cursor or Copilot drafts a feature, tests are how you **verify** the output — same role as code review, but automated. The traps are specific:

| Trap | Fix |
|---|---|
| AI writes tests that re-assert the buggy code | **You** write the assertion — encode *intent* ("empty cart returns 400"), not "whatever the function returns today" |
| AI adds happy-path-only coverage | Ask for edge cases explicitly, or add them yourself: empty, null, max length, unauthorized |
| AI mocks everything | Same rule as always: mock at the trust boundary (Stripe, OpenAI); use a real test DB for your routes |
| Bug fixed without a regression test | **Every bug fix starts with a failing test** — red before the fix, green after; that's the highest-ROI test you'll write |

Workflow that works: AI scaffolds test file structure → you define the cases that matter → run the suite → fix code until green. Never merge AI-generated tests you didn't read — they often pass while testing nothing (`expect(true).toBe(true)` patterns, mocks of the subject under test — engineers call that **testing the mock** or **mirror testing**).

When the AI drafts application code *and* tests together, treat the tests as suspect until you've traced one failure manually. The test and the bug often share the same wrong assumption.

## Common mistakes

:::caution[Where people commonly trip up]
- **Testing the implementation, not the behavior.** A test that asserts "function X calls function Y" breaks the moment you refactor — even though behavior is unchanged. Test what the user (or caller) observes, not how it's done.
- **Mocking your own code.** If you can't test a function without mocking the rest of your codebase, the function is over-coupled. Fix the design, not the test.
- **One giant test that asserts ten things.** When it fails, the message is "boolean was false somewhere." Split into N small focused tests.
- **No isolation between tests.** Test A creates a user. Test B assumes that user exists. Run B alone, it fails. Each test should create its own data and clean up.
- **Snapshot-everything.** Snapshot tests on a 500-line HTML output get blindly approved every PR. The test catches nothing; it's noise in the diff. Snapshot small, meaningful outputs only.
- **No coverage on the dangerous parts.** Easy code (CRUD) has tests; the hard money-handling code has none. Tests should cluster around risk, not around what's easy to test.
- **Quarantining flakes forever.** A test moves to the "skip" list and stays there for a year. Either fix or delete within a week; orphan-skipped tests pretend to provide coverage they don't.
- **Running tests against shared services.** Two devs running their suite at the same time stomp on each other's database state. Each test environment gets its own DB (or each test gets its own transaction).
- **Trusting e2e for everything.** "We have 200 e2e tests, surely we're covered." They take 40 minutes, fail intermittently, and when one fails you have no idea which of the 50,000 lines they exercise actually broke. Push tests down the pyramid.
- **No tests for the unhappy path.** Every API endpoint has a "returns 200 with valid input" test; few have "returns 400 on invalid input" or "rolls back on partial failure." Bugs live in the unhappy paths.
:::

## Page checkpoint

<Quiz id="foundations-testing-page" title="Did testing taxonomy stick?" sampleSize={3}>

<Question
  prompt="Why is the 'ice cream cone' (many e2e tests, few unit tests) an anti-pattern?"
  options={[
    { text: "E2E tests are visually ugly" },
    { text: "E2E tests are slow, brittle, and give low-specific signal — when one fails, you don't know which of 50k lines broke. The pyramid (most tests at the unit level, fewer above) gives more signal for less time" },
    { text: "E2E tests don't catch real bugs" },
    { text: "Browsers don't support automation" }
  ]}
  correct={1}
  explanation="As you go up the pyramid, each test costs more (in time and flake) and gives you less specific signal. Many fast unit tests + some integration + a few e2e on golden paths is the standard for a reason."
  revisit={{ to: "/docs/foundations/testing#the-test-pyramid", label: "Why the pyramid shape" }}
/>

<Question
  prompt="A team mocks the database, the cache, and three other services in every test. Tests pass; production keeps breaking. What's the root cause?"
  options={[
    { text: "Not enough tests" },
    { text: "The mocks don't reflect the real wiring. The tests verify 'function calls these mocks in this order,' not 'the system produces the right outcome.' Real DB in integration tests, mocks only at the trust boundary (3rd-party APIs)" },
    { text: "Bad mocking library" },
    { text: "Tests should be run against production" }
  ]}
  correct={1}
  explanation="Mock at the trust boundary — 3rd parties, time, randomness. Your own code, your own DB: use the real thing. Tests that mock everything test the mocks, not the system."
  revisit={{ to: "/docs/foundations/testing#what-to-mock--and-what-not-to", label: "What to mock" }}
/>

<Question
  prompt="A test fails intermittently — passes ~9 times out of 10. Best response?"
  options={[
    { text: "Add `retry: 3` and move on" },
    { text: "Investigate immediately: timing, shared state, race in the actual code, or non-deterministic input. Either fix or quarantine + delete within a week; tolerated flakes destroy trust in the whole suite" },
    { text: "Delete the test" },
    { text: "Mark it as known-flaky in CI forever" }
  ]}
  correct={1}
  explanation="A flake is either a test bug (fix the test) or a real race condition (fix the code — the test caught a real bug). Tolerated flakes train the team to ignore failures, hiding real regressions in the noise."
  revisit={{ to: "/docs/foundations/testing#determinism-the-requirement-that-makes-tests-trustworthy", label: "Determinism + flakes" }}
/>

<Question
  prompt="Why isn't '92% line coverage' a useful release criterion on its own?"
  options={[
    { text: "92% is too high" },
    { text: "Coverage measures lines executed, not assertions made. A test that runs code without asserting anything raises coverage without testing. Better signals: mutation testing, coverage on the diff for new code, and clustering tests around risk" },
    { text: "Coverage tools are unreliable" },
    { text: "Tests don't need coverage" }
  ]}
  correct={1}
  explanation="Coverage gets gamed easily. Mutation testing (does the test fail when I flip an operator?) and diff-coverage (this PR's new code has tests) are higher-signal. Tight assertions on dangerous code beats high coverage of trivial code."
  revisit={{ to: "/docs/foundations/testing#coverage-a-number-with-a-complicated-relationship-to-quality", label: "Coverage as signal, not target" }}
/>

<Question
  prompt="Copilot adds 20 tests for a new API route. All pass, but the route still returns 500 on empty input. What went wrong?"
  options={[
    { text: "Need more tests — 20 isn't enough" },
    { text: "The AI likely tested the happy path only and/or re-asserted current behavior without encoding the missing edge case — add a failing test for empty input first, then fix" },
    { text: "Switch to Playwright instead of Vitest" },
    { text: "Tests can't catch this kind of bug" }
  ]}
  correct={1}
  explanation="AI-generated tests often mirror the code's assumptions, including its bugs. You define intent (empty input → 400); the test fails; then you fix. That's regression testing — the same discipline as debugging."
  revisit={{ to: "/docs/foundations/testing#testing-ai-generated-code", label: "Testing AI-generated code" }}
/>

</Quiz>

## Going deeper (optional)

Everything above is enough to ship with a trustworthy suite. If you want more:

- [Testing, Properly](/docs/roadmap/part-3-beyond/testing-deep) — trophy vs pyramid nuance, test doubles, TDD as design tool
- [Testing in the lifecycle](../lifecycle/testing) — where testing fits in the dev process (TDD, 80/20 starter suite)
- [Debugging methodology](./debugging) — when tests fail or flakes appear; hypothesis-driven investigation
- [AI Evals](../ai/ai-evals) — testing non-deterministic LLM features (different from unit tests)
- [SWE Interview Guide — testing fluency](https://swe-interview-guide.vercel.app/#/lesson/testing) — interview framing of the same pyramid

## What's next

→ Continue to [Debugging methodology](./debugging).
