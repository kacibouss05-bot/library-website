import useRecentChanges from '../hooks/useRecentChanges'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const { changes, loading, error } = useRecentChanges()
  const navigate = useNavigate()

  function handleClick(change) {
    const id = change.key?.split('/').pop()
    if (id) navigate(`/book/${id}`)
  }

  return (
    <div className="home-page">
      <section className="hero">
        <h1>L'Antre du Savoir</h1>
        <p>Explorez des millions de livres en accès libre</p>
      </section>

      <section className="recent-changes">
        <h2>Dernières modifications</h2>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && changes.length === 0 && (
          <p>Aucune modification récente</p>
        )}

        <div className="cards-grid">
          {changes.map((change, index) => (
            <div
              key={index}
              className="change-card"
              onClick={() => handleClick(change)}
            >
              <h3>{change.title || 'Sans titre'}</h3>
              <p>Type : {change.kind || 'inconnu'}</p>
              <p>
                Date :{' '}
                {change.timestamp
                  ? new Date(change.timestamp).toLocaleDateString('fr-FR')
                  : 'inconnue'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage