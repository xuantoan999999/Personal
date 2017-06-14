'use strict';

// Orders controller
angular.module('orders').controller('OrdersEditController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', 'Authentication', 'Orders', 'Option', 'Notice', '$timeout', 'localStorageService', '$window',

    function ($rootScope, $scope, $log, $stateParams, $location, Authentication, Orders, Option, Notice, $timeout, localStorageService, $window) {

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
        $scope.update = update;
        $scope.showFormEdit = showFormEdit;
        $scope.onChangeType = onChangeType;
        $scope.onChangeVehicle = onChangeVehicle;
        $scope.onChangeAgent = onChangeAgent;
        $scope.onSelectProduct = onSelectProduct;

        $scope.filterAgent = filterAgent;

        $scope.addProduct = addProduct;
        $scope.removeProduct = removeProduct;

        $scope.imgProducDir = $window.settings.services.webUrl + '/files/product/';
        $scope.idOrder = $stateParams.orderId

        $scope.tmpData = {
            vehicle: {
                id: null,
                object: null,
                color_index: 0
            },
            products: [],
            formEditProduct: {
                product: '',
                qty: 1,
                price: 0,
                total: 0
            }
        }

        function init() {
            Orders.initForm({ id: $scope.idOrder }, function (resp) {
                $scope.listVehicle = resp.vehicles;
                $scope.listAccessories = JSON.parse(JSON.stringify(resp.accessories));
                $scope.Accessories = JSON.parse(JSON.stringify(resp.accessories));
                $scope.listUser = resp.users;
                $scope.listCoupon = resp.coupons;
                $scope.listAgent = resp.agents;
                $scope.formData = JSON.parse(JSON.stringify(resp.order));

                // Set form data for order Phụ tùng
                if ($scope.formData.type == 'PT') {
                    resp.order.products.forEach((item, index) => {
                        $scope.formData.products[index].product = item.product._id;
                        $scope.tmpData.products.push(item.product);
                    })
                }
                // Set form data for order XE
                else {
                    $scope.formData.products[0].product = resp.order.products[0].product._id
                    $scope.tmpData.vehicle.id = resp.order.products[0].product._id;
                    $scope.tmpData.vehicle.object = resp.order.products[0].product;
                }
            });
        }

        function showLoading() {
            $scope.isLoading = true;
        }

        function showFormEdit(value) {
            $scope.showFormEditProduct = value;
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
                    var productOrder = [{
                        product: product._id,
                        qty: 1,
                        price: product.price_user,
                        total: product.price_user,
                    }]
                    $scope.formData.products = (JSON.parse(JSON.stringify(productOrder)));
                    $scope.formData.total = product.price_user;
                    $scope.formData.total_pay = product.price_user;
                    $scope.formData.total_deposit = product.deposit;
                };
            }
        }

        function onSelectProduct() {
            if ($scope.tmpData.formEditProduct.product) {
                var product = $scope.Accessories.find(function (item) {
                    return item._id == $scope.tmpData.formEditProduct.product;
                });
                if (product) {
                    $scope.tmpData.formEditProduct.price = product.price_user;
                }
            }
        }

        function addProduct() {
            if ($scope.tmpData.formEditProduct.product != null && $scope.tmpData.formEditProduct.qty > 0 && $scope.tmpData.formEditProduct.price > 0) {
                var product = null;
                $scope.Accessories.forEach(function (item, index) {
                    if (item._id == $scope.tmpData.formEditProduct.product) {
                        product = item;
                        $scope.Accessories.splice(index, 1);
                    }
                });
                if (product) {
                    $scope.tmpData.formEditProduct.total = $scope.tmpData.formEditProduct.qty * $scope.tmpData.formEditProduct.price;
                    $scope.formData.products.push(JSON.parse(JSON.stringify($scope.tmpData.formEditProduct)));
                    $scope.tmpData.products.push(JSON.parse(JSON.stringify(product)));

                    // Tinh tiền
                    setTotalPay();
                    // Reset current form data
                    angular.extend($scope.tmpData.formEditProduct, { product: '', qty: 1, price: 0, total: 0 });
                    showFormEdit(false);
                }
            }
        }

        function removeProduct(productID, index) {
            if (productID && index < $scope.formData.products.length) {
                let product = $scope.tmpData.products.find(item => {
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
            // Reset agent selected
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
        function update(isValid, type) {
            $scope.submitted = true;
            if (!isValid) return;

            if ($scope.formData.type == 'XE') {
                $scope.formData.total_extant = $scope.formData.total_pay - $scope.formData.total_deposit;
            }
            var order = new Orders($scope.formData);
            // Redirect after save
            order.$update(function (response) {
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