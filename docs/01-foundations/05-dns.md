---
id: dns
title: 'DNS: The Internet''s Phone Book'
sidebar_position: 6
sidebar_label: 5. DNS
description: How a name like google.com becomes the IP address 142.250.190.78, and why this happens in milliseconds despite being a multi-step lookup.
---

# DNS: The Internet's Phone Book

> **In one line:** Computers find each other by numbers (IP addresses). DNS is the system that looks up the number when you give it a name.

:::tip[In plain English]
You don't memorize your friends' phone numbers — you tap their name in your contacts and your phone looks the number up. DNS is the world's biggest, most distributed contact list. When you type `google.com`, the network whispers "what's that number again?" to a chain of DNS servers and gets back something like `142.250.190.78`. *Then* the actual request begins.
:::

## What DNS does

**DNS (Domain Name System)** translates human-readable names (`google.com`) into IP addresses (`142.250.190.78`). Without DNS, you'd memorize numbers.

A typical DNS lookup goes:

1. Your browser checks its own cache.
2. Your OS checks its cache.
3. Your computer asks its configured **recursive resolver** (often your ISP's, or a public one like `8.8.8.8` Google or `1.1.1.1` Cloudflare).
4. The resolver asks the **root nameservers** (13 of them, globally distributed) — they know who handles `.com`.
5. The resolver asks the **TLD nameservers** for `.com` — they know who handles `example.com`.
6. The resolver asks the **authoritative nameservers** for `example.com` — they return the actual IP.
7. The answer is cached at every layer for a duration specified by the **TTL (Time to Live)**.

This whole dance happens in milliseconds and is almost always cached.

:::note[Worked example: trace a real DNS lookup]
On macOS or Linux:

```bash
dig +trace google.com
```

On Windows (PowerShell):

```powershell
Resolve-DnsName google.com -Type A
```

You'll see the chain of resolvers asked, with the IP returned at the bottom. Try a few — `dig +trace cloudflare.com`, `dig +trace github.com`. Notice how the answer is reached in roughly 4 hops every time.
:::

## DNS record types

DNS doesn't just store IP addresses. It stores many record types. The ones you'll actually configure:

| Record | What it does                                                     | Example                                  |
|--------|------------------------------------------------------------------|------------------------------------------|
| **A**    | Maps a name to an IPv4 address                                  | `example.com → 93.184.216.34`            |
| **AAAA** | Same, but IPv6                                                  | `example.com → 2606:2800:220:1:248:1893:25c8:1946` |
| **CNAME**| Aliases one name to another                                     | `www.example.com → example.com`          |
| **MX**   | Mail server for the domain                                      | `example.com mail → mx1.example.com`     |
| **TXT**  | Arbitrary text. Used for SPF/DKIM/DMARC, domain verification    | `v=spf1 include:_spf.google.com ~all`    |
| **NS**   | Which nameservers are authoritative                             | `example.com NS ns1.cloudflare.com`      |
| **CAA**  | Which certificate authorities can issue TLS certs for this domain | `example.com CAA 0 issue "letsencrypt.org"` |

In 2026 you almost never edit DNS records by hand — your hosting provider (Vercel, Cloudflare, etc.) gives you a UI or accepts your domain via a CNAME.

:::info[Highlight: the four DNS records new developers actually need]
For a typical first website:

1. **A record** — `example.com → 1.2.3.4` (your hosting provider's IP).
2. **CNAME record** — `www.example.com → example.com` (so both work).
3. **MX record** — *only* if you want email at that domain.
4. **TXT record** — verification token your hosting provider asks you to add.

You can ignore everything else until you specifically need it.
:::

## TTL — how DNS caches

Every DNS record has a **TTL (Time to Live)** in seconds. Resolvers and browsers cache the answer for that long before re-asking.

| TTL setting     | Use case                                                          |
|----------------|-------------------------------------------------------------------|
| 60s – 5 min     | While you're actively changing DNS (e.g., migrating hosts)        |
| 1 hour          | Standard for production sites                                     |
| 24 hours        | Stable records that almost never change                           |

The catch: a low TTL means changes propagate fast, but also that every resolver asks more often (more load). A high TTL is efficient but means changes take a long time to be seen everywhere.

:::note[Pitfall: "I changed DNS and nothing happened"]
You almost certainly didn't change anything wrong. DNS just hasn't *propagated* yet — the old answer is still cached at intermediate resolvers around the world, and they won't refresh until the old TTL expires. Tools like `dig` will show you the cached answer until it does. Patience or a TTL of 60s before the change is the only fix.
:::

## What's next

→ Continue to [CDNs and the Edge](./cdn-and-edge) where we'll see how your content gets close to users *physically*, not just logically.
