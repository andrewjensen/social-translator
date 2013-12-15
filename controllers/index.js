
/*
 * GET home page.
 */
var Question 	= require('../models/question.js');
var Answer 		= require('../models/answer.js');
var User 		= require('../models/user.js'); 
var Language    = require('../models/language.js')

exports.index = function(req, res) {

	console.log("Is the user authenticated?");
	console.log(req.isAuthenticated());

	Language.find()
	.sort('name')
	.exec(function(err, languageList){

		if (req.isAuthenticated()) {
			res.render('index', { title: 'Social Translator', user: req.user, languages: languageList });
		} else {
			res.render('index', { title: 'Social Translator', user: null, languages: languageList});
		}
	});
};