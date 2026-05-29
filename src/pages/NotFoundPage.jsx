import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Oups ! Cette page n'existe pas.</p>
      <button onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </div>
  )
}

export default NotFoundPage