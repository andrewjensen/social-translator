var hubControllers = angular.module('hubControllers', []);



hubControllers.factory('auth', ['$cookies', '$cookieStore', function($cookies, $cookieStore) {
	var currentUser = null;

	return {

		login: function() {
			console.log("Redirecting to login page");
			window.location.href = '#/login/';
		},

		logout: function() {
			//clear the user object
			currentUser = null;

			//delete the authentication cookies.
			$cookieStore.remove("userID");
			$cookieStore.remove("name");
			$cookieStore.remove("accessToken");
			$cookieStore.remove("facebookID");

			// $cookies.userID = "";
			// $cookies.name = "";
			// $cookies.accessToken = "";
			// $cookies.facebookID = "";
		},

		isLoggedIn: function() {
			return (this.currentUser() != null);
		},

		currentUser: function() {

			if (currentUser != null) {

				//We've already created the user.
				return currentUser;

			} else if ($cookies.userID != null && $cookies.accessToken != null) {

				//We have cookies, so create the user and return it.
				currentUser = {
					_id:			$cookies.userID,
					name:			$cookies.name,
					accessToken:	$cookies.accessToken,
					facebook:		{
						id : $cookies.facebookID
					}
				};
				return currentUser;

			} else {

				//The user has no cookies, so it isn't logged in.
				return null;

			}
		}
	};
}]);

/** Welcome */
hubControllers.controller('WelcomeCntrl', ['$scope', '$http', 

	function ($scope, $http) {
		$http.get('/api/users/')
			.success(function(data) {
				$scope.users = data;
				console.log('users', $scope.users);
			});

		$http.get('/api/stories/')
			.success(function(data) {
				$scope.stories = data;
				console.log('stories', $scope.stories);
			});
		
		// $http.get('/api/')
	}]
);


/** Login */
hubControllers.controller('LoginCtrl', ['$scope', '$http', 

	function ($scope, $http) {
		//TODO: write the api and conect it
		// $http.get('')
		// 	.success(function(data) {

			//});
			// .error(function(data) {
				
			// });
	}]
);

hubControllers.controller('LogoutCtrl', ['$scope', '$http', 'auth',

	function ($scope, $http, auth) {

		console.log("Logging out.");
		auth.logout();
		console.log(auth.currentUser());

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
		var language = $routeParams.language;

		$http.get('/api/search/' + language + '/' + phrase)
			.success(function(data) {
				$scope.stories = data;
				$scope.page = {
					title : "Results For How to Say",
					phrase: phrase,
				};
			});
			// .error(function(data) {
				
			// });

		//TODO use this effectively or get rid of it
		$scope.orderProp = 'text';

		$scope.createQuestion = function () {
			window.location.href = "#/create";
		}
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
hubControllers.controller('ProfileCtrl', ['$scope', '$http', '$routeParams', 'auth',

	function ($scope, $http, $routeParams, auth) {
		var userid = $routeParams.userid;

		$scope.currentUser = auth.currentUser();

		console.log($scope);

		$http.get('api/profile/' + userid)
			.success(function(data) {

				//TODO: remove debugging
				console.log("Received data!");
				console.log(data);

				$scope.user = data.user;
				$scope.questionStories = data.questionStories;
				$scope.answerStories = data.answerStories;
				//$scope.followers = data.user.followers;
			});
			// .error(function(data) {
				
			// });
	}]
);


/** Translation Page */
hubControllers.controller('TranslationCtrl', ['$scope', '$http', '$routeParams', 'auth',

	function ($scope, $http, $routeParams, auth) {
		var questionid = $routeParams.questionid;

		$scope.currentUser = auth.currentUser();

		$http.get('/api/question/' + questionid)
			.success(function(data) {
				$scope.question = data.question;
			});
			// .error(function(data) {
				
			// });

		$scope.postComment = function(elementType, elementID, text) {
			// console.log("You posted a comment!");
			// console.log($scope);

			//Redirect to login if the user hasn't authenticated
			if (!auth.isLoggedIn()) {
				auth.login();
				return;
			}
			
			var formData = {
				type:		elementType,
				parentID:	elementID,
				author:		auth.currentUser()._id,
				text:		text
			};
			$http.post('/api/comment/create', formData)
			.success(function(data) {

				console.log("Success!");

				//Clear the text box
				$scope.comment = "";

				//Create the comment
				var comment = data;
				comment.author = auth.currentUser();

				//TODO: make it work for answers
				if (elementType == "question") {
					$scope.question.comments.push(data);
				} else if (elementType == "answer") {
					
					for (answer in $scope.question.answers)
						if ($scope.question.answers[answer]._id == elementID)
							$scope.question.answers[answer].comments.push(comment);
				}
			});
		};

		$scope.postAnswer = function() {

			//Redirect to login if the user hasn't authenticated
			if (!auth.isLoggedIn()) {
				auth.login();
				return;
			}

			//Prepare form data.
			$scope.formData.question	= $scope.question._id;
			$scope.formData.author		= auth.currentUser()._id;
			//TODO: remove debugging
			console.log("Form data:", $scope.formData);

			//Submit the form.
			$http.post('/api/answer/create', $scope.formData)
			.success(function(data) {

				$scope.formData.translation = "";
				$scope.formData.supplementary = "";

				//TODO: Make this better!

				//Redirect them back to the translation page
				console.log("Received this data from the server: ", data);
				// window.location.href = '#/translation/' + $scope.question._id;

				var newAnswer = data;
				newAnswer.author = auth.currentUser();
				$scope.question.answers.push(newAnswer);
			});

		};
	}]
);


/**	Create question Page */
hubControllers.controller('CreateQuestionCtrl', ['$scope', '$http', 'auth',

	function ($scope, $http, auth) {

		$scope.currentUser = auth.currentUser();

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

			//Redirect to login if the user hasn't authenticated
			if (!auth.isLoggedIn()) {
				auth.login();
				return;
			}

			var author = auth.currentUser()._id;
			$scope.formData.author = author;

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
