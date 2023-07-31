import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingBoard from '../components/Drawingboard'
import Guess from '../components/Guess'
import PlayerList from '../components/PlayerList';
import Timer from '../components/Timer';
import '../styles.css'

const Game = ({ player, players, socket, messages, sendMessage, word }) => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate('/');
    }
  }, [player, navigate]);

  return (
    <div className='container'>
      <div className='left'>
        <PlayerList players={players} />
      </div>
      <div className='middle'>
        <Timer socket={socket} />
        <h2 className='currentWord'>{word}</h2>
        <DrawingBoard socket={socket} />
      </div>
      <div className='right'>
        <Guess player={player} messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Game;
