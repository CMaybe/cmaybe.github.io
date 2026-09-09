---
title: Modern Robotics, Part 3 — Jacobian과 말단 장치 속도
authors: [jaegyeom]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: Screw axis와 twist에서 Jacobian을 유도하고, 관절 속도로 말단 장치 속도를 계산하는 방법과 singularity가 발생하는 이유를 자세히 설명합니다.
---

앞선 글에서는 twist와 screw axis를 사용해 강체 운동을 기하학적으로 바라보는 관점을 발전시켰습니다. 관절은 단순히 "각도를 움직이는" 것이 아니라 screw axis를 통해 강체 운동을 만들며, 유한한 로봇 pose는 그 운동 생성자를 지수화해 얻는다는 점을 살펴봤습니다.

이제 실용적인 질문이 바로 이어집니다.

> 관절 변수가 $\dot{\theta}$의 속도로 움직일 때 말단 장치의 속도는 얼마인가?

답은 Jacobian입니다.

Jacobian은 관절 속도를 spatial 또는 body 말단 장치 운동으로 바꾸는 선형 사상입니다. Configuration space와 task space를 연결하기 때문에 로봇공학에서 가장 중요한 대상 중 하나입니다.

<!-- truncate -->

## 1. 관절 운동에서 말단 장치 twist로

로봇 configuration을 관절 변수로 나타내면

$$
\theta = \begin{bmatrix}
\theta_1 \\\ \theta_2 \\\ \vdots \\\ \theta_n
\end{bmatrix}.
$$

말단 장치 pose는 강체 변환입니다.

$$
T_{se}(\theta) \in SE(3).
$$

관절이 다음과 같이 움직인다고 합시다.

$$
\dot{\theta} = \begin{bmatrix}
\dot{\theta}_1 \\\ \dot{\theta}_2 \\\ \vdots \\\ \dot{\theta}_n
\end{bmatrix},
$$

말단 장치의 순간 twist는 무엇일까요?

답은 다음 Jacobian 관계입니다.

$$
\nu = J(\theta) \dot{\theta},
$$

여기서 $\nu$는 말단 장치 twist이고 $J(\theta)$는 Jacobian 행렬입니다.

이 식은 로봇 운동의 미소 표현입니다. 말단 장치 속도가 관절 속도의 선형 결합이며, 그 계수는 기구의 기하에 의해 결정된다는 뜻입니다.

이는 역학 전반에서 보이는 패턴과 같습니다.

- 작은 변위는 선형화합니다.
- Configuration 의존성은 선형 사상을 만듭니다.
- 그 사상이 Jacobian입니다.

## 2. Screw-axis Jacobian

Jacobian을 유도하는 가장 이해하기 쉬운 방법은 screw-axis 관점에서 출발하는 것입니다.

각 관절 $i$에는 적절한 좌표계에서 screw axis $\mathcal{S}_i$를 대응시킬 수 있습니다. 그러면 관절 $i$가 말단 장치 twist에 기여하는 순간 성분은

$$
\nu_i = \mathcal{S}_i \dot{\theta}_i.
$$

전체 말단 장치 twist는 모든 관절 기여의 합입니다.

$$
\nu = \sum_{i=1}^n \mathcal{S}_i \dot{\theta}_i.
$$

이를 행렬로 모으면

$$
\nu = \begin{bmatrix}
\mathcal{S}_1 & \mathcal{S}_2 & \cdots & \mathcal{S}_n
\end{bmatrix}
\begin{bmatrix}
\dot{\theta}_1 \\\ \dot{\theta}_2 \\\ \vdots \\\ \dot{\theta}_n
\end{bmatrix}.
$$

이 행렬이 Jacobian입니다.

$$
J(\theta) = \begin{bmatrix}
\mathcal{S}_1 & \mathcal{S}_2 & \cdots & \mathcal{S}_n
\end{bmatrix}.
$$

열벡터는 관절 운동 생성자입니다. 따라서 Jacobian은 추상적인 것이 아니라 screw axis를 행렬로 배열한 것입니다.

이것이 Modern Robotics의 핵심 통찰 중 하나입니다. Jacobian은 임의로 만든 대수가 아니라 기하학적 대상입니다.

## 3. Spatial Jacobian과 body Jacobian

여기서 twist를 어느 좌표계에서 표현하는지가 중요합니다.

### 3.1 Spatial Jacobian

말단 장치 twist를 space frame에서 표현하면 Jacobian을 spatial Jacobian $J_s$라고 합니다.

$$
\nu_s = J_s(\theta)\,\dot{\theta}.
$$

$J_s$의 열은 space frame에서 표현한 screw axis입니다.

### 3.2 Body Jacobian

말단 장치 twist를 body frame에서 표현하면 body Jacobian $J_b$가 됩니다.

$$
\nu_b = J_b(\theta)\,\dot{\theta}.
$$

둘의 관계는 adjoint transformation으로 주어집니다.

$$
\nu_s = Ad_{T_{sb}}\,\nu_b,
$$

따라서

$$
J_s = Ad_{T_{sb}} J_b.
$$

이 관계는 단순한 표기상의 차이가 아닙니다. 같은 물리적 운동이 서로 다른 좌표계로 표현될 수 있다는 사실을 반영합니다. Jacobian의 형식은 선택한 좌표계에 따라 달라지지만 underlying motion은 불변입니다.

## 4. Jacobian이 configuration에 의존하는 이유

Jacobian이 configuration에 의존하는 이유는 screw axis 자체가 로봇과 함께 움직이기 때문입니다.

고정된 world frame에서 본 회전 관절의 축은 로봇의 현재 pose에 의존합니다. 따라서 기구의 구조가 같더라도 매니퓰레이터가 움직이면 Jacobian의 열도 바뀝니다.

이 때문에 가장 단순한 경우를 제외하면 Jacobian은 상수가 아닙니다.

Serial manipulator에서는

$$
J(\theta) = \begin{bmatrix}
\mathcal{S}_1(\theta) & \mathcal{S}_2(\theta) & \cdots & \mathcal{S}_n(\theta)
\end{bmatrix},
$$

이며 각 $\mathcal{S}_i(\theta)$는 현재 관절 $i$의 screw axis를 적절한 좌표계에서 표현한 것입니다.

자세에 따른 이 의존성이 로봇 기구학을 풍부하면서도 어렵게 만듭니다.

## 5. 미분 사상으로서의 Jacobian

Jacobian은 forward kinematics map의 미분입니다.

$$
T_{se}: \mathbb{R}^n \to SE(3).
$$

Configuration $\theta$ 근처에서 기구학을 선형화하면 관절 변수의 작은 변화가 작업 공간의 작은 운동을 만듭니다.

$$
\delta T \approx \hat{\nu} T,
$$

그리고

$$
\nu \approx J(\theta)\delta\theta.
$$

이는 다음과 같은 중요한 해석을 제공합니다.

- Forward kinematics는 관절 좌표를 pose로 보냅니다.
- Jacobian은 미소 관절 변화를 미소 도구 운동으로 보냅니다.

따라서 Jacobian은 비선형 로봇 기하의 국소 선형 근사입니다.

## 6. Singularity와 이동성의 상실

Jacobian이 중요한 큰 이유는 singularity를 드러내기 때문입니다.

Jacobian의 rank가 낮아지면 말단 장치 twist는 0이지만 관절 속도는 0이 아닌 경우가 존재합니다.

$$
J(\theta)\dot{\theta} = 0, \quad \dot{\theta} \neq 0.
$$

이는 로봇이 task space의 운동을 만들지 않고 configuration space에서 움직일 수 있다는 뜻입니다.

정사각 Jacobian의 경우 조건은

$$
\det J(\theta) = 0
$$

입니다.

대표적인 singularity는 다음과 같습니다.

- 관절 축이 서로 정렬되는 경우,
- 말단 장치가 완전히 뻗은 자세에 도달하는 경우,
- 손목 또는 팔꿈치 configuration이 퇴화한 사상을 만드는 경우입니다.

Singularity에서는 로봇이 어떤 방향으로 국소 제어력을 잃기 때문에 inverse kinematics와 motion planning 문제가 ill-conditioned해집니다.

그래서 Jacobian은 단순한 편의 도구가 아니라 기계적 가능성을 진단하는 도구이기도 합니다.

## 7. 예: 평면 2R 매니퓰레이터

링크 길이가 $L_1$, $L_2$인 평면 2R 로봇을 생각해 봅시다. 관절 변수는 $\theta_1$, $\theta_2$입니다.

말단 장치 위치는

$$
x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2),
$$

$$
y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2).
$$

시간에 대해 미분하면

$$
\dot{x} = -L_1\sin\theta_1\dot{\theta}_1 - L_2\sin(\theta_1 + \theta_2)(\dot{\theta}_1 + \dot{\theta}_2),
$$

$$
\dot{y} = L_1\cos\theta_1\dot{\theta}_1 + L_2\cos(\theta_1 + \theta_2)(\dot{\theta}_1 + \dot{\theta}_2).
$$

다음과 같이 쓸 수 있습니다.

$$
\begin{bmatrix}
\dot{x} \\
\dot{y}
\end{bmatrix}
=
\begin{bmatrix}
- L_1\sin\theta_1 - L_2\sin(\theta_1+\theta_2) & -L_2\sin(\theta_1+\theta_2) \\
L_1\cos\theta_1 + L_2\cos(\theta_1+\theta_2) & L_2\cos(\theta_1+\theta_2)
\end{bmatrix}
\begin{bmatrix}
\dot{\theta}_1 \\\ \dot{\theta}_2
\end{bmatrix}.
$$

이 행렬이 평면 Jacobian입니다. 행렬식은

$$
\det J = L_1L_2\sin\theta_2.
$$

따라서 다음일 때 rank를 잃습니다.

$$
\sin\theta_2 = 0,
$$

즉,

$$
\theta_2 = 0 \quad \text{또는} \quad \theta_2 = \pi.
$$

이 configuration에서는 팔꿈치가 완전히 접히거나 완전히 펴져 말단 장치가 모든 방향으로 독립적으로 움직일 수 없습니다.

이 예는 singularity의 직관을 제공합니다. singularity는 신비한 현상이 아니라 관절 운동에서 task-space 운동으로 가는 기하학적 사상이 퇴화할 때 정확히 발생합니다.

## 8. Jacobian 열의 기하학적 의미

Jacobian의 각 열은 한 관절이 만드는 순간 운동에 대응합니다.

회전 관절에서는

$$
\mathcal{S}_i =
\begin{bmatrix}
\omega_i \\
-\omega_i \times q_i
\end{bmatrix},
$$

이며 $q_i$는 관절 축 위의 점입니다.

직동 관절에서는

$$
\mathcal{S}_i =
\begin{bmatrix}
0 \\
v_i
\end{bmatrix},
$$

이고 $v_i$는 병진 방향입니다.

따라서 Jacobian은 말단 장치가 이용할 수 있는 모든 순간 운동 방향을 기하학적으로 요약합니다.

Screw theory와 Jacobian이 자연스럽게 연결되는 이유도 여기에 있습니다. Jacobian은 로봇의 기하가 정의한 운동 생성자를 모은 형태입니다.

## 9. Jacobian이 로봇공학의 중심인 이유

Jacobian은 기하학과 제어를 연결하는 핵심 대상입니다.

다음과 같은 곳에 등장합니다.

- velocity control
- inverse kinematics
- motion planning
- manipulability analysis
- trajectory optimization
- dynamic modeling

예를 들어 말단 장치가 원하는 twist $\nu_d$를 따르도록 하려면

$$
J(\theta)\dot{\theta} = \nu_d
$$

를 풉니다.

$J$가 정사각이고 가역이면

$$
\dot{\theta} = J(\theta)^{-1}\nu_d.
$$

이것이 velocity control의 가장 단순한 형태입니다. 행렬이 정사각이 아니거나 가역이 아니면 pseudoinverse 또는 constrained optimization 방법이 필요합니다.

이 실용적인 제어 정식화는 앞선 글의 기하학적 정식화에서 바로 따라옵니다.

## 10. 개념 요약

지금까지의 이야기는 일관되고 간결합니다.

1. 강체의 운동은 twist로 표현합니다.
2. 관절은 screw axis를 정의합니다.
3. 유한 운동은 exponential map으로 생성합니다.
4. 말단 장치 twist는 관절 기여의 합입니다.
5. Jacobian은 이 기여를 행렬로 모읍니다.
6. Jacobian이 rank를 잃으면 singularity가 나타납니다.

이 흐름이 Modern Robotics를 강력하게 만듭니다. 복잡한 로봇 운동을 기하, 대수, 선형화로 이루어진 정밀한 구조로 바꾸기 때문입니다.

따라서 Jacobian이 중요하다고 말할 때 의미하는 바는 구체적입니다.

$$
\boxed{\nu = J(\theta)\dot{\theta}}
$$

이 식은 configuration-space 운동과 task-space 운동을 연결하는 기본 관계입니다.

이 간결한 공식이 기구학과 제어를 잇는 다리입니다.
