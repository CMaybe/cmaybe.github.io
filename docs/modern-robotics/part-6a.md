---
title: Modern Robotics, Part 6A — Dynamics, Control, and Motion Generation
authors: [endi]
tags: [robotics, modern-robotics, kinematics, motion-planning]
description: A deep-dive connecting kinematics, twist-based motion generation, and dynamics to task-space control and robot motion generation.
---

The previous posts developed the kinematic picture of robots in terms of twists, screw axes, Jacobians, and inverse kinematics. At this point, we have a strong geometric understanding of how a robot’s motion is generated.

The next step is to place that understanding in a dynamic and planning context.

A robot does not only need to reach a target pose. It also needs to move smoothly, track a trajectory, satisfy constraints, and do so with control signals that respect the system’s physics.

That is the domain of dynamics and motion planning.

<!-- truncate -->

## 1. Kinematics is not enough

Kinematics tells us how a robot’s pose changes with its joint variables. But control and planning also require knowledge of how motion is produced by forces and torques.

The natural sequence is:

1. position and orientation of the end effector are described by a transformation,
2. instantaneous motion is described by a twist,
3. the Jacobian maps joint rates to task-space velocity,
4. dynamics describes how forces and torques produce joint acceleration,
5. planning generates trajectories that are feasible, smooth, and collision-free.

This progression is the modern robotics pipeline.

## 2. A robot is a constrained mechanical system

The manipulator dynamics are often written in the standard form

$$
M(\theta)\ddot{\theta} + C(\theta, \dot{\theta})\dot{\theta} + g(\theta) = \tau,
$$

where:

- $M(\theta)$ is the inertia matrix,
- $C(\theta, \dot{\theta})\dot{\theta}$ captures Coriolis and centrifugal effects,
- $g(\theta)$ is the gravity term,
- $\tau$ is the joint torque vector.

This equation says that the effect of applied torques is mediated by inertia, geometry, and gravity. It is a dynamic statement that supplements the kinematic map.

From a motion-planning perspective, the practical significance is that the robot cannot accelerate arbitrarily. The joint-space dynamics impose constraints on how quickly and how sharply the robot can move.

## 3. The dynamic role of the Jacobian

The Jacobian connects joint-space motion to task-space motion, and the same structure appears in dynamics.

A task-space force or wrench $F$ is related to joint torques by the transpose Jacobian:

$$
\tau = J(\theta)^T F.
$$

This relation is fundamental. It says that a wrench applied at the end effector corresponds to equivalent joint torques according to the geometry of the manipulator.

This is a key link between kinematics and dynamics. The Jacobian determines how task-space forces map into joint-space torques, and therefore how the robot can resist or generate motion in the environment.

## 4. Task-space dynamics

The same logic can be expressed in task space. The kinetic relationship can be written as

$$
\Lambda(\theta)\dot{\nu} + \mu(\theta, \dot{\theta}) + p(\theta) = F,
$$

where $\Lambda$ is the task-space inertia matrix, $\mu$ accumulates velocity-dependent terms, and $p$ is the gravity-related wrench.

This formulation is often useful for operational-space control, because the desired motion is naturally specified in task space.

The basic idea is the same as before: task-space commands are transformed into joint-space actuation through the Jacobian and the dynamic model.

## 5. Trajectory generation: from points to smooth motion

Once a target pose is known, the robot must follow a feasible motion over time. This is the trajectory generation problem.

A trajectory is not just a sequence of poses; it is a time-parametrized path that includes smoothness, velocity limits, and acceleration limits.

A common choice is a polynomial trajectory. For example, a cubic polynomial in time can match boundary conditions:

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3.
$$

The coefficients are determined by the initial and final positions and velocities.

For higher smoothness, quintic polynomials are used:

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5.
$$

These allow us to satisfy position, velocity, and acceleration at the endpoints.

This matters because a robot should not jump between pose targets; it should move smoothly and avoid excessive wear, vibration, and instability.

## 6. Time parametrization and motion constraints

A path alone is not enough. The robot must also respect time-dependent limits.

If a path is parameterized by arc length $s$, then we can define a timing law $s(t)$.

The total velocity along the path is

$$
\dot{q}(t) = \frac{dq}{ds}\dot{s}(t).
$$

Similarly,

$$
\ddot{q}(t) = \frac{d^2 q}{ds^2}\dot{s}^2 + \frac{dq}{ds}\ddot{s}.
$$

This reveals a general planning principle: the path geometry and the time scaling are separate design choices, and both affect feasibility.

If a trajectory moves too fast, the actuator limits or dynamic constraints may be violated. If it moves too slowly, it may be impractical. Planning seeks a balance between feasibility and efficiency.

## 7. The role of motion planning

Motion planning is the problem of finding a feasible path from an initial configuration to a goal configuration while respecting constraints.

This usually means accounting for:

- obstacle avoidance,
- joint limits,
- velocity and acceleration limits,
- collision constraints,
- dynamic feasibility.

In broad terms, motion planning methods fall into a few categories:

- graph-based planning,
- sampling-based planning,
- optimization-based planning,
- reactive control approaches.

Sampling-based methods such as PRM and RRT are especially important in high-dimensional spaces where exact geometric planning is impractical.

The key idea is always the same: the planner searches configuration space while preserving feasibility with respect to geometry and constraints.

## 8. Collision avoidance and configuration space

One of the deepest concepts in motion planning is configuration space.

The configuration space is the set of all robot joint configurations. A configuration is valid if it does not collide with obstacles and satisfies joint limits.

This converts a geometric obstacle problem into a state-space planning problem.

If the robot has $n$ joints, the configuration space is typically high-dimensional. Searching it directly is expensive, which is why planning often relies on sampling, heuristics, or decompositions of the task.

This is also where kinematics and task-space intuition meet actual system feasibility: the robot may be able to reach a pose in task space, but it may not be able to do so without colliding with the environment.

## 9. Planning in task space versus joint space

There are two common planning viewpoints:

### 9.1 Joint-space planning

Joint-space planning works directly in the variables $q$.

This is often simpler for constraints such as joint limits and actuator limits, because those limits are naturally expressed in joint coordinates.

### 9.2 Task-space planning

Task-space planning works in the end-effector pose or twist space.

This is often more intuitive because the robot task is specified in Cartesian coordinates. For example, “move the tool along a straight line while keeping orientation fixed” is a task-space statement.

However, task-space paths may create joint-space complications such as singularities or unreachable configurations.

The Jacobian provides the bridge between these viewpoints, because it converts joint motion into task-space motion and vice versa.

## 10. Force control and interaction

Not all robot tasks are purely kinematic. In many industrial and research settings, the robot needs to interact with the environment, apply forces, or maintain contact.

In force control, the system may regulate a contact wrench rather than a pose alone. The relation

$$
\tau = J^T F
$$

again becomes central.

If we want the robot to push with a desired force, then the controller uses the Jacobian to map that force into joint torques. This is the dynamic counterpart of velocity control.

This makes the geometric formulation even more powerful: the same matrix $J$ governs both motion and force transmission.

## 11. The full robot pipeline

The complete robot workflow can now be viewed as a coherent sequence:

1. model the robot geometry using rigid transforms,
2. represent motion using twists and screw axes,
3. compute the Jacobian,
4. solve forward and inverse kinematics,
5. design trajectories with smooth timing,
6. enforce dynamics and actuator limits,
7. plan collision-free paths in configuration space,
8. use Jacobian-based control for motion or force tracking.

This is the central architecture of modern robotics.

## 12. Closing intuition

The recurring theme across all these parts has been the same:

- geometry provides the structure,
- algebra makes it computable,
- dynamics gives it physical meaning,
- planning uses it to create feasible motion.

The screw-axis and Jacobian viewpoint is therefore not just a nice way to describe robot motion. It is the unifying mathematical language of modern robotics.

The full story can be summarized succinctly:

$$
T_{se}(\theta) \in SE(3),
$$

$$
\nu = J(\theta)\dot{\theta},
$$

$$
\tau = J(\theta)^T F,
$$

and then planning and control use these relations to produce motion that is feasible, smooth, and task-aware.

This is the deep conceptual bridge between robot geometry and robot intelligence.
