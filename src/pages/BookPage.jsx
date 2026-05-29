import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import useBook from '../hooks/useBook'
import useWikipedia from '../hooks/useWikipedia'

function formatDescription(description) {
  if (!description) {
    return 'Aucune description disponible pour ce livre.'
  }

  if (typeof description === 'string') {
    return description
  }

  return description.value || 'Aucune description disponible pour ce livre.'
}

function formatAuthor(author) {
  return author?.name || author?.personal_name?.[0] || author?.key?.split('/').pop() || 'Auteur inconnu'
}

function formatDate(value) {
  if (!value) return 'Date inconnue'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR')
}

function getPrimaryCover(book, editions) {
  const coverId = book?.covers?.[0] || editions?.find((edition) => edition?.covers?.[0])?.covers?.[0]

  if (!coverId) return null

  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
}

function BookPage() {
  const { id } = useParams()
  const { book, editions, authors, loading, error, invalidId } = useBook(id)
  const { summary, loading: wikipediaLoading, error: wikipediaError } = useWikipedia(book?.title)

  if (invalidId) {
    return (
      <section className="book-page book-page--error">
        <ErrorMessage message="ID invalide" />
        <p className="book-page__hint">L'identifiant du livre est manquant ou incorrect.</p>
        <Link to="/search" className="book-page__back-link">
          Retour à la recherche
        </Link>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="book-page book-page--loading">
        <LoadingSpinner />
      </section>
    )
  }

  if (error) {
    return (
      <section className="book-page book-page--error">
        <ErrorMessage message={error} />
        <Link to="/search" className="book-page__back-link">
          Retour à la recherche
        </Link>
      </section>
    )
  }

  if (!book) {
    return (
      <section className="book-page book-page--error">
        <ErrorMessage message="Livre introuvable" />
        <Link to="/search" className="book-page__back-link">
          Retour à la recherche
        </Link>
      </section>
    )
  }

  const authorNames = authors.length > 0 ? authors.map(formatAuthor).join(', ') : 'Auteur inconnu'
  const coverUrl = getPrimaryCover(book, editions)
  const wikipediaLink = summary?.content_urls?.desktop?.page
  const wikipediaImage = summary?.thumbnail?.source || summary?.originalimage?.source
  const publisher = editions.find((edition) => edition?.publishers?.length)?.publishers?.[0] || 'Éditeur inconnu'
  const publicationDate = book.first_publish_date || editions.find((edition) => edition?.publish_date)?.publish_date || 'Date inconnue'
  const subjectList = [...new Set([...(book.subjects || []), ...(book.subject_places || [])])].filter(Boolean)
  const editionList = editions.slice(0, 4)

  return (
    <article className="book-page">
      <Link to="/search" className="book-page__back-link">
        ← Retour aux recherches
      </Link>

      <header className="book-page__hero">
        <div className="book-page__cover">
          {coverUrl ? (
            <img src={coverUrl} alt={book.title} />
          ) : (
            <div className="book-page__cover-placeholder">
              <span>📚</span>
            </div>
          )}
        </div>

        <div className="book-page__intro">
          <p className="book-page__eyebrow">Open Library / Works</p>
          <h1>{book.title}</h1>
          <p className="book-page__authors">{authorNames}</p>
          <p className="book-page__description">{formatDescription(book.description)}</p>

          <dl className="book-page__meta">
            <div>
              <dt>Éditeur</dt>
              <dd>{publisher}</dd>
            </div>
            <div>
              <dt>Première publication</dt>
              <dd>{formatDate(publicationDate)}</dd>
            </div>
            <div>
              <dt>Éditions</dt>
              <dd>{editions.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="book-page__section">
        <div className="book-page__section-head">
          <h2>Sujets et contexte</h2>
          <p>Informations Open Library sur ce document.</p>
        </div>

        {subjectList.length > 0 ? (
          <ul className="book-page__tags">
            {subjectList.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun sujet disponible.</p>
        )}

        {editionList.length > 0 && (
          <div className="book-page__editions">
            <h3>Quelques éditions</h3>
            <ul>
              {editionList.map((edition) => (
                <li key={edition.key || edition.title}>
                  <strong>{edition.title || 'Édition sans titre'}</strong>
                  <span>{edition.publish_date || 'Date inconnue'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="book-page__section book-page__wikipedia">
        <div className="book-page__section-head">
          <h2>Wikipedia</h2>
          <p>Description courte et lien de référence.</p>
        </div>

        {wikipediaLoading && <LoadingSpinner />}

        {!wikipediaLoading && wikipediaError && <ErrorMessage message={wikipediaError} />}

        {!wikipediaLoading && !wikipediaError && summary ? (
          <div className="book-page__wiki-card">
            {wikipediaImage && (
              <img
                className="book-page__wiki-image"
                src={wikipediaImage}
                alt={summary.title || book.title}
              />
            )}

            <div>
              <h3>{summary.title || book.title}</h3>
              <p>{summary.extract || 'Aucun résumé Wikipedia disponible.'}</p>
              {wikipediaLink && (
                <a href={wikipediaLink} target="_blank" rel="noreferrer">
                  Voir la page Wikipedia
                </a>
              )}
            </div>
          </div>
        ) : null}

        {!wikipediaLoading && !wikipediaError && !summary && (
          <p className="book-page__empty-state">Aucune information Wikipedia disponible pour ce livre.</p>
        )}
      </section>
    </article>
  )
}

export default BookPage

