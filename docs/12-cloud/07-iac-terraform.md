---
id: cloud-iac
title: Infrastructure as Code
sidebar_position: 8
sidebar_label: IaC (Terraform)
description: Terraform end-to-end — declarative resources, state, plan/apply, modules, remote state and locking, and why you never click in production.
---

# Infrastructure as Code

> **In one line:** Infrastructure as Code means your entire cloud — networks, servers, databases, IAM — is described in version-controlled files that a tool reconciles reality against, so infrastructure becomes reviewable, reproducible, and recoverable instead of a pile of forgotten console clicks.

:::tip[In plain English]
You can build cloud infrastructure two ways. The first is clicking around the console — fast to start, impossible to reproduce, and a mystery the moment the person who did it leaves ("why does this server exist? what's it allowed to do? nobody knows"). The second is **Infrastructure as Code (IaC)**: you write files that *declare* what should exist ("one VPC, two subnets, a database of this size, this IAM role"), commit them to git, and a tool like Terraform makes the cloud match. Now your infrastructure has a history, a code review, a diff before every change, and a way to rebuild the whole thing from scratch. Every serious team does this. The hardest habit to build — and the most important — is **never changing production by hand.**
:::

## Declarative, not imperative

Terraform (and Pulumi, OpenTofu, CloudFormation, etc.) is *declarative*: you describe the desired **end state**, not the steps. You don't say "create a bucket, then create a policy, then attach it." You say "these things should exist," and the tool figures out the order (via a dependency graph), what already exists, and the minimal set of changes to get there.

```hcl
# A complete, real (if minimal) piece of infrastructure: a private S3 bucket
# with versioning and public access blocked. This file IS the source of truth.
resource "aws_s3_bucket" "uploads" {
  bucket = "acme-prod-uploads"
  tags   = { Environment = "prod", ManagedBy = "terraform" }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

Note the references: `aws_s3_bucket.uploads.id` ties resources together, and Terraform infers that the bucket must exist before the versioning config. You declare relationships; it derives order.

## The core loop: init → plan → apply

```
terraform init     # download providers (AWS/GCP/...) and set up the backend
terraform plan     # show the DIFF: what will be created / changed / destroyed
terraform apply    # make reality match the files (after you read the plan)
```

`plan` is the feature that makes IaC safe and the habit that separates pros from cowboys. It prints exactly what will happen *before* anything changes:

```
Terraform will perform the following actions:

  # aws_db_instance.main will be updated in-place
  ~ resource "aws_db_instance" "main" {
      ~ instance_class = "db.t3.medium" -> "db.t3.large"
        # (28 unchanged attributes hidden)
    }

  # aws_security_group_rule.temp_debug will be destroyed
  - resource "aws_security_group_rule" "temp_debug" { ... }

Plan: 0 to add, 1 to change, 1 to destroy.
```

You read this like a code-review diff. The line that should make you stop and think every time is **`destroy`** — especially on a database. A careless rename or a removed block can turn into "Terraform wants to destroy and recreate your production database," which is a data-loss incident waiting to happen. *Read the plan.* This is the whole discipline.

## State: Terraform's model of reality

Terraform keeps a **state file** mapping your code's resources to the real cloud IDs. It's how `plan` knows what already exists. Two non-negotiable rules:

1. **State is sensitive.** It can contain secrets (DB passwords, keys). Never commit it to git; treat it like a credential.
2. **State must be remote and locked for any team.** Local state on one laptop means only one person can ever safely apply, and a lost laptop loses your infra's map. Store it in a **remote backend** (S3 + DynamoDB lock table, Terraform Cloud, GCS) so it's shared, encrypted, versioned, and **locked** — the lock prevents two people running `apply` at once and corrupting it.

```hcl
# Remote state in S3 with a DynamoDB lock — the standard team setup.
terraform {
  backend "s3" {
    bucket         = "acme-terraform-state"
    key            = "prod/network.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"   # prevents concurrent applies
    encrypt        = true
  }
}
```

:::caution[The #1 way teams corrupt their infrastructure: drift]
**Drift** is when reality and code disagree — almost always because someone made a "quick fix" in the console during an incident and never put it back in code. Now the next `terraform apply` will happily *revert* their fix (it's not in the files), or the plan shows confusing changes nobody intended. Two rules prevent this:
1. **Never change production by hand.** Even in an incident, prefer a code change + apply. If you *must* hot-fix in the console to stop the bleeding, immediately reconcile it back into code.
2. **Run `terraform plan` in CI on every PR** and periodically against prod, so drift surfaces as a visible diff instead of a 3am surprise.
:::

## Modules: don't repeat your infrastructure

A **module** is a reusable package of resources with inputs and outputs — the function/component of infrastructure. Instead of copy-pasting 80 lines of VPC config for dev, staging, and prod (and watching them drift apart), you write it once and call it three times with different inputs.

```hcl
# Define once (modules/network/...), then instantiate per environment:
module "network_prod" {
  source             = "./modules/network"
  cidr_block         = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
  environment        = "prod"
}

module "network_staging" {
  source             = "./modules/network"
  cidr_block         = "10.1.0.0/16"   # non-overlapping, per the networking chapter
  availability_zones = ["us-east-1a", "us-east-1b"]
  environment        = "staging"
}
```

You can also pull battle-tested modules from the public registry (e.g. the official AWS VPC module) instead of hand-rolling networking — a good use of [build vs buy](/docs/decisions/build-vs-buy) at the infrastructure level.

## The IaC ecosystem (so the names aren't a mystery)

| Tool | What it is | Pick it when |
|---|---|---|
| **Terraform** | The de-facto standard; HCL; multi-cloud | Default choice; biggest ecosystem |
| **OpenTofu** | Open-source Terraform fork (post-license-change) | You want Terraform without the licensing concern |
| **Pulumi** | IaC in real languages (TS, Python, Go) | Your team would rather write TypeScript than HCL |
| **AWS CDK / CloudFormation** | AWS-native (CDK = code → CFN templates) | All-in on AWS, want tight native integration |
| **SST** | TS-first, app-developer-friendly, on AWS | Full-stack TS teams shipping serverless on AWS |
| **Ansible** | Configuration management (what's *on* a server) | Provisioning/config inside VMs, complements IaC |

Don't agonize: **Terraform/OpenTofu is the safe, transferable default.** The *concepts* (declarative, plan/apply, state, modules, drift) are identical across all of them — learn them once here.

:::info[Highlight: IaC turns infrastructure into software, with all that implies]
Once infrastructure is code, every good software practice applies to it: pull requests and review before changes, CI that runs `plan` and policy checks, blame/history to answer "why does this exist and who changed it," environments that are *provably* identical because they're the same module, and disaster recovery that's "re-apply the code" instead of "reconstruct from memory." This is the deepest reason IaC matters — not convenience, but that it makes infrastructure *governable* the same way your application code is.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Applying without reading the plan.** The plan is your last chance to catch a `destroy` on the production database. Read every plan; treat `destroy`/`replace` lines as stop signs.
- **Committing the state file to git / keeping it local.** State holds secrets and is the map of your infra. Use an encrypted, locked remote backend from the start.
- **Hand-editing production in the console.** This creates drift that the next apply reverts or that produces baffling diffs. Change infra through code, even under pressure.
- **No state locking on a team.** Two simultaneous applies corrupt state. Use a backend that locks (S3+DynamoDB, Terraform Cloud, GCS).
- **One giant state file for everything.** A 4,000-resource monolith makes every plan slow and every change scary. Split by blast radius (network, data, app) so a change to one doesn't risk the others.
- **Hardcoding secrets in `.tf` files.** They end up in state and git history. Reference a secrets manager; pass secrets at apply time, never commit them.
:::

## Page checkpoint

<Quiz id="cloud-iac-page" title="Did IaC stick?" sampleSize={3}>

<Question
  prompt="What does `terraform plan` do, and why is reading it the core safety discipline of IaC?"
  options={[
    { text: "It applies the changes immediately and shows a log afterward" },
    { text: "It shows the diff of what will be created, changed, or destroyed BEFORE anything happens — so you can catch a dangerous action like destroying the production database" },
    { text: "It backs up the state file" },
    { text: "It lints the HCL syntax only" }
  ]}
  correct={1}
  explanation="`plan` computes and prints the exact set of changes (add/change/destroy) before `apply` touches anything. Reading it like a code-review diff — especially watching for destroy/replace on stateful resources like databases — is what makes declarative infrastructure safe."
  revisit={{ to: "/docs/cloud/cloud-iac#the-core-loop-init--plan--apply", label: "plan as a diff" }}
/>

<Question
  prompt="Why must a team store Terraform state in a remote, locked backend rather than a local file?"
  options={[
    { text: "Local files are slower to read" },
    { text: "State maps code to real resources and can contain secrets; a shared, encrypted, LOCKED backend prevents concurrent applies from corrupting it and stops the infra map living on one laptop" },
    { text: "Terraform refuses to run without a cloud backend" },
    { text: "Remote state runs the apply faster" }
  ]}
  correct={1}
  explanation="State is the sensitive source-of-truth mapping between your code and the cloud. A remote backend (e.g. S3 + DynamoDB lock) makes it shared, encrypted, versioned, and locked so two engineers can't apply at once and corrupt it — and it doesn't vanish with a lost laptop."
  revisit={{ to: "/docs/cloud/cloud-iac#state-terraforms-model-of-reality", label: "Remote, locked state" }}
/>

<Question
  prompt="What is 'drift' and what's the primary rule to prevent it?"
  options={[
    { text: "Slow plan times; the rule is to split state files" },
    { text: "When real infrastructure diverges from the code (usually a manual console change); the rule is never change production by hand — make changes through code" },
    { text: "When the state file grows too large; the rule is to delete old versions" },
    { text: "When two modules share a CIDR; the rule is to renumber" }
  ]}
  correct={1}
  explanation="Drift is reality disagreeing with the code, almost always from a manual 'quick fix' in the console. The next apply may revert it or produce confusing diffs. Prevent it by changing infrastructure only through code (even in incidents) and running `plan` in CI to surface divergence early."
  revisit={{ to: "/docs/cloud/cloud-iac#state-terraforms-model-of-reality", label: "Drift" }}
/>

</Quiz>

## What's next

→ Continue to [Serverless & event-driven patterns](./cloud-serverless) — the architectures that fall out of cheap functions, queues, and managed events.
