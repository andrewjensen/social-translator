var Answer	= require('../models/answer.js');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var User = require('../models/user.js');

var async = require('../util/async.js');

/**FROM answers.js*/
//Load model


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


exports.translationPage = function(req, res) {

	var questionID = req.params.questionID;

	console.log('questionID: ' + questionID);
	
	Question.findOne({_id: questionID}, function(err, question) {
		if (err)
			res.send(err);	//TODO: handle error better
		console.log('hello world');
		console.log(question);

		var pageData = {
			title		: 'Question | Social Translator',
			question	: question
		};
		res.render('question', pageData);

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
	var userId = req.params.userId;

	User.findOne({_id: userId}, function(err, user) {

		if (err)
			res.send(err);	//TODO: handle error better
		
		async.parallel(
		{
			tags : function(callback){
				Tag.find({_id: { $in : user.followingTags}}, function(err, docs){
					callback(null, docs);
				});
			},
			questions : function(callback){
				Question.find({}, function(err, docs){
					callback(null, docs);
				});
			},
			answers : function(callback){
				Answer.find({}, function(err, docs){
					callback(null, docs);
				});
			},
			following : function(callback){
				User.find({_id: { $in : user.followingUsers}}, function(err, docs){
					callback(null, docs);
				});
			},
			followers : function(callback){
				User.find({_id: { $in : user.followers}}, function(err, docs){
					callback(null, docs);
				});
			}
		}, 
		function(err, results){

			if (err)
				res.send(err);
			console.log(results.tags.length);
			console.log(results.tags.length + ' ' + results.questions.length + ' ' + results.answers.length);
			var pageData = {
				title		: 'Profile | Social Translator',
				user		: user,
				tags		: results.tags,
				questions   : results.questions,
				answers     : results.answers,
				following   : results.following,
				followers   : results.followers
			};
			res.render('profile', pageData);
		});
	});

};

exports.loggedInProfilePage = function(req, res) {
	
	if (req.isAuthenticated()) {
		var pageData = {
			title		: 'Profile | Social Translator',
			user		: req.user
		};
		res.render('profile', pageData);
	} else {
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
		failureRedirect : "/login",
	});
};

exports.facebookAuthCallback = function(req, res) {
	res.redirect('/');	//Redirect home to the news feed.
}

/**
 * Get a user by their username.
 */
exports.getById = function(req, res) {
	var userId = req.params.userId;

	User.findOne({_id: userId}, function(err, user) {

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

	User.find(function(err, users) {

		if (err)
			res.send(err)

		res.json(users);
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
}