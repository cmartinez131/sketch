const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Setting up socket
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const { Server } = require('socket.io');

const cors = require('cors')

// array to store the active players on server
let players = [];
let words = [];
let word = '';

function getRandomIndex(array) {
	return Math.floor(Math.random() * array.length);
}

function isDrawer(username) {
	const player = players.find((p) => p.username === username);
	return player.drawer
}

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
})

//socket.broadcast.emit method sends a message to all connected clients except for the client that initiated the event
//io.emit method sends a message to all connected clients, including the client that initiated the event.

io.on('connection', socket => {
	logger.info('a user connected')

	// event listener 'chat-message' events and send them to all clients
	socket.on('chat-message', message => {
		logger.info(message)
		io.emit('chat-message', message) // send to all clients
		if (message.text === word && !isDrawer(message.user)) {
			//Find the player who guessed correctly
			const player = players.find((p) => p.username === message.user)
			if (player) {
				player.score += 1
			}
			//Sort the players by score
			players.sort((a, b) => b.score - a.score)
			//Update the players list
			io.emit('update-players', players)

			word = words[getRandomIndex(words)]
			io.emit('update-word', word)
			logger.info('current word', word)
		}
	})

	// event listeners for 'start-drawing' events and sends them to all clients
	socket.on('start-drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('start-drawing', { clientX, clientY, color, width });
		logger.info('a user started drawing')
	});

	//event listener for 'drawing'
	socket.on('drawing', ({ clientX, clientY, color, width }) => {
		socket.broadcast.emit('drawing', { clientX, clientY, color, width });
		//logger.info('a user is drawing')
	});

	//event listener for 'stop-drawing'
	socket.on('stop-drawing', () => {
		socket.broadcast.emit('stop-drawing');
		logger.info('a user stopped drawing')
	});

	// event listener that adds players to active players and sends updated players list
	socket.on('player-joined', player => {
		if (players.length === 0)
			player.drawer = true
		players.push(player);
		// socket.username assigns username to each socket connection to the server
		socket.username = player.username;
		io.emit('update-players', players);
		logger.info('current players', players)
	})

	//socket listens for 'clear-canvas' event then broadcasts it to clients
	socket.on('clear-canvas', () => {
		socket.broadcast.emit('clear-canvas');
		logger.info('canvas cleared');
	});

	socket.on('words', initialWords => {
		words = initialWords;
		if (word === '') {
			word = words[getRandomIndex(words)]
		}
		io.emit('update-word', word)
		logger.info('current word', word)
	})

	// event listener to remove player from active players and update list for all players
	socket.on('disconnect', () => {
		players = players.filter(p => p.username !== socket.username);
		io.emit('update-players', players);
		logger.info('current players', players)
		logger.info('user disconnected');
	})
})