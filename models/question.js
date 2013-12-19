var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/*************************
 * SCHEMA DEFINITION */

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

/*************************
 * GETTERS */

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

/*************************
 * SETTERS */

questionSchema.statics.addAnswer = function(questionID, answerID, callbackFunction) {
	//Make sure we have ObjectIds to work with.
	if (typeof(questionID) == "string")
		questionID = new ObjectId(questionID);
	if (typeof(answerID) == "string")
		answerID = new ObjectId(answerID);

	//Push the data.
	this.update({_id : questionID}, {$push: {answers: answerID}}, function(err, answerID){

		//Run the callback.
		callbackFunction(err, answerID);
	});
};

/**
 * Post a comment on a question.
 * @return the comment that was created.
 */
questionSchema.statics.postComment = function(questionID, comment, callbackFunction) {
	this.update({_id : questionID}, {$push: {comments: comment } }, function(err, commentID) {
		if (err) {
			callbackFunction(err, null);
			return;
		}

		//Return the comment itself.
		callbackFunction(null, comment);
	});
};


/*************************
 * EXPORT THE MODEL */

module.exports = mongoose.model('questions', questionSchema);