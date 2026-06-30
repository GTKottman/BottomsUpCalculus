import { useState, useCallback } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

/**
 * Shape of progress data:
 * {
 *   prologue: { visited: true },
 *   chapter_1: { sectionsCompleted: ['intro', 'slopes'], quizPassed: false, completed: false },
 *   ...
 * }
 *
 * Stored under the key `calc1_progress_<username>` so each account has isolated progress.
 */
export default function useProgress() {
  const { currentUser } = useAuthContext()
  const storageKey = `calc1_progress_${currentUser}`

  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const save = useCallback((data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch {
      // localStorage unavailable
    }
  }, [storageKey])

  const markPrologueVisited = useCallback(() => {
    setProgress(prev => {
      const next = { ...prev, prologue: { ...prev.prologue, visited: true } }
      save(next)
      return next
    })
  }, [save])

  const markSectionComplete = useCallback((chapterId, sectionId) => {
    setProgress(prev => {
      const chapter = prev[chapterId] || {}
      const sections = chapter.sectionsCompleted || []
      if (sections.includes(sectionId)) return prev
      const next = {
        ...prev,
        [chapterId]: {
          ...chapter,
          sectionsCompleted: [...sections, sectionId],
        },
      }
      save(next)
      return next
    })
  }, [save])

  const markQuizPassed = useCallback((chapterId) => {
    setProgress(prev => {
      const chapter = prev[chapterId] || {}
      const next = {
        ...prev,
        [chapterId]: { ...chapter, quizPassed: true, completed: true },
      }
      save(next)
      return next
    })
  }, [save])

  const isChapterUnlocked = useCallback((chapterId, allChapters) => {
    const idx = allChapters.findIndex(c => c.id === chapterId)
    if (idx === 0) return true
    const prev = allChapters[idx - 1]
    if (!prev) return false
    return !!(progress[prev.id]?.completed)
  }, [progress])

  const isChapterCompleted = useCallback((chapterId) => {
    return !!(progress[chapterId]?.completed)
  }, [progress])

  const isPrologueVisited = !!(progress.prologue?.visited)

  const totalCompleted = Object.values(progress).filter(v => v.completed).length

  const resetProgress = useCallback(() => {
    localStorage.removeItem(storageKey)
    setProgress({})
  }, [storageKey])

  return {
    progress,
    isPrologueVisited,
    totalCompleted,
    markPrologueVisited,
    markSectionComplete,
    markQuizPassed,
    isChapterUnlocked,
    isChapterCompleted,
    resetProgress,
  }
}
