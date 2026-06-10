---
id: ecosystems
title: 10. Mobile & Other Ecosystems — Overview
sidebar_position: 1
sidebar_label: Ecosystems intro
description: Stepping beyond the web/TypeScript default — mobile (native, React Native, Flutter, PWA) and the major backend language ecosystems (JVM/Spring, .NET, Go, Python) the rest of the guide names but doesn't develop.
---

# Part 10: Mobile & Other Ecosystems

*The rest of the guide is (deliberately) a TypeScript-and-web story. This chapter is the world next door — mobile apps, and the backend language ecosystems that run a huge share of the industry.*

> **In one line:** The modern web/TS stack the guide champions is the right default for most new products — but a complete engineer should know the shape of the two big worlds beside it: **mobile** (where the choice is native vs React Native vs Flutter vs "just a PWA") and the **major backend ecosystems** (JVM/Spring, .NET, Go, Python) that dominate enterprise, systems, and data work, so you can recognize when the default *isn't* the answer and not be lost when you land in one of them.

:::tip[In plain English]
This guide has, by design, taught one stack deeply: TypeScript, React/Next.js, Node, Postgres, deployed on platforms or the cloud. That focus is a feature — it's the highest-leverage stack for most new web products in 2026, and depth beats breadth when you're learning. But "the whole industry" is bigger than that stack in two directions. **Sideways into mobile:** lots of products need an actual app in the App Store, which is a different discipline with its own choices (write it twice in the native languages? once in React Native or Flutter? or skip it and ship a polished web app?). **Down into other backend languages:** an enormous amount of the world's software — banks, governments, big enterprises, high-performance infrastructure, all of data science — runs on Java, C#, Go, or Python, not Node. This chapter gives you an honest, practical map of those neighborhoods: enough to choose well, to interview, and to be productive quickly if your next job is there. It's literacy, not a second full curriculum.
:::

:::note[New to web dev? How to read this chapter]
**Level: friendly — safe to read top-to-bottom at any stage.** This chapter is a *map*, not a deep tutorial: it tells you what the worlds next door (mobile, and the JVM/.NET/Go/Python backends) look like and when you'd step into one. You don't need to learn any of them now, and nothing here is a prerequisite for the rest of the guide.

If you're new, read it for orientation — so that when a future job or project pushes you toward "we need a mobile app" or "this team runs on Java," you recognize the situation instead of feeling lost. Skim the code; absorb the *decisions*.
:::

## Why this chapter exists

Three honest reasons a web-and-TS education is incomplete without it:

1. **Products often need a real mobile app.** Push notifications, app-store presence, offline use, device hardware, the home-screen icon users expect — sometimes a website genuinely isn't enough, and you need to know your options and their tradeoffs *before* you commit a year to the wrong one.
2. **Most of the industry's backend isn't Node.** The guide's Node/TS default is excellent for web product teams, but the JVM (Java/Kotlin/Spring) and .NET (C#) run the majority of large enterprises, Go runs a huge fraction of cloud-native infrastructure, and Python owns data/ML and a lot of backends. If you only know Node, large swaths of the job market and many architectural conversations are opaque to you.
3. **Choosing the right tool requires knowing the tools.** "Use the boring default" (the guide's repeated advice) only works if you know what the alternatives *are* and when one of them is genuinely the better fit — a CPU-bound service screaming for Go, a Microsoft-shop standardized on .NET, an ML pipeline that has to be Python.

:::info[Highlight: this is a map, not a relocation]
Nothing here retracts the guide's core recommendation. For a typical new web product built by a small team, TypeScript + Next.js + Postgres on a platform is still the answer, and you should reach for it by default. This chapter exists so that when you hit one of the *exceptions* — you need a native app, you join a Spring shop, you're writing latency-critical infrastructure, you're building an ML service — you recognize it as a known situation with a known toolset, rather than either forcing the web stack where it doesn't fit or being paralyzed in unfamiliar territory. Breadth here serves better *judgment*, which is the whole point of [the decisions chapter](/docs/decisions/boring-technology).
:::

## How this chapter is organized

### Mobile
1. [The mobile landscape](/docs/ecosystems/mobile-landscape) — native vs cross-platform vs PWA, the app-store reality, and the decision framework.
2. [React Native](/docs/ecosystems/react-native) — bring your React/TS skills to native apps; Expo, the bridge, and the limits.
3. [Flutter](/docs/ecosystems/flutter) — Dart, a single rendering engine, and where it wins over React Native.
4. [PWAs & offline](/docs/ecosystems/pwa) — how far a web app can go (service workers, installability, offline) and when that's enough to skip native entirely.

### Backend language ecosystems
5. [JVM & Spring](/docs/ecosystems/jvm-ecosystem) — Java/Kotlin and Spring Boot: the enterprise backbone.
6. [.NET & C#](/docs/ecosystems/dotnet-ecosystem) — Microsoft's modern, fast, cross-platform stack.
7. [Go](/docs/ecosystems/go-ecosystem) — simplicity and concurrency for cloud-native infrastructure and services.
8. [Python backends](/docs/ecosystems/python-ecosystem) — Django/FastAPI, and Python's grip on data and AI.

### Choosing
9. [Choosing an ecosystem](/docs/ecosystems/choosing-ecosystem) — when to leave the Node/TS default, and how to decide.

---

When you finish, take the [checkpoint](/docs/ecosystems/ecosystems-checkpoint), then continue to [Chapter 11: Solo / Personal](/docs/solo) — the first of the workflow-by-scale chapters, which show the same kind of product built at three very different company sizes.
