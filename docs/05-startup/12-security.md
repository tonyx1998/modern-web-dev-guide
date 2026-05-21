---
id: security
title: 'Phase 10: Security and Compliance'
sidebar_position: 13
sidebar_label: 12. Security
description: Daily security hygiene, authentication and authorization patterns, data handling, SOC 2, pen testing, and bug bounties at startup scale.
---

# Phase 10: Security and Compliance

> **In one line:** HTTPS everywhere, validated inputs, server-side authorization checks, secrets in a vault, and SOC 2 once enterprise customers ask. Don't wait for a breach.

:::tip[In plain English]
At solo scale, "security" means HTTPS and not committing your `.env`. At startup scale, you have customer data that other people will pay to steal — credentials, PII, payment info. The good news: most of what you need is checklist work. The bad news: skipping any item turns into existential risk. A breach can kill a startup.
:::

## Daily hygiene

- HTTPS everywhere with HSTS.
- Strict Content Security Policy (CSP) headers.
- All inputs validated with Zod (defense in depth).
- Rate limiting on auth endpoints, API endpoints, and expensive operations.
- Dependabot or Renovate for dependency updates.
- Secrets in a vault (Doppler/1Password), never in code or chat.
- Database row-level security (RLS) where applicable.

## Authentication

- Strong password requirements + breached-password checks.
- Multi-factor authentication available (often required for admins).
- Session expiration and idle timeout.
- Audit log of admin actions.

## Authorization

- Server-side checks on every protected operation (never trust the client).
- Tenant isolation in multi-tenant apps (every query filters by tenant).
- Least-privilege roles.

## Data

- Encrypted at rest (managed DBs do this automatically).
- Encrypted in transit (TLS everywhere).
- Regular backups (Supabase/Neon do this; verify they exist).
- PII minimization (don't store what you don't need).
- Data deletion on user request (GDPR/CCPA).

## SOC 2

- Most B2B SaaS pursues SOC 2 Type II around 20–30 employees.
- Vanta or Drata automates ~80% of the work.
- Costs $10–30K for the audit + ongoing platform fees.
- Takes 3–6 months to achieve initial Type I; 6–12 months for Type II.

## Penetration testing

- Annual third-party pen test once you have meaningful customers.
- Costs $10–30K per engagement.
- Required by many enterprise customers' security questionnaires.

## Bug bounty

- Optional at this scale. HackerOne or Bugcrowd if you want one.
- Or just an "email security@company.com" address with a responsible disclosure policy.

:::note[Worked example: an authorization bug caught by code review]
A PR adds a new admin endpoint `/api/admin/users/[id]/delete`. The code looks correct — it uses `await auth()` to get the current user.

The reviewer asks: "Where do we verify the current user is actually an admin?" The author replies: "Oh, the route is under `/admin`, so the middleware blocks non-admins."

The reviewer pushes back: "Middleware can be bypassed if someone calls the endpoint directly. We've been bitten by this before." They add a server-side `if (!user.isAdmin) throw new Error('forbidden')` inside the handler.

That's the discipline: *every protected operation re-checks authorization server-side, regardless of upstream guards.* Defense in depth is what saves you when a single layer fails.
:::

:::info[Highlight: SOC 2 is half compliance, half checklist]
The first time you start a SOC 2 process, it feels like a wall of acronyms. Vanta or Drata reduces it to a checklist: enable audit logs, verify backups, enforce MFA on admin accounts, set up vendor reviews. ~80% of the work is just clicking through the platform's tasks and providing screenshots.

The other 20% is policy writing (security policy, incident response policy) and the audit itself. Total cost: $10–30K plus ongoing platform fees ($300–$1,000/month). For a B2B startup chasing enterprise customers, it's table stakes.
:::

## What's next

→ Continue to [Phase 11: Maintenance and Scaling](./maintenance) where the weekly cadence and Postgres scaling come into focus.
