const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1'

function normalizeTitle(title) {
  return String(title || '')
    .trim()
    .replace(/\s+/g, '_')
}

export function buildWikipediaSummaryUrl(title) {
  const normalizedTitle = normalizeTitle(title)

  if (!normalizedTitle) {
    throw new Error('Titre Wikipedia invalide')
  }

  return `${WIKIPEDIA_BASE_URL}/page/summary/${encodeURIComponent(normalizedTitle)}`
}

export async function getWikipediaSummary(title) {
  const response = await fetch(buildWikipediaSummaryUrl(title), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de Wikipedia')
  }

  return response.json()
}

