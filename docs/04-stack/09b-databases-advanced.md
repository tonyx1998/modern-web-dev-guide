---
id: databases-advanced
title: Advanced Databases
sidebar_position: 19
sidebar_label: Advanced databases
description: Beyond CRUD — how indexes and the query planner work, transactions and isolation levels, the N+1 problem, connection pooling, and safe schema migrations. Why "the database is slow" is usually a missing index.
---

# Advanced Databases

> **In one line:** The expert database skills aren't exotic — they're understanding how an **index** turns a full-table scan into a lookup, what an **isolation level** actually protects you from, why the **N+1 query** is everywhere, and how to migrate a schema without downtime; together they explain ~90% of "the database is slow / behaving weirdly."

:::note[Level: advanced — read after you've used a database in a project]
You can write `SELECT`/`INSERT`/`UPDATE` and you've used an ORM. This is the layer that separates "queries work" from "queries stay fast and correct under real load." It builds on the Foundations SQL pages and pairs with [Cloud → Managed Data](/docs/cloud/cloud-managed-data) and [Distributed Systems → Consistency](/docs/distributed-systems/ds-consistency).
:::

← New here? Start with the on-ramp: [Relational (SQL) Databases](/docs/foundations/databases-sql).

:::tip[In plain English]
A database does two things you need to reason about: it *finds rows* (fast if there's an index, painfully slow if it has to scan the whole table) and it *coordinates concurrent changes* (so two people editing the same data don't corrupt it). Almost every "the app got slow" story is a query with no index doing a full scan, or one screen firing hundreds of tiny queries. Almost every "the data is wrong sometimes" story is a misunderstanding of transactions. You don't need to be a DBA — you need these few models, and you'll fix the problems that actually occur.
:::

:::info[Jargon for this chapter]
- **Index** — a sorted side-structure (usually a B-tree) that lets the DB find rows without scanning the whole table.
- **Query planner** — the engine that decides *how* to execute a query; `EXPLAIN` shows its plan.
- **Full table scan / Seq Scan** — reading every row because no usable index exists.
- **Transaction** — a group of statements that commit all-or-nothing (ACID).
- **Isolation level** — how much concurrent transactions can see each other's in-progress work.
- **N+1** — 1 query for a list + 1 query per item, instead of 1 combined query.
- **Connection pool** — a managed set of reused DB connections (connections are scarce and expensive to open).
:::

## Indexes & the query planner: where speed comes from

An index is a sorted structure (a B-tree) that lets the database jump to matching rows instead of reading all of them. No index on a `WHERE` / `JOIN` / `ORDER BY` column → a **sequential scan** → time that grows linearly with the table. The professional habit is to **read the query plan** rather than guess:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;
-- "Seq Scan on orders"  → bad: reading every row. Add an index:
CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);
-- Re-run: "Index Scan using idx_orders_customer_created" → good.
```

Key truths most people miss:
- **Composite index column order matters.** `(customer_id, created_at)` serves "filter by customer, sort by date" but *not* "sort by date alone." Index for your actual query shapes.
- **Indexes aren't free.** Each one speeds reads but slows writes (every insert/update maintains it) and uses space. Index the columns you filter/join/sort on — not every column.
- **A covering index** (includes all columns a query needs) avoids touching the table at all.
- **Selectivity matters.** An index on a low-cardinality column (`status` with 3 values) often isn't worth it; the planner may scan anyway.

:::tip[Live — this is a real Postgres database in your browser]
The playground below is actual PostgreSQL (via pglite/WASM, no server), seeded with **5,000 orders**. Run the query and read the plan — you'll see a **Seq Scan** and a **Sort**. Then add the index:

```sql
CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);
```

…and re-run the `EXPLAIN ANALYZE` — the plan flips to an **Index Scan** and the sort disappears. (The first Run downloads ~3 MB of WASM; "Reset database" removes your index so you can try again.)
:::

<SqlPlayground
  id="orders-explain"
  schema={`CREATE TABLE orders (
  id serial PRIMARY KEY,
  customer_id int NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL,
  total numeric(10,2) NOT NULL
);
INSERT INTO orders (customer_id, status, created_at, total)
SELECT (random()*200)::int,
       (ARRAY['pending','paid','shipped'])[1 + floor(random()*3)],
       now() - (random()*365 || ' days')::interval,
       (random()*500)::numeric(10,2)
FROM generate_series(1, 5000);
ANALYZE orders;`}
  initialQuery={`EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 10;`}
/>

## Transactions & isolation levels

A transaction makes a group of writes atomic (all-or-nothing) and consistent. The subtle part is **isolation** — how much one in-flight transaction sees another's uncommitted/concurrent work. Higher isolation = more correctness, less concurrency:

| Level | Prevents | Still allows |
|---|---|---|
| Read Committed (Postgres default) | Dirty reads | Non-repeatable reads, phantoms |
| Repeatable Read | + non-repeatable reads | Some phantoms (Postgres prevents most) |
| Serializable | Everything — behaves as if transactions ran one at a time | (lowest concurrency; may abort & retry) |

The practical pattern: the **lost update** — two transactions read the same row, both modify it, the second overwrites the first. The fixes: do the update *in the database* (`UPDATE accounts SET balance = balance - 100 WHERE ...`, not read-modify-write in app code), use `SELECT ... FOR UPDATE` to lock the row, or use optimistic concurrency (a `version` column checked on write). Knowing your DB's *default* level (Read Committed for Postgres/MySQL) tells you which anomalies you must defend against yourself.

:::info[Highlight: the N+1 query is the most common performance bug in web apps]
You render a list of 50 orders, and for each one your code (often an ORM, lazily) fetches the customer: that's **1 query for the orders + 50 for the customers = 51 round trips** where 2 would do. Each round trip has latency, so the page crawls — and it *looks fine in dev* with 3 rows, then melts in production with thousands.

```js
// N+1 — one query per order (51 total)
const orders = await db.order.findMany();
for (const o of orders) o.customer = await db.customer.findUnique({ where: { id: o.customerId } });

// Fixed — one query, joined/batched (the ORM's `include`/`join`, or a dataloader)
const orders = await db.order.findMany({ include: { customer: true } });
```

This is *the* bug to watch for, especially behind ORMs that make lazy per-row loading invisible. The tells: a page whose query count scales with row count, or a dashboard that's fine on test data and slow in prod. The fix is always "fetch the related data in one batched query" — `include`/`join`, or a dataloader that coalesces the per-item lookups. It connects directly to the [API N+1 caution](/docs/stack/apis-advanced): the API endpoint is often where the N+1 lives.
:::

## Connection pooling & the scarcity problem

Opening a database connection is expensive, and databases cap concurrent connections (Postgres often ~100). A naive app that opens a connection per request — or worse, thousands of [serverless functions](/docs/cloud/cloud-compute) each opening their own — exhausts the limit and the DB starts refusing connections. The fix is a **connection pool**: a small set of reused connections the app borrows and returns. In serverless/edge environments you need a *pooler* in front (PgBouncer, RDS Proxy, or a provider's pooled endpoint like Neon/Supabase) because your concurrency is huge and connections are scarce — the opposite of the always-on-server assumption.

## Safe schema migrations (expand/contract)

Changing a schema on a live database without downtime is a discipline. A backward-incompatible migration deployed alongside running old code breaks it (and breaks rollback). The pattern is **expand → migrate → contract**:

1. **Expand** — add the new column/table (nullable, no constraint yet); deploy code that *writes both* old and new, reads old.
2. **Backfill** — migrate existing rows in batches (a giant single `UPDATE` locks the table).
3. **Switch** — deploy code that reads the new column.
4. **Contract** — only once stable and you won't roll back, drop the old column/constraint.

At every step the previous code version still works against the schema, so deploys and rollbacks stay safe. This mirrors the [deploys & rollbacks](/docs/operations/ops-deploys) discipline — the database is where "we can always roll back" quietly dies if you're not deliberate.

## Common mistakes

:::caution[Where people commonly trip up]
- **No index on filtered/joined/sorted columns.** The cause of most "the DB is slow." `EXPLAIN ANALYZE` the query; add the index the plan is missing.
- **Indexing everything.** Every index slows writes and costs space. Index for your real query shapes; mind composite-column order and selectivity.
- **Read-modify-write in app code under concurrency.** Causes lost updates. Update in the DB, lock with `FOR UPDATE`, or use a version column.
- **Not knowing your isolation level.** Read Committed (the default) allows non-repeatable reads and phantoms — defend against the anomalies your level permits.
- **N+1 queries (especially behind a lazy ORM).** Query count scales with rows; fine in dev, melts in prod. Batch with `include`/`join` or a dataloader.
- **Opening connections without a pool (fatal in serverless).** Exhausts the DB's connection cap. Use a pool, and a pooler in front for serverless/edge.
- **In-place breaking migrations.** They break running old code and rollback. Use expand/contract so every version works against the schema.
:::

## Practice on your own project

:::tip[Do this on a real database]
1. Run `EXPLAIN ANALYZE` on your slowest query; find the **Seq Scan** or **Sort**, add the composite index that removes it, and re-run to confirm it became an index scan.
2. Audit one list page for an **N+1** (log the emitted SQL) and collapse it to a single query with a join / eager-load.
3. Find a uniqueness rule enforced in app code (check-then-insert) and move it to a `UNIQUE` constraint.
4. Pick a read-modify-write path on shared data and add optimistic locking (a `version` column) or `SELECT … FOR UPDATE`.
:::

## Page checkpoint

<Quiz id="stack-databases-advanced-page" title="Did advanced databases stick?" sampleSize={3}>

<Question
  prompt="A query filtering on `customer_id` is slow and `EXPLAIN` shows 'Seq Scan'. What does that mean and what's the fix?"
  options={[
    { text: "The database is low on memory; add RAM" },
    { text: "There's no usable index, so the DB reads every row (time grows with table size); add an index on the filtered/sorted columns so it can do an index scan" },
    { text: "The table is corrupted; rebuild it" },
    { text: "The connection pool is too small; increase it" }
  ]}
  correct={1}
  explanation="A sequential scan means no index matched, so the engine reads the whole table — fine on small data, slow as it grows. Adding an index on the columns you filter/join/sort by (with the right composite order) lets the planner do a fast index scan instead."
  revisit={{ to: "/docs/stack/databases-advanced#indexes--the-query-planner-where-speed-comes-from", label: "Indexes & the planner" }}
/>

<Question
  prompt="A page renders 50 items and runs 51 queries; it's fast in dev but slow in production. What's the problem and the fix?"
  options={[
    { text: "The database needs more indexes on every column" },
    { text: "The N+1 problem — one query per item instead of one batched query; fix by fetching related data in a single join/include or via a dataloader" },
    { text: "Too many connections; reduce the pool size" },
    { text: "The isolation level is too high" }
  ]}
  correct={1}
  explanation="N+1 is 1 query for the list + 1 per item. Each round trip adds latency, so it's invisible on 3 dev rows and melts on thousands in prod. The fix is fetching related data in one batched query (`include`/`join`) or coalescing lookups with a dataloader."
  revisit={{ to: "/docs/stack/databases-advanced#transactions--isolation-levels", label: "The N+1 problem" }}
/>

<Question
  prompt="How do you change a live database's schema without downtime or breaking rollback?"
  options={[
    { text: "Take the site offline, run the migration, bring it back" },
    { text: "Expand/contract: add the new column (nullable) and write both old+new, backfill in batches, switch reads to new, then drop the old only once stable — so every code version works against the schema at each step" },
    { text: "Run one big UPDATE inside a transaction" },
    { text: "Rename the column and deploy the new code at the same time" }
  ]}
  correct={1}
  explanation="The expand/contract (parallel-change) pattern keeps the old and new schema valid simultaneously across several deploys, so the previous code version always runs against the database and rollback stays safe. A big single UPDATE locks the table; an in-place rename breaks running old code."
  revisit={{ to: "/docs/stack/databases-advanced#safe-schema-migrations-expandcontract", label: "Expand/contract migrations" }}
/>

</Quiz>

## What's next

→ Continue to [ORMs](/docs/stack/orms) — the layer that maps these tables to your code, and where N+1 problems most often hide.
