---
id: deployment
title: 'Phase 8: Deployment'
sidebar_position: 10
sidebar_label: 9. Deployment
description: Pushing to GitHub triggers Vercel to build and deploy automatically. Preview URLs for every branch, custom domain in ten minutes.
---

# Phase 8: Deployment

> **In one line:** `git push` is now the entire deployment process. Vercel detects Next.js, builds, deploys, and gives you a URL — including a preview URL per branch.

:::tip[In plain English]
"Deployment" used to be a multi-day ordeal involving SSH keys, server provisioning, and reverse-proxy configs. Now you push code to GitHub and a URL appears. The interesting work in this phase isn't the deploy itself — it's the things that wrap around it: custom domains, preview environments, and separating dev/preview/prod environment variables.
:::

## What `git push` actually does

You set this up in [Phase 4](./env-setup). Pushing to GitHub triggers Vercel to:
1. Detect Next.js.
2. Install dependencies (with Bun if you set it up).
3. Run the build.
4. Deploy to a unique URL.
5. Promote `main` to your production domain.

## Custom Domain

In the Vercel dashboard:
1. Settings → Domains → Add Domain.
2. Buy a domain (Vercel sells them, or use Cloudflare/Porkbun/Namecheap).
3. Add the DNS records Vercel tells you to.
4. Vercel automatically provisions SSL.

Total cost: $10–15/year for the domain.

## Preview Deployments

Every branch and every PR gets its own URL. Share preview links with friends to get feedback before merging.

## Environment Variables

Vercel has three environments by default: Development, Preview, Production. Set environment variables per-environment in the dashboard.

Tip: Use different Stripe keys (test vs live) and different database URLs for preview vs production.

:::note[Worked example: previewing a risky change]
You want to refactor the entire library page. Don't push it to `main` directly — instead:

1. `git checkout -b refactor/library-page`
2. Make all your changes; commit and push.
3. Open the branch on GitHub. Vercel comments on the PR with a preview URL like `shelftrack-git-refactor-library-tonyx.vercel.app`.
4. Click through the preview yourself. Send the URL to a friend. See if anything regressed.
5. If broken: fix on the branch; the preview redeploys automatically.
6. If clean: merge to `main`. Production deploys.

The branch and preview can live for days. You can have ten of these open at once. Each gets its own isolated URL.
:::

:::info[Highlight: keep prod and preview keys separate]
The most common solo deployment incident: shipping a test charge to a real customer's card, or a preview deploy emailing a production user. Fix it once, structurally:

- **Stripe:** test key for Development + Preview, live key only for Production.
- **Database:** preview database (a Neon branch is great) for Preview, prod database only for Production.
- **Resend / email:** sandbox mode (or a "throwaway" sender domain) for non-prod environments.

Vercel's per-environment env vars make this trivial — just toggle which env vars apply to which environment in the dashboard.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Pushing directly to `main` for everything.** It works until a half-finished commit takes prod down at 11pm on a Tuesday. The fix is a branch + preview URL for anything riskier than a typo — preview deploys are free, and the 30-second click-through catches most regressions.
- **Using the production database from the Preview environment.** Your preview branch points `DATABASE_URL` at prod, you test a schema migration, and now real users see the half-applied state. The fix is a Neon branch (or a separate test database) wired to the Preview environment — Neon makes spinning one up a single click.
- **Pointing the apex domain straight at Vercel and forgetting `www`.** Half your users type `www.yourapp.com` and hit a stranger's NXDOMAIN page. The fix is to add both `yourapp.com` and `www.yourapp.com` in Vercel and pick one as the canonical redirect target.
- **Letting failed builds sit red for days.** "I'll fix it later" turns into a week of "main is broken but I'm working on a branch." The fix is to treat a red build like a phone alarm — fix or revert within the hour, even if the fix is `git revert`. A green `main` is non-negotiable.
- **Never reading the build log.** Vercel reports "Deployment Ready" but the function bundle is 250MB and timing out. The fix is to actually open the build output once a month — bundle size, slow steps, warnings — before they become incidents.
:::

## Page checkpoint

<Quiz id="solo-deployment-page" title="Did the deployment flow stick?" sampleSize={2}>

<Question
  prompt="What single command effectively performs deployment in this setup?"
  options={[
    { text: "vercel deploy --prod" },
    { text: "git push" },
    { text: "bun run deploy" },
    { text: "ssh into the server and pull" }
  ]}
  correct={1}
  explanation="Once Vercel is connected to the GitHub repo, git push triggers detection, install, build, deploy, and promotion to your production domain — all without further input."
  revisit={{ to: "/docs/solo/deployment#what-git-push-actually-does", label: "What git push does" }}
/>

<Question
  prompt="What's the most common solo deployment incident the page calls out?"
  options={[
    { text: "Forgetting to write the README" },
    { text: "Shipping a test charge to a real card, or a preview emailing a prod user" },
    { text: "DNS propagation failing globally" },
    { text: "Vercel rejecting Next.js 15 builds" }
  ]}
  correct={1}
  explanation="The classic bug is using production credentials in preview environments — a test charge hits a real customer, or a preview deploy emails production users. Fix it structurally with per-environment env vars."
  revisit={{ to: "/docs/solo/deployment#environment-variables", label: "Prod vs preview keys" }}
/>

<Question
  prompt="Which environments does Vercel provide by default for env vars?"
  options={[
    { text: "Local and Live" },
    { text: "Dev, Staging, QA, and Production" },
    { text: "Development, Preview, and Production" },
    { text: "Just Production" }
  ]}
  correct={2}
  explanation="Vercel has three default environments: Development, Preview, and Production. You can scope env vars to any subset of those, which is how you keep test Stripe keys out of production."
  revisit={{ to: "/docs/solo/deployment#environment-variables", label: "Environment variables" }}
/>

<Question
  prompt="What does every branch and PR get on Vercel?"
  options={[
    { text: "A copy of production data" },
    { text: "Its own unique preview URL" },
    { text: "An automatic merge to main" },
    { text: "A separate paid plan" }
  ]}
  correct={1}
  explanation="Each branch and PR gets its own isolated preview URL — perfect for sharing with friends to get feedback before merging. The branch can live for days; the preview redeploys on every push."
  revisit={{ to: "/docs/solo/deployment#preview-deployments", label: "Preview deployments" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 9: Observability](./observability) where three free tools cover almost all your monitoring needs.
