---
id: email
title: 'Email deliverability: SPF, DKIM, DMARC, and not landing in spam'
sidebar_position: 43
sidebar_label: Email
description: How email authentication actually works — SPF, DKIM, DMARC, BIMI — plus the operational practices (warmup, bounce handling, unsubscribes, templates, transactional vs marketing separation) that decide whether your emails reach the inbox or the void.
---

# Email deliverability: SPF, DKIM, DMARC, and not landing in spam

> **In one line:** Sending email is easy. Having it actually delivered to the user's inbox — instead of spam, the void, or a deferred queue — is a multi-discipline problem of cryptography (DKIM signing), DNS records (SPF, DMARC), reputation, content, list hygiene, and engagement signals.

:::tip[In plain English]
You hooked up SendGrid (or Resend, Postmark, AWS SES, Mailgun) and sent a password reset email. It went to the user's spam folder. Or worse, was silently discarded by Gmail. Why? Because Gmail, Outlook, and friends weigh dozens of signals — your domain's authentication setup, your sender reputation, the email's content, the recipient's engagement history — to decide whether you're trustworthy. Each signal you get wrong drops your inbox placement rate. This page is the working dev's guide to getting them right.
:::

For any app that sends real email to real users (welcome emails, password resets, billing, alerts), deliverability is a continuous practice, not a one-time setup. The good news: the basics are not optional, and once set up, most of it stays set.

## The three letters: SPF, DKIM, DMARC

These are DNS-based authentication standards. Together, they let receiving servers verify "this email actually came from someone authorized to send for this domain."

### SPF (Sender Policy Framework)

A DNS TXT record listing IP addresses or domains allowed to send mail "from" your domain.

```
example.com.   IN  TXT  "v=spf1 include:_spf.google.com include:sendgrid.net -all"
```

> **In English:** Mail claiming `From: anything@example.com` is legitimate if sent from a server in Google's allowed range OR SendGrid's allowed range. Anything else: hard-fail (`-all`).

When mail arrives, the receiver checks the envelope sender's domain (the `Return-Path`, not the visible `From:`), looks up SPF, sees if the source IP matches.

Gotchas:
- **SPF only covers the envelope sender, not the visible `From:` header.** Phishing emails can spoof the `From:` while passing SPF. (DMARC fixes this.)
- **`include:` limits** — DNS lookups in SPF max out at 10. Chain too many ESPs and you blow the limit.
- **`-all` (hard fail) vs `~all` (soft fail)** — `-all` says "reject if not authorized"; `~all` says "treat suspiciously." Use `-all` once you're confident.

### DKIM (DomainKeys Identified Mail)

A cryptographic signature on every email. Your sending platform signs with a private key; receivers fetch your public key from DNS to verify.

```
selector1._domainkey.example.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQ..."
```

The selector (`selector1`) is part of the signing header in every email. Receivers know which key to fetch from DNS. This lets you rotate keys (publish `selector2`, switch signing, retire `selector1`).

Properties:
- **Per-email signature** — modifying the body invalidates the signature.
- **Doesn't change envelope sender** (unlike SPF).
- **Authenticates the visible `From:` header** when aligned with DKIM signing domain (more on alignment in DMARC).

Almost universal in 2026. SendGrid, Resend, Postmark, SES all sign by default with their own keys; for proper DKIM alignment (DMARC-passing), you also configure DKIM with *your* domain.

### DMARC

The policy that says what to do when SPF and DKIM disagree, or when the visible `From:` domain doesn't match.

```
_dmarc.example.com.   IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com; pct=100; aspf=s; adkim=s;"
```

Fields:
- `p=` — policy: `none` (just monitor), `quarantine` (send to spam), `reject` (refuse). Start with `none`, move up.
- `pct=` — apply policy to this % of mail.
- `rua=` — daily aggregate reports go here.
- `ruf=` — forensic per-failure reports (rare).
- `aspf=`, `adkim=` — strict (`s`) vs relaxed (`r`) alignment.

DMARC's key contribution: **alignment** — the `From:` domain must match either the SPF envelope domain *or* the DKIM signing domain. So if `From: support@example.com`, DKIM must sign with `example.com` or a subdomain, *or* SPF must pass for `example.com`. This is what stops phishers from sending `From: support@example.com` via a different domain.

In 2024, Gmail and Yahoo started requiring DMARC for any sender doing >5000 emails/day. By 2026, DMARC `p=quarantine` or `p=reject` is table stakes for serious senders.

### BIMI (Brand Indicators for Message Identification)

A newer standard: if you have DMARC `p=quarantine`/`reject` and an SVG logo + Verified Mark Certificate, Gmail (and increasingly others) shows your logo next to the email in the inbox.

```
default._bimi.example.com.  IN  TXT  "v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/cert.pem"
```

Visual trust signal, modest deliverability boost. Worth doing for consumer brands.

## Sender reputation

Receiving systems track every sender's reputation. Bad reputation = your mail goes to spam regardless of authentication. Reputation is per-domain and per-sending-IP.

Signals that hurt reputation:
- **Bounce rate** above ~2% — sending to non-existent addresses.
- **Spam complaint rate** above ~0.1% — users hit "report spam."
- **Spam trap hits** — addresses that exist solely to catch spammers.
- **Engagement decay** — recipients ignore or delete without opening.
- **Sudden volume spikes** — new sender suddenly blasting.
- **Listings on blocklists** (Spamhaus, SORBS, etc.).

Signals that help:
- **Authenticated mail** (SPF/DKIM/DMARC passing).
- **High engagement** — users opening, replying, marking-as-important.
- **Consistent volume** — steady cadence over months.
- **Clean lists** — no role accounts (`info@`, `noreply@`), no scraped addresses.

Inbox providers don't tell you your reputation. Tools that approximate: Google Postmaster Tools, Microsoft SNDS, Talos Intelligence.

## Warming up a new domain or IP

Sending 100,000 emails from a brand-new domain looks identical to a botnet. Receiving systems will throttle or block you.

**Warmup**: gradually ramp send volume over weeks. Day 1: 50 emails. Day 2: 100. Day 3: 200. Double-ish until you hit steady-state. Spread sends across the day; don't blast.

For transactional volume (password resets, billing): naturally warms up if you're growing organically. Marketing campaigns: explicit warmup needed.

ESPs (especially SendGrid, Mailgun) offer **dedicated IPs with auto-warmup** — useful if you've outgrown shared IP pools.

## Transactional vs marketing

| Type | Examples | Approach |
|------|----------|----------|
| **Transactional** | Password reset, receipt, billing notice, alert | Triggered by user action, 1-to-1, low spam risk, high engagement |
| **Marketing** | Newsletter, promo, drip campaign | Bulk, lower engagement, higher unsubscribe |

**Separate them.** Use different subdomains (`tx.example.com` for transactional, `news.example.com` for marketing) or different senders entirely (Postmark for transactional, SendGrid Marketing for newsletters). A bad newsletter campaign tanks reputation; if it shares the sending domain with your password-reset emails, *those* start going to spam too.

The 2026 ecosystem split:
- **Transactional only**: Postmark, Resend (modern), AWS SES (cheap, requires more setup).
- **Marketing+transactional unified**: SendGrid, Mailgun, Mailchimp Transactional.

## List hygiene

The fastest way to wreck reputation: send to invalid addresses.

Rules:
- **Confirmed opt-in (double opt-in).** User signs up → email with confirmation link → only added to list when clicked. Stops typos and spam-trap subscriptions.
- **No purchased lists.** Ever. Mail providers detect this.
- **Bounce processing.** On a hard bounce, immediately stop mailing that address. Soft bounces: retry a few times, then suppress. Most ESPs handle this if you configure it.
- **Engagement-based pruning.** A user who hasn't opened anything in 6 months hurts your reputation. Sunset (re-engagement campaign → unsubscribe if no response).
- **Spam complaint handling.** Webhook from the ESP → immediately remove from list. No second chances.

## Unsubscribes (legal and operational)

- **CAN-SPAM (US)** — requires functional unsubscribe link in every commercial email, processed within 10 business days.
- **GDPR (EU)** — explicit opt-in required; clear unsubscribe.
- **CASL (Canada)** — similar.
- **List-Unsubscribe header** — `mailto:` or `https:` for one-click unsubscribe from the inbox UI (Gmail/Outlook show it natively).
- **One-click List-Unsubscribe** (RFC 8058) — Gmail/Yahoo now require this for senders >5k/day.

```
List-Unsubscribe: <https://example.com/unsub?t=TOKEN>, <mailto:unsubscribe@example.com>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

Don't make unsubscribe hard. The user who's annoyed will hit "spam" instead, hurting you more than letting them leave gracefully.

For transactional: usually exempt from CAN-SPAM (no unsubscribe required). But include account-level email preferences anyway — users want it.

## Content that lands in inbox

After authentication and reputation, the email itself is evaluated for spam markers.

| Avoid | Why |
|-------|-----|
| ALL CAPS SUBJECT | Spam signal |
| !!!!!!! | Spam signal |
| Excessive linking, especially to many domains | Spam signal |
| Very high image:text ratio | Spam signal (image-only emails) |
| Free hosted images with click tracking | Some receivers flag tracker domains |
| Sketchy phrases ("MAKE MONEY FAST") | Bayesian filters |
| Misalignment between subject and body | Spam signal |
| Wide use of redirector URLs (`bit.ly`) | Spam signal |
| Sender display name spoofing (`From: "PayPal Support" <random@random.com>`) | Phishing signal |
| No plain-text version | Some clients distrust HTML-only |

Useful patterns:
- **Plain-text part** alongside HTML (use `multipart/alternative`).
- **Real branded sender name** (`From: Example Support <support@example.com>`).
- **Consistent layout** — recurring templates train recipients' brains and inbox providers' models.
- **Test in major clients** — Gmail, Outlook, Apple Mail render very differently. Litmus and Email on Acid are the standard tools.

## Templates and editors

For non-trivial email design:

- **MJML** — JSX-like markup that compiles to email-safe HTML (tables galore, Outlook-friendly).
- **React Email** — write components in React; render to HTML email at build time. The 2026 dev favorite.
- **Maizzle** — Tailwind for email.
- **Vanilla HTML email** — table layouts, inline CSS. Painful; tooling exists for a reason.

Email HTML is *not* web HTML. Outlook uses Microsoft Word's HTML renderer. CSS Grid, Flexbox, modern selectors — gone. Stick to tables, inline styles, web-safe fonts (with fallbacks).

## Webhooks and event tracking

ESPs send webhooks for delivery state. Common events:

| Event | Meaning |
|-------|---------|
| `processed` / `accepted` | We took your API call |
| `delivered` | Receiving server accepted the message |
| `bounce` (hard / soft) | Failed delivery — hard = permanent, soft = transient |
| `dropped` | We didn't even try (blocked address, etc.) |
| `deferred` | Receiver said "try again later" |
| `open` | Recipient opened (tracked via 1×1 pixel) |
| `click` | Recipient clicked a tracked link |
| `spamreport` | Recipient marked as spam |
| `unsubscribe` | Recipient clicked unsubscribe |

Webhook handler must:
- Verify signature (every ESP signs).
- Be idempotent (events may be redelivered).
- Update suppression lists immediately on bounce / spam / unsubscribe.

## Operations playbook

A typical month:

- **Daily**: monitor bounce rate, spam complaint rate via ESP dashboard.
- **Weekly**: check Google Postmaster Tools and Microsoft SNDS for reputation.
- **Monthly**: re-engagement campaigns for users inactive > 90 days.
- **Quarterly**: prune lists (suppress unengaged, validate before sending). Verify DKIM key rotation is working.

When deliverability drops:
1. **Authentication first** — confirm SPF, DKIM, DMARC still pass. Re-check DNS.
2. **Reputation** — check Postmaster Tools, blocklists.
3. **Recent changes** — new content templates? New ESP? Different IP? Volume spike?
4. **Engagement** — opens/clicks crashed?
5. **Specific to one provider?** — Gmail-only issues are different from Outlook-only.

## Common mistakes

:::caution[Where people commonly trip up]
- **No DKIM with your domain.** Mail signs with the ESP's `*.sendgrid.net` keys, doesn't align with your `From:`, DMARC fails. Configure DKIM keys *for your domain* in your ESP.
- **DMARC `p=reject` without monitoring first.** You'll reject legitimate mail from forgotten senders (your CRM, an old internal tool). Start `p=none` for a few weeks, check `rua` reports, then ramp up.
- **Shared subdomain for marketing and transactional.** Bad newsletter campaign tanks reputation, your password resets start going to spam. Use distinct subdomains.
- **No bounce handling.** Sending to a hard-bounce address repeatedly looks like spamming. Automate suppression.
- **`noreply@example.com` as From: address.** Some receivers flag it; users can't reply when something's wrong. Use a monitored mailbox (`hi@`, `support@`).
- **Tracking pixels on transactional email.** Privacy-aware users (and some inbox providers) view them suspiciously. Skip tracking on truly transactional.
- **HTML-only email.** Add a `text/plain` part. Required for some receivers; helps deliverability everywhere.
- **Long unsubscribe flows.** "Click here, fill out a survey, confirm." Users hit spam instead. One click unsubscribe.
- **`Reply-To` set to a different domain.** Sketchy signal. Keep it on the sending domain or your domain.
- **Skipping warmup on a new domain or IP.** Send 50,000 emails day 1 from a brand-new domain → throttled or blocked.
- **Tracking links via redirector domain.** Receivers may flag the redirector as suspicious. Use your own domain (`example.com/r/xyz`) for redirects, signed.
- **No `List-Unsubscribe` header.** Gmail/Yahoo require it for bulk senders since 2024. Include both `mailto:` and one-click `https:`.
- **Same email subject for everyone every campaign.** Subject-line A/B testing improves open rate; flat subjects hurt.
- **Forgetting Postmaster Tools.** Free, shows what Gmail thinks of you. Sign up day one of sending.
- **Sending password reset emails from `marketing@`.** Wrong subdomain, wrong stream, lower engagement signals. Use a transactional sender (Postmark, Resend, separate stream in SendGrid).
:::

## Page checkpoint

<Quiz id="foundations-email-page" title="Did email deliverability stick?" sampleSize={3}>

<Question
  prompt="A team's password reset emails go to spam in Gmail. Their SendGrid setup uses default DKIM signing (with SendGrid's domain). What's the likely fix?"
  options={[
    { text: "Switch to Outlook" },
    { text: "Configure DKIM signing with *their* domain (CNAME records to SendGrid's selector) so DKIM aligns with the visible `From:` address. Without alignment, DMARC fails and Gmail treats it as suspicious" },
    { text: "Send fewer emails" },
    { text: "Change the subject line" }
  ]}
  correct={1}
  explanation="DMARC requires alignment: DKIM (or SPF) must pass for the *same* domain as the visible `From:` header. Default ESP DKIM signs with their domain, not yours. Configure your own DKIM keys (typically CNAMEs to ESP-managed records) so the `From: …@yourdomain.com` aligns with the DKIM signing domain."
  revisit={{ to: "/docs/foundations/email#dkim-domainkeys-identified-mail", label: "DKIM alignment" }}
/>

<Question
  prompt="Why should a team use separate subdomains for transactional and marketing email?"
  options={[
    { text: "It's required by HTTP" },
    { text: "Marketing email has higher unsubscribe and lower engagement rates, which hurt sender reputation. If transactional shares the subdomain, a bad marketing campaign's reputation hit causes password reset emails to land in spam. Different subdomains = independent reputations" },
    { text: "Subdomains are cheaper" },
    { text: "Gmail blocks shared subdomains" }
  ]}
  correct={1}
  explanation="Reputation tracks domain-level. Separating streams (`tx.example.com` vs `news.example.com`) means a struggling marketing campaign doesn't drag down critical transactional delivery — and vice versa."
  revisit={{ to: "/docs/foundations/email#transactional-vs-marketing", label: "Separate streams" }}
/>

<Question
  prompt="A team's new app sends 50,000 marketing emails the first day from a brand-new domain. Why is this catastrophic?"
  options={[
    { text: "ESPs charge extra" },
    { text: "A brand-new domain with no sending history suddenly blasting 50k emails looks identical to a botnet to receivers. They throttle or block. Reputation takes weeks/months to recover. Warmup means gradually ramping volume (50/100/200/500…) over weeks, letting receivers build trust" },
    { text: "DNS doesn't propagate fast enough" },
    { text: "Users can't read them all" }
  ]}
  correct={1}
  explanation="No sending history + sudden high volume = spam signal. Warmup is the practice of building reputation slowly. Skip it and you're starting from a deep deliverability hole."
  revisit={{ to: "/docs/foundations/email#warming-up-a-new-domain-or-ip", label: "Warming up" }}
/>

<Question
  prompt="A team continues mailing addresses that hard-bounced last month. Their inbox placement rate drops. Why?"
  options={[
    { text: "Hard-bounced addresses are blocked at the network level" },
    { text: "Repeatedly mailing addresses that don't exist is a strong spammer signal — bots blast lists scraped from years ago; legitimate senders prune. ESPs and receivers both watch this. Suppress hard bounces immediately and permanently" },
    { text: "Bounced emails consume bandwidth" },
    { text: "Hard bounces increase send latency" }
  ]}
  correct={1}
  explanation="Bounce-to-nonexistent-address ratio is a key reputation signal. Always suppress on hard bounce; most ESPs automate this if configured. Repeated sends to dead addresses degrade your reputation across the whole sending domain."
  revisit={{ to: "/docs/foundations/email#list-hygiene", label: "Bounce handling" }}
/>

</Quiz>

## What's next

→ Continue to [Web Fundamentals Checkpoint](./foundations-mid-checkpoint) — recap before Production Engineering.
