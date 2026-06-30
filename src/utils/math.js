/** Generate evenly-spaced x values */
export function linspace(a, b, n = 200) {
  const step = (b - a) / (n - 1)
  return Array.from({ length: n }, (_, i) => a + i * step)
}

/** Named curve functions */
export const CURVES = {
  parabola: x => x * x,
  cubic: x => x * x * x - 3 * x,
  sine: x => Math.sin(x),
  cosine: x => Math.cos(x),
  abs: x => Math.abs(x),
  sqrt: x => (x >= 0 ? Math.sqrt(x) : NaN),
  reciprocal: x => (x !== 0 ? 1 / x : NaN),
  exp: x => Math.exp(x) / 10,
  logabs: x => (x > 0 ? Math.log(x) : NaN),
}

/** Numerical derivative via central difference */
export function numericalDerivative(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h)
}

/** Points on tangent line at x0 for range [x0 - dx, x0 + dx] */
export function tangentLine(f, x0, dx = 1.5) {
  const y0 = f(x0)
  const slope = numericalDerivative(f, x0)
  return {
    x1: x0 - dx,
    y1: y0 + slope * (-dx),
    x2: x0 + dx,
    y2: y0 + slope * dx,
    slope,
    y0,
  }
}

/** Riemann sum rectangles (left endpoints) */
export function riemannRects(f, a, b, n) {
  const width = (b - a) / n
  return Array.from({ length: n }, (_, i) => {
    const x = a + i * width
    const y = f(x)
    return { x, width, height: y, positive: y >= 0 }
  })
}

/** Riemann sum rectangles (right endpoints) */
export function riemannRectsRight(f, a, b, n) {
  const width = (b - a) / n
  return Array.from({ length: n }, (_, i) => {
    const x = a + (i + 1) * width
    const y = f(x)
    return { x: a + i * width, width, height: y, positive: y >= 0 }
  })
}

/** Riemann sum rectangles (midpoints) */
export function riemannRectsMid(f, a, b, n) {
  const width = (b - a) / n
  return Array.from({ length: n }, (_, i) => {
    const x = a + (i + 0.5) * width
    const y = f(x)
    return { x: a + i * width, width, height: y, positive: y >= 0 }
  })
}

/** Trapezoid rule areas (returns array of trapezoids for display) */
export function trapezoidRects(f, a, b, n) {
  const width = (b - a) / n
  return Array.from({ length: n }, (_, i) => {
    const x0 = a + i * width
    const x1 = x0 + width
    const y0 = f(x0)
    const y1 = f(x1)
    return { x: x0, width, heightLeft: y0, heightRight: y1, height: (y0 + y1) / 2, positive: (y0 + y1) >= 0 }
  })
}

/** True area via trapezoidal rule (high resolution) */
export function trapezoidal(f, a, b, n = 2000) {
  const h = (b - a) / n
  let sum = (f(a) + f(b)) / 2
  for (let i = 1; i < n; i++) sum += f(a + i * h)
  return sum * h
}

/** Accumulation function F(x) = integral from a to x */
export function accumulationPoints(f, a, xMax, n = 100) {
  const step = (xMax - a) / n
  const pts = []
  let area = 0
  for (let i = 0; i <= n; i++) {
    const x = a + i * step
    pts.push({ x, y: area })
    area += f(x + step / 2) * step
  }
  return pts
}
