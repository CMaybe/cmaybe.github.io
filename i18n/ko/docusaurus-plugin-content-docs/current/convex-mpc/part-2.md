---
sidebar_position: 2
---

# 단일 강체 모델

## 상태 표현

MPC 상태는 13차원입니다:

$$\mathbf{x} = [\Theta, \mathbf{p}, \boldsymbol{\omega}, \dot{\mathbf{p}}] \in \mathbb{R}^{13}$$

분해하면:
- $\Theta = [\theta_z, \theta_y, \theta_x]$ — ZYX 오일러 각 (몸 방향)
- $\mathbf{p} = [p_x, p_y, p_z]$ — 무게중심 위치 (월드 프레임)
- $\boldsymbol{\omega} = [\omega_x, \omega_y, \omega_z]$ — 각속도 (몸 프레임)
- $\dot{\mathbf{p}} = [\dot{p}_x, \dot{p}_y, \dot{p}_z]$ — 선속도 (월드 프레임)

## 연속 시간 상태-공간 형식

강체 방정식을 비선형 동역학 시스템으로 작성:

$$\dot{\mathbf{x}} = \mathbf{f}(\mathbf{x}, \mathbf{u})$$

제어 입력은 지면 반력의 벡터:

$$\mathbf{u} = [\mathbf{f}_1, \mathbf{f}_2, \mathbf{f}_3, \mathbf{f}_4]^\top \in \mathbb{R}^{12}$$

연속 동역학:

$$\dot{\Theta} = \mathbf{T}(\Theta) \boldsymbol{\omega}$$

$$\dot{\mathbf{p}} = \mathbf{v}$$

$$\dot{\mathbf{v}} = \mathbf{g} + \frac{1}{m} \sum_{i=1}^{4} \mathbf{f}_i$$

$$\dot{\boldsymbol{\omega}} = I^{-1} \left( \sum_{i=1}^{4} (\mathbf{r}_i - \mathbf{p}) \times \mathbf{f}_i - \boldsymbol{\omega} \times I \boldsymbol{\omega} \right)$$

여기서 $\mathbf{T}(\Theta)$는 방향 기구학 행렬입니다.

## 평형점 근처에서의 선형화

MPC의 경우 참조 궤적 근처에서 선형화합니다. 호버링 평형점(속도 제로, 수평 방향) 근처:

$$\mathbf{x}_{k+1} = \mathbf{A} \mathbf{x}_k + \mathbf{B} \mathbf{u}_k + \mathbf{c}$$

야코비안:

$$\mathbf{A} = \frac{\partial \mathbf{f}}{\partial \mathbf{x}} \bigg|_{\text{ref}}, \quad \mathbf{B} = \frac{\partial \mathbf{f}}{\partial \mathbf{u}} \bigg|_{\text{ref}}$$

핵심 통찰:
- $\mathbf{A}$는 방향 기구학, 중력 결합, 자이로스코픽 항을 포함
- $\mathbf{B}$는 각 접지 힘이 몸 가속도와 회전에 영향을 미치는 방식 인코딩
- 선형화는 작은 편차(트로트 속도)에 유효하고, 고속 플립에는 유효하지 않음

## 이산화: 영순서 유지

MPC는 40 Hz(25ms 타임스텝)에서 실행됩니다. 각 간격 동안 힘이 일정하다고 가정:

$$\mathbf{x}_{k+1} = \int_{t_k}^{t_{k+1}} \mathbf{f}(\mathbf{x}(t), \mathbf{u}_k) \, dt$$

선형 시스템의 경우:

$$\mathbf{x}_{k+1} = \left( I + \mathbf{A} \Delta t + \frac{(\mathbf{A} \Delta t)^2}{2} + \ldots \right) \mathbf{x}_k + \left( \mathbf{B} \Delta t + \mathbf{A} \mathbf{B} \frac{(\Delta t)^2}{2} + \ldots \right) \mathbf{u}_k + \mathbf{c}$$

행렬 지수 형식:

$$\Phi(\Delta t) = e^{\mathbf{A} \Delta t}, \quad \Gamma(\Delta t) = \int_0^{\Delta t} e^{\mathbf{A} \tau} d\tau \, \mathbf{B}$$

결과:

$$\mathbf{x}_{k+1} = \Phi \mathbf{x}_k + \Gamma \mathbf{u}_k + \mathbf{c} \Delta t$$

## 발 기구학과 야코비안

발은 몸 프레임의 위치에 있습니다 (로봇 기하학에서):

$$\mathbf{r}_{i,\text{body}} = [x_i, y_i, z_i]^\top$$

월드프레임 위치:

$$\mathbf{r}_i(\Theta, \mathbf{p}) = \mathbf{p} + \mathbf{R}(\Theta) \mathbf{r}_{i,\text{body}}$$

여기서 $\mathbf{R}(\Theta)$는 오일러 각에서의 회전 행렬입니다.

몸 운동을 발 운동으로 맵핑하는 야코비안:

$$\mathbf{J}_i = \begin{bmatrix} \frac{\partial \mathbf{r}_i}{\partial \Theta} & I_3 \\ \end{bmatrix}$$

필요한 이유:
1. 유상 다리 궤적 추종을 위한 발 속도 계산
2. 접지 힘을 몸 토크로 맵핑 (전치를 통해)
3. 기구학 제약 구현

## 왜 선형화하고 이산화하는가?

1. **볼록성:** 선형 동역학 + 이차 비용 = 볼록 QP
2. **안정성:** 선형 모델이 있는 유한-수평선 MPC는 온화한 조건에서 증명된 안정성
3. **계산 속도:** 선형 제약이 있는 응축된 QP는 5ms 이내에 풀이
4. **유효 범위:** 트로트(±0.5 m/s, ±5° 피치)에서 선형화 오류는 10% 미만

선형화 없으면 비선형 최적화 필요 (훨씬 느리고 수렴 보장 없음).

다음: [3부](part-3)는 각 타임스텝에서 풀이되는 QP로 이 상태-공간 모델을 변환합니다.
