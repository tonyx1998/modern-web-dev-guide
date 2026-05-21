import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/foundations">
            Start Reading →
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/">
            What's Inside
          </Link>
        </div>
        <p className={styles.heroNote}>
          12 chapters · ~9,000 lines · written for absolute beginners
        </p>
      </div>
    </header>
  );
}

type Path = {
  audience: string;
  description: string;
  steps: string[];
  cta: {label: string; to: string};
};

const PATHS: Path[] = [
  {
    audience: 'I\'m new to web development',
    description: 'Never built a website before. Want to understand how the web actually works.',
    steps: [
      '1. Foundations — client/server, HTTP, DNS, browsers',
      '2. Lifecycle — what a real project looks like end-to-end',
      '4. Solo / Personal — build your first deployed site',
      '10. Career — what to learn next and where to go',
    ],
    cta: {label: 'Start with Foundations', to: '/docs/foundations'},
  },
  {
    audience: 'I\'m joining a startup',
    description: 'I can code. I need to understand modern stacks, workflows, and tradeoffs.',
    steps: [
      '2. Lifecycle — plan, build, ship, monitor',
      '3. Tech Stack — every major 2026 tool decoded',
      '5. Startup workflow — managed services, balance speed and quality',
      '8. Decisions — how to actually choose technologies',
    ],
    cta: {label: 'Jump to Tech Stack', to: '/docs/stack'},
  },
  {
    audience: 'I work at a big company',
    description: 'Microservices, compliance, 99.99% uptime. I want the enterprise picture.',
    steps: [
      '6. Enterprise workflow — Kubernetes, SRE, compliance',
      '8. Decisions — boring tech, reversibility, cost of inaction',
      '9. AI Layer — operating AI features in production',
    ],
    cta: {label: 'Read Enterprise Workflow', to: '/docs/large-company-workflow'},
  },
  {
    audience: 'I\'m doing a refresh',
    description: 'I\'ve been building for years. What\'s changed in 2026?',
    steps: [
      '3. Tech Stack — what\'s new since you last looked',
      '9. AI Layer — the new layer in every modern app',
      '7. Comparison — side-by-side at every scale',
    ],
    cta: {label: 'Skim the Tech Stack', to: '/docs/stack'},
  },
];

function ReadingPaths() {
  return (
    <section className={styles.paths}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Pick your reading path
        </Heading>
        <p className={styles.sectionLede}>
          The guide is structured so you can read straight through, but each path below
          gets you to the specific value you came for.
        </p>
        <div className={styles.pathGrid}>
          {PATHS.map((p) => (
            <div key={p.audience} className={styles.pathCard}>
              <Heading as="h3" className={styles.pathAudience}>
                {p.audience}
              </Heading>
              <p className={styles.pathDescription}>{p.description}</p>
              <ul className={styles.pathSteps}>
                {p.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <Link className="button button--outline button--primary" to={p.cta.to}>
                {p.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Topic = {
  title: string;
  summary: string;
  examples: string[];
};

const TOPICS: Topic[] = [
  {
    title: 'How the web works',
    summary:
      'The bedrock concepts: client/server, HTTP, DNS, TLS, browsers, rendering, APIs, databases, auth, deployment.',
    examples: ['HTTP requests line-by-line', 'DNS resolution flow', 'Rendering strategies (CSR/SSR/SSG/ISR)', 'How auth tokens actually work'],
  },
  {
    title: 'The 2026 toolbox',
    summary:
      'Every major framework and service explained: what it does, when to use it, why it exists, what it replaces.',
    examples: ['Next.js / Remix / Astro / SvelteKit', 'Postgres / DynamoDB / Redis', 'Vercel / AWS / Cloudflare', 'Stripe / Auth0 / Clerk'],
  },
  {
    title: 'Workflows at every scale',
    summary:
      'Solo developer, 20-person startup, and 2,000-engineer enterprise — three radically different ways to build the same kind of product.',
    examples: ['Free-tier solo stack', 'Startup managed-service stack', 'Enterprise Kubernetes platform', 'How CI/CD looks at each scale'],
  },
  {
    title: 'AI as a first-class layer',
    summary:
      'AI features (streaming chat, RAG, function calling, agents) are now standard. How to build them and how to operate them.',
    examples: ['Streaming chat patterns', 'RAG with vector DBs', 'Function/tool calling', 'Evals and observability'],
  },
  {
    title: 'Decision frameworks',
    summary:
      'How to actually pick technologies without cargo-culting. Boring-technology rule, reversibility test, cost of inaction.',
    examples: ['Boring vs. shiny', 'Reversibility ladder', 'Team-size heuristics', 'Build vs. buy'],
  },
  {
    title: 'Career path',
    summary:
      'For students and self-taught developers. What to learn first, how to build a portfolio, where the jobs are in 2026.',
    examples: ['Foundational skill checklist', 'Portfolio anatomy', 'Specialization tracks', 'Compensation context'],
  },
];

function TopicsCovered() {
  return (
    <section className={styles.topics}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          What this guide covers
        </Heading>
        <p className={styles.sectionLede}>
          Six big themes, twelve chapters, around 9,000 lines of detailed explanation —
          all written so an absolute beginner can follow along while still being
          useful to working developers.
        </p>
        <div className={styles.topicGrid}>
          {TOPICS.map((t) => (
            <div key={t.title} className={styles.topicCard}>
              <Heading as="h3" className={styles.topicTitle}>
                {t.title}
              </Heading>
              <p className={styles.topicSummary}>{t.summary}</p>
              <ul className={styles.topicExamples}>
                {t.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartCTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to dive in?
        </Heading>
        <p className={styles.ctaText}>
          The fastest way to start: read{' '}
          <Link to="/docs/foundations">chapter 1 (Foundations)</Link>.
          If a term is unfamiliar, the{' '}
          <Link to="/docs/glossary">glossary</Link> has plain-English definitions for
          every piece of jargon in the guide.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/foundations">
            Read Chapter 1 →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A comprehensive 2026 web development guide — written for absolute beginners and useful to working developers.">
      <HomepageHeader />
      <main>
        <ReadingPaths />
        <TopicsCovered />
        <StartCTA />
      </main>
    </Layout>
  );
}
