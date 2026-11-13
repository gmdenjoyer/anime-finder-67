import { useCallback, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import copy from 'copy-to-clipboard'
import { getRandomAnime } from '../services/animeApi.js'

function RandomAnime() {
    const [anime, setAnime] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copyMessage, setCopyMessage] = useState('')
    const copyMessageTimeout = useRef(null)

    useEffect(() => () => clearTimeout(copyMessageTimeout.current), [])

    const loadRandomAnime = useCallback(async () => {
        setLoading(true)
        setError('')
        setCopyMessage('')

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

    function showCopyMessage(message) {
        clearTimeout(copyMessageTimeout.current)
        setCopyMessage(message)
        copyMessageTimeout.current = setTimeout(() => {
            setCopyMessage('')
            copyMessageTimeout.current = null
        }, 2000)
    }

    const image =
        anime?.images?.jpg?.large_image_url ||
        anime?.images?.jpg?.image_url ||
        anime?.imageUrl ||
        anime?.images?.webp?.large_image_url ||
        anime?.images?.webp?.image_url ||
        ''
    const myAnimeListId = anime?.mal_id ?? anime?.malId
    const myAnimeListUrl = myAnimeListId == null
        ? ''
        : `https://myanimelist.net/anime/${encodeURIComponent(myAnimeListId)}`

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

    function handleCopyTitle() {
        try {
            const copied = copy(title)
            showCopyMessage(copied ? 'Title copied to clipboard.' : 'Could not copy title to clipboard.')
        } catch {
            showCopyMessage('Could not copy title to clipboard.')
        }
    }

    return (
        <MUI.Container component="main" maxWidth="lg" sx={{ py: 5 }}>
            <MUI.Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <MUI.Button
                    variant="contained"
                    onClick={loadRandomAnime}
                    disabled={loading}
                    sx={{
                        bgcolor: '#e6ac3d',
                        color: '#170203',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#e4a039' },
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
                        bgcolor: '#26090b',
                        color: '#f3e5d4',
                        border: '1px solid #5b1215',
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
                                    bgcolor: '#3d1114',
                                    borderRadius: 2,
                                    color: '#d6bfa9',
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
                                <MUI.Typography variant="h6" sx={{ color: '#d6bfa9', mb: 2 }}>
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
                                            bgcolor: '#3d1114',
                                            color: '#f3e5d4',
                                            border: '1px solid #70040c',
                                        }}
                                    />
                                ))}
                            </MUI.Box>

                            {myAnimeListUrl && (
                                <MUI.Button
                                    component="a"
                                    href={myAnimeListUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        mb: 2,
                                        color: '#e6ac3d',
                                        borderColor: '#e6ac3d',
                                        '&:hover': {
                                            borderColor: '#e4a039',
                                            bgcolor: 'rgba(234, 175, 65, 0.14)',
                                        },
                                    }}
                                    variant="outlined"
                                >
                                    Show on MyAnimeList
                                </MUI.Button>
                            )}
                            <MUI.Button
                                onClick={handleCopyTitle}
                                sx={{
                                    mb: 2,
                                    ml: { xs: 0, sm: 1 },
                                    color: '#e6ac3d',
                                    border: '1px solid #e6ac3d',
                                    '&:hover': {
                                        borderColor: '#e4a039',
                                        bgcolor: 'rgba(234, 175, 65, 0.14)',
                                    },
                                }}
                                variant="outlined"
                            >
                                Copy title
                            </MUI.Button>
                            {copyMessage && (
                                <MUI.Typography role="status" variant="caption" sx={{ display: 'block', mb: 1 }}>
                                    {copyMessage}
                                </MUI.Typography>
                            )}

                            <MUI.Typography variant="body1" sx={{ color: '#ead8c2', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#e6ac3d' }}>
                                    Score:
                                </MUI.Box>{' '}
                                {score}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#ead8c2', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#e6ac3d' }}>
                                    Genres:
                                </MUI.Box>{' '}
                                {genres}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#ead8c2', mb: 2 }}>
                                <MUI.Box component="span" sx={{ fontWeight: 700, color: '#e6ac3d' }}>
                                    Studio:
                                </MUI.Box>{' '}
                                {studios}
                            </MUI.Typography>

                            <MUI.Typography variant="body1" sx={{ color: '#f3e5d4', lineHeight: 1.8 }}>
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
