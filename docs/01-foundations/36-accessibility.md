---
id: accessibility
title: 'Accessibility (a11y): the discipline'
sidebar_position: 36
sidebar_label: Accessibility
description: How to build interfaces that work for keyboard users, screen reader users, low-vision users, and people on shaky networks or unfamiliar devices. WCAG, ARIA (and when not to use it), focus management, contrast, semantic HTML — and why "do it from the start" is the only realistic strategy.
---

# Accessibility (a11y): the discipline

> **In one line:** Accessibility (a11y) is the practice of building UIs that work for people who don't navigate with a mouse, can't see the screen clearly, can't hear audio, or use any of a dozen assistive technologies — and the techniques that make a site accessible *also* make it more robust for everyone.

:::tip[In plain English]
About 15–20% of people have some kind of permanent or situational disability — low vision, motor impairment, deafness, cognitive difference, or just "trying to use this with one hand on a bus." A site that ignores accessibility excludes them outright, and the workaround patches added later are always worse and more fragile than the right code written from the start. Most accessibility is *not* a separate workstream; it's writing semantic HTML, labeling what's labelable, and managing focus carefully. Done from day one, the cost is near-zero. Done in week 50, it's a refactor.
:::

This page is the working playbook — not the legal compliance document, but the discipline that produces compliant, *and* good, interfaces.

## Why this matters (beyond morality)

- **Real users.** Per WHO, ~16% of the world has some disability. In any user base of a thousand, hundreds.
- **Legal.** ADA / Section 508 (US), AODA (Canada), EAA (EU, 2025), the UK Equality Act — accessibility lawsuits against private websites have surged. Banks, retailers, edtech, govt have all been sued.
- **SEO.** Semantic HTML helps both screen readers and search engines understand your content.
- **Maintainability.** Code with proper labels, semantic elements, and focus management is *easier* to test and refactor.
- **Reach.** Aging populations, situational disability (bright sunlight, broken arm, slow connection), keyboard-only power users.

The whole industry has shifted: a11y is now table-stakes for most B2B and consumer products. It's *also* the right thing.

## The standards

**WCAG (Web Content Accessibility Guidelines)** is the canonical spec. Versions:

| Version | Year | Notes |
|---------|------|-------|
| WCAG 2.0 | 2008 | Long-running baseline |
| WCAG 2.1 | 2018 | Adds mobile/touch, low vision |
| WCAG 2.2 | 2023 | Adds focus appearance, drag alternatives, etc. |
| WCAG 3.0 | future | Major rework, still draft |

Levels: **A** (must), **AA** (should — the practical target), **AAA** (nice-to-have).

The principles ("POUR"):
- **Perceivable** — users can perceive the content (text alternatives, captions, contrast).
- **Operable** — users can operate the UI (keyboard, time limits, no seizure triggers).
- **Understandable** — content and operation are predictable (labels, error messages).
- **Robust** — works with assistive tech now and as it evolves.

If you remember nothing else: **POUR**. Most real failures bucket cleanly under one.

## The "doing it" playbook

### 1. Semantic HTML, always

The single largest accessibility win. Use the element that *means* what you intend:

```html
<!-- ❌ -->
<div class="button" onclick="submit()">Submit</div>

<!-- ✓ -->
<button onclick="submit()">Submit</button>
```

A `<button>` is reachable by keyboard, announces as a button to screen readers, supports Enter/Space, can be focused with `Tab`. A `<div>` does none of that. Then someone adds `tabindex="0"` + `role="button"` + key handlers + focus styles to make the div work, badly. Just use the button.

Real elements with built-in a11y:

| Use | Not |
|-----|-----|
| `<button>` | `<div onclick>` |
| `<a href>` for navigation | `<button onclick="location.href=…">` |
| `<input type="checkbox">` | `<div role="checkbox">` |
| `<input type="radio">` | `<div role="radio">` |
| `<select>` for simple dropdowns | Custom combobox |
| `<details><summary>` | `<div>` with click-to-expand |
| `<dialog>` (modern, supported) | `<div class="modal">` |
| `<form>` with `<label>` | Inputs with no labels |
| `<nav>`, `<main>`, `<header>`, `<aside>` | `<div>` everywhere |
| `<h1>...<h6>` (in order) | Visual styling without structure |

### 2. Labels and names

Every interactive element needs an **accessible name** — what a screen reader announces.

For form inputs, the standard:

```html
<!-- Best — explicit label -->
<label for="email">Email</label>
<input id="email" type="email">

<!-- Acceptable — wrapped label -->
<label>
  Email
  <input type="email">
</label>

<!-- For icon-only buttons -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- For decorative images -->
<img src="hero.jpg" alt="">  <!-- empty alt = decorative, skipped by screen readers -->

<!-- For informative images -->
<img src="chart.png" alt="Sales by quarter 2024: Q1 $1M, Q2 $1.4M, Q3 $1.6M, Q4 $2M">
```

The DevTools accessibility panel shows the "computed name" of each element. If it's blank for a button, fix it.

### 3. Keyboard operability

Users without a mouse (motor impairment, power user, broken trackpad) navigate by:

- `Tab` / `Shift+Tab` — between interactive elements.
- `Enter` / `Space` — activate buttons/links.
- Arrow keys — within composite widgets (menus, listboxes, tab panels).
- `Escape` — close modals, cancel actions.

Your job:

- **Every interactive element must be reachable.** No `tabindex="-1"` on things users need to use.
- **Focus must be visible.** If you `outline: none`, you've broken keyboard users. Replace with a custom focus style if needed (`:focus-visible` is the modern selector — focus ring only when the user is keyboarding, not on click).
- **Tab order should follow logical flow.** Usually: matches visual order. Never use `tabindex="1"` (it screws up the natural order); use the default `0` or omit it.
- **Focus traps in modals.** When a modal opens, focus moves into it; Tab cycles within; Escape closes; focus returns to the trigger. `<dialog>` element + `showModal()` handles most of this.

Test by unplugging your mouse. Can you do every flow with keyboard alone? If not, fix.

### 4. Focus management

The cardinal sins of focus:

- **Focus disappears on route change** (SPA — page changes but focus doesn't move). Move focus to a logical place (the new page's `<h1>`, with `tabindex="-1"` to make it focusable programmatically).
- **Focus gets stuck behind a modal.** Either focus is still on the underlying page (Tab navigates invisible elements) or focus is inside a hidden element. Trap focus to the modal.
- **Focus moves unexpectedly.** Form auto-advances to next field on max length, but user might want to review. Annoying for everyone, broken for screen readers.
- **`autofocus` everywhere.** Don't auto-focus secondary fields. Auto-focus is reasonable on the main input of a search modal; not on every page.

In React, `useEffect` + `ref.current.focus()` is the standard pattern. Watch out for the "set focus before the element is in the DOM" race.

### 5. Color contrast

Text must be readable. WCAG AA minimums:

- **Normal text**: 4.5:1 contrast ratio between text and background.
- **Large text** (18pt+ or 14pt+ bold): 3:1.
- **UI components and graphics**: 3:1.

Tools: Chrome DevTools' contrast inspector, Stark plugin, online checkers. Most designers have favorite tools. Audit your design system tokens once; ongoing checks catch regressions.

Beware: contrast on hover state, focus state, error state — all need to meet the ratio too.

### 6. Don't rely on color alone

A red border for "error" is unusable for red-green colorblind users. Pair color with an icon, text label, or pattern.

```html
<!-- ❌ -->
<input class="error">  <!-- red border only -->

<!-- ✓ -->
<input class="error" aria-invalid="true" aria-describedby="email-err">
<p id="email-err"><Icon /> Please enter a valid email</p>
```

### 7. ARIA — the powerful tool that's mostly footgun

ARIA (Accessible Rich Internet Applications) adds semantics to HTML via `role` and `aria-*` attributes. **The first rule of ARIA: don't use ARIA if a native HTML element would do the job.**

Why? ARIA is a contract you must implement correctly in code. A `<div role="button">` doesn't get any of the keyboard behavior of `<button>` — you have to add it all manually, *and* keep it in sync. People get it wrong constantly.

When ARIA *is* the right tool:

- **`aria-label`** for icon-only buttons (no text label).
- **`aria-describedby`** to associate help/error text with an input.
- **`aria-live`** for dynamic announcements ("3 items added," "loading…").
- **`aria-expanded`** for collapsibles.
- **`aria-current="page"`** for nav highlighting.
- **`role="dialog"` / `aria-modal="true"`** for custom modals (or just use `<dialog>`).
- **`aria-hidden="true"`** to hide decorative SVGs from screen readers.

When ARIA goes wrong:

- `role="button"` on a div with no keyboard handlers.
- `aria-label` that contradicts the visible label.
- `aria-hidden` on focusable elements (screen reader sees nothing; keyboard still lands on it — confusing).
- `role="presentation"` on tables that *are* tabular data.

Rule: build with semantic HTML. Reach for ARIA when (a) there's no native element, (b) you've read the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) pattern for the widget, and (c) you've tested with at least one screen reader.

### 8. Dynamic content: announcing changes

When the page changes without a reload (form submitted, item added, error appeared), screen readers don't automatically notice. Tell them via **live regions**:

```html
<div role="status" aria-live="polite">
  <!-- updates here are announced when screen reader is idle -->
</div>

<div role="alert" aria-live="assertive">
  <!-- urgent — interrupts current announcement -->
</div>
```

Update the content via JS; screen reader picks it up. Use `polite` for most (errors, success messages); `assertive` only for genuinely interruptive (form-block errors).

### 9. Images, video, audio

- **Images**: `alt` describing the *content's purpose*, not "image of." Decorative: `alt=""`.
- **Video**: captions (for deaf/hard of hearing), transcript (for everyone — also SEO), audio descriptions (for visual content, where applicable).
- **Audio**: transcript.
- **Auto-play**: don't. If you must, mute by default and provide controls.

For voice agents (Realtime Voice), provide a text alternative — both for accessibility and for environments where audio doesn't work.

### 10. Motion and animation

Some users get nauseated by motion. Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

For unavoidable animations (loading spinners), keep them short and non-flashing. Anything flashing > 3 times/sec is a seizure risk; WCAG bans it.

## Testing

### Automated tools

Catch ~30% of issues. Run them, but they're not sufficient.

- **axe DevTools** (browser extension) — best-in-class, free.
- **Lighthouse Accessibility audit** — built into Chrome.
- **jest-axe** — assert no a11y violations in unit tests of components.
- **Playwright + `axe-core`** — automated checks in e2e.
- **ESLint plugin `eslint-plugin-jsx-a11y`** — catches some violations at lint time.

Wire one of these into CI; treat findings as bugs.

### Manual testing

The 70% that automation misses:

- **Keyboard only.** Unplug the mouse, navigate everything.
- **Screen reader.** macOS VoiceOver (`Cmd+F5`), Windows NVDA (free, the industry standard), JAWS (paid, common in enterprise).
- **Zoom.** Zoom to 200%, check layout doesn't break.
- **Contrast.** Use the Chrome DevTools dropper on every text/UI element.
- **Reduced motion.** Toggle the OS preference, ensure animations respect it.
- **Color blindness simulator.** Chrome DevTools has one built in.

A 20-minute manual sweep before a release catches issues that 100% automated coverage misses.

### Real users

The gold standard. Recruit users with disabilities for usability testing. Services exist (Fable, AccessWorks). One session with a screen-reader user catches more than a week of dev testing.

## Common patterns and their accessible implementation

| UI pattern | Use |
|------------|-----|
| Modal | `<dialog>` element (or React Aria, Radix UI Primitives) |
| Dropdown menu | Native `<select>` if it's a form; ARIA menu pattern otherwise |
| Tabs | ARIA tabs pattern; tab/arrow nav |
| Tooltip | `aria-describedby`; show on hover *and* focus |
| Toast notification | `role="status"` (or `role="alert"` if urgent) |
| Loading spinner | `aria-busy` + visually-hidden "loading" text |
| Form errors | `aria-invalid` + `aria-describedby` pointing to error text |
| Skip link | `<a href="#main">Skip to content</a>` as first focusable element |
| Carousel | Avoid if you can; the accessible pattern is heavy |

Component libraries that get a11y right by default: **Radix UI**, **React Aria**, **Headless UI**, **shadcn/ui** (built on Radix). Use them; don't reinvent the modal.

:::info[Highlight: cost of a11y is in the design phase, not the dev phase]
The expensive accessibility bugs are baked in at design time: low-contrast brand colors, hover-only interactions, ambiguous icons, no error states designed. Fixing these later means renegotiating with design + reshipping components. The cheap path: a11y in the design system from the start, code follows. The expensive path: ship a brand, then "make it accessible" — that's a refactor.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **`<div onclick>` everywhere.** Not keyboard-focusable, not announced, no Enter/Space handling. Use `<button>` or `<a>` whenever the semantics match.
- **`outline: none` for "cleaner look."** You've just hidden the focus ring; keyboard users now can't tell where they are. Replace with a custom `:focus-visible` style.
- **Auto-focusing things that shouldn't be auto-focused.** Forces screen reader users to start over; annoys keyboard users. Reserve for the "obvious main input" cases.
- **Icon-only buttons with no `aria-label`.** "Button" announced; user has no idea what it does. Always label icon-only buttons.
- **`aria-label` that contradicts visible text.** "Click here" visible, `aria-label="submit form"` — confuses screen reader + voice control users. Match the visible name or omit `aria-label`.
- **Modals that don't trap focus.** Tab key escapes to the underlying page; user is now navigating invisible elements. Use `<dialog>` or a tested pattern.
- **Color as the only signal.** Red border for error — colorblind users see no error. Pair with icon, text, pattern.
- **Skipping heading levels.** `<h1>` then `<h3>` (no `<h2>`). Confuses screen reader structure navigation. Use levels in order; restyle with CSS if visual hierarchy demands.
- **No skip link.** Keyboard users tab through 50 nav items on every page. A "Skip to content" link as first focusable element fixes it.
- **Inline error text not associated with the input.** User hears "the email field" then the form blob; can't tell which error applies to what. Use `aria-describedby`.
- **Forms with no labels (just placeholders).** Placeholder disappears when typed, leaving no label. Always have a real `<label>`.
- **Live regions that fire on every state change.** Screen reader announces "loading… loaded… 5 items… 5 items… 6 items" non-stop. Be selective with `aria-live`.
- **Treating a11y as a launch checkpoint, not an ongoing practice.** Pages added later regress. Wire automated checks into CI and review accessibility in code review.
:::

## Page checkpoint

<Quiz id="foundations-accessibility-page" title="Did accessibility stick?" sampleSize={2}>

<Question
  prompt="Why is `<div onclick='submit()'>Submit</div>` an accessibility failure?"
  options={[
    { text: "Divs are slower than buttons" },
    { text: "A div isn't keyboard-focusable, doesn't announce as a button to screen readers, and doesn't handle Enter/Space activation. A `<button>` does all three for free — and gets focus styles, ARIA semantics, and form submission built in" },
    { text: "Browsers reject onclick on divs" },
    { text: "It only fails in Safari" }
  ]}
  correct={1}
  explanation="Use the element whose semantics match your intent. `<button>` is reachable by Tab, activates on Enter/Space, announces as a button. A `<div>` is a generic container — you'd have to manually add all that behavior and inevitably get it wrong."
  revisit={{ to: "/docs/foundations/accessibility#1-semantic-html-always", label: "Use real elements" }}
/>

<Question
  prompt="The first rule of ARIA?"
  options={[
    { text: "Add `role` to every element" },
    { text: "Don't use ARIA if a native HTML element would do the job. ARIA is a contract you must implement correctly in code; a native element is correct by construction" },
    { text: "Always add `aria-label`" },
    { text: "Avoid HTML5" }
  ]}
  correct={1}
  explanation="ARIA is for cases where HTML lacks the semantics (custom widgets). For anything HTML already provides — buttons, checkboxes, dialogs, navigation — use the native element. ARIA on top of misuse adds complexity without correctness."
  revisit={{ to: "/docs/foundations/accessibility#7-aria--the-powerful-tool-thats-mostly-footgun", label: "First rule of ARIA" }}
/>

<Question
  prompt="A team CSS-resets `outline: none` to make their site look cleaner. Why is this an a11y bug?"
  options={[
    { text: "Outlines improve performance" },
    { text: "The focus ring is the only way keyboard users see where focus currently is. Removing it without a replacement makes the site unusable by keyboard. Replace with a custom `:focus-visible` style that meets contrast requirements" },
    { text: "Outlines are required by HTML spec" },
    { text: "The browser warns about it" }
  ]}
  correct={1}
  explanation="Focus styles aren't decoration — they're the screen indicator of 'what will I activate if I press Enter.' If you remove the default, replace it with something at least as visible. `:focus-visible` lets you show it only for keyboard users."
  revisit={{ to: "/docs/foundations/accessibility#3-keyboard-operability", label: "Focus visibility" }}
/>

<Question
  prompt="An error state shows only a red border on the invalid input. What's the issue?"
  options={[
    { text: "Red is hard to render" },
    { text: "Red-green colorblind users (~5-8% of men) see no difference; screen reader users get no announcement. Pair color with an icon, visible text error, and `aria-invalid` + `aria-describedby` pointing to the error text" },
    { text: "Borders are deprecated" },
    { text: "Inputs can't have borders" }
  ]}
  correct={1}
  explanation="Don't rely on color alone. Use multiple signals (color + icon + text), and connect the input to its error programmatically so assistive tech announces 'invalid: [error message]' when the user focuses the field."
  revisit={{ to: "/docs/foundations/accessibility#6-dont-rely-on-color-alone", label: "Don't rely on color alone" }}
/>

</Quiz>

## What's next

→ Continue to [Message queues & event-driven](./message-queues).
