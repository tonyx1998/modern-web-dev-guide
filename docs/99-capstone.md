---
id: capstone
title: "Final Capstone — the whole guide, one assessment"
sidebar_label: "Final capstone"
---

# Final Capstone — the whole guide, one assessment

You've read the full Modern Web Dev Guide — from HTTP and rendering through stack choices, cloud, operations, distributed systems, AI features, ecosystems, solo/startup/enterprise playbooks, decision frameworks, and career. This capstone is your **whole-guide certification**: one mixed quiz that draws from every chapter. Pass it and you can trust that the load-bearing ideas stuck, not just the chapter you read most recently.

There are **36 questions in the bank** — each visit picks **12 at random**. You need **≥ 75%** on the sample to pass. Miss one and the revisit link takes you straight to the section that explains it.

<Quiz id="final-capstone" sampleSize={12} passingScore={0.75}>

<Question
  prompt="A user's browser submits a POST to `/api/orders` twice because they double-clicked 'Place order.' The server creates two identical charges. Which HTTP property did the API design ignore?"
  options={[
    { text: "Safe methods never change server state — POST should have been GET" },
    { text: "Idempotency — duplicate POSTs are not automatically deduplicated the way a retry-safe PUT would be" },
    { text: "Cache-Control — the response should have been marked no-store" },
    { text: "Content negotiation — the client sent the wrong Accept header" }
  ]}
  correct={1}
  explanation="POST is neither safe nor idempotent. A double-click sends two requests and, without an idempotency key or server-side deduplication, you get two orders. That's a design problem, not a browser bug."
  revisit={{ to: "/docs/foundations/http-methods-and-status#http-methods-verbs", label: "HTTP Methods — verbs" }}
/>

<Question
  prompt="Your marketing site has the same hero and pricing for every visitor. Your logged-in dashboard shows user-specific data. Which rendering split matches the chapter's guidance?"
  options={[
    { text: "SSG or ISR for marketing pages; SSR (or CSR after auth) for the dashboard" },
    { text: "CSR for everything — one bundle simplifies deployment" },
    { text: "SSR for marketing (fresh on every request) and SSG for the dashboard" },
    { text: "Edge-render the database queries in the browser for lowest latency" }
  ]}
  correct={0}
  explanation="Static content that rarely changes is a natural fit for SSG/ISR — fast and cheap. Per-user dashboards need request-time data (SSR) or client fetch after login (CSR). Mix strategies by page, not by project."
  revisit={{ to: "/docs/foundations/rendering-strategies#the-three-pure-strategies-and-the-hybrids-on-top", label: "Rendering Strategies — SSG / SSR / CSR" }}
/>

<Question
  prompt="A user logs in with Google (proving who they are), then tries to open `/admin/users` and gets 403 Forbidden. What happened?"
  options={[
    { text: "Authentication failed — Google rejected the token" },
    { text: "Authorization failed — identity was verified, but this user lacks admin permission" },
    { text: "The session cookie was HttpOnly, so JavaScript blocked the request" },
    { text: "DNS failed to resolve the admin subdomain" }
  ]}
  correct={1}
  explanation="Login succeeded (authentication). The 403 means the server knows who you are but won't let you do that action (authorization). Two separate steps — fixing auth won't help if the role is wrong."
  revisit={{ to: "/docs/foundations/authentication#a-quick-reminder-authn-vs-authz", label: "Authentication vs Authorization" }}
/>

<Question
  prompt="A self-taught developer wants to skip HTML/CSS and jump straight to React because 'components are the real job.' What does the Roadmap say about that?"
  options={[
    { text: "Fine — React abstracts the DOM, so markup basics are optional" },
    { text: "Wrong order — Stages 1–3 (JS, HTML/CSS, browser JS) exist so React isn't fighting missing fundamentals" },
    { text: "Only wrong if they also skip TypeScript" },
    { text: "Wrong because React is deprecated in favor of Web Components" }
  ]}
  correct={1}
  explanation="Part I's stage order is deliberate. React assumes you already understand the DOM, events, and async JS. Skipping straight to components produces copy-paste that breaks the first time props or state behave unexpectedly."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-6-react", label: "Stage 6 — React fundamentals" }}
/>

<Question
  prompt="You're six months into the Roadmap and tempted to chase every new framework release instead of finishing the current Part. Which meta-skill addresses that trap?"
  options={[
    { text: "Memorize every npm package in Tier 1" },
    { text: "Tutorial trap awareness — depth on one path beats breadth on ten half-started paths" },
    { text: "Skip checkpoints to save time" },
    { text: "Replace reading with AI-generated summaries only" }
  ]}
  correct={1}
  explanation="The Roadmap's meta chapters warn against endless tutorials and novelty-chasing. Finishing a stage and passing its checkpoint beats restarting every time a blog post announces a new framework."
  revisit={{ to: "/docs/roadmap/part-4-meta/tutorial-trap", label: "Meta — escaping the tutorial trap" }}
/>

<Question
  prompt="Before writing code, your team spends a day answering: Who is the user? What problem are we solving? What does 'done' look like? Which lifecycle phase is this?"
  options={[
    { text: "Implementation — you're gathering requirements in Jira" },
    { text: "Discovery and planning — cheap questions now prevent expensive rewrites later" },
    { text: "Deployment — you're writing the runbook" },
    { text: "Maintenance — you're doing a retrospective" }
  ]}
  correct={1}
  explanation="Discovery is deliberately front-loaded. Changing your mind after schema, API contracts, and UI are built costs multiples of a focused planning session."
  revisit={{ to: "/docs/lifecycle/discovery-planning#the-seven-discovery-questions", label: "The seven discovery questions" }}
/>

<Question
  prompt="Your CI runs 400 end-to-end browser tests but almost no unit tests. Releases are slow and failures are hard to localize. What does the testing pyramid recommend?"
  options={[
    { text: "Delete E2E entirely — unit tests replace them" },
    { text: "More E2E tests — they catch the most realistic bugs" },
    { text: "A broad base of fast unit tests, fewer integration tests, and a small E2E peak" },
    { text: "100% code coverage — shape doesn't matter if coverage is high" }
  ]}
  correct={2}
  explanation="The pyramid is about cost and signal. Unit tests are cheap and pinpoint failures. E2E tests are slow and flaky at scale — keep them for critical user journeys, not every edge case."
  revisit={{ to: "/docs/lifecycle/testing#the-testing-pyramid", label: "Why the pyramid is shaped that way" }}
/>

<Question
  prompt="It's 4:30 PM Friday. A teammate wants to deploy a database migration plus a feature flag change before the weekend. What does the lifecycle deploy checklist suggest?"
  options={[
    { text: "Ship it — fewer people online means less risk" },
    { text: "Wait — risky changes on Friday leave you without weekday team coverage if something breaks" },
    { text: "Deploy only the migration; features can wait until Monday" },
    { text: "Skip staging because production is the real test" }
  ]}
  correct={1}
  explanation="The safe-deploy mindset treats timing as part of risk. Friday deploys of schema + behavior changes are a classic way to spend the weekend debugging alone."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#a-safe-deploy-checklist", label: "The Friday-deploy rule" }}
/>

<Question
  prompt="In a Next.js app, product inventory lives in Postgres and is fetched on the server. The shopping-cart item count lives in React state on the client. Where should you reach for TanStack Query?"
  options={[
    { text: "For the cart count — it's React state" },
    { text: "For server-backed inventory — cache, refetch, and stale-while-revalidate patterns belong to server state" },
    { text: "For both — one library should own all state" },
    { text: "For neither — use Redux for everything" }
  ]}
  correct={1}
  explanation="Server state (remote data with caching semantics) and client state (UI toggles, form drafts) are different problems. TanStack Query shines on server data; local UI state stays in useState or a tiny client store."
  revisit={{ to: "/docs/stack/state-management#server-state", label: "Server vs client state" }}
/>

<Question
  prompt="You're starting a typical full-stack SaaS in 2026. The stack chapter's default relational database recommendation is:"
  options={[
    { text: "MongoDB — flexible schema wins for startups" },
    { text: "SQLite in production — zero ops" },
    { text: "PostgreSQL — JSON support when you need it, strong consistency and joins when you don't" },
    { text: "Spreadsheet export to CSV — migrate later" }
  ]}
  correct={2}
  explanation="The guide's pragmatic default is Postgres: mature, hosted everywhere, handles relational data well, and JSON columns cover semi-structured cases without giving up transactions."
  revisit={{ to: "/docs/stack/databases#postgresql--the-default", label: "PostgreSQL — the default" }}
/>

<Question
  prompt="Your team picks TypeScript for the frontend. The backend engineer asks whether to use JavaScript on the server 'to move faster.' What matches the stack chapter?"
  options={[
    { text: "Use JavaScript on the server — types slow you down" },
    { text: "Use TypeScript end-to-end — shared types across API boundaries pay for the build step" },
    { text: "Use Python on the server — it's better for APIs" },
    { text: "Use Go on the server — TypeScript is frontend-only" }
  ]}
  correct={1}
  explanation="TypeScript across the stack lets you share types for API payloads, catch contract drift in CI, and onboard faster. The 'skip types on the server' split usually creates a seam where bugs hide."
  revisit={{ to: "/docs/stack/languages#typescript--the-default-for-web", label: "TypeScript — the default for web" }}
/>

<Question
  prompt="Your API runs in `us-east-1` but your RDS Postgres primary is in `eu-west-1` to be near a founder. Users complain about slow writes. What's the cloud mental-model fix?"
  options={[
    { text: "Add a CDN — it caches database writes" },
    { text: "Co-locate compute and primary database in the same region — cross-region DB latency dominates" },
    { text: "Switch to serverless — Lambda ignores geography" },
    { text: "Use a larger instance type — CPU is the bottleneck" }
  ]}
  correct={1}
  explanation="Every round trip to the database pays RTT. Compute and the primary DB should live in the same region; use replicas or global services deliberately, not by accident."
  revisit={{ to: "/docs/cloud/cloud-mental-model#geography-regions-and-availability-zones", label: "Co-locate compute & DB" }}
/>

<Question
  prompt="A CI job needs to upload artifacts to S3. A teammate pasted long-lived access keys into GitHub Secrets. What's the IAM chapter's preferred pattern?"
  options={[
    { text: "Long-lived keys are fine if rotated quarterly" },
    { text: "Use an IAM role (OIDC) assumed by the CI runner — no static keys in the repo or secrets store" },
    { text: "Make the bucket public so keys aren't needed" },
    { text: "Run the job on a developer laptop instead" }
  ]}
  correct={1}
  explanation="Roles with short-lived credentials beat static keys that can leak, linger, and grant more than one job needs. OIDC from GitHub Actions to AWS is the modern default."
  revisit={{ to: "/docs/cloud/cloud-iam#principals-users-vs-roles-the-crucial-distinction", label: "Roles vs keys" }}
/>

<Question
  prompt="Leadership asks for '100% uptime.' Your on-call engineer pushes back. What operations concept supports the pushback?"
  options={[
    { text: "SLA — customers legally require 100%" },
    { text: "SLO — perfect availability is expensive and hides necessary maintenance; error budgets balance velocity and reliability" },
    { text: "SLI — the metric itself proves 100% is achievable" },
    { text: "Chaos engineering — break prod until it's perfect" }
  ]}
  correct={1}
  explanation="SLOs define realistic targets (e.g. 99.9%). Error budgets translate that into how much risk you can take shipping features. 100% is a slogan, not an operable target."
  revisit={{ to: "/docs/operations/sre-mindset#error-budgets-the-key-idea", label: "Error budgets" }}
/>

<Question
  prompt="Which metric is a GOOD service-level indicator (SLI) for an API your mobile app calls?"
  options={[
    { text: "CPU utilization on the app servers" },
    { text: "Percentage of successful requests completed in under 300ms from the client's perspective" },
    { text: "Number of lines of code merged per week" },
    { text: "Count of PagerDuty alerts fired" }
  ]}
  correct={1}
  explanation="SLIs should reflect user-visible experience — success rate and latency from the caller's view — not internal resource metrics that can look fine while users suffer."
  revisit={{ to: "/docs/operations/sre-mindset#sli-slo-sla--get-these-straight", label: "Good SLIs" }}
/>

<Question
  prompt="During a network partition, your product must keep accepting writes on each side even if they temporarily disagree. Which CAP trade-off are you explicitly choosing?"
  options={[
    { text: "Consistency — all nodes see the same data immediately" },
    { text: "Availability — partitions don't stop serving requests, reconciliation happens later" },
    { text: "Partition tolerance — you can opt out of partitions on AWS" },
    { text: "CAP doesn't apply to web apps" }
  ]}
  correct={1}
  explanation="Under partition, you can't have both strong consistency and full availability. Choosing to stay up and merge later is an AP-style trade-off — common in globally distributed products."
  revisit={{ to: "/docs/distributed-systems/ds-consistency#the-cap-theorem--and-its-constant-misreading", label: "CAP corrected" }}
/>

<Question
  prompt="Stripe sends the same `payment_intent.succeeded` webhook three times because of retries. Your handler creates three shipment records. What's the fix the idempotency chapter describes?"
  options={[
    { text: "Reject webhooks that arrive more than once" },
    { text: "Store a processed event ID (or idempotency key) and no-op duplicates" },
    { text: "Switch to polling — webhooks are unreliable" },
    { text: "Use DELETE instead of POST for webhooks" }
  ]}
  correct={1}
  explanation="At-least-once delivery is normal. Handlers must be idempotent: processing the same event ID twice should leave the system in the same state as processing it once."
  revisit={{ to: "/docs/distributed-systems/idempotency#why-exactly-once-delivery-is-a-myth", label: "Exactly-once myth" }}
/>

<Question
  prompt="Your checkout calls PaymentService, which calls FraudService, which calls InventoryService. PaymentService times out even though InventoryService is healthy. What's the distributed-systems lesson?"
  options={[
    { text: "Add more servers to InventoryService" },
    { text: "Partial failure — one slow dependency poisons the chain; timeouts and bulkheads limit blast radius" },
    { text: "Merge all services into one process so calls are local" },
    { text: "Remove timeouts so requests always complete" }
  ]}
  correct={1}
  explanation="In distributed systems, failure is partial and latency is contagious. Without timeouts and isolation, one sick dependency stalls everything upstream."
  revisit={{ to: "/docs/distributed-systems/ds-fallacies#partial-failure-the-defining-difficulty", label: "Partial failure" }}
/>

<Question
  prompt="You added a 'Ask our docs' chat box. Answers hallucinate policy details that aren't in your help center. What's the first architectural fix the RAG chapter recommends?"
  options={[
    { text: "Use a larger model — smarter models don't hallucinate" },
    { text: "Retrieve relevant doc chunks at query time and ground the answer in that context" },
    { text: "Raise temperature for more creative answers" },
    { text: "Remove the chat box and use keyword search only" }
  ]}
  correct={1}
  explanation="RAG (retrieval-augmented generation) feeds the model your actual docs so answers cite real content. Bigger models still invent facts without grounding."
  revisit={{ to: "/docs/ai/ai-rag#chunking-strategies", label: "Chunking is the usual culprit" }}
/>

<Question
  prompt="Streaming is enabled, but users say the chat 'feels frozen' for two seconds, then text rushes in. Total time is fine. What should you measure first?"
  options={[
    { text: "Total tokens generated" },
    { text: "Time-to-first-token (TTFT) — perceived speed is dominated by when the first character appears" },
    { text: "Model parameter count" },
    { text: "WebSocket vs SSE protocol choice" }
  ]}
  correct={1}
  explanation="Streaming only helps if bytes arrive early. High TTFT makes the UI look stuck even when total latency is acceptable. Optimize prompt size, model routing, and preambles before chasing total time."
  revisit={{ to: "/docs/ai/ai-streaming-chat#the-streaming-protocol", label: "TTFT vs total time" }}
/>

<Question
  prompt="Product wants AI to calculate sales tax on invoices. Engineering pushes back. Which 'when not to use AI' test applies?"
  options={[
    { text: "If it involves language, AI is always appropriate" },
    { text: "Deterministic math with legal correctness requirements — use code and a tax rules engine, not an LLM" },
    { text: "If the model is GPT-4 class, accuracy is guaranteed" },
    { text: "Fine-tune on last year's invoices and skip validation" }
  ]}
  correct={1}
  explanation="LLMs approximate; tax and money need exact, auditable logic. AI fits language-heavy tasks; code fits deterministic rules the business must prove correct."
  revisit={{ to: "/docs/ai/ai-when-not-to-use#often-misused-cases", label: "AI for language, code for math" }}
/>

<Question
  prompt="You need offline access and home-screen install on phones, but native App Store distribution isn't worth the cost yet. Which ecosystems path fits?"
  options={[
    { text: "Electron desktop app" },
    { text: "PWA with a service worker and manifest — knowing iOS limitations upfront" },
    { text: "Rewrite everything in Flutter on day one" },
    { text: "Email PDFs of each page" }
  ]}
  correct={1}
  explanation="PWAs add installability and offline caching without store gatekeepers. They're not a full native replacement — especially on iOS — but they're the right middle step for many web-first products."
  revisit={{ to: "/docs/ecosystems/pwa#the-two-core-ingredients", label: "Service worker" }}
/>

<Question
  prompt="A PM says 'React Native is just a WebView wrapping our website.' What's the accurate mental model from the ecosystems chapter?"
  options={[
    { text: "Correct — RN is Chrome in a shell" },
    { text: "Wrong — RN renders native UI components via JavaScript, not your HTML/CSS in a WebView" },
    { text: "Wrong — RN only works on Android" },
    { text: "Correct — but only if you use Expo" }
  ]}
  correct={1}
  explanation="React Native maps to platform widgets (UIKit, Android views), not a full browser document. That distinction drives performance, navigation, and when to share code with your web app."
  revisit={{ to: "/docs/ecosystems/react-native#how-it-works-and-why-its-not-a-webview", label: "Not a webview" }}
/>

<Question
  prompt="You're building a solo side project nights and weekends. The solo chapter says to deploy before the feature set feels 'ready.' Why?"
  options={[
    { text: "Production traffic is the only real load test" },
    { text: "A live URL forces integration, env vars, and deploy muscle early — hidden work kills solo projects" },
    { text: "Vercel requires a deploy before you can write React" },
    { text: "Users will fund development through ads immediately" }
  ]}
  correct={1}
  explanation="Solo builders often code for months locally, then discover deploy, DNS, auth, and webhooks on the last weekend. Shipping a thin vertical slice early surfaces that work when motivation is highest."
  revisit={{ to: "/docs/solo/env-setup#a-complete-modern-setup", label: "Env setup — deploy before you build" }}
/>

<Question
  prompt="Your solo app has auth, payments, and search planned. You've spent three weeks polishing a settings page theme. Which solo pitfall is this?"
  options={[
    { text: "Under-engineering security" },
    { text: "Feature creep — polishing non-core work while launch-critical paths stay unfinished" },
    { text: "Using too much TypeScript" },
    { text: "Deploying too early" }
  ]}
  correct={1}
  explanation="Solo projects die from infinite polish on low-value surfaces. The chapter pushes ruthless scope: ship the core loop, then iterate from real feedback."
  revisit={{ to: "/docs/solo/pitfalls#feature-creep", label: "Pitfalls — feature creep" }}
/>

<Question
  prompt="A 15-person startup debates microservices because 'that's how big companies do it.' What does the startup architecture chapter recommend instead?"
  options={[
    { text: "Kubernetes with one pod per developer" },
    { text: "A modular monolith — clear module boundaries inside one deployable until team and traffic force a split" },
    { text: "Separate repos per React component" },
    { text: "No backend — serverless only" }
  ]}
  correct={1}
  explanation="Microservices multiply operational load. A modular monolith keeps one deploy pipeline while you enforce boundaries in code — split services when pain is real, not aspirational."
  revisit={{ to: "/docs/startup/architecture#the-modular-monolith", label: "Modular monolith" }}
/>

<Question
  prompt="Your startup team of eight uses long-lived feature branches that merge every two weeks. CI conflicts spike. Which development practice helps?"
  options={[
    { text: "Longer branches — fewer merges" },
    { text: "Trunk-based development — small PRs merged to main frequently behind flags" },
    { text: "Stop using git" },
    { text: "Manual FTP deploys" }
  ]}
  correct={1}
  explanation="Startup velocity comes from short feedback loops. Trunk-based flow with feature flags beats multi-week branches that turn merges into archaeology."
  revisit={{ to: "/docs/startup/development#branching-strategy-trunk-based-development", label: "Trunk-based development" }}
/>

<Question
  prompt="An enterprise team proposes a new caching layer. Engineering asks for a one-page doc: context, options, decision, consequences. What artifact is this?"
  options={[
    { text: "A sprint retro" },
    { text: "An ADR or RFC — written decision record before org-wide rollout" },
    { text: "A Jira epic only" },
    { text: "A Slack thread pinned in #random" }
  ]}
  correct={1}
  explanation="At enterprise scale, decisions outlive the people in the room. ADRs/RFCs capture why a choice was made so the next team doesn't relitigate or misread history."
  revisit={{ to: "/docs/lifecycle/architecture#architecture-decisions-are-hard-to-reverse", label: "Reversibility & ADRs" }}
/>

<Question
  prompt="Your org's error budget for checkout is exhausted for the quarter. Leadership wants a big marketing feature shipped anyway. What should SRE-minded leadership do?"
  options={[
    { text: "Ship anyway — marketing revenue overrides reliability" },
    { text: "Freeze risky releases and invest in reliability until the budget recovers — budgets only work if they're enforced" },
    { text: "Change the SLO to 100% so the budget never runs out" },
    { text: "Delete monitoring so errors stop counting" }
  ]}
  correct={1}
  explanation="Error budgets tie product risk to reliability. When the budget is spent, the organization agreed to prioritize stability. Ignoring that trains teams to treat SLOs as decoration."
  revisit={{ to: "/docs/enterprise/observability#error-budgets", label: "Error budgets in action" }}
/>

<Question
  prompt="The comparison chapter shows the same typo fix taking five minutes solo, an afternoon at a startup, and a week at enterprise. What's the main lesson?"
  options={[
    { text: "Enterprise engineers are slower people" },
    { text: "Process and blast-radius controls scale with org size — the same change carries different coordination cost" },
    { text: "Solo developers should skip code review" },
    { text: "Startups should adopt enterprise RFCs on day one" }
  ]}
  correct={1}
  explanation="Comparison isn't about better or worse — it's about fit. Mechanisms that prevent outages at 500 engineers feel heavy at five. Match process to scale."
  revisit={{ to: "/docs/comparison/development#cicd", label: "Same typo fix, three workflows" }}
/>

<Question
  prompt="You're choosing infra for a team of four with no dedicated ops hire. The comparison chapter warns against which 'resume-driven' choice?"
  options={[
    { text: "Managed Postgres on Railway or Neon" },
    { text: "Self-managed Kubernetes cluster because FAANG uses it" },
    { text: "GitHub Actions for CI" },
    { text: "A monorepo with TypeScript" }
  ]}
  correct={1}
  explanation="Kubernetes solves problems small teams often don't have yet — at the cost of a part-time platform job. Hosted platforms buy time until complexity is earned."
  revisit={{ to: "/docs/comparison/stack-and-hosting#hosting-and-infrastructure", label: "Kubernetes is not a startup tool" }}
/>

<Question
  prompt="You're picking a database for a new CRUD app. Postgres is boring and well understood; the hot new distributed DB launched last month. What does 'boring technology' advise?"
  options={[
    { text: "Always pick the newest database for a competitive edge" },
    { text: "Spend innovation tokens on product differentiators — default to proven tech for commodities like auth and databases" },
    { text: "Never change databases after day one" },
    { text: "Let whichever vendor emails you first decide" }
  ]}
  correct={1}
  explanation="Boring tech isn't mediocrity — it's conserving attention. Postgres, managed auth, and mainstream frameworks are solved problems; novelty belongs where you're actually differentiating."
  revisit={{ to: "/docs/decisions/boring-technology#how-to-apply-it", label: "Where to spend tokens" }}
/>

<Question
  prompt="You can rewrite the checkout UI in a week (easy to revert) or migrate payment processors (hard to undo). How should decision effort differ?"
  options={[
    { text: "Same rigorous RFC for both — consistency matters most" },
    { text: "More deliberation on the irreversible payment migration; move faster on the reversible UI experiment" },
    { text: "Skip analysis for both — speed always wins" },
    { text: "Only optimize reversible decisions" }
  ]}
  correct={1}
  explanation="Reversibility sets the appropriate depth of review. Reversible choices should be cheap to try; one-way doors deserve data, rollback plans, and stakeholder alignment."
  revisit={{ to: "/docs/decisions/reversibility#how-to-apply-it", label: "Time allocation by reversibility" }}
/>

<Question
  prompt="Build-vs-buy: your team estimates six engineer-months for auth, MFA, and session management. Clerk/Auth0 exists. What does the decisions chapter emphasize?"
  options={[
    { text: "Always build — third-party auth is a security risk" },
    { text: "Hidden cost of building — maintenance, edge cases, and compliance often exceed the initial estimate" },
    { text: "Always buy — never write code" },
    { text: "Flip a coin — it's a taste preference" }
  ]}
  correct={1}
  explanation="Build vs buy isn't license cost vs sprint cost. Auth is a long tail of password resets, OAuth quirks, and security patches — exactly the commodity the chapter says to buy unless auth *is* your product."
  revisit={{ to: "/docs/decisions/build-vs-buy#the-hidden-cost-of-building", label: "Hidden cost of building" }}
/>

<Question
  prompt="A junior applicant's portfolio is ten tutorial clones (todo apps, Netflix UI copies) and no deployed originals. What does the career chapter recommend instead?"
  options={[
    { text: "More tutorials — quantity shows dedication" },
    { text: "Three to five real projects with a problem, live URL, and README explaining trade-offs you made" },
    { text: "Remove GitHub entirely — employers don't look" },
    { text: "Only contribute to Linux kernel patches" }
  ]}
  correct={1}
  explanation="Hiring managers skim for evidence you can ship and explain decisions. A small set of distinct, deployed projects beats a wall of identical tutorial completions."
  revisit={{ to: "/docs/career/career-portfolio#1-build-35-real-projects", label: "Projects to avoid" }}
/>

<Question
  prompt="You're job hunting. Cold applications get silence; a former colleague offers to refer you internally. What does the career job-search chapter say about referrals?"
  options={[
    { text: "Referrals are nepotism and shouldn't be used" },
    { text: "Referrals are the highest-leverage path — companies trust employee signal over anonymous resumes" },
    { text: "Referrals only work for senior staff" },
    { text: "Apply to 500 companies daily instead" }
  ]}
  correct={1}
  explanation="The guide treats referrals as the largest practical lever for breaking through ATS noise — not unfair, but a signal that someone vouches you're worth a conversation."
  revisit={{ to: "/docs/career/career-job-search#junior-roles", label: "Referrals as the biggest lever" }}
/>

</Quiz>

---

## After the capstone

If you passed — congratulations. You've certified the arc, not just one chapter. Keep the [Glossary](/docs/glossary) bookmarked for terms that fade, and revisit any section where you hesitated.

If you didn't pass, use the revisit links seriously. **Retake with new questions** pulls a fresh sample of 12 from the same bank. The gaps you miss here are the ones that will compound in production.
