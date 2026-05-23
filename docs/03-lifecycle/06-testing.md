---
id: testing
title: 'Phase 6: Testing'
sidebar_position: 7
sidebar_label: 6. Testing
description: Prove the code works and stays working. The testing pyramid, the types of tests, and why 100% coverage is a misleading goal.
---

# Phase 6: Testing

> **In one line:** Tests prove your code works, document what it's supposed to do, and let you refactor without fear. Without them, every change is a gamble.

:::tip[In plain English]
Testing is the practice of writing code that *checks your code*. You write a function that adds two numbers. You write a test that calls it with `2, 3` and expects `5`. The test runs automatically every time you save or push. If you ever break the function, the test fails and tells you. Multiply that by a few hundred tests and you have a safety net that lets you change code confidently.
:::

## Why test?

- **Catch bugs before users do.**
- **Enable refactoring.** Tests are scaffolding that lets you change code confidently.
- **Document behavior.** A good test explains what code is supposed to do.
- **Prevent regressions.** Bugs that come back are especially demoralizing.

## The testing pyramid

```mermaid
flowchart TB
    E2E["E2E tests<br/>(few)<br/>slow, expensive<br/>test full user flows"]
    Int["Integration tests<br/>(some)<br/>medium speed<br/>test pieces together"]
    Unit["Unit tests<br/>(many)<br/>fast, cheap<br/>test individual functions"]
    E2E --- Int
    Int --- Unit
    style E2E fill:#f96
    style Int fill:#fc6
    style Unit fill:#6c9
```

> **Reading this diagram:** Stacked top-down because the *shape* is the point — narrow at the top (few slow E2E tests, in orange/red), wide at the bottom (many fast unit tests, in green). Inverting the pyramid (many slow E2E tests) makes CI take hours and tests flake constantly.

## Test types in depth

### Unit tests

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

> **In English:** Each `it(...)` block is one test case. `describe` groups related tests under one heading. `expect(x).toBe(y)` is an **assertion** — if `x` doesn't equal `y` at runtime, the test fails. No mocks here because `formatPrice` is pure (no DB, no network).

### Integration tests

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

> **In English:** Fire a real HTTP `POST /users` at the in-process app, then assert it responded with **201 Created** (the standard HTTP status for "resource created") and that the response body has an `id`. No browser, no real network — but the app's routing, validation, and DB writes all execute. That's what makes it an *integration* test rather than a unit test.

### End-to-end (E2E) tests

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

> **In English:** Playwright launches a real headless Chrome, navigates to `/signup`, types into form inputs, clicks Submit, then *asserts* the user landed on `/dashboard`. Then it creates a project and checks the page heading. Each `await` is a real browser action; the test reads almost like an English script of what a user would do.

### Other test types

- **Visual regression tests** — Take screenshots; compare against baseline. Catches unintended visual changes.
- **Performance tests** — Measure response times under load (k6, Artillery, Gatling).
- **Accessibility tests** — Verify WCAG compliance (axe-core).
- **Security tests** — SAST (Semgrep, CodeQL), DAST (OWASP ZAP), SCA (Snyk, Dependabot).

## Test-Driven Development (TDD)

A discipline where you write the test first:

1. Write a failing test.
2. Write the minimum code to make it pass.
3. Refactor.
4. Repeat.

TDD enforces small, testable units and high coverage. It's valuable but not universally adopted; many great codebases are tested after the fact.

## Coverage is misleading

"100% test coverage" doesn't mean bug-free. You can have 100% coverage and still miss critical bugs:

```typescript
function divide(a: number, b: number): number {
  return a / b;
}

// Test: expect(divide(10, 2)).toBe(5);  // 100% coverage!
// But: divide(10, 0) returns Infinity, not an error.
```

Coverage is a *minimum* signal. The real question: do your tests cover the cases that would matter to users?

:::info[Highlight: the 80/20 rule for beginner test suites]
For a beginner project, you don't need a perfect test pyramid. You need *some* tests for the parts that matter:

1. **One E2E test for your most important user flow** (signup → core action).
2. **Unit tests for any function with complex logic** (calculations, parsers, validators).
3. **No tests for trivial code** (a function that just calls another function).

This gives you ~20% of the testing effort for ~80% of the value. As your project grows, you can fill in the rest.
:::

## Common anti-patterns

- **No tests:** "I'll add them later." (You won't.)
- **Only happy-path tests:** No tests for errors, edge cases, or invalid input.
- **Tests that test implementation, not behavior:** Refactoring breaks tests even when behavior is correct.
- **Flaky tests:** Sometimes pass, sometimes fail. Erode trust until everyone ignores CI.
- **Massive E2E test suites:** Slow CI, hard to debug, eventually abandoned.
- **Snapshot tests for everything:** Just commits the current output as "correct"; catches nothing meaningful.

## Tools in 2026

| Tool                  | What it's for                                         |
|----------------------|-------------------------------------------------------|
| **Vitest**           | Dominant test runner for new JS/TS projects (replaces Jest). |
| **Playwright**       | Dominant E2E framework.                                |
| **Testing Library**  | Lightweight DOM testing.                                |
| **MSW**              | Mock API requests realistically.                       |
| **k6**               | Load testing.                                          |
| **Chromatic / Percy**| Visual regression.                                     |
| **Storybook**        | Component development + interaction testing.           |

## Common mistakes

:::caution[Where people commonly trip up]
- **Testing the implementation, not the behavior.** Asserting that a component calls `useState` three times means the test breaks the day you refactor it. Test what the user (or caller) sees — rendered text, returned values, network requests made — so refactors stay free.
- **Stuffing every test into the E2E layer.** Playwright tests are tempting because they "test the real thing," but they're slow, flaky, and brutal to debug. Push logic down into unit/integration tests where each failure points to one file, not to "checkout flow broken somewhere."
- **Mocking the thing under test.** If your test mocks the function it's supposed to verify, it's testing the mock. Mock the dependencies *around* your subject (DB, HTTP, time, random), then let the real code run.
- **Snapshot-testing everything.** Snapshots default to `toMatchSnapshot()` recording whatever output you produced — including bugs — and then asserting "stay this way." A snapshot only tests what its reviewer thought about; for most components, an explicit `expect(...)` is better.
- **Asking AI to "add tests" to a file.** It will obediently add tests that re-assert what the code does, including its bugs. Tests have to encode *intent*, which the AI doesn't know. Use it for boilerplate scaffolding; write the assertions yourself.
:::

## Page checkpoint

<Quiz id="lifecycle-testing-page" title="Did testing stick?" sampleSize={2}>

<Question
  prompt="What's the shape of the testing pyramid the page recommends?"
  options={[
    { text: "Many E2E tests on top, few unit tests at the bottom" },
    { text: "Many fast unit tests at the bottom, few slow E2E tests on top" },
    { text: "Equal numbers of unit, integration, and E2E tests" },
    { text: "Only integration tests — they're a balance of both" }
  ]}
  correct={1}
  explanation="Unit tests are fast and cheap, so you write lots. E2E tests are slow and flaky, so you write a few high-value ones. Inverting the shape makes CI take hours and tests flake constantly."
  revisit={{ to: "/docs/lifecycle/testing#the-testing-pyramid", label: "The testing pyramid" }}
/>

<Question
  prompt="A function has 100% line coverage. The page argues you can still ship serious bugs. Why?"
  options={[
    { text: "Coverage tools always undercount" },
    { text: "Coverage only measures whether lines executed, not whether the cases that matter to users were tested" },
    { text: "100% coverage actually means there are no tests" },
    { text: "Coverage doesn't account for HTML and CSS" }
  ]}
  correct={1}
  explanation="The page's example: `divide(10, 2)` gets you 100% coverage but never tries `divide(10, 0)`. Coverage is a minimum signal — the real question is whether the cases users care about are tested."
  revisit={{ to: "/docs/lifecycle/testing#coverage-is-misleading", label: "Coverage is misleading" }}
/>

<Question
  prompt="The page recommends an 80/20 starter test suite for a beginner project. Which combination matches?"
  options={[
    { text: "Snapshot tests for every component, no unit tests" },
    { text: "One E2E test for the critical user flow, unit tests for functions with complex logic, skip the trivial code" },
    { text: "Aim for 100% line coverage before shipping anything" },
    { text: "Only manual QA — automated tests slow teams down" }
  ]}
  correct={1}
  explanation="One end-to-end test on the most important user flow plus targeted unit tests on the tricky logic gives roughly 20% of the effort for 80% of the value."
  revisit={{ to: "/docs/lifecycle/testing#coverage-is-misleading", label: "80/20 rule for beginner test suites" }}
/>

<Question
  prompt="Which of these is flagged as a testing anti-pattern?"
  options={[
    { text: "Writing tests that describe behavior" },
    { text: "Allowing flaky tests to stay in CI — sometimes pass, sometimes fail" },
    { text: "Mocking external dependencies in unit tests" },
    { text: "Using Vitest for new projects" }
  ]}
  correct={1}
  explanation="Flaky tests erode trust in the whole test suite. Once people start retrying CI 'until it goes green,' the safety net is gone."
  revisit={{ to: "/docs/lifecycle/testing#common-anti-patterns", label: "Testing anti-patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 7: Code Review](./code-review) where we add a second pair of human eyes to catch what tests miss.
