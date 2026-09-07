---
slug: modern-robotics-part-5
title: Modern Robotics, Part 5 — Inverse Kinematics and Numerical Solvers
authors: [endi]
tags: [robotics, modern-robotics, kinematics, screw-theory]
description: A detailed explanation of inverse kinematics using Jacobian-based methods, analytic solutions, and iterative numerical strategies for robot pose solving.
---

Once we understand forward kinematics and the Jacobian, the next natural question is the inverse problem:

> given a desired end-effector pose, what joint variables realize it?

This is the inverse kinematics problem.

For most robots, inverse kinematics is nonlinear and often difficult to solve analytically. The geometry of the manipulator matters, and the choice of solution method depends heavily on whether the robot is simple, redundant, or highly constrained.

<!-- truncate -->

## 1. Forward kinematics versus inverse kinematics

Forward kinematics gives

$$
T_{se}(\theta) = T_{se}(\theta_1, \ldots, \theta_n).
$$

Inverse kinematics asks for a joint vector $\theta$ such that

$$
T_{se}(\theta) = T_d,
$$

where $T_d$ is the target rigid transformation.

This is often much harder than forward kinematics because the map from $\theta$ to $T$ is nonlinear and may be multi-valued. A robot may have:

- no exact solution,
- a finite number of exact solutions,
- infinitely many solutions if redundant,
- or only approximate numerical solutions.

This is one reason inverse kinematics is a central topic in robotics.

## 2. The geometry of IK

In many manipulators, inverse kinematics is easiest when the geometry admits a decomposition into simpler subproblems. For example, a 6-DOF manipulator may decompose into:

- position solve,
- orientation solve,
- wrist orientation alignment.

The structure of the mechanism matters. A robot with spherical wrist, for example, often has a cleaner analytic solution than a robot with arbitrary joint axes.

The core idea is to solve for joint variables that place the end effector at the desired position and orientation using the robot’s geometry rather than treating the whole problem as a black box.

## 3. Analytic IK for a simple planar arm

Consider a planar two-link arm with link lengths $L_1$ and $L_2$. The desired end-effector position is $(x, y)$.

The standard geometric relations are

$$
 x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2),
$$

$$
 y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2).
$$

Define the target radius

$$
 r = \sqrt{x^2 + y^2}.
$$

Then the elbow-angle relation follows from the law of cosines:

$$
\cos\theta_2 = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2L_1L_2}.
$$

Thus,

$$
\theta_2 = \operatorname{atan2}\left(\pm\sqrt{1 - c^2},\, c\right).
$$

This gives the two possible elbow configurations.

Then the base angle $\theta_1$ can be recovered as

$$
\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2).
$$

This is the classic analytic solution for a 2R manipulator. It is simple precisely because the geometry is low-dimensional and the kinematic structure is well understood.

The broader lesson is that analytic solutions exploit geometry directly. They are faster and more reliable than general numerical methods when available.

## 4. Why analytic solutions are not always possible

For general 6-DOF manipulators, analytic solutions can be quite difficult or impossible to derive in closed form.

The nonlinear constraints induced by pose requirements lead to polynomial equations of high degree. Even when one can derive formulas, they may be too cumbersome to use reliably in software.

This is where numerical methods become essential.

## 5. Iterative IK using the Jacobian

The Jacobian gives a direct way to update the joint variables incrementally toward the target pose.

Suppose the current pose is $T_{se}(\theta)$ and the desired pose is $T_d$. We want to solve for a small joint update $\Delta\theta$ such that the end-effector pose moves toward $T_d$.

A common formulation is

$$
J(\theta)\Delta\theta = \nu_e,
$$

where $\nu_e$ is the twist error between the current pose and the target pose.

Then we update the joint configuration by

$$
\theta \leftarrow \theta + \Delta\theta.
$$

This is the heart of Jacobian-based IK.

The error twist may be computed from the difference between the current and desired transforms. In differential form, the target motion is expressed as a velocity command that reduces the pose error.

This is a differential correction method: instead of solving directly, we repeatedly reduce the error using local linearization.

## 6. The pseudoinverse method

If the Jacobian is full rank, the least-squares update can be written as

$$
\Delta\theta = J(\theta)^{\dagger} \nu_e.
$$

This is the simplest iterative IK strategy. It computes the smallest-norm update that best reduces the pose error.

If the robot is redundant, we can also include a nullspace term:

$$
\Delta\theta = J^{\dagger}\nu_e + \left(I - J^{\dagger}J\right)\Delta\theta_0.
$$

This allows us to steer the solver toward preferred joint configurations while still satisfying the target pose.

This is valuable because IK often has infinitely many solutions. The solver should choose one that is physically desirable, such as avoiding joint limits or remaining away from singularities.

## 7. Damped least-squares and regularization

Near singularity, the pseudoinverse solution can become unstable. A common fix is the damped least-squares update:

$$
\Delta\theta = J^T(JJ^T + \lambda^2 I)^{-1}\nu_e,
$$

where $\lambda > 0$ is a damping parameter.

This acts like a regularization. It prevents the update from exploding when the Jacobian is poorly conditioned.

This is especially important in numerical IK, because as the target approaches a singular configuration, the solver may otherwise generate extremely large joint motions or fail to converge.

## 8. Newton-Raphson style IK

Another approach is to solve inverse kinematics by iterating on the error in the pose itself.

Let

$$
F(\theta) = T_{se}(\theta)^{-1}T_d.
$$

We want $F(\theta)$ to be the identity transform. Linearizing gives

$$
\delta\theta \approx J^{-1}(\theta) \xi,
$$

where $\xi$ is the twist corresponding to the residual error.

Then the update is

$$
\theta_{k+1} = \theta_k + \Delta\theta_k.
$$

This is a Newton-style update on the manifold of rigid motions. It is powerful but sensitive to initial conditions and near-singular configurations.

In practice, one often combines this with damping and a line search or a trust-region method to ensure stability.

## 9. The role of initial guesses

Numerical IK depends strongly on the initial configuration.

If the initial guess is close to the target, convergence is fast and stable. If it is far away, the solver may converge to a different branch or fail altogether.

This is a major reason why analytic methods are often preferred for known robot classes: they directly generate valid solutions without depending on a lucky initial guess.

However, numerical methods are more general and can handle robots where closed-form formulas are cumbersome or unavailable.

## 10. The challenge of multiple solutions

Inverse kinematics usually has multiple valid joint configurations for the same end-effector pose.

For example, the planar 2R arm had two elbow-up and elbow-down solutions. In a 6-DOF manipulator, there may be several branches corresponding to different wrist orientations or elbow postures.

This is not a defect of the formulation; it is a property of the geometry. The pose constraints are not enough to select one unique configuration unless extra criteria are imposed.

Common criteria include:

- minimizing joint displacement from a previous configuration,
- avoiding joint limits,
- maximizing distance from obstacles,
- preferring a specific elbow posture or wrist orientation.

This is why inverse kinematics is often paired with optimization or task-priority control.

## 11. From IK to control and planning

Inverse kinematics is not an isolated component. It sits at the junction of geometry and control.

Once we can compute a feasible pose-to-configuration mapping, we can:

- generate trajectories,
- track desired tool paths,
- avoid obstacles,
- and build controllers that respect kinematic constraints.

The Jacobian is central here because it gives the local linearization needed for iterative solutions, while the full pose map defines the target to be reached.

This is one reason the Modern Robotics viewpoint is so effective: it gives a common mathematical language across kinematics, motion generation, and control.

## 12. Summary

The inverse kinematics problem is fundamentally about solving a nonlinear system:

$$
T_{se}(\theta) = T_d.
$$

There are two broad paradigms:

1. analytic methods, using the structure of the mechanism,
2. numerical methods, using Jacobian-based iterative updates.

The Jacobian-based update is

$$
J(\theta)\Delta\theta = \nu_e,
$$

and when the inverse is not direct, we use

$$
\Delta\theta = J^{\dagger}\nu_e
$$

or a damped version to stabilize the solver.

This shows how the full theory built in the earlier parts comes together: the manipulator geometry is encoded by screw axes, differentiated into the Jacobian, and then used to solve the challenge of pose realization.

That is the true utility of Modern Robotics.
