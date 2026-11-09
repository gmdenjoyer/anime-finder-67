// Core no-unused-vars doesn't detect component references in JSX.
// eslint-disable-next-line no-unused-vars
import * as Router from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <Router.BrowserRouter>
      <Navbar />
    </Router.BrowserRouter>
  )
}

export default App
