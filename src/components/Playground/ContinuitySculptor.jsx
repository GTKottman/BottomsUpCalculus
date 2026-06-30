import { useState, useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import { linspace } from '../../utils/math'

const MARGIN = { top: 15, right: 20, bottom: 35, left: 50 }
const HEIGHT = 260

// Piecewise: f(x) = leftSlope*x + leftShift for x < 0, rightSlope*x + rightShift for x > 0
// The "dot value" is the actual defined value at x=0

export default function ContinuitySculptor() {
  const [leftVal, setLeftVal] = useState(2)    // left piece at x=0
  const [rightVal, setRightVal] = useState(2)  // right piece at x=0
  const [dotVal, setDotVal] = useState(2)      // f(0) defined value

  const ref = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(480)

  // Left piece: line ending at (0, leftVal) -- slope 1, y-intercept leftVal
  const leftF = useCallback(x => x + leftVal, [leftVal])
  // Right piece: line starting at (0, rightVal) -- slope 0.5, y-intercept rightVal
  const rightF = useCallback(x => 0.5 * x + rightVal, [rightVal])

  const leftLimit = leftVal
  const rightLimit = rightVal
  const limitsEqual = Math.abs(leftLimit - rightLimit) < 0.05
  const dotMatchesLimit = limitsEqual && Math.abs(dotVal - leftLimit) < 0.05

  let verdict, verdictColor, verdictDetail
  if (dotMatchesLimit) {
    verdict = 'Continuous at x = 0'
    verdictColor = '#a3e635'
    verdictDetail = 'Left limit = right limit = f(0). No break, no hole, no surprise.'
  } else if (limitsEqual && !dotMatchesLimit) {
    verdict = 'Removable discontinuity (hole)'
    verdictColor = '#fbbf24'
    verdictDetail = 'Left and right limits agree, but f(0) ≠ that limit. There is a hole at x = 0 that could be patched.'
  } else {
    verdict = 'Jump discontinuity'
    verdictColor = '#f87171'
    verdictDetail = 'The left and right limits disagree. The function jumps at x = 0 -- no way to patch it by redefining f(0).'
  }

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

    const xDomain = [-3, 3]
    const allY = [leftF(-3), leftF(-0.01), rightF(0.01), rightF(3), dotVal]
    const yMin = Math.min(...allY) - 1
    const yMax = Math.max(...allY) + 1

    const xScale = d3.scaleLinear().domain(xDomain).range([0, iw])
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([ih, 0])

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
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))

    // Left piece (x < 0)
    const leftPts = linspace(-3, -0.01, 100).map(x => ({ x, y: leftF(x) }))
    g.append('path').datum(leftPts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

    // Right piece (x > 0)
    const rightPts = linspace(0.01, 3, 100).map(x => ({ x, y: rightF(x) }))
    g.append('path').datum(rightPts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

    // Open circles at x=0 for left and right limits
    g.append('circle')
      .attr('cx', xScale(0)).attr('cy', yScale(leftLimit))
      .attr('r', 5).attr('fill', 'var(--color-ink-800)').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    g.append('circle')
      .attr('cx', xScale(0)).attr('cy', yScale(rightLimit))
      .attr('r', 5).attr('fill', 'var(--color-ink-800)').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Filled dot at actual f(0) value
    g.append('circle')
      .attr('cx', xScale(0)).attr('cy', yScale(dotVal))
      .attr('r', 6).attr('fill', verdictColor).attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

    // Labels
    g.append('text')
      .attr('x', xScale(0) + 8).attr('y', yScale(leftLimit) - 6)
      .attr('fill', '#8395b8').attr('font-size', 10)
      .text(`lim⁻ = ${leftLimit.toFixed(1)}`)

    if (!limitsEqual) {
      g.append('text')
        .attr('x', xScale(0) + 8).attr('y', yScale(rightLimit) + 14)
        .attr('fill', '#8395b8').attr('font-size', 10)
        .text(`lim⁺ = ${rightLimit.toFixed(1)}`)
    }

    g.append('text')
      .attr('x', xScale(0) + 8).attr('y', yScale(dotVal) - 6)
      .attr('fill', verdictColor).attr('font-size', 10).attr('font-weight', 600)
      .text(`f(0) = ${dotVal.toFixed(1)}`)

  }, [width, leftVal, rightVal, dotVal, leftLimit, rightLimit, limitsEqual, verdictColor, leftF, rightF])

  const sliderStyle = color => ({
    accentColor: color,
  })

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#a3e635' }}>
          Continuity Sculptor
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          Sculpt the piecewise function at <strong style={{ color: '#fbbf24' }}>x = 0</strong>. Three independent controls. Arrange them to achieve continuity -- or break it deliberately.
        </p>

        <div ref={ref} className="w-full mb-5">
          <svg ref={svgRef} />
        </div>

        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div>
            <div className="text-xs mb-1" style={{ color: '#22d3ee' }}>
              Left limit (lim⁻): <strong>{leftVal.toFixed(1)}</strong>
            </div>
            <input type="range" min={-3} max={5} step={0.1}
              value={leftVal} onChange={e => setLeftVal(parseFloat(e.target.value))}
              className="w-full" style={sliderStyle('#22d3ee')}
            />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#818cf8' }}>
              Right limit (lim⁺): <strong>{rightVal.toFixed(1)}</strong>
            </div>
            <input type="range" min={-3} max={5} step={0.1}
              value={rightVal} onChange={e => setRightVal(parseFloat(e.target.value))}
              className="w-full" style={sliderStyle('#818cf8')}
            />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: verdictColor }}>
              f(0) defined value: <strong>{dotVal.toFixed(1)}</strong>
            </div>
            <input type="range" min={-3} max={5} step={0.1}
              value={dotVal} onChange={e => setDotVal(parseFloat(e.target.value))}
              className="w-full" style={sliderStyle(verdictColor)}
            />
          </div>
        </div>

        <div
          className="rounded-lg px-5 py-3"
          style={{
            backgroundColor: 'var(--color-ink-700)',
            border: `1px solid ${verdictColor}44`,
          }}
        >
          <div className="font-semibold mb-1" style={{ color: verdictColor, fontFamily: 'var(--font-handwritten)', fontSize: '1rem' }}>
            {verdict}
          </div>
          <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-handwritten)' }}>
            {verdictDetail}
          </p>
        </div>
      </div>
    </div>
  )
}
