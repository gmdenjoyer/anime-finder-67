import { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import { getRandomAnime } from '../services/animeApi.js'

function RandomAnime() {
    const [anime, setAnime] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadRandomAnime = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const randomAnime = await getRandomAnime()
            setAnime(randomAnime)
        } catch (requestError) {
            setAnime(null)
            setError(
                requestError instanceof Error
                    ? `Could not load random anime. ${requestError.message}`
                    : 'Could not load random anime. Please try again.',
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadRandomAnime()
    }, [loadRandomAnime])

    const image =
        anime?.images?.jpg?.large_image_url ||
        anime?.images?.jpg?.image_url ||
        anime?.imageUrl ||
        anime?.images?.webp?.large_image_url ||
        anime?.images?.webp?.image_url ||
        ''

    const genres = (anime?.genres ?? []).map((genre) => genre.name).join(', ') || 'N/A'
    const studios = (anime?.studios ?? []).map((studio) => studio.name).join(', ') || 'N/A'
    const title = anime?.title_english || anime?.title || 'Unknown anime'
    const score = anime?.score ?? 'N/A'
    const year = (() => {
        const candidates = [
            anime?.year,
            anime?.startDate,
            anime?.aired?.prop?.from?.year,
            anime?.aired?.from,
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

        return 'N/A'
    })()
    const episodes = anime?.episodes ?? 'N/A'
    const status = anime?.status || 'N/A'
    const synopsis = anime?.synopsis || 'No synopsis available.'

    return (
        <MUI.Container component="main" maxWidth="lg" sx={{ py: 5 }}>
            <MUI.Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 3,
                }}
            >
                <MUI.Typography component="h1" variant="h4">
                    Random anime
                </MUI.Typography>
                <MUI.Button
                    variant="contained"
                    onClick={loadRandomAnime}
                    disabled={loading}
                    sx={{
                        bgcolor: '#d8a8ff',
                        color: '#17131f',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#c084fc' },
                    }}
                >
                    {loading ? 'Loading…' : 'Surprise me'}
                </MUI.Button>
            </MUI.Box>

            {loading && (
                <MUI.Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <MUI.CircularProgress aria-label="Loading random anime" />
                </MUI.Box>
            )}

            {error && (
                <MUI.Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </MUI.Alert>
            )}

            {!loading && !error && anime && (
                <MUI.Card
                    sx={{
                        bgcolor: '#211d2b',
                        color: '#f3f4f6',
                        border: '1px solid #393344',
                        overflow: 'hidden',
                    }}
                >
                    <MUI.Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'center', md: 'flex-start' },
                            gap: 3,
                            p: { xs: 2, md: 4 },
                        }}
                    >
                        {image ? (
                            <MUI.CardMedia
                                component="img"
                                image={image}
                                alt={`${title} cover`}
                                sx={{
                                    width: { xs: '100%', md: 260 },
                                    height: { xs: 360, md: 420 },
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    flexShrink: 0,
                                }}
                            />
                        ) : (
                            <MUI.Box
                                sx={{
                                    width: { xs: '100%', md: 260 },
                                    height: { xs: 360, md: 420 },
                                    display: 'grid',
                                    placeItems: 'center',
                                    bgcolor: '#292631',
                                    borderRadius: 2,
                                    color: '#c4bfcc',
                                    typography: 'caption',
                                    textAlign: 'center',
                                    p: 2,
                                }}
                            >
                                No image available
                            </MUI.Box>
                        )}

                        <MUI.Box sx={{ flex: 1, width: '100%' }}>
                            <MUI.Typography
                                component="h2"
                                variant="h3"
                                sx={{ mb: 1, fontWeight: 700, lineHeight: 1.2 }}
                            >
                                {title}
                            </MUI.Typography>

                            {anime.title && anime.title !== title && (
                                <MUI.Typography variant="h6" sx={{ color: '#c4bfcc', mb: 2 }}>
                                    {anime.title}
                                </MUI.Typography>
                            )}

                            <MUI.Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {[
                                    anime?.type,
                                    year,
                                    `${episodes} eps`,
                                    status,
                                ].filter(Boolean).map((item) => (
                                    <MUI.Chip
                                        key={item}
                                        label={item}
                                        sx={{
                                            bgcolor: '#292631',
                                            color: '#f3f4f6',
                                            border: '1px solid #51495e',
                                        }}
                                    />
                                ))}
                            </MUI.Box>

                            <MUI.Typography variant="body1" sx={{ color: '#d4d1d9', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#d8a8ff' }}>
                                    Score:
                                </MUI.Box>{' '}
                                {score}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#d4d1d9', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#d8a8ff' }}>
                                    Genres:
                                </MUI.Box>{' '}
                                {genres}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#d4d1d9', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#d8a8ff' }}>
                                    Studio:
                                </MUI.Box>{' '}
                                {studios}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#f3f4f6', lineHeight: 1.8 }}>
                                {synopsis}
                            </MUI.Typography>
                        </MUI.Box>
                    </MUI.Box>
                </MUI.Card>
            )}

            {!loading && !error && !anime && (
                <MUI.Typography>No anime was found. Try again.</MUI.Typography>
            )}
        </MUI.Container>
    )
}

export default RandomAnime
