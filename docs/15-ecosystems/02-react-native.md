---
id: react-native
title: React Native
sidebar_position: 3
sidebar_label: React Native
description: How React Native maps your React/TS skills to real native apps, Expo, the new architecture, native modules, and where it fits vs Flutter and native.
---

# React Native

> **In one line:** React Native lets you build genuinely native iOS and Android apps using React and TypeScript — the same component model and language you already know — by rendering to *real* native UI widgets rather than a webview, which is why it's the default mobile path for teams that already live in the React ecosystem.

:::tip[In plain English]
If you know React, React Native is most of the way to a mobile app. You write components with the same mental model — `useState`, props, JSX — but instead of `<div>` and `<p>` you use `<View>` and `<Text>`, and those map to *actual native UI controls* on the phone (not a web page in a wrapper). The result is a real app in the App Store that feels native, built largely with skills you already have. Meta builds parts of Facebook and Instagram with it; Shopify, Discord, and many others ship it. The headline benefit is leverage: one React/TS team can produce iOS, Android, *and* (with React Native for Web) share logic with your website, instead of hiring separate Swift and Kotlin specialists. The tradeoffs are real but manageable — occasional need to touch native code, and keeping up with a fast-moving framework — and for most product apps they're well worth the team-skill reuse.
:::

## How it works (and why it's not a webview)

This is the key thing to understand and the most common misconception. React Native does **not** render your UI in a browser/webview. Your React components describe the UI; React Native translates them into the platform's *actual* native views (`UIView` on iOS, `android.view` on Android). Your JavaScript logic runs in a JS engine and communicates with the native side. So the buttons, lists, and text are real native widgets — they scroll, animate, and feel native because they *are* native.

```tsx
// A React Native component — same React you know, native primitives instead of DOM.
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Count: {count}</Text>
      <Pressable style={styles.button} onPress={() => setCount((c) => c + 1)}>
        <Text style={styles.buttonText}>Increment</Text>
      </Pressable>
    </View>
  );
}

// Styling is JS objects (Flexbox by default), not CSS files.
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 24, marginBottom: 16 },
  button: { backgroundColor: "#2563eb", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" },
});
```

The differences from web React are surfaces, not fundamentals: native primitives instead of HTML, Flexbox-in-JS instead of CSS, and platform APIs (camera, geolocation) via libraries instead of browser APIs. The component model, hooks, state, and data-fetching patterns transfer directly.

## Expo: the way to start (and increasingly, to stay)

**Expo** is to React Native roughly what Next.js is to React — a batteries-included framework and toolchain that removes most of the painful setup. It gives you a managed build pipeline, a huge library of pre-built native modules (camera, notifications, secure storage) you can use without writing native code, over-the-air JS updates, and **EAS** (Expo Application Services) for cloud builds and store submission. The modern advice is unambiguous: **start with Expo.** The old reasons to "eject" to bare React Native have largely evaporated as Expo matured to support custom native code via *config plugins* and *development builds*. Starting bare today is usually self-inflicted pain.

```bash
# A new RN app, running on a device, in two commands:
npx create-expo-app@latest my-app
cd my-app && npx expo start   # scan the QR code with the Expo Go app to see it live
```

## Native modules and the bridge

When you need a device capability no library covers, or you must integrate a vendor's native SDK, you write a **native module** — a small piece of Swift/Kotlin exposed to your JS. You don't escape native code entirely; you *minimize* it. The communication between JS and native historically went over an asynchronous "bridge," which could bottleneck on heavy interactions (e.g. high-frequency gestures or large data transfers). React Native's **New Architecture** (JSI / Fabric / TurboModules), now the default, replaces that bridge with a faster, synchronous interface — substantially improving performance for exactly those heavy cases and closing much of the historical gap with Flutter and native.

:::info[Highlight: React Native's real superpower is skill and code reuse, not raw performance]
Be honest about *why* you'd pick React Native. It is not (usually) because it's the most performant option — native is, and Flutter's rendering is very consistent. You pick React Native because of **leverage**: your existing React/TypeScript developers become mobile developers, you maintain one codebase for two platforms, you can share business logic, types, and validation with your web app, and your hiring pool is "React developers" (huge) rather than "Swift + Kotlin specialists" (smaller, pricier, ×2). For a product company already building a React web app, that compounding reuse — one team, one language, shared code, one mental model from web to mobile — is frequently the deciding factor, and it's a genuinely strong one. Choose RN when ecosystem fit and team leverage matter more than squeezing out the last 10% of native performance, which is most product apps.
:::

## When React Native fits — and when it doesn't

**Good fit:** product apps, content apps, social, commerce, dashboards, most CRUD-shaped mobile apps — *especially* when your team and/or web app are already React/TS. **Weaker fit:** graphically intense games, apps doing heavy real-time on-device computation (video/audio processing, AR-centric experiences), or apps that must adopt brand-new OS features the instant they ship — there, native earns its cost. Versus **Flutter** (next page): both are excellent cross-platform choices; the tilt is largely "does your team already know React/TS (→ RN) or are you starting fresh / want maximum UI consistency (→ Flutter)?"

## Common mistakes

:::caution[Where people commonly trip up]
- **Thinking React Native is a webview.** It renders real native widgets; performance and feel are native, not web-in-a-wrapper. (That's a *different* approach, like Capacitor.)
- **Starting with bare React Native instead of Expo.** You take on native-toolchain pain that Expo now handles, including custom native code via config plugins. Start with Expo.
- **Expecting 100% code sharing and zero native code.** You'll occasionally write a native module or hit platform differences; budget for a little Swift/Kotlin and platform-specific tweaks.
- **Choosing RN for a heavy game or AR-centric app.** Those are where native (or a game engine) earns its keep. RN shines for product/CRUD/content apps.
- **Ignoring the framework's pace.** React Native moves fast (the New Architecture, library churn); plan for periodic upgrade work rather than set-and-forget.
- **Picking RN vs Flutter on benchmarks alone.** For most apps both are plenty fast; decide on team skills and ecosystem fit, which usually points React teams to RN.
:::

## Page checkpoint

<Quiz id="react-native-page" title="Did React Native stick?" sampleSize={3}>

<Question
  prompt="How does React Native render its UI, and why does that matter?"
  options={[
    { text: "In an embedded webview, so it's essentially a website in a wrapper" },
    { text: "It translates your React components into the platform's actual native UI widgets (UIView/android.view), so the app looks and feels native rather than web-in-a-wrapper" },
    { text: "By compiling JavaScript to Swift and Kotlin source" },
    { text: "Using a custom GPU rendering engine like Flutter" }
  ]}
  correct={1}
  explanation="React Native maps components to real native views; your JS logic drives them. This is why it feels native (the widgets ARE native) and is distinct from webview approaches. Flutter, by contrast, uses its own rendering engine rather than native widgets."
  revisit={{ to: "/docs/ecosystems/react-native#how-it-works-and-why-its-not-a-webview", label: "Not a webview" }}
/>

<Question
  prompt="What is the main reason a React/TypeScript product team would choose React Native?"
  options={[
    { text: "It outperforms native code" },
    { text: "Leverage — existing React/TS developers become mobile developers, one codebase serves both platforms, logic/types can be shared with the web app, and the hiring pool is large React devs rather than separate Swift+Kotlin specialists" },
    { text: "It avoids the App Store review process" },
    { text: "It's the only way to access device cameras" }
  ]}
  correct={1}
  explanation="RN's superpower is skill and code reuse, not raw performance (native wins there). For a team already building React, one language/codebase across web and mobile and a big hiring pool are compounding advantages that usually decide it."
  revisit={{ to: "/docs/ecosystems/react-native#how-it-works-and-why-its-not-a-webview", label: "RN's real superpower" }}
/>

<Question
  prompt="What's the modern recommendation for starting a React Native project?"
  options={[
    { text: "Start with bare React Native and add tooling yourself" },
    { text: "Start with Expo — it provides the managed build pipeline, pre-built native modules, OTA updates, and cloud builds, and now supports custom native code via config plugins, so the old reasons to avoid it have largely gone" },
    { text: "Start by writing native Swift/Kotlin shells and embedding RN" },
    { text: "Start with Flutter and migrate later" }
  ]}
  correct={1}
  explanation="Expo is the batteries-included framework for RN (like Next.js for React). It removes most native-toolchain pain and now handles custom native code via config plugins and development builds, so starting bare is usually self-inflicted difficulty."
  revisit={{ to: "/docs/ecosystems/react-native#expo-the-way-to-start-and-increasingly-to-stay", label: "Start with Expo" }}
/>

</Quiz>

## What's next

→ Continue to [Flutter](./flutter) — the other major cross-platform contender, with a different philosophy: own the entire rendering pipeline.
