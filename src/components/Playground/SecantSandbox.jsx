import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { linspace, CURVES } from '../../utils/math'

const MARGIN = { top: 15, right: 15, bottom: 35, left: 50 }
const HEIGHT = 260

const CURVE_OPTIONS = [
  { key: 'parabola', label: 'f(x) = x²', xDomain: [-2.5, 2.5] },
  { key: 'cubic', label: 'f(x) = x³ − 3x', xDomain: [-2.5, 2.5] },
  { key: 'sine', label: 'f(x) = sin(x)', xDomain: [-4, 4] },
]

export default function SecantSandbox() {
  const [curveKey, setCurveKey] = useState('parabola')
  const ref = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(480)

  const curveOpt = CURVE_OPTIONS.find(c => c.key === curveKey)
  const { xDomain } = curveOpt
  const span = xDomain[1] - xDomain[0]

  const [x1, setX1] = useState(xDomain[0] + span * 0.25)
  const [x2, setX2] = useState(xDomain[0] + span * 0.75)

  const f = CURVES[curveKey]

  const y1 = f(x1)
  const y2 = f(x2)
  const dx = x2 - x1
  const slope = Math.abs(dx) < 1e-10 ? Infinity : (y2 - y1) / dx

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
    const ys = pts.map(p => p.y).filter(isFinite)
    const yPad = (Math.max(...ys) - Math.min(...ys)) * 0.15
    const yDomain = [Math.min(...ys) - yPad, Math.max(...ys) + yPad]

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

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Curve
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

    // Secant line -- extend beyond the two points
    if (isFinite(slope) && isFinite(y1)) {
      const extend = iw * 0.15 / xScale(1)
      const sx1 = x1 - extend
      const sx2 = x2 + extend
      const sy1 = y1 + slope * (sx1 - x1)
      const sy2 = y1 + slope * (sx2 - x1)
      g.append('line')
        .attr('x1', xScale(sx1)).attr('x2', xScale(sx2))
        .attr('y1', yScale(sy1)).attr('y2', yScale(sy2))
        .attr('stroke', '#f5a030').attr('stroke-width', 2).attr('stroke-dasharray', '5,3')
    }

    // Rise/run dashed helpers
    if (isFinite(y1) && isFinite(y2)) {
      g.append('line')
        .attr('x1', xScale(x1)).attr('x2', xScale(x2))
        .attr('y1', yScale(y1)).attr('y2', yScale(y1))
        .attr('stroke', '#818cf8').attr('stroke-width', 1).attr('stroke-dasharray', '3,2')
      g.append('line')
        .attr('x1', xScale(x2)).attr('x2', xScale(x2))
        .attr('y1', yScale(y1)).attr('y2', yScale(y2))
        .attr('stroke', '#818cf8').attr('stroke-width', 1).attr('stroke-dasharray', '3,2')
    }

    // Points
    if (isFinite(y1)) {
      g.append('circle').attr('cx', xScale(x1)).attr('cy', yScale(y1))
        .attr('r', 6).attr('fill', '#a3e635').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)
    }
    if (isFinite(y2)) {
      g.append('circle').attr('cx', xScale(x2)).attr('cy', yScale(y2))
        .attr('r', 6).attr('fill', '#f472b6').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)
    }
  }, [width, curveKey, x1, x2, f, xDomain, y1, y2, slope])

  function handleCurveChange(key) {
    const opt = CURVE_OPTIONS.find(c => c.key === key)
    const sp = opt.xDomain[1] - opt.xDomain[0]
    setCurveKey(key)
    setX1(opt.xDomain[0] + sp * 0.25)
    setX2(opt.xDomain[0] + sp * 0.75)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#22d3ee' }}>
          Secant Line Sandbox
        </span>
        <div className="flex gap-2">
          {CURVE_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleCurveChange(opt.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: curveKey === opt.key ? '#22d3ee' : 'var(--color-ink-700)',
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
        <div ref={ref} className="w-full mb-4">
          <svg ref={svgRef} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: '#a3e635' }}>
              x₁ = {x1.toFixed(3)} &nbsp; f(x₁) = {isFinite(y1) ? y1.toFixed(3) : 'undef'}
            </div>
            <input type="range"
              min={xDomain[0]} max={xDomain[1]} step={(xDomain[1] - xDomain[0]) / 400}
              value={x1}
              onChange={e => setX1(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#a3e635' }}
            />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#f472b6' }}>
              x₂ = {x2.toFixed(3)} &nbsp; f(x₂) = {isFinite(y2) ? y2.toFixed(3) : 'undef'}
            </div>
            <input type="range"
              min={xDomain[0]} max={xDomain[1]} step={(xDomain[1] - xDomain[0]) / 400}
              value={x2}
              onChange={e => setX2(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#f472b6' }}
            />
          </div>
        </div>

        <div
          className="rounded-lg px-5 py-3 flex flex-wrap gap-6 text-sm"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>Δx = </span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{dx.toFixed(4)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>Δy = </span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{isFinite(y2 - y1) ? (y2 - y1).toFixed(4) : 'undef'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>Slope = Δy/Δx = </span>
            <span style={{ color: '#f5a030', fontWeight: 700, fontSize: '1rem' }}>
              {Math.abs(dx) < 1e-10 ? 'undefined' : slope.toFixed(4)}
            </span>
          </div>
          {Math.abs(dx) < 0.05 && isFinite(slope) && (
            <div style={{ color: '#fbbf24', fontStyle: 'italic', fontSize: '0.8rem', width: '100%' }}>
              As x₂ → x₁ the secant slope approaches the instantaneous slope -- that is the derivative.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
