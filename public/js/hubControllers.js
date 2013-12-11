var hubControllers = angular.module('hubControllers', []);

/**
*	Search 
*/
hubControllers.controller('QsListCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var phrase = $routeParams.phrase;

		$http.get('/api/feed/search/' + phrase).success(function(data) {
			$scope.questions = data;
			$scope.page = {title : "Results"};
		});

		//TODO use this effectively or get rid of it
		$scope.orderProp = 'text';
	}]
);

/**
*	News Feed
*/
hubControllers.controller('NewsFeedCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var userid = $routeParams.userid;

		//TODO: write the api and conect it
		$http.get('/api/feed/news/' + userid).success(function(data) {
			$scope.user = data;
			$scope.page = {title : "News Feed"};
		});

		//TODO use this effectively or get rid of it
		$scope.orderProp = 'text';
	}]
);

/**
*	Create a new phrase to translate
*/
hubControllers.controller('CreateQuestionCtrl', ['$scope', '$http', 

	function ($scope, $http) {
		//TODO: write the api and conect it
		$http.get('/api/questions/').success(function(data) {
			$scope.questions = data;
		});
	}]
);

/**
*	Profile Page
*/
hubControllers.controller('GetProfileCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		//TODO: write the api and conect it
		// $http.get('/api/questions/').success(function(data) {
		// 	$scope.questions = data;
		// });
	}]
);