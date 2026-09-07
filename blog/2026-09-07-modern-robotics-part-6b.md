---
slug: modern-robotics-part-6b
title: Modern Robotics, Part 6B — Trajectories, Constraints, and Motion Planning
authors: [endi]
tags: [robotics, modern-robotics, kinematics, motion-planning]
description: A continuation of the kinematics-to-planning story, focused on trajectory generation, time scaling, constraints, and the geometry behind motion planning.
---

The previous part established the dynamic and control viewpoint: robot motion is shaped not only by geometry but also by inertia, gravity, force transmission, and task-space control. In practice, however, a robot must also decide how to move from one configuration to another in a way that is smooth, feasible, and safe.

This is the trajectory and planning problem.

<!-- truncate -->

## 1. A path is not the same as a trajectory

A path is a geometric curve in configuration space or task space. A trajectory is a path with timing.

For example, a path might be “go from pose A to pose B along a straight line,” but a trajectory must also specify

- when the robot starts,
- how fast it moves,
- when it slows down,
- and whether acceleration stays within limits.

A robot cannot follow a path without considering time. Otherwise, we may generate commands that are geometrically correct but dynamically impossible.

This is why trajectory generation is an essential step between kinematics and execution.

## 2. The role of time scaling

Suppose a path is parameterized by a scalar variable $s$, which may represent arc length or a path parameter. Then the robot motion along that path is determined by a time law

$$
s = s(t).
$$

The joint trajectory becomes

$$
q(t) = q(s(t)).
$$

Its derivatives are

$$
\dot{q}(t) = \frac{dq}{ds}\dot{s},
$$

and

$$
\ddot{q}(t) = \frac{d^2 q}{ds^2}\dot{s}^2 + \frac{dq}{ds}\ddot{s}.
$$

This decomposition is useful because it separates:

- geometric path shape $q(s)$,
- from timing law $s(t)$.

The timing law is what determines whether the motion respects velocity and acceleration bounds. This separation is one of the most important ideas in motion planning and trajectory generation.

## 3. Polynomial trajectories

A common way to generate smooth trajectories is to use polynomial interpolation. The simplest example is the cubic polynomial:

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3.
$$

The coefficients are chosen to match boundary conditions such as initial position, final position, and initial/final velocity.

For more smoothness, we use quintic polynomials:

$$
q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5.
$$

This allows us to satisfy both position and velocity constraints at the endpoints, and in some formulations also acceleration constraints.

The reason this is important is simple: a robot should not change motion abruptly. Smooth interpolation reduces jerk, vibration, and wear, and often makes the controller much easier to stabilize.

## 4. Why dynamics affects trajectory choice

Even if we can generate a path geometrically, the robot may still not be able to execute it at the desired speed.

The dynamic equations

$$
M(q)\ddot{q} + C(q,\dot{q})\dot{q} + g(q) = \tau
$$

impose constraints on what motion is feasible.

In other words, a path may be physically reachable in the kinematic sense but dynamically impossible under actuator limits. This is especially relevant in high-speed manipulation and heavy payload transport.

This is why trajectory generation is not just a geometric problem. It is simultaneously a dynamics and control problem.

## 5. Configuration space and obstacle avoidance

Motion planning is fundamentally about finding a feasible path in configuration space.

The configuration space is the set of all joint configurations. A configuration is valid if:

- it satisfies joint limits,
- it avoids collisions,
- and it stays within the feasible motion envelope.

This mapping turns a geometric problem—“avoid obstacles in the world”—into a search problem in a high-dimensional state space.

For a robot with many joints, the configuration space can be large and complicated. That is why exact planning is often impractical, and sampling-based methods become valuable.

## 6. Sampling-based planning

Two classic sampling-based planners are:

- PRM (Probabilistic Roadmap)
- RRT (Rapidly-exploring Random Tree)

These methods build a graph or tree of valid configurations and connect nearby samples while checking feasibility.

They are especially useful when the configuration space is high-dimensional and the obstacles are complex. In such settings, analytic planning is often not feasible.

The idea is simple but powerful:

- sample random configurations,
- keep those that are valid,
- connect them into a graph,
- then search for a path to the goal.

This has become a standard approach in robotics.

## 7. Task-space planning versus joint-space planning

A robot task is often specified in task space, such as moving the tool to a target pose or along a path in Cartesian space. But the robot itself is controlled in joint space.

This creates two natural planning paradigms:

### Task-space planning

A path is designed in the end-effector frame or world frame, often using straight lines, curves, or orientation interpolation.

This aligns directly with the operation we want the robot to perform.

### Joint-space planning

A path is designed directly in joint coordinates. This is often simpler for enforcing joint limits and actuator constraints.

The Jacobian links these two views because it maps joint-space motion to task-space twist and vice versa.

In practice, the best strategy often depends on the application: task-space motion for workspace goals, joint-space motion for actuator feasibility and safety.

## 8. Collision constraints are dynamic constraints too

A path is only useful if it is collision-free. But in practice, collision checking is not only geometric. Motion also needs to respect dynamic behavior and control margins.

For example, a trajectory may be collision-free at discrete sampled points but too aggressive in time, causing overshoot or large control effort. This is why planners often use safety margins and smoothness penalties.

This is also a reminder that planning and control are tightly coupled: a path that is valid in geometry may still be poor in control performance.

## 9. The role of optimization in motion planning

Modern planning often uses optimization rather than only sample-based search. In this setting, we define a cost function like

$$
J = \int_0^T \left(\|\dot{q}(t)\|^2 + \lambda \|\ddot{q}(t)\|^2 + \text{obstacle cost}\right) dt.
$$

This objective balances:

- smoothness,
- effort,
- obstacle avoidance,
- and perhaps trackability.

Optimization-based motion generation is highly effective in robotics, especially when trajectory quality matters as much as feasibility.

The idea is not to choose any valid path, but to choose a path that is both feasible and good.

## 10. Why planning depends on kinematics so deeply

The entire planning process depends on kinematics because the robot’s feasible motion is determined by its workspace and configuration constraints.

If a target pose is outside the reachable workspace, no planner can solve it without changing the task. If a path passes near a singular configuration, the planner may produce poor controllability. If a path requires extreme joint rates, the trajectory may be dynamically infeasible.

This is where the earlier theory becomes operationally important:

- screw axes define motion directions,
- Jacobians define local mobility,
- inverse kinematics defines reachable configurations,
- dynamic constraints determine feasible timing,
- and planning provides the path that satisfies all of them.

## 11. From path to execution

Once a feasible trajectory is planned, the controller executes it using tracking laws. The goal is to make the robot follow the planned motion while respecting real-world disturbances and actuator limitations.

This is where task-space control, inverse kinematics, and dynamic compensation all work together:

- the planner computes a reference trajectory,
- the controller tracks it,
- and the robot responds with the appropriate joint torques or rates.

This completes the loop from geometry to motion generation to actuation.

## 12. Final interpretation

The trajectory and planning problem is the point where motion theory becomes real behavior.

What started as the geometric description of rigid bodies ends in the ability to design and execute smooth, feasible, safe robot motion. The conceptual chain is therefore:

$$
\text{rigid-body geometry} \rightarrow \text{twists} \rightarrow \text{Jacobian} \rightarrow \text{IK} \rightarrow \text{dynamics} \rightarrow \text{trajectory} \rightarrow \text{planning}.
$$

This is the full architecture of modern robotics.

The crucial insight is that each layer is not separate. Each one depends on the previous one. Geometry creates the motion model, dynamics constrains the execution, and planning chooses how to use the available motion while respecting constraints.

That is why the Modern Robotics formulation is so powerful: it gives a unified view of robot motion from the smallest infinitesimal motion to the broadest motion-planning problem.
