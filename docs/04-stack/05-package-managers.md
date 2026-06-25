---
id: package-managers
title: Package Managers
sidebar_position: 6
sidebar_label: Package Managers
description: How dependencies get installed and managed. pnpm, Bun, npm, Yarn — and which to pick.
---

# Package Managers

> **In one line:** A package manager installs and updates the libraries your project depends on. Bun is fastest; pnpm is strictest; npm comes with Node and works fine.

:::tip[In plain English]
Your project depends on hundreds of libraries — React, Tailwind, TypeScript, etc. — written by other people and published to **npm** (the central registry). A **package manager** is the tool that downloads those libraries to your machine, keeps them current, and locks the exact versions so your teammates get the same setup. The choice mostly affects *speed* and *disk usage*, not correctness.
:::

## pnpm — fast and efficient

pnpm uses a content-addressable store: every package version is stored once on disk and hardlinked into projects. Saves enormous amounts of disk space; install is fast.

```bash
npm install -g pnpm
pnpm install
pnpm add react
```

**Why teams choose it:**

- Faster than npm.
- Disk-efficient (huge for monorepos).
- Strict dependency resolution (catches phantom dependencies).
- Excellent monorepo support.

## Bun (as a package manager)

The fastest package installer available. Compatible with `package.json`.

```bash
bun install        # Install everything in package.json
bun add react      # Add a dependency
bun add -D vitest  # Add a dev dependency
bun remove react   # Remove a dependency
```

Bun's package installer is *dramatically* faster than npm/pnpm/yarn — often 10–30× faster on cold installs.

## npm

Comes bundled with Node.js. Fine for simple projects. Slower than alternatives but universally available.

```bash
npm install
npm install react
```

## Yarn

Was the popular alternative to npm in the late 2010s. Yarn 1 is legacy; Yarn 4 (modern, with PnP and workspaces) is innovative but niche.

## Decision matrix

| Use case                  | Recommendation     |
|--------------------------|--------------------|
| Solo projects / small teams | Bun for speed   |
| Larger teams / monorepos  | pnpm for strictness |
| Just learning, on Node already | npm is fine  |
| Yarn shop already         | Yarn 4 if modernized; otherwise switch |

:::info[Highlight: the lockfile is the source of truth]
Whichever package manager you choose, **commit the lockfile** (`package-lock.json`, `pnpm-lock.yaml`, `bun.lock`, `yarn.lock`). The lockfile records the *exact* version of every package — including transitive dependencies — that was installed. Without it, your teammates and CI servers can get different versions and you'll hit "works on my machine" bugs.

The lockfile is more important than which package manager produced it.
:::

:::note[Try it yourself]
```bash
# In an empty folder:
echo '{"name":"test","version":"1.0.0"}' > package.json

# Time each one (cold cache):
time npm install react
time pnpm install react
time bun add react
```

You'll see a dramatic spread. Bun is usually 5–10× faster than npm on the same machine, and pnpm sits comfortably in between.
:::

## Supply-chain security

When you install a package, you're not just running its code — you're running the code of everything *it* depends on, transitively, often hundreds of packages written by people you've never heard of. That's the **software supply chain**, and it's a real attack surface: a compromised dependency runs with the same access your project has. A few concept-first defenses, roughly in order of effort:

**`npm audit` — know your known vulnerabilities.** Every package manager can cross-check your installed versions against a public database of disclosed vulnerabilities.

```bash
npm audit            # list known CVEs in your dependency tree
npm audit fix        # upgrade to patched versions where it's safe
```

It only catches *publicly disclosed* issues, and `audit fix` won't apply upgrades that would break your version ranges — but it's the cheapest first look at "am I shipping a known hole?"

**Dependabot / Renovate — keep dependencies fresh automatically.** Staying patched by hand doesn't scale. **Dependabot** (built into GitHub) and **Renovate** (configurable, works anywhere) watch your lockfile and open pull requests when a dependency has a newer or security-patched version. Your CI runs the test suite against each PR, so you review a small, isolated bump instead of a giant once-a-year upgrade. The win is *small, continuous, tested* updates rather than a scary big-bang.

**The lockfile is a defense, not just reproducibility.** You already commit `package-lock.json` (or `pnpm-lock.yaml`, `bun.lock`) for reproducible installs — but it's also a *security* boundary. The lockfile pins the exact resolved version *and* an integrity hash of every package. That means a teammate's stray `install` can't silently pull a brand-new `1.4.0` of a dependency, and a tampered package whose contents don't match the recorded hash fails the install. Deleting the lockfile to "clean up" throws that protection away.

**Typosquatting and postinstall scripts — the two classic traps.**

- **Typosquatting** — Attackers publish malicious packages with names one keystroke off a popular one (`reactt`, `loadsh`, `crossenv` vs `cross-env`). A typo in `npm install` and you've installed the attacker's code. Slow down on install commands, copy names from official docs, and watch for a package with suspiciously few downloads where you expected millions.
- **Postinstall scripts** — A package can run arbitrary code on your machine *at install time* via lifecycle scripts (`postinstall`). That's how a malicious dependency steals environment variables or tokens before you ever import it. You can disable lifecycle scripts by default (`npm install --ignore-scripts`, or pnpm's allowlist for which packages may run scripts) and re-enable only the few that genuinely need them.

:::info[Highlight: defense in depth, cheap to expensive]
No single control is enough. The practical stack: **commit the lockfile** (free, do it always) → **run `npm audit` in CI** (cheap) → **turn on Dependabot/Renovate** (set up once, runs forever) → **restrict postinstall scripts** and **double-check package names** (habit). Each layer catches what the others miss.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Mixing package managers in one repo.** Running `npm install` in a project with a `pnpm-lock.yaml`, or `bun install` next to a `package-lock.json`, produces a second lockfile and silently different versions. Pick one per repo, commit *its* lockfile, delete the others.
- **Adding `node_modules` to git or `.gitignoring` the lockfile.** Exactly backwards. Lockfile in git; `node_modules` out. The lockfile is the contract; `node_modules` is regenerated from it.
- **Running `npm install` in CI instead of `npm ci` (or `pnpm install --frozen-lockfile`).** Plain `install` is allowed to mutate the lockfile, which means CI can quietly upgrade transitive deps mid-deploy. Use the frozen/clean variant — fast, deterministic, and fails loudly if the lockfile is stale.
- **Trusting `^1.2.3` to be safe.** Caret ranges allow any minor or patch update; a malicious or buggy 1.4.0 can land via a teammate's local `install`. The lockfile is what actually protects you — never delete it to "clean up."
- **Switching to Bun mid-project for speed, then hitting one incompatible native module and panicking.** Bun's Node compatibility is excellent but not perfect. Migrate during a quiet week, run your full test suite first, and keep your fallback (npm/pnpm) installable for a sprint.
:::

## Page checkpoint

<Quiz id="stack-package-managers-page" title="Did package managers stick?" sampleSize={3}>

<Question
  prompt="Why is committing the lockfile (package-lock.json, pnpm-lock.yaml, bun.lock, etc.) more important than which package manager produced it?"
  options={[
    { text: "The lockfile makes installs faster" },
    { text: "The lockfile pins exact versions of every package — including transitive deps — so teammates and CI get identical installs" },
    { text: "The lockfile is required to publish to npm" },
    { text: "Without the lockfile, package managers won't run at all" }
  ]}
  correct={1}
  explanation="The lockfile records the exact resolved version of every package (direct and transitive). Without it, different machines can install slightly different versions and you hit 'works on my machine' bugs."
  revisit={{ to: "/docs/stack/package-managers#decision-matrix", label: "Lockfile is source of truth" }}
/>

<Question
  prompt="What does pnpm do differently to save disk space across many projects?"
  options={[
    { text: "It compresses every node_modules directory with gzip" },
    { text: "It stores each package version once in a content-addressable store and hardlinks it into each project" },
    { text: "It deletes unused packages from your global cache nightly" },
    { text: "It refuses to install dependencies you've already installed elsewhere" }
  ]}
  correct={1}
  explanation="pnpm keeps a single global content-addressable store and hardlinks files into each project's node_modules. The same package version isn't duplicated across projects — huge wins in monorepos."
  revisit={{ to: "/docs/stack/package-managers#pnpm--fast-and-efficient", label: "pnpm section" }}
/>

<Question
  prompt="Which package manager is highlighted as the fastest installer in 2026, often 10–30× faster than npm on cold installs?"
  options={[
    { text: "Yarn 1" },
    { text: "npm" },
    { text: "pnpm" },
    { text: "Bun" }
  ]}
  correct={3}
  explanation="Bun's installer is the fastest available — typically 10–30× faster than npm on cold installs — and it's compatible with regular `package.json`."
  revisit={{ to: "/docs/stack/package-managers#bun-as-a-package-manager", label: "Bun as a package manager" }}
/>

<Question
  prompt="What's the right recommendation for a larger team working in a monorepo who wants strict dependency resolution?"
  options={[
    { text: "Stick with npm because it ships with Node" },
    { text: "Use pnpm — fast, disk-efficient, and strict about phantom dependencies" },
    { text: "Use Yarn 1, which is still the standard for monorepos" },
    { text: "Skip a package manager entirely and vendor dependencies" }
  ]}
  correct={1}
  explanation="pnpm is the conservative pick for larger teams and monorepos: faster than npm, disk-efficient, and strict enough to catch phantom dependencies (packages you use without declaring them)."
  revisit={{ to: "/docs/stack/package-managers#decision-matrix", label: "Decision matrix" }}
/>

<Question
  prompt="As a supply-chain defense, what does committing the lockfile protect against that reproducibility alone doesn't describe?"
  options={[
    { text: "It encrypts your dependencies at rest" },
    { text: "It pins exact versions plus an integrity hash, so a stray `install` can't silently pull a new version and a tampered package fails the install" },
    { text: "It scans your code for SQL injection" },
    { text: "It blocks all postinstall scripts automatically" }
  ]}
  correct={1}
  explanation="The lockfile records the exact resolved version and an integrity hash of every package. That stops a teammate's stray install from silently upgrading a dependency, and a tampered package whose contents don't match the hash fails to install. It's a security boundary, not just reproducibility — which is why deleting it to 'clean up' is a bad idea."
  revisit={{ to: "/docs/stack/package-managers#supply-chain-security", label: "Supply-chain security" }}
/>

</Quiz>

## What's next

→ Continue to [State Management](./state-management) — how your app keeps track of data and UI state across components.
