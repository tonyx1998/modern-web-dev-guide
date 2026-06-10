#!/usr/bin/env node
/**
 * Flags teaching lessons missing GUIDE-STANDARD skeleton elements.
 * Run: node scripts/audit-lesson-skeleton.mjs
 * Exit 1 if any errors (use in CI warn-only via || true).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');

const SKIP = new Set([
  '00-intro.md',
  '99-capstone.md',
  '11-glossary.md',
  'index.md',
  'how-to-use.md',
  '99-timeline-and-path.md',
  '90-checkpoint.md',
  '48-foundations-mid-checkpoint.md',
  '90-foundations-checkpoint.md',
]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    if (ent.name.startsWith('_')) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

let issues = 0;
for (const file of walk(DOCS)) {
  const base = path.basename(file);
  if (SKIP.has(base) || base.includes('checkpoint')) continue;
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.includes('<Quiz')) continue;

  const rel = path.relative(DOCS, file);
  const qCount = (raw.match(/<Question/g) || []).length;
  const hasOpener =
    /In one line|In plain English|:::tip\[In plain English\]/.test(raw);
  const hasWhy = /why it matters|Why it matters/i.test(raw);
  const hasPitfalls = /pitfall|Common mistakes|:::caution/i.test(raw);

  if (!hasOpener) {
    console.warn(`WARN ${rel}: missing plain-English on-ramp`);
    issues++;
  }
  if (qCount < 3) {
    console.warn(`WARN ${rel}: only ${qCount} <Question> tags (need ≥3)`);
    issues++;
  }
  if (!hasWhy && !hasPitfalls) {
    console.warn(`WARN ${rel}: missing why-it-matters or pitfalls section`);
    issues++;
  }
}

if (issues === 0) console.log('Lesson skeleton audit: no issues.');
else console.log(`\nLesson skeleton audit: ${issues} issue(s).`);
process.exit(issues > 0 ? 1 : 0);
