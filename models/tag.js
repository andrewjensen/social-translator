/**
 * Tag model
 */

var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	isLanguage  : Boolean,
	text        : String
});

module.exports = mongoose.model('tags', tagSchema);