//Load model
var User = require('../models/user.js');
var Tag = require('../models/tag.js');
var Question = require('../models/question.js');
var Answer = require('../models/answer.js');

/***********************************
 * Public Pages */

exports.profilePage = function(req, res) {
	var userId = req.params.userId;

	User.findOne({_id: userId}, function(err, user) {

		if (err)
			res.send(err);	//TODO: handle error better
		var async = require('../util/async.js');
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


/***********************************
 * API Calls */

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
exports.list = function(req, res) {

	User.find(function(err, users) {

		if (err)
			res.send(err)

		res.json(users);
	});

};
