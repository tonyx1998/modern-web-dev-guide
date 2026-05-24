#!/usr/bin/env node
// One-off: generate audio for a single lecture script using OpenAI TTS.
// Chunks by paragraph to stay under the 4096-char per-request limit,
// then concatenates the resulting MP3 byte streams (raw concat works
// fine for MP3 since each chunk is its own self-contained stream).
//
// Usage:
//   OPENAI_API_KEY=... node scripts/tts-one.mjs <input.md> <output.mp3> [voice]

import {readFile, writeFile} from 'node:fs/promises';

const [, , inPath, outPath, voiceArg, instructionsArg] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: tts-one.mjs <input> <output> [voice] [instructions]');
  process.exit(1);
}
const VOICE = voiceArg ?? 'onyx';
const INSTRUCTIONS = instructionsArg ?? '';
const MODEL = 'gpt-4o-mini-tts';
const MAX_CHARS = 3800; // under OpenAI's 4096 cap, leaves headroom

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

const text = (await readFile(inPath, 'utf8')).trim();
const chunks = chunkByParagraph(text, MAX_CHARS);
console.log(`Synthesizing ${text.length} chars in ${chunks.length} chunk(s) with voice "${VOICE}"...`);

const buffers = [];
for (let i = 0; i < chunks.length; i++) {
  console.log(`  chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
  const mp3 = await tts(chunks[i]);
  buffers.push(mp3);
}

const out = Buffer.concat(buffers);
await writeFile(outPath, out);
console.log(`Wrote ${outPath} (${(out.length / 1024).toFixed(0)} KB)`);

function chunkByParagraph(text, max) {
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const out = [];
  let cur = '';
  for (const p of paras) {
    if (p.length > max) {
      // Single paragraph too long — split on sentence boundary.
      if (cur) {
        out.push(cur);
        cur = '';
      }
      const sentences = p.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [p];
      let buf = '';
      for (const s of sentences) {
        if ((buf + s).length > max) {
          if (buf) out.push(buf.trim());
          buf = s;
        } else {
          buf += s;
        }
      }
      if (buf) out.push(buf.trim());
      continue;
    }
    if (cur && (cur.length + 2 + p.length) > max) {
      out.push(cur);
      cur = p;
    } else {
      cur = cur ? cur + '\n\n' + p : p;
    }
  }
  if (cur) out.push(cur);
  return out;
}

async function tts(input) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input,
      response_format: 'mp3',
      ...(INSTRUCTIONS ? {instructions: INSTRUCTIONS} : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI TTS ${res.status}: ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
