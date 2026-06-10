---
id: ds-transactions
title: Distributed Transactions & Sagas
sidebar_position: 8
sidebar_label: Transactions & sagas
description: Why two-phase commit is avoided, the saga pattern with compensating actions, the transactional outbox, and eventual consistency as the realistic model for multi-service work.
---

# Distributed Transactions & Sagas

> **In one line:** A single ACID transaction can't span multiple services/databases without the fragile, blocking two-phase commit — so instead of one all-or-nothing transaction you use a **saga**: a sequence of local transactions where each step has a *compensating action* to undo it, accepting eventual consistency in exchange for availability.

:::tip[In plain English]
On one database, a transaction is beautiful: a bunch of changes either *all* happen or *none* do (atomicity), and you never see a half-done state. The moment your work spans *multiple* services — each owning its own database, as microservices do — that guarantee is gone. "Place an order" might mean: charge the card (payment service), reserve inventory (inventory service), and create a shipment (shipping service) — three separate databases. There's no built-in way to make all three commit-or-rollback together without a notoriously fragile protocol (two-phase commit) that locks everything and falls apart if any participant hiccups. So the industry mostly *gave up* on cross-service atomic transactions and adopted a different model: do the steps one at a time, and if a later step fails, run **compensating actions** to undo the earlier ones (refund the card, release the inventory). That's a **saga** — and it trades the tidy "instantly all-or-nothing" for a realistic "eventually consistent, with explicit undo."
:::

## Why two-phase commit (2PC) is avoided

**Two-phase commit** is the textbook way to make multiple databases commit atomically: a coordinator asks every participant "can you commit?" (phase 1, *prepare*); if all say yes, it tells them "commit" (phase 2). It *works*, but it has crippling problems for internet-scale systems:

- **It's blocking.** Between prepare and commit, every participant holds locks and waits. If the coordinator crashes at the wrong moment, participants are stuck holding locks indefinitely — a single slow/failed participant freezes the whole transaction.
- **It's a availability killer (CP to the extreme).** All participants must be up and responsive for *any* transaction to complete. The probability that *all* services are healthy at once drops as you add services.
- **It doesn't fit the microservices/cloud model.** Many managed services and message systems don't support it; it couples services tightly to a shared coordinator.

So while 2PC exists (and is occasionally used within a tightly-controlled boundary), the dominant answer for cross-service work is: **don't.** Restructure so you don't need a distributed transaction — use a saga.

## The saga pattern

A **saga** breaks one distributed transaction into a sequence of **local** transactions (each atomic within its own service), where every step that has a side effect also defines a **compensating action** to semantically undo it if a later step fails.

```
 Place order saga (happy path → ):
   1. Payment: charge card        2. Inventory: reserve item     3. Shipping: create label
                                                                         │
 If step 3 FAILS, run compensations in reverse  ◄────────────────────────┘
   ↩ Inventory: release item      ↩ Payment: refund card        (order marked failed)
```

Two ways to coordinate the steps (the same [choreography vs orchestration](/docs/cloud/cloud-serverless) choice from the serverless chapter):

- **Choreography** — each service emits an event when its step is done; the next service listens and reacts. No central coordinator; decoupled, but the end-to-end flow is emergent and hard to trace.
- **Orchestration** — a central *saga orchestrator* explicitly drives the steps and triggers compensations on failure. Easier to see, monitor, and modify; slightly more coupling. For anything with non-trivial failure handling, orchestration is usually clearer.

:::info[Highlight: compensation is not rollback — and that difference is the whole mental shift]
A database rollback makes it as if the transaction *never happened* — no trace. A saga **compensation** is a *new action that semantically undoes* a completed one, and the difference matters:
- The original effect *did happen* and may have been *observed*. You charged the card (the customer saw the charge, maybe got an email); the compensation is a *refund*, not an un-charge. The history shows both.
- Compensations must themselves be **idempotent** and **always eventually succeed** (you can't "fail to refund" — retry until it works), which is why this leans on [idempotency](./idempotency) and reliable [messaging](./messaging-patterns).
- There's a window where the system is **partially complete and visibly inconsistent** (card charged, inventory not yet reserved). Sagas embrace eventual consistency: the system converges to a consistent end state (fully done, or fully compensated), but *not instantly*.

So designing a saga is really designing the *undo* for every step and accepting that "consistent" means "eventually," with observable intermediate states. That's a genuinely different way of thinking than the single-database transaction you started with — and it's the realistic model for any multi-service operation.
:::

## The dual-write problem and the transactional outbox

A subtle, extremely common bug: a service needs to **both** update its database **and** publish an event/message ("order created") — and these are two different systems, so they can't be one atomic transaction. If the DB commit succeeds but the message publish fails (or vice versa), your systems diverge: an order exists but nobody downstream was told, or an event fires for an order that didn't actually save. This is the **dual-write problem**.

The standard fix is the **transactional outbox**:

```
 In ONE local DB transaction:
   1. INSERT the order row
   2. INSERT an "order_created" event into an OUTBOX table   ← same transaction = atomic

 Separately, a relay process polls/streams the outbox table and publishes the
 events to the message broker, marking them sent. (Change Data Capture can do this.)
```

Because the business change *and* the intent-to-publish commit atomically in the *same* database, you never lose one without the other. The relay then guarantees the event is eventually published (at-least-once → consumers must be [idempotent](./idempotency)). The outbox is how you reliably bridge "I changed my data" and "I told the rest of the system" without a distributed transaction.

:::note[Worked example: the order that charged but never shipped]
Without sagas/outbox: an order service charges the card, then tries to call the shipping service, which is momentarily down. The charge already happened; the call fails; the code throws. The customer is charged for an order that will never ship, and there's no record coordinating a fix — a support nightmare and a refund done by hand. With a saga: the charge is step 1; when step 3 (shipping) fails after retries, the orchestrator runs the compensation chain — release inventory, *refund the card* — and marks the order failed, automatically. With the outbox: the "order created" event is written in the same transaction as the order, so shipping reliably *learns* about the order even if it was briefly down (it processes the event when it recovers). The combination turns "charged but never shipped, discovered by an angry email" into "the system detected the failure and either completed or cleanly reversed the whole thing." That reliability is the entire point of these patterns.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Reaching for two-phase commit across services.** It's blocking, fragile, and kills availability as you add participants. Restructure into a saga instead.
- **Doing a dual write (DB + message broker) without the outbox.** One can succeed while the other fails, diverging your systems. Write the event to an outbox table in the same DB transaction and relay it.
- **Forgetting compensations / treating saga undo like rollback.** Every side-effecting step needs an idempotent compensating action that always eventually succeeds; the original effect happened and may have been observed (refund, not un-charge).
- **Ignoring the partially-complete window.** Sagas are eventually consistent — there are visible intermediate states. Design the UI/business process to tolerate "in progress" and "being reversed."
- **Non-idempotent saga steps or compensations.** Retries (which sagas depend on) will double-apply them. Make every step and compensation idempotent.
- **Expecting instant cross-service atomicity.** It doesn't exist without 2PC's costs. Embrace eventual consistency with a guaranteed convergent end state.
:::

## Page checkpoint

<Quiz id="ds-transactions-page" title="Did transactions & sagas stick?" sampleSize={3}>

<Question
  prompt="Why is the saga pattern preferred over two-phase commit for multi-service operations?"
  options={[
    { text: "Sagas are atomic and instant like a single-DB transaction" },
    { text: "2PC is blocking and availability-killing (all participants hold locks and must be up; a crashed coordinator freezes everyone), so sagas instead use a sequence of local transactions with compensating undo actions, trading instant atomicity for availability and eventual consistency" },
    { text: "Sagas require fewer services" },
    { text: "2PC doesn't work with SQL databases" }
  ]}
  correct={1}
  explanation="2PC locks every participant between prepare and commit and stalls if the coordinator or any participant fails — unacceptable as services multiply. Sagas do steps as independent local transactions and undo earlier ones via compensating actions on failure, accepting eventual consistency."
  revisit={{ to: "/docs/distributed-systems/ds-transactions#why-two-phase-commit-2pc-is-avoided", label: "Why not 2PC" }}
/>

<Question
  prompt="How does a saga compensation differ from a database rollback?"
  options={[
    { text: "There's no difference; both erase the operation" },
    { text: "A rollback makes it as if the transaction never happened; a compensation is a NEW action that semantically undoes a completed, possibly-observed effect (e.g. a refund, not an un-charge) — it must be idempotent and always eventually succeed" },
    { text: "Compensations are faster than rollbacks" },
    { text: "A compensation only works within one database" }
  ]}
  correct={1}
  explanation="Saga steps already committed (and may have been seen by users/other systems), so you can't pretend they didn't happen. Compensation is a forward action that reverses the effect (refund the charge), and because sagas rely on retries it must be idempotent and reliably succeed."
  revisit={{ to: "/docs/distributed-systems/ds-transactions#the-saga-pattern", label: "Compensation vs rollback" }}
/>

<Question
  prompt="A service must update its database AND publish an 'order created' event, but they're separate systems. What's the dual-write problem and the standard fix?"
  options={[
    { text: "The database is too slow; fix by caching" },
    { text: "Either the DB commit or the message publish can succeed without the other, diverging your systems; the transactional outbox fixes it by writing the event to an outbox table in the SAME DB transaction, then relaying it to the broker" },
    { text: "Two writes deadlock; fix by retrying" },
    { text: "The event arrives before the data; fix by adding a delay" }
  ]}
  correct={1}
  explanation="Writing to two systems can't be atomic, so one can fail while the other succeeds (order saved but no event, or event with no order). The outbox commits the business change and the event together in one local transaction; a relay then guarantees the event is eventually published (at-least-once → idempotent consumers)."
  revisit={{ to: "/docs/distributed-systems/ds-transactions#the-dual-write-problem-and-the-transactional-outbox", label: "Outbox pattern" }}
/>

</Quiz>

## What's next

→ Continue to [Idempotency & exactly-once](./idempotency) — the property every retry, saga step, and message consumer in this chapter quietly depends on.
