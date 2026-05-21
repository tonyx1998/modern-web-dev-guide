---
id: apis-realtime
title: 'Real-Time: gRPC, WebSockets & SSE'
sidebar_position: 18
sidebar_label: 17. Real-Time APIs
description: When the server needs to push data to the client — chat, live dashboards, LLM streaming — request/response isn't enough. WebSockets, SSE, and gRPC fill the gap.
---

# Real-Time: gRPC, WebSockets & SSE

> **In one line:** REST and GraphQL are *pull* — the client always asks first. WebSockets and SSE let the server *push* data the moment it has something new. gRPC is a high-performance binary protocol used mostly between internal services.

:::tip In plain English
Imagine a chat app. With pure REST, the client would have to keep asking the server "any new messages? any new messages? any new messages?" every second (this is called **polling** and it's wasteful). With a **WebSocket**, the client opens *one* connection and the server pushes new messages down it the moment they arrive. **SSE (Server-Sent Events)** is similar but only one-way (server → client). **gRPC** is something different — a high-performance binary protocol used between *back-end services*, rarely directly by browsers.
:::

## WebSockets — bidirectional, real-time

**WebSockets** open a persistent bidirectional connection. Either side can send messages anytime, with very low latency. The connection starts as a regular HTTP request, but the special `Upgrade: websocket` header tells the server to "switch protocols" — after that, it's no longer HTTP, it's a long-lived two-way pipe.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: HTTP GET /chat<br/>Upgrade: websocket
    Server-->>Client: 101 Switching Protocols
    Note over Client,Server: Connection now stays open
    Client->>Server: "Hello!"
    Server-->>Client: "Hi! who's there?"
    Client->>Server: "Tony"
    Server-->>Client: "user42 just joined"
    Note over Server: Server pushed this<br/>without being asked
```

> **Reading this diagram:** The first two arrows are the "upgrade dance" — one HTTP exchange that promotes the connection to a WebSocket. After that, either side can speak at any time. Notice the last server message wasn't a response to anything — that's the *push* capability you can't get with plain REST.

**Best for:**
- Chat applications.
- Collaborative editing (Google Docs-style).
- Multiplayer games.
- Real-time dashboards with bidirectional control.

**The trade-offs:**
- Each open connection consumes server memory. Scaling to millions of concurrent WebSockets is non-trivial.
- Reconnection logic is on you (or your library).
- Doesn't go through some old proxies and load balancers cleanly.

## SSE — Server-Sent Events (one-way streaming)

**Server-Sent Events** are simpler: a long-lived HTTP connection where the server streams text events to the client. One-way only (server → client). No special protocol — it's just plain HTTP that doesn't close.

```javascript
// Client side
const events = new EventSource('/api/notifications');
events.onmessage = (e) => {
  console.log('Got:', e.data);
};
```

```http
# What the server sends (it's just HTTP):
HTTP/2 200 OK
Content-Type: text/event-stream

data: New comment on your post
\n
data: Someone followed you
\n
data: New email
\n
```

**Pros:**
- Simpler than WebSockets — no upgrade dance.
- Works with HTTP/2 multiplexing (many SSE streams over one connection).
- Automatic reconnection built into browsers.
- Easier to scale than WebSockets.

**Cons:**
- One-way only.
- Limited to text data.

:::info Highlight: SSE is the workhorse of LLM streaming
Every AI chat interface you've used (ChatGPT, Claude, Gemini) streams the assistant's response token-by-token using SSE. That "typewriter" effect isn't decorative — it's the server sending each token over an SSE stream as soon as the LLM produces it.

If you're building any AI feature with streaming responses, you'll use SSE. It's the dominant 2026 pattern.
:::

## When to use what (the decision)

| Need                                              | Use                  |
|---------------------------------------------------|----------------------|
| Server pushes updates (notifications, dashboards, LLM streaming) | **SSE**     |
| Both sides talk in real time (chat, multiplayer) | **WebSockets**       |
| Internal service-to-service, high performance     | **gRPC**             |
| Collaborative editing (Notion, Figma)             | WebSockets + **CRDTs** (Yjs, Liveblocks) |
| Just polling for occasional updates               | Plain REST + polling |

## gRPC — internal service communication

**gRPC** is a high-performance binary protocol developed by Google. Used almost exclusively for **service-to-service** communication inside large architectures (frontend doesn't usually speak gRPC directly).

```protobuf
// users.proto - the contract
service UserService {
  rpc GetUser (UserRequest) returns (User);
  rpc StreamUsers (UserFilter) returns (stream User);
}

message UserRequest {
  int64 id = 1;
}
```

**Pros:**
- Very fast (binary, multiplexed over HTTP/2).
- Strongly-typed contracts (Protocol Buffers, language-agnostic).
- Built-in streaming (both directions).
- Auto-generates clients for Go, Java, Python, Node, Rust, etc.

**Cons:**
- Browser support requires a proxy (gRPC-Web).
- Harder to debug than REST (binary payloads).
- Tooling is heavier than REST.

You'll meet gRPC when you join an established backend team — not when you're starting a personal project.

:::note Worked example: a chat app's protocol stack
A modern chat app might use *all* of these:

| Layer                       | Protocol                                                |
|-----------------------------|---------------------------------------------------------|
| Login (one-time)            | REST (POST /login)                                      |
| Fetching history (once)     | REST (GET /messages?before=...)                         |
| Receiving live messages     | WebSocket                                               |
| Notifications when tab inactive | SSE (battery-friendlier than persistent WebSocket) |
| Backend chat service ↔ moderation service | gRPC                                  |

Each protocol fits a specific role; together they make the app feel instant.
:::

:::info Highlight: don't over-engineer real-time
For most personal/startup projects, **plain REST with periodic polling is fine** until you have a real performance problem. WebSockets and SSE are "you'll know when you need them" tools. Don't add a WebSocket server to a static blog because it sounds cool.
:::

## What's next

→ Continue to [Relational (SQL) Databases](./databases-sql) where we leave APIs behind and look at *where the data lives* — starting with the dominant default, Postgres.
