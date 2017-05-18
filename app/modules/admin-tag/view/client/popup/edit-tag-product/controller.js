var updatetagProduct = (function () {
    'use strict';

    angular
        .module('bzCoupon')
        .controller('updatetagProduct', updatetagProduct);

    function updatetagProduct($scope, $state, $uibModal, $uibModalInstance, authSvc, data) {
        /* jshint validthis: true */

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Methods
        $scope.update = update;
        // Vars
        $scope.submitted = false;
        $scope.data = data;
        $scope.formData = {
            id_tag: data.id_tag,
            expire_date: data.product.tag_product.expire_date,
            order: data.product.tag_product.order
        }
        // Init

        // Function
        function update() {
            $uibModalInstance.close($scope.formData);
        }

    }
})();