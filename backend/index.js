const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Setting up socket
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const { Server } = require('socket.io')

const cors = require('cors')
const { runInContext } = require('vm')
const { start } = require('repl')

// array to store the active players on server
let players = []
let words = []
let word = ''
let round = 1

let gameHasStarted = false

let roundTime = 60//Timer for the game
let intervalID = null //ID for the timer interval
let wordGuessed = false //Boolean to check if the word has been guessed
let correctGuessers = new Set() //Set to store the players who have guessed the word correctly
let alreadyDrawed = new Set()

//Array to store the points for each player in the current round
let roundScores = []

function startGame() {
	//Reset roundScores for each round
	roundScores = players.map(player => ({ username: player.username, score: 0 }))

	if (players.length >= 2 && intervalID === null)

		intervalID = setInterval(() => {
			roundTime--
			if (roundTime <= 0) {
				//Round is over, show results
				endRound()

				//Clear the current interval
				clearInterval(intervalID)
				intervalID = null
			}

			io.emit('update-timer', roundTime)
		}, 1000) // 1000ms = 1s
}

function getRandomIndex(array) {
	return Math.floor(Math.random() * array.length)
}

function isDrawer(username) {
	const player = players.find((p) => p.username === username)
	return player.drawer
}

function switchDrawer() {
	if (players.length === 0) return

	let drawerIndex = players.findIndex(player => player.drawer)

	// Make the drawer a guesser
	if (drawerIndex !== -1) {
		players[drawerIndex].drawer = false
		let oldDrawerSocket = io.sockets.sockets.get(players[drawerIndex].socketId) // Get the socket of the old drawer
		oldDrawerSocket.leave('drawer') // Move the old drawer's socket to the 'drawer' room
		oldDrawerSocket.join('guesser') // Move the old drawer's socket to the 'guesser' room
		alreadyDrawed.add(players[drawerIndex].username) // Add the old drawer to the set of players who have already drawn
	} else {
		logger.info('No drawer found, setting the first player as drawer.')
		drawerIndex = 0
	}

	// Once all the players have drawn, go on to the next round
	const allPlayersDrawn = players.every(player => alreadyDrawed.has(player.username))
	if (allPlayersDrawn) {
		alreadyDrawed.clear()
		round += 1
		io.emit('update-round', round)
	}

	// Make the next drawer a drawer
	drawerIndex = (drawerIndex + 1) % players.length
	players[drawerIndex].drawer = true
	let newDrawerSocket = io.sockets.sockets.get(players[drawerIndex].socketId) // Get the socket of the new drawer
	newDrawerSocket.leave('guesser')
	newDrawerSocket.join('drawer') // Move the new drawer's socket to the 'drawer' room

	io.emit('clear-canvas')
	io.emit('update-players', players)

	// get a new word
	word = words[getRandomIndex(words)]

	// get the socket ids of the new drawer and the new guesser
	let newDrawerSocketId = players[drawerIndex].socketId
	let newGuesserSocketId = players[(drawerIndex + 1) % players.length].socketId

	// send the 'update-word' event to the new drawer and the new guesser
	io.to(newDrawerSocketId).emit('update-word', word)
	io.to('guesser').emit('update-word', generateUnderscores(word))

	roundTime = 60
	if (intervalID !== null) {
		logger.info('drawer left, new game started')
		startGame()
	}
}

function endRound() {
	//send the results to all clients
	console.log('Emitting round results: ', roundScores)
	io.emit('round-results', roundScores)

	//set a delay before starting the next round
	setTimeout(() => {
		//Reset the timer and round variables
		roundTime = 60
		wordGuessed = false
		correctGuessers.clear()

		//Start the next round
		switchDrawer()
		word = words[getRandomIndex(words)]
		io.to('drawer').emit('update-word', word)
		io.to('guesser').emit('update-word', generateUnderscores(word))
		logger.info('current word', word)

		//Start a new interval
		startGame()
	}, 5000) // 5s delay before starting the next round
}

function generateUnderscores(word) {
	let underscores = ''
	for (let i = 0; i < word.length; i++) {
		if (word[i] === ' ') {
			underscores += '. '
		}
		else {
			underscores += '_ '
		}
	}
	return underscores
}

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})

//cors is a middleware that can be used to enable CORS with various options
//cors origin is set to * to allow all origins
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
})

//socket.broadcast.emit method sends a message to all connected clients except for the client that initiated the event
//io.emit method sends a message to all connected clients, including the client that initiated the event.
io.on('connection', socket => {
	logger.info('a user connected', socket.id)
	socket.on('words', initialWords => {
		words = initialWords
		if (word === '') {
			word = words[getRandomIndex(words)]
			io.to('drawer').emit('update-word', word)
			io.to('guesser').emit('update-word', generateUnderscores(word))
		}
		io.emit('update-words', words)
		logger.info('current word', word)
	})

	//client asks server if game has started yet and server response with gameHasStarted status
	socket.on('check-game-status', () => {
		socket.emit('game-status-response', gameHasStarted)
	})

	socket.on('toggle-ready', updatedPlayer => {
		const playerToUpdate = players.find(player => player.username === updatedPlayer.username)
		if (playerToUpdate) {
			playerToUpdate.ready = updatedPlayer.ready
		}
		// send the updated players list to all clients
		io.emit('update-players', players)
		logger.info('Player ready status toggled', updatedPlayer)
	})

	// Event listeners for free-draw feature that is used by the free-draw canvas
	// Event listener for 'start-free-drawing'
	socket.on('start-free-drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('start-free-drawing', { clientX, clientY, color, width })
		logger.info('a user started drawing')
	})

	// Event listener for 'free-drawing'
	socket.on('free-drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('free-drawing', { clientX, clientY, color, width })
		// logger.info('a user is drawing');
	})

	// Event listener for 'stop-free-drawing'
	socket.on('stop-free-drawing', () => {
		socket.broadcast.emit('stop-free-drawing')
		logger.info('a user stopped drawing')
	})

	// Event listener for 'clear-canvas'
	socket.on('clear-free-canvas', () => {
		io.emit('clear-free-canvas')
		logger.info('a user cleared the canvas')
	})
	// End of free-draw event listeners

	// Listen for 'start-game' event
	socket.on('start-game', () => {
		// sends a 'game-started' event to all the clients
		startGame()
		gameHasStarted = true
		io.emit('game-started')
		logger.info('Game has started')
	})

	// event listener that adds players to active players and sends updated players list
	socket.on('player-joined', player => {
		if (players.length === 0) {
			player.drawer = true
			io.to('drawer').emit('update-word', word)
			io.to('guesser').emit('update-word', generateUnderscores(word))
		}
		player.socketId = socket.id // socket.id assigns a unique id to each socket connection to the server
		players.push(player)
		player.rank = players.length
		// socket.username assigns username to each socket connection to the server
		socket.username = player.username

		io.emit('update-players', players)
		logger.info('current players', players)
		io.emit('update-round', round)

		if (word === '') {
			word = words[getRandomIndex(words)]
		}

		if (player.drawer) {
			socket.join('drawer')
			io.to('drawer').emit('update-word', word)
			console.log('drawer word emited', word)
		}
		else {
			socket.join('guesser')
			io.to('guesser').emit('update-word', generateUnderscores(word))
			console.log('guesser word emited', word)
		}

		//Check if the game should start
		// if (players.length >= 2 && intervalID === null) {
		// 	startGame()
		// }
		// startGame();	//startGame moved to when startGame button clicked
	})

	// event listener to listen for clients requesting to draw
	socket.on('request-permission', ({ username }) => {
		const hasPermission = isDrawer(username)
		// emit a 'permission-response' event back to the client wether or not user is drawer
		socket.emit('permission-response', { hasPermission })
	})

	// event listener 'chat-message' events and send them to all clients
	socket.on('chat-message', message => {
		logger.info(message)

		//Check if the message is the word
		if (message.text === word && !isDrawer(message.user)) {
			if (!correctGuessers.has(message.user)) {

				//Calculate the points to award the player
				const points = Math.max(1, Math.ceil(roundTime * 2))

				//Find the player who guessed correctly
				const player = players.find((p) => p.username === message.user)
				if (player) {
					player.score += points
				}

				const roundScore = roundScores.find(p => p.username === message.user)
				if (roundScore) {
					roundScore.score += points
				}
				//Add the player to the set of correct guessers
				correctGuessers.add(message.user)

				io.emit('chat-message', { user: 'System', color: 'lightgreen', text: `${message.user} guessed the word!` })
			}

			//Award the drawer points if a player have guessed the word
			const drawer = players.find((p) => p.drawer)
			if (drawer && !wordGuessed) {
				drawer.score += 200
				const roundScore = roundScores.find(p => p.username === drawer.username)
				if (roundScore) {
					roundScore.score += 200
				}
				wordGuessed = true
			}

			//Check if all players have guessed the word
			if (correctGuessers.size === players.length - 1) {
				endRound()
			}

			logger.info('current word', word)
		}
		else {
			io.emit('chat-message', message)
		}
	})

	// event listeners for 'start-drawing' events and sends them to all clients
	socket.on('start-drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('start-drawing', { clientX, clientY, color, width })
		logger.info('a user started drawing')
	})

	//event listener for 'drawing'
	socket.on('drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('drawing', { clientX, clientY, color, width })
		//logger.info('a user is drawing')
	})

	//event listener for 'stop-drawing'
	socket.on('stop-drawing', () => {
		socket.broadcast.emit('stop-drawing')
		logger.info('a user stopped drawing')
	})


	//socket listens for 'clear-canvas' event then broadcasts it to all clients
	socket.on('clear-canvas', () => {
		logger.info('rooms', socket.rooms)
		if (socket.rooms.has('drawer')) {
			io.emit('clear-canvas')
			logger.info('canvas cleared')
		}
		else {
			logger.info('socket not authorized to clear canvas')
		}
	})

	//socket listens for 'undo-drawing' event then broadcasts it to all clients
	socket.on('undo-drawing', () => {
		logger.info('rooms', socket.rooms)
		if (socket.rooms.has('drawer')) {
			io.emit('undo-drawing')
			logger.info('undo button click sent by socket to clients')
		}
		else {
			logger.info('socket not authorized to undo move')
		}
	})

	// event listener to remove player from active players and update list for all players
	socket.on('disconnect', () => {
		correctGuessers = new Set(Array.from(correctGuessers).filter(p => p.username !== socket.username))
		const wasDrawer = players.some(p => p.username === socket.username && p.drawer)
		players = players.filter(p => p.username !== socket.username)
		if (wasDrawer) {
			switchDrawer()
		}
		io.emit('update-players', players)
		logger.info('current players', players.length)
		logger.info('user disconnected')

		//If no players are left, clear the interval
		if (players.length < 2 && intervalID !== null) {
			clearInterval(intervalID)
			intervalID = null
			logger.info('interval cleared')
		}
	})

})


