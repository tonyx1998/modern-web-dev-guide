---
id: foundational-concepts
title: 1. Foundational Concepts
sidebar_position: 2
sidebar_label: 1. Foundations
description: How the web actually works — client/server, HTTP, DNS, CDNs, browsers, rendering, APIs, databases, auth, deployment.
---

# Part 1: Foundational Concepts

*How the web actually works under the hood.*

This file covers the bedrock concepts that every web developer must understand. These ideas haven't fundamentally changed in twenty years and won't change in the next twenty. Frameworks come and go; HTTP and the DOM remain.

If you can explain everything in this file confidently, you have a stronger foundation than most working developers. The frameworks discussed in later parts are all built on top of what's here.

:::tip Beginner orientation
**If you've never built a website:** This chapter is the longest in the series, but it's the most important one. Every later chapter assumes you've read this.

**Mental model to hold throughout:** Two computers having a conversation. One asks ("client"), one answers ("server"). Every feature on the web — every video, every login button, every chat message — is built from variations of that conversation, repeated billions of times per day.

**Jargon you'll meet (and we'll define):** *client, server, HTTP, HTTPS, DNS, IP address, TLS, CDN, browser, DOM, rendering, API, REST, JSON, database, SQL, NoSQL, authentication, authorization, cookies, JWT, deployment, CI/CD.* Don't try to memorize them — read once, refer back as needed.

**One-sentence summary you'll be able to give by the end:** "When I type a URL, my browser asks DNS where the server is, opens an encrypted connection to it, sends an HTTP request, and renders the HTML/CSS/JavaScript that comes back — possibly making more requests for data along the way."

**If you only remember one thing:** The web is built on HTTP requests and responses. Everything else is decoration on top of that.
:::

---

## 1.1 The Client–Server Model

### The Core Idea

Every interaction on the web is a conversation between two computers:

- A **client** sends a **request**.
- A **server** sends a **response**.

That's the entire model. Every feature you've ever used — Gmail, Netflix, TikTok, your bank's website — is built from this one primitive, repeated billions of times per day.

### What Is a Client?

A client is whatever sends a request. Most often it's a **web browser** (Chrome, Safari, Firefox, Edge), but it can also be:

- A mobile app making API calls to a backend
- A command-line tool like `curl` or `wget`
- A smart TV, refrigerator, or IoT device
- Another server (servers regularly call other servers)
- An AI agent (increasingly common in 2026)

A client doesn't need to be a "user" — it's just whatever initiates the conversation.

### What Is a Server?

A server is a long-running program on a computer somewhere on the internet that **listens** for incoming requests and decides how to respond. It's "the server" both as software (the program) and as hardware (the machine it runs on).

A single physical machine can run many server programs. A single server program can handle thousands of simultaneous clients. Modern cloud infrastructure abstracts this further — "your server" might actually be a virtual machine inside a container inside a Kubernetes pod inside a data center.

### The Conversation in Detail

When you type `example.com` into a browser, an elaborate dance unfolds in milliseconds:

```
Client (browser)                    Internet                    Server
      |                                |                            |
      |--- DNS query: where's          |                            |
      |    example.com? -------------->|                            |
      |<-------- DNS response:         |                            |
      |          93.184.216.34 --------|                            |
      |                                |                            |
      |--- TCP SYN ---------------------------------->              |
      |<-- TCP SYN-ACK -------------------------------|             |
      |--- TCP ACK ----------------------------------->             |
      |    (TCP handshake complete)                                 |
      |                                                             |
      |--- TLS ClientHello --------------------------->             |
      |<-- TLS ServerHello + cert ---------------------|            |
      |--- TLS Finished ------------------------------->            |
      |    (encrypted channel established)                          |
      |                                                             |
      |--- HTTP GET / HTTP/1.1 ----------------------->             |
      |    Host: example.com                                        |
      |                                                             |
      |<-- HTTP/1.1 200 OK ----------------------------|            |
      |    Content-Type: text/html                                  |
      |    Content-Length: 1256                                     |
      |    <html>...                                                |
      |                                                             |
      |--- TCP FIN ----------------------------------->             |
      |<-- TCP FIN-ACK --------------------------------|            |
```

That's just the first request. Loading a modern webpage typically involves dozens or hundreds of additional requests for CSS, JavaScript, images, fonts, and API data.

### Why This Matters

Once you internalize the client-server model, everything else makes sense. A "REST API" is just a server that responds in a specific style. A "database connection" is just a client (your backend) talking to a server (the database). "Server-side rendering" means HTML is generated by the server before being sent; "client-side rendering" means the browser builds the HTML itself.

---

## 1.2 HTTP and HTTPS

### What HTTP Is

**HTTP (HyperText Transfer Protocol)** is the language clients and servers use to talk. It's a text-based protocol that defines exactly how a request and response are structured.

A raw HTTP request looks like this:

```http
GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGc...
User-Agent: Mozilla/5.0...
```

A raw HTTP response looks like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 87
Cache-Control: max-age=300

{
  "id": 42,
  "name": "Tony",
  "email": "tony@example.com"
}
```

Everything you've ever done online is built from messages like these.

### HTTPS — The Encrypted Version

**HTTPS** is HTTP wrapped in **TLS (Transport Layer Security)**, an encryption protocol. The data being transmitted is the same; it's just unreadable to anyone intercepting it.

In 2026, HTTPS is effectively mandatory:
- Browsers display warnings for plain HTTP sites
- Most modern web APIs and features (Service Workers, geolocation, camera/microphone) only work over HTTPS
- Search engines penalize plain HTTP in rankings
- TLS certificates are now free and automated via Let's Encrypt and modern hosting platforms

### HTTP Methods (Verbs)

A request's **method** indicates what action the client wants:

| Method  | Purpose                              | Has body? | Idempotent? |
|---------|--------------------------------------|-----------|-------------|
| GET     | Retrieve a resource                  | No        | Yes         |
| POST    | Create a resource or trigger action  | Yes       | No          |
| PUT     | Replace a resource entirely          | Yes       | Yes         |
| PATCH   | Modify part of a resource            | Yes       | No (usually)|
| DELETE  | Remove a resource                    | Optional  | Yes         |
| HEAD    | Like GET but only return headers     | No        | Yes         |
| OPTIONS | Discover what methods are allowed    | No        | Yes         |

**Idempotent** means doing it multiple times has the same effect as doing it once. GET, PUT, and DELETE are idempotent: requesting the same page 100 times or deleting the same record 100 times is safe. POST is not: 100 POSTs to a "create order" endpoint create 100 orders.

This matters for retries: clients (and CDNs, and browsers) will automatically retry idempotent requests on failure but won't retry POSTs without explicit handling.

### HTTP Status Codes

Status codes tell the client what happened, organized in ranges:

**1xx — Informational** (rare in normal use)
- `100 Continue`, `101 Switching Protocols`

**2xx — Success**
- `200 OK` — Standard success
- `201 Created` — A new resource was created (after POST)
- `204 No Content` — Success, but no body to return (after DELETE)
- `206 Partial Content` — Range request (used for video seeking, resumable downloads)

**3xx — Redirection**
- `301 Moved Permanently` — Resource is now at a different URL forever
- `302 Found` / `307 Temporary Redirect` — Resource is temporarily elsewhere
- `304 Not Modified` — Cache is still valid, no need to resend

**4xx — Client Errors** (you sent something wrong)
- `400 Bad Request` — Malformed request
- `401 Unauthorized` — You need to authenticate
- `403 Forbidden` — Authenticated but not permitted
- `404 Not Found` — Resource doesn't exist
- `409 Conflict` — Your request conflicts with current state (e.g., duplicate email)
- `422 Unprocessable Entity` — Request is well-formed but semantically wrong
- `429 Too Many Requests` — Rate limited

**5xx — Server Errors** (something is wrong on our end)
- `500 Internal Server Error` — Generic server failure
- `502 Bad Gateway` — A server upstream returned an invalid response
- `503 Service Unavailable` — Server overloaded or down for maintenance
- `504 Gateway Timeout` — Upstream server didn't respond in time

When debugging, the status code tells you immediately whose fault it is: 4xx means look at your client code; 5xx means look at the server.

### HTTP Headers

Headers are key-value pairs of metadata. There are hundreds of standard headers; the most important ones:

**Request headers:**
- `Host` — Which site at this IP you want (a single IP can serve many domains)
- `User-Agent` — What browser/client you are
- `Accept` — What content types you can handle (`application/json`, `text/html`)
- `Accept-Language` — Preferred languages
- `Authorization` — Auth credentials (typically `Bearer <token>`)
- `Cookie` — Stored cookies for this domain
- `Content-Type` — Type of the request body
- `Content-Length` — Size of the request body
- `Origin` / `Referer` — Where the request came from (used for CORS and analytics)

**Response headers:**
- `Content-Type` — Type of the response body
- `Content-Length` — Size of the response body
- `Set-Cookie` — Store these cookies
- `Cache-Control` — How to cache this response
- `ETag` — A version identifier for caching
- `Location` — Where to redirect to (with 3xx codes)
- `Access-Control-Allow-Origin` — CORS permissions
- `Content-Security-Policy` — Security restrictions for the page

### HTTP Versions

- **HTTP/1.1** (1997) — One request per TCP connection at a time. Still widely supported as a fallback.
- **HTTP/2** (2015) — Multiplexing: multiple requests share one connection. Binary protocol. Used by most modern sites.
- **HTTP/3** (2022) — Runs on QUIC (over UDP instead of TCP). Faster connection establishment, better on flaky networks. Increasingly common in 2026.

You rarely choose the version explicitly; your hosting platform and browser negotiate the best mutual version.

### Cookies and Sessions

A **cookie** is a small piece of data the server tells the browser to store and send back on subsequent requests to the same domain. Cookies are how the web has state despite HTTP being stateless.

Important cookie attributes:
- `HttpOnly` — JavaScript can't read it (prevents XSS theft)
- `Secure` — Only sent over HTTPS
- `SameSite=Strict|Lax|None` — When to send it across sites (prevents CSRF)
- `Max-Age` / `Expires` — When it expires
- `Domain` / `Path` — What URLs it applies to

A **session** is a server-side concept built on cookies: the cookie holds a session ID; the server keeps the actual data. Modern alternatives include **JWTs (JSON Web Tokens)**, which encode the data into the cookie itself (signed but not always encrypted).

---

## 1.3 DNS, CDNs, and the Edge

:::note Beginner analogy: DNS is a phone book, CDN is a chain of local warehouses
Computers don't actually find each other by name like `google.com` — they find each other by **IP address** (a number like `142.250.190.78`). DNS is the system that looks up the number when you give it the name.

A **CDN (Content Delivery Network)** is a network of servers spread around the world that holds copies of your website. If your origin server is in Virginia and a user in Tokyo visits your site, the CDN serves them from a Tokyo server instead — faster, cheaper, and the origin is protected from sudden traffic spikes. Think Amazon warehouses for the internet.

The **edge** just means "the CDN server closest to the user." Code that runs "at the edge" runs on those distributed CDN servers, not on a central server in one data center.
:::

### DNS — The Internet's Phone Book

**DNS (Domain Name System)** translates human-readable names (`google.com`) into IP addresses (`142.250.190.78`). Without DNS, you'd memorize numbers.

A DNS lookup typically goes:

1. Your browser checks its own cache.
2. Your OS checks its cache.
3. Your computer asks its configured **recursive resolver** (often your ISP's or a public one like `8.8.8.8` Google or `1.1.1.1` Cloudflare).
4. The resolver asks the **root nameservers** (13 of them, globally distributed) — they know who handles `.com`.
5. The resolver asks the **TLD nameservers** for `.com` — they know who handles `example.com`.
6. The resolver asks the **authoritative nameservers** for `example.com` — they return the actual IP.
7. The answer is cached at every layer for a duration specified by the **TTL (Time to Live)**.

This whole dance happens in milliseconds and is almost always cached.

### DNS Record Types

The records you'll actually configure:

- **A** — Maps a name to an IPv4 address (`example.com → 93.184.216.34`)
- **AAAA** — Same, but IPv6
- **CNAME** — Aliases one name to another (`www.example.com → example.com`)
- **MX** — Mail server for the domain
- **TXT** — Arbitrary text. Used for SPF/DKIM/DMARC email auth, domain verification, etc.
- **NS** — Which nameservers are authoritative
- **CAA** — Which certificate authorities can issue TLS certs for this domain

In 2026 you almost never edit DNS by hand — your hosting provider (Vercel, Cloudflare, etc.) gives you a UI or accepts your domain via a CNAME.

### CDNs — Content Delivery Networks

A **CDN** is a network of servers distributed globally that caches content close to users.

Without a CDN:
- User in Tokyo requests an image from a server in Virginia.
- Round trip: ~170ms minimum due to speed of light.

With a CDN:
- The image is cached in Tokyo (and 200+ other cities).
- Round trip: ~10ms.

Major CDNs in 2026: **Cloudflare**, **AWS CloudFront**, **Fastly**, **Akamai**, **Google Cloud CDN**. They differ in pricing, features, and which "POPs" (points of presence) they have where.

CDNs cache static assets (images, videos, fonts, JS/CSS bundles) by default. They can also cache HTML responses for sites that don't personalize per user. Modern CDNs cache aggressively and support **stale-while-revalidate** — serving the cached version instantly while fetching a fresh one in the background.

### The Edge

**Edge computing** extends CDNs from caching to *executing code*. Cloudflare Workers, Vercel Edge Functions, AWS Lambda@Edge, and Deno Deploy let you run JavaScript (or WebAssembly) at edge locations.

Why this matters:
- **Authentication** can run at the edge — reject unauthorized requests before they touch your main servers.
- **Personalization** can happen at the edge — modify HTML based on the user's country, device, or cookies.
- **API responses** can come from the edge — never hitting a centralized server.

The trade-off: edge runtimes are usually constrained (smaller CPU/memory limits, no filesystem, limited Node APIs). They're great for small handlers, not full applications.

The biggest 2026 architectural pattern is **edge-first apps** — most logic runs at the edge, with a regional database (or globally distributed database like Cloudflare D1, Turso, or Spanner) for state.

---

## 1.4 The Browser as a Runtime

A modern browser is not just a "viewer." It's a sophisticated runtime environment that's arguably the most widely-deployed application platform in history.

### What's Inside a Browser

A browser bundles together:

1. **A network stack** — DNS, TCP/UDP, TLS, HTTP/1.1/2/3
2. **An HTML parser** — turns HTML text into the DOM
3. **A CSS engine** — parses stylesheets, calculates which rules apply where
4. **A JavaScript engine** — V8 (Chrome/Edge), JavaScriptCore (Safari), SpiderMonkey (Firefox). These engines JIT-compile JavaScript to machine code at runtime.
5. **A layout engine** — calculates where every element goes on screen
6. **A rendering engine** — turns the layout into pixels (often using the GPU)
7. **Web APIs** — hundreds of them
8. **A storage layer** — cookies, localStorage, IndexedDB, Cache API
9. **A security sandbox** — isolates pages from each other and from your OS

### The Rendering Pipeline

When a browser receives HTML, it executes a multi-step pipeline:

```
HTML → Parse → DOM
                |
CSS → Parse → CSSOM
                |
                v
              Style (combine DOM + CSSOM → computed styles)
                |
                v
              Layout (calculate positions and sizes)
                |
                v
              Paint (turn into pixels in layers)
                |
                v
              Composite (combine layers into final image, often on GPU)
```

Understanding this pipeline is essential for performance:
- Changing `width` triggers **layout** (expensive — recalculates positions of many elements).
- Changing `color` only triggers **paint** (cheaper).
- Changing `transform` or `opacity` only triggers **composite** (very cheap — the GPU does it).

This is why CSS animations using `transform` are 60fps smooth and animations using `top`/`left` often stutter.

### The Main Thread

JavaScript runs on a single **main thread** in the browser. That same thread also handles:
- Parsing HTML and CSS
- Running event handlers
- Layout calculations
- Painting

If your JS blocks the thread for 200ms, nothing else can happen — the page becomes unresponsive.

**Web Workers** let you run JS on background threads, but workers can't access the DOM. They're useful for heavy computation (image processing, parsing large files).

### Key Web APIs (Beyond the Basics)

Modern browsers expose remarkable capabilities:

- **Fetch API** — Modern HTTP requests (replaces XMLHttpRequest)
- **WebSockets** — Persistent bidirectional connections
- **Server-Sent Events (SSE)** — Server-pushed updates (simpler than WebSockets for one-way data)
- **WebRTC** — Peer-to-peer video, audio, data (powers Zoom, Discord voice)
- **WebGL / WebGPU** — 3D graphics; WebGPU is the modern successor with compute shader support
- **Web Audio API** — Synthesize and process audio
- **Web Speech API** — Text-to-speech and speech recognition
- **Service Workers** — Programmable proxy that sits between your page and the network. Enables offline support, push notifications, background sync.
- **IndexedDB** — Browser-side database for large structured data
- **WebAssembly (Wasm)** — Run code compiled from Rust, C++, Go, etc. in the browser at near-native speed
- **Web Components** — Native custom HTML elements
- **File System Access API** — Read/write local files (with permission)
- **WebAuthn** — Passwordless auth using passkeys/biometrics
- **WebTransport** — Low-latency, multiplexed connections over HTTP/3
- **WebCodecs** — Low-level access to encode/decode video and audio
- **Web NFC, Web Bluetooth, Web Serial** — Hardware access

In 2026, the browser is genuinely a full application platform. The phrase "you can build it on the web" is true for the vast majority of applications.

### The Critical Rendering Path

Performance-wise, the most important concept is the **critical rendering path** — what the browser must do before it can show the user *anything*.

Things that block rendering:
- **Render-blocking CSS** — The browser must parse all CSS before first paint.
- **Render-blocking JavaScript** — `<script>` tags without `async` or `defer` block parsing.
- **Synchronous fonts** — The browser may wait for fonts before painting text (FOIT = Flash of Invisible Text).
- **Large HTML** — Larger documents take longer to parse.

Modern best practices:
- Inline critical CSS for above-the-fold content
- Use `<script defer>` or `<script type="module">` (which defers by default)
- Preload key resources with `<link rel="preload">`
- Use `font-display: swap` to show text immediately
- Lazy-load images below the fold

The framework you choose largely handles this for you, but understanding what's underneath matters when things go wrong.

---

## 1.5 Rendering Strategies (Critical to Understand)

How and *where* HTML gets generated drives the entire architecture of a web app. This is one of the most consequential decisions, often hidden inside framework choices.

:::note Beginner analogy: who builds the webpage, and when?
Every web page is just HTML. The question rendering strategies answer is: **who builds the HTML, and when?** There are three possible answers:

- **At build time** (SSG): You build all the HTML *before any user shows up* and stick the files on a CDN. Like printing a book in a factory and shipping copies. Fast and cheap. Bad for content that changes every minute.
- **At request time, on the server** (SSR): When a user asks for a page, your server builds the HTML *just for them* and sends it. Like a chef cooking your meal to order. Always fresh. Slower; needs a running server.
- **At request time, in the browser** (CSR): The server sends a near-empty page; the user's *browser* runs JavaScript to build the page. Like getting raw ingredients in the mail and cooking them yourself. Great for highly interactive apps; bad for SEO and slow on first load.

Modern frameworks (Next.js, Remix, Astro) mix these — some pages SSG, some SSR, some CSR — depending on what each page needs. Don't try to memorize the table below; read it once, then refer back when you actually need to decide.
:::

### SSG — Static Site Generation

HTML is generated at **build time**. Every URL becomes a pre-built `.html` file that lives on a CDN.

**Flow:**
1. Developer runs `npm run build`.
2. Build process queries any data sources, renders every page, writes static files.
3. Files are uploaded to a CDN.
4. Users request URLs; CDN serves cached HTML instantly.

**Pros:**
- Fastest possible response (it's already on the CDN edge).
- Cheapest hosting (no servers needed, just file storage).
- Most secure (no server-side code to exploit at request time).
- Easy to scale (CDNs scale infinitely).

**Cons:**
- Stale data unless rebuilt.
- Long build times for large sites (10,000 pages → 30+ minutes).
- Hard to personalize per user.

**Best for:** Blogs, marketing sites, documentation, portfolios, anything where content rarely changes.

**Tools:** Astro (purest SSG framework), Next.js (in static mode), Hugo (very fast, Go-based), Eleventy, Jekyll.

### SSR — Server-Side Rendering

HTML is generated on the server **for each request**.

**Flow:**
1. User requests `/products/42`.
2. Server runs your code, queries the database, builds HTML.
3. Server sends HTML to the user.
4. Browser displays it; JavaScript "hydrates" the page to add interactivity.

**Pros:**
- Always-fresh data.
- Good for SEO (search engines see real HTML).
- Can personalize per request (show the user's name, region, etc.).
- Works without JavaScript on the client.

**Cons:**
- Slower than SSG (server has to do work per request).
- Requires running servers (more expensive than static).
- Server load scales with traffic.

**Best for:** E-commerce, dashboards, social media, anything with personalized or frequently-changing content.

**Tools:** Next.js (most common), Nuxt (Vue), SvelteKit, Remix, Rails, Django.

### CSR — Client-Side Rendering (Single-Page Apps)

The server sends a near-empty HTML shell. The browser downloads JavaScript that then builds the entire UI.

**Flow:**
1. User requests `/products/42`.
2. Server sends `<html><div id="app"></div><script src="bundle.js"></script></html>`.
3. Browser downloads the JS bundle, executes it.
4. JS makes API calls, builds the DOM, attaches handlers.

**Pros:**
- Snappy navigation after initial load (no full page reloads).
- Server is just an API; no rendering work.
- Familiar mental model (it's basically a desktop app in the browser).

**Cons:**
- Slow initial load (large JS bundle, blank screen until JS runs).
- Bad SEO unless you add server rendering for crawlers.
- Bad for low-end devices or slow networks.
- White flash on first paint.

**Best for:** Internal tools, admin dashboards, applications behind logins where SEO doesn't matter.

**Tools:** Create React App (deprecated), Vite + React/Vue/Svelte, Angular (default).

In 2026, **pure CSR is considered a poor default for public-facing sites**. The industry has largely moved to SSR + hydration for public apps and CSR only for internal tools.

### ISR — Incremental Static Regeneration

A hybrid invented by Next.js: build pages statically, but regenerate them on a schedule or on-demand.

**Flow:**
1. Initial build generates the most popular pages.
2. Pages have a `revalidate: 60` setting → after 60 seconds, the next request triggers a background rebuild.
3. User always gets the static page instantly; the next user gets the fresh version.

**Pros:**
- Speed of SSG + freshness of SSR (sort of).
- Reduces build times (only build the homepage at first; build others on demand).

**Cons:**
- Eventual consistency (some users see stale data for up to `revalidate` seconds).
- Complexity (debugging is harder).
- Requires a hosting platform that supports it (Vercel, Netlify).

**Best for:** Large catalogs (products, articles) that change occasionally.

### Streaming SSR + React Server Components (the 2026 Default)

The current state-of-the-art, pioneered by React 18+ and the Next.js App Router.

**How it works:**
- The page is split into components, some of which run *only* on the server (RSCs).
- The server starts streaming HTML chunks as soon as each piece is ready.
- Client components hydrate progressively.
- Slow data fetches don't block the rest of the page — they stream in with `<Suspense>` boundaries.

**Pros:**
- Best of all worlds: SSR's SEO, SSG-like initial render speed, CSR-like interactivity.
- Less JavaScript shipped to the client (RSCs run only on the server).
- Built-in async data fetching (RSCs can `await` data directly).

**Cons:**
- Steep learning curve — when does code run on server vs client?
- Ecosystem still catching up (some libraries assume client-only).
- Requires careful thinking about boundaries.

**Best for:** Most new full-stack apps in 2026.

**Tools:** Next.js App Router (most mature), Remix, SvelteKit, Nuxt (with Nitro).

### PPR — Partial Prerendering

The newest evolution (Next.js 15+): a static "shell" of the page is prerendered, with dynamic "holes" that stream in.

```
┌────────────────────────────┐
│ Static header (prerendered)│
├────────────────────────────┤
│ Static nav (prerendered)   │
├────────────────────────────┤
│ <Suspense>                 │
│   Dynamic content streams  │
│   per request              │
│ </Suspense>                │
├────────────────────────────┤
│ Static footer              │
└────────────────────────────┘
```

The static parts come from the CDN in ~10ms; the dynamic parts stream in shortly after.

This is the leading edge in 2026 — many teams haven't adopted it yet, but it's where things are heading.

### How to Choose

A decision tree:

```
Is the content the same for every visitor?
├── Yes → Does it change rarely?
│         ├── Yes → SSG (Astro, Next.js static)
│         └── No  → ISR or revalidating SSR
└── No  → Does it need SEO / fast first paint?
          ├── Yes → SSR or RSC streaming (Next.js, Remix, SvelteKit)
          └── No  → CSR (admin tools, internal apps)
```

---

## 1.6 SPA vs MPA vs Hybrid

A related but distinct distinction.

### MPA — Multi-Page Application

Every navigation is a full page load. The browser requests `/about`, the server sends a new HTML page, the browser tosses the current page and renders the new one.

This is how the web worked from 1993 to ~2010 and how most content sites still work.

**Pros:** Simple mental model, every URL is a real page, browser back/forward works perfectly, SEO is automatic.

**Cons:** Each navigation feels heavier (white flash, asset re-downloads), shared state (like a music player) gets reset.

### SPA — Single-Page Application

The browser loads one HTML page at the start. All subsequent "navigations" are simulated: JavaScript updates the URL (using the History API) and swaps content in place.

**Pros:** Instant navigation after initial load, persistent state across "pages," app-like feel.

**Cons:** Slow first load, breaks browser features if implemented carelessly (back button, scroll position), bad SEO without extra work.

### Hybrid (The 2026 Default)

Modern frameworks (Next.js, Nuxt, SvelteKit, Remix) do *both*:
- **First request:** Server renders HTML (SSR).
- **Subsequent navigations:** Client-side router takes over, fetches only the data needed for the new page, swaps content.

You get fast first paint, good SEO, and snappy navigation — all without choosing.

---

## 1.7 APIs: How Frontends Talk to Backends

The frontend and backend are separate programs. They communicate via an **API** — a contract for what messages they exchange.

### REST — The Most Common Style

REST (Representational State Transfer) treats your data as **resources** addressed by URLs, manipulated via HTTP methods.

```
GET    /users           → list users
GET    /users/42        → get user 42
POST   /users           → create a new user
PATCH  /users/42        → update user 42
DELETE /users/42        → delete user 42

GET    /users/42/posts  → list posts by user 42
POST   /users/42/posts  → create a post for user 42
```

REST is:
- **Universal** — Any client in any language can call it.
- **Stateless** — Each request contains everything needed; no server-side session required.
- **Cacheable** — GET responses can be cached by browsers and CDNs.
- **Discoverable** — URLs themselves communicate structure.

The downsides: REST is **chatty** (you may need many requests to assemble a screen) and **over-fetching/under-fetching** is common (the API returns more or less than the UI needs).

### GraphQL — Client-Specified Queries

GraphQL has a single endpoint (`/graphql`) and a query language for asking exactly what you want:

```graphql
query {
  user(id: 42) {
    name
    email
    posts(limit: 5) {
      title
      createdAt
    }
  }
}
```

The server returns exactly that shape, nothing more.

**Pros:** No over-fetching, strong typing via the schema, one round trip per screen.
**Cons:** More complex server setup, harder to cache (every query is different), can hide expensive queries from operators.

GraphQL was hyped massively in 2017–2020. By 2026 it's settled into a stable niche: **larger organizations with many clients** consuming overlapping data benefit most.

### tRPC — TypeScript Without the API

If both your frontend and backend are TypeScript, **tRPC** eliminates the API layer entirely (or at least the friction).

You define server functions:

```typescript
// server
export const appRouter = router({
  user: {
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return db.user.findUnique({ where: { id: input.id } });
      }),
  },
});
```

On the client, you call them like local functions:

```typescript
// client
const user = await trpc.user.getById.query({ id: 42 });
// `user` is fully typed; if you change the server signature,
// the client gets a compile error
```

**Pros:** Zero boilerplate, end-to-end type safety, refactoring is safe.
**Cons:** Only works for TypeScript-to-TypeScript, not for public APIs.

Dominant in 2026 for full-stack TypeScript apps.

### gRPC — Internal Service Communication

A high-performance binary protocol developed by Google. Used almost exclusively for **service-to-service** communication inside large architectures (frontend doesn't usually speak gRPC directly).

**Pros:** Very fast, strongly-typed contracts (Protocol Buffers), built-in streaming.
**Cons:** Browser support requires a proxy (gRPC-Web), harder to debug than REST.

### WebSockets and SSE — Real-Time Updates

When the server needs to *push* data to the client (chat, notifications, live dashboards), HTTP request-response isn't enough.

**WebSockets** open a persistent bidirectional connection. Either side can send messages anytime.

**Server-Sent Events (SSE)** are simpler: a long-lived HTTP connection where the server streams text events to the client. One-way only.

In 2026:
- Use **SSE for one-way streaming** (LLM responses, notifications, dashboards). Simpler, works with HTTP/2 multiplexing, automatic reconnection.
- Use **WebSockets when you need bidirectional** (chat, collaborative editing, multiplayer games).
- For collaborative editing, look at **CRDTs** (Conflict-free Replicated Data Types) and libraries like Yjs and Liveblocks.

---

## 1.8 Databases: Where State Lives

A web app without persistent state is rare. Databases store that state.

### Relational (SQL)

Data lives in **tables** with **rows** and **columns**. Tables can reference each other via **foreign keys**. You query with **SQL**.

```sql
SELECT users.name, COUNT(posts.id) AS post_count
FROM users
LEFT JOIN posts ON posts.user_id = users.id
GROUP BY users.id
ORDER BY post_count DESC
LIMIT 10;
```

Relational databases provide **ACID guarantees**:
- **Atomicity** — Transactions complete fully or not at all.
- **Consistency** — Data always satisfies constraints.
- **Isolation** — Concurrent transactions don't interfere with each other.
- **Durability** — Committed data survives crashes.

**PostgreSQL** is the dominant 2026 choice. Open-source, feature-rich, has extensions for almost everything (JSON, full-text search, vectors, time-series, GIS). Hosted via Supabase, Neon, Railway, AWS RDS, Google Cloud SQL.

**MySQL** is still common in legacy and powers WordPress; PlanetScale popularized serverless MySQL.

**SQLite** is a single-file database that's surprisingly powerful. Cloudflare D1 and Turso make it production-viable at the edge.

### Document (NoSQL)

Data lives as **documents** (JSON-like objects). No fixed schema.

```json
{
  "_id": "abc123",
  "name": "Tony",
  "addresses": [
    { "street": "123 Main", "city": "LA" }
  ],
  "preferences": { "theme": "dark" }
}
```

**Pros:** Flexible schema (great for evolving data), nested structures (no joins needed for related data), horizontal scaling.

**Cons:** Weaker consistency by default, joins are hard, easy to model data poorly.

**MongoDB** is the classic example. **DynamoDB** (AWS) and **Firestore** (Google) are popular managed alternatives.

By 2026, the industry has largely concluded that **Postgres with a JSON column** beats most document database use cases. Real document database adoption is now niche.

### Key-Value Stores

Simplest possible model: a hash table.

```
SET user:42:session "eyJhbGc..."
GET user:42:session
EXPIRE user:42:session 3600
```

**Used for:** Caching, session storage, rate limiting, queues, leaderboards.

**Redis** is the dominant choice. **Valkey** is the open-source fork (after Redis's license change). **Upstash** provides serverless Redis. **Cloudflare KV** offers globally distributed key-value at the edge.

### Search Engines

Optimized for full-text search, faceting, and ranking.

- **Elasticsearch** — Powerful, complex to operate.
- **Typesense** — Modern, easier alternative.
- **Meilisearch** — Similar, with great DX.
- **Algolia** — Hosted, very fast, expensive at scale.
- **Postgres full-text search** — Often enough; one less service to operate.

### Vector Databases

Store **embeddings** — high-dimensional vectors that represent the meaning of text/images/audio. Used for semantic search and RAG (Retrieval-Augmented Generation) in AI apps.

- **pgvector** — Postgres extension; the most popular 2026 choice (one DB to rule them).
- **Pinecone** — Managed, easy to start with.
- **Qdrant** — Open-source, fast.
- **Weaviate** — Open-source, feature-rich.
- **Turbopuffer** — Newer, optimized for cost.

### When to Use What

In 2026, the dominant recommendation is:

1. **Start with Postgres for everything.** It handles relational data, JSON, full-text search (basic), and vectors (via pgvector). One database, one operational burden.
2. **Add Redis** when you need caching, rate limiting, or queues.
3. **Add a search engine** when Postgres full-text isn't enough.
4. **Add a dedicated vector DB** when you have very large embedding datasets (>10M vectors) or need specialized indexes.
5. **Add a document DB** only if you genuinely have schemaless requirements (rare).

---

## 1.9 Authentication and Authorization

:::note Beginner analogy: bouncer at a club
Authentication and authorization are easy to confuse. Use this analogy and you'll never mix them up again:

- **Authentication** is the bouncer checking your ID at the door. *Are you who you claim to be?*
- **Authorization** is the wristband colors inside. *Now that you're in, what can you do?* (General admission = drinks at the main bar. VIP wristband = backstage access.)

Same person, two different checks. You first authenticate (prove identity), then the system authorizes specific actions based on who you are.
:::

Two related but distinct concepts:

- **Authentication (authn)** — proving who you are.
- **Authorization (authz)** — determining what you can do.

### Authentication Methods

**Password-based** (classic but declining):
1. User enters password.
2. Server hashes it (with bcrypt, argon2, or scrypt — never plain SHA).
3. Server compares to stored hash.
4. Server issues a session token (cookie) or JWT.

Pitfalls: users reuse passwords across sites, phishing, password reset flows are attack surfaces.

**OAuth / Social Login**:
- User clicks "Sign in with Google."
- Browser redirects to Google with your app's client ID.
- Google authenticates the user, asks for permission.
- Google redirects back to your app with a code.
- Your server exchanges the code for an access token + user profile.

OAuth 2.0 is the standard; OIDC (OpenID Connect) is OAuth + identity assertions.

**Magic Links**:
- User enters email.
- Server emails a one-time link.
- Clicking the link logs them in.

No passwords to remember, but adds email roundtrip latency.

**Passkeys (WebAuthn)**:
- User authenticates with biometrics (Face ID, fingerprint) or a security key.
- The device generates a public/private key pair specific to your site.
- Future logins are signed by the private key (which never leaves the device).

Passkeys are phishing-resistant, passwordless, and supported by all major platforms (Apple, Google, Microsoft) by 2026. They're rapidly becoming the default.

**SAML / SSO**:
- Used for enterprise single sign-on.
- An identity provider (Okta, Microsoft Entra, Google Workspace) authenticates the user.
- Your app trusts the assertion.

Required when selling to enterprises with their own identity systems.

### Tokens: Sessions vs JWTs

After authentication, the server needs to recognize the user on future requests.

**Session tokens** (server-stored):
- Server generates a random string, stores it in DB/Redis with the user ID.
- Sends it to the client as a cookie.
- On each request, server looks up the token to find the user.

Pros: Easy to revoke (delete the row); small cookie size.
Cons: Requires storage and a lookup per request.

**JWTs (JSON Web Tokens)** (self-contained):
- Server creates a JSON payload (user ID, expiration, etc.), signs it with a secret.
- Sends it to the client.
- On each request, server verifies the signature — no DB lookup needed.

Pros: Stateless, scales horizontally without shared session storage.
Cons: Hard to revoke before expiration; larger cookie size.

In 2026, **session tokens are making a comeback** because their downsides matter less with modern Redis/edge KV, and they're simpler to reason about. JWTs are still appropriate for microservices and APIs where stateless auth is valuable.

### Authorization Patterns

**RBAC (Role-Based Access Control)**: Users have roles; roles have permissions.

```
User Tony → Role: Admin → Permissions: read, write, delete, manage_users
User Sam  → Role: Member → Permissions: read, write
```

**ABAC (Attribute-Based Access Control)**: Permissions depend on attributes of the user, resource, and context.

```
Allow if: user.department == resource.department
  AND time.hour BETWEEN 9 AND 17
  AND user.clearance >= resource.classification
```

**Row-Level Security (RLS)**: Database-enforced rules about which rows each user can access.

```sql
CREATE POLICY user_owns_post ON posts
  FOR ALL TO authenticated
  USING (user_id = current_user_id());
```

Supabase and Postgres make RLS a primary pattern. Auth logic lives in the database — even if your app code has bugs, the DB won't return data the user shouldn't see.

### Auth in 2026: Use a Service

Implementing auth correctly is hard. Modern best practice is to outsource it:

- **Clerk** — Drop-in, beautiful UI, expensive at scale.
- **Better Auth** — Open-source, self-hostable, TypeScript-native.
- **Auth.js (NextAuth)** — Open-source, framework-integrated.
- **Auth0** — Mature, enterprise-friendly.
- **Supabase Auth** — Bundled with Supabase database.
- **WorkOS** — Adds enterprise SSO/SAML.

Don't roll your own. The attack surface is too large.

---

## 1.10 The Deployment Pyramid

How does code reach users? Every project, from one-person blogs to Google, uses some variation of this pipeline:

```
        Source Code (Git)
              │
              ▼
       CI: Tests pass?
              │
              ▼
   Build Artifact (container, bundle, function package)
              │
              ▼
       Artifact Registry
              │
              ▼
          Deployment
       (CD pipeline)
              │
              ▼
     Runtime Environment
   (servers / containers /
    serverless / edge)
              │
              ▼
         CDN / Edge
              │
              ▼
            Users
```

### Stage 1: Source Code

Code lives in a **Git repository**, typically hosted on:
- **GitHub** — Dominant, owned by Microsoft, integrated with Actions for CI.
- **GitLab** — Self-hostable, all-in-one DevOps platform.
- **Bitbucket** — Atlassian, popular alongside Jira.

### Stage 2: CI — Continuous Integration

Every push triggers automated checks:
- Install dependencies
- Run linters and formatters
- Run type checker
- Run unit tests
- Run integration tests
- Build the project
- Run security scans

Failed CI blocks the change from merging.

**Tools:** GitHub Actions (dominant), GitLab CI, CircleCI, Buildkite (large companies), Drone, Jenkins (legacy).

### Stage 3: Build Artifact

CI produces a **build artifact** — a packaged version of your app:

- **Docker image** — A complete filesystem snapshot with your app and its dependencies.
- **Static bundle** — A folder of `.html`, `.js`, `.css` for static sites.
- **Serverless function package** — A zip with your code, deployed to Lambda/Workers.
- **Native binary** — Compiled Go/Rust/etc. binaries.

### Stage 4: Artifact Registry

Artifacts are stored in a registry for repeatable deployment:

- **Docker Hub**, **GitHub Container Registry**, **AWS ECR**, **Google Artifact Registry** for containers.
- Cloud platforms (Vercel, Netlify) often handle this implicitly.

### Stage 5: CD — Continuous Deployment

CD takes passing builds and ships them:

- **Direct deployment**: build → deploy. Used by Vercel, Netlify.
- **Pull-based GitOps**: A controller (Argo CD, Flux) watches the Git repo and applies changes to the cluster.
- **Progressive delivery**: Deploy to 1% of users, monitor metrics, gradually expand.

### Stage 6: Runtime Environment

Where the code actually runs:

- **PaaS** (Vercel, Netlify, Railway, Render, Fly.io): You give them code, they run it.
- **Containers**: AWS ECS, Google Cloud Run, Azure Container Apps.
- **Kubernetes**: Container orchestration at scale; used by larger companies.
- **Serverless functions**: AWS Lambda, Cloudflare Workers, Vercel Edge Functions.
- **Raw VMs**: EC2, Compute Engine, dedicated servers.

### Stage 7: CDN and Edge

Static assets and (often) HTML are cached on the CDN. Users hit the CDN first; only cache misses reach your servers.

### Stage 8: DNS and Routing

DNS points your domain to the CDN/load balancer. Modern setups use anycast routing so users hit the geographically closest entry point automatically.

The whole pyramid runs in minutes for personal projects, hours for startups, and can involve approval gates and weeks of staging for large enterprises.

---

## Wrapping Up Part 1

If you've read this carefully, you now know:
- How the web actually moves bytes
- What HTTP really looks like
- How browsers turn HTML into pixels
- The rendering strategies that drive framework design
- The major API and database paradigms
- How auth works under the hood
- How code reaches production

Every later part of this series builds on these foundations. The frameworks and tools change every few years, but these underlying concepts don't.

**Next:** Part 2 covers the universal development lifecycle — the phases every project moves through regardless of size or stack.
