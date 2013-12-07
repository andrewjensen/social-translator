//Load model
var Users = require('../models/user.js');


/***********************************
 * Pages */

exports.profilePage = function(req, res) {
	var username = req.params.username;

	Users.findOne({username: username}, function(err, user) {

		if (err)
			res.send(err);	//TODO: handle error better
		
		var pageData = {
			title		: 'Profile | Social Translator',
			user		: user
		};
		res.render('profile', pageData);
	});

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
