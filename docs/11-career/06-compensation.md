---
id: career-compensation
title: Compensation Context (US, 2026)
sidebar_position: 7
sidebar_label: 6. Compensation
description: Rough total compensation ranges by level — and what shifts them.
---

# Compensation Context (US, 2026)

> **In one line:** US total comp roughly spans $80K (junior) to $1M+ (VP), with big tech paying 1.5–2x mid-market and specialized roles paying 10–30% over generalists.

:::tip[In plain English]
Comp in tech is wider than almost any other field. The same job title at two companies can pay 2x different. The numbers below are not promises — they're a *map* of the territory so you know if an offer is reasonable. Always verify with levels.fyi or a current friend before you negotiate.
:::

Rough *total compensation* ranges (TC = base salary + bonus + equity, fully loaded for one year):

| Level                     | Total Comp Range       |
|---------------------------|------------------------|
| **Junior / Entry-level**  | $80K–$130K             |
| **Mid-level (3–5 yrs)**   | $130K–$220K            |
| **Senior (5–10 yrs)**     | $200K–$400K            |
| **Staff / Principal**     | $350K–$700K+           |
| **Distinguished / VP**    | $500K–$1M+             |

> **Jargon:** *Staff* and *Principal* are senior **IC** (Individual Contributor) levels — engineers who lead technically without managing people. They're parallel to senior management ranks, not below them.

## What shifts the number

**Big tech (*FAANG* — Facebook/Meta, Apple, Amazon, Netflix, Google — plus peers like Stripe, Databricks, etc.):** Often 1.5–2x the above, especially at senior levels (heavy equity).

**Smaller companies / startups:** Pay less in cash but often more in meaningful equity. The equity is mostly worthless; rarely it pays out enormously.

**Remote vs in-office:** Most remote-friendly companies pay close to in-person rates in 2026. Some location-based adjustment still happens but is less common than in 2021.

**Non-US:** Western Europe pays roughly 50–70% of US comp; UK/Switzerland slightly higher. Australia, Singapore are competitive. Latin America and parts of Asia pay less but cost of living is lower.

**Specialization premium:** ML engineering, AI engineering, security engineering, and senior platform engineering tend to pay 10–30% above generalist roles at similar levels.

:::note[Worked example: reading a junior offer]
You get an offer:
- Base: $120K
- Sign-on: $10K
- Equity: $40K over 4 years (vesting 25%/year)
- Annual bonus target: 10%

**Year 1 total comp:** $120K + $10K sign-on + $10K equity + $12K bonus target = **$152K**.

That's above the junior range, near the mid-level range — strong for a first job. If this came from a 200-person startup, the equity number is mostly a lottery ticket. If it came from FAANG, expect the equity to actually be worth roughly that much.

**Always do the math this way before negotiating.** A "$150K offer" can mean very different things.
:::

:::info[Highlight: equity is a number, not a promise]
At pre-IPO startups, equity is worth roughly $0 until a liquidity event. Don't take an offer with weak base + huge "equity upside" unless you can afford to be wrong. At public companies, RSUs are nearly cash — but the *grant date* price is what counts; subsequent stock movement is its own bet. Negotiate in dollars, not percentages.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Anchoring on base salary alone.** A $160K base with no equity at a stagnant company is often worse than a $130K base with $80K/yr RSUs at a growing one. Compare total comp at the 1-year mark, not the offer headline.
- **Believing the four-year vesting graph.** Most engineers don't make it to year 4 at the same company in 2026 — average tenure is closer to 2 years. Value equity assuming you leave at year 2, and any years 3–4 are bonus, not plan.
- **Treating private-company "valuation" math as real money.** A startup telling you "your 0.1% equity is worth $400K at our last round" is quoting a paper number that depends on a liquidity event that may never happen. Discount aggressively, or insist on cash.
- **Chasing the FAANG comp peak too early.** Going to FAANG as a junior to maximize Year-1 TC often locks you into narrow, well-defined work that slows your skill compounding. The engineers who make Staff at FAANG by year 8 usually got broader exposure at scale-ups first.
- **Not benchmarking before each job change.** Comp moves yearly. The number you negotiated three years ago is no longer market rate; checking levels.fyi before your next conversation is a 15-minute task that's worth tens of thousands of dollars.
:::

## Page checkpoint

<Quiz id="career-compensation-page" title="Did compensation stick?" sampleSize={3}>

<Question
  prompt="The page defines Total Compensation (TC). What does it include?"
  options={[
    { text: "Just the base salary" },
    { text: "Base salary plus bonus only" },
    { text: "Base salary + bonus + equity, fully loaded for one year" },
    { text: "Equity value at IPO only" }
  ]}
  correct={2}
  explanation="TC = base + bonus + equity, fully loaded for one year. The worked example shows why this matters: a '$150K offer' can mean very different things depending on the mix of base, sign-on, equity vest, and bonus target."
  revisit={{ to: "/docs/career/career-compensation", label: "TC defined" }}
/>

<Question
  prompt="What does the page recommend you treat early-stage startup equity as, when evaluating an offer?"
  options={[
    { text: "Roughly equivalent to cash at the stated number" },
    { text: "A guaranteed payout you should factor in at face value" },
    { text: "Mostly worthless / a lottery ticket — negotiate in dollars, not percentages, and don't accept weak base for huge 'equity upside' unless you can afford to be wrong" },
    { text: "Worth double the listed value once vested" }
  ]}
  correct={2}
  explanation="The Highlight box puts it bluntly: at pre-IPO startups, equity is worth roughly $0 until a liquidity event. RSUs at public companies are nearly cash, but pre-IPO equity is a lottery ticket. Negotiate in dollars."
  revisit={{ to: "/docs/career/career-compensation#what-shifts-the-number", label: "Equity is a number, not a promise" }}
/>

<Question
  prompt="Roughly how do FAANG-tier companies pay compared to the baseline ranges in the table, especially at senior levels?"
  options={[
    { text: "About the same as everyone else" },
    { text: "Around 50% of the baseline ranges" },
    { text: "Often 1.5–2x the baseline, especially at senior levels — driven by heavy equity grants" },
    { text: "5–10x the baseline at every level" }
  ]}
  correct={2}
  explanation="The page says FAANG and peer companies often pay 1.5–2x the baseline ranges, especially at senior levels, mostly via heavy equity. Smaller companies pay less cash but sometimes more meaningful equity."
  revisit={{ to: "/docs/career/career-compensation#what-shifts-the-number", label: "What shifts the number" }}
/>

<Question
  prompt="Which specializations does the page list as commanding a 10–30% premium over generalist roles at the same level?"
  options={[
    { text: "Generic full-stack and frontend-only roles" },
    { text: "ML engineering, AI engineering, security engineering, and senior platform engineering" },
    { text: "QA and manual testing roles" },
    { text: "Internal IT support" }
  ]}
  correct={1}
  explanation="The page lists ML, AI, security, and senior platform engineering as the specializations that typically pay 10–30% above generalist roles at the same level."
  revisit={{ to: "/docs/career/career-compensation#what-shifts-the-number", label: "Specialization premium" }}
/>

</Quiz>

## What's next

→ Continue to [Continuous Learning](./career-continuous-learning) for how to stay current over a multi-decade career.
