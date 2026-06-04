---
id: ds-fallacies
title: The Fallacies & Why It's Hard
sidebar_position: 2
sidebar_label: Why it's hard
description: The eight fallacies of distributed computing, partial failure, the impossibility of distinguishing slow from dead, and why a network call is nothing like a function call.
---

# The Fallacies & Why It's Hard

> **In one line:** Distributed systems are hard because a network call *looks* like a function call but isn't — it can be slow, lost, duplicated, or reordered, the remote machine can fail independently of yours, and you frequently cannot tell "it's dead" apart from "it's slow," so every naive assumption you carry over from single-machine programming eventually becomes an outage.

:::tip[In plain English]
When you call a function, it runs and returns — instantly, reliably, every time. When you call another machine over a network, *anything* can happen: the request might not arrive, it might arrive twice, the reply might be lost (so the work happened but you don't know it), the other machine might be down, or — the worst one — it might just be *slow*, and you have no way to tell "slow" from "dead." Decades ago, engineers wrote down the eight false assumptions ("fallacies") that programmers keep making about networks. Every one of them, believed, eventually causes a production failure. This page is those assumptions and the deeper reason underneath them: in a distributed system, parts fail *independently and partially*, and you must design for it.
:::

## The eight fallacies of distributed computing

Formulated at Sun Microsystems, still the canonical list of "things programmers wrongly assume about networks." Each false assumption maps to a real failure mode:

| # | The fallacy ("we assume…") | The reality (and what bites you) |
|---|---|---|
| 1 | The network is reliable | Packets drop, connections reset. Requests and replies get lost. |
| 2 | Latency is zero | Remote calls take milliseconds-to-seconds; chatty designs (N+1 across the network) crawl. |
| 3 | Bandwidth is infinite | Big payloads saturate links; you must paginate and stream. |
| 4 | The network is secure | Anything on the wire can be read/tampered with; you must encrypt and authenticate. |
| 5 | Topology doesn't change | Nodes, IPs, and routes change constantly (autoscaling, failover); never hardcode them. |
| 6 | There is one administrator | Many teams/clouds/providers own pieces; no single point of control or knowledge. |
| 7 | Transport cost is zero | Serialization, bandwidth, and infrastructure all cost real money and CPU. |
| 8 | The network is homogeneous | Different protocols, versions, hardware, and clouds must interoperate. |

You don't need to memorize the list as trivia. The point is the *pattern*: every comfortable single-machine assumption is false across a network, and code written as if it were true works in dev and fails in prod.

## Partial failure: the defining difficulty

On one machine, failure is usually *total* — the program crashes, you restart it, done. In a distributed system, failure is **partial**: some nodes are up, some are down, some are up-but-unreachable, some are up-but-slow, and *different observers disagree about which*. Node A thinks B is dead; C is happily talking to B. There is no global "the system is up/down" — only a patchwork of partial truths.

Partial failure is what makes distributed systems qualitatively different. You can't just "handle the error" because there often *isn't a clean error* — there's a request that hasn't returned, and you don't know if it succeeded, failed, or is still running. Which leads to the deepest problem:

:::info[Highlight: you cannot distinguish "slow" from "dead"]
This is the single most important idea on this page. When you send a request and get no response, there are several possibilities and **you cannot tell them apart**:
1. The request never arrived (it failed before doing anything).
2. The request arrived, the work was done, but the *reply* was lost (it succeeded — you just don't know).
3. The remote node is processing slowly and will reply eventually.
4. The remote node has crashed and will never reply.

From your side, all four look identical: *silence*. This is why **timeouts are guesses, not facts** — when a timeout fires, you've *decided* to give up, but you still don't actually know what happened on the other side. And it's why so much of distributed systems is about coping with this uncertainty: **retries** (which require [idempotency](./idempotency), because case 2 means the work might already be done), **failure detectors** (which can be wrong, declaring a slow node dead), and **consensus** (agreeing on who's alive despite disagreement). If you remember one thing from this chapter, make it this: *no response is not the same as failure, and acting as if it were is how you double-charge a customer.*
:::

## Why a network call must never be disguised as a local call

A recurring historical mistake (early RPC frameworks, some ORMs, some microservice abstractions) is making a remote call *look* exactly like a local function call — same syntax, no visible difference. It's seductive and dangerous, because it hides everything that matters: the call can now fail, be slow, be retried, cost money, and fail *partially*, but the code reads as if none of that is possible. The lesson the industry learned the hard way: **make remote calls look remote.** Treat every network boundary as a place where you must think about timeouts, retries, idempotency, and partial failure — never paper over it with an abstraction that pretends the network isn't there.

:::note[Worked example: the "it worked in dev" double-charge]
A team builds a checkout that calls a payment service: `const result = await paymentService.charge(order)`. In development — same machine, no real network — it's flawless. In production, occasionally the charge *succeeds* but the response is lost to a network blip (fallacy #1, failure case #2 above). The checkout code sees no response, assumes failure, and the user (or an automatic retry) tries again — **double charge.** The bug isn't in the payment logic; it's in carrying the single-machine assumption "no response means it didn't happen" across a network where that's false. The fix is pure distributed-systems hygiene: an [idempotency key](./idempotency) on the charge so the retry is recognized as the same operation and de-duplicated. The team that knows this material designs the idempotency key *before* the first double charge; the team that doesn't learns it from an angry customer.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating "no response" as "it failed."** It might have succeeded with a lost reply. Design retries to be idempotent so re-trying a maybe-succeeded operation is safe.
- **Writing chatty cross-network code (N+1 over the wire).** Latency isn't zero; dozens of sequential remote calls per request crawl. Batch, parallelize, or co-locate.
- **Hardcoding node addresses / assuming stable topology.** Autoscaling and failover change IPs and members constantly. Use service discovery, not fixed addresses.
- **Disguising remote calls as local ones.** An abstraction that hides the network hides timeouts, retries, and partial failure — the exact things you must handle. Make remote calls visibly remote.
- **No timeout, or treating a timeout as ground truth.** A timeout is a decision to give up, not knowledge of what happened remotely. Always set one, and never assume it tells you the operation's real outcome.
- **Testing only on one machine.** Dev hides every distributed failure mode. Test with real network faults, latency, and concurrency (see [chaos engineering](/docs/operations/chaos-engineering)).
:::

## Page checkpoint

<Quiz id="ds-fallacies-page" title="Did the fundamentals stick?" sampleSize={2}>

<Question
  prompt="A checkout calls a payment service, gets no response, assumes failure, and retries — resulting in a double charge. What distributed-systems truth was violated?"
  options={[
    { text: "The network was too slow" },
    { text: "'No response' is not the same as 'it failed' — the charge may have succeeded with a lost reply; safe retries require an idempotency key so the duplicate is recognized" },
    { text: "The payment service had a bug in its charging logic" },
    { text: "The database wasn't replicated" }
  ]}
  correct={1}
  explanation="Across a network you can't distinguish 'never arrived' from 'succeeded but the reply was lost' from 'slow' from 'dead' — all look like silence. Assuming silence means failure and blindly retrying a non-idempotent operation double-charges. The fix is an idempotency key."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#why-a-network-call-must-never-be-disguised-as-a-local-call", label: "Slow vs dead" }}
/>

<Question
  prompt="What makes 'partial failure' the defining difficulty of distributed systems?"
  options={[
    { text: "It means the whole system crashes at once" },
    { text: "Some nodes are up, some down, some up-but-slow, and different observers disagree about which — there's no global up/down, just a patchwork of partial truths, often with no clean error to handle" },
    { text: "It only happens at very large scale" },
    { text: "It's caused exclusively by hardware faults" }
  ]}
  correct={1}
  explanation="On one machine failure is total and clean (crash, restart). Distributed, failure is partial and ambiguous: nodes fail independently, 'slow' looks like 'dead,' observers disagree, and a request that hasn't returned has an unknown outcome — so you must design for uncertainty, not just catch errors."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#partial-failure-the-defining-difficulty", label: "Partial failure" }}
/>

<Question
  prompt="Why is it dangerous to make a remote network call look syntactically identical to a local function call?"
  options={[
    { text: "It runs slower than an explicit network call" },
    { text: "It hides the things that matter at a network boundary — timeouts, retries, partial failure, cost — so code is written as if those can't happen, which fails in production" },
    { text: "It violates type safety" },
    { text: "Local and remote calls can't share the same syntax" }
  ]}
  correct={1}
  explanation="An abstraction that disguises a remote call as local papers over the network's realities (it can be slow, lost, retried, costly, partially failed). Making remote calls visibly remote forces you to handle timeouts, retries, and idempotency where they actually apply."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#why-a-network-call-must-never-be-disguised-as-a-local-call", label: "Make remote calls look remote" }}
/>

</Quiz>

## What's next

→ Continue to [Consistency & CAP](./ds-consistency) — once data lives on multiple machines, the central question becomes what "the current value" even means.
