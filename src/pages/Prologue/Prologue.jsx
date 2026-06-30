import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import NarratorLetter from '../../components/NarratorLetter/NarratorLetter'
import useProgress from '../../hooks/useProgress'

export default function Prologue() {
  const { markPrologueVisited } = useProgress()

  useEffect(() => {
    markPrologueVisited()
  }, [markPrologueVisited])

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-3 text-center"
          style={{ color: 'var(--color-amber-500)' }}
        >
          Prologue
        </div>
        <h1
          className="text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-50)' }}
        >
          A Letter to You
        </h1>

        <NarratorLetter date="Sometime in the middle of the night">
          <p>I want to tell you something nobody told me when I was learning this.</p>

          <p>
            Calculus is not hard because it is complicated. It is hard because everyone teaches it
            backward -- they hand you the machinery before you understand what problem it solves.
            They give you the formal definition of a limit on page one, before you have ever once felt
            the need for one. That is like handing someone a hammer and expecting them to care about
            it before they have ever seen a nail.
          </p>

          <p>
            This course will not do that to you.
          </p>

          <p>
            We are going to start at the bottom. What does it mean for something to change? What does
            it mean to be close to a number without being that number? What does a slope feel like
            before we give it a name?
          </p>

          <p>
            Every idea you meet here, you will earn. You will feel the need for it before you see the
            answer. The formal definitions will arrive like the punchline of a joke you have already
            heard -- satisfying, not confusing.
          </p>

          <p>
            I am writing this because I love mathematics and I love the moment when someone else
            catches that love. It is contagious. You might not feel it yet. That is fine.
            You will.
          </p>

          <p>
            One more thing: be patient with yourself. The people who are good at math are not the
            ones who never get confused. They are the ones who learned to be comfortable being
            confused for a while. Confusion is not a sign that you are failing. It is a sign that
            you are thinking.
          </p>

          <p>Alright. Let&apos;s go.</p>
        </NarratorLetter>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Link
            to="/chapter/chapter_1"
            className="inline-block px-10 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--color-amber-500)',
              color: 'var(--color-ink-950)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem',
            }}
          >
            Begin Chapter 1 →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
