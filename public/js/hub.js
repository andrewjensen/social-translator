/**
*	js for Search Results, News Feed, and Creating a New Question
*/

function search() {
	var searchPhrase = $("#searchbar-question").val();
	window.location.href = '#/search/' + searchPhrase;
}

var translationApp = angular.module('translationApp', [
  'ngRoute',
  'hubAnimations',
  'hubControllers'
]);

//api/questions/query
//api/qusetions/newsfeed/username

translationApp.config(['$routeProvider', function ($routeProvider, $routeParams) {
	$routeProvider.
	//search
	when('/search/:phrase', {
		templateUrl: '/template/story-container.ejs',
        controller: 'QsListCtrl'
	}).
	//newsfeed
	when('/newsfeed/:userid', {
		templateUrl: '/template/story-container.ejs',
        controller: 'NewsFeedCtrl'
	}).
	when(
		'/user/:userid', {
			templateUrl: '/user/52a6546d0d6869237b34c7f8',
			controller: ''
		}	
	).
	//homepage
	otherwise ({
		redirectTo: '/'
	});

}]);