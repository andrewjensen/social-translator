//Load models
var Question	= require('../models/question.js');



exports.profilePage = function(req, res) {
	var username = req.params.username;

	//TODO: plug into the MongoDB for this
	var user = {
		fullName	: username + ' Smith'
	};

	var pageData = {
		title		: 'Profile | Social Translator',
		user		: user
	};
	res.render('profile', pageData);
}




// TODO: remove this old function
exports.list = function(req, res) {
	res.send("respond with a resource");
};