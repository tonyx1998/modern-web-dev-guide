---
id: ds-consensus
title: Consensus
sidebar_position: 7
sidebar_label: Consensus
description: Trace a five-node Raft election, distinguish quorum overlap from protocol safety, and calculate why three voting members tolerate one failure.
---

# Consensus

> **In one line:** Consensus is getting a group of nodes to agree on a single value — most importantly "who is the leader" and "what's the next entry in the log" — despite some nodes failing or being unreachable; protocols such as Raft combine overlapping majorities with rules about votes, terms, and the log to preserve agreement.

:::tip[In plain English]
A lot of distributed-systems problems reduce to one question: *how do a bunch of machines agree on something when some of them might be down or unreachable and none of them fully trusts the others to be alive?* That's **consensus**. The [replication page](./ds-replication) introduced the danger of conflicting writes after failover. A consensus protocol coordinates leadership and the writes that may be committed. The useful starting idea is the **majority**: more than half the voting members. Two majorities must overlap, but overlap alone does not prevent the shared member from contradicting itself. The protocol must constrain what each member can vote for and retain across failures. The example below shows one such rule.
:::

## Why consensus is needed (and where it hides)

You rarely *implement* consensus — but you constantly *rely* on it. It underpins:

- **Leader election** — agreeing which node is the single writer/primary, so failover doesn't cause split brain.
- **Distributed locks & coordination** — only one process holds the lock (e.g. ZooKeeper, etcd).
- **Replicated logs / state machines** — every replica applies the same operations in the same order (the basis of replicated databases).
- **Cluster membership & configuration** — agreeing on who's in the cluster, safely changing it.
- **Committing a value durably** — agreeing a write is permanent before acknowledging it.

If you've used Kubernetes (etcd), Kafka (its controller/quorum), Consul, ZooKeeper, CockroachDB, or any managed database with automatic failover, you've depended on a consensus algorithm doing this correctly underneath.

## The majority quorum: the core idea

Give the cluster an **odd** number of nodes (3, 5, 7) and require a **majority** (2 of 3, 3 of 5) to approve any decision. Why this works:

```
 5-node cluster, network splits into {A,B} and {C,D,E}:
   {A,B}     = 2 nodes  → NOT a majority → cannot elect a leader or commit
   {C,D,E}   = 3 nodes  → majority       → keeps operating safely

 Any two majorities of 5 share ≥1 node. Protocol rules must
 prevent that shared node from making contradictory commitments.
```

This is why a partitioned minority *refuses to act* (preventing split brain), and why clusters use **odd** sizes — an even split (2 vs 2) would have no majority on either side, stalling everything. For a fixed set of N voting members, the majority is `floor(N/2) + 1`, and failure tolerance is `N - majority`: a 5-node cluster survives 2 failures (3 remain = majority); a 3-node survives 1.

## Worked example: overlapping votes are not enough

A five-member cluster needs three votes. Imagine candidate A collects votes from A, B, C, while candidate D collects votes from C, D, E. Both groups have three members. If C may vote twice in the same election, arithmetic alone has allowed two winners.

Raft divides elections into numbered **terms** and durably records at most one vote per member per term. C cannot grant that second vote in the same term. A later term may elect a different leader; safety across terms also depends on the log and commit rules. This trace demonstrates election safety, not the whole protocol proof. See the Raft paper in the optional references.

**Try it:** C restarts before D asks for a vote in the same term. Should its earlier vote disappear? No. Losing that record would let C contradict its first vote after a restart.

## Raft and Paxos, conceptually

You don't need to implement these, but you should recognize them and the shape of what they do.

**Paxos** is a family of consensus protocols associated with Leslie Lamport. Multi-Paxos applies the agreement mechanism to a sequence of decisions, such as log entries.

**Raft** (2014) was designed explicitly to be *understandable* — same guarantees as Paxos, far easier to reason about and implement, which is why most newer systems (etcd, CockroachDB, Consul) use it. Its structure:

- **Leader election:** nodes are followers; if a follower hears nothing from a leader for a randomized timeout, it becomes a *candidate* and requests votes. Win a majority → become leader. (Randomized timeouts make simultaneous candidacies rare, avoiding split votes.)
- **Log replication:** the leader replicates entries to followers. For an entry from its current term, it can determine commitment once a majority store it; older-term entries need the additional commitment rule in the protocol.
- **Safety:** voting restrictions, log checks, and commitment rules work together to preserve previously committed entries. Majority arithmetic alone is not the protocol.

```
   Follower ──(no leader heartbeat for a random timeout)──► Candidate
   Candidate ──(wins majority of votes)──► Leader ──(sends heartbeats)──► Followers
   Leader replicates log entries → applies Raft's commitment rules → acknowledges
```

:::info[Highlight: FLP — why consensus can't be both perfectly safe and guaranteed-fast]
A deep theoretical result (Fischer-Lynch-Paterson, 1985): in a fully asynchronous network where even one node can fail, **no deterministic consensus algorithm can guarantee it will always reach a decision** — because, as we saw, you [can't distinguish a slow node from a dead one](./ds-fallacies), so the protocol can be forced to wait forever for a node that might or might not respond. This sounds like it dooms consensus, but the escape is practical: real algorithms (Raft, Paxos) preserve **safety** (agreement) within their specified failure model, and achieve **liveness** (they *do* make progress) under the realistic assumption that the network is *eventually* well-behaved for long enough — using timeouts and randomization to get there. The takeaway: consensus trades a sliver of theoretical "always terminates" for ironclad correctness, which is exactly the right trade — you'd rather a leader election occasionally take an extra moment than occasionally elect two leaders. FLP is why every consensus system has timeouts and why "eventually" is doing real work in its guarantees.
:::

:::note[Worked example: count voters before adding a member]
A two-voter cluster requires both votes, so it cannot lose a voter and continue making quorum-based updates. Three voters require two: one may fail. Four require three: still only one may fail. Five require three: two may fail. This is why odd voting-group sizes usually provide the same failure tolerance with fewer members. Even sizes are valid configurations, but adding a fourth voter to three does not add failure tolerance. Count voting members, not every server or read replica in the deployment. The etcd reference below documents this arithmetic.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adding voters without calculating quorum.** A 2-member group needs both voters and tolerates no member failure; 3 needs 2 and tolerates 1. Four members still tolerate only 1. Even sizes can work, but an odd size generally provides the same failure tolerance with fewer voting members.
- **Trying to hand-roll consensus / leader election.** It's subtle enough that experts get it wrong; naive "whoever has the highest ID is leader" schemes produce split brain. Use a proven implementation (etcd, ZooKeeper, your DB's built-in).
- **Expecting consensus to be free or fast.** Every decision needs a majority round-trip; consensus adds latency and can't span too many nodes cheaply. Keep consensus groups small; don't route high-volume data through them.
- **Assuming a partitioned minority can keep serving writes.** It correctly *can't* (no majority) — that's the feature preventing split brain, not a bug. Design clients to tolerate the minority side being read-only/unavailable.
- **Confusing consensus with replication.** Replication copies data; consensus is how the group *agrees* on things like order and leadership. Replicated logs use consensus underneath.
:::

## Page checkpoint

<Quiz id="ds-consensus-page" title="Did consensus stick?" sampleSize={3}>

<Question
  prompt="What prevents two Raft candidates from winning the same term?"
  options={[
    { text: "Because the majority is always the fastest nodes" },
    { text: "The majorities overlap, and each voter durably grants at most one vote in that term" },
    { text: "Because minorities are shut down automatically" },
    { text: "Because majorities use atomic clocks" }
  ]}
  correct={1}
  explanation="Overlap identifies a shared voter; the one-vote-per-term rule stops that voter from approving both candidates. Both facts are needed."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#the-majority-quorum-the-core-idea", label: "Majority overlap" }}
/>

<Question
  prompt="A team deploys a 2-node consensus cluster 'for redundancy.' Why is this a mistake?"
  options={[
    { text: "Two nodes cost too much" },
    { text: "A majority of 2 is 2, so losing either voter prevents quorum; three voters can lose one and still have a majority" },
    { text: "Two nodes can't replicate data" },
    { text: "Raft requires at least four nodes" }
  ]}
  correct={1}
  explanation="The calculation is voting members minus required majority: 2 - 2 = 0 tolerated failures; 3 - 2 = 1. An extra copy of data does not necessarily add voting fault tolerance."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#the-majority-quorum-the-core-idea", label: "Odd cluster sizes" }}
/>

<Question
  prompt="What does the FLP result tell us, and how do real consensus algorithms cope?"
  options={[
    { text: "Consensus is impossible, so all distributed systems are unsafe" },
    { text: "In a fully asynchronous network with possible crashes, deterministic consensus cannot guarantee termination in every execution; practical protocols preserve safety within their failure model and rely on sufficient communication progress for liveness" },
    { text: "Consensus always terminates in a fixed number of steps" },
    { text: "FLP only applies to Paxos, not Raft" }
  ]}
  correct={1}
  explanation="FLP limits guaranteed termination for deterministic consensus in its asynchronous failure model. It does not make agreement impossible in all executions or remove the assumptions under which a practical protocol is safe."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#raft-and-paxos-conceptually", label: "FLP" }}
/>

</Quiz>

:::tip[→ Going deeper]
Revisit [Replication](./03-replication.md) for the failover problem that motivates this protocol, and [Consistency & CAP](./02-consistency-cap.md) for what a client may observe during a partition.
:::

:::note[Go deeper (optional): primary references]
- [Ongaro and Ousterhout: In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf), sections 5.2 and 5.4 — election restrictions and commitment across terms.
- [etcd FAQ: why an odd number of cluster members?](https://etcd.io/docs/v3.6/faq/#why-an-odd-number-of-cluster-members) — quorum and failure-tolerance arithmetic.
:::

## What's next

→ Continue to [Distributed transactions & sagas](./ds-transactions) — getting *correct multi-step work* done across services that each have their own database.
