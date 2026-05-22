/**
 * Sidebar locking prereqs — two layers:
 *
 *   1. CHAPTER_PREREQS: a chapter (e.g. "lifecycle") is locked until
 *      these quizzes are passed. The chain is now sequential:
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
 */

/** Chapter-entry gates: chapter X is locked until these quizzes pass. */
export const CHAPTER_PREREQS: Record<string, string[]> = {
  foundations: [],
  lifecycle: ['foundations-checkpoint'],
  stack: ['lifecycle-checkpoint'],
  solo: ['stack-checkpoint'],
  startup: ['solo-checkpoint'],
  enterprise: ['startup-checkpoint'],
  comparison: ['enterprise-checkpoint'],
  decisions: ['comparison-checkpoint'],
  ai: ['decisions-checkpoint'],
  career: ['ai-checkpoint'],
  glossary: [],
};

/**
 * Per-page checkpoint quiz id. The KEY is the URL path
 * (chapter-slug/page-slug). The VALUE is the quiz id used inside
 * <Quiz id="...">.
 */
export const PAGE_CHECKPOINTS: Record<string, string> = {
  // Chapter 1 — Foundations (unprefixed IDs, established earlier)
  'foundations/client-server': 'client-server-page',
  'foundations/http-basics': 'http-basics-page',
  'foundations/http-methods-and-status': 'http-methods-page',
  'foundations/http-headers-cookies': 'http-headers-cookies-page',
  'foundations/dns': 'dns-page',
  'foundations/cdn-and-edge': 'cdn-edge-page',
  'foundations/browser-runtime': 'browser-runtime-page',
  'foundations/rendering-pipeline': 'rendering-pipeline-page',
  'foundations/rendering-strategies': 'rendering-strategies-page',
  'foundations/ssg': 'ssg-page',
  'foundations/ssr': 'ssr-page',
  'foundations/csr': 'csr-page',
  'foundations/isr-streaming-ppr': 'isr-streaming-ppr-page',
  'foundations/spa-mpa-hybrid': 'spa-mpa-hybrid-page',
  'foundations/apis-rest': 'apis-rest-page',
  'foundations/apis-graphql-trpc': 'apis-graphql-trpc-page',
  'foundations/apis-realtime': 'apis-realtime-page',
  'foundations/databases-sql': 'databases-sql-page',
  'foundations/databases-nosql': 'databases-nosql-page',
  'foundations/databases-choosing': 'databases-choosing-page',
  'foundations/authentication': 'authentication-page',
  'foundations/authorization': 'authorization-page',
  'foundations/deployment-pyramid': 'deployment-pyramid-page',
  'foundations/deployment-stages': 'deployment-stages-page',
  'foundations/foundations-checkpoint': 'foundations-checkpoint',

  // Chapter 2 — Lifecycle (incl. summary checkpoint)
  'lifecycle/lifecycle-checkpoint': 'lifecycle-checkpoint',
  'lifecycle/discovery-planning': 'lifecycle-discovery-planning-page',
  'lifecycle/design': 'lifecycle-design-page',
  'lifecycle/architecture': 'lifecycle-architecture-page',
  'lifecycle/environment-setup': 'lifecycle-environment-setup-page',
  'lifecycle/implementation': 'lifecycle-implementation-page',
  'lifecycle/testing': 'lifecycle-testing-page',
  'lifecycle/code-review': 'lifecycle-code-review-page',
  'lifecycle/ci-cd': 'lifecycle-ci-cd-page',
  'lifecycle/deployment-hosting': 'lifecycle-deployment-hosting-page',
  'lifecycle/observability': 'lifecycle-observability-page',
  'lifecycle/maintenance': 'lifecycle-maintenance-page',

  // Chapter 3 — Stack (incl. summary checkpoint)
  'stack/stack-checkpoint': 'stack-checkpoint',
  'stack/languages': 'stack-languages-page',
  'stack/frontend-frameworks': 'stack-frontend-frameworks-page',
  'stack/styling': 'stack-styling-page',
  'stack/build-tools': 'stack-build-tools-page',
  'stack/package-managers': 'stack-package-managers-page',
  'stack/state-management': 'stack-state-management-page',
  'stack/backend-frameworks': 'stack-backend-frameworks-page',
  'stack/apis': 'stack-apis-page',
  'stack/databases': 'stack-databases-page',
  'stack/orms': 'stack-orms-page',
  'stack/authentication-tools': 'stack-authentication-tools-page',
  'stack/background-jobs': 'stack-background-jobs-page',
  'stack/services': 'stack-services-page',
  'stack/ai-infrastructure': 'stack-ai-infrastructure-page',
  'stack/hosting': 'stack-hosting-page',
  'stack/devops': 'stack-devops-page',
  'stack/observability-tools': 'stack-observability-tools-page',
  'stack/code-quality': 'stack-code-quality-page',
  'stack/editors-ai': 'stack-editors-ai-page',

  // Chapter 4 — Solo (incl. summary checkpoint)
  'solo/solo-checkpoint': 'solo-checkpoint',
  'solo/mindset': 'solo-mindset-page',
  'solo/project-types': 'solo-project-types-page',
  'solo/planning': 'solo-planning-page',
  'solo/stack-selection': 'solo-stack-selection-page',
  'solo/env-setup': 'solo-env-setup-page',
  'solo/development': 'solo-development-page',
  'solo/auth': 'solo-auth-page',
  'solo/payments': 'solo-payments-page',
  'solo/deployment': 'solo-deployment-page',
  'solo/observability': 'solo-observability-page',
  'solo/launching': 'solo-launching-page',
  'solo/maintenance': 'solo-maintenance-page',
  'solo/time-investment': 'solo-time-investment-page',
  'solo/pitfalls': 'solo-pitfalls-page',
  'solo/templates': 'solo-templates-page',
  'solo/sample-project': 'solo-sample-project-page',
  'solo/graduating': 'solo-graduating-page',

  // Chapter 5 — Startup (incl. summary checkpoint)
  'startup/startup-checkpoint': 'startup-checkpoint',
  'startup/mindset': 'startup-mindset-page',
  'startup/team-structure': 'startup-team-structure-page',
  'startup/planning': 'startup-planning-page',
  'startup/design': 'startup-design-page',
  'startup/architecture': 'startup-architecture-page',
  'startup/env-setup': 'startup-env-setup-page',
  'startup/development': 'startup-development-page',
  'startup/testing': 'startup-testing-page',
  'startup/cicd': 'startup-cicd-page',
  'startup/deployment': 'startup-deployment-page',
  'startup/observability': 'startup-observability-page',
  'startup/security': 'startup-security-page',
  'startup/maintenance': 'startup-maintenance-page',
  'startup/cost-breakdown': 'startup-cost-breakdown-page',
  'startup/day-in-life': 'startup-day-in-life-page',
  'startup/pitfalls': 'startup-pitfalls-page',
  'startup/outgrowing': 'startup-outgrowing-page',

  // Chapter 6 — Enterprise (note: first page slug is "enterprise-mindset")
  'enterprise/enterprise-checkpoint': 'enterprise-checkpoint',
  'enterprise/enterprise-mindset': 'enterprise-mindset-page',
  'enterprise/team-structure': 'enterprise-team-structure-page',
  'enterprise/planning': 'enterprise-planning-page',
  'enterprise/architecture': 'enterprise-architecture-page',
  'enterprise/frontend-architecture': 'enterprise-frontend-architecture-page',
  'enterprise/developer-experience': 'enterprise-developer-experience-page',
  'enterprise/development-practices': 'enterprise-development-practices-page',
  'enterprise/testing': 'enterprise-testing-page',
  'enterprise/ci-cd': 'enterprise-ci-cd-page',
  'enterprise/deployment': 'enterprise-deployment-page',
  'enterprise/observability': 'enterprise-observability-page',
  'enterprise/security-compliance': 'enterprise-security-compliance-page',
  'enterprise/release-management': 'enterprise-release-management-page',
  'enterprise/cost-picture': 'enterprise-cost-picture-page',
  'enterprise/pitfalls': 'enterprise-pitfalls-page',
  'enterprise/day-in-life': 'enterprise-day-in-life-page',
  'enterprise/when-to-use': 'enterprise-when-to-use-page',
  'enterprise/too-big': 'enterprise-too-big-page',

  // Chapter 7 — Comparison (incl. summary checkpoint)
  'comparison/comparison-checkpoint': 'comparison-checkpoint',
  'comparison/team-and-process': 'comparison-team-and-process-page',
  'comparison/stack-and-hosting': 'comparison-stack-and-hosting-page',
  'comparison/development': 'comparison-development-page',
  'comparison/ops': 'comparison-ops-page',
  'comparison/economics': 'comparison-economics-page',
  'comparison/tradeoffs': 'comparison-tradeoffs-page',

  // Chapter 8 — Decisions (incl. summary checkpoint)
  'decisions/decisions-checkpoint': 'decisions-checkpoint',
  'decisions/boring-technology': 'decisions-boring-technology-page',
  'decisions/reversibility': 'decisions-reversibility-page',
  'decisions/team-size-heuristic': 'decisions-team-size-heuristic-page',
  'decisions/build-vs-buy': 'decisions-build-vs-buy-page',
  'decisions/two-pizza-rule': 'decisions-two-pizza-rule-page',
  'decisions/why-now': 'decisions-why-now-page',
  'decisions/cost-of-inaction': 'decisions-cost-of-inaction-page',
  'decisions/migration-strategy': 'decisions-migration-strategy-page',
  'decisions/two-versions': 'decisions-two-versions-page',
  'decisions/premature-optimization': 'decisions-premature-optimization-page',
  'decisions/documentation-tradeoff': 'decisions-documentation-tradeoff-page',
  'decisions/what-would-hurt': 'decisions-what-would-hurt-page',
  'decisions/why-doing-this': 'decisions-why-doing-this-page',
  'decisions/hiring-constraint': 'decisions-hiring-constraint-page',
  'decisions/checklist': 'decisions-checklist-page',
  'decisions/overriding': 'decisions-overriding-page',

  // Chapter 9 — AI (page IDs already prefixed with "ai-"; incl. checkpoint)
  'ai/ai-checkpoint': 'ai-checkpoint',
  'ai/ai-streaming-chat': 'ai-streaming-chat-page',
  'ai/ai-rag': 'ai-rag-page',
  'ai/ai-function-calling': 'ai-function-calling-page',
  'ai/ai-agents': 'ai-agents-page',
  'ai/ai-embeddings': 'ai-embeddings-page',
  'ai/ai-multimodal': 'ai-multimodal-page',
  'ai/ai-observability': 'ai-observability-page',
  'ai/ai-costs': 'ai-costs-page',
  'ai/ai-safety': 'ai-safety-page',
  'ai/ai-example': 'ai-example-page',
  'ai/ai-when-not-to-use': 'ai-when-not-to-use-page',
  'ai/ai-stack-summary': 'ai-stack-summary-page',

  // Chapter 10 — Career (some IDs already prefixed with "career-"; incl. checkpoint)
  'career/career-checkpoint': 'career-checkpoint',
  'career/state-of-market': 'career-state-of-market-page',
  'career/foundational-skills': 'career-foundational-skills-page',
  'career/career-portfolio': 'career-portfolio-page',
  'career/career-job-search': 'career-job-search-page',
  'career/career-specialization': 'career-specialization-page',
  'career/career-compensation': 'career-compensation-page',
  'career/career-continuous-learning': 'career-continuous-learning-page',
  'career/career-pitfalls': 'career-pitfalls-page',
  'career/career-bootcamps-degrees': 'career-bootcamps-degrees-page',
  'career/career-multi-year-path': 'career-multi-year-path-page',
  'career/career-for-tony': 'career-for-tony-page',
};

/**
 * Pages in reading order, per chapter. Used to derive the
 * "everything before this page must be passed" prereqs.
 */
export const CHAPTER_PAGE_ORDER: Record<string, string[]> = {
  foundations: [
    'foundations/client-server',
    'foundations/http-basics',
    'foundations/http-methods-and-status',
    'foundations/http-headers-cookies',
    'foundations/dns',
    'foundations/cdn-and-edge',
    'foundations/browser-runtime',
    'foundations/rendering-pipeline',
    'foundations/rendering-strategies',
    'foundations/ssg',
    'foundations/ssr',
    'foundations/csr',
    'foundations/isr-streaming-ppr',
    'foundations/spa-mpa-hybrid',
    'foundations/apis-rest',
    'foundations/apis-graphql-trpc',
    'foundations/apis-realtime',
    'foundations/databases-sql',
    'foundations/databases-nosql',
    'foundations/databases-choosing',
    'foundations/authentication',
    'foundations/authorization',
    'foundations/deployment-pyramid',
    'foundations/deployment-stages',
    'foundations/foundations-checkpoint',
  ],
  lifecycle: [
    'lifecycle/discovery-planning',
    'lifecycle/design',
    'lifecycle/architecture',
    'lifecycle/environment-setup',
    'lifecycle/implementation',
    'lifecycle/testing',
    'lifecycle/code-review',
    'lifecycle/ci-cd',
    'lifecycle/deployment-hosting',
    'lifecycle/observability',
    'lifecycle/maintenance',
    'lifecycle/lifecycle-checkpoint',
  ],
  stack: [
    'stack/languages',
    'stack/frontend-frameworks',
    'stack/styling',
    'stack/build-tools',
    'stack/package-managers',
    'stack/state-management',
    'stack/backend-frameworks',
    'stack/apis',
    'stack/databases',
    'stack/orms',
    'stack/authentication-tools',
    'stack/background-jobs',
    'stack/services',
    'stack/ai-infrastructure',
    'stack/hosting',
    'stack/devops',
    'stack/observability-tools',
    'stack/code-quality',
    'stack/editors-ai',
    'stack/stack-checkpoint',
  ],
  solo: [
    'solo/mindset',
    'solo/project-types',
    'solo/planning',
    'solo/stack-selection',
    'solo/env-setup',
    'solo/development',
    'solo/auth',
    'solo/payments',
    'solo/deployment',
    'solo/observability',
    'solo/launching',
    'solo/maintenance',
    'solo/time-investment',
    'solo/pitfalls',
    'solo/templates',
    'solo/sample-project',
    'solo/graduating',
    'solo/solo-checkpoint',
  ],
  startup: [
    'startup/mindset',
    'startup/team-structure',
    'startup/planning',
    'startup/design',
    'startup/architecture',
    'startup/env-setup',
    'startup/development',
    'startup/testing',
    'startup/cicd',
    'startup/deployment',
    'startup/observability',
    'startup/security',
    'startup/maintenance',
    'startup/cost-breakdown',
    'startup/day-in-life',
    'startup/pitfalls',
    'startup/outgrowing',
    'startup/startup-checkpoint',
  ],
  enterprise: [
    'enterprise/enterprise-mindset',
    'enterprise/team-structure',
    'enterprise/planning',
    'enterprise/architecture',
    'enterprise/frontend-architecture',
    'enterprise/developer-experience',
    'enterprise/development-practices',
    'enterprise/testing',
    'enterprise/ci-cd',
    'enterprise/deployment',
    'enterprise/observability',
    'enterprise/security-compliance',
    'enterprise/release-management',
    'enterprise/cost-picture',
    'enterprise/pitfalls',
    'enterprise/day-in-life',
    'enterprise/when-to-use',
    'enterprise/too-big',
    'enterprise/enterprise-checkpoint',
  ],
  comparison: [
    'comparison/team-and-process',
    'comparison/stack-and-hosting',
    'comparison/development',
    'comparison/ops',
    'comparison/economics',
    'comparison/tradeoffs',
    'comparison/comparison-checkpoint',
  ],
  decisions: [
    'decisions/boring-technology',
    'decisions/reversibility',
    'decisions/team-size-heuristic',
    'decisions/build-vs-buy',
    'decisions/two-pizza-rule',
    'decisions/why-now',
    'decisions/cost-of-inaction',
    'decisions/migration-strategy',
    'decisions/two-versions',
    'decisions/premature-optimization',
    'decisions/documentation-tradeoff',
    'decisions/what-would-hurt',
    'decisions/why-doing-this',
    'decisions/hiring-constraint',
    'decisions/checklist',
    'decisions/overriding',
    'decisions/decisions-checkpoint',
  ],
  ai: [
    'ai/ai-streaming-chat',
    'ai/ai-rag',
    'ai/ai-function-calling',
    'ai/ai-agents',
    'ai/ai-embeddings',
    'ai/ai-multimodal',
    'ai/ai-observability',
    'ai/ai-costs',
    'ai/ai-safety',
    'ai/ai-example',
    'ai/ai-when-not-to-use',
    'ai/ai-stack-summary',
    'ai/ai-checkpoint',
  ],
  career: [
    'career/state-of-market',
    'career/foundational-skills',
    'career/career-portfolio',
    'career/career-job-search',
    'career/career-specialization',
    'career/career-compensation',
    'career/career-continuous-learning',
    'career/career-pitfalls',
    'career/career-bootcamps-degrees',
    'career/career-multi-year-path',
    'career/career-for-tony',
    'career/career-checkpoint',
  ],
};

/**
 * Curated hover-tooltip text for a few key gating quizzes.
 * Anything not listed falls back to `describeQuiz` below, which
 * derives a readable label from the quiz id.
 */
export const PREREQ_DESCRIPTIONS: Record<string, string> = {
  'foundations-checkpoint': 'Pass the Chapter 1 (Foundations) checkpoint quiz',
  'lifecycle-checkpoint': 'Pass the Chapter 2 (Lifecycle) checkpoint quiz',
  'stack-checkpoint': 'Pass the Chapter 3 (Tech Stack) checkpoint quiz',
  'solo-checkpoint': 'Pass the Chapter 4 (Solo) checkpoint quiz',
  'startup-checkpoint': 'Pass the Chapter 5 (Startup) checkpoint quiz',
  'enterprise-checkpoint': 'Pass the Chapter 6 (Enterprise) checkpoint quiz',
  'comparison-checkpoint': 'Pass the Chapter 7 (Comparison) checkpoint quiz',
  'decisions-checkpoint': 'Pass the Chapter 8 (Decisions) checkpoint quiz',
  'ai-checkpoint': 'Pass the Chapter 9 (AI Layer) checkpoint quiz',
  'career-checkpoint': 'Pass the Chapter 10 (Career) checkpoint quiz',
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
