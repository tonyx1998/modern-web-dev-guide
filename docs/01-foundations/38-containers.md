---
id: containers
title: 'Containers & orchestration: Docker and Kubernetes mental model'
sidebar_position: 38
sidebar_label: Containers & k8s
description: What a container actually is (and isn't), how Docker images work (layers, caching), when you need orchestration, and the Kubernetes mental model — without drowning you in YAML.
---

# Containers & orchestration: Docker and Kubernetes mental model

> **In one line:** A container is a lightweight, isolated process running with its own filesystem, network, and dependencies — packaged as an image that runs identically anywhere. Kubernetes is the orchestrator that runs, schedules, scales, and heals fleets of containers across many machines.

:::tip[In plain English]
"It works on my machine" stopped being a complete answer 15 years ago because of containers. A Docker image is a frozen snapshot of "the OS bits, your code, your dependencies — everything needed to run." Hand that image to any machine with Docker; it runs the same. Kubernetes (k8s) is the next step up: when you have 50 containers running across 20 machines and you want one of them restarted if it crashes, scaled up under load, and routed to via DNS — that's an orchestrator's job. Most teams use containers (huge value). Fewer need k8s; most are better served by Cloud Run / Fly / Render / Vercel that hide k8s.
:::

This page is the mental model. You can use containers without all of it, but understanding what's underneath makes the abstractions debuggable.

## What a container actually is

Despite the friendly UI, containers are not magic — they're **Linux processes with extra isolation features**.

Two kernel features do the work:

- **Namespaces** — give the process its own view of: filesystem, processes (PIDs), network (own IP, ports), users, hostname. The process sees PID 1 as itself, sees only its own files, has its own network interface.
- **cgroups** (control groups) — limit how much CPU, memory, IO, network the process can use. Hard caps + accounting.

A container is just: `unshare` the namespaces, `setrlimit`/cgroup the resources, `exec` your binary inside a chroot of your image. The Docker CLI hides the seventeen flags.

What it isn't:
- **Not a VM.** A VM virtualizes hardware; the guest kernel runs separately. A container shares the host kernel — much lighter, but tied to Linux-syscall compatibility.
- **Not a security boundary you can trust.** Container escapes happen. Don't run untrusted code in a container without a sandbox (gVisor, Firecracker) or VM-level isolation on top.

## Docker images: the layered filesystem

An image is a **stack of read-only layers**. Each `RUN`, `COPY`, etc. in your `Dockerfile` is a layer. When you run a container, Docker stacks a writable layer on top; changes during execution land there.

```dockerfile
FROM node:22-alpine                       # layer 1: base OS + Node
WORKDIR /app                              # layer 2: cd /app
COPY package*.json ./                     # layer 3: just the manifest
RUN npm ci --omit=dev                     # layer 4: install deps
COPY . .                                  # layer 5: app source
RUN npm run build                         # layer 6: built output
CMD ["node", "dist/server.js"]            # layer 7: how to run
```

**Why this matters for performance**: layers are cached by content. If you change source code (layer 5), the rebuild redoes layers 5-6 but reuses 1-4 (which are cached). If you change `package.json`, all layers from 3 onward rebuild — `npm ci` is slow.

**The rule of layer caching**: put the *least frequently changed* things earliest. Dependencies before source. System packages before npm packages.

### Multi-stage builds

The image you ship shouldn't contain build tools — bigger image = slower deploys, more attack surface.

```dockerfile
# --- builder stage ---
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/server.js"]
```

Final image contains only what runtime needs — typically 10-100× smaller than the builder. Standard practice for any production image.

### Best practices for production Dockerfiles

- **Pin base images** to a specific tag (`node:22.5.0-alpine3.19`), not `latest`. Reproducible builds.
- **Use `-alpine` or `-slim` variants** when you can. Smaller, less attack surface.
- **Don't run as root inside the container.** `USER 1000` (or a named non-root user). Defense in depth against container escapes.
- **`.dockerignore`** to exclude `node_modules`, `.git`, `tests` — they bloat the image and break caching.
- **One process per container.** A web server + a worker in the same container is a Docker anti-pattern; orchestrator can't restart them independently.
- **`HEALTHCHECK`** so the orchestrator knows when the container is actually ready.
- **Set `WORKDIR`** explicitly; don't rely on default `/`.
- **Distroless or scratch** for compiled binaries (Go, Rust) — image with no shell, no package manager, just your binary.

## The container ecosystem

| Tool | Role |
|------|------|
| **Docker** | The dominant container engine on dev machines |
| **containerd** | The runtime inside Docker (and the standard runtime k8s uses) |
| **Podman** | Docker alternative, daemonless, rootless by default |
| **BuildKit** | Modern image builder, used inside Docker; faster, supports `RUN --mount=type=cache` |
| **Docker Compose** | Declarative multi-container dev environments (`docker-compose.yml`) |
| **Buildx** | Cross-platform builds (build ARM image from x86, etc.) |
| **OCI** (Open Container Initiative) | The standard. Images and runtimes from any conforming tool interoperate. |

For local dev: Docker Compose to spin up your app + Postgres + Redis. For shipping: build an OCI image, push to a registry (Docker Hub, GHCR, ECR, GCR, Artifact Registry), deploy via your platform.

## When you need orchestration

You don't need Kubernetes if:

- You run one or two services on a couple of VMs / a PaaS.
- You're on a managed platform (Vercel, Fly, Render, Railway, Cloud Run) that hides orchestration.
- You're a small team where "SSH in and restart" is a fine playbook.

You start to want orchestration when:

- You have many services (microservices or batch workers).
- You need automated scheduling — "place this container on a machine with capacity."
- You want self-healing — "if the container crashes or a node dies, restart elsewhere."
- You want declarative infrastructure — "I want 5 replicas of this; the system makes it true."
- You need service discovery — "find me an instance of the orders service."
- You want rolling deploys with health checks and auto-rollback.

You *can* build that with shell scripts and systemd. You *will* eventually reinvent half of Kubernetes badly. So at some scale, just use the tool.

## Kubernetes mental model

Kubernetes is **declarative**: you describe the desired state; controllers continuously work to make reality match.

The core objects:

| Object | What it is | Mental model |
|--------|-----------|--------------|
| **Pod** | One (or more co-located) container, with shared net/storage | The atomic unit. Usually 1 container per Pod. |
| **Deployment** | "I want N replicas of this Pod template" | The controller that creates/updates Pods. Rolling deploys live here. |
| **Service** | A stable internal DNS name + load balancer in front of Pods | Service discovery. Pods come and go; the Service name stays. |
| **Ingress** | HTTP routing into the cluster (host/path → Service) | The L7 traffic router. nginx, Traefik, ALB, etc. implement it. |
| **ConfigMap** | Non-secret key/value config | `env vars` you mount into Pods |
| **Secret** | Like ConfigMap but base64-encoded (and ideally encrypted at rest) | API keys, certs |
| **Namespace** | A scope inside the cluster | Per-team or per-environment partitioning |
| **Node** | A machine (VM or physical) running Pods | The capacity provider |
| **PersistentVolume** | A disk that survives Pod restart | DB storage, file storage |
| **DaemonSet** | "Run one of these on every node" | Log collectors, monitoring agents |
| **CronJob** | Scheduled batch jobs | The cron of Kubernetes |
| **Job** | One-off batch task | DB migrations, one-time scripts |
| **HPA** (HorizontalPodAutoscaler) | Auto-scale Pod count based on CPU/memory/custom metrics | "When load grows, add more Pods" |

A minimal Deployment + Service in YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders
spec:
  replicas: 3
  selector:
    matchLabels:
      app: orders
  template:
    metadata:
      labels:
        app: orders
    spec:
      containers:
      - name: app
        image: registry.example.com/orders:v1.2.3
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef: { name: db, key: url }
        readinessProbe:
          httpGet: { path: /healthz, port: 8080 }
        resources:
          requests: { cpu: 100m, memory: 256Mi }
          limits:   { cpu: 500m, memory: 512Mi }
---
apiVersion: v1
kind: Service
metadata:
  name: orders
spec:
  selector:
    app: orders
  ports:
  - port: 80
    targetPort: 8080
```

> **In English:** "Run 3 copies of the `orders:v1.2.3` image, expose port 8080 inside the container, inject the DB URL from the `db` secret, mark the Pod ready when `/healthz` returns 200, and put a stable internal DNS name `orders` in front of all 3."

That's most of what 90% of teams' k8s YAML does.

### Why YAML is so verbose

The YAML is the *full desired state*, not a delta. So everything's explicit. To tame it, teams use:

- **Helm** — templated YAML with variables; the de-facto standard for shipping a service.
- **Kustomize** — overlays + patches; built into `kubectl`.
- **CDK8s, Pulumi** — write infrastructure in TypeScript / Python; emit YAML.

For a small app, raw YAML is fine. For a many-service product, Helm.

### The control plane

The "k8s API server" + a few controllers. Every change is a Kubernetes API call (kubectl is just a CLI wrapper). The controllers watch the API for "desired state" objects and reconcile reality:

- Deployment controller sees a new Deployment → creates ReplicaSet → creates Pods.
- Scheduler sees an unscheduled Pod → picks a node with capacity → assigns it.
- Kubelet on each node sees Pods assigned to it → starts the containers.
- Service controller sees a Service → tells kube-proxy/iptables how to route to the matching Pods.

You'll mostly never touch any of that — but it explains why "kubectl apply" sometimes feels delayed: there's a loop walking everything to consistency.

## When to *not* run your own Kubernetes

Running your own k8s cluster is a non-trivial ops job: control plane upgrades, certificate renewal, networking quirks, IAM integration. Managed alternatives:

- **EKS / GKE / AKS** — cloud-managed k8s control plane. You still run the data plane (nodes); they handle the masters.
- **EKS Fargate, GKE Autopilot** — *they* even run your nodes. You just submit Pods.
- **Cloud Run, ACI, App Runner** — container-as-a-service. Bring your image; they handle scaling, networking, health. No k8s exposure.
- **Fly.io, Render, Railway, Koyeb** — modern container PaaS. Often nicer DX than vanilla k8s.

For an app that doesn't have specific k8s requirements, **Cloud Run / Fly / Render is faster to ship and cheaper to operate**. Don't pick k8s because the resume says you should.

## Stateful workloads in containers

The internet meme: "you should never run a database in a container."

The truth: you *can* run databases in containers, but you must understand:

- Containers are ephemeral by default. State has to go on a `PersistentVolume`.
- Kubernetes' **StatefulSet** is the right object for stateful (gives stable pod names + per-pod storage).
- For production databases, **managed services** (RDS, Cloud SQL, Neon, Supabase) are usually the right move — they handle backups, failover, patching, which are the hard parts.
- For dev / test / non-critical: container databases are fine.

## Networking

A container has its own network namespace. Communication patterns:

| Pattern | How |
|---------|-----|
| Container → host service | `host.docker.internal` (Docker Desktop), or host IP |
| Container → container, same machine | Docker network (`--network`) — they share a virtual switch |
| Pod → Pod, same cluster (k8s) | Pod IP directly; or via Service DNS (`http://orders/`) |
| Pod → external internet | NAT through the node |
| External → Pod | Service of type LoadBalancer, or Ingress |

In k8s, **Service DNS** is the magic. Inside the cluster, `http://orders/` resolves to one of the Service's backend Pods. No hardcoded IPs.

For service-to-service security: **mTLS via a service mesh** (Istio, Linkerd, Consul) — every Pod gets a sidecar that handles encryption and identity. Defense in depth against a compromised Pod talking to others.

## Image registries and supply chain

Where do images live?

- **Docker Hub** — public default, paid tiers for private images.
- **GitHub Container Registry (GHCR)** — free for public, integrated with GitHub Actions.
- **AWS ECR, Google Artifact Registry, Azure Container Registry** — cloud-native.
- **Self-hosted Harbor** — for big shops wanting control.

Supply chain hygiene:

- **Pin image tags by digest** (`@sha256:...`) for prod, not just tags. A tag can be re-pointed; a digest can't.
- **Scan images** — Trivy, Snyk, GitHub's own. CI step on every build.
- **Sign images** — Cosign + Sigstore. Verify at deploy time.
- **Minimize base** — distroless or scratch where possible; reduces CVE surface.

## Observability for containers

Logs: stdout/stderr. The container runtime collects them; your log shipper (Vector, Fluent Bit, the cloud's native collector) forwards to a central store.

Metrics: Prometheus is the de facto k8s standard. Containers expose metrics on `/metrics`; Prometheus scrapes.

Traces: OpenTelemetry, propagated via sidecars or in-process SDK.

See [Observability fundamentals](./observability-fundamentals).

## Common mistakes

:::caution[Where people commonly trip up]
- **Latest tag in production.** `image: app:latest` deploys whatever was tagged latest when the Pod started — non-reproducible. Pin a version (`app:v1.2.3`) or a digest.
- **Building dev images for prod.** Shipping the build tools + dev deps + source code = bloated, attack-surface-rich image. Multi-stage build, ship only runtime.
- **Running as root in container.** Container escapes that *would* be contained instead get root on the host. Use `USER` directive.
- **One giant Dockerfile that rebuilds everything on every change.** Layer caching saves minutes per build. Put dependencies in their own layer, before source code.
- **No `.dockerignore`.** `COPY . .` includes `node_modules`, `.git`, your local Postgres data dir. Build context balloons, cache breaks, secrets in `.env.local` get baked in.
- **Mounting secrets via env-from-file in image.** Now the secret is in the image layers. Use orchestrator-level secret mounts (k8s `Secret`, Docker `--secret`), not `COPY .env`.
- **Picking Kubernetes for a 2-service app.** k8s' complexity payoff curve doesn't start until you have many services or specific operational needs. Cloud Run / Fly / Render until you can articulate why k8s.
- **No `requests` / `limits` on Pods.** Pods take whatever they want, evict each other, or get OOM-killed unpredictably. Set explicit requests (the floor) and limits (the ceiling) on CPU and memory.
- **`readinessProbe` that returns 200 immediately.** Pod marked ready before it can actually serve traffic; first 1000 requests fail. Probe should check real dependencies (DB connection, cache).
- **Stateful workloads on emptyDir.** Restart the Pod, lose all data. Use `PersistentVolume` for anything you don't want to lose, or move stateful to a managed service.
- **Trying to read into a running container in prod via `kubectl exec`.** Sometimes necessary for diagnosis, but treat as last resort — every prod debug should improve observability so next time you don't need to.
- **No image scanning in CI.** Vulnerabilities pile up in base images. Scan on every build; block deploys for high-severity CVEs.
:::

## Page checkpoint

<Quiz id="foundations-containers-page" title="Did containers & orchestration stick?" sampleSize={3}>

<Question
  prompt="What's the right way to think about a Docker container in terms of OS-level mechanisms?"
  options={[
    { text: "A miniature virtual machine with its own kernel" },
    { text: "A regular Linux process given its own filesystem/network/PID namespace (via the `namespaces` kernel feature) and resource limits (via `cgroups`); it shares the host kernel, which is what makes it lightweight" },
    { text: "An emulator running the same code multiple times" },
    { text: "A WebAssembly sandbox" }
  ]}
  correct={1}
  explanation="Containers aren't VMs. They're regular Linux processes with extra kernel-level isolation. That's what makes them so much lighter than VMs — and also why container escapes are a real concern (a kernel bug breaks the isolation)."
  revisit={{ to: "/docs/foundations/containers#what-a-container-actually-is", label: "What a container is" }}
/>

<Question
  prompt="A team's Docker builds take 8 minutes every time, even when only source code changed. Most likely cause and fix?"
  options={[
    { text: "The Dockerfile is too short" },
    { text: "Layer caching is broken because `COPY . .` happens before `npm install` (or similar). Restructure so dependency-manifest layers come before source — change source = rebuild only the source + build layers; deps stay cached" },
    { text: "Docker requires a faster CPU" },
    { text: "Multi-stage builds slow things down" }
  ]}
  correct={1}
  explanation="Layer cache invalidates everything from the changed layer onward. Put rarely-changed inputs (system packages, dependency manifests) early; frequently-changed (source code) late. A source change shouldn't trigger a full reinstall."
  revisit={{ to: "/docs/foundations/containers#docker-images-the-layered-filesystem", label: "Layer caching" }}
/>

<Question
  prompt="A 3-engineer team building a SaaS with 2 services picks Kubernetes for deployment. They spend 30% of their engineering time on cluster ops. What's the right call?"
  options={[
    { text: "Hire a dedicated DevOps team" },
    { text: "Move to a managed container PaaS (Cloud Run, Fly.io, Render, Railway). k8s' complexity payoff is for many services, complex scheduling, or specific compliance/customization needs — none of which a 3-person 2-service team is hitting" },
    { text: "Switch to bare metal" },
    { text: "Buy more cluster nodes" }
  ]}
  correct={1}
  explanation="k8s is powerful, but the complexity tax is high. For small teams without specific k8s needs, container PaaS hides almost all of it. You get image-based deploys, autoscaling, rolling updates without operating the cluster yourself."
  revisit={{ to: "/docs/foundations/containers#when-to-not-run-your-own-kubernetes", label: "When NOT k8s" }}
/>

<Question
  prompt="In Kubernetes, what's the relationship between a Deployment, a ReplicaSet, and a Pod?"
  options={[
    { text: "They're the same thing" },
    { text: "Deployment is the high-level intent ('I want N replicas of this image, rolling update on change'). It creates a ReplicaSet, which manages a set of identical Pods. The Deployment swaps ReplicaSets during rolling deploys" },
    { text: "Pods create Deployments" },
    { text: "ReplicaSet is for one-off jobs" }
  ]}
  correct={1}
  explanation="Deployment → ReplicaSet → Pods. The Deployment expresses intent; the ReplicaSet enforces 'N copies of this Pod template'; the Pod is the runtime unit. Rolling updates create a new ReplicaSet, scale it up while scaling the old one down."
  revisit={{ to: "/docs/foundations/containers#kubernetes-mental-model", label: "Deployment/ReplicaSet/Pod" }}
/>

</Quiz>

## What's next

→ Continue to [Edge computing](./edge-computing).
