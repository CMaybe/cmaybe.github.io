---
title: Optimal Parking, Part 4 - Sequential Quadratic Programming
authors: [jaegyeom]
tags: [robotics, trajectory-optimization, optimal-control, optimal-parking]
description: OSQP로 푸는 sequential quadratic program을 통해 초기 경로를 개선하는 과정을 설명합니다.
---

RRT*는 경로를 제공하지만 곧바로 부드러운 제어 시퀀스를 만들지는 않습니다. 다음 단계에서는 상태 시퀀스 $x_0, \ldots, x_N$과 입력 시퀀스 $u_0, \ldots, u_{N-1}$에 대해 궤적 최적화 문제를 풉니다.

<!-- truncate -->

## 1. 비선형 최적화 문제

최적화기는 여러 목표 사이의 균형을 맞춥니다.

- 종단 자세에 도달하기
- 차량 동역학을 따르기
- 장애물 피하기
- 속도와 조향을 범위 안에 유지하기
- 불필요하게 큰 입력을 피하기

대표적인 목적 함수는 다음과 같습니다.

$$
J = \sum_{k=0}^{N-1} \left(\lVert x_k - x_k^{ref} \rVert_Q^2 + \lVert u_k \rVert_R^2\right)
+ \rho_g \lVert x_N - x_{goal} \rVert^2
+ \rho_o C_{obs}(x).
$$

정확한 가중치는 추종 성능, 부드러움, 종단 정확도, 장애물 여유 거리를 얼마나 중요하게 여길지 결정합니다.

## 2. 현재 궤적 주변에서 선형화하기

자전거 모델은 $\sin\psi$, $\cos\psi$, $\tan\delta$를 포함하므로 비선형입니다. 현재 반복점 $(\bar{x}_k, \bar{u}_k)$ 주변에서 동역학을 다음과 같이 근사합니다.

$$
\Delta x_{k+1} \approx A_k\Delta x_k + B_k\Delta u_k + r_k.
$$

여기서 $A_k$와 $B_k$는 국소 Jacobian이고, $r_k$는 선형화 잔차를 나타냅니다. 이 근사를 사용하면 국소 하위 문제를 quadratic program으로 바꿀 수 있습니다.

## 3. 순차 반복 과정

한 번의 최적화 반복은 다음 순서로 진행됩니다.

1. 현재 궤적 주변에서 동역학과 장애물 제약을 선형화합니다.
2. quadratic objective와 범위를 구성합니다.
3. OSQP로 QP를 풉니다.
4. 상태와 입력을 업데이트합니다.
5. 비선형 궤적과 잔차를 다시 계산합니다.
6. 반복 제한이나 수렴 조건에 도달할 때까지 반복합니다.

이것이 SQP-like 동작입니다. 각 QP는 원래의 비선형 문제보다 풀기 쉽고, 반복적인 재선형화를 통해 해가 실행 가능한 궤적에 가까워집니다.

## 4. QP solver가 유용한 이유

Quadratic programming은 국소 문제를 명시적이고 계산 가능한 형태로 만듭니다. OSQP는 희소 quadratic objective와 선형 제약을 처리하고, 반복 횟수와 수렴 정보를 플래너에 제공합니다.

이 방법은 국소적이므로 RRT* 초기값이 여전히 중요합니다. 좋은 초기값은 일련의 QP가 따라갈 수 있는 경로의 위상 구조를 제공하고, 최적화기는 부드러움, 범위, 국소 기하에 집중할 수 있습니다.
