---
id: http-basics
title: HTTP & HTTPS Basics
sidebar_position: 3
sidebar_label: 2. HTTP & HTTPS
description: The protocol clients and servers use to talk. What HTTP looks like, why HTTPS is mandatory, and which version you're actually using.
---

# HTTP & HTTPS Basics

> **In one line:** HTTP is the *language* the web speaks. HTTPS is the same language with the curtains drawn.

:::tip In plain English
HTTP is a strict format for sending messages between a client and a server — like a fill-in-the-blank form. The client writes "I want X" on one form; the server writes "here's X, or here's why I can't" on another form. HTTPS is identical, except the forms are sealed in an envelope only the recipient can open.
:::

## What HTTP is

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

> **In English:** The status line `200 OK` means "everything succeeded." The headers describe the body that follows: it's JSON, 87 bytes long, and may be cached for up to 300 seconds (5 minutes). The blank line is the protocol-mandated separator between headers and body — the body itself is the JSON object. Everything you've ever done online is built from messages like these.

:::note Worked example: read this HTTP request like a sentence
```http
GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGc...
```

Translated into English:

> **GET** ("please fetch") **/api/users/42** ("the user with ID 42") **HTTP/1.1** ("speaking HTTP version 1.1") — **Host:** api.example.com ("on the host api.example.com, in case you serve multiple sites") — **Accept:** application/json ("respond in JSON, not HTML") — **Authorization: Bearer eyJhbGc...** ("here's my login token to prove I'm allowed").

Once you can read HTTP this way, debugging becomes a reading exercise.
:::

## HTTPS — the encrypted version

**HTTPS** is HTTP wrapped in **TLS (Transport Layer Security)**, an encryption protocol. The data being transmitted is the same; it's just unreadable to anyone intercepting it.

In 2026, HTTPS is effectively mandatory:

- Browsers display warnings for plain HTTP sites
- Most modern web APIs and features (Service Workers, geolocation, camera/microphone) only work over HTTPS
- Search engines penalize plain HTTP in rankings
- TLS certificates are now free and automated via Let's Encrypt and modern hosting platforms

:::info Highlight: You no longer pay for HTTPS
A decade ago, an SSL certificate cost $50–$300/year and required manual installation. Today, every major hosting platform — Vercel, Netlify, Cloudflare, AWS — provisions and renews certificates *automatically and for free* the moment you point a domain at them. There is no reason to ship a public site over plain HTTP anymore.
:::

## HTTP versions: which one are you using?

You rarely choose explicitly — your hosting platform and browser negotiate the best mutual version automatically. But it helps to know the lineage:

| Version  | Year | Key idea                                              | Used today?                  |
|----------|------|-------------------------------------------------------|------------------------------|
| HTTP/1.1 | 1997 | One request per TCP connection at a time              | Still a fallback             |
| HTTP/2   | 2015 | Multiplexing: many requests share one connection      | Most modern sites            |
| HTTP/3   | 2022 | Runs on QUIC (UDP). Faster on flaky networks          | Increasingly common in 2026  |

The versions are **wire compatible** from your code's perspective. Your fetch call looks the same whether HTTP/1.1, 2, or 3 is underneath. The differences only matter at the network layer.

:::note Try it yourself
In Chrome DevTools, open **Network → right-click any column header → check "Protocol."** You'll now see `h2`, `h3`, or `http/1.1` next to each request. Visit a few sites and notice the spread — most modern sites are `h2` or `h3`.
:::

## Stateless by design

HTTP is **stateless**: each request is independent and the server has no built-in memory between requests. The server, by default, has no idea that the request that just arrived came from the same browser that made a request five seconds ago.

This sounds inconvenient — how does the server know you're logged in? — but it's a *feature*. Statelessness is why the web scales: any server can handle any request without coordinating with other servers about who you are.

State is added back on top of HTTP using two mechanisms you'll learn about soon:

- **Cookies** — small pieces of data the server tells the browser to remember and re-send.
- **Tokens** (sessions, JWTs) — credentials the client sends with every request.

We'll cover both in upcoming pages.

:::info Highlight: If you only remember one thing
Every HTTP request has the same shape: **method + path + headers + (optional) body**. Every HTTP response has the same shape: **status code + headers + (optional) body**. Memorize that shape once and you can read any HTTP exchange anywhere — in a browser, in a log file, in a Wireshark capture.
:::

## What's next

→ Continue to [HTTP Methods & Status Codes](./http-methods-and-status) where we'll cover the *verbs* (GET, POST, PUT…) and the numeric *replies* (200, 404, 500…).
