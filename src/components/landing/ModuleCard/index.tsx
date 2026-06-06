import Link from '@docusaurus/Link';
import {ArrowRight} from 'lucide-react';
import type {GuideChapter} from '@site/src/data/guide';
import {useGuideProgress} from '@site/src/hooks/useGuideProgress';
import {Badge} from '@site/src/components/ui/Badge';
import {Button} from '@site/src/components/ui/Button';
import {Card, CardContent, CardHeader, CardTitle} from '@site/src/components/ui/Card';
import {ProgressBar} from '@site/src/components/ui/ProgressBar';
import {getGuideIcon} from '@site/src/components/landing/icons';
import styles from './styles.module.css';

interface ModuleCardProps {
  chapter: GuideChapter;
}

export function ModuleCard({chapter}: ModuleCardProps) {
  const {
    getChapterProgress,
    getChapterVisitedCount,
    getChapterPageCount,
    isChapterComplete,
    visitChapter,
    hydrated,
  } = useGuideProgress();
  const progress = getChapterProgress(chapter.id);
  const complete = isChapterComplete(chapter.id);
  const visitedCount = getChapterVisitedCount(chapter.id);
  const pageCount = getChapterPageCount(chapter.id);
  const Icon = getGuideIcon(chapter.icon);

  const ctaLabel = complete
    ? 'Review Chapter'
    : visitedCount > 0
      ? 'Continue Learning'
      : 'Start Chapter';

  return (
    <Link
      to={chapter.to}
      className={styles.moduleLink}
      onClick={() => visitChapter(chapter.id)}
    >
      <Card interactive>
        <CardHeader>
          <div className={styles.headerRow}>
            <Icon className={styles.icon} aria-hidden />
            <Badge level={chapter.level}>{chapter.level}</Badge>
          </div>
          <CardTitle>{chapter.title}</CardTitle>
          <p className={styles.description}>{chapter.description}</p>
        </CardHeader>
        <CardContent>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressCount}>
              {hydrated ? (
                <>
                  {visitedCount} / {pageCount} pages
                </>
              ) : (
                `${pageCount} pages`
              )}
            </span>
          </div>
          <ProgressBar value={hydrated ? progress : 0} className={styles.progressBar} />
          <span className={styles.cta}>{ctaLabel}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ContinueLearningProps {
  pagePath: string;
  pageTitle: string;
  chapterTitle: string;
}

export function ContinueLearning({
  pagePath,
  pageTitle,
  chapterTitle,
}: ContinueLearningProps) {
  return (
    <Card accent>
      <CardContent>
        <div className={styles.continueRow}>
          <div>
            <p className={styles.continueLabel}>Continue where you left off</p>
            <h3 className={styles.continueTitle}>{pageTitle}</h3>
            <p className={styles.continueChapter}>{chapterTitle}</p>
          </div>
          <Button to={pagePath} size="lg">
            Continue
            <ArrowRight size={16} aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
