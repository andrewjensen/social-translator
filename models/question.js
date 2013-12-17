/**
 * Question model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = new mongoose.Schema({
	author      : {type: ObjectId, ref: 'users', default: null},
	text	    : {type: String, default: ""},
	context	    : {type: String, default: ""},
	timestamp   : {type: Number},
	tags		: [{type: ObjectId, ref: 'tags'}],
	fromLanguage: {type: ObjectId, ref: 'languages'},
	toLanguage  : {type: ObjectId, ref: 'languages'},
	answers     : [{type: ObjectId, ref: 'answers'}],
	topAnswer	: {type: ObjectId, ref: 'answers', default: null},
	score		: {type: Number, default: 0},
	comments    : [{
		text      : String,
		timestamp : Number,
		author    : {type: ObjectId, ref: 'users'}
	}]
});

questionSchema.statics.populateCommentAuthors = function(question, callbackFunction) {
	var options = {
		path: 'comments.author',
		model: 'users',
		select: '_id name facebook.id'
	};
	this.populate(question, options, function (err, expandedQuestion){
		callbackFunction(err, expandedQuestion);
	});
};

questionSchema.statics.populateAnswerAuthors = function(question, callbackFunction) {
	var options = {
		path: 'answers.author',
		model: 'users',
		select: '_id name facebook.id'
	};
	this.populate(question, options, function(err, expandedQuestion){
		callbackFunction(err, expandedQuestion);
	});
};

questionSchema.statics.populateAnswerCommentAuthors = function(question, callbackFunction) {
	var options = {
		path: 'answers.comments.author',
		model: 'users',
		select: '_id name facebook.id'
	};
	this.populate(question, options, function(err, expandedQuestion){
		callbackFunction(err, expandedQuestion);
	});
};

module.exports = mongoose.model('questions', questionSchema);