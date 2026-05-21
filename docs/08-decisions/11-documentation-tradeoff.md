---
id: documentation-tradeoff
title: The Documentation Trade-Off
sidebar_position: 12
sidebar_label: 11. Documentation
description: Document the things that don't change, not the things that do. The right docs reduce repeated questions; the wrong docs are noise.
---

# The Documentation Trade-Off

> **In one line:** Document the things that don't change, not the things that do — the right docs reduce repeated questions; the wrong docs are noise that lies eventually.

:::tip[In plain English]
The classic documentation failure is paraphrasing your code in comments and then letting both drift. Code is the source of truth about *what* something does — and code can't go stale because the runtime enforces it. Docs should explain things code can't: *why* a decision was made, *how* to onboard, *what to do when X breaks*.
:::

## What's worth documenting

- **Architecture decisions** (*ADRs* — short docs that record why a choice was made and what alternatives lost) — why, not what.
- **Conventions** — naming, code style, error handling patterns.
- **Onboarding** — how to set up the project.
- **Runbooks** — what to do when X breaks.
- **API contracts** — for external consumers.
- **Domain concepts** — what is a "tenant"? What does "active" mean?

## What's not worth documenting

- **Implementation details.** Code is the truth; docs lie eventually.
- **Things obvious from the code.** Don't paraphrase your own code in comments.
- **Things that change weekly.** They'll be stale tomorrow.

## Forms of documentation

- **READMEs** — Entry points; the first thing to read.
- **Inline code comments** — Why something is non-obvious, not what it does.
- **ADRs / RFCs** — Significant decisions (*RFC* = Request for Comments, a peer-reviewed design proposal).
- **Wikis / Notion** — Cross-cutting concerns, organizational stuff.
- **API docs** — Generated from code when possible (OpenAPI, TypeDoc).
- **Diagrams** — For architecture (mermaid, draw.io).

The right docs reduce repeated questions; the wrong docs are noise.

:::note[Worked example: comments that age well vs poorly]
Two comments in the same file. Six months later, which is still useful?

```ts
// ❌ Ages badly: just paraphrases the code
// Increment counter by 1
counter += 1;

// ✅ Ages well: explains the why
// We retry up to 3 times because the upstream service is flaky;
// see incident 2026-03-14 for context.
for (let i = 0; i < 3; i++) { ... }
```

The first comment becomes a lie the moment someone changes the increment. The second explains a *decision* that doesn't expire — even if the retry count later changes to 5, the comment is still pointing to useful context.

Write comments and docs that capture **the reason for a choice**, not the choice itself.
:::

:::info[Highlight: the "stale doc" failure mode]
The worst kind of doc isn't a missing one — it's a confidently wrong one. A README that hasn't been updated since 2024 doesn't just fail to help; it actively misleads new engineers who treat it as authoritative.

Defenses:

- Generate docs from code (OpenAPI, TypeDoc) whenever possible — they can't drift.
- Put docs *next to* the code they describe; PR reviewers notice when they drift.
- Treat "doc still accurate?" as a real review checklist item.
- When in doubt, delete the doc rather than leave it stale.
:::

## What's next

→ Continue to [The "What Would Hurt to Change" Question](./what-would-hurt) — a practical reversibility check.
