/**
 * routes.js
 */
module.exports = function(app) {

	var home		= require('./home.js');
	var users		= require('./users.js');

	var questions	= require('./questions.js');
	var answers		= require('./answers.js');

	//Define routes for HTML...
	app.get('/', home.index);
	app.get('/user/:username', users.profilePage);
	app.get('/question/:questionID', questions.translationPage);


	//Define API routes...
	app.get('/api/questions/', questions.list);
	app.get('/api/answers/', answers.list);

	
	//Old leftovers...
	// app.get('/users', users.list);
};
