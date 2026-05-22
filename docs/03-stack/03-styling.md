---
id: styling
title: Styling
sidebar_position: 4
sidebar_label: Styling
description: How you write CSS shapes the entire development experience. Tailwind dominates; shadcn/ui is the component layer of choice.
---

# Styling

> **In one line:** Tailwind CSS + shadcn/ui is the dominant 2026 styling stack. Old-school CSS Modules still work fine; CSS-in-JS is fading.

:::tip[In plain English]
"Styling" is the layer that makes things look right — colors, spacing, fonts, hover states. Modern frontend has converged on **utility-first CSS** (Tailwind) — instead of writing custom class names like `.primary-button`, you compose pre-made utility classes (`px-4 py-2 bg-blue-500 rounded`). Combined with a component collection like shadcn/ui, you go from "blank canvas" to "professional-looking UI" in an afternoon.
:::

## Tailwind CSS v4 — the dominant approach

Tailwind is **utility-first CSS**: instead of writing custom classes, you compose utilities directly in your markup.

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>
```

**Tailwind v4 (released 2024–2025) brings:**

- Rust-based engine (much faster than v3).
- CSS-first configuration (theme defined in CSS itself, not `tailwind.config.js`).
- Native CSS features (cascade layers, container queries, color-mix).
- Better integration with browser DevTools.

**The "Tailwind is ugly" debate (largely settled):**

Critics: "Long class strings are unreadable." Defenders: "It's actually faster to read and write than naming abstractions." By 2026 the dominant view is that Tailwind is fine — most teams that try it stay with it.

## shadcn/ui — not a library, a collection

shadcn/ui is **not** an npm package. It's a CLI that copies React components into your project. The components use Radix UI primitives for accessibility and Tailwind for styling.

```bash
bunx shadcn@latest add button card input form dialog
```

This creates `components/ui/button.tsx` (etc.) in your project. **You own the code; you can customize freely.**

**Why it took over:**

- Beautiful, accessible defaults.
- No version lock-in (you copy the code).
- Easy to customize (just edit the file).
- Works perfectly with Tailwind and Next.js.

Almost every new React project in 2026 starts with shadcn/ui.

:::note[Worked example: from blank Next.js to professional UI in 5 minutes]
```bash
bunx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
bunx shadcn@latest init
bunx shadcn@latest add button card input form dialog dropdown-menu

# Now you have professionally-designed components in components/ui/
# Use them like:
```

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, world</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

You now have a polished, accessible button and card without writing a line of CSS. This is dramatically faster than 5 years ago.
:::

## CSS Modules

Locally-scoped CSS files. Class names are automatically prefixed to avoid global collisions.

```typescript
// Button.tsx
import styles from './Button.module.css';
export const Button = () => <button className={styles.primary}>Click</button>;
```

```css
/* Button.module.css */
.primary { background: blue; color: white; }
```

**When to use:** Teams that want regular CSS with scoping; non-Tailwind shops; gradual migration paths.

## Vanilla Extract / Panda CSS

Type-safe CSS-in-JS at build time. You write CSS in TypeScript; it compiles to static CSS files.

```typescript
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '8px 16px',
  background: 'blue',
  ':hover': { background: 'darkblue' },
});
```

**When to use:** Large teams that want type-safe theming and don't like Tailwind's utility approach.

## Styled-Components / Emotion (runtime CSS-in-JS)

Popular in 2018–2022; falling out of favor by 2026. They don't play nicely with React Server Components (which can't run client-side JS to inject styles), and they have runtime performance costs.

## Decision matrix

| Project Type               | Recommendation                |
|----------------------------|-------------------------------|
| New React app              | Tailwind + shadcn/ui          |
| Vue app                    | Tailwind                      |
| Design-system-heavy team   | Tailwind + custom components OR Vanilla Extract |
| Backend-heavy / minimal JS | Tailwind + handwritten HTML   |
| Legacy migration           | CSS Modules                   |

:::info[Highlight: design tokens make Tailwind into a design system]
A common worry: "If I write `bg-blue-500` everywhere, what happens when I want to change the brand color?"

The answer: define **design tokens** in your Tailwind config (or CSS variables in Tailwind v4) and use semantic names — `bg-primary`, `text-foreground`, `border-muted`. Then you change the token in one place and everything updates. shadcn/ui ships with this pattern out of the box.
:::

## Page checkpoint

<Quiz id="stack-styling-page" title="Did styling stick?" sampleSize={2}>

<Question
  prompt="What does 'utility-first CSS' (Tailwind's approach) mean in practice?"
  options={[
    { text: "You generate one big CSS file with no class names at all" },
    { text: "You compose pre-made utility classes like `px-4 bg-blue-500` directly in markup, instead of naming custom classes" },
    { text: "You write CSS only inside JavaScript files" },
    { text: "You rely entirely on browser default styles and override a few utilities" }
  ]}
  correct={1}
  explanation="Tailwind exposes small, single-purpose utility classes that you compose in your markup. You stop inventing class names like `.primary-button` and assemble styling from utilities instead."
  revisit={{ to: "/docs/stack/styling#tailwind-css-v4--the-dominant-approach", label: "Tailwind v4 section" }}
/>

<Question
  prompt="What is unusual about how shadcn/ui ships its components?"
  options={[
    { text: "It's an npm package you install and import like any other UI library" },
    { text: "It's a hosted service that serves components over a CDN" },
    { text: "Its CLI copies React component source files into your project, so you own and can edit the code" },
    { text: "It ships only compiled CSS — no JavaScript components" }
  ]}
  correct={2}
  explanation="shadcn/ui is a CLI that copies component source files (built on Radix + Tailwind) into your project. You own the code, can customize freely, and aren't locked into a package version."
  revisit={{ to: "/docs/stack/styling#shadcnui--not-a-library-a-collection", label: "shadcn/ui section" }}
/>

<Question
  prompt="Why is runtime CSS-in-JS (styled-components, Emotion) falling out of favor in 2026?"
  options={[
    { text: "It only supports very old browsers" },
    { text: "It doesn't play nicely with React Server Components and has runtime performance costs" },
    { text: "It can't be used with TypeScript" },
    { text: "It was deprecated by the W3C" }
  ]}
  correct={1}
  explanation="Runtime CSS-in-JS injects styles via client-side JavaScript, which conflicts with RSCs (no client JS available) and adds runtime cost. Build-time alternatives like Vanilla Extract avoid both issues."
  revisit={{ to: "/docs/stack/styling#styled-components--emotion-runtime-css-in-js", label: "Runtime CSS-in-JS" }}
/>

<Question
  prompt="If your brand color changes, how do you keep `bg-blue-500` everywhere from becoming a nightmare?"
  options={[
    { text: "Run a global find-and-replace across the entire codebase before each release" },
    { text: "Switch to inline styles for any colored element" },
    { text: "Define design tokens (semantic names like `bg-primary`) in Tailwind config or CSS variables and update them in one place" },
    { text: "Hardcode the color into each component as a prop" }
  ]}
  correct={2}
  explanation="Design tokens give you semantic names (`bg-primary`, `text-foreground`) that point at concrete values. Change the token once and every consumer updates — this is the pattern shadcn/ui ships by default."
  revisit={{ to: "/docs/stack/styling#tailwind-css-v4--the-dominant-approach", label: "Design tokens with Tailwind" }}
/>

</Quiz>

## What's next

→ Continue to [Build Tools](./build-tools) — the engines that turn your TypeScript and Tailwind into something browsers can load.
