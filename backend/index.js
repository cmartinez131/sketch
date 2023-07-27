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

	socket.on('chat-message', message=>{
		logger.info(message)
		io.emit('chat-message', message) // send to all clients
	})

	socket.on('disconnect', () => {
		logger.info('user disconnected')
	})
})