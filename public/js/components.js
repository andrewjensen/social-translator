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
      		template: 
      			'<a href="#/profile/{{user._id}}" class="profile">' + 
				'<img src="/images/{{user.username}}.jpg">' +
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
	});