'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.checkAuth = function() {
        	console.log('test');
        	if (!Authentication.isAgent()) {
        		console.log('test1');
        		$location.path('signin');
        	}
        }
    }
    ]);
