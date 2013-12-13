/**
 * Language model
 */

var mongoose = require('mongoose');

var languageSchema = new mongoose.Schema({
	name         : String,
	numQuestions : Number
});

module.exports = mongoose.model('languages', languageSchema);