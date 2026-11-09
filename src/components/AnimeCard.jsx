import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import { getAnimeRecommendations } from '../services/animeApi.js'

function AnimeCard({ anime, onRecommendationsLoaded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const image = anime.images?.jpg?.image_url || anime.images?.webp?.image_url
  const year = anime.year || anime.aired?.prop?.from?.year

  async function handleRecommendations() {
    setLoading(true)
    setError('')

    try {
      const recommendations = await getAnimeRecommendations(anime.mal_id)
      onRecommendationsLoaded(recommendations)
    } catch {
      setError('Could not load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MUI.Card sx={{ display: 'flex', height: '100%' }}>
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
            bgcolor: 'action.hover',
            color: 'text.secondary',
            typography: 'caption',
            textAlign: 'center',
            p: 1,
          }}
        >
          No image
        </MUI.Box>
      )}
      <MUI.CardContent sx={{ minWidth: 0, flexGrow: 1 }}>
        <MUI.Typography variant="h6" component="h3" sx={{ lineHeight: 1.3 }}>
          {anime.title}
        </MUI.Typography>
        <MUI.Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {[year, anime.type].filter(Boolean).join(' · ') || 'Year and type unavailable'}
        </MUI.Typography>
        {onRecommendationsLoaded && (
          <MUI.Button
            size="small"
            onClick={handleRecommendations}
            disabled={loading}
            sx={{ mt: 1, ml: -1 }}
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