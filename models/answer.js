/**
 * Answer model
 */
var mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
	text		: String,
	upvotes		: Number,
	downvotes	: Number,
	comments	: []
});

module.exports = mongoose.model('answers', answerSchema);
