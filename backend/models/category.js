const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  user: String,
  words: { type: [String], 
           validate: v => v == null || v.length > 0}
})

categorySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Category', categorySchema)