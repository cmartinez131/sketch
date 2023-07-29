const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Setting up socket
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const { Server } = require('socket.io');

const cors = require('cors')

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
})

// array to store the active players on server
let players = [];

io.on('connection', socket => {
	logger.info('a user connected')

	// event listener 'chat-message' evenets and send them to all clients
	socket.on('chat-message', message => {
		logger.info(message)
		io.emit('chat-message', message) // send to all clients
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
        players.push(player);
        // socket.username assigns username to each socket connection to the server
        socket.username = player.username;
        io.emit('update-players', players);
        logger.info('current players', players)
    })


	// event listener to remove player from active players and update list for all players
    socket.on('disconnect', () => {
        players = players.filter(p => p.username !== socket.username);
        io.emit('update-players', players);
        logger.info('current players', players)
        logger.info('user disconnected');
    })
})