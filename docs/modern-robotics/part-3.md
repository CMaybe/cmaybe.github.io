---
title: Modern Robotics, Part 3 — Jacobians and End-Effector Velocity
authors: [jaegyeom]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: A detailed derivation of the Jacobian from screw axes and twists, showing how end-effector velocity is computed from joint rates and why singularities arise.
---

In the previous posts, we developed the geometric picture of rigid-body motion using twists and screw axes. We saw that a joint does not simply “move an angle”; instead, it generates a rigid-body motion through a screw axis, and a finite robot pose is obtained by exponentiating that motion generator.

The next question is immediate and practical:

> if the joint variables move at some rates $\dot{\theta}$, what is the end-effector velocity?

The answer is the Jacobian.

The Jacobian is the linear map that converts joint rates into spatial or body end-effector motion. It is one of the most important objects in robotics because it connects configuration space and task space.

<!-- truncate -->

## 1. From joint motion to end-effector twist

Let the robot configuration be described by joint variables

$$
\theta = \begin{bmatrix}
\theta_1 \\\ \theta_2 \\\ \vdots \\\ \theta_n
\end{bmatrix}.
$$

The end-effector pose is a rigid transformation

$$
T_{se}(\theta) \in SE(3).
$$

The kinematic question is: if the joints move according to

$$
\dot{\theta} = \begin{bmatrix}
\dot{\theta}_1 \\\ \dot{\theta}_2 \\\ \vdots \\\ \dot{\theta}_n
\end{bmatrix},
$$

what is the instantaneous twist of the end effector?

The answer is the Jacobian relation

$$
\nu = J(\theta) \dot{\theta},
$$

where $\nu$ is the end-effector twist and $J(\theta)$ is the Jacobian matrix.

This equation is an infinitesimal description of robot motion. It says that the end-effector velocity is a linear combination of the joint rates, with coefficients determined by the geometry of the mechanism.

This is the same pattern seen throughout mechanics:

- small displacements are linearized,
- configuration dependencies produce a linear map,
- the map is the Jacobian.

## 2. The screw-axis Jacobian

The most enlightening way to derive the Jacobian is from the screw-axis view.

For each joint $i$, we can associate a screw axis $\mathcal{S}_i$ in the appropriate frame. Then the instantaneous contribution of joint $i$ to the end-effector twist is

$$
\nu_i = \mathcal{S}_i \dot{\theta}_i.
$$

The total end-effector twist is the sum of all joint contributions:

$$
\nu = \sum_{i=1}^n \mathcal{S}_i \dot{\theta}_i.
$$

Collecting these contributions into a matrix gives

$$
\nu = \begin{bmatrix}
\mathcal{S}_1 & \mathcal{S}_2 & \cdots & \mathcal{S}_n
\end{bmatrix}
\begin{bmatrix}
\dot{\theta}_1 \\\ \dot{\theta}_2 \\\ \vdots \\\ \dot{\theta}_n
\end{bmatrix}.
$$

This matrix is the Jacobian:

$$
J(\theta) = \begin{bmatrix}
\mathcal{S}_1 & \mathcal{S}_2 & \cdots & \mathcal{S}_n
\end{bmatrix}.
$$

The columns are the joint motion generators. Therefore, the Jacobian is not abstract—it is literally the set of screw axes arranged as a matrix.

This is one of the key conceptual insights of Modern Robotics: the Jacobian is geometric, not ad hoc.

## 3. Spatial and body Jacobians

A subtle but crucial issue is the frame in which the twist is expressed.

### 3.1 Spatial Jacobian

If we express the end-effector twist in the space frame, the Jacobian is often called the spatial Jacobian $J_s$.

The instantaneous twist in the space frame satisfies

$$
\nu_s = J_s(\theta)\,\dot{\theta}.
$$

The columns of $J_s$ are the screw axes expressed in the space frame.

### 3.2 Body Jacobian

If we express the end-effector twist in the body frame, we get the body Jacobian $J_b$:

$$
\nu_b = J_b(\theta)\,\dot{\theta}.
$$

The two are related by the adjoint transformation:

$$
\nu_s = Ad_{T_{sb}}\,\nu_b,
$$

and therefore

$$
J_s = Ad_{T_{sb}} J_b.
$$

This relation is not merely cosmetic. It reflects the fact that the same physical motion can be represented in different coordinate frames. The format of the Jacobian depends on the chosen frame, but the underlying motion is invariant.

## 4. Why the Jacobian depends on configuration

The Jacobian is configuration-dependent because the screw axes themselves move with the robot.

A revolute joint axis in a fixed world frame depends on the current pose of the robot. So even if the mechanism is structurally the same, the columns of the Jacobian change as the manipulator moves.

This is why the Jacobian is not constant except in the simplest cases.

For a serial manipulator,

$$
J(\theta) = \begin{bmatrix}
\mathcal{S}_1(\theta) & \mathcal{S}_2(\theta) & \cdots & \mathcal{S}_n(\theta)
\end{bmatrix},
$$

where each $\mathcal{S}_i(\theta)$ is the current screw axis for joint $i$ expressed in the relevant frame.

This dependence on posture is what makes robot kinematics rich and challenging.

## 5. The Jacobian as a differential map

The Jacobian is the differential of the forward kinematics map:

$$
T_{se}: \mathbb{R}^n \to SE(3).
$$

If we linearize the kinematics near a configuration $\theta$, then small changes in the joint variables produce small motion in task space:

$$
\delta T \approx \hat{\nu} T,
$$

with

$$
\nu \approx J(\theta)\delta\theta.
$$

This gives a crucial interpretation:

- forward kinematics maps joint coordinates to a pose,
- the Jacobian maps infinitesimal joint changes to infinitesimal tool motion.

So the Jacobian is the local linear approximation of the nonlinear robot geometry.

## 6. Singularities and loss of mobility

A major reason Jacobians matter is that they reveal singularities.

If the Jacobian loses rank, then there exist nonzero joint velocities for which the end-effector twist is zero:

$$
J(\theta)\dot{\theta} = 0, \quad \dot{\theta} \neq 0.
$$

This means the robot can move in configuration space without producing motion in task space.

The condition is

$$
\det J(\theta) = 0,
$$

in the square-jacobian case.

Typical singularities include:

- joint axes aligning,
- end effector reaching a fully extended posture,
- wrist or elbow configurations creating a degenerate mapping.

At a singularity, the inverse kinematics and motion planning problem becomes ill-conditioned because the robot loses local controllability in some directions.

This is why the Jacobian is not merely a convenience—it is also a diagnostic of mechanical feasibility.

## 7. Example: planar 2R manipulator

Consider a planar 2R robot with link lengths $L_1$ and $L_2$. The joint variables are $\theta_1$ and $\theta_2$.

The end-effector position is

$$
x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2),
$$

$$
y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2).
$$

Differentiate with respect to time:

$$
\dot{x} = -L_1\sin\theta_1\dot{\theta}_1 - L_2\sin(\theta_1 + \theta_2)(\dot{\theta}_1 + \dot{\theta}_2),
$$

$$
\dot{y} = L_1\cos\theta_1\dot{\theta}_1 + L_2\cos(\theta_1 + \theta_2)(\dot{\theta}_1 + \dot{\theta}_2).
$$

This can be written as

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

The matrix here is the planar Jacobian. Its determinant is

$$
\det J = L_1L_2\sin\theta_2.
$$

This tells us the robot loses rank when

$$
\sin\theta_2 = 0,
$$

that is,

$$
\theta_2 = 0 \quad \text{or} \quad \theta_2 = \pi.
$$

At these configurations, the elbow is fully folded or fully extended, and the end-effector cannot move independently in all directions.

This example gives the intuition behind singularities: they are not mysterious—they occur exactly when the geometric mapping from joint motion to task-space motion becomes degenerate.

## 8. Geometric meaning of the Jacobian columns

Each column of the Jacobian corresponds to the instantaneous motion generated by one joint.

For a revolute joint,

$$
\mathcal{S}_i =
\begin{bmatrix}
\omega_i \\
-\omega_i \times q_i
\end{bmatrix},
$$

where $q_i$ is a point on the joint axis.

For a prismatic joint,

$$
\mathcal{S}_i =
\begin{bmatrix}
0 \\
v_i
\end{bmatrix},
$$

with $v_i$ the direction of translation.

Thus, the Jacobian is a geometric summary of all the instantaneous motion directions available to the end effector.

This is why screw theory and Jacobians are so naturally linked: the Jacobian is the assembled form of the motion generators defined by the robot’s geometry.

## 9. Why Jacobians are central to robotics

The Jacobian is the core object connecting geometry and control.

It appears in:

- velocity control,
- inverse kinematics,
- motion planning,
- manipulability analysis,
- trajectory optimization,
- dynamic modeling.

For example, if we want the end-effector to follow a desired twist $\nu_d$, we solve

$$
J(\theta)\dot{\theta} = \nu_d.
$$

If $J$ is square and invertible, then

$$
\dot{\theta} = J(\theta)^{-1}\nu_d.
$$

This is the simplest form of velocity control. If it is not square or not invertible, then we need pseudoinverse or constrained optimization methods.

This practical control formulation is an immediate consequence of the geometric formulation from the earlier posts.

## 10. A conceptual summary

The story so far is coherent and compact:

1. A rigid body’s motion is represented by a twist.
2. A joint defines a screw axis.
3. A finite motion is generated via the exponential map.
4. The end-effector twist is the sum of joint contributions.
5. The Jacobian collects these contributions into a matrix.
6. Singularities appear when the Jacobian loses rank.

This progression is exactly why Modern Robotics is so powerful: it transforms complex robot motion into a precise mathematical structure built from geometry, algebra, and linearization.

So when we say the Jacobian is important, we mean something very concrete:

$$
\boxed{\nu = J(\theta)\dot{\theta}}
$$

is the fundamental relation connecting configuration-space motion to task-space motion.

That compact formula is the bridge between kinematics and control.
