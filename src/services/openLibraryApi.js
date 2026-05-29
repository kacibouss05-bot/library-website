const BASE_URL = 'https://openlibrary.org'

export async function searchBooks(filters = {}, page = 1) {
  const params = new URLSearchParams()

  if (filters.q) params.append('q', filters.q)
  if (filters.author) params.append('author', filters.author)
  if (filters.subject) params.append('subject', filters.subject)
  if (filters.publisher) params.append('publisher', filters.publisher)
  if (filters.language) params.append('language', filters.language)
  if (filters.publish_year) params.append('publish_year', filters.publish_year)

  params.append('page', page)
  params.append('limit', 12)

  const response = await fetch(`${BASE_URL}/search.json?${params.toString()}`)

  if (!response.ok) throw new Error('Erreur lors de la recherche')

  const data = await response.json()
  return {
    books: data.docs,
    total: data.numFound,
    totalPages: Math.ceil(data.numFound / 12)
  }
}

export async function getRecentChanges() {
  const response = await fetch(`${BASE_URL}/recentchanges.json?limit=20`)

  if (!response.ok) throw new Error('Erreur lors de la récupération des changements récents')

  const data = await response.json()
  return data
}

export async function getBookById(id) {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error('ID invalide')
  }

  const response = await fetch(`${BASE_URL}/works/${id}.json`)

  if (response.status === 404) throw new Error('Livre introuvable')
  if (!response.ok) throw new Error('Erreur lors de la récupération du livre')

  const data = await response.json()
  return data
}

export async function getBookEditions(id) {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error('ID invalide')
  }

  const response = await fetch(`${BASE_URL}/works/${id}/editions.json`)

  if (!response.ok) throw new Error('Erreur lors de la récupération des éditions')

  const data = await response.json()
  return data.entries || []
}

export async function getAuthorById(authorId) {
  if (!authorId || typeof authorId !== 'string' || authorId.trim() === '') {
    throw new Error('ID auteur invalide')
  }

  const response = await fetch(`${BASE_URL}/authors/${authorId}.json`)

  if (!response.ok) throw new Error('Erreur lors de la récupération de l\'auteur')

  const data = await response.json()
  return data
}
export async function getWorkDetails(key) {
  if (!key || typeof key !== 'string') return null
  try {
    const response = await fetch(`${BASE_URL}${key}.json`)
    if (!response.ok) return null
    const data = await response.json()
    return data
  } catch {
    return null
  }
}