import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    <nav>
      <Link to="/"> LibraryApp</Link>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      <Link to="/search">Recherche avancée</Link>
    </nav>
  )
}

export default Navbar