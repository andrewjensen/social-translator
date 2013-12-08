/**
 * User model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.ObjectId;

var userSchema = new mongoose.Schema({
	firstName		: String,
	lastName		: String,
	email			: String,
	username		: String,
	passwordHash	: String,
	oAuthID			: String,
	nativeLanguage	: {type: String, default: ""},
	bio				: {type: String, default: ""},
	score			: {type: Number, default: 0},
	followers		: [ObjectId],
	followingUsers	: [ObjectId],
	followingTags	: [ObjectId],
	questions		: [ObjectId],
	answers			: [ObjectId]
});

module.exports = mongoose.model('users', userSchema);
