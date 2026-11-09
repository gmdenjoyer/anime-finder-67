import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import { getAnimeRecommendations } from '../services/animeApi.js'

function AnimeCard({ anime, onRecommendationsLoaded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const malId = anime.malId ?? anime.mal_id
  const image =
    anime.imageUrl || anime.images?.jpg?.image_url || anime.images?.webp?.image_url
  const year =
    anime.year ||
    (anime.startDate ? new Date(anime.startDate).getFullYear() : undefined) ||
    anime.aired?.prop?.from?.year

  async function handleRecommendations() {
    if (malId == null) {
      setError('Cannot load recommendations: anime ID is missing.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const recommendations = await getAnimeRecommendations(malId)
      onRecommendationsLoaded(recommendations)
    } catch {
      setError('Could not load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MUI.Card
      sx={{
        display: 'flex',
        height: '100%',
        bgcolor: '#211d2b',
        color: '#f3f4f6',
        border: '1px solid #393344',
      }}
    >
      {image ? (
        <MUI.CardMedia
          component="img"
          image={image}
          alt={`${anime.title} cover`}
          sx={{ width: 100, flexShrink: 0, objectFit: 'cover' }}
        />
      ) : (
        <MUI.Box
          role="img"
          aria-label={`No cover available for ${anime.title}`}
          sx={{
            width: 100,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#292631',
            color: '#c4bfcc',
            typography: 'caption',
            textAlign: 'center',
            p: 1,
          }}
        >
          No image
        </MUI.Box>
      )}
      <MUI.CardContent sx={{ minWidth: 0, flexGrow: 1 }}>
        <MUI.Typography
          variant="h6"
          component="h3"
          sx={{ lineHeight: 1.3, color: '#f3f4f6' }}
        >
          {anime.title}
        </MUI.Typography>
        <MUI.Typography
          variant="body2"
          sx={{ mt: 0.5, color: '#c4bfcc' }}
        >
          {[year, anime.type].filter(Boolean).join(' · ') || 'Year and type unavailable'}
        </MUI.Typography>
        {onRecommendationsLoaded && (
          <MUI.Button
            size="small"
            onClick={handleRecommendations}
            disabled={loading}
            sx={{
              mt: 1,
              ml: -1,
              color: '#d8a8ff',
              '&:hover': { bgcolor: 'rgba(216, 168, 255, 0.12)' },
            }}
          >
            {loading ? 'Loading…' : 'Get recommendations'}
          </MUI.Button>
        )}
        {error && (
          <MUI.Alert severity="error" sx={{ mt: 1, py: 0 }}>
            {error}
          </MUI.Alert>
        )}
      </MUI.CardContent>
    </MUI.Card>
  )
}

export default AnimeCard