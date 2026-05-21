---
id: two-versions
title: The "Two Versions of the Same Code" Principle
sidebar_position: 10
sidebar_label: 9. Two Versions of Code
description: If you find yourself with duplicate logic, ask — which one is canonical?
---

# The "Two Versions of the Same Code" Principle

> **In one line:** If you find yourself with duplicate logic, ask: *which one is canonical?* — and treat the others as views, generations, or genuinely separate concerns.

:::tip[In plain English]
"Don't Repeat Yourself" is good advice taken too far. Duplication is a smell, but the fix isn't always extraction. Sometimes the right answer is identifying which version is the *real* one and treating others as views; sometimes the duplication is accidental and extracting it creates artificial coupling. The trick is telling the difference.
:::

Duplication is a smell. But the fix isn't always extraction — sometimes the right answer is identifying which version is the "real" one and treating others as views.

## Approaches

1. **Extract common code.** Classic refactor: put shared logic in a function/class.
2. **Pick a canonical source.** Database is the source of truth; everything else derives from it.
3. **Generate one from the other.** Types generated from schemas, clients from OpenAPI.
4. **Accept the duplication if it's coincidental.** Sometimes two pieces of code look similar but represent different concerns. Extracting them creates artificial coupling.

The trick is distinguishing real duplication (same concept, multiple expressions) from accidental similarity.

:::note[Worked example: schema, type, validator]
A backend has three nearly-identical shapes:

1. A Postgres table definition (`users`).
2. A TypeScript `User` interface used throughout the app.
3. A Zod schema used for validating incoming requests.

Each is ~10 lines. Look the same. Reach for DRY?

Three reasonable strategies:

- **Generate types from the DB schema** (e.g., Drizzle or Prisma). The DB is canonical; the TS type and the Zod schema are derived.
- **Generate the DB schema from Zod** (drizzle-zod, valibot-postgres). The Zod schema is canonical.
- **Keep all three by hand** and accept the duplication, on the theory that they may diverge (e.g., the API contract differs from the storage shape).

All three are defensible. The wrong answer is to half-share them via inheritance or a shared base interface that doesn't reflect the real relationship — that gives you the cost of coupling without the benefit of one source of truth.
:::

:::info[Highlight: when "duplication" is actually two different concerns]
Two functions that *look* the same but are answering different questions should usually stay separate. A classic example:

```ts
function formatUserName(user) { return `${user.first} ${user.last}`; }
function formatLegalName(person) { return `${person.first} ${person.last}`; }
```

These are byte-for-byte identical today. Extracting a `formatFullName` helper feels obvious — but `formatLegalName` later needs middle names and suffixes for compliance reasons, while `formatUserName` stays as-is. The "shared" helper then either acquires a flag (bad) or diverges anyway.

Extract duplication when the *concept* is the same. Leave it alone when only the *code* is.
:::

## What's next

→ Continue to [The Premature Optimization Principle](./premature-optimization) — make it work, then right, then fast.
