import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Navbar from './components/Navbar'
import Game from './pages/Game'
import Join from './pages/Join'
import Ready from './pages/Ready'
import End from './pages/EndGame'
import categoryService from './services/categories'
import userService from './services/users'

const ENDPOINT = 'http://localhost:3001'

const App = () => {
	const [player, setPlayer] = useState(null)
	const [players, setPlayers] = useState([
		{ username: 'player1', score: 5 },
		{ username: 'player2', score: 6 }
	])
	const [socket, setSocket] = useState(null) // State to hold the socket
	const [messages, setMessages] = useState([]) // State to hold sent and received messages
	const [words, setWords] = useState([]) // State to hold all possible words to draw
	const [word, setWord] = useState('') // State to hold the word the drawer needs to draw
	const [drawer, setDrawer] = useState('') // State to hold the username of the drawer
	const [round, setRound] = useState(1) // State to hold the current round
	const [roundResults, setRoundResults] = useState(null) // State to hold the results of the round

	//Function to display the results window
	const displayReultsWindow = (results) => {
		setRoundResults(results)

		//After 5 seconds, close the results window
		setTimeout(() => {
			setRoundResults(null)
		}, 5000)
	}

	useEffect(() => {
		const newSocket = io(ENDPOINT) // Connects endpoint to socket
		setSocket(newSocket) // Sets socket state to newSocket

		categoryService
			.getAll()
			.then(response => {
				const newWords = response.data[0].words
				setWords(newWords)
				newSocket.emit('words', newWords) //send 'words' and the new words to the server
			})

		// listen for the 'chat-message' event from the server. it appends the old message list with new message
		newSocket.on('chat-message', data => {
			setMessages(oldMessages => [...oldMessages, data])
			console.log(data)
		})

		// listen for the 'update-players' event from the server. it updates the players list
		newSocket.on('update-players', updatedPlayers => {
			setPlayers(updatedPlayers)
		})

		newSocket.on('update-word', updatedWord => {
			setWord(updatedWord)
		})

		newSocket.on('update-round', updatedRound => {
			setRound(updatedRound)
		})

		newSocket.on('round-results', results => {
			//Render the results window
			console.log('Recevied round results:', results)
			displayReultsWindow(results)
		})

		// cleanup function to disconnect the socket from the server when component unmounts
		return () => {
			newSocket.disconnect()
		}
	}, [])

	const sendMessage = message => {
		if (socket) {
			socket.emit('chat-message', message)
		}
	}

	const handleJoin = (player) => {
		setPlayer(player)
		const newPlayer = { username: player.name, score: 0, drawer: false, rank: 1, ready: false }
		setPlayers(players => [...players, newPlayer])  //add newplayer to players array
		socket.emit('player-joined', newPlayer)  //send 'player-joined' and the new player to the server
		socket.emit('words', words)
	}

	// Pass socket and players to the Game component
	return (
		<>
			<Router>
				<Navbar />
				{/* first loads the join page */}
				<Routes>
					<Route path="/" element={<Join onJoin={handleJoin} socket={socket} />} />
					<Route path="/ready" element={<Ready currentPlayer={player} players={players} setPlayers={setPlayers} socket={socket} />} />
					<Route path="/game" element={<Game player={player} players={players} socket={socket} messages={messages} sendMessage={sendMessage} word={word} round={round} />} />
					<Route path="/endGame" element={<End players={players} socket={socket}></End>}></Route>
				</Routes>
			</Router>

			{/* Conditionally render the results window if roundResults is not null */}
			{roundResults && (
				<div className="results-window">
					<div className="results-overlay"> {/* Transparent grey background */}
						<h2>Round Results</h2>
						{roundResults.map((result, index) => (
							<div key={index}>
								{result.username}: {result.score >= 0 ? '+' : ''}{result.score}
							</div>
						))}
					</div>
				</div>
			)}
		</>
	)
}

export default App
