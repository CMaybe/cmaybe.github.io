---
title: Optimal Parking, Part 3 - Optimal Control and Trajectory Optimization
authors: [jaegyeom]
tags: [robotics, optimal-control, trajectory-optimization, optimal-parking]
description: The optimal-control formulation behind parking trajectories, including cost functions, constraints, MPC, and the role of SQP.
---

The vehicle model tells us which motions are possible, and RRT* gives us a route through free space. We still need a principled way to choose one trajectory from many possible trajectories. This is the role of optimal control.

Optimal Parking uses the language of optimal control to formulate the planning objective, then solves local approximations of that problem through sequential quadratic programs.

<!-- truncate -->

## 1. State, input, and dynamics

Let the vehicle state and control input be

$$
x_k = [p_{x,k}, p_{y,k}, \psi_k, v_k, \delta_k]^T,
\qquad
u_k = [a_k, \dot{\delta}_k]^T.
$$

After discretizing the kinematic bicycle model with sampling time $T_s$, the trajectory must satisfy

$$
x_{k+1} = f(x_k, \nu_k).
$$

This equality is a model constraint. A candidate trajectory that reaches the parking space but violates it is not a valid car motion.

## 2. The finite-horizon objective

Over a horizon of $N$ steps, a typical objective combines running cost and terminal cost:

$$
J = \sum_{k=0}^{N-1}
\left(
\lVert x_k - x_k^{ref} \rVert_Q^2
+ \lVert \nu_k \rVert_R^2
\right)
+ \lVert x_N - x_{goal} \rVert_{Q_f}^2.
$$

The running cost can keep the trajectory near a reference path and discourage large control effort. The terminal cost makes the final pose and state approach the parking target.

The matrices $Q$, $R$, and $Q_f$ are not cosmetic parameters. They express the priorities of the planner. Increasing the terminal weight emphasizes reaching the goal; increasing the input weight favors smoother, less aggressive controls.

## 3. Constraints are part of the problem

The optimization is subject to several constraints:

$$
\underline{x} \le x_k \le \overline{x},
\qquad
\underline{u} \le u_k \le \overline{u},
$$

as well as the discrete dynamics and obstacle-clearance conditions. Vehicle dimensions and safety margins connect the geometric obstacle representation to the state trajectory.

This is why trajectory optimization is more than smoothing a polyline. It searches for a trajectory that is simultaneously close to the goal, consistent with the vehicle, and acceptable in the environment.

## 4. Relationship to MPC and SQP

Model predictive control repeatedly solves a finite-horizon optimal-control problem, executes only the first part of the solution, and then replans from the measured state. The current Optimal Parking workflow is better described as trajectory optimization: it solves a parking maneuver over a planned horizon and returns the resulting trajectory for visualization or execution.

The underlying nonlinear problem is difficult to solve directly. SQP addresses it by repeatedly constructing a local quadratic program. Around the current trajectory,

$$
\Delta x_{k+1}
\approx A_k \Delta x_k + B_k \Delta u_k + r_k.
$$

The QP is solved, the trajectory is updated, and the dynamics and constraints are linearized again. The next chapter describes this QP iteration in implementation detail.

## 5. The division of labor

The planner combines global and local methods because they solve different parts of the problem:

- RRT* searches for a route and helps choose the route topology.
- Optimal control defines what makes a trajectory desirable and feasible.
- SQP converts the nonlinear local problem into a sequence of QPs.
- OSQP solves those QP subproblems efficiently.

Keeping these roles separate makes the architecture easier to reason about. Sampling supplies a meaningful initial guess; optimal control supplies the objective and constraints that refine it.
