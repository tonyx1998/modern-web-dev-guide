---
id: foundational-concepts
title: 1. Foundational Concepts — Overview
sidebar_position: 1
sidebar_label: Foundations at a glance
description: How the web actually works under the hood. Read this chapter first.
---

# Part 1: Foundational Concepts

*How the web actually works under the hood.*

This chapter covers the bedrock concepts every web developer must understand. These ideas haven't fundamentally changed in twenty years and won't change in the next twenty. Frameworks come and go; HTTP and the DOM remain.

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

### Storing data

18. [Relational (SQL) Databases](/docs/foundations/databases-sql) — The dominant default.
19. [NoSQL & Specialized Databases](/docs/foundations/databases-nosql) — Document, key-value, search, vector.
20. [Choosing a Database](/docs/foundations/databases-choosing) — A pragmatic 2026 decision guide.

### Who can do what

21. [Authentication: Proving Identity](/docs/foundations/authentication) — Passwords, OAuth, magic links, passkeys.
22. [Authorization: Permissions & Tokens](/docs/foundations/authorization) — Sessions, JWTs, RBAC, RLS.

### Getting code to users

23. [The Deployment Pyramid](/docs/foundations/deployment-pyramid) — Source → CI → artifact → registry → deploy → runtime → CDN → user.
24. [Deployment Stages, Explained](/docs/foundations/deployment-stages) — Each stage in detail.

---

When you finish all 24 pages, move on to [Chapter 3: The Development Lifecycle](/docs/lifecycle).
