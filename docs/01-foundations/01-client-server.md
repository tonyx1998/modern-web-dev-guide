---
id: client-server
title: The Client–Server Model
sidebar_position: 2
sidebar_label: 1. Client–Server
description: Every interaction on the web is a request from a client and a response from a server. Master this and the rest of the web makes sense.
---

# The Client–Server Model

> **In one line:** The web is just two computers talking — one asks ("client"), one answers ("server"). Everything else is decoration.

:::tip In plain English
When you open Instagram, your phone is the **client**. Instagram's computer in some data center is the **server**. Your phone *asks* the server for the latest posts; the server *replies* with the data. That single back-and-forth — repeated billions of times per second across the planet — is the entire web.
:::

## The core idea

Every interaction on the web is a conversation between two computers:

- A **client** sends a **request**.
- A **server** sends a **response**.

That's the entire model. Every feature you've ever used — Gmail, Netflix, TikTok, your bank's website — is built from this one primitive, repeated billions of times per day.

## What is a client?

A client is whatever sends a request. Most often it's a **web browser** (Chrome, Safari, Firefox, Edge), but it can also be:

- A mobile app making API calls to a backend
- A command-line tool like `curl` or `wget`
- A smart TV, refrigerator, or IoT device
- Another server (servers regularly call other servers)
- An AI agent (increasingly common in 2026)

A client doesn't need to be a "user" — it's just whatever initiates the conversation.

## What is a server?

A server is a long-running program on a computer somewhere on the internet that **listens** for incoming requests and decides how to respond. It's "the server" both as software (the program) and as hardware (the machine it runs on).

A single physical machine can run many server programs. A single server program can handle thousands of simultaneous clients. Modern cloud infrastructure abstracts this further — "your server" might actually be a virtual machine inside a container inside a Kubernetes pod inside a data center.

:::info Highlight: "Server" is overloaded vocabulary
You'll hear "server" used to mean four different things:

1. **The physical machine** — a computer in a data center.
2. **The software program** — your Express/Django/Rails process listening for requests.
3. **The whole stack** — "our server" meaning the whole backend system.
4. **A role** — when computer A talks to computer B, B is "the server" of *that* conversation.

Context usually makes it clear. When in doubt, ask "the program, the machine, or the role?"
:::

## A real conversation, end-to-end

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

:::note Try it yourself
Open your browser's **DevTools → Network** tab and refresh any page. You'll see the entire client–server conversation laid out: every request, every response, every header, every status code. This is the single best debugging skill you can develop early.

Try this on `https://example.com` — the simplest page on the web. You'll see ~1 request. Then try it on `https://nytimes.com` — you'll see 100+ requests for a single page.
:::

## Why this matters

Once you internalize the client–server model, everything else makes sense:

| What people call it          | What it actually is                                          |
|-----------------------------|--------------------------------------------------------------|
| "A REST API"                | A server that responds in a specific style                   |
| "A database connection"     | A client (your backend) talking to a server (the database)   |
| "Server-side rendering"     | HTML built by the server before being sent                   |
| "Client-side rendering"     | HTML built by the browser after the server sends it          |
| "Microservices"             | Many tiny servers, each talking to others as clients         |
| "AI integration"            | Your server is a client of an AI provider's server           |

It's all just clients and servers, all the way down.

:::info Highlight: If you only remember one thing
The web is a **conversation between computers**. Every problem you'll ever debug can be reframed as: *"Whose turn was it to talk, and what did they actually say?"* — and DevTools shows you that conversation in real time.
:::

## What's next

→ Continue to [HTTP & HTTPS Basics](./http-basics) where we'll look at the *language* clients and servers use to talk.
