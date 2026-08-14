---
title: AP 力学临终关怀
description: AP Physics 1 力学的浓缩复习：运动学、力、能量、动量、转动、振动与流体。
date: 2026-08-14
author:
  - Sophie Chen
---

AP Physics 1 各大知识点的速览，浓缩成最关键的公式与思路，考前当作 checklist 用。

## 运动学基础

::theorem-box{title="四大运动学方程"}
匀加速 $a$ 下位移 $\Delta x = x - x_0$：

1. $v = v_0 + at$
2. $\Delta x = v_0 t + \tfrac12 a t^2$
3. $v^2 = v_0^2 + 2a\,\Delta x$
4. $\Delta x = \tfrac12 (v + v_0)\,t$

挑那个能跳过你不需要的量的方程。
::

::info-box{title="抛体运动：先分解"}
- **水平方向** 是匀速运动：$x = v_x t$，其中 $v_x = v_0\cos\theta$。水平方向没有加速度（忽略空气阻力），因此两方向彼此独立。
- **竖直方向** 受重力加速：$y = v_y t - \tfrac12 g t^2$，$v_y = v_0\sin\theta - gt$。最高点处 $v_y = 0$。
- **最大射程** 在平地上的发射角为 $45^\circ$：$R = \dfrac{v_0^2 \sin 2\theta}{g}$。互余角给出相等的射程。
::

::warning-box{title="自由落体：定好正方向就别变"}
向上为正则 $a = -g$；向下为正则 $a = +g$。自由释放的物体 $v_0 = 0$（于是 $\Delta y = \tfrac12 g t^2$）；上抛物体则要保证初速度符号与坐标系一致。
::

## 牛顿定律与力

::theorem-box{title="力的工具箱"}
- **牛顿第二定律：** $\vec{F}_{\text{net}} = m\vec{a}$ —— 矢量方程；加速度沿合外力方向，而不一定沿速度方向。
- **重力：** $F_g = mg$，始终竖直向下。
- **支持力：** 垂直于接触面，会*自行调整* —— 水平桌面上等于 $mg$，斜面上或加速时则不同。
- **张力：** 通过无质量绳传递，处处相等。
- **摩擦力：** 静摩擦 $f_s \le \mu_s N$（匹配外力直至上限）；动摩擦 $f_k = \mu_k N$（滑动时，通常小于最大静摩擦）。
::

::info-box{title="斜面与滑轮"}
- **斜面上** 重力分解为 $F_\parallel = mg\sin\theta$（沿斜面）与 $F_\perp = mg\cos\theta$（决定支持力）。
- **阿特伍德机：** 对每个质量写 $F_{\text{net}} = ma$ 并消去张力，得
  $$a = \frac{(m_2 - m_1)\,g}{m_1 + m_2}.$$
- **多体系统：** 先把整个系统当整体求 $a$（总质量、外力），再隔离单个物体求张力等内力。
::

::theorem-box{title="圆周运动"}
向心加速度 $a_c = \dfrac{v^2}{r} = \omega^2 r$ 指向圆心，需要真实的力 $F_c = \dfrac{mv^2}{r}$ —— 由张力、摩擦、支持力或重力提供。"向心"描述的是方向，不是一种新的力。

**竖直圆周** 中：最低点 $N = mg + \dfrac{mv^2}{r}$；最高点保持接触的最小速度由 $mg = \dfrac{mv^2}{r}$ 决定。
::

## 能量与功

::theorem-box{title="功、功率与动能定理"}
- **功：** $W = Fd\cos\theta$ —— 只有沿位移方向的力分量做功（$\theta = 90^\circ$ 做功为零，$\theta = 180^\circ$ 做负功）。
- **功率：** $P = \dfrac{W}{t} = Fv$。
- **动能定理：** $W_{\text{net}} = \Delta K$。变力或复杂路径（加速度不恒定）时，这是首选。
::

::info-box{title="两种势能"}
- **重力势能：** $U_g = mgh$，参考点任意 —— 只有*差值*有意义。
- **弹性势能：** $U_s = \tfrac12 k x^2$。伸长翻倍，储能翻四倍。
::

::warning-box{title="能量守恒的前提"}
仅当只有保守力做功时，机械能 $E = K + U$ 才守恒，即 $E_{\text{initial}} = E_{\text{final}}$。有摩擦或空气阻力时，要加上非保守功：
$$W_{\text{nc}} = \Delta E_{\text{mechanical}}.$$
::

## 动量与碰撞

::theorem-box{title="冲量与动量"}
- **动量：** $p = mv$（矢量）。
- **冲量：** $J = F\Delta t = \Delta p$。变力时 $J$ 等于力–时间图像下的面积。
::

::info-box{title="动量守恒"}
合外力为零时动量守恒 —— 二维问题中要*分别*在 $x$、$y$ 两个方向各自守恒。

- **弹性碰撞：** 动量与动能都守恒。
- **非弹性碰撞：** 仅动量守恒，动能损失为热或形变。
- **完全非弹性碰撞：** 两物体粘在一起（动能损失最大，末速度相同）。
- **爆炸：** 反向的碰撞 —— 内力释放储能；静止系统总动量为零，碎片须以矢量和为零的方式散开。
::

::info-box{title="二维碰撞"}
把 $p_{x,\text{initial}} = p_{x,\text{final}}$ 与 $p_{y,\text{initial}} = p_{y,\text{final}}$ 写成两个独立的标量方程，再解代数方程组。
::

## 转动

::theorem-box{title="转动运动学"}
以角位移 $\theta$（弧度）、角速度 $\omega$、角加速度 $\alpha$ 描述，方程与线性的对应：

1. $\omega = \omega_0 + \alpha t$
2. $\theta = \theta_0 + \omega_0 t + \tfrac12 \alpha t^2$
3. $\omega^2 = \omega_0^2 + 2\alpha(\theta - \theta_0)$

与半径 $r$ 处线量的联系：$s = r\theta$，$v_t = r\omega$，$a_t = r\alpha$。
::

::info-box{title="力矩与转动动力学"}
- **力矩：** $\tau = rF\sin\theta = r_\perp F$ —— 力的转动对应量。
- **转动的牛顿第二定律：** $\tau_{\text{net}} = I\alpha$，其中转动惯量 $I = \sum m r^2$ 衡量抵抗转动的程度。

**常见转动惯量**（考试会给）：实心球 $I = \tfrac25 MR^2$，空心球 $I = \tfrac23 MR^2$，实心圆柱/圆盘 $I = \tfrac12 MR^2$，环 $I = MR^2$，绕中心的细杆 $I = \tfrac{1}{12} ML^2$。

**平行轴定理：** $I = I_{\text{cm}} + Md^2$。
::

## 振动与流体

::theorem-box{title="简谐运动"}
- **弹簧：** $F = -kx$（胡克定律），周期 $T = 2\pi\sqrt{\dfrac{m}{k}}$，能量 $E = \tfrac12 kA^2$。
- **单摆：** $T = 2\pi\sqrt{\dfrac{L}{g}}$ —— 小角度下与质量无关。
- **位置、速度、加速度** 均为正弦：
  $$x(t) = A\cos(\omega t + \phi),\quad v(t) = -A\omega\sin(\omega t + \phi),\quad a(t) = -A\omega^2\cos(\omega t + \phi).$$
::

::info-box{title="流体静力学与动力学"}
- **密度与压强：** $\rho = \dfrac{m}{V}$，$P = \dfrac{F}{A}$，流体静压 $P = P_0 + \rho g h$。帕斯卡原理：压强变化在流体中无衰减传递。
- **浮力（阿基米德原理）：** $F_b = \rho_{\text{fluid}} V_{\text{displaced}}\, g$。
- **连续性方程：** $A_1 v_1 = A_2 v_2$ —— 不可压缩流体在缩窄处加速。
- **伯努利方程：** $P + \tfrac12 \rho v^2 + \rho g h = \text{常数}$（沿流线）—— 流速越大压强越低。
::
