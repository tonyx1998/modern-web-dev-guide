---
id: state-management
title: State Management
sidebar_position: 7
sidebar_label: State Management
description: Two kinds of state, two kinds of tools. Server state (TanStack Query), client state (Zustand, React built-ins), form state (React Hook Form + Zod), URL state.
---

# State Management

> **In one line:** Two kinds of state, two kinds of tools. Server state needs a cache (TanStack Query); client state needs a store (Zustand or React built-ins).

:::tip[In plain English]
"State" is just data your app needs to remember. There are two flavors of it and they need different tools:

- **Server state** — Data fetched from your backend. Lives on the server, you cache it on the client. *Tools: TanStack Query, SWR, or React Server Components.*
- **Client state** — UI state, form fields, modals, theme. Lives only in the browser. *Tools: React's `useState`, or a store like Zustand for global stuff.*

A lot of beginner confusion about state management goes away once you separate these two.
:::

## Server state

Data fetched from your backend (or any external source).

**TanStack Query** (formerly React Query) is dominant. It handles:

- Caching by query key.
- Background refetching.
- Optimistic updates.
- Pagination, infinite scroll.
- Deduplication of in-flight requests.
- Stale-while-revalidate patterns.

```typescript
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <List users={data} />;
}
```

> **In English:** `useQuery` is a React hook that takes a unique `queryKey` (the cache identifier) and a `queryFn` (the function that fetches data). It returns loading/error/data flags you can render against. Behind the scenes, TanStack Query caches the result, dedupes parallel requests for the same key, and refetches in the background when the user refocuses the tab — all "for free."

**SWR** (by Vercel) is a simpler alternative; nearly identical model.

**In React Server Components**, much server state is fetched directly in the component (no library needed) — the framework handles caching for you.

## Client state

UI state, form state, ephemeral data.

**React built-ins** handle most needs:

- `useState` — Local component state.
- `useReducer` — Complex local state with explicit transitions.
- `useContext` — Share state across the tree (avoid for high-frequency updates).

**Zustand** — Simple, popular global state store:

```typescript
import { create } from 'zustand';

const useCart = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// In a component:
const items = useCart((s) => s.items);
const addItem = useCart((s) => s.addItem);
```

**Jotai** — Atomic state model. Fine-grained reactivity.

**Redux Toolkit** — Still used in large/legacy codebases. New projects rarely choose it; it's heavier than alternatives.

## Form state

**React Hook Form** + **Zod** is the dominant combination.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

> **In English:** **Zod** declares the validation rules (email must look like an email; password must be 8+ chars). React Hook Form's `register('email')` wires an input to the form state using the field name as the key. On submit, the **resolver** runs the Zod schema against the values; any failures populate `errors` so you can render messages next to the offending fields. One schema doubles as runtime validation, TypeScript types, and form validation.

→ **Going deeper:** [Forms & Server Actions](./forms-server-actions) takes this pairing all the way — async validation, surfacing server errors, optimistic updates, and the React 19 / Next.js 16 server-action mutation pattern.

## URL state

The URL is also state. Use the framework's router (Next.js's `useSearchParams`, React Router's `useSearchParams`) to read/update URL state.

For complex URL state, **nuqs** is a popular library.

:::info[Highlight: don't put server data in client state]
The most common state management mistake: fetching server data, then dumping it into Zustand or Redux to "share it everywhere."

This sets you up for stale data, manual refetching logic, race conditions, and complex synchronization. *Server data is a cache, not state.* Use a server-state library (TanStack Query or RSC) and let it handle caching, refetching, and invalidation. Reserve Zustand/Redux/Context for *purely client* state — open menus, theme, draft form input.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Stuffing fetched server data into Zustand or Redux.** This is the #1 state mistake. You now own caching, refetching, deduping, and staleness manually — and you'll get all of them wrong. Server data goes in TanStack Query, SWR, or RSC. Client stores are for client-only state.
- **Using React Context for high-frequency updates.** Context re-renders every consumer on any change. A cursor position or input field in Context will tank your app. Use Context for *infrequent* shared state (theme, auth user) and Zustand/Jotai for the rest.
- **Reaching for Redux on a new project in 2026.** Redux Toolkit is fine in legacy code, but new projects don't need its ceremony. Zustand is ~1KB and reads like normal JS. Pick Redux only when you have a specific reason (existing team, time-travel debugging).
- **Manually syncing URL params with `useState`.** You write a `useEffect` that reads the URL, another that writes it, and now your back button is broken. Use `useSearchParams` from your router or `nuqs` — the URL *is* the state.
- **Validating form data twice — once with ad-hoc checks, once with Zod.** Pick one schema (Zod), derive the TypeScript types from it (`z.infer<typeof schema>`), and use the same schema in the form resolver *and* the server action. One source of truth.
:::

## Page checkpoint

<Quiz id="stack-state-management-page" title="Did state management stick?" sampleSize={3}>

<Question
  prompt="What's the single most common state-management mistake the page calls out?"
  options={[
    { text: "Using useState for component-local state" },
    { text: "Dumping fetched server data into Zustand or Redux to 'share it everywhere'" },
    { text: "Storing the URL in client state with nuqs" },
    { text: "Letting React Hook Form manage form fields" }
  ]}
  correct={1}
  explanation="Server data is a cache, not state. Putting it into Zustand/Redux invites stale data, manual refetching, and race conditions. Use a server-state library (TanStack Query or RSC) for server data and reserve client stores for purely client state."
  revisit={{ to: "/docs/stack/state-management#server-state", label: "Server vs client state" }}
/>

<Question
  prompt="Which problem does TanStack Query handle for you that plain `fetch` does not?"
  options={[
    { text: "Type-checking your TypeScript code" },
    { text: "Caching by query key, background refetching, dedup of in-flight requests, and stale-while-revalidate" },
    { text: "Encrypting requests over TLS" },
    { text: "Rendering loading spinners and error messages automatically" }
  ]}
  correct={1}
  explanation="TanStack Query gives you key-based caching, background refetching, request deduplication, optimistic updates, and stale-while-revalidate. Plain fetch does none of that — you'd hand-roll it."
  revisit={{ to: "/docs/stack/state-management#server-state", label: "Server state" }}
/>

<Question
  prompt="When is Zustand a better pick than React's built-in `useState` / `useContext`?"
  options={[
    { text: "When you need to fetch server data" },
    { text: "When you need a simple, global client store without the boilerplate of Redux or the rerender pitfalls of Context" },
    { text: "When you only need a single component's local state" },
    { text: "When you want type-safe form validation" }
  ]}
  correct={1}
  explanation="Zustand is the modern simple global client store — less boilerplate than Redux and fewer rerender pitfalls than Context. Local component state still belongs in useState; server data belongs in TanStack Query."
  revisit={{ to: "/docs/stack/state-management#client-state", label: "Client state" }}
/>

<Question
  prompt="In the React Hook Form + Zod pattern, what's the role of Zod?"
  options={[
    { text: "It runs the form's onSubmit handler" },
    { text: "It declares validation rules that double as TypeScript types and runtime validation" },
    { text: "It replaces React Hook Form's `register` API" },
    { text: "It manages global app state across forms" }
  ]}
  correct={1}
  explanation="Zod declares the schema (email must look like an email, password ≥ 8 chars). One schema serves as TypeScript types, runtime validation, and (via the resolver) form-field error messages."
  revisit={{ to: "/docs/stack/state-management#form-state", label: "Form state" }}
/>

</Quiz>

## What's next

→ Continue to [Forms & Server Actions](./forms-server-actions) — the controlled/uncontrolled split, React Hook Form + Zod, and the React 19 / Next.js 16 server-action mutation pattern end to end.
