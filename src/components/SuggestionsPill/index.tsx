import React, {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * Floating "Suggestions" pill, fixed to the bottom-right on every page.
 *
 * Replaces the old "Suggestions" navbar link: feedback is now persistently
 * one tap away instead of buried in the top bar.
 *
 * Hidden on the /suggestions page itself (nothing to link to there).
 */
export default function SuggestionsPill(): ReactNode {
  const location = useLocation();
  const href = useBaseUrl('/suggestions');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  // Don't show the pill on the suggestions page itself.
  if (location.pathname.replace(/\/$/, '').endsWith('/suggestions')) return null;

  return (
    <Link
      to={href}
      className={styles.pill}
      aria-label="Share a suggestion or report an issue"
      title="Suggestions & feedback">
      <span aria-hidden className={styles.icon}>
        {/* pencil-in-speech-bubble: feedback */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h6" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L15 12l-4 1 1-4Z" />
        </svg>
      </span>
      <span className={styles.label}>Suggestions</span>
    </Link>
  );
}
