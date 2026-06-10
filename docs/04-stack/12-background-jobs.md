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

## Common mistakes

:::caution[Where people commonly trip up]
- **Calling slow APIs inline in the HTTP handler "just for now."** The user waits 12 seconds for the email service to respond, the request times out, and you've also blocked a worker the whole time. Push it to a job from the start — it's a 5-line change later you'll wish you'd made earlier.
- **Non-idempotent job handlers.** Queues retry. If your "charge the customer" job runs twice on a transient failure, you charge twice. Always key off an idempotency token (the order ID, the event ID) and check before doing the side effect.
- **Setting up BullMQ + Redis for a side project that runs one nightly cron.** That's wildly overkill — a platform cron + a route handler is enough. Reach for a real queue when you have retries, fan-out, scheduling, *and* monitoring needs.
- **Skipping a dead-letter queue / failure dashboard.** Jobs fail silently — a worker dies, a payload is malformed, an external API throws — and you don't notice until a user complains a week later. Trigger.dev/Inngest dashboards show this for free; with BullMQ you have to wire it up.
- **Running long jobs inside serverless functions with short timeouts.** A Vercel function dies at 15s (or 5m on Pro); a Cloudflare Worker has tight CPU limits. If your job runs for minutes, use Trigger.dev/Inngest (durable, long-running by design) rather than fighting the platform.
- **Mutating job payloads in-place.** Treat payloads as immutable inputs. If you need to track progress, write to your DB — not the job record.
:::

## Page checkpoint

<Quiz id="stack-background-jobs-page" title="Did background jobs stick?" sampleSize={3}>

<Question
  prompt="Why push slow work (sending email, generating PDFs, syncing slow APIs) into a background job instead of doing it inside the HTTP request?"
  options={[
    { text: "Background jobs are required by HTTP/2" },
    { text: "HTTP requests should be fast — users wait for them. The endpoint should enqueue the task and return immediately, while a worker handles it later" },
    { text: "Browsers refuse to render responses larger than 1KB" },
    { text: "Database connections expire if the request takes longer than 500ms" }
  ]}
  correct={1}
  explanation="Users wait for HTTP responses, so long-running work has to be moved off the request path. The endpoint enqueues the job and returns; a worker process picks it up and runs it asynchronously."
  revisit={{ to: "/docs/stack/background-jobs#triggerdev", label: "Why background jobs" }}
/>

<Question
  prompt="What does Trigger.dev give you beyond just 'run this function later'?"
  options={[
    { text: "An ORM that handles your database schema" },
    { text: "Automatic retries with exponential backoff on failure, plus an observability dashboard" },
    { text: "A built-in payment processor" },
    { text: "A frontend component library" }
  ]}
  correct={1}
  explanation="Trigger.dev tasks are durable: if `run` throws, the platform retries with exponential backoff automatically. You also get a dashboard for inspecting runs, failures, and retries."
  revisit={{ to: "/docs/stack/background-jobs#triggerdev", label: "Trigger.dev section" }}
/>

<Question
  prompt="On a side project, what's the lightest-weight way to handle background work before adopting a real queue?"
  options={[
    { text: "Spin up a Kubernetes cluster with BullMQ workers" },
    { text: "Use platform cron (e.g., Vercel Cron Jobs), `waitUntil()` in route handlers, or a 'we'll email you when done' UX" },
    { text: "Block the HTTP request and hope users don't notice" },
    { text: "Set up Temporal with multi-step workflows" }
  ]}
  correct={1}
  explanation="On day one, you usually don't need a real queue. Platform cron, `waitUntil()` (do work after returning the response), and async-by-email UX patterns handle most needs until you have multiple tasks, retries, and monitoring requirements."
  revisit={{ to: "/docs/stack/background-jobs#decision-matrix", label: "Cheapest background job" }}
/>

<Question
  prompt="When does Temporal earn its complexity over Trigger.dev/Inngest or BullMQ?"
  options={[
    { text: "Whenever you need to send a single transactional email" },
    { text: "Complex, long-running, multi-step business processes (multi-step approvals, financial transactions, etc.)" },
    { text: "For replacing your build tool" },
    { text: "Only for Ruby applications" }
  ]}
  correct={1}
  explanation="Temporal is heavy-duty workflow orchestration. Reach for it when you genuinely have complex, durable, multi-step business processes — not for simple 'send an email later' work."
  revisit={{ to: "/docs/stack/background-jobs#temporal", label: "Temporal section" }}
/>

</Quiz>

## What's next

→ Continue to [Services](./services) — payments, email, files, video, maps, and the other boring-but-essential services every app needs.
