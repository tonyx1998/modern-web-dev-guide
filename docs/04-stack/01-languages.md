---
id: languages
title: Languages
sidebar_position: 2
sidebar_label: Languages
description: The language you choose constrains everything else — framework, libraries, hiring, ecosystem.
---

# Languages

> **In one line:** Your language choice constrains your framework, your hiring pool, and your ecosystem. For new web projects in 2026, TypeScript is the default.

:::tip[In plain English]
A programming language is just *syntax + rules + ecosystem*. Most people pick a language because of what they want to *build*, not because of the language itself. Building a typical web app? TypeScript. Building AI/ML pipelines? Python. Building fast backend services? Go or Rust. Working at a big bank? Probably Java. Each language exists because some community decided it solved a specific problem better.
:::

## TypeScript — the default for web

TypeScript adds a type system to JavaScript. Variables, function parameters, and return values can be annotated; the compiler catches type errors before runtime.

```typescript
function getUser(id: number): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

// Error caught at compile time:
getUser("42"); // Type 'string' is not assignable to type 'number'
```

**Why it won:**

- Catches an enormous class of bugs (typos, wrong shapes, null/undefined).
- Enables industrial-strength refactoring; rename a function and the compiler finds every caller.
- Excellent editor support — autocomplete, jump-to-definition, find-references all "just work."
- The cost (a build step, occasional type wrangling) is negligible at any non-trivial size.

**In 2026:** TypeScript is the default for almost every new web project. Job listings increasingly require it. Plain JavaScript persists in small scripts, learning contexts, and legacy code.

## JavaScript (plain)

Still everywhere — runs in every browser. Plain JS is fine for:

- Tiny scripts (< 100 lines)
- Learning the fundamentals
- Legacy codebases
- Quick prototypes you'll throw away

For anything that ships, prefer TypeScript.

## Python

Dominant in AI/ML, data science, scripting, and rapid web prototyping.

**Web frameworks:**

- **FastAPI** — Modern, async, automatic OpenAPI generation. The leading choice for new Python APIs.
- **Django** — Batteries-included, mature, opinionated. Excellent for content-heavy sites.
- **Flask** — Minimal, flexible, classic.

**When to choose Python over TypeScript:**

- Heavy ML/data work (the ecosystem is unmatched).
- Existing Python team or codebase.
- Scientific computing or numerical work.

**When not to:** Maximum throughput, unified frontend/backend, strict static typing.

## Go

Designed for simple, fast, concurrent backend services.

**Strengths:**

- Compiles to a single static binary — trivial deployment.
- Fast compilation, fast runtime.
- First-class concurrency via goroutines.
- Small, learnable syntax.
- Dominant in cloud infrastructure (Kubernetes, Docker, Terraform are all Go).

**Web frameworks:** Gin, Echo, Fiber, Chi.

**When to choose:** Performance-sensitive services, infrastructure tools, networking-heavy code, microservices in large companies.

## Rust

Systems language with memory safety, no garbage collector, and remarkable performance.

**Strengths:**

- C-level performance with safety guarantees.
- Modern type system, excellent error handling.
- Growing web ecosystem (Axum, Actix, Rocket).
- Used by Cloudflare, Discord, AWS, Microsoft for high-performance components.

**Trade-off:** Steep learning curve. The borrow checker is famously challenging.

## Other notable languages

| Language       | Notes                                                              |
|----------------|--------------------------------------------------------------------|
| **Java / Kotlin** | Enterprise stalwart. Spring Boot dominates. Kotlin is the modern Java; also Android default. |
| **C# / .NET**    | Microsoft's enterprise platform. ASP.NET Core is fast and modern. |
| **PHP**          | Still powers ~40% of the web (WordPress). Laravel is modern and productive. |
| **Ruby**         | In slow decline. Rails 8 is a remarkable "one-person framework." |
| **Swift**        | iOS/macOS default. SwiftUI for cross-platform Apple apps.        |
| **Dart**         | Flutter's language; popular for cross-platform mobile.            |
| **Elixir**       | Functional, BEAM VM. Phoenix LiveView is interesting.             |
| **Zig**          | Newer systems language; used to implement Bun.                    |

:::info[Highlight: as a beginner, pick TypeScript and move on]
Spending months agonizing over "which language should I learn first?" is the most common time-waster in early web dev. TypeScript is the highest-leverage choice in 2026 because:

1. It works for both frontend (React, Vue, etc.) and backend (Node, Bun, Deno).
2. It has the largest job market for new graduates.
3. The ecosystem (libraries, tutorials, AI assistance) is unmatched.

Pick TypeScript. Ship 3 projects. *Then* learn a second language if curiosity or career direction demands it.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Spending a month picking the "right" language.** You'll find passionate threads claiming Rust or Elixir is the secret unlock. The fix: pick TypeScript, ship three projects, *then* look around. Optionality is worth less than experience.
- **Treating TypeScript as "JavaScript with annotations."** It's a structural type system, not a tax — `unknown` vs `any`, generics, and discriminated unions are where the real bug-catching lives. If your codebase is full of `any`, you're paying for TS and getting none of it.
- **Choosing Python for the backend because the team already uses it for ML.** Different problem. A Python web service alongside a Python ML pipeline is fine; *forcing* a high-throughput API onto Python because of language familiarity often ends in a rewrite. Pick per-service, not per-org.
- **Picking Go or Rust for the "performance" of a CRUD app.** Most web bottlenecks are the database and the network, not the language. Until you've profiled and confirmed CPU is the wall, you're optimizing the wrong layer.
- **Conflating "language" with "framework."** "We use Next.js" and "we use TypeScript" answer different questions. The language constrains your runtime and ecosystem; the framework constrains your app's shape. Pick the language first, then the framework within it.
:::

## Page checkpoint

<Quiz id="stack-languages-page" title="Did languages stick?" sampleSize={2}>

<Question
  prompt="Why is TypeScript the default for new web projects in 2026 over plain JavaScript?"
  options={[
    { text: "It runs faster in the browser at runtime" },
    { text: "It catches a large class of bugs at compile time and enables industrial-strength refactoring" },
    { text: "It eliminates the need for a build step entirely" },
    { text: "It is the only language modern browsers can execute" }
  ]}
  correct={1}
  explanation="TypeScript's type system catches typos, wrong shapes, and null/undefined bugs before runtime, and makes refactors safe by finding every caller of a renamed function. The build-step cost is negligible at any non-trivial size."
  revisit={{ to: "/docs/stack/languages#typescript--the-default-for-web", label: "TypeScript section" }}
/>

<Question
  prompt="When would Python be a better choice than TypeScript for a new project?"
  options={[
    { text: "When you want a single language across frontend and backend" },
    { text: "When you need maximum HTTP throughput on a small VM" },
    { text: "When the project is AI/ML or scientific-computing heavy" },
    { text: "When you want strict static typing by default" }
  ]}
  correct={2}
  explanation="Python's unmatched ML, data, and scientific-computing ecosystem is the main reason to pick it over TypeScript. For unified full-stack or strict static typing, TypeScript still wins."
  revisit={{ to: "/docs/stack/languages#python", label: "Python section" }}
/>

<Question
  prompt="Which language is the standard pick when you need fast, concurrent backend services and easy deployment as a single static binary?"
  options={[
    { text: "Ruby" },
    { text: "PHP" },
    { text: "Go" },
    { text: "Elixir" }
  ]}
  correct={2}
  explanation="Go was designed for simple, fast, concurrent services and compiles to a single static binary — which is why Kubernetes, Docker, and Terraform are all written in Go."
  revisit={{ to: "/docs/stack/languages#go", label: "Go section" }}
/>

<Question
  prompt="What's the main trade-off of choosing Rust for a web backend?"
  options={[
    { text: "It can only run on Linux servers" },
    { text: "It has a steep learning curve — the borrow checker is famously challenging" },
    { text: "It has no usable web frameworks" },
    { text: "It relies on a garbage collector that pauses requests" }
  ]}
  correct={1}
  explanation="Rust delivers C-level performance with safety, but the borrow checker imposes a steep learning curve. It has no garbage collector and a growing web ecosystem (Axum, Actix, Rocket)."
  revisit={{ to: "/docs/stack/languages#rust", label: "Rust section" }}
/>

</Quiz>

## What's next

→ Continue to [Frontend Frameworks](./frontend-frameworks) — the scaffolding around your language that turns it into a real web app.
