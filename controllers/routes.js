/**
 * routes.js
 */
module.exports = function(app, passport) {

	var home		= require('./home.js');
	var users		= require('./users.js');
	var questions	= require('./questions.js');
	var answers		= require('./answers.js');
	var tags        = require('./tags.js');

	//Define routes for HTML...
	app.get('/', home.index);
	app.get('/feed', home.getFeedTemplate);


	//Moved all of the views these use to template folder
	// app.get('/user/:userId', users.profilePage);
	// app.get('/question/:questionID', questions.translationPage);
	// app.get('/login/', users.loginPage);
	// app.get('/profile/', users.loggedInProfilePage);


	//Define routes for passing authentication data...

	app.post('/login', users.doLogin);
	app.get("/auth/facebook",
		passport.authenticate("facebook", {scope: "email"})
	);
	app.get("/auth/facebook/callback",
		passport.authenticate("facebook",{ failureRedirect: '/login'}),
		users.facebookAuthCallback
	);
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	//Define API routes...

	app.get('/api/users/', users.list);
	app.get('/api/users/:userId', users.getById);
	// app.get('/api/users/:username', users.getByUsername);

	app.get('/api/questions/', questions.list);

	app.get('/api/answers/', answers.list);

	app.get('/api/feed/:type/:condition', home.getFeed);

	
	//Old leftovers...
	// app.get('/users', users.list);
};