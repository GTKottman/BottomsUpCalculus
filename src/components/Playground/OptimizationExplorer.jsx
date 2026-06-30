import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { linspace, numericalDerivative } from '../../utils/math'

const MARGIN = { top: 15, right: 20, bottom: 30, left: 50 }
const HEIGHT = 260

const FUNCTIONS = [
  {
    key: 'cubic',
    label: 'f(x) = x³ − 3x',
    f: x => x * x * x - 3 * x,
    xDomain: [-2.5, 2.5],
    criticalLabel: 'x = ±1',
  },
  {
    key: 'quartic',
    label: 'f(x) = x⁴ − 4x²',
    f: x => x ** 4 - 4 * x * x,
    xDomain: [-2.5, 2.5],
    criticalLabel: 'x = 0, ±√2',
  },
  {
    key: 'sine',
    label: 'f(x) = sin(x)',
    f: x => Math.sin(x),
    xDomain: [-5, 5],
    criticalLabel: 'x = ±π/2, ±3π/2, ...',
  },
  {
    key: 'gaussian',
    label: 'f(x) = e^(−x²)',
    f: x => Math.exp(-x * x),
    xDomain: [-3, 3],
    criticalLabel: 'x = 0',
  },
]

function findCriticalPoints(f, xDomain) {
  const xs = linspace(xDomain[0] + 0.01, xDomain[1] - 0.01, 800)
  const criticals = []
  for (let i = 1; i < xs.length - 1; i++) {
    const d0 = numericalDerivative(f, xs[i - 1])
    const d1 = numericalDerivative(f, xs[i + 1])
    if (d0 * d1 < 0) {
      // Sign change -- bisect to find root
      let lo = xs[i - 1], hi = xs[i + 1]
      for (let k = 0; k < 20; k++) {
        const mid = (lo + hi) / 2
        const dm = numericalDerivative(f, mid)
        if (Math.abs(dm) < 1e-9) { lo = hi = mid; break }
        if (d0 * dm < 0) hi = mid; else lo = mid
      }
      const xc = (lo + hi) / 2
      const yc = f(xc)
      const d2 = (numericalDerivative(f, xc + 1e-4) - numericalDerivative(f, xc - 1e-4)) / (2e-4)
      const type = d2 < -0.01 ? 'max' : d2 > 0.01 ? 'min' : 'saddle'
      // De-duplicate
      if (!criticals.some(c => Math.abs(c.x - xc) < 0.05)) {
        criticals.push({ x: xc, y: yc, type })
      }
    }
  }
  return criticals
}

export default function OptimizationExplorer() {
  const [fnKey, setFnKey] = useState('cubic')
  const fn = FUNCTIONS.find(f => f.key === fnKey)
  const { f, xDomain } = fn
  const mid = (xDomain[0] + xDomain[1]) / 2
  const [x0, setX0] = useState(mid)

  const ref = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(480)

  const criticals = findCriticalPoints(f, xDomain)
  const fVal = f(x0)
  const fpVal = numericalDerivative(f, x0)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || width <= 0) return
    const iw = width - MARGIN.left - MARGIN.right
    const ih = HEIGHT - MARGIN.top - MARGIN.bottom

    const pts = linspace(xDomain[0], xDomain[1], 400).map(x => ({ x, y: f(x) }))
    const dpPts = linspace(xDomain[0], xDomain[1], 400).map(x => ({ x, y: numericalDerivative(f, x) }))

    const allYs = [...pts.map(p => p.y), ...dpPts.map(p => p.y)].filter(isFinite)
    const yPad = (Math.max(...allYs) - Math.min(...allYs)) * 0.12
    const yDomain = [Math.min(...allYs) - yPad, Math.max(...allYs) + yPad]

    const xScale = d3.scaleLinear().domain(xDomain).range([0, iw])
    const yScale = d3.scaleLinear().domain(yDomain).range([ih, 0])

    const svg = d3.select(svgRef.current)
    svg.attr('width', width).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    const axisColor = '#3b4d74'
    const labelColor = '#8395b8'

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(6))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + ih})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    // Zero line
    if (yDomain[0] < 0 && yDomain[1] > 0) {
      svg.append('line')
        .attr('x1', MARGIN.left).attr('x2', MARGIN.left + iw)
        .attr('y1', MARGIN.top + yScale(0)).attr('y2', MARGIN.top + yScale(0))
        .attr('stroke', '#3b4d74').attr('stroke-width', 1)
    }

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))

    // f'(x) curve -- muted
    g.append('path').datum(dpPts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#818cf8').attr('stroke-width', 1.5).attr('opacity', 0.6).attr('stroke-dasharray', '4,2')

    // f(x) curve
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

    // Critical points
    criticals.forEach(cp => {
      const color = cp.type === 'max' ? '#a3e635' : cp.type === 'min' ? '#f472b6' : '#fbbf24'
      g.append('circle')
        .attr('cx', xScale(cp.x)).attr('cy', yScale(cp.y))
        .attr('r', 7).attr('fill', color).attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)
      g.append('text')
        .attr('x', xScale(cp.x)).attr('y', yScale(cp.y) - 12)
        .attr('text-anchor', 'middle').attr('fill', color).attr('font-size', 10).attr('font-weight', 700)
        .text(cp.type === 'max' ? 'max' : cp.type === 'min' ? 'min' : 'saddle')
    })

    // Cursor
    const cursorY = f(x0)
    if (isFinite(cursorY)) {
      g.append('line')
        .attr('x1', xScale(x0)).attr('x2', xScale(x0))
        .attr('y1', 0).attr('y2', ih)
        .attr('stroke', '#f5a030').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.7)
      g.append('circle')
        .attr('cx', xScale(x0)).attr('cy', yScale(cursorY))
        .attr('r', 5).attr('fill', '#f5a030').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)
    }

    // Legend
    g.append('line').attr('x1', iw - 80).attr('x2', iw - 62).attr('y1', 8).attr('y2', 8)
      .attr('stroke', '#22d3ee').attr('stroke-width', 2)
    g.append('text').attr('x', iw - 58).attr('y', 12).attr('fill', '#22d3ee').attr('font-size', 9).text('f(x)')
    g.append('line').attr('x1', iw - 80).attr('x2', iw - 62).attr('y1', 22).attr('y2', 22)
      .attr('stroke', '#818cf8').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,2')
    g.append('text').attr('x', iw - 58).attr('y', 26).attr('fill', '#818cf8').attr('font-size', 9).text("f'(x)")

  }, [width, fnKey, x0, f, xDomain, criticals])

  function handleFnChange(key) {
    const opt = FUNCTIONS.find(fn => fn.key === key)
    setFnKey(key)
    setX0((opt.xDomain[0] + opt.xDomain[1]) / 2)
  }

  const nearCritical = criticals.find(c => Math.abs(c.x - x0) < 0.15)
  const isCriticalZone = Math.abs(fpVal) < 0.2

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#34d399' }}>
          Optimization Explorer
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {FUNCTIONS.map(fn => (
            <button
              key={fn.key}
              onClick={() => handleFnChange(fn.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: fnKey === fn.key ? '#34d399' : 'var(--color-ink-700)',
                color: fnKey === fn.key ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                border: '1px solid var(--color-ink-600)',
              }}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div ref={ref} className="w-full mb-4">
          <svg ref={svgRef} />
        </div>

        <div className="mb-2">
          <div className="text-xs mb-1" style={{ color: '#f5a030' }}>x = {x0.toFixed(3)}</div>
          <input type="range"
            min={xDomain[0]} max={xDomain[1]}
            step={(xDomain[1] - xDomain[0]) / 500}
            value={x0}
            onChange={e => setX0(parseFloat(e.target.value))}
            className="w-full" style={{ accentColor: '#f5a030' }}
          />
        </div>

        <div
          className="rounded-lg px-5 py-3 flex flex-wrap gap-5 text-sm"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>f(x) = </span>
            <span style={{ color: '#22d3ee', fontWeight: 600 }}>{fVal.toFixed(4)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>f'(x) = </span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{fpVal.toFixed(4)}</span>
          </div>
          {nearCritical && (
            <div
              className="w-full text-xs font-semibold"
              style={{ color: nearCritical.type === 'max' ? '#a3e635' : nearCritical.type === 'min' ? '#f472b6' : '#fbbf24' }}
            >
              Near a local {nearCritical.type}! f'(x) ≈ 0 here -- the function is momentarily flat.
            </div>
          )}
          {!nearCritical && isCriticalZone && (
            <div className="w-full text-xs" style={{ color: '#fbbf24' }}>
              f'(x) ≈ 0 -- approaching a critical point.
            </div>
          )}
          {!nearCritical && !isCriticalZone && (
            <div className="w-full text-xs" style={{ color: 'var(--color-ink-400)' }}>
              f' is {fpVal > 0 ? 'positive (f is increasing)' : 'negative (f is decreasing)'}. Seek x where f' = 0 to find extrema.
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-4 text-xs" style={{ color: 'var(--color-ink-500)' }}>
          <span><span style={{ color: '#a3e635' }}>●</span> local max</span>
          <span><span style={{ color: '#f472b6' }}>●</span> local min</span>
          <span><span style={{ color: '#fbbf24' }}>●</span> saddle</span>
          <span><span style={{ color: '#818cf8' }}>- -</span> f'(x)</span>
        </div>
      </div>
    </div>
  )
}
