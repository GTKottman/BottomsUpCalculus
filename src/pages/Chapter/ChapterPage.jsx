import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlockMath } from '../../components/Math/Math'
import NarratorLetter from '../../components/NarratorLetter/NarratorLetter'
import InteractiveGraph from '../../components/InteractiveGraph/InteractiveGraph'
import MiniGame from '../../components/MiniGame/MiniGame'
import Playground from '../../components/Playground/Playground'
import Quiz from '../../components/Quiz/Quiz'
import useProgress from '../../hooks/useProgress'
import { ALL_CHAPTERS } from '../../data/chapters/all'
import { CHAPTERS } from '../../data/chapters/index'

export default function ChapterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { markQuizPassed, isChapterUnlocked, isChapterCompleted } = useProgress()

  const chapter = ALL_CHAPTERS[id]
  const unlocked = isChapterUnlocked(id, CHAPTERS)

  if (!chapter) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p style={{ color: 'var(--color-ink-400)' }}>Chapter not found.</p>
        <Link to="/" style={{ color: 'var(--color-amber-400)' }}>← Back to map</Link>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-300)' }}
        >
          Not yet
        </h2>
        <p className="mb-6" style={{ color: 'var(--color-ink-500)' }}>
          Complete the previous chapter to unlock this one.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
        >
          ← Back to the map
        </Link>
      </div>
    )
  }

  const chapterIdx = CHAPTERS.findIndex(c => c.id === id)
  const nextChapter = CHAPTERS[chapterIdx + 1]

  function handleQuizPass() {
    markQuizPassed(id)
    setTimeout(() => {
      if (nextChapter) navigate(`/chapter/${nextChapter.id}`)
      else navigate('/')
    }, 800)
  }

  const meta = CHAPTERS.find(c => c.id === id)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: meta?.color || 'var(--color-amber-400)' }}
        >
          Chapter {chapter.number}
        </div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-50)' }}
        >
          {chapter.title}
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-ink-400)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          {chapter.subtitle}
        </p>
      </motion.div>

      {/* Narrator letter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <NarratorLetter date={chapter.narratorLetter.date}>
          {chapter.narratorLetter.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </NarratorLetter>
      </motion.div>

      {/* Sections */}
      {chapter.sections.map((section, si) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + si * 0.08 }}
          className="mb-14"
        >
          <h2
            className="text-2xl font-semibold mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-ink-100)',
              borderBottom: '1px solid var(--color-ink-700)',
              paddingBottom: '0.5rem',
            }}
          >
            {section.title}
          </h2>

          <div className="space-y-5">
            {section.content.map((block, bi) => (
              <ContentBlock key={bi} block={block} />
            ))}
          </div>
        </motion.section>
      ))}

      {/* Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mb-10"
      >
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-amber-400)' }}
        >
          End of Chapter {chapter.number}
        </div>
        <Quiz quiz={chapter.quiz} onPass={handleQuizPass} />
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--color-ink-800)' }}>
        <Link
          to="/"
          className="text-sm transition-colors"
          style={{ color: 'var(--color-ink-500)' }}
        >
          ← Journey Map
        </Link>
        {isChapterCompleted(id) && nextChapter && (
          <Link
            to={`/chapter/${nextChapter.id}`}
            className="text-sm font-semibold transition-all hover:scale-105"
            style={{ color: 'var(--color-amber-400)' }}
          >
            Chapter {chapter.number + 1}: {nextChapter.title} →
          </Link>
        )}
      </div>
    </div>
  )
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'text':
      return (
        <div>
          {block.body.split('\n').map((line, i) => (
            <p
              key={i}
              className="leading-relaxed mb-2"
              style={{
                color: 'var(--color-ink-200)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: '1.75',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )

    case 'math':
      return (
        <div
          className="rounded-lg px-6 py-4 overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-ink-800)',
            border: '1px solid var(--color-ink-700)',
            color: 'var(--color-ink-50)',
          }}
        >
          <BlockMath math={block.body} />
        </div>
      )

    case 'insight':
      return (
        <div
          className="rounded-lg px-5 py-4 border-l-4"
          style={{
            backgroundColor: 'rgba(245,160,48,0.08)',
            borderLeftColor: 'var(--color-amber-500)',
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--color-amber-500)', fontFamily: 'var(--font-handwritten)', fontSize: '0.8rem' }}
          >
            A note from the old nerd
          </div>
          <p
            className="leading-relaxed"
            style={{
              color: 'var(--color-amber-200)',
              fontFamily: 'var(--font-handwritten)',
              fontSize: '1.05rem',
              lineHeight: '1.7',
            }}
          >
            {block.body}
          </p>
        </div>
      )

    case 'graph':
      return (
        <div>
          <InteractiveGraph
            type={block.graphType}
            curve={block.curve}
            config={block.config || {}}
          />
          {block.caption && (
            <p
              className="text-center text-xs mt-2"
              style={{ color: 'var(--color-ink-500)', fontStyle: 'italic' }}
            >
              {block.caption}
            </p>
          )}
        </div>
      )

    case 'minigame':
      return (
        <div>
          <MiniGame type={block.gameType} />
          {block.caption && (
            <p
              className="text-center text-xs mt-2"
              style={{ color: 'var(--color-ink-500)', fontStyle: 'italic' }}
            >
              {block.caption}
            </p>
          )}
        </div>
      )

    case 'playground':
      return (
        <div>
          <Playground type={block.playgroundType} />
          {block.caption && (
            <p
              className="text-center text-xs mt-2"
              style={{ color: 'var(--color-ink-500)', fontStyle: 'italic' }}
            >
              {block.caption}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}
