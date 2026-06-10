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

## Common mistakes

:::caution[Where people commonly trip up]
- **Writing the doc to satisfy a process, not a reader.** ADRs filed because the template demands one — but written by someone who doesn't actually believe the decision needs documenting — read like compliance theater. If you can't name the future engineer who'll thank you for this doc, don't write it.
- **Documenting *what* instead of *why* in ADRs.** "We chose Postgres" is not an ADR; it's a fact. The doc only earns its keep if it captures the alternatives that lost, the constraints in force at the time, and the things that would make you reconsider. Future-you needs the reasoning, not the verdict.
- **Treating wiki pages as immortal.** A page from 2023 that says "we use Pulumi for IaC" is wrong if the team migrated to Terraform last year, but newcomers still find it via search. Put an "owner" and "last reviewed" date on every long-lived doc, and delete docs whose owner has left without a successor.
- **Letting AI tools generate prose docs and treating them as authoritative.** A doc generated from "summarize this codebase" looks confident and is wrong in subtle ways the model can't see. Generated reference (OpenAPI, TypeDoc) is great because the runtime keeps it honest; generated narrative is just plausible-sounding fiction unless a human verifies every claim.
:::

## Page checkpoint

<Quiz id="decisions-documentation-tradeoff-page" title="Did the documentation tradeoff stick?" sampleSize={3}>

<Question
  prompt="The chapter contrasts two comments. Which one ages well?"
  options={[
    { text: "`// Increment counter by 1` next to `counter += 1;`" },
    { text: "`// We retry up to 3 times because the upstream service is flaky; see incident 2026-03-14`" },
    { text: "`// TODO: rewrite this`" },
    { text: "`// This is a function`" }
  ]}
  correct={1}
  explanation="Comments that explain a decision and link to context don't expire even if the implementation changes. Comments that paraphrase the code become lies the moment the code is edited."
  revisit={{ to: "/docs/decisions/documentation-tradeoff#whats-worth-documenting", label: "Comments that age well" }}
/>

<Question
  prompt="Per the chapter, which is WORTH documenting?"
  options={[
    { text: "Implementation details — exactly how each function works" },
    { text: "Comments that paraphrase the code" },
    { text: "Architecture decisions (ADRs) — why a choice was made and what alternatives lost" },
    { text: "Whatever changes weekly during active development" }
  ]}
  correct={2}
  explanation="The chapter's rule: document things that don't change (decisions, conventions, runbooks, domain concepts, contracts). Things obvious from code or that churn weekly aren't worth the cost — they become stale lies."
  revisit={{ to: "/docs/decisions/documentation-tradeoff#whats-worth-documenting", label: "What's worth documenting" }}
/>

<Question
  prompt="The chapter calls one kind of documentation worse than missing docs. Which?"
  options={[
    { text: "Documentation that's too thorough" },
    { text: "A confidently wrong, stale doc — like a README that hasn't been updated since 2024 but reads as authoritative" },
    { text: "Documentation written by someone who's no longer on the team" },
    { text: "Inline code comments" }
  ]}
  correct={1}
  explanation="Stale docs actively mislead. The chapter's defenses: generate docs from code when possible, put docs next to code so PR reviewers notice drift, treat staleness as a review item, and delete rather than leave wrong."
  revisit={{ to: "/docs/decisions/documentation-tradeoff#forms-of-documentation", label: "The stale doc failure mode" }}
/>

<Question
  prompt="Which type of documentation does the chapter say can't drift because it's generated from code?"
  options={[
    { text: "A wiki page written in Notion" },
    { text: "OpenAPI specs or TypeDoc output generated from the source" },
    { text: "An onboarding runbook" },
    { text: "An ADR" }
  ]}
  correct={1}
  explanation="Generated docs (OpenAPI, TypeDoc) are derived from code, so they can't lie. The chapter explicitly recommends preferring generation wherever possible — and putting docs next to code so reviewers spot drift."
  revisit={{ to: "/docs/decisions/documentation-tradeoff#forms-of-documentation", label: "Generated docs" }}
/>

</Quiz>

## What's next

→ Continue to [The "What Would Hurt to Change" Question](./what-would-hurt) — a practical reversibility check.
