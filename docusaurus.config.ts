import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Modern Web Dev Guide',
  tagline: 'How websites are actually built in 2026 — for absolute beginners and beyond',
  favicon: 'img/favicon.ico',

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
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          editUrl:
            'https://github.com/tonyx1998/modern-web-dev-guide/tree/main/',
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
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: true,
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
          to: '/docs/foundations',
          label: 'Start Here',
          position: 'left',
        },
        {
          to: '/docs/glossary',
          label: 'Glossary',
          position: 'left',
        },
        {
          href: 'https://github.com/tonyx1998/modern-web-dev-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Foundations',
          items: [
            {label: 'Introduction', to: '/'},
            {label: '1. Foundations', to: '/docs/foundations'},
            {label: '2. Lifecycle', to: '/docs/lifecycle'},
            {label: '3. Tech Stack', to: '/docs/stack'},
          ],
        },
        {
          title: 'Workflows',
          items: [
            {label: '4. Solo / Personal', to: '/docs/personal-website-workflow'},
            {label: '5. Startup / Small Co.', to: '/docs/small-company-workflow'},
            {label: '6. Enterprise', to: '/docs/large-company-workflow'},
            {label: '7. Comparison', to: '/docs/comparison'},
          ],
        },
        {
          title: 'Applied',
          items: [
            {label: '8. Decisions', to: '/docs/decision-frameworks'},
            {label: '9. AI Layer', to: '/docs/ai-integration'},
            {label: '10. Career', to: '/docs/career-path'},
            {label: '11. Glossary', to: '/docs/glossary'},
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
