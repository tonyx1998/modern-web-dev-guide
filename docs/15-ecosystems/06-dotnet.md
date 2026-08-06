---
id: dotnet-ecosystem
title: .NET & C#
sidebar_position: 7
sidebar_label: .NET & C#
description: Modern .NET and C# — cross-platform, fast, and excellent for Microsoft-ecosystem and enterprise work; ASP.NET Core, and how it compares to JVM and Node.
---

# .NET & C#

> **In one line:** Modern .NET (with C#) is Microsoft's reinvented platform — now open-source, cross-platform, and genuinely fast — and it's the natural backend choice wherever an organization already lives in the Microsoft ecosystem (Azure, Active Directory, Office, Windows), occupying much the same enterprise niche as the JVM.

:::tip[In plain English]
.NET is to the Microsoft world what the JVM is to the broader enterprise world. **C#** is its primary language — a modern, statically-typed language that's evolved into one of the most pleasant mainstream languages to write. The crucial thing to know is that **.NET reinvented itself**: the old ".NET Framework" was Windows-only and proprietary; modern **.NET** (formerly ".NET Core") is open-source, runs on Linux and Mac, performs excellently, and is fully competitive with the JVM and Node. **ASP.NET Core** is its web framework. You'll find .NET most often where a company is already a "Microsoft shop" — using Azure, Active Directory, Windows servers, the Office stack — because the integration is tight and the tooling (Visual Studio) is hard to beat. For a web developer, C# will feel familiar coming from TypeScript (they share a designer and many ideas), and "comfortable in .NET" opens a large, well-paid slice of the enterprise market.
:::

## The reinvention you need to know about

The single most important fact, because it corrects a common outdated impression:

- **Old (.NET Framework):** Windows-only, proprietary, the thing people remember disliking.
- **Modern (.NET, née .NET Core, now just "**.NET**"):** open-source, cross-platform (Linux/Mac/Windows), high-performance, cloud-native. This is what "doing .NET" means today, and it competes head-to-head with the JVM and Node on the merits.

So "we run .NET" no longer implies Windows servers or vendor lock-in. Modern .NET services routinely run in Linux containers on any cloud.

## C# and ASP.NET Core

C# is statically typed, expressive, and consistently gains modern features (records, pattern matching, nullable reference types, async/await — which C# popularized). ASP.NET Core offers both a structured MVC/controller style and a concise "minimal API" style:

```csharp
// ASP.NET Core minimal API — concise, fast, and strongly typed.
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDb>();        // dependency injection built in
var app = builder.Build();

app.MapGet("/api/orders/{id}", async (long id, AppDb db) =>
    await db.Orders.FindAsync(id) is Order o
        ? Results.Ok(o)
        : Results.NotFound());

app.MapPost("/api/orders", async (CreateOrder req, AppDb db) => {
    var order = new Order(req.Items);
    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Created($"/api/orders/{order.Id}", order);
});

app.Run();
```

Notable ecosystem pieces: **Entity Framework Core** (the standard ORM), first-class **dependency injection** built into the framework, and tight integration with **Azure** and Microsoft identity. The developer experience in **Visual Studio** (and the lighter VS Code + C# Dev Kit) is widely considered among the best in any ecosystem.

:::info[Highlight: pick .NET when you have Microsoft gravity — the integration is the value]
The clearest signal that .NET is the right call is **existing Microsoft-ecosystem gravity**: you're on Azure, your identity is Active Directory / Entra ID, your org runs Windows and Office, your team knows C#. In that context, .NET is more than a good backend platform: it's the one that disappears into your existing infrastructure, with native Azure integration, first-party AD authentication, and unified tooling. That integration advantage is the same logic as [choosing Azure as your cloud](/docs/cloud/cloud-choosing) — the platform that fits your existing world out-ships the marginally-different alternative. Absent that gravity, .NET is still an excellent, fast, cross-platform choice on the merits; *with* it, it's usually the obvious one. Conversely, a startup with no Microsoft footprint and a JavaScript team has little reason to reach for it over Node, since the integration advantage that makes it shine isn't in play.
:::

## How it compares

.NET sits in the same broad niche as the JVM — statically typed, fast, mature, enterprise-grade, strong tooling — and the choice between them is usually about *ecosystem gravity* (Microsoft shop → .NET; broader/Java-heritage enterprise → JVM) more than raw capability. Versus Node/TypeScript, the tradeoffs mirror the [JVM comparison](./jvm-ecosystem): .NET brings static typing, true multi-threading, and strong performance for long-running and CPU-bound work, while Node wins on full-stack JS code sharing, fast startup for serverless, and startup-velocity. Modern .NET's performance is genuinely excellent — frequently at or near the top of mainstream backend benchmarks.

## Common mistakes

:::caution[Where people commonly trip up]
- **Thinking .NET is still Windows-only/proprietary.** Modern .NET is open-source and cross-platform; it runs in Linux containers on any cloud. Update the mental model.
- **Choosing .NET without Microsoft gravity.** Its biggest edge is Azure/AD/Office integration; absent that, a JS team has little reason to prefer it over Node. Pick it for the integration.
- **Confusing ".NET Framework" with modern ".NET."** They're different; new work targets modern .NET. Legacy .NET Framework apps are a separate (Windows-bound) world.
- **Assuming it's slow because it's enterprise.** Modern .NET is one of the fastest mainstream backends; performance is a strength, not a concern.
- **Overlooking how familiar C# is from TypeScript.** They share a designer and many concepts; a TS developer ramps on C# faster than they expect.
:::

## Page checkpoint

<Quiz id="dotnet-ecosystem-page" title="Did the .NET ecosystem stick?" sampleSize={3}>

<Question
  prompt="What's the most important correction to the common outdated impression of .NET?"
  options={[
    { text: "It now only runs on Windows" },
    { text: "Modern .NET (formerly .NET Core) is open-source, cross-platform (Linux/Mac/Windows), and high-performance — not the Windows-only proprietary '.NET Framework' people remember" },
    { text: "C# was replaced by F#" },
    { text: "It can no longer integrate with Azure" }
  ]}
  correct={1}
  explanation="The reinvention is the key fact: modern .NET is open-source, cross-platform, fast, and cloud-native, routinely running in Linux containers on any cloud. 'We run .NET' no longer implies Windows servers or lock-in."
  revisit={{ to: "/docs/ecosystems/dotnet-ecosystem#the-reinvention-you-need-to-know-about", label: "The reinvention" }}
/>

<Question
  prompt="When is .NET most clearly the right backend choice?"
  options={[
    { text: "For any startup, by default" },
    { text: "When there's existing Microsoft-ecosystem gravity — Azure, Active Directory/Entra ID, Windows/Office, a C# team — because the first-party integration makes it disappear into your existing infrastructure" },
    { text: "Only for desktop applications" },
    { text: "Whenever you need a NoSQL database" }
  ]}
  correct={1}
  explanation="Its standout advantage is integration with the Microsoft world (Azure, AD, tooling). With that gravity it's usually the obvious pick; without it, .NET is still excellent on the merits but a JS team has less reason to choose it over Node — the integration edge isn't present."
  revisit={{ to: "/docs/ecosystems/dotnet-ecosystem#c-and-aspnet-core", label: "Microsoft gravity" }}
/>

<Question
  prompt="How does .NET broadly compare to the JVM?"
  options={[
    { text: "They're completely different niches with no overlap" },
    { text: "They occupy the same niche (statically typed, fast, mature, enterprise-grade, strong tooling); the choice is usually about ecosystem gravity — Microsoft shop → .NET, broader/Java-heritage enterprise → JVM — more than raw capability" },
    { text: ".NET is for frontends, the JVM is for backends" },
    { text: ".NET can't do multi-threading while the JVM can" }
  ]}
  correct={1}
  explanation="Both are statically-typed, performant, mature, well-tooled enterprise platforms. They're substitutes more than complements, and the decision typically hinges on which ecosystem an organization already lives in rather than a capability gap."
  revisit={{ to: "/docs/ecosystems/dotnet-ecosystem#how-it-compares", label: ".NET vs JVM" }}
/>

</Quiz>

## What's next

→ Continue to [Go](./go-ecosystem) — a deliberately different philosophy: radical simplicity and built-in concurrency for cloud-native services.
