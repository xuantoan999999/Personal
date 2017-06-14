'use strict';

// Orders controller
angular.module('orders').controller('OrdersAddController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', '$window', 'Authentication', 'Orders', 'Option', 'Notice', '$timeout', 'localStorageService', 'toastr',

    function ($rootScope, $scope, $log, $stateParams, $location, $window, Authentication, Orders, Option, Notice, $timeout, localStorageService, toastr) {

        if (!Authentication.isAdmin) {
            $location.path('signin');
        }

        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.OrderStatuses = Option.getOrderStatuses();
        $scope.Payment_methods = Option.getPaymentMethods();
        $scope.mapVN = Option.mapVN();
        $scope.init = init;
        $scope.create = create;
        $scope.showFormAdd = showFormAdd;
        $scope.onChangeType = onChangeType;
        $scope.onChangeVehicle = onChangeVehicle;
        $scope.onChangeAgent = onChangeAgent;
        $scope.onSelectProduct = onSelectProduct;

        $scope.filterAgent = filterAgent;

        $scope.addProduct = addProduct;
        $scope.removeProduct = removeProduct;

        $scope.imgProducDir = $window.settings.services.webUrl + '/files/product/';

        $scope.formData = {
            customer_info: {
                customer: null,
                name: '',
                phone: '',
                email: '',
            },
            shipping_info: {
                agent: null,
                name: '',
                email: '',
                phone: '',
                address: '',
                province: '',
                district: '',
            },
            products: [],
            coupon: {
                id: null,
                code: '',
                name: '',
                value: 0
            },
            payment_method: 'COD',
            type: 'XE',
            status: 'NEW',
            total: 0,
            total_pay: 0,
            total_deposit: 0,
            total_extant: 0
        }

        $scope.tmpData = {
            vehicle: {
                id: null,
                object: null,
                color_index: 0
            },
            products: [],
            formAddProduct: {
                product: '',
                qty: 1,
                price: 0,
                total: 0
            }
        }

        function init() {
            Orders.initForm({}, function (resp) {
                $scope.listVehicle = resp.vehicles;
                $scope.listAccessories = JSON.parse(JSON.stringify(resp.accessories));
                $scope.Accessories = JSON.parse(JSON.stringify(resp.accessories));
                $scope.listUser = resp.users;
                $scope.listCoupon = resp.coupons;
                $scope.listAgent = resp.agents;
            });
        }

        function showLoading() {
            $scope.isLoading = true;
        }

        function showFormAdd(value) {
            $scope.showFormAddProduct = value;
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

        function onChangeVehicle() {
            if ($scope.formData.type = 'XE') {
                var product = $scope.listVehicle.find(function (elm) {
                    return elm._id == $scope.tmpData.vehicle.id;
                });
                if (product) {
                    $scope.tmpData.vehicle.object = product;
                    var item = {
                        product: product._id,
                        qty: 1,
                        price: product.price_user,
                        total: product.price_user,
                    }
                    $scope.formData.products.push(JSON.parse(JSON.stringify(item)));
                    $scope.formData.total = product.price_user;
                    $scope.formData.total_pay = product.price_user;
                    $scope.formData.total_deposit = product.deposit;

                    $scope.tmpData.vehicle.color_index = 0;
                };
            }
        }

        function onSelectProduct() {
            if ($scope.tmpData.formAddProduct.product) {
                var product = $scope.Accessories.find(function (item) {
                    return item._id == $scope.tmpData.formAddProduct.product;
                });
                if (product) {
                    $scope.tmpData.formAddProduct.price = product.price_user;
                }
            }
        }

        function addProduct() {
            if ($scope.tmpData.formAddProduct.product != null && $scope.tmpData.formAddProduct.qty > 0 && $scope.tmpData.formAddProduct.price > 0) {
                var product = null;
                $scope.Accessories.forEach(function (item, index) {
                    if (item._id == $scope.tmpData.formAddProduct.product) {
                        product = item;
                        $scope.Accessories.splice(index, 1);
                    }
                });
                if (product) {
                    $scope.tmpData.formAddProduct.total = $scope.tmpData.formAddProduct.qty * $scope.tmpData.formAddProduct.price;
                    $scope.formData.products.push(JSON.parse(JSON.stringify($scope.tmpData.formAddProduct)));
                    $scope.tmpData.products.push(JSON.parse(JSON.stringify(product)));

                    // Tinh tiền
                    setTotalPay();
                    // Reset current form data
                    angular.extend($scope.tmpData.formAddProduct, { product: '', qty: 1, price: 0, total: 0 });
                    showFormAdd(false);
                }
            }
        }

        function removeProduct(productID, index) {
            if (productID && index < $scope.formData.products.length) {
                let product = $scope.listAccessories.find(item => {
                    return '' + item._id == '' + productID;
                });
                if (product) {
                    $scope.Accessories.push(JSON.parse(JSON.stringify(product)));
                    $scope.formData.products.splice(index, 1);
                }
                setTotalPay();
            }
        }

        function onChangeAgent() {
            var agent = $scope.listAgent.find(function (item) {
                return item._id == $scope.formData.shipping_info.agent;
            });
            if (agent) {
                var info_agent = {
                    name: agent.name,
                    email: agent.email,
                    phone: agent.phone,
                    address: agent.address,
                    province: agent.province,
                    district: agent.district
                }
                angular.extend($scope.formData.shipping_info, info_agent);
            }
            else {
                Notice.setNotice('Something wrong', "ERROR");
            }
        }

        function setTotalPay() {
            let total_pay = 0;
            $scope.formData.products.forEach((item, index) => {
                item.total = item.qty * item.price;
                total_pay += item.total;
            });
            $scope.formData.total_pay = total_pay;
            if ($scope.formData.type == 'PT') {
                $scope.formData.total_deposit = total_pay;
                $scope.formData.total_extant = 0;
            }
        }

        function filterAgent() {
            $scope.formData.shipping_info.agent = null;
            if ($scope.formData.shipping_info.province != '') {
                Orders.filterAgent({
                    province: $scope.formData.shipping_info.province,
                    district: $scope.formData.shipping_info.district != '' ? $scope.formData.shipping_info.district : null
                }, function (res) {
                    if (res.success) {
                        $scope.listAgent = res.data;
                    }
                });
            }
        }

        function gotoList() {
            $location.path('orders');
        }

        // Create new user
        function create(isValid, type) {
            $scope.submitted = true;
            if (!isValid) return;

            if ($scope.formData.type == 'XE') {
                $scope.formData.total_extant = $scope.formData.total_pay - $scope.formData.total_deposit;
            }
            var order = new Orders($scope.formData);
            // Redirect after save
            order.$save(function (response) {
                if (response._id) {
                    if (type == 'save&list') {
                        $scope.gotoList();
                    } else {
                        $location.path('orders/' + response._id + '/edit');
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