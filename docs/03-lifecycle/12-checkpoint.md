---
id: lifecycle-checkpoint
title: Chapter 3 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 3 — Lifecycle. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 4.
---

# Chapter 3 Checkpoint

You've finished the Lifecycle chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button and Chapter 4 in the sidebar.

<Quiz id="lifecycle-checkpoint" title="Lifecycle checkpoint" sampleSize={5}>

<Question
  prompt="Two teams catch the same 'we built the wrong thing' realization at different points. Team A notices during discovery; Team B notices a month after launch. What does the lifecycle argue about the cost gap?"
  options={[
    { text: "The cost is roughly the same — fixing it always means a code change" },
    { text: "Team B pays slightly more because they need a new deploy" },
    { text: "The cost grows exponentially across phases — discovery is free, post-launch costs weeks of migration and lost trust" },
    { text: "Team A actually pays more because they wasted time thinking instead of building" }
  ]}
  correct={2}
  explanation="The reversibility curve is the through-line of the whole chapter: changes get exponentially more expensive as you move from discovery to design to code to production. Catching the wrong idea early is the single biggest leverage point in the lifecycle."
  revisit={{ to: "/docs/lifecycle/discovery-planning#why-it-matters", label: "Cost of changing your mind" }}
/>

<Question
  prompt="A beginner asks 'which framework should we use?' during their discovery phase. Why does the chapter treat this as a category error?"
  options={[
    { text: "Frameworks are never decided — they're inherited from the codebase" },
    { text: "Discovery answers who, what problem, success, scope, constraints, risks, and approvals — framework choice belongs to architecture" },
    { text: "Discovery is purely visual; technical questions belong to design" },
    { text: "Frameworks must be chosen by management, not engineers" }
  ]}
  correct={1}
  explanation="Discovery is about the user and the problem; architecture is about the technical how. Mixing them up tends to lock in implementation tech before you've validated the idea is even worth building."
  revisit={{ to: "/docs/lifecycle/discovery-planning#the-seven-discovery-questions", label: "The seven discovery questions" }}
/>

<Question
  prompt="You're handing a Figma file to engineering. The design only shows screens with realistic data and everything working. Which design lesson is this most likely violating?"
  options={[
    { text: "Mockups should use lorem ipsum, not realistic data" },
    { text: "Designs should ignore accessibility until after launch" },
    { text: "Designing only the happy path leaves empty, loading, and error states for engineers to invent — and those are where new users live" },
    { text: "Designers should not hand off files; engineers should rebuild from scratch" }
  ]}
  correct={2}
  explanation="Real interfaces spend huge amounts of time outside the happy path. The chapter calls out empty states especially — every new user starts in one, and a missing empty state confuses them at the worst possible moment."
  revisit={{ to: "/docs/lifecycle/design#common-anti-patterns", label: "Design the unhappy path" }}
/>

<Question
  prompt="A two-engineer startup is told by an investor to 'build microservices from day one so you can scale like Netflix.' Based on the chapter, what should they do?"
  options={[
    { text: "Adopt microservices immediately — retrofitting is impossible" },
    { text: "Start with a modular monolith; split into services only when team ownership, scaling, or compliance actually demands it" },
    { text: "Build one service per developer so everyone has ownership" },
    { text: "Skip architecture entirely and ship raw scripts to production" }
  ]}
  correct={1}
  explanation="The chapter is blunt: 'microservices because Netflix' is one of the most expensive mistakes in modern web dev. Distributed systems are slow to develop in and operationally heavy until you have a real reason."
  revisit={{ to: "/docs/lifecycle/architecture#the-modular-monolith-pattern", label: "Modular monolith vs microservices" }}
/>

<Question
  prompt="A solo developer is choosing between Postgres and MongoDB for a CRUD app. The chapter suggests they should:"
  options={[
    { text: "Flip a coin — both work equivalently" },
    { text: "Pick whichever one is trending on Hacker News this week" },
    { text: "Deliberate carefully and write a brief ADR — database choice can cost months to years to reverse" },
    { text: "Skip the decision until they have paying customers" }
  ]}
  correct={2}
  explanation="The reversibility table is the heuristic: spend deliberation proportional to cost-to-reverse. Database choice is months-to-years to undo, so it deserves a written record of why you picked what you picked."
  revisit={{ to: "/docs/lifecycle/architecture#architecture-decisions-are-hard-to-reverse", label: "Reversibility & ADRs" }}
/>

<Question
  prompt="You're about to push when you realize you accidentally committed a `.env` file with a live API key. What does the chapter say is the FIRST move?"
  options={[
    { text: "Force-push to rewrite history — you're now safe" },
    { text: "Email GitHub support and wait for them to scrub the key" },
    { text: "Rotate the secret immediately and assume it's already compromised; clean up history afterward if you want" },
    { text: "Delete the repository and re-create it" }
  ]}
  correct={2}
  explanation="Bots scrape new public commits within minutes. Once a secret appears anywhere public, treat it as leaked: generate a new one, invalidate the old one, then worry about history."
  revisit={{ to: "/docs/lifecycle/environment-setup#secrets-management", label: "Rotate leaked secrets immediately" }}
/>

<Question
  prompt="A team plans to build all the UI in week 1, all the API endpoints in week 2, and connect them in week 3. The chapter calls this approach a problem. Why?"
  options={[
    { text: "It wastes designer time" },
    { text: "Horizontal layering hides integration issues until week 3, when fixing them is expensive — vertical slices surface problems immediately" },
    { text: "Modern frameworks forbid this layout" },
    { text: "It's the only way to do test-driven development" }
  ]}
  correct={1}
  explanation="Vertical slices (one feature end-to-end, UI to API to DB) make every day a working demo and surface mismatches as they happen. Horizontal layering saves the discovery of nasty problems for the latest, most expensive moment."
  revisit={{ to: "/docs/lifecycle/implementation#six-implementation-best-practices", label: "Vertical slices vs horizontal layers" }}
/>

<Question
  prompt="The chapter claims senior developers benefit MORE from AI coding assistance than juniors. What's the reasoning?"
  options={[
    { text: "Seniors can type faster, so they get more completions per minute" },
    { text: "Seniors have access to better paid tools" },
    { text: "Reading and judging code is the new bottleneck — and that's the skill seniors have spent years sharpening" },
    { text: "Seniors write more boilerplate than juniors" }
  ]}
  correct={2}
  explanation="AI amplifies whoever drives it. Juniors without fundamentals end up with code they can't debug; seniors can tell at a glance when AI output is subtly wrong. The fundamentals matter more, not less, in the AI era."
  revisit={{ to: "/docs/lifecycle/implementation#pair-programming-and-ai-assistance", label: "AI as a power amplifier" }}
/>

<Question
  prompt="A team's CI suite is 80% slow end-to-end browser tests and 20% unit tests. What does the chapter predict will happen?"
  options={[
    { text: "CI will be fast and flake-free because E2E tests catch everything" },
    { text: "CI runs will get long and flaky, and developers will start retrying until green — eroding trust in the whole suite" },
    { text: "Coverage will reach 100% automatically" },
    { text: "The tests will be cheaper to maintain than unit tests" }
  ]}
  correct={1}
  explanation="The pyramid is shaped the way it is for a reason: unit tests are fast and stable, E2E tests are slow and flaky. Inverting the shape makes CI take hours and trains people to ignore failures."
  revisit={{ to: "/docs/lifecycle/testing#the-testing-pyramid", label: "Why the pyramid is shaped that way" }}
/>

<Question
  prompt="A junior boasts '100% test coverage — we're bug-free.' The chapter would push back. What's the best response?"
  options={[
    { text: "Coverage tools are unreliable, so the number is probably wrong" },
    { text: "Coverage only measures whether lines executed, not whether the cases that matter to users were tested — `divide(10, 2)` hits 100% but never tries `divide(10, 0)`" },
    { text: "100% coverage actually means there are no tests" },
    { text: "Coverage ignores HTML and CSS, so the number is meaningless" }
  ]}
  correct={1}
  explanation="Coverage is a minimum signal: it tells you what wasn't tested at all. It says nothing about edge cases, error paths, or whether your assertions are meaningful. The real question is whether the cases users care about are tested."
  revisit={{ to: "/docs/lifecycle/testing#coverage-is-misleading", label: "Coverage is misleading" }}
/>

<Question
  prompt="A solo developer thinks PR descriptions are pointless 'because nobody is reviewing it'. Why does the chapter still push for them?"
  options={[
    { text: "GitHub charges extra for empty PR descriptions" },
    { text: "Future-you (and any future teammate) reads PR descriptions as documentation — two minutes on a description saves twenty minutes later" },
    { text: "Linters block PRs without descriptions" },
    { text: "Empty descriptions void the open-source license" }
  ]}
  correct={1}
  explanation="A good PR description is durable documentation of what changed and why. Even on a solo project, you'll thank yourself in six months when you can't remember why you touched that file."
  revisit={{ to: "/docs/lifecycle/code-review#review-scale-by-team-size", label: "PR descriptions & self-review" }}
/>

<Question
  prompt="A team practices 'continuous delivery' but not 'continuous deployment'. What's the practical difference at release time?"
  options={[
    { text: "They use different CI tools" },
    { text: "Every change is deployable and goes through automation, but a human pushes the final button to release to production" },
    { text: "Continuous delivery is for backends; deployment is for frontends" },
    { text: "There's no difference — the terms are synonyms" }
  ]}
  correct={1}
  explanation="Both rely on automation; the difference is who gates production. Continuous delivery keeps a human in the loop; continuous deployment trusts passing CI as the gate. Many companies stop at delivery because their test suite isn't trusted enough for full auto-deploy."
  revisit={{ to: "/docs/lifecycle/ci-cd#cd-continuous-deployment-vs-delivery", label: "Delivery vs Deployment" }}
/>

<Question
  prompt="It's 3pm Friday. You want to ship a risky migration. The chapter's nuanced 'don't deploy on Fridays' guidance says you can if…"
  options={[
    { text: "A senior engineer signs off in person" },
    { text: "Your rollback is fast and reliable — you can revert and flag-off in 60 seconds" },
    { text: "It's marked as an emergency" },
    { text: "Never — Friday deploys are universally banned" }
  ]}
  correct={1}
  explanation="The rule isn't really about Fridays — it's about how long you'll spend fixing a broken deploy. Backward-compatible migrations plus fast rollback turn 'scary deploy' into 'boring deploy', and the day of the week stops mattering."
  revisit={{ to: "/docs/lifecycle/deployment-hosting#a-safe-deploy-checklist", label: "The Friday-deploy rule" }}
/>

<Question
  prompt="Production is slow. Your error metrics spiked, but you don't know which step in the request is the culprit. Which observability signal is the right tool?"
  options={[
    { text: "Logs — they answer 'what happened' but won't break down a single request by step" },
    { text: "Metrics — they aggregate over time but don't isolate one request" },
    { text: "Traces — a tree of timed spans showing exactly where the time went for one request" },
    { text: "Uptime monitors — they only check if the site is up" }
  ]}
  correct={2}
  explanation="The chapter's rule of thumb: logs answer 'what happened', metrics answer 'how often or how fast', traces answer 'why was this single request slow'. Production debugging usually needs all three together."
  revisit={{ to: "/docs/lifecycle/observability#observability-in-2026", label: "Logs vs metrics vs traces" }}
/>

<Question
  prompt="An outage post-mortem opens with 'Alice deployed a bad change that took down checkout.' The chapter would rewrite this how?"
  options={[
    { text: "Skip the post-mortem — Alice already feels bad" },
    { text: "Focus on the system: a change passed CI but had a runtime bug because staging didn't mirror production data; action item to refresh staging weekly" },
    { text: "Add more reviewers so this never happens again" },
    { text: "Make Alice present it to the whole company as a learning exercise" }
  ]}
  correct={1}
  explanation="Blameless post-mortems focus on systems and processes, not individuals. People make mistakes; resilient systems tolerate them. Only the system-level rewrite produces an action item that prevents the next outage."
  revisit={{ to: "/docs/lifecycle/maintenance#incident-response", label: "Blameless post-mortems" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 4: Tech Stack](/docs/stack) to see what specific tools you'd reach for at each phase.
