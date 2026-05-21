---
id: deployment
title: 'Phase 7: Deployment'
sidebar_position: 10
sidebar_label: 9. Deployment
description: Pushing to GitHub triggers Vercel to build and deploy automatically. Preview URLs for every branch, custom domain in ten minutes.
---

# Phase 7: Deployment

> **In one line:** `git push` is now the entire deployment process. Vercel detects Next.js, builds, deploys, and gives you a URL — including a preview URL per branch.

:::tip[In plain English]
"Deployment" used to be a multi-day ordeal involving SSH keys, server provisioning, and reverse-proxy configs. Now you push code to GitHub and a URL appears. The interesting work in this phase isn't the deploy itself — it's the things that wrap around it: custom domains, preview environments, and separating dev/preview/prod environment variables.
:::

## What `git push` actually does

You set this up in [Phase 3](./env-setup). Pushing to GitHub triggers Vercel to:
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

## What's next

→ Continue to [Phase 8: Observability](./observability) where three free tools cover almost all your monitoring needs.
