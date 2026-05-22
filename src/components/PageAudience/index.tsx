import React from 'react';
import type {ReactNode} from 'react';

type Level = 'beginner' | 'reader' | 'advanced';

interface Props {
  level: Level;
  children: ReactNode;
}

/**
 * Per-page banner that tells the reader what THIS page assumes
 * and where to jump if they don't want to read all of it.
 *
 * Use one PageAudience per level you want to address. Each will
 * only render for the matching reader level.
 *
 *   <PageAudience level="beginner">
 *     New here? Read the whole page top to bottom.
 *   </PageAudience>
 *
 *   <PageAudience level="advanced">
 *     Reference: jump to the "safe cookie recipe" table.
 *   </PageAudience>
 */
export default function PageAudience({level, children}: Props): ReactNode {
  const cls =
    level === 'beginner'
      ? 'page-audience-banner page-audience-banner-beginner'
      : level === 'advanced'
      ? 'page-audience-banner page-audience-banner-advanced'
      : 'page-audience-banner';
  const emoji = level === 'beginner' ? '👶' : level === 'advanced' ? '🚀' : '📖';
  return (
    <div className="reader-level" data-reader-show={level}>
      <div className={cls}>
        <span aria-hidden style={{fontSize: '1.15rem', lineHeight: 1.2}}>
          {emoji}
        </span>
        <div>{children}</div>
      </div>
    </div>
  );
}
