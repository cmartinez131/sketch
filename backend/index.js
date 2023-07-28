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

io.on('connection', socket => {
	logger.info('a user connected')

	//event listener for message
	socket.on('chat-message', message => {
		logger.info(message)
		io.emit('chat-message', message) // send to all clients
	})

	//event listeners for 'start-drawing'
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


	socket.on('disconnect', () => {
		logger.info('user disconnected')
	})
})