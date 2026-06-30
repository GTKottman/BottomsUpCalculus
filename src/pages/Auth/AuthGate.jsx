import { useState } from 'react'
import { motion } from 'framer-motion'

const inputStyle = {
  backgroundColor: 'var(--color-ink-800)',
  border: '1px solid var(--color-ink-700)',
  color: 'var(--color-ink-100)',
  borderRadius: '0.5rem',
  width: '100%',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 500,
  marginBottom: '0.375rem',
  color: 'var(--color-ink-300)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

export default function AuthGate({ onLogin, onCreateAccount }) {
  const [tab, setTab] = useState('login')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [masterPw, setMasterPw] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [createError, setCreateError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    const result = onLogin(loginUsername, loginPassword)
    if (!result.ok) setLoginError(result.error)
  }

  function handleCreate(e) {
    e.preventDefault()
    const result = onCreateAccount(masterPw, newUsername, newPassword, confirmPassword)
    if (!result.ok) setCreateError(result.error)
  }

  function switchTab(t) {
    setTab(t)
    setLoginError('')
    setCreateError('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-ink-950)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3"
            style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
          >
            ∂
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-amber-300)' }}
          >
            Calc I
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-400)' }}>
            A love letter from one math nerd to another.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'var(--color-ink-900)',
            border: '1px solid var(--color-ink-700)',
          }}
        >
          {/* Tabs */}
          <div
            className="flex mb-6 rounded-lg p-1 gap-1"
            style={{ backgroundColor: 'var(--color-ink-800)' }}
          >
            {[
              { id: 'login', label: 'Log In' },
              { id: 'create', label: 'Create Account' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchTab(t.id)}
                className="flex-1 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: tab === t.id ? 'var(--color-amber-500)' : 'transparent',
                  color: tab === t.id ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  placeholder="your-username"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={e => { setLoginUsername(e.target.value); setLoginError('') }}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setLoginError('') }}
                  style={inputStyle}
                />
              </div>
              {loginError && (
                <p className="text-sm" style={{ color: '#f87171' }}>{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
              >
                Log In
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label style={labelStyle}>Master Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={masterPw}
                  onChange={e => { setMasterPw(e.target.value); setCreateError('') }}
                  style={inputStyle}
                />
                <p className="text-xs mt-1.5" style={{ color: 'var(--color-ink-500)' }}>
                  Required to create a new account.
                </p>
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  placeholder="your-username"
                  autoComplete="username"
                  value={newUsername}
                  onChange={e => { setNewUsername(e.target.value); setCreateError('') }}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setCreateError('') }}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setCreateError('') }}
                  style={inputStyle}
                />
              </div>
              {createError && (
                <p className="text-sm" style={{ color: '#f87171' }}>{createError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-amber-500)', color: 'var(--color-ink-950)' }}
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
