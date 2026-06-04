---
id: solo-checkpoint
title: Chapter 10 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 10 — Solo / Personal. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 11.
---

# Chapter 10 Checkpoint

You've finished the Solo / Personal chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button and Chapter 11 in the sidebar.

<Quiz id="solo-checkpoint" title="Solo workflow checkpoint" sampleSize={5}>

<Question
  prompt="You're a solo developer and catch yourself drafting an architecture decision record for whether to pick Next.js or Astro. Per the chapter's core thesis, what's the underlying mistake?"
  options={[
    { text: "You picked the wrong two frameworks to compare" },
    { text: "You're applying enterprise-coordination patterns to a one-person project" },
    { text: "You should have written the ADR before installing dependencies" },
    { text: "ADRs are required only for backend frameworks" }
  ]}
  correct={1}
  explanation="ADRs exist so dozens of people on a team can later understand a decision. Solo, you ARE all the reviewers — process meant to align many people just slows you down. The biggest solo mistake is applying enterprise patterns to personal projects."
  revisit={{ to: "/docs/solo/mindset#the-biggest-mistake", label: "Mindset — the biggest mistake" }}
/>

<Question
  prompt="A friend describes their idea: 'a website where running friends log in, draw shared routes on a map, and comment on each other's runs.' Which project type from Chapter 10 does that actually map to?"
  options={[
    { text: "Type 1 (Portfolio Site)" },
    { text: "Type 2 (Personal Blog / Content Site)" },
    { text: "Type 3 (Hobby SaaS / Indie Product)" },
    { text: "Type 4 (Tool or Utility)" }
  ]}
  correct={2}
  explanation="Logins, shared data, comments — that's a full app with auth, a database, and per-user state. The chapter explicitly warns that mistaking this for 'a blog with maps' (Type 2) under-estimates effort by roughly 10x."
  revisit={{ to: "/docs/solo/project-types#five-common-shapes", label: "Project types — matching shape to project" }}
/>

<Question
  prompt="You sit down with a new idea and run the four go/no-go questions: Would I use it weekly? Clear next user? Can I build v1 in 2-4 weekends? Will I still care in 3 months? Honest answer to the last one: 'probably no, I'd use it a month then forget.' What does the chapter say to do?"
  options={[
    { text: "Build it anyway — momentum will keep you interested" },
    { text: "Don't build it; that five-minute exercise just saved a month of work on a project that wouldn't have stuck" },
    { text: "Build a Type 1 portfolio version of it instead" },
    { text: "Spend another weekend planning until the answer flips to yes" }
  ]}
  correct={1}
  explanation="That's exactly the chapter's worked go/no-go example. The point of the questions is to filter side projects before they accumulate in your graveyard and demoralize you. A 'probably no' on caring in 3 months is a strong don't-build signal."
  revisit={{ to: "/docs/solo/planning#step-4-decide-if-its-worth-building", label: "Planning — go/no-go" }}
/>

<Question
  prompt="You're building a hobby SaaS and want to learn Svelte at the same time. Per the chapter, when is swapping Svelte in for Next.js a defensible call?"
  options={[
    { text: "Always — learning is part of every project" },
    { text: "Only when launching the app is your primary goal" },
    { text: "Only when learning Svelte is the primary goal and the app is the vehicle" },
    { text: "Never — the default stack always wins" }
  ]}
  correct={2}
  explanation="The exception to the boring-stack rule is learning. If learning Svelte is your real primary goal, use it. But be honest — don't pretend a Svelte detour is 'for the project' when it's really for you, because that detour adds 2-4 weeks of friction."
  revisit={{ to: "/docs/solo/stack-selection#why-not-other-stack", label: "Stack selection — when to deviate" }}
/>

<Question
  prompt="You've just finished step 12 of the environment setup (env vars added to Vercel). The chapter calls step 13 — git push to deploy an empty project — 'the single most important step.' What does it actually guarantee?"
  options={[
    { text: "The site ranks for your domain on day one" },
    { text: "The deploy pipeline works before you write features, so broken deploys surface immediately rather than after a week of stacked changes" },
    { text: "Stripe and Clerk auto-sync their dashboards" },
    { text: "You get a free custom domain from Vercel" }
  ]}
  correct={1}
  explanation="Deploying nothing first proves the whole pipeline works in isolation. If you skip this and build for a week first, you'll hit five interacting deploy errors at once — much harder to debug than one at a time."
  revisit={{ to: "/docs/solo/env-setup#a-complete-modern-setup", label: "Env setup — deploy before you build" }}
/>

<Question
  prompt="A week before launch you find yourself thinking 'I should add CSV export, people will want that.' You check: it's not in the v1 list, no user has asked for it (you have no users yet), launch won't fail without it, and it's 'just an evening' (translation: a weekend). What does the chapter say to do?"
  options={[
    { text: "Add it — better to launch complete than apologize later" },
    { text: "Write 'CSV export' on the v2 list and ship the current version" },
    { text: "Switch to a different stack to add it faster" },
    { text: "Delay launch indefinitely until the feature set feels satisfying" }
  ]}
  correct={1}
  explanation="That's the chapter's worked example of catching feature creep. None of the four 'does this need to be in v1' tests pass, so the right move is parking it for v2 and shipping. 'Just one more feature' is one of the named pitfalls that kills indie projects."
  revisit={{ to: "/docs/solo/pitfalls#feature-creep", label: "Pitfalls — feature creep" }}
/>

<Question
  prompt="Your addBook Server Action inserts a row and returns. A user adds a book but the library page still shows the old list until they hard-refresh. What's the missing piece?"
  options={[
    { text: "A 'use client' directive on the form component" },
    { text: "A call to revalidatePath('/library') after the insert" },
    { text: "A second insert to update a denormalized counter" },
    { text: "An explicit redirect to /library" }
  ]}
  correct={1}
  explanation="Next.js caches rendered pages. Mutations don't auto-invalidate the cache — you have to call revalidatePath (or revalidateTag) for the affected paths so the next render produces fresh HTML with the new row."
  revisit={{ to: "/docs/solo/development#server-actions", label: "Development — Server Actions" }}
/>

<Question
  prompt="You're tempted to roll your own auth because 'it's just an email and a password.' Which list of follow-on concerns does the chapter argue actually makes the build catastrophic for a solo dev?"
  options={[
    { text: "Logo design, copywriting, and SEO meta tags" },
    { text: "Password resets, email verification, social login, MFA, sessions, account recovery, passkeys, OAuth flows, breach notifications" },
    { text: "ESLint config, Prettier rules, and Husky hooks" },
    { text: "Vercel env vars, DNS records, and TLS provisioning" }
  ]}
  correct={1}
  explanation="The login form is the trivial part. Everything after it — resets, verification, social, MFA, session management, recovery, passkeys, OAuth, breach checks — is months of subtle security work that Clerk has spent millions to get right."
  revisit={{ to: "/docs/solo/auth#phase-5-adding-auth", label: "Auth — why use hosted auth" }}
/>

<Question
  prompt="In a Stripe Checkout integration, why is metadata: { userId } passed when creating the session — even though Stripe will also send back a customer ID?"
  options={[
    { text: "Stripe rejects sessions without metadata" },
    { text: "It prefills the customer's name on the Checkout page" },
    { text: "It's the bridge that lets the webhook map a Stripe customer back to YOUR user, without relying on email (which can change)" },
    { text: "It enables Stripe's test mode automatically" }
  ]}
  correct={2}
  explanation="The webhook arrives with a Stripe customer ID, not your userId. Without metadata you'd have to look the user up by email — but emails change. metadata: { userId } is the stable bridge between Stripe's identity space and yours."
  revisit={{ to: "/docs/solo/payments#step-1-create-a-checkout-session", label: "Payments — the metadata trick" }}
/>

<Question
  prompt="You ship a preview deploy that accidentally charges a real card and emails a production user. The chapter frames this as 'the most common solo deployment incident.' What's the structural fix?"
  options={[
    { text: "Add a JavaScript check that warns before any payment in non-prod" },
    { text: "Run only one Vercel environment for everything" },
    { text: "Scope env vars per environment — test Stripe keys + preview DB + sandbox email for Development/Preview; live keys only for Production" },
    { text: "Disable webhooks until launch day" }
  ]}
  correct={2}
  explanation="The fix isn't a runtime check — it's keeping production keys structurally out of preview environments. Vercel's per-environment env vars (Development / Preview / Production) make this trivial; just gate live Stripe, prod DB, and real email senders to Production only."
  revisit={{ to: "/docs/solo/deployment#environment-variables", label: "Deployment — prod vs preview keys" }}
/>

<Question
  prompt="A user emails 'the books page is broken.' With the three-tool observability stack set up before launch, which tool gives you the stack trace, breadcrumbs of what they clicked, and browser context — collapsing the diagnosis to under a minute?"
  options={[
    { text: "Vercel Analytics — page-view logs with user context" },
    { text: "PostHog — product events with full breadcrumbs" },
    { text: "Sentry — exception with stack trace, breadcrumbs, and user context" },
    { text: "Better Stack — homepage pings every three minutes" }
  ]}
  correct={2}
  explanation="Sentry is the 'what broke' tool. The whole point of telemetry is having it BEFORE something breaks — you can't retroactively capture yesterday's stack trace. Vercel Analytics handles traffic, PostHog handles product behavior, Better Stack handles uptime."
  revisit={{ to: "/docs/solo/observability#sentry-for-errors", label: "Observability — Sentry for errors" }}
/>

<Question
  prompt="The chapter's 'product is the launch' highlight argues which of these is true about launch-day tactics vs. product quality?"
  options={[
    { text: "A perfect launch can carry a mediocre product to long-term success" },
    { text: "A great product with a mediocre launch grows slowly but compounds; a mediocre product with a great launch spikes then crickets" },
    { text: "Launches don't matter at all — never post anywhere" },
    { text: "Product Hunt is the only launch venue worth your time" }
  ]}
  correct={1}
  explanation="If weekend time is finite, spend the bulk of it on the product, not launch-day choreography. Compounding growth from a great product beats a one-time traffic spike from a great launch every time."
  revisit={{ to: "/docs/solo/launching#phase-9-launching", label: "Launching — the product is the launch" }}
/>

<Question
  prompt="You've shipped your indie SaaS. The chapter recommends a 15-minute weekly maintenance routine. Which four checks does it consist of?"
  options={[
    { text: "Lint, format, type-check, and test" },
    { text: "Sentry for errors, Stripe for failed charges, inbox for user emails, GitHub for safe Dependabot PRs" },
    { text: "Tweet, post to HN, post to Reddit, post to Product Hunt" },
    { text: "Refactor one file, add one test, update one doc, ship one feature" }
  ]}
  correct={1}
  explanation="Fifteen minutes a week covers it until you have hundreds of users: triage a Sentry issue, scan Stripe for failed charges or chargebacks, reply to any user emails (even just 'got it'), and merge safe Dependabot updates."
  revisit={{ to: "/docs/solo/maintenance#regular-maintenance", label: "Maintenance — weekly routine" }}
/>

<Question
  prompt="You want to ship a SaaS quickly with auth, payments, and a landing page already wired. A friend recommends a paid starter kit. Per the chapter, what's the one thing you MUST do before npm install-ing it?"
  options={[
    { text: "Negotiate a discount with the vendor" },
    { text: "Spend an evening reading its source — if you can't follow the auth flow or payment handler, walk away" },
    { text: "Fork it and rewrite every file before shipping" },
    { text: "Wait for a free open-source clone to appear" }
  ]}
  correct={1}
  explanation="The single template danger is deploying code you can't read. When a Stripe webhook misfires in production, 'I have no idea, the template does it' is a debugging time bomb. Read the source first; walk away if the critical paths are opaque."
  revisit={{ to: "/docs/solo/templates#templates-worth-knowing-in-2026", label: "Templates — understand or don't use" }}
/>

<Question
  prompt="Your indie SaaS has 400 paying users, earns $2K/month, and last week a bad deploy broke checkout for three hours — you only found out because a user emailed. You're working 30 hours a week on it, can't take a vacation, and just shipped a refactor that quietly broke billing. Per the chapter, what is this?"
  options={[
    { text: "Normal solo-project turbulence — push through with more weekend hours" },
    { text: "A clear graduation moment — time to add the specific process (Playwright tests, uptime alerts, runbook, possibly a co-founder) the pain demands" },
    { text: "A signal to throw away the project and start fresh" },
    { text: "Proof that the default stack doesn't scale" }
  ]}
  correct={1}
  explanation="That's the chapter's worked example of a graduation moment: real users hurt by a real outage, vacation-blocking on-call, billing-breaking refactor with no E2E test. The fix isn't 'try harder solo' — it's adding the specific process the previous stage's pain earned its way into."
  revisit={{ to: "/docs/solo/graduating#signs-youve-graduated", label: "Graduating — clear graduation moment" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 11: Startup / Small Co.](/docs/startup) to see how the workflow scales when you're not alone anymore.
