import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProgressMap from '../../components/ProgressMap/ProgressMap'
import useProgress from '../../hooks/useProgress'
import { CHAPTERS } from '../../data/chapters/index'

export default function Home() {
  const { totalCompleted, isChapterUnlocked, isChapterCompleted, resetProgress } = useProgress()

  const pct = Math.round((totalCompleted / CHAPTERS.length) * 100)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div
          className="text-6xl mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-amber-400)' }}
        >
          ∫
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-50)' }}
        >
          Calculus I
        </h1>
        <p
          className="text-lg max-w-xl mx-auto mb-6"
          style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          A love letter from an older math nerd to a younger one. Built bottom-up -- you earn every idea before you name it.
        </p>

        <Link
          to="/prologue"
          className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--color-amber-500)',
            color: 'var(--color-ink-950)',
          }}
        >
          Read the Prologue first →
        </Link>
      </motion.div>

      {/* Progress bar */}
      {totalCompleted > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 max-w-md mx-auto"
        >
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--color-ink-400)' }}>
            <span>Your journey</span>
            <span>{totalCompleted} / {CHAPTERS.length} chapters &nbsp; ({pct}%)</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--color-ink-700)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--color-amber-500)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Journey Map */}
      <section>
        <h2
          className="text-center text-sm font-semibold uppercase tracking-widest mb-10"
          style={{ color: 'var(--color-ink-500)' }}
        >
          The Path
        </h2>
        <ProgressMap
          isChapterUnlocked={isChapterUnlocked}
          isChapterCompleted={isChapterCompleted}
        />
      </section>

      {/* Reset */}
      {totalCompleted > 0 && (
        <div className="text-center mt-16">
          <button
            onClick={resetProgress}
            className="text-xs transition-colors"
            style={{ color: 'var(--color-ink-600)' }}
          >
            Reset all progress
          </button>
        </div>
      )}
    </div>
  )
}
