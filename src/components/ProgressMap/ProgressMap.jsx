import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../../data/chapters/index'

export default function ProgressMap({ progress, isChapterUnlocked, isChapterCompleted }) {
  return (
    <div className="relative max-w-3xl mx-auto px-4 py-8">
      {/* Vertical connecting line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-ink-700) 5%, var(--color-ink-700) 95%, transparent)' }}
      />

      <div className="flex flex-col gap-10">
        {CHAPTERS.map((chapter, idx) => {
          const unlocked = isChapterUnlocked(chapter.id, CHAPTERS)
          const completed = isChapterCompleted(chapter.id)
          const isLeft = idx % 2 === 0

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className={`flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Card */}
              <div className="flex-1">
                {unlocked ? (
                  <Link to={`/chapter/${chapter.id}`} className="block group">
                    <ChapterCard chapter={chapter} completed={completed} unlocked={unlocked} />
                  </Link>
                ) : (
                  <ChapterCard chapter={chapter} completed={completed} unlocked={false} />
                )}
              </div>

              {/* Node on the line */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300"
                  style={{
                    backgroundColor: completed
                      ? chapter.color
                      : unlocked
                      ? 'var(--color-ink-800)'
                      : 'var(--color-ink-900)',
                    borderColor: completed
                      ? chapter.color
                      : unlocked
                      ? 'var(--color-ink-500)'
                      : 'var(--color-ink-700)',
                    boxShadow: completed ? `0 0 16px ${chapter.color}66` : 'none',
                    opacity: unlocked ? 1 : 0.4,
                  }}
                >
                  {completed ? '✓' : unlocked ? chapter.icon : '🔒'}
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ChapterCard({ chapter, completed, unlocked }) {
  return (
    <div
      className="rounded-xl p-5 border transition-all duration-300"
      style={{
        backgroundColor: completed
          ? `${chapter.color}18`
          : unlocked
          ? 'var(--color-ink-800)'
          : 'var(--color-ink-900)',
        borderColor: completed
          ? `${chapter.color}55`
          : unlocked
          ? 'var(--color-ink-600)'
          : 'var(--color-ink-800)',
        opacity: unlocked ? 1 : 0.45,
        boxShadow: completed ? `0 0 20px ${chapter.color}22` : 'none',
        cursor: unlocked ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-start gap-3">
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: chapter.color, opacity: unlocked ? 1 : 0.6 }}
          >
            Chapter {chapter.number}
          </div>
          <div
            className="text-base font-semibold mb-1"
            style={{
              fontFamily: 'var(--font-serif)',
              color: unlocked ? 'var(--color-ink-50)' : 'var(--color-ink-500)',
            }}
          >
            {chapter.title}
          </div>
          <div
            className="text-sm"
            style={{ color: unlocked ? 'var(--color-ink-300)' : 'var(--color-ink-600)' }}
          >
            {chapter.subtitle}
          </div>
          {unlocked && !completed && (
            <div
              className="mt-3 text-xs"
              style={{ color: 'var(--color-ink-400)' }}
            >
              {chapter.description}
            </div>
          )}
          {completed && (
            <div
              className="mt-2 text-xs font-medium"
              style={{ color: chapter.color }}
            >
              Completed
            </div>
          )}
          {!unlocked && (
            <div className="mt-2 text-xs" style={{ color: 'var(--color-ink-600)' }}>
              Complete the previous chapter to unlock
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
