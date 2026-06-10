---
id: ds-consensus
title: Consensus
sidebar_position: 7
sidebar_label: Consensus
description: What consensus is and why it's needed, the majority-quorum idea, Raft and Paxos at a conceptual level, the FLP result, and where consensus shows up in systems you use.
---

# Consensus

> **In one line:** Consensus is getting a group of nodes to agree on a single value — most importantly "who is the leader" and "what's the next entry in the log" — despite some nodes failing or being unreachable; it's solved by requiring a **majority** to agree (so two conflicting majorities are impossible), and algorithms like Raft and Paxos are the careful protocols that make this safe.

:::tip[In plain English]
A lot of distributed-systems problems reduce to one question: *how do a bunch of machines agree on something when some of them might be down or unreachable and none of them fully trusts the others to be alive?* That's **consensus**. The classic need is electing a leader: from the [replication page](./ds-replication), if two nodes both think they're leader (split brain), data corrupts — so the group must agree on *exactly one*. The elegant core idea is the **majority**: require more than half the nodes to agree on any decision. Because two different majorities of the same group must overlap on at least one node, you can never get two conflicting decisions approved. That single insight — *majority overlap prevents contradiction* — is the heart of consensus. Algorithms like Raft and Paxos are the (genuinely intricate) rulebooks that turn it into a working protocol that survives crashes and message loss.
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

 Any two majorities of 5 share ≥1 node, so two conflicting decisions
 can never both get approved. The minority side blocks itself.
```

This is why a partitioned minority *refuses to act* (preventing split brain), and why clusters use **odd** sizes — an even split (2 vs 2) would have no majority on either side, stalling everything. It's also why consensus clusters tolerate `(N-1)/2` failures: a 5-node cluster survives 2 failures (3 remain = majority); a 3-node survives 1.

## Raft and Paxos, conceptually

You don't need to implement these, but you should recognize them and the shape of what they do.

**Paxos** (Lamport, 1998) was the first proven-correct consensus algorithm — and famously hard to understand and implement. It's the theoretical bedrock; many systems use variants ("Multi-Paxos").

**Raft** (2014) was designed explicitly to be *understandable* — same guarantees as Paxos, far easier to reason about and implement, which is why most newer systems (etcd, CockroachDB, Consul) use it. Its structure:

- **Leader election:** nodes are followers; if a follower hears nothing from a leader for a randomized timeout, it becomes a *candidate* and requests votes. Win a majority → become leader. (Randomized timeouts make simultaneous candidacies rare, avoiding split votes.)
- **Log replication:** all writes go to the leader, which appends them to its log and replicates to followers; an entry is *committed* once a majority have it (then it's safe to apply and acknowledge).
- **Safety:** terms (logical election epochs) and the majority rule guarantee at most one leader per term and that committed entries are never lost or reordered.

```
   Follower ──(no leader heartbeat for a random timeout)──► Candidate
   Candidate ──(wins majority of votes)──► Leader ──(sends heartbeats)──► Followers
   Leader appends client writes → replicates → committed once a MAJORITY ack
```

:::info[Highlight: FLP — why consensus can't be both perfectly safe and guaranteed-fast]
A deep theoretical result (Fischer-Lynch-Paterson, 1985): in a fully asynchronous network where even one node can fail, **no consensus algorithm can guarantee it will always reach a decision** — because, as we saw, you [can't distinguish a slow node from a dead one](./ds-fallacies), so the protocol can be forced to wait forever for a node that might or might not respond. This sounds like it dooms consensus, but the escape is practical: real algorithms (Raft, Paxos) guarantee **safety** (they never produce a *wrong* or contradictory answer) unconditionally, and achieve **liveness** (they *do* make progress) under the realistic assumption that the network is *eventually* well-behaved for long enough — using timeouts and randomization to get there. The takeaway: consensus trades a sliver of theoretical "always terminates" for ironclad correctness, which is exactly the right trade — you'd rather a leader election occasionally take an extra moment than occasionally elect two leaders. FLP is why every consensus system has timeouts and why "eventually" is doing real work in its guarantees.
:::

:::note[Worked example: why your cluster wants 3 or 5 nodes, never 2 or 4]
A team sets up a 2-node etcd cluster "for redundancy." It's *worse* than one node: a majority of 2 is 2, so if *either* node fails or the link between them drops, neither side has a majority and the whole cluster freezes — you've doubled the failure probability and gained no fault tolerance. Same with 4 nodes: a 2-2 split has no majority. The rule falls straight out of majority math: use **odd** sizes. 3 nodes tolerate 1 failure; 5 tolerate 2; 7 tolerate 3. Beyond ~5–7 the coordination overhead (every decision needs a majority to ack) outweighs the added fault tolerance, so 3 or 5 is the sweet spot for almost everything. This is why managed coordination services and databases always deploy in odd numbers — it's not a convention, it's the consequence of how majorities work.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Even-sized consensus clusters (2 or 4 nodes).** No majority on an even split → the cluster stalls. A 2-node cluster is *less* reliable than 1. Always use odd sizes (3, 5, 7).
- **Trying to hand-roll consensus / leader election.** It's subtle enough that experts get it wrong; naive "whoever has the highest ID is leader" schemes produce split brain. Use a proven implementation (etcd, ZooKeeper, your DB's built-in).
- **Expecting consensus to be free or fast.** Every decision needs a majority round-trip; consensus adds latency and can't span too many nodes cheaply. Keep consensus groups small; don't route high-volume data through them.
- **Assuming a partitioned minority can keep serving writes.** It correctly *can't* (no majority) — that's the feature preventing split brain, not a bug. Design clients to tolerate the minority side being read-only/unavailable.
- **Confusing consensus with replication.** Replication copies data; consensus is how the group *agrees* on things like order and leadership. Replicated logs use consensus underneath.
:::

## Page checkpoint

<Quiz id="ds-consensus-page" title="Did consensus stick?" sampleSize={3}>

<Question
  prompt="Why does requiring a majority to approve any decision prevent two conflicting decisions (e.g. two leaders)?"
  options={[
    { text: "Because the majority is always the fastest nodes" },
    { text: "Any two majorities of the same cluster must share at least one node, and that node won't approve two conflicting decisions — so a partitioned minority can't form its own majority to elect a competing leader" },
    { text: "Because minorities are shut down automatically" },
    { text: "Because majorities use atomic clocks" }
  ]}
  correct={1}
  explanation="Majority overlap is the core idea: two majorities of N can't be disjoint, so they always share a node that blocks contradictory approvals. A minority partition lacks a majority and therefore can't act — preventing split brain by construction."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#the-majority-quorum-the-core-idea", label: "Majority overlap" }}
/>

<Question
  prompt="A team deploys a 2-node consensus cluster 'for redundancy.' Why is this a mistake?"
  options={[
    { text: "Two nodes cost too much" },
    { text: "A majority of 2 is 2, so if either node fails or the link drops, neither side has a majority and the whole cluster freezes — it's less reliable than one node; consensus clusters need odd sizes (3, 5, 7)" },
    { text: "Two nodes can't replicate data" },
    { text: "Raft requires at least four nodes" }
  ]}
  correct={1}
  explanation="With 2 nodes any single failure leaves 1 (not a majority), stalling the cluster — doubling failure exposure for zero fault tolerance. Odd sizes work: 3 tolerates 1 failure, 5 tolerates 2. Even sizes can split with no majority on either side."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#the-majority-quorum-the-core-idea", label: "Odd cluster sizes" }}
/>

<Question
  prompt="What does the FLP result tell us, and how do real consensus algorithms cope?"
  options={[
    { text: "Consensus is impossible, so all distributed systems are unsafe" },
    { text: "In a fully asynchronous network with possible failures, no algorithm can guarantee it always terminates — so real algorithms guarantee SAFETY (never a wrong/contradictory answer) unconditionally and achieve progress under the realistic assumption the network is eventually well-behaved, using timeouts" },
    { text: "Consensus always terminates in a fixed number of steps" },
    { text: "FLP only applies to Paxos, not Raft" }
  ]}
  correct={1}
  explanation="FLP says guaranteed termination is impossible in a fully async, failure-prone model (you can't tell slow from dead). Practical algorithms keep safety absolute and rely on the network behaving long enough (via timeouts/randomization) to make progress — trading a theoretical 'always terminates' for ironclad correctness."
  revisit={{ to: "/docs/distributed-systems/ds-consensus#raft-and-paxos-conceptually", label: "FLP" }}
/>

</Quiz>

## What's next

→ Continue to [Distributed transactions & sagas](./ds-transactions) — getting *correct multi-step work* done across services that each have their own database.
