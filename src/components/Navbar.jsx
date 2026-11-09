// MUI is referenced through JSX member names, which core no-unused-vars doesn't detect.
// eslint-disable-next-line no-unused-vars
import * as MUI from '@mui/material'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Airing now', to: '/airingnow' },
  { label: 'Search', to: '/search' },
  { label: 'Random', to: '/random' },
]

function Navbar() {
  return (
    <MUI.AppBar position="static" elevation={0} sx={{ bgcolor: '#17131f' }}>
      <MUI.Toolbar
        component="nav"
        aria-label="Main navigation"
        sx={{
          maxWidth: 1126,
          width: '100%',
          minHeight: 96,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          boxSizing: 'border-box',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <MUI.Typography
          sx={{
            color: 'common.white',
            fontSize: '1.2rem',
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Anime Finder
        </MUI.Typography>

        <MUI.Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {navigationItems.map(({ label, to }) => (
            <MUI.Button
              key={to}
              component={NavLink}
              to={to}
              end={to === '/'}
              sx={{
                minWidth: 'auto',
                px: { xs: 1, sm: 1.5 },
                color: 'rgba(255, 255, 255, 0.78)',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  color: 'common.white',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.active': {
                  color: '#d8a8ff',
                  bgcolor: 'rgba(216, 168, 255, 0.12)',
                },
              }}
            >
              {label}
            </MUI.Button>
          ))}
        </MUI.Box>
      </MUI.Toolbar>
    </MUI.AppBar>
  )
}

export default Navbar
