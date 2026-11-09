import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
// eslint-disable-next-line no-unused-vars
import Searchbar from '../components/Searchbar.jsx'
// eslint-disable-next-line no-unused-vars
import AnimeCard from '../components/AnimeCard.jsx'
import { searchAnime } from '../services/animeApi.js'

function Search() {
  const [results, setResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(query) {
    if (!query) {
      setResults([])
      setRecommendations([])
      setError('')
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    setResults([])
    setRecommendations([])

    try {
      setResults(await searchAnime(query))
    } catch (searchError) {
      setResults([])
      setError(
        searchError instanceof Error
          ? `Could not search anime. ${searchError.message}`
          : 'Could not search anime right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <MUI.Container component="main" maxWidth="md" sx={{ py: 5 }}>
      <MUI.Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Search anime
      </MUI.Typography>
      <Searchbar onSearch={handleSearch} />

      {loading && (
        <MUI.CircularProgress aria-label="Searching anime" sx={{ mt: 3 }} />
      )}
      {error && (
        <MUI.Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </MUI.Alert>
      )}
      {!loading && hasSearched && !error && results.length === 0 && (
        <MUI.Typography sx={{ mt: 3 }}>
          No anime found. Try a different search.
        </MUI.Typography>
      )}

      {results.length > 0 && (
        <MUI.Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: recommendations.length > 0 ? 'minmax(0, 2fr) minmax(260px, 1fr)' : '1fr',
            },
            alignItems: 'start',
            gap: 3,
            mt: 3,
          }}
        >
          <MUI.Box>
            <MUI.Typography component="h2" variant="h5" sx={{ mb: 2 }}>
              Search results
            </MUI.Typography>
            <MUI.Box
              component="ul"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
            >
              {results.map((anime) => (
                <MUI.Box component="li" key={anime.mal_id}>
                  <AnimeCard
                    anime={anime}
                    onRecommendationsLoaded={(newRecommendations) => {
                      setRecommendations((current) => {
                        const seen = new Set(current.map(({ entry }) => entry.mal_id))
                        return [
                          ...current,
                          ...newRecommendations.filter(({ entry }) => {
                            if (seen.has(entry.mal_id)) return false
                            seen.add(entry.mal_id)
                            return true
                          }),
                        ]
                      })
                    }}
                  />
                </MUI.Box>
              ))}
            </MUI.Box>
          </MUI.Box>

          {recommendations.length > 0 && (
            <MUI.Box component="aside" aria-labelledby="recommendations-heading">
              <MUI.Typography
                id="recommendations-heading"
                component="h2"
                variant="h5"
                sx={{ mb: 2 }}
              >
                Recommendations
              </MUI.Typography>
              <MUI.Box
                component="ul"
                sx={{
                  display: 'grid',
                  gap: 2,
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
              >
                {recommendations.map(({ entry }) => (
                  <MUI.Box component="li" key={entry.mal_id}>
                    <AnimeCard anime={entry} />
                  </MUI.Box>
                ))}
              </MUI.Box>
            </MUI.Box>
          )}
        </MUI.Box>
      )}
    </MUI.Container>
  )
}

export default Search
