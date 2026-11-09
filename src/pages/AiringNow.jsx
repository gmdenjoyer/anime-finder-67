import { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
// eslint-disable-next-line no-unused-vars
import AnimeCard from '../components/AnimeCard.jsx'
import { getSeasonNow } from '../services/animeApi.js'

function AiringNow() {
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadAnime() {
      try {
        const seasonAnime = await getSeasonNow()
        if (active) setAnime(seasonAnime)
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? `Could not load anime airing now. ${requestError.message}`
              : 'Could not load anime airing now. Please try again.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAnime()
    return () => {
      active = false
    }
  }, [])

  return (
    <MUI.Container component="main" maxWidth="lg" sx={{ py: 5 }}>
      <MUI.Typography component="h1" variant="h4" sx={{ mb: 3 }}>
        Airing now
      </MUI.Typography>

      {loading && (
        <MUI.Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <MUI.CircularProgress aria-label="Loading anime airing now" />
        </MUI.Box>
      )}
      {error && <MUI.Alert severity="error">{error}</MUI.Alert>}
      {!loading && !error && anime.length === 0 && (
        <MUI.Typography>No anime currently airing was found.</MUI.Typography>
      )}

      {!loading && anime.length > 0 && (
        <MUI.Box
          component="ul"
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
            listStyle: 'none',
            p: 0,
            m: 0,
          }}
        >
          {anime.map((item) => (
            <MUI.Box component="li" key={item.mal_id}>
              <AnimeCard anime={item} />
            </MUI.Box>
          ))}
        </MUI.Box>
      )}
    </MUI.Container>
  )
}

export default AiringNow