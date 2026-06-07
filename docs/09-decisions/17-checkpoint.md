---
id: decisions-checkpoint
title: Chapter 14 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 14 — Decision Frameworks. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 15.
---

# Chapter 14 Checkpoint

You've finished the Decisions chapter. Make sure the frameworks actually stuck — these are the highest-leverage ideas in the whole guide.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button and Chapter 15 in the sidebar.

<Quiz id="decisions-checkpoint" title="Decisions checkpoint" sampleSize={5}>

<Question
  prompt="You're 3 engineers building a SaaS for tax accountants. Your bet is an AI-powered document classifier nobody else has. You have to pick: framework, database, auth, vector store. Per the chapter, which choice should consume your innovation token budget?"
  options={[
    { text: "The framework — pick the newest one so the team learns something modern" },
    { text: "Auth — roll your own so you can fine-tune the login flow for accountants" },
    { text: "The vector store and RAG pipeline for the AI classifier — that's the actual moat" },
    { text: "Spread tokens across all four so you don't depend too heavily on any one boring tool" }
  ]}
  correct={2}
  explanation="Tokens go on the differentiator. Framework, database, and auth should be boring defaults (Next.js, Postgres, Clerk) so the AI classifier is the ONLY novel thing you debug in production. Spreading tokens across everything is how you end up with five surprises at 2 a.m."
  revisit={{ to: "/docs/decisions/boring-technology#how-to-apply-it", label: "Where to spend tokens" }}
/>

<Question
  prompt="Your team is about to spend three days choosing between two date-utility libraries, but plans to lock in the database in a 30-minute meeting tomorrow. The reversibility framework says:"
  options={[
    { text: "Correct — date libraries touch every file, the database is hidden behind an ORM" },
    { text: "Inverted — the date library is a search-and-replace, the database accumulates dependencies and is one of the hardest things to swap. Flip the time budget" },
    { text: "Both decisions deserve equal time so the team can't be blamed for either" },
    { text: "Just decide both in the same 30-minute meeting and move on" }
  ]}
  correct={1}
  explanation="This is the canonical anti-pattern: lavish deliberation on two-way doors, near-zero on one-way doors. Date utility = 5 minutes. Database = days of research, prototyping, peer review. The chapter's whole point is matching deliberation to the cost of being wrong."
  revisit={{ to: "/docs/decisions/reversibility#how-to-apply-it", label: "Time allocation by reversibility" }}
/>

<Question
  prompt="You're hired into a 15-person startup that has no code review, no on-call rotation, no shared runbooks — 'we move fast.' They're planning to grow to 80 by year-end. The team-size heuristic predicts:"
  options={[
    { text: "Keep doing what you're doing — process slows everyone down" },
    { text: "Process should scale up with team size; somewhere between now and 80 the lack of standardization, code review, and on-call will start to crush velocity, so begin introducing right-sized process now" },
    { text: "Wait until you're at 80 to introduce any process at all" },
    { text: "Adopt the full RFC/ADR/architecture-review apparatus immediately so you're ready for 500 engineers" }
  ]}
  correct={1}
  explanation="The chapter's bands are explicit: 10–50 needs standardization, code review, on-call, runbooks; the symmetric mistake to over-processing a small team is running a 200-person org with no process. Introduce process gradually as size requires it — don't bolt on 500-person practices, but don't stay at 1-person practices either."
  revisit={{ to: "/docs/decisions/team-size-heuristic#1050-people", label: "10–50 people band" }}
/>

<Question
  prompt="Your B2B SaaS needs to send transactional emails (welcome, password reset, receipts). An engineer pitches: 'I can wire up SMTP and a template engine in a week — Resend would cost us $20/month.' Apply build vs buy:"
  options={[
    { text: "Build — $20/month compounds over years and email isn't complicated" },
    { text: "Buy Resend — the 'one-week' estimate ignores bounce handling, deliverability tuning, SPF/DKIM/DMARC, suppression lists, and lifetime maintenance; the realistic cost is months, not a week" },
    { text: "Build for transactional, buy for marketing — split the difference" },
    { text: "Build a thin Resend wrapper for flexibility" }
  ]}
  correct={1}
  explanation="Classic build-cost underestimation. 'Two-week builds' become 6+ months of edge cases (deliverability, bounces, IP warming, compliance). Unless email IS your product, buying Resend or Postmark wins by 10–100x. The diagnostic: who maintains the SMTP plumbing in three years?"
  revisit={{ to: "/docs/decisions/build-vs-buy#the-hidden-cost-of-building", label: "Hidden cost of building" }}
/>

<Question
  prompt="A product team of 14 people owns 'checkout' and 'billing.' They're in two long meetings a week to stay aligned. Standups run 30 minutes. Two engineers recently shipped overlapping features. Per the chapter, the fix is:"
  options={[
    { text: "Hire a dedicated program manager to coordinate the meetings" },
    { text: "Split into two teams of ~7 along a real ownership boundary — likely 'checkout' and 'billing' — so each team can move without the other" },
    { text: "Combine the meetings into one 4-hour weekly sync" },
    { text: "Add three more engineers to absorb the coordination overhead" }
  ]}
  correct={1}
  explanation="Symptoms of Brooks' law past the two-pizza limit: communication overhead jumps quadratically, ownership blurs, duplicate work appears. The prescription is splitting into ~7-person teams with clear service or product boundaries — not more process, and definitely not more headcount on top."
  revisit={{ to: "/docs/decisions/two-pizza-rule#trade-offs", label: "When to split" }}
/>

<Question
  prompt="An engineer pitches: 'We should migrate our REST API to gRPC. Other companies do it and the perf numbers look great.' Applying 'why now?', which response best fits the chapter?"
  options={[
    { text: "Approve — perf wins compound, and other companies' success is good signal" },
    { text: "Ask for a specific measured problem: which endpoints are bottlenecked, what's the latency budget, what bug class does gRPC eliminate, what does 'do nothing for six months' cost? If the honest answer is 'other companies use it,' decline" },
    { text: "Counter-propose GraphQL instead because it's the latest thing" },
    { text: "Approve a 1-month spike to see how the engineer feels about it afterward" }
  ]}
  correct={1}
  explanation="'Other companies use it' and 'the perf numbers look great' are textbook bad answers to 'why now?'. Good answers are measured: a capacity ceiling you've hit, a critical security bug, a hiring constraint, a specific bug class. Including an explicit 'do nothing' baseline forces the proponent to show what changes if you wait."
  revisit={{ to: "/docs/decisions/why-now#bad-reasons", label: "Bad reasons / do-nothing baseline" }}
/>

<Question
  prompt="A team's local dev loop takes 90 seconds per save when it should take 5. They're 8 engineers, each saving ~30 times a day. A senior engineer estimates 2 weeks to fix the build pipeline. Someone says 'we don't have time, ship the feature.' Apply cost-of-inaction:"
  options={[
    { text: "Skip it — feature work is always more important than tooling" },
    { text: "Do it — the math is overwhelming (8 engineers × 30 saves/day × ~85 lost seconds is hours/day across the team), and a 2-week fix pays back in weeks, not months" },
    { text: "Do it next quarter when there's slack" },
    { text: "Add print-statement debugging to avoid saves" }
  ]}
  correct={1}
  explanation="The cost-of-inaction formula keeps you honest: 8 devs × 30 saves × ~85s ≈ 5+ engineer-hours/day burned. Across a month that dwarfs 2 engineer-weeks of fix cost. The rule of thumb: if cost of inaction exceeds cost of doing × 12 months, do it now. 'No time' usually means 'we haven't done the math.'"
  revisit={{ to: "/docs/decisions/cost-of-inaction#concrete-example", label: "Cost of inaction formula" }}
/>

<Question
  prompt="Your tangled monolith handles billing. Leadership wants a clean event-driven service by Q4. An eager engineer proposes: 'Freeze new features for 4 months, rebuild billing from scratch, then cut over in one weekend.' Per the migration chapter:"
  options={[
    { text: "Approve — a clean rewrite is the fastest path to a better system" },
    { text: "Reject — this is both anti-patterns at once (big-bang rewrite + stop-the-world). Use strangler fig with feature-flagged ramp from 1% to 100%, parallel run to compare outputs, and a kill switch for instant rollback" },
    { text: "Approve but extend the freeze to 6 months for safety" },
    { text: "Approve and let the rest of the org keep shipping features against the old system during the freeze" }
  ]}
  correct={1}
  explanation="Big-bang rewrites blow past their estimates while the old system keeps adding features; stop-the-world freezes revolt the product team. The chapter's reliable path is incremental: build alongside, mirror writes, shadow-mode validation, ramp via feature flag, kill switch at every step."
  revisit={{ to: "/docs/decisions/migration-strategy#anti-patterns", label: "Big-bang and stop-the-world" }}
/>

<Question
  prompt="You're reviewing a PR that extracts a `formatName(person)` helper used by both the user-profile UI and the legal-compliance PDF generator. The two call sites were byte-for-byte identical before the refactor. The two-versions principle says:"
  options={[
    { text: "Approve — DRY is sacred, duplication is always a bug" },
    { text: "Push back — they look identical today but they answer different questions (display vs legal compliance) and will diverge. Same code, different concepts; leave them separate" },
    { text: "Approve, but add a `mode: 'display' | 'legal'` flag for future-proofing" },
    { text: "Approve and add inheritance so they share a base class" }
  ]}
  correct={1}
  explanation="Extract when the concept is the same; leave alone when only the code is. Legal names later need middle names, suffixes, jurisdictional rules; display names won't. The 'shared helper with a flag' is the worst of both worlds — coupling without a single source of truth. The flag-with-inheritance variant is the chapter's named anti-pattern."
  revisit={{ to: "/docs/decisions/two-versions#approaches", label: "Same code, different concepts" }}
/>

<Question
  prompt="A junior wants to refactor a function from a `for` loop to `.reduce()` 'because it'll be faster.' No profiler has been run. The same PR ships a new endpoint that calls the database inside a `.map()` over user IDs. The premature-optimization framework says:"
  options={[
    { text: "Both changes are equally important — speed is speed" },
    { text: "The reduce micro-optimization is premature (no measurement, probably irrelevant); the N+1 query is structural and must be fixed before ship — replace with a single `WHERE id IN (...)`" },
    { text: "Approve both — never block on perf concerns" },
    { text: "Reject both — never optimize until users complain" }
  ]}
  correct={1}
  explanation="The chapter distinguishes implementation tuning (premature without a profile) from structural choices (correctness at scale, your job from day one). `for` vs `.reduce()` without a profile is noise. An N+1 query shipping to production is a guaranteed 3 a.m. page — structural, not optional."
  revisit={{ to: "/docs/decisions/premature-optimization#when-to-optimize-early", label: "Structural vs implementation tuning" }}
/>

<Question
  prompt="A repo has these two comments in the same module. Which one will a teammate thank you for in 18 months, per the documentation chapter?"
  options={[
    { text: "`// Set status to 'active'` above `user.status = 'active';`" },
    { text: "`// Stripe rejects 0-amount invoices, so we substitute $0.01 line items for free trials — see incident 2026-02-09`" },
    { text: "`// This function does what it does`" },
    { text: "`// Loop` above `for (const x of xs)`" }
  ]}
  correct={1}
  explanation="The first, third, and fourth comments paraphrase the code — they become lies the moment the code is edited. The Stripe one captures a non-obvious decision and its context. Document the why, not the what; comments that describe a decision survive implementation changes."
  revisit={{ to: "/docs/decisions/documentation-tradeoff#whats-worth-documenting", label: "Comments that age well" }}
/>

<Question
  prompt="A team is in a 30-minute meeting with three decisions: (a) the public API URL structure for v1 (`/v1/users` vs `/api/users`), (b) which Tailwind shade to use for the primary button, (c) the SaaS pricing tiers in the database schema. Per 'what would hurt to change?', how should you allocate the 30 minutes?"
  options={[
    { text: "10 minutes each — fair is fair" },
    { text: "Almost all of it on the API URL structure and the pricing schema; the button shade gets ~30 seconds because if it's wrong, it's a 5-minute PR" },
    { text: "All 30 minutes on the button — design decisions are forever" },
    { text: "Skip the meeting and decide async" }
  ]}
  correct={1}
  explanation="The public API URL breaks every customer integration if wrong (one-way door). A pricing schema accumulates billing and reporting dependencies. A button shade is a 5-minute PR. People reliably overestimate UI/library cost and underestimate API/schema cost — the discipline is being honest about the fix cost and allocating deliberation proportionally."
  revisit={{ to: "/docs/decisions/what-would-hurt#examples", label: "Fix-cost-driven deliberation" }}
/>

<Question
  prompt="You're an engineering manager doing 1:1s. An engineer has been working on a 'data pipeline rewrite' for two quarters. You ask: 'What problem does this solve, in one sentence?' They say: 'It's been on the roadmap, and the old pipeline is messy.' What does the chapter prescribe?"
  options={[
    { text: "Trust their judgment — they've been on it for two quarters" },
    { text: "Pause the project until someone can connect it to a real user problem, a measurable business outcome, or an explicit strategic decision — 'on the roadmap' and 'messy' are not valid answers" },
    { text: "Add more engineers to finish it faster" },
    { text: "Ship it and figure out the motivation later" }
  ]}
  correct={1}
  explanation="This is the worked example almost verbatim — a multi-quarter project nobody can justify. The chapter prescribes: a valid 'why' connects to a user problem, a measurable outcome, or a strategic priority. 'On the roadmap' and 'it's messy' are vibes. Pause; reallocate engineers to work that survives the question."
  revisit={{ to: "/docs/decisions/why-doing-this#forcing-functions", label: "What counts as a valid why" }}
/>

<Question
  prompt="A 4-person startup is picking a backend language. The CTO loves OCaml. There's nothing about their B2B SaaS product that uniquely needs OCaml; TypeScript or Go would ship the same product. Per the hiring-constraint chapter:"
  options={[
    { text: "Pick OCaml — the CTO's enthusiasm will carry the team" },
    { text: "Default to TypeScript or Go. OCaml is 'very hard' to hire for; without a moat-level reason it's a compounding velocity tax (slower fills, higher comp, higher attrition, shrinking leadership pipeline)" },
    { text: "Pick OCaml — niche tech attracts passionate engineers and is always worth it" },
    { text: "Pick Haskell as a compromise" }
  ]}
  correct={1}
  explanation="The chapter's rule: niche tech is justifiable when it's central to your moat (Elixir for real-time messaging, where BEAM genuinely fits). 'CTO loves it' isn't a moat. The 2x hiring difficulty compounds into >2x cost — slower fills, higher comp, higher attrition, weaker leadership pipeline."
  revisit={{ to: "/docs/decisions/hiring-constraint#the-counter", label: "Niche tech: tax vs moat" }}
/>

<Question
  prompt="A team is debating: 'Should we adopt Rust for our new payments microservice instead of TypeScript?' Two engineers already know Rust; the service handles money; high throughput is required. The chapter's stance on overriding the 'boring technology' default is:"
  options={[
    { text: "Never override — boring always wins" },
    { text: "A legitimate override needs a real, written reason (correctness for money, prior Rust experience on the team, performance characteristics, blast radius) with stakeholder buy-in. With those, deviating is the right call — and the framework's value was forcing you to articulate why" },
    { text: "Override freely — frameworks are for juniors" },
    { text: "Override only if the CTO personally approves each one" }
  ]}
  correct={1}
  explanation="This is the worked example: Rust for payments, justified by money correctness + existing expertise + performance + blast radius, written down. The chapter is explicit that frameworks are heuristics. Their real value isn't dictating an answer — it's forcing you to defend an override in words your team accepts. 'We want to use Rust because it'd be fun' is the same final choice but completely different decision quality."
  revisit={{ to: "/docs/decisions/overriding#frameworks-are-heuristics-not-laws", label: "Legitimate vs lazy overrides" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 15: Career Path](/docs/career) — how to grow as a web developer in 2026.
