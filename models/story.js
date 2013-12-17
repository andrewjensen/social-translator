/**
 * Story model - combine basic information about a question and its top answer
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Load the other models
var Answer	= require('../models/answer.js');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var Language = require('../models/language.js');

var Story = {

	/**
	 * Create a Story object using a Question object and a
	 * related Answer object.
	 */

	create : function(question, answer) {

		// Sometimes the question has no topAnswer, or the answer points to a null question
		// (The latter shouldn't happen) 

		var storyQuestion;
		var answerQuestion;

		if (question == null)
			storyQuestion = null;
		else
		{
			console.log('question----------------------');
			storyQuestion = {
				"_id"			: question._id,
				"text"			: question.text,
				"context"		: question.context,
				"fromLanguage"	: question.language,		//TODO: add a toLanguage as well
				"toLanguage"	: null,
				"author"		: Story.createUserData(question.author),
				"tags"			: question.tags,
				"score"			: question.score,
				"comments"		: question.comments.length,
				"answers"		: question.answers.length,
				"timestamp"		: question.timestamp
			};
		}


		//Now create basic info about the answer.

		if (answer == null)
			storyAnswer = null;
		else
		{
			var storyAnswer = {
				"_id"			: answer._id,
				"translation"	: answer.translation,
				"supplementary"	: answer.supplementary,
				"author" 		: Story.createUserData(answer.author),
				"score"			: (answer.upvotes - answer.downvotes),
				"timestamp"		: answer.timestamp,
			};
		}

		//Put the info together into a story and return it.

		var story = {
			"question"	: storyQuestion,
			"answer"	: storyAnswer
		};
		return story;

	}, //create()

	/**
	 * Create a Story object from a Question
	 * and its top Answer.
	 */
	createFromQuestionId : function(questionId, callback) {

		Question.findOne({_id: questionId})
		.populate('author')
		.populate('tags')
		.populate('topAnswer')	//Here's where we get the answer!
		.exec(function(err, question) {

			if (err) {
				callback(err, null);
			} else {

				Answer.populateAnswerAuthors(question.topAnswer, function(err, a) {
					callback(null, Story.create(question, a));
				});
			}

		});
	},

	/**
	 * Create a Story object from an Answer
	 * and the Question it belongs to.
	 */
	createFromAnswerId : function(answerId, callback) {

		Answer.findOne({_id: answerId})
		.populate('author')
		.populate('tags')
		.populate('question')	//Here's where we get the question!
		.exec(function(err, answer) {

			if (err) {
				callback(err, null);
			} else {

				callback(null, Story.create(answer.question, answer));
			}
		});
	},


	/***********************
	 * HELPER METHODS
	 ***********************/

	/**
	 * Simplify a user object down into the basics needed for a Story.
	 */
	createUserData : function(user) {
		if (user == null)
			return null;
		// console.log('user: ' + user);
		console.log('user._id: ' + user._id);
		console.log('user.facebook: ' + user.facebook);
		return {
			"_id"			: user._id,
			"name"			: user.name,
			"facebookID"	: (user.facebook == null ? null : user.facebook.id)
		};
	}

} // Story

module.exports = Story;