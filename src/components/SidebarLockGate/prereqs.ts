/**
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

export const CHAPTER_PREREQS: Record<string, string[]> = {
  foundations: [],
  roadmap: ["foundations-mid-checkpoint"],
  lifecycle: ["roadmap-checkpoint"],
  stack: ["lifecycle-checkpoint"],
  cloud: ["stack-checkpoint"],
  operations: ["cloud-checkpoint"],
  'distributed-systems': ["operations-checkpoint"],
  ai: ["distributed-systems-checkpoint"],
  ecosystems: ["ai-checkpoint"],
  solo: ["ecosystems-checkpoint"],
  startup: ["solo-checkpoint"],
  enterprise: ["startup-checkpoint"],
  comparison: ["enterprise-checkpoint"],
  decisions: ["comparison-checkpoint"],
  career: ["decisions-checkpoint"],
  capstone: ["career-checkpoint"],
  glossary: [],
};

/**
 * Per-page checkpoint quiz id. The KEY is the URL path
 * (chapter-slug/page-slug). The VALUE is the quiz id used inside
 * <Quiz id="...">.
 */
export const PAGE_CHECKPOINTS: Record<string, string> = {
};

/**
 * Pages in reading order, per chapter. Used to derive the
 * "everything before this page must be passed" prereqs.
 */
export const CHAPTER_PAGE_ORDER: Record<string, string[]> = {
  foundations: [
  ],
  stack: [
  ],
  roadmap: [
  ],
  lifecycle: [
  ],
  cloud: [
  ],
  operations: [
  ],
  'distributed-systems': [
  ],
  ai: [
  ],
  ecosystems: [
  ],
  solo: [
  ],
  startup: [
  ],
  enterprise: [
  ],
  comparison: [
  ],
  decisions: [
  ],
  career: [
  ],
};

/**
 * Curated hover-tooltip text for chapter checkpoint quizzes.
 * Page-level quizzes fall back to `describeQuiz` below.
 */
export const PREREQ_DESCRIPTIONS: Record<string, string> = {
  'foundations-mid-checkpoint': 'Pass the Chapter 1 (Web Fundamentals) checkpoint quiz',
  'foundations-checkpoint': 'Pass the Chapter 2 (Production Engineering) checkpoint quiz',
  'roadmap-checkpoint': 'Pass the Chapter 3 (Roadmap) checkpoint quiz',
  'lifecycle-checkpoint': 'Pass the Chapter 4 (Lifecycle) checkpoint quiz',
  'stack-checkpoint': 'Pass the Chapter 5 (Tech Stack) checkpoint quiz',
  'cloud-checkpoint': 'Pass the Chapter 6 (Cloud Platforms) checkpoint quiz',
  'operations-checkpoint': 'Pass the Chapter 7 (SRE & Operations) checkpoint quiz',
  'distributed-systems-checkpoint': 'Pass the Chapter 8 (Distributed Systems) checkpoint quiz',
  'ai-checkpoint': 'Pass the Chapter 9 (AI Integration) checkpoint quiz',
  'ecosystems-checkpoint': 'Pass the Chapter 10 (Mobile & Ecosystems) checkpoint quiz',
  'solo-checkpoint': 'Pass the Chapter 11 (Solo) checkpoint quiz',
  'startup-checkpoint': 'Pass the Chapter 12 (Startup) checkpoint quiz',
  'enterprise-checkpoint': 'Pass the Chapter 13 (Enterprise) checkpoint quiz',
  'comparison-checkpoint': 'Pass the Chapter 14 (Comparison) checkpoint quiz',
  'decisions-checkpoint': 'Pass the Chapter 15 (Decisions) checkpoint quiz',
  'career-checkpoint': 'Pass the Chapter 16 (Career) checkpoint quiz',
};

/**
 * Human-readable label for a quiz id. Curated map wins; otherwise we
 * derive something readable from the slug.
 */
export function describeQuiz(quizId: string): string {
  if (PREREQ_DESCRIPTIONS[quizId]) return PREREQ_DESCRIPTIONS[quizId];
  // e.g. "lifecycle-design-page" → "Pass the lifecycle / design page quiz"
  const base = quizId.replace(/-page$/, '');
  const pretty = base.replace(/-/g, ' ');
  return `Pass the "${pretty}" page quiz`;
}

/**
 * Read pass status from localStorage. Returns true if the quiz was
 * passed; false if no record or if it was attempted and failed.
 */
export function isQuizPassed(quizId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(`quiz-${quizId}`);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.passed === true;
  } catch {
    return false;
  }
}

/**
 * Parse a sidebar link href into {chapter, path}. Returns null if the
 * href isn't a /docs/... link.
 */
export function parseDocHref(
  href: string,
): {chapter: string; path: string} | null {
  const m = href.match(/\/docs\/([^/?#]+)(?:\/([^/?#]+))?/);
  if (!m) return null;
  const chapter = m[1];
  const page = m[2];
  return {
    chapter,
    path: page ? `${chapter}/${page}` : chapter,
  };
}

/**
 * Compute ALL unmet prerequisite quiz ids for a sidebar link.
 * Returns an empty array when unlocked.
 *
 *   - First applies CHAPTER_PREREQS (chapter-entry gate).
 *   - Then applies in-chapter sequence: for the link's path, every
 *     page in CHAPTER_PAGE_ORDER[chapter] that comes BEFORE this
 *     page must have its PAGE_CHECKPOINTS quiz passed.
 */
export function unmetPrereqs(href: string): string[] {
  const parsed = parseDocHref(href);
  if (!parsed) return [];
  const {chapter, path} = parsed;
  const out: string[] = [];

  // Layer 1: chapter-entry gate.
  const chapterReqs = CHAPTER_PREREQS[chapter];
  if (chapterReqs) {
    chapterReqs.forEach((q) => {
      if (!isQuizPassed(q) && !out.includes(q)) out.push(q);
    });
  }

  // Chapter index pages are always reachable once the entry gate is met.
  if (path === chapter) return out;

  // Layer 2: in-chapter sequence gate.
  const order = CHAPTER_PAGE_ORDER[chapter];
  if (order) {
    const myIndex = order.indexOf(path);
    if (myIndex > 0) {
      for (let i = 0; i < myIndex; i++) {
        const earlierPath = order[i];
        const quizId = PAGE_CHECKPOINTS[earlierPath];
        if (quizId && !isQuizPassed(quizId) && !out.includes(quizId)) {
          out.push(quizId);
        }
      }
    }
  }

  return out;
}
