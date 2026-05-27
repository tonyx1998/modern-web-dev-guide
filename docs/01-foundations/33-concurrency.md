---
id: concurrency
title: 'Concurrency & async: the event loop, races, and idempotency'
sidebar_position: 33
sidebar_label: Concurrency & async
description: How JavaScript's event loop actually works, what async/await desugars to, the race conditions you didn't think you had, and the idempotency patterns that let "exactly once" stop being a lie.
---

# Concurrency & async: the event loop, races, and idempotency

> **In one line:** Concurrency is hard because more than one thing happens at a time and they touch shared state. The defenses are: understand the event loop, write idempotent operations, and use locks/transactions for the cases that genuinely need them.

:::tip[In plain English]
JavaScript looks single-threaded — only one piece of your code runs at a time. But your *server* handles many users at once, and your *database* sees writes from multiple processes. Two requests arriving at the same moment, both updating the same user's balance, can produce wrong results if you wrote the code assuming one request at a time. This page is how to think about that — and the patterns (idempotency, transactions, advisory locks, exactly-once-by-construction) that make it survivable.
:::

This is the layer that, when you ignore it, produces the worst kinds of bugs: rare, intermittent, expensive ("we double-charged 4 customers and don't know why"). Understanding concurrency is the difference between code that works in dev and code that works at scale.

## The JavaScript event loop in 90 seconds

JS has *one* main thread. Code on that thread runs to completion before anything else runs. So how does it handle async I/O?

Answer: **the event loop**.

```mermaid
flowchart LR
    Call[Call stack<br/>currently running code] -->|sync| Call
    Call -->|"Promise / setTimeout / fetch / fs.read"| Async[Browser/Node async APIs<br/>(work happens elsewhere)]
    Async -->|"when done"| Q1[Microtask queue<br/>(Promise callbacks)]
    Async -->|"timer fires / I/O done"| Q2[Macrotask queue<br/>(setTimeout, network)]
    Q1 -->|"drained after each task"| Call
    Q2 -->|"one per loop iteration"| Call
```

The loop:

1. Run the current synchronous code to completion (the **task**).
2. Drain the **microtask queue** entirely (Promise `.then` callbacks, `queueMicrotask`).
3. Render (browser only — once per ~16ms).
4. Take *one* task off the **macrotask queue** (`setTimeout`, network callbacks, I/O completion).
5. Repeat.

Critical implications:

- **A long-running synchronous function blocks everything.** While it's running, no Promise callbacks fire, no events handle, no rendering happens. A 200ms JSON parse freezes your UI.
- **`setTimeout(fn, 0)` doesn't run immediately.** It schedules `fn` to the macrotask queue; it'll run after the current task and all microtasks complete.
- **Microtasks starve macrotasks.** A `Promise` chain that keeps creating new Promises in `.then` will never let `setTimeout` callbacks fire.
- **Concurrent doesn't mean parallel.** Two `await`s "happen at the same time" only in the sense that both can be suspended waiting for I/O. The actual JS code interleaves on one thread.

### `async` / `await` is sugar for `.then`

```typescript
async function getUserOrders(id: string) {
  const user = await db.users.find(id);
  const orders = await db.orders.findByUser(user.id);
  return orders;
}

// equivalent to:
function getUserOrders(id: string) {
  return db.users.find(id).then((user) => {
    return db.orders.findByUser(user.id).then((orders) => orders);
  });
}
```

`await` pauses the function, returns to the event loop, and resumes the function as a microtask when the awaited Promise resolves. The function is sequential; only the *thread* is non-blocking.

### Parallel vs sequential

```typescript
// ❌ Sequential: waits for user, then orders. Slow if independent.
const user = await db.users.find(id);
const inventory = await db.inventory.all();  // doesn't depend on user!

// ✓ Parallel: both run concurrently; total time = max(t_user, t_inventory)
const [user, inventory] = await Promise.all([
  db.users.find(id),
  db.inventory.all(),
]);
```

If two awaits don't depend on each other, `Promise.all` is almost always what you want. It's free latency.

`Promise.all` rejects if *any* promise rejects — and the others keep running but their results are discarded. Use `Promise.allSettled` if you want results regardless of individual failures.

## Concurrency in Node servers

Node runs the event loop per process. By default, one process = one CPU core. To use multiple cores:

- **Cluster mode** — `cluster` module or PM2 forks N worker processes. Each has its own event loop. Load balancer distributes connections.
- **Multi-instance deployment** — Docker / Fly / Vercel runs N containers, one process each.
- **Worker threads** — `worker_threads` module for CPU-bound JS code. Less common; usually better to push CPU-bound work to a queue + worker service.

So your "single-threaded" Node server actually has N processes serving requests concurrently. Each request gets a slice of one event loop's time, but at any given moment, N requests are in-flight across N processes — and they may be touching the same database rows.

## Race conditions

A **race condition** is when the correctness of code depends on the timing of independent operations.

Classic: "TOCTOU" — Time Of Check, Time Of Use.

```typescript
// ❌ Race condition
async function deductBalance(userId: string, amount: number) {
  const user = await db.users.find(userId);          // check
  if (user.balance < amount) throw new Error('insufficient funds');
  await db.users.update(userId, { balance: user.balance - amount }); // use
}
```

Two concurrent requests, user has $100, each requesting $80:

| Time | Request A | Request B | DB balance |
|------|-----------|-----------|------------|
| t=0  | read balance: $100 | | $100 |
| t=1  | | read balance: $100 | $100 |
| t=2  | $100 >= $80, OK | | $100 |
| t=3  | | $100 >= $80, OK | $100 |
| t=4  | update: balance = $100 - $80 = $20 | | $20 |
| t=5  | | update: balance = $100 - $80 = $20 | $20 |

User had $100, now is at $20, but spent $160. The bug: the *read* happened before the *write*, with no coordination.

### Defenses

**1. Transaction with row-level lock (DB does the work)**

```typescript
await db.transaction(async (tx) => {
  const user = await tx.query('SELECT * FROM users WHERE id = $1 FOR UPDATE', [userId]);
  if (user.balance < amount) throw new Error('insufficient funds');
  await tx.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
});
```

`FOR UPDATE` locks the row until the transaction commits; the second concurrent transaction waits its turn. The whole operation is atomic.

**2. Atomic update with conditional WHERE**

```typescript
const result = await db.query(
  'UPDATE users SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING *',
  [amount, userId],
);
if (result.rowCount === 0) throw new Error('insufficient funds');
```

No check-then-act; the DB enforces the condition atomically. Faster than a transaction for simple cases.

**3. Optimistic locking with version columns**

```typescript
const user = await db.users.find(userId);
const result = await db.query(
  'UPDATE users SET balance = $1, version = version + 1 WHERE id = $2 AND version = $3',
  [user.balance - amount, userId, user.version],
);
if (result.rowCount === 0) throw new Error('concurrent update — retry');
```

If someone else updated the row between your read and write, the `version` no longer matches → 0 rows affected → you retry. Good for low-contention workloads.

**4. Pessimistic locking via advisory locks**

Postgres' `pg_advisory_xact_lock(key)` lets you mutex on arbitrary keys ("only one process can be processing user 42 at a time"). For cases where the natural row-lock doesn't fit.

### The general rule

**Anywhere you read state, then make a decision, then write state, you have a potential race.** Either:

- Push the decision into the write (atomic update with WHERE clause).
- Hold a lock through both (transaction).
- Use optimistic concurrency (version field).

Choose based on contention: low contention → optimistic; high contention → pessimistic.

## Idempotency: the property that lets retries be safe

An operation is **idempotent** if running it twice produces the same result as running it once.

- `SET balance = 100` — idempotent.
- `UPDATE balance = balance + 10` — NOT idempotent (different result each run).
- `INSERT INTO orders (id, ...) ON CONFLICT DO NOTHING` — idempotent.
- `INSERT INTO orders (...)` — NOT idempotent (creates duplicates).
- `DELETE FROM x WHERE id = 1` — idempotent.

Why does this matter? **Networks fail.** Your client sends a request, server processes it, but the response gets lost. The client retries. Without idempotency, you've done the operation twice.

### Idempotency keys

The standard pattern for APIs (Stripe popularized this):

```http
POST /api/payments
Idempotency-Key: 8f3a1b2c-d4e5-6f7a-8b9c-0d1e2f3a4b5c
Content-Type: application/json

{ "amount": 1000, "currency": "USD" }
```

The server stores the key + result. If the same key arrives again, return the stored result without re-processing.

```typescript
async function createPayment(req: Request) {
  const key = req.headers.get('Idempotency-Key');
  if (!key) throw new Error('Idempotency-Key required');

  // Look up or create — atomic insert with conflict handling
  const existing = await db.query(
    'SELECT result FROM idempotency_keys WHERE key = $1',
    [key],
  );
  if (existing.rows[0]) return JSON.parse(existing.rows[0].result);

  const result = await processPayment(req.body);
  await db.query(
    'INSERT INTO idempotency_keys (key, result, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
    [key, JSON.stringify(result)],
  );
  return result;
}
```

Edge cases to handle:
- **Same key, different body** — reject (the client is buggy).
- **Same key, same body, request still in flight** — wait or return "still processing."
- **Retention** — idempotency keys aren't free; expire them after N days.

Most production APIs that do anything billable (Stripe, Twilio, OpenAI billing) require or strongly recommend idempotency keys.

## Exactly-once vs at-least-once vs at-most-once

In distributed systems, message delivery has three semantics:

| Semantic | Behavior | Cost |
|----------|----------|------|
| **At-most-once** | Send the message; if it's lost, oh well | Simple; data loss |
| **At-least-once** | Retry until acknowledged | Duplicates possible; needs idempotent consumer |
| **Exactly-once** | Every message processed exactly once | Hard; usually emulated via at-least-once + idempotent consumer |

True exactly-once *over a network* is provably impossible (a server can't tell whether the ACK was lost or the message was). What "exactly-once" really means in production: **at-least-once delivery + idempotent processing**.

This is why every serious distributed system (Kafka, SQS, your job queue) eventually says: "design your consumers to be idempotent. We promise at-least-once. The 'exactly-once' is your job."

## Deadlocks and livelocks

**Deadlock**: two processes each waiting on a lock the other holds. Neither can progress.

```
Process A: locks user 1, waits for user 2
Process B: locks user 2, waits for user 1
```

Defenses:
- **Lock in a consistent order.** Both processes always lock user-with-lower-id first. Eliminates the cycle.
- **Lock timeouts.** Database query timeout. If a query waits too long, it errors; you retry with a backoff.
- **Detection.** Postgres detects deadlocks and kills one of the participants. You catch the error and retry.

**Livelock**: processes are actively running but making no progress (e.g., both keep retrying and stomping on each other). Less common; fixed by adding jitter to retries.

## Backpressure

What happens when work arrives faster than you can process it?

- A naive producer keeps queuing — memory grows until OOM.
- A bounded queue rejects new work past capacity — better, but now the producer must handle "queue full."
- A streaming system applies **backpressure** — the consumer signals the producer to slow down.

Node streams have built-in backpressure: `writable.write(chunk)` returns `false` when the buffer is full; the producer is supposed to wait for `'drain'` before continuing.

For job queues: bound the queue, expose its depth as a metric, scale workers when it grows. For HTTP servers: rate-limit (see [Rate limiting](./rate-limiting)), shed load with 503 when overloaded.

## Patterns that compose

Real production code uses a few patterns repeatedly:

### Retry with exponential backoff and jitter

```typescript
async function retry<T>(fn: () => Promise<T>, maxAttempts = 5): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err;
      const base = Math.min(1000 * 2 ** attempt, 30_000);
      const jitter = Math.random() * base;
      await new Promise((r) => setTimeout(r, base + jitter));
    }
  }
  throw new Error('unreachable');
}
```

Standard for transient failures (network, 5xx, rate limits). Jitter prevents synchronized retry storms.

### Circuit breaker

When a dependency is failing, stop calling it for a while. Three states:

- **Closed** — normal operation, calls go through.
- **Open** — too many failures; calls fail fast without hitting the dependency.
- **Half-open** — after a cooldown, let one call through; if it succeeds, close; if not, stay open.

Libraries: `opossum` (Node), `resilience4j` (JVM). Protects you from cascading failures and gives the broken dependency room to recover.

### Singleflight / request coalescing

Same request from many callers → only one actually runs; others wait for the shared result.

```typescript
const inFlight = new Map<string, Promise<unknown>>();

function singleflight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const p = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, p);
  return p;
}
```

Saves a cache stampede from doing 1000 DB queries when one would suffice.

### Cancellation with AbortController

```typescript
const controller = new AbortController();
const res = await fetch('/api/slow', { signal: controller.signal });
// somewhere else:
controller.abort();
```

Propagate `AbortSignal` through your stack so when the user closes the tab, every async operation downstream can stop. Prevents server-side waste on requests no one is reading.

## Common mistakes

:::caution[Where people commonly trip up]
- **Awaiting sequentially when parallel is possible.** Two independent awaits in a row doubles your latency for no reason. `Promise.all` is free speed.
- **`await` inside a `forEach`.** `[1, 2, 3].forEach(async (x) => { await foo(x); })` doesn't wait — `forEach` ignores the returned promise. Use `for…of` (sequential) or `Promise.all(arr.map(...))` (parallel).
- **Long sync work on the request thread.** A 200ms JSON parse blocks every other request on that Node process. Push to a worker or batch.
- **Mutable shared state across requests.** A module-level `cache: Map` is shared. One user's request pollutes another's. Either pin to a request scope or use a real shared cache (Redis).
- **Idempotency keys generated server-side.** Defeats the purpose — the *client* must generate them so a retry uses the same key. Make the client send them.
- **No retries on transient failures.** Network blips, brief 5xx, rate limits — all should be retried. Without it, your error rate is artificially high.
- **Retries with no backoff or jitter.** Thousand clients retrying every 100ms = mini-DDoS on your own dependency. Exponential backoff + jitter, always.
- **Trusting 'exactly once' message delivery.** Anyone offering it in distributed systems is either lying or using a very specific narrow definition. Build idempotent consumers; assume at-least-once.
- **Reading-then-writing without a transaction.** Classic balance-deduction race. Either atomic update with WHERE clause, or transaction with `FOR UPDATE`, or optimistic version field.
- **Holding locks across network calls.** Lock a row, await a 3rd-party API for 2 seconds, then release. During those 2 seconds nothing else can touch that row. Do the network call outside the lock; revalidate inside.
- **No backpressure.** A producer queueing work as fast as it can, into an unbounded array or stream, until OOM. Bound the queue; signal the producer to wait.
- **`setTimeout(fn, 0)` thinking it's immediate.** It runs after current sync code + microtasks. Use `queueMicrotask(fn)` to get truly-next-tick.
:::

## Page checkpoint

<Quiz id="foundations-concurrency-page" title="Did concurrency & async stick?" sampleSize={2}>

<Question
  prompt="A function reads `user.balance`, checks it's ≥ `amount`, then writes `balance - amount`. Two concurrent requests both succeed with insufficient real funds. What's the class of bug?"
  options={[
    { text: "Memory leak" },
    { text: "Race condition (TOCTOU — time of check / time of use). Defenses: atomic UPDATE with a WHERE clause that includes the condition, or a transaction with `SELECT … FOR UPDATE`, or optimistic locking with a version column" },
    { text: "Type error" },
    { text: "CSRF" }
  ]}
  correct={1}
  explanation="The check happens before the write; another request can interleave between them. Push the check into the write (atomic UPDATE), or hold a lock through both operations."
  revisit={{ to: "/docs/foundations/concurrency#race-conditions", label: "Race conditions" }}
/>

<Question
  prompt="A payment API gets retried by the client after a network blip. Without an idempotency key, what happens?"
  options={[
    { text: "Nothing — the server detects duplicates automatically" },
    { text: "The user may be charged twice — the first request succeeded but the response was lost; the retry creates a second charge. Idempotency keys (client-generated, server-stored) let the server recognize and deduplicate retries" },
    { text: "The retry is silently dropped" },
    { text: "The API server crashes" }
  ]}
  correct={1}
  explanation="Network failures can lose the response after the work succeeded. Without idempotency keys, retries are duplicates. The client generates a key per logical attempt; the server stores it with the result so retries return the same outcome without re-processing."
  revisit={{ to: "/docs/foundations/concurrency#idempotency-keys", label: "Idempotency keys" }}
/>

<Question
  prompt="What does 'exactly once' mean in practical distributed systems?"
  options={[
    { text: "The system delivers each message literally once across all failure modes" },
    { text: "It's a polite fiction — true exactly-once over a network is provably impossible. Real systems do at-least-once delivery + idempotent consumers, which together produce 'exactly-once *effect*'" },
    { text: "It requires special hardware" },
    { text: "Only Kafka can do it" }
  ]}
  correct={1}
  explanation="The CAP/FLP-style theoretical results put hard limits on what's possible. Production wisdom: at-least-once + idempotency. The 'exactly-once' label sells, but the engineering reality is always retry + dedupe."
  revisit={{ to: "/docs/foundations/concurrency#exactly-once-vs-at-least-once-vs-at-most-once", label: "Exactly-once semantics" }}
/>

<Question
  prompt="`[1, 2, 3].forEach(async (x) => { await foo(x); })` — what's wrong?"
  options={[
    { text: "Nothing; this works as expected" },
    { text: "`forEach` ignores the returned promise; the loop ends synchronously and the `await`s run in parallel in the background, with no way to wait for them. Use `for…of` (sequential await) or `Promise.all(arr.map(...))` (parallel)" },
    { text: "Arrays can't be iterated with forEach" },
    { text: "`async` callbacks aren't allowed in forEach" }
  ]}
  correct={1}
  explanation="`forEach` doesn't await the callback's promise. The function returns before the awaits resolve. For sequential, use `for…of`; for parallel, use `Promise.all(arr.map(async x => …))`. This is the most common async footgun in JS."
  revisit={{ to: "/docs/foundations/concurrency#common-mistakes", label: "forEach + async footgun" }}
/>

</Quiz>

## What's next

→ Continue to [Distributed systems primer](./distributed-systems).
