import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import { getAnimeRecommendations } from '../services/animeApi.js'

function AnimeCard({ anime, onRecommendationsLoaded }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const malId = anime.malId ?? anime.mal_id
    const myAnimeListUrl = malId == null
        ? ''
        : `https://myanimelist.net/anime/${encodeURIComponent(malId)}`
    const image =
        anime.imageUrl || anime.images?.jpg?.image_url || anime.images?.webp?.image_url
    const year = (() => {
        const candidates = [
            anime.year,
            anime.startDate,
            anime.aired?.prop?.from?.year,
            anime.aired?.from,
        ]

        for (const candidate of candidates) {
            if (candidate == null || candidate === '') continue

            const compactDate =
                typeof candidate === 'number' || typeof candidate === 'string'
                    ? String(candidate).match(/^(\d{4})\d{4}$/)
                    : null
            if (compactDate) {
                return Number(compactDate[1])
            }

            if (typeof candidate === 'number' && Number.isFinite(candidate)) {
                return candidate
            }

            if (typeof candidate === 'string') {
                const yearFromDate = candidate.match(/^(\d{4})(?:[-/]|$)/)
                if (yearFromDate) {
                    return Number(yearFromDate[1])
                }

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
                bgcolor: '#26090b',
                color: '#f3e5d4',
                border: '1px solid #5b1215',
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
                        bgcolor: '#3d1114',
                        color: '#d6bfa9',
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
                    sx={{ lineHeight: 1.3, color: '#f3e5d4' }}
                >
                    {title}
                </MUI.Typography>
                <MUI.Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: '#d6bfa9' }}
                >
                    {[year, type, episodeText].filter(Boolean).join(' · ') || ''}
                </MUI.Typography>
                <MUI.Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'flex-start' },
                        gap: 1,
                        mt: 1,
                    }}
                >
                    {myAnimeListUrl && (
                        <MUI.Button
                            size="small"
                            component="a"
                            href={myAnimeListUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#e6ac3d',
                                '&:hover': { bgcolor: 'rgba(234, 175, 65, 0.14)' },
                            }}
                        >
                            Show on MyAnimeList
                        </MUI.Button>
                    )}
                    {onRecommendationsLoaded && (
                        <MUI.Button
                            size="small"
                            onClick={handleRecommendations}
                            disabled={loading}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#e6ac3d',
                                '&:hover': { bgcolor: 'rgba(234, 175, 65, 0.14)' },
                            }}
                        >
                            {loading ? 'Loading…' : 'Get recommendations'}
                        </MUI.Button>
                    )}
                </MUI.Box>
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