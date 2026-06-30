import { useState, useCallback } from 'react'

// Change this to whatever master password you want to require for account creation.
const MASTER_PASSWORD = 'calc1-master'

const ACCOUNTS_KEY = 'calc1_accounts'
const SESSION_KEY = 'calc1_session'

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    // localStorage unavailable
  }
}

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem(SESSION_KEY))

  const login = useCallback((username, password) => {
    const trimmed = username.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Please enter a username.' }
    const accounts = loadAccounts()
    const account = accounts[trimmed]
    if (!account) return { ok: false, error: 'No account found with that username.' }
    if (account.password !== password) return { ok: false, error: 'Incorrect password.' }
    localStorage.setItem(SESSION_KEY, trimmed)
    setCurrentUser(trimmed)
    return { ok: true }
  }, [])

  const createAccount = useCallback((masterPw, username, password, confirmPassword) => {
    if (masterPw !== MASTER_PASSWORD) return { ok: false, error: 'Incorrect master password.' }
    const trimmed = username.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Username cannot be empty.' }
    if (trimmed.length < 2) return { ok: false, error: 'Username must be at least 2 characters.' }
    if (!/^[a-z0-9_-]+$/.test(trimmed)) return { ok: false, error: 'Username may only contain letters, numbers, hyphens, and underscores.' }
    if (!password) return { ok: false, error: 'Password cannot be empty.' }
    if (password !== confirmPassword) return { ok: false, error: 'Passwords do not match.' }
    const accounts = loadAccounts()
    if (accounts[trimmed]) return { ok: false, error: 'That username is already taken.' }
    accounts[trimmed] = { password }
    saveAccounts(accounts)
    localStorage.setItem(SESSION_KEY, trimmed)
    setCurrentUser(trimmed)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }, [])

  return { currentUser, login, createAccount, logout }
}
