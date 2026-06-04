---
id: cloud-iam
title: Identity & Access (IAM)
sidebar_position: 5
sidebar_label: Identity (IAM)
description: Principals, policies, roles vs users, least privilege, assume-role, and OIDC federation — why you should almost never use long-lived access keys.
---

# Identity & Access (IAM)

> **In one line:** IAM answers "can *this identity* perform *this action* on *this resource* under *these conditions*?" for every single API call — and the entire skill is granting the *least* privilege that works and using short-lived *roles* instead of long-lived *keys*.

:::tip[In plain English]
Every action in a cloud — read a file, start a server, query a database's control plane — goes through one gate: IAM. IAM has a *who* (a **principal**: a person, a service, an app) and a set of **policies** (documents that say "allowed/denied to do X on Y"). The two ideas that matter most: (1) **least privilege** — give each identity only the permissions it actually needs, so a compromised credential can do little damage; and (2) **roles over keys** — instead of handing your app a permanent password (an access key that, if leaked, works forever), let it temporarily *assume a role* and receive credentials that expire in an hour. Most catastrophic cloud breaches trace back to violating one of these two.
:::

## The mental model: a request is evaluated, not trusted

When any principal makes a request, the cloud evaluates it against all applicable policies and answers allow or deny. The logic (AWS form, but universal in spirit):

```
1. Default = DENY (nothing is allowed unless granted)
2. Is there an explicit DENY that matches?   → DENY wins, always. Stop.
3. Is there an explicit ALLOW that matches?  → ALLOW.
4. Otherwise                                 → implicit DENY.
```

The takeaways: **deny always beats allow**, and **nothing works until you grant it**. New cloud users hit a wall of "Access Denied" precisely because the default is no. That wall is the system working.

## Principals: users vs roles (the crucial distinction)

| | **IAM User** | **IAM Role** |
|---|---|---|
| Represents | A specific human or a long-lived service identity | A *set of permissions* anyone/anything trusted can temporarily assume |
| Credentials | Long-lived (password, or an access key that never expires) | Short-lived, auto-rotating (valid ~1 hour, then renewed) |
| Best for | A human's console login (with MFA), bootstrapping | **Almost everything else** — apps, CI, cross-account, federation |
| Leak impact | Catastrophic — works until someone notices and revokes | Limited — expires in an hour |

The professional default: **humans get users (with MFA) or, better, SSO; machines and apps get roles.** An EC2 instance doesn't carry an access key — it has an *instance role*, and the SDK transparently fetches fresh temporary credentials from the instance metadata. A Lambda function has an *execution role*. Your CI pipeline assumes a role via OIDC (below). Long-lived access keys are the thing you're trying to eliminate.

## Policies: the JSON that grants permission

A policy is a document of statements. Each statement is `Effect` (Allow/Deny) × `Action` × `Resource` × optional `Condition`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOneBucketOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-app-uploads",
        "arn:aws:s3:::my-app-uploads/*"
      ],
      "Condition": {
        "Bool": { "aws:SecureTransport": "true" }
      }
    }
  ]
}
```

Read it as a sentence: *Allow the read actions `GetObject`/`ListBucket`, only on the `my-app-uploads` bucket and its objects, and only over TLS.* Note what it does **not** grant: no write, no delete, no other bucket, no other service. That's least privilege — the policy is a tight allow-list, not "S3 full access."

:::caution[The wildcard that becomes a breach]
The single most dangerous string in cloud is:
```json
{ "Effect": "Allow", "Action": "*", "Resource": "*" }
```
"Allow everything on everything." It's `AdministratorAccess`. Engineers attach it because the scoped policy was annoying to write and "I'll tighten it later." Later never comes. Then that credential leaks — committed to a public repo, baked into a Docker image, logged — and the attacker has the keys to the entire account: spin up crypto-mining fleets, read every database, delete everything, exfiltrate customer data. **Start from zero and add the specific actions you need.** The friction of writing a tight policy is the system protecting you from yourself.
:::

## AssumeRole: how short-lived credentials actually work

A role isn't logged into — it's *assumed*. The flow (STS = Security Token Service):

```
App / user (already has SOME identity)
      │  "I'd like to assume role X"
      ▼
   STS  ── checks role X's TRUST POLICY: "is this principal allowed to assume me?"
      │  yes
      ▼
Returns TEMPORARY credentials (access key + secret + session token),
valid ~1 hour, carrying role X's PERMISSIONS policy.
```

A role has **two** policies, and confusing them is the classic IAM headache:
- **Trust policy** — *who* may assume the role (the principals it trusts).
- **Permissions policy** — *what* the role can do once assumed.

```hcl
# Terraform: a role a Lambda function assumes.
# 1) Trust policy — only the Lambda service may assume it.
resource "aws_iam_role" "lambda" {
  name = "report-generator"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# 2) Permissions policy — what the function may do: read ONE bucket, write logs.
resource "aws_iam_role_policy" "lambda_perms" {
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Effect = "Allow", Action = ["s3:GetObject"], Resource = "arn:aws:s3:::reports-input/*" },
      { Effect = "Allow", Action = ["logs:CreateLogStream","logs:PutLogEvents"], Resource = "*" }
    ]
  })
}
```

The function never holds a secret. At runtime AWS injects fresh temporary credentials for this role; they rotate automatically; if logs leak them they're useless within the hour.

:::info[Highlight: kill long-lived keys in CI with OIDC]
The old way to give GitHub Actions access to AWS was to store a permanent `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` as repo secrets. Those are long-lived keys with broad power sitting in CI — a top breach vector. The modern way is **OIDC federation**: GitHub Actions presents a short-lived, cryptographically-signed identity token; AWS's IAM trusts GitHub's OIDC provider and, if the token matches a condition you set (e.g. *only the `main` branch of `myorg/myrepo`*), hands back temporary credentials. **No secret is ever stored.** Every cloud supports this for the major CI providers; setting it up is a one-time hour and removes an entire class of leak. If you take one operational action from this page, make it "delete static CI keys, switch to OIDC."
:::

## The layers of access control (they stack)

Real orgs gate access at multiple levels, all of which must allow an action:

```
Service Control Policy (org-wide guardrail: "no one, ever, in any account,
        │                may disable CloudTrail or use a banned region")
        ▼
Identity policy on the principal  ("this role may read S3")
        ▼
Resource policy on the resource   ("this bucket allows reads from that role")
        ▼
Permission boundary / session policy (optional caps)
        =  effective permission = the INTERSECTION
```

You don't need to wield all of these on day one, but knowing they exist explains the enterprise mystery "I have an Allow policy but it's still denied" — something *above* you (an SCP or boundary) is capping it.

:::note[Worked example: the leaked-key incident, two ways]
**Team A** runs their app on EC2 with a long-lived access key baked into an environment file, attached to `AdministratorAccess` "to save time." The key ends up in a Docker image pushed to a public registry. Within hours, an attacker spins up dozens of GPU instances for crypto-mining across every region; the bill hits five figures before the alert fires, and they have to assume all data was read.

**Team B** runs the same app on EC2 with an *instance role* scoped to "read one bucket, write to one queue." There's no key to leak. Even if the instance is compromised, the blast radius is one bucket and one queue — and the temporary credentials rotate hourly. Same app, same cloud; the difference is two IAM habits (roles not keys, least privilege not `*`). This is the entire game.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Attaching `AdministratorAccess` / `Action: "*"` "for now."** It outlives the "for now" and turns any credential leak into a full account compromise. Grant specific actions.
- **Using long-lived access keys for apps and CI.** Use instance/execution roles for compute and OIDC for CI. The only place a static key is defensible is a quick local experiment — never in production or a repo.
- **Confusing the trust policy with the permissions policy.** Trust = *who can assume*; permissions = *what they can then do*. "AccessDenied on AssumeRole" is a trust-policy problem, not a permissions one.
- **Granting permissions to a human directly instead of via groups/SSO.** Per-user grants drift into an unauditable mess. Use groups/roles and, at scale, SSO with short sessions.
- **Forgetting that an explicit Deny always wins.** If something is denied despite an Allow, look for a Deny statement, an SCP, or a permission boundary above you.
- **Not enabling MFA on human users (especially the root account).** The root/owner identity should have MFA, almost never be used day-to-day, and have no access keys at all.
:::

## Page checkpoint

<Quiz id="cloud-iam-page" title="Did IAM stick?" sampleSize={2}>

<Question
  prompt="Why should an application running on a VM use an instance role rather than a stored access key?"
  options={[
    { text: "Roles are faster to authenticate than keys" },
    { text: "A role provides short-lived, auto-rotating credentials with no secret to leak; a long-lived access key works forever if leaked, turning one mistake into an open-ended breach" },
    { text: "Access keys don't work on virtual machines" },
    { text: "Roles are free while access keys are billed per use" }
  ]}
  correct={1}
  explanation="An instance role injects temporary credentials that expire and rotate automatically, so there's no permanent secret to commit, log, or bake into an image. A leaked static access key, by contrast, keeps working until a human notices and revokes it — the classic catastrophic-breach pattern."
  revisit={{ to: "/docs/cloud/cloud-iam#principals-users-vs-roles-the-crucial-distinction", label: "Roles vs keys" }}
/>

<Question
  prompt="An IAM role has two policies. What's the difference between them?"
  options={[
    { text: "One is for reads and one is for writes" },
    { text: "The trust policy says WHO may assume the role; the permissions policy says WHAT the role can do once assumed" },
    { text: "One applies in production and one in staging" },
    { text: "One is JSON and one is YAML" }
  ]}
  correct={1}
  explanation="The trust policy gates assumption (which principals may take on the role); the permissions policy gates actions (what the assumed role may do). 'AccessDenied' on AssumeRole itself is a trust-policy problem; 'AccessDenied' on an action afterward is a permissions-policy problem."
  revisit={{ to: "/docs/cloud/cloud-iam#assumerole-how-short-lived-credentials-actually-work", label: "Trust vs permissions policy" }}
/>

<Question
  prompt="What does OIDC federation let you do for a CI pipeline like GitHub Actions?"
  options={[
    { text: "Run jobs faster by caching credentials" },
    { text: "Let CI exchange a short-lived, signed identity token for temporary cloud credentials — so no long-lived access key is ever stored as a repo secret" },
    { text: "Encrypt the repository's source code at rest" },
    { text: "Grant the pipeline AdministratorAccess automatically" }
  ]}
  correct={1}
  explanation="With OIDC, the cloud trusts the CI provider's identity tokens and, when a token matches conditions you set (e.g. a specific repo and branch), returns temporary credentials. This removes the stored static keys that are a leading breach vector — nothing permanent lives in the repo."
  revisit={{ to: "/docs/cloud/cloud-iam#the-layers-of-access-control-they-stack", label: "OIDC for CI" }}
/>

</Quiz>

## What's next

→ Continue to [Storage](./cloud-storage) — object, block, and file storage, and the public-bucket mistake that IAM exists to prevent.
