const http = require('http')
const socketio = require('socket.io')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('chat message', (message) => {

		// When we receive a 'chat message' event
		console.log('message: ' + JSON.stringify(message))
		
		// send that message to all connected clients
		io.emit('chat message', message);
	});

})

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})
