import { useState, useCallback } from 'react'

const STORAGE_KEY = 'calc1_progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable
  }
}

/**
 * Shape of progress data:
 * {
 *   prologue: { visited: true },
 *   chapter_1: { sectionsCompleted: ['intro', 'slopes'], quizPassed: false, completed: false },
 *   ...
 * }
 */
export default function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const markPrologueVisited = useCallback(() => {
    setProgress(prev => {
      const next = { ...prev, prologue: { ...prev.prologue, visited: true } }
      saveProgress(next)
      return next
    })
  }, [])

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
      saveProgress(next)
      return next
    })
  }, [])

  const markQuizPassed = useCallback((chapterId) => {
    setProgress(prev => {
      const chapter = prev[chapterId] || {}
      const next = {
        ...prev,
        [chapterId]: { ...chapter, quizPassed: true, completed: true },
      }
      saveProgress(next)
      return next
    })
  }, [])

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
    localStorage.removeItem(STORAGE_KEY)
    setProgress({})
  }, [])

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
