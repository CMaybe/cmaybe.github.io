---
title: Modern Robotics, Part 5 — 역기구학과 수치 해법
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: Jacobian 기반 방법, 해석적 해법, 반복 수치 전략을 사용해 로봇 pose를 구하는 역기구학을 자세히 설명합니다.
---

Forward kinematics와 Jacobian을 이해했다면 다음 자연스러운 질문은 역문제입니다.

> 원하는 말단 장치 pose가 주어졌을 때 이를 실현하는 관절 변수는 무엇인가?

이것이 역기구학 문제입니다.

대부분의 로봇에서 역기구학은 비선형이며 해석적으로 풀기 어려운 경우가 많습니다. 매니퓰레이터의 기하가 중요하고, 로봇이 단순한지 redundant한지 또는 제약이 많은지에 따라 해법을 크게 달리 선택해야 합니다.

<!-- truncate -->

## 1. Forward kinematics와 inverse kinematics

Forward kinematics는

$$
T_{se}(\theta) = T_{se}(\theta_1, \ldots, \theta_n).
$$

을 제공합니다. Inverse kinematics는 다음을 만족하는 관절 벡터 $\theta$를 구합니다.

$$
T_{se}(\theta) = T_d,
$$

여기서 $T_d$는 목표 강체 변환입니다.

이는 $\theta$에서 $T$로 가는 사상이 비선형이고 여러 값을 가질 수 있기 때문에 forward kinematics보다 훨씬 어렵습니다. 로봇에는 다음과 같은 경우가 있을 수 있습니다.

- 정확한 해가 없는 경우,
- 유한 개의 정확한 해가 있는 경우,
- redundant하면 무한히 많은 해가 있는 경우,
- 근사 수치 해만 존재하는 경우입니다.

이것이 역기구학이 로봇공학의 핵심 주제인 이유 중 하나입니다.

## 2. IK의 기하

많은 매니퓰레이터에서는 기하가 더 단순한 부분 문제로 분해될 때 역기구학을 쉽게 풀 수 있습니다. 예를 들어 6-DOF 매니퓰레이터는 다음과 같이 나눌 수 있습니다.

- 위치 해,
- 방향 해,
- 손목 방향 정렬입니다.

기구의 구조가 중요합니다. 예를 들어 spherical wrist를 가진 로봇은 임의의 관절 축을 가진 로봇보다 해석적 해를 깔끔하게 구할 수 있는 경우가 많습니다.

핵심은 전체 문제를 black box로 취급하지 않고 로봇의 기하를 이용해 말단 장치를 원하는 위치와 방향에 놓는 관절 변수를 구하는 것입니다.

## 3. 단순한 평면 팔의 해석적 IK

링크 길이가 $L_1$, $L_2$인 평면 2-link arm을 생각해 봅시다. 원하는 말단 장치 위치는 $(x, y)$입니다.

표준 기하 관계는

$$
 x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2),
$$

$$
 y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2).
$$

목표 반지름을

$$
 r = \sqrt{x^2 + y^2}
$$

로 정의합니다.

그러면 cosine law에서 팔꿈치 각도 관계가 나옵니다.

$$
\cos\theta_2 = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2L_1L_2}.
$$

따라서

$$
\theta_2 = \operatorname{atan2}\left(\pm\sqrt{1 - c^2},\, c\right).
$$

두 가지 팔꿈치 configuration이 가능합니다.

그다음 base angle $\theta_1$은 다음과 같이 복원할 수 있습니다.

$$
\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2).
$$

이는 2R 매니퓰레이터의 고전적인 해석적 해입니다. 기하가 저차원이고 기구학 구조가 잘 알려져 있기 때문에 간단합니다.

더 넓은 관점에서 보면 해석적 해는 기하를 직접 활용합니다. 가능할 때 일반 수치 방법보다 빠르고 안정적입니다.

## 4. 해석적 해가 항상 가능하지 않은 이유

일반적인 6-DOF 매니퓰레이터에서는 해석적 해를 닫힌 형태로 유도하기가 매우 어렵거나 불가능할 수 있습니다.

Pose 제약에서 생기는 비선형 제약은 높은 차수의 다항식으로 이어집니다. 식을 유도할 수 있더라도 소프트웨어에서 안정적으로 사용하기에는 너무 복잡할 수 있습니다.

이때 수치 방법이 중요해집니다.

## 5. Jacobian을 사용한 반복 IK

Jacobian은 목표 pose를 향해 관절 변수를 조금씩 갱신하는 직접적인 방법을 제공합니다.

현재 pose가 $T_{se}(\theta)$이고 목표 pose가 $T_d$라고 합시다. 말단 장치 pose를 $T_d$에 가깝게 옮기는 작은 관절 갱신 $\Delta\theta$를 구하려고 합니다.

일반적인 정식화는

$$
J(\theta)\Delta\theta = \nu_e,
$$

이며 $\nu_e$는 현재 pose와 목표 pose 사이의 twist error입니다.

그다음 configuration을

$$
\theta \leftarrow \theta + \Delta\theta.
$$

로 갱신합니다.

이것이 Jacobian 기반 IK의 핵심입니다.

Error twist는 현재 transform과 목표 transform의 차이에서 계산할 수 있습니다. 미분 형식에서는 pose error를 줄이는 속도 명령으로 목표 운동을 표현합니다.

이는 직접 해를 구하는 대신 국소 선형화를 사용해 error를 반복해서 줄이는 differential correction 방법입니다.

## 6. Pseudoinverse 방법

Jacobian이 full rank이면 least-squares 갱신은 다음과 같이 쓸 수 있습니다.

$$
\Delta\theta = J(\theta)^{\dagger} \nu_e.
$$

이는 가장 단순한 반복 IK 전략입니다. Pose error를 가장 잘 줄이는 minimum-norm 갱신을 계산합니다.

로봇이 redundant하면 nullspace 항도 포함할 수 있습니다.

$$
\Delta\theta = J^{\dagger}\nu_e + \left(I - J^{\dagger}J\right)\Delta\theta_0.
$$

이를 사용하면 목표 pose를 만족하면서 solver를 선호하는 관절 configuration으로 유도할 수 있습니다.

IK에는 해가 무한히 많을 때가 많으므로 유용합니다. Solver는 관절 제한을 피하거나 singularity에서 멀리 있는 것처럼 물리적으로 바람직한 해를 선택해야 합니다.

## 7. Damped least-squares와 regularization

Singularity 근처에서는 pseudoinverse 해가 불안정해질 수 있습니다. 흔한 해결책은 damped least-squares 갱신입니다.

$$
\Delta\theta = J^T(JJ^T + \lambda^2 I)^{-1}\nu_e,
$$

여기서 $\lambda > 0$는 damping parameter입니다.

이는 regularization처럼 작동합니다. Jacobian의 conditioning이 나쁠 때 갱신량이 폭발하는 것을 막습니다.

이는 수치 IK에서 특히 중요합니다. 목표가 singular configuration에 가까워지면 solver가 매우 큰 관절 운동을 만들거나 수렴하지 못할 수 있기 때문입니다.

## 8. Newton-Raphson 방식의 IK

또 다른 방법은 pose 자체의 error를 반복해 역기구학을 푸는 것입니다.

$$
F(\theta) = T_{se}(\theta)^{-1}T_d.
$$

$F(\theta)$를 identity transform으로 만들고자 합니다. 선형화하면

$$
\delta\theta \approx J^{-1}(\theta) \xi,
$$

이며 $\xi$는 residual error에 대응하는 twist입니다.

그다음 갱신은

$$
\theta_{k+1} = \theta_k + \Delta\theta_k.
$$

입니다.

이는 rigid motion의 manifold 위에서 수행하는 Newton 방식 갱신입니다. 강력하지만 초기 조건과 singularity 근처의 상태에 민감합니다.

실제로는 안정성을 위해 damping, line search 또는 trust-region 방법을 함께 사용하는 경우가 많습니다.

## 9. Initial guess의 역할

수치 IK는 초기 configuration에 크게 의존합니다.

초기 추정이 목표에 가까우면 빠르고 안정적으로 수렴합니다. 멀리 있으면 다른 branch로 수렴하거나 아예 실패할 수 있습니다.

알려진 로봇 종류에서는 해석적 방법을 선호하는 이유가 여기에 있습니다. 운 좋은 초기 추정에 의존하지 않고 유효한 해를 직접 만들기 때문입니다.

하지만 수치 방법은 더 일반적이며 closed-form 공식이 복잡하거나 존재하지 않는 로봇도 다룰 수 있습니다.

## 10. Multiple solution의 어려움

Inverse kinematics에는 같은 말단 장치 pose에 대해 유효한 관절 configuration이 여러 개 있는 경우가 많습니다.

예를 들어 평면 2R arm에는 elbow-up과 elbow-down이라는 두 해가 있었습니다. 6-DOF 매니퓰레이터에도 서로 다른 wrist 방향이나 elbow 자세에 대응하는 여러 branch가 있을 수 있습니다.

이는 정식화의 결함이 아니라 기하의 성질입니다. 추가 기준이 없으면 pose 제약만으로 유일한 configuration을 고를 수 없습니다.

일반적인 기준은 다음과 같습니다.

- 이전 configuration에서 관절 변위를 최소화하기,
- 관절 제한 피하기,
- 장애물과의 거리 최대화하기,
- 특정 elbow 자세나 wrist 방향 선호하기입니다.

그래서 역기구학은 optimization 또는 task-priority control과 함께 사용하는 경우가 많습니다.

## 11. IK에서 control과 planning으로

Inverse kinematics는 고립된 구성 요소가 아닙니다. 기하와 제어가 만나는 지점입니다.

실현 가능한 pose-to-configuration 사상을 계산할 수 있으면 다음을 할 수 있습니다.

- trajectory 생성,
- 원하는 tool path 추적,
- 장애물 회피,
- 기구학 제약을 지키는 controller 구성입니다.

여기서 Jacobian은 반복 해법에 필요한 국소 선형화를 제공하고, 전체 pose map은 도달해야 할 목표를 정의하기 때문에 중심적인 역할을 합니다.

Modern Robotics 관점이 효과적인 이유도 여기에 있습니다. 기구학, 운동 생성, 제어 전반에 공통된 수학 언어를 제공하기 때문입니다.

## 12. 요약

역기구학 문제는 근본적으로 다음 비선형 시스템을 푸는 일입니다.

$$
T_{se}(\theta) = T_d.
$$

크게 두 가지 방법이 있습니다.

1. 기구의 구조를 사용하는 해석적 방법,
2. Jacobian 기반 반복 갱신을 사용하는 수치 방법입니다.

Jacobian 기반 갱신은

$$
J(\theta)\Delta\theta = \nu_e,
$$

이며 역행렬을 직접 사용할 수 없을 때는

$$
\Delta\theta = J^{\dagger}\nu_e
$$

또는 solver를 안정화하는 damping 버전을 사용합니다.

이는 앞선 글에서 발전시킨 전체 이론이 어떻게 결합되는지 보여 줍니다. 매니퓰레이터의 기하는 screw axis에 담기고, 이를 미분해 Jacobian을 얻으며, 그 Jacobian으로 pose 실현 문제를 풉니다.

이것이 Modern Robotics의 진정한 효용입니다.
