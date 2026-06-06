import type {ChapterId} from './chapterPages';

/** Chapter summary checkpoint quiz ids (from prereqs PAGE_CHECKPOINTS). */
export const CHAPTER_CHECKPOINT_QUIZ: Partial<Record<ChapterId, string>> = {
  foundations: 'foundations-checkpoint',
  lifecycle: 'lifecycle-checkpoint',
  stack: 'stack-checkpoint',
  solo: 'solo-checkpoint',
  startup: 'startup-checkpoint',
  enterprise: 'enterprise-checkpoint',
  comparison: 'comparison-checkpoint',
  decisions: 'decisions-checkpoint',
  ai: 'ai-checkpoint',
  career: 'career-checkpoint',
  cloud: 'cloud-checkpoint',
  operations: 'operations-checkpoint',
  'distributed-systems': 'distributed-systems-checkpoint',
  ecosystems: 'ecosystems-checkpoint',
};
