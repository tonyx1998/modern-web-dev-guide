---
id: ops
title: Observability, Security, and Compliance
sidebar_position: 5
sidebar_label: 4. Operations
description: How monitoring, on-call, security, and compliance scale from solo / small / large companies.
---

# Observability, Security, and Compliance

> **In one line:** A solo dev relies on Sentry emails and prayers; a startup adds dashboards and an informal on-call; an enterprise has full SLOs, error budgets, 24/7 follow-the-sun on-call, plus AppSec teams, bug bounties, and multiple compliance regimes.

:::tip[In plain English]
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

For enterprise specifics, see [Phase 9: Observability at Scale](/docs/enterprise/observability).

:::info[Highlight: distributed tracing is the dividing line]
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

For enterprise specifics, see [Phase 10: Security and Compliance](/docs/enterprise/security-compliance).

:::note[Worked example: when does each tier of security investment become worth it?]
A rough adoption pattern for security investment:

- **Solo:** Use HTTPS (free via Vercel/Cloudflare), don't commit secrets, use a password manager. Cost: $0, effort: minimal.
- **5–20 engineers:** Add Dependabot, enforce MFA, use a secrets manager (Doppler/1Password), add a WAF (Cloudflare's default). Cost: $50–$500/month, effort: a few hours of setup.
- **20–30 engineers (or first enterprise customer):** Pursue SOC 2 Type II — typically a 6–12 month project, costs $20K–$100K in tooling + auditor fees. Now you can sell to mid-market.
- **100+ engineers:** Hire your first dedicated security person. Add SAST in CI, bug bounty, annual pen tests. Cost: $300K+/year fully loaded.
- **500+ engineers:** Full AppSec team. Continuous pen testing. Multiple compliance regimes. Cost: millions per year.

Each step is triggered by a specific business event — a customer requirement, a regulatory deadline, a security incident — not by general aspiration.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Starting a SOC 2 project before a customer is asking.** A 6–12 month, $20K–$100K compliance program with no specific deal attached is dead weight — it expires, the controls drift, and you redo it when a real customer eventually shows up. Wait for the email that says "we need your SOC 2 report."
- **Adopting formal SLOs and error budgets at 5 engineers.** Without enough traffic, your SLO math is statistical noise — a single bad hour torches the budget. At startup scale, "we want >99.5% uptime and we'll write a quick post-mortem when something burns" beats the full Google SRE ceremony.
- **Buying Datadog at startup scale "to be ready."** Datadog at full enterprise volume is $4M/year, and at 5 engineers you're paying $2K/month for a tool whose value comes from features you can't yet use. Sentry + Better Stack + Vercel Analytics covers the same ground for ~$100/month until you actually have services to trace.
- **Confusing "we have alerts" with "we have on-call."** A Slack channel with notifications that everyone mutes after the third false positive is not an on-call rotation. Either commit to PagerDuty with a real schedule and runbook, or be honest that recovery is "whoever notices first" — both are valid at small scale.
- **Reading the enterprise security column as a checklist to copy.** Bug bounty, AppSec team, threat modeling, continuous pen testing — every line costs real money and only pays back at corresponding scale. At startup scale, MFA + a secrets manager + Dependabot covers 95% of realistic threats for ~$100/month.
:::

## Page checkpoint

<Quiz id="comparison-ops-page" title="Did ops across scales stick?" sampleSize={3}>

<Question
  prompt="Which observability tool most clearly separates 'small company' from 'large company'?"
  options={[
    { text: "Error tracking (Sentry)" },
    { text: "Uptime monitoring" },
    { text: "Distributed tracing" },
    { text: "Vercel Analytics RUM" }
  ]}
  correct={2}
  explanation="Distributed tracing is the dividing line. With one or two services, logs and Sentry suffice. Once you have ten-plus services, traces are the only way to debug a slow request that crosses many hops."
  revisit={{ to: "/docs/comparison/ops#observability", label: "Distributed tracing is the dividing line" }}
/>

<Question
  prompt="What typically triggers a small company to pursue SOC 2 Type II?"
  options={[
    { text: "General aspiration to be more secure" },
    { text: "A specific business event such as a customer requirement or regulatory deadline, usually around 20–30 employees" },
    { text: "Reaching 100 engineers" },
    { text: "The first hire of a dedicated security engineer" }
  ]}
  correct={1}
  explanation="Security investments step up in response to specific business events — typically a mid-market customer requirement around 20–30 employees prompts the SOC 2 Type II project, not general aspiration."
  revisit={{ to: "/docs/comparison/ops#security-and-compliance", label: "When each tier becomes worth it" }}
/>

<Question
  prompt="How does on-call typically scale from solo to enterprise?"
  options={[
    { text: "Solo: 24/7 follow-the-sun. Startup: informal rotation. Enterprise: none" },
    { text: "Solo: none. Startup: informal rotation. Enterprise: 24/7 follow-the-sun via PagerDuty/Opsgenie" },
    { text: "All three run formal 24/7 rotations from day one" },
    { text: "Solo and startup both use PagerDuty; enterprises rely on Slack alerts" }
  ]}
  correct={1}
  explanation="A solo dev has no on-call. Startups run informal rotations with Slack or email alerts. Enterprises run 24/7 follow-the-sun rotations through PagerDuty or Opsgenie, with formal post-mortems for SEV1/SEV2 incidents."
  revisit={{ to: "/docs/comparison/ops#observability", label: "Observability" }}
/>

<Question
  prompt="Why does the cost of being wrong about reliability and security grow so dramatically with scale?"
  options={[
    { text: "Enterprises just have more expensive tools, so each outage costs more in licenses" },
    { text: "The impact roughly tracks the square of your user count — missed alerts can mean SLA breaches, regulatory fines, and front-page news" },
    { text: "Solo developers technically have the highest exposure because they have no insurance" },
    { text: "It does not actually grow with scale; the article overstates the gap" }
  ]}
  correct={1}
  explanation="The cost of being wrong about reliability or security roughly grows with the square of user count. A missed alert ships a bug to yourself when solo, to a few customers at a startup, and to millions plus regulators at enterprise scale."
  revisit={{ to: "/docs/comparison/ops#observability", label: "In plain English" }}
/>

</Quiz>

## What's next

→ Continue to [Economics](./economics) — what each scale actually costs, and how long changes take to reach users.
