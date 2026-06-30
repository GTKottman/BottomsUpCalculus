import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../contexts/AuthContext'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { currentUser, logout } = useAuthContext()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-ink-950)' }}>
      <nav
        style={{
          backgroundColor: 'var(--color-ink-900)',
          borderBottom: '1px solid var(--color-ink-700)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
            >
              ∂
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-amber-300)' }}
            >
              Calc&nbsp;I
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              style={{ color: isHome ? 'var(--color-amber-400)' : 'var(--color-ink-300)' }}
              className="hover:text-amber-300 transition-colors"
            >
              Journey Map
            </Link>
            <Link
              to="/prologue"
              style={{ color: location.pathname === '/prologue' ? 'var(--color-amber-400)' : 'var(--color-ink-300)' }}
              className="transition-colors"
            >
              Prologue
            </Link>
            <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--color-ink-700)', paddingLeft: '1.25rem' }}>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{ backgroundColor: 'var(--color-ink-800)', color: 'var(--color-amber-300)', border: '1px solid var(--color-ink-700)' }}
              >
                {currentUser}
              </span>
              <button
                onClick={logout}
                className="text-xs transition-colors hover:opacity-80"
                style={{ color: 'var(--color-ink-400)' }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      <footer
        className="text-center py-6 text-xs"
        style={{
          color: 'var(--color-ink-500)',
          borderTop: '1px solid var(--color-ink-800)',
        }}
      >
        A love letter from one math nerd to another. &nbsp;&mdash;&nbsp; Built with care.
      </footer>
    </div>
  )
}
