/**
 * routes.js
 */
module.exports = function(app, passport) {

	var index		= require('./index.js');
	var api         = require('./api.js');

	/** INDEX */

	app.get('/', index.index);

	/** AUTHENTICATION DATA */

	app.post('/login', api.doLogin);
	app.get("/auth/facebook",
		passport.authenticate("facebook", {scope: "email"})
	);
	app.get("/auth/facebook/callback",
		passport.authenticate("facebook",{ failureRedirect: '/login'}),
		api.facebookAuthCallback
	);
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/** API CALLS */

	// Basic, get-all for a model
	app.get('/api/tags/', api.taglist);
	app.get('/api/users/', api.userlist);
	app.get('/api/questions/', api.questionlist);
	app.get('/api/answers/', api.answerlist);
	app.get('/api/languages/', api.languagelist);

	app.get('/api/users/:userID', api.getByID);
	app.get('/api/feed/:type/:condition', api.getStories);

	// GET API's for each page
	app.get('/api/profile/:userID', api.profilePage);
	app.get('/api/question/:questionID', api.translationPage);

	// POST API's for each page
	app.post('/api/question/create', api.createQuestion);

	// Update methods for profile page
	//app.post('/api/profile/addFollower', api.addFollower);
	//app.post('/api/profile/removeFollower', api.removeFollower);
};