---
sidebar_position: 3
---

# Convex MPC for Quadruped Locomotion

Convex MPC is a structured set of notes on dynamic quadruped locomotion, from rigid-body dynamics and contact constraints to optimal ground-reaction-force planning and real-time gait control.

The series develops a convex formulation that plans forces over a fixed-timing gait while minimizing a finite-horizon tracking cost. The same theory is evaluated on the ANYmal C robot in MuJoCo, and the C++ implementation can be compiled to WebAssembly for interactive visualization.

## How to read this series

- **Rigid-body dynamics** sets up the equations of motion for a quadruped as a single rigid body with four point contacts.
- **Single-rigid-body model** simplifies the dynamics to a 13-state model and derives its linearization and discretization.
- **MPC formulation** converts trajectory tracking into a condensed quadratic program (QP) solved at 40 Hz.
- **Gait and swing control** explains how fixed-timing gait phases interact with force planning and independent swing-leg trajectories.
- **Practical implementation** discusses solver timing, numerical conditioning, parameter tuning, and deployment choices.
- **Series summary** brings the complete quadruped control loop together.

## Demo and source

- [Open the WebAssembly demo](https://cmaybe.github.io/Convex-MPC/)
- [View the source repository](https://github.com/CMaybe/Convex-MPC)
- [Read the complete series summary](/notes/convex-mpc/summary)
