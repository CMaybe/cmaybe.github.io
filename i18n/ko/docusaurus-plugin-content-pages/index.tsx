import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from '../../../src/pages/index.module.css';

const projects = [
    {
        title: 'Modern Robotics WASM',
        detail: '브라우저에서 순기구학, 역기구학, 궤적, 동역학을 실행하는 데모입니다.',
        href: 'https://github.com/CMaybe/modern-robotics-wasm',
    },
    {
        title: 'Optimal Parking',
        detail: '자율주차를 위한 RRT*와 궤적 최적화 프로젝트입니다.',
        href: 'https://cmaybe.github.io/Optimal-Parking/',
    },
    {
        title: 'MPC-Driving',
        detail: '자율주행과 궤적 추종을 위한 모델 예측 제어 프로젝트입니다.',
        href: 'https://github.com/CMaybe/MPC-Driving',
    },
    {
        title: 'Convex MPC',
        detail: '동적 보행과 로봇 운동을 위한 최적화 기반 제어 프로젝트입니다.',
        href: 'https://github.com/CMaybe/Convex-MPC',
    },
];

export default function Home(): ReactNode {
    return (
        <Layout
            title="Jaegyeom Kim"
            description="계획, 제어, 자율 시스템을 연구하는 로보틱스 소프트웨어 엔지니어입니다.">
            <main className={styles.page}>
                <header className={styles.header}>
                    <p className={styles.kicker}>Robotics / Planning / Control</p>
                    <h1>Jaegyeom Kim</h1>
                    <p className={styles.intro}>
                        제어, 최적화, 자율 운동을 다루는 로보틱스 소프트웨어 엔지니어입니다.
                    </p>
                    <nav className={styles.nav} aria-label="주요 메뉴">
                        <Link to="/notes/intro">노트</Link>
                        <Link to="/blog">Posts</Link>
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
