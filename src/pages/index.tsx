import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const projects = [
  {
    title: 'Modern Robotics WASM',
    detail: 'Interactive FK, IK, planning, and dynamics in the browser.',
    tags: 'C++ / WebAssembly / Three.js',
    href: 'https://github.com/CMaybe/modern-robotics-wasm',
    featured: true,
  },
  {
    title: 'Optimal Parking',
    detail: 'RRT* and trajectory optimization for autonomous parking.',
    tags: 'Motion Planning / SQP / C++',
    href: 'https://github.com/CMaybe/Optimal-Parking',
  },
  {
    title: 'MPCC',
    detail: 'Model Predictive Contouring Control for autonomous racing.',
    tags: 'MPC / Optimal Control / C++',
    href: 'https://github.com/CMaybe/MPCC',
  },
  {
    title: 'Convex MPC',
    detail: 'Convex model predictive control for legged robots.',
    tags: 'Legged Robotics / MPC / C++',
    href: 'https://github.com/CMaybe/Convex-MPC',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Robotics Software Engineer"
      description="Notes and projects on robotics, planning, control, and real-time systems.">
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>JAEGYEOM KIM / ROBOTICS SOFTWARE ENGINEER</p>
              <h1>Algorithms that make robots move with intent.</h1>
              <p className={styles.intro}>
                I build control, motion-planning, and optimization software that carries ideas from
                equations to reliable machines.
              </p>
              <div className={styles.actions}>
                <Link className={styles.primaryAction} to="/blog">
                  Read field notes
                </Link>
                <a className={styles.secondaryAction} href="https://github.com/CMaybe">
                  Explore GitHub
                </a>
              </div>
              <dl className={styles.focusList}>
                <div>
                  <dt>01</dt>
                  <dd>Motion planning</dd>
                </div>
                <div>
                  <dt>02</dt>
                  <dd>MPC and optimal control</dd>
                </div>
                <div>
                  <dt>03</dt>
                  <dd>Real-time robot systems</dd>
                </div>
              </dl>
            </div>
            <a
              className={styles.demoVisual}
              href="https://cmaybe.github.io/modern-robotics-wasm/"
              aria-label="Open the Modern Robotics WASM demo">
              <img
                src="https://raw.githubusercontent.com/CMaybe/modern-robotics-wasm/main/docs/demo-preview.jpg"
                alt="Modern Robotics WebGL robot arm viewer"
              />
              <span className={styles.demoLabel}>Live interactive demo</span>
              <span className={styles.demoCaption}>Modern Robotics WASM</span>
            </a>
          </div>
        </section>

        <section className={styles.projects}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>SELECTED WORK</p>
            <h2>Control systems with a point of view.</h2>
            <a href="https://github.com/CMaybe">All repositories</a>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <a
                className={`${styles.project} ${project.featured ? styles.featuredProject : ''}`}
                href={project.href}
                key={project.title}>
                <p>{project.tags}</p>
                <h3>{project.title}</h3>
                <span>{project.detail}</span>
                <strong>View source</strong>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.writing}>
          <p className={styles.kicker}>THE NOTEBOOK</p>
          <h2>Working notes on the systems behind the motion.</h2>
          <p>
            Build logs, derivations, implementation decisions, and lessons from robotics software.
          </p>
          <Link className={styles.writingLink} to="/blog">
            Browse the blog
          </Link>
        </section>
      </main>
    </Layout>
  );
}
