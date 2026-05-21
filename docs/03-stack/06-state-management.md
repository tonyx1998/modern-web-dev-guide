---
id: state-management
title: State Management
sidebar_position: 7
sidebar_label: 6. State Management
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

## URL state

The URL is also state. Use the framework's router (Next.js's `useSearchParams`, React Router's `useSearchParams`) to read/update URL state.

For complex URL state, **nuqs** is a popular library.

:::info[Highlight: don't put server data in client state]
The most common state management mistake: fetching server data, then dumping it into Zustand or Redux to "share it everywhere."

This sets you up for stale data, manual refetching logic, race conditions, and complex synchronization. *Server data is a cache, not state.* Use a server-state library (TanStack Query or RSC) and let it handle caching, refetching, and invalidation. Reserve Zustand/Redux/Context for *purely client* state — open menus, theme, draft form input.
:::

## What's next

→ Continue to [Backend Frameworks](./backend-frameworks) — the server-side equivalent of frontend frameworks.
