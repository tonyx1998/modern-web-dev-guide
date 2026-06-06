import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ArrowRight} from 'lucide-react';
import {Button} from '@site/src/components/ui/Button';
import styles from './styles.module.css';

export function Hero() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Web Development Guide</h1>
      <p className={styles.subtitle}>{siteConfig.tagline}</p>
      <div className={styles.actions}>
        <Button to="/docs/foundations/client-server" size="lg">
          Start the Guide
          <ArrowRight size={18} aria-hidden />
        </Button>
        <Button to="/docs/glossary" variant="outline" size="lg">
          Glossary
        </Button>
      </div>
      <p className={styles.hint}>
        Your complete journey from beginner to expert — 15 chapters, 270+ lessons, saved
        progress in your browser.
      </p>
    </section>
  );
}
