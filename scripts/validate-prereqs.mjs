#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execSync} from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regenerate expected data first
execSync('node scripts/sync-prereqs-data.mjs', {cwd: ROOT, stdio: 'inherit'});
const expected = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts', '.prereqs-expected.json'), 'utf8'),
);

// Parse actual prereqs.ts exports (simple regex extraction)
const src = fs.readFileSync(
  path.join(ROOT, 'src/components/SidebarLockGate/prereqs.ts'),
  'utf8',
);

function extractObject(name) {
  const re = new RegExp(`export const ${name}[^=]*=\\s*(\\{[\\s\\S]*?\\n\\});`);
  const m = src.match(re);
  if (!m) throw new Error(`Missing export: ${name}`);
  // eslint-disable-next-line no-eval
  return eval(`(${m[1]})`);
}

const actualCheckpoints = extractObject('PAGE_CHECKPOINTS');
const actualOrder = extractObject('CHAPTER_PAGE_ORDER');

let errors = 0;
function err(msg) {
  console.error(`ERROR: ${msg}`);
  errors++;
}

for (const [chapter, order] of Object.entries(expected.CHAPTER_PAGE_ORDER)) {
  const actual = actualOrder[chapter];
  if (!actual) {
    err(`Missing CHAPTER_PAGE_ORDER entry for "${chapter}"`);
    continue;
  }
  if (JSON.stringify(actual) !== JSON.stringify(order)) {
    err(`CHAPTER_PAGE_ORDER mismatch for "${chapter}"`);
    const expSet = new Set(order);
    const actSet = new Set(actual);
    for (const p of order) {
      if (!actSet.has(p)) err(`  missing in prereqs.ts: ${p}`);
    }
    for (const p of actual) {
      if (!expSet.has(p)) err(`  extra in prereqs.ts: ${p}`);
    }
  }
}

for (const [docPath, quizId] of Object.entries(expected.PAGE_CHECKPOINTS)) {
  if (actualCheckpoints[docPath] !== quizId) {
    err(
      `PAGE_CHECKPOINTS mismatch for ${docPath}: expected "${quizId}", got "${actualCheckpoints[docPath] ?? 'missing'}"`,
    );
  }
}

for (const docPath of Object.keys(actualCheckpoints)) {
  if (!expected.PAGE_CHECKPOINTS[docPath]) {
    err(`Stale PAGE_CHECKPOINTS entry: ${docPath}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s). Run: npm run apply-prereqs`);
  process.exit(1);
}

console.log('prereqs.ts matches docs + sidebars order.');
