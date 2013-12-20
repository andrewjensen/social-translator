var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/*************************
 * SCHEMA DEFINITION */

var answerSchema = new mongoose.Schema({
	author			: {type: ObjectId, ref: 'users', default: null},
	question		: {type: ObjectId, ref: 'questions', default: null},
	translation		: {type: String, default: ""},
	supplementary	: {type: String, default: ""},
	timestamp		: {type: Number, default: null},

	score			: {type: Number, default: 0},
	// upvotes			: {type: Number, default: 0},
	// downvotes		: {type: Number, default: 0},
	// upvoteAuthors	: [ {type: ObjectId, ref: 'users'} ],
	// downvoteAuthors	: [ {type: ObjectId, ref: 'users'} ],
	votes			: [ {
		author 		: {type: ObjectId, ref: 'users', default: null},
		direction	: String	
	}],

	comments		: [ {
		text		: String,
		timestamp	: Number,
		author		: {type: ObjectId, ref: 'users', default: null}
	} ]
});

/*************************
 * GETTERS */

answerSchema.statics.populateAnswerAuthors = function(answer, callbackFunction) {
	var options = {
		path: 'author',
		model: 'users',
		select: '_id name facebook.id'
	};
	this.populate(answer, options, function (err, expandedAnswer){
		callbackFunction(err, expandedAnswer);
	});
};

/*************************
 * SETTERS */

/**
 * Post a comment on a question.
 * @return the comment that was created.
 */
answerSchema.statics.postComment = function(answerID, comment, callbackFunction) {
	this.update({_id : answerID}, {$push: {comments: comment } }, function(err, commentID) {
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

module.exports = mongoose.model('answers', answerSchema);
