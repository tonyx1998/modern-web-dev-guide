#!/usr/bin/env node
/**
 * Generates src/data/chapterPages.ts from docs/ folder structure.
 * Run: node scripts/write-chapter-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'src/data/chapterPages.ts');

const DIR_TO_CHAPTER = {
  '01-foundations': 'foundations',
  '02-roadmap': 'roadmap',
  '03-lifecycle': 'lifecycle',
  '04-stack': 'stack',
  '05-solo': 'solo',
  '06-startup': 'startup',
  '07-enterprise': 'enterprise',
  '08-comparison': 'comparison',
  '09-decisions': 'decisions',
  '10-ai': 'ai',
  '11-career': 'career',
  '12-cloud': 'cloud',
  '13-operations': 'operations',
  '14-distributed-systems': 'distributed-systems',
  '15-ecosystems': 'ecosystems',
};

function stripNumericPrefix(name) {
  return name.replace(/^\d+-/, '').replace(/^\d+b-/, '');
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = match[1];
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!m) return undefined;
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return v;
  };
  return {
    id: get('id'),
    sidebar_position: parseInt(get('sidebar_position') ?? '9999', 10),
    slug: get('slug'),
  };
}

function collectDocs(dir, segments = []) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const docs = [];
  for (const e of entries) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      docs.push(...collectDocs(full, [...segments, stripNumericPrefix(e.name)]));
    } else if (e.name.endsWith('.md')) {
      const fm = parseFrontmatter(full);
      const fileSlug = stripNumericPrefix(e.name.replace(/\.md$/, ''));
      const isIndex = fileSlug === 'index';
      const pageSlug =
        fm.slug ?? (isIndex ? undefined : (fm.id ?? fileSlug));
      const routeSegments = [...segments];
      if (pageSlug && pageSlug !== '/') {
        routeSegments.push(pageSlug);
      }
      const routePath = '/docs/' + routeSegments.join('/');
      docs.push({
        routePath,
        sidebar_position: fm.sidebar_position ?? 9999,
        docId: routeSegments.join('/'),
      });
    }
  }
  return docs;
}

/** Prefer sidebar order from prereqs when available (matches gating sequence). */
const PREREQS_ORDER = {
  foundations: null, // filled below from sidebars order in prereqs
};

// Import order from existing prereqs - we'll read CHAPTER_PAGE_ORDER paths
const prereqsPath = path.join(ROOT, 'src/components/SidebarLockGate/prereqs.ts');
const prereqsSrc = fs.readFileSync(prereqsPath, 'utf8');

function extractChapterPageOrder() {
  const order = {};
  const re = /(\w[\w-]*):\s*\[([\s\S]*?)\]/g;
  const block = prereqsSrc.match(/export const CHAPTER_PAGE_ORDER[\s\S]*?= \{([\s\S]*?)\};/);
  if (!block) return order;
  const inner = block[1];
  let m;
  const chapterRe = /(\w[\w-]*):\s*\[([\s\S]*?)\],?\s*(?=\w[\w-]*:|$)/g;
  while ((m = chapterRe.exec(inner)) !== null) {
    const chapter = m[1];
    const paths = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    order[chapter] = paths.map((p) => '/docs/' + p);
  }
  return order;
}

const prereqsOrder = extractChapterPageOrder();

const chapterPages = {};

for (const [dirName, chapterId] of Object.entries(DIR_TO_CHAPTER)) {
  const dir = path.join(DOCS, dirName);
  if (!fs.existsSync(dir)) continue;
  const docs = collectDocs(dir, [chapterId]);
  const byPath = new Map(docs.map((d) => [d.routePath, d]));

  if (prereqsOrder[chapterId]) {
    const ordered = [];
    const seen = new Set();
    for (const p of prereqsOrder[chapterId]) {
      if (byPath.has(p)) {
        ordered.push(p);
        seen.add(p);
      }
    }
    const rest = docs
      .filter((d) => !seen.has(d.routePath))
      .sort((a, b) => a.sidebar_position - b.sidebar_position)
      .map((d) => d.routePath);
    chapterPages[chapterId] = [...ordered, ...rest];
  } else {
    chapterPages[chapterId] = docs
      .sort((a, b) => a.sidebar_position - b.sidebar_position)
      .map((d) => d.routePath);
  }
}

const chapterIds = Object.keys(chapterPages);

function isChapterIndex(path, chapterId) {
  return path === `/docs/${chapterId}`;
}

function trackablePages(chapterId) {
  return (chapterPages[chapterId] ?? []).filter((p) => !isChapterIndex(p, chapterId));
}

const totalPages = chapterIds.reduce((s, id) => s + trackablePages(id).length, 0);
const pageCounts = Object.fromEntries(
  chapterIds.map((id) => [id, trackablePages(id).length]),
);

const output = `/**
 * Ordered doc paths per guide chapter. Generated by scripts/write-chapter-pages.mjs
 * — re-run after adding/removing docs. Gated chapters use prereqs.ts order first.
 */
import {chapters} from './guide';

export type ChapterId = (typeof chapters)[number]['id'];

/** Maps URL path prefix → chapter id. */
export const PATH_PREFIX_TO_CHAPTER: Record<string, ChapterId> = {
${chapterIds.map((id) => `  '${id}': '${id}',`).join('\n')}
};

/** Ordered /docs/... paths per chapter (excludes intro + glossary). */
export const chapterPages: Record<ChapterId, string[]> = ${JSON.stringify(chapterPages, null, 2)};

export function getChapterIdFromPath(pathname: string): ChapterId | null {
  const normalized = pathname.replace(/\\/$/, '');
  const match = normalized.match(/\\/docs\\/([^/]+)/);
  if (!match) return null;
  const prefix = match[1];
  return (PATH_PREFIX_TO_CHAPTER[prefix] as ChapterId) ?? null;
}

export function normalizeDocPath(pathname: string): string | null {
  const normalized = pathname.replace(/\\/$/, '');
  if (!normalized.startsWith('/docs')) return null;
  return normalized;
}

export function getPageIndex(chapterId: ChapterId, pagePath: string): number {
  const pages = chapterPages[chapterId];
  if (!pages) return -1;
  return pages.indexOf(pagePath);
}

export function getTotalTrackablePages(): number {
  return ${totalPages};
}

/** Content pages only (excludes chapter index landing pages). */
export const chapterPageCounts: Record<ChapterId, number> = ${JSON.stringify(pageCounts, null, 2)};

export function getChapterPageCount(chapterId: ChapterId): number {
  return chapterPageCounts[chapterId] ?? 0;
}

export function isChapterIndexPage(path: string, chapterId: ChapterId): boolean {
  return path === \`/docs/\${chapterId}\`;
}
`;

fs.writeFileSync(OUT, output);
console.log(`Wrote ${OUT} (${totalPages} pages across ${chapterIds.length} chapters)`);
