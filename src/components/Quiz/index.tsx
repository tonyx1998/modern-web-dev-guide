import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * Quiz + Question components.
 *
 * Usage in MDX (write a BANK of N questions, only K are shown per session):
 *
 *   <Quiz id="foundations-checkpoint" title="Chapter 1 checkpoint" sampleSize={5}>
 *     <Question ... />     // bank: write 10-15 questions
 *     <Question ... />
 *     ...
 *   </Quiz>
 *
 * Each visit picks `sampleSize` of the registered questions by a seeded
 * shuffle. The seed bumps every time the reader clicks "Retake", so
 * retakes get fresh questions, but reloading mid-quiz keeps the same
 * questions you were already answering.
 *
 * In Beginner mode the page-level Next button is blocked until the
 * quiz is passed (>= 60%). See custom.css for the gating rules.
 */

export interface QuestionOption {
  text: string;
}

interface QuestionRevisit {
  to: string;
  label: string;
}

export interface QuestionProps {
  prompt: string;
  options: QuestionOption[];
  correct: number;
  explanation?: string;
  revisit?: QuestionRevisit;
}

interface RegisteredQuestion extends QuestionProps {
  /** 0-based index in the order this Question registered (= MDX order). */
  registrationOrder: number;
}

interface ActiveQuestion extends RegisteredQuestion {
  /** 0-based position in the displayed quiz (the K-of-N pick). */
  position: number;
}

interface QuizContextValue {
  registerQuestion: (q: QuestionProps) => void;
  recordAnswer: (prompt: string, choice: number) => void;
  answers: Record<string, number>;
  submitted: boolean;
  /** Set of prompts that are currently being shown to the reader. */
  activePrompts: Set<string>;
  /** Active questions in display order, populated once registration settles. */
  activeQuestions: ActiveQuestion[];
}

const QuizContext = createContext<QuizContextValue | null>(null);

interface QuizProps {
  id: string;
  title?: string;
  /** How many of the registered questions to show. Undefined = show all. */
  sampleSize?: number;
  /** Pass threshold (0-1). Default 0.6. */
  passingScore?: number;
  /**
   * "checkpoint" (default): big card, end-of-page gating quiz. Required
   * by default (in Beginner mode it blocks Next until passed).
   * "micro": slim mid-section comprehension check. Required defaults to
   * false; visual is much smaller; no "Required checkpoint" badge.
   */
  variant?: 'checkpoint' | 'micro';
  /**
   * If true, in Beginner mode the Next pagination link is disabled
   * until this quiz is passed. Defaults to true for checkpoint
   * variant, false for micro variant.
   */
  required?: boolean;
  children: ReactNode;
}

interface StoredResult {
  answers: Record<string, number>;
  /** The exact prompts that were shown this session. */
  activePrompts: string[];
  /** Whether the user passed (>= passingScore on the displayed questions). */
  passed: boolean;
  completedAt: string;
}

function storageKey(id: string) {
  return `quiz-${id}`;
}

function rotationKey(id: string) {
  return `quiz-rot-${id}`;
}

function loadStored(id: string): StoredResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.answers && typeof parsed.answers === 'object') {
      return {
        answers: parsed.answers,
        activePrompts: Array.isArray(parsed.activePrompts)
          ? parsed.activePrompts
          : [],
        passed: parsed.passed === true,
        completedAt: parsed.completedAt ?? '',
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveStored(id: string, result: StoredResult) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(id), JSON.stringify(result));
    // Same-tab notification (storage events don't fire in the writing tab).
    window.dispatchEvent(
      new CustomEvent('quiz:saved', {detail: {id, passed: result.passed}}),
    );
  } catch {
    // ignore quota errors
  }
}

function clearStored(id: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey(id));
    window.dispatchEvent(
      new CustomEvent('quiz:saved', {detail: {id, passed: false}}),
    );
  } catch {
    // ignore
  }
}

function readRotation(id: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(rotationKey(id));
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function bumpRotation(id: string): number {
  const next = readRotation(id) + 1;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(rotationKey(id), String(next));
    } catch {
      // ignore
    }
  }
  return next;
}

/**
 * Tiny seeded PRNG (Mulberry32). Deterministic, fine for shuffling.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash a string to a 32-bit int (FNV-1a). Used to derive a stable seed
 * from the quiz id so different quizzes shuffle differently even if
 * they share a rotation count.
 */
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Seeded Fisher-Yates shuffle; returns a new array.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Page-level body class management for mandatory-quiz gating.
 * Each quiz reports itself as pending or passed. When ANY required
 * quiz on the page is pending, body gets `quiz-required-pending`.
 */
type PendingSet = Set<string>;
function setQuizPending(id: string, pending: boolean) {
  if (typeof document === 'undefined') return;
  const win = window as unknown as {__quizPending?: PendingSet};
  const set: PendingSet = win.__quizPending ?? new Set<string>();
  if (pending) set.add(id);
  else set.delete(id);
  win.__quizPending = set;
  document.body.classList.toggle('quiz-required-pending', set.size > 0);
}

export function Quiz({
  id,
  title,
  sampleSize,
  passingScore = 0.6,
  variant = 'checkpoint',
  required,
  children,
}: QuizProps): ReactNode {
  const isMicro = variant === 'micro';
  const isRequired = required ?? !isMicro;
  const [registered, setRegistered] = useState<RegisteredQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [restoredActivePrompts, setRestoredActivePrompts] = useState<
    string[] | null
  >(null);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    setRotation(readRotation(id));
    const stored = loadStored(id);
    if (stored) {
      setAnswers(stored.answers);
      setSubmitted(true);
      if (stored.activePrompts.length > 0) {
        setRestoredActivePrompts(stored.activePrompts);
      }
    }
    setRestored(true);
  }, [id]);

  // Derive the "active" (visible) set of questions.
  //  - If we restored a submitted session, honor the stored prompts.
  //  - Else, sample sampleSize of `registered` by a seeded shuffle.
  //  - If sampleSize is unset or >= registered.length, show all in order.
  const activeQuestions = useMemo<ActiveQuestion[]>(() => {
    if (registered.length === 0) return [];
    let chosen: RegisteredQuestion[] = [];
    if (restoredActivePrompts) {
      const byPrompt = new Map(registered.map((q) => [q.prompt, q]));
      chosen = restoredActivePrompts
        .map((p) => byPrompt.get(p))
        .filter((q): q is RegisteredQuestion => !!q);
    } else if (!sampleSize || sampleSize >= registered.length) {
      chosen = registered;
    } else {
      const seed = hashString(id) ^ (rotation * 0x9e3779b9);
      chosen = seededShuffle(registered, seed).slice(0, sampleSize);
    }
    return chosen.map((q, i) => ({...q, position: i}));
  }, [registered, restoredActivePrompts, sampleSize, rotation, id]);

  const activePrompts = useMemo(
    () => new Set(activeQuestions.map((q) => q.prompt)),
    [activeQuestions],
  );

  const ctx = useMemo<QuizContextValue>(
    () => ({
      registerQuestion(q) {
        setRegistered((prev) => {
          if (prev.some((p) => p.prompt === q.prompt)) return prev;
          return [...prev, {...q, registrationOrder: prev.length}];
        });
      },
      recordAnswer(prompt, choice) {
        if (submitted) return;
        setAnswers((prev) => ({...prev, [prompt]: choice}));
      },
      answers,
      submitted,
      activePrompts,
      activeQuestions,
    }),
    [answers, submitted, activePrompts, activeQuestions],
  );

  const allAnswered =
    activeQuestions.length > 0 &&
    activeQuestions.every((q) => typeof answers[q.prompt] === 'number');

  const score = useMemo(() => {
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (answers[q.prompt] === q.correct) correct += 1;
    });
    return correct;
  }, [activeQuestions, answers]);

  const ratio = activeQuestions.length > 0 ? score / activeQuestions.length : 0;
  const passed = submitted && ratio >= passingScore;

  // Mandatory-quiz body class. Re-runs when pass status changes.
  useEffect(() => {
    if (!isRequired) return;
    setQuizPending(id, !passed);
    return () => setQuizPending(id, false);
  }, [id, isRequired, passed]);

  function submit() {
    if (!allAnswered) return;
    setSubmitted(true);
    // Recompute pass here so the snapshot is consistent with what
    // the user just submitted (score state is derived from the same
    // answers/activeQuestions, but recomputing avoids any state lag).
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (answers[q.prompt] === q.correct) correct += 1;
    });
    const didPass =
      activeQuestions.length > 0 && correct / activeQuestions.length >= passingScore;
    saveStored(id, {
      answers,
      activePrompts: activeQuestions.map((q) => q.prompt),
      passed: didPass,
      completedAt: new Date().toISOString(),
    });
  }

  function reset() {
    setSubmitted(false);
    setAnswers({});
    clearStored(id);
    setRestoredActivePrompts(null);
    setRotation(bumpRotation(id));
  }

  const missed = useMemo(
    () => activeQuestions.filter((q) => answers[q.prompt] !== q.correct),
    [activeQuestions, answers],
  );

  return (
    <QuizContext.Provider value={ctx}>
      <section
        className={`${styles.quiz} ${isMicro ? styles.quizMicro : ''}`}
        aria-label={title ?? 'Quiz'}
      >
        <header className={`${styles.header} ${isMicro ? styles.headerMicro : ''}`}>
          <span className={`${styles.badge} ${isMicro ? styles.badgeMicro : ''}`}>
            {isMicro ? '🤔 Quick check' : isRequired ? 'Required checkpoint' : 'Checkpoint'}
          </span>
          {!isMicro && (
            <h3 className={styles.title}>{title ?? 'Quick check'}</h3>
          )}
          {!isMicro && isRequired && (
            <span className={styles.requiredHint}>
              Pass to unlock the Next button below
            </span>
          )}
          {isMicro && title && (
            <span className={styles.microTitle}>{title}</span>
          )}
        </header>
        <div className={styles.questions}>{children}</div>
        {restored && !submitted && (
          <div className={`${styles.submitRow} ${isMicro ? styles.submitRowMicro : ''}`}>
            <button
              type="button"
              className={`${styles.submit} ${isMicro ? styles.submitMicro : ''}`}
              onClick={submit}
              disabled={!allAnswered}
            >
              {allAnswered
                ? isMicro
                  ? 'Check'
                  : 'Check my answers'
                : isMicro
                ? `Pick one`
                : `Answer all ${activeQuestions.length} to continue`}
            </button>
          </div>
        )}
        {submitted && (
          <ResultSummary
            score={score}
            total={activeQuestions.length}
            missed={missed}
            passed={passed}
            passingScore={passingScore}
            required={isRequired}
            isMicro={isMicro}
            onReset={reset}
          />
        )}
      </section>
    </QuizContext.Provider>
  );
}

function ResultSummary({
  score,
  total,
  missed,
  passed,
  passingScore,
  required,
  isMicro,
  onReset,
}: {
  score: number;
  total: number;
  missed: ActiveQuestion[];
  passed: boolean;
  passingScore: number;
  required: boolean;
  isMicro: boolean;
  onReset: () => void;
}): ReactNode {
  const ratio = total > 0 ? score / total : 0;
  const verdict = isMicro
    ? passed
      ? total === 1
        ? 'Got it.'
        : 'Nice — both right.'
      : 'Worth re-reading the section above.'
    : passed
    ? ratio >= 0.8
      ? 'Solid — you can move on with confidence.'
      : 'Passed. Worth a quick glance at the revisit links below.'
    : `Below the ${Math.round(passingScore * 100)}% threshold. ${
        required
          ? 'Re-read the linked sections, then retake to unlock Next.'
          : 'Re-read the linked sections, then retake when ready.'
      }`;

  return (
    <div
      className={[
        styles.result,
        passed ? styles.resultPass : styles.resultRetry,
        isMicro ? styles.resultMicro : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      <div className={styles.scoreLine}>
        {!isMicro && (
          <span className={styles.scoreNumber}>
            {score} / {total}
          </span>
        )}
        <span className={styles.scoreVerdict}>
          {isMicro ? (passed ? '✓ ' : '✗ ') : ''}
          {verdict}
        </span>
      </div>
      {missed.length > 0 && !isMicro && (
        <>
          <div className={styles.revisitHeading}>
            {passed ? 'Glance back at:' : 'Revisit these before retaking:'}
          </div>
          <ul className={styles.revisitList}>
            {missed.map((q) =>
              q.revisit ? (
                <li key={q.prompt}>
                  <Link to={revisitTo(q.revisit.to)}>{q.revisit.label}</Link>
                  <span className={styles.revisitWhy}>
                    {' '}— missed: "{truncate(q.prompt, 80)}"
                  </span>
                </li>
              ) : (
                <li key={q.prompt} className={styles.revisitWhy}>
                  Missed: "{truncate(q.prompt, 80)}"
                </li>
              ),
            )}
          </ul>
        </>
      )}
      {missed.length > 0 && isMicro && missed[0].revisit && (
        <div className={styles.microRevisit}>
          <Link to={revisitTo(missed[0].revisit.to)}>
            → Re-read: {missed[0].revisit.label}
          </Link>
        </div>
      )}
      <div className={styles.resultActions}>
        <button
          type="button"
          className={`${styles.resetButton} ${isMicro ? styles.resetButtonMicro : ''}`}
          onClick={onReset}
        >
          {isMicro ? 'Try again' : passed ? 'Retake with new questions' : 'Retake'}
        </button>
      </div>
    </div>
  );
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}

/**
 * Append ?revisit=1 to a revisit URL so the destination page knows to
 * scroll + flash-highlight the matching section. Preserves any existing
 * query string and the hash anchor.
 */
function revisitTo(to: string): string {
  const hashIdx = to.indexOf('#');
  const base = hashIdx === -1 ? to : to.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : to.slice(hashIdx);
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}revisit=1${hash}`;
}

export function Question(props: QuestionProps): ReactNode {
  const ctx = useContext(QuizContext);

  // Register on mount. Re-registers are idempotent (prompt is the key).
  useEffect(() => {
    if (ctx) ctx.registerQuestion(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ctx) {
    return (
      <div className={styles.question}>
        <strong>{props.prompt}</strong>
        <p style={{color: 'var(--ifm-color-warning-dark)'}}>
          (Question must live inside a &lt;Quiz&gt;.)
        </p>
      </div>
    );
  }

  // If sampling is in play, we render NOTHING when this question wasn't
  // picked for the current session. We still registered (so the bank
  // is known to Quiz), but we stay out of the DOM.
  const isActive = ctx.activePrompts.has(props.prompt);
  if (!isActive && ctx.activePrompts.size > 0) {
    return null;
  }
  // While registration is still settling on first mount, render hidden
  // so layout doesn't jump. activePrompts is empty pre-mount only.
  if (ctx.activePrompts.size === 0) {
    return null;
  }

  const active = ctx.activeQuestions.find((q) => q.prompt === props.prompt);
  const position = active?.position ?? -1;
  const chosen = ctx.answers[props.prompt];
  const submitted = ctx.submitted;

  return (
    <div className={styles.question}>
      <div className={styles.prompt}>
        <span className={styles.questionNumber}>
          {position >= 0 ? `Q${position + 1}.` : ''}
        </span>{' '}
        {props.prompt}
      </div>
      <ul className={styles.options} role="radiogroup">
        {props.options.map((opt, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === props.correct;
          const showRight = submitted && isCorrect;
          const showWrong = submitted && isChosen && !isCorrect;
          return (
            <li key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={submitted}
                onClick={() => ctx.recordAnswer(props.prompt, i)}
                className={[
                  styles.option,
                  isChosen ? styles.optionChosen : '',
                  showRight ? styles.optionRight : '',
                  showWrong ? styles.optionWrong : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}.</span>
                <span className={styles.optionText}>{opt.text}</span>
                {showRight && <span className={styles.tag} aria-label="correct">✓</span>}
                {showWrong && <span className={styles.tag} aria-label="incorrect">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {submitted && props.explanation && (
        <div
          className={
            chosen === props.correct
              ? styles.explanationRight
              : styles.explanationWrong
          }
        >
          {props.explanation}
          {props.revisit && chosen !== props.correct && (
            <>
              {' '}
              <Link to={revisitTo(props.revisit.to)} className={styles.revisitInline}>
                → Revisit: {props.revisit.label}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
