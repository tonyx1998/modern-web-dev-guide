---
id: ai-agents
title: 'Pattern 4: Agentic Workflows'
sidebar_position: 5
sidebar_label: 4. Agents
description: The LLM plans a sequence of steps, executes them, and adjusts based on results. Multi-step reasoning over tools.
---

# Pattern 4: Agentic Workflows

> **In one line:** An agent is an LLM that picks a tool, observes the result, picks the next tool, and keeps going until it decides the task is done — multi-step reasoning over a sandbox of capabilities.

:::tip In plain English
Function calling lets the model call *one* tool. An agent lets it loop: call a tool, see the output, decide whether to call another, and so on. This is what powers Claude Code, Cursor, customer-support agents, and research assistants. The cost: many LLM calls per task, longer latency, and a much higher need for careful guardrails because the agent is autonomously taking actions.
:::

The LLM plans a sequence of steps, executes them, and adjusts based on results. "Agents."

## Simple agent loop

```
1. LLM receives task + available tools
2. LLM decides next action (call a tool, or finish)
3. Tool is executed; result returned
4. LLM sees the result, decides next action
5. Repeat until LLM signals completion
```

## Example use cases

- **Coding agents.** Read code, edit files, run tests, iterate (Claude Code, Cursor compose, Devin).
- **Research agents.** Search the web, read pages, synthesize findings.
- **Customer support agents.** Look up account, check policy, take action, draft response.
- **Sales/CRM agents.** Update records based on email content.
- **Operations agents.** Diagnose incidents, run runbooks.

## Implementation tools

- **Vercel AI SDK** with tool calling — sufficient for simple agents.
- **LangChain.js** — More elaborate agent patterns.
- **LangGraph** — State-machine-based agent orchestration.
- **Inngest / Trigger.dev** — Durable execution (agents that survive crashes).
- **Temporal** — Heavy-duty workflow orchestration.

## Agent challenges

**Cost.** Agents make many LLM calls. A complex task might cost $5–50.

**Latency.** A 10-step agent can take 1–5 minutes. Users need to see progress.

**Reliability.** Each step has failure modes. Errors compound.

**Safety.** Agents that take real actions (send emails, modify databases) need careful sandboxing.

**Debugging.** When an agent fails, you need traces of every step and decision.

## When agents make sense

- The task is genuinely multi-step.
- Each step requires reasoning about prior results.
- Manual completion is expensive enough to justify agent cost.

When they don't:

- Single-step tasks (just call the LLM once).
- Tasks with deterministic answers (use a script).
- Latency-critical user interactions.

In 2026, agentic workflows are increasingly viable but still require careful engineering. The best are heavily scaffolded — strict tool definitions, validation at every step, clear success criteria, monitoring.

:::note Worked example: a research agent in action
A user asks a research agent: "What's the current sentiment about our latest product launch on social media?"

The agent's actual trace:

1. **Tool call:** `searchTwitter({ query: "Acme Launch 2026" })` → 50 tweets.
2. **Tool call:** `searchReddit({ query: "Acme Launch 2026" })` → 12 posts.
3. **Tool call:** `searchHackerNews({ query: "Acme Launch 2026" })` → 3 threads.
4. **Reasoning step:** Group by source, summarize tone.
5. **Tool call:** `classifySentiment(...)` on a sample.
6. **Final answer:** "Mostly positive (~70%), with criticism focused on the pricing of the Pro tier."

Total: 6 LLM calls, ~$0.15 in API costs, ~45 seconds of wall-clock time. A human doing the same task: ~45 minutes. Costs justify themselves at any scale — but you needed to *measure* both sides to know that.
:::

:::info Highlight: every agent needs a kill switch
Agents that take real-world actions (sending emails, modifying databases, spending money) can compound errors quickly. A bug that causes the agent to retry the same action 50 times can produce 50 duplicate charges, 50 wrong emails, or 50 corrupted records.

Non-negotiable guardrails:

- **Hard limit on tool-call count** per task (e.g., 25).
- **Spending limit** per task (cancel if it exceeds budget).
- **Human approval** for high-impact actions (sending external emails, payments, deletions).
- **Full audit trace** of every step for debugging.
- **Easy kill switch** to stop the agent mid-run.

Without these, an agent that worked in dev can cost real money in production.
:::

## What's next

→ Continue to [Pattern 5: Embeddings for Semantic Search](./ai-embeddings) — embeddings power more than just RAG.
