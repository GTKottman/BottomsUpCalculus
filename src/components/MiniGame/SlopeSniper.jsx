import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { numericalDerivative, CURVES } from '../../utils/math'

const CHALLENGES = [
  { curve: 'parabola', label: 'f(x) = x²', x: 1, hint: 'The slope of x² at x = 1 is 2x|₁ = ?' },
  { curve: 'parabola', label: 'f(x) = x²', x: -2, hint: 'The slope of x² at x = -2 is 2x|₋₂ = ?' },
  { curve: 'cubic', label: 'f(x) = x³ - 3x', x: 0, hint: 'f\'(x) = 3x² - 3. At x = 0, slope = ?' },
  { curve: 'cubic', label: 'f(x) = x³ - 3x', x: 2, hint: 'f\'(x) = 3x² - 3. At x = 2, slope = ?' },
  { curve: 'sine', label: 'f(x) = sin(x)', x: 0, hint: 'Derivative of sin is cos. cos(0) = ?' },
]

export default function SlopeSniper() {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const ch = CHALLENGES[idx]
  const trueSlope = numericalDerivative(CURVES[ch.curve], ch.x)

  function submit() {
    if (!guess) return
    const val = parseFloat(guess)
    const correct = Math.abs(val - trueSlope) < 0.2
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1) }
    else setStreak(0)
    setRevealed(true)
  }

  function next() {
    setIdx(i => (i + 1) % CHALLENGES.length)
    setGuess(''); setRevealed(false)
  }

  const guessVal = parseFloat(guess)
  const isCorrect = revealed && Math.abs(guessVal - trueSlope) < 0.2

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f472b6' }}>
          Slope Sniper
        </span>
        <span className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
          Score: {score} &nbsp;{streak >= 3 ? `🔥 ${streak} streak` : ''}
        </span>
      </div>

      <div className="p-6">
        <div
          className="rounded-lg p-5 mb-5 text-center"
          style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-400)' }}>
            What is the slope of the tangent line?
          </div>
          <div
            className="text-xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-50)' }}
          >
            {ch.label}
          </div>
          <div className="text-sm" style={{ color: 'var(--color-ink-400)' }}>at x = {ch.x}</div>

          {/* Visual slope indicator */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div
              className="w-20 h-1 rounded"
              style={{
                backgroundColor: '#f472b6',
                transform: `rotate(${-Math.atan(trueSlope) * (180 / Math.PI) * 0.6}deg)`,
                transformOrigin: 'center',
              }}
            />
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--color-ink-500)', fontStyle: 'italic' }}>
            {ch.hint}
          </div>
        </div>

        {!revealed ? (
          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              placeholder="Your slope guess"
              value={guess}
              onChange={e => setGuess(e.target.value)}
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
              style={{ backgroundColor: '#f472b6', color: 'var(--color-ink-950)' }}
            >
              Fire!
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4"
              style={{
                backgroundColor: isCorrect ? 'rgba(163,230,53,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${isCorrect ? '#a3e63544' : '#f8717144'}`,
              }}
            >
              <div
                className="font-semibold mb-1 text-base"
                style={{
                  color: isCorrect ? '#a3e635' : '#f87171',
                  fontFamily: 'var(--font-handwritten)',
                }}
              >
                {isCorrect ? `Nice shot! Slope = ${trueSlope.toFixed(2)}` : `Close! True slope = ${trueSlope.toFixed(2)}, you guessed ${guessVal.toFixed(2)}`}
              </div>
              <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-handwritten)', fontSize: '0.95rem' }}>
                {isCorrect
                  ? 'Your intuition is sharpening.'
                  : `Off by ${Math.abs(guessVal - trueSlope).toFixed(2)}. Try using the derivative formula -- it gives the exact slope instantly.`}
              </p>
              <button
                onClick={next}
                className="mt-3 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
              >
                Next Target →
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
