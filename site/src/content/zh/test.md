---
title: Markdown 与组件测试
description: 测试所有内容组件以及全部受支持的 Markdown 语法。
date: 2026-08-13
author:
  - Sean Li
---

## 组件

::problem-box{title="题目"}
这是一个**题目**框。行内公式 $E = mc^2$ 在这里同样有效。
::

::answer-box{title="答案"}
这是一个*答案*框，带有一个指向 [QPD 首页](/ ) 的链接。
::

::warning-box{title="警告"}
请注意 —— 这是一个警告框。
::

::info-box{title="信息"}
信息框，适用于注释与旁注。
::

::error-box{title="错误"}
错误框。出问题了。
::

::theorem-box{title="定理"}
定理框：三角形内角和为 $\pi$。
::

## 行内格式

这个段落包含 **粗体**、*斜体*、***两者兼有***、~~删除线~~、
`行内代码`、一个 [链接](https://example.com)，以及自动链接
https://example.com。公式：$x^2 + y^2 = r^2$ 与一个行间公式

$$\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}.$$

## 标题

### 三级标题

#### 四级标题

## 列表

- 无序
- 项目
  - 嵌套
  - 嵌套二
- 返回

1. 有序
2. 项目
   1. 嵌套
   2. 嵌套二
3. 返回

## 引用

> 一个引用段落，含 `代码` 与 *强调*。
>
> 同一引用中的第二段。

## 表格

| 左对齐 | 居中 | 右对齐 |
|:------|:----:|-------:|
| a     | b    | c      |
| d     | e    | f      |

## 代码

JavaScript：

```js
function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2)
}
```

Python：

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

Shell：

```bash
echo "hello" && pnpm build
```

JSON：

```json
{ "name": "QPD", "year": 2026 }
```

无语言：

```
纯文本
  带缩进
```

## 水平分割线

---
