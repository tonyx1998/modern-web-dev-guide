---
id: ds-consensus-internals
title: Consensus in Motion — Election, Failure Detection & Testing
sidebar_position: 13
sidebar_label: Consensus in motion
description: The operational depth behind consensus — Raft terms, leader election and the randomized-timeout trick, how a partition heals and a stale leader steps down, failure detection without crying wolf, fencing tokens, and how to prove a distributed system correct with Jepsen, simulation, and chaos.
---

# Consensus in Motion — Election, Failure Detection & Testing

> **In one line:** [Consensus](./ds-consensus) told you *what* agreement is and that a **majority quorum** is the core idea; this page shows it *in motion* — how **Raft** elects exactly one leader using monotonic **terms** and **randomized timeouts**, how a healed network partition makes a stale leader quietly **step down** (so there's never two), how a node decides another is **dead without crying wolf**, and — because none of this is obvious — how engineers **prove** these systems correct with fault injection (Jepsen), deterministic simulation, and chaos.

:::tip[In plain English]
The [consensus page](./ds-consensus) gave you the principle: to agree on anything (especially "who is the leader?") a cluster needs a *majority* to vote yes, which is why split-brain can't happen and why clusters have odd sizes. But "a majority agrees" leaves the hard questions open. *How* does a leaderless cluster pick a leader without two candidates deadlocking forever? When the network splits and the old leader is stranded on the minority side, what stops it from happily serving stale writes? How does a node tell "the leader is dead" from "the leader's reply is just slow" — the [fallacy](./ds-fallacies) at the heart of the whole chapter? And once you've written code that claims to handle all this, how do you ever *trust* it, given the bugs only appear under a precise, rare interleaving of failures? This page answers those four questions with the algorithm almost everyone actually uses (**Raft**), the detection machinery around it, and the testing methods that catch the bugs human reasoning misses.
:::

## Raft from the top: terms, a log, and one leader

**Raft** is a consensus algorithm designed to be *understandable* (its stated goal), and it's what etcd, Consul, CockroachDB, TiKV, and many others run. Three ideas carry it:

- **Roles.** Every server is a **follower**, a **candidate**, or the **leader**. Normal operation: one leader, everyone else a follower.
- **Terms.** Time is divided into **terms** — monotonically increasing integers that act as a **logical clock** ([Lamport clocks](./ds-time), concretely). *At most one leader per term.* Every message carries its sender's term; a higher term always wins and is "news."
- **A replicated log.** Clients send commands to the leader, which appends them to its **log** and replicates them to followers (the `AppendEntries` RPC). An entry is **committed** once a **majority** has stored it; only then is it applied to the state machine. This is where the WAL-style log from [storage internals](./ds-storage-internals) meets consensus — the log *is* the agreed-upon order of operations.

```
 term:        1            2                3
        ┌──────────┐ ┌────────────┐ ┌──────────────────────►
        │ leader A │ │  leader B  │ │      leader A again
        └──────────┘ └────────────┘ └──────────────────────►
   (each term has AT MOST one leader; a term with a split vote has none, and bumps to the next)
```

## Leader election: heartbeats, timeouts, and the randomization trick

The leader sends periodic **heartbeats** (empty `AppendEntries`) to assert "I'm alive." Each follower runs an **election timeout** — a countdown reset by every heartbeat. The mechanism:

1. A follower's election timeout elapses *without* a heartbeat → it suspects the leader is gone.
2. It becomes a **candidate**: increments the term, votes for itself, and requests votes from everyone.
3. A server grants its vote if it hasn't already voted *this* term **and** the candidate's log is at least as up-to-date as its own (the **election restriction** — this is what guarantees a new leader has every committed entry).
4. Win a **majority** → become leader, start heartbeating. Don't → time out and try again next term.

The subtle part is step 4's failure case. If two followers time out simultaneously, they can **split the vote** — neither gets a majority — and if they then retry *in lockstep*, they split again, forever. Raft's fix is elegant: **randomize each election timeout** (e.g. pick uniformly in 150–300 ms). The randomness almost always lets one candidate's timer fire first, win, and start heartbeating before the others wake up — converting a potential livelock into a fast, self-resolving race. This is the practical answer to the [**FLP result**](./ds-consensus): you can't guarantee liveness in an async network, but randomized timeouts make a stall *vanishingly unlikely in practice*.

:::caution[Tune the timeouts to your network, or pay for it]
Election timeout must be comfortably larger than the heartbeat interval, which must be comfortably larger than your real round-trip time. Too **aggressive** (short timeout) → transient latency blips look like a dead leader → needless elections (**election storms**), each costing a brief unavailability. Too **conservative** → slow failover when the leader genuinely dies. There's no universal number; it's a function of *your* p99 network latency.
:::

## Healing a partition: how a stale leader steps down

This is the scenario people fear — a network split with a leader on each side — and the reason it *doesn't* corrupt anything in Raft:

```
        ┌─────────────── PARTITION ───────────────┐
  minority side                              majority side
   A (old leader, term 5)                     C   D   E
   B                                          │
   │  A keeps trying to commit, but can       │  C times out, starts term 6,
   │  only reach B → 2 of 5 → NO majority     │  wins votes from D,E → 3 of 5 → LEADER
   │  ⇒ A commits NOTHING (writes hang)       │  ⇒ C commits normally
        └──────────────── heals ──────────────┘
   A receives a message stamped term 6 > its term 5
   ⇒ A immediately reverts to follower, discards any uncommitted tail, syncs C's log
```

The key invariants: a leader can only **commit** with a majority, so the stranded minority leader (A) **commits nothing** — at worst its clients' writes hang or error, but no *committed* data diverges. Meanwhile only the **majority** side can elect a new leader, so there's never two leaders that can both commit. When the partition heals, the **higher term is decisive**: A sees term 6, learns it's stale, and steps down. Split-brain is prevented not by detecting it but by *making it structurally impossible to commit on the wrong side*.

### Fencing tokens: stopping a zombie leader's late writes

There's a residual danger the algorithm alone doesn't cover: a leader that **paused** (GC pause, VM freeze) for seconds, missed that it was replaced, then wakes and tries to write to an *external* resource (a database, object store) that doesn't know about Raft terms. The fix is a **fencing token**: each time leadership changes, hand out a monotonically increasing number; the leader stamps every external operation with its token, and the resource **rejects any token lower than the highest it has seen**. The zombie's stale token bounces. Any system where a lock or lease guards an external side effect needs fencing — a lease alone isn't enough, because the holder can be paused past its expiry without knowing.

## Failure detection: deciding a node is dead without crying wolf

Underneath election sits the chapter's original sin: [**you cannot distinguish "dead" from "slow"**](./ds-fallacies). A **failure detector** must guess anyway, and it trades two properties it can never both perfect in an async network:

- **Accuracy** — never suspect a node that's actually alive (no false positives).
- **Completeness** — eventually suspect every node that's actually dead (no false negatives).

A plain **heartbeat + fixed timeout** detector forces a hard choice between them via the timeout length — exactly the election-timeout tension above, generalized. Two refinements matter in practice:

- **Phi-accrual failure detection.** Instead of a boolean "dead/alive," output a *suspicion level* **φ** that rises smoothly based on the recent *history* of heartbeat arrival times. Downstream code picks its own threshold, and the detector **adapts** to a network that's simply gotten slower rather than flapping. Cassandra and Akka use this.
- **Anti-flapping.** A node that's repeatedly declared dead then alive (**flapping**) triggers churn — re-elections, rebalancing, connection storms. Detectors add hysteresis/backoff so a borderline node doesn't thrash the cluster.

## Exactly-once, concretely: consensus + idempotency

The chapter's [idempotency](./idempotency) lesson and this one combine in systems like Kafka's "exactly-once." Under the hood it's never exactly-once *delivery* (impossible) — it's at-least-once delivery plus: a **producer epoch/sequence number** the broker uses to **dedupe** retries (the same fencing+idempotency-key idea), and **transactions** that atomically commit a batch of writes across partitions via a coordinator using a consensus-backed log. The "magic" is just the two mechanisms you already know — agreement on an order, and idempotent dedupe — wired together.

## Why it matters

- **You operate these systems even if you never write one.** etcd backs Kubernetes; Consul/etcd back service discovery; your distributed database elects leaders this way. "Why did my cluster have a 4-second blip?" is usually an election, and the cause is usually timeouts mistuned for the network.
- **Fencing is a real production gap.** Distributed-lock tutorials that hand out a lease *without* a fencing token ship a latent split-brain bug; knowing to demand the token is the difference between a correct and a corrupt system.
- **Detection tuning is a dial, not a default.** Aggressive timeouts cause the very instability they're meant to catch (election storms); you set them against measured latency.
- **You must test what you can't reason about.** Distributed bugs hide in rare interleavings; the methods below are how teams find them *before* a customer does.

## Proving it correct: Jepsen, simulation, and chaos

Human reasoning is bad at distributed failure interleavings, so the field tests adversarially:

- **Jepsen.** A black-box harness that runs a real cluster, hammers it with concurrent client operations while **injecting partitions, clock skew, and process pauses**, records the history of what each client saw, then checks that history against a **consistency model** (e.g. linearizability, via checkers like Knossos/Elle). Jepsen has found *serious* correctness bugs in many well-known databases — claims of "linearizable" that weren't under partition.
- **Deterministic simulation testing (DST).** Run the *entire* system on a single-threaded, deterministic scheduler with a virtual clock and pluggable fault injection, so any failing run is reproducible from its **seed**. FoundationDB and TigerBeetle famously simulate years of faults (disk corruption, partitions, clock jumps) per test-hour. Determinism turns "we saw a heisenbug once" into "replay seed 4127 and watch it."
- **Chaos engineering.** Inject failures in *production* under a hypothesis ("a downed replica shouldn't affect p99") — the [operations-chapter practice](/docs/operations/chaos-engineering), applied to validate the resilience this chapter designs.

:::note[Worked example: a 3-second leader pause, traced]
A 5-node etcd-style cluster has leader **A** (term 7). A's host suffers a 3-second stop-the-world GC pause.

1. **t=0** A freezes mid-heartbeat. Followers C, D, E stop receiving heartbeats.
2. **t≈0.2s** Their (randomized) election timeouts fire. C fires first, bumps to **term 8**, votes for itself, requests votes.
3. **t≈0.2s** D and E haven't voted in term 8 and C's log is up-to-date → they grant. C has **3 of 5 = majority** → **leader, term 8**. C heartbeats; the cluster is serving again — total blip ~200 ms.
4. **t=3s** A wakes, still believing it's leader in term 7, and sends an `AppendEntries`/heartbeat.
5. **Followers reply with term 8.** A sees `8 > 7` → **immediately steps down to follower**, adopts term 8, and re-syncs C's log. Any entry A had appended but not committed before the pause is discarded.
6. **The fencing payoff:** if A had, mid-pause, tried to write to an external store using a lease, that store would reject A's stale fencing token (it has since seen C's higher one) — so A's zombie write can't land.

No split-brain, no committed-data divergence, ~200 ms of unavailability. The randomized timeout made the election fast; the term comparison made A's recovery automatic; fencing covered the external side effect.
:::

## Interactive practice — the Raft vote rule

The heart of leader election is the rule each server uses to grant or deny a vote. Implement the **term/vote** part of it. (Real Raft *also* requires the candidate's log be at least as up-to-date — the election restriction — which we omit here to focus on the term and one-vote-per-term logic.)

<CodeChallenge
  id="ds-raft-vote-rule"
  fnName="shouldGrantVote"
  prompt="Write shouldGrantVote(state, candidate). state = { currentTerm, votedFor } (votedFor is a server id or null). candidate = { candidateId, candidateTerm }. Rules: (1) reject if candidateTerm < currentTerm (stale candidate). (2) A NEWER term (candidateTerm > currentTerm) resets this node's vote — treat votedFor as null. (3) Grant only if the (possibly reset) vote is null OR already for this same candidate. Return true/false."
  starter={`function shouldGrantVote(state, candidate) {\n  // 1. stale candidate term => false\n  // 2. a strictly newer term resets votedFor to null\n  // 3. grant if effective vote is null or already this candidate\n  // your code\n}`}
  solution={`function shouldGrantVote(state, candidate) {\n  if (candidate.candidateTerm < state.currentTerm) return false;\n  const effectiveVotedFor =\n    candidate.candidateTerm > state.currentTerm ? null : state.votedFor;\n  return effectiveVotedFor === null || effectiveVotedFor === candidate.candidateId;\n}`}
  tests={[
    {args: [{currentTerm: 5, votedFor: null}, {candidateId: 'B', candidateTerm: 4}], expected: false, label: 'stale term rejected'},
    {args: [{currentTerm: 4, votedFor: 'X'}, {candidateId: 'B', candidateTerm: 5}], expected: true, label: 'newer term resets the vote'},
    {args: [{currentTerm: 5, votedFor: null}, {candidateId: 'B', candidateTerm: 5}], expected: true, label: 'same term, not yet voted'},
    {args: [{currentTerm: 5, votedFor: 'A'}, {candidateId: 'B', candidateTerm: 5}], expected: false, label: 'same term, already voted for someone else'},
    {args: [{currentTerm: 5, votedFor: 'B'}, {candidateId: 'B', candidateTerm: 5}], expected: true, label: 'same term, repeat request from same candidate'},
  ]}
  hint="Three lines: reject if candidateTerm < currentTerm; compute effectiveVotedFor (null when candidateTerm > currentTerm, else state.votedFor); return effectiveVotedFor === null || effectiveVotedFor === candidate.candidateId."
/>

## Common mistakes

:::caution[Where people commonly trip up]
- **Using a lock/lease without a fencing token.** A paused holder can wake after expiry and corrupt an external resource. Hand out monotonic tokens and have the resource reject stale ones.
- **Tuning election timeouts too aggressively.** Short timeouts turn latency blips into election storms and self-inflicted unavailability. Set them against measured p99 RTT, not optimistically.
- **Even cluster sizes.** 4 nodes tolerate the same one failure as 3 but double the split-vote/partition risk; consensus clusters should be **odd** (3, 5, 7).
- **Believing a 'linearizable' label without a partition test.** Many systems' guarantees broke under Jepsen's partition injection. Trust tested behavior, not marketing.
- **Treating a failure detector as ground truth.** It's a *guess* trading accuracy for completeness; design for false suspicions (idempotent failover, fencing) rather than assuming it's always right.
- **Forgetting consensus has a latency tax.** Every committed write waits for a majority round-trip ([PACELC's](./ds-consistency) 'else latency'); don't route high-throughput, loss-tolerant data through it.
:::

## Chapter wrap-up

Distributed systems are the theory under everything the cloud and operations chapters had you build. The throughline: **the network is unreliable and partial failure is normal, so you can't trust clocks or assume single delivery; you choose consistency deliberately per data type ([CAP/PACELC](./ds-consistency)), spread data with [replication](./ds-replication) and [partitioning](./partitioning) over real [storage engines](./ds-storage-internals), agree on reality through [consensus](./ds-consensus) — elected and healed as shown here — get multi-step work done with [sagas](./ds-transactions) instead of distributed transactions, and make every retryable side effect [idempotent](./idempotency).** Master these and the production mysteries — stale reads, double charges, split brain, lost updates, zombie leaders — become named, designed-for properties instead of 3am surprises. And crucially: you don't merely reason about them, you **test** them — with fault injection, deterministic simulation, and chaos — because the bugs live exactly where intuition is weakest.

## Page checkpoint

<Quiz id="ds-consensus-internals-page" title="Did consensus-in-motion stick?" sampleSize={3}>

<Question
  prompt="Why does Raft randomize each server's election timeout?"
  options={[
    { text: "To make the code simpler to write" },
    { text: "Simultaneous candidates can split the vote (no majority) and, retrying in lockstep, split again forever; randomized timeouts almost always let one candidate fire first, win a majority, and start heartbeating before others wake — turning a potential livelock into a fast self-resolving race" },
    { text: "To encrypt the election messages" },
    { text: "Because terms must always be even numbers" }
  ]}
  correct={1}
  explanation="A split vote with lockstep retries is a livelock. Randomizing the timeout breaks the symmetry so one candidate usually wins outright — the practical workaround to the FLP result that you can't guarantee liveness in an async network."
  revisit={{ to: "/docs/distributed-systems/ds-consensus-internals#leader-election-heartbeats-timeouts-and-the-randomization-trick", label: "Randomized timeouts" }}
/>

<Question
  prompt="During a network partition, what prevents a leader stranded on the minority side from corrupting data?"
  options={[
    { text: "It detects the partition and shuts itself off instantly" },
    { text: "A leader can only COMMIT with a majority, so the minority leader commits nothing (writes hang), while only the majority side can elect a new leader; when the partition heals, the higher term makes the stale leader step down — split-brain is structurally impossible to commit, not merely detected" },
    { text: "Both leaders commit and the data is merged later" },
    { text: "The minority leader keeps committing but to a backup file" }
  ]}
  correct={1}
  explanation="Commit requires a majority, so the minority leader can't commit anything that could diverge; election also requires a majority, so there's never two committing leaders. On heal, the higher term is decisive and the stale leader reverts to follower. Correctness comes from the quorum rule, not from detecting the split."
  revisit={{ to: "/docs/distributed-systems/ds-consensus-internals#healing-a-partition-how-a-stale-leader-steps-down", label: "Partition healing" }}
/>

<Question
  prompt="What problem does a fencing token solve that a lease alone does not?"
  options={[
    { text: "It compresses the data sent to replicas" },
    { text: "A lock/lease holder can pause (GC, VM freeze) past its expiry without knowing it was replaced, then issue a late write; a monotonically increasing fencing token stamped on each external operation lets the resource reject any token lower than the highest it has seen, bouncing the zombie's stale write" },
    { text: "It makes elections faster" },
    { text: "It removes the need for a majority quorum" }
  ]}
  correct={1}
  explanation="Leases can be silently outlived by a paused holder. Fencing tokens make external resources reject stale operations, closing the zombie-leader window that consensus alone doesn't cover for side effects outside the cluster."
  revisit={{ to: "/docs/distributed-systems/ds-consensus-internals#fencing-tokens-stopping-a-zombie-leaders-late-writes", label: "Fencing tokens" }}
/>

<Question
  prompt="A failure detector trades 'accuracy' against 'completeness.' What does that mean, and how does phi-accrual help?"
  options={[
    { text: "Accuracy = speed, completeness = memory use; phi-accrual reduces memory" },
    { text: "Accuracy = never suspect a live node (no false positives), completeness = eventually suspect every dead node (no false negatives); you can't perfect both in an async network. Phi-accrual outputs a smooth suspicion level φ from heartbeat history instead of a hard boolean, adapting to a slower network and reducing flapping" },
    { text: "They're the same thing measured twice" },
    { text: "Accuracy applies to leaders, completeness to followers, and phi-accrual swaps them" }
  ]}
  correct={1}
  explanation="A detector guessing 'dead vs slow' can't be both perfectly accurate and complete asynchronously. Phi-accrual replaces a brittle fixed timeout with an adaptive suspicion score, cutting false positives (flapping) when the network merely slows."
  revisit={{ to: "/docs/distributed-systems/ds-consensus-internals#failure-detection-deciding-a-node-is-dead-without-crying-wolf", label: "Failure detection" }}
/>

<Question
  prompt="What is Jepsen and why is it valuable?"
  options={[
    { text: "A faster consensus algorithm that replaces Raft" },
    { text: "A black-box testing harness that runs a real cluster under injected partitions, clock skew, and pauses, records what clients observed, and checks that history against a consistency model (e.g. linearizability) — catching correctness bugs that violate a system's claimed guarantees under failure" },
    { text: "A monitoring dashboard for production metrics" },
    { text: "A compression format for write-ahead logs" }
  ]}
  correct={1}
  explanation="Jepsen adversarially injects faults and verifies the recorded client history against a formal consistency model. It has repeatedly found real violations of 'linearizable'/'consistent' claims under partition — evidence you test distributed correctness rather than trust it."
  revisit={{ to: "/docs/distributed-systems/ds-consensus-internals#proving-it-correct-jepsen-simulation-and-chaos", label: "Jepsen & testing" }}
/>

</Quiz>

## What's next

→ You've finished the distributed-systems pillars — including the operational depth of storage and consensus. Take the [Chapter 7 checkpoint](./distributed-systems-checkpoint), then continue to [Chapter 8: AI Integration](/docs/ai) — the new standard layer in modern apps, which puts this chapter's reliability ideas to work in production.
