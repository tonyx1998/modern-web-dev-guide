---
id: stage-7-tailwind
title: Stage 7 — Tailwind CSS
sidebar_position: 8
sidebar_label: Stage 7 — Tailwind
description: Utility-first CSS — compose single-purpose classes directly in JSX. Feels weird for 20 minutes, natural forever after.
---

# Stage 7 — Tailwind CSS

> **Time budget:** ~1 week

> **In one line:** A vocabulary of single-purpose utility classes you compose directly in your HTML/JSX — feels weird for 20 minutes, natural forever after.

> **Going deeper:** for the CSS *underneath* the utilities — the cascade, specificity, stacking contexts, modern layout, and design tokens — see [Advanced CSS & Styling](/docs/stack/styling-advanced).

Tailwind is a CSS framework, but not the kind you're used to. Instead of giving you pre-built components like Bootstrap, it gives you a vocabulary of single-purpose utility classes (`px-4`, `text-lg`, `flex`, `rounded-lg`) that you compose directly in your HTML/JSX. It feels weird for 20 minutes and natural forever after.

For Tailwind's place in the broader styling landscape, see [Styling](/docs/stack/styling).

### 1. Why utility-first wins for solo development

- You stop naming things. No more `.card__header--featured` vs `.card-header.featured` debates.
- You stop context-switching between HTML and CSS files.
- Unused styles get tree-shaken out — your production CSS is tiny.
- Consistency is automatic: spacing comes from a scale (`p-1`, `p-2`, `p-4`, `p-8`), colors come from a palette, font sizes come from a scale.

### 2. Setup (in your Vite + React project)

```bash
npm install tailwindcss @tailwindcss/vite
```

Then add the Vite plugin and one CSS import. The Tailwind docs cover the current setup steps with copy-paste accuracy.

### 3. The 20 utility groups you'll use 95% of the time

```jsx
<div className="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

Categories worth memorising:

- **Spacing**: `p-4` padding, `m-2` margin, `gap-4` grid/flex gap (scale: 0, 1, 2, 4, 6, 8, 12, 16…).
- **Layout**: `flex`, `grid`, `grid-cols-3`, `items-center`, `justify-between`.
- **Size**: `w-full`, `w-1/2`, `h-screen`, `max-w-4xl`.
- **Text**: `text-sm`, `text-xl`, `font-semibold`, `text-gray-700`.
- **Color**: `bg-blue-500`, `text-red-600`, `border-gray-200`.
- **Borders / rounding**: `rounded`, `rounded-lg`, `border`, `border-2`.
- **Effects**: `shadow`, `shadow-lg`, `opacity-50`, `transition`.

**Try it live** — real Tailwind running in the preview (via the Tailwind Play CDN). Edit the classes — `bg-blue-600`, `rounded-xl`, `p-6`, `hover:` — and watch the design change instantly:

<Sandbox
  template="static"
  editorHeight={320}
  files={{
    '/index.html': `<!doctype html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-100 p-8">
    <div class="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-slate-800">Edit my classes</h2>
      <p class="mt-2 text-slate-600">
        Change any Tailwind class and the preview updates live.
      </p>
      <button class="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
        A button
      </button>
    </div>
  </body>
</html>`,
  }}
/>

### 4. Responsive prefixes

```jsx
<div className="px-4 md:px-8 lg:px-16">
  {/* px-4 on mobile, px-8 from 768px up, px-16 from 1024px up */}
</div>
```

Same mobile-first model as raw CSS (Stage 2): the unprefixed class is the default, prefixes (`sm:`, `md:`, `lg:`, `xl:`) override at progressively wider breakpoints. *Min-width*, always.

### 5. State variants

```jsx
<button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50">
  Click
</button>

<input className="border focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
```

Variants compose: `md:hover:bg-blue-700` = on tablet+, on hover, blue-700.

### 6. Dark mode

```jsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  Content
</div>
```

One `dark:` prefix per styling property. Configure how dark mode activates (system preference vs class toggle) in your Tailwind config.

### 7. The objection you'll hear (and the answer)

"Tailwind in JSX looks like a wall of classes" — yes, until you stop reading individual classes and start reading *shapes*. `flex items-center justify-between` is one shape ("horizontal bar"); `px-4 py-2 rounded bg-blue-600 text-white` is another ("button"). With a Prettier plugin ([prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)) classes auto-sort into a consistent order. After a week it reads faster than custom CSS classes ever did.

### When NOT to use Tailwind

- One-off design systems with very custom theming — vanilla CSS with custom properties can be cleaner.
- Email templates — most email clients ignore most of it. Use inline styles or specialised tools (Resend's `react-email`, Stage 2 of the Tier 2 list).
- If you're already proficient at hand-written CSS and a project has a strong existing convention — don't force-migrate for novelty.

## Where to go deeper

- [Tailwind docs](https://tailwindcss.com/docs) — searchable, accurate, the best documentation of any frontend tool. Bookmark, keep a tab open.
- [Tailwind Play](https://play.tailwindcss.com) — browser playground for trying utilities live.
- [Tailwind UI](https://tailwindui.com) (paid) and [shadcn/ui](https://ui.shadcn.com) (free) — galleries of pre-built components you can copy. The best way to learn idiomatic Tailwind is to read good Tailwind.

## Deeper in this guide

- [Styling](/docs/stack/styling) — Tailwind in context with CSS-in-JS, CSS Modules, and the rest of the styling landscape.

## Project

:::tip[Project — Re-style your Stage 6 todo with Tailwind]
Add Tailwind to your Stage 6 React todo project. Delete your existing CSS file entirely. Restyle the app using only Tailwind utilities — at minimum: a centered max-width container, a styled input + button row, list items with hover states, a "completed" struck-through style, dark-mode support via the `dark:` prefix. Make it responsive — single-column on mobile, two-column "active / done" layout from `md:` up. By the end of this project, the Tailwind class vocabulary will feel like a language, not a list.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Giving up after 20 minutes because "the classes are ugly."** Yes — for the first day. After a week you stop reading individual classes and start reading shapes (`flex items-center justify-between` = "horizontal bar"). Install the [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) so classes auto-sort into a predictable order; this is half the readability fight.
- **Building a custom CSS file alongside Tailwind.** The minute you write `.btn-primary { @apply ... }` for every component, you've rebuilt the abstraction Tailwind was trying to delete. Reach for an actual React component (`<Button variant="primary">`) instead — same DRY, no two-place editing.
- **Using arbitrary values for everything (`p-[17px]`, `text-[#a93f12]`).** Tailwind's spacing and color scales exist to keep your design consistent. Arbitrary values are a fire escape — fine once or twice per project, a smell if every component uses them.
- **Mixing `sm:`, `md:`, `lg:` as if they were *max-widths*.** Tailwind is mobile-first: unprefixed is the base, and `md:` means "from 768px **up**." Writing `md:px-2 px-8` (expecting `px-2` only above 768px) does the opposite of what you want — the unprefixed class always applies.
:::

## Page checkpoint

<Quiz id="stage-7-page" title="Did Stage 7 stick?" sampleSize={3}>

<Question
  prompt="`<div className=&quot;px-4 md:px-8 lg:px-16&quot;>` — what's the horizontal padding on a phone (375px wide)?"
  options={[
    { text: "16px (px-16, the most specific class)" },
    { text: "8px (px-8, the middle option)" },
    { text: "1rem / 16px from `px-4` — the unprefixed class is the mobile base; `md:` and `lg:` only kick in at 768px and 1024px respectively" },
    { text: "0px — Tailwind requires an explicit `sm:` prefix" }
  ]}
  correct={2}
  explanation="Tailwind is mobile-first. Unprefixed classes apply at every size; breakpoint prefixes (`sm:`, `md:`, `lg:`...) override *from that width upward*. On a 375px phone, only `px-4` is active."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-7-tailwind#4-responsive-prefixes", label: "Revisit: Responsive prefixes" }}
/>

<Question
  prompt="Why is the production CSS that Tailwind ships usually tiny, even though Tailwind has thousands of utility classes?"
  options={[
    { text: "Tailwind compresses CSS more aggressively than other tools" },
    { text: "Tailwind scans your source files and only includes the classes you actually used — unused utilities are tree-shaken out" },
    { text: "Browsers cache Tailwind from a CDN" },
    { text: "Tailwind sends only inline styles, not a CSS file" }
  ]}
  correct={1}
  explanation="Tailwind's build step reads your JSX/HTML, finds every class string you wrote, and outputs only those rules. The thousands of *possible* utilities never make it into your bundle."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-7-tailwind#1-why-utility-first-wins-for-solo-development", label: "Revisit: Why utility-first" }}
/>

<Question
  prompt="You want a button that's blue normally and darker on hover. Which is the idiomatic Tailwind?"
  options={[
    { text: "`bg-blue-600` plus a separate CSS file with `.btn:hover { background: ... }`" },
    { text: "`bg-blue-600 hover:bg-blue-700` — state variants compose right into the class string" },
    { text: "`bg-blue-600 onhover-bg-blue-700`" },
    { text: "Tailwind doesn't support hover; use inline styles" }
  ]}
  correct={1}
  explanation="State variants like `hover:`, `focus:`, `active:`, and `disabled:` prefix a utility to apply it only in that state. They compose freely with responsive prefixes (`md:hover:bg-blue-700`)."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-7-tailwind#5-state-variants", label: "Revisit: State variants" }}
/>

</Quiz>

→ [Next: Stage 8 — Next.js](/docs/roadmap/part-1-from-zero/stage-8-nextjs) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
