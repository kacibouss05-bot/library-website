import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BookPage from '../pages/BookPage'

vi.mock('../hooks/useBook', () => ({
  default: vi.fn(),
}))

vi.mock('../hooks/useWikipedia', () => ({
  default: vi.fn(),
}))

import useBook from '../hooks/useBook'
import useWikipedia from '../hooks/useWikipedia'

function renderBookPage(route = '/book/OL123W') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BookPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the book details and Wikipedia summary', async () => {
    useBook.mockReturnValue({
      book: {
        title: 'The Hobbit',
        description: { value: 'A hobbit adventure.' },
        authors: [{ author: { key: '/authors/OL1A' } }],
        covers: [123],
        first_publish_date: '1937',
        subjects: ['Fantasy'],
        subject_places: ['Middle-earth'],
      },
      editions: [
        { key: '/books/OL1M', title: 'The Hobbit', publish_date: '1937', publishers: ['George Allen & Unwin'] },
      ],
      authors: [{ name: 'J. R. R. Tolkien' }],
      loading: false,
      error: null,
      invalidId: false,
    })

    useWikipedia.mockReturnValue({
      summary: {
        title: 'The Hobbit',
        extract: 'A fantasy novel by J. R. R. Tolkien.',
        content_urls: {
          desktop: {
            page: 'https://en.wikipedia.org/wiki/The_Hobbit',
          },
        },
        thumbnail: {
          source: 'https://upload.wikimedia.org/example.jpg',
        },
      },
      loading: false,
      error: null,
    })

    renderBookPage()

    expect(await screen.findByRole('heading', { level: 1, name: /the hobbit/i })).toBeInTheDocument()
    expect(screen.getByText('J. R. R. Tolkien', { selector: '.book-page__authors' })).toBeInTheDocument()
    expect(screen.getByText('A fantasy novel by J. R. R. Tolkien.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voir la page wikipedia/i })).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/The_Hobbit',
    )
  })

  it('shows a Wikipedia fallback when nothing is returned', async () => {
    useBook.mockReturnValue({
      book: {
        title: 'Unknown Book',
        description: 'Short description.',
        authors: [],
        covers: [],
        subjects: [],
        subject_places: [],
      },
      editions: [],
      authors: [],
      loading: false,
      error: null,
      invalidId: false,
    })

    useWikipedia.mockReturnValue({
      summary: null,
      loading: false,
      error: null,
    })

    renderBookPage()

    expect(await screen.findByRole('heading', { level: 1, name: /unknown book/i })).toBeInTheDocument()
    expect(screen.getByText(/aucune information wikipedia disponible/i)).toBeInTheDocument()
  })

  it('renders the invalid id state', () => {
    useBook.mockReturnValue({
      book: null,
      editions: [],
      authors: [],
      loading: false,
      error: null,
      invalidId: true,
    })

    useWikipedia.mockReturnValue({
      summary: null,
      loading: false,
      error: null,
    })

    renderBookPage('/book/%20%20%20')

    expect(screen.getByText(/id invalide/i)).toBeInTheDocument()
    expect(screen.getByText(/l'identifiant du livre est manquant ou incorrect/i)).toBeInTheDocument()
  })
})

