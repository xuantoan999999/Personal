var menuCtrl = (function () {
    'use strict';

    angular
        .module('bzWebHome')
        .controller('menuCtrl', menuCtrl);

    function menuCtrl($scope, $window, $uibModal, $rootScope, orderApiSvc, apiProductSvc, webHomeSvc) {
        // Vars
        var vmM = $scope;
        vmM.showCount = false;

        // Method
        vmM.findCategory = findCategory;
        init();

        // Functions
        function init() {
            webHomeSvc.getMenu().then(function (resp) {
                vmM.listCategory = resp.data;
                vmM.showCount = true;
            })
        }

        function findCategory(id) {
            var category = vmM.listCategory.find(function (item) {
                return item.id == id;
            })
            return '(' + category.product_count + ')';
        }
    }
})();
