import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const projects = [
  {
    title: 'Modern Robotics WASM',
    detail: 'Forward and inverse kinematics, trajectories, and dynamics in the browser.',
    href: 'https://github.com/CMaybe/modern-robotics-wasm',
  },
  {
    title: 'Optimal Parking',
    detail: 'RRT* and trajectory optimization for autonomous parking.',
    href: 'https://cmaybe.github.io/Optimal-Parking/',
  },
  {
    title: 'MPC-Driving',
    detail: 'Model predictive control for autonomous driving and trajectory following.',
    href: 'https://github.com/CMaybe/MPC-Driving',
  },
  {
    title: 'Convex MPC',
    detail: 'Optimization-based control for dynamic locomotion and robotic motion.',
    href: 'https://github.com/CMaybe/Convex-MPC',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Jaegyeom Kim"
      description="Robotics software engineer working on planning, control, and autonomous systems.">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>Robotics / Planning / Control</p>
          <h1>Jaegyeom Kim</h1>
          <p className={styles.intro}>
            Robotics software engineer working on control, optimization, and autonomous motion.
          </p>
          <nav className={styles.nav} aria-label="Primary navigation">
            <Link to="/notes/intro">Notes</Link>
            <Link to="/blog">Posting</Link>
            <a href="https://github.com/CMaybe">GitHub</a>
          </nav>
        </header>

        <section className={styles.projects} aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.title}>
                <a href={project.href}>
                  <span className={styles.projectTitle}>{project.title}</span>
                  <span className={styles.projectDetail}>{project.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
