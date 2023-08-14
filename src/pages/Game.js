import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DrawingBoard from '../components/Drawingboard'
import Guess from '../components/Guess'
import PlayerList from '../components/PlayerList'
import Timer from '../components/Timer'
import '../styles.css'

const Game = ({ player, players, socket, messages, sendMessage, word, round }) => {

	const navigate = useNavigate()

	useEffect(() => {
		if (!player) {
			navigate('/')
		}
		if (round === 4) {
			navigate('/endGame')
		}
	}, [player, navigate, round])

	return (
		<div className='container'>
			<div className='left'>
				<h2 className='round'>{round}</h2>
				<PlayerList players={players} />
			</div>
			<div className='middle'>
				<Timer socket={socket} />
				<h2 className='currentWord'>{word}</h2>
				<DrawingBoard socket={socket} player={player}/>
			</div>
			<div className='right'>
				<Guess player={player} messages={messages} sendMessage={sendMessage} />
			</div>
		</div>
	)
}

export default Game
