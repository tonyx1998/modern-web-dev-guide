---
id: ops-observability
title: Observability
sidebar_position: 3
sidebar_label: Observability
description: Metrics, logs, and traces; the three pillars and how they fit together; OpenTelemetry; cardinality; and the difference between monitoring and observability.
---

# Observability

> **In one line:** Monitoring tells you *whether* the system is healthy against questions you defined in advance; observability lets you ask *new* questions about *why* it's behaving strangely — and you get there by emitting three kinds of signal (metrics, logs, traces), correlated, with enough context to follow one request across every service it touched.

:::tip[In plain English]
When something breaks in production you can't attach a debugger to a live system serving a million users. All you have is what the system *emitted* — so the whole game is emitting the right things, in the right shape, so that when you're staring at "checkout is slow for some users in Europe," you can actually answer *why*. There are three kinds of signal. **Metrics** are cheap numbers over time ("requests per second," "p99 latency") — great for dashboards and alerts, but they can't tell you about one specific request. **Logs** are detailed event records ("user 42 hit a timeout calling payments") — rich, but expensive and noisy. **Traces** follow a single request as it hops across services, showing where the time went. Together they let you go from "something's wrong" (a metric alert) to "here's the exact slow database call in the payments service" (a trace) to "here's the error it logged" — without shipping new code to investigate.
:::

## Monitoring vs observability

Not synonyms. **Monitoring** is checking known signals against known thresholds — "alert me if error rate > 1%." It answers questions you *already knew to ask*. **Observability** is the property of a system that lets you answer questions you *didn't* anticipate — "why is latency high only for logged-in users in Germany on Android?" — by slicing and correlating rich data after the fact. Monitoring is a subset; modern complex systems (many services, lots of unknowns) need observability because you can't predict every failure mode in advance to set a threshold for it.

## The three pillars

```
            ┌──────────────────────────────────────────────────────────────┐
 METRICS    │ Aggregated numbers over time. Cheap, fast, retained long.    │
            │ "rps", "error rate", "p99 latency", "queue depth"            │
            │ → DASHBOARDS and ALERTS. Can't explain a single request.     │
            ├──────────────────────────────────────────────────────────────┤
 LOGS       │ Discrete, timestamped event records. Rich detail, high vol.  │
            │ "2026-06-03T12:01Z order=42 err=timeout svc=payments"        │
            │ → DEEP CONTEXT for a known event. Expensive at scale.        │
            ├──────────────────────────────────────────────────────────────┤
 TRACES     │ One request's journey across ALL services, as nested spans.  │
            │ web 250ms → auth 20ms → payments 200ms → db 180ms ← here!    │
            │ → WHERE THE TIME/ERROR WENT in a distributed call.           │
            └──────────────────────────────────────────────────────────────┘
```

**Metrics** are the cheapest and most aggregable — a counter incremented millions of times is still one small time series. Use them for dashboards, SLO tracking, and alerts. Their limitation is the flip side of aggregation: once you've summed "5,000 errors," the metric can't tell you *which* requests or *why*.

**Logs** carry the detail metrics lose. The professional form is **structured logging** — emit JSON with consistent fields, not free-text prose — so you can query them ("all logs where `svc=payments` and `status=timeout`") instead of grepping. The discipline: include a **request/trace ID** on every log line so you can pivot from a metric spike to the exact logs for the affected requests.

**Traces** are what distributed systems can't live without. A single user request might touch a web service, auth, a payments service, and three databases. A trace stitches those into one timeline of nested **spans**, each timed, so "the request took 900ms" becomes "780ms of it was one query in the payments service." Without tracing, debugging cross-service latency is guesswork.

```javascript
// Structured logging with a correlation ID — the field that ties the pillars together.
import { pino } from "pino";
const log = pino();

export async function handleCheckout(req) {
  const traceId = req.headers["x-trace-id"] ?? crypto.randomUUID();
  const reqLog = log.child({ traceId, route: "checkout", userId: req.userId });

  reqLog.info({ event: "checkout_start" });
  try {
    const result = await charge(req, traceId); // pass traceId DOWN to every service
    reqLog.info({ event: "checkout_ok", amount: result.amount });
    return result;
  } catch (err) {
    // This log line can now be found from a metric alert via traceId,
    // and lines up with the distributed trace of the same ID.
    reqLog.error({ event: "checkout_failed", err: err.message });
    throw err;
  }
}
```

:::info[Highlight: the correlation ID is the thread that makes the three pillars one tool]
The magic isn't having metrics *and* logs *and* traces — it's that a single **trace/request ID** flows through all three and across every service. The workflow becomes: a *metric* alert fires ("p99 latency spiked") → you find an example slow *trace* → the trace shows the slow span is in the payments service → you jump to that service's *logs* filtered by the same trace ID → you see the exact error. Three signals, one ID, a straight line from symptom to cause. Pick a request ID at the edge, propagate it on every outbound call (e.g. a `traceparent`/`x-trace-id` header), and attach it to every log and span. This one habit is the difference between 5-minute and 5-hour debugging.
:::

## OpenTelemetry: the standard you should default to

**OpenTelemetry (OTel)** is the vendor-neutral standard for generating and exporting metrics, logs, and traces. Instead of wiring your code to Datadog's SDK (and rewriting if you switch to Grafana or Honeycomb), you instrument once against OTel and *export* to whatever backend you choose. It handles **context propagation** — passing that trace ID across service and network boundaries — for you. The practical advice: **instrument with OpenTelemetry, not a vendor SDK**, so your observability isn't locked to one (expensive) vendor. Many languages/frameworks have OTel *auto-instrumentation* that traces your HTTP and DB calls with near-zero code.

The common backends you'll meet (all OTel-compatible):

| Layer | Open-source | Hosted |
|---|---|---|
| Metrics | **Prometheus** + **Grafana** | Datadog, Grafana Cloud, New Relic |
| Logs | **Loki**, OpenSearch/ELK | Datadog, Splunk, Better Stack |
| Traces | **Tempo**, **Jaeger** | Honeycomb, Datadog, Lightstep |
| All-in-one | Grafana stack (LGTM) | Datadog, New Relic, Honeycomb |

## The cardinality trap (the thing that blows up your bill)

**Cardinality** = the number of distinct values a label/dimension can take. Metrics systems store one time series *per unique combination of labels*. Add a label like `user_id` (millions of values) or `url` with IDs in it (`/orders/8f3a...`) and you create millions of time series — this is a **cardinality explosion** that melts your metrics backend and detonates your monitoring bill. The rule: **labels on metrics must be low-cardinality** (status code, route *template* `/orders/:id`, region, service). High-cardinality detail (user IDs, request IDs, raw URLs) belongs in **logs and traces**, which are built for it. Putting unbounded values in metric labels is the single most common self-inflicted observability disaster.

:::note[Worked example: the alert that should have been an SLO burn]
A team alerts on "CPU > 80%." It pages constantly — during harmless batch jobs, during deploys — and the on-call learns to ignore it. Meanwhile a real incident (checkout failing for 5% of users) doesn't trip it at all, because CPU was fine. The fix is to alert on **user-facing symptoms tied to the SLO**: "checkout success rate < 99.5% over 5 min" and "error-budget burn rate too fast." CPU becomes a *diagnostic* dashboard you look at *after* a symptom alert fires, not a pager trigger. The principle, expanded on the [alerting page](./on-call-alerting): page on symptoms users feel, diagnose with causes.
:::

## The RED and USE methods (what to actually measure)

Two simple frameworks so you're not guessing what metrics matter:

- **RED — for request-driven services** (your APIs): **R**ate (requests/sec), **E**rrors (failed/sec), **D**uration (latency distribution — track p50/p95/p99, *never* just the average, because the average hides the tail where real users suffer).
- **USE — for resources** (CPU, disk, queues): **U**tilization, **S**aturation (how full / how much queuing), **E**rrors.

Instrument every service with RED and every resource with USE and you've covered the vast majority of "what should I be watching."

## Common mistakes

:::caution[Where people commonly trip up]
- **Putting high-cardinality values (user IDs, raw URLs, request IDs) in metric labels.** This explodes time-series count and bills. Keep metric labels low-cardinality; put the detail in logs/traces.
- **Logging unstructured free text.** You can't query prose at scale. Emit structured JSON with consistent fields and a trace ID.
- **No correlation ID across services.** Without it, metrics, logs, and traces are three disconnected islands and debugging is guesswork. Propagate one ID everywhere.
- **Watching averages instead of percentiles.** A 200ms average can hide a 4s p99 — i.e. the slowest 1% of real users are miserable while the dashboard looks green. Track p95/p99.
- **Instrumenting against a vendor SDK.** You lock your telemetry to one backend. Instrument with OpenTelemetry and export to whatever you like.
- **Confusing monitoring with observability.** Threshold alerts on known signals won't answer the novel "why is it slow only for X" question. You need rich, sliceable, correlated data.
:::

## Page checkpoint

<Quiz id="ops-observability-page" title="Did observability stick?" sampleSize={3}>

<Question
  prompt="You get a metric alert that p99 latency spiked. What's the fastest path to root cause using the three pillars?"
  options={[
    { text: "Add more metric labels until one explains it" },
    { text: "Find an example slow trace, see which service/span ate the time, then pivot to that service's logs filtered by the same trace ID" },
    { text: "Restart the service and see if the metric recovers" },
    { text: "Increase log verbosity across every service and grep" }
  ]}
  correct={1}
  explanation="Metrics tell you something's wrong; a trace localizes WHERE the time went across services; logs (filtered by the shared trace ID) tell you WHY. The correlation ID flowing through all three turns a vague spike into a specific failing call in minutes."
  revisit={{ to: "/docs/operations/ops-observability#the-three-pillars", label: "Pillars + correlation ID" }}
/>

<Question
  prompt="Why must metric labels be low-cardinality?"
  options={[
    { text: "High-cardinality labels are a security risk" },
    { text: "Metrics systems store one time series per unique label combination, so a label like user_id (millions of values) causes a cardinality explosion that melts the backend and the bill — high-cardinality detail belongs in logs/traces" },
    { text: "Labels can't contain strings" },
    { text: "Low-cardinality labels are required for alerting to work" }
  ]}
  correct={1}
  explanation="Each unique label combination is a separate stored time series. Unbounded values (user IDs, raw URLs, request IDs) create millions of series — the classic cardinality explosion. Keep metric labels bounded (status, route template, region); put high-cardinality detail in logs and traces, which are built for it."
  revisit={{ to: "/docs/operations/ops-observability#the-cardinality-trap-the-thing-that-blows-up-your-bill", label: "Cardinality trap" }}
/>

<Question
  prompt="Why instrument with OpenTelemetry instead of a specific vendor's SDK?"
  options={[
    { text: "OpenTelemetry is faster at runtime" },
    { text: "It's a vendor-neutral standard — you instrument once and can export metrics/logs/traces to any backend, avoiding lock-in to one (often expensive) observability vendor, and it handles trace-context propagation for you" },
    { text: "Vendor SDKs can't produce traces" },
    { text: "OpenTelemetry is the only way to get structured logs" }
  ]}
  correct={1}
  explanation="OTel decouples instrumentation from backend: instrument once, export anywhere (Prometheus/Grafana, Datadog, Honeycomb…). It also standardizes context propagation across services. Wiring directly to one vendor's SDK locks your telemetry to that vendor."
  revisit={{ to: "/docs/operations/ops-observability#opentelemetry-the-standard-you-should-default-to", label: "OpenTelemetry" }}
/>

</Quiz>

## What's next

→ Continue to [Reliability patterns](./reliability-patterns) — now that you can see failure, the patterns that stop one failure from becoming an outage.
