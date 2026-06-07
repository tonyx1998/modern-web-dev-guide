---
id: stage-0-setup
title: Stage 0 — Get set up
sidebar_position: 1
sidebar_label: Stage 0 — Setup
description: Install Node, VS Code, Git, and the terminal basics. Verify your environment with a "hello world" script.
---

# Stage 0 — Get set up

> **Time budget:** ~1 day

> **In one line:** Before you can write code, you need the tools to write it, run it, and save it.

Before you can write code, you need the tools to write it, run it, and save it. This stage is short but everyone gets stuck somewhere — usually on PATH issues on Windows or "permission denied" on Mac. Don't move on until `node --version` and `git --version` both print something.

### 1. Install Node.js (the JavaScript runtime)

Node lets you run JavaScript outside a browser. You'll use it to run every script in this guide, install libraries, and later run your servers. Install the **LTS** version (Long Term Support — the stable one) from [nodejs.org](https://nodejs.org).

Verify it worked by opening your terminal and running:

```bash
node --version
# should print something like v22.11.0

npm --version
# should print something like 10.9.0 — npm comes bundled with Node
```

For more on what npm is and how it fits in, see [Package Managers](/docs/stack/package-managers) and [Build tools](/docs/stack/build-tools).

### 2. Install VS Code (your editor)

Download [VS Code](https://code.visualstudio.com). It's free, by Microsoft, and the default editor for ~90% of professional web developers. Other options exist (Cursor, Zed, WebStorm) but start here — every tutorial assumes it.

Three extensions to install immediately (open the Extensions panel, search by name):

- **Prettier** — formats your code automatically on save. End of arguments about indentation forever.
- **ESLint** — catches common JavaScript mistakes as you type.
- **GitLens** — shows you who wrote each line and when. Indispensable once you read other people's code.

### 3. Install Git

Git tracks changes to your code. You'll learn it properly in Stage 4 — for now, just install it from [git-scm.com](https://git-scm.com) so it's there when you need it.

### 4. Terminal basics

The terminal (or "command line" or "shell") is a text interface for telling your computer what to do. On Mac/Linux, open **Terminal**. On Windows, use **PowerShell** (built in) or install **Windows Terminal** for a nicer experience. The six commands you'll use every day:

```bash
pwd              # print working directory — "where am I?"
ls               # list files in the current directory (Windows: dir)
cd folder-name   # change directory into folder-name
cd ..            # go up one level
mkdir new-folder # make a new folder
code .           # open VS Code in the current directory
```

If `code .` doesn't work, open VS Code, press `Ctrl/Cmd+Shift+P`, search for "Shell Command: Install 'code' command in PATH", and run it.

### 5. Your first program

Create a folder, open it in VS Code, make a file called `hello.js`, paste this in, save:

```js
console.log("Hello from JavaScript.");
const name = "world";
console.log(`Hello, ${name}!`);
```

In the VS Code terminal (`Ctrl/Cmd+\``), run:

```bash
node hello.js
```

You should see two lines print. Congratulations — you're a programmer now.

### Common pitfalls

- **Windows: "node is not recognized"** — Node didn't get added to your PATH. Restart your terminal; if still broken, reinstall and tick "Add to PATH" during setup.
- **Mac: "command not found: code"** — see the `Cmd+Shift+P` trick above.
- **"Permission denied"** on Mac/Linux — never use `sudo` with `npm`; it causes permission chaos later. Fix by installing Node via [nvm](https://github.com/nvm-sh/nvm) instead.
- **Don't fight your OS.** If something obscure breaks, search the exact error message — someone has hit it before, the answer is on Stack Overflow.

:::tip[Want to set up like a pro?]
This page is the minimum. [Stage 0+ — Set up like a pro](./pro-environment) is the optional upgrade: a real terminal, a modern shell, replacement CLI tools (ripgrep, fzf, bat), a Node version manager, a properly configured git, the `gh` CLI, and VS Code tuned the way working developers actually use it. Skim it now to see what's there; come back for upgrades as the default tools start to annoy you.
:::

## Where to go deeper

- [Node.js Learn](https://nodejs.org/en/learn) — short, official, covers the basics.
- [The Missing Semester (MIT)](https://missing.csail.mit.edu/) — a free course on terminal, git, and editors. Lectures 1–3 are the right level for now.

## Deeper in this guide

- [Package Managers](/docs/stack/package-managers) — what npm/pnpm/bun actually do.
- [Build tools](/docs/stack/build-tools) — Vite, esbuild, and the rest of the toolchain you'll meet soon.

## Project

:::tip[Project — Verify your environment]
Write three small scripts in a `stage-0/` folder: (a) `greet.js` that prints a greeting using a name in a variable; (b) `add.js` that adds two numbers and prints the result; (c) `date.js` that prints today's date. Run all three with `node filename.js`. Trivial, but proves your environment works end-to-end.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Skipping the version checks.** If `node --version` doesn't print, nothing else in this guide will work — chasing a phantom Node install error two stages later is a misery. Verify both `node --version` and `git --version` print something before moving on.
- **`sudo npm install` on Mac/Linux.** It works once and then permission-breaks every install after. If you hit "permission denied," uninstall Node and reinstall via [nvm](https://github.com/nvm-sh/nvm) — never reach for `sudo`.
- **Installing five editors before writing one line of code.** Cursor vs VS Code vs Zed is a great debate after you can ship. For now, install VS Code and move on; tutorials assume it.
- **Ignoring the terminal.** Most beginners try to avoid it; every senior dev lives in it. Spend 30 minutes on `pwd`, `ls`, `cd`, `mkdir` until they're automatic — the payoff compounds across every later stage.
:::

## Page checkpoint

<Quiz id="stage-0-page" title="Did Stage 0 stick?" sampleSize={3}>

<Question
  prompt="You install Node.js on Windows but `node --version` prints 'node is not recognized.' What's the most likely cause?"
  options={[
    { text: "Node failed to install — re-download from a different mirror" },
    { text: "Node installed, but it wasn't added to your PATH (often fixed by restarting the terminal or reinstalling with the 'Add to PATH' option ticked)" },
    { text: "Windows doesn't support Node — you need WSL" },
    { text: "npm is missing and node won't run without it" }
  ]}
  correct={1}
  explanation="When a command 'is not recognized,' the binary exists but your shell can't find it — it's not on PATH. Restarting the terminal often picks up a new PATH; a reinstall with the PATH checkbox is the bulletproof fix."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-0-setup#common-pitfalls", label: "Revisit: Common pitfalls" }}
/>

<Question
  prompt="Why does this guide tell Mac/Linux users to install Node via nvm instead of `sudo npm install`?"
  options={[
    { text: "nvm is faster than npm" },
    { text: "Using sudo with npm leaves files owned by root, which causes permission errors on every subsequent install" },
    { text: "Apple blocks npm without sudo" },
    { text: "nvm includes a built-in code editor" }
  ]}
  correct={1}
  explanation="`sudo npm install` writes files owned by root into your user directories. Later, normal (non-root) npm commands can't read or modify them — and the resulting errors are confusing because they look like 'random' permission bugs."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-0-setup#common-pitfalls", label: "Revisit: Common pitfalls" }}
/>

<Question
  prompt="What does the command `node hello.js` actually do?"
  options={[
    { text: "Opens hello.js in your browser" },
    { text: "Compiles hello.js into an executable binary on disk" },
    { text: "Runs the JavaScript file using Node's runtime, outside of any browser" },
    { text: "Uploads hello.js to nodejs.org for execution" }
  ]}
  correct={2}
  explanation="Node is a JavaScript runtime — it executes your .js file directly. No browser, no compilation step, no upload — the script runs locally and prints to your terminal."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-0-setup#5-your-first-program", label: "Revisit: Your first program" }}
/>

</Quiz>

→ [Next: Stage 1 — JavaScript basics](/docs/roadmap/part-1-from-zero/stage-1-javascript-basics) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
