var Answer	= require('../models/answer.js');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var Language = require('../models/language.js');
var Story = require('../models/story.js');

/** Language Calls */
exports.languagelist = function(req, res) {

	Language.find(function(err, languages) {

		if (err)
			res.send(err);
		res.json(languages);
	});
};

exports.searchPage = function(req, res) {

	var phrase = req.body.phrase;
	var fromLanguage = req.body.fromLanguage;
	var toLanguage = req.body.toLanguage;

	// TODO, change to getting the questions with the top-scored answers that match the text
	Question.Find({text: new RegExp('^'+phrase+'$', "i")}, function(err, questions) {


	});
};

// TODO, populate the newsfeedpage for a given user using timestamps
// (I don't know what the newsfeed page uses)
exports.newsfeedPage = function(req, res) {


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
		.populate('language', '_id name')
		.populate('tags')
		.populate('answers')
		.populate('author', '_id username')
		.exec(function(err, question) {
			if (err)
				res.send(err);

			var options = {
				path: 'answers.comments.userID',
				model: 'users',
				select: '_id username'
			};
			Question.populate(question, options, function (err, question1){

				if (err)
					res.send(err);

				var newoptions = {
					path: 'answers.author',
					model: 'users',
					select: '_id username'
				}
				Question.populate(question1, newoptions, function(err, question2){
					var pageData = {
						title		: 'Question | Social translator',
						question    : question2
					};
					res.json(pageData);
				});
			});
		});
};

exports.createQuestion = function(req, res) {
	console.log('GOT HERE: ', req.body.text);
	Question.create({
		author 		: req.body.author,
		text   		: req.body.text,
		context		: req.body.context,
		timestamp   : Math.round(new Date().getTime() / 1000),
		tags        : req.body.tags,
		fromLanguage: req.body.fromLanguage,
		toLanguage  : req.body.toLanguage,
		answers 	: [],
		topAnswer	: null,
		score  		: 0,
		comments  	: []
	}, function(err, question){

		if (err)
			res.send(err);

		console.log('SUCCESS in creating question');
		User.update({_id : question.author}, 
		{$push: 
			{questions: question._id}
		}, 
		function(err, questionID){
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

	Answer.create({
		author			: req.body.author,
		question		: req.body.questionID,
		translation 	: req.body.translation,
		supplementary	: req.body.supplementary,
		upvotes			: 0,
		downvotes		: 0,
		score 			: 0,
		timestamp		: Math.round(new Date().getTime() / 1000),
		comments		: []
	}, function(err, answer) {

		if (err)
			res.send(err);
		User.update({_id : answer.author},
			{$push: {answers: answer._id}
		});
		Question.update({_id : answer.question}, 
			{$push: {answers: answer._id}
		});
		res.json(answer);
	});
}

/** Create a comment */

exports.createComment = function(req, res) {

	var type = req.params.type;
	var parentID = req.params.id;
	var ParentType;
	if (type == "question")
		ParentType = Question;
	else if (type == "answer")
		ParentType = Answer;

	ParentType.update({_id : parentID}, 
		{$push: 
			{comments: {
				text		: req.body.text,
				timestamp	: Math.round(new Date().getTime() / 1000),
				userID 		: req.body.userID
				}
			}
		}, function(err, comment){

			if (err)
			{
				console.log('ERROR in creating comment: ' + err);
				res.send(err);
			}
			res.send('200');
	});
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
		.populate('followers', '_id username')
		.populate('followingUsers', '_id username')
		.populate('followingTags')
		.populate('languages')
		.populate('nativeLanguage')
		.exec(function(err, user) {

			if (err)
				res.send(err);	//TODO: handle error better

			// Get stories for only the last three questions and answers
			var questionStories = [];
			for (var i = user.questions.length - 3; i < user.questions.length; i++)
			{
				if (i < 0)
					continue;
				questionStories.push(Story.createFromQuestionId(user.questions[i]));
				console.log('question: ', user.questions[i]);
			}

			var answerStories = [];
			for (var i = user.answers.length - 3; i < user.answers.length; i++)
			{
				if (i < 0)
					continue;
				answerStories.push(Story.createFromAnswerId(user.answers[i]));
				console.log('answer: ', user.answers[i]);
			}

			var pageData = {
				title			: 'Profile | Social Translator',
				user			: user,
				questionStories	: questionStories,
				answerStories	: answerStories
			};
			res.json(pageData);
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
 * Get a user by their username.
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
 * Get a user by their username.
 */
exports.getByUsername = function(req, res) {
	var username = req.params.username;

	User.findOne({username: username}, function(err, user) {

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