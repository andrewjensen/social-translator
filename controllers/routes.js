/**
 * routes.js
 */
module.exports = function(app) {

	var home		= require('./home.js');
	var users		= require('./users.js');
	var questions	= require('./questions.js');
	var answers		= require('./answers.js');
	var tags        = require('./tags.js');

	//Define routes for HTML...

	app.get('/', home.index);
	app.get('/user/:username', users.profilePage);
	app.get('/question/:questionID', questions.translationPage);

	app.get('/profile/', users.loggedInProfilePage);

	//Define API routes...

	app.get('/api/users/', users.list);
	app.get('/api/users/:username', users.getByUsername);

	app.get('/api/questions/', questions.list);

	app.get('/api/answers/', answers.list);
	app.get('/api/tags/', tags.list);

	
	//Old leftovers...
	// app.get('/users', users.list);
};
