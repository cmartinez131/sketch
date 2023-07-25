import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingBoard from '../components/Drawingboard'
import Guess from '../components/Guess'
import PlayerList from '../components/PlayerList';
import '../styles.css'

const Game = ({ player, players, socket }) => {
  const [chat, setChat] = useState([]);
  const [newGuess, setNewGuess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate('/');
    }

    if (socket == null) return;

    // Listen for incoming messages
    socket.on('chat message', message => {
      console.log('Received message:', message); // Log the received message
      setChat(prevChat => [...prevChat, message]); // Add the new message to the chat state
    });

    return () => {
      socket.off('chat message');
    }
  }, [socket, player, navigate]);

  const handleGuessChange = (event) => {
    setNewGuess(event.target.value)
  }

  const addGuess = (event) => {
    event.preventDefault();
    if (newGuess.match(/^ *$/) === null) {
      const message = {user: player.name, text: newGuess};
      setChat([...chat, message]);
      if (socket != null) {
        socket.emit('chat message', message);
      }
    }
    setNewGuess('');
  }

  return (
    <div className='container'>
      <div className='left'>
        <PlayerList players={players} />
      </div>
      <div className='middle'>
        <DrawingBoard />
      </div>
      <div className='right'>
        <div className="chat-container">
          <div className="chat-log">
            <ul>
              {chat.map((message, i) =>
                <li key={i} style={{backgroundColor: i % 2 === 0 ? 'white' : 'lightblue'}}>
                  <b>{message.user}</b>: {message.text}
                </li>
              )}
            </ul>
          </div>
          <div className='chat-box'>
            <form onSubmit={addGuess}>
              <input
                type="text"
                value={newGuess}
                onChange={handleGuessChange}
                placeholder="Type your guess here..."
              />              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
