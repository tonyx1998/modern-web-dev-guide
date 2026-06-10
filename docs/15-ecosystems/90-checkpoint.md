---
id: ecosystems-checkpoint
title: Chapter 9 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 9 — Mobile & Other Ecosystems. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 11.
---

# Chapter 9 Checkpoint

You've finished the Mobile & Other Ecosystems chapter. Make sure the map stuck: the mobile approaches and the major backend ecosystems, and how to choose among them.

There are **15 questions in the bank** — each visit picks 5 at random. Miss one and the result card links you back to the exact section.

You must pass (≥ 67%) to unlock the Next button and Chapter 10 in the sidebar.

<Quiz id="ecosystems-checkpoint" title="Mobile & Other Ecosystems checkpoint" sampleSize={5}>

<Question
  prompt="A web team needs an MVP for a content/dashboard product. The chapter's recommended starting point?"
  options={[
    { text: "Native iOS + Android for maximum quality" },
    { text: "A PWA / great mobile web app — existing skills, instant updates, no deep device needs yet; graduate to cross-platform/native only if proven necessary" },
    { text: "Flutter, because Dart is easiest" },
    { text: "Two native codebases to avoid compromise" }
  ]}
  correct={1}
  explanation="Don't pay for native fidelity you haven't proven you need. A PWA validates fastest with the team's web skills; climb to React Native (store presence, one codebase) and native only when a concrete requirement demands it."
  revisit={{ to: "/docs/ecosystems/mobile-landscape#the-decision-framework", label: "Mobile decision" }}
/>

<Question
  prompt="Why are feature flags / remote config even more important for mobile than web?"
  options={[
    { text: "Phones have less memory" },
    { text: "You can't hotfix a shipped native app at web speed (store review + user-update lag), so disabling a broken feature server-side via a flag is often the only fast remedy" },
    { text: "App stores mandate them" },
    { text: "They make apps download faster" }
  ]}
  correct={1}
  explanation="Native deploys are gated by review and user updates, so you can't just redeploy a fix. Server-side flags let you turn off a broken feature without a new build — the fast escape hatch web gets via redeploy."
  revisit={{ to: "/docs/ecosystems/mobile-landscape#the-app-store-reality-the-part-web-devs-underestimate", label: "Update lag" }}
/>

<Question
  prompt="How does React Native render its UI?"
  options={[
    { text: "In a webview (a website in a wrapper)" },
    { text: "It maps React components to the platform's actual native widgets, so it feels native; JS logic drives them" },
    { text: "It compiles JS to Swift/Kotlin source" },
    { text: "With its own GPU rendering engine, like Flutter" }
  ]}
  correct={1}
  explanation="RN uses real native views (UIView/android.view), so the app looks and feels native — distinct from webview approaches and from Flutter's own-rendering engine."
  revisit={{ to: "/docs/ecosystems/react-native#how-it-works-and-why-its-not-a-webview", label: "Not a webview" }}
/>

<Question
  prompt="The main reason a React/TypeScript team chooses React Native?"
  options={[
    { text: "It outperforms native code" },
    { text: "Leverage — existing React/TS devs build mobile, one codebase for both platforms, shared logic/types with the web app, and a large hiring pool" },
    { text: "It skips App Store review" },
    { text: "It's the only way to access the camera" }
  ]}
  correct={1}
  explanation="RN's superpower is skill and code reuse, not raw performance (native wins there). For React teams, one language across web and mobile and a big talent pool usually decide it."
  revisit={{ to: "/docs/ecosystems/react-native#how-it-works-and-why-its-not-a-webview", label: "RN's superpower" }}
/>

<Question
  prompt="What is the fundamental architectural difference between Flutter and React Native?"
  options={[
    { text: "Flutter is a webview; RN compiles to native" },
    { text: "Flutter ships its own rendering engine and draws every pixel itself (identical UI everywhere), while RN renders using the platform's actual native widgets" },
    { text: "Flutter is Android-only; RN is iOS-only" },
    { text: "They share the same engine" }
  ]}
  correct={1}
  explanation="Flutter owns the rendering pipeline (pixel-identical, smooth animation, but not native widgets); RN maps to real native controls. This single difference drives their tradeoffs."
  revisit={{ to: "/docs/ecosystems/flutter#the-own-the-pixels-philosophy", label: "Own the pixels" }}
/>

<Question
  prompt="What does a service worker provide that makes a website an app-like PWA?"
  options={[
    { text: "It compiles the site to a native binary" },
    { text: "It runs in the background and intercepts network requests, enabling caching, offline use, and push — the core of PWA capabilities (paired with a manifest for installability)" },
    { text: "It auto-submits the app to the store" },
    { text: "It removes the need for a backend" }
  ]}
  correct={1}
  explanation="The service worker intercepts fetches and decides how to respond (network/cache), enabling offline and push. With a manifest for home-screen install, a normal website becomes app-like."
  revisit={{ to: "/docs/ecosystems/pwa#the-two-core-ingredients", label: "Service worker" }}
/>

<Question
  prompt="Key caveat for shipping a PWA to an iPhone-heavy audience?"
  options={[
    { text: "PWAs don't work in Safari at all" },
    { text: "Apple limits PWAs on iOS more than Android (push and device features gated, historically WebKit-only), so test what actually works on current iOS before depending on it" },
    { text: "iOS charges to install PWAs" },
    { text: "PWAs can't use HTTPS on iOS" }
  ]}
  correct={1}
  explanation="iOS has historically restricted PWA push, background work, and storage more than Android. It's improving but the gap is real and shifting — verify current iOS support before betting on a PWA for iPhone users."
  revisit={{ to: "/docs/ecosystems/pwa#what-pwas-can-and-cant-do", label: "iOS PWA limits" }}
/>

<Question
  prompt="Why do large enterprises predominantly run backends on the JVM?"
  options={[
    { text: "It's the cheapest to license" },
    { text: "Maturity/stability (decades of backward compatibility), strong performance with true multi-threading, a vast ecosystem (Spring), excellent tooling, and a large talent pool" },
    { text: "It's the only ecosystem with REST" },
    { text: "It's legally required for finance" }
  ]}
  correct={1}
  explanation="The JVM offers proven stability, real parallelism and JIT performance, a mature ecosystem, world-class tooling, and abundant talent — boring-technology virtues at enterprise scale."
  revisit={{ to: "/docs/ecosystems/jvm-ecosystem#why-the-jvm-runs-the-enterprise", label: "Why the JVM" }}
/>

<Question
  prompt="The relationship between the JVM, Java, and Kotlin?"
  options={[
    { text: "Three names for the same language" },
    { text: "The JVM is the runtime/ecosystem; Java is the classic language on it; Kotlin is a modern, concise language that also runs on the JVM and interops with Java" },
    { text: "Kotlin replaced the JVM" },
    { text: "Java runs on the JVM, Kotlin on Node" }
  ]}
  correct={1}
  explanation="The JVM is the platform; Java the original language; Kotlin the modern alternative that compiles to the JVM and interoperates with Java (and is preferred for Android)."
  revisit={{ to: "/docs/ecosystems/jvm-ecosystem#spring-boot-in-practice", label: "JVM/Java/Kotlin" }}
/>

<Question
  prompt="The most important correction to the common impression of .NET?"
  options={[
    { text: "It now runs only on Windows" },
    { text: "Modern .NET (formerly .NET Core) is open-source, cross-platform, and high-performance — not the Windows-only proprietary '.NET Framework' people remember" },
    { text: "C# was replaced by F#" },
    { text: "It can't integrate with Azure" }
  ]}
  correct={1}
  explanation="Modern .NET is open-source, cross-platform, and fast, running in Linux containers on any cloud. 'We run .NET' no longer implies Windows or lock-in."
  revisit={{ to: "/docs/ecosystems/dotnet-ecosystem#the-reinvention-you-need-to-know-about", label: ".NET reinvention" }}
/>

<Question
  prompt="When is .NET most clearly the right choice?"
  options={[
    { text: "For any startup by default" },
    { text: "With existing Microsoft gravity — Azure, Active Directory/Entra ID, Windows/Office, a C# team — where its seamless integration is the deciding advantage" },
    { text: "Only for desktop apps" },
    { text: "Whenever you need NoSQL" }
  ]}
  correct={1}
  explanation="Its standout edge is Microsoft-ecosystem integration. With that gravity it's the obvious pick; without it, .NET is still excellent but a JS team has less reason to prefer it over Node."
  revisit={{ to: "/docs/ecosystems/dotnet-ecosystem#how-it-compares", label: "Microsoft gravity" }}
/>

<Question
  prompt="Why is so much cloud-native infrastructure (Docker, Kubernetes, Terraform) written in Go?"
  options={[
    { text: "Google mandates it for open source" },
    { text: "Go fits infrastructure: fast compiled performance, a single static binary (trivial deploy, tiny containers), built-in lightweight concurrency, and enforced simplicity for maintainable large codebases" },
    { text: "Go has the biggest ML ecosystem" },
    { text: "Go is easiest for building UIs" }
  ]}
  correct={1}
  explanation="Infra needs speed, dead-simple deployment, strong concurrency, and long-term maintainability — Go's strengths. That's why it's the lingua franca of the cloud/DevOps world."
  revisit={{ to: "/docs/ecosystems/go-ecosystem#goroutines-concurrency-built-into-the-language", label: "Language of the cloud" }}
/>

<Question
  prompt="What's a goroutine and why does it matter?"
  options={[
    { text: "Go's package manager" },
    { text: "A concurrent function started with `go`, so lightweight that hundreds of thousands run at once — making Go excellent at many simultaneous connections; they communicate via channels rather than shared memory" },
    { text: "A Go database driver" },
    { text: "Go's name for an OS thread" }
  ]}
  correct={1}
  explanation="Goroutines are very cheap concurrent functions, so Go handles massive concurrency that would exhaust OS threads. Channels enable safe communication ('share by communicating'), making high-connection services idiomatic."
  revisit={{ to: "/docs/ecosystems/go-ecosystem#goroutines-concurrency-built-into-the-language", label: "Goroutines" }}
/>

<Question
  prompt="The most common deep reason to choose a Python backend?"
  options={[
    { text: "It has the fastest raw performance" },
    { text: "Proximity to data science, ML, and AI — Python owns that ecosystem, so a data/AI-heavy product keeps API, pipelines, and models in one language" },
    { text: "It's the only language with web frameworks" },
    { text: "It shares code with a React frontend" }
  ]}
  correct={1}
  explanation="Python's decisive advantage is often its dominance of data/ML/AI (NumPy, pandas, PyTorch, LLM libs), not its web frameworks. Data/AI-centric products keep app, pipelines, and models in one ecosystem."
  revisit={{ to: "/docs/ecosystems/python-ecosystem#when-python-fits", label: "Python's home turf" }}
/>

<Question
  prompt="What's the single most reliable predictor of success when choosing a backend ecosystem?"
  options={[
    { text: "The language's raw benchmarks" },
    { text: "The team's fluency in the chosen stack (and what the org already runs) — competence and fit beat theoretical superiority; capability comparisons are tiebreakers" },
    { text: "The size of the standard library" },
    { text: "How new the language is" }
  ]}
  correct={1}
  explanation="A team expert in a stack out-delivers the same team stumbling through a 'better' but unfamiliar one. Weight 'what can this team ship and maintain?' highest; treat benchmarks as tiebreakers."
  revisit={{ to: "/docs/ecosystems/choosing-ecosystem#when-to-deliberately-leave-it", label: "Team fit wins" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 11: Solo / Personal](/docs/solo) — the first of the workflow-by-scale chapters, where the same kind of product is built at three very different company sizes.
