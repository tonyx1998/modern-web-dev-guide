---
id: pwa
title: PWAs & Offline
sidebar_position: 5
sidebar_label: PWAs & offline
description: Service workers, installability, offline-first, push on the web, what PWAs can and can't do (especially on iOS), and when a web app is enough to skip native.
---

# PWAs & Offline

> **In one line:** A Progressive Web App is a regular web app that, via a **service worker** and a manifest, can be installed to the home screen, work offline, and (mostly) send push notifications — closing much of the gap with native at a fraction of the cost, with the important caveats that it's not in the app stores and iOS limits what it can do.

:::tip[In plain English]
Before you commit to building a native app, ask how much of "app-like" you can get from the web itself — because the answer is "more than most people think." A **PWA** is your normal website plus two ingredients: a **manifest** (metadata that lets users "install" it to their home screen with an icon, no browser chrome) and a **service worker** (a script that runs in the background and can intercept network requests — which is what enables caching, *offline* use, and push notifications). With those, a web app can launch from the home screen like a real app, keep working with no connection, and re-engage users with notifications. It updates instantly (you just deploy the web), needs no app-store approval, and reuses your entire web codebase and team. The catches: it can't be *in* the App Store/Play Store, it can't reach every device feature, and **Apple deliberately limits PWAs on iOS** more than Android does. For a large class of apps, though, a PWA is genuinely enough — and far cheaper than native.
:::

## The two core ingredients

**1. The web app manifest** — a small JSON file declaring the app's name, icons, theme color, and display mode. It's what makes the site *installable*: the browser offers "Add to Home Screen," and once installed it launches full-screen with its own icon, looking like a native app rather than a browser tab.

**2. The service worker** — the engine of PWA capabilities. It's a script the browser runs *separately from your page*, in the background, that can **intercept network requests** and decide how to respond — from the network, from a cache, or a mix. This single capability unlocks the headline features:

```javascript
// A service worker implementing "cache-first for assets, network-first for data."
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) =>
      cache.addAll(["/", "/app.js", "/styles.css", "/offline.html"]) // precache the shell
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.url.includes("/api/")) {
    // Data: try network, fall back to cache (so the app works offline with last-known data)
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  } else {
    // Assets: serve from cache first (instant, offline-capable), update in background
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
  }
});
```

Caching strategy is the heart of offline support: precache the app *shell* (HTML/JS/CSS) so the UI always loads, then choose per-request whether fresh-or-cached data matters. Done well, the app opens and works on a subway with no signal.

## What PWAs can and can't do

| Capability | PWA support |
|---|---|
| Install to home screen, full-screen launch | ✅ Yes (Android fully; iOS yes, slightly more limited) |
| Work offline / cache | ✅ Yes (service worker) |
| Push notifications | ✅ Android & desktop; ✅ iOS (since 16.4, but only for *installed* PWAs, with limits) |
| Background sync, periodic sync | ⚠️ Partial; better on Android than iOS |
| Camera, geolocation, mic | ✅ Via web APIs (with permission) |
| Bluetooth, NFC, advanced sensors, file system | ⚠️ Limited / gated; varies by browser, weakest on iOS |
| App Store / Play Store listing | ❌ No (it's a URL; though you *can* wrap a PWA to submit it) |
| Instant updates (no review) | ✅ Yes — you deploy the web |

:::caution[The iOS asterisk on every PWA decision]
Apple has long limited PWAs on iOS relative to Android — historically restricting push, background capabilities, available storage, and which engine runs them (on iOS, all browsers were required to use WebKit, so "use a different browser for better PWA support" didn't help). It has improved (web push for installed PWAs arrived in iOS 16.4, and regulatory pressure is loosening some restrictions), but the gap remains real and shifting. **If a meaningful share of your users are on iPhones and you depend on push or deep device features, test exactly what works on current iOS before betting on a PWA** — this is the single most common way a "we'll just ship a PWA" plan hits a wall. On Android, PWAs are a much stronger, fuller-featured story.
:::

## When a PWA is enough (and when it isn't)

**A PWA is likely enough when:** your app is content, dashboards, tools, productivity, or commerce; you don't need App Store *discovery/presence* as a channel; you don't need deep/exotic device features; and you want maximum iteration speed and minimum cost with your existing web team. Many successful "apps" are PWAs and users never know or care.

**You probably need native (or cross-platform) when:** App Store presence is itself a requirement (discovery, trust, enterprise distribution); you need features PWAs can't reliably reach (rich background processing, certain sensors/Bluetooth, deep OS integration); you need the most polished possible native feel and performance; or a large iOS user base depends on capabilities iOS gates for PWAs.

:::info[Highlight: the cost-staged path — PWA → cross-platform → native]
The recurring guide theme applies cleanly to mobile. These three approaches form a *cost-and-capability ladder*, and the smart move is usually to climb it only as far as your requirements force you:
1. **PWA first** — cheapest, fastest, your existing web skills, instant updates. Validate the product.
2. **Cross-platform (RN/Flutter)** — when you genuinely need store presence and broader device access, one codebase gets you there without doubling the team.
3. **Native** — when you need maximum fidelity, performance, or day-one platform features, and you've proven it's worth two codebases.

Most teams over-shoot — jumping straight to native for an app a PWA would have served, paying months of cost to solve problems they didn't have. Climb the ladder deliberately: start at the cheapest rung that meets *today's* real requirements, and ascend only when a concrete need (not a vague "real apps are native") pushes you up. This is [premature optimization](/docs/decisions/premature-optimization) and [reversibility](/docs/decisions/reversibility) applied to the mobile decision.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Assuming a web app can't be "app-like."** With a manifest + service worker it installs, works offline, and (mostly) does push. Check the PWA option before assuming native.
- **Betting on a PWA for an iOS-heavy audience without testing iOS limits.** Apple gates push and device features for PWAs more than Android; verify what actually works on current iOS first.
- **Jumping straight to native.** It's the most expensive rung; many apps a PWA would serve get built native at great cost. Climb the ladder from cheapest-that-works.
- **Neglecting the offline caching strategy.** "It's a PWA" doesn't mean it works offline by default — you must precache the shell and choose per-request cache policies deliberately.
- **Forgetting there's no store discovery.** A PWA is a URL; if App Store *presence* is a growth channel or trust signal you need, that's a real reason to go (or also go) native.
- **Treating service workers as set-and-forget.** Cache versioning and update flows are subtle — stale caches serving old code is a classic PWA bug. Plan your cache-busting.
:::

## Page checkpoint

<Quiz id="pwa-page" title="Did PWAs & offline stick?" sampleSize={3}>

<Question
  prompt="What does a service worker provide that turns a normal website into an app-like PWA?"
  options={[
    { text: "It compiles the site into a native binary" },
    { text: "It runs in the background and can intercept network requests, enabling caching, offline use, and push notifications — the core of PWA capabilities" },
    { text: "It submits the app to the App Store automatically" },
    { text: "It replaces the need for a backend server" }
  ]}
  correct={1}
  explanation="The service worker is a background script that intercepts fetches and decides how to respond (network, cache, or both). That request interception is what enables offline support and push — paired with a manifest for installability."
  revisit={{ to: "/docs/ecosystems/pwa#the-two-core-ingredients", label: "Service worker" }}
/>

<Question
  prompt="What's the most important caveat when planning to ship a PWA for an iPhone-heavy audience?"
  options={[
    { text: "PWAs don't work in Safari at all" },
    { text: "Apple limits PWAs on iOS more than Android does (push and device features are gated, historically WebKit-only), so you must test what actually works on current iOS before depending on it" },
    { text: "iOS charges a fee to install PWAs" },
    { text: "PWAs can't use HTTPS on iOS" }
  ]}
  correct={1}
  explanation="iOS has historically restricted PWA push, background work, storage, and engine choice more than Android. It's improving (web push for installed PWAs in 16.4) but the gap is real and shifting — verify current iOS support before betting on a PWA for iPhone users."
  revisit={{ to: "/docs/ecosystems/pwa#what-pwas-can-and-cant-do", label: "iOS PWA limits" }}
/>

<Question
  prompt="What is the chapter's recommended approach to the PWA → cross-platform → native ladder?"
  options={[
    { text: "Always build native for the best result" },
    { text: "Climb only as far as your real requirements force you — start at the cheapest rung (PWA) that meets today's needs, and ascend to cross-platform or native only when a concrete need pushes you up" },
    { text: "Build all three in parallel to compare" },
    { text: "Start native and downgrade to a PWA if it's too expensive" }
  ]}
  correct={1}
  explanation="The three approaches form a cost/capability ladder. Over-shooting to native for an app a PWA would serve wastes months. Start cheapest-that-works and move up only when a specific requirement (store presence, device feature, fidelity) actually demands it."
  revisit={{ to: "/docs/ecosystems/pwa#when-a-pwa-is-enough-and-when-it-isnt", label: "The cost-staged ladder" }}
/>

</Quiz>

## What's next

→ Continue to [JVM & Spring](./jvm-ecosystem) — leaving mobile for the backend ecosystems, starting with the one that runs much of the enterprise world.
