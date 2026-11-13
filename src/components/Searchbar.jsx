import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'

export default function Searchbar({ onSearch }) {
    const [query, setQuery] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        onSearch?.(query.trim())
    }

    return (
        <MUI.Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                gap: 1,
                width: '100%',
                maxWidth: 640,
                alignItems: 'flex-start',
            }}
        >
            <MUI.TextField
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search anime"
                inputProps={{ 'aria-label': 'Search anime' }}
                size="small"
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-root': {
                        color: '#f3e5d4',
                        bgcolor: '#26090b',
                        '& fieldset': { borderColor: '#70040c' },
                        '&:hover fieldset': { borderColor: '#e6ac3d' },
                        '&.Mui-focused fieldset': { borderColor: '#e6ac3d' },
                    },
                    '& input::placeholder': {
                        color: '#d6bfa9',
                        opacity: 1,
                    },
                }}
            />
            <MUI.Button type="submit" variant="contained" sx={{ minHeight: 40 }}>
                Search
            </MUI.Button>
        </MUI.Box>
    )
}
