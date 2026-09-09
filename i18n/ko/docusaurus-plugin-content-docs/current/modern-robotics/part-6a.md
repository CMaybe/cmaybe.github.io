---
title: Modern Robotics, Part 6A — 동역학, 제어, 그리고 운동 생성
authors: [endi]
tags: [robotics, modern-robotics, kinematics, motion-planning]
description: 기구학, twist 기반 운동 생성, 동역학을 task-space control과 로봇 운동 생성으로 연결해 자세히 살펴봅니다.
---

앞선 글에서는 twist, screw axis, Jacobian, inverse kinematics를 사용해 로봇을 기구학적으로 바라보는 관점을 발전시켰습니다. 이제 로봇 운동이 어떻게 생성되는지에 대한 강한 기하학적 이해를 갖게 되었습니다.

다음 단계는 이 이해를 동역학과 planning의 맥락에 놓는 것입니다.

로봇은 목표 pose에 도달하기만 하면 되는 것이 아닙니다. 부드럽게 움직이고, trajectory를 추적하고, 제약을 만족하며, 시스템의 물리 법칙을 존중하는 control signal로 움직여야 합니다.

이것이 dynamics와 motion planning의 영역입니다.

<!-- truncate -->

## 1. 기구학만으로는 충분하지 않다

기구학은 관절 변수에 따라 로봇 pose가 어떻게 변하는지 알려 줍니다. 하지만 control과 planning에는 힘과 토크가 운동을 만드는 방식에 대한 지식도 필요합니다.

자연스러운 순서는 다음과 같습니다.

1. 말단 장치의 위치와 방향을 transformation으로 표현합니다.
2. 순간 운동을 twist로 표현합니다.
3. Jacobian은 관절 속도를 task-space 속도로 변환합니다.
4. 동역학은 힘과 토크가 관절 가속도를 만드는 방식을 설명합니다.
5. Planning은 실현 가능하고 부드러우며 collision-free한 trajectory를 생성합니다.

이것이 현대 로봇공학의 pipeline입니다.

## 2. 로봇은 제약된 기계 시스템이다

매니퓰레이터 동역학은 흔히 다음 표준 형태로 씁니다.

$$
M(\theta)\ddot{\theta} + C(\theta, \dot{\theta})\dot{\theta} + g(\theta) = \tau,
$$

여기서

- $M(\theta)$는 inertia matrix입니다.
- $C(\theta, \dot{\theta})\dot{\theta}$는 Coriolis와 centrifugal 효과를 나타냅니다.
- $g(\theta)$는 gravity 항입니다.
- $\tau$는 joint torque vector입니다.

이 식은 인가한 torque의 효과가 inertia, geometry, gravity에 의해 매개된다는 뜻입니다. 기구학 map을 보완하는 동역학적 표현입니다.

Motion planning 관점에서 중요한 점은 로봇이 임의로 가속할 수 없다는 것입니다. Joint-space 동역학은 로봇이 얼마나 빠르고 급격하게 움직일 수 있는지에 제약을 둡니다.

## 3. Jacobian의 동역학적 역할

Jacobian은 joint-space 운동과 task-space 운동을 연결하며, 같은 구조가 동역학에서도 나타납니다.

Task-space force 또는 wrench $F$는 transpose Jacobian을 통해 joint torque와 연결됩니다.

$$
\tau = J(\theta)^T F.
$$

이 관계는 기본적입니다. 말단 장치에 가해진 wrench가 매니퓰레이터의 기하에 따라 equivalent joint torque로 바뀐다는 뜻입니다.

이는 기구학과 동역학을 잇는 핵심 연결입니다. Jacobian은 task-space force가 joint-space torque로 바뀌는 방식과 로봇이 환경의 운동을 저항하거나 만들어 내는 방식을 결정합니다.

## 4. Task-space dynamics

같은 논리를 task space에서 표현할 수도 있습니다. Kinetic 관계는 다음과 같이 쓸 수 있습니다.

$$
\Lambda(\theta)\dot{\nu} + \mu(\theta, \dot{\theta}) + p(\theta) = F,
$$

여기서 $\Lambda$는 task-space inertia matrix이고, $\mu$는 속도 의존 항을 모으며, $p$는 gravity 관련 wrench입니다.

이 정식화는 원하는 운동이 자연스럽게 task space에서 지정되는 operational-space control에 유용합니다.

기본 아이디어는 앞과 같습니다. Task-space 명령은 Jacobian과 동역학 모델을 통해 joint-space actuation으로 바뀝니다.

## 5. Trajectory generation: 점에서 부드러운 운동으로

목표 pose를 알게 되면 로봇은 시간에 따른 실현 가능한 운동을 따라야 합니다. 이것이 trajectory generation 문제입니다.

Trajectory는 pose의 목록이 아니라 smoothness, velocity limit, acceleration limit를 포함하는 시간 매개화 경로입니다.

흔한 선택은 polynomial trajectory입니다. 예를 들어 cubic polynomial은 경계 조건을 만족할 수 있습니다.

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3.
$$

계수는 초기와 최종 position 및 velocity로 정합니다.

더 높은 smoothness가 필요하면 quintic polynomial을 사용합니다.

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5.
$$

이를 사용하면 양 끝점에서 position, velocity, acceleration을 만족시킬 수 있습니다.

이는 로봇이 pose target 사이를 갑자기 이동하지 않아야 하기 때문에 중요합니다. 부드러운 움직임은 마모, 진동, 불안정성을 줄입니다.

## 6. Time parametrization과 운동 제약

경로만으로는 충분하지 않습니다. 로봇은 시간에 따른 제한도 지켜야 합니다.

경로를 arc length $s$로 매개화했다면 timing law $s(t)$를 정의할 수 있습니다.

경로를 따른 전체 속도는

$$
\dot{q}(t) = \frac{dq}{ds}\dot{s}(t).
$$

마찬가지로

$$
\ddot{q}(t) = \frac{d^2 q}{ds^2}\dot{s}^2 + \frac{dq}{ds}\ddot{s}.
$$

입니다.

이는 일반적인 planning 원리를 보여 줍니다. 경로의 기하와 time scaling은 서로 분리된 설계 선택이며 둘 다 실현 가능성에 영향을 줍니다.

Trajectory가 너무 빠르면 actuator limit나 dynamic constraint를 위반할 수 있습니다. 너무 느리면 비현실적일 수 있습니다. Planning은 실현 가능성과 효율 사이의 균형을 찾습니다.

## 7. Motion planning의 역할

Motion planning은 제약을 지키면서 초기 configuration에서 목표 configuration으로 가는 실현 가능한 경로를 찾는 문제입니다.

보통 다음을 고려합니다.

- obstacle avoidance,
- joint limit,
- velocity와 acceleration limit,
- collision constraint,
- dynamic feasibility입니다.

넓은 의미에서 motion planning 방법은 다음 몇 종류로 나뉩니다.

- graph-based planning,
- sampling-based planning,
- optimization-based planning,
- reactive control 접근법입니다.

PRM과 RRT 같은 sampling-based 방법은 정확한 기하학적 planning이 어려운 고차원 공간에서 특히 중요합니다.

핵심은 언제나 같습니다. Geometry와 constraint에 대한 feasibility를 유지하면서 configuration space를 탐색합니다.

## 8. Collision avoidance와 configuration space

Motion planning의 가장 깊은 개념 중 하나가 configuration space입니다.

Configuration space는 모든 로봇 joint configuration의 집합입니다. Configuration은 장애물과 충돌하지 않고 joint limit를 만족하면 유효합니다.

이를 통해 기하학적 장애물 문제를 state-space planning 문제로 바꿀 수 있습니다.

로봇이 $n$개의 관절을 가지면 configuration space는 보통 고차원입니다. 이를 직접 탐색하는 일은 비싸기 때문에 planning은 sampling, heuristic, 또는 task decomposition을 사용하는 경우가 많습니다.

여기서 기구학과 task-space 직관이 실제 시스템의 feasibility와 만납니다. 로봇이 task space에서 pose에 도달할 수 있어도 환경과 충돌하지 않고 도달하지 못할 수 있습니다.

## 9. Task space와 joint space에서의 planning

두 가지 일반적인 planning 관점이 있습니다.

### 9.1 Joint-space planning

Joint-space planning은 변수 $q$에서 직접 수행합니다.

Joint limit와 actuator limit 같은 제약은 joint coordinate로 자연스럽게 표현되므로 이 방식이 더 단순한 경우가 많습니다.

### 9.2 Task-space planning

Task-space planning은 말단 장치 pose 또는 twist space에서 수행합니다.

로봇 task가 Cartesian coordinate로 지정되므로 더 직관적인 경우가 많습니다. 예를 들어 "orientation을 고정한 채 tool을 직선으로 움직인다"는 task-space 표현입니다.

하지만 task-space path는 singularity나 도달 불가능한 configuration 같은 joint-space 문제를 만들 수 있습니다.

Jacobian은 joint motion을 task-space motion으로, 또 그 반대로 변환하므로 두 관점 사이의 다리 역할을 합니다.

## 10. Force control과 interaction

모든 로봇 task가 순수한 기구학적인 것은 아닙니다. 산업과 연구 현장에서는 로봇이 환경과 상호작용하고, 힘을 가하거나, 접촉을 유지해야 하는 경우가 많습니다.

Force control에서는 pose만이 아니라 contact wrench를 제어할 수 있습니다. 이때도 다음 관계가 중심입니다.

$$
\tau = J^T F
$$

원하는 힘으로 밀고 싶다면 controller는 Jacobian을 이용해 그 힘을 joint torque로 바꿉니다. 이는 velocity control의 동역학적 대응입니다.

이처럼 같은 행렬 $J$가 운동과 힘 전달을 모두 지배하므로 기하학적 정식화가 더욱 강력해집니다.

## 11. 전체 로봇 pipeline

전체 로봇 workflow는 다음과 같은 일관된 순서로 볼 수 있습니다.

1. rigid transform으로 로봇 geometry를 모델링합니다.
2. twist와 screw axis로 운동을 표현합니다.
3. Jacobian을 계산합니다.
4. Forward와 inverse kinematics를 풉니다.
5. 부드러운 timing으로 trajectory를 설계합니다.
6. dynamics와 actuator limit를 적용합니다.
7. configuration space에서 collision-free path를 planning합니다.
8. motion 또는 force tracking에 Jacobian 기반 control을 사용합니다.

이것이 현대 로봇공학의 중심 architecture입니다.

## 12. 마무리 직관

지금까지 모든 글을 관통한 주제는 같습니다.

- Geometry가 구조를 제공합니다.
- Algebra가 계산 가능하게 만듭니다.
- Dynamics가 물리적 의미를 부여합니다.
- Planning이 실현 가능한 운동을 만드는 데 사용합니다.

따라서 screw-axis와 Jacobian 관점은 로봇 운동을 설명하는 좋은 방법에 그치지 않습니다. 현대 로봇공학의 통합된 수학 언어입니다.

전체 이야기는 다음처럼 간결하게 정리할 수 있습니다.

$$
T_{se}(\theta) \in SE(3),
$$

$$
\nu = J(\theta)\dot{\theta},
$$

$$
\tau = J(\theta)^T F,
$$

그리고 planning과 control은 이 관계들을 사용해 실현 가능하고 부드러우며 task를 고려한 운동을 만듭니다.

이것이 로봇 geometry와 로봇 intelligence 사이의 깊은 개념적 연결입니다.
