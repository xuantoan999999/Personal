var couponAddCtrl = (function () {
    'use strict';

    angular
        .module('bzCoupon')
        .controller('couponAddCtrl', couponAddCtrl);

    function couponAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, couponSvc, shippingfeeSvc, categorySvc, productSvc) {
        /* jshint validthis: true */
        var vmAddCoupons = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon', 'add')))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddCoupons.lockForm = false;
        vmAddCoupons.submitted = false;
        vmAddCoupons.tmp_count = "0";
        vmAddCoupons.tmp_sale = "money";
        vmAddCoupons.optionTimePicker = {
            timePicker: true,
            timePickerIncrement: 30,
            locale: {
                format: 'h:mm DD/MM/YYYY'
            }
        };
        vmAddCoupons.params = $stateParams;
        vmAddCoupons.formData = {
            status: "active",
            sale: {
                is_money: true,
                is_percent: false,
                percent_value: "",
                money_value: ""
            },
            times: 1,
            user_times: 1,
            type: vmAddCoupons.params.type ? vmAddCoupons.params.type : 'single'
        };
        vmAddCoupons.tmp_code_group = '';

        // Methods
        vmAddCoupons.upCase = upCase;
        vmAddCoupons.save = create;
        vmAddCoupons.randomString = randomString;
        vmAddCoupons.checkSale = checkSale;
        vmAddCoupons.addManyCoupon = addManyCoupon;

        // Init
        getDistrict();
        getListCategory();
        getListProduct();

        function getDistrict() {
            shippingfeeSvc.getAllNoPaging().then(function (resp) {
                vmAddCoupons.district = resp.items;
                // console.log('district', vmAddCoupons.district);
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Thêm phiếu mua hàng',
                        message: 'Lỗi server'
                    }
                });
            });
        }

        function getListCategory() {
            bzResourceSvc.api($window.settings.services.admin + '/category')
                .get({
                    limit: 100,
                    page: 1,
                    parrent_id: "*"
                }, function (resp) {
                    vmAddCoupons.listCategory = resp.items;
                });
        };

        function getListProduct() {
            productSvc.add().then(function (resp) {
                vmAddCoupons.listProduct = resp.productList;
            });
        };

        function upCase() {
            if (vmAddCoupons.formData.code) {
                vmAddCoupons.formData.code = vmAddCoupons.formData.code.toUpperCase();
            }
        }

        function create(isValid) {
            vmAddCoupons.submitted = true;
            vmAddCoupons.lockForm = true;
            vmAddCoupons.formData.count = vmAddCoupons.tmp_count == "1" ? true : false;
            console.log(vmAddCoupons.formData);

            if (isValid) {
                let arr_code = vmAddCoupons.formData.code.split(',').concat(vmAddCoupons.tmp_code_group.split(','));

                if (vmAddCoupons.formData.type == 'group') {
                    vmAddCoupons.formData.code_group = vmAddCoupons.tmp_code_group.split(',').map(function (item) {
                        return {
                            code: item,
                            user_times: vmAddCoupons.formData.user_times,
                            times: vmAddCoupons.formData.times
                        }
                    });
                }

                couponSvc.checkIsset({ data: arr_code }).then(function (resp) {
                    if (resp.isset) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Thêm phiếu mua hàng',
                                message: 'Đã tồn tại mã ' + resp.code
                            }
                        });
                        vmAddCoupons.lockForm = false;
                    }
                    else {
                        couponSvc.create(vmAddCoupons.formData).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Thành công',
                                    message: resp.message
                                }
                            });
                            if (vmAddCoupons.params.type == 'group') {
                                $state.go('coupon-group');
                            }
                            else {
                                $state.go('coupon-list');
                            }
                        }).catch(function (error) {
                            console.err("Err", error);
                            vmAddCoupons.lockForm = false;
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Thêm phiếu mua hàng',
                                    message: error.data.message
                                }
                            });
                        });
                    }
                }).catch(function (err) {
                    console.error("Err", err);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Lỗi!',
                            message: 'Thêm coupon bị lỗi'
                        }
                    });
                    vmAddCoupons.lockForm = false;
                });
            }
            else {
                vmAddCoupons.submitted = true;
                vmAddCoupons.lockForm = false;
            }
        };

        function randomString() {
            var length = 5;
            var chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            vmAddCoupons.formData.code = result;
        }

        function checkSale() {
            if (vmAddCoupons.tmp_sale === "money") {
                vmAddCoupons.formData.sale.is_money = true;
                vmAddCoupons.formData.sale.is_percent = false;
                vmAddCoupons.formData.sale.percent_value = "";
            }
            else {
                vmAddCoupons.formData.sale.is_money = false;
                vmAddCoupons.formData.sale.is_percent = true;
                vmAddCoupons.formData.sale.money_value = "";
            }
        }

        function addManyCoupon() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/admin-coupon/view/client/popup/add-many-coupon/add-many-coupon.html',
                controller: 'popupGenaratorCodeCtrl',
                resolve: {
                    data: function () {
                        return angular.copy({});
                    }
                }
            });

            modalInstance.result.then(function (resp) {
                vmAddCoupons.formData.code = resp.code;
                vmAddCoupons.tmp_code_group = resp.code_group;
            }, function () {
            });
        }

        function createCodeGroup() {

        }


        //End Ctrl
    }



    var resolve = {
        /* @ngInject */
        preload: function (bzPreloadSvc) {
            return bzPreloadSvc.load([]);
        }
    };

    return {
        resolve: resolve
    };
})();