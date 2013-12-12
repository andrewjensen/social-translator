
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
		res.render('index', { title: 'Social Translator'});
	}
};