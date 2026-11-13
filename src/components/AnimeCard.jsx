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
    const year = (() => {
        const candidates = [
            anime.year,
            anime.startDate.substring(0,4),
            anime.aired?.prop?.from?.year,
            anime.aired?.from,
        ]

        for (const candidate of candidates) {
            if (candidate == null || candidate === '') continue

            if (typeof candidate === 'number' && Number.isFinite(candidate)) {
                return candidate
            }

            if (typeof candidate === 'string') {
                const numericValue = Number(candidate)
                if (Number.isFinite(numericValue)) {
                    return numericValue
                }

                const parsedDate = new Date(candidate)
                if (!Number.isNaN(parsedDate.getTime())) {
                    return parsedDate.getFullYear()
                }
            }
        }

        return undefined
    })()
    const title =
        anime.title.length > 50 ? anime.title.slice(0, 47).trimEnd().concat(`...`) : anime.title
    const type = anime.type
    const episodeText = 
        anime.episodes == null ? "" : anime.episodes === 1 ? "1 episode" : anime.episodes + " episodes"

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
                bgcolor: '#102641',
                color: '#eaf3ff',
                border: '1px solid #244668',
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
                        bgcolor: '#153457',
                        color: '#b6c8de',
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
                    sx={{ lineHeight: 1.3, color: '#eaf3ff' }}
                >
                    {title}
                </MUI.Typography>
                <MUI.Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: '#b6c8de' }}
                >
                    {[year, type, episodeText].filter(Boolean).join(' · ') || ''}
                </MUI.Typography>
                {onRecommendationsLoaded && (
                    <MUI.Button
                        size="small"
                        onClick={handleRecommendations}
                        disabled={loading}
                        sx={{
                            mt: 1,
                            ml: -1,
                            color: '#93c5fd',
                            '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.16)' },
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