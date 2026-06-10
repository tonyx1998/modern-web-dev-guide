---
id: ds-time
title: Time & Ordering
sidebar_position: 6
sidebar_label: Time & ordering
description: Why wall clocks can't order distributed events, Lamport logical clocks, vector clocks and causality, last-write-wins hazards, and Google's TrueTime.
---

# Time & Ordering

> **In one line:** You cannot trust wall-clock timestamps to order events across machines — clocks drift and disagree by milliseconds-to-seconds — so distributed systems use **logical clocks** (counters that capture *causality* rather than real time) to answer "what happened before what," and "last write wins by timestamp" is a quietly dangerous default that can silently drop data.

:::tip[In plain English]
On one computer, ordering events is trivial: there's one clock, and earlier timestamps happened earlier. Across many computers, this breaks, because **every machine's clock is slightly different** — they drift apart and the syncing protocol (NTP) only corrects them to within milliseconds at best, sometimes worse. So if machine A stamps an event 12:00:00.100 and machine B stamps another 12:00:00.090, you *cannot* conclude B's happened first — B's clock might just be running fast. This matters enormously when two events touch the same data: if you decide conflicts by "whichever timestamp is later wins," and the clocks are skewed, you can throw away the write that *actually* happened later. The fix is to stop relying on physical time for ordering and instead track **causality** — "this event knew about that one" — using logical counters. It's one of the most mind-bending ideas in the field and one of the most practically important.
:::

## Why physical clocks fail for ordering

Two reasons wall clocks can't order distributed events:

1. **Clock skew.** No two machines agree exactly. NTP keeps them within ~milliseconds (sometimes tens of ms, occasionally worse under load or misconfiguration). For events that happen close together — which is exactly when ordering *matters* (concurrent edits) — the skew can exceed the real time gap, so timestamps lie about order.
2. **Clocks can jump backwards.** NTP corrections, leap seconds, and VM migrations can make a clock go *backwards*. Code that assumes "time only moves forward" (e.g. computing durations, or using `now()` as an ever-increasing ID) breaks. (Use a **monotonic clock** for measuring elapsed time — it never goes backward — and the wall clock only for "what time is it for humans.")

The consequence: a timestamp tells you roughly *when* something happened in human terms, but it is **not** a reliable way to decide *order* between events on different machines.

## Happens-before and logical clocks

The foundational idea (Lamport, 1978): forget physical time; define ordering by **causality**. Event A "happens-before" B if A *could have influenced* B — A and B are on the same node with A first, or A is a message-send and B is its receipt. If neither can have influenced the other, they're **concurrent** (genuinely unordered — and that's a valid answer).

A **Lamport clock** implements this with a simple counter per node:

```
Each node keeps a counter C.
- On any local event:        C = C + 1
- When SENDING a message:    C = C + 1; attach C to the message
- When RECEIVING a message:  C = max(C_local, C_message) + 1
```

The guarantee: if A happens-before B, then `C(A) < C(B)`. So Lamport timestamps give a *consistent ordering* that respects causality, with no synchronized clocks needed. The limitation: the converse isn't true — `C(A) < C(B)` does **not** prove A happened-before B (they might be concurrent). Lamport clocks can *order* causally-related events but can't *detect* concurrency.

## Vector clocks: detecting concurrency

To actually tell "A caused B" from "A and B are concurrent," you need a **vector clock**: each node tracks a vector of counters — one entry *per node* — so you can compare what each event "knew about." Comparing two vectors yields one of three answers (which a single number never could):

```
 V(A) < V(B) elementwise   → A happened-before B
 V(B) < V(A) elementwise   → B happened-before A
 neither (each leads in     → A and B are CONCURRENT — a real conflict
   some dimension)            that the application must resolve
```

That third outcome is the payoff: vector clocks **detect genuine concurrent conflicts** instead of silently picking a "winner." Dynamo-style stores (Cassandra, DynamoDB lineage) use vector-clock-like versioning so that when two clients edit the same key concurrently, the system can *surface* "these conflict, you decide" rather than quietly dropping one.

:::info[Highlight: "last write wins" is how you silently lose data]
The most common conflict-resolution strategy is **last-write-wins (LWW)**: when two writes conflict, keep the one with the later timestamp. It's appealing because it's trivial — but it's built on the lie this whole page debunks: *that timestamps reliably order events.* With clock skew, the "later" timestamp may belong to the write that actually happened *earlier*, so LWW **discards the genuinely newer write — silently, with no error.** Two users edit a document a second apart; the wrong machine's clock is fast; the first edit "wins"; the second user's work vanishes and nobody gets an error. LWW is acceptable only when losing a concurrent write is genuinely fine (e.g. a cache, a presence indicator). For anything where every write matters, you need real conflict *detection* (vector clocks) and a real merge strategy — or [CRDTs](/docs/foundations/crdts), which are designed so concurrent edits *merge* instead of one winning. "We'll just use last-write-wins" deserves a hard second look every time.
:::

:::note[Worked example: Google's TrueTime — buying back real time]
If physical clocks are unreliable, why not make them reliable? That's exactly what Google did for Spanner (its globally-distributed SQL database) with **TrueTime**: GPS receivers and atomic clocks in every data center shrink clock uncertainty to a *known, tiny bound* (a few milliseconds), and — crucially — the API returns an *interval* `[earliest, latest]` rather than a single instant, so the system *knows how wrong it might be*. Spanner then "waits out the uncertainty": before committing, it waits the few milliseconds of possible skew so that timestamps become globally meaningful for ordering. This lets Spanner offer external consistency (essentially linearizable transactions) across continents — something normally impossible — by spending money on hardware to *bound* time uncertainty rather than pretending it's zero. The lesson isn't "buy atomic clocks"; it's that the time problem is real enough that the most advanced system in the world solved it with *physics*, and everyone else copes with logical clocks and conflict detection.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Ordering distributed events by wall-clock timestamp.** Clock skew makes timestamps unreliable for ordering, especially for near-simultaneous events. Use logical clocks for causal order.
- **Defaulting to last-write-wins.** It silently drops the genuinely-newer write when clocks are skewed. Use it only where losing a concurrent write is acceptable; otherwise detect conflicts (vector clocks) or merge (CRDTs).
- **Using the wall clock to measure elapsed time.** It can jump backward (NTP, leap seconds). Use a monotonic clock for durations and timeouts.
- **Generating "increasing" IDs from `now()`.** Backward clock jumps and skew break uniqueness/order. Use proper ID schemes (UUIDv7, Snowflake-style) designed for distributed generation.
- **Assuming concurrent edits can't happen 'because writes are fast.'** Concurrency is about causality, not speed; two users a second apart are concurrent if neither saw the other's write. Design for it.
:::

## Page checkpoint

<Quiz id="ds-time-page" title="Did time & ordering stick?" sampleSize={3}>

<Question
  prompt="Why can't you reliably order events on different machines by their wall-clock timestamps?"
  options={[
    { text: "Timestamps are stored as strings" },
    { text: "Clocks drift and disagree (NTP only syncs to ~milliseconds, and clocks can even jump backward), so for near-simultaneous events the skew can exceed the real gap — the 'later' timestamp may belong to the earlier event" },
    { text: "Time zones aren't accounted for" },
    { text: "Wall clocks have too few decimal places" }
  ]}
  correct={1}
  explanation="No two machine clocks agree exactly; NTP bounds skew to roughly milliseconds and clocks can jump backward. Precisely when ordering matters (concurrent edits), skew can exceed the real time difference, so timestamps lie about order. Logical clocks capture causal order instead."
  revisit={{ to: "/docs/distributed-systems/ds-time#why-physical-clocks-fail-for-ordering", label: "Clock skew" }}
/>

<Question
  prompt="What can a vector clock tell you that a single Lamport timestamp (or a wall clock) cannot?"
  options={[
    { text: "The exact real-world time an event occurred" },
    { text: "Whether two events are causally ordered OR genuinely concurrent — letting the system detect a real conflict instead of silently picking a winner" },
    { text: "Which node has the fastest CPU" },
    { text: "The network latency between nodes" }
  ]}
  correct={1}
  explanation="A vector clock (a counter per node) lets you compare what each event 'knew about': one happened-before the other, or — when neither dominates — they're concurrent. That third outcome surfaces genuine conflicts for resolution, which a single number can't distinguish from ordering."
  revisit={{ to: "/docs/distributed-systems/ds-time#vector-clocks-detecting-concurrency", label: "Vector clocks" }}
/>

<Question
  prompt="Why is 'last-write-wins by timestamp' a dangerous default for conflict resolution?"
  options={[
    { text: "It's too slow to compute timestamps" },
    { text: "It relies on timestamps reliably ordering events, which clock skew breaks — so it can silently discard the genuinely newer write (e.g. one user's edit vanishes) with no error" },
    { text: "It requires synchronized atomic clocks to work at all" },
    { text: "It always keeps both versions, doubling storage" }
  ]}
  correct={1}
  explanation="LWW assumes the later timestamp = the later event, but skewed clocks can invert that, so LWW drops the actually-newer write silently. It's fine only where losing a concurrent write is acceptable; otherwise use conflict detection (vector clocks) or merge-by-design (CRDTs)."
  revisit={{ to: "/docs/distributed-systems/ds-time#happens-before-and-logical-clocks", label: "LWW hazard" }}
/>

</Quiz>

## What's next

→ Continue to [Consensus](./ds-consensus) — how a group of nodes agrees on a single value (like "who is the leader") despite skewed clocks, lost messages, and partial failure.
