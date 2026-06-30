import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import useAuth from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/Layout/ScrollToTop'
import Home from './pages/Home/Home'
import Prologue from './pages/Prologue/Prologue'
import ChapterPage from './pages/Chapter/ChapterPage'
import NotFound from './pages/NotFound'
import AuthGate from './pages/Auth/AuthGate'

export default function App() {
  const { currentUser, login, createAccount, logout } = useAuth()

  if (!currentUser) {
    return <AuthGate onLogin={login} onCreateAccount={createAccount} />
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prologue" element={<Prologue />} />
            <Route path="/chapter/:id" element={<ChapterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
