---
id: operations-checkpoint
title: Chapter 6 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 6 — SRE & Operations. 5 random questions drawn from an 18-question bank. Pass to unlock Chapter 7.
---

# Chapter 6 Checkpoint

You've finished the SRE & Operations chapter. Make sure the operational toolkit stuck — SLOs and error budgets, observability, reliability patterns, alerting, incidents, safe deploys, capacity, chaos, plus the engineering depth: observability stacks/cardinality and the SLO/burn-rate/capacity math.

There are **18 questions in the bank** — each visit picks 5 at random. Miss one and the result card links you back to the exact section.

You must pass (≥ 60%) to unlock the Next button and Chapter 7 in the sidebar.

<Quiz id="operations-checkpoint" title="SRE & Operations checkpoint" sampleSize={5}>

<Question
  prompt="What is an error budget and what does remaining budget permit?"
  options={[
    { text: "The ops team's tooling budget; spend it on monitoring" },
    { text: "The allowed unreliability (100% − SLO); while budget remains, the team can confidently ship features and take risks, and an exhausted budget triggers a freeze on risky changes" },
    { text: "The maximum number of deploys per week" },
    { text: "Money refunded to customers after outages" }
  ]}
  correct={1}
  explanation="Error budget = 100% − SLO. It's a resource to spend: remaining budget is permission to move fast; an exhausted budget makes reliability the priority. It converts the ship-fast-vs-stay-up debate into a data-driven thermostat."
  revisit={{ to: "/docs/operations/sre-mindset#error-budgets-the-key-idea", label: "Error budgets" }}
/>

<Question
  prompt="Which is a good SLI?"
  options={[
    { text: "Average fleet CPU utilization" },
    { text: "Percentage of checkout requests succeeding in under 1 second — what the user actually experiences" },
    { text: "Number of running servers" },
    { text: "Lines of code shipped" }
  ]}
  correct={1}
  explanation="A good SLI measures user experience (success rate, latency, freshness), not infrastructure vitals. Users feel checkout success, not CPU%. Server metrics aid diagnosis but aren't the objective."
  revisit={{ to: "/docs/operations/sre-mindset#sli-slo-sla--get-these-straight", label: "Good SLIs" }}
/>

<Question
  prompt="Why does SRE consider 100% reliability the wrong target?"
  options={[
    { text: "Downtime benefits users" },
    { text: "Each extra 'nine' costs ~10x more with diminishing perceptible benefit, and perfect uptime implies never changing anything — so you aim for exactly as reliable as users need and bank the rest as velocity" },
    { text: "SLAs cap reliability at 99% legally" },
    { text: "Monitoring can't measure above 99.9%" }
  ]}
  correct={1}
  explanation="Reliability has exponentially rising cost and diminishing perceptible return, and 100% means zero change (which kills the product). A deliberately lower SLO that frees up velocity is often the senior choice."
  revisit={{ to: "/docs/operations/sre-mindset#sli-slo-sla--get-these-straight", label: "Why not 100%" }}
/>

<Question
  prompt="You get a metric alert that p99 latency spiked. Fastest path to root cause with the three observability pillars?"
  options={[
    { text: "Add metric labels until one explains it" },
    { text: "Find an example slow trace to localize WHICH service/span ate the time, then pivot to that service's logs filtered by the same trace ID for the WHY" },
    { text: "Restart the service" },
    { text: "Raise log verbosity everywhere and grep" }
  ]}
  correct={1}
  explanation="Metrics say something's wrong; a trace localizes where across services; logs (filtered by the shared correlation ID) explain why. One ID flowing through all three turns a vague spike into a specific failing call in minutes."
  revisit={{ to: "/docs/operations/ops-observability#the-three-pillars", label: "Three pillars + correlation ID" }}
/>

<Question
  prompt="Why must metric labels be low-cardinality?"
  options={[
    { text: "High-cardinality labels are a security risk" },
    { text: "Metrics store one time series per unique label combination, so unbounded labels (user_id, raw URLs) cause a cardinality explosion that melts the backend and bill — that detail belongs in logs/traces" },
    { text: "Labels can't be strings" },
    { text: "Alerting requires low cardinality" }
  ]}
  correct={1}
  explanation="Each unique label combination is a stored time series; unbounded values create millions of them. Keep metric labels bounded (status, route template, region); put high-cardinality detail in logs and traces."
  revisit={{ to: "/docs/operations/ops-observability#the-cardinality-trap-the-thing-that-blows-up-your-bill", label: "Cardinality trap" }}
/>

<Question
  prompt="A non-critical recommendations widget with no timeout takes down the whole site including checkout. The mechanism?"
  options={[
    { text: "It corrupted the database" },
    { text: "With no timeout, render threads blocked on the slow dependency; under load all threads got stuck, exhausting capacity so even unrelated requests couldn't be served" },
    { text: "It deleted the checkout code" },
    { text: "Users retried and DDoSed the site" }
  ]}
  correct={1}
  explanation="An unbounded wait ties up the resource doing the waiting; under load every thread/connection ends up stuck on the slow call, so the whole service runs out of capacity. Timeouts, circuit breakers, and bulkheads each prevent this cascade."
  revisit={{ to: "/docs/operations/reliability-patterns#timeouts-the-most-important-one-liner-in-production", label: "Timeouts & cascades" }}
/>

<Question
  prompt="Why must retries use exponential backoff with jitter, on idempotent operations only?"
  options={[
    { text: "To shorten the code" },
    { text: "Backoff gives the dependency room to recover, jitter prevents synchronized retry waves (thundering herd), and restricting to idempotent ops avoids double side effects — naive immediate retries cause retry storms" },
    { text: "TCP requires it" },
    { text: "It guarantees eventual success" }
  ]}
  correct={1}
  explanation="Immediate, synchronized, unlimited retries hammer a struggling dependency into collapse and can duplicate effects like charges. Backoff + jitter + a cap + idempotency-only make retries help instead of harm."
  revisit={{ to: "/docs/operations/reliability-patterns#retries--necessary-and-dangerous", label: "Safe retries" }}
/>

<Question
  prompt="What does an 'open' circuit breaker do, and why is it good for both caller and dependency?"
  options={[
    { text: "Retries the dependency as fast as possible" },
    { text: "Fails calls immediately and serves a fallback — sparing the caller piled-up doomed waits and giving the failing dependency traffic-free room to recover" },
    { text: "Queues requests until recovery" },
    { text: "Permanently disables the feature" }
  ]}
  correct={1}
  explanation="An open breaker short-circuits to an instant fallback instead of waiting for guaranteed failures, and stops bombarding the down dependency. After a cool-down it goes half-open to probe with one trial call."
  revisit={{ to: "/docs/operations/reliability-patterns#circuit-breakers-stop-knocking-on-a-closed-door", label: "Circuit breaker" }}
/>

<Question
  prompt="Which alert should page a human, per 'symptoms not causes'?"
  options={[
    { text: "CPU exceeded 80% on a node" },
    { text: "Checkout success rate dropped below 99.5% over 5 minutes" },
    { text: "A pod restarted" },
    { text: "Disk reached 70%" }
  ]}
  correct={1}
  explanation="Page on SLO-linked, user-facing symptoms. Checkout success dropping means users are harmed now. CPU/disk/pod-restart are causes that fire in normal operation — keep them as diagnostic dashboards, not pages."
  revisit={{ to: "/docs/operations/on-call-alerting#alert-on-symptoms-not-causes", label: "Symptoms not causes" }}
/>

<Question
  prompt="A team cuts pages from 40/week to 3/week and becomes MORE reliable. Why?"
  options={[
    { text: "Fewer alerts means fewer incidents occur" },
    { text: "Removing noisy non-actionable pages restored trust in the pager, so the few real SLO-linked pages now get acknowledged and handled fast instead of ignored as noise" },
    { text: "The monitoring system was overloaded" },
    { text: "Three is the pager's maximum" }
  ]}
  correct={1}
  explanation="Alert fatigue means real pages get lost in noise. Pruning to only real, actionable, symptom-based alerts makes every page trusted and answered quickly — fewer, better alerts improve reliability."
  revisit={{ to: "/docs/operations/on-call-alerting#humane-on-call", label: "Alert fatigue" }}
/>

<Question
  prompt="A deploy 20 minutes ago correlates with a checkout-error spike. What do responders do FIRST?"
  options={[
    { text: "Confirm the deploy is definitely the cause before acting" },
    { text: "Roll the deploy back immediately to stop user impact, then investigate root cause calmly afterward" },
    { text: "Write the postmortem" },
    { text: "Scale the database" }
  ]}
  correct={1}
  explanation="Mitigation before root cause. If a recent deploy correlates with harm, roll it back now rather than proving causation while users suffer. Fast rollback is the key enabler of this reflex."
  revisit={{ to: "/docs/operations/incident-response#communicating-during-an-incident", label: "Stop the bleeding" }}
/>

<Question
  prompt="Why is a blameless postmortem the only approach that improves reliability?"
  options={[
    { text: "It's faster to write" },
    { text: "Blame drives mistakes underground — people hide errors and avoid risky systems — losing the honest detail needed to fix root causes; blameless analysis targets the system/process that made the error easy" },
    { text: "It avoids legal liability" },
    { text: "It skips the technical analysis" }
  ]}
  correct={1}
  explanation="Blame cultures produce less safety because information goes underground. Blameless postmortems treat 'human error' as a prompt to ask why the system made it easy and why nothing caught it — yielding systemic fixes."
  revisit={{ to: "/docs/operations/incident-response#the-blameless-postmortem", label: "Blamelessness" }}
/>

<Question
  prompt="What is a canary deployment?"
  options={[
    { text: "Deploying to a backup region first" },
    { text: "Routing a small % of real traffic to the new version, comparing its metrics to the stable one, and ramping up only if healthy (auto-rolling-back if not) — catching a bad release at ~1% impact" },
    { text: "Deploying only on weekends" },
    { text: "Warming the new version with no traffic" }
  ]}
  correct={1}
  explanation="A canary gates a gradual rollout on the new version's error rate/latency versus stable. A bad deploy harms ~1% briefly and auto-rolls-back, rather than breaking everyone at once."
  revisit={{ to: "/docs/operations/ops-deploys#progressive-delivery-shrink-the-blast-radius-of-each-change", label: "Canary" }}
/>

<Question
  prompt="You autoscale the stateless app tier but performance still collapses under load. Usual real bottleneck?"
  options={[
    { text: "The load balancer" },
    { text: "The database — stateful data doesn't scale by adding copies, so many app instances overwhelm the one DB (and can exhaust connections); cache and add read replicas first, shard last" },
    { text: "DNS propagation" },
    { text: "The CDN cache" }
  ]}
  correct={1}
  explanation="The stateless tier scales easily, pushing the bottleneck to the database. The lever order is cache → read replicas → vertical scale → shard, plus a connection pooler so the scaled tier doesn't exhaust DB connections."
  revisit={{ to: "/docs/operations/capacity-scaling#autoscaling-and-its-limits", label: "Database bottleneck" }}
/>

<Question
  prompt="What do RTO and RPO specify?"
  options={[
    { text: "Request timeout and requests-per-operation" },
    { text: "RPO = how much data you can afford to lose (sets backup frequency); RTO = how fast you must recover (sets recovery architecture) — per-system business decisions" },
    { text: "Two names for the backup interval" },
    { text: "The SLO and the SLA respectively" }
  ]}
  correct={1}
  explanation="RPO bounds acceptable data loss; RTO bounds acceptable downtime. Tighter targets cost exponentially more (hot standby vs. nightly restore), so set them per system by business value — and test that backups actually restore within RTO."
  revisit={{ to: "/docs/operations/chaos-engineering#disaster-recovery-rto-and-rpo", label: "RTO vs RPO" }}
/>

<Question
  prompt="Why is putting a user ID as a Prometheus metric label dangerous?"
  options={[
    { text: "User IDs are private and can't be stored anywhere" },
    { text: "Prometheus creates one time series per unique combination of label values, and the total is the PRODUCT of each label's distinct values — an unbounded label like user_id multiplies series into the millions/billions, melting the metrics database and the bill" },
    { text: "Labels must be numeric" },
    { text: "It makes queries return wrong values" }
  ]}
  correct={1}
  explanation="Series count multiplies across labels. Low-cardinality dimensions (method, status, route) are fine; an unbounded identifier explodes the product. Keep high-cardinality detail in traces and logs, which are designed for it."
  revisit={{ to: "/docs/operations/ops-observability-engineering#metrics--the-cardinality-trap", label: "Cardinality trap" }}
/>

<Question
  prompt="Why do mature teams use multi-window, multi-burn-rate alerting instead of a single error-rate threshold?"
  options={[
    { text: "To generate more alerts overall" },
    { text: "Requiring a high burn rate over BOTH a short and a long window pages fast on a real budget-threatening outage while staying quiet on brief blips, and a separate slow, low-rate window files a ticket for steady bleeds instead of a 3am page" },
    { text: "Because Prometheus mandates exactly two windows" },
    { text: "It removes the need for SLOs" }
  ]}
  correct={1}
  explanation="Burn rate measures how fast you're consuming the error budget. Confirming a fast burn across a short AND long window reacts quickly without paging on noise; a long low-rate window catches slow bleeds as tickets. This is what keeps on-call calm and trusted."
  revisit={{ to: "/docs/operations/ops-slo-math#burn-rate-alerting-fast-on-outages-quiet-on-noise", label: "Burn-rate alerting" }}
/>

<Question
  prompt="Using Little's Law, if 500 requests/sec each take 50ms, how many are in flight at once — and why does it matter?"
  options={[
    { text: "0.05, and it doesn't affect capacity" },
    { text: "L = λ × W = 500 × 0.05 = 25 concurrent requests, so a connection/thread pool needs ≳25 slots; slow downstream calls (large W) demand surprisingly high concurrency even at modest request rates" },
    { text: "500 — one per request per second regardless of latency" },
    { text: "10,000 — latency multiplies the rate by 1000" }
  ]}
  correct={1}
  explanation="Little's Law (L = λW) gives 500 × 0.05 = 25 in flight, which sizes the pool. The key intuition: concurrency scales with latency, so a slow dependency needs far more pool slots than its request rate alone suggests."
  revisit={{ to: "/docs/operations/ops-slo-math#capacity-littles-law-and-load-tests", label: "Little's Law" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 7: Distributed Systems](/docs/distributed-systems) — the deep theory underneath why multi-machine systems need everything you just learned.
