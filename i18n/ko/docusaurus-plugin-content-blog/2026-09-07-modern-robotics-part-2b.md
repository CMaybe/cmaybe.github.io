---
slug: modern-robotics-part-2b
title: Modern Robotics, Part 2B — 좌표계, Lie group, 그리고 Jacobian의 연결
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: 나선축 이론의 도입을 이어서 spatial frame과 body frame, Lie group/Lie algebra의 직관, 그리고 Jacobian 구성과의 연결을 살펴봅니다.
---

이 글의 전반부에서는 twist, screw axis, exponential map을 소개했습니다. 핵심 메시지는 강체 운동이 미소 운동 생성자에 의해 만들어지며, 그 생성자를 지수화하면 유한한 운동을 얻을 수 있다는 것이었습니다.

후반부에서는 실제로 가장 중요한 다음 세 가지 미묘한 차이를 다룹니다.

- 같은 운동이 서로 다른 좌표계에서 어떻게 표현되는지,
- Lie group / Lie algebra 관점이 왜 자연스러운지,
- screw axis 다음에 Jacobian이 왜 자연스럽게 등장하는지입니다.

<!-- truncate -->

## 1. 같은 운동, 다른 좌표

강체 운동은 서로 다른 좌표계로 표현할 수 있습니다. 이는 로봇공학에서 가장 흔한 혼동의 원인 중 하나입니다.

twist가 spatial frame에서 표현되면 다음과 같이 씁니다.

$$
\xi_s.
$$

body frame에서 표현되면 다음과 같이 씁니다.

$$
\xi_b.
$$

이 둘은 서로 다른 운동이 아닙니다. 서로 다른 기준 좌표계에서 설명한 같은 물리적 운동입니다.

두 표현의 관계는 adjoint transformation으로 주어집니다.

$$
\xi_s = Ad_T(\xi_b),
$$

또는 동치로

$$
\xi_b = Ad_{T^{-1}}(\xi_s).
$$

이는 중요한 사실을 일깨워 줍니다. 운동은 불변이지만 좌표는 불변이 아닙니다.

다시 말해 twist는 단순한 벡터가 아닙니다. 강체 운동 대수의 특정 표현에 속한 벡터이며, 그 표현은 좌표계에 따라 달라집니다.

## 2. 좌표계 선택이 중요한 이유

좌표계를 선택하는 일이 중요한 이유는 세계에 고정된 좌표계에서 표현할 때와 움직이는 물체에 붙은 좌표계에서 표현할 때 같은 물리적 운동이 다르게 보일 수 있기 때문입니다.

예를 들어 말단 장치가 로봇 베이스에 대해 움직인다고 합시다. 공간 좌표계 표현은 환경 안에서의 운동을 설명할 때 유용합니다. body frame 표현은 도구 자체를 기준으로 한 상대 운동을 설명할 때 유용합니다.

이 구분은 Jacobian을 구성할 때 바로 나타납니다.

- spatial Jacobian은 spatial frame에서 표현한 양을 사용합니다.
- body Jacobian은 body frame에서 표현한 양을 사용합니다.

두 정식화는 수학적으로 동등하지만 서로 다른 행렬과 계산 convention을 만듭니다.

그래서 기하학은 같고 표현만 달라진다고 말합니다.

## 3. 쉬운 말로 보는 Lie group과 Lie algebra

강체 변환 group은

$$
SE(3)
$$

입니다.

이에 대응하는 미소 운동 algebra는

$$
se(3)
$$

입니다.

Group은 모든 유한 강체 변환의 집합입니다. Algebra는 twist로 표현되는 모든 미소 운동의 집합입니다.

Exponential map은 이 두 대상을 연결합니다.

$$
T = e^{\hat{\xi}}.
$$

이것이 순간 운동에서 유한 운동으로의 이동이 깔끔하게 이루어지는 수학적 이유입니다.

Lie algebra는 추상적인 대상에 그치지 않습니다. 정확히 운동 생성자의 집합입니다. twist는 algebra의 원소이고, exponential map은 그 algebra 원소를 group의 유한 변환으로 바꿉니다.

로봇 기구학이 아름다운 구조를 갖는 이유도 여기에 있습니다. 유한 운동의 기하학이 미소 운동의 algebra에 담겨 있습니다.

## 4. 역관계로서의 matrix logarithm

Matrix logarithm은 반대 방향을 제공합니다.

$$
\hat{\xi} = \log(T).
$$

이는 알려진 강체 변환에서 그에 대응하는 미소 운동 생성자를 복원할 때 유용합니다.

어떤 로봇공학 문제에서는 측정했거나 명령한 pose가 주어지고, 그 pose를 만들어 낸 국소 twist를 이해하고 싶을 수 있습니다. Logarithm은 바로 그 국소적인 설명을 제공합니다.

이는 estimation과 control에서 특히 중요합니다. 강체 변환의 전체 이력을 알 필요 없이, 현재 변화량을 가장 잘 설명하는 국소 속도 생성자만 필요할 때가 많기 때문입니다.

## 5. 관절에 exponential map이 적합한 이유

로봇 관절은 임의의 운동을 만들어 내지 않습니다. 특정 screw axis를 따라 운동을 만들어 냅니다. 따라서 각 관절은 다음 형태의 생성자를 제공합니다.

$$
\hat{\mathcal{S}}_i \theta_i.
$$

그러면 말단 장치의 전체 운동은 다음과 같이 결합됩니다.

$$
T_{sb}(\theta) = e^{\hat{\mathcal{S}}_1 \theta_1} e^{\hat{\mathcal{S}}_2 \theta_2} \cdots e^{\hat{\mathcal{S}}_n \theta_n} T_{sb}(0).
$$

이것이 Product of Exponentials 공식이며, 로봇공학에서 가장 우아한 정식화 중 하나로 여겨집니다.

핵심은 대수식 자체에만 있지 않습니다. 개념적으로 중요한 점은 다음과 같습니다.

- 각 관절이 기하학적 운동 생성자를 제공합니다.
- 로봇의 전체 운동은 이 생성자들의 곱입니다.
- 그 구조는 강체 운동 자체의 기하학에서 비롯됩니다.

이 때문에 Modern Robotics는 일관된 느낌을 줍니다. 기구학 모델이 운동의 기하학과 같은 언어로 작성되기 때문입니다.

## 6. Screw axis에서 Jacobian으로

Screw axis를 알게 되면 다음 대상이 자연스럽게 등장합니다. 바로 Jacobian입니다.

Jacobian은 필요한 좌표계에서 표현한 관절 screw axis를 열벡터로 갖는 행렬입니다.

$$
J(\theta) = \begin{bmatrix}
\mathcal{S}_1 & \mathcal{S}_2 & \cdots & \mathcal{S}_n
\end{bmatrix}.
$$

그러면 말단 장치 twist는 다음과 같습니다.

$$
\nu = J(\theta)\dot{\theta}.
$$

이는 screw theory 위에 별도로 추가된 개념이 아닙니다. 각 관절의 운동 생성자를 하나의 선형 사상으로 모은 직접적인 결과입니다.

Jacobian은 관절 속도가 작업 공간 운동을 어떻게 만들어 내는지 정확히 알려 주는 대상입니다.

그래서 로봇공학에서 중심적인 역할을 합니다. 기하학적 운동 설명에서 로봇 제어로 넘어가는 첫 단계이기 때문입니다.

## 7. Jacobian의 기하학적 직관

Jacobian은 수치 행렬로 다뤄지는 경우가 많지만, 기하학적으로는 그보다 풍부한 의미를 갖습니다.

각 열은 한 관절이 순간적인 작업 공간에서 말단 장치를 어떻게 움직이는지 나타냅니다. 열들이 서로 나란히 놓이거나 거의 종속되면, 매니퓰레이터는 모든 방향으로 독립적으로 움직일 수 없습니다. 이것이 singularity의 기하학입니다.

이것이 다음 rank 조건의 직관입니다.

$$
\operatorname{rank}(J) < n.
$$

Rank가 부족하면 일부 관절 운동이 독립적인 작업 공간 운동을 만들어 내지 못합니다.

따라서 Jacobian은 다음 세 수준을 동시에 연결합니다.

- 기하학적 운동 방향,
- 순간적인 작업 공간 속도,
- 매니퓰레이터의 국소 conditioning.

Screw-theory 관점이 강력한 이유 중 하나는 행렬을 물리적 설명으로 바꾸어 주기 때문입니다.

## 8. 개념 요약

이 시리즈의 전체 흐름은 다음과 같이 간결하게 정리할 수 있습니다.

1. 강체 운동은 $T \in SE(3)$인 변환으로 표현합니다.
2. 순간 운동은 $\xi \in se(3)$인 twist로 표현합니다.
3. 관절은 screw axis $\mathcal{S}$를 따라 운동을 만듭니다.
4. 유한 운동은 exponential map $e^{\hat{\mathcal{S}}\theta}$에서 얻습니다.
5. Jacobian은 모든 관절의 기여를 하나의 사상 $\nu = J\dot{\theta}$로 모읍니다.
6. 이 선형화된 사상은 control, optimization, planning의 기반이 됩니다.

이것이 Modern Robotics의 개념적 뼈대입니다.

## 9. 이론을 넘어 중요한 이유

이러한 개념을 단지 수학적 우아함으로만 생각하기 쉽습니다. 그러나 실제로 trajectory tracking부터 inverse kinematics, force control까지 모든 것이 이 구조에 의존합니다.

이유는 간단합니다.

- 로봇의 운동은 강체 운동입니다.
- 순간 운동은 twist입니다.
- 유한 운동은 exponential입니다.
- 작업 공간 속도는 관절 속도의 Jacobian 가중 합입니다.

이는 선택적인 관점이 아닙니다. 현대 로봇 기구학이 작성되는 언어입니다.

## 10. 핵심 정리

이번 글에서 가장 중요한 교훈은 screw-axis 정식화가 고립된 한 장이 아니라는 점입니다. 이것은 전체 로봇 기구학 모델의 토대입니다.

Twist는 순간 운동을 설명하고, screw axis는 관절 운동의 기하를 설명하며, exponential map은 이러한 미소 운동을 유한 변환과 연결합니다.

이를 이해하면 Jacobian은 더 이상 신비롭지 않습니다. 모든 관절의 운동 생성자를 하나의 속도 사상으로 모은 행렬일 뿐입니다.

이것이 기하학에서 제어로 이어지는 연결입니다.
