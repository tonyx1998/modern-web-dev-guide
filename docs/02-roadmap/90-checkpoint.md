---
id: roadmap-checkpoint
title: Chapter 2 Checkpoint
sidebar_position: 90
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 2 — Roadmap. 5 random questions drawn from a 15-question bank spanning all four Parts. Pass to unlock Chapter 3.
---

# Chapter 2 Checkpoint

You've worked through the Roadmap — the stages, the modern-stack picks, the fundamentals beyond the stack, and the meta-skills of learning itself. Take a minute to make sure the load-bearing ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button at the bottom.

<Quiz id="roadmap-checkpoint" title="Roadmap checkpoint" sampleSize={5}>

<Question
  prompt="In Part I, the suggested order is non-negotiable. Why is it specifically wrong to start with React before working through Stages 1–3 (JS basics, HTML/CSS, JS in the browser)?"
  options={[
    { text: "React requires a fast computer that early stages don't" },
    { text: "React papers over JavaScript and DOM concepts — when something breaks, you'll have no model for debugging it" },
    { text: "React isn't supported in modern browsers without polyfills" },
    { text: "React tutorials don't cover JSX" }
  ]}
  correct={1}
  explanation="React's productivity comes from hiding the DOM, the event loop, and a lot of JS plumbing. When the abstraction leaks (and it will), you debug the layer underneath. If you've never worked at that layer, every bug looks like magic."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-6-react", label: "Stage 6 — React fundamentals" }}
/>

<Question
  prompt="A reader asks: 'I finished Stage 9 and shipped a portfolio. Do I really need Stages 10–12?' What's the most accurate response?"
  options={[
    { text: "No — Stage 9 is enough for any front-end role" },
    { text: "Yes — Stages 10–12 cover backend, full-stack, and the professional polish (testing, communication, job search) that turns 'I can code' into 'I can hold a job'" },
    { text: "Only if they want to work at a startup" },
    { text: "Only if they want to specialize in backend" }
  ]}
  correct={1}
  explanation="Stage 9 gets you a deployed front-end. Stages 10–12 cover the things that distinguish a junior who can ship a personal site from one who can hold a junior-engineer role: backend basics, integrated full-stack, and the meta-skills of working on a team."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-12-going-pro", label: "Stage 12 — Going professional" }}
/>

<Question
  prompt="Part II categorizes tools as Tier 1 (adopt now), Tier 2 (worth knowing), Tier 3 (skip or defer). How should you READ this categorization for your next project?"
  options={[
    { text: "Tier 1 = must adopt all of them today" },
    { text: "Tier 1 = the picks worth integrating into your next project, one at a time, where they fit" },
    { text: "Tier 1 = popular, Tier 3 = unpopular" },
    { text: "The tiers are alphabetical" }
  ]}
  correct={1}
  explanation="The tier is about adoption confidence, not a checklist. Tier 1 means 'mature enough that you'll regret not using it where it fits' — but fit matters. A static blog doesn't need Drizzle, no matter how Tier 1 Drizzle is."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-1", label: "Tier 1 — Adopt now" }}
/>

<Question
  prompt="What does 'AI as a feature layer' (a Part II trend) actually mean architecturally?"
  options={[
    { text: "Replacing your backend with an LLM" },
    { text: "Inserting an LLM call between business logic and the database, with tool-calling/RAG/agents as patterns layered on top" },
    { text: "Using AI to generate your code" },
    { text: "Switching your hosting to an AI-native cloud" }
  ]}
  correct={1}
  explanation="The 30-year pattern was UI ↔ business logic ↔ database. The new layer is UI ↔ business logic ↔ LLM ↔ database. The model isn't the product — it's a function call inside your normal app, with tool-calling/RAG/agents as the patterns you compose."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/trends", label: "Trends — AI as a feature layer" }}
/>

<Question
  prompt="React Server Components (Tier 1) flip the default for where components run. What's the new default, and how do you opt out of it?"
  options={[
    { text: "Default is client; opt into server with `'use server'`" },
    { text: "Default is server; opt into client with `'use client'` for components that need interactivity" },
    { text: "Default is server; opt out with `'use static'`" },
    { text: "Default depends on the route" }
  ]}
  correct={1}
  explanation="With RSC, components run on the server by default — they can talk to your database directly and ship zero JS to the browser. You mark a component with `'use client'` only when it needs interactivity (a button, a form, animation state)."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-1", label: "Tier 1 — RSC + Server Actions" }}
/>

<Question
  prompt="Big-O notation describes how work grows with input size. An algorithm that's O(n²) on 1,000 items does roughly a million comparisons. What does it do on 10,000 items?"
  options={[
    { text: "Ten million — work scales linearly" },
    { text: "One hundred million — work scales with the square of input size" },
    { text: "Still about a million — Big-O describes the average case" },
    { text: "Impossible to predict from Big-O alone" }
  ]}
  correct={1}
  explanation="O(n²) means quadratic growth. 10× the input means 100× the work. This is exactly why code that 'feels fine' on small dev data freezes the UI on production data — and why recognizing Big-O patterns is a load-bearing senior skill."
  revisit={{ to: "/docs/roadmap/part-3-beyond/cs-fundamentals", label: "Big-O: why a nested loop hurts later" }}
/>

<Question
  prompt="The 'boring technology rule' (from Part III, Engineering Judgment) says: prefer the well-understood, well-supported option even if a newer one is shinier. Why?"
  options={[
    { text: "Boring tech is always cheaper" },
    { text: "Every novel tech choice spends an 'innovation token' — your team has a finite supply, and spending them on infrastructure leaves none for the product" },
    { text: "Newer tools are usually buggy" },
    { text: "Senior engineers don't like learning new things" }
  ]}
  correct={1}
  explanation="Dan McKinley's framing: you have ~3 innovation tokens. Spending one on a novel database AND a novel deploy system AND a novel framework leaves zero for the actual product differentiator. Boring tech for everything that's not your edge."
  revisit={{ to: "/docs/roadmap/part-3-beyond/engineering-judgment", label: "Engineering judgment — boring technology" }}
/>

<Question
  prompt="In systems thinking, what's the difference between latency and throughput?"
  options={[
    { text: "They're synonyms" },
    { text: "Latency = time for ONE request to complete; throughput = how many requests/second the system handles. They're different beasts and optimize differently." },
    { text: "Latency is measured in ms, throughput in seconds" },
    { text: "Latency applies to the client, throughput to the server" }
  ]}
  correct={1}
  explanation="Latency is per-request (the user waits 200ms). Throughput is system-wide (we handle 10k req/s). You can have low latency AND low throughput (one fast worker), or high latency AND high throughput (many slow workers). They're separately tunable."
  revisit={{ to: "/docs/roadmap/part-3-beyond/systems-thinking", label: "Systems thinking — latency vs throughput" }}
/>

<Question
  prompt="A user submits a form. The network blips and the client retries. Without idempotency, what's the danger?"
  options={[
    { text: "The form data is lost" },
    { text: "The action is processed twice — duplicate charges, duplicate emails, duplicate records" },
    { text: "The session is invalidated" },
    { text: "The retry never reaches the server" }
  ]}
  correct={1}
  explanation="Without idempotency keys, the second attempt looks like a brand-new request. Charging Stripe twice, sending two welcome emails, creating two user accounts. Idempotency makes the second call a no-op — exactly what you want."
  revisit={{ to: "/docs/roadmap/part-3-beyond/systems-thinking", label: "Systems thinking — idempotency" }}
/>

<Question
  prompt="What's the most common application-layer security mistake the OWASP Top 10 has flagged for years?"
  options={[
    { text: "Weak passwords" },
    { text: "Injection (SQL, command, etc.) and broken access control — trusting client-supplied data and not enforcing authorization on every request" },
    { text: "Not using HTTPS" },
    { text: "Using the wrong programming language" }
  ]}
  correct={1}
  explanation="Injection (SQLi, command, NoSQL, etc.) and broken access control (IDOR, missing auth checks) have been the #1 and #2 OWASP categories for over a decade. Both come from the same root: treating client input or client-provided IDs as trusted."
  revisit={{ to: "/docs/roadmap/part-3-beyond/security", label: "Security — OWASP Top 10" }}
/>

<Question
  prompt="Part IV's 'How to actually learn' page warns about the 'fluency illusion.' What is it?"
  options={[
    { text: "Thinking you can speak a language because you can read it" },
    { text: "When something 'feels easy' as you read it, your brain mistakes recognition for the ability to produce it — so you skip the active practice that actually creates the skill" },
    { text: "Believing fast typists are better programmers" },
    { text: "Confusing IDE autocomplete with knowing the API" }
  ]}
  correct={1}
  explanation="Reading code or watching a tutorial activates recognition (easy). Writing code from scratch activates production (hard). The fluency illusion is mistaking the first for the second — and it's the reason 'I read about it' rarely translates to 'I can do it.'"
  revisit={{ to: "/docs/roadmap/part-4-meta/how-to-learn", label: "Meta — the feels-easy trap" }}
/>

<Question
  prompt="The right way to use AI tools as a learner is..."
  options={[
    { text: "Have it write all your code so you can focus on the design" },
    { text: "Use it to EXPLAIN things you don't understand, not to DO things you haven't learned yet" },
    { text: "Avoid it entirely until you're senior" },
    { text: "Use it only for boilerplate" }
  ]}
  correct={1}
  explanation="AI is an accelerator for understanding, not a substitute for the reps. 'Explain this regex to me line by line' teaches you. 'Write me a regex' bypasses the learning entirely. The Part IV rule: explain, don't do, until you can confidently do it yourself."
  revisit={{ to: "/docs/roadmap/part-4-meta/ai-as-learner", label: "Meta — AI as a learner" }}
/>

<Question
  prompt="You're stuck on a bug and want to ask for help online. What makes a question more likely to get a useful answer?"
  options={[
    { text: "Hiding the project context so people focus on the code" },
    { text: "A minimal, reproducible example: the smallest code that demonstrates the problem, what you expected, what you got, and what you've already tried" },
    { text: "Posting just the error message" },
    { text: "Saying 'urgent' in the title" }
  ]}
  correct={1}
  explanation="The MRE (minimal reproducible example) plus your expected/actual/tried context is the canonical good-question shape. It respects the answerer's time, surfaces the real issue, and often makes you find the bug yourself before posting."
  revisit={{ to: "/docs/roadmap/part-4-meta/asking-questions", label: "Meta — asking good questions" }}
/>

<Question
  prompt="The 'tutorial trap' is a specific failure mode. Which statement describes it best?"
  options={[
    { text: "Picking the wrong tutorial for your skill level" },
    { text: "Finishing tutorial after tutorial without ever building anything from scratch — because tutorials are emotionally safer than the open-ended struggle of building" },
    { text: "Watching videos at 2× speed" },
    { text: "Using outdated tutorials with deprecated APIs" }
  ]}
  correct={1}
  explanation="Tutorials give you the dopamine of progress with none of the discomfort of not knowing what to do. The trap is mistaking that comfort loop for actual learning. The exit ramp is always the same: pick a small original project and start, badly."
  revisit={{ to: "/docs/roadmap/part-4-meta/tutorial-trap", label: "Meta — escaping the tutorial trap" }}
/>

<Question
  prompt="The roadmap and the rest of the guide overlap deliberately. Which best describes the relationship?"
  options={[
    { text: "The roadmap replaces the topic chapters — read one or the other" },
    { text: "The roadmap is the PATH (what to learn, in what order); the topic chapters are the TERRAIN (depth on each concept). Roadmap stages link into topic chapters." },
    { text: "The roadmap is for beginners; the topic chapters are for advanced readers" },
    { text: "They're identical content presented differently" }
  ]}
  correct={1}
  explanation="The roadmap tells you what to learn and when. The topic chapters explain each thing deeply. A stage like 'learn React' is one paragraph in the roadmap and a 19-page chapter in the Tech Stack — same material, different access patterns."
  revisit={{ to: "/docs/roadmap", label: "Roadmap — overview" }}
/>

</Quiz>

## What's next

You've finished Chapter 2 — the progression view of the whole guide.

→ Continue to [Chapter 3 — Lifecycle](/docs/lifecycle) to see what every phase of a real project actually looks like, or jump to [Timeline & Suggested Order](/docs/roadmap/timeline-and-path) for a planning view of the whole thing.
