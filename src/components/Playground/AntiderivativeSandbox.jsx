import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { linspace, CURVES, accumulationPoints } from '../../utils/math'

const MARGIN = { top: 12, right: 15, bottom: 30, left: 48 }
const PANEL_HEIGHT = 200

const INTEGRAND_OPTIONS = [
  { key: 'sine', label: 'f(x) = sin(x)', xDomain: [-Math.PI, Math.PI] },
  { key: 'parabola', label: 'f(x) = x²', xDomain: [-2.5, 2.5] },
  { key: 'cubic', label: 'f(x) = x³ − 3x', xDomain: [-2.5, 2.5] },
  { key: 'cosine', label: 'f(x) = cos(x)', xDomain: [-Math.PI, Math.PI] },
]

export default function AntiderivativeSandbox() {
  const [fnKey, setFnKey] = useState('sine')
  const fn = INTEGRAND_OPTIONS.find(o => o.key === fnKey)
  const { xDomain } = fn
  const f = CURVES[fnKey]

  const [startA, setStartA] = useState(xDomain[0] * 0.5)
  const [xCursor, setXCursor] = useState(xDomain[1] * 0.5)

  const ref = useRef(null)
  const topSvgRef = useRef(null)
  const botSvgRef = useRef(null)
  const [width, setWidth] = useState(480)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!topSvgRef.current || !botSvgRef.current || width <= 0) return
    drawPanels()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, fnKey, startA, xCursor])

  function drawPanels() {
    const iw = width - MARGIN.left - MARGIN.right
    const ih = PANEL_HEIGHT - MARGIN.top - MARGIN.bottom
    const axisColor = '#3b4d74'
    const labelColor = '#8395b8'

    // ─── Top panel: f(x) with shaded area from startA to xCursor ───
    const ptsF = linspace(xDomain[0], xDomain[1], 400).map(x => ({ x, y: f(x) }))
    const ysF = ptsF.map(p => p.y).filter(isFinite)
    const yDomF = [Math.min(...ysF) - 0.3, Math.max(...ysF) + 0.3]
    const xScaleF = d3.scaleLinear().domain(xDomain).range([0, iw])
    const yScaleF = d3.scaleLinear().domain(yDomF).range([ih, 0])

    const svgF = d3.select(topSvgRef.current)
    svgF.attr('width', width).attr('height', PANEL_HEIGHT)
    svgF.selectAll('*').remove()

    svgF.append('g').call(d3.axisLeft(yScaleF).ticks(4))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))
    svgF.append('g').call(d3.axisBottom(xScaleF).ticks(6))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + ih})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    const gF = svgF.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    const lineF = d3.line().x(d => xScaleF(d.x)).y(d => yScaleF(d.y)).defined(d => isFinite(d.y))

    // Shaded region
    const xL = Math.min(startA, xCursor)
    const xR = Math.max(startA, xCursor)
    const shadedPts = linspace(xL, xR, 150).map(x => ({ x, y: f(x) }))
    const areaGen = d3.area()
      .x(d => xScaleF(d.x)).y0(yScaleF(0)).y1(d => yScaleF(d.y)).defined(d => isFinite(d.y))
    gF.append('path').datum(shadedPts).attr('d', areaGen)
      .attr('fill', 'rgba(251,191,36,0.25)').attr('stroke', 'none')

    // f(x) curve
    gF.append('path').datum(ptsF).attr('d', lineF)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // startA marker
    gF.append('line')
      .attr('x1', xScaleF(startA)).attr('x2', xScaleF(startA))
      .attr('y1', 0).attr('y2', ih)
      .attr('stroke', '#fbbf24').attr('stroke-width', 2).attr('stroke-dasharray', '4,3')
    gF.append('text')
      .attr('x', xScaleF(startA) + 4).attr('y', 14)
      .attr('fill', '#fbbf24').attr('font-size', 9).attr('font-weight', 600)
      .text(`a = ${startA.toFixed(2)}`)

    // xCursor marker
    gF.append('line')
      .attr('x1', xScaleF(xCursor)).attr('x2', xScaleF(xCursor))
      .attr('y1', 0).attr('y2', ih)
      .attr('stroke', '#f472b6').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3')

    gF.append('text')
      .attr('x', MARGIN.left - 10).attr('y', 10)
      .attr('fill', labelColor).attr('font-size', 9)
      .text('f(x)')

    // ─── Bottom panel: F(x) = integral from startA to x ───
    const accPts = accumulationPoints(f, xDomain[0], xDomain[1], 300)
    // Shift so F(startA) = 0
    const baseline = accPts.find(p => p.x >= startA) || accPts[0]
    const shiftedPts = accPts.map(p => ({ x: p.x, y: p.y - baseline.y }))

    const ysAcc = shiftedPts.map(p => p.y).filter(isFinite)
    const yDomAcc = [Math.min(...ysAcc) - 0.3, Math.max(...ysAcc) + 0.3]
    const xScaleA = d3.scaleLinear().domain(xDomain).range([0, iw])
    const yScaleA = d3.scaleLinear().domain(yDomAcc).range([ih, 0])

    const svgA = d3.select(botSvgRef.current)
    svgA.attr('width', width).attr('height', PANEL_HEIGHT)
    svgA.selectAll('*').remove()

    svgA.append('g').call(d3.axisLeft(yScaleA).ticks(4))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))
    svgA.append('g').call(d3.axisBottom(xScaleA).ticks(6))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + ih})`)
      .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 9))
      .call(g => g.select('.domain').attr('stroke', axisColor))
      .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

    const gA = svgA.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    const lineA = d3.line().x(d => xScaleA(d.x)).y(d => yScaleA(d.y)).defined(d => isFinite(d.y))

    // Zero line
    if (yDomAcc[0] < 0 && yDomAcc[1] > 0) {
      gA.append('line')
        .attr('x1', 0).attr('x2', iw)
        .attr('y1', yScaleA(0)).attr('y2', yScaleA(0))
        .attr('stroke', '#3b4d74').attr('stroke-width', 1)
    }

    // F(x) curve
    gA.append('path').datum(shiftedPts).attr('d', lineA)
      .attr('fill', 'none').attr('stroke', '#fbbf24').attr('stroke-width', 2)

    // Dot at xCursor
    const cursorPt = shiftedPts.find(p => p.x >= xCursor) || shiftedPts[shiftedPts.length - 1]
    gA.append('circle')
      .attr('cx', xScaleA(cursorPt.x)).attr('cy', yScaleA(cursorPt.y))
      .attr('r', 5).attr('fill', '#f472b6').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

    // startA dot
    gA.append('circle')
      .attr('cx', xScaleA(startA)).attr('cy', yScaleA(0))
      .attr('r', 5).attr('fill', '#fbbf24').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

    gA.append('text')
      .attr('x', MARGIN.left - 10).attr('y', 10)
      .attr('fill', labelColor).attr('font-size', 9)
      .text('F(x)')
  }

  function handleFnChange(key) {
    const opt = INTEGRAND_OPTIONS.find(o => o.key === key)
    setFnKey(key)
    setStartA(opt.xDomain[0] * 0.5)
    setXCursor(opt.xDomain[1] * 0.5)
  }

  // Compute displayed F value at cursor
  const accPtsForDisplay = accumulationPoints(f, xDomain[0], xDomain[1], 300)
  const baseline = accPtsForDisplay.find(p => p.x >= startA) || accPtsForDisplay[0]
  const cursorAcc = accPtsForDisplay.find(p => p.x >= xCursor) || accPtsForDisplay[accPtsForDisplay.length - 1]
  const fxCursor = cursorAcc.y - baseline.y

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>
          Antiderivative Sandbox
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {INTEGRAND_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleFnChange(opt.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: fnKey === opt.key ? '#fbbf24' : 'var(--color-ink-700)',
                color: fnKey === opt.key ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                border: '1px solid var(--color-ink-600)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div ref={ref} className="w-full">
          <div className="text-xs mb-1 px-1" style={{ color: 'var(--color-ink-400)' }}>
            f(x) -- integrand (shaded area = accumulated value)
          </div>
          <svg ref={topSvgRef} />
          <div className="text-xs mt-3 mb-1 px-1" style={{ color: 'var(--color-ink-400)' }}>
            F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt -- accumulation function
          </div>
          <svg ref={botSvgRef} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: '#fbbf24' }}>
              Lower limit a = {startA.toFixed(3)}
            </div>
            <input type="range"
              min={xDomain[0]} max={xDomain[1] - 0.1}
              step={(xDomain[1] - xDomain[0]) / 400}
              value={startA}
              onChange={e => setStartA(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#fbbf24' }}
            />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#f472b6' }}>
              Upper limit x = {xCursor.toFixed(3)}
            </div>
            <input type="range"
              min={xDomain[0]} max={xDomain[1]}
              step={(xDomain[1] - xDomain[0]) / 400}
              value={xCursor}
              onChange={e => setXCursor(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#f472b6' }}
            />
          </div>
        </div>

        <div
          className="mt-4 rounded-lg px-5 py-3 flex flex-wrap gap-5 text-sm"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div>
            <span style={{ color: 'var(--color-ink-400)' }}>F({xCursor.toFixed(2)}) = </span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{fxCursor.toFixed(5)}</span>
          </div>
          <div style={{ color: 'var(--color-ink-400)', fontSize: '0.8rem', width: '100%' }}>
            Slide <strong style={{ color: '#fbbf24' }}>a</strong> left or right. The entire F(x) curve shifts -- the shape stays identical. That shift is the constant of integration (+C). Slide <strong style={{ color: '#f472b6' }}>x</strong> to watch the accumulated area grow.
          </div>
        </div>
      </div>
    </div>
  )
}
