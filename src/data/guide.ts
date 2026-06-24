export type GuideLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface GuideChapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: GuideLevel;
  to: string;
  lessonCount: number;
}

export interface GuideBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  chapterId?: string;
  /** Earned when this quiz id is passed (localStorage). */
  quizId?: string;
  threshold?: number;
}

/** Canonical guide chapters mapped to the Figma design's learning-path modules. */
export const chapters: GuideChapter[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'How the web actually works — HTTP, browsers, APIs, data, auth, and production patterns.',
    icon: 'Layers',
    level: 'beginner',
    to: '/docs/foundations',
    lessonCount: 48,
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Your step-by-step path from zero to modern web developer — staged curriculum and tier picks.',
    icon: 'Map',
    level: 'intermediate',
    to: '/docs/roadmap',
    lessonCount: 36,
  },
  {
    id: 'lifecycle',
    title: 'Lifecycle',
    description: 'The full development lifecycle — from idea to deploy, iterate, and maintain.',
    icon: 'RefreshCw',
    level: 'intermediate',
    to: '/docs/lifecycle',
    lessonCount: 18,
  },
  {
    id: 'stack',
    title: 'Tech Stack',
    description: 'Concrete tools for frontend, backend, data, services, and infrastructure.',
    icon: 'Code2',
    level: 'intermediate',
    to: '/docs/stack',
    lessonCount: 25,
  },
  {
    id: 'cloud',
    title: 'Cloud Platforms',
    description: 'Where and how your code runs at scale — AWS, GCP, Azure, and platform choices.',
    icon: 'Cloud',
    level: 'advanced',
    to: '/docs/cloud',
    lessonCount: 11,
  },
  {
    id: 'operations',
    title: 'SRE & Operations',
    description: 'Keep systems running — reliability, incident response, and operational excellence.',
    icon: 'Activity',
    level: 'advanced',
    to: '/docs/operations',
    lessonCount: 9,
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems',
    description: 'What changes when your app spans many machines — consistency, scaling, and failure modes.',
    icon: 'Network',
    level: 'expert',
    to: '/docs/distributed-systems',
    lessonCount: 11,
  },
  {
    id: 'ai',
    title: 'AI Integration',
    description: 'Build with LLMs — prompts, RAG, agents, and the AI infrastructure layer.',
    icon: 'Sparkles',
    level: 'advanced',
    to: '/docs/ai',
    lessonCount: 17,
  },
  {
    id: 'ecosystems',
    title: 'Mobile & Ecosystems',
    description: 'Beyond the browser — mobile, desktop, and cross-platform development.',
    icon: 'Smartphone',
    level: 'advanced',
    to: '/docs/ecosystems',
    lessonCount: 10,
  },
  {
    id: 'solo',
    title: 'Solo / Personal',
    description: 'Ship as a solo developer — personal sites, side projects, and indie workflows.',
    icon: 'User',
    level: 'intermediate',
    to: '/docs/solo',
    lessonCount: 18,
  },
  {
    id: 'startup',
    title: 'Startup / Small Co.',
    description: 'Move fast with a small team — pragmatic choices for early-stage products.',
    icon: 'Rocket',
    level: 'intermediate',
    to: '/docs/startup',
    lessonCount: 18,
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'Large-org realities — governance, compliance, and architecture at scale.',
    icon: 'Building2',
    level: 'expert',
    to: '/docs/enterprise',
    lessonCount: 19,
  },
  {
    id: 'comparison',
    title: 'Comparison',
    description: 'Side-by-side tool and approach comparisons to sharpen your judgment.',
    icon: 'GitCompare',
    level: 'intermediate',
    to: '/docs/comparison',
    lessonCount: 7,
  },
  {
    id: 'decisions',
    title: 'Decisions',
    description: 'Frameworks for making technical choices under uncertainty.',
    icon: 'Scale',
    level: 'expert',
    to: '/docs/decisions',
    lessonCount: 17,
  },
  {
    id: 'career',
    title: 'Career',
    description: 'Grow as a developer — interviews, leveling, and long-term career strategy.',
    icon: 'TrendingUp',
    level: 'intermediate',
    to: '/docs/career',
    lessonCount: 12,
  },
];

export const badges: GuideBadge[] = [
  {
    id: 'first-step',
    name: 'First Steps',
    description: 'Visit your first chapter',
    icon: 'Award',
    threshold: 1,
  },
  {
    id: 'foundations',
    name: 'Foundations Complete',
    description: 'Mark Foundations as complete',
    icon: 'Layers',
    chapterId: 'foundations',
  },
  {
    id: 'stack-master',
    name: 'Stack Explorer',
    description: 'Mark Tech Stack as complete',
    icon: 'Code2',
    chapterId: 'stack',
  },
  {
    id: 'cloud-native',
    name: 'Cloud Native',
    description: 'Mark Cloud Platforms as complete',
    icon: 'Cloud',
    chapterId: 'cloud',
  },
  {
    id: 'distributed',
    name: 'Systems Thinker',
    description: 'Mark Distributed Systems as complete',
    icon: 'Network',
    chapterId: 'distributed-systems',
  },
  {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Complete 50% of chapters',
    icon: 'Target',
    threshold: 50,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all chapters',
    icon: 'Trophy',
    threshold: 100,
  },
  {
    id: 'capstone-certified',
    name: 'Guide Certified',
    description: 'Pass the final capstone assessment',
    icon: 'Trophy',
    quizId: 'final-capstone',
  },
];

export function getTotalLessons(): number {
  return chapters.reduce((sum, ch) => sum + ch.lessonCount, 0);
}
