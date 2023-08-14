const config = require('./utils/config')
const express = require('express')
const path = require('path')
require('express-async-errors')
const app = express()
const cors = require('cors')
const categoriesRouter = require('./controllers/categories')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.info('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())

app.use('/api/categories', categoriesRouter)
app.use('/api/users', usersRouter)

// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

module.exports = app
