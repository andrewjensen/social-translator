var mongoose			= require('mongoose');
var LocalStrategy		= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var User				= require('../models/user.js');


module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		// console.log("serializeUser");
		// console.log(user);

		// console.log("Saving back into the database...");
		user.save(function (err, user, numberAffected) {
			if (err)
				throw err;

			done(null, user.id);
		});
	});

	passport.deserializeUser(function(id, done) {
		// console.log("deserializeUser");
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		User.isValidUserPassword(email, password, done);
	}));

	passport.use(new FacebookStrategy({
		profileFields:	['id', 'displayName', 'emails', 'photos'],
		clientID:		config.auth.facebook.clientID,
		clientSecret:	config.auth.facebook.clientSecret,
		callbackURL:	config.auth.facebook.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		
		// console.log("DEBUG: inside passport.use");
		// console.log("accessToken: ", accessToken);

		User.findOrCreateFaceBookUser(profile, function(err, user) {
			if (user)
			{
				// console.log("Adding user token...", accessToken);
				user.accessToken = accessToken;
			}
			done(err, user);
		});
	}));
}
