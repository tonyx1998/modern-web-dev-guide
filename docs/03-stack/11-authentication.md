---
id: authentication-tools
title: Authentication (Tools)
sidebar_position: 12
sidebar_label: 11. Auth Tools
description: The auth-as-a-service landscape. Clerk, Better Auth, Auth.js, Auth0, Supabase Auth, WorkOS — and when to pick each.
---

# Authentication (Tools)

> **In one line:** Don't build your own auth. Use Clerk for a polished commercial experience; Better Auth or Auth.js if you want open-source self-hosting; Auth0/WorkOS for enterprise needs.

:::tip[In plain English]
Authentication is hard. Modern best practice is to outsource it — pick a service, drop in their components, focus on your actual product. This page is the landscape of those services.

If you want the conceptual background (sessions vs JWTs, passwords vs passkeys, RBAC vs ABAC), see the [Authentication](../foundations/authentication) and [Authorization](../foundations/authorization) pages in chapter 1.
:::

## Clerk

Drop-in auth as a service. Pre-built React components.

```typescript
import { SignIn, SignUp, UserButton } from '@clerk/nextjs';

export default function Page() {
  return <SignIn />;  // Full sign-in UI in one component
}
```

**Strengths:** Best UX, fast to integrate, lots of features (multi-factor, social, magic links, passkeys).
**Trade-offs:** Expensive at scale (~$25/month base, scales by MAU).

## Better Auth

Open-source, TypeScript-native, self-hostable. Rising fast in 2026.

```typescript
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: { provider: 'postgres', ... },
  emailAndPassword: { enabled: true },
  socialProviders: { google: { ... } },
});
```

**Strengths:** Free, full control, modern API.
**Trade-offs:** You self-host (more responsibility); newer (less battle-tested than Clerk/Auth0).

## Auth.js (formerly NextAuth)

Open-source, framework-integrated. The historical default for Next.js.

**Strengths:** Free, mature, deep Next.js integration, supports dozens of OAuth providers out of the box.
**Trade-offs:** Less polished DX than Clerk; more boilerplate for custom flows.

## Auth0

Mature, enterprise-friendly. Acquired by Okta.

**When to use:** Enterprise customers, complex compliance requirements, established product.

## Supabase Auth

Bundled with Supabase. Convenient if you're already using Supabase for DB.

```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(URL, KEY);

await supabase.auth.signInWithPassword({
  email: 'tony@x.com',
  password: 'secret',
});
```

## WorkOS

Enterprise SSO/SAML/SCIM as a service. The go-to when selling B2B and customers demand enterprise auth.

## Decision matrix

| Need                              | Recommendation     |
|-----------------------------------|--------------------|
| Fast time-to-market, paid OK      | Clerk              |
| Open-source, self-host            | Better Auth        |
| Existing Supabase user            | Supabase Auth      |
| Enterprise B2B                    | Clerk + WorkOS, or Auth0 |
| Maximum customization             | Build on Better Auth or Auth.js |

:::info[Highlight: the auth-service free tiers are real]
For solo / startup projects, you almost certainly fit in someone's free tier:

- **Clerk** — 10,000 monthly active users free.
- **Supabase Auth** — 50,000 monthly active users free.
- **Better Auth** — fully free and self-hostable.
- **Auth.js** — fully free.

You should not be building your own auth from scratch to "save money." The free tiers are extremely generous and the engineering cost is enormous.
:::

## What's next

→ Continue to [Background Jobs](./background-jobs) — long-running and scheduled work that shouldn't block HTTP requests.
