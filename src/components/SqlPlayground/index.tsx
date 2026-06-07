import React, {useCallback, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * <SqlPlayground> — a real PostgreSQL database running entirely in the
 * browser via pglite (Postgres compiled to WASM). No backend, no network at
 * query time. Because it's real Postgres, `EXPLAIN ANALYZE` shows a real
 * query plan — so the index lesson is demonstrable live: run the query (seq
 * scan), `CREATE INDEX …`, run it again (index scan).
 *
 * The WASM (~3 MB) is fetched only on the first "Run" click, never on page load.
 *
 * Usage in MDX:
 *   <SqlPlayground
 *     id="orders-explain"
 *     schema={`CREATE TABLE orders (...); INSERT INTO orders ... ;`}
 *     initialQuery={`EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42 ...;`}
 *   />
 */

type Cell = string | number | boolean | null | undefined;
interface ExecResult {
  rows: Record<string, Cell>[];
  fields: {name: string}[];
}

interface ResultSet {
  columns: string[];
  rows: Record<string, Cell>[];
}

interface SqlPlaygroundProps {
  id: string;
  /** Setup SQL (schema + seed). Run once when the DB is first created. */
  schema: string;
  /** Query shown in the editor initially. */
  initialQuery: string;
  title?: string;
}

function fmt(v: Cell): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function toResultSet(result: ExecResult): ResultSet | null {
  if (result.fields?.length && result.rows?.length) {
    return {
      columns: result.fields.map((f) => f.name),
      rows: result.rows,
    };
  }
  return null;
}

export default function SqlPlayground({
  schema,
  initialQuery,
  title,
}: SqlPlaygroundProps): ReactNode {
  const [query, setQuery] = useState(initialQuery);
  const [resultSets, setResultSets] = useState<ResultSet[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbRef = useRef<any>(null);

  const createDb = useCallback(async () => {
    setLoadingMsg('Downloading Postgres (WASM, ~3 MB) — first run only…');
    const {PGlite} = await import('@electric-sql/pglite');
    const db = new PGlite();
    await db.exec(schema);
    setLoadingMsg(null);
    return db;
  }, [schema]);

  const ensureDb = useCallback(async () => {
    if (dbRef.current) return dbRef.current;
    const db = await createDb();
    dbRef.current = db;
    return db;
  }, [createDb]);

  const run = useCallback(async () => {
    setRunning(true);
    setError(null);
    setNotice(null);
    setResultSets([]);
    try {
      const db = await ensureDb();
      const results: ExecResult[] = await db.exec(query);
      const sets = results.map(toResultSet).filter((r): r is ResultSet => r !== null);
      if (sets.length > 0) {
        setResultSets(sets);
        if (sets.length > 1) {
          setNotice(`${sets.length} result sets returned (showing all).`);
        }
      } else {
        setNotice('Statement executed — no rows returned.');
      }
    } catch (err) {
      setError(String((err as Error)?.message ?? err));
      setResultSets([]);
    } finally {
      setRunning(false);
      setLoadingMsg(null);
    }
  }, [ensureDb, query]);

  const resetDb = useCallback(async () => {
    if (dbRef.current) {
      try {
        await dbRef.current.close();
      } catch {
        /* ignore */
      }
      dbRef.current = null;
    }
    setResultSets([]);
    setError(null);
    setNotice('Database reset to its seeded state (your CREATE INDEX etc. are gone).');
    try {
      dbRef.current = await createDb();
    } catch (err) {
      setError(String((err as Error)?.message ?? err));
    }
  }, [createDb]);

  return (
    <section className={styles.sql} aria-label={title ?? 'SQL playground'}>
      <header className={styles.header}>
        <span className={styles.badge}>🐘 Live Postgres — runs in your browser</span>
        {title && <span className={styles.title}>{title}</span>}
      </header>

      <textarea
        className={styles.editor}
        value={query}
        spellCheck={false}
        onChange={(e) => setQuery(e.target.value)}
        rows={Math.max(4, query.split('\n').length + 1)}
        aria-label="SQL query"
      />

      <div className={styles.actions}>
        <button type="button" className={styles.run} onClick={run} disabled={running}>
          {running ? 'Running…' : 'Run'}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setQuery(initialQuery)}>
          Reset query
        </button>
        <button type="button" className={styles.secondary} onClick={resetDb}>
          Reset database
        </button>
      </div>

      {loadingMsg && <div className={styles.loading}>{loadingMsg}</div>}
      {error && (
        <div className={styles.error} role="alert">
          <strong>SQL error:</strong> {error}
        </div>
      )}
      {notice && !error && <div className={styles.notice}>{notice}</div>}

      {resultSets.map((set, setIdx) => {
        const isPlan = set.columns.length === 1 && set.columns[0] === 'QUERY PLAN';
        if (isPlan) {
          return (
            <pre key={setIdx} className={styles.plan}>
              {set.rows.map((r) => fmt(r['QUERY PLAN'])).join('\n')}
            </pre>
          );
        }
        return (
          <div key={setIdx} className={styles.tableWrap}>
            {resultSets.length > 1 && (
              <div className={styles.resultLabel}>Result set {setIdx + 1}</div>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  {set.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {set.rows.slice(0, 50).map((r, i) => (
                  <tr key={i}>
                    {set.columns.map((c) => (
                      <td key={c}>{fmt(r[c])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {set.rows.length > 50 && (
              <div className={styles.more}>…and {set.rows.length - 50} more rows</div>
            )}
          </div>
        );
      })}
    </section>
  );
}
