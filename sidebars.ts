import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Foundations',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Part 1 - Rigid-Body Motion and PoE',
          href: '/blog/modern-robotics-part-1',
        },
        {
          type: 'link',
          label: 'Part 2A - Screw Theory',
          href: '/blog/modern-robotics-part-2',
        },
        {
          type: 'link',
          label: 'Part 2B - Frames and Lie Groups',
          href: '/blog/modern-robotics-part-2b',
        },
      ],
    },
    {
      type: 'category',
      label: 'Kinematics and Control',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Part 3 - Jacobians',
          href: '/blog/modern-robotics-part-3',
        },
        {
          type: 'link',
          label: 'Part 4 - Manipulability and Velocity Control',
          href: '/blog/modern-robotics-part-4',
        },
        {
          type: 'link',
          label: 'Part 5 - Inverse Kinematics',
          href: '/blog/modern-robotics-part-5',
        },
      ],
    },
    {
      type: 'category',
      label: 'Dynamics and Planning',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Part 6A - Dynamics and Motion Generation',
          href: '/blog/modern-robotics-part-6',
        },
        {
          type: 'link',
          label: 'Part 6B - Trajectories and Motion Planning',
          href: '/blog/modern-robotics-part-6b',
        },
      ],
    },
    {
      type: 'category',
      label: 'Series Overview',
      items: [
        {
          type: 'link',
          label: 'Complete Series Summary',
          href: '/blog/modern-robotics-series-summary',
        },
        {
          type: 'link',
          label: 'Modern Robotics WASM',
          href: '/blog/modern-robotics-wasm',
        },
      ],
    },
  ],
};

export default sidebars;
