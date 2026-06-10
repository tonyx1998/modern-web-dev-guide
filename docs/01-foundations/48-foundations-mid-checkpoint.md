---
id: foundations-mid-checkpoint
title: Chapter 1 Checkpoint — Web Fundamentals
sidebar_position: 48
sidebar_label: ✅ Web fundamentals checkpoint
description: Checkpoint after the web-fundamentals arc — networking, rendering, APIs, data, auth, deployment, and commerce. Pass to unlock the Roadmap chapter.
---

# Chapter 1 Checkpoint — Web Fundamentals

You've covered how the web works end-to-end: requests, rendering, APIs, data, auth, deployment, and the product-facing layers (performance, payments, email). This checkpoint locks in those ideas before you move to production engineering patterns or the build track.

**10 questions in the bank — each visit picks 5 at random.** Pass (≥ 67%) to unlock Chapter 3 (Roadmap). Production engineering (Chapter 2) continues in sidebar order for the concept track.

<Quiz id="foundations-mid-checkpoint" title="Web fundamentals checkpoint" sampleSize={5}>

<Question
  prompt="A user types example.com into their browser. What must happen before the server can be contacted?"
  options={[
    { text: "The browser downloads the HTML" },
    { text: "DNS resolves the domain to an IP address" },
    { text: "TLS encrypts the cookie jar" },
    { text: "The CDN invalidates its cache" }
  ]}
  correct={1}
  explanation="DNS turns the human-readable domain into a routable IP address. Without that lookup, the browser has nowhere to send the TCP connection."
  revisit={{ to: "/docs/foundations/dns#what-dns-does", label: "DNS — what it does" }}
/>

<Question
  prompt="Which HTTP method is safe (no server-side state change) AND idempotent?"
  options={[
    { text: "POST" },
    { text: "PATCH" },
    { text: "GET" },
    { text: "PUT" }
  ]}
  correct={2}
  explanation="GET retrieves without modifying server state (safe) and repeated calls have the same effect (idempotent). POST creates; PATCH/PUT mutate."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-methods-verbs", label: "HTTP methods" }}
/>

<Question
  prompt="A marketing landing page is identical for every visitor and changes only on deploy. Best default rendering strategy?"
  options={[
    { text: "SSR — render per request" },
    { text: "SSG — pre-build HTML at deploy time" },
    { text: "CSR — build entirely in the browser" },
    { text: "WebSockets" }
  ]}
  correct={1}
  explanation="Identical content for all users is the sweet spot for SSG: HTML is generated once at build, served fast from CDN. SSR is for per-user/per-request data."
  revisit={{ to: "/docs/foundations/ssg", label: "SSG" }}
/>

<Question
  prompt="What does the HttpOnly cookie flag do?"
  options={[
    { text: "Sends the cookie only over HTTPS" },
    { text: "Prevents JavaScript from reading the cookie" },
    { text: "Blocks cross-site requests entirely" },
    { text: "Expires the cookie when the tab closes" }
  ]}
  correct={1}
  explanation="HttpOnly keeps session tokens out of JavaScript reach — the main defense against XSS stealing auth cookies. Secure = HTTPS-only; SameSite = cross-site policy."
  revisit={{ to: "/docs/foundations/http-headers-cookies#important-cookie-attributes", label: "Cookie attributes" }}
/>

<Question
  prompt="Authentication vs authorization — which pairing is correct?"
  options={[
    { text: "Same thing — both mean logging in" },
    { text: "Authentication = who you are; authorization = what you may do" },
    { text: "Authentication is for humans; authorization is for APIs only" },
    { text: "Authorization happens before authentication" }
  ]}
  correct={1}
  explanation="AuthN proves identity; AuthZ checks permissions. You authenticate first ('this is Tony'), then authorize ('Tony may edit this doc')."
  revisit={{ to: "/docs/foundations/authentication", label: "Authentication" }}
/>

<Question
  prompt="Why is 'Just use Postgres' the default 2026 database advice for new projects?"
  options={[
    { text: "Postgres is the only ACID database" },
    { text: "It handles relational data plus JSON, full-text, vectors, and extensions — one engine for most workloads" },
    { text: "NoSQL is deprecated" },
    { text: "ORMs only work with Postgres" }
  ]}
  correct={1}
  explanation="Postgres covers the majority of app data needs (relational + JSONB + search + pgvector + time-series via extensions) so you operate one system until scale forces specialization."
  revisit={{ to: "/docs/foundations/databases-sql#the-2026-choices", label: "Just use Postgres" }}
/>

<Question
  prompt="In the deployment pipeline, what is an 'artifact'?"
  options={[
    { text: "A bug report from production" },
    { text: "The immutable build output (Docker image, bundle) promoted through stages" },
    { text: "A CDN edge node" },
    { text: "The git commit message" }
  ]}
  correct={1}
  explanation="CI produces a versioned artifact; staging/prod deploy the same bytes. That immutability is what makes rollbacks and reproducibility possible."
  revisit={{ to: "/docs/foundations/deployment-stages", label: "Deployment stages" }}
/>

<Question
  prompt="Stripe webhooks arrive at your server. What's the first security check?"
  options={[
    { text: "Trust the JSON body — Stripe wouldn't lie" },
    { text: "Verify the webhook signature with your endpoint secret before processing" },
    { text: "Require the user to re-enter their card" },
    { text: "Store the raw body in localStorage" }
  ]}
  correct={1}
  explanation="Anyone can POST to your webhook URL. Stripe signs payloads; you verify with the endpoint secret before trusting payment events."
  revisit={{ to: "/docs/foundations/payments", label: "Payments & webhooks" }}
/>

<Question
  prompt="SPF, DKIM, and DMARC together protect against what?"
  options={[
    { text: "SQL injection in email templates" },
    { text: "Email spoofing and phishing — proving your domain is authorized to send mail" },
    { text: "XSS in the inbox UI" },
    { text: "Rate limiting on SMTP ports" }
  ]}
  correct={1}
  explanation="SPF/DKIM/DMARC are DNS-published policies that tell receivers which servers may send as your domain and what to do with failures — critical for deliverability and anti-phishing."
  revisit={{ to: "/docs/foundations/email", label: "Email deliverability" }}
/>

<Question
  prompt="A REST API returns 201 Created. What does that status mean?"
  options={[
    { text: "The resource was found successfully" },
    { text: "A new resource was created as a result of the request" },
    { text: "The client must authenticate" },
    { text: "The server is overloaded" }
  ]}
  correct={1}
  explanation="201 = created (typical POST success). 200 = OK for reads/updates; 401 = auth required; 503 = overload/unavailable."
  revisit={{ to: "/docs/foundations/http-methods-and-status#status-codes", label: "Status codes" }}
/>

</Quiz>

→ Next: [Concurrency & the event loop](./concurrency) (Chapter 2 — Production engineering) · Or jump to the [Roadmap](/docs/roadmap) build track (unlocked after you pass).
