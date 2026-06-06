import {useCallback, useEffect, useState} from 'react';
import {badges, chapters, type GuideBadge} from '@site/src/data/guide';
import {
  chapterPages,
  getChapterPageCount,
  getTotalTrackablePages,
  type ChapterId,
} from '@site/src/data/chapterPages';
import {CHAPTER_CHECKPOINT_QUIZ} from '@site/src/data/chapterCheckpoints';
import {isQuizPassed} from '@site/src/components/SidebarLockGate/prereqs';

const STORAGE_KEY = 'mwdg-guide-progress-v2';
const LEGACY_STORAGE_KEY = 'mwdg-guide-progress-v1';

export interface GuideProgress {
  visitedChapters: Set<string>;
  completedChapters: Set<string>;
  visitedPages: Set<string>;
  currentChapterId: string | null;
  currentPagePath: string | null;
  currentPageTitle: string | null;
  earnedBadges: Set<string>;
}

interface StoredProgress {
  visitedChapters: string[];
  completedChapters: string[];
  visitedPages: string[];
  currentChapterId: string | null;
  currentPagePath: string | null;
  currentPageTitle: string | null;
  earnedBadges: string[];
}

const defaultProgress: GuideProgress = {
  visitedChapters: new Set(),
  completedChapters: new Set(),
  visitedPages: new Set(),
  currentChapterId: null,
  currentPagePath: null,
  currentPageTitle: null,
  earnedBadges: new Set(),
};

function isChapterIndexPath(path: string, chapterId: ChapterId): boolean {
  return path === `/docs/${chapterId}`;
}

function getTrackablePages(chapterId: ChapterId): string[] {
  return (chapterPages[chapterId] ?? []).filter(
    (p) => !isChapterIndexPath(p, chapterId),
  );
}

function countVisitedInChapter(chapterId: ChapterId, visitedPages: Set<string>): number {
  return getTrackablePages(chapterId).filter((p) => visitedPages.has(p)).length;
}

function isChapterReadyToComplete(chapterId: ChapterId, visitedPages: Set<string>): boolean {
  const pages = getTrackablePages(chapterId);
  if (pages.length === 0) return false;
  const allVisited = pages.every((p) => visitedPages.has(p));
  if (!allVisited) return false;
  const checkpointQuiz = CHAPTER_CHECKPOINT_QUIZ[chapterId];
  if (checkpointQuiz) {
    return isQuizPassed(checkpointQuiz);
  }
  return true;
}

function deserialize(raw: string | null): GuideProgress {
  if (!raw) return {...defaultProgress};
  try {
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      visitedChapters: new Set(parsed.visitedChapters ?? []),
      completedChapters: new Set(parsed.completedChapters ?? []),
      visitedPages: new Set(parsed.visitedPages ?? []),
      currentChapterId: parsed.currentChapterId ?? null,
      currentPagePath: parsed.currentPagePath ?? null,
      currentPageTitle: parsed.currentPageTitle ?? null,
      earnedBadges: new Set(parsed.earnedBadges ?? []),
    };
  } catch {
    return {...defaultProgress};
  }
}

function migrateLegacy(): GuideProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      visitedChapters: new Set(parsed.visitedChapters ?? []),
      completedChapters: new Set(parsed.completedChapters ?? []),
      visitedPages: new Set(),
      currentChapterId: parsed.currentChapterId ?? null,
      currentPagePath: null,
      currentPageTitle: null,
      earnedBadges: new Set(),
    };
  } catch {
    return null;
  }
}

function serialize(progress: GuideProgress): string {
  const stored: StoredProgress = {
    visitedChapters: [...progress.visitedChapters],
    completedChapters: [...progress.completedChapters],
    visitedPages: [...progress.visitedPages],
    currentChapterId: progress.currentChapterId,
    currentPagePath: progress.currentPagePath,
    currentPageTitle: progress.currentPageTitle,
    earnedBadges: [...progress.earnedBadges],
  };
  return JSON.stringify(stored);
}

function computeEarnedBadges(progress: GuideProgress): Set<string> {
  const earned = new Set<string>();
  const completedCount = progress.completedChapters.size;
  const totalChapters = chapters.length;
  const percentComplete =
    totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  for (const badge of badges) {
    if (badge.chapterId && progress.completedChapters.has(badge.chapterId)) {
      earned.add(badge.id);
    } else if (badge.threshold !== undefined) {
      if (badge.threshold <= 1 && completedCount >= 1) {
        earned.add(badge.id);
      } else if (badge.threshold >= 100 && completedCount >= totalChapters) {
        earned.add(badge.id);
      } else if (badge.threshold === 50 && percentComplete >= 50) {
        earned.add(badge.id);
      }
    }
  }

  if (progress.visitedPages.size >= 1 || progress.visitedChapters.size >= 1) {
    earned.add('first-step');
  }

  return earned;
}

function applyChapterCompletions(progress: GuideProgress): GuideProgress {
  const completedChapters = new Set(progress.completedChapters);
  const visitedChapters = new Set(progress.visitedChapters);

  for (const chapter of chapters) {
    const id = chapter.id as ChapterId;
    if (isChapterReadyToComplete(id, progress.visitedPages)) {
      completedChapters.add(id);
      visitedChapters.add(id);
    }
  }

  return {...progress, completedChapters, visitedChapters};
}

function mergeProgress(prev: GuideProgress): GuideProgress {
  const withCompletions = applyChapterCompletions(prev);
  const earnedBadges = computeEarnedBadges(withCompletions);
  return {...withCompletions, earnedBadges};
}

export function useGuideProgress() {
  const [progress, setProgress] = useState<GuideProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stored = deserialize(localStorage.getItem(STORAGE_KEY));
    if (!localStorage.getItem(STORAGE_KEY)) {
      const legacy = migrateLegacy();
      if (legacy) stored = legacy;
    }
    setProgress(mergeProgress(stored));
    setHydrated(true);
  }, []);

  const persist = useCallback((next: GuideProgress) => {
    const merged = mergeProgress(next);
    setProgress(merged);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, serialize(merged));
    }
  }, []);

  const visitChapter = useCallback(
    (chapterId: string) => {
      setProgress((prev) => {
        const next: GuideProgress = {
          ...prev,
          visitedChapters: new Set([...prev.visitedChapters, chapterId]),
          currentChapterId: chapterId,
        };
        const merged = mergeProgress(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, serialize(merged));
        }
        return merged;
      });
    },
    [],
  );

  const visitPage = useCallback(
    (pagePath: string, chapterId: ChapterId, pageTitle?: string) => {
      setProgress((prev) => {
        const next: GuideProgress = {
          ...prev,
          visitedPages: new Set([...prev.visitedPages, pagePath]),
          visitedChapters: new Set([...prev.visitedChapters, chapterId]),
          currentChapterId: chapterId,
          currentPagePath: pagePath,
          currentPageTitle: pageTitle ?? prev.currentPageTitle,
        };
        const merged = mergeProgress(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, serialize(merged));
        }
        return merged;
      });
    },
    [],
  );

  const markChapterComplete = useCallback(
    (chapterId: string) => {
      setProgress((prev) => {
        const next: GuideProgress = {
          ...prev,
          visitedChapters: new Set([...prev.visitedChapters, chapterId]),
          completedChapters: new Set([...prev.completedChapters, chapterId]),
          currentChapterId: chapterId,
        };
        const merged = mergeProgress(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, serialize(merged));
        }
        return merged;
      });
    },
    [],
  );

  const refreshProgress = useCallback(() => {
    setProgress((prev) => {
      const merged = mergeProgress(prev);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serialize(merged));
      }
      return merged;
    });
  }, []);

  const isChapterComplete = useCallback(
    (chapterId: string) => progress.completedChapters.has(chapterId),
    [progress.completedChapters],
  );

  const isChapterVisited = useCallback(
    (chapterId: string) => progress.visitedChapters.has(chapterId),
    [progress.visitedChapters],
  );

  const isPageVisited = useCallback(
    (pagePath: string) => progress.visitedPages.has(pagePath),
    [progress.visitedPages],
  );

  const getChapterProgress = useCallback(
    (chapterId: string) => {
      const id = chapterId as ChapterId;
      if (isChapterComplete(chapterId)) return 100;
      const total = getTrackablePages(id).length;
      if (total === 0) return 0;
      const visited = countVisitedInChapter(id, progress.visitedPages);
      return (visited / total) * 100;
    },
    [isChapterComplete, progress.visitedPages],
  );

  const getChapterVisitedCount = useCallback(
    (chapterId: string) => countVisitedInChapter(chapterId as ChapterId, progress.visitedPages),
    [progress.visitedPages],
  );

  const getTotalProgress = useCallback(() => {
    const total = getTotalTrackablePages();
    if (total === 0) return 0;
    let visited = 0;
    for (const chapter of chapters) {
      visited += countVisitedInChapter(chapter.id as ChapterId, progress.visitedPages);
    }
    return (visited / total) * 100;
  }, [progress.visitedPages]);

  const getTotalVisitedPages = useCallback(() => {
    let count = 0;
    for (const chapter of chapters) {
      count += countVisitedInChapter(chapter.id as ChapterId, progress.visitedPages);
    }
    return count;
  }, [progress.visitedPages]);

  const getEarnedBadges = useCallback((): GuideBadge[] => {
    return badges.filter((b) => progress.earnedBadges.has(b.id));
  }, [progress.earnedBadges]);

  const getUnearnedBadges = useCallback((): GuideBadge[] => {
    return badges.filter((b) => !progress.earnedBadges.has(b.id));
  }, [progress.earnedBadges]);

  return {
    progress,
    hydrated,
    visitChapter,
    visitPage,
    markChapterComplete,
    refreshProgress,
    isChapterComplete,
    isChapterVisited,
    isPageVisited,
    getChapterProgress,
    getChapterVisitedCount,
    getChapterPageCount: (chapterId: string) => getChapterPageCount(chapterId as ChapterId),
    getTotalProgress,
    getTotalVisitedPages,
    getTotalTrackablePages,
    getEarnedBadges,
    getUnearnedBadges,
    persist,
  };
}
