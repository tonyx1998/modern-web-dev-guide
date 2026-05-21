---
id: overriding
title: When to Override These Frameworks
sidebar_position: 17
sidebar_label: 16. Overriding
description: Frameworks are heuristics, not laws. The skill develops with experience — default to the frameworks early, learn when to deviate.
---

# When to Override These Frameworks

> **In one line:** Frameworks are heuristics, not laws — early in your career, default to them; as you gain context, learn when "usually right" doesn't apply.

:::tip In plain English
Everything in this chapter is a *default*, not a rule. Real situations have edge cases, urgent constraints, and team dynamics that the frameworks don't capture. The skill of senior engineering is knowing when to follow the framework and when to deviate — and being able to explain *why* you deviated, in words your team accepts.
:::

Frameworks are heuristics, not laws. Sometimes:

- **Use a non-boring technology** because it fits your problem uniquely well.
- **Spend weeks on a reversible decision** because the team strongly disagrees and alignment matters.
- **Build instead of buy** because the build is genuinely cheaper than the long-term license fee.
- **Skip the framework entirely** because the situation is urgent.

The frameworks tell you what's usually right. Judgment tells you when "usually" doesn't apply.

The skill develops with experience. Early in your career, default to the frameworks. As you gain context, learn when to deviate.

:::note Worked example: a legitimate framework override
A team chooses Rust for a new payments service, even though TypeScript would have been the "boring" choice. Why?

- The service handles money — correctness genuinely matters more than ship speed.
- The two engineers building it both have prior Rust experience.
- Performance characteristics matter (high transaction volume).
- The blast radius of a bug is large enough to justify the extra rigor.

This is a *justified* override: a real reason, articulated in writing, with stakeholder buy-in. Compare to "we want to use Rust because it would be fun" — same final choice, completely different decision quality.

The framework's value isn't in the answer; it's in forcing you to *defend* the override out loud.
:::

:::info Highlight: the meta-skill — know when to refuse complexity
Most failed projects fail because they took on too much, not too little. The single biggest predictor of engineering success isn't intelligence or hours worked — it's *restraint*. Building the smallest thing that could possibly work, then letting real usage drive what comes next, beats elaborate up-front planning almost every time.

Key frameworks to remember from this chapter:

- **Boring technology** for everything that isn't your differentiator.
- **Reversibility** as a guide to how much to deliberate.
- **Team size heuristics** to apply right-sized practices.
- **Build vs buy** weighted heavily toward buying.
- **Cost of inaction** to justify refactors and migrations.
- **Two-pizza teams** for ownership clarity.

Decision-making is the hidden craft of senior engineering. Anyone can write code; the multiplier is making good decisions about what to build and how.
:::

## What's next

→ Continue to [Chapter 9: AI Integration](/docs/ai) — the new layer in modern web applications, from streaming chat to RAG to agents.
