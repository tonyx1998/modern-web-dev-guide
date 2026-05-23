---
id: stage-1-javascript-basics
title: Stage 1 — JavaScript basics
sidebar_position: 2
sidebar_label: Stage 1 — JS basics
description: The single most important stage in this guide. Eight JavaScript concepts to actually internalise — variables, functions, arrays, objects, references, and modules.
---

# Stage 1 — JavaScript basics

> **Time budget:** ~3–6 weeks

> **In one line:** Everything that comes later (React, Next.js, backend code) is JavaScript with extra rules — get this solid or every later stage will feel ten times harder than it should.

The single most important stage in this guide. Everything that comes later (React, Next.js, backend code) is JavaScript with extra rules. If your JavaScript is shaky, every later stage will feel ten times harder than it should. Take your time here.

Eight concepts to actually internalise, not just read about.

### 1. Variables: `let`, `const`, and types

A variable is a named box you put a value in. JavaScript has two ways to declare one: `let` (the value can be reassigned later) and `const` (it can't). Always prefer `const` — use `let` only when you actually need to reassign. There's also `var`, an older form — never use it.

```js
const age = 25;
const name = "Tony";
const isStudent = true;
const nothing = null;

let score = 0;
score = score + 10; // allowed because score is `let`

// age = 26;  // ❌ TypeError: Assignment to constant variable
```

The seven primitive types you'll meet: `number`, `string`, `boolean`, `null`, `undefined`, `bigint` (huge integers, rare), `symbol` (advanced, ignore for now). Plus two non-primitives: `object` and `array` (which is technically an object).

### 2. Strings, template literals, and the operators that bite

```js
const first = "Tony";
const last = "Yu";

// concatenation with +
const full = first + " " + last;

// template literal (backticks + ${ }) — almost always cleaner
const greeting = `Hello, ${first} ${last}, you are ${age} years old.`;

// === vs ==  — ALWAYS use ===
const a = 5;
const b = "5";
console.log(a == b);   // true — type coercion, surprising
console.log(a === b);  // false — strict equality, what you actually want
```

Rule: only ever write `===` and `!==`. The double-equals form does sneaky type conversion that has produced more bugs than any other JS feature.

### 3. Conditionals and "truthy" / "falsy"

```js
const score = 73;

if (score >= 90) {
  console.log("A");
} else if (score >= 70) {
  console.log("B");
} else {
  console.log("work harder");
}

// ternary — a compact if/else expression
const label = score >= 70 ? "pass" : "fail";
```

JavaScript treats certain values as "falsy" when used in a condition: `false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`. Everything else is truthy. This is why `if (user.name)` works as a "did they fill it in" check — but also why `if (count)` incorrectly skips `count === 0`.

### 4. Functions: declarations vs arrows

```js
// function declaration
function add(a, b) {
  return a + b;
}

// arrow function — same thing, terser, used everywhere in modern JS
const add = (a, b) => a + b;

// arrow with a body
const greet = (name) => {
  const hour = new Date().getHours();
  return hour < 12 ? `Morning, ${name}` : `Hi, ${name}`;
};

console.log(add(2, 3));      // 5
console.log(greet("Tony"));   // "Morning, Tony" or "Hi, Tony"
```

### 5. Arrays and the three methods you'll use every day

```js
const nums = [1, 2, 3, 4, 5];

nums.length;                       // 5
nums[0];                           // 1 (zero-indexed)
nums.push(6);                      // mutates: [1,2,3,4,5,6]

// .map — transform every item, return a new array
const doubled = nums.map(n => n * 2);  // [2,4,6,8,10]

// .filter — keep items that pass a test
const evens = nums.filter(n => n % 2 === 0);  // [2,4]

// .reduce — fold the array into a single value
const sum = nums.reduce((acc, n) => acc + n, 0);  // 15

// for...of — iterate without indices
for (const n of nums) {
  console.log(n);
}
```

`.map`, `.filter`, `.reduce`, and `for...of` cover 95% of array work in modern JS. You'll almost never write a traditional `for (let i = 0; ...)` loop again.

### 6. Objects: the most-used data structure in JS

```js
const user = {
  name: "Tony",
  age: 25,
  isStudent: true,
};

user.name;            // "Tony" — dot notation
user["age"];          // 25 — bracket notation, equivalent
user.email = "t@x.com";  // add a field

// destructuring — pull fields into variables in one line
const { name, age } = user;
console.log(name, age);  // "Tony" 25

// spread — copy fields into a new object
const updated = { ...user, age: 26 };  // new object; user is unchanged
```

### 7. Reference vs value: the one that trips everyone

Primitives (number, string, boolean) are passed **by value** — a copy. Objects and arrays are passed **by reference** — a pointer to the same thing in memory. This causes mysterious bugs.

```js
// primitives — independent copies
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — unchanged

// objects — same thing through two names
const x = { count: 1 };
const y = x;
y.count = 99;
console.log(x.count); // 99 — x and y point to the SAME object

// to get an independent copy, spread:
const z = { ...x };
z.count = 0;
console.log(x.count); // 99 — x is untouched this time
```

This becomes critical in React, where mutating state objects directly (instead of creating new ones) silently fails to trigger re-renders.

### 8. Modules: `import` / `export`

Modern JS code is split across many files that import from each other.

```js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add, PI } from "./math.js";

console.log(add(2, 3));        // 5
console.log(multiply(4, PI));  // 12.56636
```

One file = one module. `export` what you want other files to use; `import` what you need. Default exports are imported without braces; named exports need them.

### What to skip for now

You will see these and panic — *don't*. They're for later, not now:

- **Classes** — they exist; modern web code rarely uses them. Skim, don't study.
- **`this`** — it's a confusing rabbit hole tied mostly to classes. Skip until you need it.
- **Prototypes** — under-the-hood inheritance mechanism. Important eventually, irrelevant now.
- **Callbacks** in the old `(err, result) => ...` style — superseded by promises/async-await (Stage 3).

## Where to go deeper

- [javascript.info](https://javascript.info) — the single best free JavaScript textbook. Work through Part 1 ("The JavaScript language"). Do the exercises. Don't just read.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — the authoritative reference. Bookmark it; you'll be back daily.
- [The Odin Project](https://www.theodinproject.com) — a full free curriculum if you want a structured course with cohort-style progression.

## Deeper in this guide

- [Languages](/docs/stack/languages) — where JavaScript sits in the broader landscape (TypeScript, Rust at the edges, Python on the backend).

## Project

:::tip[Project — Console-only command-line games]
In a `stage-1/` folder, build three things, no UI, all printed to the terminal: (1) a **number guessing game** — the program picks a random number 1–100, the user guesses via `readline`, the program says "higher" or "lower"; (2) a **todo list** stored in a JavaScript array, with functions to add, complete, and list todos; (3) a **word counter** that reads a text file and prints the 10 most-used words. Each one uses different bits of what you just learned. If you can build all three without copy-pasting, you've internalised Stage 1.
:::

→ [Next: Stage 2 — HTML & CSS](/docs/roadmap/part-1-from-zero/stage-2-html-css) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
