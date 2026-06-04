import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Modern Web Dev Guide',
  tagline: 'How websites are actually built in 2026 — for absolute beginners and beyond',
  favicon: 'img/favicon.ico',

  stylesheets: [
    // Reading-experience type system:
    //   · IBM Plex Sans  — body text & UI (warmer/more characterful than Inter, equally legible)
    //   · Newsreader     — editorial serif for large headings, so section structure reads clearly
    //   · IBM Plex Mono  — code blocks & inline code
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap',
  ],

  future: {
    v4: true,
  },

  url: 'https://tonyx1998.github.io',
  baseUrl: '/modern-web-dev-guide/',

  organizationName: 'tonyx1998',
  projectName: 'modern-web-dev-guide',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    '@docusaurus/theme-live-codeblock',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Enable WebAssembly so pglite (Postgres-in-WASM, used by the SQL
    // playground on the Advanced Databases page) can load its module.
    function wasmSupportPlugin() {
      return {
        name: 'wasm-support',
        configureWebpack() {
          return {
            experiments: {asyncWebAssembly: true},
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          // editUrl intentionally omitted — we don't surface an
          // "Edit this page" link to discourage drive-by edits.
          // Pull requests are still possible by opening a fork directly
          // on GitHub, but they're not invited from inside the docs.
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        flowchart: {curve: 'basis', htmlLabels: true, padding: 16, nodeSpacing: 55, rankSpacing: 55, useMaxWidth: false},
        sequence: {useMaxWidth: false, mirrorActors: false},
        gantt: {useMaxWidth: false},
        themeVariables: {
          // Dark-mode contrast tweaks
          darkMode: true,
          primaryColor: '#1e3a8a',
          primaryTextColor: '#f1f5f9',
          primaryBorderColor: '#60a5fa',
          lineColor: '#a5b4cb',
          secondaryColor: '#334155',
          tertiaryColor: '#1c2535',
          fontSize: '15px',
          fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        },
        themeCSS: '.node rect{rx:8px;ry:8px} .node rect,.node polygon{stroke-width:1.5px} .edgePath .path{stroke-width:1.5px} .cluster rect{rx:10px;ry:10px}',
      },
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Modern Web Dev Guide',
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          to: '/docs/glossary',
          label: 'Glossary',
          position: 'left',
        },
        {
          // "Suggestions" now lives in a floating bottom-right pill
          // (see src/components/SuggestionsPill) so it's reachable from
          // every page without cluttering the navbar.
          href: 'https://github.com/tonyx1998/modern-web-dev-guide',
          label: 'GitHub',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Fundamentals',
          items: [
            {label: 'Introduction', to: '/'},
            {label: '1. Foundations', to: '/docs/foundations'},
            {label: '2. Roadmap', to: '/docs/roadmap'},
            {label: '3. Lifecycle', to: '/docs/lifecycle'},
            {label: '4. Tech Stack', to: '/docs/stack'},
          ],
        },
        {
          title: 'Infrastructure & Scale',
          items: [
            {label: '5. Cloud Platforms', to: '/docs/cloud'},
            {label: '6. SRE & Operations', to: '/docs/operations'},
            {label: '7. Distributed Systems', to: '/docs/distributed-systems'},
            {label: '8. AI Integration', to: '/docs/ai'},
            {label: '9. Mobile & Ecosystems', to: '/docs/ecosystems'},
          ],
        },
        {
          title: 'Workflows & Growth',
          items: [
            {label: '10. Solo / Personal', to: '/docs/solo'},
            {label: '11. Startup / Small Co.', to: '/docs/startup'},
            {label: '12. Enterprise', to: '/docs/enterprise'},
            {label: '13. Comparison', to: '/docs/comparison'},
            {label: '14. Decisions', to: '/docs/decisions'},
            {label: '15. Career', to: '/docs/career'},
            {label: '16. Glossary', to: '/docs/glossary'},
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tonyx1998/modern-web-dev-guide',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Modern Web Dev Guide. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash',
        'json',
        'yaml',
        'toml',
        'docker',
        'nginx',
        'sql',
        'tsx',
        'jsx',
        'go',
        'rust',
        'python',
        'http',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
