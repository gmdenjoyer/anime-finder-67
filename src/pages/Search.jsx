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
    const [recommendationPage, setRecommendationPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    async function handleSearch(query) {
        if (!query) {
            setResults([])
            setRecommendations([])
            setRecommendationPage(1)
            setError('')
            setHasSearched(false)
            return
        }

        setLoading(true)
        setError('')
        setHasSearched(true)
        setResults([])
        setRecommendations([])
        setRecommendationPage(1)

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

    const recommendationPageCount = Math.ceil(recommendations.length / 5)
    const visibleRecommendations = recommendations.slice(
        (recommendationPage - 1) * 5,
        recommendationPage * 5,
    )

    return (
        <MUI.Container component="main" maxWidth="xl" sx={{ py: 5 }}>
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
                            md: recommendations.length > 0
                                ? 'minmax(0, 2fr) 1px minmax(260px, 1fr)'
                                : '1fr',
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
                                <MUI.Box component="li" key={anime.malId ?? anime.mal_id}>
                                    <AnimeCard
                                        anime={anime}
                                        onRecommendationsLoaded={(newRecommendations) => {
                                            setRecommendationPage(1)
                                            setRecommendations((current) => {
                                                const getId = (item) => item.malId ?? item.mal_id
                                                const seen = new Set(current.map(getId))
                                                return [
                                                    ...current,
                                                    ...newRecommendations.filter((item) => {
                                                        const id = getId(item)
                                                        if (id == null || seen.has(id)) return false
                                                        seen.add(id)
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
                        <>
                            <MUI.Divider
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                    borderColor: '#5b1215',
                                    my: 1,
                                }}
                            />
                            <MUI.Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    display: { xs: 'none', md: 'block' },
                                    borderColor: '#5b1215',
                                    justifySelf: 'center',
                                }}
                            />
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
                                    {visibleRecommendations.map((anime) => (
                                        <MUI.Box component="li" key={anime.malId ?? anime.mal_id}>
                                            <AnimeCard anime={anime} />
                                        </MUI.Box>
                                    ))}
                                </MUI.Box>
                                {recommendationPageCount > 1 && (
                                    <MUI.Pagination
                                        count={recommendationPageCount}
                                        page={recommendationPage}
                                        onChange={(_, page) => setRecommendationPage(page)}
                                        aria-label="Recommendations pages"
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            '& .MuiPaginationItem-root': {
                                                color: '#f3e5d4',
                                                bgcolor: '#3d1114',
                                                border: '1px solid #70040c',
                                                '&:hover': { bgcolor: '#5b1215' },
                                                '&.Mui-selected': {
                                                    color: '#170203',
                                                    bgcolor: '#e6ac3d',
                                                    borderColor: '#e6ac3d',
                                                    '&:hover': { bgcolor: '#e4a039' },
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#8e6e62',
                                                    borderColor: '#5b1215',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </MUI.Box>
                        </>
                    )}
                </MUI.Box>
            )}
        </MUI.Container>
    )
}

export default Search
