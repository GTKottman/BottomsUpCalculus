import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Quiz({ quiz, onPass }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = quiz.questions[current]
  const total = quiz.questions.length

  function choose(idx) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    const correct = idx === q.correct
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, { correct }])
  }

  function next() {
    if (current + 1 >= total) {
      setDone(true)
      const finalScore = answers.filter(a => a.correct).length + (selected === q.correct ? 1 : 0)
      if (finalScore >= Math.ceil(total * 0.75)) onPass?.()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  if (done) {
    const finalScore = answers.filter(a => a.correct).length
    const passed = finalScore >= Math.ceil(total * 0.75)
    return (
      <ResultScreen score={finalScore} total={total} passed={passed} onRetry={() => {
        setCurrent(0); setSelected(null); setRevealed(false)
        setScore(0); setDone(false); setAnswers([])
      }} onPass={onPass} />
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-ink-800)',
        border: '1px solid var(--color-ink-600)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-ink-700)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-amber-400)' }}>
          Checkpoint Quiz
        </span>
        <span className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
          {current + 1} / {total}
        </span>
      </div>

      {/* Progress */}
      <div style={{ backgroundColor: 'var(--color-ink-700)', height: 3 }}>
        <div
          style={{
            backgroundColor: 'var(--color-amber-500)',
            height: 3,
            width: `${((current) / total) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="text-base font-medium mb-5 leading-relaxed"
              style={{ color: 'var(--color-ink-50)', fontFamily: 'var(--font-serif)' }}
            >
              {q.question}
            </p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let bg = 'var(--color-ink-700)'
                let border = 'var(--color-ink-600)'
                let textColor = 'var(--color-ink-200)'

                if (revealed) {
                  if (i === q.correct) {
                    bg = 'rgba(163, 230, 53, 0.15)'
                    border = '#a3e635'
                    textColor = '#a3e635'
                  } else if (i === selected && i !== q.correct) {
                    bg = 'rgba(248, 113, 113, 0.15)'
                    border = '#f87171'
                    textColor = '#f87171'
                  }
                } else if (selected === i) {
                  bg = 'var(--color-ink-600)'
                  border = 'var(--color-amber-500)'
                  textColor = 'var(--color-amber-300)'
                }

                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-150 border"
                    style={{
                      backgroundColor: bg,
                      borderColor: border,
                      color: textColor,
                      cursor: revealed ? 'default' : 'pointer',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span
                      className="inline-block w-6 h-6 rounded-full text-center text-xs font-bold mr-3"
                      style={{
                        backgroundColor: revealed && i === q.correct ? '#a3e635' : 'var(--color-ink-600)',
                        color: revealed && i === q.correct ? 'var(--color-ink-950)' : 'var(--color-ink-300)',
                        lineHeight: '24px',
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 rounded-lg p-4"
                  style={{
                    backgroundColor: selected === q.correct
                      ? 'rgba(163,230,53,0.08)'
                      : 'rgba(251,191,36,0.08)',
                    border: `1px solid ${selected === q.correct ? '#a3e63533' : '#fbbf2433'}`,
                  }}
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{
                      color: selected === q.correct ? '#a3e635' : '#fbbf24',
                      fontFamily: 'var(--font-handwritten)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {selected === q.correct ? 'Exactly right.' : 'Not quite -- here\'s the thinking:'}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: 'var(--color-ink-200)',
                      fontFamily: 'var(--font-handwritten)',
                      fontSize: '1rem',
                    }}
                  >
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {revealed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={next}
                className="mt-5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-amber-500)',
                  color: 'var(--color-ink-950)',
                }}
              >
                {current + 1 >= total ? 'See Results' : 'Next Question →'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultScreen({ score, total, passed, onRetry, onPass }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-8 text-center"
      style={{
        backgroundColor: 'var(--color-ink-800)',
        border: `1px solid ${passed ? '#a3e63555' : 'var(--color-ink-600)'}`,
      }}
    >
      <div className="text-4xl mb-4">{passed ? '🎉' : '🤔'}</div>
      <div
        className="text-3xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-serif)',
          color: passed ? '#a3e635' : 'var(--color-amber-400)',
        }}
      >
        {score} / {total}
      </div>
      <p
        className="text-sm mb-6"
        style={{
          color: 'var(--color-ink-300)',
          fontFamily: 'var(--font-handwritten)',
          fontSize: '1.05rem',
        }}
      >
        {passed
          ? 'You got it. On to the next chapter.'
          : "Close! Review the sections and try again. There's no rush."}
      </p>
      <div className="flex gap-3 justify-center">
        {!passed && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105"
            style={{
              borderColor: 'var(--color-ink-500)',
              color: 'var(--color-ink-300)',
              backgroundColor: 'transparent',
            }}
          >
            Try Again
          </button>
        )}
        {passed && (
          <button
            onClick={onPass}
            className="px-8 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-amber-500)',
              color: 'var(--color-ink-950)',
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </motion.div>
  )
}
