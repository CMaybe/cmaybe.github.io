---
title: Optimal Parking, Part 1 - Problem Definition and the Kinematic Bicycle Model
authors: [jaegyeom]
tags: [robotics, autonomous-driving, motion-planning, optimal-parking]
description: The parking problem, its state and input variables, and the five-state kinematic bicycle model used by the planner.
---

Autonomous parking is a planning problem under tight geometric constraints. The vehicle must reach a target pose, avoid obstacles, and produce controls that a car-like system can actually execute.

This series follows the structure of the Optimal Parking project: RRT* proposes a geometric route, and trajectory optimization refines it into a smooth motion.

<!-- truncate -->

## 1. The parking objective

A parking scenario is defined by an initial pose, a goal pose, the vehicle dimensions, and a set of rectangular obstacles. A useful goal is not only a final position, but a complete terminal state:

$$
x_N \approx x_{goal}.
$$

The planner must also keep every intermediate vehicle footprint away from obstacles. This makes parking different from interpolating between two points: the vehicle has nonzero size and cannot move sideways freely.

## 2. State and input

The project uses a five-state kinematic model. A state can be written as

$$
x = [p_x,\ p_y,\ \psi,\ v,\ \delta]^T,
$$

where $p_x$ and $p_y$ are the vehicle position, $\psi$ is heading, $v$ is longitudinal velocity, and $\delta$ is the steering angle. The control input is

$$
u = [a,\ \dot{\delta}]^T,
$$

with acceleration $a$ and steering-rate input $\dot{\delta}$.

## 3. Kinematic bicycle dynamics

Using wheelbase $L$, the continuous-time model is

$$
\dot{p}_x = v\cos\psi, \qquad
\dot{p}_y = v\sin\psi,
$$

$$
\dot{\psi} = \frac{v}{L}\tan\delta, \qquad
\dot{v} = a, \qquad
\dot{\delta} = u_\delta.
$$

This model captures the most important nonholonomic property of a car: its velocity is constrained by its heading. The vehicle cannot instantaneously translate in an arbitrary direction.

## 4. Discretization

For a sampling time $T_s$, the optimizer works with a discrete sequence

$$
x_{k+1} = f(x_k, u_k).
$$

The horizon contains the states and inputs that will become the candidate parking trajectory. The choice of $T_s$ and horizon length determines the compromise between planning detail and computation cost.

The next chapter explains why this nonlinear problem is first given a geometric initial guess by RRT*.
