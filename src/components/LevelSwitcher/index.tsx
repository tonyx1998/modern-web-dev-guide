import React, {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Level = 'beginner' | 'reader' | 'advanced';

const STORAGE_KEY = 'reader-level';
const DEFAULT_LEVEL: Level = 'beginner';

const LEVELS: {value: Level; label: string; emoji: string; hint: string}[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    emoji: '👶',
    hint: "New to web dev — show extra explanations and definitions.",
  },
  {
    value: 'reader',
    label: 'Reader',
    emoji: '📖',
    hint: "Comfortable with the basics — show the standard guide.",
  },
  {
    value: 'advanced',
    label: 'Advanced',
    emoji: '🚀',
    hint: "Skip the intros — show terse reference content only.",
  },
];

function applyLevel(level: Level) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-reader-level', level);
}

export function readLevel(): Level {
  if (typeof window === 'undefined') return DEFAULT_LEVEL;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'beginner' || stored === 'reader' || stored === 'advanced') {
    return stored;
  }
  return DEFAULT_LEVEL;
}

export default function LevelSwitcher(): ReactNode {
  const [level, setLevel] = useState<Level>(DEFAULT_LEVEL);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readLevel();
    setLevel(stored);
    applyLevel(stored);
    setMounted(true);
  }, []);

  function choose(next: Level) {
    setLevel(next);
    applyLevel(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    setOpen(false);
  }

  if (!mounted) return null;

  const current = LEVELS.find((l) => l.value === level) ?? LEVELS[1];

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Reading level: ${current.label}. Click to change.`}
        title="Choose your reading level"
      >
        <span className={styles.emoji}>{current.emoji}</span>
        <span className={styles.label}>{current.label}</span>
        <span className={styles.caret} aria-hidden>▾</span>
      </button>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.menu} role="menu">
            <div className={styles.menuHeader}>Reading level</div>
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                role="menuitemradio"
                aria-checked={l.value === level}
                className={`${styles.option} ${l.value === level ? styles.optionActive : ''}`}
                onClick={() => choose(l.value)}
              >
                <span className={styles.optionEmoji}>{l.emoji}</span>
                <span className={styles.optionBody}>
                  <span className={styles.optionLabel}>{l.label}</span>
                  <span className={styles.optionHint}>{l.hint}</span>
                </span>
              </button>
            ))}
            <div className={styles.menuFooter}>
              Your choice is saved on this device.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
