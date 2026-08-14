---
title: "AP Mechanics — A Crash Course"
description: "A condensed last-minute review of AP Physics 1 mechanics"
date: 2026-08-14
author:
  - Sophie Chen
---

A whistle-stop tour of every major topic in AP Physics 1, condensed into the equations and ideas that matter most. Use it as a checklist before the exam.

## Kinematics Essentials

::theorem-box{title="The four kinematic equations"}
For constant acceleration $a$ over a displacement $\Delta x = x - x_0$:

1. $v = v_0 + at$
2. $\Delta x = v_0 t + \tfrac12 a t^2$
3. $v^2 = v_0^2 + 2a\,\Delta x$
4. $\Delta x = \tfrac12 (v + v_0)\,t$

Choose the one that skips the quantity you don't care about.
::

::info-box{title="Projectile motion: decompose it"}
- **Horizontal motion** is constant velocity: $x = v_x t$, where $v_x = v_0\cos\theta$. There is no horizontal acceleration (ignoring air resistance), so the two directions are independent.
- **Vertical motion** is accelerated by gravity: $y = v_y t - \tfrac12 g t^2$ and $v_y = v_0\sin\theta - gt$. Peak height occurs when $v_y = 0$.
- **Maximum range** on level ground is at $45^\circ$: $R = \dfrac{v_0^2 \sin 2\theta}{g}$. Complementary angles give equal ranges.
::

::warning-box{title="Free fall: pick a sign and stick to it"}
With upward positive, $a = -g$; with downward positive, $a = +g$. Dropped objects start at $v_0 = 0$ (so $\Delta y = \tfrac12 g t^2$); thrown objects need the initial velocity's sign matched to your coordinate system.
::

## Newton's Laws & Forces

::theorem-box{title="The force toolkit"}
- **Newton's second law:** $\vec{F}_{\text{net}} = m\vec{a}$ — a vector equation; the acceleration points along the net force, not necessarily along the velocity.
- **Weight:** $F_g = mg$, always downward.
- **Normal force:** the perpendicular contact force; it *adjusts* — equal to $mg$ on a flat table, but different on inclines or under acceleration.
- **Tension:** transmitted through massless strings, constant throughout.
- **Friction:** static $f_s \le \mu_s N$ (matches the applied force up to a maximum); kinetic $f_k = \mu_k N$ (during sliding, usually smaller than the maximum static force).
::

::info-box{title="Inclines and pulleys"}
- **On a ramp** gravity splits into $F_\parallel = mg\sin\theta$ (down the incline) and $F_\perp = mg\cos\theta$ (setting the normal force).
- **Atwood machine:** writing $F_{\text{net}} = ma$ for each mass and eliminating tension gives
  $$a = \frac{(m_2 - m_1)\,g}{m_1 + m_2}.$$
- **Multi-body systems:** treat the whole system to find $a$ (total mass, external forces), then isolate one body to find internal forces like tension.
::

::theorem-box{title="Circular motion"}
Centripetal acceleration $a_c = \dfrac{v^2}{r} = \omega^2 r$ points toward the centre and requires a real force $F_c = \dfrac{mv^2}{r}$ — tension, friction, normal force, or gravity. "Centripetal" names a direction, not a new force.

In a **vertical circle**: at the bottom $N = mg + \dfrac{mv^2}{r}$; at the top, minimum speed to stay in contact is set by $mg = \dfrac{mv^2}{r}$.
::

## Energy and Work

::theorem-box{title="Work, power, and the work–energy theorem"}
- **Work:** $W = Fd\cos\theta$ — only the component of force along the displacement does work ($\theta = 90^\circ$ does zero work, $\theta = 180^\circ$ does negative work).
- **Power:** $P = \dfrac{W}{t} = Fv$.
- **Work–energy theorem:** $W_{\text{net}} = \Delta K$. This is the go-to for variable forces or complex paths where acceleration isn't constant.
::

::info-box{title="Two potential energies"}
- **Gravitational:** $U_g = mgh$, measured from an arbitrary reference level — only *differences* matter.
- **Elastic:** $U_s = \tfrac12 k x^2$. Doubling the stretch quadruples the stored energy.
::

::warning-box{title="Conservation with a caveat"}
When only conservative forces act, mechanical energy $E = K + U$ is constant, so $E_{\text{initial}} = E_{\text{final}}$. With friction or air resistance, add the non-conservative work:
$$W_{\text{nc}} = \Delta E_{\text{mechanical}}.$$
::

## Momentum and Collisions

::theorem-box{title="Impulse and momentum"}
- **Momentum:** $p = mv$ (a vector).
- **Impulse:** $J = F\Delta t = \Delta p$. For a variable force, $J$ is the area under the force–time graph.
::

::info-box{title="Conservation of momentum"}
Momentum is conserved when the net external force is zero — independently in *each* direction for 2D problems.

- **Elastic:** momentum *and* kinetic energy are conserved.
- **Inelastic:** momentum only; kinetic energy is lost to heat/deformation.
- **Perfectly inelastic:** objects stick together (maximum energy loss, shared final velocity).
- **Explosions:** reverse collisions — internal forces release stored energy; a system starting at rest has zero total momentum, so fragments scatter with a vector sum of zero.
::

::info-box{title="2D collisions"}
Write $p_{x,\text{initial}} = p_{x,\text{final}}$ and $p_{y,\text{initial}} = p_{y,\text{final}}$ as two independent scalar equations, then solve the resulting algebraic system.
::

## Rotational Motion

::theorem-box{title="Rotational kinematics"}
With angular displacement $\theta$ (radians), velocity $\omega$, and acceleration $\alpha$, the equations mirror the linear ones:

1. $\omega = \omega_0 + \alpha t$
2. $\theta = \theta_0 + \omega_0 t + \tfrac12 \alpha t^2$
3. $\omega^2 = \omega_0^2 + 2\alpha(\theta - \theta_0)$

Connections to linear motion at radius $r$: $s = r\theta$, $v_t = r\omega$, $a_t = r\alpha$.
::

::info-box{title="Torque and rotational dynamics"}
- **Torque:** $\tau = rF\sin\theta = r_\perp F$ — the rotational analogue of force.
- **Second law for rotation:** $\tau_{\text{net}} = I\alpha$, where rotational inertia $I = \sum m r^2$ measures resistance to spinning.

**Common moments of inertia** (given in the exam): solid sphere $I = \tfrac25 MR^2$, hollow sphere $I = \tfrac23 MR^2$, solid cylinder/disk $I = \tfrac12 MR^2$, hoop/ring $I = MR^2$, rod about its centre $I = \tfrac{1}{12} ML^2$.

**Parallel axis theorem:** $I = I_{\text{cm}} + Md^2$.
::

## Oscillations and Fluids

::theorem-box{title="Simple harmonic motion"}
- **Spring:** $F = -kx$ (Hooke's law), period $T = 2\pi\sqrt{\dfrac{m}{k}}$, energy $E = \tfrac12 kA^2$.
- **Pendulum:** $T = 2\pi\sqrt{\dfrac{L}{g}}$ — independent of mass, for small angles.
- **Position, velocity, acceleration** are sinusoids:
  $$x(t) = A\cos(\omega t + \phi),\quad v(t) = -A\omega\sin(\omega t + \phi),\quad a(t) = -A\omega^2\cos(\omega t + \phi).$$
::

::info-box{title="Fluid statics and dynamics"}
- **Density and pressure:** $\rho = \dfrac{m}{V}$, $P = \dfrac{F}{A}$, hydrostatic pressure $P = P_0 + \rho g h$. Pascal's principle: pressure changes transmit undiminished through a fluid.
- **Buoyancy (Archimedes):** $F_b = \rho_{\text{fluid}} V_{\text{displaced}}\, g$.
- **Continuity:** $A_1 v_1 = A_2 v_2$ — incompressible flow speeds up through constrictions.
- **Bernoulli:** $P + \tfrac12 \rho v^2 + \rho g h = \text{constant}$ along a streamline — faster flow means lower pressure.
::
