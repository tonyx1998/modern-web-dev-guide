---
id: cloud-serverless
title: Serverless & Event-Driven Patterns
sidebar_position: 9
sidebar_label: Serverless patterns
description: Event-driven architecture, fan-out, queue-backed workers, the cold-start and idempotency gotchas, and when serverless stops being the right answer.
---

# Serverless & Event-Driven Patterns

> **In one line:** Cheap, auto-scaling functions plus managed queues and events let you build systems as small pieces that react to things happening — which is wonderfully scalable and decoupled, and quietly demands that every piece be **idempotent**, observable, and tolerant of being retried.

:::tip[In plain English]
"Serverless" reframes a system from "a server that runs all the time and does everything" to "a bunch of small functions that wake up when something happens, do one thing, and go back to sleep." A user uploads a video → an event fires → a function transcodes it → it drops a message on a queue → another function generates thumbnails → another sends a notification. Nothing is running (or billing) when idle, each piece scales independently, and a slow step can't block the user's request. The price of admission: because the platform will sometimes run your function *twice* for the same event (that's how it guarantees "at least once"), every function has to be safe to run twice. Get idempotency right and event-driven serverless is one of the most powerful, cost-efficient patterns in the cloud.
:::

## The shift: request/response → event-driven

Traditional web architecture is synchronous: a request comes in, one process does all the work, a response goes out. Event-driven architecture decomposes that into **producers** that emit events and **consumers** that react, connected by queues/streams/event buses. The benefits map directly onto why [message queues](/docs/foundations/message-queues) exist:

- **Decoupling** — the uploader doesn't know or wait for the transcoder. Add a new consumer (e.g. "also run content moderation") without touching the producer.
- **Independent scaling** — the thumbnail step can scale to 100 workers while the notification step runs 2; each scales to its own load.
- **Resilience** — if the transcoder is down, messages wait in the queue instead of being lost; work resumes when it recovers (buffering).
- **Cost** — everything scales to (near) zero when idle.

```
                                  ┌────────────► [moderation fn]
upload  →  S3  ──"ObjectCreated"──┤
event       (event source)        ├────────────► [transcode fn] ──► SQS ──► [thumbnail fn]
                                  └────────────► [index fn]                      │
                                                                                 └─► [notify fn]
```

## Core patterns

**1. Queue-backed worker.** The workhorse. The web request does the minimum (validate, enqueue a job, return `202 Accepted` immediately); a separate function drains the queue and does the slow work. This keeps the request path fast and absorbs spikes — 10,000 uploads in a minute just make a longer queue, not a melted server. This is the cloud-native version of the [background-jobs pattern](/docs/stack/background-jobs).

**2. Fan-out.** One event triggers many independent consumers via a topic/event bus (SNS, EventBridge, Pub/Sub). "Order placed" fans out to billing, inventory, email, and analytics — each its own function, each able to fail and retry independently.

**3. Scheduled (cron) functions.** A managed scheduler (EventBridge Scheduler, Cloud Scheduler) invokes a function on a cron expression — nightly reports, cleanup jobs, polling — with no server to keep running for it.

**4. Step functions / orchestration.** For multi-step workflows with branching, retries, and waits (e.g. an order pipeline that needs human approval in the middle), a managed state machine (AWS Step Functions, Google Workflows) coordinates the functions so the *workflow* state lives in the platform, not in a fragile chain of functions calling functions.

:::info[Highlight: choreography vs orchestration]
Two ways to wire event-driven systems, and teams argue about them forever. **Choreography**: each service listens for events and reacts; there's no central brain (the fan-out diagram above). Decoupled and scalable, but the end-to-end flow is *emergent* — no single place tells you "what happens when an order is placed," which makes debugging a distributed scavenger hunt. **Orchestration**: a central workflow (Step Functions) explicitly drives the steps. Easier to see, monitor, and modify the flow; slightly more coupling to the orchestrator. Rule of thumb: choreography for loose, independent reactions; orchestration when the *sequence and its failure handling* are themselves business-critical and need to be legible.
:::

## The gotcha that defines serverless: at-least-once delivery → idempotency

Managed queues and event sources guarantee **at-least-once** delivery, not exactly-once. That means: a network hiccup, a visibility-timeout expiry, or a retry will sometimes deliver the **same message twice**, and your function will run twice for one logical event. If "process payment" runs twice, you double-charge a customer. The defense is **idempotency** — designing the function so running it twice has the same effect as running it once.

```javascript
// Idempotent handler: dedupe on a stable key so a re-delivered message is a no-op.
export async function handler(event) {
  for (const record of event.Records) {
    const { orderId, idempotencyKey } = JSON.parse(record.body);

    // Atomic "claim this key, or fail if already claimed."
    const firstTime = await tryClaim(idempotencyKey); // e.g. conditional insert / SETNX
    if (!firstTime) {
      console.log(`Skipping duplicate delivery for ${idempotencyKey}`);
      continue; // already processed — ack and move on
    }

    await chargeCustomer(orderId);  // the side effect we must not double-do
  }
}
```

The idempotency key is the linchpin: a stable identifier for the *logical operation* (an order ID, a request UUID the client generated), stored the first time you act on it, checked every time after. This is the same principle as [idempotency in distributed systems](/docs/distributed-systems/idempotency) — it shows up everywhere money or external side effects are involved.

:::note[Worked example: the dead-letter queue saves your pipeline]
A thumbnail function occasionally hits a corrupt image and throws. The queue, being "at least once," redelivers it. The function throws again. And again — forever — a *poison message* that blocks the queue and burns invocations in an infinite retry loop. The fix is a **dead-letter queue (DLQ)**: configure "after N failed deliveries, move this message to a separate queue." Now the poison message is parked (where an alarm fires and a human can inspect it) instead of jamming the pipeline, and the rest of the work flows. Every production queue should have a DLQ and an alarm on its depth — a non-empty DLQ is your early warning that something is systematically failing.
:::

## When serverless stops being the answer

Serverless is brilliant for spiky, event-driven, stateless work. It fights you when:

- **Long-running work.** Functions have execution caps (Lambda 15 min). Video encoding a feature film, training a model, a multi-hour job → use a container or batch service.
- **Sustained high throughput.** Past a steady, predictable load, always-on containers are *cheaper per request* than per-invocation billing. The crossover is real; do the math.
- **Latency-critical, no cold starts allowed.** Provisioned concurrency helps but costs; sometimes an always-warm service is simpler.
- **Stateful or sticky workloads.** WebSocket servers holding many live connections, in-memory stateful processing — awkward in pure functions.
- **Heavy local compute / big dependencies.** A 500MB ML model loaded per cold start is painful; keep it warm in a container.

The mature view: serverless is a *tool*, not a religion. Many great systems are *hybrid* — serverless for the spiky event-driven edges, containers for the steady core.

## Common mistakes

:::caution[Where people commonly trip up]
- **Assuming exactly-once delivery.** Queues are at-least-once; your functions *will* be re-invoked for the same event. Make every side-effecting handler idempotent or you'll double-charge, double-send, double-ship.
- **No dead-letter queue.** A poison message retries forever, jamming the pipeline and burning money. Always configure a DLQ + an alarm on its depth.
- **Chaining functions that call functions that call functions.** The flow becomes invisible and the failure handling ad hoc. Use a queue or an orchestrator so state and retries are explicit.
- **Ignoring the database connection limit.** (From the [compute page](./cloud-compute).) Thousands of concurrent functions exhaust DB connections — use a pooler.
- **Forcing long or steady-high workloads into functions.** You hit execution caps and overpay. Use containers/batch for sustained or long-running work; reserve functions for spiky, short tasks.
- **No idempotency key strategy.** "We'll just hope it doesn't double-fire" is a customer-facing bug waiting to happen. Decide the stable key per operation up front.
:::

## Page checkpoint

<Quiz id="cloud-serverless-page" title="Did serverless patterns stick?" sampleSize={3}>

<Question
  prompt="Cloud queues and event sources guarantee at-least-once delivery. What does this force every side-effecting handler to be?"
  options={[
    { text: "Stateless — it must not write to any database" },
    { text: "Idempotent — running it twice for the same event must have the same effect as running it once, because the platform will sometimes redeliver and re-invoke" },
    { text: "Synchronous — it must return a response immediately" },
    { text: "Single-threaded — it must process one message at a time" }
  ]}
  correct={1}
  explanation="At-least-once means duplicate deliveries happen (retries, timeouts, network hiccups), so your function will sometimes run twice for one logical event. Idempotency — typically a stable idempotency key you claim and check — ensures the duplicate is a safe no-op instead of a double charge."
  revisit={{ to: "/docs/cloud/cloud-serverless#the-gotcha-that-defines-serverless-at-least-once-delivery--idempotency", label: "At-least-once → idempotency" }}
/>

<Question
  prompt="A function keeps throwing on one corrupt message, which the queue redelivers endlessly, jamming the pipeline. What's the standard fix?"
  options={[
    { text: "Increase the function's memory" },
    { text: "Configure a dead-letter queue so after N failed deliveries the poison message is parked (with an alarm) instead of retrying forever" },
    { text: "Disable retries entirely" },
    { text: "Switch from a queue to synchronous HTTP calls" }
  ]}
  correct={1}
  explanation="A dead-letter queue moves a message that fails N times to a separate queue for inspection, unblocking the pipeline and stopping the infinite retry loop. A non-empty DLQ (with an alarm on its depth) is also your early warning that something is systematically failing."
  revisit={{ to: "/docs/cloud/cloud-serverless#the-gotcha-that-defines-serverless-at-least-once-delivery--idempotency", label: "Dead-letter queues" }}
/>

<Question
  prompt="Which workload is the WRONG fit for serverless functions, per the chapter?"
  options={[
    { text: "A spiky image-resize task triggered by uploads" },
    { text: "A nightly cleanup cron job" },
    { text: "A multi-hour video-encoding job with sustained high throughput — better served by containers/batch due to execution caps and per-request cost" },
    { text: "An event handler that fans out an 'order placed' event" }
  ]}
  correct={2}
  explanation="Functions have execution-time caps (e.g. 15 min) and per-invocation billing that gets expensive under sustained high load. Long-running or steady-high-throughput work belongs in containers or a batch service; functions shine for spiky, short, event-driven tasks."
  revisit={{ to: "/docs/cloud/cloud-serverless#when-serverless-stops-being-the-answer", label: "When serverless stops fitting" }}
/>

</Quiz>

## What's next

→ Continue to [Cost & FinOps](./cloud-cost) — why the bill surprises everyone, the five line items that blow up, and how to actually control spend.
