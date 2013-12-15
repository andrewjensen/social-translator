/**
 * Language model
 */

var mongoose = require('mongoose');

var languageSchema = new mongoose.Schema({
	name         : String
});

module.exports = mongoose.model('languages', languageSchema);