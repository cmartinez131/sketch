import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import DrawingBoard from '../components/Drawingboard'
import '../styles.css';
import FreeDrawBoard from '../components/FreeDrawBoard';

const Ready = ({ currentPlayer, players, setPlayers, socket }) => {

  const handleStartGameButton = () => {
    //need send some event to the server to let it know that all players are ready and start the game if all players are ready
    //over here check if all players are ready
    const atLeastTwoPlayers = players.length >= 2;
    const allPlayersReady = players.every(player => player.ready);

    if (atLeastTwoPlayers && allPlayersReady) {
      socket.emit('start-game');  //only emit the 'start-game' message if there are at least two players and all players are ready
    } else if (!atLeastTwoPlayers) {
      alert('You need at least two players to start the game. You can still free draw with other players.')
    } else {
      alert('All players must be ready to start the game. You can still free draw with other players.')
    }
  }

  //maybe if game has started, user sees a join button instead

  const navigate = useNavigate();

  const handleGameStarted = () => {
    navigate('/game');
  };


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

    // listen for the 'update-players' event from the server. it updates the players list when player clicks ready
    socket.on('update-players', updatedPlayers => {
      setPlayers(updatedPlayers);
    })
  };

  //call the handleGameStarted function when client recieves 'game-started' from server
  socket.on('game-started', handleGameStarted);

  return (
    <div className='container'>
      <div className="left ready-list-container">
        <h1>Get Ready!</h1>
        <h2>Press Start Game when all players are ready.</h2>
        <h3>Players in lobby:</h3>
        <div className="ready-players-container">
          {players.map((player, index) => (
            <div key={index} className="player-container">
              <span className="player-name">{player.username}{player.username === currentPlayer.name && " (you)"}</span>
              <span className='ready-status'>{player.ready ? "- Player Ready" : "- Player Not Ready"}</span>
              {player.username === currentPlayer.name ? (
                <button onClick={() => handleReady(player)} className='ready-button'>
                  {player.ready ? 'Unready' : 'Get Ready'}
                </button>
              ) : (
                <div className="fake-button-placeholder"></div>
              )}
            </div>
          ))}
        </div>
        {/* start game starts the game */}
        {/* maybe check if the game has started. if the game has started, make it a "join" button instead */}
        <button onClick={handleStartGameButton} className='start-game-button'>Start Game</button>
      </div>
      <div className="right free-draw-container">
        <h1>Free Draw!</h1>
        <FreeDrawBoard socket={socket} player={currentPlayer} />
      </div>
    </div>
  );
};

export default Ready;