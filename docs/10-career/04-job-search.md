---
id: career-job-search
title: The Job Search
sidebar_position: 5
sidebar_label: 4. Job Search
description: Junior roles, interview prep, and negotiation — what to expect and what actually works.
---

# The Job Search

> **In one line:** Expect a long search, lean on referrals over cold applications, prepare for a 4-stage interview process, and always negotiate.

:::tip[In plain English]
The first job is the hardest you will ever look for. After that, your work history starts doing some of the lifting. Don't take rejection personally — most of it is signal-to-noise filtering, not a verdict on you. Cast a wide net, customize the few applications that matter most, and let referrals carry you through the front door.
:::

## Junior Roles

This is the hardest stage. Expect:

- Hundreds of applications.
- Months of search.
- Many rejections without feedback.
- A handful of interviews per dozen-or-so applications that land.

**What helps:**
- Portfolio over credentials.
- Referrals are powerful — networking pays off here.
- Apply to many places (broader funnel).
- Optimize your resume for *ATS* (Applicant Tracking System — software that filters resumes before a human ever looks; tuned via clear keywords).
- Practice interview questions (LeetCode, but also system design basics).
- Apply to less-competitive companies first to build interview experience.

**Don't underestimate:**
- Smaller / less-prestigious companies. They often offer better learning.
- Internships during school — convert to full-time.
- Contract or freelance work to build resume.
- Apprenticeship programs.

## Interview Preparation

A typical web dev interview process:

1. **Recruiter screen** (30 min) — Behavioral, basic technical filtering.
2. **Technical screen** (60 min) — Live coding, often a moderate algorithm.
3. **Take-home project** (varies) — Build a small app in 4–24 hours.
4. **On-site / virtual on-site** (4–6 hours) — Multiple rounds:
   - Coding (1–2 rounds).
   - System design (1 round).
   - Behavioral (1 round).
   - Team fit / hiring manager (1 round).

**Preparation:**
- **Coding:** LeetCode medium problems. Aim for solving common patterns (two pointers, sliding window, *BFS/DFS* — Breadth/Depth-First Search graph traversal, hash maps, basic *DP* — Dynamic Programming).
- **System design:** "Hello Interview," "ByteByteGo," Alex Xu's books.
- **Behavioral:** *STAR* format — **S**ituation, **T**ask, **A**ction, **R**esult — the standard structure for narrative interview answers. Have 5–10 stories ready.
- **Frontend-specific:** Build something live. Be able to explain your past work clearly.

## Negotiating

When you get an offer:
- Always negotiate. Companies expect it.
- Know your market rate (*levels.fyi* — community-maintained site that crowdsources real comp data by company and level — is the standard reference for big tech).
- Negotiate base salary, equity, sign-on bonus, start date.
- Have a competing offer if possible (for leverage).
- Be polite but firm.
- Get everything in writing before accepting.

:::note[Worked example: a STAR-format behavioral answer]
**Question:** "Tell me about a time you disagreed with a teammate."

**Bad answer:** "Once a teammate wanted to use Redux and I thought it was overkill, so we argued for a bit and then I let them have it."

**STAR answer:**
- **Situation:** On my open-source project, a contributor wanted to add Redux for state I felt was local to one component.
- **Task:** I needed to either accept the change or articulate why a smaller approach was better — without dismissing their expertise.
- **Action:** I wrote a one-page comment in the PR comparing the two approaches with real code snippets, and asked them to walk me through cases where local state would break down.
- **Result:** They agreed local state was sufficient for now; we documented when we'd revisit. The PR merged cleanly and they later added Redux to a feature where it actually helped.

Have 5–10 of these ready before any on-site.
:::

:::info[Highlight: referrals are the single biggest lever]
A referral converts to an interview at roughly 5–10x the rate of a cold application at most companies. Spend the time you'd spend on application #200 instead on building one real relationship with someone at a company you'd love to join.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Letting AI write every cover letter.** Recruiters in 2026 read fifty AI-generated paragraphs a day and the tells are obvious — generic phrasing, hallucinated company facts, no specific project linked. Use AI to draft, then rewrite in your own voice with one concrete detail about *this* team.
- **Treating LeetCode as the whole job search.** A junior who can solve mediums but can't describe a project they shipped will still lose to one who shipped a real thing and grinded fewer problems. Practice algorithms in parallel with shipping, not instead of it.
- **Ghosting after rejection.** A polite "thanks, would love to stay in touch" reply to a rejection email is the cheapest network move in tech. Recruiters often re-surface roles 6 months later; the ones they remember get the email first.
- **Negotiating like the offer is fragile.** Companies that rescind for polite, professional negotiation were going to be a bad place to work anyway. The risk you imagine is much bigger than the risk that exists.
- **Refusing roles below your "target level."** A junior offer at a smaller company that lets you ship real work beats waiting six months for a "perfect" first job. The second job is much easier than the first.
:::

## Page checkpoint

<Quiz id="career-job-search-page" title="Did the job search stick?" sampleSize={2}>

<Question
  prompt="The page calls one thing 'the single biggest lever' in a junior job search. What is it?"
  options={[
    { text: "Sending application #200 to a cold job board" },
    { text: "Adding more certificates to your resume" },
    { text: "Referrals — they convert to interviews at roughly 5–10x the rate of cold applications" },
    { text: "Posting your resume on LinkedIn and waiting" }
  ]}
  correct={2}
  explanation="The Highlight box says it directly: a referral converts at 5–10x the rate of a cold application. Building one real relationship at a company you'd love to join beats blasting application #200."
  revisit={{ to: "/docs/career/career-job-search#junior-roles", label: "Referrals as a lever" }}
/>

<Question
  prompt="In the STAR behavioral interview format, what do the four letters stand for?"
  options={[
    { text: "Story, Topic, Argument, Resolution" },
    { text: "Situation, Task, Action, Result" },
    { text: "Skills, Tools, Achievements, References" },
    { text: "Setup, Theme, Anchor, Reveal" }
  ]}
  correct={1}
  explanation="STAR = Situation, Task, Action, Result. It's the standard narrative structure for behavioral answers. The page recommends having 5–10 stories prepared before any on-site."
  revisit={{ to: "/docs/career/career-job-search#interview-preparation", label: "STAR format" }}
/>

<Question
  prompt="What advice does the page give about negotiating an offer?"
  options={[
    { text: "Never negotiate — companies will rescind the offer" },
    { text: "Only negotiate base salary; equity and sign-on are fixed" },
    { text: "Always negotiate; companies expect it. Know your market rate (levels.fyi), and negotiate base, equity, sign-on, and start date" },
    { text: "Negotiate only if you have 5+ years of experience" }
  ]}
  correct={2}
  explanation="The page is explicit: 'Always negotiate. Companies expect it.' Use levels.fyi for market rate, negotiate all the levers (base, equity, sign-on, start date), bring a competing offer if you can, and get everything in writing."
  revisit={{ to: "/docs/career/career-job-search#negotiating", label: "Negotiating" }}
/>

<Question
  prompt="What does ATS optimization mean in the context of resume prep?"
  options={[
    { text: "Adding decorative graphics to your resume" },
    { text: "Tuning your resume with clear keywords so the Applicant Tracking System filter passes it to a human reviewer" },
    { text: "Submitting your resume in a proprietary file format" },
    { text: "Translating your resume into multiple languages" }
  ]}
  correct={1}
  explanation="ATS = Applicant Tracking System — software that filters resumes before a human sees them. The page tells you to optimize for it with clear keywords matched to the job description."
  revisit={{ to: "/docs/career/career-job-search#junior-roles", label: "Resume and ATS" }}
/>

</Quiz>

## What's next

→ Continue to [Specialization Tracks](./career-specialization) for what comes after your first 2–3 years on the job.
