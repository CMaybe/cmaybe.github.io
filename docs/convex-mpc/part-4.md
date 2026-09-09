---
sidebar_position: 4
---

# Gait and Swing-Leg Control

## The Diagonal Trot

A gait specifies which feet support the body and which feet move through the air. This series uses a fixed diagonal trot with a 400 ms period.

During phase A, the front-left and back-right feet are in stance. The other diagonal pair is in swing. During phase B, the pairs exchange roles.

At 40 Hz, each phase lasts eight control steps. The controller therefore knows the contact state for every foot at every prediction step before it builds the QP.

## Contact-Dependent Forces

A stance foot may produce a ground force. A swing foot may not. The swing-foot rule is

$$\mathbf{f}_{i,k} = \mathbf{0}.$$

For a stance foot, the normal force is nonnegative:

$$f_{i,k,z} \geq 0.$$

The horizontal force must remain inside the friction limit:

$$\sqrt{f_{i,k,x}^2 + f_{i,k,y}^2} \leq \mu f_{i,k,z}.$$

The QP uses the four-sided linear approximation described in [Part 3](part-3). Since the schedule is fixed, changing from stance constraints to swing constraints only changes the rows inserted for that time step. It does not introduce a discrete optimization variable.

## Why Use Fixed Timing?

A fixed schedule keeps the optimization problem small and convex. It also allows the controller to plan force transfers before a foot leaves or touches the ground.

The tradeoff is reduced terrain adaptability. A fixed trot cannot choose a new contact time when the terrain is very rough. Adaptive contact estimation would improve that behavior, but it would also add another decision layer.

## Swing-Leg Trajectory

The MPC plans the forces of stance feet. A separate Cartesian controller moves each swing foot toward its next foothold. Its desired foot force is

$$\mathbf{F}_i^{\mathrm{des}} = K_p(\mathbf{p}_i^{\mathrm{des}} - \mathbf{p}_i) + K_d(\dot{\mathbf{p}}_i^{\mathrm{des}} - \dot{\mathbf{p}}_i).$$

The corresponding joint torque is obtained with the Jacobian transpose:

$$\boldsymbol{\tau}_i = \mathbf{J}_i^\top \mathbf{F}_i^{\mathrm{des}}.$$

Gravity and other model-based terms can be added to this torque command. The separation is deliberate: the MPC stabilizes the body through stance forces, while the swing controller places the feet.

## Horizontal Foot Motion

Let $s$ run from zero at lift-off to one at touchdown. A simple horizontal path is

$$\mathbf{p}_{i,xy}^{\mathrm{des}}(s) = (1-s)\mathbf{p}_{i,xy}^{\mathrm{lift}} + s\mathbf{p}_{i,xy}^{\mathrm{target}}.$$

The path can be smoothed in time so that the foot begins and ends with a small velocity.

## Foot Clearance

The vertical path lifts the foot above the ground before touchdown. A quadratic Bezier path is

$$p_{i,z}^{\mathrm{des}}(s) = (1-s)^2p_{i,z}^{\mathrm{lift}} + 2(1-s)s h_{\mathrm{clear}} + s^2p_{i,z}^{\mathrm{target}}.$$

The clearance height $h_{\mathrm{clear}}$ is selected above the terrain. The controller can differentiate this expression to obtain a desired vertical velocity.

## Foothold Prediction

When the body moves forward, the next foothold should be placed ahead of the current body position. A first-order prediction is

$$\mathbf{p}_i^{\mathrm{target}} = \mathbf{p}_i^{\mathrm{ref}} + \frac{1}{2}\mathbf{v}_{\mathrm{CoM}}\Delta t_{\mathrm{swing}}.$$

The half factor uses the average body velocity during the swing rather than assuming that the peak velocity persists for the entire phase.

## Reference Motion

The desired body position is obtained by integrating the commanded velocity:

$$\mathbf{p}^{\mathrm{ref}}_{k+1} = \mathbf{p}^{\mathrm{ref}}_k + \mathbf{v}^{\mathrm{cmd}}_k\Delta t.$$

The desired heading is integrated in the same way:

$$\psi^{\mathrm{ref}}_{k+1} = \psi^{\mathrm{ref}}_k + \omega_z^{\mathrm{cmd}}\Delta t.$$

Saturation limits keep the reference motion inside the operating range of the linearized model.

## Two Control Levels

The controller has two different time scales:

| Level | Main task | Typical rate |
| --- | --- | --- |
| MPC | Balance and stance-force planning | 40 Hz |
| Swing controller | Foot trajectory tracking | Higher-rate joint servo |

The two levels exchange foothold and body-state information, but their responsibilities remain separate. This makes the controller easier to analyze and keeps the convex QP focused on body stability.

Next: [Part 5](part-5) discusses solver timing, numerical conditioning, and practical tuning.
