---
id: development
title: 'Phase 4: Development'
sidebar_position: 7
sidebar_label: 6. Development
description: The development loop — Server Components, Client Components, Server Actions, loading and error states, styling, AI assistance.
---

# Phase 4: Development

> **In one line:** Build features one at a time, end-to-end. Default to Server Components; reach for `'use client'` only when you need interactivity.

:::tip[In plain English]
This is the part where you actually build the product. Pick *one* feature, take it all the way from database schema to deployed UI, then move to the next. Avoid the temptation to "set up everything first" — you'll end up with three half-finished features instead of one shipped one.
:::

## Recommended Development Loop

The longest phase. Here's how to make it productive.

1. Pick one feature from your v1 list.
2. Sketch the UI in a comment or scratch file.
3. Build the database schema (if new).
4. Build the server logic (Server Actions or Route Handlers).
5. Build the UI.
6. Test it manually.
7. Commit and push.
8. Vercel auto-deploys; check the preview URL.
9. Move to the next feature.

Repeat until v1 is done.

## Server Components vs Client Components

Next.js App Router gives you both:

- **Server Components** (default): Run on the server. Can `await` data. Cannot use `useState`, `useEffect`, event handlers, or browser APIs. Ship zero JS to the client.
- **Client Components** (marked with `"use client"`): Run on both server (for initial HTML) and client (for hydration). Can use all React features and browser APIs.

**Default to Server Components.** Add `"use client"` only when you need interactivity.

Example: a book list (Server Component, no JS needed) with an "Add Book" button (Client Component because it opens a modal).

```typescript
// src/app/library/page.tsx (Server Component)
import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { AddBookButton } from './add-book-button';  // Client Component
import { BookCard } from './book-card';

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) return <div>Sign in to see your library</div>;

  const myBooks = await db
    .select()
    .from(books)
    .where(eq(books.userId, userId));

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Library</h1>
        <AddBookButton />
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myBooks.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}
```

> **In English:** A Server Component is just an async React function that runs on the server. It can `await` the database directly — no API call, no client-side fetch. Here it reads `userId` from Clerk, short-circuits with a sign-in nudge if absent, queries Drizzle for that user's books, and renders the markup. Only the small `<AddBookButton />` ships JavaScript to the browser; the rest is plain HTML.

```typescript
// src/app/library/add-book-button.tsx (Client Component)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddBookDialog } from './add-book-dialog';

export function AddBookButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Book</Button>
      <AddBookDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
```

> **In English:** The `'use client'` directive at the top is what flips this file into a Client Component — it gets bundled and shipped to the browser so React can attach event handlers and run `useState`. The component holds one piece of state (`open`) and uses it to toggle the modal dialog. This is exactly the kind of component that *needs* to be a Client Component: a click handler and stateful UI.

## Server Actions

For mutations (creating, updating, deleting data), **Server Actions** (server-side functions you can call directly from client components — Next.js generates the network plumbing for you) let you skip writing API routes:

```typescript
// src/app/library/actions.ts
'use server';

import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const AddBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(['reading', 'finished', 'wishlist']),
});

export async function addBook(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const parsed = AddBookSchema.parse({
    title: formData.get('title'),
    author: formData.get('author'),
    status: formData.get('status'),
  });

  await db.insert(books).values({ userId, ...parsed });
  revalidatePath('/library');
}
```

> **In English:** `'use server'` at the top marks every export as a server-only function. The **Zod** schema (`AddBookSchema`) validates the form input — if `title` is empty or `status` isn't one of the three allowed values, `.parse()` throws before the DB sees bad data. After insert, `revalidatePath('/library')` tells Next.js to throw away its cache of that page so the new book shows up on next render.

```typescript
// In a client component:
<form action={addBook}>
  <input name="title" placeholder="Title" required />
  <input name="author" placeholder="Author" required />
  <select name="status">
    <option value="reading">Reading</option>
    <option value="finished">Finished</option>
    <option value="wishlist">Want to read</option>
  </select>
  <button type="submit">Add</button>
</form>
```

No API endpoint needed. No fetch calls. No JSON parsing. The form just works.

## Handling Loading and Error States

Real apps need to handle async states properly. Next.js gives you file-based conventions:

```
src/app/library/
  page.tsx          ← The page itself
  loading.tsx       ← Shown while page.tsx is loading
  error.tsx         ← Shown if page.tsx throws
  not-found.tsx     ← Shown for 404s
```

```typescript
// src/app/library/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading your library...</div>;
}
```

## Styling Tips

- Use Tailwind utility classes directly in JSX. Don't try to "clean them up."
- Use shadcn/ui components for anything pre-built (buttons, inputs, dialogs, dropdowns).
- For one-off components, just write Tailwind classes.
- For repeated patterns, extract a component (don't extract a CSS class).
- Use `cn()` from `lib/utils.ts` (shadcn provides this) for conditional classes.

## Working With the AI Coding Assistant

In 2026, you'll likely use Cursor or VS Code with Claude/Copilot. Best practices:

- **Inline completions** for boilerplate: yes, just accept them.
- **Chat for new features**: describe what you want, review the generated code carefully.
- **Agentic mode** (Claude Code, Cursor's compose) for multi-file changes: review every change.
- **Never blindly trust** AI-generated security-sensitive code (auth, payments, input validation).

The AI is excellent at generating "the obvious next code" — boilerplate, CRUD operations, UI scaffolding. It's worse at making good architectural decisions, especially in unfamiliar codebases.

:::note[Worked example: one feature, end-to-end]
"Mark a book as finished" — taking it through every step:

1. **Schema:** Already have `status` column. No change.
2. **Server Action:** Add `markFinished(bookId)` in `actions.ts` — verify userId owns the book, update status, `revalidatePath('/library')`.
3. **UI:** Add a "Mark Finished" button on `BookCard`. Since it's an interactive button calling a server action, it can either be a `<form action={...}>` in a Server Component or a Client Component with `useTransition`.
4. **Manual test:** Click the button locally, see the card update.
5. **Commit and push.** Vercel preview deploys.
6. **Test on the preview URL** (more representative than localhost).
7. **Merge / move on.**

Total time: 20–30 minutes. Avoid the trap of refactoring six other things while you're in there.
:::

:::info[Highlight: Server Components are the default for a reason]
Most "I need state here" instincts are wrong. You only truly need a Client Component when there's user input or animation. The book list itself doesn't need to be client-side — only the *button that opens the modal* does. Pushing `'use client'` as deep into the tree as possible keeps your JS bundle small and your pages fast.
:::

## What's next

→ Continue to [Phase 5: Adding Auth](./auth) where Clerk lets you skip building user accounts entirely.
