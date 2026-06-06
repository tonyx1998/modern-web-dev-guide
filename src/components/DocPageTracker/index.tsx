import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {useGuideProgress} from '@site/src/hooks/useGuideProgress';

/**
 * Re-evaluates chapter completion when quiz results change in localStorage
 * or when navigating between doc pages.
 */
export default function DocPageTracker(): null {
  const location = useLocation();
  const {refreshProgress} = useGuideProgress();

  useEffect(() => {
    refreshProgress();
  }, [location.pathname, refreshProgress]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith('quiz-')) {
        refreshProgress();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshProgress]);

  return null;
}
