import { renderHook, waitFor, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useSearch from '../hooks/useSearch'

vi.mock('../services/openLibraryApi', () => ({
  searchBooks: vi.fn(),
}))

import { searchBooks } from '../services/openLibraryApi'

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects empty filters', async () => {
    const { result } = renderHook(() => useSearch())

    await act(async () => {
      await result.current.search({ q: '   ' }, 1)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Veuillez remplir au moins un champ de recherche')
    })
  })

  it('stores search results from the API', async () => {
    searchBooks.mockResolvedValue({
      books: [{ key: '/works/OL1W', title: 'Dune' }],
      totalPages: 3,
    })

    const { result } = renderHook(() => useSearch())

    await act(async () => {
      await result.current.search({ q: 'Dune' }, 2)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(searchBooks).toHaveBeenCalledWith({ q: 'Dune' }, 2)
    expect(result.current.results).toHaveLength(1)
    expect(result.current.currentPage).toBe(2)
    expect(result.current.totalPages).toBe(3)
  })
})

