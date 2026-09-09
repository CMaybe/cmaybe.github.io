---
sidebar_position: 1
---

# Rigid-Body Dynamics of Quadrupeds

## The Model

A quadruped is modeled as a single rigid body with mass $m$ and inertia tensor $I$, supported at four point contacts. The body state comprises:

- Position: $\mathbf{p} \in \mathbb{R}^3$ (center of mass in world frame)
- Orientation: $\mathbf{R} \in SO(3)$ (rotation matrix, or Euler angles $\Theta$)
- Linear velocity: $\dot{\mathbf{p}} \in \mathbb{R}^3$
- Angular velocity: $\boldsymbol{\omega} \in \mathbb{R}^3$

## Equations of Motion

The Newton-Euler equations for a rigid body under gravity and contact forces:

$$\mathbf{a} = \ddot{\mathbf{p}} = \mathbf{g} + \frac{1}{m} \sum_{i=1}^{4} \mathbf{f}_i$$

$$\dot{\boldsymbol{\omega}} = I^{-1} \left( \sum_{i=1}^{4} (\mathbf{r}_i - \mathbf{p}) \times \mathbf{f}_i - \boldsymbol{\omega} \times I \boldsymbol{\omega} \right)$$

where:
- $\mathbf{g} = [0, 0, -g]^\top$ is gravitational acceleration
- $\mathbf{f}_i \in \mathbb{R}^3$ is the ground-reaction force at foot $i$
- $\mathbf{r}_i \in \mathbb{R}^3$ is the foot position in world frame
- The cross product operator $\times$ represents rotational dynamics

## Contact Constraints

For a foot in contact with the ground (foot $i$ in stance):

1. **Kinematic constraint:** No foot penetration
   $$z_i \geq 0$$

2. **Friction cone:** Forces must satisfy Coulomb friction
   $$\|\mathbf{f}_{i,xy}\| \leq \mu f_{i,z}$$
   where $\mu$ is the coefficient of friction, and $\mathbf{f}_{i,xy}$ is the horizontal component.

3. **No negative normal force:**
   $$f_{i,z} \geq 0$$

For a foot in swing (no contact):
$$\mathbf{f}_i = \mathbf{0}$$

## Simplification: Single Rigid Body

The single-rigid-body (SRB) model makes several assumptions:

1. **No joint compliance:** Legs are perfectly rigid (actually satisfied by stiff actuators)
2. **Instantaneous force transmission:** Contact forces propagate to body immediately
3. **All legs support single point:** We neglect the spatial extent of the body
4. **Fixed contact schedule:** Stance/swing transitions occur at predetermined times (addressed in gait scheduling)

Despite these approximations, the SRB model is remarkably accurate for quadrupeds at trotting speeds because:
- Leg mass is small relative to body mass (typically 10-15% per leg)
- Leg stiffness dominates, so compliance errors are negligible
- Contact forces dominate the dynamics compared to leg inertia

## Reference Dynamics

The MPC will track reference trajectories for position and orientation. We define:

- Reference velocity: $\dot{\mathbf{p}}^{\text{ref}}_k$ (commanded, saturated)
- Reference position: $\mathbf{p}^{\text{ref}}_k = \int_0^k \dot{\mathbf{p}}^{\text{ref}}_i dt$ (integrated reference)
- Reference heading: $\Theta^{\text{ref}}_k$ (from $\omega^{\text{ref}}_z$)
- Reference body height: $p^{\text{ref}}_{z,k}$ (fixed or modulated)

The controller solves for ground-reaction forces $\{\mathbf{f}_i\}$ that minimize:

$$J = \sum_{k=0}^{N-1} \left( \|\mathbf{x}_k - \mathbf{x}^{\text{ref}}_k\|_Q^2 + \|\mathbf{u}_k\|_R^2 \right)$$

subject to:
- Linearized dynamics at each timestep
- Friction cone and force bounds
- Contact schedule constraints from the fixed-timing gait

## Why This Works

The key insight is that **ground-reaction forces are the decision variables**, not joint torques:

- Direct: We optimize directly for what the world constrains (contact forces)
- Convex: Friction cones are convex sets; force tracking cost is quadratic
- Real-time: The resulting QP is small enough to solve in 5 ms at 40 Hz
- Robust: No explicit modeling of leg dynamics (which is complex and robot-specific)

Next: [Part 2](part-2) derives the discrete-time linear state-space form.
