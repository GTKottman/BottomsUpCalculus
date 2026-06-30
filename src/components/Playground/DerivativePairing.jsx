import { useState, useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import { linspace, CURVES, numericalDerivative, tangentLine } from '../../utils/math'

const MARGIN = { top: 12, right: 20, bottom: 30, left: 48 }
const PANEL_HEIGHT = 190

const CURVE_OPTIONS = [
  { key: 'parabola', label: 'f(x) = x²', xDomain: [-2.5, 2.5] },
  { key: 'cubic', label: 'f(x) = x³ − 3x', xDomain: [-2.5, 2.5] },
  { key: 'sine', label: 'f(x) = sin(x)', xDomain: [-4, 4] },
  { key: 'cosine', label: 'f(x) = cos(x)', xDomain: [-4, 4] },
]

function buildPanel(svgSel, f, xDomain, x0, highlightColor, showTangent, containerWidth) {
  const iw = containerWidth - MARGIN.left - MARGIN.right
  const ih = PANEL_HEIGHT - MARGIN.top - MARGIN.bottom

  const pts = linspace(xDomain[0], xDomain[1], 400).map(x => ({ x, y: f(x) }))
  const ys = pts.map(p => p.y).filter(isFinite)
  const yPad = (Math.max(...ys) - Math.min(...ys)) * 0.18
  const yDomain = [Math.min(...ys) - yPad, Math.max(...ys) + yPad]

  const xScale = d3.scaleLinear().domain(xDomain).range([0, iw])
  const yScale = d3.scaleLinear().domain(yDomain).range([ih, 0])

  svgSel.selectAll('*').remove()
  svgSel.attr('width', containerWidth).attr('height', PANEL_HEIGHT)

  const axisColor = '#3b4d74'
  const labelColor = '#8395b8'

  svgSel.append('g')
    .call(d3.axisLeft(yScale).ticks(4))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
    .call(g => g.select('.domain').attr('stroke', axisColor))
    .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

  svgSel.append('g')
    .call(d3.axisBottom(xScale).ticks(6))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top + ih})`)
    .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
    .call(g => g.select('.domain').attr('stroke', axisColor))
    .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

  const g = svgSel.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
  const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))

  g.append('path').datum(pts).attr('d', line)
    .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

  const y0 = f(x0)
  if (isFinite(y0)) {
    if (showTangent) {
      const tl = tangentLine(f, x0)
      if (isFinite(tl.y1) && isFinite(tl.y2)) {
        g.append('line')
          .attr('x1', xScale(tl.x1)).attr('x2', xScale(tl.x2))
          .attr('y1', yScale(tl.y1)).attr('y2', yScale(tl.y2))
          .attr('stroke', highlightColor).attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3')
      }
    }

    // Vertical cursor
    g.append('line')
      .attr('x1', xScale(x0)).attr('x2', xScale(x0))
      .attr('y1', 0).attr('y2', ih)
      .attr('stroke', highlightColor).attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.6)

    g.append('circle')
      .attr('cx', xScale(x0)).attr('cy', yScale(y0))
      .attr('r', 5).attr('fill', highlightColor).attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)
  }

  return { xScale, yScale }
}

export default function DerivativePairing() {
  const [curveKey, setCurveKey] = useState('cubic')
  const curveOpt = CURVE_OPTIONS.find(c => c.key === curveKey)
  const xDomain = curveOpt.xDomain
  const midX = (xDomain[0] + xDomain[1]) / 2
  const [x0, setX0] = useState(midX)

  const topRef = useRef(null)
  const topSvgRef = useRef(null)
  const botSvgRef = useRef(null)
  const [width, setWidth] = useState(480)

  const f = CURVES[curveKey]
  const dF = useCallback(x => numericalDerivative(f, x), [f])
  const slope = dF(x0)

  useEffect(() => {
    if (!topRef.current) return
    const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width))
    ro.observe(topRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!topSvgRef.current || !botSvgRef.current || width <= 0) return
    buildPanel(d3.select(topSvgRef.current), f, xDomain, x0, '#f472b6', true, width)
    buildPanel(d3.select(botSvgRef.current), dF, xDomain, x0, '#f472b6', false, width)
  }, [width, curveKey, x0, f, dF, xDomain])

  function handleCurveChange(key) {
    const opt = CURVE_OPTIONS.find(c => c.key === key)
    setCurveKey(key)
    setX0((opt.xDomain[0] + opt.xDomain[1]) / 2)
  }

  const slopeIsNearZero = Math.abs(slope) < 0.15
  const slopeSign = slope > 0.15 ? 'positive' : slope < -0.15 ? 'negative' : 'zero'

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f472b6' }}>
          f and f' Pairing
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {CURVE_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleCurveChange(opt.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: curveKey === opt.key ? '#f472b6' : 'var(--color-ink-700)',
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
        <div ref={topRef} className="w-full">
          <div className="text-xs mb-1 px-1" style={{ color: 'var(--color-ink-400)' }}>
            f(x) -- the function
          </div>
          <svg ref={topSvgRef} />
        </div>

        <div className="mt-3 w-full">
          <div className="text-xs mb-1 px-1" style={{ color: 'var(--color-ink-400)' }}>
            f'(x) -- its derivative
          </div>
          <svg ref={botSvgRef} />
        </div>

        <div className="mt-4 px-1">
          <div className="text-xs mb-1" style={{ color: '#f472b6' }}>
            x = {x0.toFixed(3)}
          </div>
          <input type="range"
            min={xDomain[0]} max={xDomain[1]}
            step={(xDomain[1] - xDomain[0]) / 500}
            value={x0}
            onChange={e => setX0(parseFloat(e.target.value))}
            className="w-full" style={{ accentColor: '#f472b6' }}
          />
        </div>

        <div
          className="mt-4 rounded-lg px-5 py-3 flex flex-wrap gap-5 text-sm items-center"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>f(x₀) = </span>
            <span style={{ color: '#22d3ee', fontWeight: 600 }}>{isFinite(f(x0)) ? f(x0).toFixed(4) : 'undef'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>f'(x₀) = </span>
            <span style={{ color: '#f472b6', fontWeight: 700 }}>{slope.toFixed(4)}</span>
          </div>
          {slopeIsNearZero && (
            <div style={{ color: '#fbbf24', fontStyle: 'italic', fontSize: '0.8rem' }}>
              f' ≈ 0 here -- this is a critical point of f.
            </div>
          )}
          {!slopeIsNearZero && (
            <div style={{ color: 'var(--color-ink-400)', fontSize: '0.8rem' }}>
              f is {slopeSign === 'positive' ? 'increasing' : 'decreasing'} here (f' is {slopeSign}).
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
