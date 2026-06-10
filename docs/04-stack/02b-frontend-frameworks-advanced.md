---
id: frontend-frameworks-advanced
title: Advanced React & Rendering
sidebar_position: 4
sidebar_label: Advanced React
description: Beyond components — reconciliation, the rules of hooks and why they exist, render performance, Server Components vs client, Suspense and concurrent rendering, and the state-colocation discipline that keeps large apps fast.
---

# Advanced React & Rendering

> **In one line:** Once you can build components, the expert step is understanding *when and why React re-renders*, what runs on the server vs the client, and how to keep a large app fast — because most React performance and bug problems are really "I didn't know what triggered this render."

:::note[Level: advanced — read after you've built a few React apps]
This assumes you've done the React stage and shipped UI with `useState`/`useEffect`. It's the "competent → expert" layer: the mental model of rendering, the modern Server-Component split, and the performance discipline. You don't need it to build your first apps — reach for it when an app gets big enough to feel slow or tangled.
:::

← New here? Start with the on-ramp: [Frontend Frameworks](/docs/stack/frontend-frameworks).

:::tip[In plain English]
Beginners think of React as "I write components and they show up." Experts think of it as "*state changes, and React figures out the minimum DOM updates*" — and they know exactly what causes that to happen. The single most useful upgrade is being able to answer "why did this component just re-render?" instantly: a parent re-rendered, its props/state changed, or its context value changed. Get that, plus where code runs (server vs browser) in modern React, and most performance mysteries and stale-data bugs evaporate.
:::

:::info[Jargon for this chapter]
- **Reconciliation** — React diffing the new render output against the previous one to compute minimal DOM changes.
- **Render vs commit** — *render* = call your components to produce a virtual tree; *commit* = apply the diff to the real DOM.
- **RSC (React Server Components)** — components that run only on the server and send serialized output, never shipping their JS to the browser.
- **Hydration** — attaching client-side interactivity to server-rendered HTML.
- **Memoization** — caching a value/component so it's not recomputed/re-rendered when inputs are unchanged.
- **Concurrent rendering** — React's ability to interrupt, pause, and resume rendering to keep the UI responsive.
:::

## The render model: why components re-run

A component re-renders when one of three things happens: **its state changes**, **its parent re-renders**, or **a context it consumes changes**. That's it. Crucially, "a parent re-rendered" cascades to *all* children by default — even children whose props didn't change. Re-rendering isn't the same as touching the DOM (reconciliation skips unchanged DOM), but the *render functions still run*, and that's where wasted work and subtle bugs live.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  // Every click re-renders Parent AND <ExpensiveList/> — even though the list's
  // data never changed — because Parent re-rendered. That's the default.
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ExpensiveList items={items} />
    </>
  );
}
```

The fix is rarely "wrap everything in `memo`." It's usually **state colocation** (push state down to the smallest component that needs it) and **lifting content up via `children`** so a frequently-updating component doesn't own a subtree it doesn't affect.

**Try it live** — open the console (in the preview) and click the button. The parent's state change re-renders `Parent` *and* `Child` even though `Child`'s props never change — the default cascade. Edit the code to wrap `Child` in `React.memo` and watch the extra render disappear:

<Sandbox
  template="react"
  editorHeight={360}
  files={{
    '/App.js': `import { useState } from "react";

function Child({ label }) {
  console.log("rendered:", label);
  return <p>{label} rendered — see the console.</p>;
}

export default function App() {
  const [n, setN] = useState(0);
  return (
    <div>
      <button onClick={() => setN(n + 1)}>Re-render parent ({n})</button>
      <Child label="Child" />
    </div>
  );
}`,
  }}
/>

## The rules of hooks (and the why)

Hooks must be called **unconditionally, in the same order, every render** — no hooks in conditions, loops, or after an early return. The reason is mechanical: React tracks hook state by *call order*, not by name. Call them in a different order and `useState` #2 returns hook #1's value — silent, vicious bugs. The lint rule `react-hooks/exhaustive-deps` exists for the same class of problem: a `useEffect` whose dependency array omits a value it reads will run with stale closures. Understanding *why* (closures capture the render they were created in) is what separates "I fight `useEffect`" from "I reach for it deliberately."

:::caution[useEffect is overused — most effects shouldn't exist]
The biggest React-maturity tell is *not* reaching for `useEffect`. You do **not** need an effect to: transform data for rendering (do it during render), respond to a user event (do it in the handler), or reset state on prop change (use a `key`). Effects are for **synchronizing with external systems** — a subscription, a non-React widget, the document title. "I'll just add a `useEffect` to keep these two states in sync" is the #1 source of render loops, double-fetches, and flicker. If you find an effect that only adjusts other React state, delete it.
:::

## Server Components vs client: where code runs

Modern React (App Router / RSC) splits components by *where they run*:

| | **Server Component (default)** | **Client Component (`"use client"`)** |
|---|---|---|
| Runs | On the server, once per request | In the browser (and server, for SSR) |
| Can | `await` data directly, read secrets, hit the DB | Use state, effects, event handlers, browser APIs |
| Ships JS to browser? | **No** — only its output | Yes — its code is in the bundle |
| Use for | Data fetching, static content, large deps | Interactivity, anything stateful |

The expert discipline: **keep components as Server Components by default, and push `"use client"` to the leaves** (the actual interactive bits). A common mistake is marking a big top-level layout `"use client"`, which drags its entire subtree into the client bundle. The mental model: server components are for *getting and shaping data*; client components are for *reacting to the user*.

:::info[Highlight: "why did it re-render?" is the question that makes you senior]
Almost every React performance problem reduces to unnecessary renders, and almost every "stale value" bug reduces to a closure capturing an old render. So the senior habit is to *always be able to answer two questions*: **(1) what state change triggered this render, and does this component actually depend on it?** and **(2) which render did this closure capture?** With React DevTools' "Highlight updates" and the Profiler, you can see renders happening; with that visibility, `memo`/`useMemo`/`useCallback` stop being cargo-culted everywhere and become targeted fixes for a measured problem. Optimize what the profiler shows you, not what you guess.
:::

## Performance levers (in priority order)

1. **State colocation** — the cheapest, biggest win. State that lives lower re-renders less.
2. **`children` / composition** — pass expensive subtrees as `children` so a stateful wrapper doesn't re-render them.
3. **Keys** — stable, meaningful `key`s (never array index for dynamic lists) so reconciliation reuses DOM instead of recreating it.
4. **`memo` / `useMemo` / `useCallback`** — *only* on a proven-hot path. Each has its own cost; sprinkling them everywhere can be net-negative.
5. **Virtualization** — for long lists, render only what's visible (TanStack Virtual).
6. **Suspense + streaming** — show meaningful UI while data loads, stream from the server.

## Common mistakes

:::caution[Where people commonly trip up]
- **Reaching for `useEffect` to derive or sync state.** Derive during render; handle events in handlers; reset with a `key`. Effects are for external systems only.
- **`memo`-ing everything.** Memoization has overhead and is usually defeated by a new object/function prop each render anyway. Profile first; memoize the hot path.
- **Array index as `key` for dynamic lists.** Causes wrong state/DOM reuse on reorder or deletion. Use a stable id.
- **Marking a high-level component `"use client"`.** It pulls the whole subtree into the bundle. Keep server-by-default; push `"use client"` to the interactive leaves.
- **Fetching in `useEffect` when the framework offers server fetching.** Server Components / loaders fetch on the server with no waterfall and no client bundle cost.
- **Ignoring the dependency array warning.** A wrong deps array is a stale-closure bug waiting to happen. Fix the deps or restructure; don't suppress the lint.
:::

## Practice on your own project

:::tip[Do this on an app you've built]
1. Open React DevTools → "Highlight updates," click around, and find a component re-rendering more than it should — then explain *why* (parent re-rendered? state? context?).
2. Find a `useEffect` and decide whether it's legitimate (syncing with an external system) or should be deleted (deriving state / responding to an event). Remove at least one.
3. Pick one piece of state that's lifted higher than it needs to be and **colocate** it lower.
4. If you're on the Next.js App Router, find a component marked `"use client"` that could be a Server Component and push the boundary down toward the leaves.
:::

## Page checkpoint

<Quiz id="stack-react-advanced-page" title="Did advanced React stick?" sampleSize={3}>

<Question
  prompt="What are the three things that cause a React component to re-render?"
  options={[
    { text: "Any change anywhere in the app" },
    { text: "Its own state changes, its parent re-renders, or a context it consumes changes" },
    { text: "Only when its props are different from last time" },
    { text: "Only when the DOM it produces would change" }
  ]}
  correct={1}
  explanation="A component re-runs when its state changes, its parent re-renders (cascading to children by default regardless of prop changes), or a consumed context value changes. Re-rendering runs your component function — reconciliation then decides the minimal DOM update separately."
  revisit={{ to: "/docs/stack/frontend-frameworks-advanced#the-render-model-why-components-re-run", label: "The render model" }}
/>

<Question
  prompt="When is `useEffect` the right tool?"
  options={[
    { text: "To transform props/state into derived data for rendering" },
    { text: "To synchronize with an external system (a subscription, a non-React widget, the document title) — not to derive state or respond to events" },
    { text: "To run code after every user click" },
    { text: "To keep two pieces of React state in sync" }
  ]}
  correct={1}
  explanation="Effects are for synchronizing React with the outside world. Deriving data should happen during render, event responses belong in handlers, and prop-driven resets use a `key`. Effects that only sync React state to other React state are the top source of loops and flicker."
  revisit={{ to: "/docs/stack/frontend-frameworks-advanced#the-rules-of-hooks-and-the-why", label: "useEffect is overused" }}
/>

<Question
  prompt="What's the discipline for splitting Server and Client Components in modern React?"
  options={[
    { text: "Mark the top-level layout 'use client' so everything is interactive" },
    { text: "Keep components as Server Components by default and push 'use client' to the interactive leaves, so you don't drag whole subtrees into the client bundle" },
    { text: "Use only Client Components to avoid confusion" },
    { text: "Fetch all data in Client Components via useEffect" }
  ]}
  correct={1}
  explanation="Server Components fetch/shape data and ship no JS; Client Components handle interactivity and add to the bundle. Defaulting to server and marking only the interactive leaves 'use client' keeps bundles small and data-fetching on the server."
  revisit={{ to: "/docs/stack/frontend-frameworks-advanced#server-components-vs-client-where-code-runs", label: "Server vs client" }}
/>

</Quiz>

## What's next

→ Continue to [Styling](/docs/stack/styling) — and its advanced companion — for the layer that turns a working component tree into a polished UI.
