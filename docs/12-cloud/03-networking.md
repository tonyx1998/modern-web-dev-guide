---
id: cloud-networking
title: Networking — The VPC
sidebar_position: 4
sidebar_label: Networking (VPC)
description: VPCs, subnets, route tables, security groups, NAT gateways, and load balancers — the model that breaks everyone the first time, explained as a single coherent system.
---

# Networking — The VPC

> **In one line:** A VPC is your own private network inside the cloud; everything that frustrates beginners — "why can't my app reach the database," "why can't the database reach the internet," "why is my Lambda timing out" — is a routing or firewall question with a small, learnable set of answers.

:::tip[In plain English]
When you rent compute in a cloud, it doesn't float in open space — it lives inside a **Virtual Private Cloud (VPC)**, a private network you define. You carve that network into **subnets** (slices of addresses). Some subnets are *public* (their traffic can reach the internet) and some are *private* (they can't be reached from the internet directly — where you put databases). Traffic moves according to **route tables**, and what's allowed in/out of each resource is decided by **security groups** (per-resource firewalls). Get those four right and the network "just works." Get one wrong and you spend an afternoon wondering why two services that are clearly running can't talk to each other. This page makes the four click.
:::

## Why a private network at all?

Defense in depth. You don't want your database reachable from the public internet — full stop. The VPC lets you put internet-facing things (load balancers, maybe app servers) in public subnets and everything sensitive (databases, internal services, caches) in private subnets that have *no route from the internet*. Even if an attacker finds your database's address, there's no network path to it. This is the cloud version of "the safe is in the back room, not the lobby."

## The anatomy of a standard VPC

```
                            Internet
                                │
                         ┌──────┴───────┐
                         │ Internet GW  │   (the door to the public internet)
                         └──────┬───────┘
   VPC  10.0.0.0/16            │
   ┌───────────────────────────┼──────────────────────────────────┐
   │  AZ us-east-1a            │            AZ us-east-1b           │
   │  ┌─────────────────────┐  │   ┌─────────────────────┐         │
   │  │ PUBLIC subnet       │◄─┘   │ PUBLIC subnet       │         │
   │  │ 10.0.1.0/24         │      │ 10.0.2.0/24         │         │
   │  │  • Load balancer    │      │  • Load balancer    │         │
   │  │  • NAT gateway ─────────┐  │                     │         │
   │  └─────────┬───────────┘   │  └─────────┬───────────┘         │
   │            │ (LB → app)    │ (egress)   │                     │
   │  ┌─────────▼───────────┐   │  ┌─────────▼───────────┐         │
   │  │ PRIVATE subnet      │   └─►│ PRIVATE subnet      │         │
   │  │ 10.0.11.0/24        │      │ 10.0.12.0/24        │         │
   │  │  • App servers      │      │  • App servers      │         │
   │  │  • Database (RDS)   │      │  • DB standby       │         │
   │  └─────────────────────┘      └─────────────────────┘         │
   └────────────────────────────────────────────────────────────────┘
```

This is the canonical layout: a `/16` VPC (65k addresses), split into public and private `/24` subnets, **duplicated across two AZs** for fault tolerance. Internet enters through the **Internet Gateway** to the load balancer in the public subnets; the load balancer forwards to app servers in the private subnets; the database lives in private subnets and is never internet-reachable.

## The four concepts, precisely

**1. CIDR blocks (the address math).** A subnet is a range of IPs written as `10.0.1.0/24`. The `/24` means the first 24 bits are fixed, leaving 8 bits = 256 addresses (a handful reserved by the cloud). `/16` = 65,536 addresses. You don't need to love subnetting, but you need to not *overlap* ranges — especially if you ever peer two VPCs or connect to a corporate network, overlapping CIDRs are an unfixable mess. Pick non-overlapping ranges up front.

**2. Route tables (where traffic goes).** Each subnet has a route table — a list of "for destination X, send to target Y." The one rule that defines public vs private:

- A **public** subnet's route table has `0.0.0.0/0 → Internet Gateway` (default route to the internet).
- A **private** subnet's route table has *no* direct route to the Internet Gateway. To let private resources make *outbound* calls (e.g. fetch an OS update, call a third-party API) without being *inbound*-reachable, you route `0.0.0.0/0 → NAT Gateway`.

**3. NAT Gateway (one-way outbound).** A NAT gateway lives in a public subnet and lets private resources initiate outbound connections while blocking inbound ones. It's how your private app server calls the Stripe API but the internet still can't reach the app server. **Cost note:** NAT gateways are quietly expensive — an hourly charge *plus* a per-GB data-processing charge. Routing terabytes of egress through a NAT is a classic surprise bill (see [Cost & FinOps](./cloud-cost)).

**4. Security Groups (the per-resource firewall).** A security group is a *stateful* allow-list attached to a resource (instance, load balancer, RDS). Stateful means: if you allow an inbound request, the response is automatically allowed out — you only write the rules for the direction you initiate. The professional pattern is **reference other security groups, not IP ranges**:

```hcl
# Database security group: allow Postgres ONLY from the app's security group.
# No IP addresses — the rule follows the app servers wherever they are.
resource "aws_security_group" "db" {
  name   = "db-sg"
  vpc_id = aws_vpc.main.id
}

resource "aws_security_group_rule" "db_from_app" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.db.id
  source_security_group_id = aws_security_group.app.id   # ← not a CIDR
}
```

This says "anything in the app security group may reach the DB on 5432, and nothing else may." When you autoscale the app from 2 to 20 servers, the rule still holds — no IP list to maintain.

:::info[Highlight: Security Groups vs NACLs (and why you can ignore NACLs at first)]
AWS has two firewalls: **Security Groups** (stateful, attached to resources) and **Network ACLs** (stateless, attached to subnets). 95% of the time you configure only security groups; the default NACL allows everything and you leave it. NACLs matter for coarse subnet-level blocks (e.g. ban an IP range from an entire subnet) and because they're *stateless* you must write both inbound *and* outbound rules. Learn security groups deeply now; reach for NACLs only when you have a specific subnet-wide rule to enforce.
:::

## Load balancers

A load balancer is the public front door that spreads traffic across your N app instances and health-checks them (pulling dead ones out of rotation). Two types you'll meet:

- **Application Load Balancer (L7 / HTTP)** — understands HTTP. Routes by path/host (`/api/*` → service A, `app.example.com` → service B), terminates TLS, supports WebSockets. This is the default for web apps.
- **Network Load Balancer (L4 / TCP)** — raw TCP/UDP, extreme throughput, ultra-low latency, static IPs. For non-HTTP protocols or when you need millions of connections.

The load balancer is also where **TLS termination** usually happens: it holds the certificate (free via AWS Certificate Manager / Google-managed certs), decrypts HTTPS, and forwards plain HTTP to your app inside the private network. Your app code never touches certificates.

```
Client ──HTTPS──► Load Balancer (terminates TLS, health-checks)
                       │  spreads across healthy targets
        ┌──────────────┼──────────────┐
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ app #1  │    │ app #2  │    │ app #3  │   (private subnets, multi-AZ)
   └─────────┘    └─────────┘    └─────────┘
```

:::note[Worked example: debugging "my app can't reach the database"]
The single most common cloud-networking ticket. Walk the path in order:
1. **Same VPC?** Resources in different VPCs can't talk without peering. ✅ usually yes.
2. **Route exists?** Can the app's subnet route to the DB's subnet? Within one VPC, the default `local` route covers this. ✅
3. **DB security group allow inbound 5432 from the app's security group?** This is the culprit ~70% of the time. The DB SG must explicitly allow the app SG on the DB port.
4. **App security group allow outbound?** Default SGs allow all outbound, so usually fine — but a locked-down egress rule can block it.
5. **Right hostname/port?** Using the DB's *private* endpoint, not a stale or public one.

Notice none of these is "the database is down." Network reachability is config, not health — and security groups are where you look first.
:::

## VPC endpoints (the egress-cost and security win)

When your private app calls AWS services (S3, DynamoDB), by default that traffic goes out the NAT gateway and across the public internet — paying NAT data charges and leaving your network. A **VPC endpoint** creates a private path from your VPC straight to the AWS service, so the traffic never leaves Amazon's network: cheaper (no NAT processing), faster, and more secure. For S3/DynamoDB the *gateway endpoint* is even free. If you see a big NAT bill, the first question is "how much of that is traffic to AWS services that should be on endpoints?"

## Common mistakes

:::caution[Where people commonly trip up]
- **Putting the database in a public subnet.** It's now one leaked password from the entire internet. Databases belong in private subnets with no internet route, reachable only from the app security group.
- **Overlapping CIDR ranges across VPCs/accounts.** Fine until the day you need to peer or connect to a corporate network — then it's a painful re-IP. Plan non-overlapping ranges from the start.
- **Allowing `0.0.0.0/0` on a database or SSH port.** "Allow from anywhere" on 22 or 5432 is how servers get popped within minutes of launch. Scope inbound rules to specific security groups or your VPN.
- **Forgetting security groups are stateful (and NACLs aren't).** People write outbound rules they don't need on SGs, or forget the return-traffic rule on NACLs and break things mysteriously.
- **Routing all AWS-service traffic through a NAT gateway.** S3/DynamoDB/etc. should use VPC endpoints — otherwise you pay NAT data-processing on traffic that never needed to leave Amazon's network.
- **Single-AZ everything.** A load balancer and database in one AZ means one data-center incident is a full outage. Span at least two AZs.
:::

## Page checkpoint

<Quiz id="cloud-networking-page" title="Did VPC networking stick?" sampleSize={3}>

<Question
  prompt="What single configuration difference makes a subnet 'public' rather than 'private'?"
  options={[
    { text: "Public subnets have more IP addresses" },
    { text: "Its route table has a default route (0.0.0.0/0) to the Internet Gateway; a private subnet has no direct route to the IGW" },
    { text: "Public subnets disable security groups" },
    { text: "Public subnets are in a different region" }
  ]}
  correct={1}
  explanation="Public vs private is purely a routing decision: a public subnet routes 0.0.0.0/0 to the Internet Gateway; a private subnet doesn't. Private resources reach the internet outbound-only via a NAT gateway, and are never directly reachable from the internet."
  revisit={{ to: "/docs/cloud/cloud-networking#the-four-concepts-precisely", label: "Route tables: public vs private" }}
/>

<Question
  prompt="A database and an app server are both running in the same VPC, but the app can't connect to the database. What's the most likely cause to check first?"
  options={[
    { text: "The database process has crashed" },
    { text: "The database's security group doesn't allow inbound traffic on the DB port from the app's security group" },
    { text: "The two are in different regions" },
    { text: "TLS certificates have expired" }
  ]}
  correct={1}
  explanation="Within one VPC, routing between subnets works by default, so the usual culprit is the firewall: the database's security group must explicitly allow inbound on its port (e.g. 5432) from the app's security group. Reachability is a config question, not a 'the DB is down' question."
  revisit={{ to: "/docs/cloud/cloud-networking#load-balancers", label: "Debugging connectivity" }}
/>

<Question
  prompt="Why is referencing another security group (instead of an IP range) the preferred way to write security-group rules?"
  options={[
    { text: "It's required by the cloud provider" },
    { text: "The rule follows the resources automatically — when you autoscale the app from 2 to 20 instances, 'allow from the app SG' still holds with no IP list to maintain" },
    { text: "IP ranges are slower to evaluate" },
    { text: "Security groups can't contain IP ranges" }
  ]}
  correct={1}
  explanation="Referencing a security group makes the rule identity-based rather than address-based. 'Allow Postgres from the app SG' stays correct as instances scale in and out and change IPs — no brittle CIDR list to keep in sync."
  revisit={{ to: "/docs/cloud/cloud-networking#the-four-concepts-precisely", label: "Security groups by reference" }}
/>

</Quiz>

## What's next

→ Continue to [Identity & access (IAM)](./cloud-iam) — once traffic can reach a resource, IAM decides whether the *caller* is allowed to do anything with it.
