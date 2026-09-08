---
slug: modern-robotics-part-4
title: Modern Robotics, Part 4 — Manipulability와 속도 제어
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: Jacobian 기반 속도 제어, manipulability 측정, 제약이 있는 task-space 운동을 달성하기 위한 pseudoinverse 방법을 자세히 살펴봅니다.
---

Jacobian은 단순한 수학적 대상이 아니라 실제 로봇 운동 제어를 가능하게 하는 엔진입니다. 다음을 알고 나면

$$
\nu = J(\theta)\dot{\theta},
$$

다음과 같은 실용적인 질문을 할 수 있습니다.

> 원하는 말단 장치 twist $\nu_d$가 주어졌을 때 관절 속도는 어떻게 정해야 하는가?

이것이 속도 제어의 핵심입니다.

답은 Jacobian이 정사각인지, 세로로 긴지, 또는 rank가 부족한지에 따라 달라집니다. 여기서 pseudoinverse 제어, manipulability, task-space conditioning이라는 개념이 자연스럽게 나옵니다.

<!-- truncate -->

## 1. 기본 속도 제어 문제

말단 장치를 다음 desired twist로 움직이고 싶다고 합시다.

$$
\nu_d = \begin{bmatrix}
\omega_d \\\ v_d
\end{bmatrix}.
$$

그러면 다음을 만족하는 관절 속도를 구해야 합니다.

$$
J(\theta)\dot{\theta} = \nu_d.
$$

$J$가 정사각이고 nonsingular이면 해는 바로 구할 수 있습니다.

$$
\dot{\theta} = J(\theta)^{-1}\nu_d.
$$

이것이 Jacobian 기반 제어의 가장 직접적인 형태입니다. 하지만 로봇이 $J$가 가역인 configuration에 있을 때만 작동합니다.

실제 매니퓰레이터는 redundant하거나 underactuated인 경우가 많고 singularity 근처에 있을 수도 있습니다. 이때 하나의 정확한 역행렬이 존재하지 않거나 수치적으로 불안정할 수 있습니다.

## 2. Redundancy와 pseudoinverse

Jacobian이 정사각이 아니면 역행렬 대신 Moore–Penrose pseudoinverse를 사용할 수 있습니다.

$$
\dot{\theta} = J^{\dagger}(\theta)\nu_d.
$$

이는 다음 least-squares 문제의 minimum-norm 해를 제공합니다.

$$
\min_{\dot{\theta}} \|\dot{\theta}\|^2
\quad \text{subject to} \quad
J\dot{\theta} \approx \nu_d.
$$

이는 로봇공학에서 가장 중요한 실용 도구 중 하나입니다. Task-space 제약보다 관절이 많은 경우에도 관절 속도 명령을 계산할 수 있게 해 줍니다.

Pseudoinverse는 redundant manipulator에서 특히 유용합니다. 여분의 자유도를 secondary objective에 사용할 수 있기 때문입니다.

예를 들어 $n>6$인 로봇은 원하는 말단 장치 twist를 추적하면서 관절 제한을 피하거나, 팔꿈치를 장애물에서 떨어뜨리거나, dexterity를 최대화할 수 있습니다.

## 3. Secondary objective를 포함한 generalized inverse

Redundant robot에서는 pseudoinverse 해만으로는 유일하지 않습니다. 다음 항을 더해 원하는 목적을 반영할 수 있습니다.

$$
\dot{\theta} = J^{\dagger}\nu_d + \left(I - J^{\dagger}J\right)\dot{\theta}_0.
$$

여기서 $\dot{\theta}_0$는 선호하는 관절 속도 방향이고, projection 항

$$
I - J^{\dagger}J
$$

은 선호 운동을 Jacobian의 nullspace로 투영합니다.

이는 말단 장치 운동을 그대로 만족하면서 내부 관절 운동을 제어된 방식으로 바꿀 수 있다는 뜻입니다.

해석이 중요합니다.

- Task-space 명령은 $J^{\dagger}\nu_d$로 강제합니다.
- Nullspace 항은 말단 장치 task를 방해하지 않고 내부 운동의 형태를 조정합니다.

이는 redundant manipulation의 핵심 개념이며 실제 로봇 시스템에서 널리 사용됩니다.

## 4. Manipulability: 로봇은 얼마나 잘 움직이는가?

Jacobian은 운동 방향뿐 아니라 서로 다른 방향으로 운동을 만들기 얼마나 쉬운지도 알려 줍니다. 이를 정량화할 때 manipulability를 사용합니다.

Configuration $\theta$에서 singular value를

$$
\sigma_1, \sigma_2, \ldots, \sigma_m
$$

이라고 합시다.

흔히 사용하는 scalar measure는 정사각 Jacobian에서

$$
\mu = \sqrt{\det(JJ^T)}
$$

이며, 더 일반적으로 full row rank인 경우에도

$$
\mu = \sqrt{\det(JJ^T)}
$$

로 정의합니다.

이 값은 로봇의 conditioning이 좋을 때 크고 singularity에 가까울 때 작습니다.

또 다른 유용한 지표는 condition number입니다.

$$
\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}}.
$$

$\sigma_{\min}$이 매우 작으면 로봇은 singular configuration에 가까우며 일부 운동 방향을 구현하기가 매우 어려워집니다.

이 때문에 manipulability가 가치 있습니다. 단순히 움직일 수 있는지뿐 아니라 운동의 품질을 정량화하기 때문입니다.

## 5. Singularity와 수치 불안정성

Singularity 근처에서는 Jacobian의 conditioning이 나빠집니다. 그러면 작은 말단 장치 속도에도 큰 관절 속도가 필요합니다.

$$
\dot{\theta} \approx J^{-1}\nu_d.
$$

$J$에 매우 작은 singular value가 있으면 작은 task-space 명령이 큰 관절 속도 응답을 만듭니다.

따라서 제어 시스템은 singular configuration 근처에서 damping이나 regularization을 포함해야 합니다.

Damped least-squares 해는 다음과 같습니다.

$$
\dot{\theta} = J^T(JJ^T + \lambda^2 I)^{-1}\nu_d,
$$

여기서 $\lambda > 0$는 damping factor입니다.

이는 관절 속도가 폭발하는 것을 막고 Jacobian의 conditioning이 좋지 않을 때도 더 안정적인 명령을 제공합니다.

이것은 이론적으로 우아한 공식을 실제 공학에 맞게 보정한 것입니다. 현실에서는 singularity를 무시할 만큼 드물지 않기 때문입니다.

## 6. Manipulability의 기하학 이해

Jacobian의 singular value는 로봇이 관절 속도를 task-space 속도로 바꾸는 방식을 설명합니다. 기하학적으로는 각 방향으로 가능한 말단 장치 운동의 크기를 뜻합니다.

Singular value가 모두 크고 서로 비슷하면 로봇은 conditioning이 좋고 task space에서 등방적으로 움직일 수 있습니다.

한 singular value가 작으면 로봇은 높은 이동성을 갖는 방향과 나쁜 운동 방향을 갖습니다. 즉 어떤 방향으로는 쉽게 움직이지만 다른 방향으로는 잘 움직이지 못합니다.

이는 매니퓰레이터의 기하와 직접 연결됩니다.

- 정렬된 관절 축은 이동성을 줄입니다.
- 특정 자세에 놓인 링크는 비등방성 운동을 만듭니다.
- Singularity에 가까운 자세는 국소 제어력을 없앱니다.

이는 매우 기하학적인 관점입니다. Jacobian은 대수만 담는 것이 아니라 기구가 실제로 어느 방향으로 얼마나 움직일 수 있는지를 담습니다.

## 7. Screw geometry와의 관계

Jacobian의 열은 screw axis이며, 각 singular value는 대응하는 관절 운동이 task-space 운동에 얼마나 강하게 기여하는지를 나타내는 척도입니다.

이런 의미에서 manipulability는 screw-axis 정식화와 떨어져 있지 않습니다. Screw-axis 행렬의 구조를 요약하는 방법일 뿐입니다.

Screw axis가 task space에 잘 분산되어 있으면 로봇은 높은 dexterity를 갖습니다. 서로 선형 종속에 가까워지면 방향성이 사라지고 singularity에 도달합니다.

따라서 기하학적 관점과 대수적 관점은 서로 다른 언어로 표현한 같은 내용입니다.

- Screw axis는 운동 방향을 설명합니다.
- Jacobian rank와 singular value는 그 방향들이 얼마나 독립적인지 설명합니다.

## 8. Closed-loop task-space control

실제 로봇 제어는 흔히 closed-loop system으로 구현됩니다. 목표는 desired pose 또는 trajectory $T_d(t)$를 추적하는 것입니다.

각 순간에 task-space error를 계산하며, 흔히 twist error로 나타냅니다.

$$
\nu_e = \nu_d - \nu.
$$

그다음 다음 식으로 관절 명령을 갱신합니다.

$$
\dot{\theta} = J^{\dagger}(\theta)\nu_e + \left(I - J^{\dagger}J\right)\dot{\theta}_0.
$$

이는 feedback law처럼 동작합니다. 말단 장치가 원하는 대로 움직이지 않으면 control law가 이를 보정합니다.

다음과 같은 단순한 비례 형태도 자주 사용합니다.

$$
\nu_e = K_p e,
$$

여기서 $e$는 pose error이고 $K_p$는 gain matrix입니다. 관절 속도 명령은 Jacobian으로부터 얻습니다.

이것이 현대 로봇공학의 operational-space control과 task-space controller가 작동하는 기본 논리입니다.

## 9. Jacobian이 계속 중심에 있는 이유

이제 Jacobian이 로봇 기구학과 제어의 중심 대상이라는 점이 분명해졌습니다.

Jacobian은 다음을 알려 줍니다.

- 작은 관절 운동이 말단 장치 운동을 만드는 방식,
- 원하는 관절 속도를 계산하는 방법,
- dexterity를 측정하는 방법,
- system이 singular해지는 시점,
- task space에서 작동하는 controller를 구성하는 방법입니다.

그래서 Jacobian은 현대 로봇 기구학의 핵심이라고 합니다. 기하학과 제어를 가장 직접적으로 연결하기 때문입니다.

앞선 글에서 twist와 screw axis를 통해 이론적 기반을 세웠다면, 여기서는 그 기반이 실제 controller에서 어떻게 작동하는지 봅니다.

## 10. 개념 요약

이번 글의 중심 공식은 다음과 같습니다.

$$
\nu = J(\theta)\dot{\theta},
$$

$$
\dot{\theta} = J^{\dagger}\nu_d,
$$

그리고 redundancy가 있을 때는

$$
\dot{\theta} = J^{\dagger}\nu_d + (I - J^{\dagger}J)\dot{\theta}_0.
$$

이 식들은 로봇의 기하학적 구조가 어떻게 제어 알고리즘으로 바뀌는지 보여 줍니다.

따라서 Jacobian은 단순히 설명을 위한 대상이 아닙니다. 실제로 작동하는 도구입니다.

이것이 Modern Robotics의 실용적인 힘입니다.
