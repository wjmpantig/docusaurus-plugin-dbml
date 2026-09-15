import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { remarkDbmlToComponent } from '@wjmpantig/docusaurus-plugin-dbml';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const repo = 'https://github.com/wjmpantig/docusaurus-plugin-dbml';
const npm = 'https://www.npmjs.com/package/@wjmpantig/docusaurus-plugin-dbml';

const config: Config = {
  title: 'docusaurus-plugin-dbml',
  tagline: 'Write a dbml code fence. Get an interactive database diagram.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://wjmpantig.github.io',
  baseUrl: '/docusaurus-plugin-dbml/',

  organizationName: 'wjmpantig',
  projectName: 'docusaurus-plugin-dbml',

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
          sidebarPath: './sidebars.ts',
          editUrl: `${repo}/tree/master/example/`,
          remarkPlugins: [remarkDbmlToComponent],
        },
        blog: false,
        pages: {
          remarkPlugins: [remarkDbmlToComponent],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  // A no-op stub, kept so this site matches the documented install.
  plugins: ['@wjmpantig/docusaurus-plugin-dbml'],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'docusaurus-plugin-dbml',
      logo: {
        alt: 'docusaurus-plugin-dbml logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/docs/examples', label: 'Examples', position: 'left'},
        {href: npm, label: 'npm', position: 'right'},
        {href: repo, label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Installation', to: '/docs/installation'},
            {label: 'Configuration', to: '/docs/configuration'},
            {label: 'Examples', to: '/docs/examples'},
            {label: 'Troubleshooting', to: '/docs/troubleshooting'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: repo},
            {label: 'npm', href: npm},
            {
              label: 'react-dbml-renderer',
              href: 'https://github.com/wjmpantig/react-dbml-renderer',
            },
            {label: 'DBML language', href: 'https://dbml.dbdiagram.io/docs/'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Winfred Jester Pantig. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
