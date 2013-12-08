
/*
 * GET home page.
 */

exports.index = function(req, res) {

	console.log("Is the user authenticated?");
	console.log(req.isAuthenticated());

	if (req.isAuthenticated()) {
		res.render('newsfeed', { title: 'Social Translator', user: req.user });
	} else {
		res.render('home', { title: 'Social Translator'});
	}
};