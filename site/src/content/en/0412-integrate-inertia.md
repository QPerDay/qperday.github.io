---
title: How to calculate the rotational inertia of an object
description: "A brief introduction to computing rotational inertia by integrals, with worked examples."
date: 2026-04-12
author:
  - Ryan Huang
---

This paper briefly introduces how to calculate the rotational inertia of an object using integrals, with worked examples. Its purpose is to help those who don't know how to compute rotational inertia solve the problems that may appear on the AP Physics C: Mechanics exam — a topic our famous massive physics teacher forgot to cover.

The step-by-step details of changing coordinates for round objects — the Jacobian — are covered in a companion guide:

:blog-entry-card{slug="0412-jacobian-guide"}

## The idea of rotational inertia

### Rotational inertia of a mass point

According to the textbook and the instinctual interpretation, rotational inertia is the inertia of an object whose shape can be neglected — a *mass point* of mass $m$ — as it rotates around an axis at a distance $r$. The mathematical definition is therefore

$$
I = m r^2.
$$

The detailed derivation is already provided by our dear physics teachers during our lessons, and will not be repeated here.

### Rotational inertia of a general object

Most objects we meet cannot be treated as mass points — disks, spheres, and so on — but they *can* be treated as a set of numerous mass points, as shown below:

:Pic{src="0412-2.png" width="50%"}

So our natural idea is this: to compute an object's rotational inertia, add up the rotational inertia of all its mass points. To cover the entire object, those mass points must be very small — small mass, small volume. Writing the mass of a single mass point as $\Delta m$, the rotational inertia of the whole object is

$$
I_{\text{object}} = \sum I_{\text{mass points}} = \sum r^2 \Delta m.
$$

Making the mass points smaller still, we arrive at an integral:

$$
I = \int r^2 \,\mathrm{d}m.
$$

Here $\mathrm{d}m$ represents a single mass point and $r$ the distance between that point and the axis of rotation. Notice that $r$ may change with the choice of mass point, so to actually evaluate the integral we must find a function relating $r$ and $m$.

This is where **density** comes in: it relates $r$ and $m$ *and* captures how the mass is distributed. The more mass close to the axis, the smaller the rotational inertia, and vice versa — some objects have nonuniform density, which does appear on Physics C exams. Density is defined as

$$
\rho = \frac{m}{V}.
$$

Sometimes the object isn't three-dimensional, though. A disk we treat as 2D (ignoring its thickness), and a stick as 1D (only its length matters), so we also use

$$
\rho = \frac{m}{S}, \qquad \rho = \frac{m}{L}.
$$

## Calculation steps

The following assumes the object has uniform density.

### 1D objects

For a one-dimensional object we only consider one dimension, so:

1. Write down the original expression: $I = \int r^2 \,\mathrm{d}m$.
2. Choose the 1D density $\rho = m/L$.
3. Consider the axis. For a stick rotating about an axis through its center of mass and perpendicular to it, the distance to the axis is just the coordinate, so $L = r$.
4. Differentiate the density relation, treating $r$ as the variable:
   $$
   \rho = \frac{m}{L} \quad\Longrightarrow\quad r\rho = m \quad\Longrightarrow\quad \rho\,\mathrm{d}r = \mathrm{d}m.
   $$
5. Substitute $\mathrm{d}m = \rho\,\mathrm{d}r$. The furthest mass point is at $L/2$, so the bounds are $-L/2$ and $+L/2$, and we integrate treating only $r$ as the variable, then substitute $\rho = m/L$:

$$
I = \int_{-L/2}^{L/2} r^2 \rho\,\mathrm{d}r
  = \rho \left[\frac{r^3}{3}\right]_{-L/2}^{L/2}
  = \frac{1}{12}mL^2.
$$

This is the rotational inertia of a stick about an axis through its center, perpendicular to it.

### 2D objects

For two-dimensional objects — a thin disk or a rectangular plate with negligible thickness — we use the surface density $\rho = m/S$, where $S$ is the total area. The integral becomes a double integral over the surface, but the idea is the same: sum up all the mass points $\mathrm{d}m = \rho\,\mathrm{d}S$ weighted by the square of their distance $r$ to the axis. Two common cases follow.

**Case 1: a thin disk about an axis through its center, perpendicular to the disk.**

Place the disk in the $xy$-plane with its center at the origin, so the axis of rotation is the $z$-axis. A mass point at $(x, y)$ is at distance $r = \sqrt{x^2 + y^2}$ from the axis, and the surface density is $\rho = m/(\pi R^2)$. Then

$$
I = \int r^2 \,\mathrm{d}m
  = \iint_{\text{disk}} (x^2 + y^2)\,\rho\,\mathrm{d}x\,\mathrm{d}y.
$$

By symmetry we can integrate in Cartesian coordinates with limits $-\sqrt{R^2-y^2} \le x \le \sqrt{R^2-y^2}$ and $-R \le y \le R$, integrating first in $x$ and then in $y$. The result is

$$
I = \rho \int_{-R}^{R}\int_{-\sqrt{R^2-y^2}}^{\sqrt{R^2-y^2}} (x^2 + y^2)\,\mathrm{d}x\,\mathrm{d}y
  = \frac12 mR^2.
$$

We skip the detailed algebra here — our beloved physics teachers would be proud that we know how to do it.

::info-box{title="Words from the author"}
Actually, it won't take such complicated steps to handle a disk. Just use $S = \pi r^2$ and repeat the 1D steps, and you'll get the result after computing only one integral. Other objects, however, do require integrating multiple times.
::

**Case 2: a rectangular plate (no thickness) about an axis through its center, perpendicular to the plate.**

Let the plate have side lengths $a$ (along $x$) and $b$ (along $y$), total mass $m$, centered at the origin so $x \in [-a/2, a/2]$ and $y \in [-b/2, b/2]$. The axis is again the $z$-axis, $r^2 = x^2 + y^2$, and $\rho = m/(ab)$. Then

$$
I = \int r^2 \,\mathrm{d}m
  = \rho \int_{-a/2}^{a/2}\int_{-b/2}^{b/2} (x^2 + y^2)\,\mathrm{d}y\,\mathrm{d}x.
$$

The integral separates cleanly:

$$
\int_{-a/2}^{a/2}\int_{-b/2}^{b/2} x^2\,\mathrm{d}y\,\mathrm{d}x
  = b\int_{-a/2}^{a/2} x^2\,\mathrm{d}x = b\cdot\frac{a^3}{12},
$$
$$
\int_{-a/2}^{a/2}\int_{-b/2}^{b/2} y^2\,\mathrm{d}y\,\mathrm{d}x
  = a\int_{-b/2}^{b/2} y^2\,\mathrm{d}y = a\cdot\frac{b^3}{12}.
$$

Adding and multiplying by $\rho = m/(ab)$ gives

$$
I = \frac{m}{ab}\left(\frac{a^3 b}{12} + \frac{a b^3}{12}\right)
  = \frac{1}{12}m(a^2 + b^2).
$$

### 3D objects

When the object has thickness, we use the volumetric density $\rho = m/V$ and integrate over the volume: $I = \iiint r^2\rho\,\mathrm{d}V$, where $r$ is still the distance from each mass point to the axis. We look at a rectangular box and a solid sphere, each rotating about an axis through its center of mass.

**Case 1: a rectangular box about an axis through its center, parallel to one edge.**

Let the box have side lengths $a$ (along $x$), $b$ (along $y$), and $c$ (along $z$), centered at the origin. Choose the $z$-axis (through the center, parallel to the $z$-direction) as the rotation axis. A point $(x, y, z)$ is at distance $r = \sqrt{x^2 + y^2}$ from the axis, independent of $z$, and $\rho = m/(abc)$. Therefore

$$
I = \iiint (x^2 + y^2)\rho\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z
  = \rho\int_{-c/2}^{c/2}\int_{-b/2}^{b/2}\int_{-a/2}^{a/2} (x^2 + y^2)\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z.
$$

The $z$-integral simply gives a factor $c$, and the double integral over $x, y$ is exactly the plate case above (sides $a$ and $b$), which we already computed as $\frac{ab}{12}(a^2+b^2)$. Putting it together,

$$
I = \rho\cdot c\cdot\frac{ab}{12}(a^2+b^2)
  = \frac{m}{abc}\cdot c\cdot\frac{ab}{12}(a^2+b^2)
  = \frac{1}{12}m(a^2+b^2).
$$

Interestingly, the thickness $c$ cancels — every slice parallel to the $xy$-plane contributes the same amount, and the distance to the axis doesn't depend on $z$. A thick box rotating about its central axis behaves exactly like a thin plate of the same $a$ and $b$.

**Case 2: a solid sphere about an axis through its center.**

Take a sphere of radius $R$ and mass $m$, centered at the origin, rotating about the $z$-axis. Then $r = \sqrt{x^2+y^2}$ and $\rho = m/(\tfrac43 \pi R^3)$. The integral in Cartesian coordinates is

$$
I = \rho \iiint_{x^2+y^2+z^2 \le R^2} (x^2+y^2)\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z.
$$

By spherical symmetry we can use a trick: note that $x^2+y^2 = (x^2+y^2+z^2) - z^2$, and by symmetry the integrals of $x^2$, $y^2$, and $z^2$ over the sphere are all equal. Writing $\Delta = \iiint x^2\,\mathrm{d}V = \iiint y^2\,\mathrm{d}V = \iiint z^2\,\mathrm{d}V$, we get $\iiint (x^2+y^2)\,\mathrm{d}V = 2\Delta$ and $\iiint (x^2+y^2+z^2)\,\mathrm{d}V = 3\Delta$. But $x^2+y^2+z^2$ is the squared distance from the origin, so in spherical coordinates

$$
\iiint r_{\text{spherical}}^2\,\mathrm{d}V
  = \int_0^{2\pi}\int_0^{\pi}\int_0^R r^2\cdot(r^2\sin\theta)\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}\phi
  = 4\pi\frac{R^5}{5}.
$$

Thus $3\Delta = 4\pi R^5/5$, so $\Delta = 4\pi R^5/15$, and $\iiint (x^2+y^2)\,\mathrm{d}V = 2\Delta = 8\pi R^5/15$. Finally, multiplying by $\rho = 3m/(4\pi R^3)$,

$$
I = \rho\cdot\frac{8\pi R^5}{15}
  = \frac{3m}{4\pi R^3}\cdot\frac{8\pi R^5}{15}
  = \frac{2}{5}mR^2.
$$

There it is — the famous result for a solid sphere. The derivation is a little messy in Cartesian coordinates, but with a little symmetry magic it works out nicely.

## Several examples

The author is too lazy to provide examples. Check past Physics C exams, or try computing the rotational inertia of a few objects yourself. If you meet a nonuniform density, compute $\mathrm{d}m$ as usual, substitute the expression for $\rho$ first, and then carry out the integral.
