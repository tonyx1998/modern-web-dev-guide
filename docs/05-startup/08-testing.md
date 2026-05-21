---
id: testing
title: 'Phase 6: Testing Strategy'
sidebar_position: 9
sidebar_label: 8. Testing
description: Vitest for unit and integration tests, Playwright for ~10–30 critical E2E flows, manual QA on top. No formal coverage target — test what would break the business.
---

# Phase 6: Testing Strategy

> **In one line:** Hundreds of Vitest unit tests, dozens of integration tests, a handful of Playwright E2E tests on the critical flows, and manual QA for the rest. Test what would break the business if it failed.

:::tip In plain English
The cliché "test pyramid" is real — lots of cheap unit tests, fewer mid-sized integration tests, very few expensive E2E tests. The mistake startups make isn't picking the wrong tools (Vitest and Playwright are basically standard); it's either skipping tests entirely or chasing a 90% coverage target that produces a thousand brittle tests nobody trusts.
:::

## The testing pyramid

A pragmatic testing pyramid:

```
              ▲
             /│\
            / │ \
           /  │  \      Playwright E2E (10–30 critical paths)
          /───┼───\
         /    │    \
        /─────┼─────\   Vitest integration (50–200)
       /      │      \
      /───────┼───────\
     /        │        \
    /─────────┼─────────\Vitest unit (hundreds to thousands)
```

## Unit tests (Vitest)

- Pure business logic.
- Validation functions.
- Utility functions.
- Component rendering for shared UI library.

```typescript
import { describe, it, expect } from 'vitest';
import { calculateInvoiceTotal } from './invoice';

describe('calculateInvoiceTotal', () => {
  it('applies tax to subtotal', () => {
    const result = calculateInvoiceTotal({
      items: [{ price: 100, quantity: 2 }],
      taxRate: 0.08,
    });
    expect(result).toEqual({ subtotal: 200, tax: 16, total: 216 });
  });

  it('handles empty items', () => {
    const result = calculateInvoiceTotal({ items: [], taxRate: 0.08 });
    expect(result).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });
});
```

## Integration tests

- API endpoint + database.
- Server Actions with real DB.
- Webhook handlers.

Run against a test database (often a Neon branch per CI run, or a Docker Postgres).

## E2E tests (Playwright)

- Critical user flows ONLY: sign-up, sign-in, checkout, main feature path.
- 10–30 tests total, not hundreds.
- Run on CI; some teams run a subset on every push, full suite nightly.

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up and complete checkout', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name=email]', `test+${Date.now()}@example.com`);
  await page.fill('[name=password]', 'SecurePass123!');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');

  await page.click('text=Upgrade');
  await page.click('text=Start subscription');
  // Stripe test mode auto-fills card
  await page.frameLocator('iframe[name^="__privateStripeFrame"]')
    .locator('[name=cardnumber]').fill('4242 4242 4242 4242');
  // ... rest of checkout
  await page.click('text=Subscribe');
  await expect(page.locator('text=Subscription active')).toBeVisible();
});
```

## Manual QA

- The PM or designer clicks through new features before merge.
- For larger changes, a "QA day" before release.
- No dedicated QA team yet at this scale.

## Coverage targets

- No formal target (e.g., not "80% coverage required").
- Focus on testing what would break the business if it failed.
- Critical paths (payment, auth, data integrity) should have multiple test layers.

:::note Worked example: which tests to write for a new feature
You're adding bulk export. What gets tested at each layer?

- **Unit (Vitest):** The CSV-formatting function (input rows → string). Edge cases: empty list, special characters that need escaping, null fields. Five tests.
- **Integration:** The Server Action that fetches rows, calls the formatter, uploads to R2, returns a signed URL. Two tests: happy path, and "user has no rows."
- **E2E (Playwright):** *Skip.* This isn't a critical path. If the export breaks in production, users are inconvenienced but the business survives. Sentry will catch errors.

The discipline: don't reach for E2E by default. Most features don't earn one.
:::

:::info Highlight: coverage isn't the goal
A team chasing 90% coverage will write tests for trivial getters, throwaway components, and edge cases nobody will hit. The result: a thousand tests, a slow CI, and a false sense of security.

The actual goal is: *would I sleep through the night with the current test suite?* That depends on the critical paths — payments work, auth works, data isn't lost. Test those exhaustively. Test most other code lightly. Skip the rest.
:::

## What's next

→ Continue to [Phase 7: CI/CD](./cicd) where GitHub Actions ties the testing strategy to the deploy pipeline.
