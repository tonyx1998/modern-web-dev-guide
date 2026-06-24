---
id: cloud-gitops
title: GitOps & Infrastructure-as-Code at Scale
sidebar_position: 13
sidebar_label: GitOps & IaC at scale
description: From terraform apply to self-converging infrastructure — GitOps and continuous reconciliation (ArgoCD/Flux), IaC beyond the intro (modules, remote state, state splitting), policy-as-code, drift detection, and secrets management that actually holds up.
---

# GitOps & Infrastructure-as-Code at Scale

> **In one line:** You already met [infrastructure-as-code](./cloud-iac) — describe infra in version-controlled files and `apply` it; this page takes the next step, where **Git is the single source of truth** and a controller *continuously reconciles* real infrastructure to match it (so a hand-edit gets reverted automatically), and where IaC grows up with modules, split state, **policy-as-code**, and real **secrets management**.

:::tip[In plain English]
The [intro to Terraform](./cloud-iac) gave you the loop: write a `.tf` file, run `plan` to preview, `apply` to make it real. That's a human pushing a button. **GitOps** removes the button: you commit the desired state to a Git repo, and an agent running in your cluster *watches that repo* and makes reality match it — forever. If someone logs into the console and changes a setting by hand (**drift**), the agent notices the mismatch and *reverts it*, because Git — not the console — is the truth. It's the exact same "declare desired state, reconcile continuously" idea as [Kubernetes](./cloud-kubernetes), applied to your whole infrastructure. The rest of the page is what changes when one `main.tf` becomes a real estate: how you split it up, how you stop bad changes *before* they apply, and how you handle secrets without pasting them into files.
:::

## GitOps: Git as the source of truth

```
   developer ─► git commit (desired state) ─► merge to main
                                                   │
                       ┌───────────────────────────▼───────────────────────────┐
                       │   GitOps agent in cluster (ArgoCD / Flux)               │
                       │   loop forever: compare Git (desired) vs live (actual)  │
                       │   live ≠ Git ? → reconcile live to match Git            │
                       └───────────────────────────┬───────────────────────────┘
   someone hand-edits live ────────────────────────┘  ► agent detects DRIFT → reverts to Git
```

The wins fall out of "Git is truth": every infra change is a reviewed pull request (audit trail, rollback = `git revert`), the live system **self-heals toward the committed state**, and **drift** — the slow divergence between what's in code and what's actually running, the source of "works in staging, not prod" — is detected and corrected automatically. **ArgoCD** and **Flux** are the dominant agents (for Kubernetes-centric infra); the pattern generalizes.

<CodeChallenge
  id="cloud-gitops-drift"
  fnName="drift"
  prompt="Implement the heart of a reconcile loop: drift detection. drift(desired, actual) takes two objects mapping resourceName → version. Return a SORTED array of resource names that need reconciling — present in both but differing, missing from actual, OR present in actual but not desired (an extra to remove)."
  starter={`function drift(desired, actual) {\n  // consider every key that appears in EITHER object\n  // include a name when desired[name] !== actual[name]\n  // return the names sorted alphabetically\n  // your code\n}`}
  solution={`function drift(desired, actual) {\n  const names = new Set([...Object.keys(desired), ...Object.keys(actual)]);\n  const out = [];\n  for (const name of names) {\n    if (desired[name] !== actual[name]) out.push(name);\n  }\n  return out.sort();\n}`}
  tests={[
    {args: [{a: 'v1', b: 'v1'}, {a: 'v1', b: 'v2'}], expected: ['b'], label: 'b differs → reconcile'},
    {args: [{a: 'v1', b: 'v1'}, {a: 'v1'}], expected: ['b'], label: 'b missing from actual'},
    {args: [{a: 'v1'}, {a: 'v1', c: 'v1'}], expected: ['c'], label: 'c is extra → remove'},
    {args: [{a: 'v1'}, {a: 'v1'}], expected: [], label: 'in sync → nothing to do'},
    {args: [{a: 'v2', b: 'v1'}, {a: 'v1', c: 'v1'}], expected: ['a', 'b', 'c'], label: 'differ + missing + extra'},
  ]}
  hint="Union the keys of both objects into a Set. A name needs reconciling whenever desired[name] !== actual[name] (a missing key reads as undefined, so this catches missing/extra too). Push matches and .sort()."
/>

## IaC beyond the intro

One `main.tf` is fine for a demo. Real infrastructure forces structure:

- **Modules.** Factor repeated infrastructure (a "service" = its compute + database + DNS) into a reusable **module** with inputs/outputs, then instantiate it per environment. DRY for infra.
- **Remote, locked state.** Terraform records what it manages in a **state file**. Keep it **remote** (S3 + a lock table, or a managed backend), never on a laptop — the lock stops two engineers `apply`ing at once and corrupting it.
- **Splitting state.** One giant state file means every change risks the whole estate and `plan` crawls. Split by blast radius (networking / data / app) so a change to one doesn't endanger the others — the [reversibility](/docs/decisions/reversibility) principle, applied to infra.

## Policy-as-code: stop bad changes before they apply

Code review catches *some* infra mistakes; **policy-as-code** catches them mechanically, every time. Tools like **OPA/Rego**, Sentinel, **Checkov**, or tfsec run in CI against the Terraform plan and *fail the build* on violations: "no S3 bucket may be public," "every resource must carry a `cost-center` tag," "no security group open to `0.0.0.0/0` on port 22." It turns tribal rules and post-incident lessons into enforced gates — the infra analog of a linter, sitting in front of `apply`.

## Secrets management that holds up

A Kubernetes `Secret` is only **base64-encoded**, not encrypted — anyone with read access decodes it trivially. At scale you want a real secrets manager (**HashiCorp Vault**, cloud Secrets Manager, Doppler) providing: encryption at rest, **access auditing** (who read which secret when), **rotation** (and ideally short-lived **dynamic secrets** minted per-use), and a clean break from secrets-in-Git. The cardinal sin to avoid: committing a credential into a Terraform file or its state, where it lives in your history forever.

:::note[Worked example: the 2am console hotfix that un-does itself]
An on-call engineer, mid-incident, opens the cloud console and bumps a service's max instances from 4 to 12 by hand to ride out a spike. It helps; the incident ends; everyone goes back to bed. **The GitOps agent's next reconcile** sees live state (12) ≠ Git (4), concludes Git is truth, and *scales it back to 4* — the fix silently evaporates and the spike, if it returns, hits a too-small fleet. The lesson isn't "GitOps is annoying"; it's that **the change must go through Git**: the durable fix is a one-line PR raising the committed value, reviewed and merged, after which reconciliation *keeps* it at 12. Hand-edits in a GitOps world are by-design temporary — which is exactly the discipline that kills configuration drift.
:::

## Why it matters

GitOps + mature IaC is how teams keep infrastructure **auditable, reproducible, and drift-free** as it grows past what one person can hold in their head. Every change is reviewed and reversible; the environment self-heals toward the committed truth; policy-as-code turns each incident's lesson into a permanent guardrail; and secrets stop leaking through files. The difference between "we think prod looks like the code" and "prod is *provably* the code" is this toolchain.

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating a base64 Kubernetes Secret as secure.** It's encoding, not encryption. Use a real secrets manager with encryption, audit, and rotation.
- **Committing secrets to Terraform / Git.** They persist in history forever even after deletion. Reference a secrets manager; never inline credentials.
- **One monolithic state file.** Every change risks the whole estate and slows `plan`. Split state by blast radius (network / data / app).
- **Local, unlocked state.** State on a laptop or without locking gets corrupted by concurrent `apply`s. Use a remote, locked backend.
- **Fixing prod by hand in a GitOps world.** Reconciliation reverts it. Make the change in Git, or you'll watch your fix disappear.
- **No policy-as-code.** Relying on humans to remember "don't make buckets public" guarantees someone eventually forgets. Enforce it in CI against the plan.
:::

## Page checkpoint

<Quiz id="cloud-gitops-page" title="Did GitOps & IaC-at-scale stick?" sampleSize={3}>

<Question
  prompt="What fundamentally distinguishes GitOps from running 'terraform apply' by hand?"
  options={[
    { text: "GitOps uses a different file format" },
    { text: "In GitOps, Git is the single source of truth and an agent continuously reconciles live infrastructure to match it — so changes go through reviewed commits and any hand-edit (drift) is automatically reverted, versus a human manually triggering each apply" },
    { text: "GitOps only works for frontend code" },
    { text: "GitOps removes the need to describe infrastructure at all" }
  ]}
  correct={1}
  explanation="GitOps replaces the human-pressed apply button with a controller that watches Git and relentlessly makes reality match it. Every change is a reviewed PR (audit + easy rollback), the system self-heals to the committed state, and configuration drift is detected and corrected."
  revisit={{ to: "/docs/cloud/cloud-gitops#gitops-git-as-the-source-of-truth", label: "GitOps" }}
/>

<Question
  prompt="Why is a Kubernetes Secret not sufficient as your secrets-management strategy at scale?"
  options={[
    { text: "It's encrypted with a key only Google has" },
    { text: "A Kubernetes Secret is only base64-encoded (trivially decoded by anyone with read access); a real secrets manager adds encryption at rest, access auditing, rotation, and short-lived dynamic secrets" },
    { text: "Secrets can't be used by pods at all" },
    { text: "It limits you to one secret per cluster" }
  ]}
  correct={1}
  explanation="Base64 is encoding, not encryption. Production secrets need a manager (Vault, cloud Secrets Manager, Doppler) for encryption, who-read-what auditing, rotation, and ideally per-use dynamic secrets — and never committing credentials to files/state."
  revisit={{ to: "/docs/cloud/cloud-gitops#secrets-management-that-holds-up", label: "Secrets at scale" }}
/>

<Question
  prompt="What does policy-as-code (OPA/Rego, Checkov, Sentinel) give you over plain code review?"
  options={[
    { text: "It writes the Terraform for you" },
    { text: "It mechanically enforces infra rules in CI against the plan — failing the build on violations like public buckets, missing tags, or SSH open to the world — turning tribal rules and post-incident lessons into permanent, automatic guardrails" },
    { text: "It replaces the need for remote state" },
    { text: "It only checks code formatting" }
  ]}
  correct={1}
  explanation="Humans forget; policy-as-code doesn't. Running policy checks against the Terraform plan in CI blocks non-compliant changes every time — the infrastructure analog of a linter in front of apply."
  revisit={{ to: "/docs/cloud/cloud-gitops#policy-as-code-stop-bad-changes-before-they-apply", label: "Policy-as-code" }}
/>

</Quiz>

## What's next

→ Next: [Platform engineering & resilient architecture](./cloud-platform-engineering) — turning all this into a self-service platform other developers love, and designing systems that survive a whole region going dark.
