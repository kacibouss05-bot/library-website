import { useState, useEffect } from 'react'
import { getRecentChanges } from '../services/openLibraryApi'

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
        setChanges(data)
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