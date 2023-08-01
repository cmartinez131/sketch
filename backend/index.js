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

//Timer for the game
let roundTime = 60;

function getRandomIndex(array) {
	return Math.floor(Math.random() * array.length);
}

function isDrawer(username) {
	const player = players.find((p) => p.username === username);
	return player.drawer
}

function switchDrawer() {
	let drawerIndex = players.findIndex(player => player.drawer);
	players[drawerIndex].drawer = false;
	drawerIndex = (drawerIndex + 1) % players.length;
	players[drawerIndex].drawer = true;
	io.emit('update-players', players);
}

function generateUnderscores(word) {
	let underscores = "";
	for (let i = 0; i < word.length; i++) {
		if (word[i] === " ") {
			underscores += ". ";
		}
		else {
			underscores += "_ ";
		}
	}
	return underscores;
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
	logger.info('a user connected')

	setInterval(() => {
		roundTime--;
		if (roundTime <= 0) {
			//Round is over, reset timer
			roundTime = 60;

			switchDrawer()

			word = words[getRandomIndex(words)]
			io.to('drawer').emit('update-word', word);
			io.to('guesser').emit('update-word', generateUnderscores(word));
		}

		io.emit('update-timer', roundTime)
	}, 1000) // 1000ms = 1s

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

			switchDrawer()
			//Update the players list
			io.emit('update-players', players)

			word = words[getRandomIndex(words)]
			io.to('drawer').emit('update-word', word);
			io.to('guesser').emit('update-word', generateUnderscores(word));
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
		player.rank = players.length
		// socket.username assigns username to each socket connection to the server
		socket.username = player.username;

		io.emit('update-players', players);
		logger.info('current players', players)

		if (player.drawer) {
			socket.join('drawer');
		}
		else {
			socket.join('guesser');
		}
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


