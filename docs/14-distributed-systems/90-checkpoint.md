---
id: distributed-systems-checkpoint
title: Chapter 7 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 7 — Distributed Systems. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 8.
---

# Chapter 7 Checkpoint

You've finished the Distributed Systems chapter. Make sure the deep concepts stuck — partial failure, consistency/CAP, replication, partitioning, time/ordering, consensus, sagas, and idempotency.

There are **15 questions in the bank** — each visit picks 5 at random. Miss one and the result card links you back to the exact section.

You must pass (≥ 67%) to unlock the Next button and Chapter 8 in the sidebar.

<Quiz id="distributed-systems-checkpoint" title="Distributed Systems checkpoint" sampleSize={5}>

<Question
  prompt="A checkout calls a payment service, gets no response, assumes failure, and retries — double-charging. What distributed-systems truth was violated?"
  options={[
    { text: "The network was too slow" },
    { text: "'No response' ≠ 'failed' — the charge may have succeeded with a lost reply; safe retries need an idempotency key" },
    { text: "The payment logic had a bug" },
    { text: "The database wasn't replicated" }
  ]}
  correct={1}
  explanation="Across a network, 'never arrived,' 'succeeded but reply lost,' 'slow,' and 'dead' all look like silence. Assuming silence = failure and retrying a non-idempotent charge double-charges. Fix with an idempotency key."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#why-a-network-call-must-never-be-disguised-as-a-local-call", label: "Slow vs dead" }}
/>

<Question
  prompt="What makes partial failure the defining difficulty of distributed systems?"
  options={[
    { text: "The whole system crashes at once" },
    { text: "Some nodes are up, some down, some up-but-slow, and observers disagree about which — no global up/down, often no clean error to handle" },
    { text: "It only happens at large scale" },
    { text: "It's purely a hardware problem" }
  ]}
  correct={1}
  explanation="Single-machine failure is total and clean; distributed failure is partial and ambiguous (nodes fail independently, slow looks like dead, observers disagree). You design for uncertainty, not just catch errors."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#partial-failure-the-defining-difficulty", label: "Partial failure" }}
/>

<Question
  prompt="What is the actual choice CAP forces, correcting 'pick 2 of 3'?"
  options={[
    { text: "A permanent menu of any two properties" },
    { text: "Since partitions are inevitable, during a partition you choose: stay consistent (return errors, CP) or stay available (return possibly-stale data, AP)" },
    { text: "Always drop partition tolerance" },
    { text: "Consistency and availability are identical" }
  ]}
  correct={1}
  explanation="You can't drop P (networks fail). CAP's real bite is during a partition: CP errors rather than risk divergence; AP serves stale data and reconciles later. With no partition you get both C and A."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-cap-theorem--and-its-constant-misreading", label: "CAP corrected" }}
/>

<Question
  prompt="What does PACELC add beyond CAP?"
  options={[
    { text: "That you can have all of C, A, P" },
    { text: "Even with NO partition, you trade Consistency vs Latency — strong consistency needs coordination that adds latency to every request, so it's a daily cost, not just a failure-time one" },
    { text: "It replaces availability with durability" },
    { text: "It only applies to single-machine databases" }
  ]}
  correct={1}
  explanation="PACELC's 'Else' clause covers normal operation: strong consistency means nodes coordinate before answering, adding latency to every request. That's why eventually-consistent systems are fast — they skip that tax."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-cap-theorem--and-its-constant-misreading", label: "PACELC" }}
/>

<Question
  prompt="A user updates their profile, reloads, and sees the old value (single-leader, async followers). Why?"
  options={[
    { text: "The database is corrupted" },
    { text: "Replication lag — the write hit the leader but the read hit a not-yet-caught-up follower (read-your-writes violation); route post-write reads to the leader" },
    { text: "The write failed silently" },
    { text: "A cache returned a deleted entry" }
  ]}
  correct={1}
  explanation="Async followers lag the leader, so a read right after a write can hit stale data. It's designed behavior, fixed by routing read-after-write to the leader or a caught-up replica."
  revisit={{ to: "/docs/distributed-systems/ds-replication#synchronous-vs-asynchronous-the-durabilitylatency-knob", label: "Replication lag" }}
/>

<Question
  prompt="A leader appears dead (just unreachable), a follower is promoted, and now two nodes accept writes. What is this and how is it prevented?"
  options={[
    { text: "Replication lag; prevented by faster networks" },
    { text: "Split brain; prevented by consensus-based leader election requiring a majority, so a minority partition can't elect a second leader" },
    { text: "A quorum failure; prevented by more replicas" },
    { text: "A cache stampede; prevented by coalescing" }
  ]}
  correct={1}
  explanation="Two diverging leaders is split brain, caused by not distinguishing unreachable from dead. Majority-quorum leader election prevents a minority partition from creating a competing leader."
  revisit={{ to: "/docs/distributed-systems/ds-replication#quorums-agreeing-without-a-leader", label: "Split brain" }}
/>

<Question
  prompt="With N=3 replicas, which quorum guarantees a read sees the latest write?"
  options={[
    { text: "W=1, R=1" },
    { text: "W=2, R=2 — because W+R=4 > N=3, the read and write sets always overlap on a node with the newest value" },
    { text: "W=1, R=2" },
    { text: "Quorums don't affect consistency" }
  ]}
  correct={1}
  explanation="The rule is W + R > N. W=2/R=2 gives 4 > 3, guaranteeing overlap so reads see the latest write. Sums of 2 or 3 don't exceed N=3, allowing stale reads."
  revisit={{ to: "/docs/distributed-systems/ds-replication#quorums-agreeing-without-a-leader", label: "W + R > N" }}
/>

<Question
  prompt="A social network sharded by user_id with a good hash still has one overloaded node. Cause and fix?"
  options={[
    { text: "Broken hash; switch algorithms" },
    { text: "Celebrity/hot-key problem — one key is vastly more popular and hashing can't spread a single key; cache it, or split/replicate it at the application level" },
    { text: "Too few replicas; replicate everything more" },
    { text: "Range partitioning used by mistake" }
  ]}
  correct={1}
  explanation="Hashing balances many keys but one ultra-popular key is still one partition. Solve at the app level: cache the hot key, split it into sub-keys, or give it dedicated replicas."
  revisit={{ to: "/docs/distributed-systems/partitioning#the-cross-partition-query-problem", label: "Celebrity problem" }}
/>

<Question
  prompt="Why is `hash(key) % N` poor for assigning keys to nodes, and what replaces it?"
  options={[
    { text: "Too slow; use a faster hash" },
    { text: "Changing N remaps nearly every key (a massive reshuffle); consistent hashing places keys/nodes on a ring so only ~1/N of keys move when membership changes" },
    { text: "Modulo isn't uniform; use range partitioning" },
    { text: "It can't handle strings" }
  ]}
  correct={1}
  explanation="With `% N`, adding a node changes the result for almost all keys, reshuffling everything. Consistent hashing limits movement to ~1/N, enabling smooth scaling."
  revisit={{ to: "/docs/distributed-systems/partitioning#rebalancing--consistent-hashing", label: "Consistent hashing" }}
/>

<Question
  prompt="Why can't you order events on different machines by wall-clock timestamp?"
  options={[
    { text: "Timestamps are stored as strings" },
    { text: "Clocks drift/disagree (NTP syncs to ~ms and clocks can jump backward), so for near-simultaneous events skew can exceed the real gap — the 'later' timestamp may be the earlier event" },
    { text: "Time zones aren't handled" },
    { text: "Too few decimal places" }
  ]}
  correct={1}
  explanation="No two clocks agree exactly; precisely when ordering matters (concurrent edits), skew can exceed the real difference, so timestamps lie about order. Logical clocks capture causal order instead."
  revisit={{ to: "/docs/distributed-systems/ds-time#why-physical-clocks-fail-for-ordering", label: "Clock skew" }}
/>

<Question
  prompt="Why is 'last-write-wins by timestamp' dangerous?"
  options={[
    { text: "It's slow to compute" },
    { text: "It assumes timestamps reliably order events, which clock skew breaks, so it can silently discard the genuinely newer write (a user's edit vanishes) with no error" },
    { text: "It requires atomic clocks to function" },
    { text: "It always keeps both versions" }
  ]}
  correct={1}
  explanation="LWW trusts the later timestamp = later event, but skew can invert that, dropping the actually-newer write silently. Use it only where losing a concurrent write is acceptable; otherwise detect conflicts (vector clocks) or merge (CRDTs)."
  revisit={{ to: "/docs/distributed-systems/ds-time#happens-before-and-logical-clocks", label: "LWW hazard" }}
/>

<Question
  prompt="Why does requiring a majority prevent two conflicting decisions (e.g. two leaders)?"
  options={[
    { text: "The majority is always the fastest nodes" },
    { text: "Any two majorities of the cluster share at least one node that won't approve conflicting decisions, so a minority partition can't form its own majority to elect a competing leader" },
    { text: "Minorities are shut down automatically" },
    { text: "Majorities use atomic clocks" }
  ]}
  correct={1}
  explanation="Majority overlap: two majorities can't be disjoint, so a shared node blocks contradictions, and a minority can't act. This prevents split brain by construction — and is why clusters use odd sizes."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#the-majority-quorum-the-core-idea", label: "Majority overlap" }}
/>

<Question
  prompt="Why is a saga preferred over two-phase commit for multi-service operations?"
  options={[
    { text: "Sagas are instantly atomic like a single-DB transaction" },
    { text: "2PC is blocking and availability-killing (participants hold locks, all must be up, a crashed coordinator freezes everyone); sagas use local transactions plus compensating undo actions, trading instant atomicity for availability and eventual consistency" },
    { text: "Sagas need fewer services" },
    { text: "2PC doesn't work with SQL" }
  ]}
  correct={1}
  explanation="2PC locks participants and stalls on any failure — untenable as services multiply. Sagas do steps as independent local transactions and undo earlier ones via compensations on failure, accepting eventual consistency."
  revisit={{ to: "/docs/distributed-systems/ds-transactions#why-two-phase-commit-2pc-is-avoided", label: "Why not 2PC" }}
/>

<Question
  prompt="Why is exactly-once DELIVERY impossible, and what's achievable instead?"
  options={[
    { text: "It's possible with a fast network" },
    { text: "A lost ack is indistinguishable from a lost message, so you pick at-most-once (may lose) or at-least-once (may duplicate); exactly-once EFFECT is achievable via at-least-once delivery + idempotent processing" },
    { text: "It's possible only with two-phase commit" },
    { text: "Delivery works; processing doesn't" }
  ]}
  correct={1}
  explanation="You can't know if the other side received a message, so you either risk loss or duplicates. Important work uses at-least-once; idempotent processing makes the EFFECT exactly-once — what actually matters."
  revisit={{ to: "/docs/distributed-systems/idempotency#why-exactly-once-delivery-is-a-myth", label: "Exactly-once myth" }}
/>

<Question
  prompt="Why do strict message ordering and high throughput conflict, and what's the compromise?"
  options={[
    { text: "They don't conflict" },
    { text: "Throughput wants parallel consumers (losing global order); strict order needs sequential processing (capping throughput); the compromise is per-key/partition ordering — ordered within an entity, parallel across entities" },
    { text: "Ordering requires slow encryption" },
    { text: "Throughput is limited by disk, not ordering" }
  ]}
  correct={1}
  explanation="Parallel workers finish out of order; global order forces serialization. Per-key ordering (e.g. by account_id) keeps order where it matters while letting different entities process in parallel."
  revisit={{ to: "/docs/distributed-systems/messaging-patterns#ordering-the-guarantee-that-fights-throughput", label: "Ordering vs throughput" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 9: AI Integration](/docs/ai) — the now-standard AI layer in modern web apps, which leans on this chapter's ideas (idempotency, retries, eventual consistency) once it runs in production.
