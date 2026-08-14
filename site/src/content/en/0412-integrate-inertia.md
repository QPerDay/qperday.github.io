---
title: How to calculate the rotational inertia of an object
description: "Guess why Mechanics C is also known as the Further Mathematics for AP."
date: 2026-04-12
author: 
    - Ryan Huang
    - Sean Li
---

This paper is a gentle introduction to calculating the rotational inertia (moment of inertia) of an object using integrals, with worked examples. It is meant to help students who are unsure how to compute rotational inertia — a topic our famous massive physics teacher forgot to cover — with questions that may appear on the `AP Physics C : Mechanics` exam.

> The article is originally written by Ryan, big credits to him. I (Sean) only did some proofreading, and elaborated on some nuances of multivariable calculus for students not familiar with multiple integrals.

In this article, we will delve into the derivation of the rotational inertia of rigid bodies, and at last provide you with a portable workflow that could be used on pretty much any inertia integration problem. It might seem itimidating, but walking through concrete examples might help. Good luck to you all on the AP exams.


## The Rotational Inertia

Rotational inertia is the rotational analogue of mass. Where mass measures how hard it is to change an object's *linear* velocity ($F = ma$), rotational inertia measures how hard it is to change its *angular* velocity. In rotational form, Newton's Second Law reads

$$
\tau = I \alpha,
$$

where $\tau$ is the net torque, $\alpha$ is the angular acceleration, and $I$ is the rotational inertia we are trying to find.

### Point Mass

The cleanest way to see what $I$ means is to derive it for a single point mass. Pin a point mass $m$ so that it can only move on a circle of radius $r$ about a pivot, and pull on it with a tangential force $\vec F$, perpendicular to the position vector $\vec r$:

:Pic{src="0412-1.png" width="50%"}

Because $\vec F$ is perpendicular to $\vec r$, the torque it produces has the simple magnitude $\tau = F r$ (there is no $\sin\theta$ factor to worry about). Newton's Second Law for rotation says this torque equals $I\alpha$, so

$$
\tau = F r = I \alpha.
$$

Now relate the force to the acceleration. Along the tangent, Newton's Second Law says $F = m a_t$, and the tangential acceleration of a point moving on a circle is $a_t = r \alpha$. Substituting both,

$$
I \alpha = F r = (m a_t) r = m (r \alpha) r = m r^2 \alpha.
$$

The $\alpha$'s cancel (as long as $\alpha \neq 0$), leaving

::theorem-box{title="Point-Mass Rotational Inertia"}
A point mass $m$ at distance $r$ from an axis has rotational inertia
$$
I = m r^2.
$$
::

Notice where the two factors of $r$ come from: one from the torque ($\tau = Fr$) and one from the tangential acceleration ($a_t = r\alpha$).

It is left as an exercise to the reader to prove that the rotational inertia of a bunch of point masses is the sum of their individual $I$'s — in other words, that $I$ is *additive*. We will lean on this fact in a moment.

### Rigid Bodies

A rigid body, however, is not a single point: it occupies a region of space, which we'll call $\Omega$. The trick is to think of it as many tiny point masses stuck together. Break the body into small pieces, each of mass $\Delta m$. Since $I$ is additive, the total rotational inertia is just the sum over all the pieces:

$$
I = \sum_i \Delta m_i\, r_i^2,
$$

where $r_i$ is the perpendicular distance from the $i$-th piece to the axis of rotation.

Now let the pieces become arbitrarily small, $\Delta m \to 0$:

:Pic{src="0412-2.png" width="50%"}

In this limit the sum is a Riemann sum, and a Riemann sum over a region is exactly what an integral is. So the sum turns into an integral over the body:

::theorem-box{title="Rigid Body Rotational Inertia"}
For a rigid body occupying a spatial region $\Omega \subseteq \mathbb R^n$,
$$
I = \int_{\Omega} r^2 \,\mathrm{d}m,
$$
where $r : \Omega \to \mathbb R$ gives the distance from each point in $\Omega$ to the axis of rotation.
::

There is one problem left: this integral is with respect to *mass*, $\mathrm{d}m$, but $\Omega$ is a region of *space*, and the only things we know how to integrate over are volume elements $\mathrm{d}V$. How do we convert between the two? The answer is **density** — the distribution of mass throughout $\Omega$.

Formally, density is a function $\rho : \Omega \to \mathbb R$ that, at each point, tells us how much mass is packed into a small volume there. It is defined so that a tiny volume $\mathrm{d}V$ at a point $p$ contains mass $\rho(p)\,\mathrm{d}V$:

::theorem-box{title="Density Distribution"}
$$
\rho(p)\,\mathrm{d}V = \mathrm{d}m
$$
::

You might be tempted to read $\rho = \frac{\mathrm{d}m}{\mathrm{d}V}$ as a derivative, but don't — it is simply the conversion factor between a differential mass and the differential volume it occupies.

Plugging this in, our integral becomes

::info-box{title="Inertia Dependent on Density"}
$$
I = \int_\Omega r^2 \rho \,\mathrm{d}V
$$
If $\rho$ is constant it can be pulled out of the integral:
$$
I = \rho \int_\Omega r^2 \,\mathrm{d}V \quad \text{where }\rho\text{ is constant}
$$
::

## Worked Examples

Everything so far has been abstract. Now let's actually compute something.

### 1D Object

There is one subtlety to clear up before we begin. A rod — the line segment $\Omega = [0, L]$ — is, as a set, one-dimensional: it lives in $\mathbb R^1$. But you cannot actually *rotate* something in a one-dimensional space. There is simply no room for a line to turn: a point on a line can only slide back and forth.

To talk about the rod rotating, we have to *embed* it into a higher-dimensional space. "Embed" just means *place*: we take the one-dimensional rod and lay it down in the plane $\mathbb R^2$ (or in 3D space $\mathbb R^3$), where there is room for it to spin. The rod itself is still one-dimensional; it has only been placed in a space where rotation makes sense.

So: let the rod have length $L$ and uniform density $\rho$. We embed it in the plane, lying along the $x$-axis with one end at the origin, so it occupies $\Omega = [0, L]$. It rotates about the $z$-axis, which passes through the origin and points perpendicular to the rod (out of the plane).

Here is the key simplification. For a point at coordinate $r$ along the rod, the perpendicular distance to the $z$-axis is exactly $r$ — the distance to the axis *is* the coordinate. So the general integral

$$
I = \int_{\Omega} r^2 \rho \,\mathrm{d}V
$$

becomes a plain one-variable integral, with $r$ running from $0$ to $L$:

$$
I = \int_0^L r^2 \rho \,\mathrm{d}r.
$$

(Why did $\mathrm{d}V$ become $\mathrm{d}r$? In one dimension the "volume element" is just a length element.)

Next, since $\rho$ is constant we can move it out front:

$$
I = \rho \int_0^L r^2 \,\mathrm{d}r.
$$

The antiderivative of $r^2$ is $\frac{r^3}{3}$, so

$$
I = \rho \left[ \frac{r^3}{3} \right]_0^L
  = \rho \left( \frac{L^3}{3} - 0 \right)
  = \rho\,\frac{L^3}{3}.
$$

We're almost done, but the answer is still written in terms of the density $\rho$. Usually we'd rather have it in terms of the rod's total mass $M$. For a uniform rod, mass is just density times length:

$$
M = \rho L \qquad\Longleftrightarrow\qquad \rho = \frac{M}{L}.
$$

Substituting,

$$
\boxed{I = \frac{M}{L}\cdot\frac{L^3}{3} = \frac{1}{3} M L^2}
$$

This is the familiar formula for the rotational inertia of a thin rod about an axis through one end, perpendicular to the rod.

::problem-box{title="Excercise"}
Consider the rod spanning $\Omega = [0, L]$ and density function $\rho(r) = \lambda r$, where $\lambda$ is some known function. Find the rotational inertia of it about an axis through and perpendicular to the endpoint at $r = 0$.

:::foldable{title="Solution"}
The rod is one-dimensional with $\Omega = [0, L]$, and the axis passes through the endpoint at the origin, perpendicular to the rod. For a point at coordinate $r$, the perpendicular distance to the axis is just $r$ itself. The density is no longer constant, so we cannot pull it out of the integral — it stays inside:

$$
I = \int_0^L r^2 \,\rho(r)\,\mathrm{d}r
  = \int_0^L r^2\,(\lambda r)\,\mathrm{d}r
  = \lambda \int_0^L r^3\,\mathrm{d}r.
$$

The antiderivative of $r^3$ is $\frac{r^4}{4}$, so

$$
I = \lambda \left[ \frac{r^4}{4} \right]_0^L
  = \lambda\,\frac{L^4}{4}.
$$

This is the answer in terms of $\lambda$, but as before we'd rather have it in terms of the total mass $M$. The total mass is the integral of the density over the whole rod:

$$
M = \int_0^L \rho(r)\,\mathrm{d}r
  = \lambda \int_0^L r\,\mathrm{d}r
  = \lambda\,\frac{L^2}{2}
  \qquad\Longleftrightarrow\qquad
  \lambda = \frac{2M}{L^2}.
$$

Substituting back,

$$
I = \lambda\,\frac{L^4}{4}
  = \frac{2M}{L^2}\cdot\frac{L^4}{4}
  = \boxed{\,\frac{1}{2} M L^2\,}.
$$

So

::::answer-box{}
$$ I = \frac 1 2 M L^2 $$

Compare this with the uniform rod, for which $I = \frac13 M L^2$. The variable-density rod is *more* resistant to rotation, because its mass is pushed toward the far end (where $\rho$ is larger), farther from the axis.
::::

:::
::

### 2D Object

Now we move up a dimension: 2D. The setup is no longer a single coordinate along a line, but a point in the plane with two independent coordinates. That means the same basic idea still works, but the integral becomes a double integral. Let’s see how that plays out in a concrete example.

::problem-box{title="Rectangular Plane"}
Consider the rectangular plane
$$\Omega = [-a / 2, a / 2] \times [-b / 2, b / 2]$$
and a constant density distribution $\rho = \sigma$. What is $\Omega$'s rotational inertia with respect to an axis through the origin and perpendicular to the plane?
::

The region is a rectangle, so its bounds on $x$ and $y$ are independent. That makes the calculation especially clean.

A point $(x, y)$ in the plate is at perpendicular distance
$$r = \sqrt{x^2 + y^2}$$
from the $z$-axis through the center, so
$$r^2 = x^2 + y^2.$$
In two dimensions, the density is a surface density $\sigma$ (mass per unit area), and a tiny rectangle $\mathrm{d}A = \mathrm{d}x\,\mathrm{d}y$ carries mass
$$\mathrm{d}m = \sigma\,\mathrm{d}A.$$
Using the master formula $I = \int_\Omega r^2\,\mathrm{d}m$, we get

$$
I = \sigma \int_{-b/2}^{b/2} \int_{-a/2}^{a/2} (x^2 + y^2)\,\mathrm{d}x\,\mathrm{d}y.
$$

Because the rectangle separates cleanly into independent $x$ and $y$ ranges, the integral splits into two simpler pieces:

$$
I = \sigma\left[\int_{-b/2}^{b/2}\int_{-a/2}^{a/2} x^2\,\mathrm{d}x\,\mathrm{d}y 
\;+
\int_{-a/2}^{a/2}\int_{-b/2}^{b/2} y^2\,\mathrm{d}y\,\mathrm{d}x\right].
$$

The inner integrals are exactly the same kind we saw in 1D:

$$
\int_{-a/2}^{a/2} x^2\,\mathrm{d}x = \left[\frac{x^3}{3}\right]_{-a/2}^{a/2} = \frac{a^3}{12},
\qquad
\int_{-b/2}^{b/2} y^2\,\mathrm{d}y = \frac{b^3}{12}.
$$

The outer integrals simply multiply by the remaining side length, so

$$
I = \sigma\left(b\cdot\frac{a^3}{12} + a\cdot\frac{b^3}{12}\right)
  = \sigma\,\frac{ab\,(a^2 + b^2)}{12}.
$$

Finally, the total mass of a uniform plate is
$$M = \sigma ab,$$
so
$$\sigma = \frac{M}{ab}.$$
Substituting gives

::answer-box{}

$$
\boxed{\,I = \frac{1}{12}M(a^2 + b^2)\,}.
$$

This is the standard formula for a rectangular plate rotating about an axis through its center and perpendicular to the plate. The two side lengths enter symmetrically through $a^2 + b^2$, which is exactly what we expect from combining two central rods, each with $I = \tfrac{1}{12}ML^2$.
::

The rectangle is easy because it is a product of two intervals: the conditions on $x$ and $y$ are independent, and the double integral cleanly separates.

The disk, however, is round — and the rectangle's trick fails immediately. A point $(x,y)$ in the disk is still at distance $r=\sqrt{x^2+y^2}$ from the axis, so the integrand is $r^2=x^2+y^2$ as before, and the master formula gives

$$
I = \sigma \iint_\Omega (x^2+y^2)\,\mathrm{d}A.
$$

But the disk is **not** a product of two intervals. Its defining condition is $x^2+y^2\le R^2$, and the two variables are entangled by the circle's equation: for a fixed $x$, the variable $y$ runs from $-\sqrt{R^2-x^2}$ to $+\sqrt{R^2-x^2}$, endpoints that depend on $x$. There is no way to write "the disk" as "$x$ over an interval, $y$ over an interval" with independent limits. The variables refuse to separate.

::problem-box{title="The Disk"}
Consider the disk of radius $R$ centered at the origin,
$$\Omega = \{(x,y): x^2+y^2 \le R^2\},$$
with constant surface density $\sigma$. Find its rotational inertia about the axis through the origin and perpendicular to the disk.
::

The disk's round shape is telling us to switch to a coordinate system that is itself round. Instead of locating a point by "how far over and how far up" ($x$ and $y$), locate it by "how far out and at what angle" ($r$ and $\theta$):

$$
x = r\cos\theta, \qquad y = r\sin\theta.
$$

In these **polar coordinates** the disk is trivial to describe: the radius runs from $0$ to $R$, the angle runs all the way around from $0$ to $2\pi$, and the two ranges are independent:

$$
0 \le r \le R, \qquad 0 \le \theta \le 2\pi.
$$

The disk has become a product of two intervals again. Even better, the integrand collapses: the squared distance from the axis is

$$
x^2+y^2 = (r\cos\theta)^2 + (r\sin\theta)^2 = r^2(\cos^2\theta + \sin^2\theta) = r^2.
$$

So in the $(r,\theta)$ plane we would be integrating the simple function $r^2$ over a plain rectangle. There is just one catch: the little area element $\mathrm{d}A$ is **not** $\mathrm{d}r\,\mathrm{d}\theta$. A change of coordinates stretches and squeezes space, and we must account for exactly how much, or the integral comes out wrong.

So the natural question is: **how do we relate the coordinate box $\mathrm{d}r\,\mathrm{d}\theta$ to the actual patch of area $\mathrm{d}A$ it represents?** Let's answer it geometrically, with nothing to memorize.

A small radial step $\mathrm{d}r$ is simply a length $\mathrm{d}r$. A small angular step $\mathrm{d}\theta$, taken at radius $r$, sweeps out an arc of length $r\,\mathrm{d}\theta$ — that is the ordinary "radius times angle" arc-length formula. The two steps meet at a right angle, so the little patch they enclose is, in the limit of small steps, a rectangle with sides $\mathrm{d}r$ and $r\,\mathrm{d}\theta$:

$$
\mathrm{d}A = \mathrm{d}r \cdot r\,\mathrm{d}\theta = r\,\mathrm{d}r\,\mathrm{d}\theta.
$$

:Pic{src="0412-3.png"}

The factor $r$ that appeared is the amount by which the polar grid is stretched relative to a plain rectangular grid, and it is important enough to have a name: it is the **Jacobian** of the map from Cartesian to polar coordinates, written

$$
|J| = r.
$$

In general, whenever we trade one coordinate system for another, a Jacobian $|J|$ reports how much area (or volume) is stretched at each point:

::foldable{title="The Jacobian: the definition"}
A change of coordinates stretches and squeezes space by different amounts at different points. The **Jacobian** of a change of variables is a single function, written $|J|$, that reports this *local stretch factor*. In two dimensions it turns a small coordinate box into a physical patch:

$$
\mathrm{d}A = |J|\,\mathrm{d}u\,\mathrm{d}v,
$$

and in three dimensions it turns a small coordinate box into a physical chunk of volume:

$$
\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w.
$$

The bars $|\cdot|$ mean "take the positive magnitude": a stretch factor is always a positive number. You do not need to memorize a general formula for $|J|$ — each coordinate system we use comes with a known one (see the appendix). What matters is the idea: $|J|$ is the price, in area or volume, of trading one coordinate system for another.
::

For our polar change of coordinates, comparing $\mathrm{d}A = |J|\,\mathrm{d}r\,\mathrm{d}\theta$ with the rectangle we just built confirms $|J| = r$. The extra factor of $r$ is exactly the arc-length factor: the farther out a point is, the more area a fixed angular step $\mathrm{d}\theta$ sweeps out.

Now the derivation runs straight through. The inertia integral becomes

$$
I = \sigma\int_0^{2\pi}\int_0^R r^2\cdot r\,\mathrm{d}r\,\mathrm{d}\theta
  = \sigma\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta,
$$

and because the limits are independent, the two variables separate cleanly:

$$
I = \sigma\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^R r^3\,\mathrm{d}r\right)
  = \sigma\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\sigma\pi R^4}{2}.
$$

The disk's total mass is its density times its area, $M=\sigma\cdot\pi R^2$, so $\sigma=M/(\pi R^2)$. Substituting,

::answer-box{}
$$
I = \frac{M}{\pi R^2}\cdot\frac{\pi R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

This is the familiar formula for the rotational inertia of a uniform disk about its central axis.
::

Notice the general lesson. The rectangle separated *because it already was* a product of intervals in Cartesian coordinates; the disk needed a change of coordinates to be seen that way. The Jacobian is the price of that change — it is the 2D analogue of the 1D chain rule (where $\mathrm{d}y=\frac{\mathrm{d}y}{\mathrm{d}x}\,\mathrm{d}x$), upgraded to keep track of the stretching a coordinate change imposes on area. In 3D the same idea carries over with a volume stretch factor $|J|$ instead of an area one — cylindrical and spherical coordinates each bring their own Jacobian, which is how we will handle solid bodies next.

### 3D Object

Solid bodies are the same story one dimension up. A body occupying a region $\Omega$ in space has mass $\mathrm{d}m=\rho\,\mathrm{d}V$, and its rotational inertia is

$$
I = \int_\Omega r^2\,\rho\,\mathrm{d}V,
$$

where $r$ is the perpendicular distance to the axis of rotation. The new ingredient is that a change of coordinates now carries a *volume* Jacobian $|J|$, so $\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w$.

::problem-box{title="Solid Cylinder"}
Consider a solid cylinder of radius $R$ and height $H$, with constant density $\rho$, rotating about its central axis (the $z$-axis). Find its rotational inertia.
::

The cylinder is round in its cross-section and straight along its length, which is exactly what **cylindrical coordinates** $(r,\theta,z)$ describe. The three ranges are independent:

$$
0\le r\le R, \qquad 0\le\theta\le2\pi, \qquad 0\le z\le H.
$$


A point's perpendicular distance to the central axis is just its cylindrical radius $r$, so the integrand is $r^2$. The volume element carries the same stretch factor as polar coordinates in the cross-section, and the $z$-direction isn't stretched at all:

$$
\mathrm{d}V = r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z, \qquad\text{i.e.}\qquad |J| = r.
$$

So

$$
I = \rho\int_0^H\int_0^{2\pi}\int_0^R r^2\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z
  = \rho\int_0^H\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z.
$$

The three variables separate cleanly:

$$
I = \rho\left(\int_0^H \mathrm{d}z\right)\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^R r^3\,\mathrm{d}r\right)
  = \rho\cdot H\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\rho\pi H R^4}{2}.
$$

The cylinder's mass is its density times its volume, $M=\rho\cdot\pi R^2 H$, so $\rho=M/(\pi R^2 H)$. Substituting,

::answer-box{}
$$
I = \frac{M}{\pi R^2 H}\cdot\frac{\pi H R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

A solid cylinder has the same rotational inertia about its central axis as a thin disk of the same radius — the height $H$ cancels, because every thin slice is itself a disk.
::

::problem-box{title="Solid Sphere"}
Consider a solid sphere of radius $R$ with constant density $\rho$, rotating about an axis through its center (say the $z$-axis). Find its rotational inertia.
::

A sphere is round in *every* direction, so it calls for **spherical coordinates** $(\rho,\theta,\phi)$: $\rho$ is the distance from the origin, $\theta$ the angle around the $z$-axis, and $\phi$ the angle down from the $z$-axis. The three ranges are independent:

$$
0\le\rho\le R, \qquad 0\le\theta\le2\pi, \qquad 0\le\phi\le\pi.
$$

A point at spherical radius $\rho$ and polar angle $\phi$ sits a perpendicular distance $\rho\sin\phi$ from the $z$-axis (that's its horizontal projection), so the squared distance to the axis is

$$
r^2 = \rho^2\sin^2\phi.
$$

The spherical volume element carries a two-factor Jacobian — one factor from the radial direction, one from the angular directions — and the known result is

$$
\mathrm{d}V = \rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi, \qquad\text{i.e.}\qquad |J| = \rho^2\sin\phi.
$$

(We collect this in the appendix; you don't have to re-derive it every time.) The inertia integral is therefore

$$
I = \rho\int_0^{2\pi}\int_0^\pi\int_0^R \left(\rho^2\sin^2\phi\right)\left(\rho^2\sin\phi\right)\mathrm{d}\rho\,\mathrm{d}\phi\,\mathrm{d}\theta.
$$

Gathering the $\rho$'s and separating the variables,

$$
I = \rho\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^\pi \sin^3\phi\,\mathrm{d}\phi\right)\left(\int_0^R \rho^4\,\mathrm{d}\rho\right).
$$

The three pieces are standard: the first is $2\pi$, the second is $\int_0^\pi \sin^3\phi\,\mathrm{d}\phi = \frac43$, and the third is $\frac{R^5}{5}$. Putting them together,

$$
I = \rho\cdot 2\pi\cdot\frac43\cdot\frac{R^5}{5}
  = \frac{8\pi\rho R^5}{15}.
$$

The sphere's mass is its density times its volume, $M=\rho\cdot\frac43\pi R^3$, so $\rho=3M/(4\pi R^3)$. Substituting,

::answer-box{}
$$
I = \frac{3M}{4\pi R^3}\cdot\frac{8\pi R^5}{15}
  = \boxed{\,\frac{2}{5}MR^2\,}.
$$

This is the familiar formula for the rotational inertia of a solid sphere about any axis through its center.
::

## Appendix: Table of Jacobians

Here is a quick reference for every Jacobian used in this tutorial, with how each one slots into the master formula.

| Coordinates | $\lvert J\rvert$ | Example |
|---|---|---|
| Cartesian (2D) | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y$ |
| Polar $(r,\theta)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta$ |
| Cartesian (3D) | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z$ |
| Cylindrical $(r,\theta,z)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$ |
| Spherical $(\rho,\theta,\phi)$ | $\rho^2\sin\phi$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot\rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi$ |

The rule is always the same: after a change of coordinates, replace $\mathrm{d}V$ with $|J|$ times the new coordinate differentials, and read $|J|$ off the table. (Here a single $\int$ stands for the appropriate multiple integral — $\iint$ or $\iiint$ — over the whole body.)