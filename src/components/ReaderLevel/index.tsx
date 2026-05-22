import React from 'react';
import type {ReactNode} from 'react';

type Level = 'beginner' | 'reader' | 'advanced';

interface Props {
  show: Level | Level[];
  children: ReactNode;
}

/**
 * Conditionally show content based on the reader's selected level.
 *
 * Usage in MDX:
 *   <ReaderLevel show="beginner">Friendly explanation</ReaderLevel>
 *   <ReaderLevel show={['reader','advanced']}>Terse version</ReaderLevel>
 *
 * Implementation: writes a data attribute on a wrapping div; the
 * actual show/hide is done by CSS in custom.css that keys off
 * `html[data-reader-level=...]`. Keeping it CSS-driven means the
 * content is in the DOM (good for SEO and search) and toggling is
 * instant without React re-renders across the whole page.
 */
export default function ReaderLevel({show, children}: Props): ReactNode {
  const levels = Array.isArray(show) ? show : [show];
  return (
    <div className="reader-level" data-reader-show={levels.join(' ')}>
      {children}
    </div>
  );
}
