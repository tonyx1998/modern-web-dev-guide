---
id: background-jobs
title: Background Jobs
sidebar_position: 13
sidebar_label: Background Jobs
description: Long-running or scheduled work that shouldn't block HTTP requests. Trigger.dev, Inngest, BullMQ, Sidekiq, Celery, Temporal.
---

# Background Jobs

> **In one line:** When a task takes more than a few hundred milliseconds, push it off the HTTP request and into a background job. Trigger.dev and Inngest dominate the modern TypeScript landscape.

:::tip[In plain English]
HTTP requests should be fast — users wait for them. If a task is going to take 30 seconds (send an email, generate a PDF, sync data from a slow API), don't make the user wait. Instead, your endpoint *queues* the task and returns immediately. A separate **worker** picks up the task and runs it later. That whole pattern is called "background jobs."
:::

## Trigger.dev

Modern, TypeScript-native job runner. Functions feel like normal code:

```typescript
import { task } from '@trigger.dev/sdk';

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: { userId: string }) => {
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    await resend.emails.send({ to: user.email, ... });
  },
});

// Trigger it from a route handler:
await sendWelcomeEmail.trigger({ userId: '42' });
```

> **In English:** Define a task with a unique `id` and a `run` function — that function will execute on Trigger.dev's worker infrastructure, *not* during the original HTTP request. Calling `.trigger(...)` from your route just *enqueues* the work and returns immediately, so your user doesn't wait for the email to send. If the function throws, Trigger.dev retries with exponential backoff automatically.

**Strengths:** Excellent DX, durable (retries on failure), good observability dashboard.

## Inngest

Event-driven workflow engine. Similar to Trigger.dev with a different model (events trigger functions).

## BullMQ

Redis-backed job queue for Node.js. Self-hosted classic. Lower-level than Trigger.dev/Inngest but more control.

## Sidekiq (Ruby)

The Ruby standard. Battle-tested.

## Celery (Python)

The Python standard. Powerful, complex.

## Temporal

Heavy-duty workflow orchestration. Use for complex, long-running business processes (multi-step approvals, financial transactions, etc.).

## Decision matrix

| Need                                   | Recommendation       |
|----------------------------------------|----------------------|
| TypeScript app, modern DX              | Trigger.dev or Inngest |
| Self-hosted, full control              | BullMQ + Redis       |
| Ruby app                                | Sidekiq             |
| Python app                              | Celery              |
| Complex multi-step business workflows  | Temporal             |

:::info[Highlight: the cheapest background job for a beginner]
You don't need a job queue on day one. For a side project, you can:

1. Use **Vercel Cron Jobs** (or any platform's built-in cron) to schedule periodic tasks.
2. Use **`waitUntil()`** in your Next.js route handler to do work *after* returning the response.
3. Push the user to a "we'll email you when done" pattern for slow tasks.

Add a real job queue when you have *multiple* background tasks, need retries with backoff, or need to monitor failures. Until then, simpler is better.
:::

## What's next

→ Continue to [Services](./services) — payments, email, files, video, maps, and the other boring-but-essential services every app needs.
