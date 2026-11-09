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
            color: '#f3f4f6',
            bgcolor: '#292631',
            '& fieldset': { borderColor: '#777184' },
            '&:hover fieldset': { borderColor: '#c084fc' },
            '&.Mui-focused fieldset': { borderColor: '#d8a8ff' },
          },
          '& input::placeholder': {
            color: '#c4bfcc',
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
