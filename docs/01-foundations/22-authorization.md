---
id: authorization
title: 'Authorization: Permissions & Tokens'
sidebar_position: 23
sidebar_label: 22. Authorization
description: After the login — how the server keeps track of you (sessions vs JWTs) and decides what you're allowed to do (RBAC, ABAC, RLS).
---

# Authorization: Permissions & Tokens

> **In one line:** Once authentication answered "who are you?", authorization answers "what are you allowed to do?". And tokens are how the server keeps track of you between requests.

:::tip In plain English
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

```
Login:    Server creates session "abc123" → stores {abc123: userId=42} in Redis
                                          → sends Set-Cookie: session=abc123

Later:    Client sends Cookie: session=abc123
          Server looks up abc123 in Redis → "this is user 42"
          Proceeds.
```

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

:::info Highlight: 2026 trend — session tokens are back
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

Now *any* query against `posts` automatically filters to that user's rows. Even if your app code has bugs, the DB won't return data the user shouldn't see.

**Supabase** and **Postgres** make RLS a primary pattern. Authorization logic lives in the database — a powerful defense-in-depth measure.

:::note Worked example: layered authorization
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

:::info Highlight: prefer cookies over headers for web auth
For a web app, store auth in a **cookie** (HttpOnly, Secure, SameSite=Lax), not in `localStorage` or in JavaScript memory. Why:

- Cookies with `HttpOnly` cannot be read by JavaScript — XSS attacks can't steal them.
- `localStorage` is fully accessible to any JS on the page, including malicious third-party scripts.

This is the single most common mistake junior developers make in auth.
:::

## What's next

→ Continue to [The Deployment Pyramid](./deployment-pyramid) where we'll see how all this code, data, and auth logic actually *reaches users in production*.
