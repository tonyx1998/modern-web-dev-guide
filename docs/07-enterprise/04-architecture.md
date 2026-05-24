---
id: architecture
title: 'Phase 3: Architecture'
sidebar_position: 5
sidebar_label: 4. Architecture
description: Microservices, API gateways, service meshes, event buses, and internal developer platforms at enterprise scale.
---

# Phase 3: Architecture

> **In one line:** At enterprise scale, the system is a fleet of microservices behind an API gateway, glued together by a service mesh and an event bus, supported by an internal developer platform that hides the complexity from product engineers.

:::tip[In plain English]
A startup typically runs a single Next.js app talking to a single Postgres database. An enterprise typically runs hundreds or thousands of small services, each owned by a different team, each with its own database, talking to each other through standardized communication layers.

Why? Because at this scale, no single team can know the whole codebase, and any change anywhere needs to be safe. Splitting the system into independently-owned services lets each team move at its own pace without breaking each other.
:::

## Microservices and SOA

**Microservices** (many small, independently-deployed services each owning one capability) or **service-oriented architecture (SOA)** (the older, broader umbrella term for the same idea) is the norm at this scale:

- Dozens to thousands of services.
- Each service is owned by a specific team.
- Database-per-service pattern: each service owns its data; other services access it only via the service's API.
- Services communicate via **gRPC** (a high-performance binary RPC protocol, typically used inside the cluster), REST/GraphQL (external), or events (Kafka).

:::info[Jargon (used throughout this page)]
- **API Gateway** — a single entry point that authenticates external requests, enforces rate limits, and routes them to the right backend service.
- **BFF** (Backend-for-Frontend) — a thin service tailored to one client (web, mobile, partner API) that stitches together calls to the underlying microservices.
- **Service mesh** — a layer of sidecar proxies (usually Envoy) injected next to each service that handles cross-cutting concerns like encryption and retries without each service having to.
- **mTLS** (mutual TLS) — both sides of a connection prove their identity with certificates; standard for service-to-service encryption.
- **Event bus** — a durable message stream (typically Kafka) where services publish events and other services subscribe, decoupling producers from consumers.
- **Multi-AZ** — deployed redundantly across multiple cloud Availability Zones so a single data-center failure doesn't take you down.
:::

```mermaid
flowchart TB
    Users["External users"]
    CDN["CDN / Edge — Cloudflare, Akamai, Fastly"]
    LB["Load balancers — regional, multi-AZ"]
    GW["API Gateway — auth, rate limit, routing"]
    subgraph BFFs["Backend-for-Frontend layer"]
        WebBFF["Web BFF"]
        MobBFF["Mobile BFF"]
        PartGW["Partner API Gateway"]
    end
    Mesh["Service Mesh — Istio / Linkerd — mTLS, retries, circuit breakers, tracing"]
    subgraph Services["Microservices — each with its own DB, cache, queue"]
        UserSvc["User"]
        OrderSvc["Order"]
        PaySvc["Payments"]
        CatSvc["Catalog"]
        SearchSvc["Search"]
        NotifSvc["Notifications"]
    end
    subgraph Shared["Shared infrastructure"]
        Kafka["Kafka — event bus"]
        Schema["Schema registry"]
        Vault["Vault — secrets"]
        Obs["Datadog — observability"]
        Flags["LaunchDarkly / Statsig — flags"]
        IDP["Internal developer platform"]
        DW[("Snowflake / BigQuery — warehouse")]
    end
    Users --> CDN --> LB --> GW --> BFFs --> Mesh --> Services
    Services --> Kafka
    Services --> Obs
```

## Key architectural components

**API Gateway:** Routes external traffic, handles auth, rate limiting, request validation. Options: Kong, AWS API Gateway, custom-built.

**Service mesh:** Handles service-to-service concerns: mTLS, retries, timeouts, circuit breaking, load balancing, distributed tracing. Options: Istio, Linkerd, Consul Connect.

**Event bus:** Async communication between services. Services publish events; other services subscribe. Decouples services and provides durability. Options: Apache Kafka (dominant), Apache Pulsar, AWS Kinesis, Google Pub/Sub.

**Schema registry:** Enforces contracts between services. Protocol Buffers (Protobuf) or Avro schemas. Producers can't ship breaking changes to event schemas without consumers' consent.

**Feature flag system:** Controls rollouts at fine granularity. LaunchDarkly is dominant; Statsig is rising.

**Distributed caching:** Redis Cluster, Memcached. Reduces DB load.

**Data warehouse:** Snowflake, BigQuery, Databricks. Analytics and ML.

:::info[Highlight: the "database-per-service" rule]
The single most important microservices discipline is **don't share a database between services**. The moment two services talk to the same database, you no longer have two services — you have one service with two front doors and a hidden coupling that will break in production.

The whole point of a service is that it can change its internal data model without coordinating with every other team in the company. Lose that, and you have all the cost of microservices with none of the benefit.
:::

## Internal Developer Platform (IDP)

An IDP abstracts cloud complexity from product engineers. Could be Backstage-based or custom. A mature IDP provides:

- **Service templates** (create a new service from a template).
- **Deployment tooling.**
- **Observability dashboards** per service.
- **Documentation portal.**
- **Service catalog.**

The goal is for a product engineer to type one command, get a fully-provisioned new service with CI/CD, observability, secrets management, and on-call rotation, and have it deployed to production within a day — without ever touching Kubernetes manifests directly.

:::note[Worked example: from "I want a new service" to running in prod]
At a well-tooled enterprise:

1. Engineer runs `acme service new --template=grpc-go --team=payments`.
2. The IDP generates a repo, registers it in Backstage, creates dashboards, sets up CI/CD, and opens a PR with starter code.
3. Engineer writes the business logic.
4. CI builds, tests, and deploys to staging.
5. Engineer merges to main; canary rollout begins.
6. By end of day, the new service is in production, observable, on-call rotated.

At a less-tooled enterprise, that same process takes 3–6 weeks of tickets to platform teams. The difference is what "good platform engineering" buys you.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Splitting services along org-chart lines instead of data boundaries.** When two teams share a domain (e.g., "users" and "auth"), one service per team usually means two services with one shared database — the worst case. Split on the data; merge if two services always change together.
- **Skipping the schema registry "for now."** Producers ship a "small" change, a consumer breaks in production at 3 AM, and the post-mortem concludes "we should have had contracts." Bake the registry in from service one — retrofitting it across 80 services later is a year of work.
- **Adopting a service mesh before you have service-mesh problems.** Istio with three services is the most complex thing in your system. Wait until you have 30+ services and the mTLS/retry/tracing overhead from rolling your own is genuinely worse than running the mesh.
- **Building an IDP that mirrors your platform team's mental model.** Backstage with twenty plugins nobody installed isn't a platform — it's an internal Wikipedia. Talk to product engineers about their actual onboarding pain before adding another tab.
- **Treating "API gateway" as the answer to internal traffic too.** Gateways are for *external* requests (auth, rate limits, routing). Sending every internal gRPC call through the gateway turns a single point of compliance into a single point of failure.
:::

## Page checkpoint

<Quiz id="enterprise-architecture-page" title="Did enterprise architecture stick?" sampleSize={2}>

<Question
  prompt="What is the single most important discipline in a microservices architecture?"
  options={[
    { text: "Use gRPC for every internal call" },
    { text: "Don't share a database between services — each service owns its own data" },
    { text: "Deploy every service through the same pipeline" },
    { text: "Always run an API gateway in front" }
  ]}
  correct={1}
  explanation="The database-per-service rule is the load-bearing piece. The moment two services share a database, you no longer have two services — you have one service with two front doors and a hidden coupling that will break in production."
  revisit={{ to: "/docs/enterprise/architecture#key-architectural-components", label: "Database-per-service" }}
/>

<Question
  prompt="What problem does a service mesh primarily solve?"
  options={[
    { text: "It replaces the database for each microservice" },
    { text: "It handles cross-cutting service-to-service concerns — mTLS, retries, timeouts, circuit breaking, tracing — without each service implementing them" },
    { text: "It exposes services to external users" },
    { text: "It schedules pods onto Kubernetes nodes" }
  ]}
  correct={1}
  explanation="A service mesh injects sidecar proxies (typically Envoy) next to each service to handle mTLS, retries, circuit breaking, and tracing transparently. Without it, every microservice would have to reimplement those concerns itself."
  revisit={{ to: "/docs/enterprise/architecture#key-architectural-components", label: "Service mesh" }}
/>

<Question
  prompt="At a well-tooled enterprise with a mature Internal Developer Platform, what's the target experience for spinning up a new service?"
  options={[
    { text: "Three to six weeks of tickets to platform teams" },
    { text: "Engineer writes raw Kubernetes manifests, Terraform, and CI configs by hand" },
    { text: "One command produces a repo with CI/CD, observability, secrets, and on-call configured — deployed to prod within a day" },
    { text: "It requires approval from the CTO" }
  ]}
  correct={2}
  explanation="A mature IDP gives engineers a single command (e.g., 'acme service new') that scaffolds the repo, registers it in the service catalog, generates dashboards, sets up CI/CD, and gets the new service into production the same day — without ever touching raw Kubernetes."
  revisit={{ to: "/docs/enterprise/architecture#internal-developer-platform-idp", label: "IDP" }}
/>

<Question
  prompt="What is a Backend-for-Frontend (BFF)?"
  options={[
    { text: "A database optimized for frontend queries" },
    { text: "A thin service tailored to one client (web, mobile, partner API) that stitches together calls to underlying microservices" },
    { text: "A frontend framework for building dashboards" },
    { text: "The same thing as an API gateway" }
  ]}
  correct={1}
  explanation="A BFF is a thin per-client service — web BFF, mobile BFF, partner BFF — that aggregates downstream microservice calls into a shape that fits that specific client. Different clients get different BFFs without bloating the underlying services."
  revisit={{ to: "/docs/enterprise/architecture#microservices-and-soa", label: "BFF" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3.5: Frontend Architecture at Scale](./frontend-architecture) — frontend at this scale is its own discipline, with design systems and micro-frontends.
