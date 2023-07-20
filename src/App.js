import React, { useState } from 'react';
import DrawingBoard from './components/Drawingboard';
import Guess from './components/Guess';
import PlayerList from './components/PlayerList';
import JoinGameForm from './components/JoinGameForm';

const App = () => {
  const [player,setPlayer]=useState(null);
  const [guesses, setGuesses] = useState([]);
  const [players, setPlayers] = useState([
    { username: 'player1', score: 5 },
    { username: 'player2', score: 6 }
  ]);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [newGuess, setNewGuess] = useState('');

  const handleJoin=(player)=>{
    setPlayer(player);
    setPlayers(players=>[...players,{username:player.name, score:0}])
  }
  const handleGuessChange = (event) => {
    setNewGuess(event.target.value);
  };

  const addGuess = (event) => {
    event.preventDefault() // Prevent form from refreshing the page on submit
    setGuesses(guesses.concat(newGuess))
    setNewGuess('') // Clear the input box
    setTotalGuesses(totalGuesses + 1)
  }

  return (
    <div className="container">
      {/* Show the join game form if the player hasn't joined yet */}
      {!player && <JoinGameForm onJoin={handleJoin} />}

      {/* Show the game if the player has joined */}
      {player && (
        <>
          <div className="left">
            <PlayerList players={players} />
          </div>
          <div className="middle">
            <DrawingBoard />
          </div>
          <div className="right">
            <div className="chat-log">
              <h2>Guesses:</h2>
              <ul>
                {guesses.map((guess, index) => (
                  <Guess key={index} player={guess.player} guess={guess.guess} />
                ))}
              </ul>
              <p>Total guesses: {totalGuesses}</p>
            </div>
            <div className="chat-box">
              <form onSubmit={addGuess}>
                <input
                  type="text"
                  value={newGuess}
                  onChange={handleGuessChange}
                />
                <button type="submit">Guess</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
