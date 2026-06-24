---
id: ds-storage-internals
title: Storage Engines & the Write-Ahead Log
sidebar_position: 12
sidebar_label: Storage internals
description: What's under the database — B-trees vs LSM-trees, the write-ahead log and its durability knobs, memtables, SSTables, tombstones, compaction strategies, the three amplifications, crash recovery and checkpoints, and how all of it explains durability and replication lag.
---

# Storage Engines & the Write-Ahead Log

> **In one line:** Every database fights the same three-way tug-of-war — writes must be **durable** (survive a crash), **fast** (disks punish random I/O), and **readable** (find a row without scanning everything) — and its **storage engine** is how it resolves that fight; the two dominant designs (the **B-tree**, which updates pages in place, and the **LSM-tree**, which only ever appends) trade *which* of the three "amplifications" they pay, and both rest on the same foundation — a **write-ahead log** forced to disk *before* the real data changes — which turns out to be the very thing that also drives [replication](./ds-replication).

:::tip[In plain English]
You've used databases as a black box: you `INSERT` a row and trust it's there even if the power dies a millisecond later. This page opens the box. The puzzle a storage engine solves is that the three things you want pull against each other. **Durable** means "once I said yes, it survives a crash" — which naively means writing to disk and *waiting*. **Fast** means "don't make me wait" — but disks (even SSDs) are far slower at *random* writes scattered across a file than at *sequential* writes appended to the end. **Readable** means "find row #7 instantly" — which wants data kept sorted, i.e. placed at a specific spot. You can't max all three, so an engine picks a strategy. The universal first move is the **write-ahead log (WAL)**: before touching the carefully-organized main data, append a one-line "here's what I'm about to do" to a sequential log and force it to disk. Sequential append is cheap, so you get durability *fast* — and if the machine dies, you *replay the log* on restart. Everything else on this page — B-trees, LSM-trees, compaction, checkpoints — is built on that one idea.
:::

## The core conflict: durable, fast, readable

A disk write that lands in a *random* location is expensive: seek to the right spot, modify it. A write *appended to the end of a file* is cheap: no seek, just keep going. SSDs soften the seek penalty but add their own twist — they can only erase in large blocks, so random in-place updates trigger internal rewrites. The conclusion holds on both: **sequential beats random.**

```
 RANDOM write (update row 7's page, wherever it lives):   slow — locate + modify in place
 SEQUENTIAL write (append to the end of a log file):      fast — no seek, just append
```

So the question every engine answers is: **how do I turn the random writes my data layout wants into sequential writes the disk prefers — without losing durability or wrecking reads?** The WAL handles the durability half; the engine family (B-tree vs LSM) handles the layout half. The cost of each choice shows up as one of three **amplifications** — keep these in mind, they're the scorecard for the whole page:

- **Write amplification** — bytes actually written to disk ÷ bytes of logical data. (Rewriting a whole page for a 20-byte change; rewriting a key many times as it migrates between levels.)
- **Read amplification** — disk reads per logical lookup. (Probing several files to find one key.)
- **Space amplification** — bytes on disk ÷ bytes of live data. (Dead row versions, superseded keys awaiting compaction.)

No engine wins all three. Picking a database is, underneath the marketing, **picking which amplification you can afford.**

## The write-ahead log: durability, decoupled from layout

The rule is in the name — **write ahead**. Before modifying the real data structure, the engine:

1. Appends a compact record of the change to the **WAL** (a sequential file).
2. Calls **`fsync`** — the OS call that forces those bytes onto the physical device, not just into a volatile OS write buffer.
3. *Only then* acknowledges the write to the client.

```
 client: UPDATE accounts SET balance = 50 WHERE id = 7
    │
    ├─(1)─► append "txn 42: id=7 balance→50" to WAL ──► fsync ✔ (now durable)
    ├─(2)─► ACK to client  ◄── we can say "yes" already; the real data isn't reorganized yet
    └─(3)─► update the main data structure (in memory now, on disk later), lazily
```

The payoff: the *durability* point (step 1) is a fast sequential append, decoupled from the *slow* random reorganization of the main data (step 3). The "D" in ACID is this `fsync`'d WAL — nothing more magical.

### The knobs that actually live here

This is where real systems expose the durability/latency trade, and where engineers get burned:

- **`fsync` vs `fdatasync`.** `fsync` flushes data *and* file metadata (like size); `fdatasync` skips the metadata flush when it isn't needed. Engines use the cheaper one where it's safe to shave a flush off every commit.
- **Group commit.** A single `fsync` is expensive (a fraction of a millisecond to milliseconds). Rather than one flush per transaction, the engine batches many transactions' WAL records and flushes them together — one `fsync` amortized across dozens of commits. This is why a database's throughput often *rises* under concurrency: more commits per flush.
- **The "wait for the flush?" switch.** Postgres calls it `synchronous_commit`. **On:** the commit waits for the WAL `fsync` before acking — fully durable. **Off:** it acks *before* the flush — much lower latency, but a crash can lose the last fraction of a second of acked transactions (*no corruption, just a small loss window*). That single setting is a dial between "fast" and "durable," and you must choose it deliberately per workload.
- **Torn writes / full-page writes.** A crash mid-write can leave a *torn* page (half old, half new bytes) — the data file is corrupt, not just stale. Engines defend by writing a **full image of a page** to the WAL the first time it changes after a checkpoint (Postgres' `full_page_writes`), so recovery can reconstruct any page the crash tore.

:::caution[Durability is a property of `fsync`, not of "it returned without error"]
If the WAL bytes sit in the OS page cache but aren't `fsync`'d to the device, a *power cut* loses them — even though your `INSERT` "succeeded." Engines that let you disable/batch `fsync` (or cheap disks that *lie* about completing a flush) trade durability for speed. "It's in the database" only means "it survives a crash" when a `fsync`'d log entry exists for it.
:::

## The two storage-engine families

### B-tree — update in place (read-optimized)

A **B-tree** keeps data sorted in fixed-size **pages** (commonly 4–16 KB) arranged as a shallow, very wide tree. Each node points to *hundreds* of children — high **fanout** — so even a table of billions of rows is only ~3–4 levels deep. To read row 7, you walk root → branch → leaf: a handful of page reads, *regardless of table size*.

- **Reads:** excellent and predictable — a point lookup is `O(log n)` page reads, and the sorted layout makes range scans cheap.
- **Writes:** the engine finds the leaf page and **modifies it in place** (after the WAL records the change). A tiny logical change can dirty and re-flush a whole page → **write amplification**. When a page fills, it **splits** into two (and pages **merge/rebalance** on deletes) — extra I/O and the source of index fragmentation.
- **The buffer pool.** Hot pages live in RAM (Postgres `shared_buffers`, InnoDB buffer pool); writes mutate the *cached* page (marked "dirty") and are flushed to their fixed home location later, in bulk.
- **Clustered vs secondary indexes.** In InnoDB the *primary key B-tree leaf holds the whole row* (a **clustered** index) — fast PK lookups, but a secondary index must store the PK and do a second lookup. Postgres keeps the rows in a separate **heap** and all indexes point into it (non-clustered).
- **The MVCC cost.** To let readers not block writers, Postgres keeps *old row versions*: an `UPDATE` writes a new tuple and leaves the old one dead, to be reclaimed later by `VACUUM`. Skip vacuuming a hot table and dead versions accumulate as **space amplification** ("bloat").
- **Used by:** PostgreSQL, MySQL/InnoDB, SQLite — the relational engines from [SQL databases](/docs/foundations/databases-sql).

### LSM-tree — only ever append (write-optimized)

A **log-structured merge-tree (LSM)** refuses random writes entirely. A write goes to:

1. The WAL (durability), then
2. An in-memory sorted structure, the **memtable**.

Client acked. When the memtable fills, it's flushed *sequentially* to disk as an immutable sorted file — an **SSTable** (sorted string table). New writes hit a fresh memtable; existing SSTables are **never edited, only superseded** by newer ones.

```
 writes ─► WAL (fsync) ─► memtable (RAM, sorted)
                              │  when full, flush sequentially ▼
   level 0:               [ SSTable ] [ SSTable ] ...   ← overlapping key ranges, newest on top
                              │  background COMPACTION merges & drops superseded keys ▼
   level 1+:             [ ─────── SSTable ─────── ]     ← fewer, larger, NON-overlapping per level
```

- **Writes:** superb throughput — every write is a sequential append (WAL + later a sequential memtable flush). No in-place updates.
- **Reads:** a key may live in the memtable *or any* SSTable, so a lookup can probe several files — **read amplification**. Two things bound it: **(a) levels** — past L0, leveled compaction keeps each level's SSTables *non-overlapping*, so a read hits at most one SSTable per level; **(b) bloom filters** — a tiny per-SSTable index that answers "*definitely not here*" or "*maybe here*." A bloom filter never yields a false *negative* (so it's safe to skip a "no" file) but has tunable false *positives* (a wasted probe, never a wrong answer).
- **Deletes are tombstones.** You can't edit an immutable SSTable, so a delete writes a **tombstone** — a marker that *shadows* older values for that key. The tombstone must survive until every older copy of the key has been compacted away; drop it too early and a stale value in a deep SSTable can **resurrect** (a real, infamous bug class — Cassandra guards it with `gc_grace_seconds`).
- **Used by:** RocksDB, Cassandra, ScyllaDB, LevelDB; the backbone of many key-value and time-series stores.

### The trade in one table

| | B-tree (in-place) | LSM-tree (append + compact) |
|---|---|---|
| Write path | log → modify page in place | log → memtable → flush SSTable |
| Optimized for | **reads** / point + range | **writes** / high ingest |
| Pays in | write amplification (page rewrites), bloat from dead versions | read amplification (probe levels) + space/write amp from compaction |
| Deletes | remove in place (or dead-version) | tombstone + later compaction |
| Reach for it when | read-heavy, transactional, mixed | write-heavy, append-heavy, huge ingest |

## Compaction strategies: the LSM dial between the three amplifications

An LSM's personality is set by *how* it merges SSTables. The two classic strategies trade the amplifications against each other — this is the single most important LSM tuning decision:

- **Size-tiered (STCS).** Merge SSTables of *similar size* into a bigger one. **Low write amplification** (a key is rewritten only when its tier merges) but **high read & space amplification** (many overlapping tables to probe; a merge can momentarily need up to ~2× the data's space). Good for **write-heavy** workloads.
- **Leveled (LCS).** Maintain levels L1, L2, … each ~10× larger, with **non-overlapping** SSTables *within* a level. **Low read amplification** (≤ one SSTable per level) and **low space amplification** (~10% overhead) — but **high write amplification**, because a key is rewritten each time it migrates down a level. Good for **read-heavy** workloads.

```
 Roughly, for a leveled LSM with ~10× levels and ~7 levels deep:
   write amplification ≈ 10–30×   (rewritten as it descends)
   read amplification  ≈ levels   (memtable + ≤1 SSTable/level, minus bloom-filtered skips)
   space amplification ≈ ~1.1×    (little dead data lingering)
 A size-tiered LSM flips this: write amp ~drops, read & space amp ~rise.
```

There's no free lunch — every LSM knob you turn moves cost from one amplification to another. Naming which one your workload can least afford *is* the tuning.

:::info[Highlight: this is *why* your database has the performance shape it does]
When a benchmark says "Cassandra eats writes but point reads need tuning," or "Postgres reads are rock-solid but write-heavy tables bloat and need aggressive vacuum," you're seeing the engine family and its compaction/MVCC settings — not a vendor quirk. An LSM ingests a firehose because every write is a sequential append; it repays that on reads (probe memtable + SSTables, rescued by bloom filters) and on background compaction I/O. A B-tree gives crisp, predictable reads because data sits in its sorted home; it repays that on writes (locate the page, rewrite it in place, split when full) and on dead-version cleanup. **Choosing a database is choosing which amplification you can afford for your access pattern** — and then choosing the compaction/vacuum settings that move the remaining cost where it hurts least.
:::

## Crash recovery & checkpoints

A crash can hit *after* the WAL `fsync` (and ack) but *before* the change reached the main data files. Recovery is exactly: **on restart, replay the WAL forward**, reapplying anything that didn't make it into the durable data structure. Nothing acked is lost; nothing half-applied is left corrupt (full-page images repair any torn page).

But replaying the *entire* WAL since the dawn of time would make startup take hours. The fix is a **checkpoint**: periodically the engine flushes its dirty pages/memtables to the durable data files and records "everything up to WAL position N is safely persisted." Recovery then replays *only from the last checkpoint forward*, and WAL before that point can be recycled.

```
 WAL:  ──[ checkpoint @N ]──[ change ]──[ change ]──[ change ]── 💥 crash
                            └──────── replay only this tail on restart ────────┘
```

Real engines use **fuzzy checkpoints** — flushing dirty pages gradually in the background rather than freezing the world — so checkpointing doesn't stall live traffic. There's a tension to tune: **checkpoint often** → fast recovery but constant background flushing; **checkpoint rarely** → less steady-state I/O but a longer WAL to replay (slower recovery) and more disk held by un-recycled log. "The database came back and everything was fine" is just: a `fsync`'d log, replayed from the last checkpoint.

:::note[Worked example: one write, traced through an LSM engine — crash, then compaction]
A wallet service runs `UPDATE accounts SET balance = 50 WHERE id = 7` on a Cassandra-style (LSM) store.

1. **WAL append + `fsync`.** `{id:7, balance:50, ts:42}` is appended to the commit log and forced to disk. **This is the durability point.**
2. **Memtable apply.** The in-memory sorted memtable now holds `7 → 50 (ts 42)`, shadowing any older value.
3. **Ack.** Client told "done." Note: *no SSTable was written and no page modified in place* — both the durable bit (WAL) and the live value (memtable) are append-only/in-memory.
4. **— power cut, right here —**
5. **Restart + recovery.** The memtable was RAM and is gone. The engine replays the commit log from the last checkpoint, re-sees `{id:7, balance:50, ts:42}`, and rebuilds the memtable. **The acked write survives** — because step 1 happened before step 3.
6. **Later, no crash:** the memtable fills and flushes sequentially to an L0 SSTable. Later still, **compaction** merges it down; because `ts 42` is newest, any older `id=7` value in an existing SSTable is dropped — reclaiming space and shortening future reads of `id=7`.
7. **Now delete the account:** `DELETE` writes a **tombstone** for `id=7` to the memtable, which flushes to an SSTable. A read of `id=7` finds the tombstone first → returns "absent," even though an *older* SSTable still physically holds `balance:50`. Only once compaction has merged past that old SSTable can the tombstone itself be safely dropped — drop it sooner and `balance:50` would **resurrect**.

A read of `id=7` checks the memtable first (hit → done); on a miss it consults SSTables newest-first, using **bloom filters** to skip ones that can't contain key 7, newest timestamp wins. Contrast a B-tree (Postgres): step 1 is the same WAL `fsync`, but step 3 modifies the actual leaf page holding `id=7` in the buffer pool (dirty), and a later checkpoint `fsync`s that page to its fixed home; a delete removes the row in place (leaving a dead version for `VACUUM`), with no tombstone-resurrection hazard.
:::

## Mapping to real databases

The vocabulary on this page is exactly what these systems' docs assume you know:

| System | Engine family | Durability log | Notable trait |
|---|---|---|---|
| **PostgreSQL** | B-tree (heap + non-clustered indexes) | WAL + `full_page_writes` | MVCC → dead versions → `VACUUM`; `synchronous_commit` durability dial |
| **MySQL / InnoDB** | B-tree, **clustered** on PK | redo log (+ doublewrite buffer for torn pages) | secondary index → PK → row (two hops) |
| **SQLite** | B-tree | rollback journal *or* WAL mode | WAL mode lets readers and a writer run concurrently |
| **RocksDB / LevelDB** | LSM | WAL | embeddable; pluggable compaction (leveled/universal) |
| **Cassandra / ScyllaDB** | LSM | commit log | tombstones + `gc_grace_seconds`; size-tiered or leveled compaction |

## Why it matters

You will make or live with these calls in production, often without a second chance:

- **Picking a database** is picking an amplification to pay. A write-firehose (events, metrics, logs) on a B-tree drowns in write amplification and bloat; a latency-sensitive point-read service on an untuned LSM pays read amplification probing SSTables. Match the engine to your *dominant* access pattern.
- **Setting the durability dial** (`synchronous_commit` and friends) is a correctness decision disguised as a performance tweak. "We turned it off and got faster" can mean "we now silently lose the last 200 ms of orders on a crash."
- **Capacity planning for an LSM** must budget for **compaction I/O** and **space-amplification headroom** — the periodic latency spikes and the "why is the disk twice as full as the data?" both trace back here.
- **Diagnosing the weird stuff** — a deleted row reappearing (tombstone GC'd too early), a table that's huge despite few live rows (B-tree bloat / un-merged SSTables), recovery that takes 40 minutes (checkpoint interval too long) — is guesswork until you know this layer.

## How this connects to the rest of the chapter

The WAL isn't only for single-machine recovery — **it's usually what gets replicated.** "Physical" or log-shipping replication streams the leader's WAL to followers, which **replay** it to stay in sync. That reframes two ideas from [replication](./ds-replication):

- **Replication lag** is just *how far behind a follower is in replaying the leader's log.* A loaded follower applies the WAL slower than the leader produces it → stale reads. "Read-your-own-writes" fails when a follower hasn't yet replayed your write's log record.
- **Synchronous vs asynchronous replication** is *when the leader counts a follower's `fsync` of the shipped log* — wait for it (durable across machines, slower) or don't (faster, a small loss window on failover). It's the same `synchronous_commit` trade-off as above, stretched across the network.

So the single-machine durability mechanism on this page *is* the mechanism that gives the cluster its consistency behavior. Storage internals aren't a side topic to distributed systems — they're the floor it stands on.

## Interactive practice — the LSM read path

The defining LSM read rule is **newest-wins with tombstones**: scan sources newest→oldest, and the first source that holds the key decides the answer — unless that value is a tombstone, in which case the key is *deleted*. Implement it.

<CodeChallenge
  id="ds-lsm-read-path"
  fnName="lsmRead"
  prompt="Write lsmRead(key, memtable, sstables). memtable and each sstable are plain objects { key: value }. Search NEWEST first — memtable, then sstables[0], sstables[1], … The first source that has the key wins. A value of null is a TOMBSTONE (deleted). Return the current value, or undefined if the key is absent or deleted."
  starter={`function lsmRead(key, memtable, sstables) {\n  // Sources, newest first:\n  //   memtable, then sstables[0], sstables[1], ...\n  // First source that HAS the key decides.\n  // If that value is null (tombstone) => deleted => undefined.\n  // your code\n}`}
  solution={`function lsmRead(key, memtable, sstables) {\n  const sources = [memtable, ...sstables];\n  for (const src of sources) {\n    if (Object.prototype.hasOwnProperty.call(src, key)) {\n      return src[key] === null ? undefined : src[key];\n    }\n  }\n  return undefined;\n}`}
  tests={[
    {args: ['a', {a: 10}, [{a: 5, b: 7}, {b: 99, c: 3}]], expected: 10, label: 'memtable shadows older SSTable'},
    {args: ['b', {a: 10}, [{a: 5, b: 7}, {b: 99, c: 3}]], expected: 7, label: 'newer SSTable wins over older'},
    {args: ['c', {a: 10}, [{a: 5, b: 7}, {b: 99, c: 3}]], expected: 3, label: 'found only in oldest SSTable'},
    {args: ['z', {a: 10}, [{a: 5, b: 7}]], expected: undefined, label: 'absent everywhere'},
    {args: ['a', {a: null}, [{a: 5}]], expected: undefined, label: 'tombstone shadows old value (delete)'},
  ]}
  hint="Build one list [memtable, ...sstables] and loop it in order. Use hasOwnProperty so a stored null still counts as 'has the key'. Return undefined when the winning value is null, or when no source has the key."
/>

## Common mistakes

:::caution[Where people commonly trip up]
- **Equating "the `INSERT` returned" with "it's durable."** Durability is a `fsync`'d log entry. Disabled/batched `fsync`, `synchronous_commit=off`, or lying disks mean a power cut can eat acked writes. Know the setting before you promise durability.
- **Choosing the wrong engine for the workload.** Write-firehose on a B-tree → write amplification + bloat; read-latency-sensitive on an untuned LSM → read amplification. Match the engine's strength to your dominant access pattern.
- **Forgetting compaction isn't free.** LSM compaction is background I/O competing with live traffic; ignore it and you get periodic latency spikes, write stalls, and a disk that's mysteriously 2× the live data (space amplification). Provision headroom and pick the right strategy (size-tiered vs leveled).
- **The tombstone-resurrection trap.** Reclaiming tombstones before older copies are compacted out lets deleted data come back. Respect the engine's grace period (e.g. Cassandra's `gc_grace_seconds`); never hand-delete SSTables.
- **Assuming an LSM read is one lookup.** Without bloom filters or with too many un-compacted L0 files, a point read touches several files. Monitor read amplification, not just write throughput.
- **Checkpoint interval set and forgotten.** Too rare → slow crash recovery and a bloated WAL; too frequent → constant background flushing. Tune it against your recovery-time objective.
- **Treating replication lag as purely a network issue.** Often the follower is simply *replaying the WAL slower than the leader writes it* — an apply-throughput problem rooted in this page, not the link.
:::

## Page checkpoint

<Quiz id="ds-storage-internals-page" title="Did storage internals stick?" sampleSize={3}>

<Question
  prompt="Why does a storage engine write to a write-ahead log (and fsync it) BEFORE updating its main data structure?"
  options={[
    { text: "To compress the data before storing it" },
    { text: "A sequential log append + fsync is fast and makes the change durable immediately, decoupling the durability point from the slower random reorganization of the main data; on a crash, the log is replayed to recover anything not yet applied" },
    { text: "Because the WAL is encrypted and the main data is not" },
    { text: "To avoid using any disk I/O at all" }
  ]}
  correct={1}
  explanation="Sequential appends are cheap, so log-then-fsync gives durability fast while the random-I/O reorganization of the real data happens lazily. Recovery replays the WAL forward from the last checkpoint, so no acked write is lost and no half-applied change corrupts the data."
  revisit={{ to: "/docs/distributed-systems/ds-storage-internals#the-write-ahead-log-durability-decoupled-from-layout", label: "Write-ahead log" }}
/>

<Question
  prompt="What is the fundamental trade-off between a B-tree and an LSM-tree storage engine?"
  options={[
    { text: "B-trees are newer and strictly better than LSM-trees" },
    { text: "A B-tree updates pages in place — read-optimized, but pays write amplification and dead-version bloat; an LSM-tree only appends (memtable → immutable SSTables, merged by compaction) — write-optimized, but pays read and space amplification" },
    { text: "LSM-trees can't survive a crash; B-trees can" },
    { text: "B-trees are for NoSQL and LSM-trees are for SQL" }
  ]}
  correct={1}
  explanation="B-trees keep sorted pages and modify them in place: crisp predictable reads, but rewriting/flushing pages (write amplification) and dead versions to reclaim. LSM-trees turn all writes into sequential appends (great ingest) but a read may probe memtable plus several SSTables (read amplification), and compaction costs I/O and space. Choosing a database is choosing which amplification you can afford."
  revisit={{ to: "/docs/distributed-systems/ds-storage-internals#the-two-storage-engine-families", label: "B-tree vs LSM" }}
/>

<Question
  prompt="In an LSM-tree, leveled compaction vs size-tiered compaction trade the amplifications how?"
  options={[
    { text: "Leveled is strictly better on all three amplifications" },
    { text: "Leveled keeps non-overlapping SSTables per ~10× level → low read & space amplification but high write amplification (keys rewritten descending levels); size-tiered merges similar-sized tables → low write amplification but higher read & space amplification" },
    { text: "They only differ in file naming, not performance" },
    { text: "Size-tiered eliminates the need for bloom filters" }
  ]}
  correct={1}
  explanation="Leveled compaction bounds reads (≤1 SSTable per non-overlapping level) and keeps space overhead low, but rewrites a key repeatedly as it migrates down levels (write amplification). Size-tiered merges similarly-sized tables, minimizing rewrites (low write amp) at the cost of more overlapping tables to probe and transient 2× space. You pick the one that protects your workload's scarcest amplification."
  revisit={{ to: "/docs/distributed-systems/ds-storage-internals#compaction-strategies-the-lsm-dial-between-the-three-amplifications", label: "Compaction strategies" }}
/>

<Question
  prompt="Why does an LSM-tree delete by writing a 'tombstone,' and what's the hazard?"
  options={[
    { text: "Tombstones compress the database; there is no hazard" },
    { text: "SSTables are immutable, so a delete can't remove the value in place — it writes a tombstone that shadows older copies; the hazard is reclaiming the tombstone before all older copies are compacted away, which lets the deleted value resurrect" },
    { text: "Tombstones are only for encryption keys" },
    { text: "A tombstone immediately erases every copy of the key on all disks" }
  ]}
  correct={1}
  explanation="Because SSTables are never edited, a delete is recorded as a tombstone marker that shadows older values on read. It must outlive every older copy of the key; if compaction drops it too early, a stale value in a deeper SSTable becomes visible again — the classic 'deleted data came back' bug (guarded by grace periods like Cassandra's gc_grace_seconds)."
  revisit={{ to: "/docs/distributed-systems/ds-storage-internals#lsm-tree--only-ever-append-write-optimized", label: "Tombstones" }}
/>

<Question
  prompt="How does the single-machine write-ahead log relate to replication lag in a cluster?"
  options={[
    { text: "It doesn't — replication uses a completely separate mechanism" },
    { text: "Log-shipping replication streams the leader's WAL to followers, which replay it; replication lag is how far behind a follower is in replaying that log, which is why a loaded follower serves stale reads" },
    { text: "Replication lag is caused only by network bandwidth, never by the log" },
    { text: "The WAL is deleted before replication, so it can't be involved" }
  ]}
  correct={1}
  explanation="The same WAL that powers crash recovery is typically what gets replicated: followers replay the leader's log to stay in sync. A follower applying the log slower than the leader produces it falls behind — that gap IS replication lag, and it's why read-your-own-writes can fail against a follower."
  revisit={{ to: "/docs/distributed-systems/ds-storage-internals#how-this-connects-to-the-rest-of-the-chapter", label: "WAL and replication" }}
/>

</Quiz>

## What's next

→ Next: [Consensus in motion — election, failure detection & testing](./ds-consensus-internals) — the operational depth behind [consensus](./ds-consensus): how Raft actually elects a leader and recovers from a partition, how nodes decide another is dead without crying wolf, and how you *prove* a distributed system correct with fault injection.
