---
id: cdn-and-edge
title: CDNs and the Edge
sidebar_position: 7
sidebar_label: CDN & Edge
description: Why your website is fast for a user in Tokyo even though your server is in Virginia. CDNs cache copies near users; the edge runs code near users.
---

# CDNs and the Edge

> **In one line:** A CDN puts copies of your site near users so each request travels meters instead of thousands of miles. The "edge" is the same idea, but for *code*, not just files.

:::tip[In plain English]
Imagine you sell books online from a warehouse in New York. A customer in Tokyo orders a book — it takes 10 days to arrive. Now you open small distribution centers in 200 cities globally that each keep copies of your most popular books. Tokyo orders the same book — arrives next day. That's a **CDN** for the web.

Now imagine those distribution centers also have a few employees who can run errands locally — "check the customer's address," "verify their coupon," "stamp the package." That's **edge computing**.
:::

## Why CDNs exist

A few terms first: **origin server** = your one real backend; **POP** (Point of Presence) = a small CDN data center close to the user; **TTL** (Time To Live) = how long a cached copy is allowed to live before being refreshed.

Without a CDN, every request travels all the way to your origin server:

```mermaid
sequenceDiagram
    participant U as User in Tokyo
    participant S as Origin server in Virginia
    U->>S: HTTP request (170ms one-way)
    S-->>U: HTTP response (170ms return)
    Note over U,S: Total ~340ms network, plus server processing
```

With a CDN cached copy in Tokyo:

```mermaid
sequenceDiagram
    participant U as User in Tokyo
    participant P as CDN POP in Tokyo
    U->>P: HTTP request (5ms one-way)
    P-->>U: Cached response (5ms return)
    Note over U,P: Total ~10ms — cached copy served instantly
```

That difference — 340ms vs 10ms — is the gap between "this feels broken" and "this feels native."

:::info[Highlight: a CDN is also a force shield]
Beyond speed, CDNs protect your origin server from traffic spikes and attacks. When 100,000 users hit your homepage simultaneously, the CDN serves them all from cache; your origin server might only see *one* request to refresh the cache. Without a CDN, that traffic would crush a small backend in seconds.
:::

## The major CDNs in 2026

| CDN                  | Reputation                                                      |
|----------------------|-----------------------------------------------------------------|
| **Cloudflare**       | Largest, generous free tier, strong edge runtime (Workers)      |
| **AWS CloudFront**   | Integrated with the AWS ecosystem; standard enterprise pick     |
| **Fastly**           | Very developer-friendly, fast cache invalidation                |
| **Akamai**           | Oldest and largest by reach; common in legacy enterprise        |
| **Google Cloud CDN** | Integrated with GCP; less commonly chosen on its own            |

If you're starting fresh, **Cloudflare** is usually the right default — free tier covers most personal projects, integration with their edge runtime is best-in-class.

## What gets cached

CDNs cache **static assets** (images, videos, fonts, JS/CSS bundles) by default. They can *also* cache HTML responses for sites that don't personalize per user.

Modern CDNs cache aggressively and support **stale-while-revalidate** — serving the cached version instantly while fetching a fresh one in the background. The next user gets the fresh copy; the current user never waits.

:::note[Worked example: how a request flows through a CDN]
A user in Tokyo requests `https://example.com/logo.png`:

1. Their request hits the Cloudflare POP in Tokyo.
2. Cloudflare checks: "is `/logo.png` in the cache?"
   - **Hit:** Returns the cached image instantly. ~5ms total.
   - **Miss:** Forwards the request to your origin in Virginia, gets the image, stores it locally, and returns it. ~350ms this time. Every Tokyo user after that gets ~5ms.
3. Cloudflare respects the `Cache-Control` header your origin sent. `max-age=86400` → cache for a day.

Read that loop a few times — every CDN works this way. Once it clicks, CDN debugging becomes obvious: "Is it cached? Is the TTL right? Did the origin send the right cache headers?"
:::

## The edge — running code, not just serving files

**Edge computing** extends CDNs from caching to *executing code*. Cloudflare Workers, Vercel Edge Functions, AWS Lambda@Edge, and Deno Deploy let you run JavaScript (or WebAssembly) at edge locations.

Why this matters:

- **Authentication** can run at the edge — reject unauthorized requests before they touch your main servers.
- **Personalization** can happen at the edge — modify HTML based on the user's country, device, or cookies.
- **API responses** can come from the edge — never hitting a centralized server.

The trade-off: edge runtimes are usually constrained (smaller CPU/memory limits, no filesystem, limited Node APIs). They're great for small handlers, not full applications.

:::info[Highlight: the biggest 2026 architectural pattern]
**Edge-first apps** — most logic runs at the edge, with a regional database (or globally distributed database like Cloudflare D1, Turso, or Spanner) for state. This pattern dominates new green-field apps in 2026, replacing the older "single region, scale vertically" default.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Assuming the CDN caches everything by default.** Most CDNs cache static asset extensions (`.js`, `.css`, images) automatically but pass HTML straight through to your origin. If you want HTML cached, you have to send the right `Cache-Control` header (`public, max-age=...`) — silence means "do not cache."
- **Setting `Cache-Control: no-cache` thinking it disables caching.** It doesn't — it means "cache it, but revalidate every time." If you actually want no caching, you need `no-store`. The difference catches everyone once.
- **Caching personalized HTML.** A `Cache-Control: public` on a page that includes the user's name will serve User A's name to User B from the CDN. If a response varies per user, mark it `private` or skip caching entirely. Anything with `Set-Cookie` should generally not be CDN-cached either.
- **Treating edge runtimes as full Node.** Workers, Edge Functions, and Lambda@Edge run a *constrained* JavaScript runtime — no filesystem, no native Node modules, tight CPU limits, no long-lived TCP connections. Code that runs fine in a regular Node server will fail at the edge in ways that are hard to spot until deploy.
- **Forgetting cache invalidation when shipping a fix.** You deploy the fix, but users keep hitting the stale CDN copy until its TTL expires. Either tie deploys to a cache purge, or version your URLs (`/app.v123.js`) so the new deploy fetches a new file path.
:::

## Page checkpoint

<Quiz id="cdn-edge-page" title="Did CDNs & the edge stick?" sampleSize={2}>

<Question
  prompt="What problem does a CDN primarily solve?"
  options={[
    { text: "Encrypting traffic so attackers can't read it" },
    { text: "Translating domain names into IP addresses" },
    { text: "Putting copies of content physically close to users so requests don't have to cross the globe" },
    { text: "Replacing the need for a backend server entirely" }
  ]}
  correct={2}
  explanation="A CDN caches copies of your assets at edge locations (POPs) near users, so a request from Tokyo doesn't travel to Virginia and back. Encryption is TLS; name lookup is DNS; CDNs sit in front of an origin, not instead of one."
  revisit={{ to: "/docs/foundations/cdn-and-edge#why-cdns-exist", label: "Why CDNs exist" }}
/>

<Question
  prompt="A user in Tokyo requests /logo.png and gets a cache miss at the local CDN POP. What happens next?"
  options={[
    { text: "The user sees a 404 because the CDN doesn't have the file" },
    { text: "The CDN forwards the request to the origin server, stores the response locally, and returns it — future Tokyo users get cache hits" },
    { text: "The CDN refuses the request and redirects the user to the origin" },
    { text: "The browser falls back to fetching directly from the origin" }
  ]}
  correct={1}
  explanation="A cache miss means the CDN doesn't have the file yet — so it asks the origin once, stores the result, and serves all subsequent Tokyo users from cache. This is why the second request is fast even when the first wasn't."
  revisit={{ to: "/docs/foundations/cdn-and-edge#what-gets-cached", label: "How a request flows through a CDN" }}
/>

<Question
  prompt="In the context of CDNs and edge computing, what does 'the edge' add beyond what a normal CDN does?"
  options={[
    { text: "Faster physical hardware in central data centers" },
    { text: "The ability to run code (JavaScript or Wasm) at the POPs, not just serve cached files" },
    { text: "A second layer of DNS lookups" },
    { text: "Encryption keys stored on the user's device" }
  ]}
  correct={1}
  explanation="A traditional CDN serves cached files. Edge computing — Cloudflare Workers, Vercel Edge Functions, etc. — lets you execute code at the POPs themselves, perfect for auth checks, personalization, and lightweight API responses."
  revisit={{ to: "/docs/foundations/cdn-and-edge#the-edge--running-code-not-just-serving-files", label: "The edge — running code" }}
/>

<Question
  prompt="Beyond raw speed, what other major benefit does a CDN give a small website?"
  options={[
    { text: "It encrypts the database at rest" },
    { text: "It absorbs traffic spikes and shields the origin from being overwhelmed" },
    { text: "It generates HTML for dynamic pages automatically" },
    { text: "It replaces the need for HTTPS certificates" }
  ]}
  correct={1}
  explanation="A CDN acts as a force shield: 100,000 simultaneous users hit the CDN, but the origin might only see one refresh request. Without it, the same spike could crush a small backend in seconds."
  revisit={{ to: "/docs/foundations/cdn-and-edge#why-cdns-exist", label: "CDN as a force shield" }}
/>

</Quiz>

## What's next

→ Continue to [The Browser as a Runtime](./browser-runtime) where we'll look inside the most-used application platform on Earth — the browser on your laptop or phone.
