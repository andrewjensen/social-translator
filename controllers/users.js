//Load model
//TODO: rename the models to singular!
var User = require('../models/user.js');
var Tags = require('../models/tag.js');
var Questions = require('../models/question.js');
var Answers = require('../models/answer.js');

/***********************************
 * Public Pages */

exports.profilePage = function(req, res) {
	var userId = req.params.userId;

	User.findOne({_id: userId}, function(err, user) {

		if (err)
			res.send(err);	//TODO: handle error better
		//if (user != null)
			//var tags = Tags.find().where('_id').in(user.followingTags);
		
		async.parallel(
		{
			tags : function(callback){
				Tags.find({}, function(err, docs){
					callback(null, docs);
				});
			},
			questions : function(callback){
				Questions.find({}, function(err, docs){
					callback(null, docs);
				});
			},
			answers : function(callback){
				Answers.find({}, function(err, docs){
					callback(null, docs)
				});
			}
		}, 
		function(err, results){

			if (err)
				res.send(err);
			console.log(results.tags.length);
			var pageData = {
				title		: 'Profile | Social Translator',
				user		: user,
				tags		: results.tags,
				questions   : results.questions,
				answers     : results.answers
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
