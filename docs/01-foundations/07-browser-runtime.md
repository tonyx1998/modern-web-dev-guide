---
id: browser-runtime
title: The Browser as a Runtime
sidebar_position: 8
sidebar_label: 7. Browser Runtime
description: A modern browser is not a viewer — it's a sophisticated application platform with a network stack, multiple parsers, a JIT compiler, and 100+ Web APIs.
---

# The Browser as a Runtime

> **In one line:** Your browser is not a document viewer. It's a 50-million-line application runtime that happens to also display web pages.

:::tip[In plain English]
The browser does an *astonishing* amount when you open a tab. It speaks every major network protocol, parses HTML/CSS in milliseconds, JIT-compiles JavaScript to machine code on the fly, drives the GPU to paint pixels, sandboxes pages from each other, talks to your camera and microphone, plays video, stores databases locally, and exposes 200+ APIs to the code running inside it. "Open a browser tab" is closer to "boot a small operating system" than to "open a PDF."
:::

## What's inside a browser

A modern browser bundles together:

1. **A network stack** — DNS, TCP/UDP, TLS, HTTP/1.1, HTTP/2, HTTP/3.
2. **An HTML parser** — turns HTML text into the **DOM** (Document Object Model — a tree of objects in memory).
3. **A CSS engine** — parses stylesheets, calculates which rules apply where.
4. **A JavaScript engine** — V8 (Chrome/Edge), JavaScriptCore (Safari), SpiderMonkey (Firefox). These engines JIT-compile JavaScript to machine code at runtime.
5. **A layout engine** — calculates where every element goes on screen.
6. **A rendering engine** — turns the layout into pixels (often using the GPU).
7. **Web APIs** — hundreds of them (see below).
8. **A storage layer** — cookies, localStorage, IndexedDB, Cache API.
9. **A security sandbox** — isolates pages from each other and from your OS.

:::info[Highlight: the DOM is "just" a tree of JavaScript objects]
The HTML you write looks like text. But the moment the browser parses it, that text becomes a **tree of in-memory objects** — the DOM. Every `<div>` is an object with properties (`textContent`, `style`, `children`), methods (`addEventListener`, `appendChild`), and references to its parent and siblings.

Once you internalize that, manipulating the page in JavaScript stops feeling magical: you're just calling methods on a tree of objects.
:::

## Key Web APIs to know exist

Modern browsers expose remarkable capabilities. You don't need to memorize this list — just know they exist so you know where to look:

| Category         | API                  | What it lets you do                                       |
|------------------|----------------------|-----------------------------------------------------------|
| Network          | **Fetch API**         | Make HTTP requests (the modern replacement for XHR)       |
|                  | **WebSockets**        | Persistent bidirectional connections                      |
|                  | **Server-Sent Events**| Server-pushed updates over a long-lived HTTP connection   |
|                  | **WebRTC**            | Peer-to-peer video, audio, data (Zoom, Discord voice)     |
|                  | **WebTransport**      | Low-latency multiplexed connections over HTTP/3           |
| Graphics & media | **WebGL / WebGPU**    | 3D graphics; WebGPU also enables compute shaders          |
|                  | **Web Audio API**     | Synthesize and process audio                              |
|                  | **WebCodecs**         | Low-level encode/decode of video and audio                |
| Storage          | **localStorage**      | Tiny key-value storage (~5MB), sync                       |
|                  | **IndexedDB**         | Browser-side database for large structured data           |
|                  | **Cache API**         | Programmatic cache, used by Service Workers               |
| Devices          | **Web Speech API**    | Text-to-speech and speech recognition                     |
|                  | **WebAuthn**          | Passwordless auth using passkeys/biometrics               |
|                  | **Web NFC / Bluetooth / Serial** | Hardware access                                |
|                  | **File System Access**| Read/write local files (with permission)                  |
| Performance      | **Service Workers**   | Programmable proxy between page and network (offline, push, sync) |
|                  | **Web Workers**       | Run JS on background threads                              |
|                  | **WebAssembly (Wasm)**| Run Rust/C++/Go in the browser at near-native speed       |
| UI               | **Web Components**    | Native custom HTML elements                               |

In 2026, the browser is genuinely a full application platform. The phrase "you can build it on the web" is true for the vast majority of applications.

:::note[Try it yourself]
Open DevTools and run this in the Console of any tab:

```javascript
Object.keys(window).length
```

You'll see hundreds — that's the number of global objects and APIs the browser exposes to every page. Then try:

```javascript
Object.keys(window).filter(k => k.match(/^[A-Z]/)).slice(0, 30)
```

You'll see names like `URL`, `WebSocket`, `Notification`, `Worker`, `crypto`, `localStorage`. Every one is an entire subsystem you can program.
:::

## The single main thread

JavaScript runs on a single **main thread** in the browser. That same thread also handles:

- Parsing HTML and CSS
- Running event handlers
- Layout calculations
- Painting

If your JS blocks the thread for 200ms, nothing else can happen — the page becomes unresponsive. This is the single biggest source of "janky" feeling web pages.

**Web Workers** let you run JS on background threads, but workers can't access the DOM. They're useful for heavy computation (image processing, parsing large files, running ML models).

:::info[Highlight: the 16ms budget]
A 60fps animation needs the browser to render a frame every **16.6 milliseconds**. If a JavaScript callback takes longer than 16ms on the main thread, you'll *drop a frame* — the animation visibly stutters. This is why performance engineers obsess over keeping callbacks short and moving heavy work to Web Workers, requestIdleCallback, or the server.
:::

## What's next

→ Continue to [The Rendering Pipeline](./rendering-pipeline) where we'll trace exactly how HTML becomes pixels, and why some CSS properties are 60fps smooth while others stutter.
