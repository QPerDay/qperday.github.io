---
title: 如何计算物体的转动惯量
description: "猜猜为什么力学 C 又被称为 AP 的进阶数学。"
date: 2026-04-12
author: 
    - Ryan Huang
    - Sean Li
---

本文是一篇用积分计算物体转动惯量（moment of inertia）的入门教程，配有详细例题。它面向那些还不太清楚如何计算转动惯量的同学——这正是我们那位"重量级"物理老师漏讲的内容——而这类问题很可能出现在 `AP Physics C : Mechanics` 考试里。

> 本文最初由 Ryan 撰写，在此特别感谢他。我（Sean）只做了一些校对，并为不熟悉多重积分的同学补充了一些多元微积分的细节。

在本文里，我们会深入推导刚体的转动惯量，最后给你一套几乎适用于任何转动惯量积分问题的方法。它看起来可能有点吓人，但跟着具体例子走一遍会有帮助。祝大家 AP 考试顺利。

## 转动惯量

转动惯量是质量的"转动版本"。质量衡量的是改变物体*线*速度的难易程度（$F = ma$），转动惯量衡量的则是改变其*角*速度的难易程度。用转动形式写出的牛顿第二定律是

$$
\tau = I \alpha,
$$

其中 $\tau$ 是净力矩，$\alpha$ 是角加速度，$I$ 就是我们要找的转动惯量。

### 质点

看清 $I$ 含义的最直接的办法，是先推导单个质点的情形。把一个质量为 $m$ 的质点固定住，使它只能绕转轴在半径为 $r$ 的圆周上运动，再用一个垂直于位置矢量 $\vec r$ 的切向力 $\vec F$ 拉它：

:Pic{src="0412-1.png" width="50%"}

因为 $\vec F$ 垂直于 $\vec r$，它产生的力矩有简单的形式 $\tau = F r$（不用操心 $\sin\theta$ 这个因子）。转动形式的牛顿第二定律告诉我们，这个力矩等于 $I\alpha$，于是

$$
\tau = F r = I \alpha.
$$

现在把力和加速度联系起来。沿切向，牛顿第二定律给出 $F = m a_t$，而质点在圆周上运动的切向加速度是 $a_t = r \alpha$。把两者代入，

$$
I \alpha = F r = (m a_t) r = m (r \alpha) r = m r^2 \alpha.
$$

两边的 $\alpha$ 相消（只要 $\alpha \neq 0$），剩下

::theorem-box{title="质点的转动惯量"}
距转轴 $r$ 处、质量为 $m$ 的质点，其转动惯量为
$$
I = m r^2.
$$
::

注意这两个 $r$ 因子从哪来：一个来自力矩（$\tau = Fr$），一个来自切向加速度（$a_t = r\alpha$）。

作为练习，读者可以自行证明：一堆质点的转动惯量等于各自 $I$ 之和——换句话说，$I$ 是*可加的*。稍后我们会用到这个事实。

### 刚体

然而刚体并不是一个点：它占据空间中的一块区域，我们称之为 $\Omega$。诀窍是把它看成许多粘在一起的微小质点。把物体切成小块，每块质量为 $\Delta m$。由于 $I$ 可加，总的转动惯量就是所有小块之和：

$$
I = \sum_i \Delta m_i\, r_i^2,
$$

其中 $r_i$ 是第 $i$ 块到转轴的垂直距离。

现在让小块趋于无穷小，$\Delta m \to 0$：

:Pic{src="0412-2.png" width="50%"}

在这个极限下，求和就是一个黎曼和，而区域上的黎曼和正是积分。于是求和变成了对物体的积分：

::theorem-box{title="刚体的转动惯量"}
对于占据空间区域 $\Omega \subseteq \mathbb R^n$ 的刚体，
$$
I = \int_{\Omega} r^2 \,\mathrm{d}m,
$$
其中 $r : \Omega \to \mathbb R$ 给出 $\Omega$ 中每个点到转轴的距离。
::

还剩一个问题：这个积分是对*质量* $\mathrm{d}m$ 积的，但 $\Omega$ 是*空间*区域，我们只会对体积元 $\mathrm{d}V$ 积分。如何在两者之间转换？答案是**密度**——质量在 $\Omega$ 中的分布。

形式上，密度是一个函数 $\rho : \Omega \to \mathbb R$，它在每一点告诉我们那附近的小体积里装了多少质量。它的定义是：点 $p$ 处一个微小的体积 $\mathrm{d}V$ 含有质量 $\rho(p)\,\mathrm{d}V$：

::theorem-box{title="密度分布"}
$$
\rho(p)\,\mathrm{d}V = \mathrm{d}m
$$
::

你可能会忍不住把 $\rho = \frac{\mathrm{d}m}{\mathrm{d}V}$ 读成导数，但别这样——它只是微分质量与它所占的微分体积之间的换算因子。

代入后，我们的积分变成

::info-box{title="依赖于密度的转动惯量"}
$$
I = \int_\Omega r^2 \rho \,\mathrm{d}V
$$
若 $\rho$ 是常数，则可以把它提到积分号外：
$$
I = \rho \int_\Omega r^2 \,\mathrm{d}V \quad \text{其中 }\rho\text{ 为常数}
$$
::

## 例题

到目前为止都比较抽象。现在来真正算点什么。

### 一维物体

开始之前要先澄清一个细节。一根杆——线段 $\Omega = [0, L]$——作为一个集合是一维的：它位于 $\mathbb R^1$ 中。但你没法真正让一维空间里的东西*转动*：一条直线根本没有转动的余地，直线上的点只能来回滑动。

要谈论杆的转动，我们必须把它*嵌入*到更高维的空间里。"嵌入"就是"放置"：我们把一维的杆平放到平面 $\mathbb R^2$（或三维空间 $\mathbb R^3$）里，那里才有让它旋转的空间。杆本身仍是一维的，只是被放到了一个转动有意义的地方。

于是：设杆长为 $L$、密度均匀为 $\rho$。我们把它嵌入平面，沿 $x$ 轴放置，一端在原点，所以它占据 $\Omega = [0, L]$。它绕 $z$ 轴转动，$z$ 轴过原点且垂直于杆（指向平面外）。

关键简化在于：对杆上坐标为 $r$ 的点，它到 $z$ 轴的垂直距离恰好是 $r$——到轴的距离*就是*坐标本身。于是那个一般形式的积分

$$
I = \int_{\Omega} r^2 \rho \,\mathrm{d}V
$$

变成了普通的一元积分，$r$ 从 $0$ 到 $L$：

$$
I = \int_0^L r^2 \rho \,\mathrm{d}r.
$$

（为什么 $\mathrm{d}V$ 变成了 $\mathrm{d}r$？因为一维中"体积元"就是一个长度元。）

接下来，由于 $\rho$ 是常数，可以把它提到前面：

$$
I = \rho \int_0^L r^2 \,\mathrm{d}r.
$$

$r^2$ 的原函数是 $\frac{r^3}{3}$，所以

$$
I = \rho \left[ \frac{r^3}{3} \right]_0^L
  = \rho \left( \frac{L^3}{3} - 0 \right)
  = \rho\,\frac{L^3}{3}.
$$

快完成了，但答案还写着密度 $\rho$。通常我们更希望用杆的总质量 $M$ 来表示。对均匀杆，质量就是密度乘长度：

$$
M = \rho L \qquad\Longleftrightarrow\qquad \rho = \frac{M}{L}.
$$

代入，

$$
\boxed{I = \frac{M}{L}\cdot\frac{L^3}{3} = \frac{1}{3} M L^2}
$$

这就是那个熟悉的公式：细杆绕其端点、且垂直于杆的轴转动时的转动惯量。

::problem-box{title="练习"}
考虑占据 $\Omega = [0, L]$ 的杆，密度函数为 $\rho(r) = \lambda r$，其中 $\lambda$ 是某个已知量。求它绕 $r = 0$ 处端点、且垂直于杆的轴的转动惯量。

:::foldable{title="解答"}
杆是一维的，$\Omega = [0, L]$，轴过原点处的端点且垂直于杆。对坐标为 $r$ 的点，到轴的垂直距离就是 $r$ 本身。密度不再是常数，所以不能把它提到积分号外——它得留在里面：

$$
I = \int_0^L r^2 \,\rho(r)\,\mathrm{d}r
  = \int_0^L r^2\,(\lambda r)\,\mathrm{d}r
  = \lambda \int_0^L r^3\,\mathrm{d}r.
$$

$r^3$ 的原函数是 $\frac{r^4}{4}$，所以

$$
I = \lambda \left[ \frac{r^4}{4} \right]_0^L
  = \lambda\,\frac{L^4}{4}.
$$

这是用 $\lambda$ 表示的答案，但和前面一样，我们更希望用总质量 $M$ 表示。总质量是密度对整个杆的积分：

$$
M = \int_0^L \rho(r)\,\mathrm{d}r
  = \lambda \int_0^L r\,\mathrm{d}r
  = \lambda\,\frac{L^2}{2}
  \qquad\Longleftrightarrow\qquad
  \lambda = \frac{2M}{L^2}.
$$

代回去，

$$
I = \lambda\,\frac{L^4}{4}
  = \frac{2M}{L^2}\cdot\frac{L^4}{4}
  = \boxed{\,\frac{1}{2} M L^2\,}.
$$

于是

::::answer-box{}
$$ I = \frac 1 2 M L^2 $$

与均匀杆的 $I = \frac13 M L^2$ 相比：变密度杆*更*难转动，因为它的质量被推向了远端（$\rho$ 更大的地方），离轴更远。
::::

:::
::

### 二维物体

现在升一个维度：二维。现在不再是直线上的单个坐标，而是平面里带两个独立坐标的点。也就是说基本思路不变，但积分变成了二重积分。来看一个具体例子。

::problem-box{title="矩形薄板"}
考虑矩形薄板
$$\Omega = [-a / 2, a / 2] \times [-b / 2, b / 2]$$
密度为常数 $\rho = \sigma$。求 $\Omega$ 绕过原点、且垂直于板的轴的转动惯量。
::

区域是矩形，所以它关于 $x$ 和 $y$ 的积分限相互独立，这让计算特别简洁。

板上的点 $(x, y)$ 到过中心 $z$ 轴的垂直距离为
$$r = \sqrt{x^2 + y^2},$$
所以
$$r^2 = x^2 + y^2.$$
二维中密度是面密度 $\sigma$（单位面积的质量），一个微小矩形 $\mathrm{d}A = \mathrm{d}x\,\mathrm{d}y$ 的质量为
$$\mathrm{d}m = \sigma\,\mathrm{d}A.$$
套用主公式 $I = \int_\Omega r^2\,\mathrm{d}m$，得到

$$
I = \sigma \int_{-b/2}^{b/2} \int_{-a/2}^{a/2} (x^2 + y^2)\,\mathrm{d}x\,\mathrm{d}y.
$$

因为矩形恰好分成独立的 $x$ 范围和 $y$ 范围，积分拆成两个更简单的部分：

$$
I = \sigma\left[\int_{-b/2}^{b/2}\int_{-a/2}^{a/2} x^2\,\mathrm{d}x\,\mathrm{d}y
\;+
\int_{-a/2}^{a/2}\int_{-b/2}^{b/2} y^2\,\mathrm{d}y\,\mathrm{d}x\right].
$$

内层积分和一维中见到的完全一样：

$$
\int_{-a/2}^{a/2} x^2\,\mathrm{d}x = \left[\frac{x^3}{3}\right]_{-a/2}^{a/2} = \frac{a^3}{12},
\qquad
\int_{-b/2}^{b/2} y^2\,\mathrm{d}y = \frac{b^3}{12}.
$$

外层积分只是乘以剩下的那条边长，于是

$$
I = \sigma\left(b\cdot\frac{a^3}{12} + a\cdot\frac{b^3}{12}\right)
  = \sigma\,\frac{ab\,(a^2 + b^2)}{12}.
$$

最后，均匀薄板的总质量为
$$M = \sigma ab,$$
所以
$$\sigma = \frac{M}{ab}.$$
代入得到

::answer-box{}

$$
\boxed{\,I = \frac{1}{12}M(a^2 + b^2)\,}.
$$

这就是矩形薄板绕过中心、且垂直于板的轴转动的标准公式。两条边长通过 $a^2 + b^2$ 对称地出现，这正符合我们把两根过中心的杆（各自 $I = \tfrac{1}{12}ML^2$）合起来所预期的结果。
::

矩形之所以简单，是因为它是两个区间的乘积：$x$ 和 $y$ 的条件相互独立，二重积分自然地分离。

然而圆盘是圆的——矩形的诀窍立刻失效。盘上的点 $(x,y)$ 到轴的距离仍是 $r=\sqrt{x^2+y^2}$，所以被积函数和前面一样是 $r^2=x^2+y^2$，主公式给出

$$
I = \sigma \iint_\Omega (x^2+y^2)\,\mathrm{d}A.
$$

但圆盘**不是**两个区间的乘积。它的定义条件是 $x^2+y^2\le R^2$，两个变量被圆的方程缠在一起：对固定的 $x$，$y$ 从 $-\sqrt{R^2-x^2}$ 到 $+\sqrt{R^2-x^2}$，端点依赖 $x$。没法把"圆盘"写成"$x$ 在一个区间、$y$ 在另一个区间"这种独立积分限的形式。变量拒绝分离。

::problem-box{title="圆盘"}
考虑以原点为圆心、半径为 $R$ 的圆盘，
$$\Omega = \{(x,y): x^2+y^2 \le R^2\},$$
面密度恒为 $\sigma$。求它绕过原点、且垂直于盘的轴的转动惯量。
::

圆盘的圆形在提示我们换到一个本身就是圆的坐标系。不再用"横移多少、上移多少"（$x$ 和 $y$）来定位一个点，而是用"离多远、转多大角度"（$r$ 和 $\theta$）：

$$
x = r\cos\theta, \qquad y = r\sin\theta.
$$

在这些**极坐标**里，圆盘变得平凡：半径从 $0$ 到 $R$，角度绕一整圈从 $0$ 到 $2\pi$，两个范围相互独立：

$$
0 \le r \le R, \qquad 0 \le \theta \le 2\pi.
$$

圆盘又变成了两个区间的乘积。更好的是，被积函数化简了：到轴的平方距离是

$$
x^2+y^2 = (r\cos\theta)^2 + (r\sin\theta)^2 = r^2(\cos^2\theta + \sin^2\theta) = r^2.
$$

于是，在 $(r,\theta)$ 平面里，我们只是在普通矩形上积分简单函数 $r^2$。只有一个问题：微小面积元 $\mathrm{d}A$ **不是** $\mathrm{d}r\,\mathrm{d}\theta$。坐标变换会拉伸和挤压空间，我们必须算清到底拉伸了多少，否则积分会算错。

所以自然的问题是：**如何把坐标小方块 $\mathrm{d}r\,\mathrm{d}\theta$ 与它实际代表的那一小块面积 $\mathrm{d}A$ 联系起来？** 我们用几何来回答，什么都不用背。

一个微小的径向步长 $\mathrm{d}r$ 就是一段长度 $\mathrm{d}r$。一个微小的角度步长 $\mathrm{d}\theta$，在半径 $r$ 处扫出的弧长为 $r\,\mathrm{d}\theta$——这就是普通的"半径乘角度"弧长公式。两步互相垂直，所以它们围出的小块在小步长极限下是一个矩形，边长为 $\mathrm{d}r$ 和 $r\,\mathrm{d}\theta$：

$$
\mathrm{d}A = \mathrm{d}r \cdot r\,\mathrm{d}\theta = r\,\mathrm{d}r\,\mathrm{d}\theta.
$$

:Pic{src="0412-3.png"}


出现的这个因子 $r$ 是极坐标网格相对于普通矩形网格被拉伸的程度，它重要到有个名字：它就是笛卡尔坐标到极坐标映射的**雅可比 (Jacobian)**，记作

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

对我们的极坐标变换，把 $\mathrm{d}A = |J|\,\mathrm{d}r\,\mathrm{d}\theta$ 与刚搭出的矩形对照，就确认了 $|J| = r$。这个多余的因子 $r$ 正是弧长因子：点离原点越远，固定的角度步长 $\mathrm{d}\theta$ 扫出的面积就越大。

现在推导一路畅通。转动惯量积分变成

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

圆盘的总质量是密度乘面积，$M=\sigma\cdot\pi R^2$，所以 $\sigma=M/(\pi R^2)$。代入，

::answer-box{}
$$
I = \frac{M}{\pi R^2}\cdot\frac{\pi R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

这就是均匀圆盘绕其中心轴转动的那个熟悉公式。
::

注意这里的一般性启示。矩形之所以能分离，是因为它在笛卡尔坐标下*本来就是*区间的乘积；圆盘需要一次坐标变换才能被这样看待。雅可比就是这次变换的代价——它是一维链式法则（其中 $\mathrm{d}y=\frac{\mathrm{d}y}{\mathrm{d}x}\,\mathrm{d}x$）的二维版本，用来描述坐标变换对面积造成的拉伸。三维中同样的思想以体积拉伸因子 $|J|$ 的形式延续——柱坐标和球坐标各自对应各自的雅可比，这正是我们接下来处理实心物体的方式。

### 三维物体

实心物体是同一套故事升一个维度。占据空间区域 $\Omega$ 的物体，其质量为 $\mathrm{d}m=\rho\,\mathrm{d}V$，转动惯量为

$$
I = \int_\Omega r^2\,\rho\,\mathrm{d}V,
$$

其中 $r$ 是到转轴的垂直距离。新的要素是：坐标变换现在对应一个*体积*雅可比 $|J|$，于是 $\mathrm{d}V = |J|\,\mathrm{d}u\,\mathrm{d}v\,\mathrm{d}w$。

::problem-box{title="实心圆柱"}
考虑半径为 $R$、高为 $H$ 的实心圆柱，密度恒为 $\rho$，绕其中心轴（$z$ 轴）转动。求它的转动惯量。
::

圆柱横截面是圆的、沿长度方向是直的，这正是**柱坐标** $(r,\theta,z)$ 描述的。三个范围相互独立：

$$
0\le r\le R, \qquad 0\le\theta\le2\pi, \qquad 0\le z\le H.
$$

一个点到中心轴的垂直距离就是它的柱半径 $r$，所以被积函数是 $r^2$。体积元在横截面上具有与极坐标相同的拉伸因子，而 $z$ 方向完全没有被拉伸：

$$
\mathrm{d}V = r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z, \qquad\text{即}\qquad |J| = r.
$$

于是

$$
I = \rho\int_0^H\int_0^{2\pi}\int_0^R r^2\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z
  = \rho\int_0^H\int_0^{2\pi}\int_0^R r^3\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z.
$$

三个变量恰好分离：

$$
I = \rho\left(\int_0^H \mathrm{d}z\right)\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^R r^3\,\mathrm{d}r\right)
  = \rho\cdot H\cdot 2\pi\cdot\frac{R^4}{4}
  = \frac{\rho\pi H R^4}{2}.
$$

圆柱的质量是密度乘体积，$M=\rho\cdot\pi R^2 H$，所以 $\rho=M/(\pi R^2 H)$。代入，

::answer-box{}
$$
I = \frac{M}{\pi R^2 H}\cdot\frac{\pi H R^4}{2}
  = \boxed{\,\frac{1}{2}MR^2\,}.
$$

实心圆柱绕其中心轴的转动惯量与同半径的薄圆盘相同——高度 $H$ 被约掉了，因为每个薄片本身就是一个圆盘。
::

::problem-box{title="实心球"}
考虑半径为 $R$、密度恒为 $\rho$ 的实心球，绕过球心的轴（比如 $z$ 轴）转动。求它的转动惯量。
::

球在每个方向都是圆的，所以要用**球坐标** $(\rho,\theta,\phi)$：$\rho$ 是到原点的距离，$\theta$ 是绕 $z$ 轴的角度，$\phi$ 是与 $z$ 轴的夹角。三个范围相互独立：

$$
0\le\rho\le R, \qquad 0\le\theta\le2\pi, \qquad 0\le\phi\le\pi.
$$


球半径为 $\rho$、极角为 $\phi$ 的点，到 $z$ 轴的垂直距离是 $\rho\sin\phi$（这是它的水平投影），所以到轴的平方距离是

$$
r^2 = \rho^2\sin^2\phi.
$$

球坐标体积元对应一个两因子的雅可比——一个来自径向，一个来自角度方向——已知结果是

$$
\mathrm{d}V = \rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi, \qquad\text{即}\qquad |J| = \rho^2\sin\phi.
$$

（我们把它收在附录里；你不用每次都重新推导。）于是转动惯量积分为

$$
I = \rho\int_0^{2\pi}\int_0^\pi\int_0^R \left(\rho^2\sin^2\phi\right)\left(\rho^2\sin\phi\right)\mathrm{d}\rho\,\mathrm{d}\phi\,\mathrm{d}\theta.
$$

合并 $\rho$ 并分离变量，

$$
I = \rho\left(\int_0^{2\pi}\mathrm{d}\theta\right)\left(\int_0^\pi \sin^3\phi\,\mathrm{d}\phi\right)\left(\int_0^R \rho^4\,\mathrm{d}\rho\right).
$$

三部分都是标准的：第一个是 $2\pi$，第二个是 $\int_0^\pi \sin^3\phi\,\mathrm{d}\phi = \frac43$，第三个是 $\frac{R^5}{5}$。合起来，

$$
I = \rho\cdot 2\pi\cdot\frac43\cdot\frac{R^5}{5}
  = \frac{8\pi\rho R^5}{15}.
$$

球的质量是密度乘体积，$M=\rho\cdot\frac43\pi R^3$，所以 $\rho=3M/(4\pi R^3)$。代入，

::answer-box{}
$$
I = \frac{3M}{4\pi R^3}\cdot\frac{8\pi R^5}{15}
  = \boxed{\,\frac{2}{5}MR^2\,}.
$$

这就是实心球绕过球心的任意轴转动的那个熟悉公式。
::

## 附录：雅可比表

这是本教程用到的所有雅可比的速查表，以及它们各自如何套进主公式。

| 坐标系 | $\lvert J\rvert$ | 示例 |
|---|---|---|
| 笛卡尔（二维） | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y$ |
| 极坐标 $(r,\theta)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta$ |
| 笛卡尔（三维） | $1$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\,\mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z$ |
| 柱坐标 $(r,\theta,z)$ | $r$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z$ |
| 球坐标 $(\rho,\theta,\phi)$ | $\rho^2\sin\phi$ | $\int r^2\rho\,\mathrm{d}V = \int r^2\rho\cdot\rho^2\sin\phi\,\mathrm{d}\rho\,\mathrm{d}\theta\,\mathrm{d}\phi$ |

规则始终相同：坐标变换后，用 $|J|$ 乘以新的坐标微分来代替 $\mathrm{d}V$，并从表中查到 $|J|$。（这里单个 $\int$ 代表对整个物体的相应多重积分——$\iint$ 或 $\iiint$。）
