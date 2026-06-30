import { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { linspace, CURVES, tangentLine, riemannRects, trapezoidal, accumulationPoints } from '../../utils/math'

const GRAPH_TYPES = {
  limit: LimitGraph,
  derivative: DerivativeGraph,
  riemann: RiemannGraph,
  ftc: FTCGraph,
  basic: BasicGraph,
}

export default function InteractiveGraph({ type = 'basic', curve = 'parabola', config = {} }) {
  const Component = GRAPH_TYPES[type] || BasicGraph
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-ink-800)',
        border: '1px solid var(--color-ink-600)',
      }}
    >
      <Component curve={curve} config={config} />
    </div>
  )
}

/* ─── Shared SVG setup ─── */
const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 }
const HEIGHT = 300

function useSvgSize(ref) {
  const [width, setWidth] = useState(500)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return width
}

function axes(svg, xScale, yScale, innerW, innerH) {
  svg.selectAll('.axis').remove()
  svg.selectAll('.grid').remove()

  const axisColor = '#3b4d74'
  const labelColor = '#8395b8'

  // Grid
  svg.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(''))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    .call(g => g.selectAll('line').attr('stroke', axisColor).attr('stroke-width', 0.5))
    .call(g => g.select('.domain').remove())

  svg.append('g').attr('class', 'grid')
    .call(d3.axisBottom(xScale).tickSize(-innerH).tickFormat(''))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top + innerH})`)
    .call(g => g.selectAll('line').attr('stroke', axisColor).attr('stroke-width', 0.5))
    .call(g => g.select('.domain').remove())

  // Axes
  svg.append('g').attr('class', 'axis')
    .call(d3.axisBottom(xScale).ticks(6))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top + innerH})`)
    .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 11))
    .call(g => g.select('.domain').attr('stroke', axisColor))
    .call(g => g.selectAll('.tick line').attr('stroke', axisColor))

  svg.append('g').attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(5))
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    .call(g => g.selectAll('text').attr('fill', labelColor).attr('font-size', 11))
    .call(g => g.select('.domain').attr('stroke', axisColor))
    .call(g => g.selectAll('.tick line').attr('stroke', axisColor))
}

/* ─── Basic Graph ─── */
function BasicGraph({ curve, config }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const containerWidth = useSvgSize(ref)

  const xDomain = config.xDomain || [-3, 3]
  const f = CURVES[curve] || CURVES.parabola

  useEffect(() => {
    if (!svgRef.current) return
    const innerW = containerWidth - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom
    const xs = linspace(xDomain[0], xDomain[1], 300)
    const ys = xs.map(f).filter(y => isFinite(y))
    const yDomain = config.yDomain || [Math.min(...ys) - 0.5, Math.max(...ys) + 0.5]

    const xScale = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const yScale = d3.scaleLinear().domain(yDomain).range([innerH, 0])

    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    axes(svg, xScale, yScale, innerW, innerH)

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .defined(d => isFinite(d.y))

    const pts = xs.map(x => ({ x, y: f(x) }))
    g.append('path')
      .datum(pts)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 2.5)
  }, [containerWidth, curve, xDomain, config.yDomain, f])

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} />
    </div>
  )
}

/* ─── Limit Graph ─── */
function LimitGraph({ curve, config }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const containerWidth = useSvgSize(ref)
  const [xPos, setXPos] = useState(config.approachFrom ?? 1.5)
  const targetX = config.targetX ?? 2

  const f = CURVES[curve] || CURVES.parabola
  const xDomain = config.xDomain || [-1, 4]
  const innerW = containerWidth - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const xs = linspace(xDomain[0], xDomain[1], 300)
  const ys = xs.map(f).filter(y => isFinite(y))
  const yDomain = config.yDomain || [Math.min(...ys) - 0.5, Math.max(...ys) + 0.5]

  const xScale = d3.scaleLinear().domain(xDomain).range([0, innerW])
  const yScale = d3.scaleLinear().domain(yDomain).range([innerH, 0])

  useEffect(() => {
    if (!svgRef.current || innerW <= 0) return
    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    axes(svg, xScale, yScale, innerW, innerH)

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    const pts = linspace(xDomain[0], xDomain[1], 300).map(x => ({ x, y: f(x) }))

    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Limit value line
    const limitY = f(targetX)
    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', yScale(limitY)).attr('y2', yScale(limitY))
      .attr('stroke', '#f5a030').attr('stroke-width', 1).attr('stroke-dasharray', '4,3')

    g.append('text')
      .attr('x', innerW - 4).attr('y', yScale(limitY) - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#f5a030').attr('font-size', 11)
      .text(`limit = ${limitY.toFixed(2)}`)

    // Hole at target
    g.append('circle')
      .attr('cx', xScale(targetX)).attr('cy', yScale(limitY))
      .attr('r', 5).attr('fill', 'var(--color-ink-800)').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Moving point
    const py = f(xPos)
    if (isFinite(py)) {
      g.append('line')
        .attr('x1', xScale(xPos)).attr('x2', xScale(xPos))
        .attr('y1', yScale(yDomain[0])).attr('y2', yScale(py))
        .attr('stroke', '#a3e635').attr('stroke-width', 1).attr('stroke-dasharray', '3,3')

      g.append('circle')
        .attr('cx', xScale(xPos)).attr('cy', yScale(py))
        .attr('r', 6).attr('fill', '#a3e635').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

      g.append('text')
        .attr('x', xScale(xPos) + 8).attr('y', yScale(py) - 8)
        .attr('fill', '#a3e635').attr('font-size', 11)
        .text(`(${xPos.toFixed(2)}, ${py.toFixed(2)})`)
    }
  }, [containerWidth, xPos, targetX, f, xDomain, yDomain, xScale, yScale, innerW, innerH])

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} />
      <div className="px-6 pb-5 pt-2">
        <label className="text-xs mb-1 block" style={{ color: 'var(--color-ink-400)' }}>
          Drag x toward {targetX}: &nbsp;
          <span style={{ color: '#a3e635' }}>x = {xPos.toFixed(3)}</span>
          &nbsp; &rarr; &nbsp;
          <span style={{ color: '#f5a030' }}>limit = {f(targetX).toFixed(3)}</span>
          &nbsp;|&nbsp; distance: {Math.abs(xPos - targetX).toFixed(3)}
        </label>
        <input
          type="range"
          min={xDomain[0]}
          max={targetX - 0.001}
          step={0.001}
          value={xPos}
          onChange={e => setXPos(parseFloat(e.target.value))}
          className="w-full accent-amber-400"
          style={{ accentColor: '#f5a030' }}
        />
      </div>
    </div>
  )
}

/* ─── Derivative Graph ─── */
function DerivativeGraph({ curve, config }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const containerWidth = useSvgSize(ref)
  const [x0, setX0] = useState(config.initialX ?? 0.5)

  const f = CURVES[curve] || CURVES.parabola
  const xDomain = config.xDomain || [-2.5, 2.5]
  const innerW = containerWidth - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const xs = linspace(xDomain[0], xDomain[1], 300)
  const ys = xs.map(f).filter(y => isFinite(y))
  const yDomain = config.yDomain || [Math.min(...ys) * 1.2, Math.max(...ys) * 1.2]

  const xScale = d3.scaleLinear().domain(xDomain).range([0, innerW])
  const yScale = d3.scaleLinear().domain(yDomain).range([innerH, 0])

  useEffect(() => {
    if (!svgRef.current || innerW <= 0) return
    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    axes(svg, xScale, yScale, innerW, innerH)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    const pts = xs.map(x => ({ x, y: f(x) }))
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Tangent line
    const tl = tangentLine(f, x0)
    g.append('line')
      .attr('x1', xScale(tl.x1)).attr('x2', xScale(tl.x2))
      .attr('y1', yScale(tl.y1)).attr('y2', yScale(tl.y2))
      .attr('stroke', '#f472b6').attr('stroke-width', 2)

    // Point on curve
    g.append('circle')
      .attr('cx', xScale(x0)).attr('cy', yScale(tl.y0))
      .attr('r', 5).attr('fill', '#f472b6').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

    // Slope label
    g.append('text')
      .attr('x', xScale(x0) + 8).attr('y', yScale(tl.y0) - 10)
      .attr('fill', '#f472b6').attr('font-size', 12).attr('font-weight', 600)
      .text(`slope = ${tl.slope.toFixed(3)}`)
  }, [containerWidth, x0, f, xDomain, yDomain, xs, xScale, yScale, innerW, innerH])

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} />
      <div className="px-6 pb-5 pt-2">
        <label className="text-xs mb-1 block" style={{ color: 'var(--color-ink-400)' }}>
          Move point: &nbsp;
          <span style={{ color: '#f472b6' }}>x = {x0.toFixed(2)}, slope f&apos;(x) = {(() => { const { slope } = tangentLine(f, x0); return slope.toFixed(3) })()}</span>
        </label>
        <input
          type="range" min={xDomain[0]} max={xDomain[1]} step={0.01} value={x0}
          onChange={e => setX0(parseFloat(e.target.value))}
          className="w-full" style={{ accentColor: '#f472b6' }}
        />
      </div>
    </div>
  )
}

/* ─── Riemann Graph ─── */
function RiemannGraph({ curve, config }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const containerWidth = useSvgSize(ref)
  const [n, setN] = useState(config.initialN ?? 6)

  const f = CURVES[curve] || CURVES.parabola
  const a = config.a ?? 0
  const b = config.b ?? 2
  const xDomain = config.xDomain || [a - 0.2, b + 0.2]
  const innerW = containerWidth - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const xs = linspace(xDomain[0], xDomain[1], 300)
  const ys = xs.map(f).filter(y => isFinite(y))
  const yDomain = config.yDomain || [Math.min(0, ...ys) - 0.2, Math.max(...ys) + 0.5]

  const xScale = d3.scaleLinear().domain(xDomain).range([0, innerW])
  const yScale = d3.scaleLinear().domain(yDomain).range([innerH, 0])

  const trueArea = trapezoidal(f, a, b)
  const rects = riemannRects(f, a, b, n)
  const approxArea = rects.reduce((s, r) => s + r.width * r.height, 0)
  const error = Math.abs(approxArea - trueArea)

  useEffect(() => {
    if (!svgRef.current || innerW <= 0) return
    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    axes(svg, xScale, yScale, innerW, innerH)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Rectangles
    rects.forEach(r => {
      const rx = xScale(r.x)
      const rw = xScale(r.x + r.width) - xScale(r.x)
      const ry = r.positive ? yScale(r.height) : yScale(0)
      const rh = Math.abs(yScale(r.height) - yScale(0))
      g.append('rect')
        .attr('x', rx).attr('y', ry).attr('width', rw).attr('height', rh)
        .attr('fill', r.positive ? 'rgba(251,146,60,0.25)' : 'rgba(248,113,113,0.25)')
        .attr('stroke', r.positive ? '#fb923c' : '#f87171')
        .attr('stroke-width', 0.8)
    })

    // Curve on top
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    const pts = linspace(xDomain[0], xDomain[1], 400).map(x => ({ x, y: f(x) }))
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

  }, [containerWidth, n, f, a, b, xDomain, yDomain, rects, xScale, yScale, innerW, innerH])

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} />
      <div className="px-6 pb-5 pt-2 space-y-2">
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-ink-400)' }}>
          <span>Rectangles: <strong style={{ color: '#fb923c' }}>{n}</strong></span>
          <span>Approx area: <strong style={{ color: '#fb923c' }}>{approxArea.toFixed(4)}</strong></span>
          <span>True area: <strong style={{ color: '#22d3ee' }}>{trueArea.toFixed(4)}</strong></span>
          <span>Error: <strong style={{ color: error < 0.01 ? '#a3e635' : '#f87171' }}>{error.toFixed(4)}</strong></span>
        </div>
        <input
          type="range" min={1} max={200} step={1} value={n}
          onChange={e => setN(parseInt(e.target.value))}
          className="w-full" style={{ accentColor: '#fb923c' }}
        />
      </div>
    </div>
  )
}

/* ─── FTC Graph ─── */
function FTCGraph({ curve, config }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const containerWidth = useSvgSize(ref)
  const [xEnd, setXEnd] = useState(config.initialX ?? 1)

  const f = CURVES[curve] || CURVES.sine
  const a = config.a ?? -Math.PI
  const xDomain = config.xDomain || [a, Math.PI * 1.1]
  const innerW = Math.floor((containerWidth - MARGIN.left - MARGIN.right) / 2) - 10
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const xs = linspace(xDomain[0], xDomain[1], 300)
  const ys = xs.map(f)
  const yDomain = [Math.min(...ys) * 1.3, Math.max(...ys) * 1.3]

  const accPts = accumulationPoints(f, a, xDomain[1], 200)
  const accYs = accPts.map(p => p.y)
  const accDomain = [Math.min(...accYs) - 0.2, Math.max(...accYs) + 0.2]

  useEffect(() => {
    if (!svgRef.current || innerW <= 0) return
    const svg = d3.select(svgRef.current)
    svg.attr('width', containerWidth).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    const xScaleL = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const yScaleL = d3.scaleLinear().domain(yDomain).range([innerH, 0])
    const xScaleR = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const yScaleR = d3.scaleLinear().domain(accDomain).range([innerH, 0])

    const gL = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
    const gR = svg.append('g').attr('transform', `translate(${MARGIN.left + innerW + 20},${MARGIN.top})`)

    // Axes
    const axL = svg.append('g').attr('class', 'axis')
    axL.call(d3.axisBottom(xScaleL).ticks(5))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + innerH})`)
      .call(g => g.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', '#3b4d74'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#3b4d74'))
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScaleL).ticks(4))
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', '#3b4d74'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#3b4d74'))

    svg.append('g').attr('class', 'axis')
      .call(d3.axisBottom(xScaleR).ticks(5))
      .attr('transform', `translate(${MARGIN.left + innerW + 20},${MARGIN.top + innerH})`)
      .call(g => g.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', '#3b4d74'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#3b4d74'))
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScaleR).ticks(4))
      .attr('transform', `translate(${MARGIN.left + innerW + 20},${MARGIN.top})`)
      .call(g => g.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(g => g.select('.domain').attr('stroke', '#3b4d74'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#3b4d74'))

    // Labels
    svg.append('text').attr('x', MARGIN.left + innerW / 2).attr('y', 15)
      .attr('text-anchor', 'middle').attr('fill', '#8395b8').attr('font-size', 11)
      .text('f(x) -- rate of change')
    svg.append('text').attr('x', MARGIN.left + innerW + 20 + innerW / 2).attr('y', 15)
      .attr('text-anchor', 'middle').attr('fill', '#8395b8').attr('font-size', 11)
      .text('F(x) = ∫f(t)dt -- accumulated area')

    const lineL = d3.line().x(d => xScaleL(d.x)).y(d => yScaleL(d.y)).defined(d => isFinite(d.y))
    const lineR = d3.line().x(d => xScaleR(d.x)).y(d => yScaleR(d.y)).defined(d => isFinite(d.y))

    // Shaded region up to xEnd
    const shadedPts = linspace(a, xEnd, 100).map(x => ({ x, y: f(x) }))
    const areaGen = d3.area()
      .x(d => xScaleL(d.x)).y0(yScaleL(0)).y1(d => yScaleL(d.y)).defined(d => isFinite(d.y))
    gL.append('path').datum(shadedPts).attr('d', areaGen)
      .attr('fill', 'rgba(250,190,0,0.2)').attr('stroke', 'none')

    // f(x) curve
    gL.append('path').datum(xs.map(x => ({ x, y: f(x) })))
      .attr('d', lineL).attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Vertical line at xEnd
    gL.append('line')
      .attr('x1', xScaleL(xEnd)).attr('x2', xScaleL(xEnd))
      .attr('y1', yScaleL(yDomain[0])).attr('y2', yScaleL(yDomain[1]))
      .attr('stroke', '#fbbf24').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')

    // F(x) curve
    gR.append('path').datum(accPts).attr('d', lineR)
      .attr('fill', 'none').attr('stroke', '#fbbf24').attr('stroke-width', 2)

    // Dot on F at xEnd
    const dotAcc = accPts.find(p => p.x >= xEnd) || accPts[accPts.length - 1]
    gR.append('circle')
      .attr('cx', xScaleR(dotAcc.x)).attr('cy', yScaleR(dotAcc.y))
      .attr('r', 5).attr('fill', '#fbbf24').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 2)

  }, [containerWidth, xEnd, f, a, xDomain, yDomain, accPts, accDomain, xs, innerW, innerH])

  return (
    <div ref={ref} className="w-full">
      <svg ref={svgRef} />
      <div className="px-6 pb-5 pt-2">
        <label className="text-xs mb-1 block" style={{ color: 'var(--color-ink-400)' }}>
          Upper limit x: <span style={{ color: '#fbbf24' }}>{xEnd.toFixed(2)}</span>
        </label>
        <input
          type="range" min={a} max={xDomain[1] - 0.01} step={0.05} value={xEnd}
          onChange={e => setXEnd(parseFloat(e.target.value))}
          className="w-full" style={{ accentColor: '#fbbf24' }}
        />
      </div>
    </div>
  )
}
