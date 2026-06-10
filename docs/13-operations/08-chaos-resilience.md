---
id: chaos-engineering
title: Chaos & Resilience
sidebar_position: 9
sidebar_label: Chaos & resilience
description: Chaos engineering and game days, disaster recovery with RTO/RPO, backups you've actually tested, and why resilience is proven by breaking things on purpose.
---

# Chaos & Resilience

> **In one line:** You don't actually know your system is resilient until you've broken it on purpose and watched it survive — so chaos engineering injects controlled failure to find weaknesses before they find you, and disaster recovery is the plan (with tested backups and explicit RTO/RPO targets) for the failures too big to absorb.

:::tip[In plain English]
Every reliability pattern from this chapter — timeouts, retries, circuit breakers, multi-AZ, failover — is a *theory* until something fails and you see whether it actually works. Usually you find out during a real outage, at the worst possible time. **Chaos engineering** flips that: you deliberately inject failures (kill a server, add network latency, take a dependency offline) *in a controlled way*, during business hours with everyone watching, to discover the weaknesses while it's safe to learn. It sounds reckless and is the opposite — it's the fire drill. Separately, **disaster recovery (DR)** is your plan for the catastrophic stuff: an entire region goes down, a database gets corrupted, ransomware hits. The two questions DR forces you to answer in advance — *how much data can we afford to lose?* and *how fast must we be back?* — are business decisions you do not want to be making for the first time during the actual disaster.
:::

## Chaos engineering: break it on purpose

The discipline, pioneered by Netflix (their "Chaos Monkey" randomly killed production instances to force engineers to build services that tolerate it). The scientific-method shape:

1. **Define steady state** — a metric that means "healthy" (e.g. checkout success rate ≥ 99.5%).
2. **Hypothesize** — "if we kill one app instance, steady state holds because the load balancer reroutes."
3. **Inject the failure** — terminate the instance / add latency / block a dependency.
4. **Observe** — did steady state hold? If yes, confidence earned. If no, you just found a weakness *safely* — fix it.
5. **Minimize blast radius** — start tiny (one instance, staging or a small % of prod), expand only as confidence grows. Always have an abort switch.

Common experiments: kill instances (does failover work?), inject network latency/errors (do timeouts and circuit breakers fire?), take a dependency offline (does graceful degradation kick in?), exhaust a resource (does load-shedding work?). Each one *validates* a specific reliability pattern you *think* you have.

:::info[Highlight: a "game day" is chaos engineering for the humans, not just the system]
A **game day** is a scheduled exercise where the team simulates an incident — sometimes by injecting a real failure, sometimes tabletop — and runs the full response: the alert fires, someone takes incident command, comms go out, the runbook is followed, rollback is exercised. You're testing the *socio-technical* system: Do the alerts actually fire? Is the runbook correct or stale? Does the new hire know how to declare an incident? Can you actually reach the secondary on-call? Teams almost always discover that something human is broken — a runbook references a deleted dashboard, nobody has access to the status page, the escalation contact left the company. Far better to find that on a Tuesday afternoon game day than at 3am during the real thing. Game days are where the [incident-response](./incident-response) and [alerting](./on-call-alerting) chapters get *tested* instead of just written down.
:::

## Disaster recovery: RTO and RPO

DR planning starts with two numbers, per system, that are *business* decisions, not technical ones:

- **RPO — Recovery Point Objective:** how much *data* can you afford to lose, measured in time? RPO of 1 hour = "losing up to the last hour of data is acceptable." This dictates **backup frequency** — hourly backups can't deliver a 5-minute RPO.
- **RTO — Recovery Time Objective:** how *fast* must you be back after a disaster? RTO of 4 hours = "we can be down up to 4 hours." This dictates your **recovery architecture** — a 5-minute RTO needs hot standby/multi-region; a 24-hour RTO can tolerate restoring from backup.

```
   last backup        DISASTER         back online
        │                │                  │
        │◄─── RPO ──────►│◄───── RTO ──────►│
        │  data you lose │  time you're down│
   (set by backup freq)   (set by recovery design)
```

Tighter RTO/RPO costs exponentially more (hot multi-region standby vs. nightly backups), so you set them per system by business value: the payments database might be RPO≈0 / RTO minutes; a marketing analytics store might be RPO 24h / RTO days. Don't pay for five-minute recovery on data nobody would miss.

## Backups: the ones you haven't tested don't exist

The most dangerous belief in operations: "we have backups." A backup you have never *restored* is a hope, not a backup — and the failure modes are common and brutal: the backup job silently broke months ago, the backups are corrupt, they're missing a critical table, restoring takes 14 hours when your RTO was 2, or the restore credentials are themselves locked in the system that's down. The discipline:

- **Test restores regularly** — actually restore to a scratch environment on a schedule and verify the data. This is the only proof a backup works.
- **The 3-2-1 rule** — 3 copies, on 2 media/locations, 1 off-site (and ideally one *immutable/offline* copy, because ransomware encrypts the live backups too).
- **Back up across failure domains** — a backup in the same region/account as the primary doesn't survive that region/account being compromised or deleted.
- **Protect against the human/malicious delete** — versioning and immutability so a bad actor or a fat-fingered command can't wipe both data and backups.

:::note[Worked example: the backup that wasn't]
A company's database is corrupted. Calm at first — "restore from backup." Then: the nightly backup job had been failing for *seven weeks* (the alert went to an inbox nobody read). The most recent *good* backup is two months old. They restore it: 60 days of customer data gone, and the restore itself takes 11 hours because nobody had ever timed it — blowing an RTO they'd assumed was "a couple hours." Every link in this chain is a chapter principle violated: the backup wasn't *monitored* (observability), wasn't *tested* (this page), and the RTO was *assumed not measured*. The fix isn't "better backup software" — it's treating restore as a regularly-exercised, monitored, timed procedure. A backup is only real once you've watched it come back.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Assuming reliability patterns work without testing them.** Failover, timeouts, and circuit breakers are theories until a controlled failure proves them. Inject failure on purpose, starting small.
- **Never running game days.** Untested incident processes and runbooks rot — references break, access lapses, people forget the steps. Rehearse the response before the real incident.
- **No defined RTO/RPO.** Without them, recovery design and backup frequency are guesses, and you make business-critical decisions mid-disaster. Set them per system.
- **Trusting untested backups.** A backup never restored is a hope. Test restores on a schedule and time them against your RTO.
- **Backups in the same failure domain as the data.** A backup in the same region/account dies with it. Keep an off-site, immutable copy (3-2-1).
- **Not monitoring backup jobs.** Silent backup failures are discovered exactly when you need the backup. Alert on backup success/freshness like any other SLI.
:::

## Chapter wrap-up

Operations is where software meets reality and keeps working anyway. The throughline: **decide how reliable you need to be (SLOs/error budgets), see what's happening (observability), build to fail gracefully (reliability patterns), be woken only for what matters (alerting), respond and learn without blame (incidents/postmortems), change safely and reversibly (progressive delivery + fast rollback), stay ahead of load (capacity), and prove it all by breaking it on purpose (chaos + tested DR).** None of it is exotic; all of it is the difference between software that *runs* and software that merely *ran once*.

## Page checkpoint

<Quiz id="chaos-resilience-page" title="Did chaos & resilience stick?" sampleSize={3}>

<Question
  prompt="What is the purpose of chaos engineering?"
  options={[
    { text: "To stress-test individual functions for performance" },
    { text: "To deliberately inject controlled failures (kill instances, add latency, drop dependencies) and verify the system holds its steady state — discovering reliability weaknesses safely, before a real outage does" },
    { text: "To randomly delete data to test backups" },
    { text: "To simulate user load at peak" }
  ]}
  correct={1}
  explanation="Chaos engineering validates that your reliability patterns actually work by injecting real, bounded failure under observation. You hypothesize the system survives, inject the failure, and either earn confidence or find a weakness while it's safe to fix — start small with an abort switch."
  revisit={{ to: "/docs/operations/chaos-engineering#chaos-engineering-break-it-on-purpose", label: "Chaos engineering" }}
/>

<Question
  prompt="What do RTO and RPO specify, and what does each drive?"
  options={[
    { text: "RTO is request timeout, RPO is request-per-operation; both drive performance" },
    { text: "RPO = how much DATA you can afford to lose (drives backup frequency); RTO = how FAST you must recover (drives recovery architecture) — both are per-system business decisions" },
    { text: "They're two names for the same backup interval" },
    { text: "RTO sets the SLO and RPO sets the SLA" }
  ]}
  correct={1}
  explanation="RPO bounds acceptable data loss (so it sets how often you back up); RTO bounds acceptable downtime (so it sets whether you need hot standby vs. restore-from-backup). Both are business calls per system — tighter targets cost exponentially more, so size them to value."
  revisit={{ to: "/docs/operations/chaos-engineering#disaster-recovery-rto-and-rpo", label: "RTO vs RPO" }}
/>

<Question
  prompt="Why is 'we have backups' a dangerous belief on its own?"
  options={[
    { text: "Backups are too expensive to keep" },
    { text: "A backup you've never restored is a hope, not a guarantee — backup jobs fail silently, backups corrupt or miss data, and restores can blow your RTO; only a regularly tested, monitored, timed restore proves a backup works" },
    { text: "Backups always contain malware" },
    { text: "Cloud providers delete backups after 30 days" }
  ]}
  correct={1}
  explanation="The classic disaster is discovering at restore time that the backup job broke weeks ago, the data is corrupt/incomplete, or the restore takes far longer than your RTO. Test restores on a schedule, monitor backup freshness, and keep an off-site immutable copy (3-2-1)."
  revisit={{ to: "/docs/operations/chaos-engineering#backups-the-ones-you-havent-tested-dont-exist", label: "Tested backups" }}
/>

</Quiz>

## What's next

→ You've finished the operations pillars. Take the [Chapter 7 checkpoint](./operations-checkpoint), then continue to [Chapter 8: Distributed Systems](/docs/distributed-systems) — the deep theory of why systems that span many machines behave the way they do.
