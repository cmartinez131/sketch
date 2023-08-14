const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
	category: {
		type: String,
		required: [true, 'Category name required'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	words: {
		type: [String],
		validate: {
			validator: function(arr) {
				if (!arr || arr.length === 0){
					return false
				}

				return arr.every(word => word.trim().length > 0)
			},
			message: 'Must contain at least one word'
		}
	}
})

categorySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Category', categorySchema)