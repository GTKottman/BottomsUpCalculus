import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-8xl mb-6" style={{ color: 'var(--color-ink-700)', fontFamily: 'var(--font-serif)' }}>
          ∅
        </div>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-200)' }}
        >
          Page Not Found
        </h1>
        <p
          className="mb-8 text-base"
          style={{
            color: 'var(--color-ink-400)',
            fontFamily: 'var(--font-handwritten)',
            fontSize: '1.1rem',
          }}
        >
          The empty set. Nothing here. Not even a limit that approaches something useful.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
        >
          ← Back to the journey
        </Link>
      </motion.div>
    </div>
  )
}
