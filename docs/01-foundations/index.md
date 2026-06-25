---
id: foundational-concepts
title: 1–2. Foundations — Overview
sidebar_position: 1
sidebar_label: Foundations at a glance
description: How the web actually works under the hood. Split into Web Fundamentals (Ch 1) and Production Engineering (Ch 2).
---

# Foundations — Web Fundamentals & Production Engineering

*How the web actually works under the hood — split into two sidebar chapters.*

The sidebar divides this material into **Chapter 1 (Web Fundamentals)** through payments/email, then **Chapter 2 (Production Engineering)** for concurrency, production patterns, and debugging. Same directory, two arcs.

**Parallel build track:** If you're following the [Roadmap](/docs/roadmap) stages, use this chapter as lookup — see [How to use this roadmap](/docs/roadmap/roadmap-how-to-use).

This material covers the bedrock concepts every web developer must understand. These ideas haven't fundamentally changed in twenty years and won't change in the next twenty. Frameworks come and go; HTTP and the DOM remain.

If you can explain everything in this chapter confidently, you have a stronger foundation than most working developers.

:::tip[Absolute-beginner orientation]
**If you've never built a website:** This is the longest chapter in the series, but it's the most important one. Every later chapter assumes you've read this.

**Mental model to hold throughout:** Two computers having a conversation. One asks ("client"), one answers ("server"). Every feature on the web — every video, every login button, every chat message — is built from variations of that conversation, repeated billions of times per day.

**Jargon you'll meet (and we'll define):** *client, server, HTTP, HTTPS, DNS, IP address, TLS, CDN, browser, DOM, rendering, API, REST, JSON, database, SQL, NoSQL, authentication, authorization, cookies, JWT, deployment, CI/CD.* Don't try to memorize them — read once, refer back as needed.

**One-sentence summary you'll be able to give by the end:** *"When I type a URL, my browser asks DNS where the server is, opens an encrypted connection to it, sends an HTTP request, and renders the HTML/CSS/JavaScript that comes back — possibly making more requests for data along the way."*

**If you only remember one thing:** The web is built on HTTP requests and responses. Everything else is decoration on top of that.
:::

## How this chapter is organized

Each page focuses on **one topic** with worked examples and beginner callouts. Read them in order the first time; revisit any single page later when you need a refresher.

### The big picture (start here)

1. [The Client–Server Model](/docs/foundations/client-server) — Two computers having a conversation.
2. [HTTP & HTTPS Basics](/docs/foundations/http-basics) — The language clients and servers speak.
3. [HTTP Methods & Status Codes](/docs/foundations/http-methods-and-status) — Verbs (GET, POST...) and numeric replies (200, 404, 500).
4. [HTTP Headers & Cookies](/docs/foundations/http-headers-cookies) — How requests carry metadata and how sites remember you.

### Getting bytes to the user

5. [DNS: The Internet's Phone Book](/docs/foundations/dns) — Turning names like `google.com` into IP addresses.
6. [CDNs and the Edge](/docs/foundations/cdn-and-edge) — Why your site is fast for someone in Tokyo even though your server is in Virginia.

### Inside the browser

7. [The Browser as a Runtime](/docs/foundations/browser-runtime) — A surprising amount happens between "page loads" and "page shows."
8. [The Rendering Pipeline](/docs/foundations/rendering-pipeline) — DOM, CSSOM, layout, paint, composite. Where performance lives.

### Rendering strategies

9. [Rendering Strategies Overview](/docs/foundations/rendering-strategies) — Who builds the HTML, and when?
10. [SSG — Static Site Generation](/docs/foundations/ssg) — Pre-build everything, serve from a CDN.
11. [SSR — Server-Side Rendering](/docs/foundations/ssr) — Build HTML per request, on the server.
12. [CSR — Client-Side Rendering](/docs/foundations/csr) — Browser builds the page with JavaScript.
13. [ISR, Streaming & PPR](/docs/foundations/isr-streaming-ppr) — Hybrid strategies invented to mix the best of all three.
14. [SPA vs MPA vs Hybrid](/docs/foundations/spa-mpa-hybrid) — A related but different distinction.

### Talking to backends

15. [REST APIs](/docs/foundations/apis-rest) — The most common style.
16. [GraphQL & tRPC](/docs/foundations/apis-graphql-trpc) — Newer styles, when they help.
17. [Real-Time: gRPC, WebSockets, SSE](/docs/foundations/apis-realtime) — When request/response isn't enough.
18. [WebRTC](/docs/foundations/webrtc) — Peer-to-peer audio, video, and data channels.
19. [Message Queues](/docs/foundations/message-queues) — Async work between services.

### Storing data

20. [Relational (SQL) Databases](/docs/foundations/databases-sql) — The dominant default.
21. [NoSQL & Specialized Databases](/docs/foundations/databases-nosql) — Document, key-value, search, vector.
22. [Choosing a Database](/docs/foundations/databases-choosing) — A pragmatic 2026 decision guide.
23. [Search](/docs/foundations/search) — Full-text search beyond SQL `LIKE`.
24. [Files & Media](/docs/foundations/files-and-media) — Uploads, object storage, CDNs for assets.

### Who can do what

25. [Authentication: Proving Identity](/docs/foundations/authentication) — Passwords, OAuth, magic links, passkeys.
26. [Authorization: Permissions & Tokens](/docs/foundations/authorization) — Sessions, JWTs, RBAC, RLS.
27. [Web Security](/docs/foundations/web-security) — XSS, CSRF, CSP, SQLi, SSRF, supply chain.
28. [Security Headers & Checklist](/docs/foundations/security-headers) — HSTS, CSP rollout, SRI, and debugging CORS.

### Getting code to users

28. [The Deployment Pyramid](/docs/foundations/deployment-pyramid) — Source → CI → artifact → registry → deploy → runtime → CDN → user.
29. [Deployment Stages, Explained](/docs/foundations/deployment-stages) — Each stage in detail.
30. [Containers](/docs/foundations/containers) — Docker images, registries, orchestration basics.
31. [Edge Computing](/docs/foundations/edge-computing) — Running code close to users.

### Programming concepts

32. [Concurrency](/docs/foundations/concurrency) — Event loop, threads, async primitives.
33. [Distributed Systems (intro)](/docs/foundations/distributed-systems) — What changes past one machine.

### Production patterns

34. [Rate Limiting](/docs/foundations/rate-limiting) — Protecting APIs from abuse.
35. [Caching](/docs/foundations/caching) — Layers, invalidation, CDN vs in-memory.
36. [Secrets & Keys](/docs/foundations/secrets-and-keys) — Env vars, vaults, rotation.
37. [Observability Fundamentals](/docs/foundations/observability-fundamentals) — Logs, metrics, traces.
38. [Testing](/docs/foundations/testing) — Unit, integration, E2E at a conceptual level.
39. [Debugging](/docs/foundations/debugging) — Systematic troubleshooting in the browser and on the server.

### Quality, performance & a11y

40. [Performance](/docs/foundations/performance) — Core Web Vitals and perceived speed.
41. [Accessibility](/docs/foundations/accessibility) — WCAG, ARIA, keyboard, screen readers.

### Realtime collaboration

42. [CRDTs](/docs/foundations/crdts) — Conflict-free replicated data types.

### Localization & SEO

43. [Internationalization](/docs/foundations/i18n) — i18n, l10n, RTL, locale routing.
44. [SEO](/docs/foundations/seo) — Technical SEO developers actually own.

### Commerce & comms

45. [Payments](/docs/foundations/payments) — Stripe, subscriptions, webhooks, PCI scope.
46. [Email](/docs/foundations/email) — SPF/DKIM/DMARC and deliverability.

47. [Web Fundamentals Checkpoint](/docs/foundations/foundations-mid-checkpoint) — Pass to unlock the Roadmap (build track) or continue to Production Engineering.
48. [Production Engineering Checkpoint](/docs/foundations/foundations-checkpoint) — Completes the Foundations arc.

---

When you finish **Web Fundamentals**, you can continue to **Production Engineering** (sidebar Chapter 2) or jump to [Chapter 3: Roadmap](/docs/roadmap) after passing the mid-checkpoint.
