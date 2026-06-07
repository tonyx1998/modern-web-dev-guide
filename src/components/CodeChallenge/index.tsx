import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * <CodeChallenge> — an in-browser, auto-graded coding exercise.
 *
 * The learner writes a function; we run it in a Web Worker (isolated, with a
 * timeout so an infinite loop can't freeze the tab) and check it against a
 * set of assertions. This is *practice*, not a gated checkpoint — the MCQ
 * <Quiz> still gates the Next button. Every challenge ships with starter
 * code, an optional hint, and a reveal-able solution.
 *
 * Usage in MDX:
 *   <CodeChallenge
 *     id="stage1-sum-evens"
 *     fnName="sumEvens"
 *     prompt="Write `sumEvens(nums)` returning the sum of the even numbers."
 *     starter={`function sumEvens(nums) {\n  // your code\n}`}
 *     solution={`function sumEvens(nums) {\n  return nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);\n}`}
 *     tests={[
 *       {args: [[1, 2, 3, 4]], expected: 6},
 *       {args: [[]], expected: 0},
 *     ]}
 *     hint="filter to evens, then reduce to a sum."
 *   />
 */

interface TestCase {
  args: unknown[];
  expected: unknown;
  label?: string;
}

interface TestResult extends TestCase {
  pass: boolean;
  got?: unknown;
  error?: string;
  mutated?: boolean;
}

interface CodeChallengeProps {
  id: string;
  /** The function name the learner must define. */
  fnName: string;
  /** Instructions (supports inline markdown-ish text; rendered as-is). */
  prompt: string;
  starter: string;
  solution: string;
  tests: TestCase[];
  hint?: string;
  /** If true, fail any test where the learner mutated an input argument. */
  noMutate?: boolean;
  /** Worker timeout in ms (infinite-loop guard). Default 2000. */
  timeoutMs?: number;
}

// The worker source. Runs the learner's code, resolves `fnName`, calls it for
// each test, deep-compares to `expected`, and (optionally) flags mutation.
const WORKER_SRC = `
self.onmessage = function (e) {
  var code = e.data.code, fnName = e.data.fnName, tests = e.data.tests, noMutate = e.data.noMutate;
  function eq(a, b) { try { return JSON.stringify(a) === JSON.stringify(b); } catch (_) { return a === b; } }
  var fn;
  try {
    var factory = new Function(code + "\\nreturn typeof " + fnName + " === 'function' ? " + fnName + " : undefined;");
    fn = factory();
  } catch (err) {
    self.postMessage({ error: String(err && err.message || err) });
    return;
  }
  if (typeof fn !== 'function') {
    self.postMessage({ error: "Define a function named '" + fnName + "'." });
    return;
  }
  var results = tests.map(function (t) {
    var before = JSON.stringify(t.args);
    try {
      var got = fn.apply(null, t.args);
      var mutated = noMutate && JSON.stringify(t.args) !== before;
      return { args: t.args, expected: t.expected, label: t.label, got: got, pass: !mutated && eq(got, t.expected), mutated: mutated };
    } catch (err) {
      return { args: t.args, expected: t.expected, label: t.label, error: String(err && err.message || err), pass: false };
    }
  });
  self.postMessage({ results: results });
};
`;

function preview(v: unknown): string {
  try {
    const s = JSON.stringify(v);
    return s === undefined ? String(v) : s;
  } catch {
    return String(v);
  }
}

export default function CodeChallenge({
  id,
  fnName,
  prompt,
  starter,
  solution,
  tests,
  hint,
  noMutate = false,
  timeoutMs = 2000,
}: CodeChallengeProps): ReactNode {
  const [code, setCode] = useState(starter);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore "solved" badge from a previous session.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage.getItem(`challenge-${id}`) === 'solved') {
        setSolved(true);
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const run = useCallback(() => {
    if (typeof window === 'undefined') return;
    cleanup();
    setRunning(true);
    setError(null);
    setResults(null);

    let blobUrl: string;
    try {
      blobUrl = URL.createObjectURL(
        new Blob([WORKER_SRC], {type: 'application/javascript'}),
      );
    } catch (err) {
      setError(`Could not start the runner: ${String(err)}`);
      setRunning(false);
      return;
    }

    const worker = new Worker(blobUrl);
    workerRef.current = worker;

    timerRef.current = setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      cleanup();
      setRunning(false);
      setError(
        'Timed out — your code took too long (an infinite loop, maybe?). Check your loops and try again.',
      );
    }, timeoutMs);

    worker.onmessage = (ev: MessageEvent) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRunning(false);
      URL.revokeObjectURL(blobUrl);
      const data = ev.data as {error?: string; results?: TestResult[]};
      if (data.error) {
        setError(data.error);
        worker.terminate();
        workerRef.current = null;
        return;
      }
      const res = data.results ?? [];
      setResults(res);
      const allPass = res.length > 0 && res.every((r) => r.pass);
      if (allPass) {
        setSolved(true);
        try {
          window.localStorage.setItem(`challenge-${id}`, 'solved');
        } catch {
          /* ignore */
        }
      }
      worker.terminate();
      workerRef.current = null;
    };

    worker.onerror = (ev) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      URL.revokeObjectURL(blobUrl);
      setRunning(false);
      setError(ev.message || 'Something went wrong running your code.');
      worker.terminate();
      workerRef.current = null;
    };

    worker.postMessage({code, fnName, tests, noMutate});
  }, [code, fnName, tests, noMutate, timeoutMs, cleanup, id]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Make Tab insert two spaces instead of leaving the editor.
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const {selectionStart, selectionEnd} = el;
      const next = code.slice(0, selectionStart) + '  ' + code.slice(selectionEnd);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    }
  }

  const passCount = results ? results.filter((r) => r.pass).length : 0;

  return (
    <section className={styles.challenge} aria-label="Coding challenge">
      <header className={styles.header}>
        <span className={styles.badge}>⌨️ Challenge — practice (not graded)</span>
        {solved && <span className={styles.solvedBadge}>✓ Solved</span>}
      </header>

      <p className={styles.prompt}>{prompt}</p>

      <textarea
        className={styles.editor}
        value={code}
        spellCheck={false}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={Math.max(6, code.split('\n').length + 1)}
        aria-label="Your code"
      />

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.run}
          onClick={run}
          disabled={running}>
          {running ? 'Running…' : 'Run tests'}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => {
            setCode(starter);
            setResults(null);
            setError(null);
            setSolved(false);
            try {
              window.localStorage.removeItem(`challenge-${id}`);
            } catch {
              /* ignore */
            }
          }}>
          Reset
        </button>
        {hint && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => setShowHint((s) => !s)}>
            {showHint ? 'Hide hint' : 'Hint'}
          </button>
        )}
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setShowSolution((s) => !s)}>
          {showSolution ? 'Hide solution' : 'Show solution'}
        </button>
      </div>

      {showHint && hint && <div className={styles.hint}>💡 {hint}</div>}

      {error && (
        <div className={styles.error} role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && !error && (
        <div
          className={
            passCount === results.length ? styles.resultPass : styles.resultFail
          }>
          <div className={styles.resultHead}>
            {passCount === results.length
              ? `✓ All ${results.length} tests passed — nice.`
              : `${passCount} / ${results.length} tests passed`}
          </div>
          <ul className={styles.testList}>
            {results.map((r, i) => (
              <li key={i} className={r.pass ? styles.testPass : styles.testFail}>
                <span className={styles.testIcon}>{r.pass ? '✓' : '✗'}</span>{' '}
                <code>
                  {fnName}({(r.args ?? []).map(preview).join(', ')})
                </code>
                {!r.pass && (
                  <span className={styles.testWhy}>
                    {r.error
                      ? ` → threw: ${r.error}`
                      : r.mutated
                      ? ' → you mutated the input; return a new value instead'
                      : ` → expected ${preview(r.expected)}, got ${preview(r.got)}`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSolution && (
        <pre className={styles.solution}>
          <code>{solution}</code>
        </pre>
      )}
    </section>
  );
}
