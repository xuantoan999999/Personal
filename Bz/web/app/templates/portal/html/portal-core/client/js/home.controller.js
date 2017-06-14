'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        
        if (!(Authentication.isAgent || Authentication.isSupplier)) {
            $location.path('signin');
        }
    }
    ]);
