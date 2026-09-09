---
title: Modern Robotics, Part 4 — Manipulability and Velocity Control
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: A deeper look at Jacobian-based velocity control, manipulability measures, and pseudoinverse methods for achieving task-space motion under constraints.
---

The Jacobian is not only a mathematical object; it is the engine behind real robot motion control. Once we know that

$$
\nu = J(\theta)\dot{\theta},
$$

we can ask the next practical question:

> given a desired end-effector twist $\nu_d$, how should the joint rates be chosen?

This is the essence of velocity control.

The answer depends on whether the Jacobian is square, tall, or rank deficient. This leads naturally to the concepts of pseudoinverse control, manipulability, and task-space conditioning.

<!-- truncate -->

## 1. The basic velocity-control problem

Suppose we want the end effector to move with some desired twist

$$
\nu_d = \begin{bmatrix}
\omega_d \\\ v_d
\end{bmatrix}.
$$

Then we want joint rates satisfying

$$
J(\theta)\dot{\theta} = \nu_d.
$$

If $J$ is square and nonsingular, the solution is immediate:

$$
\dot{\theta} = J(\theta)^{-1}\nu_d.
$$

This is the most direct form of Jacobian-based control. It is elegant, but it only works when the robot is in a configuration where $J$ is invertible.

In reality, many manipulators are redundant, underactuated, or near singularity. Then a single exact inverse may not exist or may be numerically unstable.

## 2. Redundancy and the pseudoinverse

If the Jacobian is not square, we can replace the inverse by the Moore–Penrose pseudoinverse:

$$
\dot{\theta} = J^{\dagger}(\theta)\nu_d.
$$

This provides the minimum-norm solution to the least-squares problem

$$
\min_{\dot{\theta}} \|\dot{\theta}\|^2
\quad \text{subject to} \quad
J\dot{\theta} \approx \nu_d.
$$

This is one of the most important practical tools in robotics. It allows us to compute a joint-rate command even when there are more joints than task-space constraints.

The pseudoinverse is especially useful in redundant manipulators, where extra degrees of freedom can be used for secondary objectives.

For example, a robot with $n>6$ joints can track a desired end-effector twist while also optimizing a secondary objective such as avoiding joint limits, keeping the elbow clear of obstacles, or maximizing dexterity.

## 3. The generalized inverse with secondary objectives

In a redundant robot, the pseudoinverse solution is not unique. We can enforce an objective by adding a term:

$$
\dot{\theta} = J^{\dagger}\nu_d + \left(I - J^{\dagger}J\right)\dot{\theta}_0.
$$

Here, $\dot{\theta}_0$ is a preferred joint-rate direction, and the projection term

$$
I - J^{\dagger}J
$$

projects that preferred motion into the nullspace of the Jacobian.

This means the robot can continue to satisfy the end-effector motion while modifying internal joint motion in a controlled way.

The interpretation is very important:

- the task-space command is enforced by $J^{\dagger}\nu_d$,
- the nullspace term shapes the internal motion without disturbing the end-effector task.

This is a central idea in redundant manipulation and is widely used in practical robotics systems.

## 4. Manipulability: how well can a robot move?

The Jacobian tells us not only a direction of motion, but also how easy or difficult it is to generate motion in different directions. To quantify this, we use manipulability.

For a given configuration $\theta$, we define the manipulability measure using the singular values of $J$:

$$
\sigma_1, \sigma_2, \ldots, \sigma_m.
$$

A common scalar measure is

$$
\mu = \sqrt{\det(JJ^T)}
$$

for a square Jacobian, or more generally

$$
\mu = \sqrt{\det(JJ^T)}
$$

when the matrix is full row rank.

This measure is large when the robot is well-conditioned and small when the robot is close to a singularity.

Another useful metric is the condition number:

$$
\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}}.
$$

If $\sigma_{\min}$ is very small, then the robot is close to a singular configuration and some directions of motion become very difficult to realize.

This is exactly why manipulability is so valuable: it quantifies motion quality, not just motion possibility.

## 5. Singularity and numerical instability

Near singularities, the Jacobian becomes ill-conditioned. This leads to large joint rates for modest end-effector velocities:

$$
\dot{\theta} \approx J^{-1}\nu_d.
$$

If $J$ has a very small singular value, then a small task-space command creates a large joint-rate response.

This is one reason why control systems must include damping or regularization near singular configurations.

The damped least-squares solution is

$$
\dot{\theta} = J^T(JJ^T + \lambda^2 I)^{-1}\nu_d,
$$

where $\lambda > 0$ is a damping factor.

This avoids exploding joint speeds and provides a more stable command even when the Jacobian is poorly conditioned.

This is a practical engineering correction to a theoretically elegant formula: in the real world, singularities are not rare enough to ignore.

## 6. Understanding the geometry of manipulability

The singular values of the Jacobian describe how the robot maps joint velocity into task-space velocity. In geometric terms, they tell us the amount of end-effector motion attainable in each direction.

If the singular values are all large and similar, the robot is well-conditioned and can move isotropically in task space.

If one singular value is tiny, the robot has a preferred direction of high mobility and a poor direction of motion. That means it can move easily in some directions but poorly in others.

This links directly to the geometry of the manipulator:

- joint axes that are aligned reduce mobility,
- links arranged in certain postures create anisotropic motion,
- near-singular postures destroy local controllability.

This is a deeply geometric viewpoint. The Jacobian does not merely encode algebra; it encodes the actual directional mobility of the mechanism.

## 7. The relation to screw geometry

The Jacobian columns are screw axes, and each singular value is a measure of how strongly the corresponding joint motion contributes to task-space motion.

In this sense, manipulability is not detached from the screw-axis formulation. It is simply a way to summarize the structure of the screw-axis matrix.

If the screw axes are well spread in task space, the robot has strong dexterity. If they become nearly linearly dependent, the robot loses directionality and reaches singularity.

Thus, the geometric and algebraic views are the same statement in different languages:

- screw axes describe motion directions,
- Jacobian rank and singular values describe how independent those directions are.

## 8. Closed-loop task-space control

In practice, robot control is often implemented as a closed-loop system. The goal is to track a desired pose or trajectory $T_d(t)$.

At each instant, we compute the error in task space, often as a twist error:

$$
\nu_e = \nu_d - \nu.
$$

Then we update the joint commands using

$$
\dot{\theta} = J^{\dagger}(\theta)\nu_e + \left(I - J^{\dagger}J\right)\dot{\theta}_0.
$$

This acts like a feedback law: if the end effector is not moving as desired, the control law corrects it.

A simple proportional form is often used:

$$
\nu_e = K_p e,
$$

where $e$ is the pose error and $K_p$ is a gain matrix. The joint-rate command then follows from the Jacobian.

This is the standard logic behind operational-space control and task-space controllers in modern robotics.

## 9. Why the Jacobian remains central

By this point, the Jacobian has emerged as the central object in robot kinematics and control.

It tells us:

- how small joint motions generate end-effector motion,
- how to compute desired joint rates,
- how to measure dexterity,
- when the system becomes singular,
- and how to build controllers that act in task space.

This is why the Jacobian is often described as the core of modern robot kinematics. It connects geometry and control in the most direct way possible.

The theoretical foundation was built in the previous posts through twists and screw axes; here we see how it becomes actionable in real controllers.

## 10. A compact summary

The central equations of this part are:

$$
\nu = J(\theta)\dot{\theta},
$$

$$
\dot{\theta} = J^{\dagger}\nu_d,
$$

and, when redundancy is present,

$$
\dot{\theta} = J^{\dagger}\nu_d + (I - J^{\dagger}J)\dot{\theta}_0.
$$

Together, these equations show how the geometric structure of the robot becomes a control algorithm.

The Jacobian is therefore not merely descriptive. It is operational.

That is the practical power of Modern Robotics.
