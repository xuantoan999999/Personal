var homeCtrl = (function () {
	'use strict';

	angular
		.module('bzWebHome')
		.controller('homeCtrl', homeCtrl);

	function homeCtrl($scope, $window, $uibModal, $rootScope, orderApiSvc, apiProductSvc, webHomeSvc) {
		// Vars
		var vmHome = $scope;
		vmHome.cartDone = false;

		// Method
		vmHome.popDetPro = apiProductSvc.popupDetailPro;

		vmHome.$on('Cart:getCart', getCart);
		angular.element('.choose-bottom').removeClass('hidden');

		// Functions

		function getCart(event, data) {
			if ($rootScope.Cart) {
				vmHome.cartDone = true;
			}
		}
	}
})();
