---
id: orms
title: ORMs & Database Tools
sidebar_position: 11
sidebar_label: 10. ORMs
description: The layer between your code and SQL. Drizzle, Prisma, Kysely — and when raw SQL is the right answer.
---

# ORMs & Database Tools

> **In one line:** An ORM lets you write queries in your programming language instead of raw SQL. Drizzle is the rising 2026 leader; Prisma is the established choice; Kysely is for SQL purists who want type safety.

:::tip In plain English
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

Don't be afraid to drop down to raw SQL when it's clearer.

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

:::info Highlight: learn SQL anyway
ORMs are great, but they're not a substitute for understanding SQL. The moment you hit a performance problem, a complex aggregation, or a tricky join, you'll be reading raw SQL. Spend an afternoon on SQL basics. You'll thank yourself for the rest of your career.
:::

## What's next

→ Continue to [Authentication](./authentication-tools) — the auth-as-a-service landscape (Clerk, Better Auth, Auth0, etc.).
