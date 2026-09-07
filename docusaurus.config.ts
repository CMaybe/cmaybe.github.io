import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Jaegyeom Kim',
  tagline: 'Model-based control and real-time robotics systems',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://cmaybe.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'CMaybe', // Usually your GitHub org/user name.
  projectName: 'cmaybe.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'notes',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/CMaybe/cmaybe.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'Modern Robotics',
          blogSidebarCount: 20,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/CMaybe/cmaybe.github.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'robotics, robot control, motion planning, model predictive control, optimization, autonomous systems',
      },
      ...(process.env.GOOGLE_SITE_VERIFICATION
        ? [
          {
            name: 'google-site-verification',
            content: process.env.GOOGLE_SITE_VERIFICATION,
          },
        ]
        : []),
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Jaegyeom Kim',
      logo: {
        alt: 'My Site Logo',
        src: '/img/profile-bird.jpg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Modern Robotics',
        },
        { to: '/blog', label: 'Posting', position: 'left' },
        {
          href: 'https://github.com/CMaybe',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Notes',
          items: [
            {
              label: 'Robotics notes',
              to: '/notes/intro',
            },
          ],
        },
        {
          title: 'Elsewhere',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/CMaybe',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/Jaegyeom-kim-185b8a2a4/',
            },
            {
              label: 'Modern Robotics demo',
              href: 'https://cmaybe.github.io/modern-robotics-wasm/',
            },
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: 'Modern Robotics WASM',
              href: 'https://github.com/CMaybe/modern-robotics-wasm',
            },
            {
              label: 'Optimal Parking',
              href: 'https://github.com/CMaybe/Optimal-Parking',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jaegyeom Kim.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
