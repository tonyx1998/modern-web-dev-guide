import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

const GUIDED_TEXT =
  'Guided mode — read top to bottom and use the big Prev/Next buttons at the bottom of each page. The full chapter menu is on the left.';

const QUIZ_GATE_TEXT = 'Pass the quiz above to continue';

/**
 * Injects accessible status banners for guided mode and quiz gating.
 * Replaces CSS-only ::before messages that screen readers cannot announce.
 */
export default function ReaderStatusBanners(): null {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const level = document.documentElement.getAttribute('data-reader-level');
    const isBeginner = level === 'beginner';
    const isDoc = location.pathname.includes('/docs');

    const markdown = document.querySelector<HTMLElement>('.markdown');
    let guidedEl: HTMLDivElement | null = null;

    if (isBeginner && isDoc && markdown) {
      guidedEl = markdown.querySelector<HTMLDivElement>('[data-guided-banner]');
      if (!guidedEl) {
        guidedEl = document.createElement('div');
        guidedEl.dataset.guidedBanner = 'true';
        guidedEl.className = 'guided-mode-banner';
        guidedEl.setAttribute('role', 'status');
        guidedEl.textContent = GUIDED_TEXT;
        markdown.insertBefore(guidedEl, markdown.firstChild);
      }
    } else {
      markdown
        ?.querySelector('[data-guided-banner]')
        ?.remove();
    }

    function syncQuizGate() {
      const pending = document.body.classList.contains('quiz-required-pending');
      const next = document.querySelector<HTMLAnchorElement>(
        '.pagination-nav__link--next',
      );
      if (next) {
        if (isBeginner && pending) {
          next.setAttribute('aria-disabled', 'true');
          next.setAttribute('tabindex', '-1');
        } else {
          next.removeAttribute('aria-disabled');
          next.removeAttribute('tabindex');
        }
      }

      let gateEl = document.querySelector<HTMLDivElement>('[data-quiz-gate-banner]');
      if (isBeginner && pending && next?.parentElement) {
        if (!gateEl) {
          gateEl = document.createElement('div');
          gateEl.dataset.quizGateBanner = 'true';
          gateEl.className = 'quiz-gate-banner';
          gateEl.setAttribute('role', 'status');
          gateEl.textContent = QUIZ_GATE_TEXT;
          next.parentElement.insertBefore(gateEl, next);
        }
      } else {
        gateEl?.remove();
      }
    }

    syncQuizGate();
    const bodyObs = new MutationObserver(syncQuizGate);
    bodyObs.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const navObs = new MutationObserver(syncQuizGate);
    const main = document.querySelector('main');
    if (main) navObs.observe(main, {childList: true, subtree: true});

    return () => {
      guidedEl?.remove();
      document.querySelector('[data-quiz-gate-banner]')?.remove();
      bodyObs.disconnect();
      navObs.disconnect();
    };
  }, [location.pathname]);

  return null;
}
