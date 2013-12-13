angular.module('components', [])

	.directive('story', function () {
		// body...
		return {
			restrict: 'E',
      		templateUrl: '/template/story.ejs'
	    };
	});