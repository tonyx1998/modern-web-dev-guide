---
id: cloud-kubernetes
title: Kubernetes Without the Hand-Waving
sidebar_position: 12
sidebar_label: Kubernetes & orchestration
description: How a Kubernetes cluster actually runs your code — the reconcile loop, pods/deployments/services/ingress, scheduling and autoscaling (HPA, cluster autoscaler), health probes, rolling updates, and a first look at service mesh — plus when NOT to reach for it.
---

# Kubernetes Without the Hand-Waving

> **In one line:** Kubernetes is a **control loop** that you give a *desired state* ("run 4 copies of this container, expose it on port 80") and that relentlessly works to make *actual state* match — and once you see it as that one idea plus a handful of objects (Pod, Deployment, Service, Ingress) and two autoscalers, the rest stops being mysterious; the real skill is knowing the machinery *and* knowing when you don't need it yet.

:::tip[In plain English]
You met [containers](/docs/foundations/containers) — a packaged app plus its dependencies that runs the same everywhere. Kubernetes (K8s) is what runs *many* containers across *many* machines without you hand-placing each one. The mental shift: you don't tell Kubernetes "start this container on that server." You hand it a *description of the world you want* — "I want 4 healthy copies of `web:v2`, reachable at this address" — and Kubernetes figures out where to put them, restarts them when they crash, moves them when a machine dies, and keeps adjusting forever. That "describe the goal, let the system converge" model is the whole point; it's also exactly the [reconcile loop](/docs/distributed-systems/ds-consensus) idea you'll see again in GitOps. This page makes the machinery concrete so "the cluster did something weird" becomes a thing you can reason about — and it ends with the honest part: most small projects should *not* run Kubernetes.
:::

## The one idea: desired state and the reconcile loop

Everything in Kubernetes is a controller watching a resource and driving reality toward the spec you declared:

```
   you declare desired state ──►  ┌──────────────────────────┐
   (YAML: "4 replicas of web")    │   CONTROL LOOP (forever)  │
                                  │  observe actual state     │
                                  │  diff against desired     │
                                  │  take actions to converge │
                                  └────────────┬─────────────┘
   a pod crashes ──────────────────────────────┘  ► controller starts a replacement
   you edit to 6 replicas ─────────────────────┘  ► controller starts 2 more
```

You change the *spec*; controllers do the work. You never imperatively "start a pod" in normal operation — you raise `replicas: 6` and the Deployment controller makes it true.

## The objects worth knowing

- **Pod** — the smallest unit: one (or a few tightly-coupled) containers sharing a network address. Pods are *cattle, not pets* — disposable, replaced freely.
- **Deployment** — declares "keep N identical pods running of this version," and manages **rolling updates** (replace pods gradually) and rollbacks. This is what you usually write.
- **Service** — a *stable* virtual address and load balancer in front of a set of pods. Pods come and go with changing IPs; the Service name stays put, so other components have something durable to call.
- **Ingress** — routes outside HTTP traffic (host/path rules, TLS) to Services. Your "front door."
- **ConfigMap / Secret** — configuration and credentials injected into pods (Secrets are for sensitive values; see the [secrets-at-scale section](./cloud-gitops) for why a base64 Secret isn't real encryption).
- **PersistentVolume / PVC** — durable storage that survives a pod restart, for the stateful exceptions.

```
   Internet ─► Ingress ─► Service (stable VIP) ─► [ Pod ] [ Pod ] [ Pod ]
                (TLS,        (load-balances        ▲ Deployment keeps the
                 routing)     across healthy pods)   count + version correct
```

## Scheduling, health, and rolling updates

- **The scheduler** places each new pod on a node with room, honoring the pod's **requests** (guaranteed CPU/memory it's scheduled against) and **limits** (the ceiling it's throttled/killed at). Get requests wrong and you either waste nodes or pack them until everything thrashes.
- **Health probes** are how the loop knows "healthy": a **readiness** probe gates whether a pod receives traffic; a **liveness** probe restarts a wedged pod. A rolling update that brings up `v2` pods *waits for readiness* before shifting traffic and retiring `v1` — so a `v2` that never becomes ready **auto-halts the rollout** instead of taking the site down.

## Autoscaling: two different knobs

People conflate these; they operate at different layers:

- **Horizontal Pod Autoscaler (HPA)** — adds/removes *pods* based on a metric (CPU, or custom like requests/sec). More load → more pods.
- **Cluster Autoscaler / Karpenter** — adds/removes *nodes* (VMs) when pods can't be scheduled (no room) or nodes sit empty. More pods than fit → more machines.

They work together: HPA wants 20 pods, they don't fit on current nodes, the cluster autoscaler provisions another node. The HPA's sizing is a simple, real formula — you'll implement it below.

<CodeChallenge
  id="cloud-hpa-desired-replicas"
  fnName="desiredReplicas"
  prompt="Implement Kubernetes' HPA formula. desiredReplicas(current, currentMetric, targetMetric, min, max): scale the replica count by how far the observed metric is from its target, round UP, then clamp into [min, max]. Formula: ceil(current * (currentMetric / targetMetric)), then clamp."
  starter={`function desiredReplicas(current, currentMetric, targetMetric, min, max) {\n  // 1. ratio = currentMetric / targetMetric\n  // 2. desired = ceil(current * ratio)\n  // 3. clamp desired into [min, max]\n  // your code\n}`}
  solution={`function desiredReplicas(current, currentMetric, targetMetric, min, max) {\n  const desired = Math.ceil(current * (currentMetric / targetMetric));\n  return Math.min(max, Math.max(min, desired));\n}`}
  tests={[
    {args: [2, 100, 50, 1, 10], expected: 4, label: 'metric 2x target → double the pods'},
    {args: [4, 30, 50, 1, 10], expected: 3, label: 'under target → scale down (rounded up)'},
    {args: [2, 200, 50, 1, 10], expected: 8, label: 'metric 4x target → 4x pods'},
    {args: [5, 500, 50, 1, 10], expected: 10, label: 'huge spike clamps to max'},
    {args: [3, 10, 50, 2, 10], expected: 2, label: 'tiny load clamps to min'},
  ]}
  hint="desired = Math.ceil(current * currentMetric / targetMetric); then Math.min(max, Math.max(min, desired))."
/>

## Service mesh: the next layer (a first look)

Once you have many services calling each other, cross-cutting concerns — **mutual TLS** between services, retries/timeouts, traffic splitting for canaries, and per-call observability — get tedious to bake into every app. A **service mesh** (Istio, Linkerd, Cilium) pushes those into a sidecar proxy next to each pod, so the *platform* handles encryption, traffic policy, and telemetry uniformly. It's powerful and *operationally heavy* — adopt it when service-to-service complexity, not app count, justifies it.

:::note[Worked example: a bad deploy that doesn't take you down]
You run `web` at `replicas: 4, v1`. You `kubectl set image` to `v2`. The Deployment's rolling update starts **one** `v2` pod (default surge), waits for its **readiness probe**. But `v2` has a broken config and never passes readiness. Because the rollout only retires a `v1` pod *after* a `v2` becomes ready, **zero `v1` pods are removed** — the site keeps serving on `v1` while the rollout sits stuck. You see `3 of 4 updated: 1 unavailable`, `kubectl rollout undo`, and you're back to a clean `v1` with no user-visible outage. The reconcile loop turned "I shipped a broken build" into "the bad version never received traffic." Contrast hand-deploying to VMs, where you'd have already overwritten the good binary.
:::

## Why it matters — and when NOT to use it

Kubernetes is the de-facto way to run containers at scale, it's portable across clouds, and its self-healing/declarative model is genuinely excellent for many-service systems. **But it is a large operational commitment**: cluster upgrades, networking, RBAC, capacity, and a YAML surface that punishes mistakes. For a solo project or an early startup, a platform-as-a-service (Fly.io, Railway, Cloud Run, a managed app platform) gives you most of the self-healing and rolling-deploy benefit with a fraction of the burden — the [boring-technology](/docs/decisions/boring-technology) call. Reach for Kubernetes when you have *many* services, multiple teams, or portability needs that actually justify the overhead — not because it's the default everyone name-drops.

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting Kubernetes too early.** A single app with a database does not need a cluster; you're buying ops burden to solve a problem you don't have. Use a PaaS until many-service complexity is real.
- **No resource requests/limits.** Without them the scheduler can't pack nodes safely; one noisy pod starves its neighbors. Set requests (for scheduling) and limits (for protection).
- **Missing readiness probes.** Without readiness, a rolling update shifts traffic to pods that aren't ready yet — turning a deploy into a brownout. The probe is what makes rollouts safe.
- **Confusing the two autoscalers.** HPA scales pods; the cluster autoscaler scales nodes. If pods are "Pending" with HPA maxed, you need node capacity, not more pod replicas.
- **Treating pods as pets.** Storing state on a pod's local disk and expecting it to persist. Pods are disposable; use PersistentVolumes for the stateful exceptions.
- **Reaching for a service mesh on day one.** The sidecar/proxy layer is heavy; add it when inter-service mTLS/traffic-policy needs justify it, not preemptively.
:::

## Page checkpoint

<Quiz id="cloud-kubernetes-page" title="Did Kubernetes stick?" sampleSize={3}>

<Question
  prompt="What is the single core idea behind how Kubernetes operates?"
  options={[
    { text: "You SSH into each node and start containers manually" },
    { text: "You declare a desired state and controllers run a continuous reconcile loop — observe actual state, diff against desired, take actions to converge — so crashes, scale changes, and node failures are corrected automatically" },
    { text: "It compiles your app into a single binary" },
    { text: "It only works for stateless websites" }
  ]}
  correct={1}
  explanation="Kubernetes is a control loop: you describe the world you want (replicas, image, exposure) and controllers relentlessly drive reality toward it. You change the spec; the system does the work, including self-healing and rolling updates."
  revisit={{ to: "/docs/cloud/cloud-kubernetes#the-one-idea-desired-state-and-the-reconcile-loop", label: "Reconcile loop" }}
/>

<Question
  prompt="How does a readiness probe make a rolling update safe?"
  options={[
    { text: "It encrypts traffic to new pods" },
    { text: "The rollout only sends traffic to a new pod once its readiness probe passes, and only retires an old pod after a new one is ready — so a new version that never becomes ready halts the rollout instead of taking the service down" },
    { text: "It deletes all old pods immediately for a clean cut-over" },
    { text: "It doubles the number of pods permanently" }
  ]}
  correct={1}
  explanation="Readiness gates traffic. Because old pods are retired only after new ones report ready, a broken new version that fails readiness simply never receives traffic and the rollout stalls — a self-protecting deploy."
  revisit={{ to: "/docs/cloud/cloud-kubernetes#scheduling-health-and-rolling-updates", label: "Health probes" }}
/>

<Question
  prompt="What's the difference between the Horizontal Pod Autoscaler and the Cluster Autoscaler?"
  options={[
    { text: "They're two names for the same thing" },
    { text: "The HPA adds/removes pods based on a metric (load); the Cluster Autoscaler (or Karpenter) adds/removes nodes/VMs when pods can't be scheduled or nodes sit empty — they work together, pods first, machines to fit them" },
    { text: "The HPA scales databases; the Cluster Autoscaler scales caches" },
    { text: "The HPA runs in the browser; the Cluster Autoscaler runs on the server" }
  ]}
  correct={1}
  explanation="They operate at different layers: HPA changes the pod count for an app; the cluster autoscaler changes the number of underlying machines so those pods have somewhere to run. Pending pods with HPA maxed means you need node capacity."
  revisit={{ to: "/docs/cloud/cloud-kubernetes#autoscaling-two-different-knobs", label: "Autoscaling" }}
/>

<Question
  prompt="When is reaching for Kubernetes most likely the wrong call?"
  options={[
    { text: "When you have dozens of services and multiple teams" },
    { text: "For a solo project or early startup with one app + a database — a PaaS gives most of the self-healing and rolling-deploy benefit for a fraction of the operational burden" },
    { text: "When you need portability across clouds" },
    { text: "Whenever you use containers at all" }
  ]}
  correct={1}
  explanation="Kubernetes is a large operational commitment (upgrades, networking, RBAC, capacity, YAML). For small footprints a platform-as-a-service delivers self-healing and safe deploys without the burden; adopt K8s when many-service/multi-team/portability needs actually justify it."
  revisit={{ to: "/docs/cloud/cloud-kubernetes#why-it-matters--and-when-not-to-use-it", label: "When not to use it" }}
/>

</Quiz>

## What's next

→ Next: [GitOps & infrastructure-as-code at scale](./cloud-gitops) — how the same reconcile-loop idea governs your *whole* infrastructure from Git, plus IaC beyond intro Terraform, policy-as-code, and secrets management that holds up.
