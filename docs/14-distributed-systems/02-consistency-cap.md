---
id: ds-consistency
title: Consistency & CAP
sidebar_position: 3
sidebar_label: Consistency & CAP
description: The consistency spectrum from strong to eventual, linearizability, the CAP theorem (and its common misreading), and PACELC's latency tradeoff.
---

# Consistency & CAP

> **In one line:** Once data is copied across machines, "what's the current value?" stops having one obvious answer — you choose a **consistency model** (from strong, where everyone always sees the latest write, to eventual, where replicas converge over time), and the CAP theorem says that *during a network partition* you must sacrifice either consistency or availability; PACELC adds that even when there's no partition, you trade consistency against latency.

:::tip[In plain English]
If your data lives on one machine, "the current value" is obvious — it's whatever's in memory. Once you keep *copies* on several machines (for durability, for read scaling, for being close to users worldwide), they can briefly disagree, and you have to decide how much disagreement you'll tolerate. **Strong consistency** means every read sees the most recent write, always, as if there were one copy — simple to reason about, but slower and fragile under network trouble. **Eventual consistency** means the copies will agree *eventually* if you stop writing, but in the meantime a read might return stale data — faster and more available, but you must design for "this might be a little out of date." The famous **CAP theorem** captures the unavoidable catch: when the network splits and machines can't reach each other, you can keep answering requests (stay available) *or* keep all copies in agreement (stay consistent), but not both. Which you pick depends entirely on what your data is — a bank balance and a like-count want opposite answers.
:::

## The consistency spectrum

"Consistent" isn't binary; it's a spectrum of guarantees, each weaker (and cheaper/faster/more available) than the last:

| Model | Guarantee | Feels like | Cost |
|---|---|---|---|
| **Linearizable / strong** | Every read sees the latest committed write, instantly, as if one copy exists | A single machine | Highest latency; unavailable under partition |
| **Sequential / causal** | Operations respect causal order (effects never seen before causes), but not necessarily real-time | "Replies never appear before the message they reply to" | Medium |
| **Read-your-writes** | A user always sees their *own* prior writes (others' may lag) | "My edit shows up for me immediately" | Low-ish, very common |
| **Eventual** | Replicas converge *if writes stop*; meanwhile may disagree | "Refresh and it'll be right soon" | Lowest; most available |

The art is matching the model to the data. A bank balance needs strong/linearizable consistency — showing a stale balance is unacceptable. A social media like-count is fine eventually consistent — "1,204 vs 1,207 likes for a few seconds" harms no one, and the availability/speed win is huge. **Most real systems mix models per data type within the same app.**

## Linearizability, concretely

**Linearizability** (the strongest single-object model) means: the system behaves as if there's exactly one copy of the data and every operation happens *atomically at some instant* between its start and finish. Once a write completes, *every* subsequent read — on any node — sees it (or something newer). No reader ever sees the value go "backwards." It's the intuitive "it just works like one machine" guarantee, and it's expensive precisely because providing it across machines requires coordination (often [consensus](./ds-consensus)) on every operation.

## The CAP theorem — and its constant misreading

CAP states: a distributed data store can guarantee at most **two** of:
- **C**onsistency — every read sees the latest write (here, specifically linearizability).
- **A**vailability — every request gets a (non-error) response.
- **P**artition tolerance — the system keeps working despite the network dropping messages between nodes.

The near-universal misreading is "pick any 2 of 3, like a menu." That's wrong in practice, because **partitions are not optional** — networks *will* fail, so P is mandatory for any real distributed system. Which means the *actual* choice CAP forces is binary and only applies **during a partition**:

```
          Network partition happens (nodes can't reach each other)
                              │
            ┌─────────────────┴──────────────────┐
        CP: stay CONSISTENT                  AP: stay AVAILABLE
        refuse/error on the side that        keep answering on both sides
        can't confirm it has the latest      with possibly-stale data;
        data → some requests fail            reconcile when the partition heals
   e.g. a bank ledger, a lock service   e.g. a shopping cart, likes, a CDN
```

So the real question is: *when the network splits, would you rather return an error (CP) or possibly-stale data (AP)?* For money and locks, error (CP). For carts, feeds, and counters, stale-but-available (AP). When there's *no* partition (the normal case), you get both C and A — CAP only bites during the failure.

:::info[Highlight: PACELC — the tradeoff you pay every day, not just during failures]
CAP only describes behavior *during a partition*, which is rare. **PACELC** completes the picture: **if Partition, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency.** The "Else" half is the one you pay constantly: even with a perfectly healthy network, providing strong consistency requires nodes to coordinate before answering — which *adds latency to every request*. Want every read to see the latest write across regions? You pay a round-trip to coordinate. Willing to accept slightly stale reads? You answer instantly from the nearest replica. So consistency isn't only a failure-time concern — it's a latency tax on every single operation, all the time. This is *why* eventually-consistent systems are fast: they've opted out of that tax. PACELC is the more useful lens for everyday design decisions than CAP itself.
:::

:::note[Worked example: same app, three different consistency choices]
A single e-commerce app deliberately uses three models:
- **Account balance / inventory decrement at checkout** → **strong/CP**. Overselling the last item or showing a wrong balance is unacceptable; during a partition, *refuse* the operation rather than risk a double-sell. Worth the latency and the occasional "try again."
- **Product reviews & ratings** → **eventual/AP**. A new review taking a few seconds to appear everywhere is invisible to users; prioritize availability and speed, reconcile asynchronously.
- **"Items in your cart"** → **read-your-writes**. *You* must always see what you just added (or you'll rage), but another device syncing a second later is fine.

Notice nobody picks "strong consistency for everything" — it would make the whole app needlessly slow and fragile — nor "eventual for everything" — it would corrupt money and inventory. **Consistency is a per-data-type decision**, and knowing the spectrum is what lets you make it deliberately instead of accidentally.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Reading CAP as 'pick any 2 of 3.'** Partition tolerance isn't optional in a real distributed system; the actual choice is C-vs-A *during a partition*. Frame it as "error or stale data when the network splits?"
- **Choosing one consistency model for the whole system.** Strong-everywhere is needlessly slow and fragile; eventual-everywhere corrupts money/inventory. Choose per data type.
- **Assuming strong consistency is 'correct' and eventual is 'buggy.'** Eventual consistency is a deliberate, valid tradeoff for data that tolerates brief staleness — and it's why such systems are fast and available.
- **Ignoring the everyday latency tax (PACELC's 'else').** Strong consistency costs coordination latency on *every* request, not just during failures. If reads are slow cross-region, over-strong consistency is a prime suspect.
- **Surprising users with eventual consistency on their own actions.** "I posted it but it's not there!" Use read-your-writes for a user's own data even if the rest is eventual.
:::

## Page checkpoint

<Quiz id="ds-consistency-page" title="Did consistency & CAP stick?" sampleSize={3}>

<Question
  prompt="What is the actual decision the CAP theorem forces, correcting the common 'pick 2 of 3' misreading?"
  options={[
    { text: "Choose any two of consistency, availability, partition tolerance as a permanent menu" },
    { text: "Because partitions are inevitable in a real distributed system, the real choice is what to do DURING a partition: stay consistent (return errors on the uncertain side, CP) or stay available (return possibly-stale data, AP)" },
    { text: "Always sacrifice partition tolerance to keep C and A" },
    { text: "Consistency and availability are the same property" }
  ]}
  correct={1}
  explanation="P isn't optional — networks fail — so you can't 'drop P.' CAP's real bite is during a partition: CP returns errors rather than risk stale/divergent data; AP keeps answering with possibly-stale data and reconciles later. When there's no partition you get both C and A."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-cap-theorem--and-its-constant-misreading", label: "CAP corrected" }}
/>

<Question
  prompt="A bank balance, product reviews, and a user's shopping cart in one app should use which consistency models?"
  options={[
    { text: "Strong consistency for all three, to be safe" },
    { text: "Strong/CP for the balance (no stale money/oversell), eventual/AP for reviews (brief lag is invisible), and read-your-writes for the cart (you must see your own changes)" },
    { text: "Eventual consistency for all three, for speed" },
    { text: "It doesn't matter; the database decides automatically" }
  ]}
  correct={1}
  explanation="Consistency is a per-data-type decision. Money/inventory need strong consistency; reviews tolerate eventual; a user's cart needs read-your-writes so they always see their own additions. Strong-everywhere is needlessly slow; eventual-everywhere corrupts money."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-consistency-spectrum", label: "Per-data-type choice" }}
/>

<Question
  prompt="What does PACELC add beyond CAP that makes it more useful for everyday design?"
  options={[
    { text: "It proves you can have all three of C, A, and P" },
    { text: "It says that even with NO partition (the normal case), you trade Consistency against Latency — strong consistency requires coordination that adds latency to every request, so consistency is a daily cost, not just a failure-time one" },
    { text: "It replaces availability with durability" },
    { text: "It only applies to single-machine databases" }
  ]}
  correct={1}
  explanation="CAP only describes partitions (rare). PACELC's 'Else' clause covers normal operation: providing strong consistency means nodes coordinate before answering, adding latency to every request. That's why eventually-consistent systems are fast — they've opted out of that constant tax."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-cap-theorem--and-its-constant-misreading", label: "PACELC" }}
/>

</Quiz>

## What's next

→ Continue to [Replication](./ds-replication) — the mechanics of keeping those copies, and the knobs that set where you land on the consistency spectrum.
