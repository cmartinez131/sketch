import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingBoard from '../components/Drawingboard'
import Guess from '../components/Guess'
import PlayerList from '../components/PlayerList';
import '../styles.css'

const Game = ({ player, players, messages, sendMessage, words }) => {

  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState('')

  useEffect(() => {
    if (!player) {
      navigate('/');
    }
  }, [player, navigate]);

  useEffect(() => {
    const length = words[0].words.length
    const randomIndex = Math.floor(Math.random() * length)
    setCurrentWord(words[0].words[randomIndex])
  }, [])

  return (
    <div className='container'>
      <div className='left'>
        <PlayerList players={players} />
      </div>
      <div className='middle'>
        <h2 className='currentWord'>{currentWord}</h2>
        <DrawingBoard />
      </div>
      <div className='right'>
        <Guess player={player} messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Game;
