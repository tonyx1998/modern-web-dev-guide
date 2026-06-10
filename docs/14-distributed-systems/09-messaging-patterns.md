---
id: messaging-patterns
title: Messaging Patterns
sidebar_position: 10
sidebar_label: Messaging patterns
description: Delivery semantics, queues vs pub/sub, ordering guarantees and why they cost throughput, deduplication, dead-letter queues, and backpressure in message systems.
---

# Messaging Patterns

> **In one line:** Messaging connects services asynchronously so they don't have to be up at the same time — and the design space is defined by a few hard tradeoffs (queue vs pub/sub, ordering vs throughput, at-least-once delivery forcing idempotent consumers) plus the operational must-haves: dead-letter queues and backpressure.

:::tip[In plain English]
Instead of service A calling service B directly (and failing if B is down or slow), A drops a *message* into a broker, and B picks it up when it can. This decoupling is the backbone of resilient distributed systems — but it comes with a set of choices you have to make deliberately. Do you want each message handled by *one* worker (a **queue**, for tasks) or broadcast to *many* independent subscribers (**pub/sub**, for events)? Do messages need to be processed strictly *in order* (which, it turns out, fights against processing them *fast*)? And since brokers deliver *at-least-once* (from the [idempotency page](./idempotency)), your consumers must tolerate duplicates. Get these right, plus a place for messages that repeatedly fail (a **dead-letter queue**) and a way to say "slow down, I'm full" (**backpressure**), and messaging becomes the reliable glue of your architecture instead of a source of mysterious lost or duplicated work.
:::

## Queue vs pub/sub: the two core shapes

```
 QUEUE (point-to-point): one message → exactly ONE consumer processes it
   producer ──► [ queue ] ──► worker (one of a pool takes each message)
   Use for: task/work distribution — "resize this image", "send this email"

 PUB/SUB (fan-out): one message → EVERY subscriber gets its own copy
   publisher ──► [ topic ] ──┬──► billing service
                             ├──► email service
                             └──► analytics service
   Use for: events that multiple independent systems react to — "order placed"
```

A **queue** load-balances work across a pool of consumers (each message done once); a **topic** broadcasts events to all interested subscribers (each gets its own copy). Many systems support both shapes; the question is "one handler or many?" (This is the same distinction as [SQS vs SNS/Kinesis](/docs/cloud/cloud-managed-data), now with the reasoning.)

## Delivery semantics (recap, because it drives everything)

From [idempotency](./idempotency): **at-most-once** (may lose), **at-least-once** (may duplicate, the safe default), exactly-once-delivery (impossible). Practically every important message system is at-least-once, which means the governing rule of messaging is: **consumers must be idempotent.** This isn't optional polish — it's the contract that makes the whole asynchronous model correct.

## Ordering: the guarantee that fights throughput

A frequent requirement: process messages *in order* (apply "account created" before "account updated"). Here's the tension nobody expects at first — **strict ordering and high throughput are in direct opposition**:

- To process fast, you want *many* consumers working in *parallel*. But parallel workers finish at different times, so global order is lost.
- To preserve order, messages must be processed *sequentially* — effectively one consumer for the ordered set — which caps throughput.

The standard compromise is **partial (per-key) ordering**: guarantee order only *within a partition/key*, not globally. All messages for `account-42` go to the same partition and are processed in order *relative to each other*; messages for different accounts process in parallel. You get order where it matters (per entity) and parallelism across entities. This is exactly how Kafka partitions and SQS FIFO message-groups work — and it's why choosing the partition/group key well (the entity whose order matters) is the key design decision. Demanding *global* total ordering is usually a sign you haven't identified the real ordering requirement, and it'll cost you all your throughput.

:::info[Highlight: dead-letter queues — the message that can't be processed]
A message that *always* fails — malformed payload, references a deleted record, triggers a bug — is a **poison message**. Under at-least-once redelivery, the broker keeps redelivering it, the consumer keeps failing, and it either blocks the queue (if ordered) or burns resources in an infinite retry loop forever. The standard safety valve is a **dead-letter queue (DLQ)**: after N failed attempts, the broker moves the message to a separate queue instead of redelivering it. Now the poison message is *parked* — out of the way, preserved for inspection, with an alarm on the DLQ's depth so a human knows something is systematically failing — and the rest of the work flows. Two operational rules follow: **every production queue needs a DLQ**, and **a non-empty DLQ is an alert, not a place messages quietly go to die.** Teams that skip the DLQ discover poison messages the hard way (a jammed pipeline); teams that skip the *alarm* discover that thousands of failed messages piled up unnoticed. This is the same pattern flagged in the [serverless chapter](/docs/cloud/cloud-serverless) — it recurs because at-least-once delivery guarantees you'll eventually meet a message you can't process.
:::

## Backpressure: letting the consumer set the pace

If producers emit faster than consumers can process, something has to give. Without **backpressure**, the broker's queue grows unbounded — memory fills, latency balloons, and eventually it falls over (and you've lost the messages it couldn't hold). Backpressure is the mechanism by which a slow consumer signals "I'm full, slow down," propagating the limit back to the producer instead of silently buffering to death. In practice: bounded queues that reject or block when full, consumer-driven *pull* models (the consumer asks for the next batch when ready, rather than being pushed at), and explicit flow-control credits. The principle is the messaging echo of [load shedding](/docs/operations/reliability-patterns): when overwhelmed, a system that *admits* its limit (applies backpressure, sheds, or buffers to disk like a log) survives; one that accepts everything into memory crashes.

:::note[Worked example: choosing the message-group key]
A payments team uses a FIFO queue to process account events and sets the de-dup/ordering scope to the *whole queue* — strict global ordering. It's correct but agonizingly slow: every event in the entire system processes one-at-a-time, and during a spike the backlog grows for hours. The insight: they don't need *global* order — they need events for *the same account* to stay ordered (you must apply account-42's "deposit" before its "withdraw"); account-42 and account-99 have no ordering relationship at all. They switch the ordering scope to **per-account (message-group = account_id)**. Now thousands of accounts process in parallel while each account's events stay correctly ordered. Throughput jumps ~100x with zero correctness loss. The lesson: *ordering is almost always a per-entity requirement, not a global one* — find the entity, key on it, and you keep correctness without sacrificing parallelism.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Non-idempotent consumers on at-least-once brokers.** Duplicates are guaranteed; un-deduped consumers double-process. Make consumers idempotent (dedupe on message ID).
- **Demanding global total ordering.** It serializes all processing and destroys throughput. Identify the entity whose order matters and use per-key/partition ordering.
- **No dead-letter queue.** A poison message retries forever, jamming the pipeline or burning resources. Configure a DLQ + an alarm on its depth.
- **Treating the DLQ as a silent graveyard.** Messages landing in the DLQ mean something is systematically broken; alert on it and triage, don't ignore it.
- **No backpressure / unbounded queues.** Producers outrunning consumers grow the queue until memory dies. Use bounded queues, pull-based consumption, or durable log buffering.
- **Using pub/sub where you needed a queue (or vice versa).** Fan-out when you wanted one handler causes duplicate work; a single queue when you needed many independent reactions causes missed processing. Match the shape to "one handler or many?"
:::

## Page checkpoint

<Quiz id="messaging-patterns-page" title="Did messaging patterns stick?" sampleSize={3}>

<Question
  prompt="Why do strict message ordering and high throughput conflict, and what's the standard compromise?"
  options={[
    { text: "They don't conflict; you can always have both" },
    { text: "High throughput needs many parallel consumers (which lose global order), while strict order needs sequential processing (which caps throughput); the compromise is per-key/partition ordering — order within an entity, parallelism across entities" },
    { text: "Ordering requires encryption, which is slow" },
    { text: "Throughput is limited by the broker's disk, not ordering" }
  ]}
  correct={1}
  explanation="Parallel workers finish out of order; preserving global order forces sequential processing. Partial (per-key) ordering resolves it: route all messages for one entity (e.g. account_id) to one partition/group so they stay ordered relative to each other, while different entities process in parallel."
  revisit={{ to: "/docs/distributed-systems/messaging-patterns#ordering-the-guarantee-that-fights-throughput", label: "Ordering vs throughput" }}
/>

<Question
  prompt="What is a dead-letter queue and what two operational rules accompany it?"
  options={[
    { text: "A backup queue for old messages; rule: delete it weekly" },
    { text: "A separate queue where messages that fail N times are parked instead of redelivered forever; rules: every production queue needs one, and a non-empty DLQ should raise an alert (not be a silent graveyard)" },
    { text: "A queue for low-priority messages; rule: process it last" },
    { text: "A queue that encrypts failed messages; rule: rotate keys" }
  ]}
  correct={1}
  explanation="A DLQ catches poison messages after repeated failures so they stop jamming the pipeline or looping forever, preserving them for inspection. Always configure one, and alarm on its depth — messages arriving there mean something is systematically failing and needs triage."
  revisit={{ to: "/docs/distributed-systems/messaging-patterns#backpressure-letting-the-consumer-set-the-pace", label: "Dead-letter queues" }}
/>

<Question
  prompt="When should you use pub/sub (a topic) rather than a queue?"
  options={[
    { text: "When you want each message processed by exactly one worker" },
    { text: "When one event should be delivered to MANY independent subscribers that each react on their own (e.g. 'order placed' → billing, email, analytics); a queue is for distributing tasks to one consumer each" },
    { text: "When messages must be processed in strict order" },
    { text: "When you need the fastest possible throughput" }
  ]}
  correct={1}
  explanation="Pub/sub fans one message out to every subscriber (each gets a copy) — right when multiple systems independently react to an event. A queue load-balances each message to a single consumer — right for distributing units of work. Match the shape to 'one handler or many?'"
  revisit={{ to: "/docs/distributed-systems/messaging-patterns#queue-vs-pubsub-the-two-core-shapes", label: "Queue vs pub/sub" }}
/>

</Quiz>

## What's next

→ Continue to [Event streaming](./event-streaming) — the log as a fundamental primitive, and how Kafka turns "a sequence of events" into a backbone for entire architectures.
