---
id: ops
title: Observability, Security, and Compliance
sidebar_position: 5
sidebar_label: 4. Operations
description: How monitoring, on-call, security, and compliance scale from solo / small / large companies.
---

# Observability, Security, and Compliance

> **In one line:** A solo dev relies on Sentry emails and prayers; a startup adds dashboards and an informal on-call; an enterprise has full SLOs, error budgets, 24/7 follow-the-sun on-call, plus AppSec teams, bug bounties, and multiple compliance regimes.

:::tip In plain English
This is where the scale gap is most extreme. The cost of being wrong about reliability or security goes up roughly with the square of your user count, and operations at enterprise scale reflect that.

A solo dev who misses a Sentry alert ships a bug to themselves. A startup that misses an alert ships a bug to a few hundred customers. An enterprise that misses an alert can trigger SLA breaches, regulatory fines, and front-page news.
:::

## Observability

| Aspect                   | Personal              | Small Company              | Large Company                  |
|--------------------------|-----------------------|----------------------------|--------------------------------|
| **Error tracking**       | Sentry free tier      | Sentry Team               | Sentry Enterprise / custom     |
| **Logs**                 | Vercel logs           | Better Stack / Axiom      | Datadog / Splunk / Loki        |
| **Metrics**              | Vercel Analytics      | PostHog / Better Stack    | Datadog / Prometheus / custom  |
| **Traces**               | None                  | Some                      | OpenTelemetry + Honeycomb/Datadog APM |
| **RUM**                  | Vercel Analytics      | Vercel / Sentry           | Custom + Datadog RUM           |
| **Synthetic monitoring** | None                  | Better Stack uptime       | Multi-region synthetic tests   |
| **Alerting**             | Email                 | Slack / email             | PagerDuty / Opsgenie           |
| **On-call**              | None                  | Informal rotation         | 24/7 follow-the-sun            |
| **Post-mortems**         | None                  | For big incidents         | Formal for SEV1/SEV2           |
| **SLOs**                 | None                  | Loose targets             | Formal SLO + error budget      |

For enterprise specifics, see [Phase 8: Observability at Scale](/docs/enterprise/observability).

:::info Highlight: distributed tracing is the dividing line
The single observability tool that most clearly separates "small company" from "large company" is **distributed tracing**. A trace follows a single user request through every service it touches, with timing for each hop.

You don't need tracing when you have one or two services — log timestamps and Sentry are enough. The moment you have ten services and a slow page, traces become the only way to debug. That's why every enterprise observability strategy assumes traces are standard, while most startups don't have them at all.
:::

## Security and Compliance

| Aspect                  | Personal              | Small Company             | Large Company                   |
|-------------------------|-----------------------|--------------------------|---------------------------------|
| **HTTPS**               | Yes (free SSL)        | Yes                      | Yes + HSTS preload              |
| **WAF**                 | None                  | Cloudflare default       | Custom rules                    |
| **Secrets management**  | Vercel env vars       | Doppler / 1Password      | Vault / cloud-native            |
| **Rate limiting**       | Sometimes             | Yes                      | Yes, sophisticated              |
| **MFA for admins**      | Recommended           | Required                 | Mandatory                       |
| **Penetration testing** | None                  | Annual                   | Continuous + quarterly          |
| **Bug bounty**          | None                  | Optional                 | Yes                             |
| **SAST/DAST**           | None                  | Snyk/Dependabot          | Comprehensive                   |
| **SOC 2**               | No                    | Type II at 20–30 employees | Yes                            |
| **HIPAA / PCI / etc.**  | No                    | If business demands       | Often multiple                 |
| **Threat modeling**     | None                  | For sensitive features   | Required for new services       |
| **AppSec team**         | No                    | No                       | Yes                             |

For enterprise specifics, see [Phase 9: Security and Compliance](/docs/enterprise/security-compliance).

:::note Worked example: when does each tier of security investment become worth it?
A rough adoption pattern for security investment:

- **Solo:** Use HTTPS (free via Vercel/Cloudflare), don't commit secrets, use a password manager. Cost: $0, effort: minimal.
- **5–20 engineers:** Add Dependabot, enforce MFA, use a secrets manager (Doppler/1Password), add a WAF (Cloudflare's default). Cost: $50–$500/month, effort: a few hours of setup.
- **20–30 engineers (or first enterprise customer):** Pursue SOC 2 Type II — typically a 6–12 month project, costs $20K–$100K in tooling + auditor fees. Now you can sell to mid-market.
- **100+ engineers:** Hire your first dedicated security person. Add SAST in CI, bug bounty, annual pen tests. Cost: $300K+/year fully loaded.
- **500+ engineers:** Full AppSec team. Continuous pen testing. Multiple compliance regimes. Cost: millions per year.

Each step is triggered by a specific business event — a customer requirement, a regulatory deadline, a security incident — not by general aspiration.
:::

## What's next

→ Continue to [Economics](./economics) — what each scale actually costs, and how long changes take to reach users.
