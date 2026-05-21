---
id: devops
title: DevOps & Infrastructure
sidebar_position: 17
sidebar_label: 16. DevOps
description: Containers (Docker), orchestration (Kubernetes), infrastructure as code (Terraform), secret management. The plumbing underneath hosting.
---

# DevOps & Infrastructure

> **In one line:** Docker packages your app; Kubernetes runs it at scale; Terraform defines your cloud infrastructure as code; vaults store your secrets. None of this is required for a small project on Vercel — it's the layer big companies build below their hosting.

:::tip In plain English
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

:::info Highlight: most projects don't need any of this
You'll see senior engineers talk passionately about Kubernetes, Terraform, and service meshes. They're not wrong — at scale, these tools earn their complexity. But the average personal project or startup needs:

- **Docker** — useful even at small scale.
- *Maybe* **Terraform** — if your cloud setup grows complex.

Everything else (K8s, service meshes, custom Helm charts) is a *solution looking for a problem* at small scale. Resist adopting them prematurely.
:::

## What's next

→ Continue to [Monitoring & Observability](./observability-tools) — the tools that tell you what's happening in production.
