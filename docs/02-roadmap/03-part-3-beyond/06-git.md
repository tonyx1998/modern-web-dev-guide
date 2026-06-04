---
id: git-advanced
title: Git Beyond the Basics
sidebar_position: 7
sidebar_label: Git
description: Git as a content-addressable DAG, not a list of commands — rebase vs merge, the reflog safety net, bisect for finding bugs, the three resets, and the workflows that keep history useful.
---

# Git Beyond the Basics

> **In one line:** Once you stop memorizing Git commands and see the model underneath — commits are immutable snapshots in a graph, and branches are just movable pointers — every command becomes obvious and almost nothing is ever truly lost.

You learned `add`, `commit`, `push`, `pull` early. This is the mental model that turns Git from a scary set of incantations into a tool you wield deliberately — and recover from confidently.

:::info[Where this connects in the rest of the guide]
- The basics — init, staging, commit, branch, push/pull, resolving a simple conflict — are in [Roadmap Stage 4: Git](/docs/roadmap/part-1-from-zero/stage-4-git).

This page is the *model and the power tools* on top of those basics.
:::

## 1. The model: commits are a DAG, branches are pointers

Internally, Git is a **content-addressable graph**. A **commit** is an immutable snapshot of your whole tree plus a pointer to its parent(s), identified by a hash of its contents. A **branch** is *not* a copy of anything — it's just a movable pointer (a 40-character file) to one commit. `HEAD` points to the branch you're on.

```
        A───B───C   ← main (a pointer to commit C)
                 \
                  D───E   ← feature (a pointer to commit E)
                          HEAD → feature
```

This one fact explains everything:
- **Creating a branch is instant** — it writes a 41-byte pointer file, not a copy.
- **`commit` makes a new snapshot and moves the current branch pointer forward.**
- **`merge`, `rebase`, `reset` are all just *moving pointers* and/or *creating commits*** — nothing is destroyed; you're rearranging the graph.

Internalize "commits = immutable snapshots in a DAG, branches = pointers" and the rest of this page is just consequences.

## 2. Rebase vs merge — two ways to combine history

Both integrate one branch's work into another; they differ in the *history* they produce:

- **Merge** creates a new "merge commit" that ties the two histories together. History is *truthful* (it shows the branch existed) but can get tangled with many merge commits.
- **Rebase** *replays* your commits on top of the target branch, as if you'd started from its tip. History is *linear and clean*, but you've **rewritten** your commits (new hashes).

```bash
# Clean up your own local feature branch before opening a PR:
git rebase -i main      # squash WIP commits, reword messages, reorder — a tidy story

# Integrate a finished feature into a shared branch:
git merge --no-ff feature   # explicit merge commit; preserves that "feature" happened
```

:::caution[The golden rule of rebase]
**Never rebase commits that other people have already pulled.** Rebase rewrites history (new commit hashes); if those commits are public, everyone else's history now diverges from yours, producing duplicate commits and ugly conflicts on their next pull. Safe rule: **rebase *local, unpushed* work to clean it up; merge to integrate *shared* branches.** Rewrite your own private history freely; never rewrite shared history.
:::

## 3. The reflog — your safety net (nothing is lost)

The single most reassuring thing to know: **Git almost never deletes commits.** Even after a "disastrous" `reset --hard` or a botched rebase, the old commits still exist — they're just no longer pointed to. The **reflog** records every position `HEAD` has been:

```bash
git reflog                 # a timeline of everywhere HEAD has pointed
# ...
# a1b2c3d HEAD@{2}: reset: moving to HEAD~3   ← the "disaster"
# e4f5g6h HEAD@{3}: commit: the work I thought I lost
git reset --hard e4f5g6h   # restore HEAD to that commit — work recovered
```

Unreferenced commits stick around for ~90 days before garbage collection. So when someone says "I lost my work in Git," the answer is almost always "no you didn't — `git reflog`." Knowing this turns Git from terrifying to fearless: you can experiment with history because you can always get back.

## 4. Bisect — binary-search your history for the bug

A bug appeared "sometime in the last 200 commits" and you don't know which. `git bisect` does a **binary search** through history — ~8 checkouts for 200 commits instead of 200 — to find the exact commit that introduced it:

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v1.4.0         # this old release was fine
# Git checks out the midpoint; you test and mark good/bad; it narrows in.
# Fully automate it with a test script that exits non-zero on failure:
git bisect run npm test
# → "abc123 is the first bad commit" + the diff that caused it.
```

This is the fastest way to answer "what change broke this?" on a large project — and a reason to keep commits small and atomic (so the culprit commit is a small, readable diff).

## 5. The three resets (and restore)

`reset` confuses people because it does three different jobs depending on the flag — it's about *which of the three areas* (HEAD/commit, staging index, working tree) it touches:

| Command | Moves branch pointer | Resets staging | Resets working files | Use for |
|---|---|---|---|---|
| `reset --soft HEAD~1` | yes | no | no | undo last commit, keep changes staged |
| `reset --mixed HEAD~1` (default) | yes | yes | no | undo commit + unstage, keep edits |
| `reset --hard HEAD~1` | yes | yes | **yes** | discard everything (recoverable via reflog) |

Modern Git also splits the friendlier verbs out of the overloaded `checkout`: **`git switch`** changes branches, **`git restore`** restores file contents. Use those for clarity; reach for `reset` when you're moving the branch pointer itself.

## 6. The targeted power tools

- **`git cherry-pick <hash>`** — copy one specific commit onto your current branch (e.g. hotfix a release branch with a fix from main).
- **`git stash`** — shelve uncommitted changes to switch context, then `stash pop` to restore. (Don't let stashes pile up — they're easy to forget.)
- **`git worktree`** — check out multiple branches into separate directories simultaneously (review a PR while keeping your WIP untouched) without cloning twice.

## 7. Workflows: keep history a useful story

Branching strategy is a team decision, but the modern default for shipping fast is **trunk-based development**: short-lived feature branches merged into `main` frequently (daily), behind [feature flags](/docs/operations/ops-deploys) for incomplete work. It beats long-lived `git-flow` branches that drift and produce merge hell. Supporting habits: **small, focused PRs** (easy to review, easy to bisect), **atomic commits** (each commit builds and does one thing), and **conventional commit messages** (`feat:`, `fix:`, `chore:`) that make history scannable and can auto-generate changelogs. This is the version-control half of the [CI/CD lifecycle](/docs/lifecycle/ci-cd).

## Why this matters for you

Git fluency compounds: a few hours understanding the model saves you from the weekly "I'm stuck and afraid to touch it" moments, lets you keep a clean, bisectable history that makes future debugging fast, and means you can recover from any mistake instead of re-cloning and copy-pasting files. It's the tool you use more than any other — being fearless with it pays back forever.

## Going further (optional)

*This page plus the **First step** below are self-contained — you don't need to leave the site to learn or apply this. If you want to go even deeper, these are the best external resources:*

The free [Pro Git book](https://git-scm.com/book) (chapters on branching and "Git internals" are the gold). [Learn Git Branching](https://learngitbranching.js.org/) for a visual, interactive feel of how commands move the graph. Then: rebase-clean your next feature branch before the PR, and deliberately "lose" a commit with `reset --hard` and recover it with `reflog` so the safety net feels real.

## First step

In any repo, run `git reflog` and read it — see the breadcrumb trail of everywhere `HEAD` has been. Then start your next feature on a branch, make a few messy WIP commits, and `git rebase -i main` to squash them into one clean commit with a good message before you push. You'll feel the difference between "Git happens to me" and "I shape history on purpose."

## Common mistakes

:::caution[Where people commonly trip up]
- **Rebasing shared/public history.** Rewriting commits others have pulled creates duplicate commits and conflicts for everyone. Rebase local unpushed work; merge to integrate shared branches.
- **Thinking `reset --hard` lost your work forever.** It almost never does — `git reflog` finds the orphaned commit for ~90 days. Fear of Git usually comes from not knowing this.
- **Giant, mixed commits.** "Fix stuff" commits touching 40 files can't be reviewed, reverted, or bisected cleanly. Keep commits small and atomic — each one builds and does one thing.
- **Long-lived feature branches.** They drift from `main` for weeks and become a merge nightmare. Prefer short-lived branches merged daily, with feature flags hiding unfinished work.
- **Memorizing commands without the model.** You'll be lost the moment something unusual happens. Learn "commits are snapshots in a DAG, branches are pointers" and the commands become derivable.
- **Committing secrets and trying to delete the commit.** Removing it from history doesn't help (it's in clones/caches) — rotate the secret. (See [Security](/docs/roadmap/part-3-beyond/security).)
:::

## Page checkpoint

<Quiz id="git-advanced-page" title="Did the Git model stick?" sampleSize={3}>

<Question
  prompt="What is a Git branch, really?"
  options={[
    { text: "A full copy of the repository at a point in time" },
    { text: "A lightweight, movable pointer to a single commit — which is why creating a branch is instant and merge/rebase/reset are just moving pointers and creating commits" },
    { text: "A folder containing the branch's files" },
    { text: "A snapshot of all uncommitted changes" }
  ]}
  correct={1}
  explanation="A branch is just a ~41-byte pointer to a commit; commits are the immutable snapshots in the DAG. This is why branching is instant and why operations like merge, rebase, and reset are fundamentally about moving pointers and/or creating new commits — nothing is copied or destroyed."
  revisit={{ to: "/docs/roadmap/part-3-beyond/git-advanced#1-the-model-commits-are-a-dag-branches-are-pointers", label: "The Git model" }}
/>

<Question
  prompt="When is it safe to rebase, and when should you merge instead?"
  options={[
    { text: "Always rebase — linear history is strictly better" },
    { text: "Rebase your own local, unpushed commits to clean them up; merge to integrate shared branches — never rebase commits others have already pulled, because rewriting public history creates duplicate commits and conflicts for everyone" },
    { text: "Always merge — rebase is dangerous and should never be used" },
    { text: "It makes no difference; they produce identical results" }
  ]}
  correct={1}
  explanation="Rebase rewrites commits (new hashes), giving clean linear history — great for tidying your private branch before a PR. But rewriting commits others have pulled diverges everyone's history. The golden rule: rewrite local/private history freely; never rewrite shared/public history — merge to integrate those."
  revisit={{ to: "/docs/roadmap/part-3-beyond/git-advanced#2-rebase-vs-merge--two-ways-to-combine-history", label: "Rebase vs merge" }}
/>

<Question
  prompt="You ran `git reset --hard` and your last 3 commits seem gone. What's the recovery?"
  options={[
    { text: "They're permanently lost; re-clone and redo the work" },
    { text: "Use `git reflog` to find where HEAD pointed before the reset and `git reset --hard <that-hash>` — orphaned commits survive ~90 days, so the work isn't actually gone" },
    { text: "Restore from your last `git push`, losing anything unpushed" },
    { text: "Run `git fsck --delete` to bring them back" }
  ]}
  correct={1}
  explanation="`reset --hard` only moved the branch pointer; the commits still exist, just unreferenced. `git reflog` shows every prior position of HEAD, so you can reset back to the pre-disaster commit. Git almost never truly deletes commits (they're GC'd after ~90 days), which is what makes experimenting with history safe."
  revisit={{ to: "/docs/roadmap/part-3-beyond/git-advanced#3-the-reflog--your-safety-net-nothing-is-lost", label: "The reflog safety net" }}
/>

</Quiz>

---

→ Next: [Performance Engineering](./performance-deep) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
