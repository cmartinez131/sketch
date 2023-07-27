const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: { 
		type: String, 
		required: true, 
		unique: true 
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	imagePath: { 
		type: String, 
		default: 'pathToAnImage'
	},
	level: { 
		type: Number, 
		min: 1, 
		default: 1
	},
	score: { 
		type: Number, 
		default: 0
	},
	personalWordLists: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
		default: [],
	}
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('User', userSchema)