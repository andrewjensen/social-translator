/**
 * Tag model
 */

var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	name         : String
});

module.exports = mongoose.model('tags', tagSchema);