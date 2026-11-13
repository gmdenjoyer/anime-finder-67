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
        <MUI.AppBar position="static" elevation={0} sx={{ bgcolor: '#170203' }}>
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
                <MUI.Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'common.white',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <MUI.Box
                        component="img"
                        src={`${import.meta.env.BASE_URL}favicon.svg`}
                        alt=""
                        aria-hidden="true"
                        sx={{ width: 32, height: 32, objectFit: 'contain' }}
                    />
                    <MUI.Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                        Anime Finder
                    </MUI.Typography>
                </MUI.Box>

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
                                    color: '#e6ac3d',
                                    bgcolor: 'rgba(234, 175, 65, 0.14)',
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
