---
sidebar_position: 3
---

# 유한 수평선 MPC와 응축된 QP

## 최적화 문제

제어기는 매 업데이트마다 현재 상태 $\mathbf{x}_0$와 속도 명령을 받습니다. 그런 다음 다음 $N$개 예측 스텝에 적용할 지면 반력을 선택합니다.

비용 함수는 다음과 같습니다.

$$J = \sum_{k=0}^{N-1} \left( \|\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k\|_Q^2 + \|\mathbf{u}_k\|_R^2 \right).$$

상태는 다음 동역학을 따릅니다.

$$\mathbf{x}_{k+1} = \mathbf{A}\mathbf{x}_k + \mathbf{B}\mathbf{u}_k + \mathbf{c}.$$

$\mathbf{u}_k$는 네 발의 힘 성분을 모은 벡터이므로 $\mathbf{u}_k \in \mathbb{R}^{12}$입니다. 예측 수평선은 25ms 스텝 16개로 구성되며, 전체 길이는 400ms입니다.

최적화는 다음 물리 조건도 만족해야 합니다.

- 지지 발은 마찰 한계 안에서만 힘을 낼 수 있습니다.
- 유상 발의 지면 반력은 0입니다.
- 지지 발의 수직력은 음수가 아니며 상한을 넘지 않습니다.

## 예측 상태 제거

예측 상태를 독립적인 결정 변수로 저장할 필요는 없습니다. 첫 번째 스텝은 다음과 같습니다.

$$\mathbf{x}_1 = \mathbf{A}\mathbf{x}_0 + \mathbf{B}\mathbf{u}_0 + \mathbf{c}.$$

두 번째 스텝은 다음과 같습니다.

$$\mathbf{x}_2 = \mathbf{A}\mathbf{x}_1 + \mathbf{B}\mathbf{u}_1 + \mathbf{c}.$$

첫 번째 식을 두 번째 식에 대입하면 다음을 얻습니다.

$$\mathbf{x}_2 = \mathbf{A}^2\mathbf{x}_0 + \mathbf{A}\mathbf{B}\mathbf{u}_0 + \mathbf{B}\mathbf{u}_1 + \mathbf{A}\mathbf{c} + \mathbf{c}.$$

같은 대입을 반복하면 모든 예측 상태를 초기 상태와 힘 시퀀스의 아핀 함수로 표현할 수 있습니다. 힘을 하나의 벡터로 쌓으면 다음과 같습니다.

$$\mathbf{U} = [\mathbf{u}_0^\top, \mathbf{u}_1^\top, \ldots, \mathbf{u}_{N-1}^\top]^\top.$$

$N=16$이면 이 벡터의 원소 수는 $16 \times 12 = 192$개입니다. 예측 상태를 비용 함수에 대입하면 다음 이차식이 됩니다.

$$J(\mathbf{U}) = \frac{1}{2}\mathbf{U}^\top H\mathbf{U} + \mathbf{g}^\top\mathbf{U} + \text{constant}.$$

상태 변수를 제거했지만 동역학의 효과는 $H$와 $\mathbf{g}$에 남아 있습니다.

## 추종 비용과 힘 비용

상태 추종 비용은 원하는 몸의 움직임과 실제 예측 상태의 차이를 벌점으로 줍니다.

$$J_{\mathrm{state}} = \sum_{k=0}^{N-1} (\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k)^\top Q (\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k).$$

행렬 $Q$는 몸 높이와 선속도처럼 안정성에 중요한 상태에 큰 가중치를 줄 수 있습니다.

힘 비용은 불필요하게 큰 힘을 억제합니다.

$$J_{\mathrm{force}} = \sum_{k=0}^{N-1} \mathbf{u}_k^\top R\mathbf{u}_k.$$

$R$을 키우면 일반적으로 더 작고 부드러운 힘이 만들어집니다. $Q$를 키우면 참조 궤적을 더 강하게 추종합니다.

## 마찰 제약

발 $i$의 쿨롱 마찰 원뿔은 다음과 같습니다.

$$\sqrt{f_{i,x}^2 + f_{i,y}^2} \leq \mu f_{i,z}.$$

구현에서는 이 원뿔을 네 개의 선형 부등식으로 근사합니다.

$$f_{i,x} + f_{i,y} \leq \mu f_{i,z}.$$

$$f_{i,x} - f_{i,y} \leq \mu f_{i,z}.$$

$$-f_{i,x} + f_{i,y} \leq \mu f_{i,z}.$$

$$-f_{i,x} - f_{i,y} \leq \mu f_{i,z}.$$

이 피라미드 근사는 보수적입니다. 선형 근사가 허용한 힘은 원래 마찰 원뿔 안에도 포함됩니다.

## 접지 일정

보행 일정은 QP를 구성하기 전에 이미 정해져 있습니다. 유상 발에 대해서는 다음을 적용합니다.

$$\mathbf{f}_{i,k} = \mathbf{0}.$$

지지 발의 수직력은 다음보다 크거나 같아야 합니다.

$$f_{i,k,z} \geq 0.$$

또한 다음 상한을 둡니다.

$$f_{i,k,z} \leq f_{\max}.$$

접지 일정이 고정되어 있으므로 솔버는 혼합 정수 접지 문제 대신 볼록 이차계획 문제를 풉니다.

## QP 형식

응축 후 문제는 다음 표준 형식이 됩니다.

$$\underset{\mathbf{U}}{\operatorname{minimize}}\; \frac{1}{2}\mathbf{U}^\top H\mathbf{U} + \mathbf{g}^\top\mathbf{U}.$$

힘 제약은 다음과 같이 쓸 수 있습니다.

$$\mathbf{A}_{\mathrm{ineq}}\mathbf{U} \leq \mathbf{b}_{\mathrm{ineq}}.$$

제어기는 qpOASES로 이 QP를 풉니다. 웜 스타트에서는 직전 힘 시퀀스를 새 문제의 초기값으로 사용합니다.

다음 [4부](part-4)에서는 보행 일정과 별도의 유상 다리 제어기를 설명합니다.
