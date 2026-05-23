---
id: authentication
title: 'Authentication: Proving Identity'
sidebar_position: 22
sidebar_label: Authentication
description: The five common ways users prove they are who they claim to be — passwords, OAuth, magic links, passkeys, SSO.
---

# Authentication: Proving Identity

> **In one line:** Authentication answers *"who are you?"*. There are five common ways to answer it, and in 2026 you should use a service rather than building your own.

:::tip[In plain English]
"Authentication" (authn) is just the technical word for "logging in." It's the bouncer at the door checking your ID. There are five widely-used styles of ID-checking in 2026 — each has trade-offs. The single most important piece of advice on this whole page is at the bottom: **don't build your own auth.** Use Clerk, Auth0, Supabase, or similar.
:::

## A quick reminder: authn vs authz

- **Authentication (authn)** — proving who you are.
- **Authorization (authz)** — determining what you can do.

This page covers authentication. The next covers authorization.

## Method 1: Password-based (classic but declining)

1. User enters password.
2. Server **hashes** it (with bcrypt, argon2, or scrypt — *never* plain SHA or MD5).
3. Server compares the hash to the stored hash.
4. Server issues a session token (cookie) or JWT.

**Pitfalls:**
- Users reuse passwords across sites → one breach compromises many accounts.
- Phishing — users type their password into a fake site.
- Password reset flows are themselves attack surfaces.
- Users pick weak passwords.

:::info[Highlight: hashing vs encryption]
A common confusion: passwords should be *hashed*, not *encrypted*. Encryption is reversible (you can decrypt). Hashing is one-way (impossible to reverse). You should never know what your user's password is — only whether the hash they sent matches the one you stored. If your database leaks, attackers only have hashes, not usable passwords.

**Use bcrypt or argon2.** Never SHA-256, never MD5, never roll-your-own.
:::

## Method 2: OAuth / Social Login

"Sign in with Google" / "Sign in with GitHub" / "Sign in with Apple."

The flow:

1. User clicks "Sign in with Google."
2. Browser redirects to Google with your app's client ID.
3. Google authenticates the user, asks for permission to share their identity.
4. Google redirects back to your app with a **code**.
5. Your server exchanges the code for an access token + user profile.

OAuth 2.0 is the protocol; **OIDC (OpenID Connect)** is OAuth + identity assertions.

**Pros:**
- Users don't need a new account.
- You never store passwords (a major security win).
- Big providers (Google, Apple, GitHub) handle 2FA, account recovery, etc.

**Cons:**
- Dependency on the provider — if Google's down, your login is down.
- Users may not have an account with the providers you support.
- Privacy concerns (you're telling Google when this user uses your app).

## Method 3: Magic Links

1. User enters email.
2. Server emails a one-time login link (`https://yourapp.com/auth?token=...`).
3. Clicking the link logs them in.
4. The token is single-use and expires (typically 15 minutes).

**Pros:**
- No passwords to remember.
- No password reset flow needed.
- Phishing-resistant (the link goes to the *actual* email account).

**Cons:**
- Adds email delivery roundtrip latency.
- If the user's email is compromised, your auth is compromised.
- Mobile users sometimes get stuck (clicking the link opens a different browser than where they started).

:::info[Highlight: Magic links are great for B2B SaaS]
Many modern B2B SaaS products (Notion, Linear, Vercel) default to magic links. The audience (working professionals on their work email) doesn't care about typing a password and gets a smoother first-time experience.
:::

## Method 4: Passkeys (WebAuthn)

The most modern and most secure option:

1. User authenticates with biometrics (Face ID, fingerprint) or a security key.
2. The device generates a public/private key pair *specific to your site*.
3. The private key never leaves the device.
4. Future logins are signed by the private key, verified by the server using the public key.

**Pros:**
- **Phishing-resistant** — the keypair is bound to your domain. Fake sites can't reuse it.
- **No passwords to remember** or leak.
- Supported by all major platforms (Apple, Google, Microsoft) by 2026.

**Cons:**
- Account recovery is harder (you must re-enroll a passkey if the device is lost).
- Users still don't fully understand passkeys; teaching is required.

Passkeys are rapidly becoming the default for new auth systems. If you're starting fresh, support passkeys from day one.

:::note[Try it yourself]
Some sites already offer passkey signup: github.com, google.com, amazon.com, apple.com.

Try enabling a passkey for one. The "log in with Face ID" experience is genuinely faster and more secure than typing a password. You'll feel why this is the future.
:::

## Method 5: SAML / SSO (enterprise)

- Used for enterprise single sign-on.
- An identity provider (Okta, Microsoft Entra, Google Workspace) authenticates the user.
- Your app trusts the assertion they send.

Required when selling to enterprises with their own identity systems. You'll need this for any deal above ~$5K ARR with a real company. SaaS tools like **WorkOS** add SAML support to existing apps without you having to implement the protocol yourself.

## In 2026: use a service

Implementing auth correctly is hard — there are dozens of subtle ways to leak credentials, mishandle tokens, or bypass checks. Modern best practice is to *outsource auth entirely*:

| Service           | Notes                                                             |
|-------------------|-------------------------------------------------------------------|
| **Clerk**         | Drop-in, beautiful UI, generous free tier, expensive at scale.    |
| **Better Auth**   | Open-source, self-hostable, TypeScript-native, fast-rising in 2026. |
| **Auth.js (NextAuth)** | Open-source, framework-integrated. Long-standing standard.   |
| **Auth0**         | Mature, enterprise-friendly, more expensive.                      |
| **Supabase Auth** | Bundled with Supabase database; great if you're using Supabase.   |
| **WorkOS**        | Adds enterprise SSO/SAML to existing apps.                        |

:::info[Highlight: don't roll your own auth]
This is the single piece of advice with the strongest consensus across the industry in 2026. The attack surface is too large, the consequences of mistakes too severe, and the existing services are too cheap and too good. Spend your engineering time on your product, not on yet another password hashing implementation.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Mixing up *hashing* and *encrypting* passwords.** Encryption is reversible; whoever has the key can read the plaintext. Hashing (bcrypt, argon2) is one-way. If anyone — including you — can *decrypt* user passwords, the design is wrong. Hash them.
- **Using a fast hash like SHA-256 or MD5 for passwords.** Fast hashes are exactly what GPUs need to brute-force a leaked database. bcrypt and argon2 are *deliberately* slow; that slowness is the security feature. Never roll your own.
- **Treating "Sign in with Google" as a free upgrade.** OAuth means your auth depends on Google being up, your `client_id` being correct, and your app's privacy policy explaining what data you receive. It also doesn't free you from session management — you still need to issue your own session/JWT once the OAuth flow completes.
- **Sending the magic link from a domain users don't recognize.** If users see an email from `mail.no-reply-server.aws-ses-region-2.example` they will mark it as spam and your "passwordless flow" silently breaks. Set up a verified sending domain (SPF, DKIM, DMARC) before launch.
- **Building auth yourself "to learn."** Learning is fine; *shipping* a homegrown auth system in 2026 is not. Token rotation, password resets, MFA, OAuth edge cases, and account takeover defenses are massive surface areas with severe consequences. Use Clerk, Better Auth, Auth.js, Auth0, or Supabase Auth and spend that time on your product.
:::

## Page checkpoint

<Quiz id="authentication-page" title="Did authentication stick?" sampleSize={2}>

<Question
  prompt="What's the correct way to store user passwords on the server?"
  options={[
    { text: "Plain text — passwords need to be readable for support" },
    { text: "Encrypted with AES so you can decrypt them when needed" },
    { text: "Hashed with bcrypt or argon2 — one-way, irreversible, so a database leak only exposes hashes, not usable passwords" },
    { text: "Hashed with MD5 or SHA-256 for speed" }
  ]}
  correct={2}
  explanation="Passwords should be HASHED (one-way) not ENCRYPTED (reversible). bcrypt and argon2 are the modern picks — they're slow on purpose, which frustrates brute-force attacks. Never SHA-256, never MD5, never roll your own."
  revisit={{ to: "/docs/foundations/authentication#method-1-password-based-classic-but-declining", label: "Hashing vs encryption" }}
/>

<Question
  prompt="What's the most security-relevant property of passkeys (WebAuthn)?"
  options={[
    { text: "They use shorter passwords, so they're easier to remember" },
    { text: "The keypair is bound to your domain, making them phishing-resistant — a fake lookalike site can't reuse the credential" },
    { text: "They are stored centrally on a passkey server" },
    { text: "They expire after one use" }
  ]}
  correct={1}
  explanation="A passkey's private key is bound to the legitimate site's origin and never leaves the device. A phishing site at a similar URL literally can't request a valid signature for your real site, which kills the entire phishing attack class."
  revisit={{ to: "/docs/foundations/authentication#method-4-passkeys-webauthn", label: "Passkeys" }}
/>

<Question
  prompt="What's the strongest 2026 industry consensus about implementing auth?"
  options={[
    { text: "Roll your own — it's a great learning exercise to ship in production" },
    { text: "Use a service (Clerk, Auth0, Better Auth, Supabase Auth, etc.) — the attack surface is huge and the existing services are good and cheap" },
    { text: "Send passwords over plain HTTP if SSL is too expensive" },
    { text: "Store JWTs in localStorage so any script can read them" }
  ]}
  correct={1}
  explanation="The consensus is unusually strong: don't roll your own auth. Token handling, password reset flows, MFA, OAuth, and edge cases are huge and unforgiving. Use a service and save your engineering for your actual product."
  revisit={{ to: "/docs/foundations/authentication#in-2026-use-a-service", label: "Don't roll your own auth" }}
/>

<Question
  prompt="A user clicks 'Sign in with Google.' What does Google ultimately send back to your app after they authenticate?"
  options={[
    { text: "The user's Google password, so you can store it" },
    { text: "A short authorization code that your server exchanges for an access token plus the user's profile info" },
    { text: "A signed contract with Google" },
    { text: "Nothing — your app generates its own credentials" }
  ]}
  correct={1}
  explanation="OAuth never gives you the user's password. You get a one-time code, exchange it server-side for an access token, and use that to fetch profile data. Your app never sees or stores the actual Google credentials."
  revisit={{ to: "/docs/foundations/authentication#method-2-oauth--social-login", label: "OAuth / Social Login" }}
/>

</Quiz>

## What's next

→ Continue to [Authorization: Permissions & Tokens](./authorization) where we'll cover the *after-login* question: now that we know who you are, what can you do?
