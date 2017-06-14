'use strict';

// Coupons controller
angular.module('coupons')
.controller('CouponEditController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', '$window', 'Authentication', 'Coupons', 'Orders', 'Option', 'Notice', '$timeout', 'localStorageService', 'toastr',

    function ($rootScope, $scope, $log, $stateParams, $location, $window, Authentication, Coupons, Orders, Option, Notice, $timeout, localStorageService, toastr) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.Payment_methods = Option.getPaymentMethods();
        $scope.mapVN = Option.mapVN();
        $scope.init = init;
        $scope.update = update;

        $scope.genaratorCode = genaratorCode;
        $scope.limitProduct = limitProduct;
        // CONFIG VALUE
        $scope.imgProducDir = $window.settings.services.webUrl + '/files/product/';
        $scope.dateTimePickerOpt = { singleDatePicker: true };

        $scope.tmpData = {
            limitProductType: '',
        }

        function limitProduct(type) {
            $scope.tmpData.limitProductType = type;
            $scope.formData.apply_product.products = [];
        }

        function genaratorCode() {
            var length = 6;
            var chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            $scope.formData.code = result;
        }

        function intersection(a, b) {
            var setA = new Set(a);
            var setB = new Set(b);
            var intersection = new Set([...setA].filter(x => setB.has(x)));
            return Array.from(intersection);
        }

        function init() {
            Orders.initForm({}, function (resp) {
                $scope.listVehicle = resp.vehicles;
                $scope.listAccessories = JSON.parse(JSON.stringify(resp.accessories));

                Coupons.get({ couponId: $stateParams.couponId }, function (resp) {
                    $scope.formData = resp;
                    if (resp.apply_product.is_apply_product) {
                        let listIdVehicle = $scope.listVehicle.map(item => {
                            return item._id
                        });

                        if (intersection(resp.apply_product.products, listIdVehicle).length > 0) {
                            $scope.tmpData.limitProductType = 'XE';
                        }
                        else {
                            $scope.tmpData.limitProductType = 'PT';
                        }
                    }
                }, function (err) {
                    console.log('error get data', err);
                    toastr.error("Tải dữ liệu khuyến mãi không thành công!", "Hãy thử lại");
                });
            });



        }

        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }


        function onChangeType() {
            $scope.formData.products = [];
            $scope.formData.total = 0;
            $scope.formData.total_pay = 0;
            $scope.formData.total_deposit = 0;
            $scope.formData.total_extant = 0;

            $scope.Accessories = $scope.listAccessories;
        };


        function gotoList() {
            $location.path('coupons');
        }

        // update new user
        function update(isValid, type) {
            $scope.submitted = true;
            if (!isValid) return;


            var coupon = new Coupons($scope.formData);
            // Redirect after save
            coupon.$update(function (response) {
                if (response._id) {
                    if (type == 'save&list') {
                        $scope.gotoList();
                    } else {
                        $location.path('coupons/' + response._id + '/edit');
                        $scope.name = '';
                        $scope.submitted = false;
                        // $scope.succes = 'Save user success!';
                    }
                } else {
                    Notice.setNotice(response.message, "ERROR");
                }

            }, function (errorResponse) {
                toastr.error(errorResponse.message, "Thất bại");
                // Notice.setNotice(errorResponse.data.message, "ERROR");
            });
        };
    }
]);