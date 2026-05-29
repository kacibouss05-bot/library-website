import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Navbar.css'

function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim() === '') return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="L'Antre du Savoir" />
        <div className="navbar-logo-text">
          <span className="navbar-logo-title">L'Antre</span>
          <span className="navbar-logo-subtitle">du Savoir</span>
        </div>
      </Link>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Accueil</Link>
        <Link to="/search" className="navbar-link">Recherche avancée</Link>
        <Link to="/nouveautes" className="navbar-link">Nouveautés</Link>
        <Link to="/apropos" className="navbar-link">À propos</Link>
      </div>
    </nav>
  )
}

export default Navbar