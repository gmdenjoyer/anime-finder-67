import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
// eslint-disable-next-line no-unused-vars
import AnimeCard from '../components/AnimeCard.jsx'
import { getSeasonNow } from '../services/animeApi.js'

const PAGE_SIZE = 12

function AiringNow() {
    const [anime, setAnime] = useState([])
    const [visibleAnime, setVisibleAnime] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        let active = true

        async function loadAnime() {
            try {
                const seasonAnime = await getSeasonNow()
                if (!active) return

                const sortedAnime = [...seasonAnime].sort((a, b) => {
                    const scoreA = Number(a.score)
                    const scoreB = Number(b.score)
                    const hasScoreA = a.score != null && a.score !== '' && Number.isFinite(scoreA)
                    const hasScoreB = b.score != null && b.score !== '' && Number.isFinite(scoreB)

                    if (!hasScoreA) return hasScoreB ? 1 : 0
                    if (!hasScoreB) return -1
                    return scoreB - scoreA
                })

                setAnime(sortedAnime)
                setVisibleAnime(sortedAnime.slice(0, PAGE_SIZE))
                setHasMore(sortedAnime.length > PAGE_SIZE)
            } catch (requestError) {
                if (!active) return

                setError(
                    requestError instanceof Error
                        ? `Could not load anime airing now. ${requestError.message}`
                        : 'Could not load anime airing now. Please try again.',
                )
            } finally {
                if (active) setLoading(false)
            }
        }

        loadAnime()
        return () => {
            active = false
        }
    }, [])

    function fetchMoreAnime() {
        if (anime.length === 0) return

        const nextVisibleCount = Math.min(visibleAnime.length + PAGE_SIZE, anime.length)
        const nextVisibleAnime = anime.slice(0, nextVisibleCount)

        setVisibleAnime(nextVisibleAnime)
        setHasMore(nextVisibleCount < anime.length)
    }

    return (
        <MUI.Container component="main" maxWidth="lg" sx={{ py: 5 }}>
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
                <>
                    <MUI.Typography sx={{ mb: 2, color: '#d6bfa9' }}>
                        Anime airing now, ordered by rating from highest to lowest. Titles without a rating appear last.
                    </MUI.Typography>
                    <InfiniteScroll
                        dataLength={visibleAnime.length}
                        next={fetchMoreAnime}
                        hasMore={hasMore}
                        loader={
                            <MUI.Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                <MUI.CircularProgress aria-label="Loading more anime" size={24} />
                            </MUI.Box>
                        }
                        endMessage={
                            <MUI.Typography sx={{ textAlign: 'center', color: '#d6bfa9', py: 2 }}>
                                You’ve reached the end of the list.
                            </MUI.Typography>
                        }
                    >
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
                            {visibleAnime.map((item) => (
                                <MUI.Box component="li" key={item.malId ?? item.mal_id}>
                                    <AnimeCard anime={item} />
                                </MUI.Box>
                            ))}
                        </MUI.Box>
                    </InfiniteScroll>
                </>
            )}
        </MUI.Container>
    )
}

export default AiringNow