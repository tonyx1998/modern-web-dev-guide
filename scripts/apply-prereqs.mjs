#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expected = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts', '.prereqs-expected.json'), 'utf8'),
);

const CHAPTER_PREREQS = {
  foundations: [],
  roadmap: ['foundations-mid-checkpoint'],
  lifecycle: ['roadmap-checkpoint'],
  stack: ['lifecycle-checkpoint'],
  cloud: ['stack-checkpoint'],
  operations: ['cloud-checkpoint'],
  'distributed-systems': ['operations-checkpoint'],
  ai: ['distributed-systems-checkpoint'],
  ecosystems: ['ai-checkpoint'],
  solo: ['ecosystems-checkpoint'],
  startup: ['solo-checkpoint'],
  enterprise: ['startup-checkpoint'],
  comparison: ['enterprise-checkpoint'],
  decisions: ['comparison-checkpoint'],
  career: ['decisions-checkpoint'],
  capstone: ['career-checkpoint'],
  glossary: [],
};

const CHECKPOINT_DESCRIPTIONS = {
  'foundations-mid-checkpoint':
    'Pass the Chapter 1 (Web Fundamentals) checkpoint quiz',
  'foundations-checkpoint':
    'Pass the Chapter 2 (Production Engineering) checkpoint quiz',
  'roadmap-checkpoint': 'Pass the Chapter 3 (Roadmap) checkpoint quiz',
  'lifecycle-checkpoint': 'Pass the Chapter 4 (Lifecycle) checkpoint quiz',
  'stack-checkpoint': 'Pass the Chapter 5 (Tech Stack) checkpoint quiz',
  'cloud-checkpoint': 'Pass the Chapter 6 (Cloud Platforms) checkpoint quiz',
  'operations-checkpoint': 'Pass the Chapter 7 (SRE & Operations) checkpoint quiz',
  'distributed-systems-checkpoint':
    'Pass the Chapter 8 (Distributed Systems) checkpoint quiz',
  'ai-checkpoint': 'Pass the Chapter 9 (AI Integration) checkpoint quiz',
  'ecosystems-checkpoint':
    'Pass the Chapter 10 (Mobile & Ecosystems) checkpoint quiz',
  'solo-checkpoint': 'Pass the Chapter 11 (Solo) checkpoint quiz',
  'startup-checkpoint': 'Pass the Chapter 12 (Startup) checkpoint quiz',
  'enterprise-checkpoint': 'Pass the Chapter 13 (Enterprise) checkpoint quiz',
  'comparison-checkpoint': 'Pass the Chapter 14 (Comparison) checkpoint quiz',
  'decisions-checkpoint': 'Pass the Chapter 15 (Decisions) checkpoint quiz',
  'career-checkpoint': 'Pass the Chapter 16 (Career) checkpoint quiz',
};

function formatChapterPrereqs() {
  const lines = ['export const CHAPTER_PREREQS: Record<string, string[]> = {'];
  for (const [chapter, reqs] of Object.entries(CHAPTER_PREREQS)) {
    const key = chapter.includes('-') ? `'${chapter}'` : chapter;
    lines.push(`  ${key}: ${JSON.stringify(reqs)},`);
  }
  lines.push('};');
  return lines.join('\n');
}

function formatPageCheckpoints() {
  const lines = ['export const PAGE_CHECKPOINTS: Record<string, string> = {'];
  const entries = Object.entries(expected.PAGE_CHECKPOINTS).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  let currentChapter = '';
  for (const [docPath, quizId] of entries) {
    const chapter = docPath.split('/')[0];
    if (chapter !== currentChapter) {
      if (currentChapter) lines.push('');
      lines.push(`  // ${chapter}`);
      currentChapter = chapter;
    }
    lines.push(`  '${docPath}': '${quizId}',`);
  }
  lines.push('};');
  return lines.join('\n');
}

function formatChapterPageOrder() {
  const lines = ['export const CHAPTER_PAGE_ORDER: Record<string, string[]> = {'];
  for (const [chapter, order] of Object.entries(expected.CHAPTER_PAGE_ORDER)) {
    const key = chapter.includes('-') ? `'${chapter}'` : chapter;
    lines.push(`  ${key}: [`);
    for (const p of order) {
      lines.push(`    '${p}',`);
    }
    lines.push('  ],');
  }
  lines.push('};');
  return lines.join('\n');
}

function formatPrereqDescriptions() {
  const lines = ['export const PREREQ_DESCRIPTIONS: Record<string, string> = {'];
  for (const [id, desc] of Object.entries(CHECKPOINT_DESCRIPTIONS)) {
    lines.push(`  '${id}': '${desc}',`);
  }
  lines.push('};');
  return lines.join('\n');
}

const tail = fs.readFileSync(
  path.join(ROOT, 'src/components/SidebarLockGate/prereqs.ts'),
  'utf8',
);
const tailStart = tail.indexOf('export function describeQuiz');
if (tailStart === -1) throw new Error('Could not find describeQuiz in prereqs.ts');

const header = `/**
 * Sidebar locking prereqs — two layers:
 *
 *   1. CHAPTER_PREREQS: a chapter (e.g. "lifecycle") is locked until
 *      these quizzes are passed. The chain is sequential:
 *      finishing chapter N's last quiz unlocks chapter N+1.
 *   2. CHAPTER_PAGE_ORDER + PAGE_CHECKPOINTS: WITHIN a chapter, a
 *      page in the order is locked until every preceding page's
 *      checkpoint has been passed.
 *
 * Quiz id conventions:
 *   - Chapter 1 (foundations) uses unprefixed slugs ("client-server-page")
 *     for backward compatibility with the original prototype.
 *   - Chapters 2+ prefix with the chapter slug ("lifecycle-design-page")
 *     to avoid cross-chapter collisions on common page IDs (mindset,
 *     planning, design, architecture, testing, deployment, etc.).
 *
 * Regenerate maps: npm run sync-prereqs && npm run apply-prereqs
 * Validate: npm run validate-prereqs
 */

/** Chapter-entry gates: chapter X is locked until these quizzes pass. */
`;

const newContent = [
  header,
  formatChapterPrereqs(),
  '',
  '/**',
  ' * Per-page checkpoint quiz id. The KEY is the URL path',
  ' * (chapter-slug/page-slug). The VALUE is the quiz id used inside',
  ' * <Quiz id="...">.',
  ' */',
  formatPageCheckpoints(),
  '',
  '/**',
  ' * Pages in reading order, per chapter. Used to derive the',
  ' * "everything before this page must be passed" prereqs.',
  ' */',
  formatChapterPageOrder(),
  '',
  '/**',
  ' * Curated hover-tooltip text for chapter checkpoint quizzes.',
  ' * Page-level quizzes fall back to `describeQuiz` below.',
  ' */',
  formatPrereqDescriptions(),
  '',
  '/**',
  ' * Human-readable label for a quiz id. Curated map wins; otherwise we',
  ' * derive something readable from the slug.',
  ' */',
  tail.slice(tailStart),
].join('\n');

fs.writeFileSync(
  path.join(ROOT, 'src/components/SidebarLockGate/prereqs.ts'),
  newContent,
);
console.log('Updated src/components/SidebarLockGate/prereqs.ts');
