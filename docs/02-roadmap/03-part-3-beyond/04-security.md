---
id: security
title: Security Beyond HTTPS
sidebar_position: 5
sidebar_label: Security
description: Authn vs authz, SQL injection, XSS, SSRF, secret management, and input validation — the six classes of bug behind most real-world web compromises.
---

# Security Beyond HTTPS

> **In one line:** Six classes of bug account for the overwhelming majority of real-world web compromises — learn to spot them in code.

The category most engineers learn after a breach. The asymmetry is the point: most days security adds friction, the one day it matters it saves your career.

:::info[Where this connects in the rest of the guide]
- The "what login actually is" model lives in [Authentication concepts](/docs/foundations/authentication).
- "What a user is allowed to do, and the patterns for enforcing it" lives in [Authorization concepts](/docs/foundations/authorization).
- For the actual libraries and services (Clerk, Better Auth, NextAuth, Auth0, etc.) see [Authentication tools](/docs/stack/authentication-tools).

This page is the *threat model*. Those pages are the implementations.
:::

## 1. Authn vs authz — and why authz is the harder one

**Authentication** = proving who you are. Login. **Authorisation** = checking what you're allowed to do. Most apps get authentication right (Clerk, Better Auth, OAuth providers all just work) and get authorisation wrong, because authz lives in every single endpoint, not in one library.

The classic authz bug is **IDOR** (Insecure Direct Object Reference): the server checks that you're logged in, but doesn't check that the thing you're asking for actually belongs to you.

```ts
// BAD — logged in is the only check. Any user can fetch any order.
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.select().from(orders).where(eq(orders.id, req.params.id));
  res.json(order);
});
// Attacker increments :id in the URL. Sees everyone's orders.

// GOOD — scope the query to the current user. Always.
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const [order] = await db.select().from(orders).where(
    and(eq(orders.id, req.params.id), eq(orders.userId, req.session.userId))
  );
  if (!order) return res.status(404).end();
  res.json(order);
});
```

The defensive habit: every query that returns user-owned data should include the ownership check *in the WHERE clause*, not as a separate check after the fetch. The "fetch then check" pattern is also correct but easier to forget — and if it leaks data into a log or response before the check fails, you've already lost.

## 2. SQL injection (and why parameterised queries fix it)

The oldest one. It's still on the OWASP top 10 because new junior code still does this.

```ts
// BAD — string interpolation into SQL. Game over.
const q = `SELECT * FROM users WHERE email = '${email}'`;
await db.execute(q);

// What an attacker submits as `email`:
// '; DROP TABLE users; --
// Final query: SELECT * FROM users WHERE email = ''; DROP TABLE users; --'

// GOOD — parameters are sent separately from the query text
await db.execute("SELECT * FROM users WHERE email = $1", [email]);
// The DB driver knows $1 is data, never code.
```

Drizzle, Prisma, and any ORM that uses prepared statements gives you this for free — *as long as you don't reach for raw SQL with template-string interpolation*. Your Python backend's `psycopg2` usage is worth auditing: `cursor.execute("SELECT ... WHERE id = %s", (id,))` is safe, `cursor.execute(f"SELECT ... WHERE id = {id}")` is the bug.

## 3. XSS: never trust strings rendered as HTML

**Cross-site scripting**: an attacker submits content containing a `<script>` tag, your app renders it as HTML, every visitor's browser runs the attacker's JS. The attacker steals cookies, hijacks sessions, impersonates the user.

```tsx
// BAD — directly injecting user input as HTML
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
// If comment.body is `<script>fetch('/api/token').then(...attacker)</script>`...

// GOOD — React's default. Text is rendered as text, not HTML.
<div>{comment.body}</div>
```

React, Vue, Svelte all escape strings by default — the bug only surfaces when you opt out (`dangerouslySetInnerHTML`, `v-html`, `{@html}`). If you must render user-submitted HTML (a rich-text editor), sanitise it through [DOMPurify](https://github.com/cure53/DOMPurify). Add a strict **Content Security Policy** header as defence-in-depth — it blocks inline scripts even if an XSS bug slips through.

## 4. SSRF: user-controlled URLs that your server fetches

**Server-side request forgery**: your server fetches a URL the user provided, but "user-provided" includes the URLs an attacker chose. The classic kill: an attacker sends `http://169.254.169.254/latest/meta-data/` — the AWS internal metadata endpoint — and your server fetches it, returning the cloud instance's IAM credentials.

```ts
// BAD — fetch any URL the user provides
app.post("/api/preview-url", async (req, res) => {
  const r = await fetch(req.body.url);
  res.send(await r.text());
});
// Attacker: { url: "http://169.254.169.254/latest/meta-data/iam/security-credentials/" }
// Your server obediently fetches your own cloud credentials and returns them.

// GOOD — allowlist, resolve DNS yourself, block private/loopback ranges
const url = new URL(req.body.url);
if (!ALLOWED_HOSTS.has(url.hostname)) return res.status(400).end();
// Resolve the hostname, verify it's not 10.x, 172.16.x, 192.168.x, 127.x, 169.254.x
```

This bug is in your `all-in-one-URL` shape of project — anywhere the server makes requests on behalf of user input (URL previews, webhook URLs, "import from URL" features). Always allowlist; never blocklist.

## 5. Secret management and the leak you've already had

Everyone has accidentally committed a secret to git. The instinct is to delete the commit — but the secret is already in everyone's clones, GitHub's API, every scraping bot's cache. The only correct response is to **rotate the secret** (revoke + replace) the moment you notice.

Layered defences:

- `.env` files for local development, never committed (`.env` in `.gitignore`).
- Environment variables on the host (Vercel/Render/Cloudflare dashboards) for production.
- A pre-commit hook (`gitleaks`, `trufflehog`) that refuses to commit known secret patterns.
- For larger setups: a secrets manager (AWS Secrets Manager, Doppler, Infisical) so secrets aren't lying around in deploy configs.

Your existing pattern in SoloMock — minting an ephemeral `client_secret` server-side and never letting the long-lived OpenAI key reach the browser — is **principle of least privilege** done right. The browser gets a token that works for 60 seconds, only for one operation, only for one user. Even if intercepted, the damage is bounded. Apply this thinking everywhere a service has to act on a user's behalf.

## 6. Validate at every boundary

Every byte entering your system from outside is suspect until proven otherwise: user form input, query strings, request bodies, API responses from third parties, environment variables, file uploads, and (increasingly important) LLM output.

```ts
// LLM tool-calling — the model's output is "external input" too
const RunCodeArgs = z.object({
  language: z.enum(["python", "javascript"]),
  source: z.string().max(10_000),
});

// Never JSON.parse + trust. Always parse + validate.
const args = RunCodeArgs.parse(JSON.parse(toolCall.function.arguments));
await sandboxed.run(args.language, args.source);
```

Zod (Tier 1) is the practical tool; the mindset — *"this came from outside, what would a malicious version of it do?"* — is the actual skill. Apply it to every `req.body`, every `process.env` at startup, every fetch response, every tool-call argument from an LLM.

## The mental check before you ship any new endpoint

For every new route, walk through this 30-second checklist:

1. **Authn**: is the user logged in if they need to be?
2. **Authz**: are they allowed to access *this specific resource*? Is the ownership check in the WHERE clause?
3. **Input**: is every field from the request validated against a schema before it's used?
4. **Output**: are you accidentally returning fields the user shouldn't see (password hashes, other users' data, internal IDs)?
5. **Side effects**: if this endpoint is called twice, what's the second-call behaviour? (Back to idempotency.)

## Why this matters for you

`all-in-one-URL`, `personal-site`, and `roofing-site` are all internet-facing. `solomock` will be soon. The threat isn't a targeted hacker — it's bots that scan the entire internet for the same five known vulnerability classes. Closing those classes once means the bots find nothing and move on.

## How to practice

[PortSwigger's Web Security Academy](https://portswigger.net/web-security) is free, hands-on, and the gold standard. Work through the SQL injection, XSS, and access-control labs — they take an hour each and you'll never write those bugs again. Read the [OWASP Top 10](https://owasp.org/Top10/) once a year. Run `npm audit` in every project monthly and actually read what comes back.

## First step

Pick one deployed project. Do the audit:

1. `git grep` the codebase for hard-coded secrets and `process.env` usage (any uppercase strings that look like keys).
2. For every endpoint returning user data, confirm the ownership check is in the SQL `WHERE` clause.
3. For every endpoint accepting input, confirm something validates each field's type and length before it reaches the DB or an external API.

You will find at least one issue. Fix it before reading the next section.

---

→ Next: [Part IV — Meta-skills](/docs/roadmap/part-4-meta) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
