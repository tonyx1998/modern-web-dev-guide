import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {
  CHAPTER_PREREQS,
  describeQuiz,
  unmetPrereqs,
} from './prereqs';

/**
 * In Beginner mode, walk the doc sidebar and mark chapters whose
 * prerequisite quizzes haven't been passed as LOCKED:
 *
 *   - data-locked="true" on the <a class="menu__link">
 *   - data-locked="true" on the wrapping <li class="theme-doc-sidebar-item-category-level-1">
 *
 * Visuals (lock icon, dimmed style, pointer-events:none) are in custom.css.
 *
 * We also catch link clicks: if a beginner clicks a locked link, we
 * cancel the navigation defensively (CSS pointer-events:none should
 * have stopped it already, but capture-phase listener is a belt-and-
 * suspenders backup against custom CSS that overrides pointer-events).
 *
 * Re-runs whenever the URL changes (so a fresh quiz-pass on the
 * current page can unlock items immediately) and whenever localStorage
 * changes in another tab.
 */
export default function SidebarLockGate(): null {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function apply() {
      const level = document.documentElement.getAttribute('data-reader-level');
      // Only enforce in Beginner mode. In Reader/Advanced, clear any
      // previously-set lock attrs so the sidebar fully reopens.
      const enforce = level === 'beginner';

      // On desktop, doc sidebar items live inside
      // `.theme-doc-sidebar-container`. On mobile, Docusaurus renders
      // the same items inside `.navbar-sidebar` (the slide-out panel
      // from the navbar hamburger). We have to scan both containers,
      // or mobile readers see every chapter unlocked.
      const links = document.querySelectorAll<HTMLAnchorElement>(
        '.theme-doc-sidebar-container a.menu__link, .navbar-sidebar a.menu__link',
      );

      // First pass: per-link lock state. Track whether each chapter
      // has any locked OR any unlocked items, so we can decide whether
      // to mark the chapter-level category as locked too.
      const chapterStats: Record<string, {locked: number; total: number}> = {};

      links.forEach((link) => {
        const href = link.getAttribute('href') ?? '';
        const unmet = enforce ? unmetPrereqs(href) : [];
        // Track for the category-level decision below.
        const chapterMatch = href.match(/\/docs\/([^/?#]+)/);
        const chapter = chapterMatch?.[1];
        if (chapter) {
          chapterStats[chapter] = chapterStats[chapter] ?? {locked: 0, total: 0};
          chapterStats[chapter].total += 1;
        }

        if (unmet.length === 0) {
          link.removeAttribute('data-locked');
          link.removeAttribute('data-lock-reason');
          return;
        }
        if (chapter) chapterStats[chapter].locked += 1;
        link.setAttribute('data-locked', 'true');
        const reasons = unmet.map((q) => describeQuiz(q)).join(' • ');
        link.setAttribute('title', `🔒 ${reasons} to unlock this page`);
        link.setAttribute('data-lock-reason', reasons);
      });

      // Second pass: lock the chapter-level category ONLY if EVERY
      // page in that chapter is locked. Otherwise the category should
      // remain clickable so the reader can drill into the unlocked
      // pages inside. (Previously we locked the whole category on
      // ANY locked link, which over-blocked once we added per-page
      // sequencing within a chapter.)
      const categories = document.querySelectorAll<HTMLElement>(
        '.theme-doc-sidebar-container .theme-doc-sidebar-item-category-level-1, .navbar-sidebar .theme-doc-sidebar-item-category-level-1',
      );
      categories.forEach((cat) => {
        // Find a link inside the category to determine chapter slug.
        const anyLink = cat.querySelector<HTMLAnchorElement>('a.menu__link');
        const href = anyLink?.getAttribute('href') ?? '';
        const m = href.match(/\/docs\/([^/?#]+)/);
        const chapter = m?.[1];
        if (!chapter) {
          cat.removeAttribute('data-locked');
          return;
        }
        const stats = chapterStats[chapter];
        const allLocked =
          enforce && stats && stats.total > 0 && stats.locked === stats.total;
        if (allLocked) {
          cat.setAttribute('data-locked', 'true');
        } else {
          cat.removeAttribute('data-locked');
        }
      });
    }

    function onClickCapture(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest(
        '.theme-doc-sidebar-container a[data-locked="true"], .navbar-sidebar a[data-locked="true"]',
      );
      if (link) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // Apply now, on a short delay (let Docusaurus finish rendering),
    // and observe the sidebar for changes (route transitions re-render
    // it; reader-level toggles change enforce).
    apply();
    const t1 = window.setTimeout(apply, 200);
    const t2 = window.setTimeout(apply, 800);

    // Watch both the desktop sidebar container and the mobile
    // navbar-sidebar panel — Docusaurus mounts/unmounts the mobile
    // panel as the hamburger toggles, and we need to re-apply locks
    // every time the doc items appear.
    const sidebars = document.querySelectorAll(
      '.theme-doc-sidebar-container, .navbar-sidebar',
    );
    const obs = new MutationObserver(() => apply());
    sidebars.forEach((el) => obs.observe(el, {childList: true, subtree: true}));
    // Also observe <body> so we catch the mobile navbar-sidebar
    // being added/removed entirely on hamburger toggle.
    obs.observe(document.body, {childList: true});

    const levelObs = new MutationObserver(apply);
    levelObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-reader-level'],
    });

    function onStorage(e: StorageEvent) {
      if (!e.key || e.key.startsWith('quiz-')) apply();
    }
    function onQuizSaved() {
      apply();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('quiz:saved', onQuizSaved as EventListener);
    document.addEventListener('click', onClickCapture, true);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      obs?.disconnect();
      levelObs.disconnect();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('quiz:saved', onQuizSaved as EventListener);
      document.removeEventListener('click', onClickCapture, true);
    };
  }, [location.pathname]);

  return null;
}

export {CHAPTER_PREREQS, isQuizPassed} from './prereqs';
