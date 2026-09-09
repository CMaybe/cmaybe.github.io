---
sidebar_position: 6
---

# Series Summary: Convex MPC for Quadruped Locomotion

## The Control Problem

A quadruped robot must maintain stability while executing velocity commands across uncertain terrain. The central challenge is that **ground contacts are discrete events** — feet turn on and off — creating nonlinear mode switches that traditional inverse kinematics cannot handle.

## The MPC Solution

We formulate a finite-horizon optimal control problem that **centralizes all decisions around ground-reaction forces**:

**Given:** Current body state $\mathbf{x}_0$ (position, orientation, velocities) and velocity command $\dot{\mathbf{p}}^{\text{cmd}}$

**Optimize:** Forces $\{\mathbf{f}_{i,k}\}$ at all four feet over a 400 ms horizon (16 × 25 ms steps)

**Minimize:** State tracking error + force effort
$$J = \sum_{k=0}^{15} \left( \|\mathbf{x}_k - \mathbf{x}^{\text{ref}}_k\|_Q^2 + \|\mathbf{u}_k\|_R^2 \right)$$

**Subject to:**
- Single-rigid-body dynamics (Part 1–2): $\mathbf{x}_{k+1} = \Phi \mathbf{x}_k + \Gamma \mathbf{u}_k + \mathbf{c}$
- Friction cones at feet: $\|\mathbf{f}_{i,xy}\| \leq \mu f_{i,z}$ (Part 3)
- Fixed-timing gait schedule: $\mathbf{f}_{i,k} = 0$ during swing (Part 4)

## Key Innovations

### 1. **Single Rigid Body Model (Part 1–2)**
- Simplifies quadruped as 13-state system (position, orientation, velocities)
- Assumes leg dynamics are fast → forces transmit instantaneously to body
- Valid for typical trotting speeds (|v| under 1 m/s)
- Reduces control complexity from multi-body to single-body

### 2. **Linearization and Discretization (Part 2)**
- Linearizes nonlinear dynamics around reference trajectory
- Discretizes at 40 Hz (25 ms intervals) with zero-order hold
- Enables convex optimization (linear constraints + quadratic cost)
- Linearization errors under 10% for trotting

### 3. **Condensed QP (Part 3)**
- Eliminates state variables → only 192 force variables
- Matrices $H$, $c$ implicitly encode full dynamics
- Solves in under 5 ms via qpOASES (warm-started)
- Convex problem guarantees global optimum

### 4. **Fixed-Timing Gait (Part 4)**
- Diagonal trot: alternates front-left/back-right with front-right/back-left
- Predicts contact schedule in advance → convex force constraints
- No foot sensors needed; robust to small timing errors
- Tradeoff: cannot adapt to rough terrain

### 5. **Two-Level Control (Part 4)**
- **Upper level (MPC, 40 Hz):** Plans ground-reaction forces for balance
- **Lower level (PD, 1 kHz):** Tracks swing-leg trajectories independently
- Clean separation: MPC handles "what forces?" + "when?" → swing control handles "where foot goes?"

## Performance

**Tracking accuracy (60 s runs):**
- Linear velocity: ±5% of command
- Yaw rate: ±10° over 20+ meter walk
- Lateral drift: under 1 mm per meter traveled
- Body height: Reference ± 3 cm

**Control timing:**
- MPC solve: 2–4 ms
- Total cycle: ~5–7 ms (25 ms budget)
- Headroom: ~8 ms @ 40 Hz planning rate

**Embodiment:**
- Tested on ANYmal C (28 kg quadruped with 12 DOF)
- Same code runs on MIT Cheetah 3 and other quadrupeds
- Compiles to WebAssembly for browser visualization

## Why This Approach Works

1. **Problem centering:** Optimizing forces directly (not joint angles) aligns with physics
2. **Convex formulation:** Friction cones are convex → no local minima, guaranteed convergence
3. **Real-time feasible:** 192-variable QP solves in 5 ms with warm-starting
4. **Modular:** Single-body model reusable across robot variants
5. **Robust:** Fixed gait eliminates sensor dependencies for feet contact

## Limitations and Extensions

**Current simplifications:**
- Single rigid body (ignores leg inertia)
- No contact detection (fixed timing can mismatch terrain)
- Proportional cost only (small steady-state errors)
- No integral action or disturbance rejection
- Assumes flat or gently sloped terrain

**Possible extensions:**
- Adaptive gait switching (bound, pace, gallop)
- Machine learning for terrain adaptation
- Contact state estimation with foot sensors
- Whole-body control (arms + legs)
- Learned dynamics models or cost functions

## Implementation Highlights

**Code structure:**
- **ConvexMPC/** — Simulator-independent controller (Eigen + qpOASES)
- **simulation/** — MuJoCo integration + headless CLI
- **wasm/** — Emscripten bindings for browser
- **web/** — React + Three.js interactive viewer

**Deployment options:**
- Native: 100× real-time simulation for testing
- WebAssembly: Interactive browser demo
- Hardware: Real-time capable (deterministic, predictable)

## Recommended Reading Order

1. **[Part 1](part-1)** — Physics foundation: why single rigid body, contact constraints
2. **[Part 2](part-2)** — Linearized dynamics: why we can solve a convex QP
3. **[Part 3](part-3)** — The QP problem: cost, constraints, condensation trick
4. **[Part 4](part-4)** — Gait and swing: how everything fits together in time
5. **[Part 5](part-5)** — Implementation: solver tricks, tuning, real-time performance
6. **This summary** — Big picture: why MPC, what works, what doesn't

## Source and References

**Repository:** [github.com/CMaybe/Convex-MPC](https://github.com/CMaybe/Convex-MPC)

**Key paper:**
> J. Di Carlo, P. M. Wensing, B. Katz, G. Bledt, and S. Kim, "Dynamic Locomotion in the MIT Cheetah 3 Through Convex Model-Predictive Control," *2018 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)*, pp. 7440-7447. doi: [10.1109/IROS.2018.8594448](https://doi.org/10.1109/IROS.2018.8594448)

**Dependencies:**
- Eigen 3.4+ (linear algebra)
- qpOASES (quadratic programming)
- MuJoCo 3.1+ (physics simulation)
- Emscripten (WebAssembly compilation)

This series demonstrates how modern optimal control—specifically convex model predictive control—enables real-time, provably-stable locomotion for complex legged robots. The approach trades model sophistication for computational efficiency and robustness, enabling dynamic walking at 40 Hz on commodity hardware.
