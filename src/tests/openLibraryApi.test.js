import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { getBookById, getBookEditions } from '../services/openLibraryApi'

describe('openLibraryApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects an invalid book id', async () => {
    await expect(getBookById('')).rejects.toThrow('ID invalide')
  })

  it('rejects an invalid editions id', async () => {
    await expect(getBookEditions('   ')).rejects.toThrow('ID invalide')
  })
})

