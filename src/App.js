
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import Join from './pages/Join';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([
    { username: 'player1', score: 5 },
    { username: 'player2', score: 6 }
  ]);

  const handleJoin = (player) => {
    setPlayer(player);
    setPlayers(players => [...players, { username: player.name, score: 0 }])
  }

  return (
    <>
      <Router>
        <Navbar />
        {/* first loads the join page and then goes to the game page once joined */}
        <Routes>
          <Route path="/" element={<Join onJoin={handleJoin} />} />
          <Route path="/game" element={<Game player={player} players={players} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
