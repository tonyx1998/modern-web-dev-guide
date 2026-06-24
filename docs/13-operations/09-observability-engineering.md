---
id: ops-observability-engineering
title: Observability Engineering — Building the Stack
sidebar_position: 10
sidebar_label: Observability engineering
description: From the three pillars to running the system — Prometheus, OpenTelemetry, Grafana/Loki/Tempo; cardinality and why it blows up cost; trace sampling (head vs tail); eBPF and continuous profiling; and correlating signals to find the needle.
---

# Observability Engineering — Building the Stack

> **In one line:** The [observability basics](./ops-observability) gave you the three pillars (metrics, logs, traces); this page is about *operating* them as a system — instrumenting with **OpenTelemetry**, storing metrics in **Prometheus** without **cardinality** blowing up your bill, **sampling** traces sanely, reaching for **eBPF/continuous profiling** when logs and metrics run out, and *correlating* all three to go from "something's slow" to the exact line of code.

:::tip[In plain English]
[Earlier](./ops-observability) you learned *what* metrics, logs, and traces are. The gap between knowing that and being the person who can actually debug a production incident is **engineering the stack**: choosing what to measure, wiring it in once with a vendor-neutral standard, storing it affordably, and being able to jump from a high-level alert ("p99 latency doubled") down to the specific request and the specific function burning the time. The single thing that wrecks teams here is **cardinality** — the number of distinct time series you create — because it grows by *multiplication*, and one careless label (a user ID, a request ID) can turn a handful of series into millions and either bankrupt your monitoring bill or melt your metrics database. This page makes that danger concrete and gives you the rest of the toolkit (sampling, profiling, correlation) that the basics page didn't.
:::

## Instrument once: OpenTelemetry

The old way meant a separate, vendor-locked agent per signal. **OpenTelemetry (OTel)** is the vendor-neutral standard: instrument your code *once* (traces, metrics, logs) against the OTel API, run a **collector** that processes and routes the data, and switch backends (Prometheus, Grafana, Datadog, Honeycomb…) without touching app code. Prefer **auto-instrumentation** for the common libraries (HTTP, DB, gRPC) and add **manual spans** around the business logic you specifically care about. Follow the OTel **semantic conventions** (standard attribute names like `http.route`, `db.system`) so your data is portable and your dashboards aren't bespoke.

## Metrics & the cardinality trap

Prometheus (the de-facto metrics system) stores a separate **time series for every unique combination of label values**. That's powerful — and a multiplicative landmine. The number of series is the **product** of each label's distinct-value count:

```
   http_requests_total{method, status, route}
     methods: 5  ×  statuses: 8  ×  routes: 50   =   2,000 series   ✅ fine

   ...add a label user_id with 1,000,000 distinct values:
     5 × 8 × 50 × 1,000,000   =   2,000,000,000 series             💥 your DB is dead
```

You'll compute exactly this below. The rule: **labels are for low-cardinality dimensions** (method, status, route, region) you'll group/filter by — *never* for unbounded identifiers (user IDs, request IDs, emails). Unbounded, high-cardinality detail belongs in **traces and logs**, which are built to carry it.

<CodeChallenge
  id="ops-series-count"
  fnName="seriesCount"
  prompt="Compute a metric's time-series count. seriesCount(labelCardinalities) takes an array where each number is one label's count of DISTINCT values. The total number of series is the PRODUCT of them all. A metric with NO labels is a single series, so an empty array returns 1."
  starter={`function seriesCount(labelCardinalities) {\n  // total series = product of all the per-label distinct-value counts\n  // empty array (no labels) => 1\n  // your code\n}`}
  solution={`function seriesCount(labelCardinalities) {\n  return labelCardinalities.reduce((product, n) => product * n, 1);\n}`}
  tests={[
    {args: [[2, 3]], expected: 6, label: '2 × 3'},
    {args: [[10, 10, 10]], expected: 1000, label: 'three 10-value labels'},
    {args: [[5, 8, 50]], expected: 2000, label: 'method × status × route — fine'},
    {args: [[5, 8, 50, 1000000]], expected: 2000000000, label: 'add user_id — cardinality explosion'},
    {args: [[]], expected: 1, label: 'no labels → one series'},
  ]}
  hint="reduce with an initial value of 1, multiplying each element. The initial 1 makes the empty array return 1 automatically."
/>

## Traces & sampling: you can't keep them all

A trace stitches one request's journey across services into a tree of timed **spans** — the tool that turns "the system is slow" into "*this* call to *that* service took 800ms." But storing a trace for *every* request is ruinously expensive at volume, so you **sample**:

- **Head-based sampling** decides at the *start* of a request (e.g. keep 1%). Simple and cheap, but it's blind — it'll throw away the rare slow/errored requests you most want.
- **Tail-based sampling** buffers spans and decides *after* the trace completes, so you can **keep 100% of errors and slow requests** and sample the boring fast ones. More infrastructure (the collector must hold spans briefly), far better signal.

## When metrics & logs run out: eBPF and profiling

Sometimes the dashboards say "the service is slow" but *nothing in your code* explains why — the cost is in the kernel, syscalls, or CPU you never instrumented. Two deeper tools:

- **eBPF** runs tiny sandboxed programs *inside the Linux kernel* to observe syscalls, network, and I/O with almost no overhead and **no app changes** — invaluable for "where is the latency *really* going?" below your code (tools like `bpftrace`, Falco, Cilium).
- **Continuous profiling** samples CPU/memory stacks in production continuously and renders **flame graphs** — which function is actually eating the time — at overhead low enough to leave on always (Pyroscope, Parca). It answers "*which line*?" when a trace only narrows it to "this service."

## Correlate to find the needle

The payoff is connecting the three pillars: a **metric** alert (p99 up) → pivot to an **exemplar trace** attached to that metric spike → read the slow **span** → jump to the **logs** for that exact request (linked by trace ID) → if it's CPU, the **profile**'s flame graph for that window. Each pillar narrows the search; together they take you from symptom to root cause in minutes instead of an afternoon of guessing.

:::note[Worked example: a p99 spike, run to ground]
At 14:00 a Grafana alert fires: checkout p99 latency jumped from 180ms to 1.4s; error rate is flat. **Metrics** show it's isolated to the `checkout` service and started exactly at 14:00. The on-call clicks an **exemplar** on the latency panel — a real trace from the spike — and sees the request spent 1.2s in a single span: a call to the `pricing` service. Pricing's own p99 is fine *on average*, so it's not every call. **Tail-based sampling** has retained the slow traces; filtering them shows they all hit one `pricing` endpoint added in the 13:55 deploy. The **logs** for those traces (joined by trace ID) show a cache miss path; the **continuous profile** for `pricing` over 14:00–14:10 shows a flame graph dominated by a JSON-parse function on an uncached code path. Root cause in ~6 minutes: the new endpoint forgot to cache, so every call re-parsed a large payload. None of metrics, traces, logs, or profiles alone would have done it — the *correlation* did.
:::

## Why it matters

Anyone can install a dashboard; engineering the observability stack is what lets you *resolve* incidents instead of admire them. Controlling cardinality keeps the bill and the metrics DB alive; OTel keeps you un-locked-in; tail sampling keeps the signal you actually need; eBPF and profiling reach the failures your app code can't see; and correlation is the difference between a 6-minute root-cause and a 3-hour one. It's also the substrate the next page's SLOs and burn-rate alerts are computed *from*.

## Common mistakes

:::caution[Where people commonly trip up]
- **High-cardinality labels on metrics.** A user ID or request ID as a Prometheus label multiplies your series into the millions and kills the database. Keep unbounded detail in traces/logs.
- **Head-sampling traces and losing the errors.** Sampling 1% at the start discards the rare slow/failed requests you most need. Use tail-based sampling to keep errors and slow traces.
- **Per-vendor instrumentation.** Wiring a proprietary agent per signal locks you in. Instrument once with OpenTelemetry and route via the collector.
- **Dashboards without correlation.** Three disconnected pillars mean manual guesswork. Link metric exemplars → traces → logs (trace ID) → profiles so you can pivot fast.
- **Ignoring profiling until a crisis.** "The service is slow but the code looks fine" is exactly when you need continuous profiling/eBPF — and you want it already running, not installed mid-incident.
:::

## Page checkpoint

<Quiz id="ops-observability-engineering-page" title="Did observability engineering stick?" sampleSize={3}>

<Question
  prompt="Why is putting a user ID as a Prometheus metric label dangerous?"
  options={[
    { text: "User IDs are private and can't be stored" },
    { text: "Prometheus creates one time series per unique combination of label values, and the count is the PRODUCT of each label's distinct values — an unbounded, high-cardinality label like user_id multiplies your series into the millions/billions, melting the metrics database and the bill" },
    { text: "Labels can only be numbers" },
    { text: "It makes queries return wrong results" }
  ]}
  correct={1}
  explanation="Series count multiplies across labels. Low-cardinality dimensions (method, status, route) are fine; an unbounded identifier explodes the product. Keep high-cardinality detail in traces and logs, which are designed for it."
  revisit={{ to: "/docs/operations/ops-observability-engineering#metrics--the-cardinality-trap", label: "Cardinality trap" }}
/>

<Question
  prompt="Why might you choose tail-based trace sampling over head-based?"
  options={[
    { text: "Tail-based is cheaper and simpler to run" },
    { text: "Head-based decides at the request's start (blindly keeping e.g. 1%), so it discards rare slow/errored requests; tail-based buffers spans and decides after the trace finishes, letting you keep 100% of errors and slow traces while sampling the boring ones" },
    { text: "Tail-based works without any collector" },
    { text: "Head-based can't capture latency" }
  ]}
  correct={1}
  explanation="The traces you most want are the rare slow/failed ones — exactly what head sampling tends to drop. Tail sampling decides after completion, so it retains errors and slow requests at the cost of buffering spans in the collector."
  revisit={{ to: "/docs/operations/ops-observability-engineering#traces--sampling-you-cant-keep-them-all", label: "Trace sampling" }}
/>

<Question
  prompt="What problem do eBPF and continuous profiling solve that metrics and logs don't?"
  options={[
    { text: "They replace the need for dashboards entirely" },
    { text: "They reveal cost below or inside your code — kernel/syscall/network time (eBPF, no app changes) and which exact function is burning CPU/memory via flame graphs (continuous profiling) — when metrics only say 'slow' and the app code 'looks fine'" },
    { text: "They store traces for longer" },
    { text: "They are only for frontend performance" }
  ]}
  correct={1}
  explanation="When instrumented metrics/logs can't explain a slowdown, eBPF observes kernel-level behavior with near-zero overhead and no code changes, and continuous profiling pinpoints the hot function. They reach the failures your app-level signals can't see."
  revisit={{ to: "/docs/operations/ops-observability-engineering#when-metrics--logs-run-out-ebpf-and-profiling", label: "eBPF & profiling" }}
/>

</Quiz>

## What's next

→ Next: [The math under SRE — error budgets, burn-rate alerts & capacity](./ops-slo-math) — turning the signals you now collect into defensible SLO alerts and capacity numbers.
