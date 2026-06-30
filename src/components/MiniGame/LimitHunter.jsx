import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'
import { linspace } from '../../utils/math'

const ROUNDS = [
  {
    label: 'f(x) = x² (target x = 2)',
    f: x => x * x,
    target: 2,
    limit: 4,
    xDomain: [0, 3.5],
    yDomain: [-0.5, 6],
    exists: true,
  },
  {
    label: 'f(x) = |x|/x (target x = 0)',
    f: x => x === 0 ? NaN : Math.abs(x) / x,
    target: 0,
    limit: null,
    xDomain: [-2, 2],
    yDomain: [-2, 2],
    exists: false,
  },
  {
    label: 'f(x) = sin(x)/x (target x = 0)',
    f: x => x === 0 ? NaN : Math.sin(x) / x,
    target: 0,
    limit: 1,
    xDomain: [-5, 5],
    yDomain: [-0.5, 1.3],
    exists: true,
  },
]

const MARGIN = { top: 15, right: 15, bottom: 30, left: 45 }
const HEIGHT = 220

export default function LimitHunter() {
  const [roundIdx, setRoundIdx] = useState(0)
  const [fromLeft, setFromLeft] = useState(null)
  const [fromRight, setFromRight] = useState(null)
  const [guess, setGuess] = useState('exists')
  const [guessValue, setGuessValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const ref = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(480)

  const round = ROUNDS[roundIdx]

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
    const xScale = d3.scaleLinear().domain(round.xDomain).range([0, iw])
    const yScale = d3.scaleLinear().domain(round.yDomain).range([ih, 0])
    const svg = d3.select(svgRef.current)
    svg.attr('width', width).attr('height', HEIGHT)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Grid
    g.append('g').call(d3.axisBottom(xScale).ticks(6))
      .attr('transform', `translate(0,${ih})`)
      .call(a => a.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(a => a.select('.domain').attr('stroke', '#3b4d74'))
      .call(a => a.selectAll('.tick line').attr('stroke', '#3b4d74'))
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .call(a => a.selectAll('text').attr('fill', '#8395b8').attr('font-size', 10))
      .call(a => a.select('.domain').attr('stroke', '#3b4d74'))
      .call(a => a.selectAll('.tick line').attr('stroke', '#3b4d74'))

    // Curve
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).defined(d => isFinite(d.y))
    const pts = linspace(round.xDomain[0], round.xDomain[1], 500).map(x => ({ x, y: round.f(x) }))
    g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)

    // Target hole
    const targetY = round.limit !== null ? round.limit : round.f(round.target - 0.001)
    if (isFinite(yScale(targetY))) {
      g.append('circle')
        .attr('cx', xScale(round.target)).attr('cy', yScale(targetY))
        .attr('r', 5).attr('fill', 'var(--color-ink-800)').attr('stroke', '#22d3ee').attr('stroke-width', 2)
    }

    // From-left indicator
    if (fromLeft !== null) {
      const y = round.f(fromLeft)
      if (isFinite(y)) {
        g.append('circle').attr('cx', xScale(fromLeft)).attr('cy', yScale(y))
          .attr('r', 5).attr('fill', '#f5a030').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 1.5)
      }
    }
    // From-right indicator
    if (fromRight !== null) {
      const y = round.f(fromRight)
      if (isFinite(y)) {
        g.append('circle').attr('cx', xScale(fromRight)).attr('cy', yScale(y))
          .attr('r', 5).attr('fill', '#818cf8').attr('stroke', 'var(--color-ink-800)').attr('stroke-width', 1.5)
      }
    }
  }, [width, round, fromLeft, fromRight, roundIdx])

  function submit() {
    setSubmitted(true)
    const guessedExists = guess === 'exists'
    const correct = guessedExists === round.exists &&
      (round.exists ? Math.abs(parseFloat(guessValue) - round.limit) < 0.15 : true)
    if (correct) setScore(s => s + 1)
  }

  function nextRound() {
    if (roundIdx + 1 >= ROUNDS.length) {
      setRoundIdx(0)
      setScore(0)
    } else {
      setRoundIdx(r => r + 1)
    }
    setFromLeft(null); setFromRight(null)
    setGuess('exists'); setGuessValue(''); setSubmitted(false)
  }

  const leftStep = (round.target - round.xDomain[0]) / 20
  const rightStep = (round.xDomain[1] - round.target) / 20
  const leftVal = fromLeft === null
    ? round.target - leftStep * 5
    : Math.min(fromLeft + leftStep * 0.5, round.target - 0.001)
  const rightVal = fromRight === null
    ? round.target + rightStep * 5
    : Math.max(fromRight - rightStep * 0.5, round.target + 0.001)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#22d3ee' }}>
          Limit Hunter
        </span>
        <span className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
          Round {roundIdx + 1}/{ROUNDS.length} &nbsp;|&nbsp; Score: {score}
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm mb-3" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          {round.label}. Sneak up from both sides. Does the limit exist?
        </p>

        <div ref={ref} className="w-full mb-4">
          <svg ref={svgRef} />
        </div>

        {/* Approach controls */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: '#f5a030' }}>
              From left: x = {leftVal.toFixed(3)} &nbsp; f = {isFinite(round.f(leftVal)) ? round.f(leftVal).toFixed(3) : 'undef'}
            </div>
            <input type="range"
              min={round.xDomain[0]}
              max={round.target - 0.001}
              step={(round.target - round.xDomain[0]) / 200}
              value={fromLeft ?? round.target - leftStep * 5}
              onChange={e => setFromLeft(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#f5a030' }}
            />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: '#818cf8' }}>
              From right: x = {rightVal.toFixed(3)} &nbsp; f = {isFinite(round.f(rightVal)) ? round.f(rightVal).toFixed(3) : 'undef'}
            </div>
            <input type="range"
              min={round.target + 0.001}
              max={round.xDomain[1]}
              step={(round.xDomain[1] - round.target) / 200}
              value={fromRight ?? round.target + rightStep * 5}
              onChange={e => setFromRight(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#818cf8' }}
            />
          </div>
        </div>

        {!submitted && (
          <div className="space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-ink-200)' }}>
                <input type="radio" value="exists" checked={guess === 'exists'} onChange={() => setGuess('exists')} style={{ accentColor: '#f5a030' }} />
                Limit exists
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-ink-200)' }}>
                <input type="radio" value="none" checked={guess === 'none'} onChange={() => setGuess('none')} style={{ accentColor: '#f5a030' }} />
                Limit does not exist
              </label>
            </div>
            {guess === 'exists' && (
              <input
                type="number" step="0.01" placeholder="Your guess for the limit value"
                value={guessValue} onChange={e => setGuessValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-500)', color: 'var(--color-ink-100)' }}
              />
            )}
            <button
              onClick={submit}
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
            >
              Submit Guess
            </button>
          </div>
        )}

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4 mt-2"
              style={{
                backgroundColor: 'var(--color-ink-700)',
                border: '1px solid var(--color-ink-500)',
              }}
            >
              <div className="font-semibold mb-1" style={{ color: '#a3e635', fontFamily: 'var(--font-handwritten)', fontSize: '1rem' }}>
                {round.exists ? `The limit exists and equals ${round.limit}.` : 'The limit does not exist.'}
              </div>
              <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-handwritten)', fontSize: '0.95rem' }}>
                {round.exists
                  ? 'Both sides approached the same value. The two-sided limit exists.'
                  : 'The left and right limits approach different values, so no two-sided limit exists.'}
              </p>
              <button
                onClick={nextRound}
                className="mt-3 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
              >
                {roundIdx + 1 >= ROUNDS.length ? 'Play Again' : 'Next Round →'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
