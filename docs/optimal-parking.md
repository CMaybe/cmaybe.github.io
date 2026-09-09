---
sidebar_position: 2
---

# Optimal Parking

Optimal Parking is a small autonomous-parking system that connects geometric path planning with numerical trajectory optimization. The planner starts with an initial path from RRT*, then refines that path through a sequence of quadratic programs while respecting the vehicle model, input bounds, and obstacle margins.

The same C++ planner can be built as a native library or compiled to WebAssembly for the browser demo.

## How to read this series

The chapters follow the planner's data flow:

- **Problem and vehicle model** defines the state, inputs, and parking objective.
- **RRT* initialization** finds a collision-free geometric route.
- **Optimal control** defines the objective, dynamics, and constraints for a feasible trajectory.
- **Trajectory optimization** turns that route into a smooth, dynamically feasible trajectory.
- **Constraints and tuning** explains obstacle avoidance, bounds, penalties, and convergence.
- **Implementation and WebAssembly** connects the C++ solver to the interactive demo.
- **Series summary** puts the complete planning loop into one picture.

## Demo and source

- [Open the WebAssembly demo](https://cmaybe.github.io/Optimal-Parking/)
- [View the source repository](https://github.com/CMaybe/Optimal-Parking)
