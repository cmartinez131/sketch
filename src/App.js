import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import Join from './pages/Join';
const ENDPOINT = 'http://localhost:3001';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([
    { username: 'player1', score: 5 },
    { username: 'player2', score: 6 }
  ]);
  const [socket, setSocket] = useState(null); // State to hold the socket

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);
    return () => newSocket.disconnect(); // Disconnect when unmounting
  }, []);

  const handleJoin = (player) => {
    setPlayer(player);
    setPlayers(players => [...players, { username: player.name, score: 0 }])
  }

  // Pass socket and players to the Game component
  return (
    <>
      <Router>
        <Navbar />
        {/* first loads the join page */}
        <Routes>
          <Route path="/" element={<Join onJoin={handleJoin} />} />
          <Route path="/game" element={<Game player={player} players={players} socket={socket} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
