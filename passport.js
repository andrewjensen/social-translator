var mongoose			= require('mongoose');
var LocalStrategy		= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var User				= require('./models/user.js');


module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
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
		clientID: config.auth.facebook.clientID,
		clientSecret: config.auth.facebook.clientSecret,
		callbackURL: config.auth.facebook.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		console.log("DEBUG: inside passport.use");
		User.findOrCreateFaceBookUser(profile, done);
	}));
}
