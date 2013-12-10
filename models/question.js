/**
 * Question model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.ObjectId;

var questionSchema = new mongoose.Schema({
	text	: String,
	context	: String,
	timestamp: String,
	comments: [ObjectId],
	tags: [ObjectId],
	score: String
});

module.exports = mongoose.model('questions', questionSchema);
