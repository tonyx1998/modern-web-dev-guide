---
id: authorization
title: 'Authorization: Permissions & Tokens'
sidebar_position: 23
sidebar_label: Authorization
description: After the login — how the server keeps track of you (sessions vs JWTs) and decides what you're allowed to do (RBAC, ABAC, RLS).
---

# Authorization: Permissions & Tokens

> **In one line:** Once authentication answered "who are you?", authorization answers "what are you allowed to do?". And tokens are how the server keeps track of you between requests.

:::tip[In plain English]
Authorization is the bouncer's wristband. Different colors get different access — VIP wristband gets backstage; general admission only gets the main bar. The server needs two things:

1. **A way to recognize you on every request** after you log in. (Tokens.)
2. **A way to decide what you can do** based on who you are. (RBAC / ABAC / RLS.)
:::

## Sessions vs JWTs — how the server remembers you

After authentication, the server needs to recognize the user on future requests. Two dominant approaches:

### Session tokens (server-stored)

1. Server generates a random string, stores it in DB/Redis with the user ID.
2. Sends it to the client as a cookie.
3. On each request, server looks up the token to find the user.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Redis
    Note over Client,Redis: Login
    Client->>Server: POST /login (credentials)
    Server->>Redis: Store {abc123: userId=42}
    Server-->>Client: Set-Cookie: session=abc123
    Note over Client,Redis: Later requests
    Client->>Server: GET /something (Cookie: session=abc123)
    Server->>Redis: Lookup abc123
    Redis-->>Server: userId=42
    Server-->>Client: 200 OK (Tony's data)
```

> **Reading this diagram:** The cookie itself carries *no* identity information — it's just a random opaque string. The server is the one that maps that string to a user via Redis on every request. That's what makes it easy to **revoke** a session: just delete the row.

**Pros:** Easy to revoke (delete the row); small cookie size; standard pattern.
**Cons:** Requires storage and a lookup per request.

### JWTs (JSON Web Tokens) — self-contained

1. Server creates a JSON payload (user ID, expiration, etc.) and *signs* it with a secret.
2. Sends it to the client.
3. On each request, server verifies the signature — no DB lookup needed.

A JWT looks like three base64-encoded segments separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiIsImV4cCI6MTcyMDAwMDAwMH0.signature_here
└─── header ───┘ └─────── payload ───────┘ └── signature ──┘
```

**Pros:** Stateless; scales horizontally without shared session storage.
**Cons:** Hard to revoke before expiration; larger cookie size; signing key compromise = total breach.

:::info[Highlight: 2026 trend — session tokens are back]
A few years ago JWTs were the obvious choice. By 2026, **session tokens are making a comeback**:

- Their downsides matter less with modern Redis/edge KV (lookups are sub-millisecond globally).
- They're simpler to reason about.
- Revocation is trivial — important for security incidents.

Use sessions by default. Use JWTs when you specifically need stateless auth across microservices.
:::

## Authorization patterns

Once you know who the user is, what can they do?

### RBAC — Role-Based Access Control

Users have **roles**; roles have **permissions**.

```
User Tony  → Role: Admin   → Permissions: read, write, delete, manage_users
User Sam   → Role: Member  → Permissions: read, write
User Guest → Role: Viewer  → Permissions: read
```

In code:

```typescript
function canDeletePost(user, post) {
  return user.roles.includes('admin') || post.authorId === user.id;
}
```

> **In English:** A user may delete a post if they are an admin *or* they wrote it themselves. Two simple conditions OR-ed together — that's the entire authorization check for this action.

RBAC is the most common pattern. It covers most apps' needs.

### ABAC — Attribute-Based Access Control

Permissions depend on *attributes* of the user, resource, and context.

```
Allow if:
  user.department == resource.department
  AND time.hour BETWEEN 9 AND 17
  AND user.clearance >= resource.classification
```

More flexible than RBAC. Common in enterprise / regulated environments where access depends on context. Open-source tools like **Cerbos** and **OpenFGA** make this practical at scale.

### RLS — Row-Level Security (the database does it)

Database-enforced rules about which rows each user can access.

```sql
CREATE POLICY user_owns_post ON posts
  FOR ALL TO authenticated
  USING (user_id = current_user_id());
```

> **In English:** Create a database-level rule named `user_owns_post` on the `posts` table that applies to all operations (SELECT, INSERT, UPDATE, DELETE) for logged-in users, and only allows access to rows where the post's `user_id` matches the currently authenticated user. Now *any* query against `posts` automatically filters to that user's rows. Even if your app code has bugs, the DB won't return data the user shouldn't see.

**Supabase** and **Postgres** make RLS a primary pattern. Authorization logic lives in the database — a powerful defense-in-depth measure.

:::note[Worked example: layered authorization]
For a real app, you usually combine these layers:

1. **Authentication** — verify the JWT or session cookie. If invalid, reject.
2. **RBAC check** in your app code — is this user allowed to call this endpoint at all? (`user.role === 'admin'`)
3. **RLS** in the database — even if the app code is wrong, the DB only returns rows this user owns.

Three layers means three things must fail simultaneously for an attacker to access another user's data. That's defense in depth.
:::

## Tokens in practice — common patterns

| Pattern                               | Use case                                                  |
|---------------------------------------|-----------------------------------------------------------|
| `Authorization: Bearer <jwt>` header  | API calls from mobile or third parties                    |
| `Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax` | Web app login                          |
| Short-lived access token + long-lived refresh token | OAuth, mobile apps                          |
| `X-API-Key` header                     | Server-to-server API calls                                |

:::info[Highlight: prefer cookies over headers for web auth]
For a web app, store auth in a **cookie** (HttpOnly, Secure, SameSite=Lax), not in `localStorage` or in JavaScript memory. Why:

- Cookies with `HttpOnly` cannot be read by JavaScript — XSS attacks can't steal them.
- `localStorage` is fully accessible to any JS on the page, including malicious third-party scripts.

This is the single most common mistake junior developers make in auth.
:::

## Page checkpoint

<Quiz id="authorization-page" title="Did authorization stick?" sampleSize={2}>

<Question
  prompt="A user's session was compromised and you need to log them out RIGHT NOW. Which token model makes this trivial?"
  options={[
    { text: "JWTs — just rotate the signing key" },
    { text: "Server-side session tokens — delete the row in Redis/DB and the next request fails the lookup" },
    { text: "Neither can be revoked early" },
    { text: "Both can be revoked the same way with no setup" }
  ]}
  correct={1}
  explanation="Session tokens are just rows you can delete. JWTs are verified by signature without a DB lookup, so revoking one early requires a separate deny-list. That's a big reason session tokens are making a comeback in 2026."
  revisit={{ to: "/docs/foundations/authorization#sessions-vs-jwts--how-the-server-remembers-you", label: "Sessions vs JWTs" }}
/>

<Question
  prompt="In Role-Based Access Control (RBAC), how are permissions typically organized?"
  options={[
    { text: "Each user is granted individual permissions directly" },
    { text: "Users are assigned roles; roles carry permissions — so you grant/revoke at the role level, not per user" },
    { text: "Permissions are encoded into the user's password" },
    { text: "There are no explicit roles; the database guesses" }
  ]}
  correct={1}
  explanation="RBAC: user → role → permissions. You change a role's permissions once and every user with that role inherits the change. It's the most common authorization pattern because it scales cleanly."
  revisit={{ to: "/docs/foundations/authorization#authorization-patterns", label: "RBAC" }}
/>

<Question
  prompt="What does Row-Level Security (RLS) in Postgres give you that app-layer checks alone don't?"
  options={[
    { text: "Faster queries via better indexes" },
    { text: "Database-enforced filtering — even if your app code has bugs, the DB itself refuses to return rows the current user shouldn't see" },
    { text: "Automatic encryption of every column" },
    { text: "Built-in 2FA" }
  ]}
  correct={1}
  explanation="RLS pushes authorization into the database. A bug in your app code can't leak other users' rows because the DB filters them at query time. Combined with app-layer checks, you get defense in depth."
  revisit={{ to: "/docs/foundations/authorization#authorization-patterns", label: "Row-Level Security" }}
/>

<Question
  prompt="Where should you store the auth token in a web app?"
  options={[
    { text: "In localStorage — easiest to access from JavaScript" },
    { text: "In an HttpOnly, Secure, SameSite=Lax cookie so JavaScript can't read it and XSS attacks can't steal it" },
    { text: "In a global window variable so it's always available" },
    { text: "In the URL as a query parameter" }
  ]}
  correct={1}
  explanation="HttpOnly hides the cookie from document.cookie and any JS APIs — XSS attacks can't exfiltrate it. localStorage and JS globals are wide open to any script on the page, including third-party scripts that might be compromised."
  revisit={{ to: "/docs/foundations/authorization#tokens-in-practice--common-patterns", label: "Prefer cookies over headers" }}
/>

</Quiz>

## What's next

→ Continue to [The Deployment Pyramid](./deployment-pyramid) where we'll see how all this code, data, and auth logic actually *reaches users in production*.
