---
title: Markdown & Component Test
description: Exercises every content component and all supported Markdown syntax.
date: 2026-08-13
author:
  - Sean Li
---

## Components

::problem-box{title="Problem"}
This is a **problem** box.  Inline math $E = mc^2$ works here too.
::

::answer-box{title="Answer"}
This is an *answer* box with a link to the [QPD home](/).
::

::warning-box{title="Warning"}
Watch out — this is a warning box.
::

::info-box{title="Information"}
An information box, useful for notes and side remarks.
::

::error-box{title="Error"}
An error box.  Something went wrong.
::

::theorem-box{title="Theorem"}
A theorem box: the sum of the angles of a triangle is $\pi$.
::

## Inline formatting

This paragraph has **bold**, *italic*, ***both***, ~~strikethrough~~,
`inline code`, a [link](https://example.com), and an auto-linked
https://example.com.  Math: $x^2 + y^2 = r^2$ and a display equation

$$\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}.$$

## Headings

### Third level

#### Fourth level

## Lists

- unordered
- items
  - nested
  - nested two
- back

1. ordered
2. items
   1. nested
   2. nested two
3. back

## Blockquote

> A quoted paragraph with `code` and *emphasis*.
>
> A second paragraph in the same quote.

## Table

| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |
| d    | e      | f     |

## Code

JavaScript:

```js
function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2)
}
```

Python:

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

Shell:

```bash
echo "hello" && pnpm build
```

JSON:

```json
{ "name": "QPD", "year": 2026 }
```

No language:

```
plain preformatted text
  with indentation
```

## Horizontal rule

---
