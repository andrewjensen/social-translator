
/*
 * GET home page.
 */
var Question 	= require('../models/question.js');
var Answer 		= require('../models/answer.js');
var User 		= require('../models/user.js'); 

exports.index = function(req, res) {

	console.log("Is the user authenticated?");
	console.log(req.isAuthenticated());

	if (req.isAuthenticated()) {
		res.render('newsfeed', { title: 'Social Translator', user: req.user });
	} else {
		res.render('home', { title: 'Social Translator'});
	}
};



/***********************************
 * API Calls */

 /**
  *	Returns template used for News Feed and Search Results
  */
exports.getFeedTemplate = function(req, res) {

	console.log('Getting the feed (ctrl: feed.js)');
	res.render('feed');
}
/**
 *	Returns the questions and top rate question for News Feed and Search Results
 */
exports.getFeed = function(req, res) {
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