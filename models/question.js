/**
 * Question model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new mongoose.Schema({ text: String, timestamp: String, userID: {type: ObjectId, ref: 'users'} }, { noId: true });
var questionSchema = new mongoose.Schema({
	text	    : String,
	context	    : String,
	timestamp   : String,
	topAnswer	: {type: ObjectId, ref: 'answers', default: null},
	tags		: [{type: ObjectId, ref: 'tags'}],
	language    : {type: ObjectId, ref: 'languages'},
	comments    : [commentSchema],
	answers     : [{type: ObjectId, ref: 'answers'}],
	score		: String
});

module.exports = mongoose.model('questions', questionSchema);