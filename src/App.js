import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import Join from './pages/Join';
import categoryService from './services/categories'
import userService from './services/users'

const ENDPOINT = 'http://localhost:3001';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([
    { username: 'player1', score: 5 },
    { username: 'player2', score: 6 }
  ]);
  const [socket, setSocket] = useState(null); // State to hold the socket
  const [messages, setMessages] = useState([]); // State to hold sent and received messages
  const [words, setWords] = useState([]); // State to hold the words
  const [word, setWord] = useState('');
  const [drawer, setDrawer] = useState('');

  useEffect(() => {
    categoryService
      .getAll()
      .then(response => {
        const newWords = response.data[0].words
        setWords(newWords);
      })
  }, [])

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // listen for the 'chat-message' event from the server. it appends the old message list with new message
    newSocket.on('chat-message', data => {
      setMessages(oldMessages => [...oldMessages, data]);
      console.log(data);
    });

    // listen for the 'update-players' event from the server. it updates the players list
    newSocket.on('update-players', updatedPlayers => {
      setPlayers(updatedPlayers);
    })

    newSocket.on('update-word', updatedWord => {
      setWord(updatedWord);
    })

    // cleanup function to disconnect the socket from the server when component unmounts
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
    const newPlayer = { username: player.name, score: 0, drawer: false, rank: 1 }
    setPlayers(players => [...players, newPlayer])  //add newplayer to players array
    socket.emit('player-joined', newPlayer)  //send 'player-joined' and the new player to the server
    socket.emit('words', words)
  }

  // Pass socket and players to the Game component
  return (
    <>
      <Router>
        <Navbar />
        {/* first loads the join page */}
        <Routes>
          <Route path="/" element={<Join onJoin={handleJoin} />} />
          <Route path="/game" element={<Game player={player} players={players} socket={socket} messages={messages} sendMessage={sendMessage} word={word}/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
