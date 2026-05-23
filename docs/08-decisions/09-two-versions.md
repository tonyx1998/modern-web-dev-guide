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

## Common mistakes

:::caution[Where people commonly trip up]
- **Extracting on the first duplication.** The "rule of three" exists for a reason — two similar functions might genuinely be different concerns; three is when the shared concept becomes visible. Wait for the third instance before extracting, or you'll bake in the wrong abstraction and pay coupling cost forever.
- **Inheriting your way out of duplication.** A `BaseUser` class that both `ApiUser` and `DbUser` extend feels DRY but is usually the worst answer: you've coupled two unrelated lifecycles together. Prefer composition, generation, or explicit duplication over shared base classes that don't reflect a real "is-a" relationship.
- **Picking a canonical source and then editing the derived versions by hand.** Once you decide the DB schema is canonical, that means the TypeScript type and the Zod schema are *generated* — not hand-edited "just this once." Every manual edit to the derived version silently breaks the contract. Treat generated artifacts as read-only.
- **Calling something "DRY" when it's really just "less code."** Stuffing six conditionals into one function to avoid two slightly-different functions isn't DRY — it's *clever*. DRY is about a single source of truth for a concept, not minimizing line count. If your "deduplicated" version is harder to read, you've made things worse.
:::

## Page checkpoint

<Quiz id="decisions-two-versions-page" title="Did the two-versions rule stick?" sampleSize={2}>

<Question
  prompt="`formatUserName(user)` and `formatLegalName(person)` are byte-for-byte identical today. The chapter argues you should:"
  options={[
    { text: "Extract them into a shared helper immediately — that's what DRY demands" },
    { text: "Leave them separate — they answer different questions and will likely diverge (middle names, suffixes for legal)" },
    { text: "Add a flag parameter to a shared helper to handle both cases" },
    { text: "Inline the logic at every call site to avoid any abstraction" }
  ]}
  correct={1}
  explanation="Same code, different concepts. The chapter's rule: extract when the concept is the same, leave alone when only the code is. Legal names will need middle names and suffixes; user display names won't."
  revisit={{ to: "/docs/decisions/two-versions#approaches", label: "When duplication is two concerns" }}
/>

<Question
  prompt="You have a Postgres table, a TypeScript interface, and a Zod schema that all describe the same User shape. The chapter's WRONG answer is:"
  options={[
    { text: "Generate the TS type and Zod schema from the DB schema (Drizzle/Prisma)" },
    { text: "Generate the DB schema from a Zod source of truth" },
    { text: "Half-share them via inheritance or a shared base interface that doesn't reflect the real relationship" },
    { text: "Keep all three by hand, accepting the duplication" }
  ]}
  correct={2}
  explanation="The chapter calls out exactly this anti-pattern: partial sharing via inheritance gives you the cost of coupling without the benefit of one source of truth. The other three are all defensible designs."
  revisit={{ to: "/docs/decisions/two-versions#approaches", label: "Worked example: three shapes" }}
/>

<Question
  prompt="The chapter says duplication is a smell, but the fix isn't always extraction. What are the four valid responses it lists?"
  options={[
    { text: "Extract / pick a canonical source / generate one from the other / accept coincidental duplication" },
    { text: "Always extract / always inline / always abstract / always copy" },
    { text: "Ignore it / delete one / merge them / refactor the whole module" },
    { text: "File a ticket and forget about it" }
  ]}
  correct={0}
  explanation="The four approaches: classic extraction, canonical source (DB is truth), code generation (types from schemas), and accepting truly coincidental similarity as separate concerns."
  revisit={{ to: "/docs/decisions/two-versions#approaches", label: "Approaches" }}
/>

<Question
  prompt="How does the chapter distinguish 'real' duplication from accidental similarity?"
  options={[
    { text: "By line count — anything over 5 lines must be extracted" },
    { text: "Same concept expressed in multiple places = real; same syntax but different concerns = accidental" },
    { text: "Whichever the linter flags is real duplication" },
    { text: "Real duplication only exists across files, not within them" }
  ]}
  correct={1}
  explanation="The trick is conceptual, not syntactic. Two functions describing the same idea should be unified; two functions that just happen to read similarly today should usually stay separate because they'll diverge."
  revisit={{ to: "/docs/decisions/two-versions#approaches", label: "Real vs accidental duplication" }}
/>

</Quiz>

## What's next

→ Continue to [The Premature Optimization Principle](./premature-optimization) — make it work, then right, then fast.
