---
slug: modern-robotics-series-summary
title: Modern Robotics 시리즈 정리 — From Geometry to Control and Planning
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: A compact summary of the full Modern Robotics series, connecting rigid-body motion, screw theory, Jacobians, inverse kinematics, dynamics, and motion planning into one coherent picture.
---

이 시리즈는 로봇의 운동을 단순히 "각도들의 나열"로 보는 관점을 넘어서, 움직임 자체를 기하학적으로 이해하려는 시도였습니다. 핵심은 로봇이 움직이는 방식이 단순히 조인트 값의 변화가 아니라, rigid body motion의 연속적 변환이라는 점입니다.

이제 전체 흐름을 한 번에 정리해보면, Modern Robotics는 다음과 같은 구조를 가지고 있습니다.

<!-- truncate -->

## 1. 시작: 왜 로봇 운동은 좌표계만으로 충분하지 않은가?

로봇의 자세는 단순히 $q = [q_1, \ldots, q_n]^T$ 라고 생각하면 편하지만, 실제로는 end-effector의 pose가 rigid-body transform

$$
T \in SE(3)
$$

으로 표현됩니다. 여기서 $SE(3)$는 3D 공간에서 회전과 병진을 함께 포함한 rigid-body transformation group입니다.

이 관점은 매우 중요합니다. 왜냐하면 로봇의 끝단이 움직이는 것을 "각도 변화"만으로 설명하는 것이 아니라, 하나의 rigid body의 전체 운동으로 이해해야 하기 때문입니다.

그래서 첫 단계는 로봇을 단순한 링크 조립물이 아니라, 공간에서 움직이는 rigid body의 연속적 변환으로 바라보는 것입니다.

관련 글:

- [Modern Robotics, Part 1 — Rigid-Body Motion and the Product of Exponentials](/blog/modern-robotics-part-1)

## 2. 기본 단위: twist와 screw axis

다음 단계는 infinitesimal motion입니다. 아주 짧은 시간 동안 rigid body가 어떻게 움직이는지를 설명하는 것이 twist입니다.

$$
\xi = \begin{bmatrix}
\omega \\\ v
\end{bmatrix}
$$

여기서 $\omega$는 angular velocity, $v$는 linear velocity입니다. 즉, twist는 rigid-body motion의 순간 속도를 압축적으로 표현한 객체입니다.

이 twist는 회전 축과 병진 축이 결합된 screw axis의 형태로도 표현됩니다.

$$
\mathcal{S} = \begin{bmatrix}
\omega \\\n-\omega \times q
\end{bmatrix}
$$

이것이 왜 중요한가 하면, 각 조인트가 단지 각도를 변화시키는 것이 아니라, 공간의 특정 축을 따라 rigid-body motion을 발생시키기 때문입니다.

즉, 조인트는 scalar variable이 아니라 motion generator입니다.

관련 글:

- [Modern Robotics, Part 2A — Screw Axes, Twists, and the Exponential Map](/blog/modern-robotics-part-2)
- [Modern Robotics, Part 2B — Frames, Lie Groups, and the Jacobian Bridge](/blog/modern-robotics-part-2b)

## 3. 유한 운동: exponential map

짧은 운동을 넘어서 유한한 움직임을 설명해야 합니다. 이때 필요한 것이 exponential map입니다.

$$
T(\theta) = e^{\hat{\mathcal{S}}\theta}
$$

이 식은 많은 로봇공학적 아이디어의 핵심입니다.

- infinitesimal motion generator $\hat{\mathcal{S}}$가 있고,
- 조인트 값 $\theta$가 주어지면,
- 최종 변환 $T$가 exponentiation으로 얻어진다.

이것이 바로 Product of Exponentials(POE)의 핵심 아이디어입니다. 로봇의 전체 pose는 각 조인트의 screw motion를 곱해가며 만들어집니다.

즉, 로봇의 자세는 단순히 좌표계의 연산이 아니라, joint motion generators의 조합으로 이해됩니다.

## 4. Jacobian: joint rate에서 task-space velocity로

이제 가장 중요한 연결고리가 등장합니다. 조인트 속도 $\dot{\theta}$가 주어졌을 때, end-effector의 twist는

$$
\nu = J(\theta)\dot{\theta}
$$

로 표현됩니다. 여기서 $J(\theta)$는 Jacobian입니다.

핵심은 Jacobian이 단지 행렬이 아니라, 조인트 속도와 end-effector 속도를 연결하는 기하학적 mapping이라는 점입니다.

Jacobian의 열벡터들은 각 조인트가 만드는 screw axis입니다. 따라서 Jacobian은 로봇의 기하학적 운동 방향을 모두 모아놓은 객체입니다.

이 관점 덕분에 우리는 다음을 모두 이해할 수 있습니다.

- 속도 제어
- manipulability
- singularity
- velocity tracking

관련 글:

- [Modern Robotics, Part 3 — Jacobians and End-Effector Velocity](/blog/modern-robotics-part-3)
- [Modern Robotics, Part 4 — Manipulability and Velocity Control](/blog/modern-robotics-part-4)

## 5. 역기구학: 목표 pose를 만족하는 joint 값 찾기

로봇이 어떤 pose를 달성하려면, inverse kinematics를 풀어야 합니다.

$$
T_{se}(\theta) = T_d
$$

이 문제는 보통 nonlinear이고, 경우에 따라 analytic 또는 numerical solution이 필요합니다.

대표적인 방법은 Jacobian-based iterative method입니다.

$$
J(\theta)\Delta\theta = \nu_e
$$

그리고 이를 반복적으로 갱신하는 방식입니다. 이 과정은 로봇의 pose를 점점 목표에 근접시키는 local linearization입니다.

특히 redundant manipulator에서는 pseudoinverse를 쓸 수 있습니다.

$$
\dot{\theta} = J^{\dagger}\nu_d
$$

다음과 같이 nullspace까지 고려해 secondary objective를 달성할 수도 있습니다.

$$
\dot{\theta} = J^{\dagger}\nu_d + (I - J^{\dagger}J)\dot{\theta}_0
$$

이것은 로봇이 목표 task를 유지하면서도 내부 구조를 더 좋게 조정할 수 있게 해줍니다.

관련 글:

- [Modern Robotics, Part 5 — Inverse Kinematics and Numerical Solvers](/blog/modern-robotics-part-5)

## 6. 동역학과 궤적 생성: 실제 로봇은 단순히 pose를 맞추는 것만 하지 않는다

로봇은 목표 위치에 도달하는 것만으로 끝나지 않습니다. 실제로는 부드럽게 움직여야 하고, 가속도 제한, 관성, 중력, 충돌 회피, 시간 제약을 모두 만족해야 합니다.

동역학은

$$
M(\theta)\ddot{\theta} + C(\theta,\dot{\theta})\dot{\theta} + g(\theta) = \tau
$$

와 같은 형태로 표현됩니다.

또한, Jacobian은 task-space force와 joint torque의 관계도 제공해 줍니다.

$$
\tau = J(\theta)^T F
$$

즉, task-space에서의 힘과 로봇의 joint torque 사이를 연결해 줍니다.

궤적 생성은 단순히 목표 pose를 찍는 것이 아니라, 부드러운 motion profile을 설계하는 문제입니다. trajectory는 pose, velocity, acceleration 제한을 함께 만족해야 하며, motion planning은 실제 환경에서 collision-free한 경로를 찾아내는 과정입니다.

관련 글:

- [Modern Robotics, Part 6A — Dynamics, Control, and Motion Generation](/blog/modern-robotics-part-6)
- [Modern Robotics, Part 6B — Trajectories, Constraints, and Motion Planning](/blog/modern-robotics-part-6b)

## 7. 전체 흐름을 하나의 공식으로 묶으면

이 시리즈의 핵심은 결국 다음 구조로 정리됩니다.

$$
T_{se}(\theta) \in SE(3)
$$

$$
\xi \in se(3)
$$

$$
T = e^{\hat{\mathcal{S}}\theta}
$$

$$
\nu = J(\theta)\dot{\theta}
$$

$$
T_{se}(\theta) = T_d
$$

$$
M(\theta)\ddot{\theta} + C(\theta,\dot{\theta})\dot{\theta} + g(\theta) = \tau
$$

이 수식들은 로봇 공학의 큰 흐름을 연결합니다.

- 기하학: rigid-body motion
- 미분기하: twists and screw axes
- 동역학: inertia and torque
- 제어: Jacobian 기반 속도 제어
- 계획: feasible trajectory and collision avoidance

## 8. 결론: Modern Robotics의 핵심 메시지

Modern Robotics의 가장 큰 아이디어는 단순히 공식들만이 아니라, 로봇 움직임을 구조적으로 이해하는 방식에 있습니다.

로봇은 단순한 엔진이 아니라, rigid body의 연속적인 운동을 조합해 만드는 시스템입니다. 그리고 그 운동은 다음 핵심 개념들로 압축됩니다.

- rigid transform
- twist
- screw axis
- exponential map
- Jacobian
- inverse kinematics
- dynamics
- motion planning

이 전체 흐름을 이해하면, 로봇 공학은 단순히 "코드로 움직임을 구현하는 것"이 아니라, "기하학적 구조를 통해 움직임을 설계하는 학문"으로 보이게 됩니다.

이 시리즈는 그 첫걸음이자 전체 그림을 정리하는 장이었습니다.

다음 단계로는, 이 수학적 구조를 실제 로봇 소프트웨어나 제어 코드와 연결해 보는 내용을 이어갈 수도 있습니다. 로봇에는 여전히 많은 디테일이 남아 있지만, 그 디테일은 모두 이 기초 구조 위에서 이해할 수 있습니다.
