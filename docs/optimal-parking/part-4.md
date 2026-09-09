---
title: Optimal Parking, Part 4 - Sequential Quadratic Programming
authors: [endi]
tags: [robotics, trajectory-optimization, optimal-control, optimal-parking]
description: How the planner refines an initial route through sequential quadratic programs solved with OSQP.
---

RRT* provides a route, but it does not directly provide a smooth control sequence. The next layer solves a trajectory optimization problem over the state sequence $x_0, \ldots, x_N$ and input sequence $u_0, \ldots, u_{N-1}$.

<!-- truncate -->

## 1. The nonlinear optimization problem

The optimizer balances several goals:

- reach the terminal pose,
- stay close to the vehicle dynamics,
- avoid obstacles,
- keep velocity and steering within bounds,
- avoid unnecessarily large inputs.

A representative objective is

$$
J = \sum_{k=0}^{N-1} \left(\lVert x_k - x_k^{ref} \rVert_Q^2 + \lVert u_k \rVert_R^2\right)
+ \rho_g \lVert x_N - x_{goal} \rVert^2
+ \rho_o C_{obs}(x).
$$

The exact weights determine how strongly the solver prioritizes tracking, smoothness, terminal accuracy, and obstacle clearance.

## 2. Linearizing around the current trajectory

The bicycle dynamics are nonlinear because of $\sin\psi$, $\cos\psi$, and $\tan\delta$. Around the current iterate $(\bar{x}_k, \bar{u}_k)$, the dynamics are approximated by

$$
\Delta x_{k+1} \approx A_k\Delta x_k + B_k\Delta u_k + r_k.
$$

Here $A_k$ and $B_k$ are local Jacobians, and $r_k$ captures the linearization residual. This approximation converts the local subproblem into a quadratic program.

## 3. The sequential loop

One optimization iteration follows this pattern:

1. Linearize the dynamics and obstacle constraints around the current trajectory.
2. Build the quadratic objective and bounds.
3. Solve the QP with OSQP.
4. Apply the state and input update.
5. Recompute the nonlinear trajectory and residuals.
6. Repeat until the iteration limit or convergence condition is reached.

This is SQP-like behavior: each QP is easier to solve than the original nonlinear problem, while the repeated relinearization moves the solution toward a feasible trajectory.

## 4. Why a QP solver is useful

Quadratic programming makes the local problem explicit and computationally manageable. OSQP handles the sparse quadratic objective and linear constraints while exposing iteration and convergence information to the surrounding planner.

The method is local, so the RRT* seed still matters. A good seed gives the sequence of QPs a feasible route topology; the optimizer then focuses on smoothness, bounds, and local geometry.
