---
sidebar_position: 2
---

# The Single Rigid Body Model

## State Representation

The MPC state is 13-dimensional:

$$\mathbf{x} = [\Theta, \mathbf{p}, \boldsymbol{\omega}, \dot{\mathbf{p}}] \in \mathbb{R}^{13}$$

Decomposed:
- $\Theta = [\theta_z, \theta_y, \theta_x]$ — ZYX Euler angles (body orientation)
- $\mathbf{p} = [p_x, p_y, p_z]$ — body center-of-mass position (world frame)
- $\boldsymbol{\omega} = [\omega_x, \omega_y, \omega_z]$ — angular velocity (body frame)
- $\dot{\mathbf{p}} = [\dot{p}_x, \dot{p}_y, \dot{p}_z]$ — linear velocity (world frame)

## Continuous-Time State-Space Form

Writing the rigid-body equations as a nonlinear dynamical system:

$$\dot{\mathbf{x}} = \mathbf{f}(\mathbf{x}, \mathbf{u})$$

where the control input is the vector of ground-reaction forces:

$$\mathbf{u} = [\mathbf{f}_1, \mathbf{f}_2, \mathbf{f}_3, \mathbf{f}_4]^\top \in \mathbb{R}^{12}$$

The continuous dynamics are:

$$\dot{\Theta} = \mathbf{T}(\Theta) \boldsymbol{\omega}$$

$$\dot{\mathbf{p}} = \mathbf{v}$$

$$\dot{\mathbf{v}} = \mathbf{g} + \frac{1}{m} \sum_{i=1}^{4} \mathbf{f}_i$$

$$\dot{\boldsymbol{\omega}} = I^{-1} \left( \sum_{i=1}^{4} (\mathbf{r}_i - \mathbf{p}) \times \mathbf{f}_i - \boldsymbol{\omega} \times I \boldsymbol{\omega} \right)$$

where $\mathbf{T}(\Theta)$ is the orientation kinematics matrix.

## Linearization Around Equilibrium

For MPC, we linearize around a reference trajectory. Near a hovering equilibrium (zero velocity, level orientation):

$$\mathbf{x}_{k+1} = \mathbf{A} \mathbf{x}_k + \mathbf{B} \mathbf{u}_k + \mathbf{c}$$

The Jacobians are:

$$\mathbf{A} = \frac{\partial \mathbf{f}}{\partial \mathbf{x}} \bigg|_{\text{ref}}, \quad \mathbf{B} = \frac{\partial \mathbf{f}}{\partial \mathbf{u}} \bigg|_{\text{ref}}$$

Key insights:
- $\mathbf{A}$ captures orientation kinematics, gravity coupling, and gyroscopic terms
- $\mathbf{B}$ encodes how each contact force affects body acceleration and rotation
- Linearization is valid for small deviations (trotting speeds), not high-speed flips

## Discretization: Zero-Order Hold

The MPC runs at 40 Hz (25 ms timesteps). Assuming forces are held constant over each interval, we integrate:

$$\mathbf{x}_{k+1} = \int_{t_k}^{t_{k+1}} \mathbf{f}(\mathbf{x}(t), \mathbf{u}_k) \, dt$$

For linear systems:

$$\mathbf{x}_{k+1} = \left( I + \mathbf{A} \Delta t + \frac{(\mathbf{A} \Delta t)^2}{2} + \ldots \right) \mathbf{x}_k + \left( \mathbf{B} \Delta t + \mathbf{A} \mathbf{B} \frac{(\Delta t)^2}{2} + \ldots \right) \mathbf{u}_k + \mathbf{c}$$

Matrix exponential form:

$$\Phi(\Delta t) = e^{\mathbf{A} \Delta t}, \quad \Gamma(\Delta t) = \int_0^{\Delta t} e^{\mathbf{A} \tau} d\tau \, \mathbf{B}$$

giving:

$$\mathbf{x}_{k+1} = \Phi \mathbf{x}_k + \Gamma \mathbf{u}_k + \mathbf{c} \Delta t$$

## Foot Kinematics and Jacobians

The feet are located at positions in the body frame (from the robot's geometry):

$$\mathbf{r}_{i,\text{body}} = [x_i, y_i, z_i]^\top$$

World-frame position:

$$\mathbf{r}_i(\Theta, \mathbf{p}) = \mathbf{p} + \mathbf{R}(\Theta) \mathbf{r}_{i,\text{body}}$$

where $\mathbf{R}(\Theta)$ is the rotation matrix from Euler angles.

The Jacobian mapping body motion to foot motion:

$$\mathbf{J}_i = \begin{bmatrix} \frac{\partial \mathbf{r}_i}{\partial \Theta} & I_3 \\ \end{bmatrix}$$

This is needed to:
1. Compute foot velocities for swing-leg trajectory tracking
2. Map contact forces to body torques (via transpose)
3. Implement kinematic constraints

## Why Linearize and Discretize?

1. **Convexity:** Linear dynamics + quadratic cost = convex QP
2. **Stability:** Finite-horizon MPC with linear model is provably stable under mild conditions
3. **Computational speed:** Condensed QP with linear constraints solves in under 5 ms
4. **Validity range:** For trotting (±0.5 m/s, ±5° pitch), linearization errors stay under 10%

Without linearization, we'd need nonlinear optimization (much slower and no guaranteed convergence).

Next: [Part 3](part-3) converts this state-space model into the QP solved at each timestep.
