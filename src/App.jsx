// Core no-unused-vars doesn't detect component references in JSX.
// eslint-disable-next-line no-unused-vars
import * as Router from 'react-router-dom'
import * as MUI from '@mui/material'
// eslint-disable-next-line no-unused-vars
import Navbar from './components/Navbar.jsx'
// eslint-disable-next-line no-unused-vars
import Search from './pages/Search.jsx'
// eslint-disable-next-line no-unused-vars
import AiringNow from './pages/AiringNow.jsx'
// eslint-disable-next-line no-unused-vars
import RandomAnime from './pages/RandomAnime.jsx'

const theme = MUI.createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#e6ac3d', contrastText: '#170203' },
        secondary: { main: '#b9101e' },
        background: { default: '#100100', paper: '#26090b' },
        text: { primary: '#f3e5d4', secondary: '#d6bfa9' },
    },
})

// eslint-disable-next-line no-unused-vars
function HomePage() {
    return (
        <MUI.Container
            component="main"
            maxWidth="md"
            sx={{ py: { xs: 6, sm: 10 }, textAlign: 'center' }}
        >
            <MUI.Typography
                component="h1"
                variant="h3"
                sx={{ mb: 2, fontWeight: 700 }}
            >
                Welcome to Anime Finder
            </MUI.Typography>
            <MUI.Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 680, mx: 'auto', lineHeight: 1.7 }}
            >
                Discover anime that suits you. Browse what is airing now, search for a
                series, or find something unexpected with a random recommendation.
            </MUI.Typography>
        </MUI.Container>
    )
}

function App() {
    return (
        <MUI.ThemeProvider theme={theme}>
            <MUI.CssBaseline />
            <Router.BrowserRouter basename={import.meta.env.BASE_URL}>
                <Navbar />
                <Router.Routes>
                    <Router.Route path="/" element={<HomePage />} />
                    <Router.Route path="/airingnow" element={<AiringNow />} />
                    <Router.Route path="/search" element={<Search />} />
                    <Router.Route path="/random" element={<RandomAnime />} />
                </Router.Routes>
            </Router.BrowserRouter>
        </MUI.ThemeProvider>
    )
}

export default App
