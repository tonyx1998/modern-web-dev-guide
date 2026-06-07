---
id: stage-12-going-pro
title: Stage 12 — Going professional
sidebar_position: 13
sidebar_label: Stage 12 — Going pro
description: The gap between "I can build software" and "I work professionally as a web developer" — Docker, CI/CD, code review, environments, cloud literacy, communication.
---

# Stage 12 — Going professional

> **Time budget:** ~3–6 weeks intensive, then ongoing

> **In one line:** The practices teams use to ship reliable software together — the gap between "I can build" and "I can work on a team."

Stage 11 ended with "I can build software." This stage covers the gap between that and "I work professionally as a web developer." The difference isn't technical depth — it's the practices teams use to ship reliable software together. Skipping this stage is the most common reason self-taught developers stall at junior level: they can build, but they can't *work on a team*.

Seven practices. None of them are about new frontend frameworks. All of them are universal across web dev jobs.

For the broader career arc this stage feeds into, see [Career Path](/docs/career). For the decision frameworks senior engineers use to make calls under uncertainty, see [Decisions](/docs/decisions).

### 1. Docker — containerise everything

A **container** is your app plus everything it needs to run (the right Node version, system libraries, environment variables, dependencies) packaged into a single image that runs identically on any machine. **Docker** is the tool everyone uses to build and run them.

Why every team uses Docker:

- **"Works on my machine" eliminated.** If it runs in the container locally, it runs in the container in production. The environment is the same.
- **Onboarding goes from days to minutes.** A new developer clones the repo, runs `docker compose up`, and has a working dev environment.
- **Production deploys are predictable.** The image you tested in CI is the exact same image that runs in production.

```dockerfile
# Dockerfile — a recipe for building your app's image
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml — multiple containers wired together for dev
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
volumes:
  postgres_data:
```

The five Docker commands you'll use 95% of the time:

```bash
docker build -t myapp .          # build an image from the Dockerfile
docker run -p 3000:3000 myapp    # run a container from the image
docker ps                        # list running containers
docker logs <container>          # view logs
docker compose up                # start everything in compose.yml
```

**Where to go deeper:**

- [Docker's official "Get Started"](https://docs.docker.com/get-started/) — short, hands-on, the right starting point.
- [docker-curriculum.com](https://docker-curriculum.com/) — free, thorough, project-oriented.

### 2. CI/CD with GitHub Actions

Continuous Integration: every push to the repo triggers automated checks (tests pass? code formatted? type-checks clean?). Continuous Deployment: every merge to `main` triggers an automated deploy. Together they replace the "ship Fridays at 5pm, hope nothing breaks" era with "ship 50 times a day, confident every time."

```yaml
# .github/workflows/ci.yml — runs on every push and PR
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

That file is checked into your repo at `.github/workflows/ci.yml`. GitHub picks it up automatically. Every PR now gets a green/red status check; broken changes can't be merged.

The mental model: CI is a robot that does on every change what you would do manually if you remembered. The only way to "forget" tests now is to write code so unhinged the test never existed.

**Where to go deeper:**

- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart) — 10 minutes to a green build.
- ["Learn GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions) — workflows, jobs, secrets, environments.

### 3. PR workflow and code review

Solo work: you write, you commit, you push. Team work: you write on a branch, open a Pull Request, a colleague reviews it, you address feedback, it gets merged. This loop happens dozens of times a day on a real team.

Writing a good PR:

- **One purpose per PR.** Don't bundle "fix bug + refactor + add feature." Reviewers can't reason about three things at once.
- **Title that describes the change.** "Fix duplicate-submit on contact form" — not "fix bug."
- **Description with context.** What problem this solves, what approach you took, what the reviewer should look at carefully, and how you tested it. Three paragraphs max.
- **Small.** Under 400 lines of diff when possible. Reviewer fatigue is real — a 2000-line PR will get rubber-stamped or ignored, not actually reviewed.
- **Self-review first.** Before requesting review, look at your own diff in the GitHub UI. You'll catch obvious issues; reviewers won't waste time on the easy stuff.

Reviewing someone else's PR — the four things to look for, in order:

1. **Does it do what the PR description says it does?** (Correctness)
2. **Will future-me be able to understand this in 6 months?** (Clarity)
3. **Are there security, performance, or reliability concerns?** (Risk)
4. **Is there a simpler way?** (Design — but be careful here; "simpler" is subjective and bikeshedding burns trust)

Receiving review without taking it personally: code review is about the code, not you. "This could be clearer" is not "you're a bad developer." The fastest path through review is to engage every comment — either change the code, or reply with why you disagree and discuss. Ghosting comments wastes everyone's time.

### 4. Environments: dev, staging, production

Three copies of your app run in parallel:

| Environment | What it is | Who touches it |
|-------------|------------|----------------|
| **Development (dev)** | Your laptop. Hot reload, fake data, no consequences. | Just you |
| **Staging** | A production-like copy on the internet. Real deploy pipeline, real DB (separate from prod), fake or anonymised data. | Whole team, plus maybe QA / product |
| **Production (prod)** | What real users hit. Real data. Outages cost money. | Read-only for most of the team; writes only via deploys |

The standard release flow: PR opens a *preview deploy* (a one-off URL just for that branch); merge to main deploys to *staging* automatically; promotion to *production* is a deliberate human action (a button, a tag, a Slack command). Vercel does the first two for you out of the box. The third is policy more than tech — every team designs it slightly differently.

What changes per environment:

- **Environment variables.** Different API keys, different DB URLs. Never hardcode; always `process.env`.
- **The database.** Each env has its own. Restoring a backup from prod into staging is fine; the other direction is how you get fired.
- **Feature flags** (Part II Tier 2): the same code branches differently per env so half-built features can land in main without shipping to users.

### 5. Reading and contributing to large codebases

Your first day on a real codebase will be humbling. 200,000 lines of code. 50 services. Conventions you don't recognise. Files you can't find. This is normal. The skill is having a method.

1. **Don't try to understand everything.** You won't, ever. Successful senior devs at large companies routinely don't know 90% of the codebase. They know how to navigate it.
2. **Pair on something.** First week: shadow a colleague through a feature. Watching someone move through the codebase teaches the conventions faster than reading them.
3. **Use the search.** VS Code's "find in files" + GitHub code search are your best friends. Search for the user-facing string ("Sign In") to find the component; from there walk outward.
4. **Trust the types.** In a TypeScript codebase, click-through to definitions is faster than reading. The types form a map.
5. **Match the existing style.** When you add code, copy the patterns in the surrounding files. "Improvements" that fight the codebase's conventions look like noise in code review.
6. **Ask questions in writing.** A Slack thread "I'm trying to understand why X is structured as Y — is it because of Z?" gets answers, creates a searchable record, and signals "I'm thinking."

### 6. Communication and estimation

You will spend less time writing code than you think and more time writing in English. Slack messages, GitHub comments, design docs, PR descriptions, standup updates. The engineers who get promoted are not the ones who write the most code — they're the ones who make the team produce more.

- **Async-first.** Default to written, async communication (Slack thread, GitHub comment) over synchronous (meeting, DM). Async lets people respond when they're not deep in something else, creates a record, and scales across time zones. Reserve synchronous for "we've been going back and forth for an hour, let's just hop on a call."
- **Status updates that don't waste time.** Three lines: "Yesterday I did X. Today I'm doing Y. Blocked on Z." If nothing's blocked, say so. If something is, name it specifically — vague blockers don't get unblocked.
- **Estimating: be honest, be specific.** "Should be done by Friday" is useless if it's actually "next Wednesday." Senior engineers under-promise: they pad estimates by 50–100% because real work always includes unknown debugging. If a task is bigger than a few days, break it into smaller shippable pieces — the act of breaking it down exposes hidden complexity.
- **When to ask for help.** Rule of thumb: 30 minutes of genuine struggle, then ask. Less than that and you're not learning. More than that and you're burning team time. Always ask with what you've already tried (Part IV — Asking Good Questions).

### 7. Cloud literacy (the right amount for a web dev)

Most web dev jobs touch **AWS**, **GCP**, or **Cloudflare**. You don't need to be a cloud architect — that's a different role. You need *literacy*: enough to deploy your app, read your logs, and know which service does what. Two hours of orientation per cloud is the right budget.

- **Compute**: where your app runs. AWS: ECS / Lambda / EC2. GCP: Cloud Run / Cloud Functions / GCE. Cloudflare: Workers. For most web apps, *serverless containers* (ECS Fargate, Cloud Run) or *edge functions* (Workers, Vercel) are the sweet spot — no servers to manage, scales automatically.
- **Storage**: where files go. AWS S3, GCS, Cloudflare R2. All three are object storage with the same shape: upload a file, get a URL. R2 is the cheapest by a wide margin (no egress fees).
- **Databases**: managed Postgres. AWS RDS, Google Cloud SQL, Neon, Supabase. Pick the one your team uses. The query language is the same; the dashboard is different.
- **Logs**: AWS CloudWatch, GCP Cloud Logging. Bring up a log stream, filter by your service, see what's happening. You'll do this every time something breaks.
- **IAM** (Identity and Access Management): who can do what. Read at the level of "this role can access this S3 bucket but not that one." Don't try to learn AWS IAM deeply — it's a swamp.

### 8. Kubernetes — the literacy version

Kubernetes (k8s) is the container orchestration system. It runs containers across a fleet of machines, restarts them when they crash, scales them up under load, routes traffic between them. *Deep* k8s — writing operators, tuning the scheduler, debugging networking, capacity planning — is what platform engineers and SREs do. As a web dev, the right depth is much shallower:

- **Read a Deployment manifest.** A YAML file describing "I want N copies of this container image, with these env vars, exposed on this port." You'll see them; understand them.
- **Use `kubectl` at the basic level.** `kubectl get pods`, `kubectl logs <pod>`, `kubectl describe pod <pod>`, `kubectl exec -it <pod> -- sh`. That's 80% of what application devs use it for.
- **Know what a Helm chart is.** Templated k8s manifests; how teams deploy real apps to clusters. You'll modify values files; you usually won't write charts.
- **Understand the words.** Pod, deployment, service, ingress, namespace, configmap, secret. These are vocab, not concepts; learn what they mean in 30 minutes.

That's a three-day weekend of effort and it covers what most backend / full-stack roles need. If you join a team that runs k8s, this is enough to deploy your app, read your logs, and debug crashes. Deeper k8s is a career path of its own — pursue it only if platform engineering is what you want to do.

## Where to go deeper

- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) (official, interactive) — exactly the right level for web devs.
- ["Kubernetes in 100 Seconds"](https://www.youtube.com/watch?v=X48VuDVv0do) by Fireship for orientation; then the official tutorial for hands-on.
- [learnk8s.io](https://learnk8s.io/) — articles and free guides; deeper than you need at first, but excellent reference later.

## Deeper in this guide

- [Career Path](/docs/career) — the broader arc this stage feeds into: junior → mid → senior, and the skills that compound at each step.
- [Decisions](/docs/decisions) — the decision frameworks senior engineers use to make calls under uncertainty (boring technology, reversibility, build vs buy).

## Project

:::tip[Project — Take your Stage 11 project to "production-grade"]
Add the following to the full-stack project you built in Stage 11: (1) a `Dockerfile` for the app and a `docker-compose.yml` that brings up the app + a Postgres database with one command; (2) a `.github/workflows/ci.yml` that runs lint, type-check, and tests on every PR; (3) a *staging* environment separate from production (Vercel preview deployments count); (4) a README explaining how a new developer would clone, install, and run the project locally — then have a friend actually do it and watch where they get stuck. Bonus: open a PR to one open-source repo you've used (a tiny doc fix or typo counts) just to experience the OSS PR loop end-to-end.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Skipping Stage 12 because "I can already build."** This is the most common reason self-taught developers stall at junior level. The gap between "I can build" and "I can work on a team" is communication, PR workflow, CI, environments, and code review — none of it is new tech, all of it gates promotion.
- **Treating PRs as a code dump.** A 2000-line "fix everything" PR will be rubber-stamped or ignored — neither is review. One purpose per PR, under 400 lines of diff, clear title and description. Reviewer fatigue is a real failure mode.
- **Taking review feedback personally.** "This could be clearer" is about the code, not you. Engage every comment — change it or explain why you disagree. Ghosting comments wastes the team's time and reads as defensiveness.
- **Trying to learn Kubernetes the way an SRE would.** As an application dev, you need to read a Deployment YAML and run `kubectl get/logs/describe/exec` — that's it. Going deep on operators and the scheduler is a career path of its own; pursue only if platform engineering is the goal.
:::

## Page checkpoint

<Quiz id="stage-12-page" title="Did Stage 12 stick?" sampleSize={3}>

<Question
  prompt="What is a Docker container, in one sentence?"
  options={[
    { text: "A virtual machine running its own OS kernel" },
    { text: "Your app plus everything it needs to run (specific runtime, libraries, env vars, dependencies) packaged into an image that runs identically on any machine" },
    { text: "A faster version of `npm install`" },
    { text: "A code repository hosted by Docker Inc." }
  ]}
  correct={1}
  explanation="Containers package the app *with* its environment, so 'works on my machine' stops being a mystery — the same image runs in CI, on a colleague's laptop, and in production. They share the host kernel (unlike VMs), which is why they're fast."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-12-going-pro#1-docker--containerise-everything", label: "Revisit: Docker" }}
/>

<Question
  prompt="What's the right size and scope for a PR you submit to a team?"
  options={[
    { text: "As big as possible — fewer PRs to review" },
    { text: "One logical purpose, under ~400 lines of diff, with a clear title and a description covering why + how to test" },
    { text: "Always exactly one file changed" },
    { text: "Whatever you happened to commit that day" }
  ]}
  correct={1}
  explanation="Small focused PRs get genuinely reviewed; huge ones get rubber-stamped. 'One purpose' lets reviewers reason about the change as a unit; a clear description respects their time and surfaces what they should look at hardest."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-12-going-pro#3-pr-workflow-and-code-review", label: "Revisit: PR workflow and code review" }}
/>

<Question
  prompt="As an application developer (not an SRE), what's the right depth to learn Kubernetes?"
  options={[
    { text: "Deep — write your own operators and tune the scheduler" },
    { text: "Zero — your platform team handles it" },
    { text: "Read a Deployment manifest, run `kubectl get pods / logs / describe / exec`, know what a Helm chart is, learn the vocab (pod, service, ingress, namespace, configmap, secret) — about a three-day weekend of effort" },
    { text: "Replace Kubernetes with Docker Compose in production" }
  ]}
  correct={2}
  explanation="Application devs need *literacy*: deploy their app, read its logs, and debug crashes inside a cluster. Deep k8s — operators, scheduler internals, networking — is a separate career path. Match depth to your role."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-12-going-pro#8-kubernetes--the-literacy-version", label: "Revisit: Kubernetes — the literacy version" }}
/>

</Quiz>

→ [Next: Part II — Once you can ship](/docs/roadmap/part-2-modern-stack) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
