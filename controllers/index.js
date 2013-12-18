
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

			// console.log("The user is authenticated:", req.user);
			// console.log("Adding cookie...");

			//Set cookies so that Angular can connect later through the API.
			// var authCookies = {
			// 	accessToken		: req.user.accessToken,
			// 	userID			: req.user._id.toString()
			// };
			// res.setHeader("Set-Cookie", cookies.createString(authCookies));
			res.setHeader("Set-Cookie", "accessToken="+req.user.accessToken);
			res.setHeader("Set-Cookie", "userID="+req.user._id.toString());
			res.setHeader("Set-Cookie", "facebookID="+req.user.facebook.id);
			res.setHeader("Set-Cookie", "name="+req.user.name);

			res.render('index', { title: 'Social Translator', user: req.user, languages: languageList });
		} else {
			res.render('index', { title: 'Social Translator', user: null, languages: languageList});
		}
	});
};