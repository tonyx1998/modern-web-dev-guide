---
id: flutter
title: Flutter
sidebar_position: 4
sidebar_label: Flutter
description: Flutter's own-the-rendering-engine philosophy, Dart, widgets, where it beats React Native, and the tradeoffs of not using native widgets.
---

# Flutter

> **In one line:** Flutter takes the opposite approach to React Native — instead of using the platform's native widgets, it ships its own high-performance rendering engine and *draws every pixel itself*, which buys pixel-identical UI across iOS, Android, web, and desktop at the cost of not being "native widgets" and requiring you to learn Dart.

:::tip[In plain English]
React Native uses the phone's real UI controls; **Flutter** brings its own. Flutter includes a rendering engine (Skia/Impeller) that paints the entire interface directly onto a canvas, so a Flutter button isn't an iOS button or an Android button — it's Flutter's own button, drawn by Flutter, looking exactly the same everywhere. That's the core tradeoff in one sentence: you get **total control and perfect consistency** across every platform (and very smooth animations, because Flutter owns the whole pipeline), but you give up automatic native look-and-feel and you write in **Dart**, Google's language, instead of JavaScript/TypeScript. Flutter is Google's framework, it's mature and popular, and for teams without an existing React investment — or for design-heavy apps that want a precisely-controlled custom look on every platform — it's often the better cross-platform pick.
:::

## The "own the pixels" philosophy

Everything in Flutter is a **widget** (composed in a tree, conceptually similar to React components), but the crucial architectural difference is what those widgets become: Flutter doesn't hand off to native UI; it **renders them itself** via its engine. The consequences flow directly from that:

- ✅ **Pixel-perfect consistency.** The app looks identical on iOS, Android, web, and desktop, because Flutter — not the OS — draws it. No "it looks slightly off on Android" surprises.
- ✅ **Smooth, controllable animation/UI.** Owning the rendering pipeline means high, consistent frame rates and total design freedom — great for branded, custom, animation-rich interfaces.
- ✅ **One codebase, many targets.** iOS, Android, web, Windows, macOS, Linux from the same code (mobile is by far the most mature).
- ⚠️ **Not native widgets.** It mimics platform look-and-feel (Material/Cupertino widget sets) very well, but it's a re-creation; brand-new OS UI elements aren't automatically yours, and some users/purists notice the difference.
- ⚠️ **Dart.** A clean, capable language — but one most web developers don't already know, so there's a real learning cost and a smaller hiring pool than JavaScript.

```dart
// A Flutter counter — widgets composed in Dart. Note the declarative, React-like shape.
import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Count: $count', style: const TextStyle(fontSize: 24)),
        ElevatedButton(
          onPressed: () => setState(() => count++),  // setState ≈ React's state update
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

The structure will feel familiar to a React developer (declarative, stateful widgets, a `build` method like `render`) — the conceptual leap is small; the language and the rendering model are the new parts.

:::info[Highlight: Flutter vs React Native is mostly a team-and-design question, not a quality one]
Both are excellent, mature, production-proven cross-platform frameworks — plenty of huge apps ship on each. Benchmarks rarely decide it; for typical product apps both are fast enough. The honest deciding factors:
- **Existing skills.** A React/TypeScript team is *already* most of the way to React Native; adopting Flutter means learning Dart and a new ecosystem. This alone points most web teams to RN.
- **UI philosophy.** Want the app to *adopt* each platform's native feel with minimal effort? Lean React Native. Want a *precisely controlled, identical, custom-branded* look on every platform with buttery animations? Lean Flutter.
- **Code/skill reuse with your web app.** RN shares a language (and some code) with a React web frontend; Flutter is its own world (though Flutter Web exists).
- **Targets beyond mobile.** Flutter's single-codebase reach into desktop is more mature today.

So the question isn't "which is better" but "do we already know React (→ RN), and how much do we value identical custom UI everywhere (→ Flutter)?" Both are right answers for different teams.
:::

## When Flutter is the pick

Choose Flutter when: you have **no existing React investment** (so RN's skill-reuse advantage doesn't apply and you're choosing on merits); you want a **highly custom, brand-consistent UI** rendered identically across platforms; you value **smooth, complex animations** and full design control; or you want one codebase spanning **mobile + desktop**. Lean the other way (RN) when your team and product are already React/TypeScript — the leverage usually wins. And as always, if you don't truly need a native app at all, revisit [the PWA option](./pwa) first.

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking Flutter while sitting on a big React/TS investment.** You forgo RN's skill-and-code reuse and pay to learn Dart. For React teams, that's usually the wrong trade unless UI-consistency needs are strong.
- **Expecting truly native widgets.** Flutter *draws* its own; it mimics platform UI well but it isn't the OS's controls. Usually fine, occasionally noticeable — know which your product cares about.
- **Underestimating the Dart learning curve / hiring pool.** Dart is pleasant but unfamiliar to most web devs, and the talent pool is smaller than JavaScript's. Factor it into team planning.
- **Choosing on micro-benchmarks.** Both Flutter and RN are fast enough for the vast majority of apps. Decide on team skills, UI philosophy, and reuse — not synthetic numbers.
- **Forgetting the PWA question.** If you don't need store presence or deep device access, a PWA may beat *any* cross-platform framework on cost and update speed.
:::

## Page checkpoint

<Quiz id="flutter-page" title="Did Flutter stick?" sampleSize={3}>

<Question
  prompt="What is the fundamental architectural difference between Flutter and React Native?"
  options={[
    { text: "Flutter runs in a webview; React Native compiles to native code" },
    { text: "Flutter ships its own rendering engine and draws every pixel itself (pixel-identical across platforms), while React Native renders using the platform's actual native widgets" },
    { text: "Flutter is for Android only; React Native is for iOS only" },
    { text: "There's no difference; they share the same engine" }
  ]}
  correct={1}
  explanation="Flutter owns the rendering pipeline — its widgets are drawn by Flutter's engine, giving identical UI and smooth animation everywhere but not being native widgets. React Native maps to real native controls. This single difference drives most of their respective tradeoffs."
  revisit={{ to: "/docs/ecosystems/flutter#the-own-the-pixels-philosophy", label: "Own the pixels" }}
/>

<Question
  prompt="What most often decides Flutter vs React Native for a team?"
  options={[
    { text: "Raw performance benchmarks" },
    { text: "Existing team skills (React/TS teams lean RN for reuse) and UI philosophy (Flutter for precisely-controlled identical custom UI; RN to adopt native feel) — both are mature and fast enough for most apps" },
    { text: "Which one supports the App Store" },
    { text: "The price of the framework license" }
  ]}
  correct={1}
  explanation="Both are excellent and fast enough for typical apps, so the decision is practical: React teams gain skill/code reuse with RN, while Flutter wins when you want identical custom-branded UI and animation control across platforms or have no React bias. It's a team-and-design call."
  revisit={{ to: "/docs/ecosystems/flutter#the-own-the-pixels-philosophy", label: "Flutter vs RN" }}
/>

<Question
  prompt="A team with a large existing React/TypeScript codebase is choosing a cross-platform framework. What does the chapter suggest?"
  options={[
    { text: "Flutter, because Dart is faster than JavaScript" },
    { text: "Lean toward React Native — the skill and code reuse with their existing React work usually outweighs Flutter's UI-consistency edge, unless identical custom UI everywhere is a strong requirement" },
    { text: "Always Flutter, regardless of existing skills" },
    { text: "Neither; cross-platform is never appropriate" }
  ]}
  correct={1}
  explanation="For a React/TS team, RN lets existing developers build mobile, share logic with the web app, and hire from the large React pool. Flutter would mean learning Dart and a new ecosystem — worth it only if identical custom UI/animation across platforms is a priority."
  revisit={{ to: "/docs/ecosystems/flutter#when-flutter-is-the-pick", label: "When Flutter fits" }}
/>

</Quiz>

## What's next

→ Continue to [PWAs & offline](./pwa) — before committing to *any* native framework, how far can a web app alone take you?
