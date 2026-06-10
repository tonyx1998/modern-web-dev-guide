---
id: typescript-advanced
title: Advanced TypeScript
sidebar_position: 2
sidebar_label: Advanced TypeScript
description: The type-level TypeScript that Stage 5 deferred — narrowing, discriminated unions, generics, conditional/mapped/template-literal types, satisfies, branded types, declaration files, and tsconfig strictness. How to make illegal states unrepresentable.
---

# Advanced TypeScript

> **In one line:** Beyond "JavaScript with annotations," TypeScript's type system is a small programming language of its own — and using it well (discriminated unions, generics, conditional/mapped types, `satisfies`, branded types) lets you *make illegal states unrepresentable*, so whole categories of bugs become compile errors instead of 3am incidents.

:::note[Level: advanced — read after Stage 5]
This page assumes you've done [Stage 5 — TypeScript](/docs/roadmap/part-1-from-zero/stage-5-typescript) and shipped a project or two with it. It's the "competent → expert" step: the type-level features that make libraries pleasant, refactors fearless, and bugs impossible to express. If you're brand new, bookmark this and come back — you won't need any of it to build your first apps, and reaching for it too early is its own anti-pattern (covered at the end).
:::

← New here? Start with the on-ramp: [Languages](/docs/stack/languages).

:::tip[In plain English]
Most people use TypeScript at about 20% of its power — they annotate variables and move on. The other 80% is *describing the rules of your domain so precisely that wrong code won't compile*. If an order can be `pending`, `paid`, or `shipped`, and a shipped order *always* has a tracking number while a pending one *never* does, you can encode that so the compiler rejects "a pending order with a tracking number" — you literally cannot write the bug. That's the mindset shift: stop thinking of types as labels, start thinking of them as a *machine-checked specification* of what's allowed. This page is the toolkit for doing that, plus the judgment to know when clever types help and when they just make your teammates cry.
:::

:::info[Jargon for this chapter]
- **Structural typing** — TS compares types by *shape*, not by name. If it has the right fields, it fits.
- **Narrowing** — the compiler shrinking a broad type to a specific one based on checks you wrote (`if (typeof x === "string")`).
- **Discriminated (tagged) union** — a union of object types sharing a literal "tag" field the compiler uses to tell them apart.
- **Generic** — a type parameterized by another type: `Box<T>`. The "function" of the type world.
- **Conditional type** — `T extends U ? X : Y`: a type that branches on another type.
- **Mapped type** — transform every key of a type: `{ [K in keyof T]: ... }`.
- **Utility type** — a built-in generic like `Partial<T>`, `Pick<T,K>`, `Record<K,V>`.
- **`infer`** — pattern-match and *extract* a type inside a conditional type.
- **Declaration file (`.d.ts`)** — types-only file describing the shape of JS that has no types of its own.
:::

## The mental model: types are a specification, not decoration

The single idea behind everything advanced: **make illegal states unrepresentable.** If your types can only describe valid states, then "handle the invalid case" stops being something you remember to do — it's something the compiler won't let you forget. The tools below are all in service of that goal. TypeScript's type system is also (in)famously **Turing-complete** — you can compute with types — which is powerful and a trap in equal measure.

## Narrowing & control-flow analysis

TypeScript follows your control flow and narrows types as it goes. Knowing the narrowing tools is foundational to everything else:

```typescript
function format(x: string | number | null) {
  if (x == null) return "—";        // x narrowed to null|undefined, then excluded
  if (typeof x === "string") return x.trim();  // x: string here
  return x.toFixed(2);              // x: number here — TS knows by elimination
}
```

Custom **type guards** teach the compiler about your own checks via `is`:

```typescript
type User = { kind: "user"; name: string };
function isUser(v: unknown): v is User {
  return typeof v === "object" && v !== null && (v as any).kind === "user";
}
// After `if (isUser(v))`, v is User inside the block.
```

And **assertion functions** narrow by throwing:

```typescript
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}
function load(id: string | undefined) {
  assert(id, "id required");   // after this line, id: string
  return db.get(id);
}
```

## Discriminated unions: the highest-leverage pattern

This is the one to internalize first — it's where TS earns its keep in real apps. A union of objects sharing a literal **tag** lets the compiler narrow exhaustively:

```typescript
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }      // data only exists on success
  | { status: "error"; error: string };      // error only exists on error

function render(s: RequestState) {
  switch (s.status) {
    case "idle":    return "Start a search";
    case "loading": return "Loading…";
    case "success": return `${s.data.length} users`;  // s.data is safe here ONLY
    case "error":   return s.error;
    default:        return assertNever(s);             // exhaustiveness — see below
  }
}
```

You **cannot** access `s.data` in the `loading` branch — it's a compile error. The illegal state ("loading, but reading data") is unrepresentable. This single pattern eliminates a huge class of real UI and API bugs.

:::info[Highlight: `never` is your exhaustiveness check]
`never` is the type with no values. Use it to make the compiler *prove* you handled every case — so adding a new union member becomes a compile error everywhere you forgot to update:

```typescript
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}
```

In the `switch` above, if every `case` is handled, `s` in the `default` is narrowed to `never` and `assertNever(s)` type-checks. The day someone adds `{ status: "cancelled" }` to `RequestState`, that `default` stops compiling — TS hands you a list of every place that needs the new case. This is exhaustiveness checking, and it turns "we forgot to handle the new state" from a production bug into a build failure. It's the payoff of discriminated unions and the reason seniors reach for them reflexively.
:::

## Generics, properly

Generics are functions over types. The advanced moves are **constraints**, **defaults**, and letting **inference** do the work:

```typescript
// Constraint: T must have an `id`. Default: T defaults to {id: string}.
function byId<T extends { id: string } = { id: string }>(items: T[], id: string): T | undefined {
  return items.find((i) => i.id === id);
}

// Inference: callers never write the type argument — TS infers T from the array.
const u = byId(users, "42");   // u: User | undefined, inferred
```

`keyof`, indexed access, and `typeof` are the glue for type-safe property access:

```typescript
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];                 // return type is the EXACT property type
}
const name = get(user, "name");    // string, not `any`
// get(user, "nope") → compile error: "nope" is not a key of user
```

## Conditional & mapped types: transforming types

**Mapped types** transform every key — this is how `Partial`, `Readonly`, etc. are built:

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] };     // strip readonly
type Nullable<T> = { [K in keyof T]: T[K] | null };       // every field nullable
// Key remapping with `as` — make getters from fields:
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
// Getters<{name: string}> → { getName: () => string }
```

**Conditional types** with `infer` pattern-match and extract:

```typescript
type ElementType<T> = T extends (infer E)[] ? E : T;   // unwrap an array
type A = ElementType<string[]>;   // string
type Awaited2<T> = T extends Promise<infer R> ? R : T; // unwrap a Promise (built-in: Awaited)
```

**Template literal types** compute string types — great for typed routes, event names, CSS units:

```typescript
type Route = `/users/${number}` | `/posts/${string}`;
type EventName<T extends string> = `on${Capitalize<T>}`;  // "click" → "onClick"
```

## The `satisfies` operator (use this a lot)

`satisfies` checks a value against a type **without widening it** — you keep the precise inferred type *and* get the constraint checked. It fixes the classic "annotate vs infer" dilemma:

```typescript
// Annotated: loses literal info — config.theme is `string`, routes is generic
const a: Record<string, string> = { theme: "dark" };

// `satisfies`: checked AGAINST the type, but keeps the narrow inferred type
const config = {
  theme: "dark",
  retries: 3,
} satisfies Record<string, string | number>;
config.theme;     // type is "dark" (literal!), not string — autocomplete works
// config.nope   // still a compile error — the constraint is enforced
```

Reach for `satisfies` whenever you have an object literal you want *both* validated against a shape *and* kept at its precise type (config objects, route tables, design tokens).

## Making invalid states impossible: branded types

Structural typing means a `UserId` and a `PostId` that are both `string` are interchangeable — a real bug source. **Branded (nominal) types** fix it with a phantom tag:

```typescript
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

function getUser(id: UserId) { /* … */ }
const raw = "abc";
// getUser(raw);                 // ❌ a plain string isn't a UserId
getUser(raw as UserId);          // ✅ explicit, intentional cast at the boundary
// getUser(somePostId);          // ❌ PostId is not UserId — bug caught at compile time
```

The same trick types "validated email," "non-empty string," "cents (not dollars)" — values that are *structurally* a string/number but *semantically* distinct.

## Declaration files, ambient types, and module augmentation

To consume untyped JS or extend existing types, you write **declaration files** (`.d.ts`) and **module augmentation**:

```typescript
// global.d.ts — declare env vars, globals, or augment a library's types
declare global {
  interface Window { analytics?: { track(e: string): void } }
}

// Augment a third-party module (e.g. add a property to Express's Request):
declare module "express" {
  interface Request { user?: { id: string } }
}
export {};   // make this file a module
```

This is how `@types/*` packages work and how you safely extend libraries instead of casting to `any`.

## tsconfig: the strictness flags that actually matter

Advanced TS is only as good as your compiler settings. Beyond `"strict": true`, these change real safety:

| Flag | What it catches |
|---|---|
| `strict` | The umbrella — turns on `strictNullChecks`, `noImplicitAny`, etc. Non-negotiable. |
| `noUncheckedIndexedAccess` | `arr[i]` is `T \| undefined`, not `T` — catches the #1 source of runtime `undefined` |
| `exactOptionalPropertyTypes` | distinguishes "missing" from "set to `undefined`" |
| `noImplicitOverride` | requires `override` keyword — catches broken inheritance on refactor |
| `verbatimModuleSyntax` | predictable `import type` vs runtime imports |

`noUncheckedIndexedAccess` in particular is the high-leverage one most teams forget — it makes array/record access honest about `undefined`.

:::caution[Where people commonly trip up — including over-engineering]
- **Living in `any`.** Every `any` is a hole in the type system that silently spreads. Prefer `unknown` at boundaries and narrow; reserve `any` for genuine escape hatches with a comment.
- **Reaching for conditional/mapped-type wizardry when a plain type would do.** Clever types have a real cost: slower compiles, cryptic errors, and teammates who can't modify the code. If a normal interface works, use it. Advanced types earn their place in *library* and *shared-API* code, not every component.
- **Type assertions (`as`) as a habit.** `as` tells the compiler "trust me" — it disables the very checking you're paying for. Each `as` is a place a bug can hide; narrow with guards instead, and confine casts to validated boundaries.
- **Type-checking that isn't runtime validation.** Types vanish at runtime. Data crossing a boundary (API responses, form input, env vars) must be validated with a runtime schema (Zod, Valibot) — then *inferred* into types, so the type and the check can't drift.
- **Cranking type cleverness past the team's level.** The goal is fewer bugs and easier change, not a type-golf trophy. If a senior can't read your type in 30 seconds, it's probably too clever for application code.
- **Ignoring compiler performance.** Deeply recursive conditional types can make the type-checker (and your editor) crawl. If `tsc`/IntelliSense gets slow, suspect a too-clever type.
:::

## Worked example: a fully-typed event emitter

Pulling several pieces together — a tiny emitter where the event name constrains the payload type, with zero runtime cost:

```typescript
type EventMap = {
  login: { userId: string };
  logout: { userId: string; reason: "manual" | "timeout" };
  error: { message: string };
};

class Emitter<M> {
  private handlers: { [K in keyof M]?: Array<(p: M[K]) => void> } = {};
  on<K extends keyof M>(event: K, fn: (p: M[K]) => void) {
    (this.handlers[event] ??= []).push(fn);
  }
  emit<K extends keyof M>(event: K, payload: M[K]) {
    this.handlers[event]?.forEach((fn) => fn(payload));
  }
}

const bus = new Emitter<EventMap>();
bus.on("logout", (p) => console.log(p.reason));   // p.reason is "manual" | "timeout"
bus.emit("login", { userId: "42" });              // ✅ payload checked against EventMap
// bus.emit("login", { userId: 42 });             // ❌ number is not string
// bus.emit("nope", {});                          // ❌ "nope" is not an event
```

Mapped type for the handler store, generic methods keyed by `keyof M`, indexed access (`M[K]`) for the payload — the call site is fully checked and fully inferred, and none of it costs a byte at runtime. *This* is what "expert TypeScript" buys you: APIs that are impossible to misuse.

## Practice on your own project

:::tip[Do this on code you've already shipped — 10–20 min each]
1. Find a place you used `any` or a type assertion (`as`) and replace it with a real type or a narrowing guard.
2. Find a "this can be in a few states" shape (a fetch result, a form, a feature flag) and model it as a **discriminated union**, then add a `switch` with a `never` exhaustiveness check.
3. Take a config or route object and add `satisfies` so it's validated *and* keeps its literal types.
4. Turn on `noUncheckedIndexedAccess` in `tsconfig.json` and fix what lights up — the cheapest real-bug finder on this page.

*Optional, if you want a pure type-system gym: the [type-challenges](https://github.com/type-challenges/type-challenges) repo.*
:::

## Page checkpoint

<Quiz id="stack-typescript-advanced-page" title="Did advanced TypeScript stick?" sampleSize={3}>

<Question
  prompt="What's the core goal that discriminated unions, branded types, and exhaustiveness checks all serve?"
  options={[
    { text: "Making the code run faster at runtime" },
    { text: "Making illegal states unrepresentable — so wrong code becomes a compile error instead of a runtime bug" },
    { text: "Reducing the size of the compiled JavaScript bundle" },
    { text: "Avoiding the need for any runtime validation" }
  ]}
  correct={1}
  explanation="The unifying idea of advanced TypeScript is encoding your domain's rules so precisely that invalid combinations can't be expressed. Discriminated unions tie fields to a state, branded types separate same-shaped values, and `never`-based exhaustiveness forces every case to be handled — all so bugs fail at compile time."
  revisit={{ to: "/docs/stack/typescript-advanced#the-mental-model-types-are-a-specification-not-decoration", label: "Make illegal states unrepresentable" }}
/>

<Question
  prompt="How does a `never`-based exhaustiveness check help when a teammate later adds a new variant to a discriminated union?"
  options={[
    { text: "It automatically writes the handler for the new variant" },
    { text: "Every switch/handler that didn't account for the new variant stops compiling, giving you a precise list of places to update" },
    { text: "It silently ignores the new variant at runtime" },
    { text: "It converts the union into an enum" }
  ]}
  correct={1}
  explanation="When all known cases are handled, the value narrows to `never` in the default branch, so `assertNever(x)` type-checks. Add a new variant and that narrowing breaks — TS flags every unhandled site. 'We forgot the new state' becomes a build failure, not a 3am incident."
  revisit={{ to: "/docs/stack/typescript-advanced#discriminated-unions-the-highest-leverage-pattern", label: "never & exhaustiveness" }}
/>

<Question
  prompt="When should you reach for the `satisfies` operator instead of a type annotation?"
  options={[
    { text: "Never — it's the same as `as`" },
    { text: "When you want an object literal validated against a shape while keeping its precise inferred (literal) type, e.g. config objects and route tables" },
    { text: "Only inside `.d.ts` declaration files" },
    { text: "When you want to disable type checking for a value" }
  ]}
  correct={1}
  explanation="`satisfies` checks a value against a type without widening it, so you get both the constraint AND the narrow inferred type (literals preserved, autocomplete intact). A plain annotation would widen `theme: 'dark'` to `string`; `as` would disable checking entirely."
  revisit={{ to: "/docs/stack/typescript-advanced#the-satisfies-operator-use-this-a-lot", label: "satisfies" }}
/>

<Question
  prompt="What's the most important caution about advanced type features in application code?"
  options={[
    { text: "They make the bundle larger, so avoid them" },
    { text: "Clever conditional/mapped types have real costs (slow compiles, cryptic errors, unreadable code); use them where they pay off — libraries and shared APIs — not everywhere" },
    { text: "They only work in the latest browser versions" },
    { text: "They replace the need for runtime validation of external data" }
  ]}
  correct={1}
  explanation="Advanced types are a tool, not a trophy. They shine in library and shared-API code; in everyday components a plain interface is usually better. Over-clever types slow the checker, produce inscrutable errors, and block teammates — and types never replace runtime validation of data crossing a boundary."
  revisit={{ to: "/docs/stack/typescript-advanced#tsconfig-the-strictness-flags-that-actually-matter", label: "When not to go advanced" }}
/>

</Quiz>

## What's next

→ Continue to [Frontend Frameworks](/docs/stack/frontend-frameworks) — the libraries (React, and friends) you'll apply all this typing to. For pure type-system practice, the [type-challenges](https://github.com/type-challenges/type-challenges) repo is the gym.
