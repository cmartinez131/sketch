import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import '../styles.css';

const Ready = ({ currentPlayer, players, setPlayers, socket }) => {

  const handleStartGame = () => {
    if (socket) {
      //need send some event to the server to let it know that all players are ready and start the game if all players are ready
      socket.emit('start-game');  //right now, server doesn't do anything with this message
    }
    navigate('/game');  //go to the game screen
  }

  const navigate = useNavigate();

  //this part not working
  const handleReady = (playerToToggle) => {
    // create a new array of players with same players but the specific player's ready status is toggled
    const updatedPlayers = players.map(player => 
      player.username === playerToToggle.username 
      ? { ...player, ready: !player.ready } 
      : player
    );
  
    // update local state of players
    setPlayers(updatedPlayers);
  
    // send just the toggled player's data to the server
    const updatedPlayer = updatedPlayers.find(p => p.username === playerToToggle.username);
    socket.emit('toggle-ready', updatedPlayer);//toggle ready of the player on the server to update for all clients
      //need to create event listener on client and server for 'toggle-ready' of 'update-players'
  };
  return (
    <div>
      <h1>Get Ready!</h1>
      <PlayerList players={players} />
      {players.map((player, index) => (
        <div key={index}>
          {player.username} - {player.ready ? 'Player Ready ' : 'Player Not Ready '}
          {player.username === currentPlayer.name &&
            <button onClick={() => handleReady(player)}>
              {player.ready ? 'Unready' : 'Get Ready'}
            </button>}
        </div>
      ))}
      {/* right now the button just lets join join the game that already started */}
      <button onClick={handleStartGame} className='startGameButton'>Start Game</button>
    </div>
  );
};

export default Ready;