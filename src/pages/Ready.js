import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import DrawingBoard from '../components/Drawingboard'
import '../styles.css';
import FreeDrawBoard from '../components/FreeDrawBoard';

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
    <div className='container'>
      <div className="left ready-list-container">
      <h1>Get Ready!</h1>
      <h2>Game will start when all players are ready.</h2>
      <PlayerList players={players} />
      <h3>Players in lobby:</h3>
        {players.map((player, index) => (
          <div key={index}>
            <span className="player-name">{player.username}</span> - {player.ready ? 'Player Ready ' : 'Player Not Ready '}
            {player.username === currentPlayer.name &&
              <button onClick={() => handleReady(player)} className='ready-button'>
                {player.ready ? 'Unready' : 'Get Ready'}
              </button>}
          </div>
        ))}
        {/* right now the button just lets join join the game that already started */}
        <button onClick={handleStartGame} className='start-game-button'>Start Game</button>
      </div>
      <div className="right free-draw-container">
        <h1>Free Draw!</h1>
        <FreeDrawBoard socket={socket} player={currentPlayer} />
      </div>
    </div>
  );
};

export default Ready;