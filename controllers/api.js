var Answer	= require('../models/answer.js');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var Language = require('../models/language.js');
var Story = require('../models/story.js');
var ObjectId = require('mongoose').Schema.Types.ObjectId;

/** Language Calls */
exports.languagelist = function(req, res) {

	Language.find(function(err, languages) {

		if (err)
			res.send(err);
		res.json(languages);
	});
};

exports.recentStories = function(req, res) {
	var numQuestions = 0;
	var questionStories = [];
	Question.find(function(err, questions) {
		numQuestions = questions.length;
		for (i in questions)
		{
			Story.createFromQuestionId(questions[i], function(err, story) {
				questionStories.push(story);
				complete();
			});	
		}
	});

	function complete() {
		// Do not go on until we have the expected number of stories
		if (questionStories.length != numQuestions)
			return;

		res.json(questionStories);
	};
};

exports.searchPage = function(req, res) {

	var phrase = req.params.phrase;      // This is the string to search for
	var language = req.params.languageID;  // This is the TO-language
	console.log('phrase', phrase);
	console.log('language', language);
	// TODO, change to getting the questions with the top-scored answers that match the text
	//, toLanguage: language
	Question.find({$and : [{text: new RegExp(phrase, "i")}, {toLanguage: language}]}, function(err, questions) {

		if (err)
		{
			res.send(err);
			return;
		}
		// console.log(questions);
		var numQuestions = questions.length;
		if (numQuestions == 0) res.json();
		var questionStories = [];
		for (var i = 0; i < questions.length; i++)
		{
			Story.createFromQuestionId(questions[i], function(err, story) {
				if (err)
					console.log("There's an error!");

				questionStories.push(story);
				complete();
			});
		}
		function complete() {
			if (questionStories.length != numQuestions)
				return;
			res.json(questionStories);
		}
	});
};

// TODO, populate the newsfeedpage for a given user using timestamps
// (I don't know what the newsfeed page wants to display)
exports.newsfeedPage = function(req, res) {

User.findOne({_id: req.params.userID}, function(err, user) {
	console.log(user.languages);
	Question.find({$or: [
		{fromLanguage: {$in: user.languages}}, 
		{toLanguage: {$in: user.languages}}, 
		{author: {$in: user.followingUsers}}]})
		.sort({timestamp: -1})
		.exec(function(err, questions) {

			var numQuestions = questions.length;
			var questionStories = [];
			for (i in questions)
			{
				Story.createFromQuestionId(questions[i], function(err, story) {

					questionStories.push(story);
					complete();
				});
			}
			complete();
			function complete() {

				console.log('questionStories.length: ', questionStories.length);
				console.log('numQuestions: ', numQuestions);
				console.log('');
				// Do not go on until we have the expected number of stories
				if (questionStories.length < numQuestions)
					return;
				var pageData = {
					title			: 'Profile | Social Translator',
					questionStories	: questionStories
				};
				res.json(pageData);
			};
		});
	});
};

/** FROM answers.js */

/**
 * List all answers.
 * TODO: change to something more useful
 */
exports.answerlist = function(req, res) {

	Answer.find(function(err, answers) {

		if (err)
			res.send(err)
		res.json(answers); // return all answers in JSON format
	});
};

/**FROM questions.js */
//Load model

// Load the translation page (with all populated values for a single question)
exports.translationPage = function(req, res) {

	var questionID = req.params.questionID;
	
	Question.findOne({_id: questionID})
	.populate('fromLanguage', '_id name')
	.populate('toLanguage', '_id name')
	.populate('tags')
	.populate('author', '_id name facebook')
	.populate('answers')
	.exec(function(err, question) {
		if (err)
		{
			console.log("Error sending Translation page data: ", err);
			res.send(err);
		}

		Question.populateCommentAuthors(question, function(err, question) {

		Question.populateAnswerAuthors(question, function(err, question) {

		Question.populateAnswerCommentAuthors(question, function(err, question) {

			var pageData = {
				title		: 'Question | Social translator',
				question    : question
			};
			res.json(pageData);
		});
		});
		});

	});
};

exports.voteOnAnswer = function(req, res) {
	console.log(req.body);
	Answer.findOne({_id: '52afcec3618b701535f12df0'}, function(err, answer) {
		if(err)
		{
			console.log(err);
			res.send(err);
		}
		console.log('BEFORE_______________');
		console.log('votes', votes);
		console.log('score', score);

		var v = {
			author: '52b099007dffc8760c000003',
			direction: 'up'
		};
			
		var score 		= answer.score;
		var votes 		= answer.votes;

		//TODO change all of the votes and the score :)

		console.log('AFTER_________________');
		console.log('votes', votes);
		console.log('score', score);

		Answer.findOneAndUpdate({_id: '52afcec3618b701535f12df0'}, {score: score, votes: votes}, function(err, answer) {
			console.log(answer);
		})

		res.send(200);
	});
}

exports.createQuestion = function(req, res) {

	// Insert all the question's tags as ObjectId's
	// TODO implement tags

	console.log(req.body);
	var data = {
		author 		: req.body.author,
		text   		: req.body.text,
		context		: req.body.context,
		timestamp   : Math.round(new Date().getTime() / 1000),
		// tags        : mytags,
		fromLanguage: req.body.fromLanguage._id,
		toLanguage  : req.body.toLanguage._id,
		answers 	: [],
		topAnswer	: null,
		score  		: 0,
		comments  	: []
	};
	console.log(data);
	Question.create(data, function(err, question){

		if (err)
			res.send(err);

		console.log('SUCCESS in creating question');
		console.log(question);
		User.update({_id : question.author}, {$push: {questions: question._id}}, function(err, questionID){
			if (err)
			{
				console.log('ERROR in updating User by adding their questionID');
				res.send(err);
			}
			res.json(question);
		});
	});
};

exports.createAnswer = function(req, res) {

	//TODO: remove
	console.log(req.body);

	var author = req.body.author;
	console.log("Author: ", author);

	var data = {
		author			: req.body.author,
		question		: req.body.question,
		translation		: req.body.translation,
		supplementary	: req.body.supplementary,
		// upvotes			: 0,
		// downvotes		: 0,
		score			: 0,
		timestamp		: Math.round(new Date().getTime() / 1000),
		comments		: [],
		votes 			: []
	};
	Answer.create(data, function(err, answer) {

		if (err)
		{
			console.log("Error creating answer: ", err);
			res.send(err);
			return;
		}

		User.addAnswer(answer.author, answer._id, function(err, answerID) {
			Question.addAnswer(answer.question, answer._id, function(err, answerID) {


				res.json(answer);

				// TODO:  When we return it, we need to populate the author info too!
				// answer.populate('author', '_id name facebook', function(err, answer) {
				// 	//stuff...
				// });

			});
		});
	});
}

/** Create a comment */

exports.createComment = function(req, res) {

	console.log("createComment()");

	var type = req.body.type;
	// var parentID = new ObjectId(req.body.parentID);
	var parentID = req.body.parentID;

	var comment = {
		text		: req.body.text,
		timestamp	: Math.round(new Date().getTime() / 1000),
		author 		: req.body.author
	}


	console.log(type);
	console.log(comment);

	var createCommentCallback = function(err, comment) {
		if (err) {
			console.log('ERROR in creating comment: ' + err);
			res.send(err);
		} else {
			console.log(comment);
			res.send(comment);
		}
	};

	if (type == "question") {

		console.log("Creating a question comment...");
		Question.postComment(parentID, comment, createCommentCallback);
	}
	else if (type == "answer") {

		console.log("Creating an answer comment...");
		Answer.postComment(parentID, comment, createCommentCallback);
	}



};

/**
 * List all questions.
 * TODO: change to something more useful
 */
exports.questionlist = function(req, res) {

	Question.find(function(err, questions) {

		if (err)
			res.send(err)

		res.json(questions);
	});
};


/** FROM tags.js */
//Load model


/**
 * List all tags.
 * TODO: Change to something useful.
 */
 exports.taglist = function(req, res) {

 	Tag.find(function(err, tags) {

 		if (err)
 			res.send(err)

 		res.json(tags); // return all tags in JSON format
 	});
 };

/** FROM users.js */
//Load model


/***********************************
 * Public Pages */

exports.profilePage = function(req, res) {
	var userID = req.params.userID;

	User.findOne({_id: userID})
		.populate('followers', '_id name facebook')
		.populate('followingUsers', '_id name facebook')
		.populate('followingTags')
		.populate('languages')
		.populate('nativeLanguage')
		.exec(function(err, user) {

			if (err)
				res.send(err);	//TODO: handle error better

			// Get the number of questions for comparison later
			var numQuestions = (user.questions.length < 3 ? user.questions.length : 3);
			var numAnswers = (user.answers.length < 3 ? user.answers.length : 3);
			
			// Get stories for only the last three questions and answers
			var questionStories = [];
			for (var i = user.questions.length - 3; i < user.questions.length; i++)
			{
				if (i < 0)
					continue;
				Story.createFromQuestionId(user.questions[i], function(err, story) {

					questionStories.push(story);
					complete();
				});
			}

			var answerStories = [];
			for (var i = user.answers.length - 3; i < user.answers.length; i++)
			{
				if (i < 0)
					continue;
				Story.createFromAnswerId(user.answers[i], function(err, story) {

					answerStories.push(story);
					complete();
				});
			}
			// We should only arrive here if there are no questions or answers
			console.log('No Questions or Answers for this user, tell complete() we\'re done');
			complete();

			// Gets called anywhere from 0 to 6 times to check if we're finished and then return the results
			function complete() {

				// Do not go on until we have the expected number of stories
				if (questionStories.length != numQuestions || answerStories.length != numAnswers)
					return;
				var pageData = {
					title			: 'Profile | Social Translator',
					user			: user,
					questionStories	: questionStories,
					answerStories	: answerStories
				};
				res.json(pageData);
			};
		});
};

exports.loggedInProfilePage = function(req, res) {
	
	if (req.isAuthenticated()) {
		var pageData = {
			title		: 'Profile | Social Translator',
			user		: req.user
		};
		res.render('profile', pageData);
	} 
	else {
		res.redirect('/login/');
	}
};

/***********************************
 * Pages for authentication */

exports.loginPage = function(req, res) {

	var pageData = {
		title		: 'Login or register | Social Translator'
	};
	res.render('login', pageData);
};

exports.doLogin = function(req, res) {
	passport.authenticate('local', {
		successRedirect : "/",
		failureRedirect : "/#/login",
	});
};

exports.facebookAuthCallback = function(req, res) {
	res.redirect('/');	//Redirect home to the news feed.
}

/**
 * Get a user by their ID.
 */
exports.getByID = function(req, res) {
	var userID = req.params.userID;

	User.findOne({_id: userID}, function(err, user) {

		if (err)
			res.send(err);

		res.json(user);
	});
};

/**
 * List all users.
 */
exports.userlist = function(req, res) {

	User.find()
	.exec(function(err, users) {

		if (err)
			res.send(err)

		res.json(users);
	});
};

/** POST requests for the User */
// When the current logged in user (followerID) decides to follow someone else
exports.addFollower = function(req, res) {

	var followerID = req.body.followerID;
	var userFollowedID = req.body.userFollowedID;
	
	User.update({_id: followerID}, {
		$push: {followingUsers : userFollowedID}
	});
	User.update({_id: userFollowedID}, {
		$push: {followers: followerID}
	});
};

// When the current logged in user (followerID) unfollowers someone else
exports.removeFollower = function(req, res) {

	var followerID = req.body.followerID;
	var userFollowedID = req.body.userFollowedID;
	
	User.update({_id: followerID}, {
		$pull: {followingUsers : userFollowedID}
	});
	User.update({_id: userFollowedID}, {
		$pull: {followers : followerID}
	});
};

// Update the bio section for the current user
exports.updateBio = function(req, res) {

	var userID = req.body.userID;
	var text = req.body.text;

	User.update({_id: userID}, {
		bio: text
	}, 
	function(err, user) {

		if (err)
			res.send(err);
		res.send('200');
	});
};

exports.addTag = function(req, res) {

	var userID = req.body.userID;
	var tagID = req.body.tagID;

	User.update({_id: userID}, {
		$push: {followingTags : tagID}
	},
	function(err, user) {
		if (err)
			res.send(err);
		res.send('200');
	});
}

exports.removeTag = function(req, res) {

	var userID = req.body.userID;
	var tagID = req.body.tagID;

	User.update({_id: userID}, {
		$pull: {followingTags: tagID}
	},
	function(err, user) {
		if (err)
			res.send(err);
		res.send('200');
	});
};

// Adds the given language to the given user
exports.addLanguage = function(req, res) {

	var userID = req.body.userID;
	var languageID = req.body.languageID;
	User.update({_id: userID}, {
		$push: {languages: languageID}
	},
	function(err, user) {
		if (err)
			res.send(err);
		res.send('200');
	});
};

// Removes the given language from the given user
exports.removeLanguage = function(req, res) {

	var userID = req.body.userID;
	var languageID = req.body.languageID;
	User.update({_id: userID}, {
		$pull: {languages: languageID}
	},
	function(err, user) {
		if (err)
			res.send(err);
		res.send('200');
	});
};

/**
 *	Returns the questions and top rate question for News Feed and Search Results
 */
exports.getStories = function(req, res) {
	var type = req.params.type;
	var condition = req.params.condition;

	console.log('Type: ' + type);

	//TODO probably some sort of scrubbing of the condition;

	//get all of the questions and answers that:
	if (type == 'news')
	{
		//belong in users news feed
		//TODO implement this
		User.findOne({_id: condition}, function(err, user) {

			if (err)
				res.send(err);	//TODO: handle error better
			console.log(user);

			res.json(user);
		});
	}
	else if (type == 'search')
	{
		console.log('Searching for: ' + condition);

		//TODO write better search
		var regex = new RegExp( condition+'?', "i");
		Question.find({ text: regex}, function(err, questions) {
			if (err)
				res.send(err)
			console.log(questions);
			res.json(questions);
		});

		// Question.find(function(err, questions) {

		// 	if (err)
		// 		res.send(err)

		// 	res.json(questions);
		// });
	}	
};