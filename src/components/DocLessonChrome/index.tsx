import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {CheckCircle2, Clock} from 'lucide-react';
import {chapters} from '@site/src/data/guide';
import {
  getChapterIdFromPath,
  getChapterPageCount,
  getPageIndex,
  normalizeDocPath,
} from '@site/src/data/chapterPages';
import {useGuideProgress} from '@site/src/hooks/useGuideProgress';
import type {ChapterId} from '@site/src/data/chapterPages';
import {Badge} from '@site/src/components/ui/Badge';
import {Card, CardContent, CardHeader} from '@site/src/components/ui/Card';
import {ProgressBar} from '@site/src/components/ui/ProgressBar';
import styles from './styles.module.css';

const SKIP_CHROME_IDS = new Set(['intro', 'glossary']);

function stripBaseUrl(pathname: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  if (base && base !== '/' && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/';
  }
  return pathname;
}

function estimateMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

export default function DocLessonChrome(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const {getChapterProgress, getChapterVisitedCount, isPageVisited, hydrated, visitPage} =
    useGuideProgress();
  const [readingMinutes, setReadingMinutes] = useState<number | null>(null);

  const pathname = stripBaseUrl(location.pathname, siteConfig.baseUrl);
  const pagePath = normalizeDocPath(pathname);
  const chapterId = pagePath ? getChapterIdFromPath(pagePath) : null;
  const skip = SKIP_CHROME_IDS.has(metadata.id) || !pagePath || !chapterId;
  const frontMinutes = (frontMatter as {estimatedMinutes?: number}).estimatedMinutes;

  useEffect(() => {
    if (skip || !pagePath || !chapterId) return;
    visitPage(pagePath, chapterId as ChapterId, metadata.title);
  }, [skip, pagePath, chapterId, metadata.title, visitPage]);

  useEffect(() => {
    if (skip) return;
    if (frontMinutes) {
      setReadingMinutes(frontMinutes);
      return;
    }
    const article = document.querySelector('.theme-doc-markdown.markdown');
    if (!article) return;
    const text = article.textContent ?? '';
    setReadingMinutes(estimateMinutes(text));
  }, [location.pathname, frontMinutes, skip]);

  if (skip) {
    return null;
  }

  const chapter = chapters.find((c) => c.id === chapterId);
  const chapterTitle = chapter?.title ?? chapterId!;
  const chapterLevel = chapter?.level ?? 'beginner';
  const chapterProgress = getChapterProgress(chapterId!);
  const visitedCount = getChapterVisitedCount(chapterId!);
  const totalPages = getChapterPageCount(chapterId!);
  const pageComplete = isPageVisited(pagePath!);
  const pageIndex = getPageIndex(chapterId!, pagePath!);

  const title = metadata.title;
  const description =
    (frontMatter.description as string | undefined) ?? metadata.description;

  return (
    <div className={`doc-with-lesson-chrome ${styles.chrome}`}>
      <nav className={styles.breadcrumb} aria-label="Lesson breadcrumb">
        <Link to="/" className={styles.breadcrumbLink}>
          Dashboard
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden>
          /
        </span>
        <Link to={`/docs/${chapterId}`} className={styles.breadcrumbLink}>
          {chapterTitle}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden>
          /
        </span>
        <span className={styles.breadcrumbCurrent}>{title}</span>
      </nav>

      <Card className={styles.progressCard}>
        <CardContent>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>{chapterTitle} progress</span>
            <span className={styles.progressMeta}>
              {hydrated ? (
                <>
                  {visitedCount} / {totalPages} pages · {Math.round(chapterProgress)}%
                </>
              ) : (
                '—'
              )}
            </span>
          </div>
          <ProgressBar value={hydrated ? chapterProgress : 0} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className={styles.headerBadges}>
            <Badge level={chapterLevel}>{chapterLevel}</Badge>
            {pageComplete && (
              <Badge variant="success">
                <CheckCircle2 className={styles.completedIcon} aria-hidden />
                Visited
              </Badge>
            )}
            {pageIndex >= 0 && totalPages > 0 && (
              <Badge variant="outline">
                Page {pageIndex + 1} of {totalPages}
              </Badge>
            )}
          </div>
          <h1 className={styles.lessonTitle}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {readingMinutes != null && (
            <div className={styles.metaRow}>
              <Clock size={16} aria-hidden />
              <span>{readingMinutes} min read</span>
            </div>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
