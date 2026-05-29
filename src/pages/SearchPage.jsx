import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useSearch from '../hooks/useSearch'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './SearchPage.css'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const { results, loading, error, totalPages, currentPage, search } = useSearch()

  const [filters, setFilters] = useState({
    q: '',
    author: '',
    subject: '',
    publisher: '',
    language: '',
    publish_year: ''
  })

  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (q) {
      setFilters(prev => ({ ...prev, q }))
      search({ q }, 1)
    }
  }, [searchParams])

  function handleChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    search(filters, 1)
  }

  function handlePageChange(newPage) {
    search(filters, newPage)
    window.scrollTo(0, 0)
  }

  return (
    <div className="search-page">
      <h1>Recherche avancée</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          name="q"
          placeholder="Recherche générale..."
          value={filters.q}
          onChange={handleChange}
        />
        <input
          name="author"
          placeholder="Auteur"
          value={filters.author}
          onChange={handleChange}
        />
        <input
          name="subject"
          placeholder="Sujet / Genre"
          value={filters.subject}
          onChange={handleChange}
        />
        <input
          name="publisher"
          placeholder="Éditeur"
          value={filters.publisher}
          onChange={handleChange}
        />
        <input
          name="language"
          placeholder="Langue (ex: fre, eng)"
          value={filters.language}
          onChange={handleChange}
        />
        <input
          name="publish_year"
          placeholder="Année de publication"
          value={filters.publish_year}
          onChange={handleChange}
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && results.length === 0 && (
        <p className="no-results">Aucun résultat trouvé</p>
      )}

      <div className="cards-grid">
        {results.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Précédent
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchPage