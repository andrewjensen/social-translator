function search() {
	var searchPhrase = $("#searchbar-question").val();
	var language = $("#searchbar-language").val();
	window.location.href = '#/search/' + language + '/' + searchPhrase;
}

function logoutMenu () {
	 $("#menu").is(":visible") ? $("#menu").hide() : $("#menu").show();
}

var translationApp = angular.module('translationApp', [
	'ngRoute',
	'ngAnimate',
	'ngCookies',
	'components',
	'hubControllers'
]);



translationApp.config(['$routeProvider', function ($routeProvider, $routeParams, auth) {
	$routeProvider.
	//	login
	when('/login', {
		templateUrl: '/template/login.ejs',
		controller: 'LoginCtrl'
	}).
	//	logout
	when('/logout', {
		templateUrl: '/template/login.ejs',
		controller: 'LogoutCtrl'
	}).
	//	search
	when('/search/:language/:phrase', {
		templateUrl: '/template/story-container.ejs',
		controller: 'SearchCtrl'
	}).
	//	newsfeed
	when('/newsfeed/:userid', {
		templateUrl: '/template/story-container.ejs',
		controller: 'NewsFeedCtrl'
	}).
	//	profile
	when('/profile/:userid', {
		templateUrl: '/template/profile.ejs',
		controller: 'ProfileCtrl'
	}).
	//	translation
	when(
		'/translation/:questionid', {
		templateUrl: '/template/translation.ejs',
		controller: 'TranslationCtrl'
	}).
	//	create question
	when(
		'/create', {
		templateUrl: '/template/create.ejs',
		controller: 'CreateQuestionCtrl'
	}).
	//	homepage
	otherwise ({
		redirectTo: '/'
	});

}]);