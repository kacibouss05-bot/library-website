import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useBook from '../hooks/useBook'

vi.mock('../services/openLibraryApi', () => ({
  getAuthorById: vi.fn(),
  getBookById: vi.fn(),
  getBookEditions: vi.fn(),
}))

import { getAuthorById, getBookById, getBookEditions } from '../services/openLibraryApi'

describe('useBook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('marks blank ids as invalid', () => {
    const { result } = renderHook(() => useBook('   '))

    expect(result.current.invalidId).toBe(true)
    expect(result.current.error).toBe('ID invalide')
  })

  it('loads a book, editions, and author data', async () => {
    getBookById.mockResolvedValue({
      title: 'The Hobbit',
      authors: [{ author: { key: '/authors/OL1A' } }],
    })
    getBookEditions.mockResolvedValue([{ title: 'The Hobbit' }])
    getAuthorById.mockResolvedValue({ name: 'J. R. R. Tolkien' })

    const { result } = renderHook(() => useBook('OL123W'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getBookById).toHaveBeenCalledWith('OL123W')
    expect(getBookEditions).toHaveBeenCalledWith('OL123W')
    expect(getAuthorById).toHaveBeenCalledWith('OL1A')
    expect(result.current.book.title).toBe('The Hobbit')
    expect(result.current.editions).toHaveLength(1)
    expect(result.current.authors[0].name).toBe('J. R. R. Tolkien')
  })
})

