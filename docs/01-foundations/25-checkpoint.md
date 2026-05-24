---
id: foundations-checkpoint
title: Chapter 1 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 1 — Foundations. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 3.
---

# Chapter 1 Checkpoint

You've finished the Foundations chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button at the bottom.

<Quiz id="foundations-checkpoint" title="Foundations checkpoint" sampleSize={5}>

<Question
  prompt="A user types example.com into their browser. Roughly speaking, what happens FIRST, before the server can be contacted at all?"
  options={[
    { text: "The browser downloads the HTML for example.com" },
    { text: "DNS resolves example.com to an IP address" },
    { text: "TLS encrypts the request body" },
    { text: "The server reads the Cookie header" }
  ]}
  correct={1}
  explanation="Before anything else, the browser must turn the human-readable domain into a numeric IP address. That's DNS — without it, there's nowhere to send the request."
  revisit={{ to: "/docs/foundations/dns#what-dns-does", label: "DNS — what it does" }}
/>

<Question
  prompt="Which HTTP method is BOTH safe (no server-side state change) AND idempotent (same result if you call it repeatedly)?"
  options={[
    { text: "POST" },
    { text: "PATCH" },
    { text: "GET" },
    { text: "DELETE" }
  ]}
  correct={2}
  explanation="GET only retrieves data. It doesn't modify anything (safe) and calling it twice gives the same result (idempotent). DELETE is idempotent but not safe; POST is neither."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-methods-verbs", label: "HTTP Methods — verbs" }}
/>

<Question
  prompt="What does the HttpOnly flag on a cookie do?"
  options={[
    { text: "Sends the cookie only over HTTPS" },
    { text: "Prevents JavaScript on the page from reading the cookie" },
    { text: "Blocks the cookie on cross-site requests" },
    { text: "Makes the cookie expire when the browser closes" }
  ]}
  correct={1}
  explanation="HttpOnly hides the cookie from JavaScript, which is the main defense against XSS attacks stealing your auth token. (HTTPS-only is the Secure flag; cross-site is SameSite.)"
  revisit={{ to: "/docs/foundations/http-headers-cookies#important-cookie-attributes", label: "Cookie attributes (HttpOnly, Secure, SameSite)" }}
/>

<Question
  prompt="Your app shows different content to every visitor (a personalized dashboard). Which rendering strategy is the natural default?"
  options={[
    { text: "SSG — Static Site Generation, pre-built at deploy time" },
    { text: "SSR — Server-Side Rendering, built per request" },
    { text: "CSR — Client-Side Rendering, built in the browser" },
    { text: "All three behave identically for this case" }
  ]}
  correct={1}
  explanation="SSG can't pre-build a per-user page (there'd be one HTML file per user). SSR renders fresh on every request with the right user's data — the natural fit. CSR works too but loses the first-paint-with-content win."
  revisit={{ to: "/docs/foundations/rendering-strategies#the-three-pure-strategies-and-the-hybrids-on-top", label: "Rendering Strategies — SSG / SSR / CSR" }}
/>

<Question
  prompt="What is the difference between authentication and authorization?"
  options={[
    { text: "They mean the same thing — different words for logging in" },
    { text: "Authentication is logging in via password; authorization is logging in via SSO" },
    { text: "Authentication proves WHO you are; authorization decides WHAT you can do" },
    { text: "Authentication is for users; authorization is for APIs" }
  ]}
  correct={2}
  explanation="Authentication = identity (proving 'this is Tony'). Authorization = permissions (Tony can read this file but not delete it). Two distinct steps, often done by different systems."
  revisit={{ to: "/docs/foundations/authentication#a-quick-reminder-authn-vs-authz", label: "Authentication vs Authorization" }}
/>

<Question
  prompt="What's the role of a CDN (Content Delivery Network)?"
  options={[
    { text: "It hosts your database" },
    { text: "It caches static assets at edge servers near users for fast delivery" },
    { text: "It signs SSL certificates" },
    { text: "It manages DNS records" }
  ]}
  correct={1}
  explanation="A CDN replicates your static files to dozens or hundreds of edge servers worldwide. A user in Tokyo hits the Tokyo edge instead of your origin in Virginia — much faster."
  revisit={{ to: "/docs/foundations/cdn-and-edge#why-cdns-exist", label: "Why CDNs exist" }}
/>

<Question
  prompt="A response returns 301 Moved Permanently. What should the browser do?"
  options={[
    { text: "Show an error to the user" },
    { text: "Retry the same URL after a delay" },
    { text: "Follow the new URL given in the Location header, and remember the new URL for future requests" },
    { text: "Reload from cache" }
  ]}
  correct={2}
  explanation="3xx codes are redirects. 301 specifically means 'permanent' — the browser will follow Location now and remember the new URL so future requests skip the redirect."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-status-codes", label: "HTTP status codes" }}
/>

<Question
  prompt="In a JWT (JSON Web Token), what does the signature actually prove?"
  options={[
    { text: "That the token's payload hasn't been altered since the server signed it" },
    { text: "That the user is currently logged in" },
    { text: "That the token was transmitted over HTTPS" },
    { text: "That the user's identity has been verified by a third party" }
  ]}
  correct={0}
  explanation="The signature proves integrity: the payload (user ID, expiration, etc.) was produced by something holding the secret. It says nothing about *when* the user logged in or whether they've since logged out."
  revisit={{ to: "/docs/foundations/http-headers-cookies#sessions-vs-jwts-the-two-flavors-of-tokens", label: "Sessions vs JWTs" }}
/>

<Question
  prompt="A client/server architecture means…"
  options={[
    { text: "Two web servers talk to each other" },
    { text: "One computer (the client) asks for something; another (the server) responds" },
    { text: "JavaScript runs on the server" },
    { text: "The browser sends database queries directly" }
  ]}
  correct={1}
  explanation="At its core: client asks, server responds. Browser is the most common client, but mobile apps, CLIs, and other servers can also be clients."
  revisit={{ to: "/docs/foundations/client-server#what-is-a-client", label: "Client/server — the core idea" }}
/>

<Question
  prompt="REST APIs typically use which combination?"
  options={[
    { text: "WebSockets and JSON" },
    { text: "HTTP verbs (GET/POST/PUT/DELETE) and JSON over HTTP" },
    { text: "TCP sockets and XML" },
    { text: "gRPC streams and Protobuf" }
  ]}
  correct={1}
  explanation="REST is HTTP-flavored: each resource has a URL, and you act on it with HTTP verbs. Responses are usually JSON. The other options are valid technologies but not REST."
  revisit={{ to: "/docs/foundations/apis-rest#why-rest-won", label: "REST — why it won" }}
/>

<Question
  prompt="Which is a strong fit for a RELATIONAL (SQL) database?"
  options={[
    { text: "Storing arbitrary JSON blobs of varying shape" },
    { text: "An ecommerce app with users, orders, products, and consistent joins" },
    { text: "Real-time leaderboards with millions of writes per second" },
    { text: "Storing large binary files like videos" }
  ]}
  correct={1}
  explanation="SQL shines when you have well-structured, relational data and need ACID-strength consistency. Joins, transactions, and the schema are the value."
  revisit={{ to: "/docs/foundations/databases-sql#acid-guarantees--why-relational-databases-earn-trust", label: "Why SQL — ACID & joins" }}
/>

<Question
  prompt="What is hydration in a modern React framework?"
  options={[
    { text: "Compressing HTML before sending it" },
    { text: "The process of attaching client-side JavaScript event handlers to already-rendered server HTML" },
    { text: "Loading CSS asynchronously" },
    { text: "Pre-fetching the next page" }
  ]}
  correct={1}
  explanation="The server sends raw HTML so the page is visible immediately. Then JS 'hydrates' it — attaches event listeners and React state — so it becomes interactive. Until hydration finishes, clicks may do nothing."
  revisit={{ to: "/docs/foundations/rendering-strategies#rendering-vs-hydration--the-distinction-beginners-miss", label: "Rendering vs hydration" }}
/>

<Question
  prompt="Your team needs a real-time chat feature with messages pushed from server to all connected clients. Which API style fits best?"
  options={[
    { text: "REST polling every second" },
    { text: "GraphQL queries" },
    { text: "WebSockets (or Server-Sent Events for one-way pushes)" },
    { text: "gRPC unary calls" }
  ]}
  correct={2}
  explanation="WebSockets give you a bidirectional persistent connection — perfect for chat. SSE is great when the server only needs to push (notifications, live tickers). REST polling wastes bandwidth and adds latency."
  revisit={{ to: "/docs/foundations/apis-realtime", label: "Realtime APIs — WebSockets & SSE" }}
/>

<Question
  prompt="ACID stands for Atomicity, Consistency, Isolation, Durability. Which sentence describes Isolation?"
  options={[
    { text: "A transaction either fully completes or has no effect at all" },
    { text: "The database is the only system that owns the data" },
    { text: "Concurrent transactions appear to run one after another, not stepping on each other" },
    { text: "Committed data survives crashes" }
  ]}
  correct={2}
  explanation="Isolation means concurrent transactions are kept apart so they don't see each other's half-finished work. (Atomicity = all-or-nothing; Durability = survives crashes.)"
  revisit={{ to: "/docs/foundations/databases-sql#acid-guarantees--why-relational-databases-earn-trust", label: "ACID guarantees" }}
/>

<Question
  prompt="Which is the BEST description of deployment in the modern era?"
  options={[
    { text: "Manually FTP-ing files to a server every time you change something" },
    { text: "An automated pipeline: source → build → artifact → push → host serves it from a CDN" },
    { text: "Sending a zip file to the IT team" },
    { text: "Replacing the entire database on every release" }
  ]}
  correct={1}
  explanation="In 2026, deployment is essentially automatic: pushing to main triggers a build, produces a deployable artifact, and the platform routes traffic to it. Static assets land on a CDN; dynamic code runs on serverless or containers."
  revisit={{ to: "/docs/foundations/deployment-pyramid", label: "The deployment pyramid" }}
/>

</Quiz>

---

## What's next

If you passed, you're ready to keep going.

→ Continue to [Chapter 3: The Lifecycle](/docs/lifecycle) to see how a real project moves from idea to production.

If you didn't pass, take the revisit links above seriously — those pages are short, and the rest of the guide builds directly on them. Click **Retake with new questions** for a fresh sample.
