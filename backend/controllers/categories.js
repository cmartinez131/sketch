const categoryRouter = require('express').Router()
const Category = require('../models/category')

categoryRouter.get('/', async (request, response) => {
  const categories = await Category.find({})
  response.json(categories)
})

categoryRouter.get('/:id', async (request, response) => {
  const category = await Category.findById(request.params.id)
	if (category) {
		response.json(category)
	}
	else {
		response.status(404).end()
	}
})

categoryRouter.post('/', async (request, response) => {
	const body = request.body

	const category = new Category({
		category: body.category,
    user: body.user,
    words: body.words
	})  

	const savedCategory = await category.save()
	response.status(201).json(savedCategory)
})

categoryRouter.delete('/:id', async (request, response) => {
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