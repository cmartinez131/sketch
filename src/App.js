import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import Join from './pages/Join';


const App = () => {
  

  return (
    <>
      <Router>
        <Navbar />
        {/* starts at the join page and then goes to the game page */}
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/game" element={<Game />} />
        </Routes>
        
      </Router>
    </>
  )
}

export default App
