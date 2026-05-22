---
id: auth
title: 'Phase 5: Adding Auth'
sidebar_position: 8
sidebar_label: 7. Auth
description: With Clerk, adding auth to a personal project takes about twenty minutes. Passkeys, social login, MFA, and password reset come for free.
---

# Phase 5: Adding Auth

> **In one line:** Don't build auth. Use Clerk (or Better Auth) and spend the saved month on the actual product.

:::tip[In plain English]
Authentication looks easy. "It's just an email and a password, right?" Then come password resets, email verification, social logins, multi-factor, session management, account recovery, breach notifications, passkeys, OAuth flows, and the half-dozen subtle attacks each defends against. Services like Clerk have spent millions of dollars getting this right. Use them.
:::

## Twenty minutes to working auth

With Clerk, auth takes 20 minutes. Two terms before the code: **middleware** (a function Next.js runs on every incoming request before your page handler) and **passkeys** (a phishing-resistant alternative to passwords that uses public-key cryptography built into the browser and OS).

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/library(.*)', '/settings(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
```

> **In English:** This runs on every page request. `createRouteMatcher` builds a matcher for paths under `/library` and `/settings`. If the incoming request is for one of those, `auth.protect()` redirects unauthenticated users to the sign-in page; otherwise the request passes through unchanged. The `config.matcher` regex excludes static asset URLs so middleware doesn't fire on every PNG and CSS file.

```typescript
// src/app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav className="border-b p-4 flex justify-between items-center">
            <a href="/" className="font-bold">ShelfTrack</a>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

> **In English:** `<ClerkProvider>` wraps the whole app so any child component can ask "is the user signed in, and who are they?" `<SignedIn>` and `<SignedOut>` are conditional render helpers that show their children only in the matching auth state. `<UserButton>` is a pre-built avatar dropdown with "Manage Account / Sign out"; `<SignInButton>` opens the hosted sign-in modal. You wrote zero auth UI.

Done. Users can sign up, sign in, manage their account, sign out. Clerk handles passkeys, social login, multi-factor, password reset — all of it.

:::note[Try it yourself]
After you wire up the middleware and `<ClerkProvider>`:

1. Visit a protected route while signed out → you get redirected to a sign-in page Clerk renders for you.
2. Sign up with a brand-new email → check your inbox; the verification email is already styled.
3. Hit the `<UserButton />` dropdown → "Manage Account" gives users a full settings panel (avatar, password, MFA, connected accounts) you didn't build.
4. Turn on Google login in the Clerk dashboard → "Sign in with Google" appears on the sign-in page with zero code change.

Each of those would be a one-to-three-day task to build yourself. You just got them all for $0 on the free tier.
:::

:::info[Highlight: what you're actually paying for]
Clerk's free tier covers up to 10,000 monthly active users. The cost isn't "renting a login form" — it's renting:

- Up-to-date OAuth integrations with Google, GitHub, Apple, Microsoft, et al.
- Passkey support that actually works on iOS/Android/Chrome.
- Account-takeover protection and breached-password checks.
- A hosted, accessible sign-in UI you don't have to design or maintain.
- Compliance posture (SOC 2, GDPR data deletion) you'd otherwise need to build yourself.

At $0 for the first 10K users, you'd be irrational to roll your own.
:::

## Page checkpoint

<Quiz id="solo-auth-page" title="Did the auth choices stick?" sampleSize={2}>

<Question
  prompt="What is a passkey, per the page's plain-English definition?"
  options={[
    { text: "A long, randomly generated password" },
    { text: "A phishing-resistant credential using public-key cryptography built into the browser and OS" },
    { text: "A one-time code sent over SMS" },
    { text: "An OAuth scope granted by Google" }
  ]}
  correct={1}
  explanation="Passkeys use public-key cryptography stored in the device's secure enclave. They're phishing-resistant because the credential is bound to the origin — there's no shared secret to steal."
  revisit={{ to: "/docs/solo/auth#twenty-minutes-to-working-auth", label: "Passkeys defined" }}
/>

<Question
  prompt="What does middleware.ts actually do in this Clerk setup?"
  options={[
    { text: "Runs once at build time to generate static auth pages" },
    { text: "Runs on every incoming request before your page handler" },
    { text: "Runs only on API routes, not pages" },
    { text: "Runs as a client-side guard in the browser" }
  ]}
  correct={1}
  explanation="Middleware runs server-side on every matching request before the page handler. Here it checks whether the route is protected and calls auth.protect() to redirect unauthenticated users."
  revisit={{ to: "/docs/solo/auth#twenty-minutes-to-working-auth", label: "Middleware explained" }}
/>

<Question
  prompt="Up to how many monthly active users does Clerk's free tier cover?"
  options={[
    { text: "100" },
    { text: "1,000" },
    { text: "10,000" },
    { text: "Unlimited forever" }
  ]}
  correct={2}
  explanation="Clerk's free tier covers up to 10,000 monthly active users. For a solo project that's effectively free until you have meaningful traction — and at that point you can afford to pay."
  revisit={{ to: "/docs/solo/auth#twenty-minutes-to-working-auth", label: "What you're paying for" }}
/>

<Question
  prompt="What is the main argument against building your own auth from scratch?"
  options={[
    { text: "It's impossible without a security degree" },
    { text: "Email-and-password is the easy part; resets, MFA, passkeys, OAuth, and attack defenses are the hard part" },
    { text: "Node.js doesn't have crypto libraries" },
    { text: "It violates GDPR by default" }
  ]}
  correct={1}
  explanation="The page lists everything that comes after the login form: password reset, email verification, social logins, MFA, sessions, account recovery, breach notifications, passkeys, OAuth flows. Each defends against subtle attacks. Hosted auth services have spent millions getting these right."
  revisit={{ to: "/docs/solo/auth#phase-5-adding-auth", label: "Why use hosted auth" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 6: Payments](./payments) where Stripe Checkout + a webhook handle the entire money flow.
