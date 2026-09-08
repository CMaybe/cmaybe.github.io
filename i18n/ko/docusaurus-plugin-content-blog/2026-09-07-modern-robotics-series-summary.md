---
slug: modern-robotics-series-summary
title: Modern Robotics 시리즈 정리 - Geometry, Control, Planning
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: Modern Robotics 시리즈 전체를 강체 운동, screw theory, Jacobian, 역기구학, 동역학, 모션 플래닝의 흐름으로 정리합니다.
---

Modern Robotics는 로봇의 운동을 단순한 관절 각도의 나열이 아니라, 공간에서 일어나는 강체의 연속적인 변환으로 이해합니다. 이 글은 시리즈 전체의 개념 지도를 제공합니다.

<!-- truncate -->

## 핵심 흐름

로봇 끝단의 자세는 $SE(3)$ 위의 강체 변환으로 표현됩니다. 그 순간 운동은 twist와 screw axis로, 유한한 운동은 exponential map으로 표현할 수 있습니다.

$$
T(\theta) = e^{\hat{\mathcal{S}}\theta}
$$

Jacobian은 관절 속도와 작업 공간 속도를 연결합니다.

$$
\nu = J(\theta)\dot{\theta}
$$

이를 바탕으로 속도 제어와 역기구학을 풀고, 동역학과 궤적 생성으로 확장합니다.

$$
M(\theta)\ddot{\theta} + C(\theta, \dot{\theta})\dot{\theta} + g(\theta) = \tau
$$

## 시리즈 순서

- Part 1: 강체 운동과 Product of Exponentials
- Part 2A: Screw axis, twist, exponential map
- Part 2B: 좌표계, Lie group, Jacobian의 연결
- Part 3-5: Jacobian, manipulability, 역기구학
- Part 6A-6B: 동역학, 제어, 궤적, 모션 플래닝

영문 원문과 한국어 번역은 같은 URL 구조를 유지합니다. 번역이 완료되는 순서대로 각 언어 페이지를 확장합니다.