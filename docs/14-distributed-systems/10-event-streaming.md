---
id: event-streaming
title: Event Streaming
sidebar_position: 11
sidebar_label: Event streaming
description: The log as a primitive, how Kafka works (partitions, offsets, consumer groups, retention), the queue-vs-log distinction, event sourcing, and when a stream is the right backbone.
---

# Event Streaming

> **In one line:** An event stream is an **append-only log** that many consumers can read independently and *replay* from any point — a fundamentally different primitive from a queue (where messages are consumed and deleted), and the basis for analytics pipelines, event sourcing, and decoupling whole architectures around "the log as the source of truth."

:::tip[In plain English]
A queue is like a to-do list: a worker takes a task off it, does it, and it's gone. A **log** (event stream) is like a tape recorder that never erases: events are appended in order and *stay there*, and any number of readers can play through the tape at their own pace, each remembering their own position — and crucially, you can *rewind* and replay history. This sounds like a small difference and it's transformative. Because the events aren't consumed-and-deleted, a new system can join later and read all of history to build up its own view; a buggy consumer can be fixed and re-run over the same events; analytics, search indexing, and notifications can all independently consume the same stream. **Kafka** is the dominant tool here, and "stream the events, let consumers derive what they need" has become a backbone pattern for data-intensive systems. It's the deep version of the [stream vs queue distinction](/docs/cloud/cloud-managed-data) from the cloud chapter.
:::

## The log: queue's more powerful cousin

```
 QUEUE: consume removes the message
   [ m1 m2 m3 ] ── worker takes m1 ──► [ m2 m3 ]   (m1 is gone forever)

 LOG (stream): append-only; reading does NOT remove; each consumer tracks an OFFSET
   offset:  0    1    2    3    4    5
            e0   e1   e2   e3   e4   e5   ◄── new events appended here
                      ▲              ▲
              analytics (at 2)   billing (at 4)   ← independent positions; can rewind
```

The defining properties of a log:
- **Append-only & ordered** within a partition — events have a stable position (**offset**).
- **Reading doesn't consume** — events persist for a **retention period** (hours, days, or forever) regardless of who's read them.
- **Multiple independent consumers** — each tracks its own offset, so adding a new consumer doesn't affect existing ones, and any consumer can **replay** from an earlier offset.

That replayability is the superpower a queue can't offer: the log *is a record of what happened*, not just a transport for work-to-do.

## How Kafka works (the model worth knowing)

Kafka is the de-facto event-streaming platform; its concepts recur in competitors (Pulsar, Redpanda, Kinesis):

- **Topic** — a named stream of events (e.g. `orders`).
- **Partition** — a topic is split into partitions for parallelism and scale; *order is guaranteed within a partition*, not across them. The **partition key** decides which partition an event lands in (all events for `order-42` → same partition → ordered together) — the [per-key ordering](./messaging-patterns) idea, concretely.
- **Offset** — an event's position within a partition. Consumers commit "I've processed up to offset N."
- **Consumer group** — a set of consumers that *share* the work of a topic: each partition is read by exactly one consumer in the group (so a group with 3 consumers can read 3 partitions in parallel). Different groups each get the *full* stream independently — which is how Kafka does both queue-like load-balancing (within a group) *and* pub/sub fan-out (across groups) with one mechanism.
- **Retention** — events are kept for a configured time/size (or compacted), enabling replay within that window.

```
                              consumer group "analytics"
   topic "orders"          ┌──► consumer A  (reads partition 0)
   ├─ partition 0  ───────►├──► consumer B  (reads partition 1)
   ├─ partition 1  ───────►└──► consumer C  (reads partition 2)   ← shares the work
   └─ partition 2  ──────────► consumer group "billing" (separate, gets the WHOLE stream)
```

This single design gives you: horizontal scale (add partitions + consumers), ordering where it matters (per key), parallelism across keys, and independent multi-consumer fan-out with replay.

:::info[Highlight: event sourcing — make the log the source of truth]
The most radical use of streaming: instead of storing the *current state* and overwriting it, store the **sequence of events** that produced it, and treat that log as the system of record. The current state is just a *projection* you compute by replaying the events. "Account balance = $50" becomes the fold of `+$100 deposit, −$30 withdrawal, −$20 withdrawal`. The benefits are striking — a complete audit trail for free (you have *every* change, not just the latest), the ability to reconstruct state at any past point in time, to build *new* read-views by replaying history (add a fraud-detection view next year over all past events), and to debug by replaying exactly what happened. The costs are equally real — it's a major complexity and mindset shift, queries over current state need maintained projections, events are immutable so "fixing" data means appending corrections, and schema evolution of old events is genuinely hard. Event sourcing is powerful and frequently *over-applied*: it shines for domains where the *history itself* is valuable (finance, audit-heavy, collaborative systems), and it's overkill for a standard CRUD app. The pattern is worth understanding deeply precisely so you can recognize the few places it's worth its weight — and resist it everywhere else, per [boring technology](/docs/decisions/boring-technology).
:::

## When a stream is the right backbone

Reach for event streaming when:
- **Multiple systems need the same events** independently (analytics + search index + notifications + audit all consuming `user_activity`).
- **You need replay** — reprocessing history after a bug fix, or building a new view from past data.
- **High-throughput ingestion** — clickstreams, IoT, logs, metrics: firehoses a queue would struggle with.
- **Decoupling via events** — services publish what happened; consumers derive what they need, added/removed without touching producers.

Reach for a simpler **queue** (not a log) when you just need to distribute *tasks* to workers and have no need to retain or replay them — don't stand up Kafka to send password-reset emails. And remember Kafka is operationally heavy; managed options (Confluent, MSK, Redpanda Cloud) exist precisely because running it yourself is a real undertaking — apply [build vs buy](/docs/decisions/build-vs-buy).

:::note[Worked example: one event, five consumers, zero coupling]
An e-commerce platform publishes a single `order_placed` event to a Kafka topic. Five independent consumer groups read it: **fulfillment** (ship it), **email** (send confirmation), **analytics** (update dashboards), **search** (reindex the customer's history), and **fraud** (score the order). None of them knows the others exist; the order service knows none of them — it just publishes the fact that an order happened. Six months later the team adds a **loyalty-points** consumer: it joins as a new consumer group and — because the log retains history — can *replay the last 30 days of orders* to backfill points, then continue live. No producer change, no coordination, no migration. *That* is the architectural payoff of the log: the producer states facts once, consumers independently derive value, and new value can be added later over both future *and past* events. Compare to direct calls, where the order service would need to know about and call all six systems synchronously — coupling that grows worse with every new consumer.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Using a log where a simple queue would do (and vice versa).** Don't run Kafka to distribute a few background tasks; don't use a delete-on-consume queue when multiple systems need the same events or you need replay.
- **Expecting global ordering across partitions.** Kafka orders within a partition only. Key by the entity whose order matters; cross-partition order isn't guaranteed.
- **Adopting event sourcing for a plain CRUD app.** It's a big complexity/mindset cost justified only where history itself is valuable (finance, audit, collaboration). Default to storing current state.
- **Forgetting consumers must still be idempotent.** Streams are at-least-once and replays re-deliver by design — consumers re-process events, so processing must be idempotent.
- **Underestimating operational weight.** Self-running Kafka is a serious commitment (brokers, partitions, rebalancing, retention tuning). Use a managed offering unless you have the expertise.
- **Setting retention without thinking about replay needs.** Too short and you lose the ability to backfill/replay; too long (uncompacted) and storage balloons. Match retention to how far back you'd ever need to replay.
:::

## Chapter wrap-up

Distributed systems are the theory under everything the cloud and operations chapters had you build. The throughline: **the network is unreliable and partial failure is normal, so you can't trust clocks or assume single delivery; you choose consistency deliberately per data type (CAP/PACELC), spread data with replication and partitioning, agree on reality through consensus, get multi-step work done with sagas instead of distributed transactions, and make every retryable side effect idempotent.** Master these and the production mysteries — stale reads, double charges, split brain, lost updates — become named, understood, designed-for properties instead of 3am surprises.

## Page checkpoint

<Quiz id="event-streaming-page" title="Did event streaming stick?" sampleSize={2}>

<Question
  prompt="What fundamentally distinguishes a log (event stream) from a queue?"
  options={[
    { text: "A log is faster than a queue" },
    { text: "In a queue, consuming removes the message; a log is append-only and reading doesn't consume — events persist for a retention period, multiple consumers read independently at their own offset, and any consumer can replay from an earlier point" },
    { text: "A log can only have one consumer" },
    { text: "A queue retains history; a log deletes immediately" }
  ]}
  correct={1}
  explanation="A queue transports work-to-do (consumed and deleted); a log is a retained, ordered record of what happened. Because reads don't remove events and each consumer tracks its own offset, new consumers can join and replay history — the superpower a queue lacks."
  revisit={{ to: "/docs/distributed-systems/event-streaming#the-log-queues-more-powerful-cousin", label: "Log vs queue" }}
/>

<Question
  prompt="In Kafka, how do consumer groups provide BOTH queue-like load balancing and pub/sub fan-out with one mechanism?"
  options={[
    { text: "By duplicating every message to every consumer" },
    { text: "Within a group, each partition is read by exactly one consumer (sharing the work = load balancing); different groups each independently receive the whole stream (= fan-out)" },
    { text: "By using a separate topic per consumer" },
    { text: "Consumer groups only do load balancing, not fan-out" }
  ]}
  correct={1}
  explanation="Partitions are divided among the consumers of a single group (parallel, work-sharing — queue semantics), while each distinct consumer group reads the entire topic on its own (independent copies — pub/sub semantics). One design covers both shapes."
  revisit={{ to: "/docs/distributed-systems/event-streaming#how-kafka-works-the-model-worth-knowing", label: "Consumer groups" }}
/>

<Question
  prompt="When is event sourcing (storing the sequence of events as the source of truth) worth its considerable complexity?"
  options={[
    { text: "Always — it's the modern default for every app" },
    { text: "For domains where the history itself is valuable (finance, audit-heavy, collaborative systems) — giving a full audit trail, point-in-time reconstruction, and replayable new views; it's overkill for a standard CRUD app" },
    { text: "Only for apps with a single database table" },
    { text: "Whenever you use Kafka" }
  ]}
  correct={1}
  explanation="Event sourcing makes the event log the system of record and derives current state by replay — powerful for audit trails, time-travel, and building new views from history, but a major complexity/mindset cost. It fits history-valuable domains and is over-applied elsewhere; default to storing current state."
  revisit={{ to: "/docs/distributed-systems/event-streaming#when-a-stream-is-the-right-backbone", label: "Event sourcing tradeoffs" }}
/>

</Quiz>

## What's next

→ You've finished the distributed-systems pillars. Take the [Chapter 7 checkpoint](./distributed-systems-checkpoint), then continue to [Chapter 8: AI Integration](/docs/ai) — the new standard layer in modern apps, and one that puts this chapter's reliability ideas to work in production.
