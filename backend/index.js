const http = require('http')
const socketio = require('socket.io')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const server = http.createServer(app)
const { Server } = require('socket.io');

const cors = require('cors')

const PORT = 3001
server.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`)
})

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
})

io.on('connection', socket => {
	console.log('a user connected')

	socket.on('chat-message', message=>{
		console.log(message)
		io.emit('chat-message', message) // send to all clients
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})