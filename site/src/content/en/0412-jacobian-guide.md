---
title: "Separating variables: the Jacobian"
description: "What to do when a round object's integral refuses to separate — and the magic factor that fixes it."
date: 2026-04-12
author:
  - Sean Li
---

The master formula for rotational inertia,

$$
I = \int r^2\,\mathrm{d}m,
$$

and how to run it for a stick, a plate, a box, and a sphere — all in Cartesian coordinates — are covered in Ryan's tutorial:

:blog-entry-card{slug="0412-integrate-inertia"}

But there is a step in there worth a closer look: for a *round* object the integral does not separate, and the sphere in particular is handled by a symmetry trick rather than by facing the integral head-on.

This guide is the "why and how" of changing coordinates. It is aimed at students who have met single-variable integration but not necessarily multiple integrals, and it introduces one new object — the **Jacobian** — which is the single factor you need whenever you trade one coordinate system for another.

## The disk, and why Cartesian coordinates fight back

A disk is the simplest round object, yet even it breaks the technique that worked so cleanly for the rectangle. A point $(x,y)$ in the disk is at distance $r = \sqrt{x^2+y^2}$ from the axis, so $r^2 = x^2+y^2$ and

$$
I = \sigma \iint_\Omega (x^2+y^2)\,\mathrm{d}A,
$$

where $\sigma$ is the (uniform) surface density. The problem is not the integrand — it's the region. The disk is defined by $x^2+y^2 \le R^2$, and that condition *entangles* the two variables: for a fixed $x$, the variable $y$ runs from $-\sqrt{R^2-x^2}$ to $+\sqrt{R^2-x^2}$, endpoints that depend on $x$. There is no way to write "the disk" as "$x$ over an interval, $y$ over an interval" with independent limits. The variables refuse to separate.

::problem-box{title="The Disk"}
Consider the disk of radius $R$ centered at the origin, $\Omega = \{(x,y): x^2+y^2 \le R^2\}$, with constant surface density $\sigma$. Find its rotational inertia about the axis through the origin and perpendicular to the disk.
::

The disk's round shape is telling us to switch to a coordinate system that is itself round. Instead of locating a point by "how far over and how far up" ($x$ and $y$), locate it by "how far out and at what angle" ($r$ and $\theta$):

$$
x = r\cos\theta, \qquad y = r\sin\theta.
$$

In these **polar coordinates** the disk becomes trivial: the radius runs from $0$ to $R$, the angle from $0$ to $2\pi$, and the two ranges are independent:

$$
0 \le r \le R, \qquad 0 \le \theta \le 2\pi.
$$

The disk has become a product of two intervals again. Even better, the integrand collapses: $x^2+y^2 = r^2(\cos^2\theta+\sin^2\theta) = r^2$.

So in the $(r,\theta)$ plane we would be integrating the simple function $r^2$ over a plain rectangle. There is just one catch: the area element $\mathrm{d}A$ is **not** $\mathrm{d}r\,\mathrm{d}\theta$. A change of coordinates stretches and squeezes space, and we must account for exactly how much, or the integral comes out wrong.

## How do we relate $\mathrm{d}r\,\mathrm{d}\theta$ to the actual area?

The natural question is: **how do we relate the coordinate box $\mathrm{d}r\,\mathrm{d}\theta$ to the actual patch of area $\mathrm{d}A$ it represents?** We can answer it geometrically, with nothing to memorize.

A small radial step $\mathrm{d}r$ is just a length $\mathrm{d}r$. A small angular step $\mathrm{d}\theta$, taken at radius $r$, sweeps out an arc of length $r\,\mathrm{d}\theta$ — the ordinary "radius times angle" arc-length formula. The two steps meet at a right angle, so the little patch they enclose is, in the limit of small steps, a rectangle with sides $\mathrm{d}r$ and $r\,\mathrm{d}\theta$:

$$
\mathrm{d}A = \mathrm{d}r \cdot r\,\mathrm{d}\theta = r\,\mathrm{d}r\,\mathrm{d}\theta.
$$

<!-- FIGURE: 0412-3.png — a wedge of the polar grid showing a small box with sides dr and r dθ at radius r, with the arc length r dθ labeled as the angular side. -->

The factor $r$ that appeared is the amount by which the polar grid is stretched relative to a plain rectangular grid, and it is important enough to have a name: it is the **Jacobian** of the map from Cartesian to polar coordinates,

$$
|J| = r.
$$

In general, whenever we trade one coordinate system for another, a Jacobian $|J|$ reports how much area (or volume) is stretched at each point:

::foldable{title="The Jacobian: the definition"}
A change of coordinates stretches and squeezes space by different amounts at different points. The **Jacobian** of a change of variables is a single function, written $|J|$, that reports this *local stretch factor*. In two dimensions it turns a small coordinate box into a physical patch,

$$
\mathrm{d}A = |J|\,\mathrm{d}u\,\mathrm{d}v,
$$

and in three dimensions it turns a small coordinate box into a physical chunk of volume,

$$
\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w.
$$

The bars $|\cdot|$ mean "take the positive magnitude": a stretch factor is always positive. You don't need to memorize a general formula for $|J|$ — each coordinate system we use comes with a known one (see the appendix). What matters is the idea: $|J|$ is the price, in area or volume, of trading one coordinate system for another.
::

Comparing $\mathrm{d}A = |J|\,\mathrm{d}r\,\mathrm{d}\theta$ with the rectangle we just built confirms $|J| = r$. The extra factor is exactly the arc-length factor: the farther out a point is, the more area a fixed angular step $\mathrm{d}\theta$ sweeps out.

## Finishing the disk

Now the derivation runs straight through:

$$
I = \sigma\int_0^{2\pi}\int_0^R r^2\cdot r\,\mathrm{d}r\,\mathrm{d}\theta
  = \sigma\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta,
$$

and because the limits are independent, the two variables separate:

$$
I = \sigma\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^R r^3\,\mathrm{d}r\right)
  = \sigma\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\sigma\pi R^4}{2}.
$$

With $M = \sigma\cdot\pi R^2$, so $\sigma = M/(\pi R^2)$,

::answer-box{}
$$
I = \frac{M}{\pi R^2}\cdot\frac{\pi R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

This is the familiar rotational inertia of a uniform disk about its central axis.
::

## 3D: the same idea with a volume factor

Solid bodies are the same story one dimension up. A body occupying a region $\Omega$ has $\mathrm{d}m = \rho\,\mathrm{d}V$, and

$$
I = \int_\Omega r^2\,\rho\,\mathrm{d}V.
$$

The new ingredient is a *volume* Jacobian: $\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w$.

**Cylinder.** A solid cylinder of radius $R$ and height $H$, rotating about its central axis, is round in its cross-section and straight along its length — exactly what cylindrical coordinates $(r,\theta,z)$ describe, with $0\le r\le R$, $0\le\theta\le2\pi$, $0\le z\le H$.

<!-- FIGURE: 0412-4.png — cylindrical coordinates, showing r (horizontal distance from the z-axis), θ (angle around the z-axis), and z (height). -->

A point's distance to the axis is its cylindrical radius $r$, so the integrand is $r^2$. The volume element carries the same stretch factor as polar coordinates in the cross-section, and the $z$-direction isn't stretched at all: $\mathrm{d}V = r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$, i.e. $|J| = r$. Then

$$
I = \rho\int_0^H\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z
  = \rho\cdot H\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\rho\pi H R^4}{2},
$$

and with $M = \rho\cdot\pi R^2 H$,

::answer-box{}
$$
I = \boxed{\,\frac{1}{2}MR^2\,}.
$$
::

The height $H$ cancels, because every thin slice is itself a disk.

**Sphere.** A solid sphere is round in every direction, so it calls for spherical coordinates $(\rho,\theta,\phi)$, with $0\le\rho\le R$, $0\le\theta\le2\pi$, $0\le\phi\le\pi$.

<!-- FIGURE: 0412-5.png — spherical coordinates, showing ρ (radial distance), θ (azimuth around the z-axis), and φ (polar angle from the z-axis), with the horizontal projection ρ sin φ labeled. -->

A point at spherical radius $\rho$ and polar angle $\phi$ is at distance $\rho\sin\phi$ from the $z$-axis, so $r^2 = \rho^2\sin^2\phi$. The spherical volume element carries a two-factor Jacobian — one from the radial direction, one from the angular directions — with known result

$$
\mathrm{d}V = \rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi, \qquad\text{i.e.}\qquad |J| = \rho^2\sin\phi.
$$

Then

$$
I = \rho\int_0^{2\pi}\int_0^\pi\int_0^R \left(\rho^2\sin^2\phi\right)\left(\rho^2\sin\phi\right)\mathrm{d}\rho\,\mathrm{d}\phi\,\mathrm{d}\theta
  = \rho\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^\pi \sin^3\phi\,\mathrm{d}\phi\right)\left(\int_0^R \rho^4\,\mathrm{d}\rho\right).
$$

The three pieces are $2\pi$, $\int_0^\pi\sin^3\phi\,\mathrm{d}\phi = \frac43$, and $\frac{R^5}{5}$, so

$$
I = \rho\cdot 2\pi\cdot\frac43\cdot\frac{R^5}{5}
  = \frac{8\pi\rho R^5}{15},
$$

and with $M = \rho\cdot\frac43\pi R^3$,

::answer-box{}
$$
I = \frac{3M}{4\pi R^3}\cdot\frac{8\pi R^5}{15}
  = \boxed{\,\frac{2}{5}MR^2\,}.
$$
::

Notice the general lesson. The rectangle separated *because it already was* a product of intervals in Cartesian coordinates; the disk and the sphere needed a change of coordinates to be seen that way. The Jacobian is the price of that change — the 2D/3D analogue of the 1D chain rule ($\mathrm{d}y = \frac{\mathrm{d}y}{\mathrm{d}x}\mathrm{d}x$), upgraded to keep track of how a coordinate change stretches area or volume.

## Appendix: table of Jacobians

Here is a quick reference for every Jacobian used in this guide, with how each slots into the master formula.

| Coordinates | $\lvert J\rvert$ | Example |
|---|---|---|
| Cartesian (2D) | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y$ |
| Polar $(r,\theta)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta$ |
| Cartesian (3D) | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z$ |
| Cylindrical $(r,\theta,z)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$ |
| Spherical $(\rho,\theta,\phi)$ | $\rho^2\sin\phi$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot\rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi$ |

The rule is always the same: after a change of coordinates, replace $\mathrm{d}V$ with $|J|$ times the new coordinate differentials, and read $|J|$ off the table. (Here a single $\int$ stands for the appropriate multiple integral — $\iint$ or $\iiint$ — over the whole body.)
