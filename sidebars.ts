import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

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
      label: 'Projects',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Modern Robotics',
          collapsed: true,
          items: [
            'modern-robotics',
            {
              type: 'category',
              label: 'Foundations',
              items: [
                {
                  type: 'doc',
                  id: 'modern-robotics/part-1',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/part-2a',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/part-2b',
                },
              ],
            },
            {
              type: 'category',
              label: 'Kinematics and Control',
              items: [
                {
                  type: 'doc',
                  id: 'modern-robotics/part-3',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/part-4',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/part-5',
                },
              ],
            },
            {
              type: 'category',
              label: 'Dynamics and Planning',
              items: [
                {
                  type: 'doc',
                  id: 'modern-robotics/part-6a',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/part-6b',
                },
              ],
            },
            {
              type: 'category',
              label: 'Series Overview',
              items: [
                {
                  type: 'doc',
                  id: 'modern-robotics/summary',
                },
                {
                  type: 'doc',
                  id: 'modern-robotics/wasm',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Optimal Parking',
          collapsed: true,
          items: [
            'optimal-parking',
            {
              type: 'category',
              label: 'Planning and Control',
              items: [
                {
                  type: 'doc',
                  id: 'optimal-parking/part-1',
                },
                {
                  type: 'doc',
                  id: 'optimal-parking/part-2',
                },
                {
                  type: 'doc',
                  id: 'optimal-parking/part-3-optimal-control',
                },
                {
                  type: 'doc',
                  id: 'optimal-parking/part-4',
                },
              ],
            },
            {
              type: 'category',
              label: 'Feasibility and Implementation',
              items: [
                {
                  type: 'doc',
                  id: 'optimal-parking/part-5',
                },
                {
                  type: 'doc',
                  id: 'optimal-parking/part-6',
                },
                {
                  type: 'doc',
                  id: 'optimal-parking/summary',
                  key: 'optimal-parking-series-summary',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Convex MPC',
          collapsed: true,
          items: [
            'convex-mpc',
            {
              type: 'category',
              label: 'Foundations and Theory',
              items: [
                {
                  type: 'doc',
                  id: 'convex-mpc/part-1',
                },
                {
                  type: 'doc',
                  id: 'convex-mpc/part-2',
                },
                {
                  type: 'doc',
                  id: 'convex-mpc/part-3',
                },
              ],
            },
            {
              type: 'category',
              label: 'Implementation and Practice',
              items: [
                {
                  type: 'doc',
                  id: 'convex-mpc/part-4',
                },
                {
                  type: 'doc',
                  id: 'convex-mpc/part-5',
                },
              ],
            },
            {
              type: 'doc',
              id: 'convex-mpc/summary',
            },
            {
              type: 'doc',
              id: 'convex-mpc/wasm',
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
