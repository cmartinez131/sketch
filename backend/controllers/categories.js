const categoryRouter = require('express').Router()
const Category = require('../models/category')
const User = require('../models/user')

categoryRouter.get('/', async (request, response) => {
  const categories = await Category
		.find({}).populate('user', { username: 1, name: 1 })
  response.json(categories)
})

categoryRouter.get('/:id', async (request, response) => {
  const category = await Category
		.findById(request.params.id).populate('user', { username: 1, name: 1 })
	if (category) {
		response.json(category)
	}
	else {
		response.status(404).end()
	}
})

categoryRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findById(body.userId)

	const category = new Category({
		category: body.category,
    user: user.id,
    words: body.words
	})  

	const savedCategory = await category.save()
	user.personalWordLists = user.personalWordLists.concat(savedCategory._id)
	await user.save()

	response.status(201).json(savedCategory)
})

categoryRouter.delete('/:id', async (request, response) => {
	const categoryId = request.params.id

	const category = await Category.findById(categoryId)
	const userId = category.user

	const user = await User.findById(userId)
	user.personalWordLists = user.personalWordLists.filter(
		(category => !category.equals(categoryId))
	)
	await user.save()

	await Category.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

categoryRouter.put('/:id', async (request, response) => {
	const body = request.body

	const category = {
		category: body.category,
		words: body.words
	}

	const updatedCategory = await Category.findByIdAndUpdate(request.params.id, category, { new: true, runValidators: true })
	response.json(updatedCategory)
})

module.exports = categoryRouter