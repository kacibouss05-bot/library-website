import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useWikipedia from '../hooks/useWikipedia'

vi.mock('../services/wikipediaApi', () => ({
  getWikipediaSummary: vi.fn(),
}))

import { getWikipediaSummary } from '../services/wikipediaApi'

describe('useWikipedia', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the Wikipedia summary for a title', async () => {
    getWikipediaSummary.mockResolvedValue({ extract: 'Summary text' })

    const { result } = renderHook(() => useWikipedia('The Hobbit'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getWikipediaSummary).toHaveBeenCalledWith('The Hobbit')
    expect(result.current.summary).toEqual({ extract: 'Summary text' })
    expect(result.current.error).toBeNull()
  })

  it('leaves the hook empty when Wikipedia returns 404', async () => {
    getWikipediaSummary.mockResolvedValue(null)

    const { result } = renderHook(() => useWikipedia('A book with no page'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.summary).toBeNull()
    expect(result.current.error).toBeNull()
  })
})

