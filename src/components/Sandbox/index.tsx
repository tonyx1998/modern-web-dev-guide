import React from 'react';
import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * <Sandbox> — a multi-file, live-preview code editor (CodeSandbox's Sandpack).
 *
 * Use this where react-live can't cope: multi-file examples, raw DOM/vanilla
 * JS, a real preview pane, or Tailwind-styled markup (template="static" with
 * the Tailwind Play CDN).
 *
 * NOTE (tradeoff): Sandpack's default bundler runs on CodeSandbox's hosted
 * infrastructure, so this is the one interactive widget that depends on an
 * external service at runtime (unlike the live JS blocks, the CodeChallenge
 * worker, and the pglite SQL playground, which are all fully local). It's
 * lazy-loaded (a separate chunk fetched only when a Sandbox actually renders),
 * so it never weighs on pages that don't use it.
 */

const LazySandpack = React.lazy(async () => {
  const mod = await import('@codesandbox/sandpack-react');
  return {default: mod.Sandpack};
});

type FileValue =
  | string
  | {code: string; hidden?: boolean; active?: boolean; readOnly?: boolean};

interface SandboxProps {
  template?: 'static' | 'vanilla' | 'vanilla-ts' | 'react' | 'react-ts';
  files: Record<string, FileValue>;
  editorHeight?: number;
  /** Hide the editor and show only the preview (e.g. a finished demo). */
  previewOnly?: boolean;
}

const loading = (
  <div style={{padding: '1rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Loading interactive sandbox…
  </div>
);

export default function Sandbox({
  template = 'react',
  files,
  editorHeight = 320,
  previewOnly = false,
}: SandboxProps): ReactNode {
  return (
    <BrowserOnly fallback={loading}>
      {() => (
        <React.Suspense fallback={loading}>
          <LazySandpack
            template={template}
            files={files}
            theme="auto"
            options={{
              showLineNumbers: true,
              editorHeight,
              editorWidthPercentage: previewOnly ? 0 : 50,
            }}
          />
        </React.Suspense>
      )}
    </BrowserOnly>
  );
}
