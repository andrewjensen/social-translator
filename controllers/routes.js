/**
 * routes.js
 */
module.exports = function(app) {

	var home		= require('./home.js');
	var user		= require('./user.js');

	var questions	= require('./questions.js');
	var answers		= require('./answers.js');

	//TODO: Define routes for HTML...

	//Define API routes...
	app.get('/api/questions/', questions.list);
	app.get('/api/answers/', answers.list);


	//Old leftovers...
	app.get('/', home.index);
	app.get('/users', user.list);
};
