---
id: styling-advanced
title: Advanced CSS & Styling
sidebar_position: 6
sidebar_label: Advanced CSS
description: Beyond utility classes — the cascade and specificity, stacking contexts, modern layout (fl/grid/container queries), design tokens and theming, and why most "CSS is broken" moments are really a misunderstanding of the cascade.
---

# Advanced CSS & Styling

> **In one line:** Most "CSS won't do what I want" frustration is really a gap in three mental models — the cascade (which rule wins), the box/stacking model (why `z-index` "doesn't work"), and layout (flex vs grid vs container queries); master those and CSS stops being guesswork.

:::note[Level: advanced — read after you've styled real UIs]
You've used Tailwind or written component styles and hit the moments where CSS feels arbitrary. This page is the model underneath that makes it predictable. Beginners can skip it; it pays off once you're building a design system or debugging a layout that "should work."
:::

← New here? Start with the on-ramp: [Styling](/docs/stack/styling).

:::tip[In plain English]
CSS feels random until you internalize that it's a system of *resolution rules*. When two rules target the same element, one wins — by specificity, then source order, with `!important` and inline styles as overrides. When something appears behind something it shouldn't, that's a *stacking context*, not a bug. When a layout collapses, it's the box model or a flex/grid property doing exactly what it was told. None of it is magic; it's a small set of rules applied consistently. Learn the rules and you stop fighting CSS.
:::

:::info[Jargon for this chapter]
- **Cascade** — the algorithm that picks which competing rule applies (origin, specificity, order).
- **Specificity** — a score (inline > id > class/attribute > element) deciding which selector wins.
- **Stacking context** — a self-contained layer for `z-index`; children can't escape their parent's layer.
- **Box model** — content + padding + border + margin; `box-sizing: border-box` makes width include padding/border.
- **Container query** — styling based on a *parent's* size rather than the viewport's.
- **Design token** — a named value (color, spacing, radius) stored as a CSS variable, the unit of a theming system.
:::

## The cascade & specificity (the root of most confusion)

When multiple rules match an element, CSS resolves the winner in order: **origin/importance** (`!important`, then inline styles), then **specificity**, then **source order** (later wins on a tie). Specificity is roughly a tuple — *(inline, ids, classes/attrs/pseudo-classes, elements)* — compared left to right:

```css
/* specificity (0,0,1,0) — one class */     .btn { color: blue; }
/* specificity (0,1,0,0) — one id, WINS */   #save { color: red; }
/* (0,0,2,0) beats (0,0,1,1) */              .card .btn { }   >   div .btn { }
```

The practical rules: **keep specificity low and flat** (this is *why* utility-class and single-class-per-component approaches scale — every rule is `(0,0,1,0)`, so source order decides and overrides are predictable). Reserve `!important` for genuine utilities; an `!important` arms race is a sign the architecture broke. Modern `@layer` lets you order whole groups of styles explicitly, defusing specificity wars.

## Stacking contexts: why `z-index: 9999` "doesn't work"

`z-index` only compares elements *within the same stacking context*. A child can never appear above an element outside its parent's context, no matter how high its `z-index`. Many properties create a new stacking context — `position` + `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, and others. So the classic "my modal is behind the header even at `z-index: 9999`" is almost always: the modal is trapped inside a parent that created its own low-stacked context. The fix is structural (portal the modal to the body, or fix the offending ancestor), not a bigger number.

## Modern layout

| Tool | Use for |
|---|---|
| **Flexbox** | One-dimensional layout — a row or a column; distributing space along one axis |
| **Grid** | Two-dimensional layout — rows *and* columns together; page and card layouts |
| **Container queries** | Components that adapt to *their container's* width, not the viewport — true reusable responsive components |
| **`min()`/`max()`/`clamp()`** | Fluid sizing without breakpoints: `clamp(1rem, 2.5vw, 2rem)` |
| **Logical properties** | `margin-inline`, `padding-block` — direction-agnostic, so RTL/i18n works for free |

The shift that matters: **container queries** finally make components responsive to where they're *placed* rather than the global viewport, which is the right model for a design system. And `clamp()` removes whole stacks of media queries for fluid typography and spacing.

:::info[Highlight: design tokens are the expert move for theming at scale]
Hard-coded colors and spacing scattered across components are unthemeable and inconsistent. The professional pattern is **design tokens as CSS custom properties**: define the system once, reference it everywhere, and theming (dark mode, brands) becomes *swapping the variables*, not editing components.

```css
:root { --color-bg: #fff; --color-fg: #111; --space-2: 0.5rem; --radius: 8px; }
[data-theme="dark"] { --color-bg: #0b0f17; --color-fg: #f1f5f9; }
.card { background: var(--color-bg); color: var(--color-fg); border-radius: var(--radius); }
```

Now dark mode is one attribute on `<html>`; a rebrand is a token file. Tailwind's config and shadcn/ui both lean on exactly this — tokens are the layer that lets a design stay consistent across hundreds of components and still re-theme in one place. Cascading custom properties also *inherit*, so a token set on a subtree re-themes just that branch.
:::

## Modern CSS that's now Baseline

A wave of CSS features crossed into "safe to use" between 2024 and early 2026. The word that matters here is **Baseline** — a cross-browser status meaning *all the major engines (Chromium, Safari/WebKit, Firefox/Gecko) ship it*. "Baseline newly available" means it just reached every browser; "Baseline widely available" means it's been there long enough (~2.5 years) to use without a second thought. The practical upshot: a lot of things that used to need a JavaScript library or a pile of `@media` queries are now plain CSS.

:::note[Version stamp — as of mid-2026]
The *features* below are durable CSS; the **dates** are the dated part. Treat anything stamped "Baseline" as safe to ship today, and anything labelled "progressive enhancement" as a nice-to-have with a Firefox gap — code a fallback path, don't make it the only path.
:::

> **Jargon:** **Baseline** — a browser-support label (from the Web Platform / MDN) saying a feature works across all major engines. **Progressive enhancement** — building so the page *works* without a feature, then *improves* where the feature exists; the opposite of requiring it.

### Durable & safe to use today

- **`:has()` — the "parent selector" we waited 20 years for.** Style an element based on what it *contains* or what follows it: `.card:has(img) { … }` styles only cards that contain an image; `label:has(+ input:required)::after { content: " *"; }` flags required fields — no JavaScript, no extra classes. Baseline widely available. This single selector deletes a huge category of "I need JS just to toggle a class on the parent" code.
- **Native CSS nesting.** Write nested rules the way Sass let you, but in plain CSS — no preprocessor:
  ```css
  .card {
    padding: 1rem;
    & .title { font-weight: 600; }
    &:hover { background: var(--hover); }
  }
  ```
  Baseline. (Mind one gotcha: a bare nested element selector like `span` must be written `& span` or the parser can misread it.)
- **View Transitions (same-document).** Animate *between two UI states* — a list re-sorting, a panel opening, navigating within a single-page app — by letting the browser tween the before/after snapshots for you, instead of hand-writing FLIP animations in JS:
  ```js
  // wrap the DOM update; the browser crossfades old → new
  document.startViewTransition(() => updateTheDOM());
  ```
  ```css
  /* opt specific elements into a shared, named transition */
  .hero { view-transition-name: hero; }
  ```
  Same-document View Transitions reached **Baseline in October 2025** (Firefox 144 was the last engine in). Durable and safe.
- **Anchor positioning — the Floating-UI killer.** Tether one element to another (tooltip to its trigger, menu to its button) declaratively, *including* an automatic fallback position so it never overflows the screen — all in CSS, no positioning library and no JS measurement loop:
  ```css
  .trigger { anchor-name: --btn; }
  .tooltip {
    position: absolute;
    position-anchor: --btn;
    top: anchor(bottom);        /* sit under the trigger */
    position-try-fallbacks: flip-block;  /* flip above if it'd overflow */
  }
  ```
  Reaching Baseline in **early 2026** (a headline item of the Interop 2026 effort). This replaces the most common reason teams reach for Floating UI / Popper.
- **`oklch()` and `color-mix()` — perceptual color.** `oklch(0.7 0.15 250)` describes color as *lightness, chroma, hue* the way human vision works, so lightening/darkening and generating palettes stays perceptually even (unlike HSL, which gets muddy). `color-mix(in oklch, var(--brand) 80%, white)` blends two colors for hover/tint states without hard-coding a second value. Baseline. Tokens + `oklch` is the modern way to generate a whole tint/shade scale from one brand color.
- **`@property` — typed custom properties.** Registering a custom property gives it a type, so it can be *animated*:
  ```css
  @property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
  .spinner { transition: --angle 0.3s; }   /* now the gradient angle can tween */
  ```
  Baseline. Unlocks animated gradients and other effects that plain custom properties can't do.
- **Subgrid.** Lets a nested grid line its tracks up with its parent's grid — so, for example, a row of cards with differing content all share the same internal baselines. Baseline.

### Progressive enhancement (Firefox gaps — code a fallback)

- **Cross-document View Transitions (MPA).** The same crossfade/morph, but *between separate page loads* in a multi-page app — enabled with a single `@view-transition { navigation: auto; }`. As of mid-2026 this ships in Chromium-family browsers but Safari and Firefox are still catching up, so the navigation must look fine *without* the transition. Pure enhancement: the page works; it just animates where supported.
- **Scroll-driven animations.** Drive an animation's progress from *scroll position* instead of time (`animation-timeline: scroll()` / `view()`) — reading-progress bars, parallax, reveal-on-scroll, entirely in CSS with no scroll listeners. Shipped in Chromium and (behind a flag) Firefox as of mid-2026. Because it degrades cleanly — without support the element simply sits in its final state — it's a textbook progressive enhancement, *not* something to gate core layout on.

:::info[Highlight: the trade you should actually make]
The durable lesson isn't the feature list — it's the *shift*. A growing share of UI behavior that used to demand JavaScript (parent-aware styling, tooltips/popovers positioning, page-transition animations, theme color math) is now **declarative CSS the browser optimizes for you**. Less JS means less bundle, fewer re-render bugs, and better accessibility defaults. Reach for the CSS feature first; pull in a library only when you hit a real gap (a not-yet-Baseline feature you can't degrade, or a genuinely dynamic case).
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Fighting specificity with `!important`.** It escalates into an arms race. Keep selectors flat/low-specificity (single classes), and use `@layer` to order groups deliberately.
- **Bumping `z-index` to escape a stacking context.** It can't work across contexts. Find the ancestor that created the context (opacity/transform/position) or portal the element out.
- **Reaching for media queries when `clamp()`/container queries fit.** Fluid sizing and container-relative components remove whole breakpoint stacks and make components truly reusable.
- **Hard-coding colors/spacing per component.** Unthemeable and drift-prone. Use design tokens (CSS variables); theme by swapping variables.
- **Forgetting `box-sizing: border-box`.** Without it, padding/border add to width and layouts overflow unexpectedly. It's the sane default (and most resets set it).
- **Ignoring logical properties for i18n.** `margin-left` breaks RTL; `margin-inline-start` adapts automatically.
- **Pulling in a positioning library out of habit.** Tooltips and popovers used to need Floating UI / Popper; CSS **anchor positioning** (with `position-try-fallbacks`) now covers the common cases declaratively. Check whether plain CSS does it before adding a dependency.
- **Making a not-yet-Baseline feature load-bearing.** Cross-document View Transitions and scroll-driven animations have Firefox gaps as of mid-2026 — gate them as *enhancement* (the page must work and read correctly without them), never as the only way content appears or navigates.
- **Reaching for HSL when generating a palette.** HSL lightness isn't perceptually uniform, so tint/shade scales come out muddy. Use `oklch()` (and `color-mix(in oklch, …)`) so steps look evenly spaced to the eye.
:::

## Practice on your own project

:::tip[Do this on a real UI you've styled]
1. Find a `z-index` that "doesn't work" and trace the **stacking context** trapping it (DevTools → Layers).
2. Replace a brittle margin/absolute-positioning hack with a proper Flexbox or Grid layout.
3. Pull repeated colors/spacing into **design tokens** (CSS custom properties), then theme one with a `[data-theme]` switch.
4. Open a confusing style override and explain it purely via the **cascade + specificity** — then fix it without `!important`.
:::

## Page checkpoint

<Quiz id="stack-css-advanced-page" title="Did advanced CSS stick?" sampleSize={2}>

<Question
  prompt="Two rules target the same element. How does CSS decide which wins?"
  options={[
    { text: "Whichever appears first in the file always wins" },
    { text: "Importance/origin first (inline & !important), then specificity, then source order as the tiebreaker" },
    { text: "The rule with the longer selector always wins" },
    { text: "The browser picks randomly" }
  ]}
  correct={1}
  explanation="The cascade resolves conflicts by origin/importance, then specificity (inline > id > class > element), then source order on a tie. Keeping specificity low and flat (single classes) makes source order the decider, which is why utility/component-class approaches stay predictable."
  revisit={{ to: "/docs/stack/styling-advanced#the-cascade--specificity-the-root-of-most-confusion", label: "Cascade & specificity" }}
/>

<Question
  prompt="A modal with `z-index: 9999` still appears behind the header. Why, and what's the real fix?"
  options={[
    { text: "The header's z-index is even higher; raise the modal's further" },
    { text: "The modal is inside a parent that created its own (lower) stacking context, and z-index only compares within a context — fix it structurally (portal it out or fix the ancestor)" },
    { text: "z-index doesn't work on modals; use position: fixed only" },
    { text: "CSS caching; hard-refresh the page" }
  ]}
  correct={1}
  explanation="z-index only orders elements within the same stacking context. A child can't rise above elements outside its parent's context regardless of value. Properties like opacity, transform, and position+z-index create contexts — so the fix is to portal the modal to the body or fix the trapping ancestor, not raise the number."
  revisit={{ to: "/docs/stack/styling-advanced#stacking-contexts-why-z-index-9999-doesnt-work", label: "Stacking contexts" }}
/>

<Question
  prompt="What's the expert pattern for consistent, re-themeable styling across a large app?"
  options={[
    { text: "Hard-code the brand colors in each component for clarity" },
    { text: "Design tokens as CSS custom properties — define the system once, reference everywhere, and theme by swapping the variables" },
    { text: "A separate stylesheet copy per theme" },
    { text: "Inline styles so each component is self-contained" }
  ]}
  correct={1}
  explanation="Tokens (CSS variables for colors, spacing, radius, etc.) centralize the design system. Components reference tokens, so dark mode or a rebrand becomes swapping variables — not editing components. It's the layer Tailwind config and shadcn/ui build on, and custom properties inherit so you can re-theme a subtree."
  revisit={{ to: "/docs/stack/styling-advanced#modern-layout", label: "Design tokens" }}
/>

<Question
  prompt="A teammate wants to add Floating UI to position a tooltip under a button, with a fallback above when it'd overflow. What's the modern CSS-first answer (Baseline early 2026)?"
  options={[
    { text: "There's no CSS equivalent; Floating UI is required" },
    { text: "CSS anchor positioning: anchor-name on the trigger, position-anchor + anchor() on the tooltip, and position-try-fallbacks for the flip — no JS positioning library" },
    { text: "Use z-index: 9999 to force the tooltip on top" },
    { text: "Set the tooltip to position: fixed and hard-code top/left pixels" }
  ]}
  correct={1}
  explanation="Anchor positioning tethers one element to another declaratively, including automatic fallback positions to avoid overflow — covering the most common reason teams reach for Floating UI / Popper. Reaching Baseline in early 2026 as part of Interop 2026."
  revisit={{ to: "/docs/stack/styling-advanced#durable--safe-to-use-today", label: "Anchor positioning" }}
/>

<Question
  prompt="You add scroll-driven animations and cross-document View Transitions to a site. Why should both be treated as progressive enhancement as of mid-2026, while same-document View Transitions and :has() can be used freely?"
  options={[
    { text: "They're slower than JavaScript equivalents" },
    { text: "They have Firefox gaps (scroll-driven is behind a flag; cross-document VT isn't in Safari/Firefox yet), so the page must work without them — whereas :has() and same-document View Transitions reached Baseline across all engines" },
    { text: "They only work on mobile" },
    { text: "They require a build step that Vite doesn't support" }
  ]}
  correct={1}
  explanation="Baseline means all major engines ship it — :has() and same-document View Transitions (Firefox 144, Oct 2025) cleared that bar and are durable. Cross-document VT and scroll-driven animations still have Firefox/Safari gaps, so they're enhancement: code a path that works without them and let supporting browsers improve it."
  revisit={{ to: "/docs/stack/styling-advanced#progressive-enhancement-firefox-gaps--code-a-fallback", label: "Progressive enhancement" }}
/>

</Quiz>

## What's next

→ Continue to [State Management](/docs/stack/state-management) — coordinating the data your styled components display.
