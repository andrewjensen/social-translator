angular.module('components', [])

	.directive('story', function () {
		// body...
		return {
			restrict: 'E',
      		templateUrl: '/template/story.ejs',
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
					'<input type="text" class="form-control" ng-enter="postComment()" value="" placeholder="Write a comment..."/>' +
				'</div>' +
			'</div>',
			replace: true
		}
	})
	.directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if(event.which === 13) {
					scope.$apply(function(){
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	});