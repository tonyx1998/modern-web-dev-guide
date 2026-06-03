---
id: cloud-storage
title: Storage — Object, Block, File
sidebar_position: 6
sidebar_label: Storage
description: Object storage (S3), block storage (EBS), file storage (EFS), storage classes and lifecycle, presigned URLs, and the public-bucket mistake.
---

# Storage — Object, Block, File

> **In one line:** There are exactly three kinds of cloud storage — object (a giant key→blob store, like S3), block (a virtual hard disk for one VM, like EBS), and file (a shared network drive, like EFS) — and 90% of web apps need only object storage, used correctly.

:::tip[In plain English]
"Where do I put files in the cloud?" has three answers depending on what the files *are*. **Object storage** (S3) is for anything you'd think of as a file you upload or download — images, videos, backups, static assets, logs. It's effectively infinite, cheap, durable, and accessed over HTTP, but you can't "edit byte 5000" — you replace the whole object. **Block storage** (EBS) is a virtual disk you attach to one VM; it's what the OS and databases write to, because they need to modify bytes in place. **File storage** (EFS) is a shared network drive multiple machines can mount at once. The mistake that makes the news is misconfiguring object storage to be public.
:::

## The three types

| | **Object (S3)** | **Block (EBS)** | **File (EFS/Filestore)** |
|---|---|---|---|
| Mental model | Key → blob, over HTTP | A hard disk for one VM | A shared NFS drive |
| Access | API/HTTPS (`GetObject`) | Mounted as a device on a VM | Mounted by many VMs at once |
| Mutate part of it? | No — replace whole object | Yes — random read/write | Yes |
| Scales to | Effectively infinite | Fixed size you provision (resizable) | Grows automatically |
| Typical use | Uploads, assets, backups, logs, data lakes | OS root volume, self-hosted DB data | Shared content across a fleet, legacy apps |
| Durability | Extreme (≈11 nines) across AZs | Single-AZ (snapshot to back up) | Multi-AZ |

**The rule:** if your app handles user uploads, generated files, backups, or static assets, you want **object storage**. Block and file storage are infrastructure details that usually come *with* a VM or a managed service — you rarely provision them directly as an app developer.

## Object storage in depth (S3 / GCS / Blob)

S3 is the most important storage service in the cloud and arguably its most important service overall — half the internet's files live in it. Key properties:

- **Buckets and keys.** A *bucket* is a globally-named container; an *object* is identified by a *key* (which looks like a path, `users/42/avatar.png`, but is actually a flat string — there are no real "folders").
- **Durability vs availability.** S3 stores each object redundantly across multiple AZs, giving ~99.999999999% durability (you will not lose data). Availability (can you reach it right now) is a separate, lower number.
- **Eventual vs strong consistency.** Modern S3 is strongly consistent for reads-after-writes — but older systems and some object stores are *eventually* consistent, meaning a just-written object might 404 for a moment. Know your store's guarantee before you build read-after-write logic on it.

### Storage classes (the cost lever)

You pay for what you store × how fast you need it back. Match the class to the access pattern:

| Class (S3 names) | For | Retrieval |
|---|---|---|
| **Standard** | Hot data, served constantly | Instant |
| **Infrequent Access (IA)** | Accessed monthly-ish | Instant, cheaper storage, per-GB retrieval fee |
| **Glacier / Deep Archive** | Backups, compliance, "maybe never" | Minutes to hours, very cheap storage |
| **Intelligent-Tiering** | "I don't know the pattern" | Auto-moves objects between tiers |

A **lifecycle policy** automates this: "objects older than 30 days → IA; older than 1 year → Glacier; older than 7 years → delete." Logs and backups can drop their storage cost 5–20x this way for free.

### Presigned URLs — the right way to do uploads/downloads

The amateur pattern routes file bytes *through your server*: client → your app → S3. That burns your compute, bandwidth, and memory on data your app doesn't even look at. The professional pattern is a **presigned URL**: your server (which holds the credentials) generates a short-lived, signed URL granting permission for one specific operation, and the client talks to S3 *directly*.

```javascript
// Server: mint a 5-minute URL that lets THIS client PUT one specific object.
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export async function createUploadUrl(userId, filename) {
  const key = `uploads/${userId}/${crypto.randomUUID()}-${filename}`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: "my-app-uploads", Key: key, ContentType: "image/jpeg" }),
    { expiresIn: 300 } // 5 minutes
  );
  return { url, key };
}
```

```javascript
// Client: upload straight to S3 — the bytes never touch your server.
const { url, key } = await fetch("/api/upload-url?name=cat.jpg").then(r => r.json());
await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": "image/jpeg" } });
// then tell your API "key is ready" to record it in the DB
```

The same pattern in reverse (presigned `GetObject`) serves private downloads without making the bucket public. This keeps your app stateless and cheap and your bucket private — the two things that matter.

:::info[Highlight: object storage + CDN is the entire "media" architecture]
For serving images/video/static files to users, the canonical setup is **private bucket + CDN in front** (CloudFront / Cloud CDN / Cloudflare). Users hit the CDN edge (fast, cached, cheap egress); the CDN fetches from the bucket on a miss via a locked-down identity (e.g. an Origin Access Control), so the bucket itself stays private and is never hit directly by the public. This ties back to [CDNs & the edge](/docs/foundations/cdn-and-edge) — the bucket is the origin, the CDN is the delivery layer.
:::

## The public-bucket mistake

The most famous cloud breach class — "company leaks millions of records via an exposed S3 bucket" — is almost always a *misconfigured object store*, not a hack. Someone set a bucket or its objects to public-read for convenience (to serve a file, to debug), and forgot. Defenses, in order:

1. **Block Public Access at the account level** — a master switch that overrides any bucket-level setting. Turn it on; leave it on. Serve public content through a CDN with a locked origin instead.
2. **Default to private**; grant access via IAM and presigned URLs, never via "make public."
3. **Encrypt at rest** (on by default now) and **enforce TLS** in transit via a bucket policy condition.
4. **Enable access logging / monitoring** so unusual access is visible.

```hcl
# Belt and suspenders: a private bucket with public access blocked at the bucket level.
resource "aws_s3_bucket" "uploads" { bucket = "my-app-uploads" }

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

## Block & file storage (briefly — you'll touch these rarely)

- **Block (EBS):** the disk your VM boots from and your self-managed database writes to. Key facts: it's **single-AZ** (the volume lives in one zone — to survive an AZ loss you take *snapshots*, which are stored in object storage across AZs), and it comes in performance tiers (general-purpose SSD `gp3` for most things, provisioned-IOPS `io2` for demanding databases). Back up via automated snapshots.
- **File (EFS/Filestore):** an NFS share many machines mount simultaneously. Use it when an application genuinely needs a *shared POSIX filesystem* across a fleet (some legacy apps, shared content/render pipelines). It's pricier than object storage and slower than block; if you're reaching for it for a *new* app, double-check that object storage wouldn't do.

## Common mistakes

:::caution[Where people commonly trip up]
- **Making a bucket public to serve files.** This is the breach. Keep buckets private; serve via a CDN with a locked origin, and use presigned URLs for direct client access.
- **Proxying upload/download bytes through your server.** It wastes your compute and bandwidth and breaks at scale. Use presigned URLs so clients talk to object storage directly.
- **Leaving everything in Standard storage forever.** Logs and backups in Standard cost many times what they should. Add a lifecycle policy to tier and expire old data.
- **Treating object storage like a filesystem.** No real folders, no in-place edits, listing is a paginated API call (slow/costly on huge prefixes). Design keys and access patterns accordingly.
- **Forgetting EBS is single-AZ.** A volume doesn't survive its AZ failing. Snapshot regularly; for HA databases use a managed multi-AZ service instead of self-managing on one EBS volume.
:::

## Page checkpoint

<Quiz id="cloud-storage-page" title="Did storage stick?" sampleSize={2}>

<Question
  prompt="A web app needs to store user-uploaded images and serve them to other users. Which storage type, and how should uploads flow?"
  options={[
    { text: "Block storage (EBS); upload through the app server to the attached disk" },
    { text: "Object storage (S3); clients upload directly via short-lived presigned URLs so bytes never pass through the app server" },
    { text: "File storage (EFS) mounted on every app instance" },
    { text: "Store the images as rows in the SQL database" }
  ]}
  correct={1}
  explanation="User files belong in object storage. The professional flow is presigned URLs: the server mints a short-lived signed URL and the client uploads/downloads directly to S3, keeping the app stateless and avoiding wasting compute/bandwidth proxying bytes. The bucket stays private."
  revisit={{ to: "/docs/cloud/cloud-storage#presigned-urls--the-right-way-to-do-uploadsdownloads", label: "Presigned URLs" }}
/>

<Question
  prompt="What is the standard architecture for serving public images/video from object storage without exposing the bucket?"
  options={[
    { text: "Set the bucket to public-read and link to it directly" },
    { text: "Put a CDN in front of a private bucket, with the CDN fetching from the bucket via a locked-down origin identity" },
    { text: "Copy the files onto every app server's local disk" },
    { text: "Email the files to users on demand" }
  ]}
  correct={1}
  explanation="Private bucket + CDN with a locked origin (e.g. Origin Access Control) is canonical: users hit the cached, cheap-egress CDN edge, which fetches from the still-private bucket on a miss. The bucket is never public — avoiding the classic exposed-bucket breach."
  revisit={{ to: "/docs/cloud/cloud-storage#object-storage-in-depth-s3--gcs--blob", label: "Bucket + CDN" }}
/>

<Question
  prompt="What's the cheapest no-code way to stop logs and backups from piling up huge bills in Standard object storage?"
  options={[
    { text: "Delete them manually each week" },
    { text: "A lifecycle policy that automatically tiers old objects to Infrequent Access / Glacier and expires them after a set age" },
    { text: "Compress every object with gzip before upload" },
    { text: "Move them to a bigger bucket" }
  ]}
  correct={1}
  explanation="Lifecycle policies automate cost control: 'after 30 days → IA, after a year → Glacier, after 7 years → delete.' This can cut storage cost 5–20x for cold data like logs and backups with zero ongoing effort."
  revisit={{ to: "/docs/cloud/cloud-storage#object-storage-in-depth-s3--gcs--blob", label: "Storage classes & lifecycle" }}
/>

</Quiz>

## What's next

→ Continue to [Managed data services](./cloud-managed-data) — the databases, caches, and queues the cloud runs for you so you don't self-host them on a VM.
