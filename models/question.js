/**
 * Question model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = new mongoose.Schema({
	author      : {type: ObjectId, ref: 'users'},
	text	    : String,
	context	    : String,
	timestamp   : Number,
	tags		: [{type: ObjectId, ref: 'tags'}],
	fromLanguage: {type: ObjectId, ref: 'languages'},
	toLanguage  : {type: ObjectId, ref: 'languages'},
	answers     : [{type: ObjectId, ref: 'answers'}],
	topAnswer	: {type: ObjectId, ref: 'answers', default: null},
	score		: {type: Number, default: 0},
	comments    : [{
		text      : String,
		timestamp : Number,
		userID    : {type: ObjectId, ref: 'users'}
	}]
});

module.exports = mongoose.model('questions', questionSchema);