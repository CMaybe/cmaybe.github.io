---
sidebar_position: 3
---

# Finite-Horizon MPC and the Condensed QP

## The Optimization Problem

At each control update, the controller receives the current state $\mathbf{x}_0$ and a velocity command. It then chooses ground-reaction forces for the next $N$ prediction steps.

The cost is

$$J = \sum_{k=0}^{N-1} \left( \|\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k\|_Q^2 + \|\mathbf{u}_k\|_R^2 \right).$$

The state evolves according to

$$\mathbf{x}_{k+1} = \mathbf{A}\mathbf{x}_k + \mathbf{B}\mathbf{u}_k + \mathbf{c}.$$

Here $\mathbf{u}_k$ contains the three force components for each of the four feet, so $\mathbf{u}_k \in \mathbb{R}^{12}$. The horizon uses $N = 16$ steps of 25 ms, for a total of 400 ms.

The optimization also enforces three physical requirements:

- A stance foot can only apply a force inside its friction limit.
- A swing foot applies zero ground force.
- The normal force of a stance foot is nonnegative and bounded.

## Eliminating the Predicted States

The state sequence does not need to be stored as an independent decision variable. Starting with the first step,

$$\mathbf{x}_1 = \mathbf{A}\mathbf{x}_0 + \mathbf{B}\mathbf{u}_0 + \mathbf{c}.$$

The second step is

$$\mathbf{x}_2 = \mathbf{A}\mathbf{x}_1 + \mathbf{B}\mathbf{u}_1 + \mathbf{c}.$$

Substituting the first equation into the second gives

$$\mathbf{x}_2 = \mathbf{A}^2\mathbf{x}_0 + \mathbf{A}\mathbf{B}\mathbf{u}_0 + \mathbf{B}\mathbf{u}_1 + \mathbf{A}\mathbf{c} + \mathbf{c}.$$

Repeating this substitution expresses every predicted state as an affine function of the initial state and the force sequence. Stack the forces into one vector:

$$\mathbf{U} = [\mathbf{u}_0^\top, \mathbf{u}_1^\top, \ldots, \mathbf{u}_{N-1}^\top]^\top.$$

For $N = 16$, this vector has $16 \times 12 = 192$ entries. Substituting the predicted states into the cost produces the quadratic form

$$J(\mathbf{U}) = \frac{1}{2}\mathbf{U}^\top H\mathbf{U} + \mathbf{g}^\top\mathbf{U} + \text{constant}.$$

The state variables have disappeared, but their dynamics are still represented by $H$ and $\mathbf{g}$.

## Tracking and Effort Weights

The state-tracking term penalizes deviation from the desired body motion:

$$J_{\mathrm{state}} = \sum_{k=0}^{N-1} (\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k)^\top Q (\mathbf{x}_k - \mathbf{x}^{\mathrm{ref}}_k).$$

The matrix $Q$ gives larger weights to important quantities such as body height and linear velocity. Smaller weights can be used for quantities that may drift temporarily without immediately threatening balance.

The effort term limits unnecessarily large forces:

$$J_{\mathrm{force}} = \sum_{k=0}^{N-1} \mathbf{u}_k^\top R\mathbf{u}_k.$$

Increasing $R$ generally produces smaller and smoother forces. Increasing $Q$ makes reference tracking more aggressive.

## Friction Constraints

For foot $i$, the Coulomb friction cone is

$$\sqrt{f_{i,x}^2 + f_{i,y}^2} \leq \mu f_{i,z}.$$

The implementation replaces this circular cone with four linear inequalities:

$$f_{i,x} + f_{i,y} \leq \mu f_{i,z}.$$

$$f_{i,x} - f_{i,y} \leq \mu f_{i,z}.$$

$$-f_{i,x} + f_{i,y} \leq \mu f_{i,z}.$$

$$-f_{i,x} - f_{i,y} \leq \mu f_{i,z}.$$

This inscribed pyramid is conservative. Forces accepted by the linear approximation are also inside the original friction cone.

## Contact Schedule

The gait schedule is known before the QP is assembled. For a swing foot, the controller sets

$$\mathbf{f}_{i,k} = \mathbf{0}.$$

For a stance foot, the controller applies the friction inequalities, the normal-force lower bound

$$f_{i,k,z} \geq 0,$$

and the upper bound

$$f_{i,k,z} \leq f_{\max}.$$

Because the contact schedule is fixed, the solver sees a convex quadratic program rather than a mixed-integer contact problem.

## QP Form

After condensation, the problem has the standard form

$$\underset{\mathbf{U}}{\operatorname{minimize}}\; \frac{1}{2}\mathbf{U}^\top H\mathbf{U} + \mathbf{g}^\top\mathbf{U}.$$

The force constraints can be written as

$$\mathbf{A}_{\mathrm{ineq}}\mathbf{U} \leq \mathbf{b}_{\mathrm{ineq}}.$$

The controller solves this QP with qpOASES. Warm-starting reuses the previous force sequence, which is effective because consecutive control problems differ only slightly.

Next: [Part 4](part-4) explains the gait schedule and the separate swing-leg controller.
