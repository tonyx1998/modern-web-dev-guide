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

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating SOC 2 as security.** Compliance is checklist work; security is making sure your app actually resists attack. A SOC 2 Type II company can still have IDOR bugs, leaked API keys, and exposed admin endpoints. Pass the audit *and* do real threat modeling on critical flows.
- **Building permissions in the UI instead of the database.** Hiding a button when `user.role !== 'admin'` is not authorization — it's a hint. Real authorization happens server-side, ideally enforced by Postgres RLS so even a buggy endpoint can't bypass it.
- **Granting "temporary" prod database access that becomes permanent.** Engineer needs to debug something live, gets read-write access "for the day," and it's still there a year later. Every prod credential needs an expiration; use short-lived tokens from your auth provider, not static keys.
- **Pasting secrets into Slack, Notion, or AI tools.** "Just for a sec" leaks become permanent — Slack messages get backed up, AI assistants log inputs. If a secret hits any channel that wasn't your vault, rotate it. Make this a team norm, not a SOC 2 requirement.
- **Waiting for the first enterprise deal to think about authorization tests.** Multi-tenant leaks (tenant A seeing tenant B's data) are the highest-severity bugs you can ship. Write a "cross-tenant" test suite the day you onboard your second tenant — not the day a customer notices.
:::

## Page checkpoint

<Quiz id="startup-security-page" title="Did startup security stick?" sampleSize={2}>

<Question
  prompt="What does the page recommend for authorization checks on protected endpoints?"
  options={[
    { text: "Trust the client to only call endpoints the user is allowed to use" },
    { text: "Check authorization in middleware only — the handler can assume the user is allowed" },
    { text: "Re-check authorization server-side on every protected operation, regardless of upstream guards" },
    { text: "Use IP allowlists instead of per-user checks" }
  ]}
  correct={2}
  explanation="The worked example shows a reviewer demanding a server-side admin check inside the handler even though middleware guards the route. Defense in depth: every protected operation re-verifies regardless of upstream layers."
  revisit={{ to: "/docs/startup/security#authorization", label: "Defense in depth" }}
/>

<Question
  prompt="At roughly what team size does the page say most B2B SaaS startups pursue SOC 2 Type II?"
  options={[
    { text: "On day one, before writing any code" },
    { text: "Around 20-30 employees, typically when enterprise customers start asking" },
    { text: "Only after crossing 200 employees" },
    { text: "Never — SOC 2 is only relevant for fintech" }
  ]}
  correct={1}
  explanation="The page places SOC 2 Type II around 20-30 employees for most B2B SaaS. Tools like Vanta or Drata automate roughly 80% of the work; the rest is policies and the audit itself."
  revisit={{ to: "/docs/startup/security#soc-2", label: "SOC 2 timing" }}
/>

<Question
  prompt="Which set of daily-hygiene practices does the page list as baseline at this scale?"
  options={[
    { text: "HTTPS with HSTS, strict CSP, Zod-validated inputs, rate limiting, Dependabot/Renovate, secrets in a vault" },
    { text: "A WAF and nothing else" },
    { text: "Annual penetration testing as the sole security measure" },
    { text: "Hiding the app behind a VPN to avoid all internet threats" }
  ]}
  correct={0}
  explanation="The hygiene list covers HTTPS + HSTS, strict CSP, input validation with Zod, rate limiting on sensitive endpoints, automated dependency updates, and a real secrets vault. Skipping any of these turns into existential risk."
  revisit={{ to: "/docs/startup/security#daily-hygiene", label: "Daily hygiene" }}
/>

<Question
  prompt="How does the page characterize the work involved in getting SOC 2 once you're using Vanta or Drata?"
  options={[
    { text: "About 80% is clicking through platform tasks and providing evidence; the other 20% is policy writing and the audit itself" },
    { text: "100% manual evidence collection by a dedicated team of five" },
    { text: "Free and instant once you sign up" },
    { text: "Impossible without a six-figure consulting engagement" }
  ]}
  correct={0}
  explanation="The page describes SOC 2 as half compliance, half checklist. Vanta or Drata reduces it to enabling audit logs, verifying backups, enforcing MFA, and providing screenshots — about 80% of the work — with policy writing and the audit making up the rest."
  revisit={{ to: "/docs/startup/security#soc-2", label: "SOC 2 as checklist" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 11: Maintenance and Scaling](./maintenance) where the weekly cadence and Postgres scaling come into focus.
