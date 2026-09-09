---
title: Optimal Parking 시리즈 요약 - 샘플링에서 최적화 궤적까지
authors: [jaegyeom]
tags: [robotics, autonomous-driving, motion-planning, trajectory-optimization]
description: 운동학적 자전거 모델과 RRT* 초기 경로부터 순차 QP 개선과 브라우저 실행까지 Optimal Parking 플래너를 요약합니다.
---

Optimal Parking은 서로 다른 두 가지 추론을 결합합니다. RRT*는 자유 공간을 통과하는 경로를 탐색하고, 궤적 최적화는 그 경로를 차량 모델과 수치 제약을 만족하는 부드러운 시퀀스로 바꿉니다.

<!-- truncate -->

## 전체 흐름

플래너는 다음 처리 과정으로 이해할 수 있습니다.

$$
\text{scenario}
\rightarrow \text{kinematic model}
\rightarrow \text{RRT* path}
\rightarrow \text{state/input seed}
\rightarrow \text{linearized QPs}
\rightarrow \text{parking trajectory}.
$$

시나리오는 pose, 차량 크기, 장애물, 시간 설정, 범위, 가중치를 제공합니다. 모델은 어떤 운동이 가능한지 정의합니다. RRT*는 충돌을 고려한 경로의 위상 구조를 제공하고, 최적화기는 그 경로를 국소적으로 개선합니다.

## 핵심 방정식

차량의 상태와 입력은 다음과 같습니다.

$$
x = [p_x, p_y, \psi, v, \delta]^T, \qquad u = [a, \dot{\delta}]^T.
$$

비선형 모델은 다음과 같이 이산화합니다.

$$
x_{k+1} = f(x_k, u_k).
$$

현재 궤적 주변에서 각 SQP 반복은 다음 국소 근사를 사용합니다.

$$
\Delta x_{k+1} \approx A_k\Delta x_k + B_k\Delta u_k + r_k.
$$

QP는 종단 정확도, 기준 경로 추종, 제어 입력, 모델 일관성, 장애물 회피 사이의 균형을 맞춥니다.

## 각 계층의 역할

- **자전거 모델**은 차량이 임의의 방향으로 옆으로 움직이지 못하게 합니다.
- **RRT***는 직접 보간이 막힌 상황에서 경로를 제공합니다.
- **SQP와 QP solver**는 경로를 부드럽게 만들고 국소 제약을 적용합니다.
- **범위와 패널티**는 차량이 안전하게 실행할 수 있는 조건을 표현합니다.
- **WebAssembly**는 같은 플래너를 인터랙티브 브라우저에서 확인하게 합니다.

핵심 설계는 역할 분담입니다. 샘플링은 전역 경로 탐색을 담당하고, 국소 최적화는 연속적인 개선을 담당합니다. 어느 한 계층이 전체 문제를 혼자 해결할 필요는 없습니다.

## 권장 읽기 순서

Part 1과 Part 2에서 모델과 초기 경로를 먼저 이해합니다. Part 3과 Part 4에서는 수치적 개선 과정을 설명하고, Part 5와 Part 6에서 feasibility와 구현으로 확장합니다.

- [Part 1 - 문제 정의와 Kinematic Bicycle Model](/ko/notes/optimal-parking/part-1)
- [Part 2 - 초기 경로 플래너로서의 RRT*](/ko/notes/optimal-parking/part-2)
- [Part 3 - 최적제어와 궤적 최적화](/ko/notes/optimal-parking/part-3)
- [Part 4 - Sequential Quadratic Programming](/ko/notes/optimal-parking/part-4)
- [Part 5 - 장애물, 범위, Feasibility](/ko/notes/optimal-parking/part-5)
- [Part 6 - C++ 구조와 WebAssembly 데모](/ko/notes/optimal-parking/part-6)
