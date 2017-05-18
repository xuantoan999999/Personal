var popupOrderCtrl = (function () {
    'use strict';

    angular
        .module('bzOrder')
        .controller('popupOrderCtrl', popupOrderCtrl);

    function popupOrderCtrl($scope, $rootScope, $window, $state, $stateParams, $bzPopup, $uibModal, $uibModalInstance,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, orderSvc, order, statusOrderList, shipperList, permission, productSvc, shippingfeeSvc) {
        /* jshint validthis: true */

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', ['add', 'edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/


        // Vars
        $scope.statusOrder = statusOrderList;
        $scope.shipperList = shipperList;
        $scope.urlImg = settingJs.configs.uploadDirectory.thumb_product;
        $scope.listIdCateOnsaleAffternoon = $rootScope.promotionForOrderDeleveryOnAffternoon.listCateApply;
        $scope.listCateException = $rootScope.promotionForOrderDeleveryOnAffternoon.listCateException;

        // Init
        $scope.orderDetail = order;
        $scope.isFirstOder = false;
        checkFirstOrder();

        // Methods
        $scope.updateOrderDetail = updateOrderDetail;
        $scope.checkImgOld = productSvc.checkImgOld;
        $scope.onChangeDeliveryType = onChangeDeliveryType;
        $scope.caculatingOnSaleAffternoon = caculatingOnSaleAffternoon;
        $scope.totalNotOnSale = totalNotOnSale;
        // Function
        function updateOrderDetail(form) {

            // Caculating total pay
            $scope.orderDetail.total_pay = ($scope.orderDetail.total + $scope.orderDetail.payment_info.info.shipping_fee)
                - $scope.orderDetail.coupon.value
                - (($scope.orderDetail.delivery_time == 'CHIEU') ?
                    ($rootScope.promotionForOrderDeleveryOnAffternoon.type
                        == "PC" ?
                        (($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * $scope.caculatingOnSaleAffternoon())
                        : $rootScope.promotionForOrderDeleveryOnAffternoon.value)
                    : 0)
                - ($scope.isFirstOder ?
                    ($rootScope.promotionForFirstOrder.type == "MN" ?
                        $rootScope.promotionForFirstOrder.value
                        : (($rootScope.promotionForFirstOrder.value / 100) * $scope.totalNotOnSale()))
                    : 0);

            orderSvc.update({
                order: $scope.orderDetail
            }, $scope.orderDetail._id).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Thành công!',
                        message: 'Cập nhật đơn hàng thành công!'
                    }
                });
                $uibModalInstance.close($scope.orderDetail);
            }).catch(function (err) {
                form.$submitted = false;
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Lỗi!',
                        message: resp.err.message
                    }
                });
            })
        }
        // Util intersection two array
        function intersection(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t;
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        function caculatingOnSaleAffternoon() {
            var total_tmp = 0; // tổng các sản phầm thuộc category được áp dụng
            $scope.orderDetail.order_detail.forEach(function (item, index) {
                var catesProd = item.product.category.map(function (cat) {
                    return ('' + cat);
                });
                if (intersection(catesProd, $scope.listIdCateOnsaleAffternoon).length > 0 && item.id_promote.id == null && intersection(catesProd, $scope.listCateException).length == 0) {
                    total_tmp += item.total
                }
            });
            return total_tmp;
        };

        function totalNotOnSale() {
            let total_no_onsale = 0;
            $scope.orderDetail.order_detail.forEach(function (item, index) {
                if (item.id_promote.id == null) {
                    total_no_onsale += item.total;
                }
            });
            return total_no_onsale;
        }

        function onChangeDeliveryType() {
            if ($scope.orderDetail.delivery_type == 'CT') {
                $scope.orderDetail.payment_info.info.shipping_fee = 0;
            } else {
                $scope.orderDetail.payment_info.info.shipping_fee = order.shipping_fee.fee;
            }
        }

        function checkFirstOrder() {
            if ($scope.orderDetail.payment_info.info.user_id) {
                bzResourceSvc.api($window.settings.services.admin + '/order/' + $scope.orderDetail.payment_info.info.user_id._id + '-' + $scope.orderDetail._id)
                    .get({}, function (resp) {
                        if (!$scope.orderDetail.old_id && resp.success)
                            $scope.isFirstOder = resp.success;
                    }), function (err) {
                        console.log('checkFirstOrder', err);
                    };
            }
        }

        $scope.editUserShipping = function editUserShipping() {
            $state.go('user-shipping', { id: $scope.orderDetail.payment_info.info.user_id._id });
            $uibModalInstance.close($scope.orderDetail.payment_info.info.id_shipping_address);
        }
    }
})();