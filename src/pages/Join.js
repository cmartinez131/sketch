import { useNavigate } from 'react-router-dom';
import JoinGameForm from '../components/JoinGameForm';
import '../styles.css'

const Join = ({ onJoin }) => {
  
  const navigate = useNavigate(); // for navigation with react router
  const handleJoin = (event) => {
    //onJoin is passed as a prop from the app.js component
    //will pass the username up to the app component to save across app
    onJoin(event);
    navigate('/game');  //go to game screen
  };

  return (
    <div>
      <JoinGameForm onJoin={handleJoin} />
      <h1>Below is where the instructions will go</h1>
      <p>instructions</p>
    </div>
  );
};

export default Join;