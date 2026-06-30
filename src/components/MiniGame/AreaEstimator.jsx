import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CURVES, trapezoidal, riemannRects } from '../../utils/math'

const CHALLENGES = [
  { curve: 'parabola', label: 'f(x) = x²', a: 0, b: 2, target: 0.01 },
  { curve: 'sine', label: 'f(x) = sin(x)', a: 0, b: Math.PI, target: 0.01 },
  { curve: 'cubic', label: 'f(x) = x³ - 3x + 3', a: 0, b: 2, target: 0.005 },
]

export default function AreaEstimator() {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const ch = CHALLENGES[idx]
  const f = CURVES[ch.curve]
  const trueArea = trapezoidal(f, ch.a, ch.b)

  function getActualN(n) {
    const rects = riemannRects(f, ch.a, ch.b, n)
    const approx = rects.reduce((s, r) => s + r.width * r.height, 0)
    const err = Math.abs(approx - trueArea) / Math.abs(trueArea)
    return err
  }

  function submit() {
    if (!guess) return
    const n = parseInt(guess)
    const errAtGuess = getActualN(n)
    const correct = errAtGuess <= ch.target
    if (correct) setScore(s => s + 1)
    setRevealed(true)
  }

  // Find the actual minimum n that achieves target
  function findMinN() {
    for (let n = 1; n <= 1000; n++) {
      if (getActualN(n) <= ch.target) return n
    }
    return 1000
  }

  const minN = revealed ? findMinN() : null
  const guessN = parseInt(guess)
  const guessErr = revealed ? getActualN(guessN) : null
  const correct = revealed && guessErr !== null && guessErr <= ch.target

  function next() {
    setIdx(i => (i + 1) % CHALLENGES.length)
    setGuess(''); setRevealed(false)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fb923c' }}>
          Area Estimator
        </span>
        <span className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
          Score: {score}/{CHALLENGES.length}
        </span>
      </div>

      <div className="p-6">
        <div
          className="rounded-lg p-5 mb-5"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-400)' }}>
            Challenge
          </div>
          <div
            className="text-lg font-semibold mb-1"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-50)' }}
          >
            {ch.label} on [{ch.a.toFixed(2)}, {ch.b.toFixed(2)}]
          </div>
          <div className="text-sm" style={{ color: 'var(--color-amber-300)' }}>
            True area: {trueArea.toFixed(4)}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-ink-400)' }}>
            Goal: get within {(ch.target * 100).toFixed(1)}% of the true area using left-endpoint Riemann sums.
          </div>
        </div>

        {/* Real-time error meter */}
        {guess && !revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-lg p-3"
            style={{ backgroundColor: 'var(--color-ink-700)' }}
          >
            <div className="text-xs mb-1" style={{ color: 'var(--color-ink-400)' }}>
              With n = {parseInt(guess)} rectangles:
            </div>
            {(() => {
              const n = parseInt(guess)
              if (n > 0 && n <= 10000) {
                const err = getActualN(n) * 100
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--color-ink-600)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(err * 5, 100)}%`,
                            backgroundColor: err < ch.target * 100 ? '#a3e635' : '#fb923c',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: err < ch.target * 100 ? '#a3e635' : '#fb923c' }}>
                        {err.toFixed(2)}% error
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-ink-500)' }}>
                      Need &lt; {(ch.target * 100).toFixed(1)}% error
                    </div>
                  </>
                )
              }
              return null
            })()}
          </motion.div>
        )}

        {!revealed ? (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              How many rectangles do you need to get within {(ch.target * 100).toFixed(1)}%?
            </p>
            <div className="flex gap-3">
              <input
                type="number" min="1" max="10000" placeholder="Your guess for n"
                value={guess} onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--color-ink-700)',
                  border: '1px solid var(--color-ink-500)',
                  color: 'var(--color-ink-100)',
                }}
              />
              <button
                onClick={submit}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#fb923c', color: 'var(--color-ink-950)' }}
              >
                Place Bet
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4"
              style={{
                backgroundColor: correct ? 'rgba(163,230,53,0.1)' : 'rgba(251,146,60,0.1)',
                border: `1px solid ${correct ? '#a3e63544' : '#fb923c44'}`,
              }}
            >
              <div
                className="font-semibold mb-1 text-base"
                style={{ color: correct ? '#a3e635' : '#fb923c', fontFamily: 'var(--font-handwritten)' }}
              >
                {correct
                  ? `Nice! n = ${guessN} works. Error: ${(guessErr * 100).toFixed(3)}%`
                  : `Not enough rectangles. You need n ≥ ${minN}.`}
              </div>
              <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-handwritten)', fontSize: '0.95rem' }}>
                {correct
                  ? 'The Riemann sum converges. More rectangles, less error. This is the definition of the integral in action.'
                  : `With n = ${guessN}, the error is ${(guessErr * 100).toFixed(2)}%. The minimum n for ${(ch.target * 100)}% accuracy is ${minN}.`}
              </p>
              <button
                onClick={next}
                className="mt-3 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
              >
                Next Challenge →
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
