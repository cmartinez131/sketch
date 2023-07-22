import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JoinGameForm from '../components/JoinGameForm';
import '../styles.css'

const Join = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // for navigation

  //when a player joins
  //go to /game page
  const handleJoin = (event) => {
    event.preventDefault(); 
    onJoin({ name: username, avatar: '' }); //save username to the app
    navigate('/game');  //go to game screen
  };

  // update the username textfield as user is typing
  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div>
      {/* todo: put this in JoinGameForm component */}
      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleChange}
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
};

export default Join;