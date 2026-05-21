---
id: http-methods-and-status
title: HTTP Methods & Status Codes
sidebar_position: 4
sidebar_label: 3. Methods & Status
description: The verbs (GET, POST, PUT, PATCH, DELETE) and the numeric replies (200, 404, 500) that make up every HTTP conversation.
---

# HTTP Methods & Status Codes

> **In one line:** Methods are *what the client wants done*; status codes are *what actually happened*.

:::tip In plain English
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

:::note Worked example: PUT vs PATCH
Imagine the server has user 42:

```json
{ "id": 42, "name": "Tony", "email": "tony@x.com", "city": "LA" }
```

**`PATCH /users/42` with body `{"city": "NYC"}`** — server merges; user becomes `{..., "city": "NYC"}`.

**`PUT /users/42` with body `{"city": "NYC"}`** — server *replaces* the whole user; user becomes `{"city": "NYC"}` and you've nuked their name and email.

The difference matters constantly in REST API design. PATCH is what most apps want most of the time.
:::

:::info Highlight: a method is just a hint
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

:::info Highlight: the 4xx vs 5xx litmus test
When something breaks in production, look at the status code **first**:

- **4xx?** Look at the client (your frontend, the user's input, the request you sent).
- **5xx?** Look at the server (your backend logs, the database, the upstream service).

This single mental shortcut will save you hours of barking up the wrong tree.
:::

:::note Worked example: 401 vs 403
A 401 says: "I don't know who you are. Send credentials and try again."

A 403 says: "I know exactly who you are, and you're not allowed."

Real-world example: you GET `/admin/users` while logged out → **401**. You GET it while logged in as a regular user → **403**.
:::

:::note Try it yourself
In your terminal:

```bash
curl -i https://httpbin.org/status/200
curl -i https://httpbin.org/status/404
curl -i https://httpbin.org/status/500
curl -i https://httpbin.org/redirect/2
```

`-i` includes the response headers, so you'll see the status line clearly: `HTTP/2 200`, `HTTP/2 404`, etc. Try a few different codes — they're all valid HTTP responses, just different categories of news.
:::

## What's next

→ Continue to [HTTP Headers & Cookies](./http-headers-cookies) where we'll see how requests carry metadata and how sites "remember" you across visits.
