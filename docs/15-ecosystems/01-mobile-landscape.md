---
id: mobile-landscape
title: The Mobile Landscape
sidebar_position: 2
sidebar_label: Mobile landscape
description: Native vs cross-platform vs PWA, the app-store reality (review, fees, update lag), the cross-cutting mobile concerns, and a decision framework.
---

# The Mobile Landscape

> **In one line:** Building for phones means choosing among writing the app twice in each platform's native language (best fidelity, most cost), writing it once with React Native or Flutter (most teams' default), or shipping a capable web app/PWA (cheapest, but no app store and limited device access) — and the right choice falls out of how much you need native fidelity, device features, and store presence versus speed and budget.

:::tip[In plain English]
A phone app can be built three ways. **Native** means using Apple's tools/languages (Swift) for iOS and Google's (Kotlin) for Android — two separate codebases, the best possible performance and platform fit, and roughly double the work. **Cross-platform** (React Native, Flutter) means one codebase that produces both iOS and Android apps — you trade a little fidelity and the occasional native escape-hatch for roughly halving the effort, which is why most product teams start here. **Web/PWA** means just building a really good mobile website that users can "install" to their home screen — cheapest by far, instantly updatable, but it can't be in the App Store and can't reach all device features. There's no universally right answer; there's a right answer *for your constraints*, and this page is the framework for finding it.
:::

## The three approaches

| | **Native (Swift / Kotlin)** | **Cross-platform (React Native / Flutter)** | **Web / PWA** |
|---|---|---|---|
| Codebases | Two (one per platform) | One | One (it's your website) |
| Performance / fidelity | Best — full platform fit | Very good; ~native for most apps | Good; not quite app-feel |
| Device access | Everything, first | Most, via libraries/plugins; native modules for the rest | Limited (improving, but gated) |
| App store presence | Yes | Yes | No (it's a URL) |
| Update speed | Gated by store review | Mostly store-gated (some OTA for JS) | Instant — you deploy the web |
| Team skills | Swift + Kotlin specialists | Your web (RN) or Dart (Flutter) devs | Your existing web team |
| Cost / speed | Highest | Medium | Lowest |

**Native** wins when you need maximum performance, the latest platform features the day they ship, or pixel-perfect platform feel (high-end games, deeply device-integrated apps). The cost is two codebases and two skill sets. **Cross-platform** is the pragmatic default for most product apps — one team, one codebase, near-native results, with a native escape hatch for the rare bits that need it. **Web/PWA** wins when budget/speed dominate and you don't truly need the store or deep device access — covered in depth on [its own page](./pwa).

## The app-store reality (the part web devs underestimate)

Shipping to the App Store / Play Store is a different world from `git push` deploys, and it surprises everyone coming from the web:

- **Review & gatekeeping.** Apple (and to a lesser degree Google) *review* your app before it goes live, and can reject it — for guideline violations, for using a private API, sometimes for business-model reasons (famously, taking payments outside their system). A rejection can block a launch for days.
- **You can't hotfix instantly.** A critical bug in a shipped native app means submitting a new build and waiting for review — hours to days — *then* waiting for users to update. This is why **feature flags and remote config are even more vital in mobile than on the web**: you want to disable a broken feature server-side without a new build, because you can't deploy your way out at web speed. (Cross-platform tools offer some over-the-air JS updates to soften this.)
- **The 15–30% fee.** The stores take a cut of in-app digital purchases. It shapes business models and is a recurring source of friction and litigation.
- **Fragmentation, especially Android.** Thousands of device/OS combinations, screen sizes, and OS versions to support — far more variety than browsers.

:::info[Highlight: the cross-cutting mobile concerns you'll meet regardless of framework]
Whatever you build with, mobile forces a set of problems the web mostly hides:
- **Offline & sync.** Phones lose connectivity constantly. A good mobile app works offline and *syncs* when back online — which drags in the [distributed-systems](/docs/distributed-systems/idempotency) reality of conflict resolution and idempotency on the client side. This is genuinely hard and often the bulk of a mobile app's complexity.
- **Push notifications.** A core engagement channel with their own infrastructure (APNs for Apple, FCM for Google) and permission models.
- **App lifecycle & battery/memory limits.** The OS can suspend or kill your app; background work is restricted to protect battery. You don't get to "just keep running."
- **Deep links & app/web continuity.** Linking into a specific screen, and handing off between your web and app experiences.
- **Slow release cadence + forced version support.** Because users update on their own schedule, you support *old* versions of your app in the wild for months — your backend APIs must stay backward-compatible with app versions you shipped long ago. You can't assume everyone's on the latest, the way you can with a web app.

These — not the UI framework — are usually where mobile effort actually goes. Choosing RN vs Flutter vs native is a smaller decision than people think; *these realities apply to all of them.*
:::

:::note[Worked example: the startup that should have shipped a PWA first]
A four-person startup with a web team decides their MVP "needs to be a real app" and spends four months building native iOS *and* Android apps — learning Swift and Kotlin, fighting two review processes, building offline sync twice. They launch late, with a fraction of the features they'd planned, and discover their core value (a content/dashboard product) needed none of the deep device features that justify native. The counterfactual: ship a polished **PWA** in three weeks (their existing skills, instant updates, installable to the home screen), validate the product, and *then* — once they knew it worked and had revenue — invest in **React Native** to get store presence with one codebase and their web skills, dropping to native only for the one screen that needed it. The lesson is the guide's recurring one: **don't pay for native fidelity you haven't proven you need.** Match the approach to the stage — cheapest thing that validates first, native investment when the requirements actually demand it.
:::

## The decision framework

```
Do you truly need App Store presence OR deep device features (camera-heavy,
Bluetooth, background location, ARKit, etc.) OR offline-first?
        │
        ├─ No  → A PWA / great mobile web app is probably enough. Start there.
        │
        └─ Yes → Need maximum performance / latest-day platform features / pixel-perfect feel?
                    ├─ Yes → Native (Swift + Kotlin)
                    └─ No  → Cross-platform:
                              • React Native if your team is React/TypeScript
                              • Flutter if you want the most consistent UI across platforms
                                or have no existing web-skill bias
```

## Common mistakes

:::caution[Where people commonly trip up]
- **Building native (×2) before validating you need it.** It's the most expensive path; reserve it for proven performance/fidelity/device requirements. Start cheaper and earn native.
- **Assuming a website isn't 'enough.'** For content, dashboards, tools, and many SaaS apps, a PWA covers it without app-store overhead. Check before committing to native.
- **Underestimating the store gatekeeping and update lag.** You can't hotfix at web speed; plan for review delays and lean hard on feature flags / remote config.
- **Forgetting backward compatibility for old app versions.** Users run versions you shipped months ago; your APIs must keep supporting them. You can't force everyone to update.
- **Treating offline/sync as a small feature.** It's often the hardest part of a mobile app — conflict resolution, idempotency, queued mutations. Budget for it.
- **Overweighting the RN-vs-Flutter-vs-native choice.** The cross-cutting concerns (offline, push, lifecycle, releases) dominate the work regardless of framework; pick on team skills and move on.
:::

## Page checkpoint

<Quiz id="mobile-landscape-page" title="Did the mobile landscape stick?" sampleSize={3}>

<Question
  prompt="A four-person web team needs an MVP for a content/dashboard product. Which approach does the chapter recommend starting with, and why?"
  options={[
    { text: "Native iOS + Android, for maximum quality from day one" },
    { text: "A PWA / great mobile web app — it uses their existing skills, updates instantly, and the product doesn't need deep device features or store presence yet; invest in native later only if proven necessary" },
    { text: "Flutter, because Dart is easiest to learn" },
    { text: "Two separate native codebases to avoid cross-platform compromises" }
  ]}
  correct={1}
  explanation="Don't pay for native fidelity you haven't proven you need. For content/dashboard products without deep device requirements, a PWA validates fastest using the team's existing skills, then you can graduate to React Native (store presence, one codebase) and native only where required."
  revisit={{ to: "/docs/ecosystems/mobile-landscape#the-decision-framework", label: "Mobile decision framework" }}
/>

<Question
  prompt="Why are feature flags and remote config even more important for mobile apps than for web apps?"
  options={[
    { text: "Mobile devices have less memory" },
    { text: "You can't hotfix a shipped native app at web speed — a new build needs store review (hours to days) and then users must update — so disabling a broken feature server-side via a flag is often the only fast remedy" },
    { text: "App stores require feature flags" },
    { text: "Flags make apps download faster" }
  ]}
  correct={1}
  explanation="Native deploys are gated by store review and user-update lag, so you can't 'just deploy a fix.' Server-side feature flags / remote config let you turn off a broken feature without a new build — the fast escape hatch the web gets for free via redeploy."
  revisit={{ to: "/docs/ecosystems/mobile-landscape#the-app-store-reality-the-part-web-devs-underestimate", label: "Store update lag" }}
/>

<Question
  prompt="The chapter argues the RN-vs-Flutter-vs-native choice is smaller than people think. What dominates mobile effort regardless of framework?"
  options={[
    { text: "Choosing app icons and splash screens" },
    { text: "Cross-cutting concerns — offline & sync (with conflict resolution/idempotency), push notifications, app lifecycle/battery limits, deep links, and supporting old app versions in the wild" },
    { text: "Writing CSS for different screen sizes" },
    { text: "Picking a state-management library" }
  ]}
  correct={1}
  explanation="The hard, time-consuming parts of mobile — offline/sync, push infrastructure, OS lifecycle restrictions, deep linking, and backward-compatible APIs for old shipped versions — apply to every framework. So pick the UI framework mostly on team skills and focus energy on those realities."
  revisit={{ to: "/docs/ecosystems/mobile-landscape#the-app-store-reality-the-part-web-devs-underestimate", label: "Cross-cutting concerns" }}
/>

</Quiz>

## What's next

→ Continue to [React Native](./react-native) — the most natural mobile path for a team that already knows React and TypeScript.
