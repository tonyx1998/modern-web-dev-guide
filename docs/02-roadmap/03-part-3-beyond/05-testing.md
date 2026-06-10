---
id: testing-deep
title: Testing, Properly
sidebar_position: 6
sidebar_label: Testing
description: The senior view of testing — the pyramid vs the trophy, testing behavior not implementation, what's actually worth testing, test doubles and the over-mocking trap, and why flaky tests are bugs.
---

# Testing, Properly

> **In one line:** Tests exist for exactly one reason — to let you *change* code without fear — so the skill isn't writing more tests or chasing 100% coverage, it's testing the right things at the right level so a green suite actually means "safe to ship."

**This page is self-contained for testing *strategy*.** It assumes you can write a Vitest or Playwright test (covered in [Testing (Foundations)](/docs/foundations/testing) if you need syntax) — but you do not need to read that page first to apply everything here. The judgment sections below stand alone.

You learned *how* to write a test early on. This is *what* to test, at *which* level, and *why* — the judgment that separates a suite people trust from one they ignore.

:::info[Optional context — same guide]
[Testing (Foundations)](/docs/foundations/testing) has the full taxonomy (unit/integration/e2e, tools, CI YAML). [Testing in the lifecycle](/docs/lifecycle/testing) places testing in Phase 7. This page is the senior *strategy* layer — read it when you want judgment, not syntax.
:::

## 1. The pyramid, the trophy, and what each level buys you

Tests trade off **speed/cost** against **confidence/realism**:

| Level | Speed | Confidence it gives | Cost to write & maintain |
|---|---|---|---|
| **Unit** | milliseconds | one function/module is correct | low |
| **Integration** | fast-ish | units work *together* (route + DB + validation) | medium — best value |
| **End-to-end (E2E)** | slow | the real user flow works in a real browser | high, and flakier |

The classic **testing pyramid** says "mostly unit, some integration, few E2E." The modern refinement — the **testing trophy** (Kent C. Dodds) — argues *integration tests are the sweet spot* for web apps: they catch the bugs that actually happen (a route that doesn't validate, a query that returns the wrong shape) at a fraction of E2E's fragility. The practical default in 2026: **a thick layer of integration tests, units for genuinely tricky logic, and a thin layer of E2E for your two or three critical money paths** (sign-up, checkout). Teams describe that shape as **"fat middle"** or **"integration-heavy"** — opposite of the **ice cream cone** (too many E2E, not enough unit/integration).

## 2. Test behavior, not implementation

The single most important rule. A test should verify *what the code does* (its observable behavior), not *how it does it* (its internal structure). The litmus test: **a good test only fails when behavior changes; a bad test also fails when you refactor.**

```ts
// BAD — couples the test to implementation details (internal method names, call counts).
// Refactor the internals without changing behavior → this test breaks for no reason.
expect(service._computeTotalInternal).toHaveBeenCalledTimes(2);

// GOOD — asserts the behavior a caller actually cares about.
const total = cart.checkout([{ price: 100 }, { price: 50 }]);
expect(total).toEqual({ subtotal: 150, tax: 15, total: 165 });
```

This is why testing through the *public interface* (the API route, the rendered component, the exported function) beats testing private internals: you're free to rewrite the inside, and the tests confirm you didn't break the outside. Tests that break on every refactor train the team to stop trusting — and then deleting — the suite.

## 3. What's actually worth testing

100% coverage is a vanity metric; it measures lines executed, not behaviors verified. Spend your testing budget where it pays:

- **Complex/branchy logic** — pricing, permissions, date math, state machines. High bug density, cheap to unit-test.
- **Edge cases & boundaries** — empty list, one item, max length, null, timezone rollover, concurrent access.
- **Every bug you fix** — write the failing test *first*, then fix it. This is the highest-ROI test you'll ever write: it documents the bug and guarantees it never returns (regression testing).
- **Critical user paths** — the flows where a break costs money or trust.

What's usually *not* worth testing: framework code (React already works), trivial getters/passthroughs, and "snapshot everything" tests that assert on giant blobs nobody reads (they fail constantly and get blindly updated, which is worse than no test).

## 4. Test doubles — and the over-mocking trap

A **test double** stands in for a real dependency — the umbrella term engineers use instead of saying "mock" for everything:

| Name | What it does | When people say it |
|---|---|---|
| **Stub** | Returns canned data, no behavior check | "Stub the API to return 404" |
| **Mock** | Returns data *and* asserts it was called correctly | "Mock the email service" (often overloaded — means any fake) |
| **Fake** | Working lightweight impl (in-memory DB) | "Use a fake repository" |
| **Spy** | Real object, but records calls | "Spy on `fetch`" |

You reach for doubles to control the *uncontrollable*: the network, the clock, randomness, third-party APIs.

```ts
// Control time so a "token expires in 60s" test is deterministic, not a coin flip.
vi.useFakeTimers();
vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
// ... advance time, assert expiry ...
```

:::caution[The over-mocking trap]
The seductive failure mode: mock so much that the test passes while production breaks. Engineers call that **over-mocking** or **testing in a vacuum** — the test verifies *your mocks return what you told them to*, not that the system works. The senior balance: **mock at the true boundaries** (external network, time, randomness, paid third-party APIs) and use **real (or in-memory/fake) implementations** for things you own — a real test database via Testcontainers beats a hand-mocked query layer that drifts from reality. A test that mocks the thing under test is **theater** (same idea as **testing the mock**).
:::

## 5. Flaky tests are bugs — treat them as P1

A **flaky** test passes and fails without the code changing. It is *worse than no test*, because it trains the team to re-run CI until green and to ignore failures — including real ones. The usual causes, all fixable:

- **Time** — tests that depend on `now()`, sleeps, or real timeouts. Fix: fake the clock; assert on conditions, not durations.
- **Order dependence / shared state** — test B passes only if test A ran first (leftover DB rows, a shared singleton). Fix: isolate state per test; reset between runs.
- **Async races** — asserting before an async update settles. Fix: `await`/`findBy*` the expected state instead of fixed waits.
- **Real network** — hitting a live service. Fix: stub it.

The rule: **a flaky test is a bug in the test (or the code's nondeterminism); quarantine it immediately and fix it, never "just re-run."** Nondeterminism you can't reproduce in a test is nondeterminism you can't debug in production — treat flakes with the same seriousness as [debugging methodology](/docs/foundations/debugging#intermittent--flaky) demands.

## 6. TDD as a design tool (even if you're not dogmatic)

Test-Driven Development — write the failing test, make it pass, refactor (red → green → refactor) — is divisive as a religion but valuable as a *design technique*. Writing the test first forces you to use your own API before it exists, which surfaces awkward signatures *before* you've built around them. You don't have to TDD everything; reach for it when designing a tricky module or fixing a bug (the bug repro is the failing test). The lasting insight: **hard-to-test code is usually badly-designed code** — if you can't test it without a dozen mocks, the units are too coupled.

## 7. AI-generated tests: verify intent, not volume

When an assistant "adds tests" to a PR, the risk isn't too few — it's **tests that lie**. Common failure modes:

- **Re-asserting the bug** — `expect(brokenFn()).toBe(brokenFn())` or happy-path-only coverage while the edge case that users hit is untested.
- **Testing the mock** — the subject is mocked; the test verifies the mock was called, not that the system works.
- **Implementation coupling** — asserts on private methods or internal call order; breaks on every refactor.

Senior discipline: AI scaffolds structure; **you** write the assertions that encode business intent. Every bug fix starts red (failing test reproducing the bug) then green. If you wouldn't trust an AI's code without reading the diff, don't trust its tests without reading the assertions.

## Why this matters for you

A test suite is what lets you move fast *later*. Early on, manual testing ("does it work when I click it?") is fine. But the moment a project has real users and you're afraid to refactor because you might break something invisible, you've hit the wall a good suite removes. Tests are how velocity *survives* a growing codebase — they're the reversibility principle made executable: small changes you can undo because tests tell you what broke.

## First step

Take your most recent bug. Write a test that *fails* because of it (reproducing the bug), then fix the code until the test passes. You now have: a documented bug, a permanent guard against its return, and a concrete feel for "test the behavior." Do this for every bug from now on.

## Common mistakes

:::caution[Where people commonly trip up]
- **Chasing a coverage number.** 100% coverage tests every line, not every *behavior*, and rewards testing trivial code. Test the risky, branchy, money-path code; ignore the percentage.
- **Testing implementation details.** Tests that assert on internal methods/structure break on every refactor and erode trust. Test observable behavior through the public interface.
- **Over-mocking.** Mock the real boundaries (network, time, randomness); use real/in-memory implementations for what you own. A test that mocks everything verifies a fiction.
- **Tolerating flaky tests.** "Just re-run CI" trains the team to ignore failures. A flaky test is a P1 bug — quarantine and fix it.
- **Snapshot-testing everything.** Giant snapshots fail constantly and get rubber-stamped, which is worse than no test. Snapshot small, stable, meaningful output only.
- **Only writing E2E tests ("they're the most realistic").** They're also slow and flaky; a thousand E2E tests is a CI nightmare. Push logic down to fast integration/unit tests; reserve E2E for critical flows.
:::

## Page checkpoint

<Quiz id="testing-deep-page" title="Did testing strategy stick?" sampleSize={3}>

<Question
  prompt="What does it mean to 'test behavior, not implementation,' and why does it matter?"
  options={[
    { text: "Test the UI instead of the backend" },
    { text: "Assert on what the code observably does through its public interface, not on its internal structure — so tests fail only when behavior changes, not when you harmlessly refactor" },
    { text: "Only write end-to-end tests" },
    { text: "Test private methods directly for maximum coverage" }
  ]}
  correct={1}
  explanation="A good test verifies observable behavior via the public interface, so you can rewrite internals freely and the test confirms you didn't break the contract. Tests coupled to implementation break on every refactor, which trains the team to distrust and ignore the suite."
  revisit={{ to: "/docs/roadmap/part-3-beyond/testing-deep#2-test-behavior-not-implementation", label: "Test behavior, not implementation" }}
/>

<Question
  prompt="A test mocks the database, the HTTP client, and the downstream service, and it passes — but production is broken. What went wrong?"
  options={[
    { text: "Not enough mocks — mock the filesystem too" },
    { text: "Over-mocking — the test now only verifies that the mocks return what they were told to, not that the real system works; mock true boundaries (network/time/randomness) and use real/in-memory implementations for what you own" },
    { text: "The test should have been an E2E test instead" },
    { text: "Mocks always cause this; never use them" }
  ]}
  correct={1}
  explanation="Mocking everything makes the test assert about a fictional world. The senior balance is mocking only the genuine boundaries (external network, clock, randomness, paid APIs) while exercising real or in-memory versions of code you own — e.g. a real test DB via Testcontainers."
  revisit={{ to: "/docs/roadmap/part-3-beyond/testing-deep#4-test-doubles--and-the-over-mocking-trap", label: "The over-mocking trap" }}
/>

<Question
  prompt="A test in CI passes about 90% of the time with no code changes. What's the correct stance?"
  options={[
    { text: "Re-run CI until it's green; it's not a real failure" },
    { text: "Treat the flaky test as a P1 bug — it trains the team to ignore failures (including real ones); find the nondeterminism (time, shared state, async race, real network) and fix it or quarantine it now" },
    { text: "Delete it; flaky tests don't matter" },
    { text: "Add a longer sleep before the assertion" }
  ]}
  correct={1}
  explanation="Flaky tests are worse than no tests because they erode trust in the whole suite and normalize ignoring red. They're caused by fixable nondeterminism — fake the clock, isolate per-test state, await conditions instead of sleeping, stub the network — and should be fixed or quarantined immediately, never 'just re-run.'"
  revisit={{ to: "/docs/roadmap/part-3-beyond/testing-deep#5-flaky-tests-are-bugs--treat-them-as-p1", label: "Flaky tests are bugs" }}
/>

</Quiz>

## Going deeper (optional)

This page is complete for testing *judgment*. Optional next steps:

- [Testing (Foundations)](/docs/foundations/testing) — syntax, tools, CI pipeline, full type taxonomy
- [Testing in the lifecycle](/docs/lifecycle/testing) — Phase 7 workflow, 80/20 starter suite
- [Debugging methodology](/docs/foundations/debugging) — when tests fail or flake
- [Chaos engineering](/docs/operations/chaos-engineering) — production nondeterminism beyond the test suite
- External: [Testing Library guiding principles](https://testing-library.com/docs/guiding-principles/), Kent C. Dodds' [Testing JavaScript](https://testingjavascript.com/), *Working Effectively with Legacy Code* (Feathers)

---

→ Next: [Git Beyond the Basics](./git-advanced) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
