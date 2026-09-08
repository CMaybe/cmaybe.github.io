import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from '../../../src/pages/index.module.css';

const projects = [
  {
    title: 'Modern Robotics WASM',
    detail: '브라우저에서 동작하는 순기구학, 역기구학, 궤적 생성, 동역학 데모입니다.',
    tags: 'WebAssembly • C++ • Three.js',
    href: 'https://github.com/CMaybe/modern-robotics-wasm',
    featured: true,
  },
  {
    title: 'Optimal Parking',
    detail: '좁은 환경에서의 자율주차를 위한 RRT*와 궤적 최적화 프로젝트입니다.',
    tags: 'Motion Planning • Optimization • C++',
    href: 'https://github.com/CMaybe/Optimal-Parking',
  },
  {
    title: 'MPC-Driving',
    detail: '자율주행 차량의 궤적 추종을 위한 모델 예측 제어 프로젝트입니다.',
    tags: 'MPC • Optimal Control • C++',
    href: 'https://github.com/CMaybe/MPC-Driving',
  },
  {
    title: 'Convex MPC',
    detail: '동적 보행과 실시간 로봇 운동을 위한 최적화 기반 제어 프로젝트입니다.',
    tags: 'Legged Robotics • MPC • C++',
    href: 'https://github.com/CMaybe/Convex-MPC',
  },
];

const interests = [
  '분산 로봇 시스템',
  '모션 플래닝',
  '모델 예측 제어',
  '자율주행',
  '최적화',
  '로보틱스 소프트웨어',
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/CMaybe' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/Jaegyeom-kim-185b8a2a4/' },
  { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/cmaybe' },
  { label: '로보틱스 노트', href: '/notes/intro' },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Jaegyeom Kim"
      description="계획, 제어, 자율 시스템을 연구하는 로보틱스 소프트웨어 엔지니어 포트폴리오입니다.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>Robotics / Planning / Control</p>
              <h1>Jaegyeom Kim</h1>
              <p className={styles.subtitle}>
                제어, 최적화, 자율 운동을 탐구하는 로보틱스 소프트웨어 엔지니어입니다.
              </p>
              <p className={styles.intro}>
                궤적 생성, 모델 예측 제어, 자율 기계를 위한 실시간 로보틱스 소프트웨어를 통해
                이론과 구현을 연결하는 시스템을 만듭니다.
              </p>
              <div className={styles.actions}>
                <a className={styles.primaryAction} href="https://github.com/CMaybe">
                  프로젝트 보기
                </a>
                <Link className={styles.secondaryAction} to="/notes/intro">
                  노트 읽기
                </Link>
              </div>
            </div>
            <aside className={styles.infoPanel}>
              <div className={styles.panelHeader}>
                <img className={styles.avatar} src="/img/profile-bird.jpg" alt="프로필 일러스트" />
                <div>
                  <p className={styles.name}>Jaegyeom Kim</p>
                  <span className={styles.role}>Robotics &amp; Controls</span>
                </div>
              </div>
              <p className={styles.panelText}>
                수학, 실시간 소프트웨어, 그리고 물리적 지능이 만나는 지점에 관심이 있습니다.
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
            <p className={styles.kicker}>소개</p>
            <h2>목적을 갖고 움직이는 시스템에 집중합니다.</h2>
          </div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p>
                궤적 최적화, 로봇 기구학과 동역학, 자율 운동을 위한 임베디드 제어 시스템을 다룹니다.
                불확실성, 제약 조건, 실제 시스템의 시간 제약 아래에서 알고리즘이 어떻게 동작하는지에
                관심이 있습니다.
              </p>
              <p>
                수학적으로 탄탄하고, 배포 환경에서 견고하며, 유지보수하는 엔지니어가 이해할 수 있는
                실용적인 소프트웨어를 만드는 것이 목표입니다.
              </p>
            </div>
            <div className={styles.statList}>
              <div><strong>01</strong><span>최적화 기반 모션 플래닝</span></div>
              <div><strong>02</strong><span>자율주행 제어</span></div>
              <div><strong>03</strong><span>실시간 로보틱스 소프트웨어</span></div>
            </div>
          </div>
        </section>
        <section className={styles.projects}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>주요 작업</p>
            <h2>최근 프로젝트와 연구입니다.</h2>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <a className={`${styles.projectCard} ${project.featured ? styles.featured : ''}`} href={project.href} key={project.title}>
                <p>{project.tags}</p><h3>{project.title}</h3><span>{project.detail}</span><strong>프로젝트 보기</strong>
              </a>
            ))}
          </div>
        </section>
        <section className={styles.follow}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>연결</p>
            <h2>연구, 코드, 그리고 노트.</h2>
          </div>
          <div className={styles.linkRow}>
            {socialLinks.map((link) =>
              link.href.startsWith('http') ? <a key={link.label} href={link.href}>{link.label}</a> : <Link key={link.label} to={link.href}>{link.label}</Link>,
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}