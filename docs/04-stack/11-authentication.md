---
id: authentication-tools
title: Authentication (Tools)
sidebar_position: 12
sidebar_label: Auth Tools
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Rolling your own auth "to save money."** The free tiers cover 10k–50k MAU. The engineering hours you save are worth more than the subscription, *and* you avoid the entire class of session-fixation, timing-attack, and password-hashing bugs.
- **Storing the auth provider's JWT in `localStorage`.** Vulnerable to any XSS bug on your domain. Use httpOnly, Secure, SameSite=Lax cookies (which all these providers default to). If a tutorial tells you to copy a token into `localStorage`, it's outdated.
- **Treating Clerk as both your auth *and* your user database.** Clerk is the source of truth for *identity*; your `users` table is the source of truth for *application data*. Mirror the Clerk user ID into your DB on first sign-in and join from there — don't try to store orders, preferences, or relationships in Clerk's user metadata.
- **Locking in too early without an export plan.** Auth providers are stickier than they look — sessions, password hashes, OAuth connections all live there. Before committing, confirm there's an export API (Clerk, Auth0, Better Auth all have one). If a vendor won't let you leave with your users, that's a flag.
- **Confusing authentication with authorization.** The auth provider tells you *who* the user is. *What* they're allowed to do (roles, permissions, row-level access) is your app's job. Don't expect Clerk or Auth0 to enforce "this user can edit this document" — you check that on the server, every request.
:::

## Page checkpoint

<Quiz id="stack-authentication-tools-page" title="Did auth tools stick?" sampleSize={3}>

<Question
  prompt="Why does the page tell you not to build your own auth?"
  options={[
    { text: "Auth services are required by law" },
    { text: "Auth is genuinely hard, and modern services offer generous free tiers — the engineering cost of DIY auth dwarfs the savings" },
    { text: "DIY auth violates the npm terms of service" },
    { text: "Browsers no longer support custom auth flows" }
  ]}
  correct={1}
  explanation="Auth is hard to get right (password hashing, sessions, MFA, social logins, recovery). Clerk, Supabase Auth, Better Auth, and Auth.js have generous free tiers; the engineering cost of rolling your own is enormous."
  revisit={{ to: "/docs/stack/authentication-tools#clerk", label: "Why outsource auth" }}
/>

<Question
  prompt="When is Clerk the right pick over Better Auth or Auth.js?"
  options={[
    { text: "When you specifically need to self-host everything for compliance" },
    { text: "When you want polished pre-built React components and fast time-to-market, and paying a per-MAU fee is acceptable" },
    { text: "When you want the cheapest option at every scale" },
    { text: "When you need open-source code you can fork" }
  ]}
  correct={1}
  explanation="Clerk's strength is best-in-class UX with drop-in `<SignIn />`-style components and a generous free tier — at the cost of per-MAU pricing as you grow. If self-hosting and source access matter, Better Auth or Auth.js fit better."
  revisit={{ to: "/docs/stack/authentication-tools#clerk", label: "Clerk section" }}
/>

<Question
  prompt="What does WorkOS specialize in?"
  options={[
    { text: "Magic-link auth for indie SaaS" },
    { text: "OAuth for consumer apps" },
    { text: "Enterprise SSO / SAML / SCIM as a service — for when B2B customers demand enterprise auth" },
    { text: "Password-only flows for legacy systems" }
  ]}
  correct={2}
  explanation="WorkOS is the go-to for adding enterprise SSO, SAML, and SCIM provisioning when you're selling B2B and your customers' IT teams require enterprise identity integration."
  revisit={{ to: "/docs/stack/authentication-tools#workos", label: "WorkOS section" }}
/>

<Question
  prompt="Which auth solution would you reach for first if you're already using Supabase for your database?"
  options={[
    { text: "Clerk, regardless of database" },
    { text: "Supabase Auth — it's bundled and uses the same database and SDK" },
    { text: "Auth0 — it's the only enterprise option" },
    { text: "Roll your own JWT-based auth from scratch" }
  ]}
  correct={1}
  explanation="If you're already on Supabase, Supabase Auth comes bundled — same SDK, same database, row-level security integrations. There's little reason to add a separate auth service unless you outgrow it."
  revisit={{ to: "/docs/stack/authentication-tools#supabase-auth", label: "Supabase Auth" }}
/>

</Quiz>

## What's next

→ Continue to [Background Jobs](./background-jobs) — long-running and scheduled work that shouldn't block HTTP requests.
