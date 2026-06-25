#!/usr/bin/env node
/**
 * Report glossary terms that appear in docs but may be missing from 11-glossary.md.
 * Heuristic: **Term** — definitions in lesson prose vs glossary headings.
 * Run: node scripts/diff-glossary.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GLOSSARY = path.join(ROOT, 'docs/11-glossary.md');

// Glossary entries are bold terms at the start of a line: `**Term** — def`,
// grouped under `## A` letter headings (not `### Term` headings). Index both
// the full term and its pre-parenthesis short form, so a prose mention of
// `**ABAC**` matches the entry `**ABAC (Attribute-Based Access Control)**`.
const glossarySrc = fs.readFileSync(GLOSSARY, 'utf8');
const glossaryTerms = new Set();
for (const m of glossarySrc.matchAll(/^\*\*(.+?)\*\*/gm)) {
  const term = m[1].trim();
  glossaryTerms.add(term.toLowerCase());
  const short = term.replace(/\s*\(.*\)\s*$/, '').trim();
  if (short) glossaryTerms.add(short.toLowerCase());
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    if (ent.name.startsWith('_') || ent.name === '11-glossary.md') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const mentioned = new Map();
for (const file of walk(path.join(ROOT, 'docs'))) {
  const raw = fs.readFileSync(file, 'utf8');
  for (const m of raw.matchAll(/\*\*([A-Za-z][A-Za-z0-9 /().-]{1,40})\*\*/g)) {
    const term = m[1].trim();
    if (term.length < 3 || term.includes('http')) continue;
    // Skip bold used for emphasis rather than terminology: trailing sentence
    // punctuation, long phrases, or article-led noun phrases ("A change …").
    if (/[.;:?!]$/.test(term)) continue;
    const words = term.split(/\s+/);
    if (words.length > 4) continue;
    if (words.length > 1 && /^(a|an|the)$/i.test(words[0])) continue;
    const key = term.toLowerCase();
    if (!mentioned.has(key)) mentioned.set(key, {term, files: new Set()});
    mentioned.get(key).files.add(path.relative(ROOT, file));
  }
}

const missing = [...mentioned.values()]
  .filter(({term}) => !glossaryTerms.has(term.toLowerCase()))
  .sort((a, b) => a.term.localeCompare(b.term));

console.log(`Glossary has ${glossaryTerms.size} terms.`);
console.log(`Bold terms in docs: ${mentioned.size}. Possibly missing from glossary: ${missing.length}`);
for (const {term, files} of missing.slice(0, 40)) {
  console.log(`  - ${term} (e.g. ${[...files][0]})`);
}
if (missing.length > 40) console.log(`  ... and ${missing.length - 40} more`);
