import React, {useEffect} from 'react';
import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import LevelSwitcher, {readLevel} from '@site/src/components/LevelSwitcher';
import SidebarToggle from '@site/src/components/SidebarToggle';
import RevisitHighlight from '@site/src/components/RevisitHighlight';
import SidebarLockGate from '@site/src/components/SidebarLockGate';

interface RootProps {
  children: ReactNode;
}

/**
 * Wraps the whole site. We use it for two things:
 *  1. Apply the user's saved reading level to <html> as early as
 *     possible, so the content hide/show CSS picks the right level
 *     without a visible flash.
 *  2. Mount the floating LevelSwitcher pill on every page.
 *
 * The actual show/hide logic lives in custom.css (data-reader-level
 * attribute selectors on <ReaderLevel show="...">).
 */
export default function Root({children}: RootProps): ReactNode {
  useEffect(() => {
    const level = readLevel();
    document.documentElement.setAttribute('data-reader-level', level);
  }, []);

  return (
    <>
      {children}
      <BrowserOnly>
        {() => (
          <>
            <div className="reader-level-floating">
              <LevelSwitcher />
            </div>
            <SidebarToggle />
            <RevisitHighlight />
            <SidebarLockGate />
          </>
        )}
      </BrowserOnly>
    </>
  );
}
