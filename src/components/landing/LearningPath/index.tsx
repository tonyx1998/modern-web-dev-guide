import {chapters} from '@site/src/data/guide';
import {useGuideProgress} from '@site/src/hooks/useGuideProgress';
import {ContinueLearning, ModuleCard} from '@site/src/components/landing/ModuleCard';
import styles from './styles.module.css';

export function LearningPath() {
  const {progress, hydrated} = useGuideProgress();

  const currentChapter =
    hydrated && progress.currentChapterId
      ? chapters.find((c) => c.id === progress.currentChapterId)
      : null;

  const showContinue =
    hydrated && progress.currentPagePath && progress.currentPageTitle && currentChapter;

  return (
    <section className="landing-section">
      {showContinue && (
        <div className={styles.continueWrap}>
          <ContinueLearning
            pagePath={progress.currentPagePath!}
            pageTitle={progress.currentPageTitle!}
            chapterTitle={currentChapter.title}
          />
        </div>
      )}

      <h2 className="landing-section-title">Learning Path</h2>
      <div className={`landing-grid landing-grid--2 ${styles.grid}`}>
        {chapters.map((chapter) => (
          <ModuleCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}
