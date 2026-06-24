---
id: pm-discovery
title: Customer Discovery Without the Guesswork
sidebar_position: 3
sidebar_label: Customer discovery
description: How to run user conversations that reveal what people actually need instead of what flatters your idea — asking about past behavior, separating signal from vanity, and turning raw feedback into product decisions.
---

# Customer Discovery Without the Guesswork

> **In one line:** Most "customer research" fails because it asks people to *predict and flatter* ("would you use this?") instead of *recount and reveal* ("walk me through the last time you hit this problem") — discovery done right interrogates **past behavior**, separates real signal from politeness, and converts what you hear into a decision.

:::tip[In plain English]
Engineers often skip talking to users because it feels fuzzy and unscientific — so they guess, build, and hope. But there *is* a discipline here. The core trap: if you describe your idea and ask "is this cool? would you pay?", people are nice, so they say yes — and that yes is worthless. It tells you about their manners, not their behavior. The fix is to stop pitching and instead dig into what they've *actually done*: the last time they faced the problem, what they tried, what it cost them, what they're using now. Past behavior is the only reliable predictor; opinions about a hypothetical future aren't. This is the heart of the well-known *Mom Test* idea — ask questions even your mom couldn't lie to you about, because they're about facts and history, not your baby of an idea.
:::

## Why "would you use this?" is a worthless question

Three reasons hypothetical questions mislead:

- **People are polite.** Asked to judge your idea to your face, they soften. "Yeah, I'd totally use that" costs them nothing and spares your feelings.
- **People are bad predictors.** Even sincerely, humans are poor at forecasting their own future behavior ("I'll definitely go to the gym").
- **You leak the answer you want.** Pitching first primes them to agree. You hear an echo of your own hope.

The signal you want isn't an opinion about the future; it's **evidence from the past**.

## Ask about behavior, not opinions

Swap every hypothetical for a history question:

| Instead of (opinion / future) | Ask (behavior / past) |
|---|---|
| "Would you use a tool that does X?" | "When did you last deal with X? Walk me through it." |
| "Do you think this is useful?" | "What did you do the last time this came up?" |
| "Would you pay $20/mo for this?" | "What are you spending on this today — tools, time, workarounds?" |
| "Is this a big problem for you?" | "How often does this happen, and what does it cost you when it does?" |

Then **shut up and listen.** Open-ended, then silence. The goal is to learn, not to be understood. You're done pitching for the day.

## Separate signal from vanity

Not all positive feedback is equal. Weight what costs the speaker something:

- **Strong signal:** they already built a hacky workaround, already pay for a partial solution, got visibly frustrated recounting the problem, introduced you to a colleague who has it too, or asked "when can I have this?"
- **Vanity / weak:** compliments ("nice idea!"), generic enthusiasm, hypothetical agreement, feature requests with no story behind them.

A useful filter: **commitment and advancement.** Did the conversation produce something real — their time, a referral, access to their data, a pilot — or just nice words? Words are free; commitment is signal.

:::note[Worked example: the same user, two interviews]
You're building a tool to help freelancers chase unpaid invoices. **Bad interview:** "I'm building an app that automatically reminds clients to pay late invoices — would you use that? Would you pay $15 a month?" The freelancer (being kind) says "Oh nice, yeah I'd probably use that." You leave elated and build for three months. Nobody signs up. **Good interview:** "Tell me about the last invoice that went unpaid too long. What happened?" You learn she only has *two* late payers a year, handles them with a templated email she's fine with, and her real bleeding problem is *creating* invoices fast enough between client work. Your premise was wrong, and 20 minutes of past-behavior questions saved three months. The vanity "yes" pointed the wrong way; the story pointed at the actual problem — invoicing, not chasing.
:::

## Turn what you heard into a decision

Discovery isn't done until it changes what you do. After a few conversations:

- **Look for the pattern, not the loudest voice.** One vivid request isn't a mandate; a problem three people independently described (in their own words, from their own history) is.
- **Distinguish a problem worth solving from a feature someone imagined.** Users are great at reporting pain, unreliable at designing solutions. Take the pain; design the fix yourself.
- **Decide explicitly:** pursue, pivot, or drop — and write down the evidence. "Three of five interviewees already pay for a workaround" is a go signal; "everyone said it sounded nice" is not.

## Why it matters

Discovery is the cheapest place to be wrong. A wrong assumption caught in a 20-minute conversation costs 20 minutes; the same assumption caught after launch costs months. For a product-minded engineer it's the single highest-return habit — and it directly feeds the next page's scoping: you can't narrow an ambiguous problem you haven't actually heard a human describe. It's the practical front-end of the guide's [discovery & planning](/docs/lifecycle/discovery-planning) phase.

## Common pitfalls

:::caution[Where engineers go wrong]
- **Pitching instead of asking.** The moment you describe your idea, you've contaminated the answer. Ask about their world first; pitch later, if at all.
- **Asking about the future.** "Would you / will you / do you think" invite polite fiction. Ask "when did you last / what did you do / what do you use now."
- **Mistaking compliments for validation.** "Cool idea" is noise. Look for workarounds already built, money already spent, referrals offered.
- **Leading the witness.** "Don't you find X frustrating?" plants the answer. Stay neutral and let them volunteer the pain.
- **Talking more than listening.** If you spoke more than ~20% of the interview, you ran a pitch, not a discovery.
- **One conversation = a fact.** Patterns across several people are signal; a single anecdote is a hypothesis.
:::

## Page checkpoint

<Quiz id="pm-discovery-page" title="Did discovery stick?" sampleSize={2}>

<Question
  prompt="Why is 'Would you use / pay for this?' a poor discovery question?"
  options={[
    { text: "It's too short" },
    { text: "It asks people to predict and flatter — they're polite, they're bad at forecasting their own behavior, and pitching first primes the answer you want; reliable signal comes from PAST behavior ('when did you last hit this problem?'), not hypothetical future opinions" },
    { text: "It violates privacy law" },
    { text: "It only works in person" }
  ]}
  correct={1}
  explanation="Hypothetical/opinion questions yield polite, unreliable, primed 'yeses.' Behavior-and-history questions ('walk me through the last time…', 'what do you use/pay today?') reveal what people actually do — the only dependable predictor."
  revisit={{ to: "/docs/product-minded/pm-discovery#ask-about-behavior-not-opinions", label: "Behavior over opinions" }}
/>

<Question
  prompt="Which is the STRONGEST signal that a problem is worth solving?"
  options={[
    { text: "Several interviewees said the idea sounded cool" },
    { text: "An interviewee has already built a hacky workaround or pays for a partial solution today, and offers a referral or a pilot — commitment and advancement that cost them something, not free compliments" },
    { text: "One person enthusiastically requested ten features" },
    { text: "Everyone agreed it was a nice-to-have" }
  ]}
  correct={1}
  explanation="Weight feedback by what it costs the speaker. Existing workarounds, real spend, referrals, and pilots are commitment/advancement — strong signal. Compliments and hypothetical agreement are vanity."
  revisit={{ to: "/docs/product-minded/pm-discovery#separate-signal-from-vanity", label: "Signal vs vanity" }}
/>

<Question
  prompt="How should you treat a user's feature request?"
  options={[
    { text: "Build exactly what they asked for immediately" },
    { text: "Take the underlying PAIN as real data but design the solution yourself — users reliably report problems but are unreliable at designing fixes; look for patterns across several people, not the loudest single voice" },
    { text: "Ignore it entirely" },
    { text: "Only build it if they ask twice" }
  ]}
  correct={1}
  explanation="Users are great at surfacing pain, poor at solution design. Extract the problem behind the request, look for it recurring across people, and design the fix with your engineering judgment — then decide explicitly to pursue, pivot, or drop."
  revisit={{ to: "/docs/product-minded/pm-discovery#turn-what-you-heard-into-a-decision", label: "Pain vs feature" }}
/>

</Quiz>

## What's next

→ Next: [Scoping under ambiguity](/docs/product-minded/pm-scoping) — turning the real problem you just uncovered into the smallest thing you can ship to test it.
