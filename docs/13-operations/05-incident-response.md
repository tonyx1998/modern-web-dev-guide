---
id: incident-response
title: Incident Response & Postmortems
sidebar_position: 6
sidebar_label: Incident response
description: Severity levels, the incident command roles, communication during an outage, stop-the-bleeding-first, and blameless postmortems that actually prevent recurrence.
---

# Incident Response & Postmortems

> **In one line:** An incident is handled well when there's a clear commander, communication is steady and honest, you stop the bleeding *before* hunting the root cause, and afterward you run a **blameless** postmortem whose action items actually get done — because the goal isn't to find who broke it, it's to make sure it can't break that way again.

:::tip[In plain English]
Eventually something goes badly wrong: the site's down, data's not flowing, customers are angry. How a team handles that hour separates the calm shops from the chaotic ones. The chaotic version: ten people in a channel talking over each other, three of them poking the same database, nobody telling customers anything, and afterward a hunt for who to blame (so next time everyone hides their mistakes). The professional version: one person is clearly in charge (the **incident commander**), roles are assigned, updates go out on a schedule even when there's no news, the *first* priority is restoring service (not understanding it), and afterward a **blameless postmortem** treats the incident as a system failure to learn from — producing concrete fixes that get tracked to completion. This page is that playbook.
:::

## Severity levels: a shared language for "how bad"

Before an incident, agree on severities so everyone instantly understands scope and urgency. A common scheme:

| Sev | Meaning | Example | Response |
|---|---|---|---|
| **SEV-1** | Critical, broad user impact | Whole site down; data loss; security breach | All-hands, page leadership, war room now |
| **SEV-2** | Major feature down / significant impact | Checkout failing; one region down | Page on-call + owning team, declare incident |
| **SEV-3** | Minor / limited impact | Non-critical feature degraded | Handle in business hours |

Severity drives *everything* — who's paged, how often you communicate, whether you wake an executive. The first job when an alert becomes an incident is to **declare it and assign a severity**, even a rough one (you can upgrade/downgrade later).

## Incident command: roles, not a mob

Borrowed from emergency services. Even a small incident benefits from separating the roles (one person can wear several on a small team, but the *roles* should be explicit):

- **Incident Commander (IC)** — runs the response, makes decisions, keeps the timeline. *Does not* dig into the fix themselves — their job is coordination, so the response doesn't fragment. The most important role.
- **Operations / responders** — the people actually investigating and applying fixes, directed by the IC.
- **Communications lead** — owns updates to stakeholders/customers/status page, freeing responders to focus.
- **Scribe** — records the timeline (what we saw, what we did, when) — invaluable for the postmortem and impossible to reconstruct later from memory.

The anti-pattern this prevents: everyone debugging in parallel, two people applying conflicting fixes, nobody talking to customers, and no record of what happened.

:::info[Highlight: stop the bleeding before you diagnose]
The deepest instinct to override during an incident is the engineer's urge to *understand* the problem before acting. **Mitigation comes before root cause.** If a deploy 20 minutes ago correlates with the errors, *roll it back now* — don't spend 40 minutes confirming it's the cause while users suffer. If a region is unhealthy, fail traffic over to a healthy one *now*. Restore service first; understand it later in the postmortem, calmly, with logs. This is why **fast rollback** (the [next page](./ops-deploys)) is a reliability superpower: the fastest mitigation for the most common incident (a bad deploy) is undoing it, and that should take seconds. Curiosity is for the postmortem; the incident is for stopping the harm.
:::

## Communicating during an incident

Communication failures turn a technical incident into a reputational one. The rules:

- **Update on a cadence, even with no news.** "Still investigating, next update in 20 min" beats silence — silence reads as "they don't know it's happening" or "they've given up."
- **Be honest and specific about impact** without speculating on cause. "Checkout is failing for ~10% of users; we're mitigating" — not "probably the database, maybe, we think."
- **Use a status page** for external customers so support isn't fielding the same question 500 times and customers aren't guessing.
- **Separate internal and external comms.** Internal can be raw and technical; external is calm, impact-focused, and free of blame or half-confirmed theories.

## The blameless postmortem

After any significant incident, write a postmortem. The non-negotiable principle is **blamelessness**: it analyzes *what in the system and process* allowed the incident, not *who* to punish.

Why blameless isn't just being nice — it's the only thing that *works*: if people are punished for incidents, they hide mistakes, avoid touching risky systems, and stop sharing the honest detail you need to actually fix things. A culture of blame produces *less safety*, because the information goes underground. "Human error" is never a root cause — it's a prompt to ask *why did the system make that error easy, and why didn't anything catch it?* (The classic example: someone ran a destructive command in prod. Blameful conclusion: "they were careless." Blameless conclusion: "prod and staging looked identical, there was no confirmation guard, and the command had no dry-run — *anyone* would eventually do this. Fix the system.")

A good postmortem contains:

```markdown
# Postmortem: Checkout outage, 2026-06-03

**Impact:** Checkout failed for ~10% of users for 38 minutes. ~$X revenue, N support tickets.
**Severity:** SEV-2

## Timeline (from the scribe)
- 14:02 deploy v812 goes out
- 14:09 error-rate alert fires (checkout success < 99.5%)
- 14:14 IC declares SEV-2; comms posts to status page
- 14:21 deploy correlated; rolled back to v811   ← mitigation before full root cause
- 14:40 error rate normal; incident closed

## Root cause (the 5 whys, not "who")
v812 introduced an N+1 query that, under sale traffic, exhausted the DB connection pool…
…why did it reach prod? No load test on the checkout path. Why not caught fast? The
canary stage was skipped for a "small" change.

## What went well / poorly
Well: rollback was fast (7 min). Poorly: no canary; no connection-pool alert.

## Action items (owned, dated, tracked — the part that matters)
- [ ] Add connection-pool-saturation alert — @alice — by 2026-06-10
- [ ] Make canary stage non-skippable — @bob — by 2026-06-12
- [ ] Add checkout-path load test to CI — @carol — by 2026-06-20
```

:::note[Worked example: the postmortem that prevents the next ten]
The action items are the whole point — a postmortem with no tracked, owned, dated follow-ups is theater. In the example above, the *incident* was "a bad deploy," but the *learnings* (add the missing alert, make canary non-skippable, add the load test) each prevent an entire *class* of future incidents, not just this one. Mature orgs review postmortem action items in regular ops meetings and treat "incident learnings not done" as real debt. The compounding effect is the payoff: each incident, handled this way, makes the *next* category of incident less likely — which is how a system gets genuinely reliable over time, rather than just surviving outage after outage.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **No incident commander — a debugging mob.** Parallel uncoordinated fixes, conflicting actions, nobody communicating. Assign a single IC whose job is coordination, not fixing.
- **Diagnosing before mitigating.** Users suffer while you confirm a theory. Roll back / fail over first; understand it in the postmortem.
- **Going silent during an outage.** Silence damages trust more than bad news. Update on a cadence even when there's nothing new.
- **Blameful postmortems.** Punishing people drives mistakes underground and makes the system *less* safe. Analyze the system and process; "human error" is a starting question, not a root cause.
- **Postmortems with no tracked action items.** Writing it down and never doing the fixes guarantees the incident recurs. Owned, dated, tracked follow-ups are the deliverable.
- **No agreed severity scheme.** Without shared definitions, every incident wastes time arguing how bad it is and who to involve.
:::

## Page checkpoint

<Quiz id="incident-response-page" title="Did incident response stick?" sampleSize={2}>

<Question
  prompt="A deploy 20 minutes ago correlates with a spike in checkout errors. What should the responders do FIRST?"
  options={[
    { text: "Spend time confirming the deploy is definitely the cause before touching anything" },
    { text: "Roll back the deploy immediately to stop the user impact, then investigate the root cause calmly afterward" },
    { text: "Write the postmortem" },
    { text: "Scale up the database" }
  ]}
  correct={1}
  explanation="Mitigation before root cause: restore service first. If a recent deploy correlates with the harm, roll it back now rather than spending 40 minutes proving causation while users fail to check out. Understanding happens later, in the postmortem. Fast rollback is the key enabler."
  revisit={{ to: "/docs/operations/incident-response#communicating-during-an-incident", label: "Stop the bleeding first" }}
/>

<Question
  prompt="Why is a blameless postmortem the only approach that actually improves reliability?"
  options={[
    { text: "It's faster to write" },
    { text: "Blaming people drives mistakes underground — they hide errors and avoid risky systems — so you lose the honest detail needed to fix root causes; blameless analysis targets the system/process that made the error easy" },
    { text: "It avoids legal liability" },
    { text: "It lets the team skip the technical analysis" }
  ]}
  correct={1}
  explanation="A blame culture produces less safety because information goes underground. Blameless postmortems treat 'human error' as a prompt — why did the system make that error easy and why didn't anything catch it? — yielding systemic fixes that prevent whole classes of recurrence."
  revisit={{ to: "/docs/operations/incident-response#the-blameless-postmortem", label: "Blamelessness" }}
/>

<Question
  prompt="What is the most important output of a postmortem, and what makes it real rather than theater?"
  options={[
    { text: "A detailed root-cause narrative; it's real if it's long enough" },
    { text: "Owned, dated, tracked action items that prevent whole classes of future incidents — a postmortem with no followed-through fixes guarantees recurrence" },
    { text: "A list of who was responsible; it's real if it names names" },
    { text: "An apology posted to the status page" }
  ]}
  correct={1}
  explanation="The learnings — the missing alert, the skipped canary, the absent load test — each prevent a category of future incident. But only if they're assigned, dated, and tracked to completion. Untracked action items make the postmortem theater and the incident recurs."
  revisit={{ to: "/docs/operations/incident-response#the-blameless-postmortem", label: "Action items" }}
/>

</Quiz>

## What's next

→ Continue to [Deploys & rollbacks](./ops-deploys) — since most incidents are caused by a change, the way you ship changes is itself a reliability tool.
