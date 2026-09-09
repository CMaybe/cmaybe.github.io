---
title: Optimal Parking Series Summary - From Sampling to Optimized Trajectory
authors: [endi]
tags: [robotics, autonomous-driving, motion-planning, trajectory-optimization]
description: A compact map of the Optimal Parking planner, from the kinematic bicycle model and RRT* seed to sequential QP refinement and browser execution.
---

Optimal Parking combines two kinds of reasoning. RRT* searches for a route through free space, while trajectory optimization turns that route into a smooth sequence that respects the car model and numerical constraints.

<!-- truncate -->

## The complete flow

The planner can be understood as the following pipeline:

$$
\text{scenario}
\rightarrow \text{kinematic model}
\rightarrow \text{RRT* path}
\rightarrow \text{state/input seed}
\rightarrow \text{linearized QPs}
\rightarrow \text{parking trajectory}.
$$

The scenario supplies poses, vehicle dimensions, obstacles, timing, bounds, and weights. The model defines which motions are possible. RRT* supplies a collision-aware route topology. The optimizer then improves that route locally.

## The central equations

The vehicle state and input are

$$
x = [p_x, p_y, \psi, v, \delta]^T, \qquad u = [a, \dot{\delta}]^T.
$$

The nonlinear model is discretized as

$$
x_{k+1} = f(x_k, u_k).
$$

Around the current trajectory, each SQP iteration uses a local approximation:

$$
\Delta x_{k+1} \approx A_k\Delta x_k + B_k\Delta u_k + r_k.
$$

The QP balances terminal accuracy, reference tracking, control effort, model consistency, and obstacle avoidance.

## What each layer contributes

- The **bicycle model** prevents arbitrary sideways motion.
- **RRT*** supplies a route when direct interpolation is blocked.
- **SQP and QP solving** smooth the route and enforce local constraints.
- **Bounds and penalties** express what the vehicle can safely execute.
- **WebAssembly** makes the same planner inspectable through an interactive browser interface.

The important design decision is the division of labor. Sampling handles global route discovery; local optimization handles continuous refinement. Neither layer needs to solve the entire problem alone.

## Practical reading order

Read Parts 1 and 2 to establish the model and the initial path. Parts 3 and 4 explain the numerical refinement and feasibility conditions. Part 5 follows the implementation into the WebAssembly demo.

- [Part 1 - Problem Definition and the Kinematic Bicycle Model](/notes/optimal-parking/part-1)
- [Part 2 - RRT* as an Initial Path Planner](/notes/optimal-parking/part-2)
- [Part 3 - Optimal Control and Trajectory Optimization](/notes/optimal-parking/part-3-optimal-control)
- [Part 4 - Sequential Quadratic Programming](/notes/optimal-parking/part-4)
- [Part 5 - Obstacles, Bounds, and Feasibility](/notes/optimal-parking/part-5)
- [Part 6 - C++ Architecture and the WebAssembly Demo](/notes/optimal-parking/part-6)
