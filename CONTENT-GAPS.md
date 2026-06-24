# Content Gaps & Currency Audit (mid-2026)

A short living doc tracking the durable gaps a research audit found in the guide, and what
was changed to close them. Principle throughout: **teach durable concepts deeply; stamp
fast-moving tooling with an "as of mid-2026" date; don't chase hype.**

Branch: `feat/guide-zero-to-expert`. The guide does not use guide-kit — it uses its own
MDX components (`Quiz`/`Question`, `CodeChallenge`, `Sandbox`) and the conventions in
`GUIDE-STANDARD.md`.

---

## The durable-vs-dated split (how to read every change below)

- **Durable** (taught deeply, no date stamp): streaming UX, SSE, the cascade, the agent
  loop, the review-the-diff skill, optimistic local writes + server reconciliation,
  on-device-vs-server tradeoffs. These don't rot.
- **Dated** (stamped "as of mid-2026", isolated so it's cheap to refresh): version numbers
  (Next.js 16, Vite 7, AI SDK 5/6), specific tool names (Convex, anchor-positioning Baseline
  date, transformers.js), and "which library won." When these move, only the stamped lines
  change.

---

## Gaps found & status

| # | Gap | Files | Status |
|---|-----|-------|--------|
| 1 | AI SDK v3/v4 API in code (broken against current libs) | `docs/10-ai/01-streaming-chat.md`, `docs/04-stack/14-ai-infrastructure.md` | ✅ Done |
| 2 | Stale versions (Next 15, Vite 6, no Compiler GA, no TanStack Start) | `docs/04-stack/02-frontend-frameworks.md`, `04-build-tools.md`, `02b-*` | ✅ Done |
| 3 | Modern-CSS-now-Baseline missing (`:has`, View Transitions, anchor, oklch…) | `docs/04-stack/03b-styling-advanced.md` | ✅ Done |
| 4 | No on-device AI lesson (WebGPU + transformers.js) | NEW `docs/10-ai/06c-on-device-ai.md` | ✅ Done |
| 5 | MCP under-covered; no "working with coding agents" lesson | `docs/10-ai/04-agentic-workflows.md`, NEW `docs/03-lifecycle/05b-working-with-coding-agents.md` | ✅ Done |
| 6 | Local-first/sync-engine pattern thin (only CRDTs) | `docs/01-foundations/45-crdts.md` (new section) | ✅ Done |

---

## What changed, by item

### 1. AI SDK v3/v4 → AI SDK 5 (+ v6 frontier)  — *broken code fix, highest priority*

The two pages used the **v3/v4 API** that no longer exists in current installs:
- client `useChat()` destructured `{ input, handleInputChange, handleSubmit }`
- server `result.toDataStreamResponse()`

Updated to **AI SDK 5** (the breaking release: typed `UIMessage`/`ModelMessage`,
transport-based `useChat` that *no longer manages input* — you own a `useState` and call
`sendMessage({ text })`, render `message.parts`; server uses
`convertToModelMessages()` + `result.toUIMessageStreamResponse()`, SSE-first). Added a dated
note that **AI SDK 6** (Dec 2025) makes `Agent` (the `ToolLoopAgent`) a first-class
abstraction and ships a stable `@ai-sdk/mcp` package — the frontier. The durable lesson
(streaming-is-a-UX-trick, TTFT, SSE-over-WebSockets) was untouched.

While here, swept the **other** pages that still showed v4 code so the guide stays internally
consistent: `docs/10-ai/10-complete-example.md` (RAG bot — `.content` → `.parts`,
`convertToModelMessages`, `toUIMessageStreamResponse`), `docs/10-ai/12-stack-summary.md`,
`docs/04-stack/20-checkpoint.md`, and `docs/02-roadmap/.../03-tier-2.md`. The only remaining
`toDataStreamResponse`/`handleSubmit` mentions are the deliberate "this is the old v4 name,
translate it" callouts in the streaming-chat lesson.

### 2. Version currency

- **Next.js 15 → 16**: App Router default; **Turbopack now the default bundler for dev AND
  prod build**; the experimental PPR flag was **removed** in favor of **Cache Components**
  (`"use cache"` directive; dynamic-by-default at request time).
- **Vite 6 → 7** (Rolldown opt-in via `rolldown-vite`; **Vite 8** beta makes Rolldown the
  default — frontier).
- **React Compiler 1.0 GA** (Oct 2025) — still opt-in, Babel/plugin based.
- **React 19.2** named.
- Added a **TanStack Start** row (v1.0, Mar 2026) as the type-safe Next alternative (built on
  TanStack Router + Vite + Nitro; compile-time-checked routes; SPA-with-SSR mental model).
- All version numbers live in clearly "as of mid-2026" framing so the evergreen prose around
  them survives the next bump.

### 3. Deepen modern CSS

New **"Modern CSS that's now Baseline"** section in `03b-styling-advanced.md`:
- **Durable / safe today**: `:has()` (the parent selector), native nesting, **same-document
  View Transitions** (Baseline Oct 2025, Firefox 144), **anchor positioning** (Interop 2026 /
  Baseline early 2026 — replaces most Floating UI usage), `oklch()` + `color-mix()`,
  `@property`, subgrid.
- **Progressive enhancement (Firefox gaps), label them**: **cross-document** View
  Transitions (MPA) and **scroll-driven animations** (behind a flag in Firefox) — use as
  enhancement, never as the only path.

### 4. New lesson: On-device AI (Ch. 8)

`docs/10-ai/06c-on-device-ai.md` — **WebGPU** (Baseline across Chrome/Safari/Firefox, early
2026) + **transformers.js** for in-browser inference. Durable framing: privacy (data never
leaves the device), offline, **zero cost-per-call**, and **when NOT to** (model download
weight, low-end device reach, cold-start). Chrome's built-in Prompt API / `window.ai` is a
**dated one-liner only** (Chromium origin trial — not a lesson). Placed after multimodal,
before observability.

### 5. MCP + AI-native workflow

- **MCP section** added to `docs/10-ai/04-agentic-workflows.md`: the open standard (Anthropic,
  Nov 2024; adopted by OpenAI/Google/Microsoft by 2026) for giving models tools/resources/
  prompts; tools vs resources vs prompts; stable in AI SDK 6's `@ai-sdk/mcp`; transport moved
  from SSE to Streamable HTTP.
- **New lesson: "Working with coding agents"** — `docs/03-lifecycle/05b-working-with-coding-agents.md`.
  Principle-led so it doesn't rot: spec/plan-first prompting, parallel/background agents, the
  **review-the-diff loop as the core durable skill**, rules files (`.cursor/rules/*.mdc`,
  `CLAUDE.md`, `AGENTS.md`), PR-review-by-agent. Placed in Lifecycle after Implementation.

### 6. Deepen local-first / sync

New **"The local-first / sync-engine pattern"** section in `45-crdts.md`, generalizing past
CRDTs/collab-editing to the broader pattern: **optimistic local reads/writes → offline-first
→ background server reconciliation (0ms perceived latency)**. Demos one stable hosted option
(**Convex** / **InstantDB**), names **Zero / ElectricSQL / PowerSync** as the frontier and
explicitly labels the tool layer as **pre-consolidation** (shapes still settling).

---

## Explicitly skipped (per audit guidance — not worth expanding mid-2026)

- Qwik / resumability (fading; left as the one-line mention it already had).
- Solid 2.0 (hasn't shipped).
- A full `window.ai` / Chrome built-in-AI lesson (origin-trial, dated — one-liner only).

## Deferred / not done

- (none — all six items completed; see build result in the handoff.)
</content>
</invoke>
