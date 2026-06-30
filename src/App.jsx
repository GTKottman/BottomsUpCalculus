import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/Layout/ScrollToTop'
import Home from './pages/Home/Home'
import Prologue from './pages/Prologue/Prologue'
import ChapterPage from './pages/Chapter/ChapterPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
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
  )
}
