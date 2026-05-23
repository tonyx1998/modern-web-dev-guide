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

## Project

:::tip[Project — Port your Stage 3 todo to TypeScript]
Take your vanilla-JS todo from Stage 3. Rename `app.js` to `app.ts`. Run `npx tsc --init` to create a config. Fix every type error the compiler reports — there will be many at first. Define an `interface Todo { id: string; text: string; done: boolean }`. Type every function's parameters and return value. The goal is zero `any` in the final code. Bonus: type the GitHub user response from your Stage 3 fetch call — you'll have to look at the actual API response and write the interface yourself.
:::

→ [Next: Stage 6 — React fundamentals](/docs/roadmap/part-1-from-zero/stage-6-react) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
