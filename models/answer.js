/**
 * Answer model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var answerSchema = new mongoose.Schema({
	author          : {type: ObjectId, ref: 'users'},
	translation 	: String,
	supplementary	: String,
	upvotes			: Number,
	downvotes		: Number,
	score			: Number,
	timestamp   	: Number,
	comments 	    : [{
		text        : String,
		timestamp   : Number,
		userID      : {type: ObjectId, ref: 'users'}
	}]
});

module.exports = mongoose.model('answers', answerSchema);
