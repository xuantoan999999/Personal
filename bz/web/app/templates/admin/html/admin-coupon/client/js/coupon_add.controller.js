'use strict';

// Coupons controller
angular.module('coupons').controller('CouponAddController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', '$window', 'Authentication', 'Coupons', 'Orders', 'Option', 'Notice', '$timeout', 'localStorageService',

    function ($rootScope, $scope, $log, $stateParams, $location, $window, Authentication, Coupons, Orders, Option, Notice, $timeout, localStorageService) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }
        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.Payment_methods = Option.getPaymentMethods();
        $scope.mapVN = Option.mapVN();
        $scope.init = init;
        $scope.create = create;

        $scope.genaratorCode = genaratorCode;
        $scope.limitProduct = limitProduct;
        // CONFIG VALUE
        $scope.imgProducDir = $window.settings.services.webUrl + '/files/product/';
        $scope.dateTimePickerOpt = { singleDatePicker: true };

        $scope.formData = {
            times: 0,
            apply_time: {
                is_apply_time: false,
                start_date: null,
                end_date: null,
            },
            apply_product: {
                is_apply_product: false,
                products: []
            },
            type_coupon: 'PC',
            code: '',
            name: '',
            status: 1,
        }

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

        function init() {
            Orders.initForm({}, function (resp) {
                $scope.listVehicle = resp.vehicles;
                $scope.listAccessories = JSON.parse(JSON.stringify(resp.accessories));
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

        // Create new user
        function create(isValid, type) {
            $scope.submitted = true;
            if (!isValid) return;


            var coupon = new Coupons($scope.formData);
            // Redirect after save
            coupon.$save(function (response) {
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
                Notice.setNotice(errorResponse.data.message, "ERROR");
            });
        };
    }
]);