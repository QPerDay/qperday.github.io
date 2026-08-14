---
title: "分离变量：雅可比"
description: "当一个圆形物体的积分拒绝分离时该怎么办——以及修复它的那个神奇因子。"
date: 2026-04-12
author:
  - Sean Li
---

转动惯量的主公式，

$$
I = \int r^2\,\mathrm{d}m,
$$

以及如何在笛卡尔坐标下处理杆、薄板、长方体和球，都写在 Ryan 的教程里：

:blog-entry-card{slug="0412-integrate-inertia"}

但其中有一个步骤值得细看：对*圆形*物体，积分不会分离，尤其是球，是靠一个对称性技巧绕过，而不是正面硬算积分。

这篇指南讲的是"换坐标的为什么与怎么做"。它面向那些学过一元积分、却未必熟悉多重积分的同学，只引入一个新对象——**雅可比 (Jacobian)**——它是你用一个坐标系换掉另一个坐标系时，唯一需要的那个因子。

## 圆盘，以及笛卡尔坐标为什么"不配合"

圆盘是最简单的圆形物体，可它偏偏能打破对矩形那么奏效的方法。盘上的点 $(x,y)$ 到轴的距离为 $r = \sqrt{x^2+y^2}$，所以 $r^2 = x^2+y^2$，而

$$
I = \sigma \iint_\Omega (x^2+y^2)\,\mathrm{d}A,
$$

其中 $\sigma$ 是（均匀的）面密度。问题不在被积函数，而在区域。圆盘由 $x^2+y^2 \le R^2$ 定义，这个条件把两个变量*缠*在一起：对固定的 $x$，$y$ 从 $-\sqrt{R^2-x^2}$ 到 $+\sqrt{R^2-x^2}$，端点依赖 $x$。没法把"圆盘"写成"$x$ 在一个区间、$y$ 在另一个区间"这种独立积分限的形式。变量拒绝分离。

::problem-box{title="圆盘"}
考虑以原点为圆心、半径为 $R$ 的圆盘，$\Omega = \{(x,y): x^2+y^2 \le R^2\}$，面密度恒为 $\sigma$。求它绕过原点、且垂直于盘的轴的转动惯量。
::

圆盘的圆形在提示我们换到一个本身就是圆的坐标系。不再用"横移多少、上移多少"（$x$ 和 $y$）来定位一个点，而是用"离多远、转多大角度"（$r$ 和 $\theta$）：

$$
x = r\cos\theta, \qquad y = r\sin\theta.
$$

在这些**极坐标**里，圆盘变得平凡：半径从 $0$ 到 $R$，角度从 $0$ 到 $2\pi$，两个范围相互独立：

$$
0 \le r \le R, \qquad 0 \le \theta \le 2\pi.
$$

圆盘又变成了两个区间的乘积。更好的是，被积函数化简了：$x^2+y^2 = r^2(\cos^2\theta+\sin^2\theta) = r^2$。

于是，在 $(r,\theta)$ 平面里，我们只是在普通矩形上积分简单函数 $r^2$。只有一个问题：面积元 $\mathrm{d}A$ **不是** $\mathrm{d}r\,\mathrm{d}\theta$。坐标变换会拉伸和挤压空间，我们必须算清到底拉伸了多少，否则积分会算错。

## 如何把 $\mathrm{d}r\,\mathrm{d}\theta$ 与实际面积联系起来？

自然的问题是：**如何把坐标小方块 $\mathrm{d}r\,\mathrm{d}\theta$ 与它实际代表的那一小块面积 $\mathrm{d}A$ 联系起来？** 我们可以用几何来回答，什么都不用背。

一个微小的径向步长 $\mathrm{d}r$ 就是一段长度 $\mathrm{d}r$。一个微小的角度步长 $\mathrm{d}\theta$，在半径 $r$ 处扫出的弧长为 $r\,\mathrm{d}\theta$——这就是普通的"半径乘角度"弧长公式。两步互相垂直，所以它们围出的小块在小步长极限下是一个矩形，边长为 $\mathrm{d}r$ 和 $r\,\mathrm{d}\theta$：

$$
\mathrm{d}A = \mathrm{d}r \cdot r\,\mathrm{d}\theta = r\,\mathrm{d}r\,\mathrm{d}\theta.
$$

<!-- FIGURE: 0412-3.png — 极坐标网格的一个楔形，展示半径为 r 处、边长分别为 dr 和 r dθ 的小方块，弧长 r dθ 标注为角度方向的边长。 -->

出现的这个因子 $r$，是极坐标网格相对于普通矩形网格被拉伸的程度，它重要到有个名字：它就是笛卡尔坐标到极坐标映射的**雅可比 (Jacobian)**，

$$
|J| = r.
$$

一般地，每当我们把一个坐标系换成另一个坐标系，雅可比 $|J|$ 就告诉我们每个点上面积（或体积）被拉伸了多少：

::foldable{title="雅可比：定义"}
坐标变换在不同点以不同幅度拉伸、挤压空间。变量代换的**雅可比**是单个函数，记作 $|J|$，给出这个*局部拉伸因子*。二维中它把小坐标方块变成实际的一小块：

$$
\mathrm{d}A = |J|\,\mathrm{d}u\,\mathrm{d}v,
$$

三维中它把小坐标方块变成实际的一小块体积：

$$
\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w.
$$

竖线 $|\cdot|$ 表示"取正的大小"：拉伸因子永远是正数。你不需要背 $|J|$ 的通用公式——我们用的每个坐标系都自带一个已知值（见附录）。关键是这个思想：$|J|$ 是用一个坐标系换另一个坐标系时，在面积或体积上付出的代价。
::

把 $\mathrm{d}A = |J|\,\mathrm{d}r\,\mathrm{d}\theta$ 与刚搭出的矩形对照，就确认了 $|J| = r$。这个多余的因子正是弧长因子：点离原点越远，固定的角度步长 $\mathrm{d}\theta$ 扫出的面积就越大。

## 完成圆盘

现在推导一路畅通：

$$
I = \sigma\int_0^{2\pi}\int_0^R r^2\cdot r\,\mathrm{d}r\,\mathrm{d}\theta
  = \sigma\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta,
$$

因为积分限独立，两个变量恰好分离：

$$
I = \sigma\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^R r^3\,\mathrm{d}r\right)
  = \sigma\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\sigma\pi R^4}{2}.
$$

由 $M = \sigma\cdot\pi R^2$ 得 $\sigma = M/(\pi R^2)$，于是

::answer-box{}
$$
I = \frac{M}{\pi R^2}\cdot\frac{\pi R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

这就是均匀圆盘绕其中心轴转动的那个熟悉公式。
::

## 三维：同样的思想，换成体积因子

实心物体是同一套故事升一个维度。占据区域 $\Omega$ 的物体有 $\mathrm{d}m = \rho\,\mathrm{d}V$，而

$$
I = \int_\Omega r^2\,\rho\,\mathrm{d}V.
$$

新的要素是*体积*雅可比：$\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w$。

**圆柱。** 一个半径为 $R$、高为 $H$ 的实心圆柱绕其中心轴转动，横截面是圆的、沿长度方向是直的——这正是柱坐标 $(r,\theta,z)$ 描述的，$0\le r\le R$、$0\le\theta\le2\pi$、$0\le z\le H$。

<!-- FIGURE: 0412-4.png — 柱坐标，展示 r（到 z 轴的水平距离）、θ（绕 z 轴的角度）和 z（高度）。 -->

一个点到轴的距离就是它的柱半径 $r$，所以被积函数是 $r^2$。体积元在横截面上具有与极坐标相同的拉伸因子，而 $z$ 方向完全没有被拉伸：$\mathrm{d}V = r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$，即 $|J| = r$。于是

$$
I = \rho\int_0^H\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z
  = \rho\cdot H\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\rho\pi H R^4}{2},
$$

由 $M = \rho\cdot\pi R^2 H$ 得

::answer-box{}
$$
I = \boxed{\,\frac{1}{2}MR^2\,}.
$$
::

高度 $H$ 被约掉了，因为每个薄片本身就是一个圆盘。

**球。** 实心球在每个方向都是圆的，所以要用球坐标 $(\rho,\theta,\phi)$，$0\le\rho\le R$、$0\le\theta\le2\pi$、$0\le\phi\le\pi$。

<!-- FIGURE: 0412-5.png — 球坐标，展示 ρ（径向距离）、θ（绕 z 轴的方位角）和 φ（从 z 轴起的极角），并标注水平投影 ρ sin φ。 -->

球半径为 $\rho$、极角为 $\phi$ 的点，到 $z$ 轴的距离是 $\rho\sin\phi$，所以 $r^2 = \rho^2\sin^2\phi$。球坐标体积元对应一个两因子的雅可比——一个来自径向，一个来自角度方向——已知结果是

$$
\mathrm{d}V = \rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi, \qquad\text{即}\qquad |J| = \rho^2\sin\phi.
$$

于是

$$
I = \rho\int_0^{2\pi}\int_0^\pi\int_0^R \left(\rho^2\sin^2\phi\right)\left(\rho^2\sin\phi\right)\mathrm{d}\rho\,\mathrm{d}\phi\,\mathrm{d}\theta
  = \rho\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^\pi \sin^3\phi\,\mathrm{d}\phi\right)\left(\int_0^R \rho^4\,\mathrm{d}\rho\right).
$$

三部分分别是 $2\pi$、$\int_0^\pi\sin^3\phi\,\mathrm{d}\phi = \frac43$ 和 $\frac{R^5}{5}$，所以

$$
I = \rho\cdot 2\pi\cdot\frac43\cdot\frac{R^5}{5}
  = \frac{8\pi\rho R^5}{15},
$$

由 $M = \rho\cdot\frac43\pi R^3$ 得

::answer-box{}
$$
I = \frac{3M}{4\pi R^3}\cdot\frac{8\pi R^5}{15}
  = \boxed{\,\frac{2}{5}MR^2\,}.
$$
::

注意这里的一般性启示。矩形之所以能分离，是因为它在笛卡尔坐标下*本来就是*区间的乘积；圆盘和球需要一次坐标变换才能被这样看待。雅可比就是这次变换的代价——它是一维链式法则（$\mathrm{d}y = \frac{\mathrm{d}y}{\mathrm{d}x}\mathrm{d}x$）的二维/三维版本，用来描述坐标变换对面积或体积造成的拉伸。

## 附录：雅可比表

这是本指南用到的所有雅可比的速查表，以及它们各自如何套进主公式。

| 坐标系 | $\lvert J\rvert$ | 示例 |
|---|---|---|
| 笛卡尔（二维） | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y$ |
| 极坐标 $(r,\theta)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta$ |
| 笛卡尔（三维） | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z$ |
| 柱坐标 $(r,\theta,z)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$ |
| 球坐标 $(\rho,\theta,\phi)$ | $\rho^2\sin\phi$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot\rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi$ |

规则始终相同：坐标变换后，用 $|J|$ 乘以新的坐标微分来代替 $\mathrm{d}V$，并从表中查到 $|J|$。（这里单个 $\int$ 代表对整个物体的相应多重积分——$\iint$ 或 $\iiint$。）
