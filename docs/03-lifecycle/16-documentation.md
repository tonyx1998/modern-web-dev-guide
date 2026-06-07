---
id: documentation
title: 'Documentation craft: READMEs, ADRs, runbooks, API docs'
sidebar_position: 16
sidebar_label: Documentation
description: How to write documentation that future-you (and your teammates) will actually use — what each doc type is for, when to write it, and the structures that work.
---

# Documentation craft: READMEs, ADRs, runbooks, API docs

> **In one line:** Good documentation is the highest-leverage writing in software engineering — a 30-minute README saves 30 hours of "how do I run this" across a team's lifetime, an ADR saves the next maintainer from re-deriving a decision, a runbook lets an on-call engineer fix the incident at 3am without paging you.

:::tip[In plain English]
There are four kinds of docs that actually pay off: READMEs (how to use this thing), ADRs (why this decision), runbooks (when things break, do this), and API docs (the public contract). Each has a clear structure and a clear audience. Most "docs" people write are vague mixes that no one reads. This page is the working developer's guide to writing the four types that work — and skipping the ones that don't.
:::

The principle: **documentation is a force multiplier or a waste of time**. The difference is purpose and audience. Write the doc that solves a *specific problem for a specific reader*; skip the rest.

## The four high-value doc types

| Type | Audience | Question it answers |
|------|----------|---------------------|
| **README** | New user / contributor | "What is this, how do I run it, where do I go next?" |
| **ADR** (Architecture Decision Record) | Future maintainer | "Why did we decide to do it this way?" |
| **Runbook** | On-call engineer at 3am | "Something is broken — what do I do?" |
| **API docs** | API consumer | "How do I use this endpoint?" |

Everything else (long design docs, narrative architecture overviews, wiki-style notes) is *sometimes* useful but rots fast and often goes unread. Focus on the four that pay rent.

## READMEs

The single most-read doc in any project. Most are terrible.

### What goes in a great README

```markdown
# Project Name

One-line description: what it is, who it's for.

## Quick start

\`\`\`bash
git clone <repo>
cd <project>
cp .env.example .env
npm install
npm run dev
# → open http://localhost:3000
\`\`\`

## What this is

Two paragraphs. What problem it solves. Who uses it. What's special about it.

## Architecture (1 paragraph + diagram)

A high-level mental model. Where does the data go, who calls whom.

## Development

How to run tests, lint, etc.

\`\`\`
npm run test         # unit tests
npm run test:e2e     # end-to-end
npm run lint         # static checks
npm run typecheck    # tsc
\`\`\`

## Deployment

How it gets to production.

## Contributing

Where to look for issues. Code review process. Commit message format.

## Further reading

Links to ADRs, runbooks, API docs.
```

That's it. Maybe 150 lines.

### What does NOT go in a README

- Marketing copy (put it on a landing page).
- API reference (put it in dedicated docs).
- Long architecture treatises (ADR or separate doc).
- Personal anecdotes about the project's history.
- "TODO: write this section" placeholders that stay forever.

### The acid test for a README

**Can a new hire clone the repo and run it within 30 minutes, without asking anyone?**

If no, the README is failing its primary job. Test by handing the repo to someone outside the team; watch where they get stuck; fix.

## ADRs (Architecture Decision Records)

The doc type most teams don't write — and the one that pays the most when they do.

The problem: every architecture decision (chose React over Vue, chose Postgres over Mongo, chose monolith over microservices) has *reasons* — alternatives considered, constraints, tradeoffs. Three years later, no one remembers them. Someone wants to switch. They re-derive the whole analysis. Maybe they undo a decision that was correct for non-obvious reasons.

ADR: a 1-2 page note capturing the decision and *why*.

### Template

```markdown
# ADR-0042: Use Postgres instead of MongoDB

**Status**: Accepted
**Date**: 2026-05-26
**Authors**: Tony Xu, Jane Smith

## Context

We need a database for user, order, and product data. We expect ~1M users
in year 1. Reads and writes both matter; we have multi-table queries 
(joins) and need transactional consistency for orders.

## Decision

Use Postgres.

## Alternatives considered

- **MongoDB**: chosen by previous startup; document model fits product data,
  but joins are awkward and we need them. ACID is recent and not the strong
  suit. Rejected.
- **DynamoDB**: scales effortlessly but the access patterns don't fit our
  joins; would force us to denormalize aggressively and lose flexibility for
  future feature work. Rejected.
- **MySQL**: similar to Postgres; team is more familiar with Postgres
  tooling and JSONB is a nice flexibility for schema-less data. Tie-breaker
  in favor of Postgres.

## Consequences

**Positive:**
- ACID transactions, joins, mature ecosystem.
- pgvector available for future AI features.
- Strong tooling (Prisma, Drizzle).

**Negative:**
- Single primary scaling ceiling (manageable until ~100M users).
- Operations: backups, replication, failover — managed via RDS/Neon to mitigate.

## Notes

- Revisit if we hit > 50M users with sustained write contention.
```

### Properties of a good ADR

- **One decision per ADR.** Don't bundle.
- **Captures alternatives.** This is what makes it valuable — not what you did, but *what you didn't do and why*.
- **Status is mutable.** "Accepted" → "Superseded by ADR-0099." Old ADRs stay in the repo as history.
- **Immutable content.** Once accepted, don't edit. Write a new ADR that supersedes it.
- **Lives in the repo.** `docs/adr/0042-postgres-over-mongodb.md`. Versioned with the code.
- **Numbered sequentially.** Easy to reference.

Tools: `adr-tools` (Bash), `log4brains`, or just markdown files in `docs/adr/`.

### When to write one

- Choosing a major piece of tech (framework, DB, language).
- Picking an architectural pattern (monolith vs microservices, event-driven vs request/response).
- Setting a convention you want enforced (e.g., "all writes go through repositories, not direct ORM calls").
- Anything you've spent more than an hour debating in a meeting.

### When NOT to write one

- Trivial decisions ("we use prettier with default config").
- Personal style choices.
- Things that aren't actually decided yet.

The bar: **would the next maintainer benefit from knowing the reasoning?** If yes, ADR. If no, comment in the code or PR description is fine.

## Runbooks

The doc that saves you at 3am.

### What goes in one

```markdown
# Runbook: API 500 error rate spike

## Symptoms
- Datadog alert: `api.error_rate > 5%` for 5+ minutes.
- Users reporting login failures.
- Status page incident open.

## Severity
P1 (user-facing, business-impacting). Page #incidents.

## Immediate triage (5 min)

1. Check Datadog dashboard: `api/errors-by-route`
   - Spike on a single route? Different problem.
   - Across all routes? Likely infra-wide.

2. Check Status pages of dependencies:
   - Stripe: status.stripe.com
   - OpenAI: status.openai.com
   - AWS RDS: AWS Health Dashboard

3. Check recent deploys:
   - `vercel deployments list --limit 5`
   - Was there a deploy in the last 30 minutes?

## Mitigations (try in order)

### If recent deploy
- Roll back: `vercel rollback <previous>`
- Verify error rate drops within 5 min.

### If DB connections exhausted
- Check Neon dashboard: connections-active vs limit.
- Scale connection pool: env `DATABASE_POOL_SIZE` → restart.
- Or scale instances: Vercel project → settings → instances.

### If 3rd party down
- Confirm via their status page.
- Enable circuit breaker for that integration.
- Communicate via status page.

## Postmortem
- Tag #postmortem after resolution.
- Owner: incident lead.
- Due: 5 business days.

## Related runbooks
- [DB-connection-exhaustion](#db-connection-exhaustion-runbook)
- [Deploy-rollback](#deploy-rollback-runbook)
```

### Properties

- **Symptom-driven.** Start with what someone is seeing (alert, error). They can search.
- **Specific steps, with commands.** Not "check the dashboard"; the exact dashboard URL and command.
- **Escalation paths.** "If A doesn't work, try B."
- **Updated after every incident.** Each new incident teaches you something; add it.
- **Easily findable.** Linked from the alert, from the status page, from the README. If the on-call can't find the runbook in 30 seconds, it doesn't exist.

The 3am test: can an on-call engineer (possibly a junior, possibly half asleep, possibly under pressure) follow this and resolve the issue?

## API docs

For any service whose API is consumed by others (browser code, mobile, partners, internal teams).

### Two flavors

**Reference** — exhaustive per-endpoint:

```markdown
## POST /api/orders

Create a new order.

### Request

\`\`\`http
POST /api/orders
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "items": [
    { "sku": "string", "qty": integer }
  ],
  "shipping_address_id": "string"
}
\`\`\`

### Response (success)

\`\`\`http
201 Created
Content-Type: application/json

{
  "id": "string",
  "status": "pending",
  "total_cents": integer,
  "items": [ { "sku": "string", "qty": integer, "subtotal_cents": integer } ]
}
\`\`\`

### Response (error)

| Status | Reason |
|--------|--------|
| 400 | Invalid request shape |
| 402 | Payment required (insufficient funds) |
| 422 | One or more items out of stock |
| 429 | Rate limited |

### Idempotency

Pass `Idempotency-Key: <uuid>`. Repeated requests with the same key return
the cached result.

### Rate limit

100 per minute per user.
```

**Tutorial** — how to do the most common things, end to end:

```markdown
## Quick start: create your first order

\`\`\`bash
# 1. Get a session
curl -X POST /api/auth/login ...

# 2. Browse the catalog
curl /api/products

# 3. Place an order
curl -X POST /api/orders ...

# 4. Check status
curl /api/orders/<id>
\`\`\`
```

Best: do both. Tutorial for getting started; reference for "what's the exact shape of X."

### Generated vs hand-written

If you have an **OpenAPI / Swagger spec**, generate reference docs automatically (Redocly, Scalar, Mintlify, Bump.sh). Keeps in sync with code.

GraphQL: GraphiQL or similar — the schema *is* the docs.

Hand-write the tutorial / "guides" sections. Generated docs can't substitute for "here's how to actually use this."

### What to include

- Auth — how to get a token; how to use it.
- Errors — every status code your API can return.
- Rate limits — what they are, what headers signal them, what to do on 429.
- Versioning — how new versions are released, deprecation policy.
- Examples in multiple languages — curl, JS, Python.

## The docs you probably *don't* need

- **Sweeping "architecture overview" wikis.** Rot fast; nobody reads them. Replaced by: a paragraph in the README + ADRs for specific decisions.
- **Inline doc-comments that re-state the code.** `// gets the user` above `function getUser()` is noise. Comment on the *why*, not the *what*.
- **Onboarding docs that try to teach the language / framework.** Link to the official tutorial; don't reinvent.
- **End-of-year-summary docs.** Quarterly retrospectives in Notion are fine; permanent docs they become aren't.
- **"We considered Vue and Angular but picked React" — without context for *why*.** That's the bad kind of ADR.

## Where docs live

Two main approaches:

| Approach | Pros | Cons |
|----------|------|------|
| **In the repo** (`README.md`, `docs/*.md`) | Versioned with code, reviewable in PRs, never out of sync | Less discoverable, no search across docs |
| **In a dedicated docs site** (Docusaurus, Astro Starlight, Nextra, Mintlify) | Searchable, beautiful, public-facing | Easy to drift from code; needs maintenance |

For internal team docs: in the repo. For public-facing API docs: dedicated site (generated from OpenAPI when possible).

Don't put internal docs in Notion or Confluence unless you're committed to keeping them in sync. The further docs are from the code, the faster they rot.

## The maintenance problem

Docs rot. Every doc you write is a future liability if not maintained.

Mitigations:

- **Test-driven docs**: if you can write a doctest or e2e test that uses the example, run it in CI. Failing test = doc is out of date.
- **Owner per doc**: someone's name at the top. If they leave, the doc is up for adoption or deletion.
- **Date stamp**: "Last reviewed: 2026-05-01" — older = more suspicious.
- **PRs that touch a feature should update its docs**: enforce in review.
- **Delete fearlessly**: if a doc is stale and no one will fix it, delete. Better no doc than a wrong one.

The rule: **a wrong doc is worse than no doc**. Readers trust docs; misplaced trust is a footgun.

## Diátaxis: the four-quadrant model

A useful taxonomy (diataxis.fr):

| Type | What | Audience |
|------|------|----------|
| **Tutorials** | Step-by-step, learning by doing | Newcomers |
| **How-tos** | Recipes for specific tasks | Users who know the basics |
| **Reference** | Exhaustive technical detail | Looking something up |
| **Explanation** | Background, concepts, why | Understanding deeper |

Most docs fail by mixing modes — a "tutorial" that pauses for two pages of explanation, or a "reference" that's hand-wavy about details. Separate them. Each doc serves one purpose.

## Writing tips

- **Code first, prose second.** A working example beats a paragraph.
- **Show, don't tell.** "It looks like this:" + code block > "It has the following structure:" + 5 sentences.
- **Active voice.** "Run `npm install`," not "npm install should be run."
- **Numbered steps for procedures.** Bulleted lists for unordered facts.
- **Headings every screen.** Readers scan; help them find the section.
- **One concept per paragraph.** Walls of text repel.
- **Define jargon on first use** or link to the definition.
- **Test with a real reader.** Hand the doc to someone outside the team; watch where they get stuck.

## Common mistakes

:::caution[Where people commonly trip up]
- **Writing "the architecture doc" as a 50-page tome.** No one reads it. Break into ADRs (one decision each) + a short README.
- **README without a quick-start.** New contributor wastes 30 minutes figuring out how to run. Lead with the quick-start.
- **Docs in Notion/Confluence that drift from code.** Six months later, no one trusts them. Repo-resident docs reviewed in PRs are the only docs that stay accurate.
- **No date stamp.** Reader can't tell if the doc is from last week or two years ago. Add "Last updated."
- **Comments that repeat the code.** Add zero value, age poorly. Comment *why*, not *what*.
- **Runbooks that say 'investigate.'** "Investigate the issue" is not a step. Specific URLs, commands, expected outputs.
- **ADRs that capture only what was chosen.** Without the alternatives + reasoning, an ADR is just a chronicle. Future readers learn nothing.
- **Generated reference docs as the only docs.** They tell you *what* endpoints exist, not *how* to use them. Pair with hand-written tutorials.
- **Hand-written reference that gets out of sync with code.** Generate from the source (OpenAPI, schema) so the docs can't drift.
- **No deletion.** Old, stale docs pile up. Audit quarterly; delete what's no longer true.
- **Writing docs because 'good engineers write docs.'** Write because *someone needs to read it*. Otherwise it's vanity work that rots.
- **The 'I'll write it tomorrow' README.** Tomorrow becomes never. Write the README on day one, even if it's 20 lines.
:::

## Page checkpoint

<Quiz id="lifecycle-documentation-page" title="Did documentation craft stick?" sampleSize={2}>

<Question
  prompt="What's the difference between a README and an ADR?"
  options={[
    { text: "READMEs are longer" },
    { text: "READMEs answer 'what is this and how do I use it' (audience: new user / contributor). ADRs answer 'why did we decide this way' (audience: future maintainer who's tempted to undo a decision). They serve different readers and different questions" },
    { text: "ADRs are for code; READMEs are for docs" },
    { text: "They are the same thing" }
  ]}
  correct={1}
  explanation="READMEs are oriented to using the project; ADRs preserve the reasoning behind important decisions so future engineers don't have to re-derive them (or undo a decision that was correct for non-obvious reasons)."
  revisit={{ to: "/docs/lifecycle/documentation#the-four-high-value-doc-types", label: "README vs ADR" }}
/>

<Question
  prompt="A team writes a runbook that says 'Investigate the issue and resolve.' Why is this useless?"
  options={[
    { text: "It's too long" },
    { text: "Runbooks are for stressed on-call engineers at 3am — they need specific URLs, exact commands, expected outputs, and decision trees. 'Investigate' isn't a step; it's a punt. The 3am test: can a junior on-call follow this and resolve? If not, rewrite with concrete steps" },
    { text: "Runbooks should only have one step" },
    { text: "It's not in markdown" }
  ]}
  correct={1}
  explanation="Runbooks exist for the moment when humans are stressed and tired. Specific commands, specific dashboards, specific decision logic. Generic guidance is what they were trying to avoid by writing the runbook."
  revisit={{ to: "/docs/lifecycle/documentation#runbooks", label: "Runbooks must be specific" }}
/>

<Question
  prompt="What single property makes an ADR valuable to a future maintainer?"
  options={[
    { text: "Length" },
    { text: "Documenting the *alternatives considered and why they were rejected*. A maintainer in 2029 isn't asking 'what did we pick' (the code tells them) — they're asking 'why didn't we pick the obvious-seeming alternative?' If the ADR doesn't answer that, it's just chronicle" },
    { text: "Number of sign-offs" },
    { text: "Length of the title" }
  ]}
  correct={1}
  explanation="The chosen option is visible in the code. The valuable knowledge is the rejected options and the reasoning — that's what stops future engineers from undoing decisions that were correct for non-obvious reasons (or from re-deriving the analysis from scratch)."
  revisit={{ to: "/docs/lifecycle/documentation#properties-of-a-good-adr", label: "ADRs capture alternatives" }}
/>

<Question
  prompt="Why is documentation in a Notion / Confluence wiki riskier (for engineering docs) than documentation in the repo?"
  options={[
    { text: "Notion is unreliable" },
    { text: "Repo-resident docs are versioned with the code, reviewed in PRs (so code changes that affect docs surface in review), and visible to everyone reading the code. Wiki docs drift — code changes; nobody updates the wiki; the wiki silently becomes wrong — and there's no review gate to catch it" },
    { text: "Wikis don't support markdown" },
    { text: "Notion requires login" }
  ]}
  correct={1}
  explanation="Distance between code and docs is correlated with rot. Repo docs reviewed in PRs are kept fresh as a side effect of normal development. Wiki docs require manual remembering to update — and engineers don't, reliably."
  revisit={{ to: "/docs/lifecycle/documentation#where-docs-live", label: "Where docs live" }}
/>

</Quiz>

## What's next

→ Continue to [Open source](/docs/lifecycle/open-source).
