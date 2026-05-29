import { useEffect, useState } from 'react'
import { getWikipediaSummary } from '../services/wikipediaApi'

function useWikipedia(title) {
  const normalizedTitle = String(title || '').trim()
  const [summary, setSummary] = useState(null)
  const [loadingState, setLoadingState] = useState(false)
  const [errorState, setErrorState] = useState(null)

  useEffect(() => {
    if (!normalizedTitle) {
      return undefined
    }

    let active = true

    async function fetchSummary() {
      try {
        setLoadingState(true)
        setErrorState(null)

        const data = await getWikipediaSummary(normalizedTitle)

        if (!active) return

        setSummary(data)
      } catch (err) {
        if (!active) return

        setSummary(null)
        setErrorState(err.message)
      } finally {
        if (active) {
          setLoadingState(false)
        }
      }
    }

    fetchSummary()

    return () => {
      active = false
    }
  }, [normalizedTitle])

  return {
    summary: normalizedTitle ? summary : null,
    loading: normalizedTitle ? loadingState : false,
    error: normalizedTitle ? errorState : null,
  }
}

export default useWikipedia

