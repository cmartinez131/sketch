const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Category = require('../models/category')

userRouter.get('/', async (request, response) => {
	const users = await User
		.find({}).populate('personalWordLists', { category: 1, words: 1 })
	response.json(users)
})

userRouter.get('/:id', async (request, response) => {
	const user = await User
		.findById(request.params.id).populate('personalWordLists', { category: 1, words: 1 })
	if (user) {
		response.json(user)
	}
	else {
		response.status(404).end()
	}
})

userRouter.post('/', async (request, response) => {
	const body = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		password: passwordHash,
		name: body.name,
		imagePath: body.imagePath,
		level: body.level,
		score: body.score,
		personalWordLists: body.personalWordLists
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

userRouter.delete('/:id', async (request, response) => {
	const user = await User.findByIdAndRemove(request.params.id)

	if (!user) {
		return response.status(404).json({ error: 'User not found' })
	}

	// Remove the associated Category documents
	await Category.deleteMany({ _id: { $in: user.personalWordLists } })

	response.status(204).end()
})

userRouter.put('/:id', async (request, response) => {
	const body = request.body

	const user = {
		username: body.username,
		imagePath: body.imagePath,
		level: body.level,
		score: body.score,
		personalWordLists: body.personalWordLists
	}

	const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true, runValidators: true })
	response.json(updatedUser)
})

module.exports = userRouter