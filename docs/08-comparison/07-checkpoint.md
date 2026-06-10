---
id: comparison-checkpoint
title: Chapter 14 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 13 — Comparison. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 15.
---

# Chapter 14 Checkpoint

You've finished the Comparison chapter. Take a minute to make sure the comparative ideas stuck — across solo / startup / enterprise.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 67%) to unlock the Next button and Chapter 14 in the sidebar.

<Quiz id="comparison-checkpoint" title="Comparison checkpoint" sampleSize={5}>

<Question
  prompt="Looking across the team and decision-making tables, what is the underlying arc that explains how the role mix and the decision style co-evolve with scale?"
  options={[
    { text: "Both stay flat — only headcount grows, but practices are constant" },
    { text: "Role mix specializes (everyone → generalists + a few specialists → many specialized teams) and decisions formalize in lockstep (intuition → Slack thread → RFC + multi-team review)" },
    { text: "Roles specialize while decision-making stays informal at every scale" },
    { text: "Decisions formalize but roles stay generalist even at enterprise scale" }
  ]}
  correct={1}
  explanation="The same arc runs through both tables: as roles specialize from one-person-does-everything to many specialized teams, decision-making formalizes from intuition to Slack discussion to written RFCs with multi-team review. The two patterns move together because larger teams need shared written context to stay aligned."
  revisit={{ to: "/docs/comparison/team-and-process#decision-making-process", label: "Decision-Making Process" }}
/>

<Question
  prompt="A founder asks why their 8-person startup shouldn't adopt the 5-round, 4–8 week hiring loop used at a 500-engineer company. What is the comparative answer the chapter gives?"
  options={[
    { text: "Long loops are objectively better and the startup should copy them anyway" },
    { text: "Bad-hire cost scales with company size, so the cost of the long loop only pays off at enterprise scale — at 8 people it just loses you great candidates to faster offers" },
    { text: "Hiring loop length is set by regulation, not by scale" },
    { text: "Startups should use even longer loops than enterprises because each hire is a bigger percentage of headcount" }
  ]}
  correct={1}
  explanation="The 5–7 round loop is justified at enterprise scale because a bad hire is much more expensive there — slow to identify, hard to manage out. At a small company that math doesn't hold, and the same heavy loop just costs you great candidates who take other offers first."
  revisit={{ to: "/docs/comparison/team-and-process#hiring", label: "Hiring" }}
/>

<Question
  prompt="What flips about the *role of writing things down* between a startup decision and an enterprise decision?"
  options={[
    { text: "Both rely equally on written decisions; only the format differs" },
    { text: "Startups write everything down; enterprises rely on hallway conversations" },
    { text: "Startups can lean on spoken decisions because the decision-makers are still around — at enterprise scale, decisions outlive their decision-makers, so written RFCs become load-bearing" },
    { text: "Writing things down is purely a compliance artifact and has no real coordination value" }
  ]}
  correct={2}
  explanation="At small scale the people who made a decision are still around to remember it. At enterprise scale, decisions outlive their decision-makers — so written reasoning (the RFC) becomes the only durable way to keep thousands of decisions coherent."
  revisit={{ to: "/docs/comparison/team-and-process#decision-making-process", label: "RFC is the magic word" }}
/>

<Question
  prompt="You glance at three architecture diagrams: (A) one Next.js app + managed Postgres + Stripe + Resend; (B) Next.js modular monolith + Redis + PostHog + Trigger.dev; (C) dozens of polyglot services + service mesh + Kafka + sharded Postgres. What does that tell you?"
  options={[
    { text: "A is solo, B is a startup, C is an enterprise — you can read scale right off the stack diagram" },
    { text: "All three are valid solo setups; only headcount differs" },
    { text: "C is the only correct architecture; A and B are technical debt" },
    { text: "The diagrams are interchangeable — scale doesn't change the right stack" }
  ]}
  correct={0}
  explanation="The chapter's claim is that you can predict an org's scale from a one-minute look at its stack diagram. One service + managed DB + free CDN is solo. Modular monolith + a few SaaS pieces is startup. Microservices + mesh + multi-region K8s is enterprise. Each is correct for its scale."
  revisit={{ to: "/docs/comparison/stack-and-hosting#stack-and-architecture", label: "Stack and Architecture" }}
/>

<Question
  prompt="What is the comparative reason solo, startup, and enterprise have different default attitudes toward managed services?"
  options={[
    { text: "Solo wants zero plumbing (free tiers and managed); startup wants to never operate anything it can rent (SaaS-glued); enterprise builds internal versions for scale and compliance — three coherent strategies, not personal preference" },
    { text: "All three should self-host everything for cost control" },
    { text: "All three should buy SaaS for everything regardless of scale" },
    { text: "Attitude toward managed services is determined by the founder's personal preference, not scale" }
  ]}
  correct={0}
  explanation="The three rows in the stack table reflect three coherent strategies: solo optimizes for zero plumbing (free tiers), startups SaaS-glue everything to avoid operating what they can rent, and enterprises build internal versions where scale and compliance justify the engineering investment."
  revisit={{ to: "/docs/comparison/stack-and-hosting#stack-and-architecture", label: "Patterns across rows" }}
/>

<Question
  prompt="Kubernetes is widely used at large companies. Why does the chapter still describe adopting it at a 5-engineer startup as 'the single most common stack mistake'?"
  options={[
    { text: "Kubernetes is technically broken and shouldn't be used anywhere" },
    { text: "It only solves problems you have at 200+ engineers and 50+ services — at startup scale it becomes a permanent operational tax on every deploy without paying for itself" },
    { text: "Kubernetes is too expensive to license for small teams" },
    { text: "Vercel and Railway can't host real production workloads" }
  ]}
  correct={1}
  explanation="K8s is a great answer to problems you have at 200+ engineers and 50+ services. At 5 engineers and 1 service, those problems don't exist — but the operational tax does, on every deploy. The 2026 startup default is Vercel/Render/Fly/Railway until you actually outgrow them."
  revisit={{ to: "/docs/comparison/stack-and-hosting#hosting-and-infrastructure", label: "Kubernetes is not a startup tool" }}
/>

<Question
  prompt="The same one-line typo fix takes 2 minutes solo, 15 minutes at a startup, and 1–4 hours at an enterprise. What does the chapter say that gap is actually paying for?"
  options={[
    { text: "Slower CI hardware at large companies" },
    { text: "Risk-profile-appropriate process: reviewers, CODEOWNERS, full CI, and a staged canary with soak times — each gate exists because of a past incident" },
    { text: "Mandatory release trains that only run once a day" },
    { text: "Enterprises rewriting the fix in a different language for compliance" }
  ]}
  correct={1}
  explanation="The coding is identical at every scale. The 10–100x slowdown is the surrounding process — reviewers, CODEOWNERS, a staged canary with soak times, compliance gates — and each gate exists because a past incident proved it was needed. It's risk-profile-appropriate, not gratuitous."
  revisit={{ to: "/docs/comparison/development#cicd", label: "Same typo fix, three workflows" }}
/>

<Question
  prompt="Why does trunk-based development with short branches become essentially universal once a team is past solo work, regardless of scale?"
  options={[
    { text: "It's a recent fashion that will pass" },
    { text: "Long-lived branches are the single biggest source of integration pain at any team scale, so both startups and enterprises pay the same price for ignoring it" },
    { text: "GitHub charges more for long branches" },
    { text: "Trunk-based development is only used at startups, never enterprises" }
  ]}
  correct={1}
  explanation="Trunk-based development with short branches is one of the few practices that's universal past solo work. Long-lived branches cause integration pain at every team scale — both startups and enterprises pay if they ignore it, so both converge on the same workflow."
  revisit={{ to: "/docs/comparison/development#development-workflow", label: "Development Workflow" }}
/>

<Question
  prompt="Why are contract tests called 'overkill at startup scale, load-bearing at enterprise scale'?"
  options={[
    { text: "They're expensive to license, and enterprises can afford them" },
    { text: "At one or two services, there's nothing for two services to break for each other. With dozens of teams shipping daily, contract tests are the main thing stopping them from accidentally breaking each other every Tuesday" },
    { text: "Contract tests replace unit tests entirely at scale" },
    { text: "Auditors require contract tests at enterprise scale" }
  ]}
  correct={1}
  explanation="A contract test pins down what one service promises to send and another promises to accept. With one or two services there's nothing meaningful to test that way. Once dozens of teams each ship independently, contract tests are the main mechanism keeping them from breaking each other's expectations."
  revisit={{ to: "/docs/comparison/development#testing", label: "Contract tests" }}
/>

<Question
  prompt="The chapter says the observability gap between scales is the most extreme of any dimension. What underlying reason does it give?"
  options={[
    { text: "Larger companies just have bigger budgets so they buy more dashboards" },
    { text: "The cost of being wrong about reliability or security grows roughly with the square of your user count — a missed alert ships a bug to yourself solo, to a few customers at a startup, and to millions plus regulators at enterprise scale" },
    { text: "Solo developers actually have the highest exposure because they have no insurance" },
    { text: "The gap is mostly a fashion difference and not really driven by impact" }
  ]}
  correct={1}
  explanation="The cost of being wrong about reliability or security roughly grows with the square of user count. Missed alerts at solo scale hit yourself; at a startup hit a few customers; at enterprise scale can mean SLA breaches, regulatory fines, and front-page news. Observability investment tracks that asymmetry."
  revisit={{ to: "/docs/comparison/ops#observability", label: "In plain English" }}
/>

<Question
  prompt="If you had to pick a single observability tool whose presence cleanly separates 'small company' from 'large company,' the chapter says it's…"
  options={[
    { text: "Error tracking (Sentry)" },
    { text: "Uptime monitoring" },
    { text: "Distributed tracing — necessary once a slow request crosses ten services, optional below that" },
    { text: "RUM (Real User Monitoring)" }
  ]}
  correct={2}
  explanation="Logs and Sentry are enough with one or two services. Once a single request crosses ten-plus services, distributed traces are the only way to debug a slow page — so traces are universal at enterprise scale and rare at startups."
  revisit={{ to: "/docs/comparison/ops#observability", label: "Distributed tracing is the dividing line" }}
/>

<Question
  prompt="What's the common pattern that triggers each step-up in security investment (Dependabot/MFA → SOC 2 → AppSec team)?"
  options={[
    { text: "A specific business event — a customer requirement, regulatory deadline, or incident — not general aspiration" },
    { text: "Headcount alone, on a fixed schedule" },
    { text: "Random executive decisions" },
    { text: "Whenever a new compliance fad appears in industry blogs" }
  ]}
  correct={0}
  explanation="Each tier of security investment is triggered by a concrete business event — typically a customer requirement (SOC 2 to sell mid-market), a regulatory deadline, or a security incident. Aspirational adoption without a triggering event tends to fizzle."
  revisit={{ to: "/docs/comparison/ops#security-and-compliance", label: "When each tier becomes worth it" }}
/>

<Question
  prompt="The chapter argues 'the cheapest infra is almost never the cheapest total option.' What is the comparative principle behind that claim?"
  options={[
    { text: "Infrastructure pricing is rigged" },
    { text: "At every scale — solo, startup, enterprise — people costs dominate infra costs, so paying more for managed services to save engineering time usually wins on total cost" },
    { text: "Self-hosting is always cheaper at startup scale but never at enterprise scale" },
    { text: "Enterprises uniquely have this problem; it doesn't apply to solo or startup" }
  ]}
  correct={1}
  explanation="At every scale, infra is a small slice of total spend — people dominate. $20/month for managed Postgres beats burning your Saturday on a $5 VPS. $4M/year for Datadog beats hiring a 5-engineer team to self-host equivalent observability. The principle is scale-invariant."
  revisit={{ to: "/docs/comparison/economics#cost-profile", label: "Optimal cost is almost never the cheapest infra" }}
/>

<Question
  prompt="A 10-person startup adopts an enterprise process — three approvers and a security review for every PR. What does the chapter predict happens, and why is this the canonical 'wrong scale' mistake?"
  options={[
    { text: "Velocity improves because more eyes catch more bugs" },
    { text: "The startup ships nothing — enterprise process exists to absorb risk that a 10-person team doesn't carry, so applying it just creates pure overhead" },
    { text: "Security improves dramatically with no velocity cost" },
    { text: "Nothing changes — process overhead is independent of team size" }
  ]}
  correct={1}
  explanation="A small company with enterprise practices is glacial. The three-approver + security-review process exists to absorb risk that a 500-engineer company actually carries; at 10 people it's pure overhead with no offsetting risk reduction, so the team ships nothing. The skill is matching practices to your scale."
  revisit={{ to: "/docs/comparison/tradeoffs#common-trade-offs-by-scale", label: "Wrong-scale mistakes" }}
/>

<Question
  prompt="The chapter's career advice is that the most successful engineers don't 'climb a ladder' but rather…"
  options={[
    { text: "Stay at one scale forever to maximize expertise" },
    { text: "Cycle through scales — startup for breadth, enterprise for rigor and specialization, back to a startup to apply lessons — picking up different skills at each stage" },
    { text: "Only work at FAANG companies" },
    { text: "Avoid enterprises entirely because the velocity is too slow" }
  ]}
  correct={1}
  explanation="There's no single 'best' scale. The chapter's worked example traces a 15-year arc that cycles: startup (breadth) → enterprise (rigor + specialization) → return to a startup as staff engineer applying enterprise lessons selectively. Each stage teaches different skills."
  revisit={{ to: "/docs/comparison/tradeoffs#career-implications", label: "A typical career arc" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 15: Decision Frameworks](/docs/decisions) for the META layer — how to actually CHOOSE among these options.
