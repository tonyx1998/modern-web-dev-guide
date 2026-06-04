---
id: stage-5-typescript
title: Stage 5 — TypeScript
sidebar_position: 6
sidebar_label: Stage 5 — TypeScript
description: JavaScript with a type system bolted on — catches a huge class of bugs at write-time instead of in production.
---

# Stage 5 — TypeScript

> **Time budget:** ~2–3 weeks

> **In one line:** JavaScript with a type system bolted on — write code that looks ~95% the same, and let the compiler yell at you before your users do.

TypeScript is JavaScript with a type system bolted on. You write code that looks ~95% the same as your JS; the TS compiler reads it before your code runs and yells at you if something doesn't add up — "you're passing a string to a function that wants a number," "this object might be undefined." The result: a huge class of bugs is caught at write-time instead of at-runtime-in-production.

In 2026, TypeScript is the default for serious projects. Every framework's documentation assumes you'll use it. Learning it now is non-negotiable.

### 1. Setup

```bash
npm init -y                       # create a package.json
npm install -D typescript tsx     # tsx = run .ts files directly
npx tsc --init                    # create tsconfig.json
```

The `tsconfig.json` tells TypeScript how to behave. The defaults are sensible; the one setting worth knowing: `"strict": true` should already be on. Don't turn it off — it's the option that catches the most bugs.

### 2. Basic types

```ts
const age: number = 25;
const name: string = "Tony";
const isStudent: boolean = true;
const tags: string[] = ["web", "ai"];
const scores: number[] = [88, 92, 76];

// in most cases you don't need to write the type — TS infers it
const doubled = scores.map(n => n * 2);  // inferred as number[]
```

The rule: let TS infer types where it can. Only annotate where it can't — function parameters, things returned from APIs, exported function signatures.

### 3. Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}

// arrow form
const add = (a: number, b: number): number => a + b;

// optional parameter (?)
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;
}
```

### 4. Object shapes: `interface` and `type`

```ts
interface User {
  id: number;
  email: string;
  age?: number;          // optional field
  isAdmin: boolean;
}

function sendWelcome(user: User) {
  console.log(`Welcome ${user.email}`);
}

// `type` is equivalent for object shapes — both are fine
type Point = { x: number; y: number };
```

Use `interface` for object shapes by default; use `type` when you need unions or computed types (next).

### 5. Union types and literal types

```ts
// a string OR a number
type Id = string | number;

// one of three specific strings — incredibly useful
type Status = "pending" | "shipped" | "delivered";

function nextStatus(s: Status): Status {
  if (s === "pending") return "shipped";
  if (s === "shipped") return "delivered";
  return s;
}

// nextStatus("paid"); ❌ Argument of type '"paid"' is not assignable to 'Status'
```

### 6. Generics: the function that works on "any T"

```ts
// without generics — loses type info
function first(arr: any[]): any { return arr[0]; }

// with generics — preserves the element type
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);          // n is number | undefined
const s = first(["a", "b"]);          // s is string | undefined
```

You'll see `<T>` everywhere — in React's hooks, in API client libraries, in utility functions. The intuition: "this function works for any type; I'll call that type `T`; whatever you pass in determines what `T` is for this call."

### 7. The error you'll see first: "X is possibly undefined"

```ts
function findUser(id: number): User | undefined {
  return users.find(u => u.id === id);
}

const user = findUser(5);
console.log(user.email);  // ❌ 'user' is possibly 'undefined'

// fixes:
if (user) console.log(user.email);   // narrowing
console.log(user?.email);             // optional chaining — undefined if user is
console.log(user!.email);             // ! = "trust me bro" — avoid; usually wrong
```

This is TypeScript saving you from real crashes. Don't reach for `!` — handle the undefined case properly.

### 8. The `unknown` vs `any` distinction

`any` means "turn off type checking for this." It's a fire escape, not a tool. `unknown` means "I don't know yet; the compiler will force me to check before using it." Prefer `unknown`.

### What you don't need to learn yet

- **Decorators** — niche, used mostly in NestJS/Angular which you're skipping.
- **Advanced type gymnastics** (mapped types, conditional types, infer) — fascinating but irrelevant until you're writing libraries.
- **Namespaces, triple-slash references** — legacy. ES module syntax (Stage 1) replaces them.

## Where to go deeper

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) (official) — read "Everyday Types" and "Narrowing" sections.
- [Matt Pocock's Total TypeScript](https://www.totaltypescript.com/tutorials) — free, modern, opinionated. The "Beginner's Tutorial" is exactly the right level.
- [type-challenges](https://github.com/type-challenges/type-challenges) — exercises if you want to actually get good at the type system. Save for later.

## Deeper in this guide

- [Languages](/docs/stack/languages) — where TypeScript sits in the broader language landscape and why it became the default.
- [Advanced TypeScript](/docs/stack/typescript-advanced) — once you've shipped a project or two, the type-level features (discriminated unions, generics, conditional/mapped types, `satisfies`, branded types) that take you from competent to expert. Don't rush here — it's the "beginner → expert" deep end.

## Project

:::tip[Project — Port your Stage 3 todo to TypeScript]
Take your vanilla-JS todo from Stage 3. Rename `app.js` to `app.ts`. Run `npx tsc --init` to create a config. Fix every type error the compiler reports — there will be many at first. Define an `interface Todo { id: string; text: string; done: boolean }`. Type every function's parameters and return value. The goal is zero `any` in the final code. Bonus: type the GitHub user response from your Stage 3 fetch call — you'll have to look at the actual API response and write the interface yourself.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Reaching for `any` to silence the error.** `any` switches off type-checking for that value and everything that touches it — the bug you tried to hide just resurfaces three layers deeper. Use `unknown` and narrow with a type check, or actually model the shape.
- **Annotating everything by hand.** `const name: string = "Tony"` is noise — TS already infers `string`. Annotate function *parameters*, *return types of exported functions*, and data crossing the network boundary; let inference do the rest.
- **Using `!` (the non-null assertion) to make red squiggles go away.** `user!.email` tells the compiler "trust me, this isn't undefined" — and crashes at runtime when it is. Narrow with `if (user)` or use `?.` so the undefined case is actually handled.
- **Turning off `"strict": true`.** Strict mode is the option that catches the most real bugs. Turning it off makes TypeScript a verbose autocomplete tool rather than a type checker — at that point you may as well write JS.
:::

## Page checkpoint

<Quiz id="stage-5-page" title="Did Stage 5 stick?" sampleSize={3}>

<Question
  prompt="What's the practical difference between `any` and `unknown`?"
  options={[
    { text: "They're identical aliases" },
    { text: "`any` disables type-checking on that value; `unknown` forces you to narrow (with a type check) before using it" },
    { text: "`unknown` is faster at runtime" },
    { text: "`any` is only allowed in `.ts` files; `unknown` is for `.tsx`" }
  ]}
  correct={1}
  explanation="`any` lets you do anything to the value with zero compiler help — bugs propagate. `unknown` is the safe alternative: the compiler refuses to let you use it until you've proven (via `typeof`, `instanceof`, or a type guard) what it actually is."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-5-typescript#8-the-unknown-vs-any-distinction", label: "Revisit: unknown vs any" }}
/>

<Question
  prompt="`function findUser(id: number): User | undefined` returns the user or undefined. You write `const u = findUser(5); console.log(u.email);` and TS complains 'u is possibly undefined.' What's the right fix?"
  options={[
    { text: "Use `u!.email` to assert it's defined" },
    { text: "Narrow first: `if (u) console.log(u.email)`, or use optional chaining `u?.email`" },
    { text: "Change the return type to just `User`" },
    { text: "Cast: `(u as User).email`" }
  ]}
  correct={1}
  explanation="The compiler is warning about a real bug — `u` might be undefined and `.email` would crash. Narrowing with `if (u)` or `?.` actually handles the missing case. `!` and casts hide the problem without fixing it."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-5-typescript#7-the-error-youll-see-first-x-is-possibly-undefined", label: "Revisit: 'X is possibly undefined'" }}
/>

<Question
  prompt="What does `<T>` mean in `function first<T>(arr: T[]): T | undefined`?"
  options={[
    { text: "A specific type called T defined elsewhere" },
    { text: "A type parameter — the caller's argument determines what T is for this call, so the return type matches the input element type" },
    { text: "A shortcut for `any`" },
    { text: "TypeScript syntax for a tuple" }
  ]}
  correct={1}
  explanation="`T` is a placeholder. Call `first([1,2,3])` and `T` is `number`, so the return is `number | undefined`. Call `first(['a','b'])` and `T` is `string`. Generics preserve type information through generic functions."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-5-typescript#6-generics-the-function-that-works-on-any-t", label: "Revisit: Generics" }}
/>

</Quiz>

→ [Next: Stage 6 — React fundamentals](/docs/roadmap/part-1-from-zero/stage-6-react) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
