import React, {useEffect} from 'react';
import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SuggestionsPill from '@site/src/components/SuggestionsPill';
import RevisitHighlight from '@site/src/components/RevisitHighlight';
import SidebarLockGate from '@site/src/components/SidebarLockGate';
import DocPageTracker from '@site/src/components/DocPageTracker';
import ReaderStatusBanners from '@site/src/components/ReaderStatusBanners';

interface RootProps {
  children: ReactNode;
}

// The site is locked to the beginner reading level. The CSS in custom.css
// keys off html[data-reader-level="beginner"] to show beginner-only blocks
// and hide reader/advanced blocks.
export default function Root({children}: RootProps): ReactNode {
  useEffect(() => {
    document.documentElement.setAttribute('data-reader-level', 'beginner');
  }, []);

  return (
    <>
      {children}
      <BrowserOnly>
        {() => (
          <>
            <SuggestionsPill />
            <RevisitHighlight />
            <SidebarLockGate />
            <DocPageTracker />
            <ReaderStatusBanners />
          </>
        )}
      </BrowserOnly>
    </>
  );
}
