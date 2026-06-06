---
id: http-methods-and-status
title: HTTP Methods & Status Codes
sidebar_position: 4
sidebar_label: Methods & Status
description: The verbs (GET, POST, PUT, PATCH, DELETE) and the numeric replies (200, 404, 500) that make up every HTTP conversation.
estimatedMinutes: 15
---

# HTTP Methods & Status Codes

> **In one line:** Methods are *what the client wants done*; status codes are *what actually happened*.

:::tip[In plain English]
Imagine ordering at a restaurant. The **method** is the type of order — "I'd like to see the menu" (GET), "I'd like to place an order" (POST), "change my order to medium-well" (PATCH), "cancel my order" (DELETE). The **status code** is the waiter's reply — "here you go" (200), "we're out of that" (404), "your card was declined" (402), "the kitchen is on fire" (500).
:::

## HTTP methods (verbs)

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

**Idempotent** means doing it multiple times has the same effect as doing it once. GET, PUT, and DELETE are idempotent: requesting the same page 100 times or deleting the same record 100 times is safe. POST is *not*: 100 POSTs to a "create order" endpoint create 100 orders.

This matters for retries: clients (and CDNs, and browsers) will automatically retry idempotent requests on failure but won't retry POSTs without explicit handling.

:::note[Worked example: PUT vs PATCH]
Imagine the server has user 42:

```json
{ "id": 42, "name": "Tony", "email": "tony@x.com", "city": "LA" }
```

**`PATCH /users/42` with body `{"city": "NYC"}`** — server merges; user becomes `{..., "city": "NYC"}`.

**`PUT /users/42` with body `{"city": "NYC"}`** — server *replaces* the whole user; user becomes `{"city": "NYC"}` and you've nuked their name and email.

The difference matters constantly in REST API design. PATCH is what most apps want most of the time.
:::

:::info[Highlight: a method is just a hint]
A server is free to interpret a method however it wants. `GET /delete-user/42` will absolutely work if a server is written to accept it — but it violates HTTP conventions, breaks caching, and confuses every CDN in the world. Follow the conventions; your future self will thank you.
:::

## HTTP status codes

Status codes tell the client what happened, organized in ranges. Every status code is exactly 3 digits and the **first digit tells you the category**:

| Range | Meaning           | Mental model                              |
|-------|-------------------|-------------------------------------------|
| 1xx   | Informational     | "Still working, hold on" — rare           |
| 2xx   | Success           | "Did it"                                  |
| 3xx   | Redirection       | "Go look over there instead"              |
| 4xx   | Client error      | "*You* did something wrong"               |
| 5xx   | Server error      | "*I* did something wrong"                 |

### The codes you'll see daily

**2xx — Success**
- `200 OK` — Standard success.
- `201 Created` — A new resource was created (typical after a POST).
- `204 No Content` — Success, but no body to return (typical after DELETE).
- `206 Partial Content` — Range request (used for video seeking, resumable downloads).

**3xx — Redirection**
- `301 Moved Permanently` — Resource is now at a different URL *forever*. Browsers and search engines remember this.
- `302 Found` / `307 Temporary Redirect` — Resource is temporarily elsewhere.
- `304 Not Modified` — Cache is still valid; don't bother re-downloading.

**4xx — Client errors** (you sent something wrong)
- `400 Bad Request` — Malformed request.
- `401 Unauthorized` — You need to authenticate (poorly named — should have been "Unauthenticated").
- `403 Forbidden` — You're authenticated but not permitted.
- `404 Not Found` — Resource doesn't exist.
- `409 Conflict` — Your request conflicts with current state (e.g., duplicate email).
- `422 Unprocessable Entity` — Request is well-formed but semantically wrong.
- `429 Too Many Requests` — Rate limited.

**5xx — Server errors** (something is wrong on the server)
- `500 Internal Server Error` — Generic server failure.
- `502 Bad Gateway` — A server upstream returned an invalid response.
- `503 Service Unavailable` — Server overloaded or down for maintenance.
- `504 Gateway Timeout` — Upstream server didn't respond in time.

:::info[Highlight: the 4xx vs 5xx litmus test]
When something breaks in production, look at the status code **first**:

- **4xx?** Look at the client (your frontend, the user's input, the request you sent).
- **5xx?** Look at the server (your backend logs, the database, the upstream service).

This single mental shortcut will save you hours of barking up the wrong tree.
:::

:::note[Worked example: 401 vs 403]
A 401 says: "I don't know who you are. Send credentials and try again."

A 403 says: "I know exactly who you are, and you're not allowed."

Real-world example: you GET `/admin/users` while logged out → **401**. You GET it while logged in as a regular user → **403**.
:::

:::note[Try it yourself]
In your terminal:

```bash
curl -i https://httpbin.org/status/200
curl -i https://httpbin.org/status/404
curl -i https://httpbin.org/status/500
curl -i https://httpbin.org/redirect/2
```

`-i` includes the response headers, so you'll see the status line clearly: `HTTP/2 200`, `HTTP/2 404`, etc. Try a few different codes — they're all valid HTTP responses, just different categories of news.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Using POST for everything because "it's the safe default."** A search form that posts is a search form that can't be bookmarked, shared, or cached by the CDN. If the request *reads* data and doesn't change state, it's a GET — even when the parameters feel "too many" for a query string.
- **PUT vs PATCH confusion.** PUT *replaces* the entire resource — sending `{ "city": "NYC" }` will wipe the name and email. PATCH merges. When in doubt, you almost certainly want PATCH.
- **Returning 200 for errors.** A handler that catches an exception, logs it, and returns `200 OK` with `{ "error": "..." }` in the body breaks every client retry policy, every monitoring tool, and every CDN. Use the right 4xx/5xx code; the body is for *details*, not the verdict.
- **Treating 401 and 403 as synonyms.** 401 = "I don't know who you are, send credentials." 403 = "I know who you are, and no." Mixing them leaks information *and* confuses clients about whether to redirect to login. The fix is mechanical: not-logged-in → 401, logged-in-but-not-allowed → 403.
- **Auto-retrying POSTs on failure.** POST isn't idempotent. A retry after a network blip can double-charge a credit card or create duplicate orders. Either make the endpoint idempotent (with an `Idempotency-Key` header) or never auto-retry it.
:::

## Page checkpoint

<Quiz id="http-methods-page" title="Did HTTP methods & status codes stick?" sampleSize={2}>

<Question
  prompt="Which HTTP method is NOT idempotent — meaning sending it twice can cause two different effects?"
  options={[
    { text: "GET" },
    { text: "PUT" },
    { text: "POST" },
    { text: "DELETE" }
  ]}
  correct={2}
  explanation="POST creates a new resource each time, so two POSTs to /orders create two orders. GET, PUT, and DELETE are idempotent — repeating them has the same effect as doing them once."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-methods-verbs", label: "HTTP methods (verbs)" }}
/>

<Question
  prompt="Server has user 42 with name, email, and city set. You send PUT /users/42 with body {city: 'NYC'}. What happens?"
  options={[
    { text: "Only the city field changes; name and email are preserved" },
    { text: "The whole user is replaced — name and email are now missing" },
    { text: "The server returns an error because the body is incomplete" },
    { text: "Nothing changes — PUT requires the full URL of a new resource" }
  ]}
  correct={1}
  explanation="PUT replaces the entire resource with the body you send. To change just one field while preserving the rest, use PATCH. This is the single most common PUT-vs-PATCH mistake."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-methods-verbs", label: "PUT vs PATCH" }}
/>

<Question
  prompt="A logged-in regular user requests /admin/users and gets a 403. What does that tell you?"
  options={[
    { text: "The server doesn't know who they are; they need to send credentials" },
    { text: "The server knows who they are but they're not permitted to access this resource" },
    { text: "The resource doesn't exist at that URL" },
    { text: "The server is overloaded and rejecting requests" }
  ]}
  correct={1}
  explanation="403 Forbidden means 'I know exactly who you are, and you're not allowed.' 401 Unauthorized is the one that means 'send credentials' — its name is misleading; it really means 'unauthenticated.'"
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-status-codes", label: "401 vs 403" }}
/>

<Question
  prompt="Production is broken and you see your API returning 502 Bad Gateway. Where should you start looking?"
  options={[
    { text: "The client — the user probably sent malformed data" },
    { text: "The server side — likely an upstream service the API depends on" },
    { text: "DNS — the domain is misconfigured" },
    { text: "The browser cache — purge it and retry" }
  ]}
  correct={1}
  explanation="5xx codes mean something went wrong on the server. 502 specifically means an upstream server returned an invalid response — start with backend logs and dependent services. 4xx codes would point at the client."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-status-codes", label: "The 4xx vs 5xx litmus test" }}
/>

</Quiz>

## What's next

→ Continue to [HTTP Headers & Cookies](./http-headers-cookies) where we'll see how requests carry metadata and how sites "remember" you across visits.
