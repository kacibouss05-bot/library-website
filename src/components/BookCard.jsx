import { useNavigate } from 'react-router-dom'
import './BookCard.css'

function BookCard({ book }) {
  const navigate = useNavigate()

  const id = book.key?.split('/').pop()
  const title = book.title || 'Titre inconnu'
  const author = book.author_name?.[0] || 'Auteur inconnu'
  const year = book.first_publish_year || 'Date inconnue'
  const coverId = book.cover_i

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null

  function handleClick() {
    if (id) navigate(`/book/${id}`)
  }

  return (
    <div className="book-card" onClick={handleClick}>
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="book-card-cover" />
      ) : (
        <div className="book-card-no-cover">
          <span>📚</span>
        </div>
      )}
      <div className="book-card-info">
        <h3>{title}</h3>
        <p>{author}</p>
        <p>{year}</p>
      </div>
    </div>
  )
}

export default BookCard