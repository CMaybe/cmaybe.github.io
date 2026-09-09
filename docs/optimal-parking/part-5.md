---
title: Optimal Parking, Part 5 - Obstacles, Bounds, and Feasibility
authors: [endi]
tags: [robotics, motion-planning, optimal-control, collision-avoidance]
description: How vehicle bounds, input limits, obstacle constraints, and penalties shape a feasible parking trajectory.
---

A trajectory is useful only when it is executable and safe. Optimal Parking therefore treats feasibility as a combination of vehicle limits, model consistency, terminal accuracy, and obstacle clearance.

<!-- truncate -->

## 1. Vehicle and input bounds

The planner constrains velocity and steering angle, as well as acceleration and steering rate. In compact form,

$$
\underline{z} \le z_k \le \overline{z},
$$

where $z_k$ may contain state or input variables.

These bounds prevent the optimizer from solving the parking problem by using unrealistic motion. Steering-rate bounds are especially important because a sequence with abrupt steering changes may satisfy position constraints while remaining impossible to execute.

## 2. Obstacle geometry

Each obstacle is described by a center, length, width, and heading. The vehicle footprint is evaluated along the trajectory rather than treating the vehicle as a point. A safety margin can enlarge the forbidden region to account for modeling error or a desired clearance.

The nonlinear collision relationship is locally approximated around the current trajectory. The optimizer then receives linearized obstacle constraints for the current QP.

## 3. Penalties and hard constraints

Some requirements are naturally expressed as hard bounds. Others are handled with penalties, especially when a temporarily infeasible iterate is useful for reaching a better local solution. A terminal penalty such as

$$
\rho_g \lVert x_N - x_{goal} \rVert^2
$$

encourages the final state to reach the goal. An obstacle penalty or constraint weight discourages the solver from entering forbidden geometry.

Increasing a penalty does not automatically solve every failure. Very large weights can make the QP poorly conditioned, while very small weights allow the optimizer to trade safety for other objectives. Tuning must be considered together with the initial route and the horizon.

## 4. Reading convergence

A successful solve should be checked beyond the solver's status. Useful signals include terminal error, dynamics residual, minimum obstacle clearance, control bounds, and the change in objective between iterations.

This matters because numerical convergence and a good parking maneuver are different claims. A solver can converge to a trajectory that is locally stationary but unsuitable due to an inadequate seed, an overly short horizon, or incompatible constraints.
