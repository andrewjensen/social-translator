//Load model
var Users = require('../models/user.js');
var Tags = require('../models/tag.js');
var Questions = require('../models/question.js');
var Answers = require('../models/answer.js');

/***********************************
 * Pages */

exports.profilePage = function(req, res) {
	var username = req.params.username;

	Users.findOne({username: username}, function(err, user) {

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

}

exports.loggedInProfilePage = function(req, res) {
	
	//TODO: implement

	res.send("TODO: implement the profile page!");

}


/***********************************
 * API Calls */

/**
 * Get a user by their username.
 */
exports.getByUsername = function(req, res) {
	var username = req.params.username;

	Users.findOne({username: username}, function(err, user) {

		if (err)
			res.send(err);

		res.json(user);
	});
}

/**
 * List all users.
 */
exports.list = function(req, res) {

	Users.find(function(err, users) {

		if (err)
			res.send(err)

		res.json(users);
	});

};
