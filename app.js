
/**
 * Load module dependencies.
 */
var express		= require('express');
var mongoose	= require('mongoose');
var http		= require('http');
var path		= require('path');
var passport	= require('passport');

/**
 * Load application-specific settings and models.
 */
var config = require('./config.json');

/**
 * Configure Passport for authentication.
 */
require('./util/passport.js')(passport, config);

/**
 * Load other Useful Libraries
 */

var async = require('./util/async.js');

/**
 * Start the Express application.
 */
var app = express();

// app.set('port', process.env.PORT || 3000);
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.sessionSecretKey));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development environment only
if ('development' == app.get('env')) {
	console.log("Running on a Development environment.");
	app.use(express.errorHandler());
}



/**
 * Connect to the database.
 */
mongoose.connect(config.database.url);

/**
 * Define routes.
 */
require('./controllers/routes.js')(app, passport);


// var Question	= require('./models/question.js');
// var Answer		= require('./models/answer.js');
// var User		= require('./models/user.js');





/**
 * Everything's ready to go!
 */
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
