---
id: too-big
title: When You're "Too Big" for This Workflow
sidebar_position: 19
sidebar_label: 18. Too Big
description: The scale (Google, Meta, Amazon — 20,000+ engineers) where standard enterprise advice stops applying and companies invent their own paradigms.
---

# When You're "Too Big" for This Workflow

> **In one line:** Some scale-up companies (20,000+ engineers) develop their own paradigms — custom infrastructure, in-house languages, internal tools that duplicate the commercial ecosystem — and this guide stops applying.

:::tip[In plain English]
At a certain scale, even "enterprise best practices" stop being good advice. Google, Meta, and Amazon-tier organizations operate at scales where Kubernetes might be too limiting, where the commercial dependency ecosystem might not be safe enough, and where they routinely invent new tools or even new programming languages to solve their own problems.

If you're at that scale, you have internal docs and traditions that supersede anything in a public guide. This page just acknowledges where the road ends.
:::

## What "too big" looks like

Some scale-up companies (20,000+ engineers) develop their own paradigms that don't quite fit the patterns above. They:

- Build entirely custom infrastructure (not Kubernetes).
- Invent new languages (Hack at Meta, Carbon at Google).
- Have internal-only tools that effectively duplicate the commercial ecosystem.
- Operate at scales (billions of users) where standard advice doesn't apply.

## Why standard advice breaks at this scale

A few reasons the public best-practices stop applying:

- **Standard tools don't scale far enough.** Kubernetes is a fine fit for thousands of services; it gets awkward for hundreds of thousands. So Google built Borg.
- **The dependency ecosystem becomes a risk.** When your business depends on a service, you don't want to be one library exploit away from a global outage. So FAANG-tier companies fork, audit, and maintain their own versions of critical infrastructure.
- **Language ergonomics matter more.** A 10% productivity boost across 30,000 engineers is enormous. So Meta builds Hack on top of PHP; Google builds Carbon as a C++ successor.
- **Their internal best practices outpace the public ones.** When you're solving problems nobody else has, you can't read about the answer — you invent it.

:::info[Highlight: this is not aspirational]
A common mistake when reading about FAANG-tier engineering is treating it as something to copy. It's not. Those practices solve problems that almost no company has, and they cost staggering amounts of engineering investment to develop and maintain.

If you're at 200 engineers and considering "let's build our own programming language like Meta," you're solving the wrong problem. Use the public ecosystem until it actually breaks for you. It almost certainly won't.
:::

## Where this guide stops

This guide doesn't cover that level. If you're at Google, Meta, or Amazon scale, you have internal docs and traditions that supersede generic advice.

What is broadly true at every scale, even theirs:

- HTTP and the basic web primitives still work the way Chapter 1 describes.
- The development lifecycle still has roughly the same phases.
- Reliability still comes from observability and discipline, not heroics.
- Security still comes from defense in depth.

The *implementations* differ wildly; the *principles* don't.

:::note[Worked example: when not to copy FAANG]
A mid-sized SaaS once decided to "do things the Google way" — they adopted Bazel, built their own internal-platform-as-a-service, wrote their own deploy tool, ran their own Kubernetes control plane.

Three years later, they had a brilliant internal platform — and almost no product. The engineering team had spent its budget on tools instead of features. They ultimately retreated to Vercel + AWS + standard Kubernetes and shipped more product in the next year than the previous three combined.

The lesson: the practices that make sense at 30,000 engineers make no sense at 300. Copying them is a great way to slow your own company to a crawl.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Reading FAANG engineering blogs as how-tos instead of war stories.** A Meta post about their custom build system is fascinating context, not a template. Treat those posts as "what someone solved at a scale we don't have," not as "what we should adopt next quarter."
- **Hiring ex-FAANG engineers to "bring Google practices" to a 200-person company.** They built those practices for a 30,000-person org with hundreds of platform engineers behind them. Without that scaffolding, the practices either get rebuilt at huge cost or quietly fail. Hire them for their judgment, not for the bullet points on their resume.
- **Forking a critical open-source project "because FAANG does."** FAANG companies fork because they have whole teams to maintain the fork forever. If you fork at 200 engineers, the fork stops getting upstream security patches and you've just adopted a slow, silent CVE pipeline.
- **Building your own internal language or framework "for productivity."** A 10% boost across 30,000 engineers is enormous; across 300 it's a hobby project pretending to be infrastructure. Use the public ecosystem until it actually breaks for you — and "we wish it had this feature" is not breakage.
- **Treating the universal principles as optional once you copy the tools.** Borg-style schedulers don't excuse skipping observability; in-house languages don't excuse skipping security review. The implementations vary; HTTP, the lifecycle, and defense in depth still apply. Make sure the principles survive whatever you copy.
:::

## Wrapping up the chapter

Enterprise web development is qualitatively different from small-company work. The technical concepts are similar — HTTP, databases, frameworks — but the organizational dimension dominates.

Key takeaways:

- Investment in platforms and process scales with org size.
- Reliability and security are non-negotiable.
- Coordination overhead is real and substantial.
- Documentation, runbooks, and automation matter more than at smaller scale.
- The best enterprise engineering looks like a small company in disguise — small teams shipping fast on top of strong shared infrastructure.

## Page checkpoint

<Quiz id="enterprise-too-big-page" title="Did when-you're-too-big stick?" sampleSize={2}>

<Question
  prompt="Why do FAANG-tier companies (Google, Meta, Amazon) sometimes fork or build their own versions of critical open-source infrastructure?"
  options={[
    { text: "To avoid paying license fees" },
    { text: "Because at their scale, being one library exploit away from a global outage is unacceptable — they audit, fork, and maintain their own versions" },
    { text: "Because they don't trust open-source code in general" },
    { text: "Because their lawyers require it" }
  ]}
  correct={1}
  explanation="When your business depends on a service used by billions, the dependency ecosystem becomes a risk surface. FAANG-tier companies fork and maintain their own versions of critical infrastructure to reduce the chance of a single upstream exploit causing a global outage."
  revisit={{ to: "/docs/enterprise/too-big#why-standard-advice-breaks-at-this-scale", label: "Forking the ecosystem" }}
/>

<Question
  prompt="What is the page's main warning about FAANG-tier engineering practices?"
  options={[
    { text: "They're a great template to copy at any size" },
    { text: "They solve problems almost no company has, and copying them at smaller scale is a great way to slow your own company to a crawl" },
    { text: "They're poorly documented and unreliable" },
    { text: "They're illegal outside the US" }
  ]}
  correct={1}
  explanation="FAANG practices are not aspirational templates. They cost staggering engineering investment and solve problems specific to billion-user scale. The worked example shows a mid-sized SaaS that tried to 'do things the Google way' and ended up with a brilliant platform but almost no product."
  revisit={{ to: "/docs/enterprise/too-big#what-too-big-looks-like", label: "Not aspirational" }}
/>

<Question
  prompt="What does the page say still holds true at every scale, even FAANG?"
  options={[
    { text: "Specific tools like Kubernetes and Bazel" },
    { text: "The underlying principles — HTTP primitives, the development lifecycle phases, reliability from observability and discipline, security from defense in depth" },
    { text: "The same vendors and SaaS providers" },
    { text: "The exact same org structures" }
  ]}
  correct={1}
  explanation="The implementations differ wildly; the principles don't. HTTP, the development lifecycle, reliability through observability and discipline, and security through defense in depth are universal — even when Google replaces Kubernetes with Borg or Meta replaces PHP with Hack."
  revisit={{ to: "/docs/enterprise/too-big#where-this-guide-stops", label: "Universal principles" }}
/>

<Question
  prompt="Why did the mid-sized SaaS in the worked example ultimately retreat from a 'Google-style' internal platform?"
  options={[
    { text: "Google sued them" },
    { text: "They spent three years building tools and almost no product, then shipped more on Vercel + AWS + standard Kubernetes in one year than the previous three combined" },
    { text: "Their engineers quit" },
    { text: "The cloud bill became too high" }
  ]}
  correct={1}
  explanation="The team built a brilliant internal platform and almost no product — spending their engineering budget on tools instead of features. Retreating to standard managed services (Vercel + AWS + vanilla Kubernetes) tripled their product velocity in the following year."
  revisit={{ to: "/docs/enterprise/too-big#worked-example", label: "Don't copy FAANG" }}
/>

</Quiz>

## What's next

→ Continue to [Chapter 8: Side-by-Side Comparison](/docs/comparison), which puts all three workflows (personal, small, large) into one reference for easy lookup.
