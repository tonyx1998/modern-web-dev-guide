import React, {useCallback, useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * Floating "📋 Menu" button rendered only in Beginner (guided) mode
 * AND only on doc pages where a sidebar actually exists.
 *
 * In Beginner mode the doc sidebar is hidden by default so the
 * reader follows the chapter in order via Prev/Next. This button
 * lets them summon the sidebar on demand to jump back to any
 * earlier page, without leaving guided mode.
 *
 * On non-doc pages (e.g. /suggestions, /), there is no sidebar
 * to summon — so we hide the button entirely and force any
 * lingering open-state shut.
 *
 * The actual show/hide is CSS-driven:
 *   - Sidebar is hidden when html[data-reader-level="beginner"]
 *     and NOT [data-sidebar="open"].
 *   - When [data-sidebar="open"] is set, the sidebar becomes
 *     visible again as a fixed-position overlay with a backdrop.
 *
 * Escape key and backdrop click close the overlay.
 */
export default function SidebarToggle(): ReactNode {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState<string | null>(null);
  const [hasSidebar, setHasSidebar] = useState(false);

  // Track reader-level changes so we can hide the toggle when not in Beginner.
  useEffect(() => {
    setMounted(true);
    const read = () =>
      setLevel(document.documentElement.getAttribute('data-reader-level'));
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-reader-level'],
    });
    return () => obs.disconnect();
  }, []);

  // Track whether THIS page has a doc sidebar at all. Docusaurus only
  // renders .theme-doc-sidebar-container on doc routes; on
  // /suggestions or the homepage it doesn't exist, so summoning a
  // sidebar would just show an empty backdrop.
  //
  // We poll on route change AND observe the body for childList
  // mutations, because Docusaurus's client-side route transitions
  // swap layouts asynchronously — the sidebar element may not be
  // present (or absent) at the instant useLocation fires.
  useEffect(() => {
    if (!mounted) return;
    function check() {
      const present = !!document.querySelector('.theme-doc-sidebar-container');
      setHasSidebar(present);
      // If the sidebar element is gone, also force-close the overlay
      // and clear the html attribute directly (don't rely on the
      // open-sync effect, which won't fire if `open` was already false).
      if (!present) {
        setOpen(false);
        document.documentElement.removeAttribute('data-sidebar');
      }
    }
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, {childList: true, subtree: true});
    // Belt-and-suspenders timeouts in case mutations are quiet
    // during a route transition that swaps a large subtree atomically.
    const t1 = window.setTimeout(check, 200);
    const t2 = window.setTimeout(check, 800);
    return () => {
      obs.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [mounted, location.pathname]);

  // Keep <html data-sidebar="open"> in sync so CSS can react.
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      document.documentElement.setAttribute('data-sidebar', 'open');
    } else {
      document.documentElement.removeAttribute('data-sidebar');
    }
  }, [open, mounted]);

  // Close the overlay when the reader navigates to a new page (Docusaurus
  // does client-side route changes; we listen for popstate + a custom
  // re-check on URL change via MutationObserver isn't needed because
  // the sidebar links use Link which triggers history pushState — we
  // listen to the click ourselves via a delegated handler).
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (t.closest('.theme-doc-sidebar-container a')) {
        // Let the navigation happen, then close.
        setTimeout(() => setOpen(false), 50);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!mounted) return null;
  if (level !== 'beginner') return null;
  if (!hasSidebar) return null;

  return (
    <>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        title={open ? 'Close menu' : 'Open the full chapter menu'}
      >
        <span aria-hidden className={styles.icon}>
          {open ? '✕' : '☰'}
        </span>
        <span className={styles.label}>{open ? 'Close' : 'Menu'}</span>
      </button>
      {open && <div className={styles.backdrop} onClick={close} aria-hidden />}
    </>
  );
}
