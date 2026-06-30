import { motion } from 'framer-motion'

export default function NarratorLetter({ children, from = 'An Old Math Nerd', date, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--color-paper-dark)',
        border: '1px solid var(--color-paper-light)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(160,128,96,0.06) 28px)',
        }}
      />

      {/* Red margin line */}
      <div
        className="absolute top-0 bottom-0 left-16"
        style={{ borderLeft: '1px solid rgba(180, 60, 60, 0.2)', pointerEvents: 'none' }}
      />

      <div className="relative z-10 px-10 py-8 pl-20">
        {date && (
          <div
            className="text-xs mb-5"
            style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--color-paper-faded)', fontSize: '0.9rem' }}
          >
            {date}
          </div>
        )}

        <div
          className="text-base leading-relaxed space-y-4"
          style={{
            fontFamily: 'var(--font-handwritten)',
            color: 'var(--color-paper-text)',
            fontSize: '1.1rem',
            lineHeight: '28px',
          }}
        >
          {children}
        </div>

        <div
          className="mt-8 text-right text-sm"
          style={{
            fontFamily: 'var(--font-handwritten)',
            color: 'var(--color-paper-faded)',
            fontSize: '1rem',
          }}
        >
          &mdash; {from}
        </div>
      </div>
    </motion.div>
  )
}
