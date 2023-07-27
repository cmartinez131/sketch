import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
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
  const [messages, setMessages] = useState([]); // State to hold sent and received messages

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('chat-message', data => {
      setMessages(oldMessages => [...oldMessages, data]);
      console.log(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = message => {
    if (socket) {
      socket.emit('chat-message', message);
    }
  }

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
          <Route path="/game" element={<Game player={player} players={players} socket={socket} messages={messages} sendMessage={sendMessage} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
