var couponEditCtrl = (function () {
    'use strict';

    angular
        .module('bzCoupon')
        .controller('couponEditCtrl', couponEditCtrl);

    function couponEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, couponSvc, shippingfeeSvc, productSvc) {
        /* jshint validthis: true */
        var vmEditCoupons = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon', ['add', 'edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditCoupons.lockFOrm = false;
        vmEditCoupons.submitted = false;
        vmEditCoupons.params = $stateParams;
        vmEditCoupons.tmp_code_group = '';
        vmEditCoupons.optionTimePicker = {
            timePicker: true,
            timePickerIncrement: 30,
            locale: {
                format: 'h:mm DD/MM/YYYY'
            }
        };

        // Methods
        vmEditCoupons.upCase = upCase;
        vmEditCoupons.save = update;
        vmEditCoupons.vmEditCoupons = getCoupon;
        vmEditCoupons.randomString = randomString;
        vmEditCoupons.checkSale = checkSale;

        //Init
        getCoupon();
        getDistrict();
        getListCategory();
        getListProduct();

        function getCoupon() {
            const id = $stateParams.id;
            couponSvc.get(id).then(function (res) {
                vmEditCoupons.formData = res;
                vmEditCoupons.tmp_count = res.count === true ? "1" : "0";
                vmEditCoupons.tmp_sale = res.sale.is_money === true ? "money" : "percent";
                if (vmEditCoupons.formData.type == 'group') {
                    vmEditCoupons.tmp_code_group = vmEditCoupons.formData.code_group.reduce(function (txt, item) {
                        return txt + ',' + item.code;
                    }, '')
                    vmEditCoupons.tmp_code_group = vmEditCoupons.tmp_code_group.substring(1);
                }
            }).catch(function (err) {
                console.error('err', err);
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Sửa phiếu mua hàng',
                        message: 'Lỗi server'
                    }
                });
            });
        };

        function getDistrict() {
            shippingfeeSvc.getAllNoPaging().then(function (resp) {
                vmEditCoupons.district = resp.items;
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Sửa phiếu mua hàng',
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
                    vmEditCoupons.listCategory = resp.items;
                });
        };

        function getListProduct() {
            productSvc.add().then(function (resp) {
                vmEditCoupons.listProduct = resp.productList;
            });
        };

        function upCase() {
            vmEditCoupons.formData.code = vmEditCoupons.formData.code.toUpperCase();
        }

        function update(isValid) {
            vmEditCoupons.submitted = true;
            vmEditCoupons.lockForm = true;
            if (isValid) {
                var arr_code = vmEditCoupons.formData.code.split(',').concat(vmEditCoupons.tmp_code_group.split(','));

                couponSvc.checkIsset({ data: arr_code }, vmEditCoupons.params.id).then(function (resp) {
                    if (resp.isset) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Sửa phiếu mua hàng',
                                message: 'Đã tồn tại mã ' + resp.code
                            }
                        });
                        vmEditCoupons.lockForm = false;
                    }
                    else {
                        couponSvc.update(vmEditCoupons.formData, vmEditCoupons.formData._id).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Sửa phiếu mua hàng',
                                    message: 'Thành công'
                                }
                            });
                            if (vmEditCoupons.formData.type == 'group') {
                                $state.go('coupon-group');
                            }
                            else {
                                $state.go('coupon-list');
                            }
                        }).catch(function (error) {
                            vmEditCoupons.lockForm = false;
                            console.err('error', error);
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Sửa phiếu mua hàng',
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
                    vmEditCoupons.lockForm = false;
                });
            }
            else {
                vmEditCoupons.submitted = true;
                vmEditCoupons.lockForm = false;
            }
        };

        function randomString() {
            var length = 5;
            var chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            vmEditCoupons.formData.code = result;
        }

        function checkSale() {
            if (vmEditCoupons.tmp_sale === "money") {
                vmEditCoupons.formData.sale.is_money = true;
                vmEditCoupons.formData.sale.is_percent = false;
                vmEditCoupons.formData.sale.percent_value = "";
            }
            else {
                vmEditCoupons.formData.sale.is_money = false;
                vmEditCoupons.formData.sale.is_percent = true;
                vmEditCoupons.formData.sale.money_value = "";
            }
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