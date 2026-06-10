---
id: orms
title: ORMs & Database Tools
sidebar_position: 11
sidebar_label: ORMs
description: The layer between your code and SQL. Drizzle, Prisma, Kysely — and when raw SQL is the right answer.
---

# ORMs & Database Tools

> **In one line:** An ORM lets you write queries in your programming language instead of raw SQL. Drizzle is the rising 2026 leader; Prisma is the established choice; Kysely is for SQL purists who want type safety.

:::tip[In plain English]
An ORM ("Object-Relational Mapper") is a layer that translates between your code's objects and your database's tables. Instead of writing `SELECT * FROM users WHERE id = 42`, you write `db.user.findById(42)`. The ORM handles the SQL generation, the connection pooling, the type mapping. The trade-off: ORMs hide complexity, which is great until you need to *understand* what's happening under the hood.
:::

## Drizzle ORM — the 2026 leader

TypeScript-first, lightweight, SQL-like syntax. Schema is defined in TypeScript:

```typescript
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
});
```

Queries look like SQL:

```typescript
const result = await db
  .select({ id: users.id, postCount: count(posts.id) })
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id))
  .groupBy(users.id);
```

> **In English:** Ask the database for every user paired with their posts, then group results by user id and count how many posts each user has. The `eq(...)` helper builds an SQL equality condition; **TypeScript inference** makes `result` a strongly-typed array of `{ id: number; postCount: number }` — no separate type definition needed.

**Why it's popular:**

- Excellent TypeScript inference (your query result type is exactly the columns you selected).
- Lightweight (no separate query engine).
- SQL-like — easy to translate mental models.
- Edge-runtime compatible.

## Prisma

The dominant ORM from 2020–2024. Schema-first (you write a `.prisma` file).

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id     Int    @id @default(autoincrement())
  title  String
  user   User   @relation(fields: [userId], references: [id])
  userId Int
}
```

Queries are object-style:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 42 },
  include: { posts: true },
});
```

**Strengths:** Beautiful schema syntax; excellent migrations; Prisma Studio (GUI for browsing data).

**Weaknesses:** Larger runtime than Drizzle; some performance issues in serverless; less SQL-like.

In 2026, Drizzle is rising fast and Prisma remains widely used. New projects are increasingly choosing Drizzle.

## Kysely

Type-safe SQL query builder. Lower-level than Drizzle/Prisma — you write SQL-like code with full type safety, no migration tooling included.

```typescript
const users = await db
  .selectFrom('users')
  .where('email', '=', 'tony@example.com')
  .selectAll()
  .execute();
```

**When to use:** Teams that want type safety but reject ORM abstractions.

## Other languages

| Language | ORM / DB tool                                              |
|----------|------------------------------------------------------------|
| Python   | **SQLAlchemy** (powerful, complex), **Django ORM** (built into Django) |
| Go       | **GORM** (simpler than SQLAlchemy)                         |
| Java     | **Hibernate / JPA** (mature, complex)                       |
| Ruby     | **ActiveRecord** (built into Rails)                         |
| PHP      | **Eloquent** (built into Laravel)                           |

## Raw SQL — sometimes the right answer

For complex queries, a hand-tuned SQL string is often clearer than an ORM equivalent. Modern ORMs (Drizzle, Prisma) let you write raw SQL when needed.

```typescript
// Drizzle's escape hatch:
const result = await db.execute(sql`
  SELECT u.name, COUNT(p.id) AS post_count
  FROM users u
  LEFT JOIN posts p ON p.user_id = u.id
  GROUP BY u.id
  ORDER BY post_count DESC
  LIMIT 10
`);
```

> **In English:** Identical query to the typed Drizzle version above, written as raw SQL through the `sql` template tag. The tag handles parameter escaping so you don't open yourself to SQL injection. Use this when the ORM's fluent API makes a complex query harder to read, not easier. Don't be afraid to drop down to raw SQL when it's clearer.

## Migrations

Schema changes versioned in code:

```typescript
// drizzle/0001_add_email_index.ts
export const up = sql`CREATE INDEX users_email_idx ON users(email);`;
export const down = sql`DROP INDEX users_email_idx;`;
```

Run with `drizzle-kit migrate`, `prisma migrate deploy`, etc.

**Best practices:**

- Migrations are immutable once committed.
- Migrations should be reversible when possible.
- Test migrations against production data copies.
- Backward-compatible migrations let you deploy code and schema independently.

:::info[Highlight: learn SQL anyway]
ORMs are great, but they're not a substitute for understanding SQL. The moment you hit a performance problem, a complex aggregation, or a tricky join, you'll be reading raw SQL. Spend an afternoon on SQL basics. You'll thank yourself for the rest of your career.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **N+1 queries hidden by the ORM's fluent API.** `users.map(u => u.posts)` looks like JS but fires one query per user. Use `include` (Prisma) or an explicit join/`with` (Drizzle) to fetch in a single round trip. Watch the SQL log; if you see 50 queries to render one page, you have an N+1.
- **Editing an already-applied migration.** Once a migration has run in any shared environment (staging, prod, a teammate's DB), it's immutable. Editing it puts everyone's schema out of sync with the migration history. The fix: write a *new* migration that corrects course.
- **Branching schema and code separately, then merging.** Two PRs touch the schema; both add migration `0007`. Merge, deploy, chaos. Migrations are numbered/timestamped sequentially for a reason — rebase yours on top of `main` and renumber before merging.
- **Reaching for raw SQL the moment the ORM gets awkward.** A 5-line raw query is fine; a 200-line one in `db.execute(sql\`...\`)` loses type safety and parameter help. Use raw SQL for genuinely complex aggregates, not to avoid learning the ORM's join syntax.
- **Forgetting to disable lazy loading in serverless.** Some ORMs lazily resolve relations on access — fine on a long-lived server, disastrous in a Lambda that's already returned the response. Prefer explicit, eager loads (`include`/`with`) and you avoid the surprise.
- **Skipping a backward-compatible deploy.** Renaming a column in one migration + deploying the code that uses the new name in the same release means a window where running code references a column that doesn't exist. Expand → migrate → contract: add the new column, dual-write, switch reads, drop the old.
:::

## Page checkpoint

<Quiz id="stack-orms-page" title="Did ORMs stick?" sampleSize={3}>

<Question
  prompt="What problem does an ORM primarily solve for application code?"
  options={[
    { text: "It replaces your database entirely with an in-memory store" },
    { text: "It translates between your code's objects and the database's tables, generating SQL and handling type mapping" },
    { text: "It encrypts the network connection to the database" },
    { text: "It runs your background jobs" }
  ]}
  correct={1}
  explanation="An ORM maps objects in your language to relational tables. You write `db.user.findById(42)` instead of raw SQL; the ORM produces the query, manages connections, and maps results back to typed objects."
  revisit={{ to: "/docs/stack/orms#drizzle-orm--the-2026-leader", label: "What an ORM does" }}
/>

<Question
  prompt="What's the main reason Drizzle is rising as the 2026 TypeScript ORM leader?"
  options={[
    { text: "It hides SQL entirely behind a magical 'AI mode'" },
    { text: "Excellent TypeScript inference (your query result type matches the columns you selected), lightweight runtime, SQL-like syntax, and edge compatibility" },
    { text: "It's the only ORM that supports Postgres" },
    { text: "It has the largest team of paid maintainers" }
  ]}
  correct={1}
  explanation="Drizzle's selling points are precise TypeScript inference (the result type matches what you selected), no heavy query engine, SQL-like ergonomics, and edge-runtime compatibility — exactly what serverless and edge stacks want."
  revisit={{ to: "/docs/stack/orms#drizzle-orm--the-2026-leader", label: "Drizzle section" }}
/>

<Question
  prompt="How does Kysely position itself relative to Drizzle and Prisma?"
  options={[
    { text: "A schema-first ORM with built-in migrations and Studio" },
    { text: "A type-safe SQL query builder for teams that want type safety but reject ORM abstractions" },
    { text: "A NoSQL driver for MongoDB and DynamoDB" },
    { text: "A drop-in replacement for Prisma's exact API" }
  ]}
  correct={1}
  explanation="Kysely is lower-level: a type-safe SQL query builder, not a full ORM. It gives you compile-time safety while letting you stay close to the SQL — at the cost of no built-in migration tooling."
  revisit={{ to: "/docs/stack/orms#kysely", label: "Kysely section" }}
/>

<Question
  prompt="When is dropping down to raw SQL (via something like Drizzle's `sql` template tag) the right call?"
  options={[
    { text: "Always — ORMs should never be used in production" },
    { text: "When the ORM's fluent API makes a complex query harder to read than the equivalent SQL" },
    { text: "Only when you want to bypass parameter escaping for performance" },
    { text: "Never — raw SQL is a security risk in all modern frameworks" }
  ]}
  correct={1}
  explanation="For complex aggregations and joins, hand-tuned SQL is often clearer than the ORM equivalent. The `sql` template tag still escapes parameters safely — don't be afraid to drop down when it makes the code clearer."
  revisit={{ to: "/docs/stack/orms#raw-sql--sometimes-the-right-answer", label: "Raw SQL escape hatch" }}
/>

</Quiz>

## What's next

→ Continue to [Authentication](./authentication-tools) — the auth-as-a-service landscape (Clerk, Better Auth, Auth0, etc.).
