import {useGuideProgress} from '@site/src/hooks/useGuideProgress';
import {Card, CardContent, CardHeader, CardTitle} from '@site/src/components/ui/Card';
import {ProgressBar} from '@site/src/components/ui/ProgressBar';
import styles from './styles.module.css';

export function ProgressOverview() {
  const {getTotalProgress, getTotalVisitedPages, getTotalTrackablePages, hydrated} =
    useGuideProgress();
  const totalProgress = getTotalProgress();
  const visitedPages = getTotalVisitedPages();
  const totalPages = getTotalTrackablePages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Learning Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.stats}>
          <div>
            <p className={styles.statValue}>
              {hydrated ? visitedPages : '—'} / {totalPages}
            </p>
            <p className={styles.statLabel}>Pages visited</p>
          </div>
          <div className={styles.statRight}>
            <p className={styles.statValue}>
              {hydrated ? Math.round(totalProgress) : '—'}%
            </p>
            <p className={styles.statLabel}>Overall progress</p>
          </div>
        </div>
        <ProgressBar value={hydrated ? totalProgress : 0} size="lg" />
        <p className={styles.meta}>
          Progress is saved in your browser — revisit pages or pass checkpoint quizzes to
          complete chapters.
        </p>
      </CardContent>
    </Card>
  );
}
