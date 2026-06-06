import Layout from '@theme/Layout';
import {Hero} from '@site/src/components/landing/Hero';
import {ProgressOverview} from '@site/src/components/landing/ProgressOverview';
import {LearningPath} from '@site/src/components/landing/LearningPath';
import {Achievements} from '@site/src/components/landing/Achievements';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Web Development Guide"
      description="Your complete journey from beginner to expert web developer — a comprehensive 2026 guide."
    >
      <main className={`landing-page ${styles.main}`}>
        <Hero />
        <div className={styles.overview}>
          <ProgressOverview />
        </div>
        <Achievements />
        <LearningPath />
      </main>
    </Layout>
  );
}
