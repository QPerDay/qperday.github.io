---
title: Inextensible Cables and Strings
description: A common formulation of a string as an inextensible cable.
date: 2026-08-14
author: 
    - Sean Li
---

A while ago we had an debate on this problem Andy set:

:problem-card{id="20260727"} 

In Andy's original problem statement, the string is not described as a variable-mass system. This caused quite a bit of confusion, because Andy's reference answer uses free fall ($v = \sqrt{2 g h}$) for an infinitesimally short peice of string in contact with the floor $\mathrm d y$, while Ryan and I thought this was impossible because this looks definitely a violation of the length-invariance of strings, as commonly assumed in mechanics problems.

::info-box{title="On Andy's formalization"}
Andy's formalization — what's known as a *variable-mass system* — is entirely standard, and there is nothing wrong with it. This article is not a refutation of his answer. What I want to do instead is pose the alternative Ryan and I kept reaching for: describe the string as an inextensible curve and ask precisely what that description forces. It turns out to force less than we assumed.
::

But before we dive into technical details, let's first clarify some concepts. In the AP exam, a string or cable is assumed to have the following properties, unless stated otherwise:

::info-box{title="The AP assumptions"}
1. **Inextensibility.** The string preserves length invariance. There is no way to make a string's length change (or else it will be a softbody or some other weird kind of object).
2. **Mass distribution.** There is a linear mass density $\lambda$ — parametrized by position along the string — such that each infinitesimal segment of physical length $\mathrm{d}\ell$ carries mass $\mathrm{d}M = \lambda\,\mathrm{d}\ell$.
3. **Flexibility.** The string is limp: it pulls only along its own direction and offers no resistance to bending.
::


## Making the string precise

Let's formalize what "length invariance" actually means, because it turns out to be less restrictive than it sounds.

Label each infinitesimal piece of the string with a material coordinate $s \in [0, 1]$, so that $s = 0$ is one end and $s = 1$ is the other. At time $t$, let

$$L(t, s) \in \mathbb{R}^3$$

be the position of the piece labeled $s$. This is a Lagrangian description: $s$ tags a piece of *stuff*, and $L(t, \cdot)$ is the curve the string traces out in space at time $t$.

:pic{src="Screenshot 2026-08-14 at 17.15.18.png" caption="An inextensible string."}

The partial derivative $\partial L / \partial s$ is the tangent vector to the string, and its magnitude is the local stretch. A material segment of width $\mathrm{d}s$ occupies a physical length

$$\mathrm{d}\ell = \left\lvert \frac{\partial L}{\partial s} \right\rvert \mathrm{d}s,$$

so the total length of the string at time $t$ is

$$\ell(t) = \int_0^1 \left\lvert \frac{\partial L}{\partial s} \right\rvert \mathrm{d}s.$$

Length invariance is then precisely the statement that this integral is constant in time:

::theorem-box{title="Weak Length Preservation"}
$$\int_0^1 \left\lvert \frac{\partial L}{\partial s} \right\rvert \mathrm{d}s = \text{constant}, \qquad\text{equivalently}\qquad \frac{\mathrm{d}\ell}{\mathrm{d}t} = 0.$$
::

In practice we make this constraint *pointwise* rather than global by choosing $s$ to be arc length. Then every segment is stretched by the same factor, and the integrand is constant:

::theorem-box{title="Strong Length Preservation"}
$$\left\lvert \frac{\partial L}{\partial s} \right\rvert = \ell_0 \quad\text{for all } s \in [0, 1],$$
::

where $\ell_0$ is the (constant) total length. This is the strong form of inextensibility: no single piece may stretch or compress, which automatically enforces the integral condition.

Two remarks are worth flagging now, since the confusion in Andy's problem lives exactly here.

First, the constraint involves only the *spatial* derivative $\partial L / \partial s$. The velocity of a material point,

$$v(t, s) = \frac{\partial L}{\partial t}(t, s),$$

is completely unconstrained by it. Preserving lengths says nothing about how fast, or in what direction, any piece moves — only that the pieces maintain their relative distances along the string.

Second, a pointwise constraint forbids stretching but not folding:

::warning-box{title="Inextensibility allows folding"}
A pointwise constraint $|\partial L / \partial s| = \ell_0$ forbids *stretching*, but it does not forbid *folding*. A kink — an abrupt change in the tangent direction — costs no length at all. A material point can therefore "turn a corner" instantaneously, changing its velocity discontinuously, while the string remains perfectly inextensible. This is the loophole that lets an infinitesimal piece free-fall even when it is still connected to the rest of the string.
::

## But... Does Point-Wise Free Fall Still Work?

First things first: **yes, it does — for the configuration we are considering.**

I initially thought that allowing each infinitesimal piece of the string to free-fall independently would contradict inextensibility. The mistake is that free fall does not cause different pieces of the string to acquire different displacements when they all start from rest in the same gravitational field.

Let's see this explicitly.

### Invariance Proof

Suppose the initial string is any arc-length-parametrized curve $L_0(s)$, and every material point is subjected to the same constant gravitational acceleration while initially at rest. The pointwise free-fall solution is

$$
L(t,s)
=
L_0(s)
+
\frac12\mathbf g\,t^2,
$$

where $\mathbf g$ is the gravitational acceleration vector.

Consequently,

$$
\frac{\partial L}{\partial s}(t,s)
=
\frac{\partial L_0}{\partial s}(s),
$$

because the displacement is independent of $s$. Hence

$$
\left|
\frac{\partial L}{\partial s}(t,s)
\right|
=
\left|
\frac{\partial L_0}{\partial s}(s)
\right|.
$$

Thus

$$
\ell(t)
=
\int_0^1
\left|
\frac{\partial L_0}{\partial s}
\right|
\,\mathrm ds
=
\ell(0).
$$

We have therefore proved the following.

::theorem-box{title="Free Fall Preserves Inextensibility"}

Let $L_0:[0, 1]\to\mathbb R^3$ be an initial string configuration and suppose every material point starts from rest:

$$
\dot L(0,s)=0.
$$

::

If the subsequent motion is pointwise free fall under a uniform gravitational field $\mathbf g$, then

$$
L(t,s)
=
L_0(s)+\frac12\mathbf g\,t^2.
$$

Consequently,

$$
\frac{\partial L}{\partial s}(t,s)
=
\frac{\partial L_0}{\partial s}(s),
$$

and therefore

$$
\ell(t)=\ell(0).
$$

Thus pointwise free fall is compatible with the inextensibility constraint.
::

This also clarifies the logical status of the argument. It would be incorrect to say

$$
\forall L,\quad \dot L(0,s)=0
\implies
\ell(t)=\ell(0),
$$

because an arbitrary motion $L$ can certainly begin with zero velocity and subsequently deform the string.

The correct statement is instead

$$
\forall L\,
\left[
\begin{array}{c}
L\text{ satisfies the pointwise free-fall equation}\\
\land\\
\dot L(0,s)=0
\end{array}
\right]
\implies
\ell(t)=\ell(0).
$$

In other words, **the free-fall dynamics themselves preserve the geometric constraint**.

## What This Means for the Original Problem

This resolves the apparent contradiction in Andy's problem.

The assumption that a string is inextensible does **not** imply that every material point must have the same velocity. Inextensibility constrains the spatial derivative

$$
\frac{\partial L}{\partial s},
$$

not the temporal derivative

$$
\frac{\partial L}{\partial t}.
$$

In the particular free-fall solution above, something stronger happens: every material point happens to have the same velocity because the gravitational acceleration is uniform and the initial velocity is zero. Hence the entire cable undergoes a rigid translation.

In fact, plotting out the exact differential equation, this looks embarrasingly trivial:

:desmos{src="https://www.desmos.com/3d/mkgde7bh6s"}

Therefore, there is no contradiction between

1. treating an infinitesimal piece of cable as a freely falling material element, and
2. requiring the cable to remain inextensible.

The two descriptions are compatible.

This gives us a useful way of thinking about the problem: **the inextensibility condition is a constraint on admissible configurations, not necessarily a prescription for the velocity of every material point.** A proposed kinematic evolution is valid precisely when its resulting configuration remains inside the space of inextensible curves.

For the present model, the pointwise free-fall construction does exactly that.

::theorem-box{title="Kinematic Construction"}

Starting from an initially stationary inextensible cable in a uniform gravitational field, pointwise free fall gives

$$
L(t,s)=L_0(s)+\frac12\mathbf g t^2,
$$

which remains inextensible for every $t$.

Thus pointwise free fall provides a valid kinematic evolution of the cable under the inextensibility constraint.
::

Within the ordinary AP Mechanics model, this gives us a perfectly legitimate construction of the kinematics. We are not violating the string constraint and then appealing to some special interpretation of a variable-mass system; rather, we have explicitly constructed a motion $L(t,s)$ satisfying the geometric inextensibility condition.

The important distinction is therefore not between "free-falling string" and "inextensible string." The real distinction is between **different mathematical models of what happens when material enters or leaves contact with the floor**.

And, as usual, this is where physics becomes delightfully less innocent than the diagrams in the textbook suggest.

---

## Conclusion

The original objection was based on a mistaken implication:

$$
\text{inextensible}
\quad\not\Rightarrow\quad
\text{every material point has constrained velocity}.
$$

Instead,

$$
\text{inextensible}
\quad\Rightarrow\quad
\left|
\frac{\partial L}{\partial s}
\right|
=
\text{constant}.
$$

For a cable initially at rest in a uniform gravitational field, pointwise free fall produces

$$
L(t,s)=L_0(s)+\frac12\mathbf g t^2,
$$

so

$$
\frac{\partial L}{\partial s}(t,s)
=
\frac{\partial L_0}{\partial s}(s).
$$



The length is therefore preserved exactly.

So the pointwise free-fall model is not merely an approximation that happens to work numerically: **it is a valid solution of the inextensibility constraint for this initial-value problem.**

More generally, this suggests a useful methodology for mechanics problems involving ideal strings and cables:

> First specify the configuration space — here, the space of inextensible curves. Then specify the kinematic evolution. Finally, verify that the evolution remains inside the constraint space.

For this problem, the verification succeeds exactly.

The construction is therefore **sound**: every motion produced by the stated free-fall model satisfies the inextensibility constraint. Subject to the usual assumptions and idealizations of AP Mechanics, it also gives the complete kinematic evolution for this particular initial-value model.

As always, that final statement is relative to the model. Whether a more sophisticated physical theory admits additional phenomena is a different question(Dont get me started on Norton's Dome).