---
id: pro-environment
title: Stage 0+ — Set up like a pro
sidebar_position: 1.5
sidebar_label: Stage 0+ — Pro setup
description: An optional upgrade on top of Stage 0. The terminal, shell, CLI tools, git config, editor, and dotfiles that a working web developer actually uses every day.
---

# Stage 0+ — Set up like a pro

> **Time budget:** ~half a day, plus a few weeks of "oh, that's better" as muscle memory builds.

> **In one line:** Stage 0 gets you to "I can run a script." This page gets you to "my machine works like a working web developer's machine."

[Stage 0](./stage-0-setup) is the minimum: Node, VS Code, Git, a terminal. That's enough to follow this guide. But once you've shipped your first few projects, you'll notice senior developers' machines feel *different* — they fly through tasks with two keystrokes, never reach for the mouse, and never spend ten minutes hunting for a file.

That difference is not talent. It's a small stack of tools and habits that anyone can install in an afternoon. This page is the opinionated 2026 version of that stack.

:::tip[When to do this]
Don't do this on day one — finish [Stage 0](./stage-0-setup), write a few scripts, and feel the friction of the default tools first. You'll learn faster when each upgrade fixes a real annoyance you've already met. A good moment is around Stage 4 (Git), once the terminal is a place you visit daily rather than a place you tolerate.

If you already write code professionally and you're skimming: read this top-to-bottom and treat the headings as a checklist. Most working devs are missing one or two of these.
:::

## The mindset: your machine is a tool you sharpen

A carpenter doesn't use the saw the factory shipped without sharpening it. Working developers don't use the default shell, the default `git config`, or the default editor settings. *Invest fifteen minutes now in something you'll do a hundred times a week* — over a year, that's hours saved with compound interest.

The whole list looks long, but most items are one command. Pick the ones that fix annoyances you've actually felt. Skip the rest until they become annoying.

---

## 1. A real terminal

The terminal is where most of your day lives — sharpen it first.

- **macOS** — install [iTerm2](https://iterm2.com/), [Ghostty](https://ghostty.org/), or [WezTerm](https://wezfurlong.org/wezterm/). Any of the three is fine; pick one. The built-in Terminal.app is functional but lacks split panes, modern fonts, and GPU rendering.
- **Windows** — install [Windows Terminal](https://aka.ms/terminal) (it's a real Microsoft product, free in the Store). And install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) — *Windows Subsystem for Linux*. Run `wsl --install` in an admin PowerShell. From now on, most dev work happens inside Ubuntu inside WSL2, not in raw Windows. Every Node project, every npm command, every git command — inside WSL. Files live in your Linux home, not on `C:\`. This eliminates 90% of the Windows-specific weirdness you'd otherwise hit.
- **Linux** — your distro's terminal is already fine. If you want fancier, try WezTerm or Alacritty.

Pick a **programming font** with ligatures: [JetBrains Mono](https://www.jetbrains.com/lp/mono/), [Fira Code](https://github.com/tonsky/FiraCode), or [Cascadia Code](https://github.com/microsoft/cascadia-code). They turn `=>` and `!==` into single glyphs and make code instantly easier to scan.

## 2. A modern shell

On macOS and Linux, the shell is usually `zsh` (default on macOS) or `bash`. Either works — `zsh` is slightly nicer out of the box. On Windows inside WSL, you get `bash` by default; switch to `zsh` if you want.

Install **[Starship](https://starship.rs/)** for your prompt. One command:

```bash
curl -sS https://starship.rs/install.sh | sh
```

Then add one line to `~/.zshrc` (or `~/.bashrc`):

```bash
eval "$(starship init zsh)"   # or bash
```

You now have a prompt that shows your git branch, Node version, and current directory automatically. It looks like this:

```
~/projects/my-app on  main [!?] via  v22.11.0
❯
```

On native Windows PowerShell (outside WSL), install **[Oh My Posh](https://ohmyposh.dev/)** instead — same idea, runs in PowerShell.

## 3. Modern CLI tools

Replace the 1980s defaults with their modern counterparts. Each one is faster, friendlier, and more colorful than what it replaces.

| Default | Replace with | What you get |
|---------|--------------|--------------|
| `grep` | [`ripgrep`](https://github.com/BurntSushi/ripgrep) (`rg`) | Faster, respects `.gitignore` by default |
| `find` | [`fd`](https://github.com/sharkdp/fd) | Friendlier syntax, faster |
| `cat` | [`bat`](https://github.com/sharkdp/bat) | Syntax highlighting, line numbers |
| `ls` | [`eza`](https://eza.rocks/) | Icons, git status per file, tree mode |
| `cd` | [`zoxide`](https://github.com/ajeetdsouza/zoxide) (`z`) | Learns your directories — `z foo` jumps anywhere |
| `top` / `htop` | [`btop`](https://github.com/aristocratos/btop) | Pretty system monitor |
| (none) | [`fzf`](https://github.com/junegunn/fzf) | Fuzzy finder — `Ctrl+R` becomes magic |
| (none) | [`jq`](https://jqlang.org/) | Query JSON from the command line |
| (none) | [`lazygit`](https://github.com/jesseduffield/lazygit) | A TUI for git — your Stage 4 git knowledge, in a UI |

Install via [Homebrew](https://brew.sh/) on macOS/Linux:

```bash
brew install ripgrep fd bat eza zoxide fzf jq lazygit
```

On Windows (inside WSL2) use `apt` or `brew` for Linux. On native Windows, use [Scoop](https://scoop.sh/) or [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/).

:::info[The fzf moment]
After installing `fzf`, run its shell-integration script (the install command prints instructions). Now press `Ctrl+R` in your terminal — instead of scrolling backwards through history, you get a live fuzzy search. Type three letters of an old command and hit enter. This is the single most life-changing terminal upgrade in this list.
:::

## 4. A Node version manager (never install Node globally again)

Stage 0 told you to install Node directly. That works, but a few months in you'll need *a different Node version* for one project, or CI will be on Node 20 while your laptop is on 22. The fix is a version manager.

In 2026, install **[fnm](https://github.com/Schniz/fnm)** (Fast Node Manager — Rust, very fast). Alternatives: `volta`, `nvm`. They all work; fnm is the most pleasant.

```bash
# macOS / Linux / WSL
curl -fsSL https://fnm.vercel.app/install | bash

# Then add to your shell rc:
eval "$(fnm env --use-on-cd)"

# Install and use a Node version
fnm install --lts
fnm use lts/latest
```

The magic line is `--use-on-cd`: drop a `.nvmrc` file (containing `22.11.0` for example) in any project, and fnm switches Node automatically when you `cd` into it. No more "wrong Node version" surprises.

Uninstall whatever Node you installed in Stage 0 first. Two Nodes on one machine is misery.

## 5. Package manager: pnpm or bun, not npm

`npm` works but is the slowest of the modern options and uses the most disk space. In 2026, default to:

- **[pnpm](https://pnpm.io/)** for most projects — fast, disk-efficient (uses a global content-addressed store), strictest about dependencies.
- **[Bun](https://bun.sh/)** if you want a single tool that's also a runtime and test runner.

Use **[corepack](https://nodejs.org/api/corepack.html)** (built into Node) to pin the package manager per project:

```bash
corepack enable
# In a project: corepack use pnpm@latest
```

This writes a `packageManager:` field into `package.json` so everyone who clones your repo gets the same tool, same version. No more "works with pnpm 8 but not pnpm 9."

## 6. Git: from "installed" to "configured"

Stage 0 had you install git. Now configure it like a working developer would.

```bash
# Identity (shown on every commit)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Default branch name (matches GitHub's default)
git config --global init.defaultBranch main

# Always pull with rebase (cleaner history)
git config --global pull.rebase true

# Auto-stash uncommitted changes before pulling
git config --global rebase.autoStash true

# Use VS Code as your git editor (for commit messages, rebases)
git config --global core.editor "code --wait"

# Better diffs
git config --global diff.algorithm histogram

# Remember credentials (HTTPS only; not needed if you use SSH)
git config --global credential.helper "cache --timeout=3600"
```

### Aliases that pay back daily

```bash
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.amend "commit --amend --no-edit"
```

Now `git lg` shows a pretty graph of your branches. `git st` is `git status` with a one-line summary. These save a few keystrokes thousands of times.

### SSH keys for GitHub (stop typing tokens)

If you're still using HTTPS + personal access tokens for GitHub, switch to SSH:

```bash
# Generate a key
ssh-keygen -t ed25519 -C "you@example.com"

# Start the agent and add the key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Print the public key to copy
cat ~/.ssh/id_ed25519.pub
```

Then paste the public key into [GitHub → Settings → SSH and GPG keys](https://github.com/settings/keys). From now on, `git clone git@github.com:...` works with no passwords or tokens.

### Sign your commits (the green "Verified" badge)

GitHub shows a "Verified" badge on commits you cryptographically signed. The easiest 2026 way is **SSH signing** with the key you just generated:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

Then upload the same SSH key on GitHub as a *signing key* (separate setting from auth key — same dialog). Your commits will now show "Verified" on GitHub.

### A global gitignore for OS clutter

```bash
git config --global core.excludesfile ~/.gitignore_global
```

Then create `~/.gitignore_global`:

```
.DS_Store
Thumbs.db
*.swp
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.env
.env.local
```

Now you'll never accidentally commit `.DS_Store` again.

## 7. The GitHub CLI (`gh`)

[`gh`](https://cli.github.com/) lets you create PRs, manage issues, and clone repos without leaving the terminal. Install it, then:

```bash
gh auth login
```

Useful daily:

```bash
gh repo create my-app --private --source=. --push   # Create + push in one shot
gh pr create                                         # Opens an editor for title/body
gh pr view --web                                     # Open the current branch's PR in the browser
gh pr checks                                         # See CI status from the terminal
gh issue list --assignee @me                         # Your open issues
```

This is the keystone of the keyboard-driven workflow. Once you stop tabbing to github.com, you'll wonder how you ever worked without it.

## 8. VS Code as a pro uses it

The mouse-driven default VS Code is fine; the keyboard-driven configured one is a different tool. Three upgrades:

### Sign in for Settings Sync

VS Code → top-right Account icon → Sign in with GitHub. Your settings, keybindings, and extensions now follow you to any machine. Reinstalling your OS no longer means rebuilding your editor.

### Edit `settings.json`, not just the GUI

`Cmd/Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)". A starter set worth pasting in:

```jsonc
{
  // Editor
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.linkedEditing": true,                  // edit matching JSX tags together
  "editor.stickyScroll.enabled": true,           // pin current function header

  // Files
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // Workbench
  "workbench.editor.enablePreview": false,       // every click opens a real tab
  "workbench.list.smoothScrolling": true,

  // Terminal
  "terminal.integrated.fontFamily": "'JetBrains Mono'",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "zsh",

  // Git
  "git.autofetch": true,
  "git.confirmSync": false,
  "diffEditor.ignoreTrimWhitespace": false,

  // Defaults
  "[typescript]":      { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]":            { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

### Extensions worth installing

Beyond the three from [Stage 0](./stage-0-setup#2-install-vs-code-your-editor):

- **Error Lens** — inline errors and warnings, no hovering needed.
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes (you'll want this by Stage 7).
- **TODO Tree** — finds all `TODO`/`FIXME` comments in your project.
- **Code Spell Checker** — catches typos in identifiers and comments.
- **Indent Rainbow** — colors indentation, helpful in nested JSX.
- **GitHub Pull Requests** — review and comment on PRs without leaving VS Code.
- **Console Ninja** *(or)* **Wallaby.js** *(paid)* — inline runtime values during debugging.

### Keyboard shortcuts worth memorizing

| Shortcut (Mac → Win/Linux) | What it does |
|---|---|
| `Cmd+P` → `Ctrl+P` | Jump to any file by typing part of its name |
| `Cmd+Shift+P` → `Ctrl+Shift+P` | Command palette (every action in the editor) |
| `Cmd+Shift+F` → `Ctrl+Shift+F` | Search across all files |
| `Cmd+B` → `Ctrl+B` | Toggle sidebar |
| `Cmd+J` → `Ctrl+J` | Toggle terminal panel |
| `Cmd+D` → `Ctrl+D` | Select next occurrence (multi-cursor) |
| `Option+↑/↓` → `Alt+↑/↓` | Move line up/down |
| `Cmd+/` → `Ctrl+/` | Toggle comment |
| `F2` | Rename symbol everywhere |
| `F12` | Go to definition |

If you only learn one: it's `Cmd/Ctrl+P`. Stop opening files via the file tree.

### AI in the editor

In 2026, an AI assistant in the editor is standard. Options:

- **[GitHub Copilot](https://github.com/features/copilot)** — the default, integrated into VS Code natively, ~$10/mo. Free for students and OSS maintainers.
- **[Cursor](https://www.cursor.com/)** — a VS Code fork that's AI-first. Most settings/extensions carry over. ~$20/mo.
- **[Claude Code](https://claude.com/claude-code)** — terminal-based agent that edits files in your repo. Good complement to either of the above.
- **[Continue](https://www.continue.dev/)** — open-source alternative; bring your own API key.

See [AI as a learner](/docs/roadmap/part-4-meta/ai-as-learner) for *how* to use these without sabotaging your own learning — it matters early, when your instinct is to let the AI write everything and skip the understanding.

## 9. Browser dev tools, dialed in

- **Use a dedicated "Dev" browser profile** — a Chrome or Firefox profile with no extensions except dev ones. Your personal profile's ad-blocker and password manager will silently mangle your dev environment otherwise.
- **Install [React DevTools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)** (and Vue/Redux DevTools if relevant).
- Learn the Network panel: filter by `Fetch/XHR`, look at request headers, response, timing. You'll live here debugging API issues.
- Learn `Cmd/Ctrl+Shift+P` *inside DevTools* — same command palette as VS Code, for every dev-tools action.
- Keep a "Local Overrides" folder set up — it lets you save changes you make in DevTools to disk so they persist across reloads.

## 10. A dotfiles repo

Everything you configured above lives in dotfiles (`~/.zshrc`, `~/.gitconfig`, `~/.config/...`, your VS Code `settings.json`). At some point you'll set up a new machine, or your laptop will die, and you'll want it all back.

Put them in a public GitHub repo called `dotfiles`:

```bash
mkdir ~/dotfiles && cd ~/dotfiles
git init
# Copy (or symlink) ~/.zshrc, ~/.gitconfig, etc. into this repo
# Add a tiny install.sh that symlinks them back to ~/
git commit -am "Initial dotfiles"
gh repo create dotfiles --public --source=. --push
```

When you set up a new machine: clone the repo, run `install.sh`, and your environment is back. You'll thank yourself the day this happens for the first time.

For a polished version, use **[chezmoi](https://www.chezmoi.io/)** or **[yadm](https://yadm.io/)** — both manage dotfiles properly across multiple machines without symlink gymnastics.

## 11. The productivity habits, briefly

Tools are half of it. The other half is small habits that compound.

- **Run an app launcher.** macOS: [Raycast](https://www.raycast.com/) (free). Windows: [PowerToys Run](https://learn.microsoft.com/windows/powertoys/run). Linux: [rofi](https://github.com/davatorium/rofi). Press one shortcut, type the first three letters of any app, hit enter. Never reach for the Dock again.
- **Keyboard-driven window management.** macOS: [Rectangle](https://rectangleapp.com/) or [Aerospace](https://github.com/nikitabobko/AeroSpace) (free). Windows: [PowerToys FancyZones](https://learn.microsoft.com/windows/powertoys/fancyzones) (built-in). Snap windows to halves and quarters of the screen with a keystroke.
- **One terminal, many panes.** Use your terminal's split-pane feature instead of multiple windows. iTerm2/Wezterm/Ghostty all do this with `Cmd+D` (split right) and `Cmd+Shift+D` (split down).
- **Project switching with tmux or terminal tabs.** Once you're working on 3+ projects, [tmux](https://github.com/tmux/tmux/wiki) or [zellij](https://zellij.dev/) saves time. Optional.
- **Stop using the mouse for the things you do 100 times a day.** File switching, terminal commands, browser tabs, window arranging — all should be one keystroke. The mouse is fine for the things you do once a day.

## Common mistakes

:::caution[Where people commonly trip up]
- **Doing all of this on day one.** This page is a *menu*, not a checklist. Most upgrades only make sense after you've felt the corresponding pain. Don't burn a Sunday installing 15 tools you won't use for months — install the terminal and Starship now, come back for the rest.
- **Installing Node directly and then a version manager later.** Two Nodes on a machine causes silent path conflicts. Uninstall the global Node *before* you install `fnm`. The first sign of trouble is `which node` showing one path and `node --version` showing what looks like a different install — that's the conflict.
- **Configuring git on a public/shared machine with your real email.** Every commit has your email on it forever. On personal machines this is fine; on someone else's, use the GitHub-provided "noreply" email from [GitHub's email settings](https://github.com/settings/emails).
- **Mass-installing VS Code extensions.** Each one is a bit of CPU and a bit of editor lag. Install the four or five you actually use; remove the rest. A clean extension list is a fast editor.
- **Skipping WSL2 on Windows.** A non-trivial fraction of "this tutorial doesn't work" issues on Windows go away if you just do everything inside WSL2. If you're hitting weird path or permission issues, that's usually the fix.
- **Forgetting to back up dotfiles.** Spend a Saturday tuning your setup, then lose your laptop a year later and rebuild from scratch. The dotfiles repo is a five-minute investment with a 100x return the first time you need it.
:::

## Reading path: what to do, in what order

If you're reading top-to-bottom, here's the suggested order — *don't do all of it in one sitting*:

1. **Now (15 min):** Install a real terminal *(section 1)*. Pick a programming font.
2. **Now (10 min):** Install Starship for a better prompt *(section 2)*.
3. **This week (1 hour):** Install the modern CLI tools — at minimum `ripgrep`, `fzf`, `eza`, `bat`, `zoxide` *(section 3)*. Wire up `Ctrl+R` with fzf and feel the magic.
4. **Before Stage 4 (Git) (20 min):** Configure git properly — identity, aliases, default branch, pull strategy *(section 6)*. Set up SSH keys for GitHub.
5. **Before pushing to GitHub for real (15 min):** Install `gh` and run `gh auth login` *(section 7)*.
6. **When VS Code starts feeling slow (30 min):** Tune `settings.json`, install Error Lens, sign in for Settings Sync *(section 8)*.
7. **When you switch laptops or get a new one:** Set up the dotfiles repo *(section 10)*. (Or — better — do it before you need it.)
8. **Eventually:** A Node version manager *(section 4)*, switch to pnpm/bun *(section 5)*, set up your browser dev profile *(section 9)*, app launcher and window manager *(section 11)*.

You don't need to be a wizard. You need a machine that gets out of your way. Everything above exists to remove friction between *thinking of a thing* and *doing the thing*.

## Where to go deeper

- **[The Missing Semester (MIT)](https://missing.csail.mit.edu/)** — free lectures on shell, vim, git, and the tools nobody teaches in CS programs. Lectures 1–6 pair perfectly with this page.
- **[dotfiles.github.io](https://dotfiles.github.io/)** — index of well-known engineers' public dotfiles, copy-paste-able.
- **[r/unixporn](https://reddit.com/r/unixporn) and [/r/commandline](https://reddit.com/r/commandline)** — endless terminal eye candy, plus discoveries of small tools you didn't know existed.

## Deeper in this guide

- [Stage 4 — Git & GitHub](./stage-4-git) — once you've configured git here, Stage 4 is mostly muscle memory.
- [Stage 12 — Going professional](./stage-12-going-pro) — the *team-level* version of "going pro": Docker, CI/CD, code review.
- [Lifecycle: Environment Setup](/docs/lifecycle/environment-setup) — the project-level version: lockfiles, Dev Containers, secrets.
- [AI as a learner](/docs/roadmap/part-4-meta/ai-as-learner) — how to use Copilot/Cursor/Claude without skipping the learning.

→ [Back to Stage 0](./stage-0-setup) · [Continue to Stage 1 — JavaScript basics](./stage-1-javascript-basics) · [Back to Part I overview](.)
