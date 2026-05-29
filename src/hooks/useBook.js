import { useEffect, useState } from 'react'
import { getAuthorById, getBookById, getBookEditions } from '../services/openLibraryApi'

function normalizeId(id) {
  return String(id || '').trim()
}

function extractAuthorId(authorRef) {
  const key = authorRef?.author?.key || authorRef?.key || ''
  return key ? key.split('/').pop() : ''
}

function useBook(id) {
  const normalizedId = normalizeId(id)
  const [bookState, setBookState] = useState(null)
  const [editionsState, setEditionsState] = useState([])
  const [authorsState, setAuthorsState] = useState([])
  const [loadingState, setLoadingState] = useState(false)
  const [errorState, setErrorState] = useState(null)

  useEffect(() => {
    if (!normalizedId) {
      return undefined
    }

    let active = true

    async function fetchBook() {
      try {
        setLoadingState(true)
        setErrorState(null)

        const [bookResult, editionsResult] = await Promise.allSettled([
          getBookById(normalizedId),
          getBookEditions(normalizedId),
        ])

        if (!active) return

        if (bookResult.status === 'rejected') {
          throw bookResult.reason
        }

        const bookData = bookResult.value
        setBookState(bookData)
        setEditionsState(editionsResult.status === 'fulfilled' ? editionsResult.value : [])

        const authorIds = [...new Set((bookData.authors || []).map(extractAuthorId).filter(Boolean))]

        if (authorIds.length === 0) {
          setAuthorsState([])
          return
        }

        const authorResults = await Promise.allSettled(authorIds.map((authorId) => getAuthorById(authorId)))

        if (!active) return

        setAuthorsState(
          authorResults.map((result, index) => {
            if (result.status === 'fulfilled') {
              return result.value
            }

            return {
              key: authorIds[index],
              name: authorIds[index],
            }
          }),
        )
      } catch (err) {
        if (!active) return

        setBookState(null)
        setEditionsState([])
        setAuthorsState([])
        setErrorState(err.message)
      } finally {
        if (active) {
          setLoadingState(false)
        }
      }
    }

    fetchBook()

    return () => {
      active = false
    }
  }, [normalizedId])

  return {
    book: normalizedId ? bookState : null,
    editions: normalizedId ? editionsState : [],
    authors: normalizedId ? authorsState : [],
    loading: normalizedId ? loadingState : false,
    error: normalizedId ? errorState : 'ID invalide',
    invalidId: !normalizedId,
  }
}

export default useBook

