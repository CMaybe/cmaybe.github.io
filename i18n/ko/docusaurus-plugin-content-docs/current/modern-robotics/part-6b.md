---
title: Modern Robotics, Part 6B — Trajectory, 제약, 그리고 Motion Planning
authors: [endi]
tags: [robotics, modern-robotics, kinematics, motion-planning]
description: 기구학에서 planning으로 이어지는 흐름을 계속 살펴보며 trajectory 생성, time scaling, 제약, 그리고 motion planning 뒤의 기하를 다룹니다.
---

앞선 글에서는 동역학과 제어 관점을 정립했습니다. 로봇 운동은 geometry뿐 아니라 inertia, gravity, force transmission, task-space control에 의해서도 결정됩니다. 하지만 실제로 로봇은 한 configuration에서 다른 configuration으로 부드럽고 실현 가능하며 안전한 방식으로 이동해야 합니다.

이것이 trajectory와 planning 문제입니다.

<!-- truncate -->

## 1. Path는 trajectory와 다르다

Path는 configuration space 또는 task space에 있는 기하학적 곡선입니다. Trajectory는 여기에 timing을 더한 path입니다.

예를 들어 path는 "pose A에서 pose B로 직선으로 이동한다"일 수 있지만, trajectory는 다음도 지정해야 합니다.

- 로봇이 언제 시작하는지,
- 얼마나 빠르게 움직이는지,
- 언제 감속하는지,
- acceleration이 limit 안에 있는지입니다.

시간을 고려하지 않고 path를 따라갈 수는 없습니다. 그렇지 않으면 기하학적으로는 맞지만 동역학적으로는 불가능한 명령을 만들 수 있습니다.

그래서 trajectory generation은 기구학과 실행 사이의 필수 단계입니다.

## 2. Time scaling의 역할

Path를 arc length나 path parameter를 나타내는 scalar $s$로 매개화한다고 합시다. 그러면 그 경로를 따른 로봇 운동은 time law로 정해집니다.

$$
s = s(t).
$$

Joint trajectory는

$$
q(t) = q(s(t)).
$$

가 됩니다. 미분하면

$$
\dot{q}(t) = \frac{dq}{ds}\dot{s},
$$

그리고

$$
\ddot{q}(t) = \frac{d^2 q}{ds^2}\dot{s}^2 + \frac{dq}{ds}\ddot{s}.
$$

입니다.

이 분해는 다음을 나눠 생각할 수 있게 하므로 유용합니다.

- 기하학적 path shape $q(s)$,
- timing law $s(t)$입니다.

Timing law는 운동이 velocity와 acceleration bound를 만족하는지 결정합니다. 이 분리는 motion planning과 trajectory generation에서 가장 중요한 개념 중 하나입니다.

## 3. Polynomial trajectory

부드러운 trajectory를 만드는 흔한 방법은 polynomial interpolation입니다. 가장 간단한 예는 cubic polynomial입니다.

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3.
$$

계수는 initial position, final position, initial/final velocity 같은 boundary condition을 맞추도록 선택합니다.

더 높은 smoothness가 필요하면 quintic polynomial을 사용합니다.

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5.
$$

이를 사용하면 끝점에서 position과 velocity 제약을 만족하고, 어떤 정식화에서는 acceleration 제약도 만족할 수 있습니다.

이는 로봇이 운동을 갑자기 바꾸지 않아야 하기 때문에 중요합니다. 부드러운 interpolation은 jerk, vibration, wear를 줄이고 controller를 안정화하기도 쉽게 합니다.

## 4. Dynamics가 trajectory 선택에 영향을 주는 이유

기하학적으로 path를 만들 수 있어도 로봇이 원하는 속도로 이를 실행할 수 있다는 뜻은 아닙니다.

동역학 방정식

$$
M(q)\ddot{q} + C(q,\dot{q})\dot{q} + g(q) = \tau
$$

은 어떤 운동이 실현 가능한지 제약합니다.

다시 말해 path가 기구학적으로 도달 가능해도 actuator limit 아래에서는 동역학적으로 불가능할 수 있습니다. 이는 고속 manipulation과 무거운 payload 운반에서 특히 중요합니다.

그래서 trajectory generation은 기하학만의 문제가 아닙니다. 동시에 dynamics와 control의 문제입니다.

## 5. Configuration space와 obstacle avoidance

Motion planning은 근본적으로 configuration space에서 실현 가능한 path를 찾는 일입니다.

Configuration space는 모든 joint configuration의 집합입니다. Configuration은 다음을 만족하면 유효합니다.

- joint limit를 만족하고,
- collision을 피하며,
- feasible motion envelope 안에 있어야 합니다.

이 mapping은 "세계의 장애물을 피하라"는 기하학적 문제를 고차원 state space에서의 search 문제로 바꿉니다.

관절이 많으면 configuration space는 크고 복잡해질 수 있습니다. 정확한 planning이 어려운 이유이며 sampling-based method가 유용해지는 이유입니다.

## 6. Sampling-based planning

대표적인 두 sampling-based planner는 다음과 같습니다.

- PRM (Probabilistic Roadmap)
- RRT (Rapidly-exploring Random Tree)

이 방법들은 유효한 configuration의 graph 또는 tree를 만들고, feasibility를 확인하면서 가까운 sample을 연결합니다.

Configuration space가 고차원이고 장애물이 복잡할 때 특히 유용합니다. 이런 상황에서는 analytic planning이 실현 불가능한 경우가 많습니다.

아이디어는 단순하지만 강력합니다.

- 임의의 configuration을 sampling합니다.
- 유효한 sample만 남깁니다.
- 이들을 graph로 연결합니다.
- 목표까지의 path를 search합니다.

이는 로봇공학의 표준적인 접근법이 되었습니다.

## 7. Task-space planning과 joint-space planning

로봇 task는 target pose나 Cartesian path를 따라 tool을 움직이는 것처럼 task space에서 지정하는 경우가 많습니다. 하지만 로봇 자체는 joint space에서 제어됩니다.

따라서 두 가지 자연스러운 planning paradigm이 있습니다.

### Task-space planning

End-effector frame이나 world frame에서 path를 설계하며, 직선, 곡선, orientation interpolation을 사용할 수 있습니다.

이는 로봇이 수행해야 할 작업과 직접 맞닿아 있습니다.

### Joint-space planning

Joint coordinate에서 직접 path를 설계합니다. Joint limit와 actuator constraint를 적용하기에는 더 단순한 경우가 많습니다.

Jacobian은 joint-space motion을 task-space twist로, 또 그 반대로 mapping하므로 두 관점을 연결합니다.

실제로 최선의 전략은 application에 따라 달라집니다. Workspace 목표에는 task-space motion이, actuator feasibility와 safety에는 joint-space motion이 적합합니다.

## 8. Collision constraint도 동적 제약이다

Path는 collision-free여야만 유용합니다. 하지만 실제로 collision checking은 기하학만의 문제가 아닙니다. 운동은 dynamic behavior와 control margin도 지켜야 합니다.

예를 들어 trajectory가 discrete sample 지점에서는 collision-free여도 시간상 너무 공격적이면 overshoot나 큰 control effort를 만들 수 있습니다. 그래서 planner는 safety margin과 smoothness penalty를 자주 사용합니다.

이는 planning과 control이 긴밀하게 연결되어 있다는 사실도 보여 줍니다. 기하학적으로 유효한 path가 control 성능 면에서는 좋지 않을 수 있습니다.

## 9. Motion planning에서 optimization의 역할

현대의 planning은 sample-based search만이 아니라 optimization을 자주 사용합니다. 이때 다음과 같은 cost function을 정의할 수 있습니다.

$$
J = \int_0^T \left(\|\dot{q}(t)\|^2 + \lambda \|\ddot{q}(t)\|^2 + \text{obstacle cost}\right) dt.
$$

이 목적 함수는 다음을 균형 있게 고려합니다.

- smoothness,
- effort,
- obstacle avoidance,
- 그리고 필요하다면 trackability입니다.

Optimization-based motion generation은 feasibility만큼 trajectory quality가 중요한 로봇공학에서 매우 효과적입니다.

목표는 유효한 path를 아무거나 고르는 것이 아니라, 실현 가능하면서도 좋은 path를 고르는 것입니다.

## 10. Planning이 기구학에 깊이 의존하는 이유

로봇이 가능한 운동은 workspace와 configuration 제약에 의해 결정되므로 전체 planning 과정은 기구학에 의존합니다.

Target pose가 reachable workspace 밖에 있으면 task를 바꾸지 않는 한 어떤 planner도 해결할 수 없습니다. Path가 singular configuration 근처를 지나면 planner가 제어하기 어려운 운동을 만들 수 있습니다. Path에 극단적인 joint rate가 필요하면 trajectory가 동역학적으로 실현 불가능할 수 있습니다.

앞선 이론이 실제로 중요한 이유가 여기에 있습니다.

- Screw axis는 운동 방향을 정의합니다.
- Jacobian은 국소 이동성을 정의합니다.
- Inverse kinematics는 도달 가능한 configuration을 정의합니다.
- Dynamic constraint는 실현 가능한 timing을 결정합니다.
- Planning은 이 모든 것을 만족하는 path를 제공합니다.

## 11. Path에서 실행으로

실현 가능한 trajectory를 planning하면 controller가 tracking law를 사용해 실행합니다. 목표는 실제 disturbance와 actuator limit를 고려하면서 로봇이 계획된 운동을 따르게 하는 것입니다.

여기서는 task-space control, inverse kinematics, dynamic compensation이 함께 작동합니다.

- Planner가 reference trajectory를 계산합니다.
- Controller가 이를 추적합니다.
- 로봇은 적절한 joint torque 또는 rate로 반응합니다.

이로써 geometry에서 motion generation을 거쳐 actuation으로 이어지는 loop가 완성됩니다.

## 12. 최종 해석

Trajectory와 planning 문제는 운동 이론이 실제 행동이 되는 지점입니다.

강체의 기하학적 설명에서 시작한 내용은 부드럽고 실현 가능하며 안전한 로봇 운동을 설계하고 실행하는 능력으로 끝납니다. 개념의 연결은 다음과 같습니다.

$$
\text{rigid-body geometry} \rightarrow \text{twists} \rightarrow \text{Jacobian} \rightarrow \text{IK} \rightarrow \text{dynamics} \rightarrow \text{trajectory} \rightarrow \text{planning}.
$$

이것이 현대 로봇공학의 전체 architecture입니다.

핵심 통찰은 각 층이 서로 분리되어 있지 않다는 점입니다. 각 층은 앞선 층에 의존합니다. Geometry가 motion model을 만들고, dynamics가 실행을 제한하며, planning이 가능한 운동 중 제약을 만족하는 방식을 선택합니다.

Modern Robotics 정식화가 강력한 이유도 여기에 있습니다. 가장 작은 미소 운동부터 가장 넓은 motion-planning 문제까지 로봇 운동을 하나의 관점으로 볼 수 있게 합니다.
