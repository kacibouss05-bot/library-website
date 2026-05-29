import { useState, useEffect } from 'react'
import { getRecentChanges, getWorkDetails } from '../services/openLibraryApi'

function useRecentChanges() {
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchChanges() {
  try {
    setLoading(true)
    setError(null)
    const data = await getRecentChanges()
    console.log('Premier changement brut:', data[0])  // ← ICI, après const data
    
    const bookChanges = data.filter(c =>
      c.kind === 'add-book' || c.kind === 'edit-book'
    )

        // Enrichir avec titre + couverture
        const enriched = await Promise.all(
          bookChanges.slice(0, 12).map(async (change) => {
            const key = change.key // ex: "/works/OL123W"
            if (!key) return { ...change, title: null, coverId: null }
            const details = await getWorkDetails(key)
            return {
              ...change,
              title: details?.title || null,
              coverId: details?.covers?.[0] || null,
            }
          })
        )

        setChanges(enriched)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchChanges()
  }, [])

  return { changes, loading, error }
}

export default useRecentChanges