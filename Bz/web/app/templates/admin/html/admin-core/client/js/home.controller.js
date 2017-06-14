'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if (!Authentication.isAdmin) {
        	$location.path('signin');
        }
    }
    ]);
