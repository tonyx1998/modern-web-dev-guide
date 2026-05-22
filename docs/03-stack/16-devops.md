---
id: devops
title: DevOps & Infrastructure
sidebar_position: 17
sidebar_label: DevOps
description: Containers (Docker), orchestration (Kubernetes), infrastructure as code (Terraform), secret management. The plumbing underneath hosting.
---

# DevOps & Infrastructure

> **In one line:** Docker packages your app; Kubernetes runs it at scale; Terraform defines your cloud infrastructure as code; vaults store your secrets. None of this is required for a small project on Vercel — it's the layer big companies build below their hosting.

:::tip[In plain English]
"DevOps" is a fuzzy term covering everything from packaging your app (Docker) to running it across many machines (Kubernetes) to declaring your cloud setup in code (Terraform). Most of this is *optional* for small projects — your hosting platform handles it. You start to need these tools when you outgrow the platform tier and have to operate the underlying infrastructure yourself.
:::

## Containers

| Tool          | Notes                                                              |
|---------------|--------------------------------------------------------------------|
| **Docker**     | Universal containerization standard.                              |
| **Podman**     | Daemonless alternative.                                            |

A container is a lightweight package containing your app and all its dependencies, runnable on any machine that has the container runtime installed. The result: "works on my machine" stops being a problem.

```dockerfile
# Dockerfile — a recipe for a container
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

> **In English:** Start from a lightweight Node 20 base **image** (a frozen filesystem snapshot from Docker Hub). Set the working directory, copy in just the lockfiles, install dependencies (cached separately so app-code changes don't bust this layer), then copy the rest of the source, build it, and define the start command. The result is a portable image that runs identically on any machine with Docker.

## Orchestration

| Tool                | Notes                                                          |
|---------------------|----------------------------------------------------------------|
| **Kubernetes (K8s)** | Dominant at scale.                                            |
| **Docker Compose**   | For local multi-container setups.                              |
| **Nomad**            | Simpler K8s alternative; declining.                            |

Kubernetes runs many containers across many machines. It handles scheduling, scaling, networking, load balancing, and self-healing. **It's also genuinely complex** — overkill for most teams under ~50 engineers.

## Infrastructure as Code (IaC)

| Tool                    | Notes                                                       |
|-------------------------|-------------------------------------------------------------|
| **Terraform / OpenTofu** | Most popular. OpenTofu is the open-source fork after Terraform's license change. |
| **Pulumi**               | IaC in real programming languages (TS, Python, Go).        |
| **AWS CDK**              | AWS-specific, TS/Python.                                   |
| **SST**                  | Modern serverless IaC built on AWS CDK.                    |

```hcl
# Terraform — describe infrastructure declaratively
resource "aws_s3_bucket" "uploads" {
  bucket = "my-app-uploads"
}

resource "aws_lambda_function" "api" {
  function_name = "my-api"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "lambda.zip"
}
```

> **In English:** Two `resource` blocks declare the *desired state* of your cloud: one S3 bucket and one Lambda function. Terraform is **declarative** — you describe what should exist, not the steps to create it. `terraform apply` reads the file, compares it to what already exists in your AWS account, and makes only the changes needed. Versioned in git, reviewed via PRs, the same way as code.

## CI/CD

(Covered in detail in [Chapter 2 Phase 8](../lifecycle/ci-cd).) GitHub Actions dominates for most teams; CircleCI, GitLab CI, Buildkite are alternatives.

## Secret management

| Tool                                    | Notes                                                |
|-----------------------------------------|------------------------------------------------------|
| **HashiCorp Vault**                      | Industry standard, self-host.                        |
| **AWS Secrets Manager / Google Secret Manager / Azure Key Vault** | Cloud-native.            |
| **Doppler / 1Password Secrets Automation** | Modern, developer-friendly.                      |

:::info[Highlight: most projects don't need any of this]
You'll see senior engineers talk passionately about Kubernetes, Terraform, and service meshes. They're not wrong — at scale, these tools earn their complexity. But the average personal project or startup needs:

- **Docker** — useful even at small scale.
- *Maybe* **Terraform** — if your cloud setup grows complex.

Everything else (K8s, service meshes, custom Helm charts) is a *solution looking for a problem* at small scale. Resist adopting them prematurely.
:::

## Page checkpoint

<Quiz id="stack-devops-page" title="Did DevOps tooling stick?" sampleSize={2}>

<Question
  prompt="What problem does Docker (or Podman) solve for application deployment?"
  options={[
    { text: "It makes JavaScript run faster" },
    { text: "It packages your app and all dependencies into a portable container, so it runs identically on any machine with the runtime" },
    { text: "It generates SQL migrations automatically" },
    { text: "It encrypts your environment variables" }
  ]}
  correct={1}
  explanation="A container bundles the app with its runtime, libraries, and OS dependencies. Same container, same behavior — on your laptop, CI, and prod. 'Works on my machine' stops being a problem."
  revisit={{ to: "/docs/stack/devops#containers", label: "Containers section" }}
/>

<Question
  prompt="Why is Kubernetes considered overkill for most teams under ~50 engineers?"
  options={[
    { text: "It only runs on Mac M-series chips" },
    { text: "It's genuinely complex — scheduling, networking, scaling, manifests, operators — and you usually don't need that machinery until you're operating many services at real scale" },
    { text: "It's incompatible with Docker" },
    { text: "It can't run TypeScript apps" }
  ]}
  correct={1}
  explanation="Kubernetes earns its complexity at scale, but it's a steep tax — manifests, networking, RBAC, operators — most small teams pay before they need to. Hosting platforms hide all of this until you've outgrown them."
  revisit={{ to: "/docs/stack/devops#orchestration", label: "Orchestration section" }}
/>

<Question
  prompt="What does Infrastructure-as-Code (Terraform, OpenTofu, Pulumi) actually do?"
  options={[
    { text: "It writes your application code from a spec" },
    { text: "It declares the desired state of your cloud resources in versioned files, then provisions or updates them to match" },
    { text: "It compiles your TypeScript to machine code" },
    { text: "It runs your CI/CD pipelines" }
  ]}
  correct={1}
  explanation="IaC tools are declarative: you describe what infrastructure should exist (buckets, functions, DBs), commit those files to git, and the tool reconciles real cloud state to match. Reviewed via PRs like application code."
  revisit={{ to: "/docs/stack/devops#infrastructure-as-code-iac", label: "IaC section" }}
/>

<Question
  prompt="Of the DevOps tools on this page, which two does the page say are realistically worth adopting even at small scale?"
  options={[
    { text: "Kubernetes and Helm" },
    { text: "Docker, and *maybe* Terraform if cloud setup grows complex" },
    { text: "Nomad and Vault" },
    { text: "Pulumi and AWS CDK from day one" }
  ]}
  correct={1}
  explanation="The page is explicit: Docker is useful even small, and Terraform earns its place only if your cloud setup grows complex. Everything else (K8s, service meshes, custom Helm) is a solution looking for a problem at small scale."
  revisit={{ to: "/docs/stack/devops#orchestration", label: "Most projects don't need K8s" }}
/>

</Quiz>

## What's next

→ Continue to [Monitoring & Observability](./observability-tools) — the tools that tell you what's happening in production.
