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
				'<div>' +
					'<div class="tags">' +
							'<span class="tag tag-language"></span> to' +
							'<span class="tag tag-language">{{story.question.toLanguage}}</span> |' +
					'</div>' +

					'<div class="tags" ng-repeat="tag in story.tags">' +
							'<span class="tag">{{tag}}</span>' +
					'</div>' +
				'</div>',
			replace: true
		};
	})
	.directive('userComment', function() {
		return {
			restrict: 'E',
			template: 
			'<div class="comment user-comment">' + 
				'<a class="profile" href="#/profile/{{currentUser._id}}">' +
					'<img src="http://graph.facebook.com/{{currentUser.facebook.id}}/picture?type=square" />' +
				'</a>' +
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