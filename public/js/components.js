angular.module('components', [])

	.directive('story', function () {
		// body...
		return {
			restrict: 'E',
      		templateUrl: '/template/story.ejs',
	    };
	})
	.directive('profilePic', function () {
		// body...
		return {
			restrict: 'E',
      		controller: function($scope, $element){
				$scope.story._id;
			},
      		template: 
      			'<a href="#/profile/{{user._id}}" class="profile">' + 
				'<img src="/images/profile-default.jpg">' +
				'</a>',
      		replace: true
	    };
	})
	.directive('tag', function () {
		return {
			restrict: 'E',
			template:
				'<div class="tags" ng-repeat="tag in story.tags">' +
						'<span class="tag">{{tag}}</span>' +
				'</div>',
			replace: true
		};
	})
	.directive('userComment', function() {
		return {
			restrict: 'E',
			template: 
			'<div class="comment user-comment">' + 
				'<profile-pic></profile-pic>' +
				'<div>' +
					'<input type="text" class="form-control" value="" placeholder="Write a comment..."/>' +
				'</div>' +
			'</div>',
			replace: true
		}
	});