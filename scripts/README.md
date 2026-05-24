# Lecture generation

Generates spoken-lecture audio for each chapter using Claude (script) +
OpenAI TTS (voice).

## One-time setup

```sh
export ANTHROPIC_API_KEY=...    # for script generation
export OPENAI_API_KEY=...       # for TTS
```

## Commands

| Command | What it does |
|---|---|
| `npm run lectures:dry` | Show which pages would be processed; write nothing. |
| `npm run lectures:script-only` | Generate `lectures/**/*.md` (no TTS). |
| `npm run lectures` | Full pipeline: script + coverage check + TTS audio. |
| `node scripts/tts-one.mjs <in.md> <out.mp3> [voice] ["instructions"]` | Regenerate a single audio file. |

## Defaults

- Script model: `claude-opus-4-7` (swap to `claude-sonnet-4-6` in
  `scripts/generate-lectures.mjs` to save ~8× on cost).
- TTS model + voice: `gpt-4o-mini-tts` with voice `verse` and
  energetic-instructor `instructions` (picked over `ash` / `sage` in a
  side-by-side A/B/C test — see `static/lectures/_samples/`).

## Output layout

| Path | What | In git? |
|---|---|---|
| `lectures/<chapter>/<slug>.md` | Lecture script (human-reviewable) | Yes |
| `static/lectures/<chapter>/<slug>.txt` | Same script, served as transcript | Yes |
| `static/lectures/<chapter>/<slug>.mp3` | Generated audio (~15 MB / chapter) | **No — gitignored** |

Audio is regenerated per developer / per CI run. For production hosting,
sync `static/lectures/**/*.mp3` to object storage (Cloudflare R2, etc.) —
GitHub Pages can't hold ~3 GB.

## Cost (current settings)

Per chapter (~10k source chars, ~16k lecture chars):

- Script (Opus 4.7): ~$1.40 — or ~$0.18 with Sonnet 4.6
- TTS (`gpt-4o-mini-tts`): ~$0.24

Full guide (206 markdown pages, 2.0M source chars):

- Scripts only (Sonnet): ~$36
- TTS only: ~$57
- Combined (Sonnet + mini TTS): **~$93 one-time**

Re-runs are skipped for any chapter whose output is newer than the
source, so edit-then-re-run is cheap. Use `--force` to override.

## Embedding on a page

Drop into any chapter's MDX:

```mdx
<AudioPlayer
  src="/lectures/<chapter>/<slug>.mp3"
  transcript="/lectures/<chapter>/<slug>.txt"
  title="Listen: <chapter title>"
/>
```

The player gracefully degrades to a transcript link if the MP3 is
missing (e.g., before TTS has been run locally).
