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
  // ai
  'ai/ai-agents': 'ai-agents-page',
  'ai/ai-checkpoint': 'ai-checkpoint',
  'ai/ai-costs': 'ai-costs-page',
  'ai/ai-embeddings': 'ai-embeddings-page',
  'ai/ai-evals': 'ai-evals-page',
  'ai/ai-example': 'ai-example-page',
  'ai/ai-function-calling': 'ai-function-calling-page',
  'ai/ai-multimodal': 'ai-multimodal-page',
  'ai/ai-observability': 'ai-observability-page',
  'ai/ai-rag': 'ai-rag-page',
  'ai/ai-realtime-voice': 'ai-realtime-voice-page',
  'ai/ai-safety': 'ai-safety-page',
  'ai/ai-stack-summary': 'ai-stack-summary-page',
  'ai/ai-streaming-chat': 'ai-streaming-chat-page',
  'ai/ai-system-prompt-engineering': 'ai-system-prompt-engineering-page',
  'ai/ai-when-not-to-use': 'ai-when-not-to-use-page',

  // career
  'career/career-bootcamps-degrees': 'career-bootcamps-degrees-page',
  'career/career-checkpoint': 'career-checkpoint',
  'career/career-compensation': 'career-compensation-page',
  'career/career-continuous-learning': 'career-continuous-learning-page',
  'career/career-for-tony': 'career-for-tony-page',
  'career/career-job-search': 'career-job-search-page',
  'career/career-multi-year-path': 'career-multi-year-path-page',
  'career/career-pitfalls': 'career-pitfalls-page',
  'career/career-portfolio': 'career-portfolio-page',
  'career/career-specialization': 'career-specialization-page',
  'career/foundational-skills': 'career-foundational-skills-page',
  'career/state-of-market': 'career-state-of-market-page',

  // cloud
  'cloud/cloud-checkpoint': 'cloud-checkpoint',
  'cloud/cloud-choosing': 'cloud-choosing-page',
  'cloud/cloud-compute': 'cloud-compute-page',
  'cloud/cloud-cost': 'cloud-cost-page',
  'cloud/cloud-iac': 'cloud-iac-page',
  'cloud/cloud-iam': 'cloud-iam-page',
  'cloud/cloud-managed-data': 'cloud-managed-data-page',
  'cloud/cloud-mental-model': 'cloud-mental-model-page',
  'cloud/cloud-networking': 'cloud-networking-page',
  'cloud/cloud-serverless': 'cloud-serverless-page',
  'cloud/cloud-storage': 'cloud-storage-page',

  // comparison
  'comparison/comparison-checkpoint': 'comparison-checkpoint',
  'comparison/development': 'comparison-development-page',
  'comparison/economics': 'comparison-economics-page',
  'comparison/ops': 'comparison-ops-page',
  'comparison/stack-and-hosting': 'comparison-stack-and-hosting-page',
  'comparison/team-and-process': 'comparison-team-and-process-page',
  'comparison/tradeoffs': 'comparison-tradeoffs-page',

  // decisions
  'decisions/boring-technology': 'decisions-boring-technology-page',
  'decisions/build-vs-buy': 'decisions-build-vs-buy-page',
  'decisions/checklist': 'decisions-checklist-page',
  'decisions/cost-of-inaction': 'decisions-cost-of-inaction-page',
  'decisions/decisions-checkpoint': 'decisions-checkpoint',
  'decisions/documentation-tradeoff': 'decisions-documentation-tradeoff-page',
  'decisions/hiring-constraint': 'decisions-hiring-constraint-page',
  'decisions/migration-strategy': 'decisions-migration-strategy-page',
  'decisions/overriding': 'decisions-overriding-page',
  'decisions/premature-optimization': 'decisions-premature-optimization-page',
  'decisions/reversibility': 'decisions-reversibility-page',
  'decisions/team-size-heuristic': 'decisions-team-size-heuristic-page',
  'decisions/two-pizza-rule': 'decisions-two-pizza-rule-page',
  'decisions/two-versions': 'decisions-two-versions-page',
  'decisions/what-would-hurt': 'decisions-what-would-hurt-page',
  'decisions/why-doing-this': 'decisions-why-doing-this-page',
  'decisions/why-now': 'decisions-why-now-page',

  // distributed-systems
  'distributed-systems/distributed-systems-checkpoint': 'distributed-systems-checkpoint',
  'distributed-systems/ds-consensus': 'ds-consensus-page',
  'distributed-systems/ds-consistency': 'ds-consistency-page',
  'distributed-systems/ds-fallacies': 'ds-fallacies-page',
  'distributed-systems/ds-replication': 'ds-replication-page',
  'distributed-systems/ds-time': 'ds-time-page',
  'distributed-systems/ds-transactions': 'ds-transactions-page',
  'distributed-systems/event-streaming': 'event-streaming-page',
  'distributed-systems/idempotency': 'idempotency-page',
  'distributed-systems/messaging-patterns': 'messaging-patterns-page',
  'distributed-systems/partitioning': 'partitioning-page',

  // ecosystems
  'ecosystems/choosing-ecosystem': 'choosing-ecosystem-page',
  'ecosystems/dotnet-ecosystem': 'dotnet-ecosystem-page',
  'ecosystems/ecosystems-checkpoint': 'ecosystems-checkpoint',
  'ecosystems/flutter': 'flutter-page',
  'ecosystems/go-ecosystem': 'go-ecosystem-page',
  'ecosystems/jvm-ecosystem': 'jvm-ecosystem-page',
  'ecosystems/mobile-landscape': 'mobile-landscape-page',
  'ecosystems/pwa': 'pwa-page',
  'ecosystems/python-ecosystem': 'python-ecosystem-page',
  'ecosystems/react-native': 'react-native-page',

  // enterprise
  'enterprise/architecture': 'enterprise-architecture-page',
  'enterprise/ci-cd': 'enterprise-ci-cd-page',
  'enterprise/cost-picture': 'enterprise-cost-picture-page',
  'enterprise/day-in-life': 'enterprise-day-in-life-page',
  'enterprise/deployment': 'enterprise-deployment-page',
  'enterprise/developer-experience': 'enterprise-developer-experience-page',
  'enterprise/development-practices': 'enterprise-development-practices-page',
  'enterprise/enterprise-checkpoint': 'enterprise-checkpoint',
  'enterprise/enterprise-mindset': 'enterprise-mindset-page',
  'enterprise/frontend-architecture': 'enterprise-frontend-architecture-page',
  'enterprise/observability': 'enterprise-observability-page',
  'enterprise/pitfalls': 'enterprise-pitfalls-page',
  'enterprise/planning': 'enterprise-planning-page',
  'enterprise/release-management': 'enterprise-release-management-page',
  'enterprise/security-compliance': 'enterprise-security-compliance-page',
  'enterprise/team-structure': 'enterprise-team-structure-page',
  'enterprise/testing': 'enterprise-testing-page',
  'enterprise/too-big': 'enterprise-too-big-page',
  'enterprise/when-to-use': 'enterprise-when-to-use-page',

  // foundations
  'foundations/accessibility': 'foundations-accessibility-page',
  'foundations/apis-graphql-trpc': 'apis-graphql-trpc-page',
  'foundations/apis-realtime': 'apis-realtime-page',
  'foundations/apis-rest': 'apis-rest-page',
  'foundations/authentication': 'authentication-page',
  'foundations/authorization': 'authorization-page',
  'foundations/browser-runtime': 'browser-runtime-page',
  'foundations/caching': 'foundations-caching-page',
  'foundations/cdn-and-edge': 'cdn-edge-page',
  'foundations/client-server': 'client-server-page',
  'foundations/concurrency': 'foundations-concurrency-page',
  'foundations/containers': 'foundations-containers-page',
  'foundations/crdts': 'foundations-crdts-page',
  'foundations/csr': 'csr-page',
  'foundations/databases-choosing': 'databases-choosing-page',
  'foundations/databases-nosql': 'databases-nosql-page',
  'foundations/databases-sql': 'databases-sql-page',
  'foundations/debugging': 'foundations-debugging-page',
  'foundations/deployment-pyramid': 'deployment-pyramid-page',
  'foundations/deployment-stages': 'deployment-stages-page',
  'foundations/distributed-systems': 'foundations-distributed-systems-page',
  'foundations/dns': 'dns-page',
  'foundations/edge-computing': 'foundations-edge-computing-page',
  'foundations/email': 'foundations-email-page',
  'foundations/files-and-media': 'foundations-files-and-media-page',
  'foundations/foundations-checkpoint': 'foundations-checkpoint',
  'foundations/foundations-mid-checkpoint': 'foundations-mid-checkpoint',
  'foundations/http-basics': 'http-basics-page',
  'foundations/http-headers-cookies': 'headers-mq1',
  'foundations/http-methods-and-status': 'http-methods-page',
  'foundations/i18n': 'foundations-i18n-page',
  'foundations/isr-streaming-ppr': 'isr-streaming-ppr-page',
  'foundations/message-queues': 'foundations-message-queues-page',
  'foundations/observability-fundamentals': 'foundations-observability-fundamentals-page',
  'foundations/payments': 'foundations-payments-page',
  'foundations/performance': 'foundations-performance-page',
  'foundations/rate-limiting': 'foundations-rate-limiting-page',
  'foundations/rendering-pipeline': 'rendering-pipeline-page',
  'foundations/rendering-strategies': 'rendering-strategies-page',
  'foundations/search': 'foundations-search-page',
  'foundations/secrets-and-keys': 'foundations-secrets-and-keys-page',
  'foundations/seo': 'foundations-seo-page',
  'foundations/spa-mpa-hybrid': 'spa-mpa-hybrid-page',
  'foundations/ssg': 'ssg-page',
  'foundations/ssr': 'ssr-page',
  'foundations/testing': 'foundations-testing-page',
  'foundations/web-security': 'foundations-web-security-page',
  'foundations/webrtc': 'foundations-webrtc-page',

  // lifecycle
  'lifecycle/architecture': 'lifecycle-architecture-page',
  'lifecycle/ci-cd': 'lifecycle-ci-cd-page',
  'lifecycle/code-review': 'lifecycle-code-review-page',
  'lifecycle/deployment-hosting': 'lifecycle-deployment-hosting-page',
  'lifecycle/design': 'lifecycle-design-page',
  'lifecycle/discovery-planning': 'lifecycle-discovery-planning-page',
  'lifecycle/documentation': 'lifecycle-documentation-page',
  'lifecycle/environment-setup': 'lifecycle-environment-setup-page',
  'lifecycle/estimation': 'lifecycle-estimation-page',
  'lifecycle/implementation': 'lifecycle-implementation-page',
  'lifecycle/legacy-code': 'lifecycle-legacy-code-page',
  'lifecycle/lifecycle-checkpoint': 'lifecycle-checkpoint',
  'lifecycle/maintenance': 'lifecycle-maintenance-page',
  'lifecycle/observability': 'lifecycle-observability-page',
  'lifecycle/open-source': 'lifecycle-open-source-page',
  'lifecycle/reading-code': 'lifecycle-reading-code-page',
  'lifecycle/testing': 'lifecycle-testing-page',

  // operations
  'operations/capacity-scaling': 'capacity-scaling-page',
  'operations/chaos-engineering': 'chaos-resilience-page',
  'operations/incident-response': 'incident-response-page',
  'operations/on-call-alerting': 'on-call-alerting-page',
  'operations/operations-checkpoint': 'operations-checkpoint',
  'operations/ops-deploys': 'ops-deploys-page',
  'operations/ops-observability': 'ops-observability-page',
  'operations/reliability-patterns': 'reliability-patterns-page',
  'operations/sre-mindset': 'sre-mindset-page',

  // roadmap
  'roadmap/ai-as-learner': 'ai-as-learner-page',
  'roadmap/asking-questions': 'asking-questions-page',
  'roadmap/cs-fundamentals': 'cs-fundamentals-page',
  'roadmap/engineering-judgment': 'engineering-judgment-page',
  'roadmap/git-advanced': 'git-advanced-page',
  'roadmap/how-to-learn': 'how-to-learn-page',
  'roadmap/performance-deep': 'performance-deep-page',
  'roadmap/roadmap-checkpoint': 'roadmap-checkpoint',
  'roadmap/security': 'security-page',
  'roadmap/stage-0-setup': 'stage-0-page',
  'roadmap/stage-1-javascript-basics': 'stage-1-page',
  'roadmap/stage-10-backend': 'stage-10-page',
  'roadmap/stage-11-fullstack': 'stage-11-page',
  'roadmap/stage-12-going-pro': 'stage-12-page',
  'roadmap/stage-2-html-css': 'stage-2-page',
  'roadmap/stage-3-js-in-browser': 'stage-3-page',
  'roadmap/stage-4-git': 'stage-4-page',
  'roadmap/stage-5-typescript': 'stage-5-page',
  'roadmap/stage-6-react': 'stage-6-page',
  'roadmap/stage-7-tailwind': 'stage-7-page',
  'roadmap/stage-8-nextjs': 'stage-8-page',
  'roadmap/stage-9-portfolio': 'stage-9-page',
  'roadmap/systems-thinking': 'systems-thinking-page',
  'roadmap/testing-deep': 'testing-deep-page',
  'roadmap/tier-1': 'tier-1-page',
  'roadmap/tier-2': 'tier-2-page',
  'roadmap/tier-3': 'tier-3-page',
  'roadmap/trends': 'trends-page',
  'roadmap/tutorial-trap': 'tutorial-trap-page',

  // solo
  'solo/auth': 'solo-auth-page',
  'solo/deployment': 'solo-deployment-page',
  'solo/development': 'solo-development-page',
  'solo/env-setup': 'solo-env-setup-page',
  'solo/graduating': 'solo-graduating-page',
  'solo/launching': 'solo-launching-page',
  'solo/maintenance': 'solo-maintenance-page',
  'solo/mindset': 'solo-mindset-page',
  'solo/observability': 'solo-observability-page',
  'solo/payments': 'solo-payments-page',
  'solo/pitfalls': 'solo-pitfalls-page',
  'solo/planning': 'solo-planning-page',
  'solo/project-types': 'solo-project-types-page',
  'solo/sample-project': 'solo-sample-project-page',
  'solo/solo-checkpoint': 'solo-checkpoint',
  'solo/stack-selection': 'solo-stack-selection-page',
  'solo/templates': 'solo-templates-page',
  'solo/time-investment': 'solo-time-investment-page',

  // stack
  'stack/ai-infrastructure': 'stack-ai-infrastructure-page',
  'stack/apis': 'stack-apis-page',
  'stack/apis-advanced': 'stack-apis-advanced-page',
  'stack/authentication-tools': 'stack-authentication-tools-page',
  'stack/backend-frameworks': 'stack-backend-frameworks-page',
  'stack/background-jobs': 'stack-background-jobs-page',
  'stack/build-tools': 'stack-build-tools-page',
  'stack/code-quality': 'stack-code-quality-page',
  'stack/databases': 'stack-databases-page',
  'stack/databases-advanced': 'stack-databases-advanced-page',
  'stack/devops': 'stack-devops-page',
  'stack/editors-ai': 'stack-editors-ai-page',
  'stack/frontend-frameworks': 'stack-frontend-frameworks-page',
  'stack/frontend-frameworks-advanced': 'stack-react-advanced-page',
  'stack/hosting': 'stack-hosting-page',
  'stack/languages': 'stack-languages-page',
  'stack/observability-tools': 'stack-observability-tools-page',
  'stack/orms': 'stack-orms-page',
  'stack/package-managers': 'stack-package-managers-page',
  'stack/services': 'stack-services-page',
  'stack/stack-checkpoint': 'stack-checkpoint',
  'stack/state-management': 'stack-state-management-page',
  'stack/styling': 'stack-styling-page',
  'stack/styling-advanced': 'stack-css-advanced-page',
  'stack/typescript-advanced': 'stack-typescript-advanced-page',

  // startup
  'startup/architecture': 'startup-architecture-page',
  'startup/cicd': 'startup-cicd-page',
  'startup/cost-breakdown': 'startup-cost-breakdown-page',
  'startup/day-in-life': 'startup-day-in-life-page',
  'startup/deployment': 'startup-deployment-page',
  'startup/design': 'startup-design-page',
  'startup/development': 'startup-development-page',
  'startup/env-setup': 'startup-env-setup-page',
  'startup/maintenance': 'startup-maintenance-page',
  'startup/mindset': 'startup-mindset-page',
  'startup/observability': 'startup-observability-page',
  'startup/outgrowing': 'startup-outgrowing-page',
  'startup/pitfalls': 'startup-pitfalls-page',
  'startup/planning': 'startup-planning-page',
  'startup/security': 'startup-security-page',
  'startup/startup-checkpoint': 'startup-checkpoint',
  'startup/team-structure': 'startup-team-structure-page',
  'startup/testing': 'startup-testing-page',
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
    'foundations/webrtc',
    'foundations/message-queues',
    'foundations/databases-sql',
    'foundations/databases-nosql',
    'foundations/databases-choosing',
    'foundations/search',
    'foundations/files-and-media',
    'foundations/authentication',
    'foundations/authorization',
    'foundations/web-security',
    'foundations/deployment-pyramid',
    'foundations/deployment-stages',
    'foundations/containers',
    'foundations/edge-computing',
    'foundations/performance',
    'foundations/accessibility',
    'foundations/crdts',
    'foundations/i18n',
    'foundations/seo',
    'foundations/payments',
    'foundations/email',
    'foundations/foundations-mid-checkpoint',
    'foundations/concurrency',
    'foundations/distributed-systems',
    'foundations/rate-limiting',
    'foundations/caching',
    'foundations/secrets-and-keys',
    'foundations/observability-fundamentals',
    'foundations/testing',
    'foundations/debugging',
    'foundations/foundations-checkpoint',
  ],
  stack: [
    'stack/languages',
    'stack/typescript-advanced',
    'stack/frontend-frameworks',
    'stack/frontend-frameworks-advanced',
    'stack/styling',
    'stack/styling-advanced',
    'stack/state-management',
    'stack/build-tools',
    'stack/package-managers',
    'stack/code-quality',
    'stack/editors-ai',
    'stack/backend-frameworks',
    'stack/apis',
    'stack/apis-advanced',
    'stack/databases',
    'stack/databases-advanced',
    'stack/orms',
    'stack/authentication-tools',
    'stack/background-jobs',
    'stack/services',
    'stack/ai-infrastructure',
    'stack/hosting',
    'stack/devops',
    'stack/observability-tools',
    'stack/stack-checkpoint',
  ],
  roadmap: [
    'roadmap/stage-0-setup',
    'roadmap/stage-1-javascript-basics',
    'roadmap/stage-2-html-css',
    'roadmap/stage-3-js-in-browser',
    'roadmap/stage-4-git',
    'roadmap/stage-5-typescript',
    'roadmap/stage-6-react',
    'roadmap/stage-7-tailwind',
    'roadmap/stage-8-nextjs',
    'roadmap/stage-9-portfolio',
    'roadmap/stage-10-backend',
    'roadmap/stage-11-fullstack',
    'roadmap/stage-12-going-pro',
    'roadmap/trends',
    'roadmap/tier-1',
    'roadmap/tier-2',
    'roadmap/tier-3',
    'roadmap/cs-fundamentals',
    'roadmap/engineering-judgment',
    'roadmap/systems-thinking',
    'roadmap/security',
    'roadmap/testing-deep',
    'roadmap/git-advanced',
    'roadmap/performance-deep',
    'roadmap/how-to-learn',
    'roadmap/ai-as-learner',
    'roadmap/asking-questions',
    'roadmap/tutorial-trap',
    'roadmap/roadmap-checkpoint',
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
    'lifecycle/reading-code',
    'lifecycle/legacy-code',
    'lifecycle/estimation',
    'lifecycle/documentation',
    'lifecycle/open-source',
    'lifecycle/lifecycle-checkpoint',
  ],
  cloud: [
    'cloud/cloud-mental-model',
    'cloud/cloud-compute',
    'cloud/cloud-networking',
    'cloud/cloud-iam',
    'cloud/cloud-storage',
    'cloud/cloud-managed-data',
    'cloud/cloud-iac',
    'cloud/cloud-serverless',
    'cloud/cloud-cost',
    'cloud/cloud-choosing',
    'cloud/cloud-checkpoint',
  ],
  operations: [
    'operations/sre-mindset',
    'operations/ops-observability',
    'operations/reliability-patterns',
    'operations/on-call-alerting',
    'operations/incident-response',
    'operations/ops-deploys',
    'operations/capacity-scaling',
    'operations/chaos-engineering',
    'operations/operations-checkpoint',
  ],
  'distributed-systems': [
    'distributed-systems/ds-fallacies',
    'distributed-systems/ds-consistency',
    'distributed-systems/ds-replication',
    'distributed-systems/partitioning',
    'distributed-systems/ds-time',
    'distributed-systems/ds-consensus',
    'distributed-systems/ds-transactions',
    'distributed-systems/idempotency',
    'distributed-systems/messaging-patterns',
    'distributed-systems/event-streaming',
    'distributed-systems/distributed-systems-checkpoint',
  ],
  ai: [
    'ai/ai-streaming-chat',
    'ai/ai-rag',
    'ai/ai-function-calling',
    'ai/ai-agents',
    'ai/ai-embeddings',
    'ai/ai-multimodal',
    'ai/ai-realtime-voice',
    'ai/ai-observability',
    'ai/ai-evals',
    'ai/ai-costs',
    'ai/ai-safety',
    'ai/ai-system-prompt-engineering',
    'ai/ai-example',
    'ai/ai-when-not-to-use',
    'ai/ai-stack-summary',
    'ai/ai-checkpoint',
  ],
  ecosystems: [
    'ecosystems/mobile-landscape',
    'ecosystems/react-native',
    'ecosystems/flutter',
    'ecosystems/pwa',
    'ecosystems/jvm-ecosystem',
    'ecosystems/dotnet-ecosystem',
    'ecosystems/go-ecosystem',
    'ecosystems/python-ecosystem',
    'ecosystems/choosing-ecosystem',
    'ecosystems/ecosystems-checkpoint',
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
