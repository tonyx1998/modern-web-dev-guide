#!/usr/bin/env node
/**
 * Fix ./child relative links on chapter index pages — Docusaurus's link
 * checker resolves them as /docs/child instead of /docs/chapter/child.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');

const DIR_TO_SLUG = {
  '10-ai': 'ai',
  '11-career': 'career',
  '09-decisions': 'decisions',
  '15-ecosystems': 'ecosystems',
  '14-distributed-systems': 'distributed-systems',
  '13-operations': 'operations',
  '12-cloud': 'cloud',
  '08-comparison': 'comparison',
  '07-enterprise': 'enterprise',
  '06-startup': 'startup',
  '05-solo': 'solo',
  '03-lifecycle': 'lifecycle',
  '02-roadmap': 'roadmap',
  '01-foundations': 'foundations',
  '04-stack': 'stack',
};

function chapterSlugFor(filePath) {
  const rel = path.relative(DOCS, filePath);
  const top = rel.split(path.sep)[0];
  return DIR_TO_SLUG[top] ?? null;
}

function fixFile(filePath) {
  const slug = chapterSlugFor(filePath);
  if (!slug) return false;
  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.replace(
    /\]\(\.\/([a-z0-9][-a-z0-9]*)\)/g,
    `](/docs/${slug}/$1)`,
  );
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    return true;
  }
  return false;
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name === 'index.md') files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(DOCS)) {
  if (fixFile(file)) {
    changed++;
    console.log('updated:', path.relative(ROOT, file));
  }
}

// lifecycle open-source relative link from documentation.md if any
const doc16 = path.join(DOCS, '03-lifecycle/16-documentation.md');
if (fs.existsSync(doc16)) {
  let t = fs.readFileSync(doc16, 'utf8');
  const b = t;
  t = t.replace(/\]\(\.\/open-source\)/g, '](/docs/lifecycle/open-source)');
  if (t !== b) {
    fs.writeFileSync(doc16, t);
    changed++;
    console.log('updated: docs/03-lifecycle/16-documentation.md');
  }
}

console.log(`Done — ${changed} file(s) updated.`);
