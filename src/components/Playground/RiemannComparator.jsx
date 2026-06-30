import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { linspace, CURVES, trapezoidal, riemannRects, riemannRectsRight, riemannRectsMid, trapezoidRects } from '../../utils/math'

const MARGIN = { top: 12, right: 15, bottom: 30, left: 48 }
const HEIGHT = 220

const CURVE_OPTIONS = [
  { key: 'parabola', label: 'f(x) = x²', a: 0, b: 2 },
  { key: 'sine', label: 'f(x) = sin(x)', a: 0, b: Math.PI },
  { key: 'cubic', label: 'f(x) = x³ − 3x + 3', a: 0, b: 2 },
]

const METHODS = [
  { key: 'left', label: 'Left', color: '#22d3ee' },
  { key: 'right', label: 'Right', color: '#818cf8' },
  { key: 'mid', label: 'Midpoint', color: '#f5a030' },
  { key: 'trap', label: 'Trapezoid', color: '#a3e635' },
]

function getRects(method, f, a, b, n) {
  if (method === 'left') return riemannRects(f, a, b, n)
  if (method === 'right') return riemannRectsRight(f, a, b, n)
  if (method === 'mid') return riemannRectsMid(f, a, b, n)
  if (method === 'trap') return trapezoidRects(f, a, b, n)
  return []
}

function getApprox(method, rects) {
  if (method === 'trap') return rects.reduce((s, r) => s + r.width * (r.heightLeft + r.heightRight) / 2, 0)
  return rects.reduce((s, r) => s + r.width * r.height, 0)
}

function RiemannPanel({ method, f, a, b, n, trueArea, xDomain, containerWidth }) {
  const svgRef = useRef(null)
  const color = METHODS.find(m => m.key === method).color

  useEffect(() => {
    if (!svgRef.current || containerWidth <= 0) return
    const iw = containerWidth - MARGIN.left - MARGIN.right
    const ih = HEIGHT - MARGIN.top - MARGIN.bottom

    const pts = linspace(xDomain[0], xDomain[1], 300).map(x => ({ x, y: f(x) }))
    const ys = pts.map(p => p.y).filter(isFinite)
    const yDomain = [Math.min(0, ...ys) - 0.2, Math.max(...ys) + 0.4]

    const xScale = d3.scaleLinear().domain(xDomain).range([0, iw])
    const yScale = d3.scaleLinear().domain(yDomain).range([ih, 0])

    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    const axisColor = '#3b4d74'
    const labelColor = '#8395b8'

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(4))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(5))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + ih})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const rects = getRects(method, f, a, b, n)

    if (method === 'trap') {
      rects.forEach(r => {
        const x0px = xScale(r.x)
        const x1px = xScale(r.x + r.width)
        const y0px = yScale(Math.max(0, r.heightLeft))
        const y1px = yScale(Math.max(0, r.heightRight))
        const base = yScale(0)
        const pathData = `M${x0px},${base} L${x0px},${y0px} L${x1px},${y1px} L${x1px},${base} Z`
        g.append('path').attr('d', pathData)
          .attr('fill', `${color}33`).attr('stroke', color).attr('stroke-width', 0.8)
      })
    } else {
      rects.forEach(r => {
        const rx = xScale(r.x)
        const rw = xScale(r.x + r.width) - xScale(r.x)
        const ry = r.positive ? yScale(r.height) : yScale(0)
        const rh = Math.abs(yScale(r.height) - yScale(0))
        g.append('rect')
          .attr('x', rx).attr('y', ry).attr('width', rw).attr('height', rh)
          .attr('fill', `${color}33`).attr('stroke', color).attr('stroke-width', 0.8)
      })
    }

    // Curve
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    const approx = getApprox(method, rects)
    const err = Math.abs(approx - trueArea)
    const relErr = (err / Math.abs(trueArea) * 100).toFixed(2)

    g.append('text')
      .attr('x', iw - 4).attr('y', 16)
      .attr('text-anchor', 'end').attr('fill', err < 0.02 * Math.abs(trueArea) ? '#a3e635' : color)
      .attr('font-size', 10).attr('font-weight', 600)
      .text(`≈ ${approx.toFixed(4)}  (${relErr}% err)`)

  }, [containerWidth, method, f, a, b, n, trueArea, xDomain, color])

  return <svg ref={svgRef} />
}

export default function RiemannComparator() {
  const [curveKey, setCurveKey] = useState('parabola')
  const [n, setN] = useState(8)
  const [activeMethod, setActiveMethod] = useState(null)

  const curveOpt = CURVE_OPTIONS.find(c => c.key === curveKey)
  const { a, b } = curveOpt
  const f = CURVES[curveKey]
  const xDomain = [a - 0.15, b + 0.15]
  const trueArea = trapezoidal(f, a, b)

  const ref = useRef(null)
  const [width, setWidth] = useState(480)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  function handleCurveChange(key) {
    setCurveKey(key)
  }

  const panelW = activeMethod ? width : Math.floor((width - 12) / 2)
  const visibleMethods = activeMethod ? METHODS.filter(m => m.key === activeMethod) : METHODS

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fb923c' }}>
          Riemann Comparator
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {CURVE_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleCurveChange(opt.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: curveKey === opt.key ? '#fb923c' : 'var(--color-ink-700)',
                color: curveKey === opt.key ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                border: '1px solid var(--color-ink-600)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {METHODS.map(m => (
            <button
              key={m.key}
              onClick={() => setActiveMethod(activeMethod === m.key ? null : m.key)}
              className="text-xs px-3 py-1.5 rounded-full transition-all font-semibold"
              style={{
                backgroundColor: (activeMethod === m.key || activeMethod === null) ? `${m.color}22` : 'var(--color-ink-700)',
                color: m.color,
                border: `1px solid ${activeMethod === m.key ? m.color : 'var(--color-ink-600)'}`,
                opacity: activeMethod && activeMethod !== m.key ? 0.4 : 1,
              }}
            >
              {m.label}
            </button>
          ))}
          {activeMethod && (
            <button
              onClick={() => setActiveMethod(null)}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ color: 'var(--color-ink-400)', border: '1px solid var(--color-ink-600)' }}
            >
              Show all
            </button>
          )}
        </div>

        <div ref={ref} className="w-full">
          <div
            className="flex flex-wrap gap-3"
          >
            {visibleMethods.map(m => (
              <div key={m.key} style={{ width: activeMethod ? '100%' : 'calc(50% - 6px)' }}>
                <div className="text-xs mb-1 font-semibold" style={{ color: m.color }}>
                  {m.label}
                </div>
                <RiemannPanel
                  method={m.key}
                  f={f} a={a} b={b} n={n}
                  trueArea={trueArea}
                  xDomain={xDomain}
                  containerWidth={activeMethod ? width : panelW}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs" style={{ color: 'var(--color-ink-400)' }}>
            <span>n = <strong style={{ color: '#fb923c' }}>{n}</strong> rectangles</span>
            <span>True area: <strong style={{ color: '#22d3ee' }}>{trueArea.toFixed(5)}</strong></span>
          </div>
          <input type="range" min={1} max={100} step={1} value={n}
            onChange={e => setN(parseInt(e.target.value))}
            className="w-full" style={{ accentColor: '#fb923c' }}
          />
        </div>

        <div
          className="mt-4 rounded-lg px-4 py-3 text-xs"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)', color: 'var(--color-ink-300)' }}
        >
          <strong style={{ color: '#a3e635' }}>Observe:</strong> Midpoint and Trapezoid converge faster than Left or Right for the same n. Try n = 4 vs n = 20 and compare the error percentages.
        </div>
      </div>
    </div>
  )
}
