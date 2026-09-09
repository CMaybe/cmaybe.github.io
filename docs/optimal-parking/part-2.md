---
title: Optimal Parking, Part 2 - RRT* as an Initial Path Planner
authors: [endi]
tags: [robotics, autonomous-driving, motion-planning, rrt]
description: Why RRT* is used to generate a collision-free geometric path before trajectory optimization.
---

Trajectory optimization is sensitive to its initial guess. Starting from an arbitrary interpolation can place the vehicle inside an obstacle or on a path that is difficult for a car-like model to follow. Optimal Parking therefore uses RRT* to construct an initial geometric route.

<!-- truncate -->

## 1. Sampling the search space

RRT* grows a tree from the initial position by sampling points in a bounded map. Each sample is connected to a nearby tree node when the local connection is valid. The tree gradually explores the free space instead of requiring a complete grid representation.

A sample $x_{rand}$ is associated with a nearest node $x_{near}$. A steering step produces a candidate point in the direction of the sample:

$$
x_{new} = \operatorname{Steer}(x_{near}, x_{rand}).
$$

The step distance limits how far one extension can travel, while the goal bias occasionally samples the goal directly.

## 2. Collision checking

A point-only collision test is insufficient for a vehicle. The planner represents the vehicle footprint and checks the proposed route against rectangular obstacles. A route is accepted only if its intermediate configurations maintain the required clearance.

This stage is geometric rather than dynamically exact. It gives the optimizer a meaningful route topology: pass on the left, pass on the right, or make the necessary reversing maneuver.

## 3. What makes RRT* different

RRT* rewires nearby nodes when a new connection offers a lower accumulated cost. If the current cost-to-come is $c(x)$, a candidate parent is useful when

$$
c(x_{parent}) + c(x_{parent}, x_{new}) < c(x_{new}).
$$

Rewiring improves path quality as more samples are added. In practice, the important role here is not to produce the final control sequence. It is to provide a collision-aware initial path for the continuous optimizer.

## 4. From path to optimizer seed

The RRT* result is resampled into the time-indexed state sequence expected by the trajectory optimizer. Position and heading come from the geometric path; velocity and steering-related quantities are initialized consistently or given a suitable default.

The result is still only an initial guess. It may contain sharp turns, uneven timing, or dynamics that are not yet satisfied. The next chapter turns this guess into a smooth trajectory through sequential quadratic programming.
