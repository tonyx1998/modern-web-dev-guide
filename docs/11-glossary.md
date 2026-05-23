---
id: glossary
title: 12. Glossary
sidebar_position: 12
sidebar_label: 12. Glossary
description: Quick-reference definitions for every term used in the series.
---

# Part 12: Glossary

*Quick-reference definitions for every term used throughout this series.*

:::tip[Beginner orientation]
**How to use the glossary:** This isn't meant to be read top-to-bottom. Use the search bar (top right of the site) or Ctrl/Cmd-F to jump to a specific term. Every term you encounter in the other chapters is defined here in plain English.

**If you're a total beginner, the most useful terms to skim first:** *HTTP, HTTPS, DNS, server, client, API, REST, JSON, database, SQL, framework, frontend, backend, deployment, CI/CD, environment variable, repository, branch, pull request.* If those nineteen terms feel familiar, you have a solid working vocabulary.
:::

Terms are alphabetized, then organized by their first letter. Cross-references appear in *italics*.

---

## A

**A11y** — Shorthand for "accessibility" (11 letters between the A and Y). The practice of building software usable by people with disabilities.

**ABAC (Attribute-Based Access Control)** — Authorization model where permissions depend on attributes of the user, resource, and context. Contrast with *RBAC*.

**ACID** — Atomicity, Consistency, Isolation, Durability. Guarantees provided by traditional relational databases.

**ADR (Architecture Decision Record)** — A short document recording why an architectural decision was made, what alternatives were considered, and what the consequences are. *See: [The Documentation Trade-Off](/docs/decisions/documentation-tradeoff).*

**Agent (AI)** — An LLM-based system that plans and executes multi-step actions by calling tools, observing results, and continuing until a task is complete. *See: [Pattern 4: Agentic Workflows](/docs/ai/ai-agents).*

**Algorithm** — A defined sequence of steps to solve a problem. In CS interviews, often refers to standard techniques like binary search, BFS/DFS, dynamic programming.

**API (Application Programming Interface)** — A defined contract that lets one piece of software interact with another. On the web, usually HTTP-based.

**API Gateway** — A server that sits in front of backend services, handling cross-cutting concerns like authentication, rate limiting, and request routing.

**AppSec (Application Security)** — The discipline of securing software applications. Includes code review, threat modeling, penetration testing.

**Argon2** — A modern password hashing algorithm. Better than bcrypt for new applications.

**Astro** — A web framework optimized for content-heavy sites. Ships zero JavaScript by default; uses "islands" of interactivity.

**Autoscaling** — Automatically adjusting compute capacity based on load.

**AWS (Amazon Web Services)** — The largest cloud provider. Hundreds of services.

**Axum** — A modern Rust web framework.

---

## B

**Backstage** — Spotify's open-source internal developer portal, widely used as a service catalog.

**BaaS (Backend as a Service)** — Services like Supabase or Firebase that provide ready-made backends.

**Bazel** — Google's monorepo build system. Used by many large companies.

**bcrypt** — A widely-used password hashing algorithm. Older than *Argon2* but still common.

**BFF (Backend For Frontend)** — A backend service tailored to a specific frontend (web BFF, mobile BFF), aggregating data from underlying services.

**Biome** — A fast, unified linter and formatter written in Rust. Increasingly replaces ESLint + Prettier.

**BFS (Breadth-First Search)** — Graph traversal algorithm; visits nearest neighbors first.

**Blue/Green Deployment** — A strategy where two identical environments run; traffic switches between them for zero-downtime deploys and easy rollback.

**Bun** — A JavaScript runtime, package manager, bundler, and test runner. Faster than Node + npm.

**Bundler** — A tool that combines JavaScript modules into deployable bundles. Examples: Webpack, Vite, Turbopack, esbuild.

---

## C

**Cache-Control** — HTTP header that tells browsers and CDNs how to cache responses.

**Canary Deployment** — Rolling out a new version to a small percentage of users first to detect problems before full rollout.

**CCPA (California Consumer Privacy Act)** — California's data privacy law. Similar in spirit to GDPR.

**CDN (Content Delivery Network)** — A globally distributed network of servers that caches content close to users. Examples: Cloudflare, Akamai, Fastly.

**Chaos Engineering** — Deliberately breaking things in production to verify resilience. Pioneered by Netflix's Chaos Monkey.

**Chunking (in RAG)** — Splitting large documents into smaller pieces for embedding and retrieval.

**CI (Continuous Integration)** — Automatically running tests and checks on every code change.

**CD (Continuous Deployment / Delivery)** — Continuous Deployment: every change automatically deploys to production. Continuous Delivery: every change is *deployable*, but a human triggers actual deployment.

**Clerk** — A popular drop-in auth-as-a-service for modern web apps.

**Client Component** — In React, a component that runs in the browser (and is also pre-rendered on the server for initial HTML).

**Cloudflare** — A major CDN, edge platform, and infrastructure provider. Workers, Pages, R2, D1, KV are key products.

**Cloudflare R2** — S3-compatible object storage with no egress fees.

**CMS (Content Management System)** — Software for managing content (e.g., WordPress, Sanity, Contentful).

**CodeQL** — GitHub's semantic code analysis tool for finding security vulnerabilities.

**Cohort Analysis** — Analyzing groups of users defined by shared characteristics (e.g., users who signed up in the same month).

**Compositing** — In browser rendering, combining layers into the final image (often on the GPU).

**CORS (Cross-Origin Resource Sharing)** — HTTP mechanism for letting one domain's JS access resources on another domain.

**CQRS (Command Query Responsibility Segregation)** — Architectural pattern separating write models from read models.

**CRDTs (Conflict-free Replicated Data Types)** — Data structures that converge correctly under concurrent updates. Used for collaborative editing.

**CRUD (Create, Read, Update, Delete)** — The basic operations on data; most web apps mostly do CRUD.

**CSP (Content Security Policy)** — HTTP header that restricts what resources a page can load, mitigating XSS.

**CSR (Client-Side Rendering)** — Rendering HTML in the browser via JavaScript, after the page loads. Contrast with *SSR*, *SSG*.

**CSRF (Cross-Site Request Forgery)** — Attack where a malicious site causes a user's browser to perform actions on another site they're logged into. Mitigated with SameSite cookies and CSRF tokens.

**CSS (Cascading Style Sheets)** — The styling language of the web.

**CSS Modules** — A CSS technique where class names are automatically scoped to the file they're defined in.

---

## D

**DAST (Dynamic Application Security Testing)** — Security testing that probes running applications. Contrast with *SAST*.

**DB (Database)** — Where persistent data lives.

**Dead Code Elimination** — Build optimization that removes code that's never executed.

**Defer (script)** — `<script defer>` tells the browser to download the script asynchronously but execute it after the document is parsed.

**Deno** — A JavaScript runtime, alternative to Node. Built by the original creator of Node.

**Dependency Injection** — Pattern where a function or class receives its dependencies as parameters rather than constructing them itself.

**DevEx (Developer Experience)** — The quality of life for developers using tools or working in a codebase.

**DevOps** — Practices and culture combining software development and IT operations.

**DFS (Depth-First Search)** — Graph traversal algorithm; goes deep before backtracking.

**Diff** — Difference between two versions of files. Git diffs show what changed.

**Distributed System** — A system whose components run on multiple networked computers.

**DKIM (DomainKeys Identified Mail)** — Email authentication; signs outgoing email so recipients can verify the sender.

**DMARC** — Email authentication policy framework; tells receivers what to do with unauthenticated email.

**DNS (Domain Name System)** — The internet's naming system; translates domain names to IP addresses.

**Docker** — Containerization platform; runs applications in isolated environments.

**DOM (Document Object Model)** — The browser's in-memory representation of a webpage.

**Doppler** — A secrets management service for development teams.

**Drizzle** — A TypeScript-first ORM popular in 2026 for its lightweight, SQL-like API.

**Durable Object** — Cloudflare's stateful primitive at the edge; a single object instance with persistent storage.

---

## E

**E2E (End-to-End) Testing** — Testing the entire application by simulating user interactions, typically with a real browser.

**Edge Computing** — Running code geographically close to users, often at CDN points of presence.

**Edge Function** — Server function that runs at the edge (e.g., Cloudflare Workers, Vercel Edge Functions).

**Embeddings** — Numerical vector representations of text, images, or other data. Similar items have similar vectors. *See: [Pattern 5: Embeddings for Semantic Search](/docs/ai/ai-embeddings).*

**ESM (ECMAScript Modules)** — The standard JavaScript module system. `import` and `export`.

**ESLint** — A JavaScript linter. Being replaced by *Biome* in many new projects.

**Etag** — HTTP header containing a version identifier for a resource; used for cache validation.

**Eventual Consistency** — Distributed systems property where data eventually converges to consistent state, but may be temporarily inconsistent.

**Express** — A minimal Node.js web framework, dominant for many years; now being supplanted by Hono, Fastify.

---

## F

**Fastify** — A fast Node.js web framework, popular alternative to Express.

**FedRAMP** — US federal government cloud security authorization.

**Feature Flag** — A toggle that enables or disables a feature without redeploying code.

**FERPA** — US law protecting student education records.

**Figma** — The dominant collaborative design tool.

**FinOps** — Financial operations for cloud spending; a discipline of cost management.

**Flexbox** — A CSS layout model for one-dimensional arrangements.

**FOIT (Flash of Invisible Text)** — When custom fonts cause text to be invisible until the font loads. Mitigate with `font-display: swap`.

**Fly.io** — A platform for running apps in containers across many global regions.

**Function Calling** — Pattern where an LLM produces structured calls to predefined functions/tools. *See: [Pattern 3: Function Calling](/docs/ai/ai-function-calling).*

---

## G

**GCP (Google Cloud Platform)** — Google's cloud, third-largest after AWS and Azure.

**GDPR (General Data Protection Regulation)** — EU privacy law. Affects any company with EU users.

**GitHub** — The dominant Git hosting platform, owned by Microsoft.

**GitOps** — Operations driven by Git: the desired infrastructure state is described in Git, and a controller continuously reconciles real state with desired state.

**GLBA (Gramm-Leach-Bliley Act)** — US law requiring financial institutions to safeguard customer data.

**GraphQL** — A query language for APIs; clients specify exactly what data they want.

**Grid (CSS)** — Two-dimensional CSS layout system.

**gRPC** — A high-performance binary RPC framework, used heavily for internal service communication.

---

## H

**Hallucination (AI)** — When an LLM produces confident but false output (a made-up citation, a non-existent API, an invented fact). The dominant correctness failure mode for LLMs; mitigated with RAG, citations, validation, and evals. *See: [AI Safety and Privacy](/docs/ai/ai-safety).*

**Hashing** — Converting input data into a fixed-size value. Used for passwords (one-way), data integrity checks, etc.

**Headless CMS** — A CMS that provides only the content API, leaving the frontend entirely to you.

**Helm** — Kubernetes package manager; charts define applications and their dependencies.

**HIPAA** — US law protecting healthcare information.

**Hono** — A fast, edge-friendly web framework that runs on any JavaScript runtime. Rising star in 2026.

**HSTS (HTTP Strict Transport Security)** — HTTP header that tells browsers to always use HTTPS for a domain.

**HTML (HyperText Markup Language)** — The structural language of web pages.

**HTTP (HyperText Transfer Protocol)** — The protocol web clients and servers use to communicate.

**HTTPS** — HTTP over TLS (encrypted).

**HTTP/2** — Newer HTTP version with multiplexing.

**HTTP/3** — Newest HTTP version, runs over QUIC (UDP-based).

**Hydration** — Process of attaching JavaScript event handlers to server-rendered HTML, making it interactive.

---

## I

**IaC (Infrastructure as Code)** — Defining infrastructure in version-controlled code rather than manual configuration.

**IAM (Identity and Access Management)** — Managing user identities and what they can access.

**Idempotent** — An operation that has the same effect when performed multiple times as when performed once.

**IndexedDB** — Browser-side database for large structured data.

**Inngest** — A modern, durable workflow execution platform.

**Internationalization (i18n)** — Designing software to support multiple languages and regions.

**ISR (Incremental Static Regeneration)** — Hybrid rendering strategy: static pages that are regenerated on a schedule or on demand.

**Istio** — A popular service mesh for Kubernetes.

---

## J

**JIT (Just-In-Time) Compilation** — Compiling code at runtime rather than ahead of time. Used by V8 and other JS engines.

**JSX** — JavaScript extension that lets you write HTML-like syntax in React.

**JWT (JSON Web Token)** — A self-contained, signed token used for authentication. Encodes user info in a base64-encoded JSON payload.

:::note[Example]
A JWT looks like `xxxxx.yyyyy.zzzzz` — three base64 sections separated by dots: a *header* (algorithm), a *payload* (user claims like `{ "sub": "user_123", "exp": 1735689600 }`), and a *signature*. Servers verify the signature with a secret or public key, then trust the claims.
:::

---

## K

**Kafka** — A distributed event streaming platform; dominant for event-driven architectures at scale.

**Kubernetes (K8s)** — Container orchestration system; the dominant platform for running containers at scale.

---

## L

**Laravel** — A popular PHP web framework.

**Latency** — Time delay between a request and a response.

**LCP (Largest Contentful Paint)** — Core Web Vital measuring when the largest visible element renders.

**Linter** — A tool that analyzes code for potential errors and style violations.

**LLM (Large Language Model)** — Neural network trained on huge text datasets to generate text. Examples: GPT, Claude, Gemini, Llama. *See: [AI Integration overview](/docs/ai/ai-integration).*

**Load Balancer** — A server that distributes incoming requests across multiple backend servers.

**Lockfile** — A file (e.g., `package-lock.json`, `bun.lock`) that records exact dependency versions for reproducible installs.

---

## M

**MAU (Monthly Active Users)** — Common SaaS metric; users who used the product at least once in the past month.

**MCP (Model Context Protocol)** — Open protocol introduced in late 2024 for exposing tools, resources, and prompts to AI clients in a standard way. By 2026, MCP servers are a common way to give AI assistants (Claude Code, Cursor, etc.) access to external data and actions.

**Meilisearch** — An open-source, fast search engine.

**Mesh (Service Mesh)** — Infrastructure layer that handles service-to-service concerns transparently. Istio, Linkerd.

**MFA (Multi-Factor Authentication)** — Authentication requiring multiple proofs (e.g., password + SMS code).

**Microservices** — Architectural style where an application is built as many small, independently deployable services.

**Migration** — A schema change to a database, applied as code.

**Modular Monolith** — Single-deployment application internally organized into modules with clear boundaries. The recommended pattern for small/medium teams. *See: [The Team Size Heuristic](/docs/decisions/team-size-heuristic).*

**Monorepo** — A single repository containing many projects or services.

**MPA (Multi-Page Application)** — A web application where each navigation is a full page load. Contrast with *SPA*.

**MTLS (Mutual TLS)** — TLS where both client and server authenticate each other.

---

## N

**Neon** — Serverless Postgres provider with database branching.

**Next.js** — The dominant React framework, by Vercel.

**NestJS** — An opinionated TypeScript backend framework with dependency injection.

**Node.js** — JavaScript runtime built on V8. The original way to run JS on servers.

**NoSQL** — Non-relational databases (document, key-value, graph, etc.).

**Nuxt** — The Vue equivalent of Next.js.

---

## O

**OAuth** — Authorization framework; powers "Sign in with Google" and similar flows.

**OIDC (OpenID Connect)** — Identity layer on top of OAuth 2.0.

**OKRs (Objectives and Key Results)** — Goal-setting framework; objectives are aspirational, key results are measurable.

**OpenAPI** — Specification format for REST APIs; tools can generate clients, docs, mocks from it.

**OpenTelemetry** — Vendor-neutral standard for instrumenting code with telemetry (logs, metrics, traces).

**ORM (Object-Relational Mapper)** — Library that maps database tables to programming-language objects. Drizzle, Prisma.

---

## P

**Pagination** — Splitting large result sets into smaller pages. Common styles: offset-based, cursor-based.

**Partial Prerendering (PPR)** — Newer rendering strategy: static shell with dynamic streamed-in sections. Next.js 15+.

**Passkey** — Modern passwordless authentication using public-key cryptography and biometrics. Supported via WebAuthn.

**PCI-DSS** — Payment Card Industry Data Security Standard; required for handling credit cards.

**PG (Postgres / PostgreSQL)** — Open-source relational database; the 2026 default for most new projects.

**pgvector** — Postgres extension for vector similarity search; popular for RAG applications. *See: [Pattern 2: RAG](/docs/ai/ai-rag).*

**PHP** — Server-side scripting language; powers WordPress and a large portion of the web.

**PII (Personally Identifiable Information)** — Information that can identify a specific individual.

**Pinecone** — Managed vector database for AI applications.

**PostHog** — Open-source product analytics platform; includes session replay and feature flags.

**Prisma** — A popular TypeScript ORM with schema-first design.

**Production** — The live environment used by real users.

**Progressive Delivery** — Deployment strategies that gradually expand a release (canary, percentage rollout, feature flags).

**Prompt Engineering** — Crafting input text to LLMs to get desired output.

**Prompt Injection** — Attack where user input attempts to override an LLM's instructions. *See: [AI Safety and Privacy](/docs/ai/ai-safety).*

**Protobuf (Protocol Buffers)** — Binary serialization format developed by Google; used heavily with gRPC.

**PR (Pull Request)** — Proposed change to a codebase, reviewed before merging.

**PRD (Product Requirements Document)** — A specification describing what a product or feature should do.

---

## Q

**Qdrant** — An open-source vector database.

**Query Builder** — Library that constructs database queries via code (e.g., Kysely).

**QUIC** — Transport protocol underlying HTTP/3; runs over UDP.

---

## R

**RAG (Retrieval-Augmented Generation)** — Pattern of giving an LLM relevant retrieved context to help it answer a question. *See: [Pattern 2: RAG](/docs/ai/ai-rag).*

**Railway** — A simple platform-as-a-service for running apps.

**RBAC (Role-Based Access Control)** — Authorization model where permissions are attached to roles, and roles are assigned to users.

**React** — A JavaScript library for building user interfaces from components. Maintained by Meta.

**React Server Components (RSCs)** — React components that render only on the server; can directly fetch data without API roundtrips.

**Redis** — In-memory data store; used for caching, sessions, queues.

**Remix** — A React framework focused on web standards; now merged with React Router v7.

**REST (Representational State Transfer)** — Architectural style for APIs using HTTP methods on resources.

**RFC (Request for Comments)** — A written proposal for a change, reviewed by peers before adoption. *See: [The Team Size Heuristic](/docs/decisions/team-size-heuristic).*

**RLS (Row-Level Security)** — Database-enforced rules about which rows each user can access.

**RPC (Remote Procedure Call)** — Calling a function on a remote system as if it were local. gRPC is a popular form.

**RSC** — See *React Server Components*.

**RUM (Real User Monitoring)** — Measuring performance from actual user sessions, not synthetic tests.

**Rust** — Systems programming language with memory safety guarantees.

---

## S

**S3 (Simple Storage Service)** — AWS's object storage service. The de facto standard; many providers offer S3-compatible APIs.

**SAML** — XML-based standard for enterprise single sign-on.

**Sanity** — A headless CMS.

**SAST (Static Application Security Testing)** — Security testing that analyzes source code without running it. Contrast with *DAST*.

**SCA (Software Composition Analysis)** — Scanning dependencies for known vulnerabilities.

**Schema** — The structure of data (database schema = tables and columns; API schema = endpoints and shapes).

**SCSS / Sass** — CSS preprocessors that add features like nesting and variables. Less common now that CSS itself has these features.

**SDK (Software Development Kit)** — A package providing tools/libraries for working with a service.

**Sentry** — Dominant error-tracking service.

**Serverless** — Cloud model where functions run on demand without provisioning servers. AWS Lambda, Cloudflare Workers.

**Server Action** — In Next.js, a server function that can be called directly from a client component.

**Server Component** — In React, a component that renders only on the server. Contrast with *Client Component*.

**Service Mesh** — See *Mesh*.

**Session** — Server-side state associated with a user between requests, typically tracked via a cookie.

**shadcn/ui** — A collection of accessible React components built on Radix and Tailwind; copy-paste rather than npm-install.

**Sharding** — Splitting data across multiple databases for scale.

**SIEM** — Security Information and Event Management. Centralized security log analysis.

**Single-Page App (SPA)** — App that loads once and updates content via JavaScript without full page navigations.

**SLA (Service Level Agreement)** — Contractual commitment to customers about service reliability.

**SLI (Service Level Indicator)** — A measurable signal of service quality (e.g., latency).

**SLO (Service Level Objective)** — Internal target for an SLI (e.g., "99.9% of requests under 200ms").

**SOAP** — Old XML-based API protocol; largely replaced by REST and gRPC.

**SOC 2** — Audit framework attesting to security practices.

**SoLid (SolidJS)** — A fast, fine-grained reactive UI library.

**Sourcemap** — File that maps minified production code back to original source for debugging.

**SOX (Sarbanes-Oxley)** — US law requiring financial controls in public companies.

**SPA** — See *Single-Page App*.

**SPF (Sender Policy Framework)** — Email authentication; specifies which servers are allowed to send mail for a domain.

**Spring Boot** — A popular Java backend framework.

**SQL (Structured Query Language)** — Standard language for relational database queries.

**SQLite** — A single-file relational database; lightweight, increasingly used in production at the edge.

**SSE (Server-Sent Events)** — Long-lived HTTP connection for server-to-client streaming. Used for LLM responses. *See: [Pattern 1: Streaming Chat](/docs/ai/ai-streaming-chat).*

**SSG (Static Site Generation)** — Rendering HTML at build time; serving as static files.

**SSO (Single Sign-On)** — Authenticating to multiple applications via one identity provider.

**SSR (Server-Side Rendering)** — Rendering HTML on the server for each request.

**Staging** — Pre-production environment for final testing.

**Stripe** — Dominant payments platform for developers.

**Supabase** — Open-source Firebase alternative; Postgres + auth + storage + realtime.

**Svelte** — A frontend framework that compiles components to vanilla JS at build time.

**SvelteKit** — Application framework for Svelte (analog to Next.js for React).

---

## T

**Tailwind CSS** — Utility-first CSS framework. Dominant in 2026.

**TanStack Query** — Library for managing server state in React (formerly React Query).

**TCP (Transmission Control Protocol)** — Reliable, connection-oriented transport protocol; underlies most internet traffic.

**Terraform** — Infrastructure-as-code tool from HashiCorp. *OpenTofu* is the open-source fork.

**TLS (Transport Layer Security)** — Encryption protocol for network traffic; HTTPS uses TLS.

**Token (auth)** — A string representing authentication; usually a *JWT* or a *session* identifier.

**Trigger.dev** — A modern, TypeScript-native background job platform.

**tRPC** — End-to-end type-safe API library for TypeScript stacks; no schemas needed.

**Trunk-Based Development** — Branching strategy where everyone commits to `main` (or short-lived branches that merge within hours).

**TS** — Shorthand for *TypeScript*.

**TTL (Time To Live)** — How long cached data is valid before being re-fetched.

**Turbopack** — Vercel's Rust-based bundler.

**Turborepo** — A build system for JavaScript monorepos.

**Turso** — A distributed SQLite service.

**TypeScript** — JavaScript with types; the modern web dev default.

**Typesense** — Modern, fast search engine.

---

## U

**UDP (User Datagram Protocol)** — Connectionless transport protocol; faster but less reliable than TCP. Used by HTTP/3 (QUIC).

**URL (Uniform Resource Locator)** — A web address.

**Upstash** — Serverless Redis provider.

---

## V

**V8** — Google's JavaScript engine; powers Chrome and Node.

**Valkey** — Open-source fork of Redis after Redis Labs's license change.

**Vector Database** — Database optimized for similarity search on high-dimensional vectors (embeddings). *See: [Pattern 2: RAG](/docs/ai/ai-rag).*

**Vercel** — Hosting platform optimized for Next.js and other frameworks.

**Vercel AI SDK** — Dominant TypeScript abstraction for LLM integrations.

**Vite** — Modern JavaScript build tool; very fast dev experience.

**Vitest** — A Vite-native test runner; replacing Jest in many projects.

**Vue** — Frontend framework; major alternative to React.

---

## W

**WAF (Web Application Firewall)** — Filters HTTP traffic to block attacks; Cloudflare offers one.

**WASM (WebAssembly)** — Binary instruction format that runs in browsers at near-native speed. Languages like Rust, C++, and Go can compile to WASM.

**WCAG (Web Content Accessibility Guidelines)** — Standards for web accessibility.

**WebAuthn** — Standard for passwordless authentication using public-key cryptography and biometrics. Powers passkeys.

**Webhook** — HTTP callback; one service calls a URL on another when an event happens.

**WebRTC** — Browser API for real-time peer-to-peer communication (video, audio, data).

**WebSockets** — Persistent, bidirectional connections between browser and server.

**WebTransport** — Modern low-latency, multiplexed connections over HTTP/3.

**WHATWG** — Web Hypertext Application Technology Working Group; the standards body for HTML and many web APIs.

**Wireframe** — Low-fidelity sketch of UI structure, used in design.

**WorkOS** — Service providing enterprise auth (SAML, SCIM) as an API.

---

## X

**XHR (XMLHttpRequest)** — The original way browsers made HTTP requests from JavaScript. Largely replaced by `fetch`.

**XSS (Cross-Site Scripting)** — Attack where malicious JS is injected into a page and runs in users' browsers. Mitigated by escaping output and CSP.

---

## Y

**Yarn** — A JavaScript package manager; alternative to npm. Yarn 4 (modern) is innovative but niche.

**Yjs** — A library for collaborative editing using CRDTs.

---

## Z

**Zod** — A TypeScript-first schema validation library. Pairs with everything.

**Zustand** — A small, popular global state management library for React.

---

## Closing Note

This concludes the comprehensive 2026 web development guide series. The eleven files cover:

- **00** — Introduction and reading guide
- **01** — Foundational concepts
- **02** — Universal development lifecycle
- **03** — The 2026 tech stack decoded
- **04** — Personal website / side project workflow
- **05** — Small company / startup workflow
- **06** — Large company / enterprise workflow
- **07** — Side-by-side comparison
- **08** — Decision frameworks
- **09** — AI integration patterns
- **10** — Career path and learning
- **11** — This glossary

Use them as reference, as study material, as a checklist when starting projects, or as a way to mentor others. Web development is a field where the fundamentals stay stable while the tools evolve constantly — the goal of this guide is to give you the fundamentals so you can adapt to whatever the tools become next.

Good luck building.
