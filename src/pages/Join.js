import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JoinGameForm from '../components/JoinGameForm';

const Join = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // for navigation


  //when a player joins
  //go to /game page
  const handleJoin = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page on submit
    //right now it just brings you to the game page
    navigate('/game');
  };


  // update the username textfield as user is typing
  const handleChange = (event) => {
    setUsername(event.target.value);
  };




  return (
    <div>
      <h1>Join Game Page</h1>
      <p>this is where the user picks their name, avatar, and join game button</p>
      <p>the join form should go here</p>

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