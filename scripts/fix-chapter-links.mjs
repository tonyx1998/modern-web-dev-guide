#!/usr/bin/env node
/**
 * Normalize chapter overview links to Docusaurus index.md slugs (/docs/chapter).
 * Index pages live at docs/XX-chapter/index.md and resolve to /docs/{chapter},
 * not /docs/{chapter}/{overview-id}.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Longer patterns first. */
const REPLACEMENTS = [
  ['/docs/roadmap/part-1-from-zero/part-1-overview', '/docs/roadmap/part-1-from-zero'],
  ['/docs/roadmap/part-2-modern-stack/part-2-overview', '/docs/roadmap/part-2-modern-stack'],
  ['/docs/roadmap/part-3-beyond/part-3-overview', '/docs/roadmap/part-3-beyond'],
  ['/docs/roadmap/part-4-meta/part-4-overview', '/docs/roadmap/part-4-meta'],
  ['/docs/foundations/foundational-concepts', '/docs/foundations'],
  ['/docs/roadmap/roadmap-overview', '/docs/roadmap'],
  ['/docs/lifecycle/development-lifecycle', '/docs/lifecycle'],
  ['/docs/stack/tech-stack-decoded', '/docs/stack'],
  ['/docs/cloud/cloud-platforms', '/docs/cloud'],
  ['/docs/operations/operations', '/docs/operations'],
  ['/docs/distributed-systems/distributed-systems', '/docs/distributed-systems'],
  ['/docs/ai/ai-integration', '/docs/ai'],
  ['/docs/ecosystems/ecosystems', '/docs/ecosystems'],
  ['/docs/solo/personal-website-workflow', '/docs/solo'],
  ['/docs/startup/small-company-workflow', '/docs/startup'],
  ['/docs/enterprise/large-company-workflow', '/docs/enterprise'],
  ['/docs/comparison/comparison', '/docs/comparison'],
  ['/docs/decisions/decision-frameworks', '/docs/decisions'],
  ['/docs/career/career-path', '/docs/career'],
];

function walk(dir, exts, files = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    if (ent.name === 'node_modules' || ent.name === 'build' || ent.name === '.git') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, exts, files);
    else if (exts.some((e) => ent.name.endsWith(e))) files.push(p);
  }
  return files;
}

const targets = [
  ...walk(path.join(ROOT, 'docs'), ['.md']),
  path.join(ROOT, 'docusaurus.config.ts'),
  path.join(ROOT, 'README.md'),
];

let changed = 0;
for (const file of targets) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    changed++;
    console.log('updated:', path.relative(ROOT, file));
  }
}
console.log(`Done — ${changed} file(s) updated.`);
