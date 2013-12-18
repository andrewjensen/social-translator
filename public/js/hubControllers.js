var hubControllers = angular.module('hubControllers', []);

/** Login */
hubControllers.controller('LoginCtrl', ['$scope', '$http', 

	function ($scope, $http) {
		//TODO: write the api and conect it
	$http.get('')
			.success(function(data) {

			});
			// .error(function(data) {
				
			// });
	}]
);

/** Search */
hubControllers.controller('SearchCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var phrase = $routeParams.phrase;

		$http.get('/api/search/52ab55bfde63fb1250282e75/' + phrase)
			.success(function(data) {
				$scope.stories = data;
				$scope.page = {title : "Results"};
			});
			// .error(function(data) {
				
			// });

		//TODO use this effectively or get rid of it
		$scope.orderProp = 'text';
	}]
);


/**	News Feed */
hubControllers.controller('NewsFeedCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var userid = $routeParams.userid;

		//TODO: write the api and conect it
		$http.get('/api/feed/news/' + userid)
			.success(function(data) {
				$scope.user = data;
				$scope.page = {title : "News Feed"};
			});
			// .error(function(data) {
				
			// });

		//TODO use this effectively or get rid of it
		$scope.orderProp = 'text';
	}]
);


/**	Profile Page */
hubControllers.controller('ProfileCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var userid = $routeParams.userid;
		//TODO: write the api and conect it
		$http.get('api/profile/' + userid)
			.success(function(data) {
				$scope.user = data.user;
				//$scope.followers = data.user.followers;
			});
			// .error(function(data) {
				
			// });
	}]
);


/** Translation Page */
hubControllers.controller('TranslationCtrl', ['$scope', '$http', '$routeParams',

	function ($scope, $http, $routeParams) {
		var questionid = $routeParams.questionid;
		//TODO: write the api and conect it
		$http.get('/api/question/' + questionid)
			.success(function(data) {
				$scope.question = data.question;
			});
			// .error(function(data) {
				
			// });

		$scope.postComment = function() {
			console.log("You posted a comment!");
		};
	}]
);


/**	Create question Page */
hubControllers.controller('CreateQuestionCtrl', ['$scope', '$http',

	function ($scope, $http) {
		//TODO: write the api and conect it
		$http.get('/api/languages/')
			.success(function(data) {
				$scope.languages = data;
			});
			// .error(function(data) {
				
			// });
		
		$scope.createQuestion = function() {
			console.log($scope.formData);
			//TODO remove this
			$scope.formData.author = "52b099007dffc8760c000003";
			$http.post('api/question/create', $scope.formData)
			.success(function(data){
				//Redirect them to the translation page
				console.log(data);
				questionId = data._id;
				window.location.href = '#/translation/' + questionId;
			});
			// .error(function(data) {
			// 	// TODO tell the user
			// });
	    }
	}]
);
