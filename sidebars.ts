import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Foundations',
      collapsible: true,
      collapsed: false,
      items: [
        'foundational-concepts',
        'development-lifecycle',
        'tech-stack-decoded',
      ],
    },
    {
      type: 'category',
      label: 'Workflows by Scale',
      collapsible: true,
      collapsed: false,
      items: [
        'personal-website-workflow',
        'small-company-workflow',
        'large-company-workflow',
        'comparison',
      ],
    },
    {
      type: 'category',
      label: 'Applied',
      collapsible: true,
      collapsed: false,
      items: [
        'decision-frameworks',
        'ai-integration',
      ],
    },
    {
      type: 'category',
      label: 'Career',
      collapsible: true,
      collapsed: false,
      items: [
        'career-path',
        'glossary',
      ],
    },
  ],
};

export default sidebars;
