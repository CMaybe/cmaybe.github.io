import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const projects = [
  {
    title: 'Modern Robotics WASM',
    detail: 'Interactive forward/inverse kinematics, trajectory generation, and dynamics in the browser.',
    tags: 'WebAssembly • C++ • Three.js',
    href: 'https://github.com/CMaybe/modern-robotics-wasm',
    featured: true,
  },
  {
    title: 'Optimal Parking',
    detail: 'RRT* and trajectory optimization for autonomous parking in constrained environments.',
    tags: 'Motion Planning • Optimization • C++',
    href: 'https://github.com/CMaybe/Optimal-Parking',
  },
  {
    title: 'MPC-Driving',
    detail: 'Model predictive control for autonomous driving and trajectory following.',
    tags: 'MPC • Optimal Control • C++',
    href: 'https://github.com/CMaybe/MPC-Driving',
  },
  {
    title: 'Convex MPC',
    detail: 'Optimization-based control for dynamic locomotion and real-time robotic motion.',
    tags: 'Legged Robotics • MPC • C++',
    href: 'https://github.com/CMaybe/Convex-MPC',
  },
];

const interests = [
  'Distributed robot systems',
  'Motion planning',
  'Model predictive control',
  'Autonomous vehicles',
  'Optimization',
  'Robotics software',
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/CMaybe' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/Jaegyeom-kim-185b8a2a4/' },
  { label: 'Blog', href: '/blog' },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Jaegyeom Kim"
      description="Robotics software engineer portfolio focused on planning, control, and autonomous systems.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>Robotics / Planning / Control</p>
              <h1>Jaegyeom Kim</h1>
              <p className={styles.subtitle}>
                Robotics software engineer exploring control, optimization, and autonomous motion.
              </p>

              <p className={styles.intro}>
                I build systems that connect theory and implementation: trajectory generation,
                model predictive control, and real-time robotic software for autonomous machines.
              </p>

              <div className={styles.actions}>
                <a className={styles.primaryAction} href="https://github.com/CMaybe">
                  View Projects
                </a>
                <Link className={styles.secondaryAction} to="/blog">
                  Read Notes
                </Link>
              </div>
            </div>

            <aside className={styles.infoPanel}>
              <div className={styles.panelHeader}>
                <img
                  className={styles.avatar}
                  src="/img/profile-bird.jpg"
                  alt="Profile illustration"
                />
                <div>
                  <p className={styles.name}>Jaegyeom Kim</p>
                  <span className={styles.role}>Robotics &amp; Controls</span>
                </div>
              </div>

              <p className={styles.panelText}>
                Interested in the intersection of mathematics, real-time software, and embodied
                intelligence.
              </p>

              <div className={styles.chipList}>
                {interests.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>About</p>
            <h2>Focused on systems that move with intent.</h2>
          </div>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p>
                My work spans trajectory optimization, robot kinematics and dynamics, and embedded
                control systems for autonomous motion. I care about how algorithms behave under
                uncertainty, constraints, and real-world timing.
              </p>
              <p>
                I aim to build practical software that is mathematically grounded, robust in
                deployment, and understandable to the engineers who maintain it.
              </p>
            </div>

            <div className={styles.statList}>
              <div>
                <strong>01</strong>
                <span>Optimization-based planning</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Autonomous vehicle control</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Realtime robotics software</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.projects}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Selected work</p>
            <h2>Recent projects and research.</h2>
          </div>

          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <a
                className={`${styles.projectCard} ${project.featured ? styles.featured : ''}`}
                href={project.href}
                key={project.title}>
                <p>{project.tags}</p>
                <h3>{project.title}</h3>
                <span>{project.detail}</span>
                <strong>View project</strong>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.follow}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Follow</p>
            <h2>Research, code, and notes.</h2>
          </div>

          <div className={styles.linkRow}>
            {socialLinks.map((link) =>
              link.href.startsWith('http') ? (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
