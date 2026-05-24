#!/usr/bin/env node
// Generate lecture scripts + TTS audio for chapter pages.
//
// Usage:
//   node scripts/generate-lectures.mjs [--dry-run] [--script-only] [--force] [path-glob]
//
// Env vars required for full run:
//   ANTHROPIC_API_KEY   - for script generation (claude-opus-4-7)
//   OPENAI_API_KEY      - for TTS (gpt-4o-mini-tts or tts-1)
//
// Flags:
//   --dry-run      Show what would change, write nothing.
//   --script-only  Generate lecture scripts; skip TTS.
//   --force        Regenerate even if outputs are newer than source.
//   [path-glob]    Optional source path filter (substring match on doc path).
//
// Outputs (per source docs/<chapter>/<slug>.md):
//   lectures/<chapter>/<slug>.md                    - human-reviewable script
//   static/lectures/<chapter>/<slug>.txt            - same, served as transcript
//   static/lectures/<chapter>/<slug>.mp3            - TTS audio
//
// Pipeline per page:
//   1. Read source, skip if outputs newer than source (unless --force).
//   2. Ask Claude to generate the lecture script using scripts/lecture-prompt.md.
//   3. Ask Claude to do a coverage check: list source concepts + verify each
//      appears in the script. If gaps found, regenerate that section.
//   4. Write script to lectures/ and static/lectures/.
//   5. Send script to OpenAI TTS, write mp3 to static/lectures/.

import {readFile, writeFile, mkdir, stat, readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {join, dirname, relative, basename} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const DOCS_DIR = join(ROOT, 'docs');
const LECTURES_DIR = join(ROOT, 'lectures');
const STATIC_LECTURES_DIR = join(ROOT, 'static', 'lectures');
const PROMPT_PATH = join(__dirname, 'lecture-prompt.md');

const CLAUDE_MODEL = 'claude-opus-4-7';
const TTS_MODEL = 'gpt-4o-mini-tts';
const TTS_VOICE = 'verse'; // energetic educator; alternatives: ash, sage, onyx, nova
const TTS_INSTRUCTIONS =
  'Deliver this like a popular YouTube educator — energetic, expressive, ' +
  'with dynamic pitch changes. Hit key words with emphasis. Vary your pace ' +
  'dramatically: punchy on short sentences, slow and deliberate on important ' +
  'concepts. Avoid monotone at all costs.';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SCRIPT_ONLY = args.includes('--script-only');
const FORCE = args.includes('--force');
const pathFilter = args.find((a) => !a.startsWith('--'));

async function main() {
  const prompt = await readFile(PROMPT_PATH, 'utf8');
  const sources = await findSourcePages(DOCS_DIR);
  const filtered = pathFilter
    ? sources.filter((p) => p.includes(pathFilter))
    : sources;

  console.log(
    `Found ${filtered.length} source page(s)${pathFilter ? ` matching "${pathFilter}"` : ''}.`,
  );

  for (const src of filtered) {
    await processPage(src, prompt);
  }
}

async function findSourcePages(dir) {
  const out = [];
  const entries = await readdir(dir, {withFileTypes: true});
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await findSourcePages(p)));
    } else if (e.name.endsWith('.md') && !e.name.startsWith('_')) {
      out.push(p);
    }
  }
  return out;
}

async function processPage(srcPath, prompt) {
  const rel = relative(DOCS_DIR, srcPath); // e.g. 01-foundations/01-client-server.md
  const slug = rel.replace(/\.md$/, '').replace(/^\d+-/, ''); // foundations/client-server
  const chapterDir = dirname(rel).replace(/^\d+-/, '');
  const baseName = basename(rel, '.md').replace(/^\d+-/, '');

  const scriptOutDir = join(LECTURES_DIR, chapterDir);
  const staticOutDir = join(STATIC_LECTURES_DIR, chapterDir);
  const scriptOut = join(scriptOutDir, `${baseName}.md`);
  const transcriptOut = join(staticOutDir, `${baseName}.txt`);
  const audioOut = join(staticOutDir, `${baseName}.mp3`);

  if (!FORCE && (await isFresh(srcPath, scriptOut))) {
    console.log(`  skip (fresh): ${rel}`);
    return;
  }

  const source = await readFile(srcPath, 'utf8');
  console.log(`> ${rel}`);

  if (DRY_RUN) {
    console.log(`  would generate lecture script -> ${relative(ROOT, scriptOut)}`);
    if (!SCRIPT_ONLY) {
      console.log(`  would generate audio          -> ${relative(ROOT, audioOut)}`);
    }
    return;
  }

  // 1. Generate lecture script.
  const draft = await generateLectureScript(prompt, source);

  // 2. Coverage check + repair pass.
  const final = await coverageCheck(prompt, source, draft);

  // 3. Write script + transcript.
  await mkdir(scriptOutDir, {recursive: true});
  await mkdir(staticOutDir, {recursive: true});
  await writeFile(scriptOut, final, 'utf8');
  await writeFile(transcriptOut, final, 'utf8');
  console.log(`  wrote ${relative(ROOT, scriptOut)}`);

  // 4. TTS.
  if (!SCRIPT_ONLY) {
    const audio = await tts(final);
    await writeFile(audioOut, audio);
    console.log(`  wrote ${relative(ROOT, audioOut)} (${(audio.length / 1024).toFixed(0)} KB)`);
  }
}

async function isFresh(srcPath, outPath) {
  if (!existsSync(outPath)) return false;
  const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
  return outStat.mtimeMs >= srcStat.mtimeMs;
}

async function generateLectureScript(prompt, source) {
  const userMsg = `Here is the source page to rewrite as a spoken lecture:\n\n---\n${source}\n---\n\nProduce the lecture script per the instructions.`;
  const res = await callClaude(prompt, userMsg);
  return res.trim();
}

async function coverageCheck(prompt, source, draft) {
  const checkPrompt = `You are auditing a lecture script for completeness against its source page.

Step 1: List every distinct technical concept, term, code element, callout, diagram element, table row, and quiz question that appears in the SOURCE.

Step 2: For each item, quote the sentence (or sentences) in the DRAFT LECTURE that covers it. If an item is not covered, mark it MISSING.

Step 3: If there are any MISSING items, output a REVISED LECTURE that includes them, preserving everything already in the draft. Otherwise, output the original draft unchanged.

Output only the final lecture script (plain prose, no markdown), with no preamble or audit notes.

SOURCE:
---
${source}
---

DRAFT LECTURE:
---
${draft}
---`;
  const res = await callClaude(prompt, checkPrompt);
  return res.trim();
}

async function callClaude(system, user) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      system,
      messages: [{role: 'user', content: user}],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content.map((c) => c.text).join('');
}

async function tts(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      response_format: 'mp3',
      ...(TTS_INSTRUCTIONS ? {instructions: TTS_INSTRUCTIONS} : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
