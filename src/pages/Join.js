import { useNavigate } from 'react-router-dom'
import JoinGameForm from '../components/JoinGameForm'
import '../styles.css'

const Join = ({ onJoin, socket }) => {

	const navigate = useNavigate() // for navigation with react router
	const handleJoin = (event) => {
		//onJoin is passed as a prop from the app.js component
		//will pass the username up to the app component to save across app
		onJoin(event)

		socket.emit('check-game-status')
		socket.on('game-status-response', (hasStarted) => {
			if (hasStarted) {
				navigate('/game') //go straight to game screen ig game already started
			}
			else {
				navigate('/ready')  //go to waiting room screen
			}
		})
	}

	return (
		<div className="homePage">
			<h1>Sketch</h1>
			<JoinGameForm onJoin={handleJoin} />
			<ul>
				<li>When it's your turn, choose a word you want to draw!</li>
				<li>Try to draw your chosen word! No spelling!</li>
				<li>Let other players try to guess your drawn word!</li>
				<li>When it's not your turn, try to guess what other players are drawing!</li>
				<li>Score the most points and be crowned the winner at the end!</li>
			</ul>
		</div>
	)
}

export default Join