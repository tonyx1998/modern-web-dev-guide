---
id: security-compliance
title: 'Phase 10: Security and Compliance'
sidebar_position: 13
sidebar_label: 12. Security & Compliance
description: AppSec, zero-trust networking, SOC 2, HIPAA, PCI, threat modeling, and continuous penetration testing.
---

# Phase 10: Security and Compliance

> **In one line:** Security at enterprise scale is a full discipline — dedicated AppSec teams, zero-trust networking, multi-regulation compliance (SOC 2, HIPAA, PCI, GDPR), continuous vulnerability scanning, and required threat modeling for new services.

:::tip[In plain English]
At a startup, security is "we use bcrypt and rotate the AWS keys when an intern leaves." At an enterprise, security is hundreds of engineers, dozens of overlapping regulations, continuous scanning of every dependency and container, and the assumption that someone is *actively trying* to breach you.

The stakes are not theoretical. A serious breach at this scale can mean nine-figure fines, criminal liability for executives, and the kind of brand damage that takes a decade to recover from.
:::

## AppSec team

A typical AppSec function:

- Reviews high-risk changes.
- Runs SAST/DAST/SCA.
- Manages bug bounty.
- Threat modeling for new services.
- Security training for engineers.

AppSec is the partner of every product team. Big launches go through an AppSec review like they go through a code review.

## Infrastructure security

- Network policies (deny-by-default).
- IAM with least privilege.
- Encryption at rest and in transit.
- Hardware security modules for key material.
- Zero-trust networking (no service implicitly trusts another).

Zero-trust networking is the modern default: every service-to-service call is authenticated and authorized, even inside the data center. The historical "trust everything on the internal network" model collapsed once attackers started getting *onto* internal networks.

## Compliance

Each of these requires specific controls, documentation, and audits:

- **SOC 2 Type II** — Annual audit.
- **ISO 27001** — International information security standard.
- **HIPAA** — Healthcare data in the US.
- **PCI-DSS** — Payment card data.
- **FedRAMP** — US federal government workloads.
- **GDPR** — EU users.
- **CCPA / CPRA** — California users.
- **SOX** — Public companies' financial data.
- **GLBA** — Financial services.
- **FERPA** — Education records.

A regulated enterprise often holds *multiple* of these simultaneously. Each one is months of preparation, dedicated GRC (Governance, Risk, Compliance) personnel, and continuous evidence collection.

## Identity and access

- SSO for all internal tools (Okta, Microsoft Entra).
- MFA mandatory.
- Just-in-time access (request elevated privileges for limited time).
- Comprehensive audit logs.

Just-in-time access is a powerful pattern: nobody has standing production database access. When you need it, you request it through a ticket, get a 1-hour window, and every action you take is logged. That dramatically shrinks the blast radius of a compromised account.

:::info[Highlight: compliance is risk transfer]
A common engineer reaction to compliance is "this is theater." Sometimes it is. More often, compliance is **risk transfer**: if you follow the documented controls and get breached anyway, the financial consequences look very different from "we ignored basic controls and got breached."

The compliance machinery exists because legislators and auditors decided certain industries (finance, healthcare, government, payments) can't be trusted to self-regulate. As an engineer, you don't have to love it, but you do have to live with it — and at this scale, it shapes everything you build.
:::

## Vulnerability management

- Continuous scanning of dependencies, containers, infrastructure.
- SLAs for patching (e.g., critical vulnerabilities patched within 7 days).
- Tracking dashboards.

A typical vuln-management dashboard shows: every service, every CVE found in its dependencies, severity, age, owner. Anything past its SLA gets escalated to a director.

## Penetration testing

- Quarterly or annually.
- Continuous via bug bounty programs (HackerOne, Bugcrowd).

A bug bounty is a paid invitation to attackers to find vulnerabilities legally. At enterprise scale, bounty payouts can reach $50,000+ for severe issues. The math works because finding a vuln *before* an attacker exploits it can save tens or hundreds of millions in breach costs.

## Threat modeling

- Required for new services or major changes.
- STRIDE methodology common.
- Outputs feed into security review.

STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) is a checklist for thinking through attack surfaces. A good threat model for a new service answers, for each STRIDE category: "what could an attacker do here, and how have we mitigated it?"

:::note[Worked example: rolling out a new payments endpoint]
A team is adding a new API endpoint for issuing refunds. At enterprise scale, the security work surrounding the code includes:

1. **Threat model** (week 1): STRIDE analysis. "Could an attacker spoof a refund request? Tamper with the amount? Trigger duplicate refunds via replay?"
2. **AppSec review** (week 2): An AppSec engineer reads the design doc and the threat model, asks follow-up questions, signs off.
3. **Pre-merge checks** (every PR): SAST, dependency scan, secret scanner.
4. **Pre-deploy checks**: DAST against the staging endpoint.
5. **Post-launch monitoring**: anomaly detection on refund volumes; alerting if a single account suddenly issues 100x more refunds than baseline.
6. **Audit logging**: every refund issued, with the operator, IP, request ID, amount, target user — retained for years for SOX.

The endpoint that takes 2 days to write takes 3 weeks to ship. The reason is not bureaucracy. It's that "issue refunds" is exactly the kind of endpoint attackers target, and the cost of getting it wrong is enormous.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating compliance and security as the same function.** A SOC 2 audit doesn't make you secure; it proves you wrote down what you said you'd do. Pass the audit *and* run a real AppSec program — they catch different classes of failure.
- **AppSec as a last-mile gate instead of a design partner.** If security review only happens the week before launch, the only options are "ship anyway" or "rebuild." Pull AppSec in during threat modeling, when changing the architecture is still cheap.
- **Standing production access "for emergencies."** Every account with permanent prod access is a permanent blast radius. JIT access plus break-glass procedures are how mature orgs handle the actual emergencies — not by giving everyone admin "just in case."
- **Letting CVE dashboards become wallpaper.** A list of 4,000 open CVEs with no triage cadence is the same as no list. Pick an SLA (e.g., criticals in 7 days), enforce it by team, and escalate breaches to directors — otherwise the dashboard just documents the problem.
- **Importing FAANG zero-trust architecture at 50 engineers.** mTLS-everywhere with a service-mesh policy engine and custom IAM is months of platform work. At smaller scale, network segmentation + IAM + audit logs cover most of the threat model — adopt zero-trust when the perimeter genuinely can't be trusted, not as a buzzword.
:::

## Page checkpoint

<Quiz id="enterprise-security-compliance-page" title="Did security & compliance stick?" sampleSize={2}>

<Question
  prompt="What is the core idea behind zero-trust networking?"
  options={[
    { text: "Block all external traffic by default" },
    { text: "No service implicitly trusts another — every service-to-service call is authenticated and authorized, even inside the data center" },
    { text: "Only trust internal IPs" },
    { text: "Disable all networking until proven safe" }
  ]}
  correct={1}
  explanation="The historical 'trust everything on the internal network' model collapsed once attackers started landing on internal networks. Zero-trust authenticates and authorizes every service-to-service call, removing the implicit trust that used to live inside the perimeter."
  revisit={{ to: "/docs/enterprise/security-compliance#infrastructure-security", label: "Zero-trust" }}
/>

<Question
  prompt="Why is just-in-time (JIT) access for production a powerful pattern?"
  options={[
    { text: "It removes the need for any logging" },
    { text: "Nobody has standing production access; elevated privileges are requested for a limited window with every action logged — shrinking the blast radius of a compromised account" },
    { text: "It speeds up incident response" },
    { text: "It eliminates the need for MFA" }
  ]}
  correct={1}
  explanation="With JIT access, even senior engineers don't have standing production DB credentials. They request a 1-hour window when needed, every action is logged, and a compromised account has very little blast radius — vs. one with always-on prod access."
  revisit={{ to: "/docs/enterprise/security-compliance#identity-and-access", label: "JIT access" }}
/>

<Question
  prompt="What is the page's honest framing of compliance work?"
  options={[
    { text: "It's pure theater and should be ignored" },
    { text: "It's risk transfer — if you follow documented controls and still get breached, the financial and legal consequences look very different from 'we ignored basic controls'" },
    { text: "It only matters to lawyers" },
    { text: "It replaces the need for real security" }
  ]}
  correct={1}
  explanation="Compliance isn't a substitute for real security, but it's also not just theater. It's risk transfer: following documented controls fundamentally changes the legal and financial consequences of a breach. As an engineer, you live with it whether you like it or not."
  revisit={{ to: "/docs/enterprise/security-compliance#compliance", label: "Compliance as risk transfer" }}
/>

<Question
  prompt="What does STRIDE stand for as a threat-modeling framework?"
  options={[
    { text: "Security, Threats, Risks, Incidents, Defenses, Escalations" },
    { text: "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege" },
    { text: "Static, Type, Runtime, Integration, Dynamic, End-to-end" },
    { text: "Storage, Transit, Rest, Internal, Domain, External" }
  ]}
  correct={1}
  explanation="STRIDE is a checklist for thinking through attack surfaces: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. A good threat model answers, for each category, 'what could an attacker do here, and how have we mitigated it?'"
  revisit={{ to: "/docs/enterprise/security-compliance#threat-modeling", label: "STRIDE" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 11: Release Management](./release-management) — how all these pieces come together into a coordinated launch.
