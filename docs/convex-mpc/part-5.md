---
sidebar_position: 5
---

# Practical Implementation and Tuning

## Solver Real-Time Constraints

The MPC runs at **40 Hz** with a **25 ms deadline**. The QP solve must complete in under 5 ms to leave headroom for state estimation and logging.

### Problem Size

With $N=16$ timesteps and 12 force variables per step:
- **Decision variables:** $\mathbf{u} \in \mathbb{R}^{192}$
- **Equality constraints (dynamics):** $13 \times 15 = 195$
- **Inequality constraints (friction + bounds):** $\sim 100$

This is a medium-sized QP: 192 variables, ~300 constraints. Modern solvers handle this easily.

### Warm Starting

The QP solver (qpOASES) is initialized with the **previous solution**:

$$\mathbf{u}^*_{k} \approx \mathbf{u}^*_{k-1} + \Delta \mathbf{u}$$

Because the problem changes slowly (robot dynamics don't change frame-to-frame), the previous solution is a good initialization. Typical convergence: 1–3 iterations vs. 10–20 cold-start.

### Numerical Scaling

QP solvers are sensitive to poor conditioning. We normalize:

- **Forces:** Scale to $[0, 1]$ relative to robot mass and gravity
- **Positions:** Normalize to typical CoM displacements (few centimeters)
- **Velocities:** Scale by operating ranges ($\pm 0.5$ m/s)

This keeps Hessian condition number manageable ($\kappa < 1000$), avoiding numerical errors.

## Design Choices and Trade-offs

### Why Single Rigid Body?

- **Efficiency:** Scales as $O(1)$ vs. $O(n)$ for multi-body (where $n$ = number of joints)
- **Validity:** For trotting speeds, leg mass effects are $<10\%$ of body mass
- **Robustness:** No explicit leg modeling means controller works across robot variants

### Why Zero-Order Hold Discretization?

- **Simplicity:** Forces constant over 25 ms intervals
- **Reality:** Real controllers output constant torques between updates
- **Sufficiency:** 40 Hz replanning catches most disturbances

### Why Fixed-Timing Gait?

- **Convexity:** Predetermined contact schedule enables convex QP
- **Robustness:** No dependency on foot sensors; worst case is transient
- **Tradeoff:** Cannot adapt gait to rough terrain or obstacles

### Why Proportional MPC Cost (No Integral)?

- **Simplicity:** Avoids augmenting state with integral terms
- **Speed:** Reduces QP problem size
- **Tradeoff:** Small steady-state offset (~3 cm body height, ~3° pitch)

## Tuning Parameters

Runtime-adjustable parameters:

| Parameter | Effect | Range |
|-----------|--------|-------|
| $v_x, v_y, \omega_z$ | Velocity command | ±1.2, ±0.6, ±1.0 m/s, rad/s |
| Body height target | CoM reference height | ±10 cm |
| $Q$ weights | State tracking aggressiveness | 0–1000 (scale) |
| $R$ weights | Force smoothness emphasis | 0–1000 (scale) |
| $\mu$ (friction) | Coulomb coefficient | 0.3–1.5 (rubber on concrete ~0.7) |

## Performance Profiling

Typical timing breakdown (one 25 ms control cycle):

| Task | Duration |
|------|----------|
| State extraction from sensors | 0.5 ms |
| MPC matrix assembly | 1.5 ms |
| QP solve (warm-start) | 2–4 ms |
| Swing-leg control | 0.5 ms |
| Jacobian + torque mapping | 0.5 ms |
| **Total control** | ~5–7 ms |
| Physics simulation (1 kHz, 25 steps) | ~12 ms |
| **Grand total** | ~17 ms |
| **Headroom @ 40 Hz** | ~8 ms |

## Deployment Considerations

### Native Simulation
- Simulator: MuJoCo (physics, collision detection, rendering optional)
- Runtime: ~100 ms per real-world second
- Suitable for: Development, validation, CI/CD testing

### WebAssembly (Browser)
- Module size: ~3–5 MB (gzipped)
- Solve time: ~10–15 ms/step (overhead vs. native: ~10%)
- Suitable for: Interactive visualization, parameter experimentation

### Real Hardware
- Requires: Real-time OS, state estimator (IMU + kinematics)
- Jacobian torque mapping to motor commands
- Typical cycle time: 1–5 ms @ 40–200 Hz

## Known Limitations

- **Fixed gait:** Cannot adapt to slopes > ~20° or sparse footholds
- **Landing transients:** Brief force spikes when feet touch ground (no compliance model)
- **Steady-state offset:** Body height ~3 cm above reference, pitch ~3° at speed
- **Assumptions:** Single rigid body, no joint backlash, instantaneous force transmission

These are deliberate simplifications following the original 2018 IROS paper. More advanced variants exist but sacrifice simplicity and real-time guarantees.

Next: [Summary](summary) puts the complete control loop together.
