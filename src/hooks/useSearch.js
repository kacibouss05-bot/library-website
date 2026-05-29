import { useCallback, useState } from 'react'
import { searchBooks } from '../services/openLibraryApi'

function useSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const search = useCallback(async (filters = {}, page = 1) => {
    const hasFilter = Object.values(filters).some((value) => value && value.trim() !== '')

    if (!hasFilter) {
      setError('Veuillez remplir au moins un champ de recherche')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await searchBooks(filters, page)
      setResults(data.books)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, totalPages, currentPage, search }
}

export default useSearch

