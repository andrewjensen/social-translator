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
		passport.authenticate("facebook", {failureRedirect: '/login'}),
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
	app.get('/api/search/:languageID/:phrase', api.searchPage);
	app.get('/api/newsfeed/:userID', api.newsfeedPage);

	// POST API's for each page
	app.post('/api/question/create', api.createQuestion);
	app.post('/api/answer/create', api.createAnswer);
	app.post('/api/comment/create', api.createComment);
	app.post('/api/answer/vote', api.voteOnAnswer);

	// Update methods for profile page
	app.post('/api/profile/addFollower', api.addFollower);
	app.post('/api/profile/removeFollower', api.removeFollower);
	app.post('/api/profile/updateBio', api.updateBio);
	app.post('/api/profile/addTag', api.addTag);
	app.post('/api/profile/removeTag', api.removeTag);
	app.post('/api/profile/addLanguage', api.addLanguage);
	app.post('/api/profile/removeLanguage', api.removeLanguage);

	//Type is a string containing "question" or "answer"
	//id is the id number of the given question/answer
	app.post('/api/comment/:type/:id', api.createComment);

	//TODO: REMOVE THESE TEST METHODS
	
	app.get('/api/story/fromQuestion/:questionId', function(req, res) {

		var Story = require('../models/story.js');
		Story.createFromQuestionId(req.params.questionId, function(err, story) {
			if (err)
				res.send(err);

			res.json(story);
		});
	});
	app.get('/api/story/fromAnswer/:answerId', function(req, res) {

		var Story = require('../models/story.js');
		Story.createFromAnswerId(req.params.answerId, function(err, story) {
			if (err)
				res.send(err);

			res.json(story);
		});
	});

	/****************************************
	 * SERVER MAINTENANCE FUNCTIONS
	 */

	app.get('/server/update/', function(req, res) {

		//Create a shell.
		var spawn = require('child_process').spawn;
		var shell = spawn("git", ["pull"]);

		var hasError = false;
		var output = "";

		console.log("Updating source code...");

		shell.stdout.on('data', function (data) {
			output = output + data + "\n";
		});

		shell.stderr.on('data', function (data) {
			output = output + data + "\n";
			hasError = true;
		});

		shell.on('close', function (code) {
			var statusCode = (hasError ? 500 : 200);
			res.send(statusCode, output);
		});

	})

};