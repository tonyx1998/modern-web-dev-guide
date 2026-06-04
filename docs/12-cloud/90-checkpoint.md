---
id: cloud-checkpoint
title: Chapter 5 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 5 — Cloud Platforms. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 6.
---

# Chapter 5 Checkpoint

You've finished the Cloud Platforms chapter. Make sure the four deep concepts stuck — compute models, VPC networking, IAM, and IaC — plus storage, managed data, serverless patterns, and cost.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit.

You must pass (≥ 60%) to unlock the Next button and Chapter 6 in the sidebar.

<Quiz id="cloud-checkpoint" title="Cloud Platforms checkpoint" sampleSize={5}>

<Question
  prompt="A team's European app is slow. Investigation shows the app server is in us-east-1 and the Postgres database is in eu-west-1, and a typical page makes 12 sequential queries. What's the root cause?"
  options={[
    { text: "The database is undersized — scale it up" },
    { text: "Cross-region latency — each query crosses the Atlantic (~80ms), so 12 sequential queries add ~1 second before any work; co-locate compute with its primary database" },
    { text: "Missing indexes on the queried tables" },
    { text: "The app needs a read replica" }
  ]}
  correct={1}
  explanation="Region choice is a latency and legal decision. Compute and its primary database should live in the same region; cross-region hops are for replication/DR, not the hot path. 12 sequential trans-Atlantic round trips is ~1s of pure network latency."
  revisit={{ to: "/docs/cloud/cloud-mental-model#geography-regions-and-availability-zones", label: "Co-locate compute & DB" }}
/>

<Question
  prompt="Why is building production infrastructure by clicking in the web console an anti-pattern?"
  options={[
    { text: "The console is slower than the API" },
    { text: "ClickOps resources aren't reviewable, reproducible, or recoverable and become undocumented liabilities; IaC in git should be the source of truth" },
    { text: "The console can't create production resources" },
    { text: "Console actions cost more" }
  ]}
  correct={1}
  explanation="A click leaves no diff, no reproducible definition, and nothing to recover from. Production infrastructure belongs in version-controlled IaC; the console is for reading dashboards and emergencies."
  revisit={{ to: "/docs/cloud/cloud-mental-model#the-truth-about-the-console", label: "Console is read-mostly" }}
/>

<Question
  prompt="A stateless Node API has outgrown Vercel on cost and wants cloud control without managing servers or a cluster. The chapter's default?"
  options={[
    { text: "A fleet of EC2 VMs behind a load balancer" },
    { text: "A managed Kubernetes cluster for future-proofing" },
    { text: "Serverless containers (Cloud Run, or Fargate on AWS) — image-only management, autoscaling, scale-to-zero" },
    { text: "One large vertically-scaled VM" }
  ]}
  correct={2}
  explanation="Serverless containers are the modern center of gravity for web services: ship an image, get autoscaling (Cloud Run scales to zero), no OS to patch or cluster to operate. VMs reintroduce undifferentiated ops; Kubernetes is premature for one service without a platform team."
  revisit={{ to: "/docs/cloud/cloud-compute#the-decision-rule", label: "Compute decision rule" }}
/>

<Question
  prompt="A serverless function crashes its Postgres database under load. Why, and what's the fix?"
  options={[
    { text: "Functions are too slow; use a bigger memory size" },
    { text: "Thousands of concurrent function instances each open a connection and exhaust the DB's connection limit; put a connection pooler (PgBouncer / RDS Proxy / pooled serverless endpoint) in front and cap connections per function" },
    { text: "Functions can't use TLS to the database" },
    { text: "The database region is wrong" }
  ]}
  correct={1}
  explanation="Serverless concurrency is huge but DB connections are scarce (~100 default). Each function opening its own connection exhausts the limit. A pooler multiplexes many function connections onto few DB connections."
  revisit={{ to: "/docs/cloud/cloud-compute#3-serverless-functions-lambda--cloud-functions--azure-functions", label: "Serverless connection trap" }}
/>

<Question
  prompt="What single configuration makes a subnet 'public' rather than 'private'?"
  options={[
    { text: "It has more IP addresses" },
    { text: "Its route table has a default route (0.0.0.0/0) to the Internet Gateway; a private subnet has no direct route to the IGW (it reaches out only via NAT)" },
    { text: "It disables security groups" },
    { text: "It's in a different availability zone" }
  ]}
  correct={1}
  explanation="Public vs private is a routing decision: a public subnet routes 0.0.0.0/0 to the Internet Gateway; a private subnet doesn't and reaches the internet outbound-only through a NAT gateway, never directly inbound."
  revisit={{ to: "/docs/cloud/cloud-networking#the-four-concepts-precisely", label: "Public vs private subnets" }}
/>

<Question
  prompt="An app and database are both running in the same VPC but can't connect. First thing to check?"
  options={[
    { text: "Whether the database process crashed" },
    { text: "Whether the database's security group allows inbound on the DB port from the app's security group — reachability is config, not health" },
    { text: "Whether they're in different regions" },
    { text: "Whether TLS certificates expired" }
  ]}
  correct={1}
  explanation="Within a VPC, routing works by default, so the usual culprit is the firewall: the DB security group must explicitly allow inbound on its port from the app's security group. Connectivity is a config question."
  revisit={{ to: "/docs/cloud/cloud-networking#load-balancers", label: "Debugging connectivity" }}
/>

<Question
  prompt="Why should an app on a VM use an instance role instead of a stored access key?"
  options={[
    { text: "Roles authenticate faster" },
    { text: "A role gives short-lived, auto-rotating credentials with no secret to leak; a leaked long-lived access key works forever, turning one mistake into an open-ended breach" },
    { text: "Access keys don't work on VMs" },
    { text: "Roles are free; keys are billed" }
  ]}
  correct={1}
  explanation="Instance roles inject temporary, rotating credentials — nothing permanent to commit, log, or bake into an image. A leaked static key keeps working until a human revokes it, the classic catastrophic-breach pattern."
  revisit={{ to: "/docs/cloud/cloud-iam#principals-users-vs-roles-the-crucial-distinction", label: "Roles vs keys" }}
/>

<Question
  prompt="The most dangerous IAM policy string is { Action: '*', Resource: '*' }. Why?"
  options={[
    { text: "It's slow to evaluate" },
    { text: "It grants full administrative power on everything, so any leak of that credential becomes a total account compromise — least privilege means granting only the specific actions needed" },
    { text: "It only works in us-east-1" },
    { text: "It disables MFA" }
  ]}
  correct={1}
  explanation="'Allow everything on everything' is AdministratorAccess. Attached 'for now' and leaked, it lets an attacker do anything in the account. Start from zero and add the specific actions you need."
  revisit={{ to: "/docs/cloud/cloud-iam#policies-the-json-that-grants-permission", label: "The wildcard breach" }}
/>

<Question
  prompt="A web app handles user image uploads. The chapter's recommended storage and upload flow?"
  options={[
    { text: "Block storage; upload through the app server to the attached disk" },
    { text: "Object storage (S3); clients upload directly via short-lived presigned URLs so bytes never pass through the app server, and the bucket stays private" },
    { text: "File storage (EFS) mounted on every instance" },
    { text: "Store images as rows in the SQL database" }
  ]}
  correct={1}
  explanation="User files go in object storage. Presigned URLs let the client upload/download directly to S3 while the server only mints a scoped, short-lived URL — keeping the app stateless and the bucket private."
  revisit={{ to: "/docs/cloud/cloud-storage#presigned-urls--the-right-way-to-do-uploadsdownloads", label: "Presigned URLs" }}
/>

<Question
  prompt="The classic 'company leaks millions of records via S3' breach is usually caused by what?"
  options={[
    { text: "A sophisticated zero-day in the cloud provider" },
    { text: "A misconfigured bucket set to public for convenience and forgotten — defended by Block Public Access, default-private, and serving public content via a CDN with a locked origin" },
    { text: "Weak database passwords" },
    { text: "An expired TLS certificate" }
  ]}
  correct={1}
  explanation="It's almost always a customer misconfiguration, not a hack. Turn on account-level Block Public Access, default buckets to private, and serve public content through a CDN with a locked origin rather than making the bucket public."
  revisit={{ to: "/docs/cloud/cloud-storage#the-public-bucket-mistake", label: "Public-bucket mistake" }}
/>

<Question
  prompt="A team routes all reads to a new async read replica and users see stale data right after saving. Correct fix?"
  options={[
    { text: "Make the replica synchronous for all reads" },
    { text: "Route read-after-write / consistency-sensitive reads to the primary; send only lag-tolerant reads (lists, search, analytics) to replicas" },
    { text: "Add more replicas" },
    { text: "Turn off caching" }
  ]}
  correct={1}
  explanation="Read replicas are asynchronous and lag, so a read right after a write can miss it. Send consistency-sensitive reads to the primary and offload only lag-tolerant reads to replicas."
  revisit={{ to: "/docs/cloud/cloud-managed-data#1-managed-relational-rds--aurora--cloud-sql", label: "Replica lag" }}
/>

<Question
  prompt="What does `terraform plan` provide that makes IaC safe?"
  options={[
    { text: "It applies changes and logs them" },
    { text: "It shows the diff of what will be created/changed/destroyed before anything happens, so you can catch a dangerous action like destroying the production database" },
    { text: "It backs up state" },
    { text: "It only checks syntax" }
  ]}
  correct={1}
  explanation="`plan` computes the exact add/change/destroy set before `apply` touches anything. Reading it like a code-review diff — especially watching for destroy/replace on databases — is the core discipline of declarative infra."
  revisit={{ to: "/docs/cloud/cloud-iac#the-core-loop-init--plan--apply", label: "plan as a diff" }}
/>

<Question
  prompt="What is infrastructure 'drift' and the main rule to prevent it?"
  options={[
    { text: "Slow plans; split the state file" },
    { text: "Reality diverging from code (usually a manual console change); prevent it by never changing production by hand — make all changes through code, even in incidents" },
    { text: "State file growing too large; delete old versions" },
    { text: "Two modules sharing a CIDR; renumber them" }
  ]}
  correct={1}
  explanation="Drift is the real cloud disagreeing with your code, almost always from a manual 'quick fix.' The next apply may revert it or show confusing diffs. Change infra only through code and run `plan` in CI to surface divergence."
  revisit={{ to: "/docs/cloud/cloud-iac#state-terraforms-model-of-reality", label: "Drift" }}
/>

<Question
  prompt="Cloud queues guarantee at-least-once delivery. What must every side-effecting handler therefore be?"
  options={[
    { text: "Stateless" },
    { text: "Idempotent — running twice for the same event has the same effect as once, typically via a stable idempotency key you claim and check" },
    { text: "Synchronous" },
    { text: "Single-threaded" }
  ]}
  correct={1}
  explanation="At-least-once means duplicate deliveries happen, so a handler will sometimes run twice for one logical event. Idempotency ensures the duplicate is a safe no-op instead of a double charge or double email."
  revisit={{ to: "/docs/cloud/cloud-serverless#the-gotcha-that-defines-serverless-at-least-once-delivery--idempotency", label: "At-least-once → idempotency" }}
/>

<Question
  prompt="A media app's bill spikes after serving video directly from object storage to users. Most likely culprit and fix?"
  options={[
    { text: "Compute cost; use a bigger instance" },
    { text: "Data egress (per-GB charge to leave the cloud); put a CDN in front so delivery is cached, cheaper egress that also avoids the NAT gateway" },
    { text: "Database cost; add replicas" },
    { text: "IAM cost; reduce roles" }
  ]}
  correct={1}
  explanation="Egress is the invisible line item that blows up for media/high-traffic apps. A CDN caches at the edge with far cheaper egress and avoids routing traffic through billed NAT gateways."
  revisit={{ to: "/docs/cloud/cloud-cost#the-five-bills-that-surprise-everyone", label: "Egress" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 6: Site Reliability & Operations](/docs/operations) — the discipline of keeping everything you just learned to build actually running, healthy, and recoverable at 3am.
