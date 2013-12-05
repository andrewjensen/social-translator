/**
 * Question model
 */
var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
	text	: String,
	context	: String
});

module.exports = mongoose.model('questions', questionSchema);
